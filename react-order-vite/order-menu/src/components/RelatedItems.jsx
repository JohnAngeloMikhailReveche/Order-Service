import React, { useRef, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import MenuCard from './MenuCard';
import './RelatedItems.css';

export default function RelatedItems({ items }) {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const getScrollAmount = () => {
    if (!scrollContainerRef.current) return 0;
    const cardWidth = 292;
    return cardWidth * 3;
  };

  const updateArrowVisibility = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    updateArrowVisibility();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateArrowVisibility);
      window.addEventListener('resize', updateArrowVisibility);
      return () => {
        container.removeEventListener('scroll', updateArrowVisibility);
        window.removeEventListener('resize', updateArrowVisibility);
      };
    }
  }, [items]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = getScrollAmount();
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = getScrollAmount();
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Container fluid className="related-items">
      <h3 className="related-items-title">Related Items</h3>
      <div className="related-items-content">
        {showLeftArrow && (
          <button 
            className="related-items-arrow related-items-arrow-left"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <div 
          className="related-items-scroll" 
          ref={scrollContainerRef}
        >
          {items.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
        {showRightArrow && (
          <button 
            className="related-items-arrow related-items-arrow-right"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    </Container>
  );
}