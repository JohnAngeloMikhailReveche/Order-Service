import React from 'react';
import { Button } from 'react-bootstrap';
import './QuantitySelector.css';

export default function QuantitySelector({ quantity, onIncrease, onDecrease }) {
  return (
    <div className="quantity-selector">
      <Button 
        className="quantity-btn quantity-btn-minus"
        onClick={onDecrease}
        disabled={quantity <= 1}
      >
        −
      </Button>
      <span className="quantity-value">{quantity}</span>
      <Button 
        className="quantity-btn quantity-btn-plus"
        onClick={onIncrease}
      >
        +
      </Button>
    </div>
  );
}
