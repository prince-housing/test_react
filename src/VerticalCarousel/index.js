import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";

const VerticalCarousel = ({ initialIndex = 0, onSlideChange }) => {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const scrollToSlide = useCallback((index) => {
    const container = containerRef.current;
    const slide = container.children[index];
    if (slide) {
      container.scrollTo({
        top: slide.offsetTop,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    scrollToSlide(initialIndex);
  }, [initialIndex, scrollToSlide]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.isComposing || event.keyCode === 229) {
        return;
      }
      if (event.keyCode === 38) {
        scrollToSlide(currentIndex - 1);
      }
      if (event.keyCode === 40) {
        scrollToSlide(currentIndex + 1);
      }
    },
    [scrollToSlide, currentIndex]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleOnScroll = debounce((e) => {
    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const slideRef = container.children[currentIndex]
    const slideHeight = slideRef.clientHeight;
    const newIndex = Math.ceil(scrollTop/slideHeight);
    onSlideChange?.(newIndex);
    setCurrentIndex(newIndex);
  }, 200);

  return (
    <div className="snapContainer" ref={containerRef} onScroll={handleOnScroll}>
      <div className="snapSlideContainer">
        <p>Content 1</p>
      </div>
      <div className="snapSlideContainer">
        <p>Content 2</p>
      </div>
      <div className="snapSlideContainer">
        <p>Content 3</p>
      </div>
      <div className="snapSlideContainer">
        <p>Content 4</p>
      </div>
      <div className="snapSlideContainer">
        <p>Content 5</p>
      </div>
    </div>
  );
};

export default VerticalCarousel;
