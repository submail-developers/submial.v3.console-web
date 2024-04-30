// 素材审核状态  0=通过,1=驳回,8=我方通过,9=我方审核
export enum EnumMediaStatusText {
  '通过' = 0,
  '驳回' = 1,
  '审核中 ' = 8,
  '审核中' = 9,
}
export enum EnumMediaStatusColor {
  'success-color' = 0,
  'error-color' = 1,
  'waiting-color' = 8,
  'warning-color' = 9,
}
export enum EnumMediaStatusBadge {
  'color-status-success' = 0,
  'color-status-error' = 1,
  'color-status-waiting' = 8,
  'color-status-warning' = 9,
}
export enum EnumMediaStatusIcon {
  'icon-yes' = 0,
  'icon-no' = 1,
  'icon-time' = 8,
  'icon-dengpao' = 9,
}
