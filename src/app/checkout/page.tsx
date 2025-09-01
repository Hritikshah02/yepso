"use client";

import { useEffect, useMemo, useState } from "react";
import PromoBanner from "../components/prenavbar";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Address = {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

const initialAddress: Address = {
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "IN",
};

export default function CheckoutPage() {
  const [shipping, setShipping] = useState<Address>({ ...initialAddress });
  const [billing, setBilling] = useState<Address>({ ...initialAddress });
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (sameAsShipping) setBilling(shipping);
  }, [sameAsShipping, shipping]);

  // --- India states and sample cities ---
  const IN_STATES = useMemo(
    () => [
      "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"
    ],
    []
  );

  const CITIES_BY_STATE: Record<string, string[]> = useMemo(() => ({
    "Andhra Pradesh": ["Visakhapatnam","Vijayawada","Guntur","Tirupati"],
    Assam: ["Guwahati","Silchar","Dibrugarh"],
    Bihar: ["Patna","Gaya","Bhagalpur"],
    Goa: ["Panaji","Margao","Mapusa"],
    Gujarat: ["Ahmedabad","Surat","Vadodara","Rajkot"],
    Haryana: ["Gurugram","Faridabad","Panipat"],
    "Himachal Pradesh": ["Shimla","Mandi","Dharamshala"],
    Jharkhand: ["Ranchi","Jamshedpur","Dhanbad"],
    Karnataka: ["Bengaluru","Mysuru","Mangaluru","Hubballi"],
    Kerala: ["Thiruvananthapuram","Kochi","Kozhikode"],
    "Madhya Pradesh": ["Bhopal","Indore","Gwalior","Jabalpur"],
    Maharashtra: ["Mumbai","Pune","Nagpur","Nashik","Thane"],
    Odisha: ["Bhubaneswar","Cuttack","Rourkela"],
    Punjab: ["Ludhiana","Amritsar","Jalandhar","Mohali"],
    Rajasthan: ["Jaipur","Udaipur","Jodhpur","Kota"],
    Sikkim: ["Gangtok"],
    "Tamil Nadu": ["Chennai","Coimbatore","Madurai","Salem"],
    Telangana: ["Hyderabad","Warangal","Karimnagar"],
    Tripura: ["Agartala"],
    "Uttar Pradesh": ["Lucknow","Kanpur","Noida","Ghaziabad","Varanasi"],
    Uttarakhand: ["Dehradun","Haridwar","Haldwani"],
    "West Bengal": ["Kolkata","Howrah","Durgapur","Siliguri"],
    "Arunachal Pradesh": ["Itanagar"],
    Manipur: ["Imphal"],
    Meghalaya: ["Shillong"],
    Mizoram: ["Aizawl"],
    Nagaland: ["Kohima","Dimapur"],
    "Chhattisgarh": ["Raipur","Bhilai"],
    "Andaman and Nicobar Islands": ["Port Blair"],
    Chandigarh: ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Silvassa","Daman"],
    Delhi: ["New Delhi"],
    "Jammu and Kashmir": ["Srinagar","Jammu"],
    Ladakh: ["Leh"],
    Lakshadweep: ["Kavaratti"],
    Puducherry: ["Puducherry","Karaikal"],
  }), []);

  // --- Validation helpers ---
  const isEmail = (v: string) => /^(?:[A-Z0-9._%+-]+)@(?:[A-Z0-9.-]+)\.[A-Z]{2,}$/i.test(v.trim());
  const isPhoneIN = (v: string) => /^[6-9]\d{9}$/.test(v.trim());
  const isPinIN = (v: string) => /^\d{6}$/.test(v.trim());

  type AddressErrors = Partial<Record<keyof Address, string>>;
  const validateAddress = (a: Address): AddressErrors => {
    const e: AddressErrors = {};
    if (!a.name?.trim()) e.name = "Name is required";
    if (!isPhoneIN(a.phone)) e.phone = "Enter a valid 10-digit phone";
    if (!a.line1?.trim()) e.line1 = "Address line 1 is required";
    if (!a.state?.trim() || !IN_STATES.includes(a.state)) e.state = "Select a valid state";
    if (!a.city?.trim()) e.city = "City is required";
    if (!isPinIN(a.postalCode)) e.postalCode = "Enter a 6-digit PIN";
    return e;
  };

  const shippingErrors = useMemo(() => validateAddress(shipping), [shipping]);
  const billingErrors = useMemo(() => (sameAsShipping ? {} : validateAddress(billing)), [billing, sameAsShipping]);
  const emailError = useMemo(() => (!email ? "Email is required" : isEmail(email) ? "" : "Enter a valid email"), [email]);

  const formInvalid = useMemo(() => {
    const hasShipErr = Object.keys(shippingErrors).length > 0;
    const hasBillErr = sameAsShipping ? false : Object.keys(billingErrors).length > 0;
    return !!emailError || hasShipErr || hasBillErr;
  }, [shippingErrors, billingErrors, sameAsShipping, emailError]);

  async function loadRazorpay() {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });
  }

  async function startPayment() {
    try {
      setLoading(true);
      setError("");
      if (formInvalid) throw new Error("Please fix the form errors");

      // Create order on server
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          shipping,
          billing: sameAsShipping ? shipping : billing,
        }),
      });
      if (!res.ok) throw new Error("Failed to create order");
      const { orderId, razorpayOrder } = await res.json();

      // Load key id
      const keyRes = await fetch("/api/checkout/razorpay-key");
      const { keyId } = await keyRes.json();

      const ok = await loadRazorpay();
      if (!ok) throw new Error("Razorpay SDK failed to load");

      const options = {
        key: keyId,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Yepso",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        prefill: {
          email,
          name: shipping.name,
          contact: shipping.phone,
        },
        notes: razorpayOrder.notes,
        theme: { color: "#EF4444" },
        handler: function () {
          // Pass orderId to success page for review collection
          window.location.href = `/checkout/success?orderId=${encodeURIComponent(orderId)}`;
        },
        modal: {
          ondismiss: function () {
            window.location.href = "/checkout/cancel";
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e: any) {
      setError(e?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  async function placeCOD() {
    try {
      setLoading(true);
      setError("");
      if (formInvalid) throw new Error("Please fix the form errors");
      const res = await fetch("/api/checkout/cod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, shipping, billing: sameAsShipping ? shipping : billing }),
      });
      if (!res.ok) throw new Error("Failed to place COD order");
      const { orderId } = await res.json();
      window.location.href = `/checkout/success?orderId=${encodeURIComponent(orderId)}`;
    } catch (e: any) {
      setError(e?.message || "COD failed");
    } finally {
      setLoading(false);
    }
  }

  function input(label: string, value: string, onChange: (v: string) => void, type = "text", errorText = "") {
    return (
      <label className="flex flex-col gap-1">
        <span className="text-sm text-gray-600">{label}</span>
        <input
          className="border rounded-md px-3 py-2"
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
        />
        {errorText ? <span className="text-sm text-red-600">{errorText}</span> : null}
      </label>
    );
  }

  function select(
    label: string,
    value: string,
    onChange: (v: string) => void,
    options: string[],
    placeholder = "Select...",
    errorText = ""
  ) {
    return (
      <label className="flex flex-col gap-1">
        <span className="text-sm text-gray-600">{label}</span>
        <select
          className="border rounded-md px-3 py-2 bg-white"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {errorText ? <span className="text-sm text-red-600">{errorText}</span> : null}
      </label>
    );
  }

  return (
    <>
      <PromoBanner />
      <Navbar />
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="space-y-3">
            <h2 className="font-medium">Shipping Address</h2>
            {input("Full Name", shipping.name, (v) => setShipping({ ...shipping, name: v }), "text", shippingErrors.name)}
            {input("Phone", shipping.phone, (v) => setShipping({ ...shipping, phone: v }), "tel", shippingErrors.phone)}
            {input("Address Line 1", shipping.line1, (v) => setShipping({ ...shipping, line1: v }), "text", shippingErrors.line1)}
            {input("Address Line 2", shipping.line2 || "", (v) => setShipping({ ...shipping, line2: v }))}
            {select(
              "State",
              shipping.state,
              (v) => setShipping({ ...shipping, state: v, city: "" }),
              IN_STATES,
              "Select state",
              shippingErrors.state
            )}
            {(() => {
              const cities = CITIES_BY_STATE[shipping.state] || [];
              return cities.length > 0
                ? select("City", shipping.city, (v) => setShipping({ ...shipping, city: v }), cities, "Select city", shippingErrors.city)
                : input("City", shipping.city, (v) => setShipping({ ...shipping, city: v }), "text", shippingErrors.city);
            })()}
            {input("Postal Code", shipping.postalCode, (v) => setShipping({ ...shipping, postalCode: v }), "text", shippingErrors.postalCode)}
          </section>

          <section className="space-y-3">
            <h2 className="font-medium">Billing Address</h2>
            <label className="flex items-center gap-2 mb-2">
              <input type="checkbox" checked={sameAsShipping} onChange={(e) => setSameAsShipping(e.target.checked)} />
              <span>Same as shipping</span>
            </label>
            {!sameAsShipping && (
              <div className="space-y-3">
                {input("Full Name", billing.name, (v) => setBilling({ ...billing, name: v }), "text", billingErrors.name)}
                {input("Phone", billing.phone, (v) => setBilling({ ...billing, phone: v }), "tel", billingErrors.phone)}
                {input("Address Line 1", billing.line1, (v) => setBilling({ ...billing, line1: v }), "text", billingErrors.line1)}
                {input("Address Line 2", billing.line2 || "", (v) => setBilling({ ...billing, line2: v }))}
                {select(
                  "State",
                  billing.state,
                  (v) => setBilling({ ...billing, state: v, city: "" }),
                  IN_STATES,
                  "Select state",
                  billingErrors.state
                )}
                {(() => {
                  const cities = CITIES_BY_STATE[billing.state] || [];
                  return cities.length > 0
                    ? select("City", billing.city, (v) => setBilling({ ...billing, city: v }), cities, "Select city", billingErrors.city)
                    : input("City", billing.city, (v) => setBilling({ ...billing, city: v }), "text", billingErrors.city);
                })()}
                {input("Postal Code", billing.postalCode, (v) => setBilling({ ...billing, postalCode: v }), "text", billingErrors.postalCode)}
              </div>
            )}
          </section>
        </div>

        <div className="mt-4">
          {input("Email (login email)", email, setEmail, "email", emailError)}
        </div>
      {error && <p className="text-red-600 mt-4">{error}</p>}

      <div className="flex gap-3 mt-6">
        <button disabled={formInvalid || loading} onClick={startPayment} className="bg-red-600 text-white rounded-md px-5 py-2 disabled:opacity-50">
          Pay with Razorpay (Cards/UPI/NetBanking)
        </button>
        <button disabled={formInvalid || loading} onClick={placeCOD} className="border rounded-md px-5 py-2">
          Cash on Delivery
        </button>
      </div>
      </div>
      <Footer />
    </>
  );
}
