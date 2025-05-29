
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChartComponent } from '@/components/Dashboard/Chart';
import { Skeleton } from '@/components/ui/skeleton';

// Simulated data - in a real application, this would come from the database
const generateMockHeatmapData = () => {
  // Days of week
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  
  // Generate data for each day
  const datasets = days.map((day, dayIndex) => {
    const data = Array.from({ length: 24 }, (_, hour) => {
      // Higher activity during daytime hours (8-22)
      const baseActivity = hour >= 8 && hour <= 22 ? 20 : 5;
      // Add some randomness
      const randomVariation = Math.floor(Math.random() * 30);
      return baseActivity + randomVariation;
    });
    
    return {
      label: day,
      data,
      backgroundColor: `rgba(59, 130, 246, ${0.3 + (dayIndex * 0.1)})`,
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1
    };
  });
  
  return {
    labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
    datasets
  };
};

const UserActivityHeatmap: React.FC = () => {
  // In a real application, this data would be fetched from the API
  // const { data, isLoading } = useQuery({
  //   queryKey: ['userActivityHeatmap'],
  //   queryFn: () => fetchUserActivityHeatmap(),
  // });
  
  // For demonstration, we'll use simulated data
  const data = generateMockHeatmapData();
  const isLoading = false;
  
  // Configure the chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Heure de la journée'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Nombre de connexions'
        },
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const
      },
      tooltip: {
        callbacks: {
          title: function(context: any) {
            const hour = context[0].label;
            const day = context[0].dataset.label;
            return `${day} à ${hour}`;
          },
          label: function(context: any) {
            return `${context.parsed.y} connexions`;
          }
        }
      }
    }
  };
  
  return isLoading ? (
    <Skeleton className="w-full h-full" />
  ) : (
    <div id="user-activity-heatmap" className="w-full h-full">
      <ChartComponent
        type="bar"
        data={data}
        options={chartOptions}
        height={350}
      />
    </div>
  );
};

export default UserActivityHeatmap;
