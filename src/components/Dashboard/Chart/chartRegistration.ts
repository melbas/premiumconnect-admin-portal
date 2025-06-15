
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  LineController,
  BarController,
  DoughnutController,
  PieController
} from 'chart.js';

// Enregistrer tous les composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  LineController,
  BarController,
  DoughnutController,
  PieController
);

export { ChartJS };
