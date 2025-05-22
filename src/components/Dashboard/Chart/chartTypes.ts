
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    tension?: number;
    fill?: boolean;
    pointBackgroundColor?: string;
    pointBorderColor?: string;
    pointHoverBackgroundColor?: string;
    pointHoverBorderColor?: string;
    hoverOffset?: number;
  }>;
}

export interface ChartComponentProps {
  type: 'line' | 'bar' | 'doughnut';
  data: ChartData;
  options?: any;
  height?: number;
}
