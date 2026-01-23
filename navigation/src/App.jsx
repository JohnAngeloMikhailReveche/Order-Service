import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Layout from "./components/Layout";
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
          <Route path="/order/order" element={<Layout><OrderCart /></Layout>} />
          <Route path="/order/checkout" element={<Layout><Checkout /></Layout>} />
          <Route path="/order/orderstatus" element={<Layout><OrderStatus /></Layout>} />
          <Route path="/order/orderhistory" element={<Layout><OrderHistory /></Layout>} />
          <Route path="/order/orderdetails" element={<Layout><OrderDetails /></Layout>} />
          <Route path="/admin/admindashboard" element={<Layout><AdminDashboard /></Layout>} />
          <Route path="/admin/admincancellations" element={<Layout><AdminCancellations /></Layout>} />
          {/* <Route path="/order/:menuItemId" element={<OrderCart />} /> */}
          <Route path="/rider/riderdashboard" element={<Layout><RiderDashboard /></Layout>} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
