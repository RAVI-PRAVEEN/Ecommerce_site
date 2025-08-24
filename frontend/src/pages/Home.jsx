import React from "react";
import { useNavigate } from "react-router-dom";

function Home({ products }) {
  const navigate = useNavigate();

  if (!products) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Loading products...</h2>
      </div>
    );
  }

  // Group products by category
  const categorizedProducts = products.reduce((acc, product) => {
    if (product.category) { // Only include products with category
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
    }
    return acc;
  }, {});

  return (
    <div style={{ padding: "20px" }}>
      {/* Hero Section */}
      <div
        style={{
          background: "#007BFF",
          color: "#fff",
          borderRadius: "10px",
          padding: "40px",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        <h1>Welcome to Our Store!</h1>
        <p>Find the best products at amazing prices.</p>
        <button
          onClick={() => navigate("/products")}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            background: "#fff",
            color: "#007BFF",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Shop Now
        </button>
      </div>

      {/* Products Grouped by Category */}
      {Object.keys(categorizedProducts).length === 0 ? (
        <p>No categorized products available.</p>
      ) : (
        Object.entries(categorizedProducts).map(([category, prods]) => (
          <div key={category} style={{ marginBottom: "30px" }}>
            <h2 style={{ marginBottom: "15px" }}>{category}</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              {prods.map((p) => (
                <div
                  key={p.id}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "10px",
                    textAlign: "center",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  {p.image_url && (
                    <img
                      src={`http://localhost:8888/${p.image_url}`}
                      alt={p.name}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "5px",
                        marginBottom: "10px",
                      }}
                    />
                  )}
                  <h3>{p.name}</h3>
                  <p
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      fontStyle: "italic",
                      marginBottom: "5px",
                    }}
                  >
                    {p.description}
                  </p>
                  <p>Price: ₹ {p.price}</p>
                  <button
                    onClick={() => navigate("/products")}
                    style={{
                      background: "#4CAF50",
                      color: "#fff",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
