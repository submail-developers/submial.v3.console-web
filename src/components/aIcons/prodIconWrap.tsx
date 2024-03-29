import { CSSProperties, ReactNode } from 'react'
type IconProps = {
  children: ReactNode
  extClass?: string
  style?: CSSProperties
}

const defaultStyle: CSSProperties = {
  fontSize: '38px',
  width: '56px',
  height: '56px',
  color: '#fff',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

/**
 * 产品Icon
 * @param children ReactNode aIcons中的icon
 * @param extClass string className
 * @param style CSSProperties 样式
 */
export default function ProdIcon(props: IconProps) {
  return (
    <div
      className={`prod-icon ${props.extClass}`}
      style={{ ...defaultStyle, ...props.style }}>
      {props.children}
    </div>
  )
}
