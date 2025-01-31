import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, addToCart } from "../services/api";
import {
  fetchProductStart,
  fetchProductSuccess,
  fetchProductFailure,
} from "../store/slices/productSlice";
import {
  addToCartStart,
  addToCartSuccess,
  addToCartFailure,
} from "../store/slices/cartSlice";
import {
  ShoppingBagIcon,
  TruckIcon,
  ShieldCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import ProductImage from "../components/ProductImage";
import { BASE_URL } from "../config/config";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    product,
    loading: productLoading,
    error: productError,
  } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  const { loading: cartLoading } = useSelector((state) => state.cart);

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        dispatch(fetchProductStart());
        const { data } = await getProduct(id);
        const formattedData = {
          ...data,
          images:
            data.images?.length > 0
              ? data.images
              : data.image
              ? [data.image]
              : [],
        };
        dispatch(fetchProductSuccess(formattedData));
      } catch (error) {
        dispatch(
          fetchProductFailure(
            error.response?.data?.message || "Failed to fetch product"
          )
        );
      }
    };

    fetchProductDetails();
  }, [dispatch, id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    try {
      dispatch(addToCartStart());
      const { data } = await addToCart({
        productId: product._id,
        quantity,
        size: selectedSize,
      });
      dispatch(addToCartSuccess(data));
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      dispatch(
        addToCartFailure(
          error.response?.data?.message || "Failed to add to cart"
        )
      );
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images?.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images?.length - 1 : prev - 1
    );
  };

  if (productLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (productError) {
    return (
      <div className="text-center text-accent mt-8 p-4 bg-red-50 rounded-lg">
        {productError}
      </div>
    );
  }

  if (!product) {
    return null;
  }

  // Add console logs to debug image URLs
  console.log("Product data:", product);
  console.log("Raw images:", product.images);

  const images = (product.images?.filter((img) => img) || []).map((img) => {
    const imageUrl = img.startsWith('http') 
      ? img 
      : `${BASE_URL}${img.startsWith('/') ? '' : '/'}${img}`;
    console.log("Constructed image URL:", imageUrl);
    return imageUrl;
  });

  console.log("Final images array:", images);

  if (images.length === 0 && product.image) {
    const imageUrl = product.image.startsWith('http') 
      ? product.image 
      : `${BASE_URL}${product.image.startsWith('/') ? '' : '/'}${product.image}`;
    console.log("Single image URL:", imageUrl);
    images.push(imageUrl);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative group">
            <ProductImage
              src={images[currentImageIndex]}
              alt={`${product.name} - Image ${currentImageIndex + 1}`}
              className="w-full rounded-lg"
              aspectRatio="aspect-square"
              enableZoom={true}
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <span className="text-white font-semibold px-6 py-3 bg-accent rounded-md text-lg">
                  Out of Stock
                </span>
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRightIcon className="h-6 w-6 text-gray-800" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-full aspect-square border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                    currentImageIndex === index
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <ProductImage
                    src={image}
                    alt={`${product.name} - Thumbnail ${index + 1}`}
                    className="w-full h-full"
                    objectFit="object-cover"
                  />
                  {currentImageIndex === index && (
                    <div className="absolute inset-0 bg-primary/10"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              {product.name}
            </h1>
            <p className="text-xl text-gray-600">{product.brand}</p>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-secondary">
              ${product.price}
            </span>
            <span className="text-sm text-gray-500">
              {product.stock} units available
            </span>
          </div>

          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          <div className="space-y-4">
            <label className="block text-gray-700 font-bold mb-2">Size</label>
            <div className="grid grid-cols-4 gap-3">
              {product.size.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-center rounded-md transition-all duration-200 ${
                    selectedSize === size
                      ? "bg-primary text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-gray-700 font-bold mb-2">
              Quantity
            </label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="input-field"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={cartLoading || product.stock === 0}
            className="w-full btn btn-primary flex items-center justify-center space-x-2"
          >
            <ShoppingBagIcon className="h-5 w-5" />
            <span>
              {cartLoading
                ? "Adding to Cart..."
                : product.stock === 0
                ? "Out of Stock"
                : "Add to Cart"}
            </span>
          </button>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <TruckIcon className="h-6 w-6 text-secondary" />
              <span className="text-sm text-gray-600">Free Shipping</span>
            </div>
            <div className="flex items-center space-x-3">
              <ShieldCheckIcon className="h-6 w-6 text-secondary" />
              <span className="text-sm text-gray-600">Authentic Product</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up">
          Product added to cart successfully!
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
