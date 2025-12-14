import React, { useState } from 'react';
import { Check, CupHotFill, PersonFill, Bicycle, HouseDoorFill, GeoAltFill, Shop } from 'react-bootstrap-icons';
import logo from './preparing.png';
import drinkImg from './classic matchabara cold brew.png';

const OrderStatus = () => {
    // 0: Received, 1: Preparing, 2: Rider, 3: Transit, 4: Delivered
    const currentStep = 1;

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

    return (
        <div className="grab-container">

            {/* 1. TOP SECTION: STATUS & WIDE TIMELINE */}
            <div className="status-header-card">
                <div className="header-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <img src={logo} alt="Logo" width="60" />
                        <div style={{ textAlign: 'left' }}>
                            <h1 className="status-title">Your order is being prepared!</h1>
                            {/* TINANGGAL NA NATIN YUNG EST. DELIVERY DITO */}
                        </div>
                    </div>
                    <button className="cancel-btn">Cancel Order</button>
                </div>

                {/* Horizontal Timeline */}
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

            {/* 2. BOTTOM SECTION: DETAILS & SUMMARY GRID */}
            <div className="details-grid">

                {/* LEFT SIDE: ORDER INFO */}
                <div className="info-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <span className="section-label">Order Details</span>
                        <span style={{ color: '#888' }}>Order ID: #123456 - Nov. 20, 2025</span>
                    </div>

                    {/* From & To Row */}
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

                    {/* Order List Loop */}
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

                    {/* Note */}
                    <div className="note-box">
                        <span style={{ fontWeight: '700', fontSize: '14px', display: 'block', marginBottom: '5px' }}>Order Note:</span>
                        <p style={{ margin: 0, fontStyle: 'italic', color: '#555' }}>"Please less ice on the Matcha. Thank you!"</p>
                    </div>
                </div>

                {/* RIGHT SIDE: SUMMARY & PAYMENT */}
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
        </div>
    );
};

export default OrderStatus;