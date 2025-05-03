import schedule
import time
from datetime import datetime, timedelta
import requests
import os
from backend.script_generator import ScriptGenerator
from backend.firebase_service import FirebaseService
from backend.gemini_analyzer import GeminiAnalyzer

class NewsProcessor:
    def __init__(self):
        self.news_api_key = "bf8c0775624140f2ab2e6571932861cd"
        self.news_api_url = "https://newsapi.org/v2/everything"
        self.script_generator = ScriptGenerator()
        self.firebase_service = FirebaseService()
        self.gemini_analyzer = GeminiAnalyzer(os.getenv('GEMINI_API_KEY'))

    def fetch_news(self, query="technology"):
        params = {
            'q': query,
            'from': (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d'),
            'sortBy': 'popularity',
            'apiKey': self.news_api_key,
            'language': 'en',
            'pageSize': 5
        }

        try:
            response = requests.get(self.news_api_url, params=params)
            response.raise_for_status()
            data = response.json()
            
            if data.get('status') == 'ok':
                return data.get('articles', [])
            return []
        except Exception as e:
            print(f"Error fetching news: {e}")
            return []

    def process_and_save(self):
        print(f"Processing news at {datetime.now()}")
        
        # Fetch latest news
        articles = self.fetch_news()
        
        if articles:
            # Analyze articles with Gemini
            analyzed_articles = self.gemini_analyzer.analyze_articles(articles)
            
            # Generate script
            script = self.script_generator.generate_script(analyzed_articles)
            
            # Prepare data for Firebase
            broadcast_data = {
                'script': script,
                'articles': analyzed_articles,
                'timestamp': datetime.now().isoformat()
            }
            
            # Save to Firebase
            self.firebase_service.save_broadcast(broadcast_data)
            print("News script and analysis saved to Firebase successfully")
        else:
            print("No news articles available")

    def start(self):
        # Initial processing
        self.process_and_save()
        
        # Schedule hourly updates
        schedule.every(1).hours.do(self.process_and_save)
        
        # Keep the script running
        while True:
            schedule.run_pending()
            time.sleep(1)

if __name__ == "__main__":
    processor = NewsProcessor()
    processor.start()
