
// Mock issues data
export const issues = [
  {
    id: '1',
    siteId: '1',
    title: 'Connexion intermittente',
    description: 'Les utilisateurs signalent des déconnexions fréquentes',
    severity: 'high',
    status: 'open',
    reportedDate: '2023-03-18T09:30:00',
    assignedTo: '3'
  },
  {
    id: '2',
    siteId: '2',
    title: 'Bande passante réduite',
    description: 'Vitesse réduite pendant les heures de pointe',
    severity: 'medium',
    status: 'in-progress',
    reportedDate: '2023-03-15T14:20:00',
    assignedTo: '5'
  },
  {
    id: '3',
    siteId: '3',
    title: 'Problème de routeur',
    description: 'Le routeur principal doit être redémarré manuellement',
    severity: 'low',
    status: 'resolved',
    reportedDate: '2023-03-10T11:45:00',
    assignedTo: '3'
  },
  {
    id: '4',
    siteId: '4',
    title: 'Panne électrique',
    description: 'Site hors ligne en raison d\'une panne électrique prolongée',
    severity: 'critical',
    status: 'open',
    reportedDate: '2023-03-19T08:15:00',
    assignedTo: null
  },
  {
    id: '5',
    siteId: '5',
    title: 'Problème de DNS',
    description: 'Résolution DNS intermittente pour certains sites',
    severity: 'medium',
    status: 'in-progress',
    reportedDate: '2023-03-17T16:30:00',
    assignedTo: '5'
  }
];
