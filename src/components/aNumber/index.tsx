import { CSSProperties } from 'react'
import './index.scss'

type Sn = string | number

type Props = {
  activeKey: string
  active: Sn
  dataSource: object[]
  max?: number
  min?: number
  onAdd: () => void
  onDel: () => void
  onChange: (Sn) => void
  style?: CSSProperties
  activeStyle?: CSSProperties
}

/**
 * @param activeKey 'index'|string 匹配active的key值
 * @param active string | number 当前选中的值
 * @param dataSource object[] 数据源
 * @param max number 非必填
 * @param min number 非必填
 * @param onAdd () => void
 * @param onDel () => void
 * @param onChange string | number => void
 */
export default function ANumber(props: Props) {
  const add = () => {
    if ('max' in props) {
      if (props.dataSource.length < props.max) {
        props.onAdd()
      }
    } else {
      props.onAdd()
    }
  }
  const del = () => {
    if ('min' in props) {
      if (props.min >= 0 && props.dataSource.length > props.min) {
        props.onDel()
      }
    } else {
      if (props.dataSource.length > 0) {
        props.onDel()
      }
    }
  }
  return (
    <div className='a-number'>
      {props.dataSource.length > 0 && (
        <div
          className={`handle-btn ${
            props.dataSource.length <= props.min ? 'disable' : ''
          }`}
          onClick={del}
          style={{ ...props.style }}>
          -
        </div>
      )}
      {props.dataSource.map((item, index) => {
        let activeStyle =
          props.activeKey == 'index'
            ? props.active == index
              ? props.activeStyle
              : {}
            : item[props.activeKey] == props.active
            ? props.activeStyle
            : {}

        return (
          <div
            className={`handle-btn ${
              props.activeKey == 'index'
                ? props.active == index
                  ? 'active'
                  : ''
                : item[props.activeKey] == props.active
                ? 'active'
                : ''
            }`}
            key={props.activeKey == 'index' ? index : item[props.activeKey]}
            onClick={() =>
              props.onChange(
                props.activeKey == 'index' ? index : item[props.activeKey],
              )
            }
            style={{ ...props.style, ...activeStyle }}>
            {index + 1}
          </div>
        )
      })}
      <div
        className={`handle-btn ${
          props.max && props.dataSource.length >= props.max ? 'disable' : ''
        }`}
        onClick={add}
        style={{ ...props.style }}>
        +
      </div>
    </div>
  )
}
