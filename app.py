from flask import jsonify, render_template, Flask, request
import json

app = Flask(__name__, static_folder="static", template_folder="templates")

@app.route("/")
def main_thread():
    with open("data.json", "r") as j:
        data = json.load(j)
    return render_template("home.html", data=data)

@app.route("/new_post", methods=["POST"])
def add_post():
    data = request.get_json()
    print("new post:",data)
    with open("data.json","r") as j:
        old_data = json.load(j)
    idx=data["parent_index"]
    if idx == -1:
        old_data["primary"].insert(0,data)
    else:
        old_data["primary"][int(idx)]["replies"].insert(0,data)
    with open("data.json", "w") as j:
        json.dump(old_data, j)
    return "success"

if __name__=="__main__":
    app.run()