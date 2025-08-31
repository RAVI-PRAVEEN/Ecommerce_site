import React, { useEffect, useState } from "react";

function Cart({ cartItems, setCartItems, onOrderSuccess, user }) {
  const [showModal, setShowModal] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, [setCartItems]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!user) {
      alert("You must be logged in to place an order.");
      return;
    }
    setShowModal(true);
  };

  const confirmCheckout = async () => {
    if (!user) {
      alert("You must be logged in to place an order.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }

    try {
      console.log("Sending order:", { user_id: user.id, items: cartItems, total_price: totalPrice });

      const response = await fetch("http://localhost:8888/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, items: cartItems, total_price: totalPrice }),
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        alert("Checkout successful!");
        setCartItems([]);
        localStorage.setItem("cartItems", JSON.stringify([]));
        setShowModal(false);
        onOrderSuccess();
      } else {
        alert("Error placing order: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error placing order: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontSize: "35px", textAlign: "center" ,}}>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p style={{ fontSize: "20px", textAlign: "center" }}>Cart is empty</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {item.image_url && (
                <img
                  src={`http://localhost:8888/${item.image_url}`}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "5px",
                    marginBottom: "10px",
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <h3>{item.name}</h3>
                <p>Price: ₹ {item.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
              <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
                <button
                  onClick={() => increaseQuantity(item.id)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    background: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    background: "#f0ad4e",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  -
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    background: "#ff4d4d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <>
          <h3>Total: ₹ {totalPrice.toFixed(2)}</h3>
          <button
            onClick={handleCheckout}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              background: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Checkout
          </button>
        </>
      )}

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              minWidth: "350px",
            }}
          >
            <h3>Confirm Checkout</h3>
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                marginBottom: "10px",
              }}
            >
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #ddd",
                    padding: "5px 0",
                  }}
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>₹ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <h4>Total: ₹ {totalPrice.toFixed(2)}</h4>
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              <button
                onClick={confirmCheckout}
                style={{
                  flex: 1,
                  padding: "8px",
                  background: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Confirm
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "8px",
                  background: "#ff4d4d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
