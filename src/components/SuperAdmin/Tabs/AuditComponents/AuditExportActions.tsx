
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText } from 'lucide-react';

interface AuditExportActionsProps {
  onExport: (format: 'csv' | 'json' | 'pdf') => void;
}

const AuditExportActions: React.FC<AuditExportActionsProps> = ({ onExport }) => {
  return (
    <>
      <div className="flex gap-2 mt-4 sm:mt-0">
        <Button onClick={() => onExport('csv')} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          CSV
        </Button>
        <Button onClick={() => onExport('json')} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          JSON
        </Button>
        <Button onClick={() => onExport('pdf')} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration des Exports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button onClick={() => onExport('csv')} className="h-20 flex-col">
                <FileText className="w-8 h-8 mb-2" />
                Export CSV
              </Button>
              <Button onClick={() => onExport('json')} className="h-20 flex-col" variant="outline">
                <FileText className="w-8 h-8 mb-2" />
                Export JSON
              </Button>
              <Button onClick={() => onExport('pdf')} className="h-20 flex-col" variant="outline">
                <FileText className="w-8 h-8 mb-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AuditExportActions;
