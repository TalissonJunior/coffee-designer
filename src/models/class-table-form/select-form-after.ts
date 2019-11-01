export interface SelectFormAfter{ 
    label: string;
    initialValue: string;
    after: d3.Selection<HTMLElement, unknown, HTMLElement, any>;
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