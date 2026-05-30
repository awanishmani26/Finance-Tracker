# from flask import Flask, request, jsonify
# import joblib
# import re
# import nltk
# from nltk.stem import WordNetLemmatizer

# # ─────────────────────────────────────────────────────────────
# # DOWNLOAD NLTK DATA (RUN FIRST TIME ONLY)
# # ─────────────────────────────────────────────────────────────
# # nltk.download('wordnet')
# # nltk.download('omw-1.4')

# app = Flask(__name__)

# # ─────────────────────────────────────────────────────────────
# # LOAD TRAINED ML MODEL
# # ─────────────────────────────────────────────────────────────
# model = joblib.load("model.pkl")

# lemmatizer = WordNetLemmatizer()

# # ─────────────────────────────────────────────────────────────
# # ICON MAP
# # ─────────────────────────────────────────────────────────────
# icon_map = {
#     "Salary": "💰",
#     "Freelance": "🧑‍💻",
#     "Bonus": "🎁",
#     "Passive Income": "📈",
#     "Investment": "📊",
#     "Cashback": "💵",
#     "Gift": "🎉",
#     "Refund": "🔄",
#     "Family": "👨‍👩‍👧‍👦",
#     "Money Back": "↩️",
#     "Rent": "🏠",
#     "Bills": "🧾",
#     "Food": "🍔",
#     "Transport": "🚗",
#     "Entertainment": "🎬",
#     "Shopping": "🛍️",
#     "Recharge": "📱",
#     "Medical": "💊",
#     "Fitness": "🏋️",
#     "Education": "📚",
#     "EMI": "🏦",
#     "Travel": "✈️",
#     "Personal Care": "🧴",
#     "Subscription": "📋",
#     "Treat": "🎂",
#     "Lent": "🤝",
#     "Family Support": "❤️",
# }

# # ─────────────────────────────────────────────────────────────
# # NLP PREPROCESSING
# # ─────────────────────────────────────────────────────────────
# def preprocess(text):
#     text = text.lower()

#     # Remove special characters
#     text = re.sub(r"[^a-zA-Z0-9\s]", "", text)

#     # Tokenize
#     tokens = text.split()

#     # Lemmatization
#     tokens = [lemmatizer.lemmatize(word) for word in tokens]

#     return " ".join(tokens)


# # ─────────────────────────────────────────────────────────────
# # PREDICTION API
# # ─────────────────────────────────────────────────────────────
# @app.route("/predict", methods=["POST"])
# def predict():
#     try:
#         data = request.get_json()
#         raw_text = data.get("text", "")

#         if not raw_text:
#             return jsonify({
#                 "error": "Text input is required"
#             }), 400

#         # NLP preprocessing
#         clean_text = preprocess(raw_text)

#         # ML prediction
#         prediction = model.predict([clean_text])[0]

#         # Expected format:
#         # expense|Food
#         txn_type, category = prediction.split("|")

#         # Amount extraction
#         amounts = re.findall(r'\d+', raw_text)
#         amount = int(amounts[0]) if amounts else 0

#         # Icon
#         icon = icon_map.get(category, "💸")

#         return jsonify({
#             "type": txn_type,
#             "category": category,
#             "amount": amount,
#             "icon": icon,
#             "input": raw_text
#         })

#     except Exception as e:
#         return jsonify({
#             "error": str(e)
#         }), 500


# # ─────────────────────────────────────────────────────────────
# # RUN SERVER
# # ─────────────────────────────────────────────────────────────
# if __name__ == "__main__":
#     app.run(port=8000, debug=True)





from flask import Flask, request, jsonify
import joblib
import re
import nltk
from nltk.stem import WordNetLemmatizer

app = Flask(__name__)

# LOAD MODEL
model = joblib.load("model.pkl")

lemmatizer = WordNetLemmatizer()

# HOME ROUTE
@app.route("/")
def home():
    return "NLP Service Running Successfully"

# ICON MAP
icon_map = {
    "Salary": "💰",
    "Freelance": "🧑‍💻",
    "Bonus": "🎁",
    "Passive Income": "📈",
    "Investment": "📊",
    "Cashback": "💵",
    "Gift": "🎉",
    "Refund": "🔄",
    "Family": "👨‍👩‍👧‍👦",
    "Money Back": "↩️",
    "Rent": "🏠",
    "Bills": "🧾",
    "Food": "🍔",
    "Transport": "🚗",
    "Entertainment": "🎬",
    "Shopping": "🛍️",
    "Recharge": "📱",
    "Medical": "💊",
    "Fitness": "🏋️",
    "Education": "📚",
    "EMI": "🏦",
    "Travel": "✈️",
    "Personal Care": "🧴",
    "Subscription": "📋",
    "Treat": "🎂",
    "Lent": "🤝",
    "Family Support": "❤️",
}

# PREPROCESS FUNCTION
def preprocess(text):
    text = text.lower()

    text = re.sub(r"[^a-zA-Z0-9\s]", "", text)

    tokens = text.split()

    tokens = [lemmatizer.lemmatize(word) for word in tokens]

    return " ".join(tokens)

# PREDICT ROUTE
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        raw_text = data.get("text", "")

        if not raw_text:
            return jsonify({
                "error": "Text input is required"
            }), 400

        clean_text = preprocess(raw_text)

        prediction = model.predict([clean_text])[0]

        txn_type, category = prediction.split("|")

        amounts = re.findall(r'\d+', raw_text)

        amount = int(amounts[0]) if amounts else 0

        icon = icon_map.get(category, "💸")

        return jsonify({
            "type": txn_type,
            "category": category,
            "amount": amount,
            "icon": icon,
            "input": raw_text
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

# RUN SERVER
if __name__ == "__main__":
    app.run(port=8000, debug=True)