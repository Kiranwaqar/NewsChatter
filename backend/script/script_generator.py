import requests
import re
import json
from datetime import datetime
from apscheduler.schedulers.blocking import BlockingScheduler

API_KEY = os.getenv("API_KEY")
NEWS_API_URL = "https://newsapi.org/v2/top-headlines"
COUNTRY = "us"  # Change to 'pk' for Pakistani/Urdu news

def detect_emotion(text):
    text = text.lower()
    if re.search(r"shock|surprise|unexpected|stunned", text):
        return "surprised"
    elif re.search(r"win|victory|achievement|milestone", text):
        return "happy"
    elif re.search(r"loss|death|defeat|disaster", text):
        return "sad"
    elif re.search(r"criticize|attack|blame|anger", text):
        return "angry"
    else:
        return "neutral"

def create_bullet_script(article):
    bullets = []

    if article.get("title"):
        bullets.append({
            "bullet": article["title"],
            "emotion": detect_emotion(article["title"])
        })

    if article.get("description"):
        bullets.append({
            "bullet": article["description"],
            "emotion": detect_emotion(article["description"])
        })

    content = article.get("content") or ""
    sentences = re.split(r"\. |\n", content)
    for sentence in sentences[:2]:  # Only first 2 sentences
        if len(sentence.strip()) > 20:
            bullets.append({
                "bullet": sentence.strip(),
                "emotion": detect_emotion(sentence)
            })

    return bullets

def fetch_and_process_news():
    params = {
        "apiKey": API_KEY,
        "country": COUNTRY
    }

    try:
        response = requests.get(NEWS_API_URL, params=params)
        data = response.json()
    except Exception as e:
        print(f"Error fetching news: {e}")
        return []

    result = []
    for article in data.get("articles", [])[:5]:
        script = create_bullet_script(article)
        result.append({"script": script})

    # Save to file
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    output = {
        "generated_at": timestamp,
        "data": result
    }

    with open("latest_news_script.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"[{timestamp}] News script saved successfully.")
    return output

# Scheduler Setup
scheduler = BlockingScheduler()
scheduler.add_job(fetch_and_process_news, 'cron', hour='*')  # Run every hour

if __name__ == "__main__":
    # Initial run
    news_scripts = fetch_and_process_news()
    print("Generated News Script:")
    print(json.dumps(news_scripts, indent=2))
    # Start hourly schedule
    scheduler.start()
