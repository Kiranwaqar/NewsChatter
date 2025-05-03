from datetime import datetime

class ScriptGenerator:
    def __init__(self):
        self.template = """
Good {time_of_day}, I'm your digital news anchor. Here are the latest headlines:

{headlines}

Let's dive into the details:

{detailed_news}

That's all for now. Stay tuned for more updates.
"""

    def get_time_of_day(self):
        hour = datetime.now().hour
        if 5 <= hour < 12:
            return "morning"
        elif 12 <= hour < 17:
            return "afternoon"
        elif 17 <= hour < 22:
            return "evening"
        else:
            return "night"

    def format_headlines(self, articles):
        headlines = []
        for article in articles:
            headlines.append(f"- {article['title']}")
        return "\n".join(headlines)

    def format_detailed_news(self, articles):
        detailed_news = []
        for article in articles:
            news_item = f"""
According to {article['source']}, {article['title']}. {article['description']}
"""
            detailed_news.append(news_item)
        return "\n".join(detailed_news)

    def generate_script(self, articles):
        if not articles:
            return "No news articles available at the moment."

        time_of_day = self.get_time_of_day()
        headlines = self.format_headlines(articles)
        detailed_news = self.format_detailed_news(articles)

        script = self.template.format(
            time_of_day=time_of_day,
            headlines=headlines,
            detailed_news=detailed_news
        )

        return script 