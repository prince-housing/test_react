import React, { useState, useCallback } from "react";

const BottomSheet = (props) => {
    const { children} = props
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [sheetHeight, setSheetHeight] = useState(50);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const showBottomSheet = () => {
    setIsBottomSheetVisible(true);
    updateSheetHeight(50);
  };

  const hideBottomSheet = useCallback(() => {
    setIsBottomSheetVisible(false);
  }, [setIsBottomSheetVisible]);

  const updateSheetHeight = useCallback((height) => {
    setSheetHeight(height);
  }, []);

  const dragStart = useCallback((e) => {
    setIsDragging(true);
    setStartY(e.pageY || e.touches?.[0].pageY);
    setStartHeight(sheetHeight);
  }, [sheetHeight]);

  const dragging = useCallback((e) => {
    if (!isDragging) return;
    const delta = startY - (e.pageY || e.touches?.[0].pageY);
    const newHeight = startHeight + (delta / window.innerHeight) * 100;
    updateSheetHeight(newHeight);
  }, [isDragging, startY, startHeight, updateSheetHeight]);

  const throttledDragging = useCallback(throttle(dragging, 16), [dragging]); // Throttle to 60fps

  const dragStop = useCallback(() => {
    setIsDragging(false);
    const currentHeight = sheetHeight;
    setIsDragging(false);
    if (currentHeight < 25) {
      hideBottomSheet();
    } else if (currentHeight > 75) {
      updateSheetHeight(100);
    } else {
      updateSheetHeight(50);
    }
  }, [sheetHeight, hideBottomSheet, updateSheetHeight]);

  const debouncedDragStop = useCallback(debounce(dragStop, 100), [dragStop]); // Debounce to limit execution frequency

  return (
    <div>
      <button className="show-modal-btn" onClick={showBottomSheet}>
        Show Bottom Sheet
      </button>
      <div className={`bottom-sheet-container ${isBottomSheetVisible ? "show" : ""}`}>
        <div className="sheet-overlay" onClick={hideBottomSheet}></div>
        <div className="sheet-content" style={{ height: `${sheetHeight}vh` }}>
          <div className="sheet-header">
            <div
              className="drag-icon"
              onMouseDown={dragStart}
              onMouseMove={throttledDragging}
              onMouseUp={debouncedDragStop}
              onTouchStart={dragStart}
              onTouchMove={throttledDragging}
              onTouchEnd={debouncedDragStop}
            >
              <span></span>
            </div>
          </div>
          <div className="sheet-body">
           {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;

// Throttle function to limit the execution frequency
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Debounce function to limit the execution frequency
function debounce(func, delay) {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}
