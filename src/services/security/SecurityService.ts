
export class SecurityService {
  // Validation des emails
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  // Sanitisation des entrées utilisateur
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>"/]/g, '') // Supprimer caractères dangereux
      .trim()
      .substring(0, 1000); // Limiter la longueur
  }

  // Validation des mots de passe
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Rate limiting simple côté client
  private static requestCounts: Map<string, { count: number; resetTime: number }> = new Map();

  static checkRateLimit(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.requestCounts.get(key);

    if (!record || now > record.resetTime) {
      this.requestCounts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  // Génération de tokens sécurisés
  static generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Validation des URL
  static validateUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }
}
