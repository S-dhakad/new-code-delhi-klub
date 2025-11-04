import axios, { AxiosError } from 'axios';

const statusMessages: Record<number, string> = {
  400: 'Bad request. Please check your input and try again.',
  401: 'Unauthorized. Please log in to continue.',
  403: 'Access denied. You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  408: 'Request timeout. Please try again later.',
  409: 'Conflict detected. The data might have changed, please refresh.',
  422: 'Validation error. Please check your data.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'Internal server error. Please try again later.',
  502: 'Bad gateway. Please try again shortly.',
  503: 'Service unavailable. Please try again later.',
  504: 'Gateway timeout. Please try again later.',
};

// Typed interface for Axios error response data
interface AxiosErrorResponse {
  message?: string;
  error?: string;
  [key: string]: unknown; // for any other fields
}

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data as AxiosErrorResponse | undefined;
    const serverMsg = data?.message || data?.error;

    if (status === 404) return statusMessages[status];

    if (status === 500) return statusMessages[status];

    if (serverMsg && typeof serverMsg === 'string') return serverMsg;

    if (status && statusMessages[status]) return statusMessages[status];

    if (status)
      return `Unexpected server response (${status}). Please try again.`;

    return err.message || 'Network error. Please check your connection.';
  }

  if (err instanceof Error) return err.message || 'An error occurred.';

  return String(err) || 'An unexpected error occurred.';
}
