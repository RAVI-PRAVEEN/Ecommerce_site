import React, { useEffect, useState } from "react";

function Orders({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || user.role !== "admin") return;

      try {
        const res = await fetch("http://localhost:8888/api/orders");
        const data = await res.json();
        if (res.ok) setOrders(data);
        else alert(data.error || "Failed to fetch orders");
      } catch (err) {
        console.error(err);
        alert("Error fetching orders");
      }
    };
    fetchOrders();
  }, [user]);

  if (!user || user.role !== "admin") {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Access Denied</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontSize: "35px", textAlign: "center" }}>All Orders</h2>
      {orders.length === 0 ? (
        <p style={{ textAlign: "center" }}>No orders found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {orders.map((order) => (
            <div key={order.id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "15px" }}>
              <h3>Order ID: {order.id}</h3>
              <p>User: {order.username} ({order.email})</p>
              <p>Total Price: ₹ {order.total_price}</p>
              <p>Placed on: {new Date(order.created_at).toLocaleString()}</p>
              <h4>Items:</h4>
              <ul>
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.name} x {item.quantity} (₹ {item.price})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
