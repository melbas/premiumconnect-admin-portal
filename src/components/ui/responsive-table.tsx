
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

interface ResponsiveTableRowProps {
  children: React.ReactNode;
  className?: string;
  mobileLayout?: React.ReactNode;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({ 
  children, 
  className, 
  title, 
  description 
}) => {
  const isMobile = useIsMobile();

  if (title) {
    return (
      <Card className={cn("animate-fade-in", className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </CardHeader>
        <CardContent>
          <div className={cn(
            "overflow-x-auto",
            isMobile && "rounded-md border"
          )}>
            <Table className="relative w-full">
              {children}
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn(
      "overflow-x-auto animate-fade-in",
      isMobile && "rounded-md border",
      className
    )}>
      <Table className="relative w-full">
        {children}
      </Table>
    </div>
  );
};

export const ResponsiveTableRow: React.FC<ResponsiveTableRowProps> = ({ 
  children, 
  className, 
  mobileLayout 
}) => {
  const isMobile = useIsMobile();

  if (isMobile && mobileLayout) {
    return (
      <TableRow className={cn("hover:bg-muted/50 transition-colors", className)}>
        <TableCell colSpan={100} className="p-4">
          {mobileLayout}
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow className={cn("hover:bg-muted/50 transition-colors", className)}>
      {children}
    </TableRow>
  );
};

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };
