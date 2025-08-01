import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer ID is required']
  },
  visitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tailorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  itemDetails: {
    type: {
      type: String,
      required: [true, 'Item type is required'],
      enum: ['shirt', 'pants', 'dress', 'jacket', 'suit', 'blouse', 'skirt', 'other']
    },
    measurements: {
      chest: Number,
      waist: Number,
      hips: Number,
      inseam: Number,
      shoulderWidth: Number,
      armLength: Number,
      neckSize: Number,
      length: Number,
      other: String
    },
    fabric: {
      type: String,
      required: [true, 'Fabric selection is required']
    },
    color: {
      type: String,
      required: [true, 'Color selection is required']
    },
    specialInstructions: {
      type: String,
      maxlength: [500, 'Special instructions cannot exceed 500 characters']
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  estimatedDelivery: {
    type: Date
  },
  actualDelivery: {
    type: Date
  },
  notes: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [200, 'Note cannot exceed 200 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  images: [{
    url: String,
    description: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Index for better query performance
orderSchema.index({ customerId: 1, status: 1 });
orderSchema.index({ tailorId: 1, status: 1 });
orderSchema.index({ visitorId: 1 });
orderSchema.index({ createdAt: -1 });

// Calculate commission for visitor
orderSchema.methods.calculateCommission = function() {
  if (!this.visitorId) return 0;
  return this.price * (this.visitorId.commissionRate / 100);
};

// export default mongoose.model('Order', orderSchema);
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;