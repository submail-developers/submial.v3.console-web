/**
 * 全局重置antd的样式
 * https://ant.design/docs/react/customize-theme-cn#seedtoken
 * */
export default {
  // colorPrimary: 'var(--primary-color)',
  colorPrimary: '#1764ff',
  // colorPrimaryBg: '#ebf2fe',
  colorText: '#282b31',
  // colorLink: 'var(--primary-color)', // 控制超链接的颜色。
  colorLink: '#1764ff', // 控制超链接的颜色。
  colorError: '#D53A3D',
  // colorLinkActive: '#006db6', // 控制超链接被点击时的颜色。
  // colorLinkHover: '#006db6', // 控制超链接悬浮时的颜色。
  // controlItemBgHover: '#f4f6f8',
  // colorTextPlaceholder: '#bbbbbb',
  // colorTextQuaternary: '#d6d7d9', // 第四级文本色是最浅的文本色，例如表单的输入提示文本、禁用色文本等。
  // colorTextTertiary: '#d6d7d9', // 第三级文本色一般用于描述性文本，例如表单的中的补充说明文本、列表的描述性文本等场景。
  // controlHeight: 40,
  controlHeightLG: 40,
  borderRadius: 4, // 基础组件的圆角大小，例如按钮、输入框、卡片等
  // fontSizeLG: 14, // 大号字体大小
  // fontSizeSM: 12, // 大号字体大小
}

export const components = {
  Select: {
    selectorBg: '#ECEFF2',
    optionSelectedColor: '#3062F5',
  },
  Form: {
    labelColor: '#666d7a',
  },
}
