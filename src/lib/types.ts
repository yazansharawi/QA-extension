export interface Report {
  id?: number;
  url: string;
  buttonText: string;
  note: string;
  created_at?: string;
}

export interface ToggleHighlightMessage {
  type: 'TOGGLE_HIGHLIGHT';
}

export interface SubmitReportMessage {
  type: 'SUBMIT_REPORT';
  report: Report;
}

export interface ShowNotificationMessage {
  type: 'SHOW_NOTIFICATION';
  message: string;
}

export type Message = ToggleHighlightMessage | SubmitReportMessage | ShowNotificationMessage;
