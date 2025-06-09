
import { useState, useEffect } from 'react';
import { ThemeService } from '@/services/themeService';
import { WorkflowService } from '@/services/workflowService';
import { ThemeJson } from '@/types/theme';
import { Workflow, ApiMetrics } from '@/types/workflow';
import { defaultThemes } from '@/data/defaultThemes';

export const useAdvancedPortalConfig = () => {
  const [themes, setThemes] = useState<ThemeJson[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [apiMetrics, setApiMetrics] = useState<ApiMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    
    try {
      // Load themes
      let storedThemes = ThemeService.getStoredThemes();
      
      // If no themes exist, load defaults
      if (storedThemes.length === 0) {
        defaultThemes.forEach(theme => ThemeService.saveTheme(theme));
        storedThemes = ThemeService.getStoredThemes();
      }
      
      setThemes(storedThemes);
      
      // Load API metrics
      const metrics = WorkflowService.getApiMetrics();
      setApiMetrics(metrics);
      
      console.log('✅ Advanced portal config loaded');
    } catch (error) {
      console.error('❌ Failed to load advanced portal config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshMetrics = () => {
    const metrics = WorkflowService.getApiMetrics();
    setApiMetrics(metrics);
  };

  const applyTheme = (theme: ThemeJson) => {
    ThemeService.applyTheme(theme);
  };

  const exportTheme = (theme: ThemeJson) => {
    ThemeService.exportTheme(theme);
  };

  const importTheme = async (file: File) => {
    const result = await ThemeService.importTheme(file);
    if (result.success && result.theme) {
      ThemeService.saveTheme(result.theme);
      setThemes(ThemeService.getStoredThemes());
    }
    return result;
  };

  return {
    themes,
    workflows,
    apiMetrics,
    isLoading,
    loadData,
    refreshMetrics,
    applyTheme,
    exportTheme,
    importTheme,
  };
};
