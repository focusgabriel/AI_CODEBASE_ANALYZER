import { MetricDto } from "../dtos/metrics.dto.js";

export function aggregateMetrics(
  metrics: MetricDto[],
): MetricDto {
  return metrics.reduce(
    (total, metric) => {
      total.imports += metric.imports ?? 0;
      total.exports += metric.exports ?? 0;
      total.functions += metric.functions ?? 0;
      total.classes += metric.classes ?? 0;
      total.interfaces += metric.interfaces ?? 0;

      total.totalLines += metric.totalLines ?? 0;
      total.codeLines += metric.codeLines ?? 0;
      total.commentLines += metric.commentLines ?? 0;
      total.blankLines += metric.blankLines ?? 0;

      return total;
    },
    {
      imports: 0,
      exports: 0,
      functions: 0,
      classes: 0,
      interfaces: 0,

      totalLines: 0,
      codeLines: 0,
      commentLines: 0,
      blankLines: 0,
    },
  );
}