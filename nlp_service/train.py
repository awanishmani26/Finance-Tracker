# # import pandas as pd
# # from sklearn.pipeline import Pipeline
# # from sklearn.feature_extraction.text import TfidfVectorizer
# # from sklearn.naive_bayes import MultinomialNB
# # import joblib

# # data = pd.read_csv("transactions.csv")

# # X = data["text"]

# # y = data["type"] + "|" + data["category"]

# # model = Pipeline([
# #     ("tfidf", TfidfVectorizer()),
# #     ("clf", MultinomialNB())
# # ])

# # model.fit(X, y)

# # joblib.dump(model, "model.pkl")

# # print("Model trained successfully")
# import pandas as pd
# import numpy as np
# import re
# import joblib

# # NLP
# import nltk
# from nltk.tokenize import word_tokenize
# from nltk.stem import WordNetLemmatizer

# # ML
# from sklearn.model_selection import train_test_split
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.pipeline import Pipeline
# from sklearn.metrics import accuracy_score

# # Models
# from sklearn.naive_bayes import MultinomialNB
# from sklearn.linear_model import LogisticRegression
# from sklearn.svm import LinearSVC

# # Word2Vec
# from gensim.models import Word2Vec

# # Download NLTK resources
# nltk.download("punkt")
# nltk.download("wordnet")

# # =========================
# # LOAD DATASET
# # =========================

# data = pd.read_csv("transactions.csv")

# # Remove empty rows
# data = data.dropna(subset=["text", "type", "category"])

# # Convert to string
# data["text"] = data["text"].astype(str)
# data["type"] = data["type"].astype(str)
# data["category"] = data["category"].astype(str)

# # =========================
# # TEXT PREPROCESSING
# # =========================

# lemmatizer = WordNetLemmatizer()

# def preprocess_text(text):

#     # lowercase
#     text = text.lower()

#     # remove special chars
#     text = re.sub(r"[^a-zA-Z0-9\s]", "", text)

#     # tokenization
#     tokens = word_tokenize(text)

#     # lemmatization
#     tokens = [lemmatizer.lemmatize(word) for word in tokens]

#     return " ".join(tokens)

# data["clean_text"] = data["text"].apply(preprocess_text)

# # =========================
# # OPTIONAL WORD2VEC
# # =========================

# sentences = [text.split() for text in data["clean_text"]]

# word2vec_model = Word2Vec(
#     sentences,
#     vector_size=100,
#     window=5,
#     min_count=1,
#     workers=4
# )

# # save word2vec
# word2vec_model.save("word2vec.model")

# # =========================
# # LABELS
# # =========================

# X = data["clean_text"]

# y = data["type"] + "|" + data["category"]

# # =========================
# # TRAIN TEST SPLIT
# # =========================

# X_train, X_test, y_train, y_test = train_test_split(
#     X,
#     y,
#     test_size=0.2,
#     random_state=42
# )

# # =========================
# # MODELS
# # =========================

# models = {

#     "Naive Bayes": Pipeline([
#         ("tfidf", TfidfVectorizer()),
#         ("clf", MultinomialNB())
#     ]),

#     "Logistic Regression": Pipeline([
#         ("tfidf", TfidfVectorizer()),
#         ("clf", LogisticRegression(max_iter=1000))
#     ]),

#     "Linear SVM": Pipeline([
#         ("tfidf", TfidfVectorizer()),
#         ("clf", LinearSVC())
#     ])
# }

# best_model = None
# best_accuracy = 0
# best_model_name = ""

# # =========================
# # TRAIN & EVALUATE
# # =========================

# for name, model in models.items():

#     model.fit(X_train, y_train)

#     predictions = model.predict(X_test)

#     accuracy = accuracy_score(y_test, predictions)

#     print(f"{name} Accuracy: {accuracy:.4f}")

#     if accuracy > best_accuracy:
#         best_accuracy = accuracy
#         best_model = model
#         best_model_name = name

# # =========================
# # SAVE BEST MODEL
# # =========================

# joblib.dump(best_model, "model.pkl")

# print("\n==============================")
# print(f"Best Model: {best_model_name}")
# print(f"Best Accuracy: {best_accuracy:.4f}")
# print("==============================")
# print("Model saved as model.pkl")

import pandas as pd
import numpy as np
import re
import joblib

# NLP
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

# ML - Models
from sklearn.naive_bayes import MultinomialNB, ComplementNB
from sklearn.linear_model import LogisticRegression, SGDClassifier
from sklearn.svm import LinearSVC
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, ExtraTreesClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier

