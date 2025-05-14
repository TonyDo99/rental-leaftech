'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const displayPages = pages.slice(
    Math.max(0, Math.min(currentPage - 3, totalPages - 5)),
    Math.min(totalPages, Math.max(5, currentPage + 2))
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {displayPages[0] > 1 && (
        <>
          <Button
            variant={currentPage === 1 ? 'default' : 'outline'}
            size="icon"
            className="cursor-pointer h-8 w-8 rounded-full"
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          {displayPages[0] > 2 && (
            <span className="px-2 text-muted-foreground">...</span>
          )}
        </>
      )}

      {displayPages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? 'default' : 'outline'}
          size="icon"
          className="cursor-pointer h-8 w-8 rounded-full"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {displayPages[displayPages.length - 1] < totalPages && (
        <>
          {displayPages[displayPages.length - 1] < totalPages - 1 && (
            <span className="px-2 text-muted-foreground">...</span>
          )}
          <Button
            variant={currentPage === totalPages ? 'default' : 'outline'}
            size="icon"
            className="cursor-pointer h-8 w-8 rounded-full"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="icon"
        className="cursor-pointer h-8 w-8 rounded-full"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
