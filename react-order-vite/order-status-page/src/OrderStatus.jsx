import React, { useState, useEffect } from 'react';
import { Modal, Button as BootstrapButton } from 'react-bootstrap';
import { Check, CupHotFill, PersonFill, Bicycle, HouseDoorFill, GeoAltFill, Shop, TelephoneFill } from 'react-bootstrap-icons';
import confetti from 'canvas-confetti';

import drinkImg from './classic matchabara cold brew.png';
import riderImage from './motorbike.png'; 
import capybarabarista from './capybarabarista.png';
import capybaralooking from './capybaralooking.png';
import capybararider from './capybararider.png';
import capybaradelivered from './capybaradelivered.png';
import capybarasad from './capybarasad.png';

const OrderStatus = () => {
    const [currentStep, setCurrentStep] = useState(1); 
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [orderStatus, setOrderStatus] = useState('active'); // active or cancelled
    const isCancelDisabled = currentStep >= 2 || orderStatus === 'cancelled'; 

    // Select status logo based on progress
    const getStatusLogo = () => {
        if (currentStep === 1) return capybarabarista;
        if (currentStep === 2) return capybaralooking;
        if (currentStep === 3) return capybararider;
        if (currentStep === 4) return capybaradelivered;
        return capybarabarista;
    };

    // Confetti effect for delivery stage
    useEffect(() => {
        if (currentStep === 4 && orderStatus !== 'cancelled') {
            const duration = 3 * 1000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#3B302A', '#617A55', '#FFC107'] });
                confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#3B302A', '#617A55', '#FFC107'] });
                if (Date.now() < end) requestAnimationFrame(frame);
            };
            frame();
        }
    }, [currentStep, orderStatus]);

    // Automatic progress timer
    useEffect(() => {
        if (orderStatus === 'cancelled') return;
        
        const timer = setInterval(() => {
            setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
        }, 15000); 
        return () => clearInterval(timer);
    }, [orderStatus]);

    // Refresh page function
    const handleManualRefresh = () => {
        window.location.reload();
    };

    // Confirm order cancellation
    const handleCancelOrder = () => {
        setOrderStatus('cancelled');
        setShowCancelModal(false);
    };

    const steps = [
        { label: "Order Received", icon: <Check /> },
        { label: "Preparing", icon: <CupHotFill /> },
        { label: "Looking for Rider", icon: <PersonFill /> },
        { label: "In Transit", icon: <Bicycle /> },
        { label: "Delivered", icon: <HouseDoorFill /> },
    ];

    const items = [
        { name: "Classic Matchabara Cold Brew", size: "Medium", price: 120.00, qty: 1 },
        { name: "Vanibara Frappe", size: "Large", price: 140.00, qty: 1 }
    ];

    const riderInfo = {
        name: "Joshia Garcia", 
        vehicle: "Honda Click (ABC 123)",
        contact: "+63 917 555 1234"
    };

    // UI for cancelled state
    if (orderStatus === 'cancelled') {
        return (
            <div className="grab-container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f9f9f9', padding: '40px 2in' }}>
                <div className="info-card text-center p-5 fade-in" style={{ maxWidth: '500px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderRadius: '20px' }}>
                    <div className="mb-4">
                        <img src={capybarasad} alt="Cancelled" width="150" style={{ borderRadius: '15px' }} />
                    </div>
                    <h2 className="fw-bold" style={{ color: '#3B302A' }}>Order Cancelled</h2>
                    <p className="text-muted">Your order has been cancelled successfully. Your refund (if applicable) will be processed shortly.</p>
                    <BootstrapButton 
                        style={{ backgroundColor: '#3B302A', border: 'none', borderRadius: '25px', padding: '10px 30px', fontWeight: '700' }}
                        onClick={() => window.location.href = '/'}
                    >
                        Go Back to Kape Menu
                    </BootstrapButton>
                </div>
            </div>
        );
    }

    const RiderDetailsCard = ({ rider }) => (
        <div className="rider-card-wrapper fade-in" style={{ 
            border: 'none', borderRadius: '10px', padding: '20px', 
            marginTop: '30px', marginBottom: '20px', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)', backgroundColor: '#fff' 
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img 
                        src={riderImage} 
                        alt="Rider" 
                        width="45" 
                        height="45" 
                        style={{ borderRadius: '10px', border: '2px solid #617A55', objectFit: 'cover' }} 
                    />
                    <div>
                        <h6 style={{ margin: 0, fontWeight: '700', fontSize: '16px' }}>{rider.name}</h6>
                        <small style={{ color: '#888' }}>Vehicle used: {rider.vehicle}</small>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {/* CHANGED: Replaced icons with "View Rider Info" button */}
                    <BootstrapButton 
                        variant="outline-dark" 
                        size="sm" 
                        style={{ borderRadius: '20px', fontWeight: '600', padding: '5px 15px', fontSize: '12px' }}
                    >
                        View Rider Info
                    </BootstrapButton>
                </div>
            </div>
            <hr style={{ borderColor: '#eee' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '15px' }}>
                <div style={{ border: '1px solid #ddd', borderRadius: '50%', padding: '8px', background: '#f0f0f0', color: '#3B302A' }}><GeoAltFill size={20} /></div>
                <div>
                    <small style={{ color: '#888' }}>Delivering to <strong style={{color: '#333'}}>Customer Name</strong></small>
                    <p style={{ margin: 0, fontWeight: '600' }}>{rider.contact}</p> 
                </div>
            </div>
        </div>
    );

    return (
        <div className="grab-container" style={{ padding: '40px 2in', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <div className="d-flex justify-content-end mb-3">
                <BootstrapButton variant="link" onClick={handleManualRefresh} style={{ color: '#617A55', fontWeight: '700', textDecoration: 'none' }}>
                    Refresh Status
                </BootstrapButton>
            </div>

            <div className="status-header-card">
                <div className="header-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <img src={getStatusLogo()} alt="Logo" width="60" style={{ borderRadius: '8px' }} className="pulse-logo" />
                        <div style={{ textAlign: 'left' }}>
                            <h1 className="status-title">
                                {currentStep === 1 && "Your order is being prepared!"}
                                {currentStep === 3 && "Your rider is on the way!"}
                                {currentStep < 3 && currentStep !== 1 && "Looking for a rider..."}
                                {currentStep === 4 && "Delivered!"}
                            </h1>
                        </div>
                    </div>
                    <button 
                        className="cancel-btn" 
                        onClick={() => setShowCancelModal(true)}
                        disabled={isCancelDisabled}
                        style={{
                            backgroundColor: isCancelDisabled ? '#ccc' : '#FF4D4F',
                            cursor: isCancelDisabled ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Cancel Order
                    </button>
                </div>

                <div className="timeline-wrapper">
                    <div className="timeline-line"></div>
                    <div className="timeline-progress" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>

                    <div className="steps-flex">
                        {steps.map((step, index) => (
                            <div key={index} className="timeline-step">
                                <div className={`timeline-dot ${index <= currentStep ? 'active' : ''} ${index === currentStep ? 'current-pulse' : ''}`}>
                                    {step.icon}
                                </div>
                                <span className={`timeline-label ${index <= currentStep ? 'active' : ''}`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Connecting loader for Step 2 */}
            {currentStep === 2 && (
                <div className="info-card mb-4 text-center p-4 fade-in" style={{ backgroundColor: '#fff', border: '1px dashed #617A55' }}>
                    <div className="spinner-border spinner-border-sm text-success me-2"></div>
                    <span className="text-muted">Connecting to the nearest Kape-rider...</span>
                </div>
            )}

            {currentStep >= 3 && <RiderDetailsCard rider={riderInfo} />}

            <div className="details-grid">
                <div className="info-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <span className="section-label">Order Details</span>
                        <span style={{ color: '#888' }}>Order ID: #123456 - Nov. 20, 2025</span>
                    </div>

                    <div className="address-grid">
                        <div className="address-box" style={{ display: 'flex', gap: '15px' }}>
                            <Shop size={24} color="#3B302A" style={{ marginTop: '5px' }} />
                            <div>
                                <span className="small-label">From</span>
                                <h6>Kapebara Don Fabian Branch</h6>
                                <p>Near PUPQC</p>
                            </div>
                        </div>
                        <div className="address-box" style={{ display: 'flex', gap: '15px' }}>
                            <GeoAltFill size={24} color="#617A55" style={{ marginTop: '5px' }} />
                            <div>
                                <span className="small-label">Deliver To</span>
                                <h6>Home</h6>
                                <p>Area pakitongkitong, alimango street, Quezon City</p>
                            </div>
                        </div>
                    </div>

                    <span className="small-label" style={{ marginBottom: '15px', display: 'block' }}>Orders</span>

                    {items.map((item, index) => (
                        <div key={index} className="order-item">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={drinkImg} className="item-img" alt="Item" />
                                <div>
                                    <h6 style={{ margin: 0, fontSize: '16px' }}>
                                        <span style={{ color: '#617A55', fontWeight: '800', marginRight: '8px' }}>{item.qty}x</span>
                                        {item.name}
                                    </h6>
                                    <small style={{ color: '#888' }}>Size: {item.size}</small>
                                </div>
                            </div>
                            <span style={{ fontWeight: '700' }}>₱{item.price.toFixed(2)}</span>
                        </div>
                    ))}

                    <div className="note-box">
                        <span style={{ fontWeight: '700', fontSize: '14px', display: 'block', marginBottom: '5px' }}>Order Note:</span>
                        <p style={{ margin: 0, fontStyle: 'italic', color: '#555' }}>"Please less ice on the Matcha. Thank you!"</p>
                    </div>
                </div>

                <div className="info-card" style={{ height: 'fit-content' }}>
                    <span className="section-label">Payment Summary</span>

                    <div style={{ marginTop: '20px' }}>
                        <div className="bill-row"><span>Subtotal</span><span>₱260.00</span></div>
                        <div className="bill-row"><span>Delivery Fee</span><span>₱0.00</span></div>
                        <div className="bill-row"><span>VAT</span><span>₱0.00</span></div>

                        <div className="total-row">
                            <span>GRAND TOTAL</span>
                            <span>₱260.00</span>
                        </div>
                    </div>

                    <hr style={{ margin: '25px 0', borderColor: '#eee' }} />

                    <span className="small-label">Payment Method</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', background: '#F1F8FF', padding: '15px', borderRadius: '8px', border: '1px solid #D0E3F5' }}>
                        <div style={{ background: '#007BFF', color: 'white', padding: '4px 8px', borderRadius: '4px', fontWeight: '800', fontSize: '11px' }}>
                            GCash
                        </div>
                        <span style={{ fontWeight: '600', color: '#004085' }}>**** 9283</span>
                    </div>
                </div>
            </div>

            {/* Cancellation modal */}
            <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
                <Modal.Body className="text-center p-4">
                    <div className="mb-3" style={{ fontSize: '40px' }}>🍵</div>
                    <h5 className="fw-bold mb-3">Cancel your order?</h5>
                    <p className="text-muted mb-4">Are you sure? Our baristas are just about to start your order. You might lose your spot in the queue!</p>
                    <div className="d-flex gap-2">
                        <BootstrapButton variant="light" className="w-100 fw-bold" onClick={() => setShowCancelModal(false)}>No, Wait</BootstrapButton>
                        <BootstrapButton variant="danger" className="w-100 fw-bold" onClick={handleCancelOrder}>Yes, Cancel</BootstrapButton>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default OrderStatus;