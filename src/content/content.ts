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
      width: 20px;
      height: 20px;
      display: none;
      cursor: pointer;
      text-align: center;
      line-height: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;
    
    htmlButton.appendChild(flagButton);
    
    // Show flag on hover
    htmlButton.addEventListener('mouseenter', () => {
      flagButton.style.display = 'block';
      htmlButton.style.outline = '2px solid red';
    });
    
    htmlButton.addEventListener('mouseleave', () => {
      flagButton.style.display = 'none';
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
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
  `;
  
  form.innerHTML = `
    <h3>Report Broken Button</h3>
    <p>Button Text: ${button.textContent?.trim() || 'N/A'}</p>
    <textarea placeholder="Add a note..." style="width: 100%; margin: 10px 0; padding: 8px;"></textarea>
    <div style="display: flex; justify-content: flex-end; gap: 10px;">
      <button class="cancel-btn" style="padding: 8px 16px;">Cancel</button>
      <button class="submit-btn" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px;">Submit</button>
    </div>
  `;
  
  document.body.appendChild(form);
  
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
    form.remove();
  });
  
  cancelBtn?.addEventListener('click', () => {
    form.remove();
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
      transform: scale(1.1);
    }
  `;
  document.head.appendChild(style);
});
