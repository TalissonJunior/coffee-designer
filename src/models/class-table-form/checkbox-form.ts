export interface CheckboxForm {
  label: string;
  initialValueChecked: boolean;
  form: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  onValueChange?: (value?: boolean, element?: HTMLInputElement) => void;
}
