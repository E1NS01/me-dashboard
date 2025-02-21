import { ChangeEvent } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  goToSite: number;
  onPageNavigationChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPageNavigationSubmit: () => void;
}

export const TablePagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  goToSite,
  onPageNavigationChange,
  onPageNavigationSubmit,
}: TablePaginationProps) => {
  const getVisiblePages = () => {
    let pages = [];
    // Show fewer pages on mobile
    const isMobile = window.innerWidth < 640;

    if (isMobile) {
      // Simplified mobile view: current page and immediate neighbors
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages, currentPage + 1);

      if (start > 1) pages.push(1, -1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages) pages.push(-2, totalPages);
    } else {
      // Desktop view remains the same
      const showEllipsisStart = currentPage > 4;
      const showEllipsisEnd = currentPage < totalPages - 3;

      if (totalPages <= 7) {
        pages = Array.from({ length: totalPages }, (_, i) => i + 1);
      } else {
        pages.push(1);
        if (showEllipsisStart) pages.push(-1);

        for (
          let i = Math.max(2, currentPage - 1);
          i <= Math.min(totalPages - 1, currentPage + 1);
          i++
        ) {
          pages.push(i);
        }

        if (showEllipsisEnd) pages.push(-2);
        if (totalPages > 1) pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <Pagination>
        <PaginationContent className="flex flex-wrap justify-center gap-1">
          <PaginationItem>
            <PaginationPrevious
              className="cursor-pointer h-8 sm:h-10"
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              aria-disabled={currentPage === 1}
            />
          </PaginationItem>

          {getVisiblePages().map((pageNum, index) => (
            <PaginationItem key={index}>
              {pageNum < 0 ? (
                <PaginationEllipsis />
              ) : (
                <Button
                  variant={pageNum === currentPage ? "default" : "outline"}
                  onClick={() => setCurrentPage(pageNum)}
                  className="h-8 sm:h-10 min-w-[32px] sm:min-w-[40px] px-2 sm:px-3"
                >
                  {pageNum}
                </Button>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              className="cursor-pointer h-8 sm:h-10"
              onClick={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages))
              }
              aria-disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="flex items-center gap-2">
        <Input
          className="w-16 sm:w-20 h-8 sm:h-10"
          type="number"
          min={1}
          max={totalPages}
          value={goToSite || ""}
          onChange={onPageNavigationChange}
          placeholder="Page"
        />
        <Button onClick={onPageNavigationSubmit} className="h-8 sm:h-10">
          Go
        </Button>
      </div>
    </div>
  );
};
