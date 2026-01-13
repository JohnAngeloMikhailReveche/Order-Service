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

const API_BASE_URL = "https://localhost:7237/api/Orders";

function App() {
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("All");
    const [sortBy, setSortBy] = useState("recent");
    const [modalShow, setModalShow] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalMode, setModalMode] = useState("update");
    const [newStatus, setNewStatus] = useState("");
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false); // added to avoid undefined reference

    // --- HELPER FUNCTIONS ---
    const fetchWithRetry = async (url, options = {}, retries = 5, backoff = 1000) => {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (err) {
            if (retries > 0) {
                await new Promise(resolve => setTimeout(resolve, backoff));
                return fetchWithRetry(url, options, retries - 1, backoff * 2);
            }
            throw err;
        }
    };

    const formatOrderDate = (dateString) => {
        if (!dateString) return "no date, rip";
        try {
            const d = new Date(dateString);
            if (isNaN(d.getTime())) return "invalid date";
            const pad = (n) => n.toString().padStart(2, '0');
            const month = pad(d.getMonth() + 1);
            const day = pad(d.getDate());
            const year = d.getFullYear().toString().slice(-2);
            const hours = pad(d.getHours());
            const minutes = pad(d.getMinutes());
            const seconds = pad(d.getSeconds());
            return `${month}/${day}/${year} - ${hours}:${minutes}:${seconds}`;
        } catch (e) {
            console.error("it's a flop:", e);
            return "error lol";
        }
    };

    // --- THE LIVE LOAD FUNCTION ---
    const loadOrders = async () => {
        try {
            let filterParam = activeTab.toLowerCase();
            if (filterParam === "canceled") filterParam = "cancelled";
            const sortParam = sortBy === "recent" ? "newest" : "oldest";

            const data = await fetchWithRetry(`${API_BASE_URL}/admin/history?filter=${filterParam}&sortOrder=${sortParam}`);

            if (Array.isArray(data)) {
                const mappedOrders = data.map(o => {
                    let displayStatus = "Ongoing";
                    if (o.statusName === "Cancelled" || o.statusName === "Failed") {
                        displayStatus = "Canceled";
                    } else if (o.statusName === "Delivered" || o.statusName === "Completed") {
                        displayStatus = "Completed";
                    }

                    return {
                        id: o.orders_id,
                        name: `Order ${o.orders_id}`,
                        status: displayStatus,
                        progress: o.statusName,
                        items: o.item_count,
                        date: formatOrderDate(o.placed_at),
                        price: o.total_cost,
                        cancelReason: o.cancellation_reason,
                        cancelNotes: o.cancellation_requested ? "Drama Pending 🚩" : "N/A",
                        image: classic_coffeebara_cold_brew_Pic,
                        rawStatusValue: o.statusValue,
                        cancellationRequested: o.cancellation_requested,
                        customerName: "Guest User"
                    };
                });
                setOrders(mappedOrders);
            } else {
                setOrders([]);
            }
        } catch (err) {
            console.error("The backend is being a hater, sis:", err);
        }
    };

    // Trigger load on tab/sort change
    useEffect(() => {
        loadOrders();
    }, [activeTab, sortBy]);

    const tabs = ["All", "Ongoing", "Completed", "Canceled"];

    // Filtering is now handled by the backend query, but we keep this for consistency
    const filteredOrders = orders;

    const openModal = (order) => {
        setSelectedOrder(order);
        if (order.status === "Canceled" || order.cancellationRequested) {
            setModalMode("cancel");
            setModalShow(true);
        } else {
            setShowUpdateModal(true);
        }
        setNewStatus(order.status);
    };

    const handleUpdateStatusAction = async (orderId, newStatusName) => {
        const statusMap = {
            "Preparing": 2,
            "Ready for Pickup": 3,
            "Cancel": 7,
            "Cancelled": 7
        };

        const payload = {
            orderId: orderId,
            newStatus: statusMap[newStatusName] || 1,
            userRole: "admin"
        };

        const url = `${API_BASE_URL}/status`;

        try {
            const res = await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // Accept 200/201/204 as success. If body exists, try to parse it.
            if (res.ok) {
                // If server returns JSON, parse it; ignore if empty
                const text = await res.text().catch(() => '');
                if (text) {
                    try { JSON.parse(text); } catch { /* non-json body is fine */ }
                }
                await loadOrders();
                return;
            }

            // Non-ok status — try to get server message
            const errText = await res.text().catch(() => '');
            throw new Error("Status can't go backwards.");
        } catch (err) {
            console.error("Error updating order status:", err);
            throw err; // let modal show the error and clear its loader
        }
    };

    const handleApproveCancel = () => {
        // In a real app, you'd call a PATCH/POST here too!
        setModalShow(false);
        loadOrders();
    };

    const handleRejectCancel = () => {
        setModalShow(false);
        loadOrders();
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
                            <Nav.Link as={Link} to="/admin/admincancellations">Menu</Nav.Link>
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
                                    className={`rounded-pill tab-compact me-2 custom-tab ${activeTab === tab ? "active" : ""
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
                                                className={`fw-semibold ${order.status === "Ongoing"
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
                        )))
                    }
                </Card>
            </div>

            {/*MODALS*/}
            {showUpdateModal && selectedOrder && (
                <UpdateOrderStatusModal
                    onClose={() => setShowUpdateModal(false)}
                    orderData={{
                        orderId: selectedOrder.id,
                        // pass the already-formatted date string from the order list
                        orderDate: selectedOrder.date,
                    }}
                    initialStatus={selectedOrder.progress}
                    onUpdateStatus={handleUpdateStatusAction}
                />
            )}
        </>
    );
}

export default App;