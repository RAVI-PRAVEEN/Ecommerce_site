import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Products({ addToCart, products }) {
  const [expanded, setExpanded] = useState({});
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [selectedPriceFilter, setSelectedPriceFilter] = useState("All");
  const [sortOption, setSortOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Categories & price ranges
  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];
  const priceRanges = [
    { label: "All", min: 0, max: Infinity },
    { label: "1 - 100", min: 1, max: 100 },
    { label: "101 - 200", min: 101, max: 200 },
    { label: "201 - 500", min: 201, max: 500 },
    { label: "501 - 1000", min: 501, max: 1000 },
    { label: "1001+", min: 1001, max: Infinity },
  ];

  const filteredProducts = products
    .filter(p => selectedCategoryFilter === "All" || p.category === selectedCategoryFilter)
    .filter(p => {
      const range = priceRanges.find(r => r.label === selectedPriceFilter);
      return range ? p.price >= range.min && p.price <= range.max : true;
    })
    .filter(p =>
      searchQuery
        ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
        : true
    )
    .sort((a, b) => {
      switch (sortOption) {
        case "priceAsc": return a.price - b.price;
        case "priceDesc": return b.price - a.price;
        case "nameAsc": return a.name.localeCompare(b.name);
        case "nameDesc": return b.name.localeCompare(a.name);
        default: return 0;
      }
    });

  const toggleReadMore = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Products</h2>
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: "8px", borderRadius: "5px", marginBottom: "15px", width: "100%", maxWidth: "400px" }}
      />

      {/* Filters */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>
        <select value={selectedCategoryFilter} onChange={(e) => setSelectedCategoryFilter(e.target.value)}>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select value={selectedPriceFilter} onChange={(e) => setSelectedPriceFilter(e.target.value)}>
          {priceRanges.map(r => <option key={r.label} value={r.label}>{r.label}</option>)}
        </select>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Sort</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="nameAsc">Name: A-Z</option>
          <option value="nameDesc">Name: Z-A</option>
        </select>
      </div>

      {/* Product Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
        {filteredProducts.map(p => (
          <div key={p.id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "10px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {p.image_url ? <img src={`http://localhost:8888/${p.image_url}`} alt={p.name} style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px" }} /> : <div style={{ width: "100%", height: "150px", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>No Image</div>}
            <h3>{p.name}</h3>
            <p style={{ display: "-webkit-box", WebkitLineClamp: expanded[p.id] ? "none" : 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.description}</p>
            {p.description && p.description.length > 100 && <span onClick={() => toggleReadMore(p.id)} style={{ color: "blue", cursor: "pointer" }}>{expanded[p.id] ? "Read less" : "Read more"}</span>}
            <p>Price: ₹ {p.price}</p>
            <p>Stock: {p.stock}</p>
            <button
              onClick={() => { addToCart(p); navigate("/cart"); }}
              disabled={p.stock <= 0}
              style={{ background: p.stock <= 0 ? "#ccc" : "#4CAF50", color: "#fff", border: "none", padding: "5px", borderRadius: "5px", cursor: p.stock <= 0 ? "not-allowed" : "pointer", marginTop: "10px" }}
            >
              {p.stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
