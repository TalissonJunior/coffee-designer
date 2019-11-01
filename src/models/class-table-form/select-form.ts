export interface SelectForm {
  label: string;
  initialValue: string;
  form: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  key?: string;
  options: (
    selectOptions: d3.Selection<
      d3.BaseType,
      unknown,
      HTMLSelectElement,
      unknown
    >
  ) => void;
  onValueChange?: (value: string, element: HTMLSelectElement) => void;
}
