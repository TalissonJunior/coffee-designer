export class InputFormAfter {
  label: string;
  initialValue: string;
  after: d3.Selection<HTMLElement, unknown, HTMLElement, any>;
  key?: string;
  onValueChange?: (value?: string, element?: HTMLElement) => void;
}
