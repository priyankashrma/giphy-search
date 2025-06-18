import React from "react";
import "./LoadMore.css";

export default function LoadMore({ onClick }) {
  return (
    <button className="load-more-button" onClick={onClick}>
      🚀 Load More GIFs
    </button>
  );
}
