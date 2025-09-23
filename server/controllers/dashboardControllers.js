import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// GET /api/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const adminId = req.user.id;

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Total earnings
    const earningsAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalEarnings = earningsAgg[0]?.total || 0;

    // Active products (all)
    const activeProducts = await Product.countDocuments({ inStock: true });

    // Products posted by this admin
    const adminProducts = await Product.countDocuments({ postedBy: adminId });

    // Customers count (users with role 'customer')
    const customers = await User.countDocuments({ role: "customer" });

    // Recent orders (last 5)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("orderId customer amount status")
      .lean();

    res.status(200).json({
      stats: { totalOrders, totalEarnings, activeProducts, adminProducts, customers },
      recentOrders,
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};
