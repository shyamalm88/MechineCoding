import { useCallback } from "react";
import { useState, useLayoutEffect, useEffect, useRef } from "react";

const CONTAINER_HEIGHT = 200;
const OVERSCAN = 5;

export default function VirtualList({items}){
  const [scrollTop, setScrollTop] = useState(0);  
  const [itemHeight, setItemHeight] = useState(0);

  const firstItemRef = useRef(null);

  useLayoutEffect(()=>{
    if(firstItemRef.current && !itemHeight){
      const height = firstItemRef.current.getBoundingClientRect().height;
      setItemHeight(height);
    }
  }, [itemHeight])

  const handleScroll = useCallback((e)=>{
    setScrollTop(e.target.scrollTop);
  })


  if(!itemHeight){
    return(<div style={{height: CONTAINER_HEIGHT}}>
      <div ref={firstItemRef}>{items[0]}</div>
    </div>)
  }


  const totalItems = items.length;
  const visibleCount = Math.ceil(CONTAINER_HEIGHT / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop/itemHeight) - OVERSCAN);
  const endIndex = Math.min(totalItems, startIndex+visibleCount+OVERSCAN)

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = totalItems * itemHeight;
  const offsetY =  startIndex * itemHeight


  return(
    <div
      onScroll={handleScroll}
      style={{
        height: CONTAINER_HEIGHT,
        overflowY: "auto",
        border: "1px solid #ccc"
      }}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={{
                height: itemHeight,
                display: "flex",
                alignItems: "center",
                paddingLeft: 12,
                borderBottom: "1px solid #eee",
                boxSizing: "border-box"
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

}