
import { GOOGLE_SCRIPT_URL } from '../constants';
import { ApiResponse, ActivateTagPayload } from '../types';

/**
 * Helper to fetch with a timeout
 */
const fetchWithTimeout = async (resource: RequestInfo, options: RequestInit = {}) => {
  const { timeout = 10000 } = options as any;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal  
  });
  clearTimeout(id);
  return response;
}

/**
 * Fetches the status of a tag by ID.
 */
export const fetchTagStatus = async (tagId: string): Promise<ApiResponse> => {
  try {
    const response = await fetchWithTimeout(`${GOOGLE_SCRIPT_URL}?id=${encodeURIComponent(tagId)}`, {
      method: 'GET'
    });
    
    // Google Apps Script can sometimes return a 200 OK even on error (HTML error pages),
    // so we must try to parse the text first.
    const text = await response.text();
    
    try {
      const data: ApiResponse = JSON.parse(text);
      return data;
    } catch (e) {
      console.error("API Parse Error:", e);
      console.log("Received response:", text.substring(0, 200));
      return { 
        result: 'error', 
        message: 'Server returned invalid data. Check that the Google Web App permission is set to "Anyone".' 
      };
    }

  } catch (error: any) {
    console.error("API Error (Get):", error);
    if (error.name === 'AbortError') {
       return { result: 'error', message: 'Connection timed out. Please check your internet.' };
    }
    return { result: 'error', message: 'Failed to connect to the server. Please check your internet connection.' };
  }
};

/**
 * Activates a new tag using a POST request.
 * Note: We send as text/plain to avoid CORS Preflight (OPTIONS) issues with GAS.
 */
export const activateTag = async (payload: ActivateTagPayload): Promise<ApiResponse> => {
  try {
    const response = await fetchWithTimeout(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      // Using text/plain ensures this is treated as a "Simple Request" by the browser,
      // bypassing strict CORS preflight checks which GAS doesn't handle natively.
      headers: {
        'Content-Type': 'text/plain', 
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    
    try {
      const data: ApiResponse = JSON.parse(text);
      return data;
    } catch (e) {
      return { 
        result: 'error', 
        message: 'Server activation failed. Check deployment permissions.' 
      };
    }
  } catch (error: any) {
    console.error("API Error (Post):", error);
    if (error.name === 'AbortError') {
       return { result: 'error', message: 'Activation timed out. Please retry.' };
    }
    return { result: 'error', message: 'Failed to activate tag.' };
  }
};
