// import { useState } from "react";
// import { Check } from "lucide-react";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCart } from "../../app/slices/cartSlice";
// import axiosInstance from "../../api/axiosInstance";
// import { getImageUrl } from "../../utils/getImageUrl";

// const steps = ["Information", "Shipping", "Payment", "Review"];

// const Checkout = () => {
//   const [step, setStep] = useState(1);

//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     state: "",
//     zip: "",
//     country: "",
//     payment: "card",
//   });

//   const handleNext = () => step < 4 && setStep(step + 1);
//   const handleBack = () => step > 1 && setStep(step - 1);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handlePlaceOrder = async () => {
//     try {
//       const payload = {
//         customer: form,
//         items: items,
//         totals: totals,
//         payment_method: form.payment,
//       };

//       const res = await axiosInstance.post("/order/create", payload);

//       console.log("ORDER CREATED", res.data);

//       // ✅ optional
//       // dispatch(clearCart())

//       alert("Order placed successfully ✅");
//     } catch (err) {
//       console.log(err);
//       alert("Order failed ❌");
//     }
//   };

//   const dispatch = useDispatch();

//   const { items, totals, status } = useSelector((state) => state.cart);

//   useEffect(() => {
//     dispatch(fetchCart());
//   }, [dispatch]);

//   return (
//     <div className="bg-gray-50 min-h-screen py-6 px-4 md:px-10">
//       {/* HEADER */}
//       <div className="max-w-7xl mx-auto mb-6">
//         <p className="text-sm text-gray-500">
//           <span className="text-[#7a1c3d] font-medium">Home</span> / Checkout
//         </p>
//         <h1 className="text-3xl font-bold text-gray-800 mt-1">Checkout</h1>
//       </div>

//       {/* STEPPER */}
//       <div className="max-w-7xl mx-auto flex items-center justify-between mb-10">
//         {steps.map((label, index) => {
//           const s = index + 1;
//           return (
//             <div key={s} className="flex items-center w-full">
//               <div className="flex flex-col items-center">
//                 <div
//                   className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition ${
//                     step > s
//                       ? "bg-green-500 text-white"
//                       : step === s
//                         ? "bg-[#7a1c3d] text-white"
//                         : "bg-gray-200 text-gray-600"
//                   }`}
//                 >
//                   {step > s ? <Check size={16} /> : s}
//                 </div>
//                 <span className="text-xs mt-2">{label}</span>
//               </div>

//               {s !== 4 && (
//                 <div
//                   className={`flex-1 h-[2px] mx-2 ${
//                     step > s ? "bg-[#7a1c3d]" : "bg-gray-300"
//                   }`}
//                 />
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* MAIN GRID */}
//       <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
//         {/* LEFT FORM */}
//         <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
//           {/* STEP 1 */}
//           {step === 1 && (
//             <>
//               <h2 className="text-2xl font-semibold text-gray-800 mb-1">
//                 Customer Information
//               </h2>
//               <p className="text-gray-500 text-sm mb-6">
//                 Enter your details for a smooth checkout
//               </p>

//               <div className="grid md:grid-cols-2 gap-5">
//                 <div>
//                   <label className="text-sm text-gray-600 mb-1 block">
//                     First Name
//                   </label>
//                   <input
//                     name="firstName"
//                     onChange={handleChange}
//                     className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a1c3d]/20 focus:border-[#7a1c3d] transition"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm text-gray-600 mb-1 block">
//                     Last Name
//                   </label>
//                   <input
//                     name="lastName"
//                     onChange={handleChange}
//                     className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a1c3d]/20 focus:border-[#7a1c3d]"
//                   />
//                 </div>
//               </div>

//               <div className="mt-5">
//                 <label className="text-sm text-gray-600 mb-1 block">
//                   Email
//                 </label>
//                 <input
//                   name="email"
//                   type="email"
//                   onChange={handleChange}
//                   className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#7a1c3d]/20 focus:border-[#7a1c3d]"
//                 />
//               </div>

