# Order Admin Cancel Popup

Admin modals for reviewing cancellation requests and updating order status.

## How to Run

```bash
#1: cd order-service
#2: cd react-order-vite
#3: cd order-admin-cancel-popup
#4: npm install
#5: npm run dev
```

## Components

### 1. ReviewCancellationModal
Displays order details and cancellation information for admin review.

**Props:**
- `onApprove: () => void` - Callback when "Approve Request" is clicked
- `onDecline: () => void` - Callback when "Decline Request" is clicked
- `onClose: () => void` - Callback when modal is closed
- `orderData?: object` - Order data object (optional, uses mock data if not provided)

**Order Data Structure:**
```javascript
{
  orderId: "123-456-789",
  orderDate: "2025-10-13",
  customerName: "Bruno Decano",
  orderStatus: "Looking for a Rider",
  cancellationDate: "2025-10-13",
  reason: "Looking for a Rider",
  customerNotes: "Looking for a Rider"
}
```

### 2. UpdateOrderStatusModal
Allows admin to update order status.

**Props:**
- `onClose: () => void` - Callback when modal is closed
- `orderData?: object` - Order data object (optional)
- `onUpdateStatus?: (orderId, status) => Promise<void>` - Callback for status update
- `initialStatus?: string` - Initial order status

**Order Data Structure:**
```javascript
{
  orderId: "123-456-789",
  orderDate: "2025-10-13",
  customerName: "Bruno Decano",
  orderStatus: "Preparing" // Current status
}
```

### 3. ApproveCancellationModal
Confirmation modal for approving cancellation.

**Props:**
- `onClose: () => void` - Callback when modal is closed
- `onConfirm?: () => void` - Callback when "Yes, I am" is clicked
- `onBack: () => void` - Callback when "Not yet" is clicked (returns to ReviewCancellationModal)
- `orderId?: string` - Order ID for API call
- `onApproveCancellation?: () => Promise<void>` - Custom API callback

### 4. DeclineCancellationModal
Confirmation modal for declining cancellation.

**Props:**
- `onClose: () => void` - Callback when modal is closed
- `onConfirm?: () => void` - Callback when "Yes, I am" is clicked
- `onBack: () => void` - Callback when "Not yet" is clicked (returns to ReviewCancellationModal)
- `orderId?: string` - Order ID for API call
- `onDeclineCancellation?: () => Promise<void>` - Custom API callback

## Backend Integration

### API Endpoints Expected

#### 1. Update Order Status
```
PUT /api/orders/{orderId}/status
Content-Type: application/json

Body: {
  "status": "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled"
}
```

#### 2. Approve Cancellation
```
POST /api/orders/{orderId}/cancel/approve
```

#### 3. Decline Cancellation
```
POST /api/orders/{orderId}/cancel/decline
```

### Sample Integration

```javascript
import ReviewCancellationModal from './components/ReviewCancellationModal';
import ApproveCancellationModal from './components/ApproveCancellationModal';
import DeclineCancellationModal from './components/DeclineCancellationModal';
import UpdateOrderStatusModal from './components/UpdateOrderStatusModal';

function AdminDashboard() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  // Fetch order data
  useEffect(() => {
    const fetchOrder = async () => {
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}`);
      const data = await response.json();
      setSelectedOrder(data);
    };
    fetchOrder();
  }, [orderId]);

  const handleApprove = async () => {
    setActiveModal('approve');
  };

  const handleDecline = async () => {
    setActiveModal('decline');
  };

  const handleConfirmApprove = async () => {
    // API call is handled inside ApproveCancellationModal
    // Or you can pass custom callback
  };

  return (
    <>
      {activeModal === 'review' && (
        <ReviewCancellationModal
          orderData={selectedOrder}
          onApprove={handleApprove}
          onDecline={handleDecline}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'approve' && (
        <ApproveCancellationModal
          orderId={selectedOrder?.orderId}
          onBack={() => setActiveModal('review')}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'decline' && (
        <DeclineCancellationModal
          orderId={selectedOrder?.orderId}
          onBack={() => setActiveModal('review')}
          onClose={() => setActiveModal(null)}
        />
      )}
    </>
  );
}
```

## Features

✅ **Props-based data**: All components accept `orderData` prop for backend integration
✅ **API integration ready**: Built-in fetch calls with fallback to callbacks
✅ **Loading states**: Shows loading indicators during API calls
✅ **Error handling**: Displays error messages if API calls fail
✅ **Backward compatible**: Works with mock data if props not provided (for testing)

## Notes

- All modals use mock data by default if `orderData` prop is not provided
- API endpoints use `http://localhost:8080` by default (adjust in components if needed)
- Error messages are displayed in red below the action buttons
- Loading states disable buttons and show "Processing..." or "Updating..." text
- The `App.jsx` file is a tester page - replace with your actual admin dashboard integration
