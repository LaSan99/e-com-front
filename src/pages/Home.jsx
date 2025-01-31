import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { getProducts } from "../services/api";
import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
} from "../store/slices/productSlice";
import {
  ShoppingBagIcon,
  TruckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import ProductImage from "../components/ProductImage";

const BACKEND_URL = "https://e-com-back-seven.vercel.app/";

const Home = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { products, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch(fetchProductsStart());
        const searchQuery = searchParams.get("search");
        const { data } = await getProducts(searchQuery);
        dispatch(fetchProductsSuccess(data));
      } catch (error) {
        dispatch(
          fetchProductsFailure(
            error.response?.data?.message || "Failed to fetch products"
          )
        );
      }
    };

    fetchProducts();
  }, [dispatch, searchParams]);

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
    <div className="fade-in">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-primary-hover text-white py-24 mb-16 w-full">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2067&q=80"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Latest Sneakers Collection
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Discover our collection of premium sneakers from top brands. Each
            pair is carefully selected for style and comfort.
          </p>
          <div className="flex justify-center space-x-12">
            <div className="text-center">
              <TruckIcon className="h-12 w-12 mx-auto mb-4" />
              <h3 className="font-semibold">Free Shipping</h3>
              <p className="text-gray-300">On all orders over $100</p>
            </div>
            <div className="text-center">
              <ShieldCheckIcon className="h-12 w-12 mx-auto mb-4" />
              <h3 className="font-semibold">Authentic Products</h3>
              <p className="text-gray-300">100% Genuine Products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="container mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-primary mb-8">
          Featured Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              name: "Running",
              description: "High-performance running shoes for every athlete",
              image:
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            },
            {
              name: "Basketball",
              description: "Professional basketball shoes for the court",
              image:
                "https://images.unsplash.com/photo-1607893351349-0cfa621476ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            },
            {
              name: "Lifestyle",
              description: "Casual and trendy sneakers for everyday wear",
              image:
                "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80",
            },
            {
              name: "Training",
              description: "Versatile shoes for gym and training sessions",
              image:
                "https://images.unsplash.com/photo-1605348532760-6753d2c43329?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2020&q=80",
            },
          ].map((category) => (
            <div
              key={category.name}
              className="relative group overflow-hidden rounded-lg cursor-pointer"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col items-center justify-end p-6 text-center">
                <h3 className="text-white text-2xl font-bold mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-primary py-16 mb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg mb-8">
              Subscribe to our newsletter for exclusive offers, new arrivals,
              and insider-only discounts.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-3 rounded-lg text-gray-800 min-w-[300px] focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Trending Products */}
      <div className="container mx-auto px-4 mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Trending Now</h2>
          <Link
            to="/products"
            className="text-secondary hover:text-secondary-hover font-semibold"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 3).map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="group transform hover:-translate-y-1 transition-all duration-200"
            >
              <div className="card overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="relative">
                  <ProductImage
                    src={product.images?.[0] || product.image}
                    alt={product.name}
                    className="w-full"
                    aspectRatio="aspect-square"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-secondary text-white px-4 py-2 rounded-full text-sm font-semibold">
                      New Arrival
                    </span>
                  </div>
                </div>
                <div className="p-6">
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
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-primary mb-8">
          Latest Arrivals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="group"
            >
              <div className="card overflow-hidden">
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
                <div className="p-6">
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
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <TruckIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Free shipping on orders over $100</p>
            </div>
            <div className="text-center">
              <ShieldCheckIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure payment</p>
            </div>
            <div className="text-center">
              <ShoppingBagIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Quality Products</h3>
              <p className="text-gray-600">Handpicked premium products</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
