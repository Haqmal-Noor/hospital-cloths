import express from 'express';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all tailors (Admin only)
router.get('/tailors', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const tailors = await User.find({ 
      role: 'tailor', 
      isActive: true 
    }).select('name email phone');

    res.json({ tailors });
  } catch (error) {
    console.error('Fetch tailors error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch tailors', 
      error: error.message 
    });
  }
});

// Get all customers (For visitors creating orders)
router.get('/customers', authenticateToken, authorizeRoles('visitor', 'admin'), async (req, res) => {
  try {
    const customers = await User.find({ 
      role: 'customer', 
      isActive: true 
    }).select('name email phone');

    res.json({ customers });
  } catch (error) {
    console.error('Fetch customers error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch customers', 
      error: error.message 
    });
  }
});

// Get dashboard statistics
router.get('/dashboard-stats', authenticateToken, async (req, res) => {
  try {
    let stats = {};

    switch (req.user.role) {
      case 'admin':
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const completedOrders = await Order.countDocuments({ status: 'completed' });
        const totalTailors = await User.countDocuments({ role: 'tailor', isActive: true });

        stats = {
          totalOrders,
          pendingOrders,
          completedOrders,
          totalTailors
        };
        break;

      case 'customer':
        const customerOrders = await Order.countDocuments({ customerId: req.user._id });
        const customerPending = await Order.countDocuments({ 
          customerId: req.user._id, 
          status: { $in: ['pending', 'assigned', 'in-progress'] }
        });
        const customerCompleted = await Order.countDocuments({ 
          customerId: req.user._id, 
          status: 'completed' 
        });

        stats = {
          totalOrders: customerOrders,
          pendingOrders: customerPending,
          completedOrders: customerCompleted
        };
        break;

      case 'tailor':
        const tailorOrders = await Order.countDocuments({ tailorId: req.user._id });
        const tailorPending = await Order.countDocuments({ 
          tailorId: req.user._id, 
          status: { $in: ['assigned', 'in-progress'] }
        });
        const tailorCompleted = await Order.countDocuments({ 
          tailorId: req.user._id, 
          status: 'completed' 
        });

        stats = {
          totalOrders: tailorOrders,
          pendingOrders: tailorPending,
          completedOrders: tailorCompleted
        };
        break;

      case 'visitor':
        const visitorOrders = await Order.countDocuments({ visitorId: req.user._id });
        const visitorCompleted = await Order.countDocuments({ 
          visitorId: req.user._id, 
          status: 'completed' 
        });
        
        // Calculate total commission
        const completedOrdersData = await Order.find({ 
          visitorId: req.user._id, 
          status: 'completed' 
        });
        
        const totalCommission = completedOrdersData.reduce((total, order) => {
          return total + (order.price * (req.user.commissionRate / 100));
        }, 0);

        stats = {
          totalOrders: visitorOrders,
          completedOrders: visitorCompleted,
          totalCommission
        };
        break;
    }

    res.json({ stats });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch dashboard statistics', 
      error: error.message 
    });
  }
});

export default router;