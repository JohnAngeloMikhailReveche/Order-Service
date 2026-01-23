import React, { useState, useEffect, createContext } from 'react';
import { Navbar, Nav, Container, Row, Col, Button as BootstrapButton } from 'react-bootstrap';
import { Check, CupHotFill, PersonFill, Bicycle, HouseDoorFill, GeoAltFill, Shop } from 'react-bootstrap-icons';
import confetti from 'canvas-confetti';
import { Link, useLocation } from 'react-router-dom';
import './OrderStatus.css';
import { useCart } from '../../../contexts/CartContext';
import Cart from '../../../components/Cart';

/* --- DEVELOPMENT NOTES ---
    1. Mapping real database values to UI.
    2. Real-time status updates via backend API.
    3. Interval polling for status changes.
    4. Cancellation logic with backend validation.
    5. Conditional button disabling (Cancel).
*/

// --- ASSETS IMPORT ---
import kapebara_logo_transparent_Pic from './kapebara logo transparent.png';
import kapebara_cart_Pic from './kapebara cart.jpg';
import capybarabarista from './capybarabarista.png';
import capybaralooking from './capybaralooking.png';
import capybararider from './capybararider.png';
import capybaradelivered from './capybaradelivered.png';
import capybarasad from './capybarasad.png';

// --- CONTEXT CREATION ---
// 1. Create UserContext to manage user data across the component tree.
export const UserContext = createContext();

