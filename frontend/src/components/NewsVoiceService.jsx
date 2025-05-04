import NewsService from "./NewsService";

class NewsVoiceService {
  /**
   * API endpoint for the translation and voice generation service
   * @type {string}
   */
  static VOICE_API_URL = "http://localhost:5000/translate";

  /**
   * Fetches news content, translates it, and generates audio
   * @param {string} category - The news category to fetch
   * @param {string} language - The target language code (e.g., 'en', 'es', 'fr')
   * @returns {Promise<Object>} - An object containing the text and audio URL
   */
  static async getTranslatedNewsAudio(category, language) {
    try {
      // First, get the news script from the NewsService
      const newsScript = await NewsService.fetchNewsByCategory(category);

      if (
        !newsScript ||
        newsScript.includes("don't have any updates") ||
        newsScript.includes("technical difficulties")
      ) {
        console.log("No valid news content available");
        return {
          text: newsScript,
          audioUrl: null,
        };
      }

      // Encode the text and language for the URL
      const params = new URLSearchParams({
        text: newsScript,
        lang: this.getLanguageName(language), // Use language name instead of code
      });

      // Build the API URL with the encoded parameters
      const apiUrl = `${this.VOICE_API_URL}?${params.toString()}`;

      // Fetch the audio file
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Error fetching audio");
      }

      // Create the audio URL from the response blob
      const audioUrl = URL.createObjectURL(await response.blob());
      console.log("Audio URL:", audioUrl);
      // Return the text and audio URL
      return {
        text: newsScript,
        audioUrl: audioUrl, // Return the actual audio URL
      };
    } catch (error) {
      console.error("Error generating news audio:", error);
      throw new Error("Failed to generate news audio");
    }
  }

  /**
   * Play audio from the generated URL
   * @param {string} audioUrl - URL to the audio file
   * @returns {Promise<HTMLAudioElement>} - The audio element being played
   */
  static async playNewsAudio(audioUrl) {
    return new Promise((resolve, reject) => {
      try {
        if (!audioUrl) {
          throw new Error("No audio URL provided");
        }

        // Create an audio element
        const audio = new Audio(audioUrl);

        // Set up event handlers
        audio.onended = () => resolve(audio);
        audio.onerror = (e) =>
          reject(new Error("Failed to play audio: " + e.message));

        // Play the audio
        audio
          .play()
          .then(() => {
            // Return the audio element while it's playing
            resolve(audio);
          })
          .catch((error) => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Convert language code to language name for the API
   * @param {string} langCode - The language code (e.g., 'en', 'es')
   * @returns {string} - The corresponding language name
   */
  static getLanguageName(langCode) {
    const langMap = {
      en: "english",
      es: "spanish",
      fr: "french",
      de: "german",
      it: "italian",
      "zh-CN": "chinese",
      ja: "japanese",
      ko: "korean",
      ar: "arabic",
      ru: "russian",
      hi: "hindi",
      ur: "urdu",
    };

    return langMap[langCode] || "english";
  }
}

export default NewsVoiceService;
