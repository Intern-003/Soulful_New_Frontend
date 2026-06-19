import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart, selectCartItems, selectCartTotals, selectCartItemsByVendor } from "../../app/slices/cartSlice";
import usePost from "../../api/hooks/usePost";
import useGet from "../../api/hooks/useGet";
import { getImageUrl } from "../../utils/getImageUrl";
import toast from "react-hot-toast";
import {
  Check,
  Truck,
  Shield,
  CreditCard,
  MapPin,
  User,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const steps = ["Info", "Shipping", "Payment", "Review"];

const Input = ({ name, value, onChange, placeholder, type = "text", required = false }) => (
  <div className="relative">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder=" "
      required={required}
      className="peer w-full border border-[#ecd2d9] bg-white/60 backdrop-blur-md rounded-xl px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-[#8B0D3A] transition"
    />
    <label className="absolute left-4 top-2 text-xs text-gray-400 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#8B0D3A] transition-all">
      {placeholder}
    </label>
  </div>
);

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const { postData, loading, error } = usePost();
  const [creatingAddress, setCreatingAddress] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Fetch user addresses
  const { data: addressesData, refetch: refetchAddresses, loading: addressesLoading } = useGet("/address");
  const addresses = Array.isArray(addressesData) ? addressesData : [];

  // Cart selectors
  const items = useSelector(selectCartItems);
  const totals = useSelector(selectCartTotals);
  const itemsByVendor = useSelector(selectCartItemsByVendor);
  const appliedCoupon = useSelector((state) => state.cart.appliedCoupon);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    saveAddress: false,
    selectedAddressId: "",
    payment: "cod",
    notes: "",
  });

  const [toastMsg, setToastMsg] = useState(null);
  const [useExistingAddress, setUseExistingAddress] = useState(false);

  const showToast = (message, type = "error") => {
    setToastMsg({ message, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    dispatch(fetchCart());
    refetchAddresses();
  }, [dispatch]);

  // Auto-select default address when addresses are loaded
  useEffect(() => {
    if (addresses.length > 0 && !form.selectedAddressId) {
      const defaultAddress = addresses.find(addr => addr.is_default);
      if (defaultAddress) {
        setForm(prev => ({
          ...prev,
          selectedAddressId: defaultAddress.id,
          addressLine1: defaultAddress.address_line1,
          addressLine2: defaultAddress.address_line2 || "",
          city: defaultAddress.city,
          state: defaultAddress.state,
          zip: defaultAddress.postal_code,
          country: defaultAddress.country,
        }));
        setUseExistingAddress(true);
      }
    }
  }, [addresses]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const selectAddress = (addr) => {
    setForm({
      ...form,
      selectedAddressId: addr.id,
      addressLine1: addr.address_line1,
      addressLine2: addr.address_line2 || "",
      city: addr.city,
      state: addr.state,
      zip: addr.postal_code,
      country: addr.country,
    });
    setUseExistingAddress(true);
  };

  const validateStep = () => {
    if (step === 1) {
      if (!form.firstName.trim()) {
        showToast("Please enter your first name");
        return false;
      }
      if (!form.lastName.trim()) {
        showToast("Please enter your last name");
        return false;
      }
      if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
        showToast("Please enter a valid email address");
        return false;
      }
      if (!form.phone.trim() || form.phone.length < 10) {
        showToast("Please enter a valid phone number");
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (useExistingAddress && !form.selectedAddressId) {
        showToast("Please select a saved address");
        return false;
      }
      if (!useExistingAddress) {
        if (!form.addressLine1.trim()) {
          showToast("Please enter your address");
          return false;
        }
        if (!form.city.trim()) {
          showToast("Please enter your city");
          return false;
        }
        if (!form.state.trim()) {
          showToast("Please enter your state");
          return false;
        }
        if (!form.zip.trim() || form.zip.length < 5) {
          showToast("Please enter a valid PIN code");
          return false;
        }
      }
      return true;
    }

    if (step === 3) {
      if (!form.payment) {
        showToast("Please select a payment method");
        return false;
      }
      return true;
    }

    return true;
  };

  const validateStock = () => {
    for (const item of items) {
      const stock = item.variant?.stock || item.product?.stock;
      if (stock !== undefined && item.quantity > stock) {
        return {
          valid: false,
          product: item.product?.name,
          available: stock,
        };
      }
    }
    return { valid: true };
  };

  const handlePlaceOrder = async () => {
    const stockCheck = validateStock();
    if (!stockCheck.valid) {
      showToast(`Not enough stock for "${stockCheck.product}". Only ${stockCheck.available} left.`);
      return;
    }

    if (form.payment !== "cod") {
      showToast("Online payments are currently unavailable. Please select Cash on Delivery");
      return;
    }

    setPlacingOrder(true);

    try {
      let addressId = form.selectedAddressId;

      // If new address and user wants to save it, create address first
      if (!addressId && form.saveAddress) {
        setCreatingAddress(true);
        
        const addressResponse = await postData({
          url: "/address",
          data: {
            name: `${form.firstName} ${form.lastName}`,
            phone: form.phone,
            address_line1: form.addressLine1,
            address_line2: form.addressLine2,
            city: form.city,
            state: form.state,
            postal_code: form.zip,
            country: form.country,
            is_default: false,
          }
        });
        
        // Get address ID from response
        addressId = addressResponse?.data?.id || addressResponse?.id;
        
        if (!addressId) {
          toast.error("Failed to save address. Please try again.");
          setCreatingAddress(false);
          setPlacingOrder(false);
          return;
        }
        
        setCreatingAddress(false);
      }

      // Prepare order data
      const orderData = {
        address_id: addressId || null,
        payment_method: form.payment,
        notes: form.notes,
      };

      // Send address details if no address ID exists
      if (!addressId) {
        orderData.name = `${form.firstName} ${form.lastName}`;
        orderData.phone = form.phone;
        orderData.address_line1 = form.addressLine1;
        orderData.address_line2 = form.addressLine2;
        orderData.city = form.city;
        orderData.state = form.state;
        orderData.pincode = form.zip;
        orderData.country = form.country;
      }

      // Validate we have address info
      if (!orderData.address_id && (!orderData.name || !orderData.address_line1)) {
        toast.error("Please provide a complete address");
        setPlacingOrder(false);
        return;
      }

      // Place order
      const response = await postData({
        url: "/place-order",
        data: orderData,
      });

      let orderDataResponse = response.data?.data || response.data;
      if (response.success && response.data) {
        orderDataResponse = response.data;
      }

      navigate("/order-complete", {
        state: {
          orderData: {
            orderId: orderDataResponse.order_id,
            orderNumber: orderDataResponse.order_number,
            grandTotal: orderDataResponse.grand_total,
            createdAt: new Date().toISOString(),
          },
          orderSummary: {
            items,
            itemsByVendor,
            totals,
            shippingAddress: form,
            paymentMethod: form.payment,
          },
        },
      });
    } catch (err) {
      console.error("Order placement error:", err);
      showToast(err?.response?.data?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  const hasStockIssue = items.some(
    (item) => item.quantity > (item.variant?.stock || item.product?.stock || 0)
  );

  const isFormValid = () => {
    if (step === 1) return form.firstName && form.lastName && form.email && form.phone;
    if (step === 2) {
      if (useExistingAddress) return form.selectedAddressId;
      return form.addressLine1 && form.city && form.state && form.zip;
    }
    if (step === 3) return form.payment;
    return true;
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff9fb] via-white to-[#fff3f6] overflow-hidden">
      {/* GLOW */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#8B0D3A]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#7A1C3D]/10 blur-[120px] rounded-full" />

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-10">
        <h1 className="text-4xl font-semibold text-[#7A1C3D]">Checkout</h1>

        {/* STEPS */}
        <div className="flex gap-3 mt-6 flex-wrap">
          {steps.map((s, i) => {
            const current = i + 1;
            const isCompleted = step > current;
            const isActive = step === current;

            return (
              <div
                key={i}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${isActive
                  ? "bg-[#8B0D3A] text-white shadow-md"
                  : isCompleted
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                  }`}
              >
                {isCompleted ? <Check size={12} className="inline mr-1" /> : null}
                {s}
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 grid lg:grid-cols-3 gap-10 pb-16">
        {/* LEFT - FORM */}
        <div className="lg:col-span-2">
          <div className="bg-white/70 backdrop-blur-xl border border-[#f1d6dd] rounded-3xl p-6 md:p-8 shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* STEP 1 - Personal Info */}
                {step === 1 && (
                  <>
                    <div className="flex items-center gap-2 mb-6">
                      <User size={20} className="text-[#8B0D3A]" />
                      <h2 className="text-2xl font-semibold">Your Details</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        required
                      />
                      <Input
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        required
                      />
                    </div>

                    <div className="mt-4">
                      <Input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        required
                      />
                    </div>

                    <div className="mt-4">
                      <Input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        required
                      />
                    </div>
                  </>
                )}

                {/* STEP 2 - Shipping Address */}
                {step === 2 && (
                  <>
                    <div className="flex items-center gap-2 mb-6">
                      <MapPin size={20} className="text-[#8B0D3A]" />
                      <h2 className="text-2xl font-semibold">Shipping Address</h2>
                    </div>

                    {/* Loading State */}
                    {addressesLoading ? (
                      <div className="mb-6 p-4 bg-white/50 rounded-xl flex items-center justify-center gap-2">
                        <Loader2 size={20} className="animate-spin text-[#8B0D3A]" />
                        <span className="text-sm text-gray-500">Loading your addresses...</span>
                      </div>
                    ) : addresses.length > 0 ? (
                      <>
                        {/* Toggle buttons */}
                        <div className="mb-6">
                          <div className="flex gap-4 mb-4">
                            <button
                              type="button"
                              onClick={() => {
                                setUseExistingAddress(true);
                                setForm({ ...form, selectedAddressId: "", addressLine1: "", addressLine2: "", city: "", state: "", zip: "", country: "India" });
                              }}
                              className={`flex-1 py-3 rounded-xl font-medium transition-all ${useExistingAddress
                                ? "bg-[#8B0D3A] text-white shadow-md"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                              📦 Use Saved Address ({addresses.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setUseExistingAddress(false);
                                setForm({ ...form, selectedAddressId: "" });
                              }}
                              className={`flex-1 py-3 rounded-xl font-medium transition-all ${!useExistingAddress
                                ? "bg-[#8B0D3A] text-white shadow-md"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                              ✍️ Enter New Address
                            </button>
                          </div>
                        </div>

                        {/* SAVED ADDRESSES - 2x2 Grid */}
                        {useExistingAddress && (
                          <div className="mb-6 p-4 bg-white/50 rounded-xl border border-[#ecd2d9]">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Select Saved Address
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {addresses.map((addr) => (
                                <div
                                  key={addr.id}
                                  onClick={() => selectAddress(addr)}
                                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${form.selectedAddressId === addr.id
                                      ? "border-[#8B0D3A] bg-[#8B0D3A]/5 shadow-md"
                                      : "border-gray-200 hover:border-[#8B0D3A]/50 hover:bg-white/30"
                                    }`}
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <p className="font-semibold text-gray-800">{addr.name}</p>
                                      <p className="text-xs text-gray-500">{addr.phone}</p>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {addr.address_line1}
                                        {addr.address_line2 && `, ${addr.address_line2}`}
                                        <br />
                                        {addr.city}, {addr.state} - {addr.postal_code}
                                      </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                      {addr.is_default && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                          Default
                                        </span>
                                      )}
                                      {form.selectedAddressId === addr.id && (
                                        <div className="w-5 h-5 rounded-full bg-[#8B0D3A] flex items-center justify-center">
                                          <Check size={12} className="text-white" />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : null}

                    {/* NEW ADDRESS FORM */}
                    {!useExistingAddress && (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                            required
                          />
                          <Input
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            required
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            required
                          />
                          <Input
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            required
                          />
                        </div>

                        <Input
                          name="addressLine1"
                          value={form.addressLine1}
                          onChange={handleChange}
                          placeholder="Street Address"
                          required
                        />

                        <Input
                          name="addressLine2"
                          value={form.addressLine2}
                          onChange={handleChange}
                          placeholder="Apartment, Suite, etc. (Optional)"
                        />

                        <div className="grid md:grid-cols-2 gap-4">
                          <Input name="city" value={form.city} onChange={handleChange} placeholder="City" required />
                          <Input name="state" value={form.state} onChange={handleChange} placeholder="State" required />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <Input name="zip" value={form.zip} onChange={handleChange} placeholder="PIN Code" required />
                          <Input name="country" value={form.country} onChange={handleChange} placeholder="Country" required />
                        </div>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="saveAddress"
                            checked={form.saveAddress}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-gray-300 text-[#8B0D3A]"
                          />
                          <span className="text-sm text-gray-600">Save this address for future</span>
                        </label>
                      </div>
                    )}

                    {/* Show selected address summary */}
                    {useExistingAddress && form.selectedAddressId && (
                      <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-green-600" />
                          <span className="text-sm text-green-700 font-medium">
                            Using saved address: {form.addressLine1}, {form.city}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* STEP 3 - Payment */}
                {step === 3 && (
                  <>
                    <div className="flex items-center gap-2 mb-6">
                      <CreditCard size={20} className="text-[#8B0D3A]" />
                      <h2 className="text-2xl font-semibold">Payment Method</h2>
                    </div>

                    <div className="space-y-3">
                      {[
                        { key: "cod", label: "Cash on Delivery", icon: "💰", disabled: false, desc: "Pay when you receive the order" },
                        { key: "card", label: "Credit/Debit Card", icon: "💳", disabled: true, desc: "Coming soon" },
                        { key: "upi", label: "UPI", icon: "📱", disabled: true, desc: "Coming soon" },
                        { key: "netbanking", label: "Net Banking", icon: "🏦", disabled: true, desc: "Coming soon" },
                      ].map((p) => (
                        <div
                          key={p.key}
                          onClick={() => {
                            if (p.disabled) {
                              showToast(`${p.label} is currently unavailable`);
                              return;
                            }
                            setForm({ ...form, payment: p.key });
                          }}
                          className={`p-4 rounded-xl border transition-all ${p.disabled
                            ? "opacity-50 cursor-not-allowed bg-gray-50"
                            : "cursor-pointer hover:border-[#8B0D3A]"
                            } ${form.payment === p.key && !p.disabled
                              ? "border-[#8B0D3A] bg-[#8B0D3A]/5 shadow-sm"
                              : "border-gray-200"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{p.icon}</span>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{p.label}</p>
                              <p className="text-xs text-gray-400">{p.desc}</p>
                            </div>
                            {form.payment === p.key && !p.disabled && (
                              <div className="w-5 h-5 rounded-full bg-[#8B0D3A] flex items-center justify-center">
                                <Check size={12} className="text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* STEP 4 - Review */}
                {step === 4 && (
                  <>
                    <div className="flex items-center gap-2 mb-6">
                      <Shield size={20} className="text-[#8B0D3A]" />
                      <h2 className="text-2xl font-semibold">Review & Confirm</h2>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">Contact</p>
                        <p className="font-medium">{form.firstName} {form.lastName}</p>
                        <p className="text-sm text-gray-600">{form.email} | {form.phone}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">Shipping Address</p>
                        <p className="text-sm">
                          {form.addressLine1}<br />
                          {form.addressLine2 && <>{form.addressLine2}<br /></>}
                          {form.city}, {form.state} - {form.zip}<br />
                          {form.country}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                        <p className="font-medium capitalize">
                          {form.payment === "cod" ? "Cash on Delivery" : form.payment}
                        </p>
                      </div>

                      {appliedCoupon && (
                        <div className="bg-green-50 p-4 rounded-xl">
                          <p className="text-xs text-green-600 mb-1">Coupon Applied</p>
                          <p className="text-sm text-green-700">Discount: ₹{totals.coupon_discount}</p>
                        </div>
                      )}

                      {form.notes && (
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1">Order Notes</p>
                          <p className="text-sm">{form.notes}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* ACTIONS */}
            <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
              <button
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="px-6 py-2.5 border rounded-xl disabled:opacity-40 hover:bg-gray-50 transition"
              >
                Back
              </button>

              {step < 4 ? (
                <button
                  onClick={() => {
                    if (validateStep()) {
                      setStep(step + 1);
                    }
                  }}
                  disabled={!isFormValid() || hasStockIssue}
                  className="px-6 py-2.5 bg-[#8B0D3A] text-white rounded-xl hover:bg-[#6b0a2e] transition disabled:opacity-50"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || placingOrder || hasStockIssue}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {(loading || placingOrder || creatingAddress) && <Loader2 size={16} className="animate-spin" />}
                  {creatingAddress ? "Saving Address..." : placingOrder ? "Placing Order..." : "Place Order"}
                </button>
              )}
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-600 text-center">
                {typeof error === "string" ? error : error?.message || "Something went wrong"}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT - ORDER SUMMARY */}
        <div className="sticky top-24 h-fit">
          <div className="bg-white/80 backdrop-blur-xl border border-[#f1d6dd] rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-[#7A1C3D]">
              Your Order ({itemCount} {itemCount === 1 ? "item" : "items"})
            </h3>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scroll">
              {items.map((item) => {
                const img = item.product?.images?.find(i => i.is_primary)?.image_url ||
                  item.product?.images?.[0]?.image_url;
                const price = item.selling_price || item.price;

                return (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={getImageUrl(img)}
                      className="w-14 h-14 rounded-lg object-cover border"
                      alt={item.product?.name}
                    />
                    <div className="flex-1 text-sm">
                      <p className="font-medium text-gray-800 line-clamp-2">{item.product?.name}</p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium text-[#8B0D3A]">
                      ₹{(price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 border-t pt-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{totals.subtotal?.toLocaleString() || 0}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>₹{totals.shipping_total?.toLocaleString() || 0}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Tax (GST)</span>
                <span>₹{totals.tax_total?.toLocaleString() || 0}</span>
              </div>

              {totals.coupon_discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-₹{totals.coupon_discount?.toLocaleString()}</span>
                </div>
              )}

              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Grand Total</span>
                  <span className="text-[#8B0D3A]">₹{totals.grand_total?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            <div className="mt-4">
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Order notes (optional)"
                rows={2}
                className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B0D3A]/30 bg-white/50"
              />
            </div>

            {/* Stock Warning */}
            {hasStockIssue && (
              <div className="mt-3 p-3 bg-red-50 rounded-xl text-center">
                <p className="text-xs text-red-600">
                  Some items have insufficient stock. Please update your cart.
                </p>
                <button
                  onClick={() => navigate("/cart")}
                  className="mt-2 text-xs text-red-600 underline"
                >
                  Go to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed top-5 right-5 px-4 py-3 rounded-xl shadow-lg text-white z-50 ${toastMsg.type === "error" ? "bg-red-500" : "bg-green-500"
              }`}
          >
            {toastMsg.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <div className="text-center pb-10 text-xs text-gray-400">
        Secure checkout powered by Soulfull
      </div>
    </div>
  );
}