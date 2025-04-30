
import React, { useState, ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  itemsPerPage?: number;
  searchable?: boolean;
  searchKey?: keyof T;
}

function Table<T>({ 
  columns, 
  data, 
  keyExtractor, 
  itemsPerPage = 10,
  searchable = false,
  searchKey
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter data based on search term
  const filteredData = searchable && searchKey && searchTerm
    ? data.filter(item => {
        const value = item[searchKey];
        return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    : data;
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  
  // Handle page change
  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Get cell value based on accessor
  const getCellValue = (item: T, accessor: keyof T | ((item: T) => ReactNode)): ReactNode => {
    if (typeof accessor === 'function') {
      return accessor(item);
    }
    return item[accessor] as ReactNode;
  };

  return (
    <div className="w-full">
      {searchable && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="input-search"
          />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="dashboard-table">
          <thead className="bg-muted/40">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className={column.className}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map(item => (
                <tr key={keyExtractor(item)}>
                  {columns.map((column, index) => (
                    <td key={index} className={column.className}>
                      {getCellValue(item, column.accessor)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-border bg-card disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-border bg-card disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
