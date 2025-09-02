import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Products({ addToCart }) {
  const navigate = useNavigate();

  // Get logged-in user from localStorage
  const [user] = useState(() => JSON.parse(localStorage.getItem("user")));

  // Product list state
  const [products, setProducts] = useState([]);

  // States for product grid
  const [expanded, setExpanded] = useState({});
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [selectedPriceFilter, setSelectedPriceFilter] = useState("All");
  const [sortOption, setSortOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // States for Add Product form
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [image, setImage] = useState(null);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:8888/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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

  // Filtered & sorted products
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

  // Toggle Read More
  const toggleReadMore = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Handle Add Product form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category", category === "Other" ? newCategory : category);
    if (image) formData.append("image", image);

    try {
      const res = await fetch("http://localhost:8888/api/products", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert("Product added successfully!");
        setShowForm(false);
        // Reset form
        setName(""); setDescription(""); setPrice(""); setStock(""); setCategory(""); setNewCategory(""); setImage(null);
        // Refresh product list
        fetchProducts();
      } else {
        alert(data.error || "Failed to add product");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  // Handle Delete Product
  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) return;

    try {
      const res = await fetch("http://localhost:8888/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, role: user.role }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Product deleted successfully");
        fetchProducts(); // Refresh product list
      } else {
        alert(data.error || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontSize: "35px", textAlign: "center" }}>Products</h2>

      {/* Search */}
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

      {/* Add Product Form - Admin Only */}
      {user && user.role === "admin" && (
        <>
          <button
            onClick={() => setShowForm(prev => !prev)}
            style={{
              background: "#20ca53ff",
              color: "#fff",
              padding: "8px 12px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            {showForm ? "Hide Add Product Form" : "Click here to add a product"}
          </button>

          {showForm && (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px", marginBottom: "20px" }}
            >
              <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
              <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
              <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
              <input type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} required />

              <select value={category} onChange={e => setCategory(e.target.value)} required>
                <option value="">Select Category</option>
                {categories.filter(c => c !== "All").map(cat => <option key={cat} value={cat}>{cat}</option>)}
                <option value="Other">Other</option>
              </select>

              {category === "Other" && (
                <input type="text" placeholder="Enter new category" value={newCategory} onChange={e => setNewCategory(e.target.value)} required />
              )}

              <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />

              <button type="submit" style={{ background: "#4CAF50", color: "#fff", padding: "8px", borderRadius: "5px", border: "none", cursor: "pointer" }}>
                Add Product
              </button>
            </form>
          )}
        </>
      )}

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

            {/* Admin Delete Button */}
            {user && user.role === "admin" && (
              <button
                onClick={() => handleDelete(p.id, p.name)}
                style={{
                  background: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  padding: "5px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "5px"
                }}
              >
                Delete
              </button>
            )}

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
