#scripts/processPdf.rb
require('pdf-reader')
require('http')
require('dotenv')
require('csv')
require('json')

Dotenv.load

def loadPdf(pdfFilepath)
    raise "PDF file not found" unless File.exists?(pdfFilepath)
    PDF::Reader.new(pdfFilepath)
end

def extractPages(pdfReader)
  pdfReader.pages.map.with_index(1) do |page, index|
    content = page.text.encode("UTF-8", invalid: :replace, undef: :replace, replace: '').gsub(/[ ]{2,}/, ' ')
    puts ">>Extracting content from page #{index}..."
    { title: "Page #{index}", content: content }
  end
end

def splitSentences(pages)
    pages.map do |page|
      sentences = page[:content].split(/(?<=[.!?])\s+(?=[A-Z])/)
      sentences.map.with_index(1) do |sentence, index|
        { title: "#{page[:title]}_Sentence_#{index}", content: sentence }
      end
    end.flatten
end

def fetchEmbeddings(sentences)
    apiKey = ENV["OPENAI_API_KEY"]
    headers = { 'Content-Type' => 'application/json', 'Authorization' => "Bearer #{apiKey}" }
    url = 'https://api.openai.com/v1/embeddings'

    sentences.map do |sentence|
        puts ">>Fetching embedding for #{sentence[:title]}:#{sentence[:content]}..."
        body = { input: sentence[:content], model: 'text-embedding-ada-002' }.to_json
        response = HTTP.post(url, headers: headers, body: body)
        data = JSON.parse(response.to_s)

        if data['data'] && data['data'][0] && data['data'][0]['embedding']
            { title: sentence[:title], embedding: data['data'][0]['embedding'] }
        else
            puts "!! Error: Unexpected response from #{sentence[:title]}. Response: #{data.inspect}"
            { title: sentence[:title], embedding: nil}
        end
    end
end

def storeEmbeddings(embeddings, outputPath)
    CSV.open(outputPath, 'w') do |csv|
        csv << ['title'] + (0...4096).to_a
        embeddings.each do |embedding|
            if embedding[:embedding].nil?
                puts "!! Skipping storing embedding for #{embedding[:title]} due to an error in fetching."
              else
                puts ">> Storing embedding for #{embedding[:title]}..."
                csv << [embedding[:title]] + embedding[:embedding]
              end
        end
    end
end

pdfFilepath = 'storage/canada-tax-code-sample.pdf'
sentencesCsvPath = 'storage/manuscript.sentences.csv'
embeddingsCsvPath = 'storage/manuscript.csv'

puts ">Loading PDF..."
pdfReader = loadPdf(pdfFilepath)

puts ">Extracting pages..."
pages = extractPages(pdfReader)

puts ">Splitting into sentences..."
sentences = splitSentences(pages)

puts ">Storing sentences content..."
CSV.open(sentencesCsvPath, 'w', headers:['title', 'content'], write_headers: true) do |csv|
    sentences.each { |sentence| csv << [sentence[:title], sentence[:content]] }
end

puts ">Fetching embeddings..."
embeddings = fetchEmbeddings(sentences)

puts ">Storing embeddings..."
storeEmbeddings(embeddings, embeddingsCsvPath)

puts ">Process completed!"