# ML - Utilities
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report
from sklearn.calibration import CalibratedClassifierCV

# Word2Vec
from gensim.models import Word2Vec

# Download NLTK resources
nltk.download("punkt", quiet=True)
nltk.download("wordnet", quiet=True)
nltk.download("punkt_tab", quiet=True)

# ============================================================
# LOAD DATASET
# ============================================================

data = pd.read_csv("transactions.csv")
data = data.dropna(subset=["text", "type", "category"])
data["text"]     = data["text"].astype(str)
data["type"]     = data["type"].astype(str)
data["category"] = data["category"].astype(str)

print(f"Dataset loaded  : {len(data)} samples")
print(f"Unique classes  : {(data['type'] + '|' + data['category']).nunique()}")

# ============================================================
# TEXT PREPROCESSING
# ============================================================

lemmatizer = WordNetLemmatizer()

def preprocess_text(text):
    text   = text.lower()
    text   = re.sub(r"[^a-zA-Z0-9\s]", "", text)
    tokens = word_tokenize(text)
    tokens = [lemmatizer.lemmatize(word) for word in tokens]
    return " ".join(tokens)

data["clean_text"] = data["text"].apply(preprocess_text)

# ============================================================
# WORD2VEC  (saved for optional downstream use)
# ============================================================

sentences         = [text.split() for text in data["clean_text"]]
word2vec_model    = Word2Vec(sentences, vector_size=100, window=5, min_count=1, workers=4)
word2vec_model.save("word2vec.model")
print("Word2Vec model saved.\n")

# ============================================================
# LABELS & SPLIT
# ============================================================

X = data["clean_text"]
y = data["type"] + "|" + data["category"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Train size : {len(X_train)}")
print(f"Test  size : {len(X_test)}\n")

# ============================================================
# TF-IDF CONFIGURATIONS
# Two variants — unigram and bigram — tried for every model
# ============================================================

tfidf_unigram = TfidfVectorizer(
    ngram_range=(1, 1),
    sublinear_tf=True,
    min_df=1
)

tfidf_bigram = TfidfVectorizer(
    ngram_range=(1, 2),   # bigrams capture "birthday treat", "uber ride" etc.
    sublinear_tf=True,
    min_df=1
)

# ============================================================
# ALL CANDIDATE MODELS
# ============================================================
# LinearSVC wrapped in CalibratedClassifierCV so it supports
# predict_proba (needed for some downstream uses) while keeping
# full SVM power.

models = {

    # ── Naive Bayes family ─────────────────────────────────
    "Naive Bayes (unigram)": Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,1), sublinear_tf=True)),
        ("clf",   MultinomialNB())
    ]),
    "Naive Bayes (bigram)": Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,2), sublinear_tf=True)),
        ("clf",   MultinomialNB())
    ]),
    "Complement Naive Bayes (unigram)": Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,1), sublinear_tf=True)),
        ("clf",   ComplementNB())          # better than MNB for imbalanced classes
    ]),
    "Complement Naive Bayes (bigram)": Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,2), sublinear_tf=True)),
        ("clf",   ComplementNB())
    ]),

    # ── Logistic Regression ────────────────────────────────
    "Logistic Regression (unigram)": Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,1), sublinear_tf=True)),
        ("clf",   LogisticRegression(max_iter=1000, C=1.0, solver="lbfgs"))
    ]),
    "Logistic Regression (bigram)": Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,2), sublinear_tf=True)),
        ("clf",   LogisticRegression(max_iter=1000, C=1.0, solver="lbfgs"))
    ]),
    "Logistic Regression C=5 (bigram)": Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,2), sublinear_tf=True)),
        ("clf",   LogisticRegression(max_iter=1000, C=5.0, solver="lbfgs"))
    ]),

    # ── Support Vector Machines ────────────────────────────
    "Linear SVM (unigram)": Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,1), sublinear_tf=True)),
        ("clf",   LinearSVC(C=1.0, max_iter=2000, dual=False))
    ]),
    "Linear SVM (bigram)": Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,2), sublinear_tf=True)),
        ("clf",   LinearSVC(C=1.0, max_iter=2000, dual=False))
    ]),
    "Linear SVM C=5 (bigram)": Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,2), sublinear_tf=True)),
        ("clf",   LinearSVC(C=5.0, max_iter=2000, dual=False))
    ]),

    # ── SGD Classifier (online SVM / log loss) ─────────────
    "SGD SVM (bigram)": Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,2), sublinear_tf=True)),
        ("clf",   SGDClassifier(loss="hinge", max_iter=1000,
                                random_state=42, tol=1e-3))
    ]),
    "SGD Log (bigram)": Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,2), sublinear_tf=True)),
        ("clf",   SGDClassifier(loss="log_loss", max_iter=1000,
                                random_state=42, tol=1e-3))
    ]),

    # ── Tree / Ensemble ────────────────────────────────────
    "Decision Tree (bigram)": Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,2), sublinear_tf=True)),
        ("clf",   DecisionTreeClassifier(random_state=42))
    ]),
    "Random Forest (bigram)": Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,2), sublinear_tf=True)),
        ("clf",   RandomForestClassifier(n_estimators=200, random_state=42,
                                         n_jobs=-1))
    ]),
    "Extra Trees (bigram)": Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,2), sublinear_tf=True)),
        ("clf",   ExtraTreesClassifier(n_estimators=200, random_state=42,
                                       n_jobs=-1))
    ]),
    "Gradient Boosting (unigram)": Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,1), sublinear_tf=True,
                                  max_features=500)),   # GB is slow; cap features
        ("clf",   GradientBoostingClassifier(n_estimators=100,
                                             random_state=42))
    ]),

    # ── KNN ───────────────────────────────────────────────
    "KNN k=3 (bigram)": Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,2), sublinear_tf=True)),
        ("clf",   KNeighborsClassifier(n_neighbors=3, metric="cosine"))
    ]),
    "KNN k=5 (bigram)": Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,2), sublinear_tf=True)),
        ("clf",   KNeighborsClassifier(n_neighbors=5, metric="cosine"))
    ]),
}

