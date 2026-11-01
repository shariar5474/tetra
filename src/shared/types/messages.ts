export type ExtensionMessageType =
  | 'OPEN_DASHBOARD'
  | 'GET_FLOW_STATUS'
  | 'CHECK_FLOW_TAB'
  | 'FLOW_TRIGGER_GENERATE'
  | 'FLOW_GENERATE_PROGRESS'
  | 'FLOW_GENERATE_COMPLETE'
  | 'FLOW_GENERATE_FAILED'
  | 'FLOW_MANUAL_HANDOFF'
  | 'FLOW_DOM_INSPECT'
  | 'JOB_START'
  | 'JOB_PAUSE'
  | 'JOB_RESUME'
  | 'JOB_CANCEL'
  | 'GET_QUEUE_STATUS'
  | 'SHOW_NOTIFICATION'
  | 'DOWNLOAD_MEDIA';

export interface ExtensionMessage<T = any> {
  type: ExtensionMessageType;
  requestId?: string;
  sender?: 'dashboard' | 'popup' | 'background' | 'content_script';
  payload?: T;
  timestamp: number;
}

export interface ExtensionResponse<T = any> {
  success: boolean;
  requestId?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
