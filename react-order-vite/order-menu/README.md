Order Menu component

This folder contains a small, self-contained React menu component intended to be used inside the `react-order-vite` workspace.

Quick usage:

1. Import the `Menu` component from the package entry (relative path example):

```jsx
import { Menu } from '../order-menu/src';

function App(){
  function handleAdd(item){
    console.log('Add to cart', item);
  }
  return <Menu onAdd={handleAdd} />;
}
```

Files added:
- `src/Menu.jsx` — main component
- `src/MenuItem.jsx` — single menu item
- `src/api.js` — small mock fetch
- `src/styles.css` — local styles
- `src/index.jsx` — package exports

Copy or import the `src` folder from `react-order-vite/order-menu` into your app.
