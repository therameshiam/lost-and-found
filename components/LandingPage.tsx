import React from 'react';
import { ShieldCheck, Zap, DollarSign, Heart, PlayCircle } from 'lucide-react';
import QrGenerator from './QrGenerator';

const LandingPage: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 pb-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-8 no-print">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Lost & Found, <span className="text-blue-600">Reimagined.</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create free, privacy-focused QR code labels for your valuables. 
          When lost, finders can contact you via WhatsApp without seeing your phone number.
        </p>
        
        <div className="flex justify-center gap-4">
          <a href="#studio" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
            Create Codes
          </a>
          <a href="?id=DEMO_TEST" className="px-6 py-3 bg-white text-gray-700 border border-gray-300 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
            <PlayCircle className="w-5 h-5" />
            Try Demo
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-gray-500 pt-4">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" /> Zero Cost
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Privacy First
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4" /> Instant Setup
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 no-print">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
            1
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Generate Codes</h3>
          <p className="text-gray-500 text-sm">Use our free studio below to create and print QR codes for your keys, wallet, or laptop.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
            2
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Activate Tag</h3>
          <p className="text-gray-500 text-sm">Scan the code yourself first. Enter your item name and WhatsApp number to link them.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
            3
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Get Notified</h3>
          <p className="text-gray-500 text-sm">If lost, the finder scans the code and gets a direct WhatsApp link to chat with you.</p>
        </div>
      </section>

      {/* Design Studio */}
      <section id="studio" className="scroll-mt-8">
        <QrGenerator />
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-sm pt-8 border-t border-gray-200 no-print">
        <div className="flex items-center justify-center gap-2 mb-2">
            Built with <Heart className="w-4 h-4 text-red-400 fill-current" /> using React & Google Sheets
        </div>
        <p>© {new Date().getFullYear()} Scan To Return. Open Source.</p>
      </footer>
    </div>
  );
};

export default LandingPage;