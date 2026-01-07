import React, { useState, useEffect } from 'react';
import { Modal, Button as BootstrapButton, Container, Row, Col } from 'react-bootstrap';
import { Check, CupHotFill, PersonFill, Bicycle, HouseDoorFill, GeoAltFill, Shop } from 'react-bootstrap-icons';
import confetti from 'canvas-confetti';

// Assets
import drinkImg from './classic matchabara cold brew.png';
import riderImage from './motorbike.png'; 
import capybarabarista from './capybarabarista.png';
import capybaralooking from './capybaralooking.png';
import capybararider from './capybararider.png';
import capybaradelivered from './capybaradelivered.png';
import capybarasad from './capybarasad.png';

const OrderStatus = () => {
    // States
    const [currentStep, setCurrentStep] = useState(1); 
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [orderStatus, setOrderStatus] = useState('active');
    const [selectedReason, setSelectedReason] = useState(""); 

    const BARA_BROWN = '#3B302A';
    const BARA_GREEN = '#617A55';
    const isCancelDisabled = currentStep >= 2 || orderStatus === 'cancelled'; 

    const getStatusLogo = () => {
        if (currentStep === 1) return capybarabarista;
        if (currentStep === 2) return capybaralooking;
        if (currentStep === 3) return capybararider;
        if (currentStep === 4) return capybaradelivered;
        return capybarabarista;
    };

    // Confetti Effect Delivered
    useEffect(() => {
        if (currentStep === 4 && orderStatus !== 'cancelled') {
            const duration = 3 * 1000;
            const end = Date.now() + duration;
            const frame = () => {
                confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: [BARA_BROWN, BARA_GREEN, '#FFC107'] });
                confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: [BARA_BROWN, BARA_GREEN, '#FFC107'] });
                if (Date.now() < end) requestAnimationFrame(frame);
            };
            frame();
        }
    }, [currentStep, orderStatus]);

    // Automatic Status Timer (Demo only)
    useEffect(() => {
        if (orderStatus === 'cancelled') return;
        const timer = setInterval(() => {
            setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
        }, 15000); 
        return () => clearInterval(timer);
    }, [orderStatus]);

    const steps = [
        { label: "RECEIVED", icon: <Check /> },
        { label: "PREPARING", icon: <CupHotFill /> },
        { label: "RIDER", icon: <PersonFill /> },
        { label: "TRANSIT", icon: <Bicycle /> },
        { label: "DELIVERED", icon: <HouseDoorFill /> },
    ];

    const items = [
        { name: "Classic Matchabara Cold Brew", size: "Medium", price: 120.00, qty: 1 },
        { name: "Vanibara Frappe", size: "Large", price: 140.00, qty: 1 }
    ];

    const openModal = (info) => {
        console.log("Opening details for:", info);
    };

    // CSS for Cancel Modal
    const modalStyles = {
        overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 },
        modal: { background: '#fff', width: '450px', maxWidth: '95%', borderRadius: '16px', padding: '25px', maxHeight: '90vh', overflowY: 'auto' },
        radioBox: (selected) => ({
            display: 'flex', gap: '10px', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer',
            backgroundColor: selected ? '#fdecec' : 'transparent', borderColor: selected ? '#c43737' : '#ddd', transition: 'all 0.2s'
        }),
        policy: { background: '#fff3cd', padding: '12px', borderRadius: '8px', marginTop: '15px', fontSize: '13px' }
    };

    if (orderStatus === 'cancelled') {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f9f9f9', padding: '20px' }}>
                <div className="text-center p-5" style={{ maxWidth: '500px', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    <img src={capybarasad} alt="Cancelled" width="150" className="mb-4" />
                    <h2 className="fw-bold" style={{ color: BARA_BROWN }}>Order Cancelled</h2>
                    <p className="text-muted">Your order has been cancelled successfully.</p>
                    <BootstrapButton style={{ backgroundColor: BARA_BROWN, border: 'none', borderRadius: '25px', padding: '10px 30px', fontWeight: '700' }} onClick={() => window.location.href = '/'}>Go Back to Menu</BootstrapButton>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px 0', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <Container style={{ maxWidth: '1100px' }}>
                
                <div className="d-flex justify-content-end mb-3">
                    <BootstrapButton variant="link" style={{ color: BARA_GREEN, fontWeight: '700', textDecoration: 'none' }} onClick={() => window.location.reload()}>Refresh Status</BootstrapButton>
                </div>

                {/* 1. PROGRESS CARD */}
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3 text-center text-md-start">
                        <div className="d-flex align-items-center gap-3 flex-column flex-md-row">
                            <img src={getStatusLogo()} alt="Logo" width="60" />
                            <h1 style={{ color: BARA_BROWN, fontWeight: '800', margin: 0, fontSize: 'clamp(1.2rem, 5vw, 1.7rem)' }}>
                                {currentStep === 1 && "Your order is being prepared!"}
                                {currentStep === 4 && "Delivered!"}
                                {currentStep > 1 && currentStep < 4 && "Order is on the way!"}
                            </h1>
                        </div>
                        <BootstrapButton 
                            onClick={() => setShowCancelModal(true)}
                            disabled={isCancelDisabled}
                            style={{ backgroundColor: isCancelDisabled ? '#ccc' : '#FF4D4F', border: 'none', borderRadius: '10px', padding: '10px 25px', fontWeight: '700' }}
                        >
                            Cancel Order
                        </BootstrapButton>
                    </div>

                    <div style={{ position: 'relative', margin: '30px 0 10px 0' }}>
                        <div style={{ position: 'absolute', top: '18px', left: '5%', right: '5%', height: '3px', backgroundColor: '#e0e0e0', zIndex: 0 }}></div>
                        <div style={{ position: 'absolute', top: '18px', left: '5%', width: `${(currentStep / 4) * 90}%`, height: '3px', backgroundColor: BARA_BROWN, zIndex: 1, transition: '0.5s ease' }}></div>
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
                                            boxShadow: isActive ? '0 0 8px rgba(0,0,0,0.1)' : 'none',
                                            fontSize: '14px'
                                        }}>{step.icon}</div>
                                        <div className="mt-2 fw-bold" style={{ 
                                            fontSize: 'clamp(8px, 2vw, 10px)', 
                                            color: isActive ? BARA_BROWN : '#888',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {step.label}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 2. RIDER INFO CARD - Edited: Only shows if step is RIDER (2) or above */}
                {currentStep >= 2 && (
                    <div style={{ border: 'none', borderRadius: '10px', padding: '15px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', backgroundColor: '#fff' }}>
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
                            <div className="d-flex align-items-center gap-3">
                                <img src={riderImage} width="45" height="45" style={{ borderRadius: '10px', border: `2px solid ${BARA_GREEN}` }} />
                                <div>
                                    <h6 style={{ margin: 0, fontWeight: '700' }}>Joshia Garcia</h6>
                                    <small style={{ color: '#888' }}>Vehicle: Honda Click (ABC 123)</small>
                                </div>
                            </div>
                            <Col xs="auto">
                                <BootstrapButton 
                                    size="sm" 
                                    variant="link" 
                                    className="view-link p-0" 
                                    style={{ color: BARA_BROWN, textDecoration: 'none', fontWeight: '700', fontSize: '13px' }} 
                                    onClick={() => openModal({name: "Joshia Garcia"})}
                                >
                                    View Rider Info
                                </BootstrapButton>
                            </Col>
                        </div>
                        <hr className="my-2" />
                        <div className="d-flex align-items-center gap-3">
                            <div style={{ border: '1px solid #ddd', borderRadius: '50%', padding: '6px', background: '#f0f0f0' }}><GeoAltFill size={18} /></div>
                            <div>
                                <small style={{ color: '#888' }}>Delivering to <strong style={{color: '#333'}}>Customer Name</strong></small>
                                <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>+63 917 555 1234</p> 
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. DETAILS GRID */}
                <Row className="g-3">
                    <Col lg={7}>
                        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #eee', height: '100%' }}>
                            <div className="d-flex justify-content-between mb-4 flex-wrap gap-2">
                                <span style={{ fontWeight: '700', fontSize: '16px' }}>Order Details</span>
                                <span style={{ color: '#888', fontSize: '13px' }}>Order ID: #123456 - Nov. 20, 2025</span>
                            </div>
                            <Row className="mb-4 g-3">
                                <Col xs={6} className="d-flex gap-2">
                                    <Shop size={20} color={BARA_BROWN} />
                                    <div>
                                        <small style={{ color: '#888', fontWeight: '700', fontSize: '9px' }}>FROM</small>
                                        <h6 style={{ margin: 0, fontSize: '13px' }}>Don Fabian Branch</h6>
                                        <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>Near PUPQC</p>
                                    </div>
                                </Col>
                                <Col xs={6} className="d-flex gap-2">
                                    <GeoAltFill size={20} color={BARA_GREEN} />
                                    <div>
                                        <small style={{ color: '#888', fontWeight: '700', fontSize: '9px' }}>DELIVER TO</small>
                                        <h6 style={{ margin: 0, fontSize: '13px' }}>Home</h6>
                                        <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>Area pakitongkitong, QC</p>
                                    </div>
                                </Col>
                            </Row>
                            <span style={{ color: '#888', fontWeight: '700', fontSize: '11px', display: 'block', marginBottom: '15px' }}>ORDERS</span>
                            {items.map((item, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <img src={drinkImg} width="40" height="40" style={{ borderRadius: '8px' }} />
                                        <div>
                                            <h6 style={{ margin: 0, fontSize: '14px' }}><span style={{ color: BARA_GREEN, fontWeight: '800' }}>{item.qty}x</span> {item.name}</h6>
                                            <small style={{ color: '#888', fontSize: '12px' }}>{item.size}</small>
                                        </div>
                                    </div>
                                    <span style={{ fontWeight: '700', fontSize: '14px' }}>₱{item.price.toFixed(2)}</span>
                                </div>
                            ))}
                            <div style={{ background: '#fcf8f6', borderLeft: `4px solid ${BARA_BROWN}`, padding: '12px', borderRadius: '8px', marginTop: '20px' }}>
                                <span style={{ fontWeight: '700', fontSize: '13px', display: 'block' }}>Order Note:</span>
                                <p style={{ margin: 0, fontStyle: 'italic', color: '#555', fontSize: '13px' }}>"Please less ice on the Matcha. Thank you!"</p>
                            </div>
                        </div>
                    </Col>

                    <Col lg={5}>
                        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #eee', height: '100%' }}>
                            <span style={{ fontWeight: '700', fontSize: '16px', display: 'block', marginBottom: '20px' }}>Payment Summary</span>
                            <div className="d-flex justify-content-between mb-2"><span>Subtotal</span><span>₱260.00</span></div>
                            <div className="d-flex justify-content-between mb-4 text-muted"><span>Delivery Fee</span><span>₱0.00</span></div>
                            
                            <div className="d-flex justify-content-between mb-4" style={{ fontWeight: '800', fontSize: '18px', color: BARA_BROWN }}>
                                <span>GRAND TOTAL</span><span>₱260.00</span>
                            </div>

                            {/* Refined Payment Method Section */}
                            <div className="d-flex justify-content-between align-items-center mt-4">
                                <small style={{ color: '#888', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>
                                    Payment Method
                                </small>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F1F8FF', padding: '5px 10px', borderRadius: '8px', border: '1px solid #D0E3F5' }}>
                                    <div style={{ background: '#007BFF', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: '800', fontSize: '9px' }}>
                                        GCash
                                    </div>
                                    <Check size={14} className="text-primary" />
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* CUSTOM CANCEL MODAL */}
            {showCancelModal && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.modal}>
                        <h2 className="fw-bold mb-1" style={{ fontSize: '20px' }}>Cancel Order</h2>
                        <p style={{ fontSize: '13px', color: '#8d837c' }}>Please select a reason to cancel your order instantly.</p>
                        <p style={{ fontSize: '12px', color: '#c43737', marginBottom: '15px' }}><em>Cancellation requests are subject to approval.</em></p>
                        
                        <p className="fw-bold mb-2" style={{ fontSize: '13px' }}>Reason for Cancellation *</p>
                        {[ "Found a better price elsewhere", "Ordered by mistake", "High delivery costs", "Need to change shipping address", "Ordered wrong item/size", "Other reason" ].map((r) => (
                            <label key={r} style={modalStyles.radioBox(selectedReason === r)}>
                                <input type="radio" name="reason" checked={selectedReason === r} onChange={() => setSelectedReason(r)} />
                                <span style={{ fontSize: '13px' }}>{r}</span>
                            </label>
                        ))}
                        
                        {selectedReason === "Other reason" && (
                            <textarea placeholder="Please provide additional details..." style={{ width: '100%', marginTop: '8px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', resize: 'none', height: '60px', fontSize: '13px' }} />
                        )}
                        
                        <div style={modalStyles.policy}>
                            <strong>Cancellation Policy</strong>
                            <p className="mb-0">Once cancelled, refunds are processed within 5–7 business days.</p>
                        </div>
                        
                        <div className="d-flex gap-2 mt-4">
                            <BootstrapButton variant="light" className="flex-grow-1 fw-bold" style={{ fontSize: '14px' }} onClick={() => setShowCancelModal(false)}>Keep Order</BootstrapButton>
                            <BootstrapButton variant="danger" className="flex-grow-1 fw-bold" style={{ backgroundColor: '#e54848', fontSize: '14px' }} onClick={() => {setOrderStatus('cancelled'); setShowCancelModal(false);}}>Cancel Order</BootstrapButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderStatus;