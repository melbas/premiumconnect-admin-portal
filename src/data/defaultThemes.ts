
import { ThemeJson } from '@/types/theme';

export const defaultThemes: ThemeJson[] = [
  {
    name: "Teranga",
    version: "1.0.0",
    description: "Thème culturel sénégalais avec couleurs chaudes et accueillantes",
    author: "Super Admin",
    culturalContext: "Sénégal - Hospitalité traditionnelle",
    colors: {
      primary: "#D97706",
      secondary: "#EA580C",
      accent: "#F59E0B",
      background: "#FFF7ED",
      surface: "#FFFFFF",
      text: "#9A3412",
      textSecondary: "#C2410C",
      border: "#FED7AA",
      success: "#059669",
      warning: "#D97706",
      error: "#DC2626"
    },
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
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
        padding: "0.5rem 1rem",
        fontWeight: "500"
      },
      card: {
        borderRadius: "0.75rem",
        shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        padding: "1.5rem"
      },
      input: {
        borderRadius: "0.5rem",
        padding: "0.5rem 0.75rem",
        borderWidth: "1px"
      }
    },
    customCSS: `
      .teranga-gradient {
        background: linear-gradient(135deg, #D97706 0%, #EA580C 100%);
      }
      .teranga-text-shadow {
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    `,
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ["culturel", "sénégal", "orange", "chaleureux"]
    }
  },
  {
    name: "Dakar Modern",
    version: "1.0.0", 
    description: "Design moderne urbain inspiré de Dakar",
    author: "Super Admin",
    culturalContext: "Sénégal - Modernité urbaine",
    colors: {
      primary: "#3B82F6",
      secondary: "#1E40AF",
      accent: "#06B6D4",
      background: "#FFFFFF",
      surface: "#F8FAFC",
      text: "#1F2937",
      textSecondary: "#6B7280",
      border: "#E5E7EB",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444"
    },
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
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
        padding: "0.5rem 1rem",
        fontWeight: "500"
      },
      card: {
        borderRadius: "0.5rem",
        shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        padding: "1.5rem"
      },
      input: {
        borderRadius: "0.375rem",
        padding: "0.5rem 0.75rem",
        borderWidth: "1px"
      }
    },
    customCSS: `
      .modern-glass {
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.8);
      }
    `,
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ["moderne", "urbain", "bleu", "professionnel"]
    }
  },
  {
    name: "Casamance Nature",
    version: "1.0.0",
    description: "Inspiré de la région naturelle de Casamance",
    author: "Super Admin", 
    culturalContext: "Sénégal - Nature et traditions du Sud",
    colors: {
      primary: "#059669",
      secondary: "#047857",
      accent: "#10B981",
      background: "#F0FDF4",
      surface: "#FFFFFF",
      text: "#064E3B",
      textSecondary: "#065F46",
      border: "#BBF7D0",
      success: "#059669",
      warning: "#D97706",
      error: "#DC2626"
    },
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
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
        borderRadius: "0.75rem",
        padding: "0.5rem 1rem",
        fontWeight: "500"
      },
      card: {
        borderRadius: "1rem",
        shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        padding: "1.5rem"
      },
      input: {
        borderRadius: "0.75rem",
        padding: "0.5rem 0.75rem",
        borderWidth: "1px"
      }
    },
    customCSS: `
      .nature-pattern {
        background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23059669' fill-opacity='0.05'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v-40c11.046 0 20 8.954 20 20z'/%3E%3C/g%3E%3C/svg%3E");
      }
    `,
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ["nature", "vert", "casamance", "écologique"]
    }
  }
];
