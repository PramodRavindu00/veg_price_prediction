from flask import Flask

app = Flask(__name__)

@app.route('/')
def predict():
    return "<h1>Flask App is running</h1>"

if __name__ == "__main__":
    app.run(debug=True, port=5001)