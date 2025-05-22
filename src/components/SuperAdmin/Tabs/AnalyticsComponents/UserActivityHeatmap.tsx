
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChartComponent } from '@/components/Dashboard/Chart';
import { Skeleton } from '@/components/ui/skeleton';

// Simulated data - in a real application, this would come from the database
const generateMockHeatmapData = () => {
  // Days of week
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  
  // Hours of day
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Generate random data for each day/hour combination
  const datasets = days.map((day, index) => {
    return {
      label: day,
      data: hours.map(hour => ({
        x: hour,
        y: index,
        v: Math.floor(Math.random() * 50) + (hour >= 8 && hour <= 22 ? 20 : 0)
      }))
    };
  });
  
  return {
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
  
  // Configure the chart
  const chartConfig = {
    type: 'matrix',
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          min: 0,
          max: 23,
          ticks: {
            stepSize: 1,
            callback: function(value) {
              return `${value}h`;
            }
          },
          title: {
            display: true,
            text: 'Heure de la journée'
          }
        },
        y: {
          type: 'category',
          labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
          offset: true,
          title: {
            display: true,
            text: 'Jour de la semaine'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            title: function(context) {
              const day = context[0].dataset.label;
              const hour = context[0].parsed.x;
              return `${day} à ${hour}h`;
            },
            label: function(context) {
              return `${context.raw.v} connexions`;
            }
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
        type="matrix"
        data={data}
        options={chartConfig.options}
        height={350}
      />
    </div>
  );
};

export default UserActivityHeatmap;
