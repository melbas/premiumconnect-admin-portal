
import { z } from 'zod';

// Schema de validation pour les thèmes JSON
export const ThemeColorsSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string().optional(),
  background: z.string(),
  surface: z.string(),
  text: z.string(),
  textSecondary: z.string().optional(),
  border: z.string().optional(),
  success: z.string().optional(),
  warning: z.string().optional(),
  error: z.string().optional(),
});

export const ThemeTypographySchema = z.object({
  fontFamily: z.string(),
  fontSize: z.object({
    xs: z.string(),
    sm: z.string(),
    base: z.string(),
    lg: z.string(),
    xl: z.string(),
    '2xl': z.string(),
    '3xl': z.string(),
  }),
  fontWeight: z.object({
    normal: z.string(),
    medium: z.string(),
    semibold: z.string(),
    bold: z.string(),
  }),
});

export const ThemeSpacingSchema = z.object({
  xs: z.string(),
  sm: z.string(),
  md: z.string(),
  lg: z.string(),
  xl: z.string(),
  '2xl': z.string(),
});

export const ThemeComponentsSchema = z.object({
  button: z.object({
    borderRadius: z.string(),
    padding: z.string(),
    fontWeight: z.string(),
  }),
  card: z.object({
    borderRadius: z.string(),
    shadow: z.string(),
    padding: z.string(),
  }),
  input: z.object({
    borderRadius: z.string(),
    padding: z.string(),
    borderWidth: z.string(),
  }),
});

export const ThemeJsonSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string().optional(),
  author: z.string().optional(),
  culturalContext: z.string().optional(),
  colors: ThemeColorsSchema,
  typography: ThemeTypographySchema,
  spacing: ThemeSpacingSchema,
  components: ThemeComponentsSchema,
  customCSS: z.string().optional(),
  metadata: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});

export type ThemeJson = z.infer<typeof ThemeJsonSchema>;
export type ThemeColors = z.infer<typeof ThemeColorsSchema>;
export type ThemeTypography = z.infer<typeof ThemeTypographySchema>;
export type ThemeSpacing = z.infer<typeof ThemeSpacingSchema>;
export type ThemeComponents = z.infer<typeof ThemeComponentsSchema>;
