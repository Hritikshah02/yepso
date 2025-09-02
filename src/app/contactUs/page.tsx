"use client";

export default function ContactUs() {
  return (
    <>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
        {/* Contact Form Section */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border p-5 sm:p-6 md:p-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-900 text-center">Contact Us</h2>
          <p className="mb-4 sm:mb-6 text-gray-700 text-center">
            Our first priority is customer satisfaction! You can contact us at any point of time!
          </p>

          <div className="mb-5 sm:mb-6 space-y-2 text-gray-800 text-center">
            <p className="flex items-center justify-center gap-2 font-medium"><i className="fa-brands fa-whatsapp text-green-600"></i> Chat with us on WhatsApp</p>
            <p className="flex items-center justify-center gap-2 font-medium"><i className="fa-regular fa-envelope text-gray-600"></i> Drop us a mail!</p>
            <p className="flex items-center justify-center gap-2 font-medium"><i className="fa-solid fa-phone text-gray-600"></i> Contact us on our Toll-Free Number</p>
          </div>

          <form className="mt-2 space-y-5 sm:space-y-6 text-gray-900">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium">First Name</span>
                <input type="text" placeholder="First Name" className="mt-2 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black/20" />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Last Name</span>
                <input type="text" placeholder="Last Name" className="mt-2 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black/20" />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input type="email" placeholder="Email" className="mt-2 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black/20" />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Confirm Email</span>
              <input type="email" placeholder="Confirm Email" className="mt-2 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black/20" />
            </label>

            <div>
              <span className="text-sm font-medium">Services Interested In</span>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="inline-flex items-center gap-2 text-gray-800"><input type="checkbox" className="accent-black" /> Website Design</label>
                <label className="inline-flex items-center gap-2 text-gray-800"><input type="checkbox" className="accent-black" /> Content Creation</label>
                <label className="inline-flex items-center gap-2 text-gray-800"><input type="checkbox" className="accent-black" /> UX Design</label>
                <label className="inline-flex items-center gap-2 text-gray-800"><input type="checkbox" className="accent-black" /> Strategy & Consulting</label>
                <label className="inline-flex items-center gap-2 text-gray-800"><input type="checkbox" className="accent-black" /> User Research</label>
                <label className="inline-flex items-center gap-2 text-gray-800"><input type="checkbox" className="accent-black" /> Other</label>
              </div>
            </div>

            <button type="submit" className="w-full bg-black text-white px-6 py-3 rounded-xl hover:bg-black/90 transition">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