//               <div className="mt-5">
//                 <label className="text-sm text-gray-600 mb-1 block">
//                   Phone
//                 </label>
//                 <input
//                   name="phone"
//                   onChange={handleChange}
//                   className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#7a1c3d]/20 focus:border-[#7a1c3d]"
//                 />
//               </div>

//               <div className="flex justify-end mt-8">
//                 <button
//                   onClick={handleNext}
//                   className="bg-[#7a1c3d] hover:bg-[#5a142c] text-white px-6 py-3 rounded-xl transition shadow-sm"
//                 >
//                   Continue →
//                 </button>
//               </div>
//             </>
//           )}

//           {step === 2 && (
//             <>
//               <h2 className="text-2xl font-semibold mb-1">Shipping Address</h2>
//               <p className="text-gray-500 text-sm mb-6">
//                 Where should we deliver your order?
//               </p>

//               <input
//                 name="address"
//                 placeholder="Street Address"
//                 onChange={handleChange}
//                 className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#7a1c3d]/20 focus:border-[#7a1c3d]"
//               />

//               <div className="grid md:grid-cols-3 gap-5 mt-5">
//                 <input
//                   name="city"
//                   placeholder="City"
//                   onChange={handleChange}
//                   className="border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#7a1c3d]/20"
//                 />
//                 <input
//                   name="state"
//                   placeholder="State"
//                   onChange={handleChange}
//                   className="border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#7a1c3d]/20"
//                 />
//                 <input
//                   name="zip"
//                   placeholder="ZIP"
//                   onChange={handleChange}
//                   className="border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#7a1c3d]/20"
//                 />
//               </div>

//               <input
//                 name="country"
//                 placeholder="Country"
//                 onChange={handleChange}
//                 className="w-full mt-5 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#7a1c3d]/20"
//               />

//               <div className="flex justify-between mt-8">
//                 <button
//                   onClick={handleBack}
//                   className="border px-6 py-3 rounded-xl text-gray-600 hover:bg-gray-100"
//                 >
//                   Back
//                 </button>

//                 <button
//                   onClick={handleNext}
//                   className="bg-[#7a1c3d] text-white px-6 py-3 rounded-xl hover:bg-[#5a142c]"
//                 >
//                   Continue →
//                 </button>
//               </div>
//             </>
//           )}

//           {/* STEP 3 */}
//           {step === 3 && (
//             <>
//               <h2 className="text-2xl font-semibold mb-6">Payment Method</h2>

//               <div className="space-y-4">
//                 {["card", "paypal", "apple"].map((p) => (
//                   <div
//                     key={p}
//                     onClick={() => setForm({ ...form, payment: p })}
//                     className={`flex justify-between items-center p-4 rounded-xl border cursor-pointer transition ${
//                       form.payment === p
//                         ? "border-[#7a1c3d] bg-[#7a1c3d]/5"
//                         : "border-gray-200 hover:border-gray-300"
//                     }`}
//                   >
//                     <span className="capitalize">{p}</span>

//                     <div
//                       className={`w-4 h-4 rounded-full border ${
//                         form.payment === p
//                           ? "bg-[#7a1c3d] border-[#7a1c3d]"
//                           : "border-gray-400"
//                       }`}
//                     />
//                   </div>
//                 ))}
//               </div>

//               <div className="flex justify-between mt-8">
//                 <button
//                   onClick={handleBack}
//                   className="border px-6 py-3 rounded-xl"
//                 >
//                   Back
//                 </button>

//                 <button
//                   onClick={handleNext}
//                   className="bg-[#7a1c3d] text-white px-6 py-3 rounded-xl"
//                 >
//                   Review →
//                 </button>
//               </div>
//             </>
//           )}

//           {/* STEP 4 */}
//           {step === 4 && (
//             <>
//               <h2 className="text-2xl font-semibold mb-6">Review Order</h2>

