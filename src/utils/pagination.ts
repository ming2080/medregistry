/**
 * 表格分页通用工具，与科室各管理视图已有的分页写法保持一致：
 * 按页切片、总页数至少为 1、页码窗口超过 7 页时收起为省略号。
 */

/** 总页数，记录为 0 时仍返回 1，保证“第 1 / 1 页”正常显示。 */
export function getTotalPages(totalRecords: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalRecords / pageSize));
}

/** 取出当前页应显示的记录切片。 */
export function paginateRows<T>(rows: T[], currentPage: number, pageSize: number): T[] {
  const start = (currentPage - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}

/**
 * 页码窗口：总页数不超过 7 页时全部列出；
 * 超过 7 页时只保留首页、当前页前后一页、末页，其余位置用省略号代替。
 */
export function getPageNumbers(
  currentPage: number,
  totalPages: number
): Array<number | '…'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: Array<number | '…'> = [1];
  if (currentPage > 3) {
    pages.push('…');
  }
  for (
    let p = Math.max(2, currentPage - 1);
    p <= Math.min(totalPages - 1, currentPage + 1);
    p++
  ) {
    pages.push(p);
  }
  if (currentPage < totalPages - 2) {
    pages.push('…');
  }
  pages.push(totalPages);
  return pages;
}
