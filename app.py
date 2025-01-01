from flask import jsonify, render_template, Flask
import json

app = Flask(__name__, static_folder="static", template_folder="templates")

@app.route("/")
def main_thread():
    with open("data.json", "r"):
        data = json.loads("data.json")
    return render_template("home.html", data=data)

if __name__=="__main__":
    app.run()