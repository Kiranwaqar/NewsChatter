import React, { useState, useEffect } from "react";
import NewsService from "./NewsService";
import NewsVoiceService from "./NewsVoiceService";

const NewsVoicePlayer = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [newsScript, setNewsScript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");

  // List of available languages with their codes
  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "zh-CN", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "ar", name: "Arabic" },
    { code: "ru", name: "Russian" },
    { code: "hi", name: "Hindi" },
    { code: "ur", name: "Urdu" },
  ];

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await NewsService.fetchCategories();
        setCategories([
          { id: "all", category: "All News" },
          ...fetchedCategories,
        ]);
      } catch (err) {
        setError("Failed to load news categories");
        console.error(err);
      }
    };

    loadCategories();
  }, []);

  // Fetch news script when category changes
  useEffect(() => {
    const loadNewsScript = async () => {
      if (selectedCategory) {
        setIsLoading(true);
        try {
          const script = await NewsService.fetchNewsByCategory(
            selectedCategory
          );
          setNewsScript(script);
          setError("");
        } catch (err) {
          setNewsScript("");
          setError("Failed to load news content");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadNewsScript();
  }, [selectedCategory]);

  // Handle category selection
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setAudioUrl("");
    setIsPlaying(false);
  };

  // Handle language selection
  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    setAudioUrl("");
    setIsPlaying(false);
  };

  // Generate audio from the news script
  const handleGenerateAudio = async () => {
    if (
      !newsScript ||
      newsScript.trim().length === 0 ||
      newsScript.includes("don't have any updates")
    ) {
      setError("No valid news content available to generate audio");
      return;
    }

    setIsLoading(true);
    try {
      const url = await NewsVoiceService.getNewsAudio(
        selectedCategory,
        selectedLanguage,
        newsScript // Pass the script here to generate audio
      );
      setAudioUrl(url);
      setError("");
    } catch (err) {
      setError("Failed to generate audio");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Play the generated audio
  const handlePlayAudio = async () => {
    if (!audioUrl) {
      setError("No audio available to play");
      return;
    }

    try {
      const audio = new Audio(audioUrl);
      audio.play();
      setIsPlaying(true);

      audio.onended = () => {
        setIsPlaying(false);
      };
    } catch (err) {
      setError("Failed to play audio");
      console.error(err);
    }
  };

  return (
    <div className="news-voice-player">
      <h2>News Voice Player</h2>

      {/* Categories dropdown */}
      <div className="form-group">
        <label htmlFor="category-select">News Category:</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
          disabled={isLoading}
        >
          {categories.map((cat) => (
            <option
              key={cat.id}
              value={cat.id === "all" ? "all" : cat.category}
            >
              {cat.category}
            </option>
          ))}
        </select>
      </div>

      {/* Language dropdown */}
      <div className="form-group">
        <label htmlFor="language-select">Language:</label>
        <select
          id="language-select"
          value={selectedLanguage}
          onChange={handleLanguageChange}
          disabled={isLoading}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* News script display */}
      <div className="news-script">
        <h3>Current News Script:</h3>
        {isLoading ? (
          <p>Loading...</p>
        ) : newsScript ? (
          <div className="script-content">
            <p>{newsScript}</p>
          </div>
        ) : (
          <p>No news content available</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="action-buttons">
        <button
          onClick={handleGenerateAudio}
          disabled={
            isLoading ||
            !newsScript ||
            newsScript.trim().length === 0 ||
            newsScript.includes("don't have any updates")
          }
        >
          Generate Audio
        </button>

        <button
          onClick={handlePlayAudio}
          disabled={isLoading || !audioUrl || isPlaying}
        >
          {isPlaying ? "Playing..." : "Play Audio"}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* Audio element */}
      {audioUrl && (
        <div className="audio-player">
          <audio
            controls
            src={audioUrl}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onError={(e) => {
              setError("Error loading audio");
              console.error(e);
            }}
          />
          <p>
            <a href={audioUrl} download="news_audio.mp3">
              Download Audio
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsVoicePlayer;
