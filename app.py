# https://www.youtube.com/watch?v=a37BL0stIuM
from flask import Flask, render_template, request, jsonify
# from questionAnswer3 import elastic_doc,detect_language
# from haystack.document_stores import ElasticsearchDocumentStore, InMemoryDocumentStore
# from haystack.utils import clean_wiki_text, convert_files_to_docs
import warnings
from utils import generate_text
# from googletrans import Translator


warnings.filterwarnings("ignore")


app = Flask(__name__)

@app.get("/")
def index_get():
    return render_template("base.html")


@app.post("/predict")
def predict():
    text = request.get_json().get("message")
    source = request.get_json().get("source")
    
    if source == 'ecommerceTextField':
        model2_path = "custom_q_and_a"
        # sequence2 = "[Q] Do you offer international shipping and how can I track my order? "
        max_len = 100
        concate_text = "[Q] "+ text
        question, answer, formatted_text = generate_text(model2_path,concate_text,max_len)
        message = {"answer": answer}
        return jsonify(message)
    elif source == 'malaysianQATextField':
        message = {"answer": "The program havent done yet"}
        return jsonify(message)

if __name__=="__main__":
    app.run(debug=True)