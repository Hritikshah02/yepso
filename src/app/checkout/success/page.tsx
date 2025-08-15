export default function CheckoutSuccess() {
  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <h1 className="text-2xl font-semibold mb-2">Payment Successful</h1>
      <p className="text-gray-600 mb-6">Thank you! If you paid via Razorpay, we will email your order confirmation shortly.</p>
      <a href="/" className="text-blue-600 underline">Continue shopping</a>
    </div>
  )
}
