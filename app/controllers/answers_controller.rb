class AnswersController < ApplicationController
    require 'csv'
    require 'matrix'
    require 'open-uri'
    require 'string/similarity'
    require 'http'

    def index
    end

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

    def vecorCosineSimilarity(a, b)
        dotProduct = a.zip(b).map { |x, y| x * y }.sum
        aNorm = Math.sqrt(a.map { |x| x**2 }.sum)
        bNorm = Math.sqrt(b.map { |x| x**2 }.sum)
        cosineSimilarity = dotProduct / (aNorm * bNorm)
        cosineSimilarity
    end

    def findMostSimilarSentence(question, embeddings)
        questionEmbedding = fetchQueryEmbedding(question)
        similarities = {}

        embeddings.each do |embedding|
            similarity = vecorCosineSimilarity(questionEmbedding, embedding[1..-1].map(&:to_f))
            similarities[embedding['content']] = similarity
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
        
        if data['data'] && data['data'][0] && data['data'][0]['embedding']
            data['data'][0]['embedding']
        else 
            puts "!!Error: Unexpected response while fethcing embedding for '#{text}'. Resp: #{data.inspect}"
            return nil
        end
    end

    def checkCacheFetchAnswer(mostSimilarMatch)
        cacheKey = "answer_#{mostSimilarMatch.hash}"
        cachedAnswer = Rails.cache.fetch(cacheKey)

        if cachedAnswer
            console.log(`\nHitting cache for answer: #{cachedAnswer}`)
            return cachedAnswer
        else 
            embeddings = loadEmbeddings
            referenceText = embeddings.find { |embedding| embedding['content'] == mostSimilarMatch }['content']
            apiKey = ENV['OPENAI_API_KEY']
            headers = { 'Content-Type' => 'application/json', 'Authorization' => "Bearer #{apiKey}" }
            url = "https://api.openai.com/v1/completions"
            body = {
                model: 'text-davinci-003',
                prompt: "Question: #{params[:question]}\nReference Text:#{referenceText}\nAnswer:",
                max_tokens: 150,
                n: 1,
                stop: "\n",
                temperature: 0
            }.to_json
            response = HTTP.post(url, headers: headers, body: body)
            data = JSON.parse(response.to_s)

            # Enable for debugging
            # puts "\n_____debugging____"
            # puts "\nBody of request: #{body}"
            # puts "\nResponse from OpenAI: #{data}"

            answer = data['choices'].first['text'].strip
            Rails.cache.write(cacheKey, answer)
            return answer
        end
    end
end
