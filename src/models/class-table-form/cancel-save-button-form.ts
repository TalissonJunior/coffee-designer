export interface CancelSaveButtonForm {
  cancelButtonLabel: string;
  cancelButtonClass?: string;
  cancelButtonOnClick?: () => void;
  saveButtonLabel: string;
  saveButtonClass?: string;
  saveButtonOnClick?: () => void;
  form: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
}