//               <div className="space-y-4">
//                 <div className="border rounded-xl p-4 bg-gray-50">
//                   <p className="font-medium">
//                     {form.firstName} {form.lastName}
//                   </p>
//                   <p className="text-sm text-gray-500">{form.email}</p>
//                   <p className="text-sm text-gray-500">{form.phone}</p>
//                 </div>

//                 <div className="border rounded-xl p-4 bg-gray-50">
//                   <p>{form.address}</p>
//                   <p className="text-sm text-gray-500">
//                     {form.city}, {form.state}
//                   </p>
//                 </div>

//                 <div className="border rounded-xl p-4 bg-gray-50">
//                   <p className="capitalize">{form.payment}</p>
//                 </div>
//               </div>

//               <div className="flex justify-between mt-8">
//                 <button
//                   onClick={handleBack}
//                   className="border px-6 py-3 rounded-xl"
//                 >
//                   Back
//                 </button>

//                 <button
//                   onClick={handlePlaceOrder}
//                   className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow"
//                 >
//                   Place Order
//                 </button>
//               </div>
//             </>
//           )}
//         </div>

//         <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-6 h-[500px] flex flex-col">
//           {/* 🛒 SCROLLABLE PRODUCTS */}
//           <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
//             {items?.map((item) => {
//               const img =
//                 item.product?.images?.find((i) => i.is_primary)?.image_url ||
//                 item.product?.images?.[0]?.image_url;

//               return (
//                 <div key={item.id} className="flex items-center gap-3">
//                   <img
//                     src={getImageUrl(img) || "/placeholder.jpg"}
//                     alt={item.product?.name}
//                     className="w-14 h-14 rounded-lg object-cover"
//                   />

//                   <div className="flex-1">
//                     <p className="text-sm font-medium">{item.product?.name}</p>
//                     <p className="text-xs text-gray-500">
//                       Qty: {item.quantity}
//                     </p>
//                   </div>

//                   <p className="text-sm font-semibold">₹{item.price}</p>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="border-t pt-4">
//             <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

//             <div className="flex justify-between mb-2">
//               <span>Subtotal</span>
//               <span>₹{totals.subtotal}</span>
//             </div>

//             <div className="flex justify-between mb-2">
//               <span>Shipping</span>
//               <span>₹{totals.shipping}</span>
//             </div>

//             <div className="flex justify-between mb-2">
//               <span>Discount</span>
//               <span>-₹{totals.discount}</span>
//             </div>

//             <hr className="my-3" />

//             <div className="flex justify-between font-semibold text-lg text-[#7a1c3d]">
//               <span>Total</span>
//               <span>₹{totals.total}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../app/slices/cartSlice";
import axiosInstance from "../../api/axiosInstance";
import { getImageUrl } from "../../utils/getImageUrl";

const steps = ["Info", "Shipping", "Payment", "Review"];

const Input = ({ name, value, onChange, placeholder }) => (
  <div className="relative">
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder=" "
      className="peer w-full border border-[#ecd2d9] bg-white/60 backdrop-blur-md rounded-xl px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-[#8B0D3A]"
    />
    <label className="absolute left-4 top-2 text-xs text-gray-400 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#8B0D3A] transition-all">
      {placeholder}
    </label>
  </div>
);

