import React, { useState, useEffect } from "react";
import "./Home.css";
import Search from "./components/Search/Search";
import GifGrid from "./components/GifGrid/GifGrid";
import LoadMore from "./components/LoadMore/LoadMore";

const API_KEY = process.env.REACT_APP_GIPHY_API_KEY;

export default function Home() {
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState([]);
  const [offset, setOffset] = useState(0);
  const [currentTerm, setCurrentTerm] = useState("");

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async (loadMore = false) => {
    const res = await fetch(
      `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=25&offset=${
        loadMore ? offset : 0
      }&rating=g&bundle=messaging_non_clips`
    );
    const data = await res.json();
    setGifs(loadMore ? [...gifs, ...data.data] : data.data);
    setOffset(loadMore ? offset + 25 : 25);
    setCurrentTerm("");
  };

  const fetchSearch = async (term, loadMore = false) => {
    const res = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(
        term
      )}&limit=25&offset=${loadMore ? offset : 0}&rating=g&lang=en`
    );
    const data = await res.json();
    setGifs(loadMore ? [...gifs, ...data.data] : data.data);
    setOffset(loadMore ? offset + 25 : 25);
    setCurrentTerm(term);
  };

  const handleSearch = (term = query) => {
    setOffset(0);
    if (!term.trim()) {
      fetchTrending();
    } else {
      fetchSearch(term);
    }
  };

  const loadMore = () => {
    if (!currentTerm) {
      fetchTrending(true);
    } else {
      fetchSearch(currentTerm, true);
    }
  };

  return (
    <div className="home-container">
      <Search
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        apiKey={API_KEY}
      />
      <GifGrid gifs={gifs} />
      <LoadMore onClick={loadMore} />
    </div>
  );
}
