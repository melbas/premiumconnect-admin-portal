
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { eventTrackingService, EventType } from '@/services/eventTrackingService';

const EventsTable: React.FC = () => {
  const [eventType, setEventType] = useState<EventType>('page_view');
  const [searchQuery, setSearchQuery] = useState('');
  const [limit, setLimit] = useState(50);

  // Fetch events
  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ['events', eventType, limit],
    queryFn: () => eventTrackingService.getEventsByType(eventType, limit),
  });

  // Filter events by search query
  const filteredEvents = events ? events.filter(event => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      event.event_name.toLowerCase().includes(query) ||
      (event.event_data && JSON.stringify(event.event_data).toLowerCase().includes(query))
    );
  }) : [];

  // Format timestamp
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal des événements</CardTitle>
        <CardDescription>
          Consultez les événements enregistrés par type
        </CardDescription>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex flex-1 items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex space-x-2">
            <Select value={eventType} onValueChange={(value) => setEventType(value as EventType)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type d'événement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="page_view">Pages vues</SelectItem>
                <SelectItem value="game">Jeux</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="auth">Authentification</SelectItem>
                <SelectItem value="purchase">Achats</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => refetch()}>
              Actualiser
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-full h-12" />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Événement</th>
                  <th className="text-left py-3 px-4">Utilisateur</th>
                  <th className="text-left py-3 px-4">Données</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b">
                    <td className="py-3 px-4">{formatDate(event.created_at)}</td>
                    <td className="py-3 px-4">{event.event_name}</td>
                    <td className="py-3 px-4">{event.user_id ? event.user_id.substring(0, 8) + '...' : 'Anonyme'}</td>
                    <td className="py-3 px-4">
                      <div className="max-w-sm truncate">
                        {event.event_data ? JSON.stringify(event.event_data).substring(0, 50) + '...' : 'Aucune donnée'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => setLimit(prev => prev + 50)}
                disabled={events?.length < limit}
              >
                Charger plus
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            {searchQuery ? (
              <p>Aucun événement trouvé pour cette recherche</p>
            ) : (
              <p>Aucun événement de type "{eventType}" enregistré</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventsTable;
