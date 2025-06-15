
interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  userAgent: string;
  url: string;
  userId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: any;
}

class ErrorHandler {
  private errors: ErrorReport[] = [];
  private maxErrors = 100;

  init() {
    // Capturer les erreurs JavaScript
    window.addEventListener('error', (event) => {
      this.captureError({
        message: event.message,
        stack: event.error?.stack,
        severity: 'high',
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    // Capturer les promesses rejetées
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        severity: 'high',
        context: { reason: event.reason }
      });
    });
  }

  captureError(errorData: Partial<ErrorReport>) {
    const error: ErrorReport = {
      id: crypto.randomUUID(),
      message: errorData.message || 'Unknown error',
      stack: errorData.stack,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      severity: errorData.severity || 'medium',
      context: errorData.context,
      ...errorData
    };

    this.errors.push(error);

    // Limiter le nombre d'erreurs stockées
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log selon la sévérité
    this.logError(error);

    // Envoyer les erreurs critiques immédiatement
    if (error.severity === 'critical') {
      this.sendErrorReport(error);
    }
  }

  private logError(error: ErrorReport) {
    const logMethod = {
      low: console.log,
      medium: console.warn,
      high: console.error,
      critical: console.error
    }[error.severity];

    logMethod(`[${error.severity.toUpperCase()}] ${error.message}`, error);
  }

  private async sendErrorReport(error: ErrorReport) {
    try {
      // En production, envoyer à un service de monitoring
      console.log('Sending error report:', error);
      
      // Exemple d'envoi vers Supabase ou service externe
      // await supabase.from('error_logs').insert(error);
    } catch (err) {
      console.error('Failed to send error report:', err);
    }
  }

  getErrors(): ErrorReport[] {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
  }

  exportErrors(): string {
    return JSON.stringify(this.errors, null, 2);
  }
}

export const errorHandler = new ErrorHandler();

// Initialiser automatiquement
if (typeof window !== 'undefined') {
  errorHandler.init();
}
