import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCart, updateCartItem, removeFromCart } from "../services/api";
import {
  fetchCartStart,
  fetchCartSuccess,
  fetchCartFailure,
  updateCartItemStart,
  updateCartItemSuccess,
  updateCartItemFailure,
  removeFromCartStart,
  removeFromCartSuccess,
  removeFromCartFailure,
} from "../store/slices/cartSlice";
import {
  TrashIcon,
  ShoppingBagIcon,
  ArrowLeftIcon,
  GiftIcon,
  TruckIcon,
  ShieldCheckIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import ProductImage from "../components/ProductImage";

const Cart = () => {
  const dispatch = useDispatch();
  const { items = [], loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        dispatch(fetchCartStart());
        const { data } = await getCart();
        dispatch(fetchCartSuccess(data));
      } catch (error) {
        dispatch(
          fetchCartFailure(
            error.response?.data?.message || "Failed to fetch cart"
          )
        );
      }
    };

    fetchCart();
  }, [dispatch]);

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      dispatch(updateCartItemStart());
      const { data } = await updateCartItem(itemId, quantity);
      dispatch(updateCartItemSuccess(data));
    } catch (error) {
      dispatch(
        updateCartItemFailure(
          error.response?.data?.message || "Failed to update cart"
        )
      );
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      dispatch(removeFromCartStart());
      const { data } = await removeFromCart(itemId);
      dispatch(removeFromCartSuccess(data));
    } catch (error) {
      dispatch(
        removeFromCartFailure(
          error.response?.data?.message || "Failed to remove item"
        )
      );
    }
  };

  const calculateTotal = () => {
    return (items || []).reduce((total, item) => {
      return total + (item?.product?.price || 0) * (item?.quantity || 0);
    }, 0);
  };

  const calculateSubtotal = () => {
    return calculateTotal();
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 100 ? 0 : 10;
  };

  const calculateGrandTotal = () => {
    return calculateSubtotal() + calculateShipping();
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

  if (!items || items.length === 0) {
    return (
      <div className="text-center mt-16 fade-in">
        <div className="bg-gray-50 rounded-full h-32 w-32 mx-auto flex items-center justify-center mb-6">
          <ShoppingBagIcon className="h-16 w-16 text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold text-primary mb-4">
          Your Cart is Empty
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Browse our
          products and find something you love!
        </p>
        <Link
          to="/products"
          className="btn btn-primary inline-flex items-center space-x-2 px-8 py-3"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Start Shopping</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 fade-in">
      <h1 className="text-4xl font-bold text-primary mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {items.map((item) => {
                if (!item?.product) return null;

                return (
                  <div
                    key={item._id}
                    className="p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-6">
                      <Link
                        to={`/product/${item.product._id}`}
                        className="flex-shrink-0 relative group"
                      >
                        <ProductImage
                          src={item.product.images?.[0] || item.product.image}
                          alt={item.product.name}
                          className="w-32 h-32 rounded-lg"
                          aspectRatio="aspect-square"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200 rounded-lg" />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product._id}`}
                          className="text-lg font-semibold text-primary hover:text-primary-hover transition-colors duration-200 block"
                        >
                          {item.product.name}
                        </Link>
                        <div className="mt-1 flex flex-wrap gap-4 text-sm text-gray-600">
                          <p>Size: {item.size}</p>
                          <p>Brand: {item.product.brand}</p>
                        </div>
                        <div className="mt-4 flex items-center gap-6">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item._id,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item._id,
                                  item.quantity + 1
                                )
                              }
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <PlusIcon className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-gray-400 hover:text-accent transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                            title="Remove item"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-secondary">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          ${item.product.price} each
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shopping Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <TruckIcon className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-sm text-gray-600">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <ShieldCheckIcon className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-sm text-gray-600">100% secure checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <GiftIcon className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Special Offer</h3>
                <p className="text-sm text-gray-600">
                  Get 10% off your first order
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            <h2 className="text-xl font-bold text-primary mb-6">
              Order Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>
                  {calculateShipping() === 0 ? (
                    <span className="text-green-500">Free</span>
                  ) : (
                    `$${calculateShipping().toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-secondary">
                  ${calculateGrandTotal().toFixed(2)}
                </span>
              </div>

              {calculateSubtotal() < 100 && (
                <div className="bg-blue-50 text-blue-700 p-4 rounded-lg text-sm mt-4">
                  Add ${(100 - calculateSubtotal()).toFixed(2)} more to get free
                  shipping!
                </div>
              )}

              <Link
                to="/checkout"
                className="w-full btn btn-primary mt-6 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/products"
                className="w-full btn bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center justify-center gap-2"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
