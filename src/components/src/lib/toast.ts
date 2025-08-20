// Enkel toast-utility som fallback
export const toast = {
  success: (title: string, message?: string) => {
    console.log(`✅ ${title}: ${message || ''}`)
  },
  error: (title: string, message?: string) => {
    console.error(`❌ ${title}: ${message || ''}`)
  },
  info: (title: string, message?: string) => {
    console.info(`ℹ️ ${title}: ${message || ''}`)
  },
  warning: (title: string, message?: string) => {
    console.warn(`⚠️ ${title}: ${message || ''}`)
  }
}
