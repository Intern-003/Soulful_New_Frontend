import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Package, Truck, Clock, ArrowRight, Printer, Download, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, selectCartItems, selectCartTotals } from "../../app/slices/cartSlice";
import { useLocation } from "react-router-dom";
import { getImageUrl } from "../../utils/getImageUrl";
import toast from "react-hot-toast";

// ✅ Import your logo
import soulfulLogo from "../../assets/soulful_logo-CcRWRS1J.png";

// Company Information
const COMPANY_INFO = {
  name: "Soulful Overseas",
  domain: "soulfuloverseas.com",
  email: "support@soulfuloverseas.com",
  phone: "+91 1234567890",
  address: "123 Business Park, Mumbai, Maharashtra - 400001, India",
  gst: "27AAKCS1234F1ZR",
  cin: "U12345MH2023PTC123456",
};

const OrderComplete = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get data from navigation state
  const { orderData, orderSummary } = location.state || {};
  
  // Cart selectors
  const cartItems = useSelector(selectCartItems);
  const cartTotals = useSelector(selectCartTotals);
  
  // Use real order data if available
  const displayItems = orderSummary?.items || cartItems;
  const displayTotals = orderSummary?.totals || cartTotals;
  const shippingAddress = orderSummary?.shippingAddress || {};
  const paymentMethod = orderSummary?.paymentMethod || "Cash on Delivery";
  
  const orderId = orderData?.orderNumber || orderData?.orderId || "ORD" + Date.now();
  const orderDate = orderData?.createdAt 
    ? new Date(orderData.createdAt).toLocaleDateString()
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  
  const [isClearing, setIsClearing] = useState(false);
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "₹0";
    return `₹${parseFloat(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Generate invoice number
  const invoiceNumber = `INV-${orderId}`;

  // Calculate invoice totals
  const invoiceTotals = {
    subtotal: displayTotals.subtotal || 0,
    shipping: displayTotals.shipping_total || 0,
    tax: displayTotals.tax_total || 0,
    discount: displayTotals.coupon_discount || 0,
    grandTotal: displayTotals.grand_total || 0,
  };

  // Clear cart on successful order placement
  useEffect(() => {
    if (cartItems.length > 0 && !isClearing) {
      setIsClearing(true);
      dispatch(clearCart())
        .unwrap()
        .then(() => toast.success("Cart cleared successfully"))
        .catch((err) => console.error("Failed to clear cart:", err));
    }
  }, [dispatch, cartItems.length, isClearing]);

  const handleContinueShopping = () => navigate("/shop");
  const handleViewOrders = () => navigate("/account", { state: { activeTab: "orders" } });

  const handlePrintOrder = () => {
    window.print();
  };

  const handleDownloadInvoice = async () => {
    setLoadingInvoice(true);
    try {
      const invoiceHtml = generateInvoiceHTML();
      const blob = new Blob([invoiceHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice_${orderId}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Invoice downloaded successfully!");
    } catch (err) {
      console.error("Invoice download failed:", err);
      toast.error("Failed to download invoice");
    } finally {
      setLoadingInvoice(false);
    }
  };

  const getShippingAddress = () => {
    if (shippingAddress.addressLine1) {
      return `${shippingAddress.addressLine1}${shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ''}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.zip}, ${shippingAddress.country}`;
    }
    if (shippingAddress.address) {
      return `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.zip}, ${shippingAddress.country}`;
    }
    return "Address will be updated soon";
  };

  const generateInvoiceHTML = () => {
    const itemsHTML = displayItems.map((item) => {
      const product = item.product;
      const price = item.selling_price || item.price;
      const total = price * item.quantity;
      
      return `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 12px 8px;">
            <strong>${(product?.name || item.product_name || 'Product').replace(/[&<>]/g, function(m) {
              if (m === '&') return '&amp;';
              if (m === '<') return '&lt;';
              if (m === '>') return '&gt;';
              return m;
            })}</strong><br/>
            <small style="color: #666;">SKU: ${(product?.sku || "N/A").replace(/[&<>]/g, function(m) {
              if (m === '&') return '&amp;';
              if (m === '<') return '&lt;';
              if (m === '>') return '&gt;';
              return m;
            })}</small>
            ${item.variant_name ? `<br/><small style="color: #666;">Variant: ${item.variant_name.replace(/[&<>]/g, function(m) {
              if (m === '&') return '&amp;';
              if (m === '<') return '&lt;';
              if (m === '>') return '&gt;';
              return m;
            })}</small>` : ""}
          </td>
          <td style="padding: 12px 8px; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px 8px; text-align: right;">${formatCurrency(price)}</td>
          <td style="padding: 12px 8px; text-align: right;">${formatCurrency(total)}</td>
        </tr>
      `;
    }).join("");

    // Get logo URL - Use the imported logo with full URL
    const logoUrl = `${window.location.origin}${soulfulLogo}`;

    return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice ${invoiceNumber} | ${COMPANY_INFO.name}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          background: #f5f5f5;
          padding: 40px 20px;
        }
        .invoice-container {
          max-width: 1000px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .invoice-header {
          background: linear-gradient(135deg, #7a1c3d 0%, #9b2c4f 100%);
          color: white;
          padding: 30px 40px;
          position: relative;
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .logo-image {
          height: 60px;
          width: auto;
          max-width: 120px;
          object-fit: contain;
          background: white;
          padding: 5px;
          border-radius: 8px;
        }
        .company-details h1 {
          font-size: 24px;
          margin-bottom: 5px;
          letter-spacing: 1px;
        }
        .company-details p {
          opacity: 0.9;
          font-size: 12px;
        }
        .invoice-title {
          text-align: right;
        }
        .invoice-title h2 {
          font-size: 28px;
          margin-bottom: 8px;
        }
        .invoice-title p {
          font-size: 12px;
          opacity: 0.9;
        }
        .invoice-body {
          padding: 40px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #eee;
        }
        .info-box h3 {
          color: #7a1c3d;
          font-size: 16px;
          margin-bottom: 12px;
          font-weight: 600;
          border-left: 3px solid #7a1c3d;
          padding-left: 10px;
        }
        .info-box p {
          color: #555;
          font-size: 14px;
          line-height: 1.6;
          margin: 4px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th {
          background: #f8f8f8;
          padding: 12px 8px;
          text-align: left;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #ddd;
        }
        th:last-child, td:last-child {
          text-align: right;
        }
        th:nth-child(2), td:nth-child(2) {
          text-align: center;
        }
        .totals {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #eee;
          text-align: right;
        }
        .totals-row {
          display: flex;
          justify-content: flex-end;
          padding: 8px 0;
        }
        .totals-label {
          width: 150px;
          font-weight: 500;
          color: #555;
        }
        .totals-value {
          width: 150px;
          font-weight: 600;
        }
        .grand-total {
          font-size: 18px;
          color: #7a1c3d;
          border-top: 2px solid #7a1c3d;
          margin-top: 10px;
          padding-top: 10px;
        }
        .footer {
          background: #f8f8f8;
          padding: 20px 40px;
          text-align: center;
          font-size: 12px;
          color: #888;
          border-top: 1px solid #eee;
        }
        .footer a {
          color: #7a1c3d;
          text-decoration: none;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          background: #e8f5e9;
          color: #2e7d32;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .bank-details {
          margin-top: 20px;
          padding: 15px;
          background: #f9f9f9;
          border-radius: 8px;
          font-size: 11px;
          color: #666;
          text-align: center;
        }
        @media print {
          body {
            background: white;
            padding: 0;
          }
          .invoice-container {
            box-shadow: none;
            border-radius: 0;
          }
          .print-hide {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <div class="header-content">
            <div class="logo-section">
              <img src="${logoUrl}" alt="${COMPANY_INFO.name} Logo" class="logo-image" onerror="this.style.display='none';" />
              <div class="company-details">
                <h1>${COMPANY_INFO.name}</h1>
                <p>${COMPANY_INFO.domain}</p>
                <p>GST: ${COMPANY_INFO.gst}</p>
              </div>
            </div>
            <div class="invoice-title">
              <h2>TAX INVOICE</h2>
              <p>Invoice #: ${invoiceNumber}</p>
              <p>Order #: ${orderId}</p>
              <p>Date: ${new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>
        </div>
        
        <div class="invoice-body">
          <div class="info-grid">
            <div class="info-box">
              <h3>BILLING DETAILS</h3>
              <p><strong>${(shippingAddress.firstName || "Customer")} ${(shippingAddress.lastName || "")}</strong></p>
              <p>${shippingAddress.email || "N/A"}</p>
              <p>Phone: ${shippingAddress.phone || "N/A"}</p>
            </div>
            <div class="info-box">
              <h3>SHIPPING ADDRESS</h3>
              <p>${getShippingAddress().replace(/[&<>]/g, function(m) {
                if (m === '&') return '&amp;';
                if (m === '<') return '&lt;';
                if (m === '>') return '&gt;';
                return m;
              })}</p>
              <p style="margin-top: 8px;"><span class="status-badge">Payment: ${paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod}</span></p>
            </div>
          </div>
          
          <h3 style="margin-bottom: 15px; color: #333;">ORDER SUMMARY</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          
          <div class="totals">
            <div class="totals-row">
              <span class="totals-label">Subtotal:</span>
              <span class="totals-value">${formatCurrency(invoiceTotals.subtotal)}</span>
            </div>
            ${invoiceTotals.shipping > 0 ? `
            <div class="totals-row">
              <span class="totals-label">Shipping:</span>
              <span class="totals-value">${formatCurrency(invoiceTotals.shipping)}</span>
            </div>
            ` : ""}
            ${invoiceTotals.tax > 0 ? `
            <div class="totals-row">
              <span class="totals-label">Tax (GST):</span>
              <span class="totals-value">${formatCurrency(invoiceTotals.tax)}</span>
            </div>
            ` : ""}
            ${invoiceTotals.discount > 0 ? `
            <div class="totals-row">
              <span class="totals-label">Discount:</span>
              <span class="totals-value" style="color: #e53935;">-${formatCurrency(invoiceTotals.discount)}</span>
            </div>
            ` : ""}
            <div class="totals-row grand-total">
              <span class="totals-label" style="font-weight: 700;">Grand Total:</span>
              <span class="totals-value" style="font-weight: 700; font-size: 18px;">${formatCurrency(invoiceTotals.grandTotal)}</span>
            </div>
          </div>
          
          <div class="bank-details">
            <p><strong>Bank Details for Online Transfer:</strong></p>
            <p>Bank: HDFC Bank | Account Name: ${COMPANY_INFO.name} | Account No: XXXXXXXXXXXXXX | IFSC: HDFC0001234</p>
            <p style="margin-top: 5px;">UPI ID: ${COMPANY_INFO.domain.replace(/\./g, '')}@hdfcbank</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
            <p style="font-size: 12px; color: #666; margin-bottom: 5px;"><strong>Terms & Conditions:</strong></p>
            <p style="font-size: 11px; color: #888;">1. Goods once sold will not be taken back.<br>2. This is a system generated invoice and does not require signature.<br>3. For any queries, please contact our support team at ${COMPANY_INFO.email}</p>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>${COMPANY_INFO.name}</strong> | ${COMPANY_INFO.address}</p>
          <p>Email: ${COMPANY_INFO.email} | Phone: ${COMPANY_INFO.phone} | Website: <a href="https://${COMPANY_INFO.domain}">${COMPANY_INFO.domain}</a></p>
          <p style="margin-top: 8px;">CIN: ${COMPANY_INFO.cin} | GSTIN: ${COMPANY_INFO.gst}</p>
          <p style="margin-top: 10px;">Thank you for shopping with us! 🌸</p>
        </div>
      </div>
      
      <div class="print-hide" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; margin: 0 10px; background: #7a1c3d; color: white; border: none; border-radius: 8px; cursor: pointer;">🖨️ Print Invoice</button>
        <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 8px; cursor: pointer;">Close</button>
      </div>
    </body>
    </html>`;
  };

  // Order timeline steps
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
  
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const timelineSteps = [
    { label: "Order Placed", status: "completed", date: orderDate, description: "Your order has been confirmed" },
    { label: "Processing", status: "completed", date: orderDate, description: "Payment verified & order packed" },
    { label: "Shipped", status: "current", date: formatDate(new Date()), description: "Ready for dispatch" },
    { label: "Delivered", status: "pending", date: formatDate(estimatedDelivery), description: "Estimated delivery date" },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff9fb] via-white to-[#fff3f6] overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#8B0D3A]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#7A1C3D]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Content */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
          className="text-center mb-10 md:mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-green-50 rounded-full mb-5 mx-auto shadow-lg">
            <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-green-500" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-[#1a1a1a] mb-3">Order Confirmed! 🎉</h1>
          <p className="text-gray-600 text-base md:text-lg max-w-md mx-auto">Thank you for your purchase. Your order has been placed successfully.</p>
        </motion.div>

        {/* Order Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white/80 backdrop-blur-xl border border-[#f1d6dd] rounded-2xl md:rounded-3xl shadow-xl overflow-hidden mb-8"
        >
          {/* Order Header */}
          <div className="bg-gradient-to-r from-[#8B0D3A]/5 to-[#7A1C3D]/5 px-5 md:px-8 py-5 md:py-6 border-b border-[#f1d6dd]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide mb-1">Order ID</p>
                <p className="text-lg md:text-2xl font-mono font-semibold text-[#8B0D3A]">#{orderId}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={handlePrintOrder} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-200 hover:border-[#8B0D3A] hover:text-[#8B0D3A] transition-all duration-200">
                  <Printer size={16} />
                  <span className="hidden sm:inline">Print</span>
                </button>
                <button onClick={handleDownloadInvoice} disabled={loadingInvoice} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-200 hover:border-[#8B0D3A] hover:text-[#8B0D3A] transition-all duration-200 disabled:opacity-50">
                  {loadingInvoice ? <div className="w-4 h-4 border-2 border-[#8B0D3A] border-t-transparent rounded-full animate-spin" /> : <Download size={16} />}
                  <span className="hidden sm:inline">Invoice</span>
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-6 mt-4 text-xs md:text-sm text-gray-600">
              <span className="flex items-center gap-2"><Clock size={14} className="text-gray-400" />{orderDate}</span>
              <span className="flex items-center gap-2"><Truck size={14} className="text-gray-400" />Est. Delivery: {formatDate(estimatedDelivery)}</span>
              <span className="flex items-center gap-2"><Package size={14} className="text-gray-400" />{displayItems.length} {displayItems.length === 1 ? "item" : "items"}</span>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="px-5 md:px-8 py-6 md:py-8 border-b border-[#f1d6dd]">
            <div className="relative">
              <div className="hidden md:flex justify-between">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="flex-1 text-center relative">
                    <div className="relative z-10">
                      <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center border-2 ${step.status === "completed" ? "bg-green-500 border-green-500 text-white" : step.status === "current" ? "bg-[#8B0D3A] border-[#8B0D3A] text-white" : "bg-white border-gray-300 text-gray-400"}`}>
                        {step.status === "completed" ? <CheckCircle size={18} /> : step.status === "current" ? <Package size={18} /> : <Clock size={18} />}
                      </div>
                      <p className="font-medium text-sm mt-3">{step.label}</p>
                      <p className="text-xs text-gray-400 mt-1">{step.date}</p>
                    </div>
                    {idx < 3 && <div className={`absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 ${idx === 0 || idx === 1 ? "bg-green-500" : "bg-gray-200"}`} />}
                  </div>
                ))}
              </div>
              <div className="md:hidden space-y-6">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step.status === "completed" ? "bg-green-500 border-green-500 text-white" : step.status === "current" ? "bg-[#8B0D3A] border-[#8B0D3A] text-white" : "bg-white border-gray-300 text-gray-400"}`}>
                        {step.status === "completed" ? <CheckCircle size={16} /> : step.status === "current" ? <Package size={16} /> : <Clock size={16} />}
                      </div>
                      {idx < 3 && <div className="w-0.5 h-8 bg-gray-200 mt-2" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-semibold text-sm">{step.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="px-5 md:px-8 py-6 md:py-8">
            <h3 className="font-semibold text-gray-800 mb-4 text-base md:text-lg">Order Summary</h3>
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
              {displayItems.map((item, idx) => {
                const product = item.product;
                const price = item.selling_price || item.price;
                const img = product?.images?.find((i) => i.is_primary)?.image_url || product?.images?.[0]?.image_url;
                return (
                  <div key={item.id || idx} className="flex flex-col sm:flex-row gap-3 sm:gap-4 py-3 border-b border-gray-100 last:border-0">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      <img src={getImageUrl(img || "/placeholder.png")} alt={product?.name || item.product_name} className="w-full h-full object-cover" onError={(e) => e.target.src = "/placeholder.png"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{product?.name || item.product_name}</p>
                      {item.variant_name && <p className="text-xs text-gray-500 mt-1">Variant: {item.variant_name}</p>}
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-[#8B0D3A] text-sm sm:text-base">{(price * item.quantity).toLocaleString()}</p>
                  </div>
                );
              })}
            </div>

            {/* Price Details */}
            <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span className="font-medium">{formatCurrency(displayTotals.subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Shipping</span><span className="font-medium">{formatCurrency(displayTotals.shipping_total)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Tax (GST)</span><span className="font-medium">{formatCurrency(displayTotals.tax_total)}</span></div>
              {displayTotals.coupon_discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Coupon Discount</span><span>-{formatCurrency(displayTotals.coupon_discount)}</span></div>}
              <div className="flex justify-between pt-2 text-base md:text-lg font-bold"><span>Grand Total</span><span className="text-[#8B0D3A]">{formatCurrency(displayTotals.grand_total)}</span></div>
            </div>
          </div>
        </motion.div>

        {/* Shipping & Payment Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="bg-white/70 backdrop-blur-sm border border-[#f1d6dd] rounded-xl p-5">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Truck size={16} className="text-[#8B0D3A]" />Shipping Address</h4>
            <p className="text-sm text-gray-700">{shippingAddress.firstName || shippingAddress.name || "Customer"}<br />{getShippingAddress()}</p>
            {shippingAddress.phone && <p className="text-sm text-gray-700 mt-2">Phone: {shippingAddress.phone}</p>}
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.5 }} className="bg-white/70 backdrop-blur-sm border border-[#f1d6dd] rounded-xl p-5">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">💳 Payment Method</h4>
            <p className="text-sm text-gray-700 capitalize">{paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod}</p>
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><CheckCircle size={12} /> Payment pending (COD)</p>
          </motion.div>
        </div>

        {/* CTA Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={handleContinueShopping} className="group flex items-center justify-center gap-2 px-6 md:px-8 py-3 bg-[#8B0D3A] text-white rounded-xl font-medium hover:bg-[#6e0a2e] transition-all duration-300 shadow-lg hover:shadow-xl"><Home size={18} />Continue Shopping<ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></button>
          <button onClick={handleViewOrders} className="flex items-center justify-center gap-2 px-6 md:px-8 py-3 border border-[#8B0D3A] text-[#8B0D3A] rounded-xl font-medium hover:bg-[#8B0D3A] hover:text-white transition-all duration-300"><Package size={18} />View My Orders</button>
        </motion.div>

        {/* Help Section */}
        <p className="text-center text-xs md:text-sm text-gray-400 mt-10">
          A confirmation email has been sent to your registered email address.<br />
          For any queries, please contact our{" "}
          <button onClick={() => navigate("/support")} className="text-[#8B0D3A] hover:underline font-medium">support team</button>.
        </p>
      </div>
    </div>
  );
};

export default OrderComplete;