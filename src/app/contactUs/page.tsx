"use client";

import { useState } from "react";

export default function ContactUs() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");

  const handleSendOtp = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setOtpError("Please enter a valid phone number");
      return;
    }
    
    // Simulate sending OTP (in production, call your backend API)
    setOtpSent(true);
    setOtpError("");
    setOtpSuccess("OTP sent to your phone number!");
    
    // Clear success message after 3 seconds
    setTimeout(() => setOtpSuccess(""), 3000);
  };

  const handleVerifyOtp = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }
    
    // Simulate OTP verification (in production, call your backend API)
    // For demo purposes, accept any 6-digit OTP
    setPhoneVerified(true);
    setOtpError("");
    setOtpSuccess("Phone number verified successfully!");
    
    // Clear success message after 3 seconds
    setTimeout(() => setOtpSuccess(""), 3000);
  };

  return (
    <>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 bg-gray-100 min-h-screen">
        {/* Contact Form Section */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border p-5 sm:p-6 md:p-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-900 text-center">Contact Us</h2>
          <p className="mb-4 sm:mb-6 text-gray-700 text-center">
            Our first priority is customer satisfaction! You can contact us at any point of time!
          </p>

          <div className="mb-5 sm:mb-6 space-y-3 text-gray-800">
            <a 
              href="https://wa.me/7007997152" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 sm:gap-3 font-medium bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl p-3 sm:p-4 transition-colors cursor-pointer text-sm sm:text-base"
            >
              <i className="fa-brands fa-whatsapp text-green-600 text-lg sm:text-xl flex-shrink-0"></i>
              <span className="text-center">Chat with us on WhatsApp</span>
            </a>
            
            <a 
              href="mailto:care@yepso.in" 
              className="flex items-center justify-center gap-2 sm:gap-3 font-medium bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-3 sm:p-4 transition-colors cursor-pointer text-sm sm:text-base"
            >
              <i className="fa-regular fa-envelope text-blue-600 text-lg sm:text-xl flex-shrink-0"></i>
              <span className="text-center">Drop us a mail!</span>
            </a>
            
            <a 
              href="tel:1800-314-4818" 
              className="flex items-center justify-center gap-2 sm:gap-3 font-medium bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-3 sm:p-4 transition-colors cursor-pointer text-sm sm:text-base"
            >
              <i className="fa-solid fa-phone text-gray-600 text-lg sm:text-xl flex-shrink-0"></i>
              <span className="text-center">Contact us on our Toll-Free Number</span>
            </a>
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

            {/* Phone Number with OTP Verification */}
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium">Phone Number</span>
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <input 
                    type="tel" 
                    placeholder="Enter 10-digit phone number" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={phoneVerified}
                    className="flex-1 rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black/20 disabled:bg-gray-100 disabled:cursor-not-allowed" 
                  />
                  {!phoneVerified && (
                    <button
                      onClick={handleSendOtp}
                      className="px-4 py-3 bg-black text-white rounded-xl hover:bg-black/90 transition whitespace-nowrap text-sm sm:w-auto w-full"
                    >
                      {otpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                  )}
                  {phoneVerified && (
                    <div className="flex items-center justify-center px-4 py-3 bg-green-100 text-green-700 rounded-xl sm:w-auto w-full">
                      <i className="fa-solid fa-check mr-2"></i>
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  )}
                </div>
              </label>

              {otpSent && !phoneVerified && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit OTP" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="flex-1 rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black/20" 
                  />
                  <button
                    onClick={handleVerifyOtp}
                    className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition whitespace-nowrap text-sm sm:w-auto w-full"
                  >
                    Verify OTP
                  </button>
                </div>
              )}

              {otpError && (
                <p className="text-sm text-red-600">{otpError}</p>
              )}
              {otpSuccess && (
                <p className="text-sm text-green-600">{otpSuccess}</p>
              )}
            </div>

            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input type="email" placeholder="Email" className="mt-2 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black/20" />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Confirm Email</span>
              <input type="email" placeholder="Confirm Email" className="mt-2 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black/20" />
            </label>

            {/* Address Fields */}
            <label className="block">
              <span className="text-sm font-medium">Street Address</span>
              <input type="text" placeholder="Street Address" className="mt-2 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black/20" />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium">City</span>
                <input type="text" placeholder="City" className="mt-2 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black/20" />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Pincode/Postal Code</span>
                <input type="text" placeholder="Pincode" className="mt-2 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black/20" />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium">State</span>
              <select className="mt-2 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black/20 bg-white">
                <option value="">Select State</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                <option value="Delhi">Delhi</option>
                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                <option value="Ladakh">Ladakh</option>
                <option value="Lakshadweep">Lakshadweep</option>
                <option value="Puducherry">Puducherry</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium">Message</span>
              <textarea
                placeholder="Write your message here..."
                className="mt-2 w-full rounded-xl border border-gray-300 p-3 min-h-32 resize-y focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </label>

            <button type="submit" className="w-full bg-black text-white px-6 py-3 rounded-xl hover:bg-black/90 transition">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

