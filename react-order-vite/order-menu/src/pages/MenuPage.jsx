import React from 'react';
import { Container } from 'react-bootstrap';
import MenuSection from '../components/MenuSection';
import { getBestsellers, getItemsByCategory, getSnacks, getDesserts, getRiceMeals } from '../menuData';
import './MenuPage.css';

export default function MenuPage() {
  try {
    const bestsellers = getBestsellers();
    const coldBrews = getItemsByCategory('cold_brews');
    const classics = getItemsByCategory('classics');
    const frappes = getItemsByCategory('frappes');
    const lattes = getItemsByCategory('lattes');
    const mocktails = getItemsByCategory('mocktails');
    const snacks = getSnacks();
    const desserts = getDesserts();
    const riceMeals = getRiceMeals();

    return (
      <div className="menu-page-wrapper">
        <Container className="menu-page">
          <MenuSection
            title="Bestsellers You Can't Go Wrong With"
            subtitle="Your soon-to-be favorites, too."
            items={bestsellers}
          />
          <MenuSection
            title="Cold Brews"
            subtitle="Refreshing and smooth, perfect for any time of day."
            items={coldBrews}
          />
          <MenuSection
            title="Classics"
            subtitle="Timeless favorites that never go out of style."
            items={classics}
          />
          <MenuSection
            title="Frappes"
            subtitle="Creamy and indulgent, a treat for your taste buds."
            items={frappes}
          />
          <MenuSection
            title="Lattes"
            subtitle="Smooth and aromatic, crafted with care."
            items={lattes}
          />
          <MenuSection
            title="Mocktails"
            subtitle="Refreshing non-alcoholic beverages for everyone."
            items={mocktails}
          />
          <MenuSection
            title="Snacks"
            subtitle="Perfect for sharing and snacking."
            items={snacks}
          />
          <MenuSection
            title="Desserts"
            subtitle="Sweet treats to satisfy your cravings."
            items={desserts}
          />
          <MenuSection
            title="Rice Meals"
            subtitle="Hearty and complete meals for every appetite."
            items={riceMeals}
          />
        </Container>
      </div>
    );
  } catch (error) {
    console.error('Error rendering MenuPage:', error);
    return (
      <div className="menu-page-wrapper">
        <Container className="menu-page">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>Error loading menu</h2>
            <p>{error.message}</p>
          </div>
        </Container>
      </div>
    );
  }
}