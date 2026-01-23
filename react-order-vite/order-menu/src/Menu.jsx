import React, { useEffect, useState } from 'react';
import { fetchMenu } from './api';
import MenuItem from './MenuItem';
import './styles.css';

export default function Menu({ onAdd }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchMenu()
      .then((data) => {
        if (mounted) setItems(data);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="menu-loading">Loading menu…</div>;

  return (
    <div className="order-menu">
      {items.map((item) => (
        <MenuItem key={item.id} item={item} onAdd={onAdd} />
      ))}
    </div>
  );
}
