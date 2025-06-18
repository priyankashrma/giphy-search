import React from "react";
import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import "./GifGrid.css";

export default function GifGrid({
  gifs,
  gridRef,
  columnCountRef,
  rowHeightRef,
}) {
  const minItemWidth = 180;
  const itemHeightRatio = 1.2;

  const Cell = ({ columnIndex, rowIndex, style, data }) => {
    const index = rowIndex * data.columnCount + columnIndex;
    if (index >= data.gifs.length) return null;
    const gif = data.gifs[index];

    return (
      <div style={style} className="gif-item">
        <img
          src={gif.images.fixed_height_small.url}
          alt={gif.title}
          className="gif-image"
          loading="lazy"
        />
      </div>
    );
  };

  return (
    <div className="gif-grid-container">
      <AutoSizer>
        {({ height, width }) => {
          const columnCount = Math.max(1, Math.floor(width / minItemWidth));
          columnCountRef.current = columnCount;

          const columnWidth = width / columnCount;
          const rowHeight = columnWidth * itemHeightRatio;
          rowHeightRef.current = rowHeight;

          const rowCount = Math.ceil(gifs.length / columnCount);

          return (
            <Grid
              ref={gridRef}
              columnCount={columnCount}
              columnWidth={columnWidth}
              height={height}
              rowCount={rowCount}
              rowHeight={rowHeight}
              width={width}
              itemData={{ gifs, columnCount }}
            >
              {Cell}
            </Grid>
          );
        }}
      </AutoSizer>
    </div>
  );
}
