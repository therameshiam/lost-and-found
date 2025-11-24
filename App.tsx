import React, { useEffect, useState, useCallback } from 'react';
import { TagStatus, ApiResponse } from './types';
import { fetchTagStatus, activateTag } from './services/api';
import { GOOGLE_SCRIPT_URL } from './constants';
import Spinner from './components/Spinner';
import ActivateForm from './components/ActivateForm';
import OwnerFound from './components/OwnerFound';
import LandingPage from './components/LandingPage';
import { AlertCircle, ServerCrash, RefreshCw, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<TagStatus>(TagStatus.LOADING);
  const [tagId, setTagId] = useState<string | null>(null);
  const [waLink, setWaLink] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHome, setIsHome] = useState(false);

  // Configuration Safety Check
  if (GOOGLE_SCRIPT_URL.includes('REPLACE_WITH_YOUR_DEPLOYMENT_ID')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md border-l-4 border-red-500">
          <div className="flex justify-center mb-4">
            <ServerCrash className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Setup Required</h1>
          <p className="text-gray-600 mb-6">
            The app is not connected to the backend yet.
          </p>
          <div className="text-left bg-gray-100 p-4 rounded-lg text-sm font-mono text-gray-700 break-all">
            1. Deploy <strong>backend/Code.js</strong> to Google Apps Script.<br/>
            2. Copy the <strong>Web App URL</strong>.<br/>
            3. Paste it into <strong>constants.ts</strong>.
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // Simple URL param extraction for GitHub Pages compatibility
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
      setIsHome(true);
      return;
    }

    setTagId(id);
    checkTag(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkTag = useCallback(async (id: string) => {
    setStatus(TagStatus.LOADING);
    try {
      const data: ApiResponse = await fetchTagStatus(id);
      
      if (data.result === 'new') {
        setStatus(TagStatus.NEW);
      } else if (data.result === 'found' && data.wa_link) {
        setWaLink(data.wa_link);
        setStatus(TagStatus.FOUND);
      } else {
        setErrorMessage(data.message || 'Tag not found in database.');
        setStatus(TagStatus.ERROR);
      }
    } catch (err) {
      setErrorMessage('Network error occurred.');
      setStatus(TagStatus.ERROR);
    }
  }, []);

  const handleActivate = async (item: string, phone: string) => {
    if (!tagId) return;
    
    setIsSubmitting(true);
    try {
      const response = await activateTag({ id: tagId, item, phone });
      if (response.result === 'success') {
        setStatus(TagStatus.SUCCESS_ACTIVATED);
        
        // Construct the link locally so we can show it immediately without re-fetching
        const message = `Hi, I found your ${item}. How can I return it safely?`;
        const generatedWaLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        setWaLink(generatedWaLink);

        // Transition to FOUND state automatically to show the user what a finder will see
        setTimeout(() => {
           setStatus(TagStatus.FOUND);
        }, 2500);
      } else {
        alert('Activation failed: ' + (response.message || 'Unknown error'));
        setIsSubmitting(false);
      }
    } catch (e) {
      alert('Activation failed due to network error. Please check your internet.');
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    if (tagId) {
        checkTag(tagId);
    } else {
        window.location.reload();
    }
  };

  const renderContent = () => {
    switch (status) {
      case TagStatus.LOADING:
        return <Spinner />;
      case TagStatus.NEW:
        return tagId ? (
          <ActivateForm 
            tagId={tagId} 
            onActivate={handleActivate} 
            isSubmitting={isSubmitting} 
          />
        ) : null;
      case TagStatus.FOUND:
        return waLink ? <OwnerFound waLink={waLink} /> : null;
      case TagStatus.SUCCESS_ACTIVATED:
        return (
          <div className="text-center py-10 animate-in fade-in zoom-in duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
               <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="text-green-600 text-xl font-bold mb-2">Activation Successful!</div>
            <p className="text-gray-600">Your tag is now active.</p>
            <p className="text-xs text-gray-400 mt-4">Switching to Finder View...</p>
          </div>
        );
      case TagStatus.ERROR:
        return (
          <div className="text-center p-6 text-red-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Connection Error</h3>
            <p className="text-sm text-gray-700 mb-6">{errorMessage}</p>
            <div className="bg-red-50 p-3 rounded-lg text-xs text-left mb-4 border border-red-100">
               <strong>Troubleshooting:</strong><br/>
               1. Check your Internet connection.<br/>
               2. Ensure Google Sheet permissions are set to "Anyone" (Execute as Me).
            </div>
            <button 
                onClick={handleRetry}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (isHome) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
            <LandingPage />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-4 text-center">
            <h1 className="text-white font-bold text-lg tracking-wide">SCAN TO RETURN</h1>
        </div>
        <div className="p-6">
          {renderContent()}
        </div>
        <div className="bg-gray-50 px-6 py-4 text-center text-xs text-gray-400 border-t border-gray-100">
          <p>Powered by Serverless & Google Sheets</p>
          {tagId && <p className="mt-1 font-mono text-[10px] opacity-50">ID: {tagId}</p>}
        </div>
      </div>
    </div>
  );
};

export default App;