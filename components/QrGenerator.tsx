import React, { useState, useEffect } from 'react';
import { Printer, Settings, Download, Link as LinkIcon, AlertTriangle, ExternalLink, RefreshCw, Globe } from 'lucide-react';
// @ts-ignore
import QRCode from 'qrcode';

interface QrTag {
  id: string;
  url: string;
  dataUrl: string;
}

// Your production URL - This is what users will scan
const DEPLOYED_URL = 'https://therameshiam.github.io/lost-and-found/';

const QrGenerator: React.FC = () => {
  const [prefix, setPrefix] = useState('ITEM_');
  const [startNum, setStartNum] = useState(1);
  const [count, setCount] = useState(6);
  const [color, setColor] = useState('#000000');
  
  // Initialize URL: Always prefer the Production URL unless the user explicitly overrides it
  const [baseUrl, setBaseUrl] = useState(() => {
    return DEPLOYED_URL;
  });
  
  const [tags, setTags] = useState<QrTag[]>([]);
  const [warning, setWarning] = useState<string | null>(null);

  // Helper to pad numbers (e.g., 1 -> 001)
  const pad = (num: number, size: number) => {
    let s = "000000000" + num;
    return s.substr(s.length - size);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleUseProductionUrl = () => {
    setBaseUrl(DEPLOYED_URL);
  };

  // Robust URL cleaner
  const getCleanUrl = (url: string) => {
    let clean = url.trim();
    // Remove trailing slash
    if (clean.endsWith('/')) {
      clean = clean.slice(0, -1);
    }
    // Check protocol
    if (clean && !/^https?:\/\//i.test(clean)) {
      clean = 'https://' + clean;
    }
    return clean;
  };

  // Check for private URLs
  useEffect(() => {
    const lower = baseUrl.toLowerCase();
    const clean = getCleanUrl(baseUrl);

    // Warn if the USER explicitly types a localhost address
    if (lower.includes('localhost') || lower.includes('127.0.0.1') || lower.endsWith('.local') || lower.includes('webcontainer')) {
      setWarning('Warning: You are using a local/preview URL. These codes will NOT work when scanned by others.');
    } else if (clean === getCleanUrl(DEPLOYED_URL)) {
      setWarning(null); // Perfect match
    } else {
       // Just a general check
       setWarning(null);
    }
  }, [baseUrl]);

  useEffect(() => {
    let isMounted = true;

    const generateQrCodes = async () => {
      const cleanBase = getCleanUrl(baseUrl);
      if (!cleanBase) return;

      const newTags: QrTag[] = [];
      for (let i = 0; i < count; i++) {
        const num = startNum + i;
        const id = `${prefix}${pad(num, 3)}`;
        
        // Handle URL construction safely
        const separator = cleanBase.includes('?') ? '&' : '?';
        const url = `${cleanBase}${separator}id=${id}`;
        
        try {
          // Generate high-quality QR code data URL locally
          const dataUrl = await QRCode.toDataURL(url, {
            width: 300, // Higher resolution for better print quality
            margin: 1,
            color: {
              dark: color,
              light: '#ffffff'
            }
          });
          newTags.push({ id, url, dataUrl });
        } catch (err) {
          console.error("Failed to generate QR", err);
        }
      }
      
      if (isMounted) {
        setTags(newTags);
      }
    };

    // Debounce generation to avoid lag while typing
    const timer = setTimeout(generateQrCodes, 500);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [prefix, startNum, count, color, baseUrl]);

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-slate-900 p-6 text-white no-print">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6" />
          QR Design Studio
        </h2>
        <p className="text-slate-400 text-sm mt-1">Generate bulk QR codes for your items.</p>
      </div>

      <div className="p-6">
        {/* Controls - Hidden on Print */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 no-print p-4 bg-gray-50 rounded-xl border border-gray-100">
          
          {/* Full Width URL Input */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" /> Destination URL (Must be public)
            </label>
            <div className="flex gap-2">
                <input 
                type="url" 
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                placeholder="https://your-site.github.io/"
                />
                <button 
                    onClick={handleUseProductionUrl}
                    title="Reset to Production URL"
                    className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors whitespace-nowrap text-sm font-medium px-4"
                >
                    <Globe className="w-4 h-4 inline mr-2" />
                    Use GitHub Link
                </button>
            </div>
            {warning && (
               <div className="mt-2 text-xs text-orange-700 bg-orange-50 p-2 rounded flex items-start gap-2 border border-orange-100">
                 <AlertTriangle className="w-4 h-4 shrink-0" />
                 {warning}
               </div>
            )}
            <div className="mt-2 text-xs text-gray-400 flex justify-between items-center">
               <span className="truncate max-w-[300px]">Preview: {getCleanUrl(baseUrl)}?id={prefix}{pad(startNum, 3)}</span>
               {tags.length > 0 && (
                   <a href={tags[0].url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                       Test Link <ExternalLink className="w-3 h-3"/>
                   </a>
               )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Prefix</label>
            <input 
              type="text" 
              value={prefix}
              onChange={(e) => setPrefix(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase"
              placeholder="e.g. KEYS_"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Starting Number</label>
            <input 
              type="number" 
              value={startNum}
              onChange={(e) => setStartNum(parseInt(e.target.value) || 1)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input 
              type="number" 
              value={count}
              max={50}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">QR Color</label>
            <div className="flex items-center gap-2">
              <input 
                type="color" 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-20 rounded border border-gray-300 p-1 cursor-pointer"
              />
              <span className="text-xs text-gray-500">{color}</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6 no-print">
            <div className="text-sm text-gray-500">
                Generating {tags.length} codes
            </div>
            <button 
                onClick={handlePrint}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
                <Printer className="w-4 h-4" />
                Print Labels
            </button>
        </div>

        {/* Grid Display - This is what prints */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 print-grid">
          {tags.map((tag) => (
            <div 
                key={tag.id} 
                className="print-card relative group flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-lg break-inside-avoid bg-white"
            >
              <div className="mb-2">
                <img 
                  src={tag.dataUrl}
                  alt={`QR code for ${tag.id}`}
                  className="w-[120px] h-[120px]"
                />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Scan to Return</p>
                <p className="font-mono font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded text-sm">{tag.id}</p>
              </div>
              
              {/* Download Button */}
              <a
                href={tag.dataUrl}
                download={`${tag.id}.png`}
                className="no-print absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-400 hover:shadow-md transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                title="Download PNG"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QrGenerator;