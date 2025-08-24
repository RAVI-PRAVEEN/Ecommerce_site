import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Products({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [selectedPriceFilter, setSelectedPriceFilter] = useState("All");
  const [sortOption, setSortOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");

  const API_URL = "http://localhost:8888/api/products";
  const navigate = useNavigate();

  const fetchProducts = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];
  const priceRanges = [
    { label: "All", min: 0, max: Infinity },
    { label: "1 - 100", min: 1, max: 100 },
    { label: "101 - 200", min: 101, max: 200 },
    { label: "201 - 500", min: 201, max: 500 },
    { label: "501 - 1000", min: 501, max: 1000 },
    { label: "1001+", min: 1001, max: Infinity },
  ];

  // --- Filtering + Sorting + Searching ---
  const filteredProducts = products
    .filter(
      (p) =>
        selectedCategoryFilter === "All" || p.category === selectedCategoryFilter
    )
    .filter((p) => {
      const range = priceRanges.find((r) => r.label === selectedPriceFilter);
      if (!range) return true;
      return p.price >= range.min && p.price <= range.max;
    })
    .filter((p) => {
      if (customMin && p.price < customMin) return false;
      if (customMax && p.price > customMax) return false;
      return true;
    })
    .filter((p) =>
      searchQuery
        ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description &&
            p.description.toLowerCase().includes(searchQuery.toLowerCase()))
        : true
    )
    .sort((a, b) => {
      switch (sortOption) {
        case "priceAsc":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
        case "nameAsc":
          return a.name.localeCompare(b.name);
        case "nameDesc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  // --- Add Product ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedCategory = category === "Other" ? newCategory : category;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category", selectedCategory || "");
    if (image) formData.append("image", image);

    fetch(API_URL, { method: "POST", body: formData })
      .then((res) => res.json())
      .then(() => {
        setName("");
        setDescription("");
        setPrice("");
        setStock("");
        setCategory("");
        setNewCategory("");
        setImage(null);
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
        fetchProducts();
      })
      .catch((err) => console.error(err));
  };

  const toggleReadMore = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Products</h2>

      {/* 🔎 Search */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          marginBottom: "15px",
          width: "100%",
          maxWidth: "400px",
        }}
      />

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
          flexWrap: "wrap",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <div>
          <label>Category: </label>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Price Range: </label>
          <select
            value={selectedPriceFilter}
            onChange={(e) => setSelectedPriceFilter(e.target.value)}
          >
            {priceRanges.map((r) => (
              <option key={r.label} value={r.label}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Custom Price: </label>
          <input
            type="number"
            placeholder="Min"
            value={customMin}
            onChange={(e) => setCustomMin(e.target.value)}
            style={{ width: "70px", marginRight: "5px" }}
          />
          <input
            type="number"
            placeholder="Max"
            value={customMax}
            onChange={(e) => setCustomMax(e.target.value)}
            style={{ width: "70px" }}
          />
        </div>

        <div>
          <label>Sort: </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">None</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="nameAsc">Name: A-Z</option>
            <option value="nameDesc">Name: Z-A</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              textAlign: "center",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <div>
              {p.image_url ? (
                <img
                  src={`http://localhost:8888/${p.image_url}`}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "150px",
                    background: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#888",
                    borderRadius: "5px",
                  }}
                >
                  No Image
                </div>
              )}

              <h3>{p.name}</h3>
              <p
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: expanded[p.id] ? "none" : 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {p.description}
              </p>
              {p.description && p.description.length > 100 && (
                <span
                  onClick={() => toggleReadMore(p.id)}
                  style={{
                    color: "blue",
                    cursor: "pointer",
                    fontSize: "0.9em",
                  }}
                >
                  {expanded[p.id] ? "Read less" : "Read more"}
                </span>
              )}

              <p>Price: ₹ {p.price}</p>
              <p>Stock: {p.stock}</p>
              <p>Category: {p.category || "N/A"}</p>
            </div>

            <button
              onClick={() => {
                addToCart(p);
                navigate("/cart");
              }}
              disabled={p.stock <= 0}
              style={{
                background: p.stock <= 0 ? "#ccc" : "#4CAF50",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                borderRadius: "5px",
                cursor: p.stock <= 0 ? "not-allowed" : "pointer",
                marginTop: "10px",
              }}
            >
              {p.stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>

      {/* Toggle Add Product Form */}
      <button
        onClick={() => setShowForm((prev) => !prev)}
        style={{
          background: "#007BFF",
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

      {/* Add Product Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxWidth: "300px",
          }}
        >
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories
              .filter((c) => c !== "All")
              .map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            <option value="Other">Other</option>
          </select>

          {category === "Other" && (
            <input
              type="text"
              placeholder="Enter new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button
            type="submit"
            style={{
              background: "#4CAF50",
              color: "#fff",
              padding: "8px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Add Product
          </button>
        </form>
      )}
    </div>
  );
}

export default Products;
