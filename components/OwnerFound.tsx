import React from 'react';
import { MessageCircle, CheckCircle } from 'lucide-react';

interface OwnerFoundProps {
  waLink: string;
}

const OwnerFound: React.FC<OwnerFoundProps> = ({ waLink }) => {
  return (
    <div className="text-center w-full">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6 animate-bounce">
        <CheckCircle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Owner Found!</h2>
      <p className="text-gray-600 mb-8">
        This item is registered. Please contact the owner to arrange a return.
      </p>

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center py-4 px-6 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl shadow-lg transform transition hover:-translate-y-1 font-bold text-lg"
      >
        <MessageCircle className="w-6 h-6 mr-2" />
        Chat on WhatsApp
      </a>
      
      <p className="text-xs text-gray-400 mt-6">
        Thank you for being a good samaritan!
      </p>
    </div>
  );
};

export default OwnerFound;
