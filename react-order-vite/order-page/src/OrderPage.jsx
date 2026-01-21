import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';

function OrderPage() {
  const { menuItemId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const addToCart = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:3000/api/cart/add/${menuItemId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            menuItemId: menuItemId,
            timestamp: new Date().toISOString()
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Successfully added to cart:', data);
        setSuccess(true);
      } catch (err) {
        console.error('Error adding to cart:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (menuItemId) {
      addToCart();
    }
  }, [menuItemId]);

  return (
    <Container className="mt-5">
      <Card className="shadow-sm p-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Card.Body>
          <h2 className="mb-4 text-center">Order Page</h2>
          
          <div className="mb-3">
            <strong>Menu Item ID:</strong>{' '}
            <span className="badge bg-primary fs-6">{menuItemId}</span>
          </div>

          {loading && (
            <div className="text-center py-4">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3">Adding item to cart...</p>
            </div>
          )}

          {!loading && success && (
            <Alert variant="success">
              <Alert.Heading>Success!</Alert.Heading>
              <p>
                Menu item <strong>{menuItemId}</strong> has been successfully added to your cart.
              </p>
            </Alert>
          )}

          {!loading && error && (
            <Alert variant="danger">
              <Alert.Heading>Error</Alert.Heading>
              <p>
                Failed to add item to cart: {error}
              </p>
              <hr />
              <p className="mb-0 small">
                Make sure the backend server is running at <code>http://localhost:3000</code>
              </p>
            </Alert>
          )}

          <div className="mt-4 p-3 bg-light rounded">
            <h6>Details:</h6>
            <ul className="mb-0">
              <li>Menu Item ID: {menuItemId}</li>
              <li>Endpoint: POST /api/cart/add/{menuItemId}</li>
              <li>Status: {loading ? 'Processing...' : success ? 'Complete' : 'Error'}</li>
            </ul>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default OrderPage;

