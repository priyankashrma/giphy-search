import React, { useState, useEffect } from "react";
import "./Search.css";

function Search({ query, setQuery, onSearch, apiKey }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
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
    } catch (err) {
      console.error("Error fetching suggestions", err);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      onSearch("");
    }
  };

  const handleSuggestionClick = (text) => {
    setQuery(text);
    setSuggestions([]);
    onSearch(text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
    setSuggestions([]);
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

      {suggestions.length > 0 && (
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
