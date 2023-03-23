class AnswersController < ApplicationController
    require 'csv'
    require 'matrix'
    require 'open-uri'
    require 'string/similarity'
    require 'http'

    def findAnswer
        question = params[:question]
        embeddings = loadEmbeddings
        mostSimilarMatch = findMostSimilarSentence(question, embeddings)
        answer = checkCacheFetchAnswer(mostSimilarMatch)
        render json: { answer: answer }
    end

    def loadEmbeddings
        CSV.read(Rails.root.join('storage', 'manuscript.csv'), headers: true)
    end

    def findMostSimilarSentence(question, embeddings)
        questionEmbedding = fetchQueryEmbedding(question)
        similarities = {}

        embeddings.each do |embedding|
            similarity = String::Similarity.cosine(questionEmbedding, Vector[*embedding[1..-1].map(&:to_f)].to_a)
            similarities[embedding['title']] = similarity
        end

        mostSimilarMatch = similarities.max_by { |_, similarity| similarity }.first
        mostSimilarMatch
    end

    def fetchQueryEmbedding(text)
        apiKey = ENV['OPENAI_API_KEY']
        headers = { 'Content-Type' => 'application/json', 'Authorization' => "Bearer #{apiKey}" }
        url = "https://api.openai.com/v1/embeddings"
        body = { input: text, model: 'text-embedding-ada-002' }.to_json
        response = HTTP.post(url, headers:headers, body:body)
        data = JSON.parse(response.to_s)
        data['data'][0]['embedding']
    end

    def checkCacheFetchAnswer(mostSimilarMatch)
        cacheKey = "answer_#{mostSimilarMatch.hash}"
        cachedAnswer = Rails.cache.fetch(cacheKey)

        if cachedAnswer
            return cachedAnswer
        else 
            apiKey = ENV['OPENAI_API_KEY']
            headers = { 'Content-Type' => 'application/json', 'Authorization' => "Bearer #{apiKey}" }
            url = "https://api.openai.com/v1/completions"
            body = {
                model: 'text-davinci-003',
                prompt: "Question: #{params[:question]}\nReference Text:#{mostSimilarMatch}\nAnswer:",
                max_tokens: 50,
                n: 1,
                stop: "\n"
                temperature: 0.0
            }.to_json
            response = HTTP.post(url, headers: headers, body: body)
            data = JSON.parse(response.to_s)
            answer = data['choices'].first['text'].strip
            Rails.cache.write(cacheKey, answer)
        end
    end
end
