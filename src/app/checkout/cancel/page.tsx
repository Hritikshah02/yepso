export default function CheckoutCancel() {
  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <h1 className="text-2xl font-semibold mb-2">Payment Cancelled</h1>
      <p className="text-gray-600 mb-6">Your payment was cancelled. You can try again from your cart.</p>
      <a href="/cart" className="text-blue-600 underline">Back to cart</a>
    </div>
  )
}
