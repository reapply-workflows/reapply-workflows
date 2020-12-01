from flask import Flask
from flask_cors import CORS

from ..inference_core.core import hello
from .routes.datasetRoutes import datasetRoute, listAllDatasets

app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True
app.register_blueprint(datasetRoute)


@app.route("/")
def index():
    return f"<div>{hello()}<div>"


@app.route("/hello", methods=["GET"])
def helloWorld():
    return hello()


def start_server():
    listAllDatasets()
    app.run()