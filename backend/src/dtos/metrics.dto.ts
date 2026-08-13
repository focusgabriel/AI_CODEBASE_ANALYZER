export interface MetricDto {
  imports: number;
  exports: number;
  functions: number;
  classes: number;
  interfaces: number;

  totalLines: number;
  codeLines: number;
  commentLines: number;
  blankLines: number;
}