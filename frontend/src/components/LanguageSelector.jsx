// LanguageSelector.jsx
import React from "react";

const LanguageSelector = ({ language, onLanguageChange }) => {
  return (
    <div className="language-selector">
      <label htmlFor="language" className="mr-2 font-semibold">
        Select Language:
      </label>
      <select
        id="language"
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="border border-black-300 rounded px-2 py-1 text-black"
      >
        <option value="en">English</option>
        <option value="ur">Urdu</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
