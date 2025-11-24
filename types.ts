export enum TagStatus {
  LOADING = 'LOADING',
  NEW = 'NEW',
  FOUND = 'FOUND',
  ERROR = 'ERROR',
  SUCCESS_ACTIVATED = 'SUCCESS_ACTIVATED',
  NO_ID = 'NO_ID'
}

export interface ApiResponse {
  result: 'new' | 'found' | 'success' | 'error';
  wa_link?: string;
  message?: string;
}

export interface ActivateTagPayload {
  id: string;
  item: string;
  phone: string;
}
