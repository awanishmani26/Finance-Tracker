# from flask import Flask, request, jsonify
# import joblib
# import re

# app = Flask(__name__)

# model = joblib.load("model.pkl")

# icon_map = {
#     "Salary":         "💰",
#     "Freelance":      "🧑‍💻",
#     "Bonus":          "🎁",
#     "Passive Income": "📈",
#     "Investment":     "📊",
#     "Cashback":       "💵",
#     "Gift":           "🎉",
#     "Refund":         "🔄",
#     "Family":         "👨‍👩‍👧‍👦",
#     "Money Back":     "↩️",
#     "Rent":           "🏠",
#     "Bills":          "🧾",
#     "Food":           "🍔",
#     "Transport":      "🚗",
#     "Entertainment":  "🎬",
#     "Shopping":       "🛍️",
#     "Recharge":       "📱",
#     "Medical":        "💊",
#     "Fitness":        "🏋️",
#     "Education":      "📚",
#     "EMI":            "🏦",
#     "Travel":         "✈️",
#     "Personal Care":  "🧴",
#     "Subscription":   "📋",
#     "Treat":          "🎂",
#     "Lent":           "🤝",
#     "Family Support": "❤️",
# }

# @app.route("/predict", methods=["POST"])
# def predict():

#     text = request.json["text"]

#     prediction = model.predict([text])[0]

#     txn_type, category = prediction.split("|")

#     amount = re.findall(r'\d+', text)

#     amount = int(amount[0]) if amount else 0

#     icon = icon_map.get(category, "💸")

#     return jsonify({
#         "type": txn_type,
#         "category": category,
#         "amount": amount,
#         "icon": icon
#     })

# app.run(port=5000)

from flask import Flask, request, jsonify
import joblib
import re
import nltk
from nltk.stem import WordNetLemmatizer

app = Flask(__name__)
model = joblib.load("model.pkl")
lemmatizer = WordNetLemmatizer()

# ─────────────────────────────────────────────────────────────
# ICON MAP
# ─────────────────────────────────────────────────────────────
icon_map = {
    "Salary":         "💰",
    "Freelance":      "🧑‍💻",
    "Bonus":          "🎁",
    "Passive Income": "📈",
    "Investment":     "📊",
    "Cashback":       "💵",
    "Gift":           "🎉",
    "Refund":         "🔄",
    "Family":         "👨‍👩‍👧‍👦",
    "Money Back":     "↩️",
    "Rent":           "🏠",
    "Bills":          "🧾",
    "Food":           "🍔",
    "Transport":      "🚗",
    "Entertainment":  "🎬",
    "Shopping":       "🛍️",
    "Recharge":       "📱",
    "Medical":        "💊",
    "Fitness":        "🏋️",
    "Education":      "📚",
    "EMI":            "🏦",
    "Travel":         "✈️",
    "Personal Care":  "🧴",
    "Subscription":   "📋",
    "Treat":          "🎂",
    "Lent":           "🤝",
    "Family Support": "❤️",
}

