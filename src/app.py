import os
from flask import Flask, render_template,session,request
import os
app = Flask(__name__)

app.secret_key = "udon"

@app.route('/')
def index():
    session["sound"] = 0
    session["language"] = 'Japanese'
    print(session["sound"])
    return render_template("top.html", pageTitle='TopPage', css='top', sound=session["sound"], language=session["language"])


@app.route("/top", methods=["POST"])
def move_top():
    return render_template("top.html", pageTitle='TopPage', css='top', sound=session["sound"], language=session["language"])


@app.route('/face', methods=['POST'])
def face():
    sound = request.form.getlist("sound")
    session["sound"]=len(sound)
    language = request.form.get("language")
    session["language"] = language
    print("sound")
    print(session["sound"])
    print("language")
    print(session["language"])
    return render_template("face.html", pageTitle='FacePage', css='face', sound=session["sound"], language=session["language"])


@app.route('/faceTest')
def face_test():
    return render_template("test_face.html", pageTitle='FaceTestPage', css='face_test', sound=session["sound"], language=session["language"])


@app.route('/emotion')
def emotion_test():
    return render_template("test_emotion.html", sound=session["sound"], language=session["language"])


if __name__ == '__main__':
    app.run()
