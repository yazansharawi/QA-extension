import { 
  floatingButtonStyles,
  flagButtonStyles,
  reportFormStyles,
  formTextareaStyles,
  cancelButtonStyles,
  submitButtonStyles
} from './styles';
import { Report } from '../lib/types';

let isHighlightMode = false;

const highlightClickHandlers = new WeakMap<HTMLElement, EventListener>();

function createFloatingButton() {
  const button = document.createElement('div');
  button.className = 'qa-floating-button';
  button.innerHTML = `
    <div class="qa-button-icon">🚩</div>
    <div class="qa-button-text">Flag Buttons</div>
  `;
  button.style.cssText = floatingButtonStyles;
  
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-2px)';
    button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  });
  
  button.addEventListener('click', () => {
    toggleHighlightMode();
    updateButtonState(button);
  });
  
  document.body.appendChild(button);
  return button;
}

function updateButtonState(button: HTMLElement) {
  if (isHighlightMode) {
    button.style.background = '#dc3545';
    button.querySelector('.qa-button-text')!.textContent = 'Stop Flagging';
  } else {
    button.style.background = '#007bff';
    button.querySelector('.qa-button-text')!.textContent = 'Flag Buttons';
  }
}

function toggleHighlightMode() {
  isHighlightMode = !isHighlightMode;
  if (isHighlightMode) {
    enableHighlightMode();
  } else {
    disableHighlightMode();
  }
}


function enableHighlightMode() {
  const buttons = document.querySelectorAll('button, a');
  buttons.forEach(button => {
    const htmlButton = button as HTMLElement;
    htmlButton.style.outline = '2px solid #007bff';
    htmlButton.style.position = 'relative';
    htmlButton.style.transition = 'outline 0.3s ease';
    
    const flagButton = document.createElement('div');
    flagButton.className = 'flag-button';
    flagButton.innerHTML = '🚩';
    flagButton.style.cssText = flagButtonStyles;
    
    htmlButton.appendChild(flagButton);
    
    htmlButton.addEventListener('mouseenter', () => {
      flagButton.style.display = 'block';
      flagButton.style.transform = 'scale(0.8)';
      flagButton.style.opacity = '0.5';
      flagButton.style.pointerEvents = 'none'; 
      htmlButton.style.outline = '2px solid #ff4444';
      
      setTimeout(() => {
        flagButton.style.transform = 'scale(1)';
        flagButton.style.opacity = '1';
        flagButton.style.pointerEvents = 'auto'; 
      }, 300); 
    });
    
    htmlButton.addEventListener('mouseleave', () => {
      flagButton.style.transform = 'scale(0.8)';
      flagButton.style.opacity = '0';
      flagButton.style.pointerEvents = 'none';
      setTimeout(() => {
        if (!htmlButton.matches(':hover')) {
          flagButton.style.display = 'none';
        }
      }, 300);
      htmlButton.style.outline = '2px solid #007bff';
    });
    
    flagButton.addEventListener('click', (e) => {
      e.stopPropagation();
      showReportForm(htmlButton);
    });

    const preventClick: EventListener = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!(e.target instanceof HTMLElement && e.target.classList.contains('flag-button'))) {
        showReportForm(htmlButton);
      }
    };
    htmlButton.addEventListener('click', preventClick, true);
    highlightClickHandlers.set(htmlButton, preventClick);
  });
}

function disableHighlightMode() {
  const buttons = document.querySelectorAll('button, a');
  buttons.forEach(button => {
    const htmlButton = button as HTMLElement;
    htmlButton.style.outline = '';
    const flagButton = htmlButton.querySelector('.flag-button');
    if (flagButton) {
      flagButton.remove();
    }
    const handler = highlightClickHandlers.get(htmlButton);
    if (handler) {
      htmlButton.removeEventListener('click', handler, true);
      highlightClickHandlers.delete(htmlButton);
    }
  });
}

function showReportForm(button: HTMLElement) {
  const form = document.createElement('div');
  form.className = 'report-form';
  form.style.cssText = reportFormStyles;
  
  form.innerHTML = `
    <h3 style="margin: 0 0 16px; color: #333; font-size: 18px;">Report Broken Button</h3>
    <p style="margin: 0 0 12px; color: #666; font-size: 14px;">Button Text: ${button.textContent?.trim() || 'N/A'}</p>
    <textarea 
      placeholder="Add a note..." 
      style="${formTextareaStyles}"
    ></textarea>
    <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px;">
      <button class="cancel-btn" style="${cancelButtonStyles}">Cancel</button>
      <button class="submit-btn" style="${submitButtonStyles}">Submit</button>
    </div>
  `;
  
  document.body.appendChild(form);
  
  requestAnimationFrame(() => {
    form.style.transform = 'translate(-50%, -50%) scale(1)';
    form.style.opacity = '1';
  });
  
  const submitBtn = form.querySelector('.submit-btn');
  const cancelBtn = form.querySelector('.cancel-btn');
  const textarea = form.querySelector('textarea');
  
  submitBtn?.addEventListener('click', () => {
    const report: Report = {
      url: window.location.href,
      buttonText: button.textContent?.trim() || 'N/A',
      note: textarea?.value || ''
    };
    
    chrome.runtime.sendMessage({ type: 'SUBMIT_REPORT', report });
    
    form.style.transform = 'translate(-50%, -50%) scale(0.9)';
    form.style.opacity = '0';
    setTimeout(() => form.remove(), 300);
  });
  
  cancelBtn?.addEventListener('click', () => {
    form.style.transform = 'translate(-50%, -50%) scale(0.9)';
    form.style.opacity = '0';
    setTimeout(() => form.remove(), 300);
  });
  
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

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TOGGLE_HIGHLIGHT') {
    toggleHighlightMode();
  }
});

document.addEventListener('DOMContentLoaded', () => {
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
    
    .qa-floating-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    }
    
    .qa-button-icon {
      font-size: 18px;
    }
    
    .qa-button-text {
      font-size: 14px;
      font-weight: 500;
    }
  `;
  document.head.appendChild(style);
  
  const floatingButton = createFloatingButton();
});
