export interface Report {
  id?: number;
  url: string;
  buttonText: string;
  note: string;
  timestamp: string;
}

export interface ToggleHighlightMessage {
  type: 'TOGGLE_HIGHLIGHT';
}

export interface SubmitReportMessage {
  type: 'SUBMIT_REPORT';
  report: Report;
}

export type Message = ToggleHighlightMessage | SubmitReportMessage;
