export interface InputForm {
  label: string;
  initialValue: string;
  key?: string;
  form: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  onValueChange?: (value?: string, element?: HTMLElement) => void;
}
