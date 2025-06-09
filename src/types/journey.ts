
import { z } from 'zod';

// Types pour la gestion des parcours client
export const JourneyStepTypeSchema = z.enum([
  'welcome',
  'auth',
  'form',
  'content',
  'api_call',
  'condition',
  'redirect',
  'success',
  'error'
]);

export const JourneyStepSchema = z.object({
  id: z.string(),
  type: JourneyStepTypeSchema,
  name: z.string(),
  description: z.string().optional(),
  config: z.record(z.any()),
  position: z.object({ x: z.number(), y: z.number() }),
  conditions: z.array(z.object({
    field: z.string(),
    operator: z.enum(['equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'exists']),
    value: z.any(),
    nextStep: z.string(),
  })).default([]),
  isRequired: z.boolean().default(false),
  timeoutSeconds: z.number().optional(),
});

export const JourneySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  version: z.string(),
  startStepId: z.string(),
  steps: z.array(JourneyStepSchema),
  variables: z.record(z.any()).default({}),
  isActive: z.boolean().default(false),
  siteId: z.string().optional(),
  metadata: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    author: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const JourneyExecutionSchema = z.object({
  id: z.string(),
  journeyId: z.string(),
  userId: z.string().optional(),
  sessionId: z.string(),
  startedAt: z.string(),
  completedAt: z.string().optional(),
  currentStepId: z.string(),
  stepHistory: z.array(z.object({
    stepId: z.string(),
    enteredAt: z.string(),
    exitedAt: z.string().optional(),
    data: z.record(z.any()).default({}),
  })),
  variables: z.record(z.any()).default({}),
  status: z.enum(['active', 'completed', 'abandoned', 'error']),
});

export type JourneyStepType = z.infer<typeof JourneyStepTypeSchema>;
export type JourneyStep = z.infer<typeof JourneyStepSchema>;
export type Journey = z.infer<typeof JourneySchema>;
export type JourneyExecution = z.infer<typeof JourneyExecutionSchema>;

// Analytics des parcours
export interface JourneyAnalytics {
  totalExecutions: number;
  completionRate: number;
  averageCompletionTime: number;
  dropoffSteps: Array<{
    stepId: string;
    stepName: string;
    dropoffRate: number;
  }>;
  conversionFunnel: Array<{
    stepId: string;
    stepName: string;
    usersReached: number;
    conversionRate: number;
  }>;
}
