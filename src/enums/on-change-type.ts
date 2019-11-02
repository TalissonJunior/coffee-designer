export enum OnChangeType {
  // Emit on any change
  change = 'change',
  // Emit on class/table delete
  delete = 'delete',
  // Emit on class/table change
  changeName = 'change:name',
  // Emit on property change
  changeProperty = 'change:property',
  // Emit on position change
  changePosition = 'change:position'
}
