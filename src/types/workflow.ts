
import { z } from 'zod';

// Types pour le Workflow Builder
export const ApiAuthTypeSchema = z.enum(['none', 'api_key', 'bearer', 'oauth2', 'basic', 'jwt']);

export const ApiConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  authType: ApiAuthTypeSchema,
  authConfig: z.record(z.any()).optional(),
  headers: z.record(z.string()).optional(),
  timeout: z.number().default(30000),
  retryCount: z.number().default(3),
  retryDelay: z.number().default(1000),
});

export const WorkflowNodeTypeSchema = z.enum([
  'start',
  'end', 
  'api_call',
  'condition',
  'delay',
  'transform',
  'user_input',
  'notification',
  'loop'
]);

export const WorkflowNodeSchema = z.object({
  id: z.string(),
  type: WorkflowNodeTypeSchema,
  position: z.object({ x: z.number(), y: z.number() }),
  data: z.record(z.any()),
  inputs: z.array(z.string()).default([]),
  outputs: z.array(z.string()).default([]),
});

export const WorkflowConnectionSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  conditions: z.record(z.any()).optional(),
});

export const WorkflowSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  version: z.string(),
  nodes: z.array(WorkflowNodeSchema),
  connections: z.array(WorkflowConnectionSchema),
  variables: z.record(z.any()).default({}),
  isActive: z.boolean().default(false),
  metadata: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    author: z.string().optional(),
  }),
});

export type ApiAuthType = z.infer<typeof ApiAuthTypeSchema>;
export type ApiConfig = z.infer<typeof ApiConfigSchema>;
export type WorkflowNodeType = z.infer<typeof WorkflowNodeTypeSchema>;
export type WorkflowNode = z.infer<typeof WorkflowNodeSchema>;
export type WorkflowConnection = z.infer<typeof WorkflowConnectionSchema>;
export type Workflow = z.infer<typeof WorkflowSchema>;

// Types pour le monitoring API
export interface ApiMetrics {
  totalRequests: number;
  successRate: number;
  averageResponseTime: number;
  errorRate: number;
  lastError?: {
    timestamp: string;
    status: number;
    message: string;
  };
}

export interface ApiCall {
  id: string;
  timestamp: string;
  url: string;
  method: string;
  status: number;
  responseTime: number;
  error?: string;
  requestData?: any;
  responseData?: any;
}
