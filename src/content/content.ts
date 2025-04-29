// Content script for button highlighting and flagging
let isHighlightMode = false;

// Function to toggle highlight mode
function toggleHighlightMode() {
  isHighlightMode = !isHighlightMode;
  if (isHighlightMode) {
    enableHighlightMode();
  } else {
    disableHighlightMode();
  }
}

// Function to enable highlight mode
function enableHighlightMode() {
  const buttons = document.querySelectorAll('button, a');
  buttons.forEach(button => {
    const htmlButton = button as HTMLElement;
    htmlButton.style.outline = '2px solid #007bff';
    htmlButton.style.position = 'relative';
    htmlButton.style.transition = 'outline 0.3s ease';
    
    // Create flag button
    const flagButton = document.createElement('div');
    flagButton.className = 'flag-button';
    flagButton.innerHTML = '🚩';
    flagButton.style.cssText = `
      position: absolute;
      top: -20px;
      right: -20px;
      background: white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: none;
      cursor: pointer;
      text-align: center;
      line-height: 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
      z-index: 1000;
    `;
    
    htmlButton.appendChild(flagButton);
    
    // Show flag on hover
    htmlButton.addEventListener('mouseenter', () => {
      flagButton.style.display = 'block';
      flagButton.style.transform = 'scale(1)';
      flagButton.style.opacity = '1';
      htmlButton.style.outline = '2px solid #ff4444';
    });
    
    htmlButton.addEventListener('mouseleave', () => {
      flagButton.style.transform = 'scale(0.8)';
      flagButton.style.opacity = '0';
      setTimeout(() => {
        if (!htmlButton.matches(':hover')) {
          flagButton.style.display = 'none';
        }
      }, 300);
      htmlButton.style.outline = '2px solid #007bff';
    });
    
    // Handle flag click
    flagButton.addEventListener('click', (e) => {
      e.stopPropagation();
      showReportForm(htmlButton);
    });
  });
}

// Function to disable highlight mode
function disableHighlightMode() {
  const buttons = document.querySelectorAll('button, a');
  buttons.forEach(button => {
    const htmlButton = button as HTMLElement;
    htmlButton.style.outline = '';
    const flagButton = htmlButton.querySelector('.flag-button');
    if (flagButton) {
      flagButton.remove();
    }
  });
}

// Function to show report form
function showReportForm(button: HTMLElement) {
  const form = document.createElement('div');
  form.className = 'report-form';
  form.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.9);
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    z-index: 10000;
    width: 320px;
    opacity: 0;
    transition: all 0.3s ease;
  `;
  
  form.innerHTML = `
    <h3 style="margin: 0 0 16px; color: #333; font-size: 18px;">Report Broken Button</h3>
    <p style="margin: 0 0 12px; color: #666; font-size: 14px;">Button Text: ${button.textContent?.trim() || 'N/A'}</p>
    <textarea 
      placeholder="Add a note..." 
      style="
        width: 100%;
        margin: 10px 0;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        resize: vertical;
        min-height: 80px;
        font-family: inherit;
        font-size: 14px;
      "
    ></textarea>
    <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px;">
      <button class="cancel-btn" style="
        padding: 8px 16px;
        background: #f5f5f5;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.2s ease;
      ">Cancel</button>
      <button class="submit-btn" style="
        padding: 8px 16px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.2s ease;
      ">Submit</button>
    </div>
  `;
  
  document.body.appendChild(form);
  
  // Animate form in
  requestAnimationFrame(() => {
    form.style.transform = 'translate(-50%, -50%) scale(1)';
    form.style.opacity = '1';
  });
  
  // Handle form submission
  const submitBtn = form.querySelector('.submit-btn');
  const cancelBtn = form.querySelector('.cancel-btn');
  const textarea = form.querySelector('textarea');
  
  submitBtn?.addEventListener('click', () => {
    const report = {
      url: window.location.href,
      buttonText: button.textContent?.trim() || 'N/A',
      note: textarea?.value || '',
      timestamp: new Date().toISOString()
    };
    
    // Send report to background script
    chrome.runtime.sendMessage({ type: 'SUBMIT_REPORT', report });
    
    // Animate form out
    form.style.transform = 'translate(-50%, -50%) scale(0.9)';
    form.style.opacity = '0';
    setTimeout(() => form.remove(), 300);
  });
  
  cancelBtn?.addEventListener('click', () => {
    // Animate form out
    form.style.transform = 'translate(-50%, -50%) scale(0.9)';
    form.style.opacity = '0';
    setTimeout(() => form.remove(), 300);
  });
  
  // Add hover effects
  submitBtn?.addEventListener('mouseenter', () => {
    (submitBtn as HTMLElement).style.background = '#0056b3';
  });
  
  submitBtn?.addEventListener('mouseleave', () => {
    (submitBtn as HTMLElement).style.background = '#007bff';
  });
  
  cancelBtn?.addEventListener('mouseenter', () => {
    (cancelBtn as HTMLElement).style.background = '#e0e0e0';
  });
  
  cancelBtn?.addEventListener('mouseleave', () => {
    (cancelBtn as HTMLElement).style.background = '#f5f5f5';
  });
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TOGGLE_HIGHLIGHT') {
    toggleHighlightMode();
  }
});

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
  // Add styles for highlight mode
  const style = document.createElement('style');
  style.textContent = `
    .flag-button:hover {
      transform: scale(1.1) !important;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
    }
    
    .report-form textarea:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.2);
    }
  `;
  document.head.appendChild(style);
});
