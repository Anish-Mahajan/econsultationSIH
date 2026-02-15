# E-Consultation System with Sentiment Analysis

A web-based e-consultation platform that allows users to submit feedback or comments and automatically analyzes sentiment using an AI module.

The project combines a Node.js backend, a simple frontend, and a Python-based sentiment analysis system.

---

## Features

* Submit consultation comments
* Store and manage feedback
* Sentiment analysis of user comments
* Web interface for interaction
* REST API backend

---

## Tech Stack

**Frontend**

* HTML
* CSS
* JavaScript

**Backend**

* Node.js
* Express

**AI / Analysis**

* Python
* Streamlit
* NLP Sentiment Analysis

**Other Tools**

* Environment variables (.env)

---

## Project Structure

```
econsultationSIH/
│
├── public/                         # Frontend files
├── Sentiment Analysis Streamlit/   # AI module
├── server.js                       # Backend server
├── insertComment.js                # Comment insertion logic
├── package.json                    # Dependencies
└── README.md
```

---

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Anish-Mahajan/econsultationSIH.git
cd econsultationSIH
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory and add:

```
PORT=5000
DB_URL=your_database_url
NODE_ENV=development
```

### 4. Run the backend server

```bash
node server.js
```

---

## Running the Sentiment Analysis Module

Navigate to the sentiment analysis folder and run:

```bash
streamlit run app.py
```

---

## Future Improvements

* User authentication
* Analytics dashboard
* Improved UI/UX
* Deployment and hosting
