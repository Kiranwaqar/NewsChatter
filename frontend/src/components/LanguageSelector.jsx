// LanguageSelector.jsx - Component for selecting the news language
import React from "react";

const LanguageSelector = ({ language, onLanguageChange }) => {
  // Enhanced language options with appropriate language codes
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

  return (
    <div className="flex items-center bg-black bg-opacity-70 p-2 rounded-lg shadow-lg">
      <label htmlFor="language-select" className="mr-2 text-white">
        Language:
      </label>
      <select
        id="language-select"
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="bg-gray-800 text-white border border-gray-700 rounded p-1"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