# ─────────────────────────────────────────────────────────────
# KEYWORD RULES  (checked BEFORE ML model)
# Each tuple: ([keywords], type, category)
# ALL keywords in the list must appear in the text (AND logic)
# More specific rules go first
# ─────────────────────────────────────────────────────────────
KEYWORD_RULES = [

    # ── MONEY BACK (someone returning money you lent) ──
    (["money back"],            "income", "Money Back"),
    (["returned money"],        "income", "Money Back"),
    (["return money"],          "income", "Money Back"),
    (["returned my money"],     "income", "Money Back"),
    (["paid back"],             "income", "Money Back"),
    (["pay back"],              "income", "Money Back"),
    (["money returned"],        "income", "Money Back"),
    (["lent money returned"],   "income", "Money Back"),
    (["recovered money"],       "income", "Money Back"),
    (["recovered dues"],        "income", "Money Back"),
    (["returned loan"],         "income", "Money Back"),
    (["person returned"],       "income", "Money Back"),
    (["got back money"],        "income", "Money Back"),
    (["returned old debt"],     "income", "Money Back"),
    (["wapas kiya"],            "income", "Money Back"),
    (["wapas mila"],            "income", "Money Back"),

    # ── FAMILY INCOME (money received FROM family/friends) ──
    (["mom gave"],              "income", "Family"),
    (["mom sent"],              "income", "Family"),
    (["mom transferred"],       "income", "Family"),
    (["mother gave"],           "income", "Family"),
    (["mother sent"],           "income", "Family"),
    (["mother transferred"],    "income", "Family"),
    (["dad gave"],              "income", "Family"),
    (["dad sent"],              "income", "Family"),
    (["dad transferred"],       "income", "Family"),
    (["father gave"],           "income", "Family"),
    (["father sent"],           "income", "Family"),
    (["father transferred"],    "income", "Family"),
    (["papa sent"],             "income", "Family"),
    (["papa gave"],             "income", "Family"),
    (["parents sent"],          "income", "Family"),
    (["parents gave"],          "income", "Family"),
    (["received from parents"], "income", "Family"),
    (["received from mom"],     "income", "Family"),
    (["received from dad"],     "income", "Family"),
    (["received from mother"],  "income", "Family"),
    (["received from father"],  "income", "Family"),
    (["brother sent"],          "income", "Family"),
    (["brother gave"],          "income", "Family"),
    (["brother transferred"],   "income", "Family"),
    (["bhai ne"],               "income", "Family"),
    (["bhai sent"],             "income", "Family"),
    (["received from brother"], "income", "Family"),
    (["sister sent"],           "income", "Family"),
    (["sister gave"],           "income", "Family"),
    (["sister transferred"],    "income", "Family"),
    (["didi sent"],             "income", "Family"),
    (["received from sister"],  "income", "Family"),
    (["friend sent"],           "income", "Family"),
    (["friend transferred"],    "income", "Family"),
    (["friend gave"],           "income", "Family"),
    (["received from friend"],  "income", "Family"),
    (["dost ne"],               "income", "Family"),
    (["yaar ne"],               "income", "Family"),
    (["pocket money"],          "income", "Family"),

    # ── TREAT / CELEBRATION (expense) ──
    (["birthday treat"],        "expense", "Treat"),
    (["birthday party"],        "expense", "Treat"),
    (["birthday dinner"],       "expense", "Treat"),
    (["birthday lunch"],        "expense", "Treat"),
    (["birthday celebration"],  "expense", "Treat"),
    (["gave birthday treat"],   "expense", "Treat"),
    (["treated friends"],       "expense", "Treat"),
    (["anniversary treat"],     "expense", "Treat"),
    (["anniversary dinner"],    "expense", "Treat"),
    (["anniversary party"],     "expense", "Treat"),
    (["anniversary celebration"],"expense","Treat"),
    (["farewell party"],        "expense", "Treat"),
    (["farewell treat"],        "expense", "Treat"),
    (["farewell dinner"],       "expense", "Treat"),
    (["gave farewell"],         "expense", "Treat"),
    (["promotion treat"],       "expense", "Treat"),
    (["promotion celebration"], "expense", "Treat"),
    (["new job treat"],         "expense", "Treat"),
    (["success party"],         "expense", "Treat"),
    (["exam pass treat"],       "expense", "Treat"),
    (["result celebration"],    "expense", "Treat"),
    (["housewarming"],          "expense", "Treat"),
    (["engagement party"],      "expense", "Treat"),
    (["baby shower"],           "expense", "Treat"),
    (["graduation party"],      "expense", "Treat"),
    (["get together"],          "expense", "Treat"),
    (["fresher party"],         "expense", "Treat"),
    (["new year party"],        "expense", "Treat"),
    (["christmas party"],       "expense", "Treat"),
    (["diwali party"],          "expense", "Treat"),
    (["festival party"],        "expense", "Treat"),

    # ── LENT (giving money to someone, expect it back) ──
    (["lent money"],            "expense", "Lent"),
    (["lent to"],               "expense", "Lent"),
    (["gave loan"],             "expense", "Lent"),
    (["gave money to friend"],  "expense", "Lent"),
    (["lent cash"],             "expense", "Lent"),
    (["gave money to classmate"],"expense","Lent"),
    (["lent money to"],         "expense", "Lent"),

    # ── FAMILY SUPPORT (sending money TO family) ──
    (["sent money to mom"],     "expense", "Family Support"),
    (["sent money to dad"],     "expense", "Family Support"),
    (["sent money to parents"], "expense", "Family Support"),
    (["sent money home"],       "expense", "Family Support"),
    (["transferred money to dad"],   "expense", "Family Support"),
    (["transferred money to mom"],   "expense", "Family Support"),
    (["gave money to mother"],  "expense", "Family Support"),
    (["gave money to father"],  "expense", "Family Support"),
    (["transferred to father"], "expense", "Family Support"),
    (["transferred to mother"], "expense", "Family Support"),
    (["sent money to brother"], "expense", "Family Support"),
    (["sent money to sister"],  "expense", "Family Support"),
    (["gave money to sister"],  "expense", "Family Support"),
    (["gave money to brother"], "expense", "Family Support"),
    (["home expenses sent"],    "expense", "Family Support"),
    (["family expense"],        "expense", "Family Support"),

    # ── TRANSPORT ──
    (["uber"],                  "expense", "Transport"),
    (["ola cab"],               "expense", "Transport"),
    (["ola ride"],              "expense", "Transport"),
    (["rapido"],                "expense", "Transport"),
    (["auto ride"],             "expense", "Transport"),
    (["rickshaw"],              "expense", "Transport"),
    (["metro card"],            "expense", "Transport"),
    (["bus ticket"],            "expense", "Transport"),
    (["train ticket"],          "expense", "Transport"),
    (["petrol"],                "expense", "Transport"),
    (["diesel"],                "expense", "Transport"),
    (["cng filled"],            "expense", "Transport"),
    (["fuel"],                  "expense", "Transport"),
    (["toll"],                  "expense", "Transport"),
    (["parking"],               "expense", "Transport"),
    (["cab booking"],           "expense", "Transport"),
    (["indrive"],               "expense", "Transport"),

    # ── FOOD ──
    (["zomato"],                "expense", "Food"),
    (["swiggy"],                "expense", "Food"),
    (["dominos"],               "expense", "Food"),
    (["pizza"],                 "expense", "Food"),
    (["mcdonalds"],             "expense", "Food"),
    (["kfc"],                   "expense", "Food"),
    (["starbucks"],             "expense", "Food"),
    (["restaurant"],            "expense", "Food"),
    (["groceries"],             "expense", "Food"),
    (["grocery"],               "expense", "Food"),
    (["vegetables"],            "expense", "Food"),
    (["biryani"],               "expense", "Food"),
    (["blinkit"],               "expense", "Food"),
    (["zepto"],                 "expense", "Food"),
    (["instamart"],             "expense", "Food"),
    (["burger king"],           "expense", "Food"),
    (["subway"],                "expense", "Food"),

    # ── ENTERTAINMENT ──
    (["netflix"],               "expense", "Entertainment"),
    (["prime video"],           "expense", "Entertainment"),
    (["hotstar"],               "expense", "Entertainment"),
    (["spotify"],               "expense", "Entertainment"),
    (["youtube premium"],       "expense", "Entertainment"),
    (["disney plus"],           "expense", "Entertainment"),
    (["movie ticket"],          "expense", "Entertainment"),
    (["concert ticket"],        "expense", "Entertainment"),
    (["gaming"],                "expense", "Entertainment"),
    (["steam"],                 "expense", "Entertainment"),
    (["zee5"],                  "expense", "Entertainment"),
    (["hungama"],               "expense", "Entertainment"),

    # ── SHOPPING ──
    (["myntra"],                "expense", "Shopping"),
    (["flipkart"],              "expense", "Shopping"),
    (["ajio"],                  "expense", "Shopping"),
    (["meesho"],                "expense", "Shopping"),
    (["nykaa"],                 "expense", "Shopping"),
    (["purplle"],               "expense", "Shopping"),

    # ── MEDICAL ──
    (["doctor"],                "expense", "Medical"),
    (["hospital"],              "expense", "Medical"),
    (["pharmacy"],              "expense", "Medical"),
    (["medicines"],             "expense", "Medical"),
    (["medicine"],              "expense", "Medical"),
    (["dental"],                "expense", "Medical"),
    (["lab test"],              "expense", "Medical"),
    (["xray"],                  "expense", "Medical"),
    (["blood test"],            "expense", "Medical"),

    # ── FITNESS ──
    (["gym"],                   "expense", "Fitness"),
    (["yoga"],                  "expense", "Fitness"),
    (["cult fit"],              "expense", "Fitness"),
    (["cultfit"],               "expense", "Fitness"),
    (["zumba"],                 "expense", "Fitness"),
    (["swimming pool"],         "expense", "Fitness"),

    # ── EDUCATION ──
    (["college fees"],          "expense", "Education"),
    (["school fees"],           "expense", "Education"),
    (["tuition"],               "expense", "Education"),
    (["coaching"],              "expense", "Education"),
    (["udemy"],                 "expense", "Education"),
    (["coursera"],              "expense", "Education"),
    (["certification fee"],     "expense", "Education"),

    # ── RECHARGE ──
    (["jio recharge"],          "expense", "Recharge"),
    (["airtel recharge"],       "expense", "Recharge"),
    (["mobile recharge"],       "expense", "Recharge"),
    (["sim recharge"],          "expense", "Recharge"),
    (["prepaid recharge"],      "expense", "Recharge"),
    (["phone recharge"],        "expense", "Recharge"),

    # ── BILLS ──
    (["electricity bill"],      "expense", "Bills"),
    (["water bill"],            "expense", "Bills"),
    (["gas bill"],              "expense", "Bills"),
    (["internet bill"],         "expense", "Bills"),
    (["wifi bill"],             "expense", "Bills"),
    (["broadband"],             "expense", "Bills"),
    (["dth"],                   "expense", "Bills"),
    (["maintenance charges"],   "expense", "Bills"),

    # ── RENT ──
    (["house rent"],            "expense", "Rent"),
    (["flat rent"],             "expense", "Rent"),
    (["room rent"],             "expense", "Rent"),
    (["apartment rent"],        "expense", "Rent"),
    (["paid rent"],             "expense", "Rent"),
    (["pg rent"],               "expense", "Rent"),
    (["hostel rent"],           "expense", "Rent"),
    (["landlord"],              "expense", "Rent"),

    # ── EMI ──
    (["emi"],                   "expense", "EMI"),
    (["loan repayment"],        "expense", "EMI"),
    (["credit card bill"],      "expense", "EMI"),

    # ── TRAVEL ──
    (["flight"],                "expense", "Travel"),
    (["hotel booking"],         "expense", "Travel"),
    (["airbnb"],                "expense", "Travel"),
    (["vacation"],              "expense", "Travel"),
    (["holiday booking"],       "expense", "Travel"),
    (["visa fee"],              "expense", "Travel"),

    # ── PERSONAL CARE ──
    (["haircut"],               "expense", "Personal Care"),
    (["salon"],                 "expense", "Personal Care"),
    (["parlour"],               "expense", "Personal Care"),
    (["spa"],                   "expense", "Personal Care"),
    (["skincare"],              "expense", "Personal Care"),

    # ── SUBSCRIPTION ──
    (["subscription"],          "expense", "Subscription"),

    # ── INCOME RULES ──
    (["salary"],                "income",  "Salary"),
    (["payroll"],               "income",  "Salary"),
    (["freelance"],             "income",  "Freelance"),
    (["upwork"],                "income",  "Freelance"),
    (["fiverr"],                "income",  "Freelance"),
    (["bonus"],                 "income",  "Bonus"),
    (["dividend"],              "income",  "Investment"),
    (["cashback received"],     "income",  "Cashback"),
    (["cashback credited"],     "income",  "Cashback"),
    (["refund received"],       "income",  "Refund"),
    (["refund credited"],       "income",  "Refund"),
    (["refund from"],           "income",  "Refund"),
    (["gift money received"],   "income",  "Gift"),
    (["gift received"],         "income",  "Gift"),
    (["rakhi gift"],            "income",  "Gift"),
    (["wedding gift"],          "income",  "Gift"),
]


def preprocess(text):
    """Same preprocessing used during training."""
    text = text.lower()
    text = re.sub(r"[^a-zA-Z0-9\s]", "", text)
    tokens = text.split()
    tokens = [lemmatizer.lemmatize(w) for w in tokens]
    return " ".join(tokens)


def apply_keyword_rules(text_lower):
    for keywords, txn_type, category in KEYWORD_RULES:
        if all(kw in text_lower for kw in keywords):
            return txn_type, category
    return None


@app.route("/predict", methods=["POST"])
def predict():
    raw_text = request.json.get("text", "")
    text_lower = raw_text.lower()

    # 1. Keyword rules first — always correct for known patterns
    result = apply_keyword_rules(text_lower)

    if result:
        txn_type, category = result
    else:
        # 2. ML model fallback for unknown inputs
        clean = preprocess(raw_text)
        prediction = model.predict([clean])[0]
        txn_type, category = prediction.split("|")

    amounts = re.findall(r'\d+', raw_text)
    amount = int(amounts[0]) if amounts else 0
    icon = icon_map.get(category, "💸")

    return jsonify({
        "type": txn_type,
        "category": category,
        "amount": amount,
        "icon": icon
    })


if __name__ == "__main__":
    app.run(port=8000, debug=False)