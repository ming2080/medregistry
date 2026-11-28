/**
 * 统计分析页「重点指标分布」条形图的纯数据推导工具。
 *
 * 旧实现用 `count * 2.5`（截断到 10%~100%）当条形宽度，且没有计数字段的行
 * 会凭空得到 `10 / 8.5 / 7 …` 这样的编造数字。本工具改为真实比例：
 * 条形宽度 = 该行数量 / 展示行中的最大数量，行按数量降序排列；
 * 没有数值型计数字段的行不参与绘图，而不是编造一个数字。
 */

export interface DistributionBar {
  /** 条形标签：项目 / 患者 / 标本 / 科室名 */
  name: string;
  /** 原始计数值 */
  count: number;
  /** 条形宽度百分比（相对展示行中的最大值，0~100） */
  pct: number;
  /** 该行数量占展示行数量总和的份额（0~1），用于显示占比 */
  share: number;
}

const NAME_FIELDS = [
  'name',
  'patientName',
  'sampleName',
  'dept',
  'department',
  'project',
] as const;

/** 从一行数据里取第一个可用的数值型计数字段，取不到返回 null */
const pickCount = (
  row: Record<string, unknown>,
  countFields: readonly string[],
): number | null => {
  for (const field of countFields) {
    const value = row[field];
    if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
      return value;
    }
  }
  return null;
};

const pickName = (row: Record<string, unknown>, fallbackIndex: number): string => {
  for (const field of NAME_FIELDS) {
    const value = row[field];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }
  return `项目-${fallbackIndex + 1}`;
};

/**
 * 由筛选后的表格行推导分布条形图数据。
 * @param rows 筛选后的当前分类行
 * @param countFields 按优先级排列的计数字段名
 * @param limit 最多展示的条数，默认 5
 */
export const buildDistributionBars = (
  rows: Array<Record<string, unknown>>,
  countFields: readonly string[],
  limit = 5,
): DistributionBar[] => {
  const bars: DistributionBar[] = rows
    .map((row, index) => {
      const count = pickCount(row, countFields);
      if (count === null) return null;
      return { name: pickName(row, index), count };
    })
    .filter((bar): bar is { name: string; count: number } => bar !== null)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map(({ name, count }) => ({ name, count, pct: 0, share: 0 }));

  if (bars.length === 0) return bars;

  const maxCount = bars[0].count;
  const total = bars.reduce((sum, bar) => sum + bar.count, 0);
  return bars.map((bar) => ({
    ...bar,
    pct: maxCount > 0 ? Math.round((bar.count / maxCount) * 100) : 0,
    share: total > 0 ? bar.count / total : 0,
  }));
};
