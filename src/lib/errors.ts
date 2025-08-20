import { toast } from './toast'

export interface ApiError {
  message: string
  code?: string
  details?: string
}

export function handleApiError(error: unknown, context: string = 'Operation'): void {
  console.error(`Error in ${context}:`, error)
  
  let message = 'Ett fel uppstod'
  
  if (error instanceof Error) {
    message = error.message
  } else if (typeof error === 'string') {
    message = error
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String((error as any).message)
  }
  
  toast.error(`${context} misslyckades`, message)
}

export function showSuccess(message: string, title?: string): void {
  toast.success(title || 'Framgång', message)
}

export function showError(message: string, title?: string): void {
  toast.error(title || 'Fel', message)
}

export function showInfo(message: string, title?: string): void {
  toast.info(title || 'Information', message)
}

export function showWarning(message: string, title?: string): void {
  toast.warning(title || 'Varning', message)
}

// Fallback för när toast inte är tillgänglig
export function fallbackError(message: string): void {
  console.error(message)
  // Här kan du lägga till fallback UI om det behövs
}

// Common error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Nätverksfel - kontrollera din internetanslutning',
  UNAUTHORIZED: 'Du har inte behörighet att utföra denna åtgärd',
  NOT_FOUND: 'Den begärda resursen hittades inte',
  VALIDATION_ERROR: 'Vänligen kontrollera att alla fält är korrekt ifyllda',
  SERVER_ERROR: 'Serverfel - försök igen senare',
} as const
