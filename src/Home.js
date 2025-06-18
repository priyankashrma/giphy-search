import React, { useState, useEffect, useRef } from "react";
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

  const gridRef = useRef(null);
  const columnCountRef = useRef(3);
  const rowHeightRef = useRef(200);

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

  const loadMore = async () => {
    const previousRows = Math.ceil(gifs.length / columnCountRef.current);

    if (!currentTerm) {
      await fetchTrending(true);
    } else {
      await fetchSearch(currentTerm, true);
    }

    if (gridRef.current) {
      const outerRef = gridRef.current._outerRef;
      const targetScrollTop = previousRows * rowHeightRef.current;
      setTimeout(() => {
        outerRef.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  return (
    <div className="home-container">
      <div className="search-fixed">
        <Search
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          apiKey={API_KEY}
        />
      </div>

      <GifGrid
        gifs={gifs}
        gridRef={gridRef}
        columnCountRef={columnCountRef}
        rowHeightRef={rowHeightRef}
      />

      <div className="load-more-fixed">
        <LoadMore onClick={loadMore} />
      </div>
    </div>
  );
}
