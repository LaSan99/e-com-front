import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/api";
import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
} from "../store/slices/productSlice";
import {
  ShoppingBagIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ProductImage from "../components/ProductImage";

const CATEGORIES = ["Running", "Basketball", "Lifestyle", "Training"];
const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, error } = useSelector((state) => state.product);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  // Remove the automatic search effect
  // Keep only the fetch products effect
  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        dispatch(fetchProductsStart());
        const { data } = await getProducts(searchQuery);
        dispatch(fetchProductsSuccess(data));
        // Update URL only after successful search
        if (searchQuery) {
          setSearchParams({ search: searchQuery });
        } else {
          setSearchParams({});
        }
      } catch (error) {
        dispatch(
          fetchProductsFailure(
            error.response?.data?.message || "Failed to fetch products"
          )
        );
      }
    };

    fetchProductsData();
  }, [dispatch, searchQuery]);

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);
      const matchesPrice =
        (!priceRange.min || product.price >= Number(priceRange.min)) &&
        (!priceRange.max || product.price <= Number(priceRange.max));
      return matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: "", max: "" });
    setSortBy("newest");
    setSearchInput("");
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-accent mt-8 p-4 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">All Products</h1>
        <div className="flex flex-wrap items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary transition-colors"
          >
            <FunnelIcon className="h-5 w-5" />
            Filters
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div
          className={`md:w-64 space-y-6 ${
            showFilters ? "block" : "hidden md:block"
          }`}
        >
          <div className="flex justify-between items-center md:hidden">
            <h2 className="text-xl font-bold">Filters</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="space-y-2">
              {CATEGORIES.map((category) => (
                <label key={category} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-semibold mb-3">Price Range</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                }
                className="w-full px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                }
                className="w-full px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="w-full px-4 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            Clear Filters
          </button>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <a
                key={product._id}
                href={`/product/${product._id}`}
                className="group"
              >
                <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="relative">
                    <ProductImage
                      src={product.images?.[0] || product.image}
                      alt={product.name}
                      className="w-full"
                      aspectRatio="aspect-square"
                    />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold px-4 py-2 bg-accent rounded-md">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-primary group-hover:text-primary-hover transition-colors duration-200">
                          {product.name}
                        </h3>
                        <p className="text-gray-600">{product.brand}</p>
                      </div>
                      <span className="text-lg font-bold text-secondary">
                        ${product.price}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center space-x-2">
                        <ShoppingBagIcon className="h-5 w-5 text-gray-500" />
                        <span className="text-sm text-gray-500">
                          {product.stock} in stock
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Sizes: {product.size.join(", ")}
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No products found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
