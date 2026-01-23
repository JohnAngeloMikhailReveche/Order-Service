import { useState, useMemo } from "react";

function UpdateDeliveryStatusModal({
    onClose,
    orderData,
    onUpdateStatus,
    initialStatus,
    allowUpdate = true
}) {
    const defaultOrderData = {
        orderId: "unknown",
        orderDate: "unknown",
        customerName: "Guest User",
        deliveryAddress: "N/A",
        cancelReason: null,
        cancelNotes: null
    };

    const data = orderData || defaultOrderData;
    const rawStatus = String(initialStatus || data.status || "").trim();

    const mapToDisplay = (s) => {
        if (!s) return "In-transit";
        let txt = String(s).trim();
        txt = txt.replace(/^["']|["']$/g, "");
        txt = txt.replace(/[_\-]/g, " ");
        txt = txt.replace(/([a-z])([A-Z])/g, "$1 $2");
        txt = txt.replace(/\s+/g, " ").trim();
        const lower = txt.toLowerCase();

        if (lower.includes("in") && lower.includes("transit")) return "In-transit";
        if (lower.includes("deliver") && !lower.includes("fail")) return "Delivered";
        if (lower.includes("fail")) return "Failed to Deliver";

        return txt.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    };

    const currentStatus = mapToDisplay(rawStatus);

    const allowedOptions = ["In-transit", "Delivered", "Failed to Deliver"];

    const [status, setStatus] = useState(() => {
        return allowedOptions.includes(currentStatus) ? currentStatus : allowedOptions[0];
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleUpdate = async () => {
        if (!allowUpdate) {
            setError("Updates are disabled for this order.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            await onUpdateStatus(data.orderId, status);
            onClose();
        } catch (err) {
            setError(err.message || "Failed to update delivery status");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="order-status-modal">
                {/* CLOSE BUTTON */}
                <button className="close-btn-absolute" onClick={onClose}>X</button>

                {/* HEADER */}
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">Update Delivery Status</h2>
                        <p className="modal-sub">Manage and confirm delivery updates.</p>
                    </div>
                </div>

                {/* INFO GRID */}
                <div className="info-grid">
                    <div className="info-item">
                        <label className="label">Order ID</label>
                        <div className="info-box">{data.orderId}</div>
                    </div>

                    <div className="info-item">
                        <label className="label">Order Date</label>
                        <div className="info-box">{data.orderDate}</div>
                    </div>
                </div>

                {/* CUSTOMER NAME */}
                <div className="info-item full">
                    <label className="label">Customer Name</label>
                    <div className="info-box">{data.customerName || "Guest User"}</div>
                </div>

                {/* DELIVERY ADDRESS */}
                <div className="info-item full">
                    <label className="label">Delivery Address</label>
                    <div className="info-box">{data.deliveryAddress || "N/A"}</div>
                </div>

                {/* STATUS SELECT */}
                <div className="form-group" style={{ marginTop: "12px" }}>
                    <label className="label">Delivery Status</label>
                    <select
                        className="status-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={!allowUpdate}
                    >
                        {allowedOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                    <div style={{
                        color: '#d32f2f',
                        fontSize: '14px',
                        marginBottom: '16px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                {/* UPDATE BUTTON */}
                <div className="btn-wrapper" style={{ marginTop: "20px" }}>
                    <button
                        className="primary-btn"
                        onClick={handleUpdate}
                        disabled={isLoading}
                        style={{ padding: "10px 20px" }}
                    >
                        {isLoading ? "Updating..." : "Update Status"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpdateDeliveryStatusModal;