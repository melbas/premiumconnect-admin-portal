
import { 
  Chart as ChartJS, 
  LineController, 
  LineElement, 
  PointElement, 
  LinearScale, 
  CategoryScale, 
  Tooltip, 
  Legend,
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  Title
} from 'chart.js';

// Register Chart.js components
export const registerChartComponents = () => {
  ChartJS.register(
    LineController, 
    LineElement, 
    PointElement, 
    LinearScale, 
    CategoryScale, 
    Tooltip, 
    Legend,
    BarController,
    BarElement,
    DoughnutController,
    ArcElement,
    Title
  );
};

// Call this function to register all chart components
registerChartComponents();
