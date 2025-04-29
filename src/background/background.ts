import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Log the values (temporarily for debugging)
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? 'Key is present' : 'Key is missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your environment variables.');
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Handle keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-highlight-mode') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab.id) {
        chrome.tabs.sendMessage(activeTab.id, { type: 'TOGGLE_HIGHLIGHT' });
      }
    });
  }
});

// Handle report submissions
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SUBMIT_REPORT') {
    const { report } = message;
    
    // Validate report data
    if (!report.url || !report.buttonText) {
      sendResponse({ success: false, error: 'Missing required fields' });
      return true;
    }
    
    // Store report in Supabase
    (async () => {
      try {
        const { error } = await supabase
          .from('reports')
          .insert([{
            ...report,
            created_at: new Date().toISOString()
          }]);
        
        if (error) {
          console.error('Error storing report:', error);
          sendResponse({ success: false, error: error.message });
        } else {
          // Show success notification
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab.id) {
              chrome.tabs.sendMessage(activeTab.id, { 
                type: 'SHOW_NOTIFICATION',
                message: 'Report submitted successfully!'
              });
            }
          });
          sendResponse({ success: true });
        }
      } catch (error: unknown) {
        console.error('Unexpected error:', error);
        sendResponse({ success: false, error: 'An unexpected error occurred' });
      }
    })();
    
    return true; // Keep the message channel open for the async response
  }
  
  // Handle getting recent reports
  if (message.type === 'GET_RECENT_REPORTS') {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) {
          console.error('Error fetching reports:', error);
          sendResponse({ success: false, error: error.message });
        } else {
          sendResponse({ success: true, reports: data });
        }
      } catch (error: unknown) {
        console.error('Unexpected error:', error);
        sendResponse({ success: false, error: 'An unexpected error occurred' });
      }
    })();
    
    return true; // Keep the message channel open for the async response
  }
});
