import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import './MenuCard.css';

export default function MenuCard({ item }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleView = () => {
    navigate(`/order/cart/${item.id}`);
  };

  const handleImageError = () => {
    console.warn('Failed to load image:', item.image);
    setImageError(true);
  };

  return (
    <Card className="menu-card">
      {!imageError ? (
        <Card.Img 
          variant="top" 
          src={item.image} 
          alt={item.displayName || item.name}
          className="menu-card-image"
          onError={handleImageError}
        />
      ) : (
        <div className="menu-card-image" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#F5F5F5',
          color: '#757575'
        }}>
          No Image
        </div>
      )}
      <Card.Body className="menu-card-body">
        <Card.Title className="menu-card-name">{item.displayName || item.name}</Card.Title>
        <Card.Text className="menu-card-price">₱{item.price}</Card.Text>
        <Button 
          className="menu-card-view-btn"
          onClick={handleView}
        >
          View
        </Button>
      </Card.Body>
    </Card>
  );
}