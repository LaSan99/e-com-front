import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CreditCardIcon, LockClosedIcon } from "@heroicons/react/24/outline";

const Checkout = () => {
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
    }

    // Format expiry date
    if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d{0,2})/, "$1/$2")
        .slice(0, 5);
    }

    // Format CVV
    if (name === "cvv") {
      formattedValue = value.slice(0, 3);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      // Redirect to success page after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center">
        <div className="bg-green-100 text-green-800 p-6 rounded-lg mb-8">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p>Thank you for your purchase. You will be redirected shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className="input-field pl-12"
                  required
                  pattern="\d{4}\s\d{4}\s\d{4}\s\d{4}"
                />
                <CreditCardIcon className="absolute left-4 top-3 h-6 w-6 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                Card Holder Name
              </label>
              <input
                type="text"
                name="cardHolder"
                value={formData.cardHolder}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="input-field"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className="input-field"
                  required
                  pattern="\d{2}/\d{2}"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">CVV</label>
                <div className="relative">
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="input-field pl-12"
                    required
                    pattern="\d{3}"
                  />
                  <LockClosedIcon className="absolute left-4 top-3 h-6 w-6 text-gray-400" />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full btn btn-primary mt-6"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Pay $${calculateTotal().toFixed(2)}`
              )}
            </button>
          </form>
          <div className="mt-4 text-sm text-gray-500 text-center">
            <LockClosedIcon className="inline-block h-4 w-4 mr-1" />
            Your payment information is secure
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center py-2 border-b"
              >
                <div>
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">
                    Size: {item.size} × {item.quantity}
                  </p>
                </div>
                <span className="font-semibold">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
