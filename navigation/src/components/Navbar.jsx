import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import kapebara_logo_transparent_Pic from '../pages/order/OrderCart/kapebara logo transparent.png';
import kapebara_cart_Pic from '../pages/order/OrderCart/kapebara cart.jpg';

function UniversalNavbar() {
  const { toggleCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Detect current role based on route
  const getCurrentRole = () => {
    const path = location.pathname;
    if (path.startsWith('/admin/')) return 'Administrator';
    if (path.startsWith('/rider/')) return 'Rider';
    return 'User';
  };

  const currentRole = getCurrentRole();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowRoleDropdown(false);
      }
    };

    if (showRoleDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRoleDropdown]);

  const handleRoleChange = (role) => {
    setShowRoleDropdown(false);
    
    // Navigate based on role
    switch(role) {
      case 'Administrator':
        navigate('/admin/admindashboard');
        break;
      case 'Rider':
        navigate('/rider/riderdashboard');
        break;
      case 'User':
        navigate('/order/order');
        break;
      default:
        break;
    }
  };

  const roles = ['Administrator', 'Rider', 'User'];

  return (
    <>
      <Navbar expand="lg" className="navbar" fixed="top" style={{ backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img src={kapebara_logo_transparent_Pic} height="30" className="d-inline-block align-text-top" alt="Kapebara Logo" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="center-nav" />
          <Navbar.Collapse id="center-nav" className="w-100 justify-content-center">
            <Nav className="ms-auto gap-4 align-items-center" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700 }}>
              <Nav.Link as={Link} to="/order/order" style={{ color: '#3B302A' }}>Home</Nav.Link>
              <Nav.Link as={Link} to="/admin/admincancellations" style={{ color: '#3B302A' }}>Menu</Nav.Link>
              <Nav.Link as={Link} to="/order/orderhistory" style={{ color: '#3B302A' }}>My Orders</Nav.Link>
              <Nav.Link as={Link} to="/admin/admindashboard" style={{ color: '#3B302A' }}>My Profile</Nav.Link>
              
              {/* Switch Roles */}
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <Nav.Link 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowRoleDropdown(!showRoleDropdown);
                  }}
                  style={{ color: '#3B302A', cursor: 'pointer' }}
                >
                  Switch Roles
                </Nav.Link>

                {/* Dropdown Menu */}
                {showRoleDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      backgroundColor: '#fff',
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                      minWidth: '200px',
                      zIndex: 1000,
                      overflow: 'hidden'
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 20px',
                        borderBottom: '1px solid #f0f0f0'
                      }}
                    >
                      <span style={{ fontWeight: 700, color: '#3B302A', fontFamily: 'DM Sans, sans-serif' }}>
                        Switch Roles
                      </span>
                      <button
                        onClick={() => setShowRoleDropdown(false)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '20px',
                          cursor: 'pointer',
                          color: '#3B302A',
                          padding: 0,
                          lineHeight: 1,
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </div>

                    {/* Role Options */}
                    <div style={{ padding: '8px' }}>
                      {roles.map((role) => (
                        <div
                          key={role}
                          onClick={() => handleRoleChange(role)}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            backgroundColor: currentRole === role ? '#3B302A' : 'transparent',
                            color: currentRole === role ? '#fff' : '#3B302A',
                            fontFamily: 'DM Sans, sans-serif',
                            fontWeight: currentRole === role ? 600 : 500,
                            marginBottom: '4px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (currentRole !== role) {
                              e.target.style.backgroundColor = '#f5f5f5';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentRole !== role) {
                              e.target.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          {role}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart */}
              <Nav.Link
                as={Link}
                to="#cart"
                onClick={(e) => {
                  e.preventDefault();
                  toggleCart();
                }}
              >
                <img src={kapebara_cart_Pic} height="30" style={{ objectFit: "contain" }} alt="Cart" />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default UniversalNavbar;