const OrderStatus = () => { 
    // --- HOOKS & ROUTING ---
    const location = useLocation(); // To access data passed from the previous page (Order ID)
    const orderIdFromState = location.state?.orderId;
    const orderItemsFromState = location.state?.orderItems;
    const orderTotalFromState = location.state?.orderTotal;
    const paymentMethodFromState = location.state?.paymentMethod || 'GCash';
    
    // --- STATE MANAGEMENT ---
    // Order Data States
    const [cartItems, setCartItems] = useState([]); 
    const [seededNumber, setSeededNumber] = useState([]); 
    const [orderId, setOrderId] = useState(null);
    const [loading, setLoading] = useState(true);

    // UI & Status States
    const [currentStep, setCurrentStep] = useState(1); 
    const [cancellationRequested, setCancellationRequested] = useState(false); 
    const [showCancelModal, setShowCancelModal] = useState(false); 
    const [orderStatus, setOrderStatus] = useState('active'); 
    const [selectedReason, setSelectedReason] = useState("");
    const { toggleCart } = useCart(); 

    // --- USER CONTEXT DATA ---
    // 2. Define the User Role (Hardcoded as Customer for this page view)
    const [user] = useState({ 
        role: 'customer', 
        name: 'Kape Lover', 
        isAuthenticated: true 
    });

    // Branding Colors
    const BARA_BROWN = '#3B302A';
    const BARA_GREEN = '#617A55';
    const BARA_BG = '#FCFDFB';
    const PRIMARY_TEXT = '#1C1C1C';
    const SECONDARY_TEXT = '#757575';

    // Steps Definition for Progress Bar
    const steps = [
        { label: "RECEIVED", icon: <Check /> },
        { label: "PREPARING", icon: <CupHotFill /> },
        { label: "RIDER", icon: <PersonFill /> },
        { label: "TRANSIT", icon: <Bicycle /> },
        { label: "DELIVERED", icon: <HouseDoorFill /> },
    ];

    // --- COMPUTED LOGIC ---
    // Logic to disable the cancel button:
    // Disabled if: Order is delivered (Step 4+), already cancelled, or cancellation is pending.
    const isCancelDisabled =
        currentStep >= 3 ||
        orderStatus == 'cancelled' ||
        cancellationRequested;

    // Calculate Financial Totals
    const subtotal = orderTotalFromState || cartItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const deliveryFee = 0;
    const grandTotal = subtotal + deliveryFee;

    // Helper: Select the correct Capybara image based on the current step
    const getStatusLogo = () => {
        if (currentStep === 1) return capybarabarista;
        if (currentStep === 2) return capybaralooking;
        if (currentStep === 3) return capybararider;
        if (currentStep === 4) return capybaradelivered;
        return capybarabarista;
    };

    // --- EFFECTS (SIDE EFFECTS) ---

    // 1. LOAD DATA: Get order details from passed state or API
    useEffect(() => {
        if (!orderIdFromState) return;

        // If order items are passed from checkout, use them
        if (orderItemsFromState && orderItemsFromState.length > 0) {
            setCartItems(orderItemsFromState);
            setOrderId(orderIdFromState);
            setCurrentStep(1); // Start at received
            setLoading(false);
            return;
        }

        // Otherwise, try to fetch from API (for existing orders)
        const fetchOrderDetails = async () => {
            try {
                // Fetch order items and status from backend
                const response = await fetch(
                    `https://localhost:7237/api/Orders/${orderIdFromState}/items`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch order items');
                }

                const data = await response.json();

                // Update state with fetched data
                setCancellationRequested(data.cancellationRequested === true); // Check if cancel was already requested
                setCartItems(data.items);
                setOrderId(data.orderId);
                setSeededNumber(data.order_number);

                // Map backend status ID to UI Steps (1-4)
                switch (data.status) {
                    case 1: setCurrentStep(1); break; // Received
                    case 2: setCurrentStep(2); break; // Preparing
                    case 3: setCurrentStep(3); break; // Rider
                    case 4: setCurrentStep(4); break; // Delivered
                    default: setCurrentStep(1);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false); // Stop loading spinner
            }
        };

        fetchOrderDetails();
    }, [orderIdFromState, orderItemsFromState]);

    // 2. ANIMATION: Trigger confetti when order is Delivered (Step 4).
    useEffect(() => {
        if (currentStep === 4 && orderStatus !== 'cancelled') {
            const duration = 3 * 1000; // 3 seconds
            const end = Date.now() + duration;
            const frame = () => {
                // Fire confetti from left and right
                confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: [BARA_BROWN, BARA_GREEN, '#FFC107'] });
                confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: [BARA_BROWN, BARA_GREEN, '#FFC107'] });
                if (Date.now() < end) requestAnimationFrame(frame);
            };
            frame();
        }
    }, [currentStep, orderStatus]);

    // --- HANDLERS ---
    
    // ACTION: Send cancellation request to the backend
    const requestCancellation = async () => {
        try {
            setCancellationRequested(true); // lock the button

            const response = await fetch(
                "https://localhost:7237/api/Orders/request-cancellation",
                {
                    method: "PATCH", 
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        orderId: orderIdFromState,
                        reason: selectedReason
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Cancellation failed.");
            }

            console.log(result.message);
            setShowCancelModal(false);
        } catch (error) {
            console.error("Cancellation error:", error);
            setCancellationRequested(false); // unlock the button on error
            alert(error.message);
        }
    };

    // Modal Styles Configuration
    const modalStyles = {
        overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 },
        modal: { background: '#fff', width: '450px', maxWidth: '95%', borderRadius: '16px', padding: '25px', maxHeight: '90vh', overflowY: 'auto', fontFamily: "'Plus Jakarta Sans', sans-serif" },
        radioBox: (selected) => ({ display: 'flex', gap: '10px', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', backgroundColor: selected ? '#fdecec' : 'transparent', borderColor: selected ? '#c43737' : '#ddd', transition: 'all 0.2s' }),
        policy: { background: '#fff3cd', padding: '12px', borderRadius: '8px', marginTop: '15px', fontSize: '13px' }
    };

    // --- RENDER: CANCELLED STATE ---
    if (orderStatus === 'cancelled') {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: BARA_BG, padding: '20px' }}>
                <div className="text-center p-5" style={{ maxWidth: '500px', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    <img src={capybarasad} alt="Cancelled" width="150" className="mb-4" />
                    <h2 className="fw-bold" style={{ color: BARA_BROWN, fontFamily: "'DM Sans', sans-serif" }}>Order Cancelled</h2>
                    <p style={{ color: SECONDARY_TEXT }}>Your order has been cancelled successfully.</p>
                    <BootstrapButton as={Link} to="/order/order" style={{ backgroundColor: BARA_BROWN, border: 'none', borderRadius: '25px', padding: '10px 30px', fontWeight: '700', fontFamily: "'DM Sans', sans-serif", textDecoration: 'none', color: 'white' }}>Go Back to Menu</BootstrapButton>
                </div>
            </div>
        );
    }

    // --- RENDER: ACTIVE STATE ---
    return (
        /* 3. Wrap everything in the UserProvider */
        <UserContext.Provider value={user}>
            {/* Navbar Section */}
            <Navbar expand="lg" className="navbar" fixed="top">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img src={kapebara_logo_transparent_Pic} height="30" className="d-inline-block align-text-top" alt="Logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="center-nav" />
                    <Navbar.Collapse id="center-nav" className="w-100 justify-content-center">
                        <Nav className="ms-auto gap-4 align-items-center">
                            <Nav.Link as={Link} to="/order/order">Order</Nav.Link>
                            <Nav.Link as={Link} to="admin/admincancellations">Cancellations</Nav.Link>
                            <Nav.Link as={Link} to="/order/orderhistory">Order History</Nav.Link>
                            <Nav.Link as={Link} to="/admin/admindashboard">Admin</Nav.Link>
                            <Nav.Link as={Link} to="#" onClick={(e) => { e.preventDefault(); toggleCart(); }}>
                                <img src={kapebara_cart_Pic} height="30" style={{ objectFit: "contain" }} alt="Cart" />
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Main Content Area */}
            <div style={{ padding: '80px 0 20px 0', backgroundColor: BARA_BG, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <Container style={{ maxWidth: '1100px' }}>
                    {/* Refresh Button */}
                    <div className="d-flex justify-content-end mb-3">
                        <BootstrapButton variant="link" style={{ color: BARA_GREEN, fontWeight: '700', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", boxShadow: 'none' }} onClick={() => window.location.reload()}>Refresh Status</BootstrapButton>
                    </div>

                    {/* PROGRESS CARD SECTION */}
                    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                        {/* Status Header & Cancel Button */}
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3 text-center text-md-start">
                            <div className="d-flex align-items-center gap-3 flex-column flex-md-row">
                                <img src={getStatusLogo()} alt="Status" width="60" />
                                <h1 style={{ color: BARA_BROWN, fontWeight: '800', margin: 0, fontSize: 'clamp(1.2rem, 5vw, 1.7rem)', fontFamily: "'DM Sans', sans-serif" }}>
                                    {currentStep === 1 && "Your order is being prepared!"}
                                    {currentStep === 4 && "Delivered!"}
                                    {currentStep > 1 && currentStep < 4 && "Order is on the way!"}
                                </h1>
                            </div>
                            <BootstrapButton 
                                onClick={() => setShowCancelModal(true)}
                                disabled={isCancelDisabled}
                                style={{ 
                                    backgroundColor: isCancelDisabled ? '#ccc' : '#FF4D4F', 
                                    border: 'none', borderRadius: '10px', padding: '10px 25px', 
                                    fontWeight: '700', fontFamily: "'DM Sans', sans-serif",
                                    boxShadow: 'none'
                                }}
                            >
                                Cancel Order
                            </BootstrapButton>
                        </div>

                        {/* Progress Bar Visualization */}
                        <div style={{ position: 'relative', margin: '30px 0 10px 0' }}>
                            {/* Gray Background Line */}
                            <div style={{ position: 'absolute', top: '18px', left: '5%', right: '5%', height: '3px', backgroundColor: '#e0e0e0', zIndex: 0 }}></div>
                            {/* Colored Progress Line */}
                            <div style={{ position: 'absolute', top: '18px', left: '5%', width: `${(currentStep / 4) * 90}%`, height: '3px', backgroundColor: BARA_BROWN, zIndex: 1, transition: '0.5s ease' }}></div>
                            {/* Steps Icons */}
                            <div className="d-flex justify-content-between position-relative" style={{ zIndex: 2 }}>
                                {steps.map((step, index) => {
                                    const isActive = index <= currentStep;
                                    return (
                                        <div key={index} className="text-center" style={{ width: '20%' }}>
                                            <div style={{ 
                                                width: '35px', height: '35px', borderRadius: '50%', 
                                                backgroundColor: isActive ? BARA_BROWN : '#fff', 
                                                color: isActive ? '#fff' : BARA_BROWN, 
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', 
                                                border: isActive ? '3px solid #fff' : `2px solid ${BARA_BROWN}`,
                                                fontSize: '14px'
                                            }}>{step.icon}</div>
                                            <div className="mt-2 fw-bold" style={{ 
                                                fontSize: 'clamp(8px, 2vw, 10px)', 
                                                color: isActive ? BARA_BROWN : SECONDARY_TEXT,
                                                whiteSpace: 'nowrap'
                                            }}>{step.label}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* DETAILS GRID (Left: Items, Right: Payment) */}
                    <Row className="g-3">
                        {/* LEFT: Order Items List */}
                        <Col lg={7}>
                            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #eee', height: '100%' }}>
                                <div className="d-flex justify-content-between mb-4 flex-wrap gap-2">
                                    <span style={{ fontWeight: '700', fontSize: '16px', fontFamily: "'DM Sans', sans-serif", color: PRIMARY_TEXT }}>Order Details</span>
                                    <span style={{ color: SECONDARY_TEXT, fontSize: '13px' }}>Order ID: #KPB-{seededNumber}</span>
                                </div>
                                
                                <span style={{ color: SECONDARY_TEXT, fontWeight: '700', fontSize: '11px', display: 'block', marginBottom: '15px', textTransform: 'uppercase' }}>ITEMS ORDERED</span>
                                
                                {cartItems.length > 0 ? (
                                    cartItems.map((item, index) => (
                                        <div key={index} className="mb-4">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <div className="d-flex align-items-center gap-3">
                                                    <img src={item.image} width="40" height="40" style={{ borderRadius: '8px', objectFit: 'cover' }} alt={item.name} />
                                                    <div>
                                                        <h6 style={{ margin: 0, fontSize: '14px', color: PRIMARY_TEXT }}>
                                                            <span style={{ color: BARA_GREEN, fontWeight: '800' }}>{item.quantity}x</span> {item.name}
                                                        </h6>
                                                        <small style={{ color: SECONDARY_TEXT, fontSize: '12px' }}>Size: {item.size}</small>
                                                    </div>
                                                </div>
                                                <span style={{ fontWeight: '700', fontSize: '14px', color: PRIMARY_TEXT }}>₱{(item.total || (item.price * item.quantity) || 0).toFixed(2)}</span>
                                            </div>
                                            {/* Display Item Notes if available */}
                                            {item.notes && (
                                                <div style={{ background: 'rgba(59, 48, 42, 0.08)', borderLeft: `3px solid ${BARA_BROWN}`, padding: '6px 12px', borderRadius: '6px', marginLeft: '53px', marginTop: '4px' }}>
                                                    <p style={{ margin: 0, color: BARA_BROWN, fontSize: '12px', lineHeight: '1.4' }}>
                                                        <strong style={{ fontWeight: '700' }}>Note: </strong>{item.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted">No items found.</p>
                                )}
                            </div>
                        </Col>

                        {/* RIGHT: Payment Summary */}
                        <Col lg={5}>
                            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #eee', height: '100%' }}>
                                <span style={{ fontWeight: '700', fontSize: '16px', display: 'block', marginBottom: '20px', fontFamily: "'DM Sans', sans-serif", color: PRIMARY_TEXT }}>Payment Summary</span>
                                <div className="d-flex justify-content-between mb-2"><span>Subtotal</span><span style={{fontWeight: '600'}}>₱{subtotal.toFixed(2)}</span></div>
                                <div className="d-flex justify-content-between mb-4 text-muted"><span>Delivery Fee</span><span>₱{deliveryFee.toFixed(2)}</span></div>
                                
                                <div className="d-flex justify-content-between mb-4" style={{ fontWeight: '800', fontSize: '18px', color: BARA_BROWN }}>
                                    <span>GRAND TOTAL</span><span>₱{grandTotal.toFixed(2)}</span>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    <small style={{ color: SECONDARY_TEXT, fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Payment Method</small>
                                    {(() => {
                                        // Determine colors based on payment method
                                        const paymentMethod = paymentMethodFromState.toLowerCase();
                                        let bgColor = '#007BFF'; // Default blue for GCash
                                        let borderColor = '#D0E3F5';
                                        let containerBg = '#F1F8FF';
                                        
                                        if (paymentMethod.includes('maya')) {
                                            bgColor = '#00C851'; // Green for Maya
                                            borderColor = '#C8E6C9';
                                            containerBg = '#E8F5E9';
                                        } else if (paymentMethod.includes('cash on delivery') || paymentMethod.includes('cod')) {
                                            bgColor = '#757575'; // Gray for COD
                                            borderColor = '#E0E0E0';
                                            containerBg = '#F5F5F5';
                                        }
                                        
                                        return (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: containerBg, padding: '5px 10px', borderRadius: '8px', border: `1px solid ${borderColor}` }}>
                                                <div style={{ background: bgColor, color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: '800', fontSize: '9px', textTransform: 'capitalize' }}>
                                                    {paymentMethodFromState}
                                                </div>
                                                <Check size={14} style={{ color: bgColor }} />
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>

                {/* MODAL: Cancellation Request */}
                {showCancelModal && (
                    <div style={modalStyles.overlay}>
                        <div style={modalStyles.modal}>
                            <h2 className="fw-bold mb-1" style={{ fontSize: '20px', fontFamily: "'DM Sans', sans-serif", color: BARA_BROWN }}>Cancel Order</h2>
                            <p style={{ fontSize: '13px', color: SECONDARY_TEXT }}>Please select a reason to cancel your order instantly.</p>
                            <p style={{ fontSize: '12px', color: '#c43737', marginBottom: '15px' }}><em>Cancellation requests are subject to approval.</em></p>
                            
                            {/* Reason Selector */}
                            <p className="fw-bold mb-2" style={{ fontSize: '13px' }}>Reason for Cancellation *</p>
                            {[ "Found a better price elsewhere", "Ordered by mistake", "High delivery costs", "Need to change shipping address", "Ordered wrong item/size", "Other reason" ].map((r) => (
                                <label key={r} style={modalStyles.radioBox(selectedReason === r)}>
                                    <input type="radio" name="reason" checked={selectedReason === r} onChange={() => setSelectedReason(r)} />
                                    <span style={{ fontSize: '13px' }}>{r}</span>
                                </label>
                            ))}

                            {/* CONDITIONAL TEXT ALERTS - Only shown when conditions are met */}
                            <div className="mt-3 text-center">
                                {cancellationRequested && (
                                    <p style={{ color: '#ef4444', fontSize: '12px', margin: '0' }}>
                                        Order cancellation already requested. Please wait for an admin to process it.
                                    </p>
                                )}
                                {currentStep >= 3 && !cancellationRequested && (
                                    <p style={{ color: '#ef4444', fontSize: '12px', margin: '0' }}>
                                        Order cannot be cancelled.
                                    </p>
                                )}
                            </div>
                            
                            {/* Modal Actions */}
                            <div className="d-flex gap-2 mt-4">
                                <BootstrapButton variant="light" className="flex-grow-1 fw-bold" style={{ fontSize: '14px', fontFamily: "'DM Sans', sans-serif", boxShadow: 'none' }} onClick={() => setShowCancelModal(false)}>Keep Order</BootstrapButton>
                                <BootstrapButton variant="danger" className="flex-grow-1 fw-bold" style={{ backgroundColor: '#e54848', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", boxShadow: 'none' }} onClick={requestCancellation}>Cancel Order</BootstrapButton>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Cart />
        </UserContext.Provider>
    );
};

export default OrderStatus;