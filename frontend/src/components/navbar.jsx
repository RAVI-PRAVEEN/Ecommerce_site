import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function Navbar({ cartItems, user, setUser }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">🛒 MyStore</Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart ({cartItems.length})</Link>

        {/* Auth Section */}
        {!user ? (
          <div className="navbar-auth">
            <button className="dropbtn">
              <Link to="/login">Login</Link>
            </button>
            
          </div>
        ) : (
          <div className="nav-right">
            <div className="user-menu">
              <div
                className="user-icon"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                👤
              </div>

              {isDropdownOpen && (
                <div className="dropdown">
                  <div className="profile-circle">
                    {user.username
                      ? user.username.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <p className="username">{user.username.toUpperCase()}</p>
                  <br/>
                  <button
                    className="logout-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
