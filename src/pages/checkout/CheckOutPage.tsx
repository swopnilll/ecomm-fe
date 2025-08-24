import { useCallback, useEffect } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useOrderForm } from "../../hooks/order/useOrderForm";
import { useCartStore } from "../../stores/cartStore";
import { useAuth } from "../../hooks/auth/useAuth";
import PrintableInvoice from "../../components/invoice/PrintableInvoice";

export default function CheckoutPage() {
  const {
    formData,
    handleChange,
    handleSubmit,
    errors,
    isPending,
    success,
    canSubmit,
    orderResponse,
  } = useOrderForm();

  const { user } = useAuth();

  // Get the cart and clearCart action from the Zustand store
  const { cart, clearCart } = useCartStore();

  // Map Zustand cart items to the OrderPayload items format
  const orderItems = cart.items.map((item) => ({
    productId: item._id,
    productName: item.name,
    quantity: item.quantity,
    unitPrice: item.basePrice,
    taxRate: item.taxRate / 100,
  }));

  // Update the form data with the cart's items and totals whenever the cart changes
  useEffect(() => {
    handleChange("items", orderItems);
    handleChange("discountAmount", 0);
    if (user?._id) {
      handleChange("customerId", user._id);
    }
  }, [cart, user, handleChange]);

  // Handle successful order submission
  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSubmit(e);
      if (success) {
        clearCart();
      }
    },
    [handleSubmit, success, clearCart]
  );

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  console.log({ formData, errors, isPending, success });

  if (orderResponse) {
    return <PrintableInvoice apiResponse={orderResponse} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleFormSubmit}>
          <div className="space-y-12">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Checkout
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Please review your order details and confirm your purchase.
              </p>
            </div>

            {/* Customer & Payment Section */}
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900">
                Customer & Payment Details
              </h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                Enter the customer ID and select a payment method.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {/* Address (Required) */}
                <div className="sm:col-span-6">
                  <label
                    htmlFor="address"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Address <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address || ""}
                      onChange={(e) => handleChange("address", e.target.value)}
                      required
                      className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                    />
                  </div>
                  {errors?.issues?.some(
                    (issue) => issue.path[0] === "address"
                  ) && (
                    <p className="mt-2 text-sm text-red-600">
                      {
                        errors.issues.find(
                          (issue) => issue.path[0] === "address"
                        )?.message
                      }
                    </p>
                  )}
                </div>

                {/* Payment Method */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="paymentMethod"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Payment Method
                  </label>
                  <div className="mt-2">
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={formData.paymentMethod || "invoice"}
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                      <option value="invoice">Invoice</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items Section */}
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900">
                Order Summary
              </h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                Items from your cart.
              </p>
              <div className="mt-8 bg-gray-50 rounded-lg p-4">
                {cart.items.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Your cart is empty.
                  </p>
                ) : (
                  <>
                    <ul className="divide-y divide-gray-200">
                      {cart.items.map((item) => (
                        <li
                          key={item._id}
                          className="flex justify-between items-center py-4"
                        >
                          <div className="flex-1 min-w-0 pr-4">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.name}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.quantity} x {formatPrice(item.basePrice)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              {formatPrice(item.quantity * item.basePrice)}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-sm font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>{formatPrice(cart.subtotal)}</p>
                      </div>
                      <div className="flex justify-between text-sm font-medium text-gray-900 mt-2">
                        <p>Taxes</p>
                        <p>{formatPrice(cart.taxAmount)}</p>
                      </div>
                      <div className="flex justify-between text-base font-bold text-gray-900 mt-4 border-t pt-4">
                        <p>Total</p>
                        <p>{formatPrice(cart.totalAmount)}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              disabled={isPending || cart.itemCount === 0 || !canSubmit}
              className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Submitting..." : "Submit Order"}
            </button>
          </div>

          {/* Submission Feedback */}
          {success && (
            <div className="mt-6 rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Order submitted successfully!
                  </h3>
                  <p className="mt-2 text-sm text-green-700">
                    Your order has been placed. You will be redirected shortly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {errors && (
            <div className="mt-6 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Validation Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {errors.issues.map((issue, index) => (
                        <li key={index}>
                          <strong>{String(issue.path[0])}:</strong>{" "}
                          {issue.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
