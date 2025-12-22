import React, { useState } from 'react';
import { Check, CupHotFill, PersonFill, Bicycle, HouseDoorFill, GeoAltFill, Shop, TelephoneFill } from 'react-bootstrap-icons';
import logo from './preparing.png';
import drinkImg from './classic matchabara cold brew.png';
import riderImage from './motorbike.png'; 

const OrderStatus = () => {
    const currentStep = 3; 
    const isCancelDisabled = currentStep >= 2; 

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

    const RiderDetailsCard = ({ rider }) => (
        <div className="rider-card-wrapper" style={{ 
            border: 'none', 
            borderRadius: '10px', 
            padding: '20px', 
            marginTop: '30px', 
            marginBottom: '20px', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)', 
            backgroundColor: '#fff' 
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img 
                        src={riderImage} 
                        alt="Rider" 
                        width="45" 
                        height="45" 
                        style={{ borderRadius: '50%', border: '2px solid #617A55', objectFit: 'cover' }} 
                    />
                    <div>
                        <h6 style={{ margin: 0, fontWeight: '700', fontSize: '16px' }}>{rider.name}</h6>
                        <small style={{ color: '#888' }}>Vehicle used: {rider.vehicle}</small>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ 
                        border: '1px solid #333', 
                        borderRadius: '50%', 
                        padding: '8px', 
                        cursor: 'pointer', 
                        color: '#333' 
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.035 6.845L8 9.585l-7.965 4.646A1 1 0 0 0 2 13h12a1 1 0 0 0 .965-.772zM1 11.105l4.708-2.89L1 5.383v5.722z"/></svg>
                    </div>
                    <div style={{ 
                        border: '1px solid #333', 
                        borderRadius: '50%', 
                        padding: '8px', 
                        cursor: 'pointer', 
                        background: '#333', 
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <TelephoneFill size={18} />
                    </div>
                </div>
            </div>

            <hr style={{ borderColor: '#eee' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '15px' }}>
                <div style={{ border: '1px solid #ddd', borderRadius: '50%', padding: '8px', background: '#f0f0f0', color: '#3B302A' }}>
                    <GeoAltFill size={20} />
                </div>
                <div>
                    <small style={{ color: '#888' }}>
                        Delivering to <strong style={{color: '#333'}}>Customer Name</strong>
                    </small>
                    <p style={{ margin: 0, fontWeight: '600' }}>{rider.contact}</p> 
                </div>
            </div>
        </div>
    );

    return (
        /* MODIFIED: In-update ang padding para magkaroon ng 2 inches sa sides 
           at nilagyan ng background color para lumitaw ang mga white containers.
        */
        <div className="grab-container" style={{ 
            padding: '40px 2in', 
            backgroundColor: '#f9f9f9', 
            minHeight: '100vh' 
        }}>
            <div className="status-header-card">
                <div className="header-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <img src={logo} alt="Logo" width="60" />
                        <div style={{ textAlign: 'left' }}>
                            <h1 className="status-title">
                                {currentStep === 1 && "Your order is being prepared!"}
                                {currentStep === 3 && "Your rider is on the way!"}
                                {currentStep < 3 && currentStep !== 1 && "Looking for a rider"}
                                {currentStep === 4 && "Delivered!"}
                            </h1>
                        </div>
                    </div>
                    <button 
                        className="cancel-btn"
                        disabled={isCancelDisabled}
                        style={{
                            backgroundColor: isCancelDisabled ? '#ccc' : '#dc3545',
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
                                <div className={`timeline-dot ${index <= currentStep ? 'active' : ''}`}>
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

            {currentStep >= 3 && <RiderDetailsCard rider={riderInfo} />}

            <div className="details-grid">
                <div className="info-card" style={{ border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', borderRadius: '10px', padding: '20px', backgroundColor: '#fff' }}>
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
                                        <span style={{ color: '#617A55', fontWeight: '800', marginRight: '8px' }}>
                                            {item.qty}x
                                        </span>
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

                <div className="info-card" style={{ height: 'fit-content', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', borderRadius: '10px', padding: '20px', backgroundColor: '#fff' }}>
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
        </div>
    );
};

export default OrderStatus;