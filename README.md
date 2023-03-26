# Book QA #

* The goal was to rebuild an 'ask anything related to my book' application originally written in Python, as a Rails + React application.

## How it works ##
The application functions as follows:

* The user uploads a PDF document (ideally the book in question), which is then converted to text.
* The text is split into sentences (though the creator is debating this step, as they found better results with larger chunks of text in their sandboxing).
* Each sentence is converted to embeddings using OpenAI's embedding API.
* The embeddings are stored in a .csv file.
* When the user asks a question, the question sentence is converted into embeddings using the same API.
* The application finds the maximum cosine similarity match between the question and the previous .csv of PDF document's embeddings.
* It checks the cache to see if the answer exists, otherwise it prompts the DaVinci-003 model to answer the question by providing the question text and context (based on the earlier max cosine matching), then saving the answer into cache.
* There exists an 'I'm feeling lucky' feature which will fetch a random question from an array of questions.
* The application also has a fun feature that uses the browser's speech API to read the answer.

## Other information ##

* Ruby version == 3.0.0

## Deployment instructions ##
* If you want to run script for converting PDF to embeddings, store PDF in 'storage' directory and set env var 'PDF_FILEPATH' i.e. PDF_FILEPATH=storage/essay-guide.pdf
* Set env var OPENAI_API_KEY
* foreman start -f Procfile.dev


