import React, { useState, useEffect, createContext } from "react";
import { Card, Row, Col, ButtonGroup, ToggleButton, Button } from "react-bootstrap";
import "./RiderDashboard.css";
import classic_coffeebara_cold_brew_Pic from "./classic coffeebara cold brew.png";
import UpdateOrderStatusModal from "./UpdateDeliveryStatusModal";

export const UserContext = createContext();

function RiderDashboard() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [user] = useState({
    role: "rider",
    name: "Rider User",
    isAuthenticated: true
  });

  const tabs = ["All", "Ongoing", "Delivered", "Failed to Deliver"];

  const normalizeStatus = (status) => status.toLowerCase().replace(/[-_]/g, " ").trim();
  const getStatusClass = (status) => {
    const s = normalizeStatus(status);
    if (s === "in transit") return "status-intransit"; 
    if (s === "delivered") return "status-delivered"; 
    return "status-failed";                         
  };

  const tabFilters = {
    "All": () => true,
    "Ongoing": o => normalizeStatus(o.progress) === "in transit",
    "Delivered": o => normalizeStatus(o.progress) === "delivered",
    "Failed to Deliver": o => normalizeStatus(o.progress) === "failed to deliver"
  };

  useEffect(() => {
    // MOCK ORDERS
    const mockOrders = [
      {
        id: 101,
        status: "In-Transit",
        progress: "In-Transit",
        date: "2026-01-23T10:15:00",
        items: 3,
        image: classic_coffeebara_cold_brew_Pic,
        customerName: "Alice",
        deliveryAddress: "123 Main St, Springfield"
      },
      {
        id: 102,
        status: "Delivered",
        progress: "Delivered",
        date: "2026-01-22T15:42:00",
        items: 2,
        image: classic_coffeebara_cold_brew_Pic,
        customerName: "Bob",
        deliveryAddress: "456 Elm St, Springfield"
      },
      {
        id: 103,
        status: "Failed to Deliver",
        progress: "Failed to Deliver",
        date: "2026-01-23T09:30:00",
        items: 1,
        image: classic_coffeebara_cold_brew_Pic,
        customerName: "Charlie",
        deliveryAddress: "789 Oak St, Springfield"
      },
    ];

    // FOR BE LATER!!!!!
    // fetch("/api/orders")
    //   .then(res => res.json())
    //   .then(data => setOrders(data))
    //   .catch(err => console.error(err));

    setOrders(mockOrders);
  }, []);

  const filteredOrders = orders.filter(tabFilters[activeTab]);
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (sortBy === "recent") return dateB - dateA;
    if (sortBy === "oldest") return dateA - dateB;
    return 0;
  });

  return (
    <UserContext.Provider value={user}>
      <div style={{ padding: "50px 20px", display: "flex", justifyContent: "center" }}>
        <Card className="dashboard-card" style={{ width: "800px", padding: "24px" }}>
          <h1 className="fw-bold">Rider Dashboard</h1>
          <p className="text-muted">Manage your deliveries efficiently.</p>

          {/* Tabs */}
          <div className="d-flex justify-content-start align-items-center mb-4">
            <ButtonGroup size="sm">
              {tabs.map(tab => (
                <ToggleButton
                  key={tab}
                  type="radio"
                  size="sm"
                  checked={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-pill tab-compact me-2 custom-tab ${activeTab === tab ? "active" : ""}`}
                >
                  {tab}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </div>

          {/* Sort by */}
          <div className="sort-row mb-3">
            <span className="sort-label">Sort by</span>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Orders */}
          {sortedOrders.map(order => (
            <Card key={order.id} className="mb-2">
              <Card.Body>
                <Row className="align-items-center">
                  <Col xs="auto">
                    <img src={order.image} width={55} style={{ borderRadius: 8 }} />
                  </Col>
                  <Col>
                    <div className="fw-semibold">Order #{order.id}</div>
                    <div className={getStatusClass(order.progress)}>{order.progress}</div>
                    <small>{new Date(order.date).toLocaleString()}</small>
                    <div style={{ fontSize: "0.85rem", color: "#6b6b6b" }}>{order.deliveryAddress}</div>
                  </Col>
                  <Col xs="auto">
                    <Button
                      style={{
                        color: "#3B302A",
                        textDecoration: "none",
                        padding: "4px 10px",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        border: "none",
                        backgroundColor: "transparent"
                      }}
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowModal(true);
                      }}
                    >
                      View Details
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Card>
      </div>

      {/* Modal */}
      {showModal && selectedOrder && (
        <UpdateOrderStatusModal
          onClose={() => setShowModal(false)}
          orderData={{
            orderId: selectedOrder.id,
            orderDate: new Date(selectedOrder.date).toLocaleString(),
            customerName: selectedOrder.customerName,
            deliveryAddress: selectedOrder.deliveryAddress
          }}
          initialStatus={selectedOrder.progress}
          onUpdateStatus={async (id, newStatus) => {
            const standardizedStatus = newStatus.replace(/\s+/g, "-");
            setOrders(prev =>
              prev.map(o => o.id === id ? { ...o, progress: standardizedStatus, status: standardizedStatus } : o)
            );

            // FOR BE LATER!!!
            // await fetch(`/api/orders/${id}/status`, {
            //   method: "PATCH",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify({ status: standardizedStatus })
            // });

            setShowModal(false);
          }}
        />
      )}
    </UserContext.Provider>
  );
}

export default RiderDashboard;