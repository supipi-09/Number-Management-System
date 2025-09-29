import React from "react";
import { X } from "lucide-react";

interface AddNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddNumberModal: React.FC<AddNumberModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Add New Number</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Number *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., 5551234"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Service Type *
            </label>
            <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option>LTE</option>
              <option>IPTL</option>
              <option>FTTH</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Special Type *
            </label>
            <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Normal</option>
              <option>Silver</option>
              <option>Gold</option>
              <option>Platinum</option>
              <option>Elite</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Initial Status *
            </label>
            <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Available</option>
              <option>Reserved</option>
              <option>Held</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Remarks</label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
              placeholder="Optional notes..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Add Number
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNumberModal;
