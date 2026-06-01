# Finance Tracker

A full-stack personal finance management app with AI-powered transaction detection. Built with the MERN stack and a custom NLP microservice that auto-categorizes transactions from plain text input.

🔗 **Live Demo:** [my-financetracker-app-2026.vercel.app](https://my-financetracker-app-2026.vercel.app)
📦 **Repo:** [github.com/awanishmani26/Finance-Tracker](https://github.com/awanishmani26/Finance-Tracker)

---

## Features

- **JWT Authentication** — register, login, session persistence via sessionStorage
- **AI Transaction Input** — type natural language like `"salary 40000"` or `"rent 5000"`, the NLP service auto-detects type, category, amount, and icon
- **Income & Expense Management** — add, view, delete transactions with category icons
- **Dashboard Analytics** — balance summary, bar chart (last 30 days expenses), pie chart (last 60 days income), recent transactions
- **Profile Photo Upload** — stored on Cloudinary, persists across sessions
- **Responsive UI** — sidebar navigation, chart components built with Recharts

---

## Tech Stack

**Frontend**
- React 18, React Router v6, Recharts
- Axios, Context API for global state
- Vite (bundler), deployed on Vercel

**Backend**
- Node.js, Express.js
- MongoDB Atlas + Mongoose
- JWT (jsonwebtoken), bcryptjs, Multer + Cloudinary
- Deployed on Render

**NLP Microservice**
- Python, Flask, Gunicorn
- scikit-learn (trained ML classifier), NLTK (lemmatization)
- Custom-trained on transaction dataset (`transactions.csv`)
- Deployed as a separate Render service

---

## Project Structure

```
Finance-Tracker/
├── backend/
│   ├── config/          # DB + Cloudinary config
│   ├── controllers/     # Auth, Income, Expense, Dashboard, AI
│   ├── middleware/       # JWT auth, Multer upload
│   ├── models/          # User, Income, Expense schemas
│   ├── routes/          # Express route definitions
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── components/  # Sidebar, Charts, TransactionItem, etc.
│       ├── context/     # UserContext (global auth state)
│       ├── pages/       # Dashboard, Income, Expense, Auth
│       ├── utils/       # axiosInstance, apiPaths, helpers
│       └── App.jsx
│
└── nlp_service/
    ├── app.py           # Flask prediction API
    ├── train.py         # Model training script
    ├── model.pkl        # Trained scikit-learn model
    └── requirements.txt
```

---

---


## NLP Service — How It Works

The AI transaction classifier is a scikit-learn pipeline trained on labeled transaction data. Input text goes through:

1. **Preprocessing** — lowercasing, special character removal, NLTK lemmatization
2. **Prediction** — trained model outputs `type|category` (e.g. `expense|Food`)
3. **Amount extraction** — regex pulls numeric value from raw text
4. **Icon mapping** — category mapped to an emoji icon

The model is trained locally (`train.py`) and the serialized `model.pkl` is deployed with the Flask service.

---

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | [my-financetracker-app-2026.vercel.app](https://my-financetracker-app-2026.vercel.app) |
| Backend | Render | expense-tracker-backend-dmc0.onrender.com |
| NLP Service | Render | expense-tracker-xy9i.onrender.com |
| Database | MongoDB Atlas | — |
| Media Storage | Cloudinary | — |

Both Render services are kept alive via UptimeRobot monitors (5-minute ping interval) to prevent cold starts on the free tier.

---

