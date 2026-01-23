const sampleMenu = [
  { id: '1', name: 'Margherita Pizza', description: 'Tomato, mozzarella, basil', price: 8.5, image: '' },
  { id: '2', name: 'Pepperoni Pizza', description: 'Pepperoni, tomato, cheese', price: 9.5, image: '' },
  { id: '3', name: 'Caesar Salad', description: 'Romaine, parmesan, croutons', price: 6.0, image: '' }
];

export async function fetchMenu() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(sampleMenu), 250);
  });
}
