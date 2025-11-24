import React, { useState } from 'react';
import { Tag, Phone, Save, Loader2 } from 'lucide-react';

interface ActivateFormProps {
  tagId: string;
  onActivate: (item: string, phone: string) => void;
  isSubmitting: boolean;
}

const ActivateForm: React.FC<ActivateFormProps> = ({ tagId, onActivate, isSubmitting }) => {
  const [item, setItem] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item && phone) {
      onActivate(item, phone);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
          <Tag className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Activate New Tag</h2>
        <p className="text-sm text-gray-500 mt-1">ID: {tagId}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="item" className="block text-sm font-medium text-gray-700 mb-1">
            Item Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              id="item"
              required
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g., MacBook Pro, Blue Wallet"
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            WhatsApp Number (with Country Code)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="tel"
              id="phone"
              required
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g., 15550123456"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Digits only, include country code (e.g., 1 for USA).</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Activating...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Activate Tag
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ActivateForm;
