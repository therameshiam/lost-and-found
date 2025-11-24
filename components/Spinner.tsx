import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-gray-500">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
      <p className="text-sm font-medium animate-pulse">Scanning Database...</p>
    </div>
  );
};

export default Spinner;
