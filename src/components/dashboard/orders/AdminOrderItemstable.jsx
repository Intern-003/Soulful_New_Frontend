// src/components/admin/orders/AdminOrderItemsTable.jsx
import React from "react";

const AdminOrderItemsTable = ({ items }) => {
  // Helper to get seller name from loaded relationships

 
  const getSellerName = (item) => {
    // Priority 1: Check if vendor exists with store_name
    if (item.vendor?.store_name) {
      return item.vendor.store_name;
    }
    
    // Priority 2: Check if creator exists with name
    if (item.creator?.name) {
      return `${item.creator.name} (Individual Seller)`;
    }
    
    // Priority 3: Fallback to IDs
    if (item.vendor_id) {
      return `Vendor #${item.vendor_id}`;
    }
    
    if (item.creator_id) {
      return `Individual Seller #${item.creator_id}`;
    }
    
    return "N/A";
  };

  // Get seller type badge
  const getSellerType = (item) => {
    if (item.vendor) return "Vendor";
    if (item.creator) return "Individual Seller";
    return "Unknown";
  };

  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No items found in this order
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 text-left font-semibold text-gray-700">Product Details</th>
            <th className="p-4 text-left font-semibold text-gray-700">Seller</th>
            <th className="p-4 text-center font-semibold text-gray-700">Quantity</th>
            <th className="p-4 text-right font-semibold text-gray-700">Unit Price</th>
            <th className="p-4 text-right font-semibold text-gray-700">Total</th>
            <th className="p-4 text-left font-semibold text-gray-700">Status</th>
          </tr>
        </thead>
        
        <tbody>
          {items?.map((item, index) => (
            <tr key={item.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
              {/* Product Details */}
              <td className="p-4">
                <div className="flex items-start gap-3">
                  {item.product?.images?.[0]?.image_url && (
                    <img 
                      src={item.product.images[0].image_url} 
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => e.target.src = "/placeholder.jpg"}
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{item.product?.name}</p>
                    {item.variant_id && (
                      <p className="text-xs text-gray-500 mt-1">Variant ID: {item.variant_id}</p>
                    )}
                    {item.product?.sku && (
                      <p className="text-xs text-gray-400 mt-1">SKU: {item.product.sku}</p>
                    )}
                  </div>
                </div>
              </td>
              
              {/* Seller Info - Now shows actual names from backend */}
              <td className="p-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {getSellerName(item)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      getSellerType(item) === 'Vendor' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {getSellerType(item)}
                    </span>
                    <span className="text-xs text-gray-400">
                      ID: {item.vendor_id || item.creator_id}
                    </span>
                  </div>
                </div>
              </td>
              
              {/* Quantity */}
              <td className="p-4 text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium">
                  {item.quantity}
                </span>
              </td>
              
              {/* Unit Price */}
              <td className="p-4 text-right">
                <span className="text-gray-700">₹{Number(item.price).toLocaleString()}</span>
              </td>
              
              {/* Total */}
              <td className="p-4 text-right">
                <span className="font-semibold text-gray-900">₹{Number(item.total).toLocaleString()}</span>
              </td>
              
              {/* Status */}
              <td className="p-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  item.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  item.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  item.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                  item.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    item.status === 'delivered' ? 'bg-green-500' :
                    item.status === 'processing' ? 'bg-blue-500' :
                    item.status === 'shipped' ? 'bg-purple-500' :
                    item.status === 'cancelled' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}></span>
                  {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        
        {/* Footer */}
        <tfoot className="bg-gray-50 border-t">
          <tr>
            <td colSpan="4" className="p-4 text-right font-semibold text-gray-700">
              Total Items: {items.length}
            </td>
            <td className="p-4 text-right font-bold text-[#7a1c3d] text-lg">
              ₹{items.reduce((sum, item) => sum + Number(item.total), 0).toLocaleString()}
            </td>
            <td className="p-4"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default AdminOrderItemsTable;