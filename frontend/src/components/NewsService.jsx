// NewsService.jsx - Connects to Firebase using firebase_config.js

import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase_config"; // Ensure this path is correct

class NewsService {
  /**
   * Fetches the latest news script from Firebase and optionally filters based on category
   * @param {string} category - The news category to fetch (e.g., "sports", "tech", or "all")
   * @returns {Promise<string>} - The combined news content for the selected category
   */
  static async fetchNewsByCategory(category) {
    try {
      console.log(`Fetching news for category: ${category}`);

      // Fetch latest document(s) from news_broadcasts
      const newsQuery = query(
        collection(db, "news_broadcasts"),
        orderBy("timestamp", "desc"),
        limit(1)
      );

      const querySnapshot = await getDocs(newsQuery);

      if (querySnapshot.empty) {
        console.log(`No news found for category: ${category}`);
        return "We currently don't have any updates for this category. Please check back later.";
      }

      const docData = querySnapshot.docs[0].data();

      // If category is 'all', return full script
      if (category === "all") {
        return docData.script || "No news script available.";
      }

      // If specific category, filter articles and build script
      let filteredContent = "";

      if (Array.isArray(docData.articles)) {
        docData.articles
          .filter((article) => article.category === category)
          .forEach((article) => {
            if (article.description && article.content) {
              filteredContent += `${article.description}. ${article.content} `;
            } else if (article.content) {
              filteredContent += `${article.content} `;
            }
          });
      }

      if (!filteredContent.trim()) {
        return "We currently don't have any updates for this category. Please check back later.";
      }

      return filteredContent.trim();
    } catch (error) {
      console.error("Error fetching news:", error);
      return "We're experiencing technical difficulties fetching the latest news. Please stand by.";
    }
  }

  /**
   * Fetches available news categories from the database
   * @returns {Promise<Array>} - Array of category objects
   */
  static async fetchCategories() {
    try {
      const categoriesQuery = query(
        collection(db, "news_categories"),
        orderBy("category")
      );
      const querySnapshot = await getDocs(categoriesQuery);

      if (querySnapshot.empty) {
        console.log("No categories found in database");
        return [];
      }

      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }
}

export default NewsService;
