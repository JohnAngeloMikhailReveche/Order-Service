import React, { useRef, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import MenuCard from './MenuCard';
import './MenuSection.css';

export default function MenuSection({ title, subtitle, items }) {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Calculate scroll amount (width of 3-4 cards)
  const getScrollAmount = () => {
    if (!scrollContainerRef.current) return 0;
    const cardWidth = 292; // card width (260px) + gap (32px)
    return cardWidth * 3; // Scroll 3 cards at a time
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

  return (
    <div className="menu-section">
      <div className="menu-section-header">
        <h2 className="menu-section-title">{title}</h2>
        <p className="menu-section-subtitle">{subtitle}</p>
      </div>
      <div className="menu-section-content-wrapper">
        {showLeftArrow && (
          <button 
            className="menu-section-arrow menu-section-arrow-left"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <div 
          className="menu-section-scroll" 
          ref={scrollContainerRef}
        >
          {items.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
        {showRightArrow && (
          <button 
            className="menu-section-arrow menu-section-arrow-right"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}