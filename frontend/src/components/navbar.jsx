import { Link } from "react-router-dom";

function Navbar({ cartItems }) {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between", // pushes logo left, links right
        alignItems: "center",
        padding: "10px 20px",
        background: "#f2f2f2",
        width: "98%", // full width across screen
        position: "fixed", // keeps navbar on top when scrolling
        top: 0,
        left: 0,
        zIndex: 1000,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Logo */}
      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
          MyStore
        </Link>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
          Home
        </Link>
        <Link to="/products" style={{ textDecoration: "none", color: "black" }}>
          Products
        </Link>
        <Link to="/cart" style={{ textDecoration: "none", color: "black" }}>
          Cart ({cartItems.length})
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;



