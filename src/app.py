import os
from flask import Flask, render_template,session,request
import os
app = Flask(__name__)

app.secret_key = "udon"

@app.route('/')
def index():
    session["sound"] = 0
    print(session["sound"])
    return render_template("top.html", pageTitle='TopPage', css='top',sound=session["sound"])


@app.route("/top", methods=["POST"])
def move_top():
    return render_template("top.html", pageTitle='TopPage', css='top',sound=session["sound"])


@app.route('/face', methods=['POST'])
def face():
    sound = request.form.getlist("sound")
    session["sound"]=len(sound)
    print("sound")
    print(session["sound"])
    return render_template("face.html", pageTitle='FacePage', css='face',sound=session["sound"])


@app.route('/faceTest')
def face_test():
    return render_template("test_face.html", pageTitle='FaceTestPage', css='face_test',sound=session["sound"])


@app.route('/emotion')
def emotion_test():
    return render_template("test_emotion.html",sound=session["sound"])


if __name__ == '__main__':
    app.run()
