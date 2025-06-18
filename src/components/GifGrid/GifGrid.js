import React from "react";
import "./GifGrid.css";

export default function GifGrid({ gifs }) {
  return (
    <div className="gif-grid">
      {gifs.map((gif) => (
        <div key={gif.id} className="gif-item">
          <img
            src={gif.images.fixed_height.url}
            alt={gif.title}
            className="gif-image"
          />
        </div>
      ))}
    </div>
  );
}
