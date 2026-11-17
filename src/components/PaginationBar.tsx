import React from 'react';
import { ChevronLeft, ChevronRight } from './MenuIcon';
import { getPageNumbers } from '../utils/pagination';

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * 通用分页条：上一页 / 页码按钮（含省略号收起）/ 下一页，
 * 样式与科室各管理视图的分页条保持一致。
 */
export const PaginationBar: React.FC<PaginationBarProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none rounded text-xs text-slate-700"
        title="上一页"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {getPageNumbers(currentPage, totalPages).map((p, idx) =>
        p === '…' ? (
          <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 text-xs">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`min-w-[28px] h-7 px-2 rounded text-xs font-mono font-bold transition-colors ${
              p === currentPage
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none rounded text-xs text-slate-700"
        title="下一页"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
