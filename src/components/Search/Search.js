import React, { useState, useEffect, useRef } from "react";
import "./Search.css";

function Search({ query, setQuery, onSearch, apiKey }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const allowSuggestions = useRef(true);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (!allowSuggestions.current) {
      return;
    }

    const debounce = setTimeout(() => {
      fetchSuggestions(query);
    }, 400);

    return () => clearTimeout(debounce);
  }, [query]);

  const fetchSuggestions = async (term) => {
    try {
      const res = await fetch(
        `https://api.giphy.com/v1/tags/related/${encodeURIComponent(
          term
        )}?api_key=${apiKey}`
      );
      const data = await res.json();
      setSuggestions(data.data.map((item) => item.name));
      setShowSuggestions(true);
    } catch (err) {
      console.error("Error fetching suggestions", err);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    allowSuggestions.current = true;
  };

  const handleSuggestionClick = (text) => {
    setQuery(text);
    setSuggestions([]);
    setShowSuggestions(false);
    allowSuggestions.current = false;
    onSearch(text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
    setSuggestions([]);
    setShowSuggestions(false);
    allowSuggestions.current = false; // block suggestions after submit
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-wrapper">
        <input
          type="search"
          placeholder="Search GIFs, Stickers, & Clips"
          value={query}
          onChange={handleChange}
          className="search-input"
        />
        <button type="submit" className="search-button">
          🔍
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((sug, idx) => (
            <li key={idx} onClick={() => handleSuggestionClick(sug)}>
              {sug}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

export default Search;
