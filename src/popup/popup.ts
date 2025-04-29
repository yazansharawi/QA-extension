import { supabase } from '../lib/supabase';
import { Report } from '../lib/types';
import { formatDate, truncateText, appendStyles } from '../lib/utils';

function createReportElement(report: Report): HTMLElement {
  const div = document.createElement('div');
  div.className = 'report-item';
  
  div.innerHTML = `
    <div class="report-header">
      <div class="report-button">${truncateText(report.buttonText, 30)}</div>
      <div class="report-time">${formatDate(report.created_at || '')}</div>
    </div>
    <div class="report-url" title="${report.url}">${truncateText(report.url, 50)}</div>
    ${report.note ? `<div class="report-note">${truncateText(report.note, 100)}</div>` : ''}
  `;
  
  return div;
}

function showLoading() {
  const reportsList = document.getElementById('reports-list');
  if (!reportsList) return;
  
  reportsList.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <div>Loading reports...</div>
    </div>
  `;
}

function showError(message: string) {
  const reportsList = document.getElementById('reports-list');
  if (!reportsList) return;
  
  reportsList.innerHTML = `
    <div class="error-state">
      <div class="error-icon">⚠️</div>
      <div>${message}</div>
      <button class="retry-button">Retry</button>
    </div>
  `;
  
  const retryButton = reportsList.querySelector('.retry-button');
  retryButton?.addEventListener('click', (e: Event) => {
    loadReports(1);
  });
}

function showEmptyState() {
  const reportsList = document.getElementById('reports-list');
  if (!reportsList) return;
  
  reportsList.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">📝</div>
      <div>No reports yet</div>
      <div class="empty-subtext">Flag broken buttons to see them here</div>
    </div>
  `;
}

async function loadReports(page: number = 1) {
  const reportsList = document.getElementById('reports-list');
  const prevPageBtn = document.getElementById('prevPage') as HTMLButtonElement;
  const nextPageBtn = document.getElementById('nextPage') as HTMLButtonElement;
  const currentPageSpan = document.getElementById('currentPage');
  
  if (!reportsList || !prevPageBtn || !nextPageBtn || !currentPageSpan) return;
  
  showLoading();
  
  try {
    const pageSize = 5;
    const start = (page - 1) * pageSize;
    
    const { data: reports, error, count } = await supabase
      .from('reports')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(start, start + pageSize - 1);
    
    if (error) throw error;
    
    if (reports && reports.length > 0) {
      reportsList.innerHTML = '';
      reports.forEach(report => {
        reportsList.appendChild(createReportElement(report));
      });
    } else {
      showEmptyState();
    }
  
    currentPageSpan.textContent = page.toString();
    prevPageBtn.disabled = page === 1;
    nextPageBtn.disabled = !count || start + pageSize >= count;
  } catch (error) {
    console.error('Error loading reports:', error);
    showError('Failed to load reports. Please try again.');
  }
}

const popupStyles = `
  body {
    width: 400px;
    padding: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
  
  .report-item {
    padding: 12px;
    border: 1px solid #eee;
    border-radius: 8px;
    margin-bottom: 8px;
    transition: all 0.2s ease;
  }
  
  .report-item:hover {
    border-color: #007bff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .report-button {
    font-weight: 600;
    color: #333;
  }
  
  .report-time {
    font-size: 12px;
    color: #666;
  }
  
  .report-url {
    font-size: 13px;
    color: #666;
    margin-bottom: 4px;
  }
  
  .report-note {
    font-size: 13px;
    color: #666;
    font-style: italic;
  }
  
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
    color: #666;
  }
  
  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 12px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
    color: #666;
  }
  
  .error-icon {
    font-size: 24px;
    margin-bottom: 12px;
  }
  
  .retry-button {
    margin-top: 12px;
    padding: 8px 16px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  
  .retry-button:hover {
    background: #0056b3;
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
    color: #666;
  }
  
  .empty-icon {
    font-size: 24px;
    margin-bottom: 12px;
  }
  
  .empty-subtext {
    font-size: 13px;
    color: #999;
    margin-top: 4px;
  }
`;

appendStyles(popupStyles);

document.addEventListener('DOMContentLoaded', () => {
  const startHighlightingBtn = document.getElementById('startHighlighting');
  const prevPageBtn = document.getElementById('prevPage') as HTMLButtonElement;
  const nextPageBtn = document.getElementById('nextPage') as HTMLButtonElement;
  
  if (startHighlightingBtn) {
    startHighlightingBtn.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab.id) {
          chrome.tabs.sendMessage(activeTab.id, { type: 'TOGGLE_HIGHLIGHT' });
        }
      });
    });
  }
  
  if (prevPageBtn && nextPageBtn) {
    let currentPage = 1;
    
    prevPageBtn.addEventListener('click', (e: Event) => {
      if (currentPage > 1) {
        currentPage--;
        loadReports(currentPage);
      }
    });
    
    nextPageBtn.addEventListener('click', (e: Event) => {
      currentPage++;
      loadReports(currentPage);
    });
  }
  
  loadReports();
});
