import { Link, useNavigate } from "react-router-dom";

function Navbar({ cartItems, user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        background: "#f2f2f2",
        width: "98%",
        position: "fixed",
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
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
          Home
        </Link>
        <Link to="/products" style={{ textDecoration: "none", color: "black" }}>
          Products
        </Link>
        <Link to="/cart" style={{ textDecoration: "none", color: "black" }}>
          Cart ({cartItems.length})
        </Link>

        {/* Auth Links */}
        {!user ? (
          <>
            <Link to="/login" style={{ textDecoration: "none", color: "black" }}>
              Login
            </Link>
            <Link to="/signup" style={{ textDecoration: "none", color: "black" }}>
              Signup
            </Link>
          </>
        ) : (
          <>
            <span style={{ fontWeight: "bold" }}>{user.username}</span>
            <button
              onClick={handleLogout}
              style={{
                background: "#ff4d4d",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