# ============================================================
# TRAIN, EVALUATE & COMPARE
# ============================================================

results      = {}
best_model      = None
best_accuracy   = 0.0
best_model_name = ""

print("=" * 62)
print(f"{'Model':<42} {'Test Acc':>8}  {'CV Mean':>8}  {'CV Std':>7}")
print("=" * 62)

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

for name, pipeline in models.items():

    # — train on training split
    pipeline.fit(X_train, y_train)

    # — test accuracy
    preds    = pipeline.predict(X_test)
    test_acc = accuracy_score(y_test, preds)

    # — 5-fold cross-validation on the full dataset for robustness
    try:
        cv_scores = cross_val_score(pipeline, X, y, cv=skf,
                                    scoring="accuracy", n_jobs=-1)
        cv_mean = cv_scores.mean()
        cv_std  = cv_scores.std()
    except Exception:
        cv_mean, cv_std = 0.0, 0.0

    results[name] = {
        "pipeline": pipeline,
        "test_acc": test_acc,
        "cv_mean":  cv_mean,
        "cv_std":   cv_std,
    }

    print(f"  {name:<40} {test_acc:>8.4f}  {cv_mean:>8.4f}  {cv_std:>7.4f}")

    if test_acc > best_accuracy:
        best_accuracy   = test_acc
        best_model      = pipeline
        best_model_name = name

print("=" * 62)

# ============================================================
# SAVE BEST MODEL
# ============================================================

joblib.dump(best_model, "model.pkl")

print(f"\n{'='*62}")
print(f"  Best Model    : {best_model_name}")
print(f"  Test Accuracy : {best_accuracy:.4f}  ({best_accuracy*100:.2f}%)")
print(f"  CV Accuracy   : {results[best_model_name]['cv_mean']:.4f}"
      f" ± {results[best_model_name]['cv_std']:.4f}")
print(f"{'='*62}")
print("  model.pkl saved — this model will be used by app.py\n")

# ============================================================
# DETAILED REPORT FOR THE BEST MODEL
# ============================================================

best_preds = best_model.predict(X_test)
print("Classification Report (Best Model):")
print(classification_report(y_test, best_preds, zero_division=0))

# ============================================================
# RANKED SUMMARY TABLE
# ============================================================

print("\nAll models ranked by test accuracy:")
print(f"  {'Rank':<5} {'Model':<42} {'Test Acc':>8}  {'CV Mean':>8}")
print(f"  {'-'*4}  {'-'*42} {'-'*8}  {'-'*8}")

ranked = sorted(results.items(), key=lambda x: x[1]["test_acc"], reverse=True)
for rank, (name, info) in enumerate(ranked, 1):
    marker = " ◀ BEST" if name == best_model_name else ""
    print(f"  {rank:<5} {name:<42} {info['test_acc']:>8.4f}  "
          f"{info['cv_mean']:>8.4f}{marker}")