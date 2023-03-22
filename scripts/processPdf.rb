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
    pdfReader.pages.map.with_index(1) do |page,index|
        content = page.text.gsub(/\s+/,'')
        puts ">>Extracting content from page #{index}..."
        { title: "Page #{index}", content: content }
    end
end

def fetchEmbeddings(pages)
    apiKey = ENV["OPENAI_API_KEY"]
    headers = { 'Content-Type' => 'application/json', 'Authorization' => "Bearer #{apiKey}" }
    url = 'https://api.openai.com/v1/embeddings'

    pages.map do |page|
        puts ">>Fetching embedding for #{page[:title]}..."
        body = { input: page[:content], model: 'text-embedding-ada-002' }.to_json
        response = HTTP.post(url, headers: headers, body: body)
        data = JSON.parse(response.to_s)

        if data['data'] && data['data'][0] && data['data'][0]['embedding']
            { title: page[:title], embedding: data['data'][0]['embedding'] }
        else
            puts "!! Error: Unexpected response from #{page[:title]}. Response: #{data.inspect}"
            { title: page[:title], embedding: nil}
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
                puts "!! Storing embedding for #{embedding[:title]}..."
                csv << [embedding[:title]] + embedding[:embedding]
              end
        end
    end
end

pdfFilepath = 'storage/canada-tax-code-sample.pdf'
pagesCsvPath = 'storage/manuscript.pages.csv'
embeddingsCsvPath = 'storage/manuscript.csv'

puts ">Loading PDF..."
pdfReader = loadPdf(pdfFilepath)

puts ">Extracting pages..."
pages = extractPages(pdfReader)

puts ">Storing pages content..."
CSV.open(pagesCsvPath, 'w', headers:['title', 'content'], write_headers: true) do |csv|
    pages.each { |page| csv << [page[:title], page[:content]] }
end

puts ">Fetching embeddings..."
embeddings = fetchEmbeddings(pages)

puts ">Storing embeddings..."
storeEmbeddings(embeddings, embeddingsCsvPath)

puts ">Process completed!"