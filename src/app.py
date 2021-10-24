import os
from flask import Flask, render_template
import os
app = Flask(__name__)

@app.route('/')
def index():
    return render_template("top.html", pageTitle='TopPage', css='top')


@app.route('/face')
def face_test():
    return render_template("test_face.html")


@app.route('/emotion')
def emotion_test():
    return render_template("test_emotion.html")

if __name__ == '__main__':
    app.run()
