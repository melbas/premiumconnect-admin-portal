
export class ExportService {
  exportToCSV(logs: any[]): Blob {
    const headers = ['Date', 'Utilisateur', 'Action', 'Description', 'Entité', 'Criticité'];
    const csvContent = [
      headers.join(','),
      ...logs.map(log => [
        new Date(log.created_at).toLocaleString(),
        log.admin_user_id,
        log.action_type,
        `"${log.action_description}"`,
        log.target_entity || '',
        log.criticality
      ].join(','))
    ].join('\n');

    return new Blob([csvContent], { type: 'text/csv' });
  }

  exportToJSON(logs: any[]): Blob {
    return new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
  }

  exportToPDF(logs: any[]): Blob {
    // Implémentation basique pour PDF (nécessiterait une lib comme jsPDF)
    const content = logs.map(log => 
      `${new Date(log.created_at).toLocaleString()} - ${log.action_description}`
    ).join('\n');
    
    return new Blob([content], { type: 'text/plain' });
  }
}
