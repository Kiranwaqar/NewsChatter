# NewsChatterAI

A cutting-edge AI-powered application that automates news fetching, translation, and audio generation to deliver real-time news updates with voice output. Designed to serve as a personalized news anchor, this project utilizes advanced APIs and machine learning to keep you informed in your preferred language.

---

## 🔖 Features

* **Real-Time News Fetching**: Fetches news articles periodically from the [News API](https://newsapi.org).
* **Translation Support**: Translates news articles into multiple languages using OpenAI GPT API.
* **Voice Output**: Converts translated text into audio using `gTTS` for seamless audio playback.
* **Scheduler Integration**: Automates periodic news updates using `APScheduler`.
* **Customizable Queries**: Fetch news based on language, country, and categories.
* **Frontend-Backend Integration**: A responsive frontend displays news and facilitates user interactions.

---

## 🚀 Technology Stack

### **Frontend**

* **Framework**: React.js
* **Styling**: Tailwind CSS
* **Features**: Displays real-time news articles, supports language selection, and integrates with audio playback.

### **Backend**

* **Framework**: Flask
* **APIs Used**:

  * [News API](https://newsapi.org): For fetching news articles.
  * OpenAI GPT: For translation and language processing.
  * Gemini Api
* **Other Tools**: `gTTS` for text-to-speech conversion.

### **Scheduler**

* **Tool**: `APScheduler`
* **Purpose**: Schedules periodic news fetching and script generation.

---

## 🔧 Prerequisites

1. **Python**: Version 3.8 or higher installed.
2. **Node.js**: Version 14+ with npm.
3. **API Keys**:

   * [News API](https://newsapi.org) API key for fetching news.
   * OpenAI GPT API key for translation.
4. **Environment Variables**:
   Create a `.env` file in the `backend` directory:

   ```env
   OPENAI_API_KEY=your_openai_api_key
   NEWS_API_KEY=your_news_api_key
   ```

---

## 💻 Installation and Setup

### **Backend Setup**

1. Clone the repository:

   ```bash
   git clone https://github.com/Kiranwaqar/NewsChatter.git
   cd NewsChatterAI/frontend
   ```

2. Create a virtual environment and activate it:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Set up the `.env` file as described in Prerequisites.

5. Run the backend:

   ```bash
   python app.py
   ```

### **Frontend Setup**

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the frontend:

   ```bash
   npm start
   ```

---

## 🔄 Scheduler Setup

To enable periodic news fetching, the backend leverages `APScheduler`:

* Add this snippet to your backend configuration:

  ```python
  from apscheduler.schedulers.background import BackgroundScheduler

  scheduler = BackgroundScheduler()
  scheduler.add_job(fetch_and_process_news, 'interval', hours=1)
  scheduler.start()
  ```
* Ensure the backend is running to keep the scheduler active.

---

## 🔖 API Endpoints

### **1. `/translate`**

* **Method**: GET
* **Parameters**:

  * `text`: The text to translate.
  * `lang`: Target language (e.g., `en`, `ur`, `es`).
* **Response**: Translated text and audio file.

### **2. `/fetch-news`**

* **Method**: GET
* **Response**: Returns the latest news articles.

---

## 📋 Roadmap

* Add more language options for translation.
* Enhance voice generation with regional accents.
* Implement user authentication for personalized news feeds.
* Expand source options beyond News API.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request.

---

## 🌐 Links

* **API Documentation**: [News API Docs](https://newsapi.org/docs)
* **Project Demo**: \[Coming Soon]

---


