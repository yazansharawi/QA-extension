import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Interface for report data
interface Report {
  id: number;
  url: string;
  buttonText: string;
  note: string;
  timestamp: string;
}

// Function to format timestamp
function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

// Function to create report element
function createReportElement(report: Report): HTMLElement {
  const div = document.createElement('div');
  div.className = 'report-item';
  
  div.innerHTML = `
    <div class="report-url">${report.url}</div>
    <div class="report-button">${report.buttonText}</div>
    <div class="report-note">${report.note}</div>
    <div class="report-time">${formatDate(report.timestamp)}</div>
  `;
  
  return div;
}

// Function to load and display reports
async function loadReports() {
  const reportsList = document.getElementById('reports-list');
  if (!reportsList) return;
  
  try {
    const { data: reports, error } = await supabase
      .from('reports')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    
    if (reports && reports.length > 0) {
      reportsList.innerHTML = '';
      reports.forEach(report => {
        reportsList.appendChild(createReportElement(report));
      });
    } else {
      reportsList.innerHTML = '<div class="empty-state">No reports yet</div>';
    }
  } catch (error) {
    console.error('Error loading reports:', error);
    reportsList.innerHTML = '<div class="empty-state">Error loading reports</div>';
  }
}

// Load reports when popup opens
document.addEventListener('DOMContentLoaded', loadReports);
