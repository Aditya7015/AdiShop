// import React from "react";

// const MyOrders = () => {
//     const boxIcon = "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg"

//     const orders = [
//         { id: 1, items: [{ product: { name: "Nike Air Max 270" }, quantity: 1 }], address: { firstName: "John", lastName: "Doe", street: "123 Main St", city: "New York", state: "NY", zipcode: "10001", country: "USA"}, amount: 320.0, paymentType: "Credit Card", orderDate: "10/10/2022", isPaid: true },
//         { id: 1, items: [{ product: { name: "Nike Air Max 270" }, quantity: 1 }], address: { firstName: "John", lastName: "Doe", street: "123 Main St", city: "New York", state: "NY", zipcode: "10001", country: "USA"}, amount: 320.0, paymentType: "Credit Card", orderDate: "10/10/2022", isPaid: true },
//         { id: 1, items: [{ product: { name: "Nike Air Max 270" }, quantity: 1 }], address: { firstName: "John", lastName: "Doe", street: "123 Main St", city: "New York", state: "NY", zipcode: "10001", country: "USA"}, amount: 320.0, paymentType: "Credit Card", orderDate: "10/10/2022", isPaid: true },
//     ];
//     return (
//         <div className="md:p-10 p-4 space-y-4">
//             <h2 className="text-lg font-medium">Orders List</h2>
//             {orders.map((order, index) => (
//                 <div key={index} className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800">
//                     <div className="flex gap-5">
//                         <img className="w-12 h-12 object-cover opacity-60" src={boxIcon} alt="boxIcon" />
//                         <>
//                             {order.items.map((item, index) => (
//                                 <div key={index} className="flex flex-col justify-center">
//                                     <p className="font-medium">
//                                         {item.product.name} <span className={`text-indigo-500 ${item.quantity < 2 && "hidden"}`}>x {item.quantity}</span>
//                                     </p>
//                                 </div>
//                             ))}
//                         </>
//                     </div>

//                     <div className="text-sm">
//                         <p className='font-medium mb-1'>{order.address.firstName} {order.address.lastName}</p>
//                         <p>{order.address.street}, {order.address.city}, {order.address.state},{order.address.zipcode}, {order.address.country}</p>
//                     </div>

//                     <p className="font-medium text-base my-auto text-black/70">${order.amount}</p>

//                     <div className="flex flex-col text-sm">
//                         <p>Method: {order.paymentType}</p>
//                         <p>Date: {order.orderDate}</p>
//                         <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default MyOrders;


// client/pages/MyOrders.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const userId = user?._id;
  const API_URL = import.meta.env.VITE_API_URL;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`${API_URL}/orders/user/${userId}`);
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  if (!userId) return <p className="p-6">Please login to see your orders.</p>;
  if (loading) return <p className="p-6">Loading your orders...</p>;
  if (!orders.length) return <p className="p-6">You have no orders yet.</p>;

  return (
    <div className="md:p-10 p-4 space-y-4">
      <h2 className="text-lg font-medium">Orders List</h2>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="p-4 border rounded">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">Order ID: {order.orderId || order._id}</p>
                <p className="text-sm text-gray-600">Date: {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${order.amount?.toFixed(2)}</p>
                <p className="text-sm">{order.paymentStatus === "paid" ? "Paid" : "Pending"}</p>
              </div>
            </div>

            <div className="mt-3">
              <p className="font-semibold">Items:</p>
              <ul className="list-disc ml-5">
                {order.products?.map((p, idx) => (
                  <li key={idx}>
                    {p.product?.name || "Product"} x {p.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
