import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
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
    
    // Store report in Supabase
    supabase
      .from('reports')
      .insert([report])
      .then(({ error }) => {
        if (error) {
          console.error('Error storing report:', error);
          sendResponse({ success: false, error: error.message });
        } else {
          sendResponse({ success: true });
        }
      });
    
    return true; // Keep the message channel open for the async response
  }
});
