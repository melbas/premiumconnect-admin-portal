
import { ThemeJson } from '@/types/theme';

export const defaultThemes: ThemeJson[] = [
  {
    name: "Teranga Sénégal",
    version: "1.0.0",
    description: "Thème inspiré de l'hospitalité sénégalaise avec des couleurs chaudes",
    author: "WiFi Sénégal",
    culturalContext: "Sénégal - Hospitalité traditionnelle",
    colors: {
      primary: "#D97706",
      secondary: "#92400E", 
      accent: "#FCD34D",
      background: "#FFFBEB",
      surface: "#FFFFFF",
      text: "#1F2937",
      textSecondary: "#6B7280",
      border: "#E5E7EB",
      success: "#059669",
      warning: "#D97706",
      error: "#DC2626"
    },
    typography: {
      fontFamily: "Montserrat, sans-serif",
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem", 
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem"
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600", 
        bold: "700"
      }
    },
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem", 
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem"
    },
    components: {
      button: {
        borderRadius: "0.5rem",
        padding: "0.75rem 1.5rem",
        fontWeight: "600"
      },
      card: {
        borderRadius: "0.75rem",
        shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        padding: "1.5rem"
      },
      input: {
        borderRadius: "0.5rem",
        padding: "0.75rem",
        borderWidth: "1px"
      }
    },
    customCSS: `
      .portal-container {
        background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%);
        min-height: 100vh;
      }
      
      .portal-card {
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
    `,
    metadata: {
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      tags: ["sénégal", "traditionnel", "chaud", "hospitalité"]
    }
  },
  {
    name: "Dakar Modern",
    version: "1.2.0", 
    description: "Design moderne et urbain inspiré de Dakar",
    author: "WiFi Sénégal",
    culturalContext: "Sénégal - Modernité urbaine",
    colors: {
      primary: "#1E40AF",
      secondary: "#3B82F6",
      accent: "#60A5FA", 
      background: "#F8FAFC",
      surface: "#FFFFFF",
      text: "#0F172A",
      textSecondary: "#475569",
      border: "#E2E8F0",
      success: "#10B981",
      warning: "#F59E0B", 
      error: "#EF4444"
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem", 
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem"
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700"
      }
    },
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem", 
      xl: "2rem",
      "2xl": "3rem"
    },
    components: {
      button: {
        borderRadius: "0.375rem",
        padding: "0.625rem 1.25rem",
        fontWeight: "500"
      },
      card: {
        borderRadius: "0.5rem",
        shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        padding: "1.25rem"
      },
      input: {
        borderRadius: "0.375rem", 
        padding: "0.625rem",
        borderWidth: "1px"
      }
    },
    customCSS: `
      .portal-container {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      
      .glass-effect {
        backdrop-filter: blur(16px);
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
    `,
    metadata: {
      createdAt: "2024-01-20T14:30:00Z", 
      updatedAt: "2024-02-01T09:15:00Z",
      tags: ["moderne", "urbain", "dakar", "professionnel"]
    }
  },
  {
    name: "Casamance Nature",
    version: "1.0.0",
    description: "Thème naturel inspiré de la région de Casamance",
    author: "WiFi Sénégal",
    culturalContext: "Casamance - Nature et verdure",
    colors: {
      primary: "#166534",
      secondary: "#15803D",
      accent: "#22C55E",
      background: "#F0FDF4",
      surface: "#FFFFFF", 
      text: "#14532D",
      textSecondary: "#16A34A",
      border: "#BBF7D0",
      success: "#22C55E",
      warning: "#EAB308",
      error: "#DC2626"
    },
    typography: {
      fontFamily: "Poppins, sans-serif",
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem", 
        "2xl": "1.5rem",
        "3xl": "1.875rem"
      },
      fontWeight: {
        normal: "400",
        medium: "500", 
        semibold: "600",
        bold: "700"
      }
    },
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem"
    },
    components: {
      button: {
        borderRadius: "1rem",
        padding: "0.75rem 1.5rem", 
        fontWeight: "600"
      },
      card: {
        borderRadius: "1rem",
        shadow: "0 8px 25px -8px rgba(0, 0, 0, 0.1)",
        padding: "2rem"
      },
      input: {
        borderRadius: "0.75rem",
        padding: "0.875rem",
        borderWidth: "2px"
      }
    },
    customCSS: `
      .portal-container {
        background: linear-gradient(135deg, #10b981 0%, #047857 100%);
      }
      
      .nature-pattern::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316a34a' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        opacity: 0.3;
      }
    `,
    metadata: {
      createdAt: "2024-01-25T16:45:00Z",
      updatedAt: "2024-01-25T16:45:00Z", 
      tags: ["nature", "casamance", "vert", "écologique"]
    }
  }
];
