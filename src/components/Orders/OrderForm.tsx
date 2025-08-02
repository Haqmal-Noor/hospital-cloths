import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface OrderFormProps {
  customers?: Array<{ _id: string; name: string; email: string }>;
  onSubmit: (orderData: any) => Promise<boolean>;
  isVisitor: boolean;
}

const OrderForm: React.FC<OrderFormProps> = ({ customers = [], onSubmit, isVisitor }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const itemTypes = [
    'shirt', 'pants', 'dress', 'jacket', 'suit', 'blouse', 'skirt', 'other'
  ];

  const fabrics = [
    'Cotton', 'Silk', 'Wool', 'Linen', 'Polyester', 'Denim', 'Velvet', 'Cashmere'
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    setSuccess(false);

    try {
      const orderData = {
        ...data,
        price: parseFloat(data.price),
        itemDetails: {
          type: data.itemType,
          fabric: data.fabric,
          color: data.color,
          specialInstructions: data.specialInstructions,
          measurements: {
            chest: data.chest ? parseFloat(data.chest) : undefined,
            waist: data.waist ? parseFloat(data.waist) : undefined,
            hips: data.hips ? parseFloat(data.hips) : undefined,
            inseam: data.inseam ? parseFloat(data.inseam) : undefined,
            shoulderWidth: data.shoulderWidth ? parseFloat(data.shoulderWidth) : undefined,
            armLength: data.armLength ? parseFloat(data.armLength) : undefined,
            neckSize: data.neckSize ? parseFloat(data.neckSize) : undefined,
            length: data.length ? parseFloat(data.length) : undefined,
            other: data.otherMeasurements
          }
        },
        estimatedDelivery: data.estimatedDelivery ? new Date(data.estimatedDelivery) : undefined
      };

      const result = await onSubmit(orderData);
      if (result) {
        setSuccess(true);
        reset();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Order submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 font-medium">Order created successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Customer Selection (for visitors) */}
        {isVisitor && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Customer *
                </label>
                <select
                  {...register('customerId', { required: 'Customer selection is required' })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a customer</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name} - {customer.email}
                    </option>
                  ))}
                </select>
                {errors.customerId && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerId.message as string}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Item Details */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Item Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="itemType" className="block text-sm font-medium text-gray-700 mb-2">
                Item Type *
              </label>
              <select
                {...register('itemType', { required: 'Item type is required' })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select item type</option>
                {itemTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              {errors.itemType && (
                <p className="mt-1 text-sm text-red-600">{errors.itemType.message as string}</p>
              )}
            </div>

            <div>
              <label htmlFor="fabric" className="block text-sm font-medium text-gray-700 mb-2">
                Fabric *
              </label>
              <select
                {...register('fabric', { required: 'Fabric selection is required' })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select fabric</option>
                {fabrics.map((fabric) => (
                  <option key={fabric} value={fabric}>
                    {fabric}
                  </option>
                ))}
              </select>
              {errors.fabric && (
                <p className="mt-1 text-sm text-red-600">{errors.fabric.message as string}</p>
              )}
            </div>

            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                Color *
              </label>
              <input
                type="text"
                {...register('color', { required: 'Color is required' })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Navy Blue"
              />
              {errors.color && (
                <p className="mt-1 text-sm text-red-600">{errors.color.message as string}</p>
              )}
            </div>
          </div>
        </div>

        {/* Measurements */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Measurements (inches)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label htmlFor="chest" className="block text-sm font-medium text-gray-700 mb-2">
                Chest
              </label>
              <input
                type="number"
                step="0.5"
                {...register('chest')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="36"
              />
            </div>

            <div>
              <label htmlFor="waist" className="block text-sm font-medium text-gray-700 mb-2">
                Waist
              </label>
              <input
                type="number"
                step="0.5"
                {...register('waist')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="32"
              />
            </div>

            <div>
              <label htmlFor="hips" className="block text-sm font-medium text-gray-700 mb-2">
                Hips
              </label>
              <input
                type="number"
                step="0.5"
                {...register('hips')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="38"
              />
            </div>

            <div>
              <label htmlFor="inseam" className="block text-sm font-medium text-gray-700 mb-2">
                Inseam
              </label>
              <input
                type="number"
                step="0.5"
                {...register('inseam')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="32"
              />
            </div>

            <div>
              <label htmlFor="shoulderWidth" className="block text-sm font-medium text-gray-700 mb-2">
                Shoulder Width
              </label>
              <input
                type="number"
                step="0.5"
                {...register('shoulderWidth')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="18"
              />
            </div>

            <div>
              <label htmlFor="armLength" className="block text-sm font-medium text-gray-700 mb-2">
                Arm Length
              </label>
              <input
                type="number"
                step="0.5"
                {...register('armLength')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="25"
              />
            </div>

            <div>
              <label htmlFor="neckSize" className="block text-sm font-medium text-gray-700 mb-2">
                Neck Size
              </label>
              <input
                type="number"
                step="0.5"
                {...register('neckSize')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="16"
              />
            </div>

            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-2">
                Length
              </label>
              <input
                type="number"
                step="0.5"
                {...register('length')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="28"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="otherMeasurements" className="block text-sm font-medium text-gray-700 mb-2">
              Other Measurements
            </label>
            <textarea
              {...register('otherMeasurements')}
              rows={2}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any additional measurements or notes"
            />
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price', { 
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' }
                })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="150.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message as string}</p>
              )}
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                {...register('priority')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                defaultValue="medium"
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="estimatedDelivery" className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Delivery
              </label>
              <input
                type="date"
                {...register('estimatedDelivery')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions
            </label>
            <textarea
              {...register('specialInstructions')}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any special requirements or instructions for the tailor"
              maxLength={500}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Order...' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;