from openai import OpenAI
from typing import Dict, List, Tuple

class GeminiAnalyzer:
    def __init__(self, api_key: str):
        self.client = OpenAI(api_key="AIzaSyCMrAFTuBhK1pUcEyRzWwgR9D67T8dfVWI",base_url="https://generativelanguage.googleapis.com/v1beta/openai/")
        
        # Define categories
        self.categories = [
            "politics", "sports", "technology", "business", 
            "entertainment", "health", "science", "environment",
            "war", "international", "weather", "crime"
        ]

    def analyze_article(self, title: str, description: str) -> Tuple[str, str]:
        """
        Analyze an article to determine its category and emotional tone.
        Returns (category, emotion)
        """
        prompt = f"""
        Analyze this news article and provide:
        1. The most relevant category from this list: {', '.join(self.categories)}
        2. The dominant emotional tone (e.g., neutral, positive, negative, urgent, serious, hopeful)
        
        Title: {title}
        Description: {description}
        
        Respond in this exact format:
        Category: [category]
        Emotion: [emotion]
        """
        
        try:
            response = self.client.chat.completions.create(model  = "gemini-1.5-flash",messages= [{"role": "user", "content": prompt}])
            response_text = response.choices[0].message.content
            
            # Parse the response
            category = None
            emotion = None
            
            for line in response_text.split('\n'):
                if line.startswith('Category:'):
                    category = line.split(':')[1].strip().lower()
                elif line.startswith('Emotion:'):
                    emotion = line.split(':')[1].strip().lower()
            
            # Validate category
            if category not in self.categories:
                category = "other"
            
            return category, emotion
        except Exception as e:
            print(f"Error analyzing article: {e}")
            return "other", "neutral"

    def analyze_articles(self, articles: List[Dict]) -> List[Dict]:
        """
        Analyze a list of articles and add category and emotion information
        """
        analyzed_articles = []
        for article in articles:
            category, emotion = self.analyze_article(
                article.get('title', ''),
                article.get('description', '')
            )
            
            analyzed_article = article.copy()
            analyzed_article['category'] = category
            analyzed_article['emotion'] = emotion
            analyzed_articles.append(analyzed_article)
        
        return analyzed_articles 