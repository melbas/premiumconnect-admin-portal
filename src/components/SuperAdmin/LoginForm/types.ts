
export interface LoginFormData {
  email: string;
  password: string;
  showPassword: boolean;
  isLoading: boolean;
  activeTab: 'quick' | 'credentials';
}
