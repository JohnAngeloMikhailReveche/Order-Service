import React from 'react';

export default function MenuItem({ item, onAdd }) {
  return (
    <div className="menu-item">
      {item.image && (
        <img src={item.image} alt={item.name} className="menu-item-image" />
      )}
      <div className="menu-item-body">
        <div className="menu-item-name">{item.name}</div>
        <div className="menu-item-desc">{item.description}</div>
        <div className="menu-item-footer">
          <div className="menu-item-price">${item.price.toFixed(2)}</div>
          <button className="menu-item-add" onClick={() => onAdd && onAdd(item)}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
