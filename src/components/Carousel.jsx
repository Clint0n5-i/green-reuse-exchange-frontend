import React from 'react';

const Carousel = ({ items, renderItem, autoScroll = true, scrollSpeed = 30 }) => {
  const carouselRef = React.useRef(null);

  React.useEffect(() => {
    if (!autoScroll) return;
    const carousel = carouselRef.current;
    let scrollAmount = 0;
    const scrollStep = 1;
    let animationFrame;

    function scroll() {
      if (carousel) {
        carousel.scrollLeft += scrollStep;
        scrollAmount += scrollStep;
        if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
          carousel.scrollLeft = 0;
          scrollAmount = 0;
        }
      }
      animationFrame = requestAnimationFrame(scroll);
    }
    animationFrame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrame);
  }, [autoScroll, scrollSpeed]);

  return (
    <div
      ref={carouselRef}
      style={{ overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none' }}
      className="carousel flex space-x-4 py-2 no-scrollbar"
    >
      {items.map((item, idx) => (
        <div key={item.id || idx} className="inline-block">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
};

export default Carousel;
