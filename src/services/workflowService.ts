import { Workflow, WorkflowNode, ApiConfig, ApiCall, ApiMetrics } from '@/types/workflow';

export class WorkflowService {
  private static readonly STORAGE_KEY = 'portal_workflows';
  private static readonly API_CALLS_KEY = 'api_calls_log';

  static async executeWorkflow(workflow: Workflow, context: Record<string, any> = {}): Promise<any> {
    console.log(`🔄 Executing workflow: ${workflow.name}`);
    
    const startNode = workflow.nodes.find(n => n.type === 'start');
    if (!startNode) {
      throw new Error('No start node found in workflow');
    }

    return this.executeNode(startNode, workflow, context);
  }

  private static async executeNode(node: WorkflowNode, workflow: Workflow, context: Record<string, any>): Promise<any> {
    console.log(`📍 Executing node: ${node.id} (${node.type})`);

    switch (node.type) {
      case 'api_call':
        return this.executeApiCall(node, context);
      
      case 'condition':
        return this.executeCondition(node, workflow, context);
      
      case 'delay':
        await this.executeDelay(node.data.duration || 1000);
        return this.executeNextNode(node, workflow, context);
      
      case 'transform':
        return this.executeTransform(node, context);
      
      case 'end':
        return context;
      
      default:
        return this.executeNextNode(node, workflow, context);
    }
  }

  private static async executeApiCall(node: WorkflowNode, context: Record<string, any>): Promise<any> {
    const apiConfig: ApiConfig = node.data.apiConfig;
    const startTime = Date.now();
    
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...apiConfig.headers,
      };

      // Add authentication
      if (apiConfig.authType === 'api_key' && apiConfig.authConfig?.key) {
        headers[apiConfig.authConfig.headerName || 'X-API-Key'] = apiConfig.authConfig.key;
      } else if (apiConfig.authType === 'bearer' && apiConfig.authConfig?.token) {
        headers['Authorization'] = `Bearer ${apiConfig.authConfig.token}`;
      }

      const requestData = this.interpolateData(node.data.requestBody || {}, context);
      
      const response = await fetch(apiConfig.url, {
        method: apiConfig.method,
        headers,
        body: ['GET', 'DELETE'].includes(apiConfig.method) ? undefined : JSON.stringify(requestData),
        signal: AbortSignal.timeout(apiConfig.timeout),
      });

      const responseTime = Date.now() - startTime;
      const responseData = await response.json();

      // Log API call
      this.logApiCall({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        url: apiConfig.url,
        method: apiConfig.method,
        status: response.status,
        responseTime,
        requestData,
        responseData: response.ok ? responseData : undefined,
        error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`,
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      return { ...context, [node.data.outputVariable || 'apiResponse']: responseData };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      this.logApiCall({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        url: apiConfig.url,
        method: apiConfig.method,
        status: 0,
        responseTime,
        error: error.message,
      });

      throw error;
    }
  }

  private static executeCondition(node: WorkflowNode, workflow: Workflow, context: Record<string, any>): any {
    const condition = node.data.condition;
    const value = this.getValueFromContext(condition.field, context);
    
    let result = false;
    switch (condition.operator) {
      case 'equals':
        result = value === condition.value;
        break;
      case 'not_equals':
        result = value !== condition.value;
        break;
      case 'greater_than':
        result = Number(value) > Number(condition.value);
        break;
      case 'less_than':
        result = Number(value) < Number(condition.value);
        break;
      case 'contains':
        result = String(value).includes(String(condition.value));
        break;
      case 'exists':
        result = value !== undefined && value !== null;
        break;
    }

    const nextNodeId = result ? condition.trueNode : condition.falseNode;
    const nextNode = workflow.nodes.find(n => n.id === nextNodeId);
    
    if (nextNode) {
      return this.executeNode(nextNode, workflow, context);
    }

    return context;
  }

  private static async executeDelay(duration: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, duration));
  }

  private static executeTransform(node: WorkflowNode, context: Record<string, any>): any {
    const transformations = node.data.transformations || [];
    const newContext = { ...context };

    transformations.forEach((transform: any) => {
      const value = this.getValueFromContext(transform.sourceField, context);
      this.setValueInContext(transform.targetField, this.applyTransformation(value, transform.operation), newContext);
    });

    return newContext;
  }

  private static executeNextNode(node: WorkflowNode, workflow: Workflow, context: Record<string, any>): any {
    const connection = workflow.connections.find(c => c.source === node.id);
    if (connection) {
      const nextNode = workflow.nodes.find(n => n.id === connection.target);
      if (nextNode) {
        return this.executeNode(nextNode, workflow, context);
      }
    }
    return context;
  }

  private static interpolateData(data: any, context: Record<string, any>): any {
    if (typeof data === 'string') {
      return data.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, path) => {
        return this.getValueFromContext(path, context) || match;
      });
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.interpolateData(item, context));
    }
    
    if (typeof data === 'object' && data !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(data)) {
        result[key] = this.interpolateData(value, context);
      }
      return result;
    }
    
    return data;
  }

  private static getValueFromContext(path: string, context: Record<string, any>): any {
    return path.split('.').reduce((obj, key) => obj?.[key], context);
  }

  private static setValueInContext(path: string, value: any, context: Record<string, any>): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((obj, key) => {
      if (!obj[key]) obj[key] = {};
      return obj[key];
    }, context);
    target[lastKey] = value;
  }

  private static applyTransformation(value: any, operation: string): any {
    switch (operation) {
      case 'uppercase':
        return String(value).toUpperCase();
      case 'lowercase':
        return String(value).toLowerCase();
      case 'trim':
        return String(value).trim();
      case 'number':
        return Number(value);
      case 'string':
        return String(value);
      default:
        return value;
    }
  }

  static logApiCall(call: ApiCall): void {
    const calls = this.getApiCalls();
    calls.unshift(call);
    
    // Keep only last 1000 calls
    if (calls.length > 1000) {
      calls.splice(1000);
    }
    
    localStorage.setItem(this.API_CALLS_KEY, JSON.stringify(calls));
  }

  static getApiCalls(): ApiCall[] {
    try {
      const stored = localStorage.getItem(this.API_CALLS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static getApiMetrics(apiUrl?: string): ApiMetrics {
    const calls = this.getApiCalls();
    const filteredCalls = apiUrl ? calls.filter(c => c.url === apiUrl) : calls;
    
    if (filteredCalls.length === 0) {
      return {
        totalRequests: 0,
        successRate: 0,
        averageResponseTime: 0,
        errorRate: 0,
      };
    }

    const successfulCalls = filteredCalls.filter(c => c.status >= 200 && c.status < 300);
    const errorCalls = filteredCalls.filter(c => c.status >= 400 || c.error);
    const lastError = errorCalls[0];

    return {
      totalRequests: filteredCalls.length,
      successRate: (successfulCalls.length / filteredCalls.length) * 100,
      averageResponseTime: filteredCalls.reduce((sum, c) => sum + c.responseTime, 0) / filteredCalls.length,
      errorRate: (errorCalls.length / filteredCalls.length) * 100,
      lastError: lastError ? {
        timestamp: lastError.timestamp,
        status: lastError.status,
        message: lastError.error || `HTTP ${lastError.status}`,
      } : undefined,
    };
  }

  static clearApiCallsLog(): void {
    localStorage.removeItem(this.API_CALLS_KEY);
  }
}
