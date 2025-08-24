import React from "react";

interface OrderResponsePayload {
  success: boolean;
  message: string;
  data: {
    customerId: string;
    items: Array<{
      productId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
      taxRate: number;
      subtotal: number;
    }>;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
    status: string;
    paymentMethod: string;
    _id: string;
    orderNumber: string;
    registeredAt: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

interface PrintableInvoiceProps {
  apiResponse: OrderResponsePayload;
}

const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({ apiResponse }) => {
  const orderData = apiResponse.data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen font-sans antialiased">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-2xl w-full mb-6 print:m-0 print:p-0 print:shadow-none">
        <div className="flex flex-col space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-800 text-center border-b-2 pb-4 mb-4 border-gray-200">
            Order Confirmation
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="font-semibold text-gray-500">Invoice To:</p>
              <p>{orderData.customerId}</p>
              <p>123 Mockingbird Lane</p>
              <p>Anytown, USA 12345</p>
            </div>
            <div className="sm:text-right">
              <p className="font-semibold text-gray-500">Order No:</p>
              <p className="font-bold text-gray-800">{orderData.orderNumber}</p>
              <p className="font-semibold text-gray-500 mt-2">Date:</p>
              <p>{new Date(orderData.registeredAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="overflow-x-auto my-6 rounded-lg shadow-sm">
            <table className="min-w-full bg-gray-50 border border-gray-200">
              <thead>
                <tr className="bg-gray-200 text-gray-700 text-sm uppercase font-semibold tracking-wider">
                  <th className="py-3 px-4 text-left">Item</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orderData.items.map((item, index) => (
                  <tr key={index} className="bg-white hover:bg-gray-100">
                    <td className="py-3 px-4">{item.productName}</td>
                    <td className="py-3 px-4 text-center">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pr-4">
            <div className="w-full sm:w-1/2 md:w-1/3 space-y-2">
              <div className="flex justify-between font-semibold text-gray-600">
                <span>Subtotal:</span>
                <span>${orderData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-600">
                <span>Tax:</span>
                <span>${orderData.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-600">
                <span>Discount:</span>
                <span>-${orderData.discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl text-gray-800 border-t-2 pt-2 mt-2 border-gray-200">
                <span>Total:</span>
                <span>${orderData.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-800 font-semibold mb-2">Payment Details:</p>
            <p className="text-gray-600">
              Please transfer the total amount to the following bank account:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-700">
              <li>Bank: MockBank Inc.</li>
              <li>Account Name: MockStore Orders</li>
              <li>Account Number: 123456789</li>
              <li>Routing Number: 987654321</li>
            </ul>
          </div>

          <p className="mt-6 text-center text-sm text-green-700 font-medium p-4 bg-green-50 rounded-md">
            Your order status will automatically be changed to the "Paid" stage
            and will be scheduled for delivery upon successful payment
            verification.
          </p>
        </div>
      </div>

      <div className="mt-4 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-colors duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6m4-4H9m-2 4v2a2 2 0 002 2h6a2 2 0 002-2v-2"
            />
          </svg>
          <span>Print Invoice</span>
        </button>
      </div>
    </div>
  );
};

export default PrintableInvoice;
