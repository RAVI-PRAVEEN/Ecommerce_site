import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Fetch products from backend
  const fetchProducts = () => {
    fetch("http://localhost:8888/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Save cart in localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to cart
  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // Update stock after checkout
  const handleOrderSuccess = () => {
    setCartItems([]);
    fetchProducts(); // Refresh product stock
  };

  return (
    <div>
      <Navbar cartItems={cartItems} />
      <div style={{ marginTop: "60px" }}>
        <Routes>
          <Route path="/" element={<Home products={products} />} />
          <Route
            path="/products"
            element={<Products addToCart={addToCart} products={products} />}
          />
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                setCartItems={setCartItems}
                onOrderSuccess={handleOrderSuccess} // Pass success handler
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
