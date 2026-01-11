import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, Card, Row, Col, ButtonGroup, ToggleButton, Button, Modal, Form } from "react-bootstrap";
import "./AdminDashboard.css";
import classic_matchabara_cold_brew_Pic from "./classic matchabara cold brew.png";
import classic_macchiabara_cold_brew_Pic from "./classic macchiabara cold brew.png";
import classic_coffeebara_cold_brew_Pic from "./classic coffeebara cold brew.png";
import kapebara_logo_transparent_Pic from "./kapebara logo transparent.png";
import kapebara_cart_Pic from "./kapebara cart.jpg";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import UpdateOrderStatusModal from "../AdminModals/UpdateOrderStatusModal";

function App() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [modalShow, setModalShow] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalMode, setModalMode] = useState("update");
  const [newStatus, setNewStatus] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const fetchedOrders = [
      {
        id: 1230001,
        name: "Classic Matchabara Cold Brew",
        status: "Ongoing",
        progress: "Preparing",
        items: 1,
        date: "2025-12-04T10:00:00",
        price: 120,
        image: classic_matchabara_cold_brew_Pic
      },
      {
        id: 1230002,
        name: "Classic Macchiabara Cold Brew",
        status: "Canceled",
        progress: "Canceled",
        items: 1,
        date: "2025-12-04T10:00:00",
        price: 130,
        cancelReason: "Changed my mind",
        cancelNotes: "N/A",
        image: classic_macchiabara_cold_brew_Pic
      },
      {
        id: 1230003,
        name: "Classic Coffeebara Cold Brew",
        status: "Completed",
        progress: "Delivered",
        items: 1,
        date: "2025-12-04T10:00:00",
        price: 100,
        image: classic_coffeebara_cold_brew_Pic
      },
    ];

    setOrders(fetchedOrders);
  }, []);

  const tabs = ["All", "Ongoing", "Completed", "Canceled"];

  const filteredOrders = (
    activeTab === "All"
      ? orders
      : orders.filter((o) => o.status === activeTab)
  ).sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortBy === "recent" ? dateB - dateA : dateA - dateB;
   
  });

  const openModal = (order) => {
    setSelectedOrder(order);

    if (order.status === "Canceled") {
      setModalMode("cancel");
      setModalShow(true);
    } else {
      setShowUpdateModal(true);
    }
    setNewStatus(order.status);
  };

  const handleUpdateOrderStatus = (orderId, status) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
        ? { ...order, progress: status, status: newStatus === "Delivered" ? "Completed" : "Ongoing" }
        : order
      )
    );
    setShowUpdateModal(false);
  };

  const handleApproveCancel = () => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === selectedOrder.id
        ? { ...order, status: "Canceled" }
        : order
      )
    );
    setModalShow(false);
  };

  const handleRejectCancel = () => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === selectedOrder.id
        ? { ...order, status: "Ongoing", cancelReason: null }
        : order
      )
    );
    setModalShow(false);
  };

  return (
    <>
      {/* Navbar */}
      <Navbar expand="lg" className="navbar" fixed="top">
  <Container>
    <Navbar.Brand as={Link} to="/">
      <img src={kapebara_logo_transparent_Pic} height="30" className="d-inline-block align-text-top" />
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="center-nav" />
    <Navbar.Collapse id="center-nav" className="w-100 justify-content-center">
      <Nav className="ms-auto gap-4 align-items-center">
        <Nav.Link as={Link} to="/order/order">Home</Nav.Link>
        <Nav.Link as={Link} to="/order/order">Menu</Nav.Link>
        <Nav.Link as={Link} to="/order/orderhistory">My Orders</Nav.Link>
        <Nav.Link as={Link} to="/admin/admindashboard">My Profile</Nav.Link>
        <Nav.Link
          as={Link} 
          to="#cart"
          onClick={(e) => {
            e.preventDefault();
            setIsCartOpen(!isCartOpen);
          }}
        >
          <img src={kapebara_cart_Pic} height="30" style={{ objectFit: "contain" }} />
        </Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

      {/* Card something */}
      <div style={{ display: "flex", justifyContent: "center", padding: "40px 20px" }}>
        <Card className="card-glossy" style={{ maxWidth: "800px", width: "100%", padding: "24px", height: "600px" }}>
          {/* Header */}
          <h1 className="fw-bold mb-1">Admin Order Dashboard</h1>
          <p className="text-muted mb-4">Track and manage all orders effortlessly.</p>

          {/* Filter + Sort */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <ButtonGroup>
              {tabs.map((tab) => (
                <ToggleButton key={tab} type="radio" checked={activeTab === tab} onClick={() => setActiveTab(tab)}
                  className={`rounded-pill tab-compact me-2 custom-tab ${
                    activeTab === tab ? "active" : ""
                  }`}
                >
                  {tab}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </div>
          {/* Sort by, left side) */}
          <div className="sort-row mb-3">
            <span className="sort-label">Sort by</span>
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recent">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Order list */}
          {filteredOrders.length === 0 ? (
            <div className="text-center text-muted py-4">
              No orders found.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="mb-3 border-0 shadow-sm">
                <Card.Body>
                  <Row className="align-items-center">
                    {/* Image */}
                    <Col xs="auto">
                      <img
                        src={order.image}
                        alt={order.name}
                        width={55}
                        style={{ borderRadius: "8px" }}
                      />
                    </Col>

                    {/* Details */}
                    <Col>
                      <div className="fw-semibold">Order #{order.id}</div>
                      <div
                        className={`fw-semibold ${
                          order.status === "Ongoing"
                            ? "text-warning"
                            : order.status === "Completed"
                            ? "text-success"
                            : "text-danger"
                        }`}
                      >
                        {order.progress || order.status}
                      </div>

                      <div className="text-muted small">
                        {order.items} Item(s) · {order.date}
                      </div>
                    </Col>

                    {/* View Details/Popup Button */}
                    <Col xs="auto">
                    <Button size="sm" variant="link" className="view-link" onClick={() => openModal(order)}>View Details</Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          )}
        </Card>
      </div>

{/*MODALS*/}
{showUpdateModal && selectedOrder && (
  <UpdateOrderStatusModal
    onClose={() => setShowUpdateModal(false)}
    orderData={{
      orderId: selectedOrder.id,
      orderDate: new Date(selectedOrder.date).toLocaleDateString(),
      customerName: "Customer Name",
    }}
    initialStatus={selectedOrder.progress}
    onUpdateStatus={handleUpdateOrderStatus}
  />
)}
    </>
  );
}

export default App;