export default function Checkout() {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    payment: "card",
  });

  const dispatch = useDispatch();
  const { items, totals } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    await axiosInstance.post("/order/create", {
      customer: form,
      items,
      totals,
      payment_method: form.payment,
    });

    alert("Order placed 🎉");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff9fb] via-white to-[#fff3f6] overflow-hidden">
      {/* GLOW */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#8B0D3A]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#7A1C3D]/10 blur-[120px] rounded-full" />

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-10">
        <h1 className="text-4xl font-semibold text-[#7A1C3D]">Checkout</h1>

        {/* STEPS */}
        <div className="flex gap-3 mt-6">
          {steps.map((s, i) => {
            const current = i + 1;
            return (
              <div
                key={i}
                className={`px-4 py-1 rounded-full text-xs transition ${
                  step === current
                    ? "bg-[#8B0D3A] text-white"
                    : step > current
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {step > current ? <Check size={12} /> : s}
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 grid lg:grid-cols-3 gap-10 pb-16">
        {/* LEFT */}
        <div className="lg:col-span-2">
          <div className="bg-white/70 backdrop-blur-xl border border-[#f1d6dd] rounded-3xl p-8 shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
              >
                {/* STEP 1 */}
                {step === 1 && (
                  <>
                    <h2 className="text-2xl font-semibold mb-6">
                      Your Details
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        name="firstName"
                        onChange={handleChange}
                        placeholder="First Name"
                      />
                      <Input
                        name="lastName"
                        onChange={handleChange}
                        placeholder="Last Name"
                      />
                    </div>

                    <div className="mt-4">
                      <Input
                        name="email"
                        onChange={handleChange}
                        placeholder="Email"
                      />
                    </div>

                    <div className="mt-4">
                      <Input
                        name="phone"
                        onChange={handleChange}
                        placeholder="Phone"
                      />
                    </div>
                  </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <>
                    <h2 className="text-2xl font-semibold mb-6">
                      Shipping Address
                    </h2>

                    <Input
                      name="address"
                      onChange={handleChange}
                      placeholder="Street Address"
                    />

                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <Input
                        name="city"
                        onChange={handleChange}
                        placeholder="City"
                      />
                      <Input
                        name="state"
                        onChange={handleChange}
                        placeholder="State"
                      />
                      <Input
                        name="zip"
                        onChange={handleChange}
                        placeholder="ZIP"
                      />
                    </div>

                    <div className="mt-4">
                      <Input
                        name="country"
                        onChange={handleChange}
                        placeholder="Country"
                      />
                    </div>
                  </>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <>
                    <h2 className="text-2xl font-semibold mb-6">
                      Payment Method
                    </h2>

                    <div className="space-y-3">
                      {["card", "upi", "cod"].map((p) => (
                        <div
                          key={p}
                          onClick={() => setForm({ ...form, payment: p })}
                          className={`p-4 rounded-xl border cursor-pointer transition ${
                            form.payment === p
                              ? "border-[#8B0D3A] bg-[#8B0D3A]/5"
                              : "border-gray-200"
                          }`}
                        >
                          {p.toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* STEP 4 */}
                {step === 4 && (
                  <>
                    <h2 className="text-2xl font-semibold mb-6">
                      Review & Confirm
                    </h2>

                    <div className="space-y-4 text-sm">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        {form.firstName} {form.lastName}
                        <br />
                        {form.email}
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">
                        {form.address}, {form.city}
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl capitalize">
                        {form.payment}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* ACTIONS */}
            <div className="flex justify-between mt-10">
              <button
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="px-6 py-3 border rounded-xl disabled:opacity-40"
              >
                Back
              </button>

              {step < 4 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-3 bg-[#8B0D3A] text-white rounded-xl"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl shadow"
                >
                  Place Order
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="sticky top-24 h-fit">
          <div className="bg-white/80 backdrop-blur-xl border border-[#f1d6dd] rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-[#7A1C3D]">
              Your Order
            </h3>

            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
              {items.map((item) => {
                const img = item.product?.images?.[0]?.image_url;

                return (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={getImageUrl(img)}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1 text-sm">
                      {item.product?.name}
                      <br />x{item.quantity}
                    </div>
                    <div className="text-sm font-medium">₹{item.price}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 border-t pt-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totals.subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{totals.shipping}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{totals.discount}</span>
              </div>

              <div className="flex justify-between font-semibold text-lg text-[#8B0D3A] pt-2">
                <span>Total</span>
                <span>₹{totals.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center pb-10 text-xs text-gray-400">
        Secure checkout powered by Soulfull
      </div>
    </div>
  );
}
