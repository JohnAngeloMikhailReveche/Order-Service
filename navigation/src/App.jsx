import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import OrderCart from "./pages/order/OrderCart/OrderCart";
import Checkout from "./pages/order/checkout/checkout";
import OrderStatus from "./pages/order/OrderStatus/OrderStatus";
import OrderHistory from "./pages/order/OrderHistory/OrderHistory";
import OrderDetails from "./pages/order/OrderDetails/OrderDetails";
import AdminDashboard from "./pages/admin/AdminDashboard/AdminDashboard";
import AdminCancellations from "./pages/admin/AdminCancellations/AdminCancellations";
import RiderDashboard from "./pages/rider/RiderDashboard";
// import OrderCart from "./pages/order/OrderCart/OrderCart"; 

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/order/order" replace />} />
          <Route path="/order/order" element={<OrderCart />} />
          <Route path="/order/checkout" element={<Checkout />} />
          <Route path="/order/orderstatus" element={<OrderStatus />} />
          <Route path="/order/orderhistory" element={<OrderHistory />} />
          <Route path="/order/orderdetails" element={<OrderDetails />} />
          <Route path="/admin/admindashboard" element={<AdminDashboard />} />
          <Route path="/admin/admincancellations" element={<AdminCancellations />} />
          {/* <Route path="/order/:menuItemId" element={<OrderCart />} /> */}
          <Route path="/rider/riderdashboard" element={<RiderDashboard />} />

        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
