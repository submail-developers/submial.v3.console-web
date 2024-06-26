import Icon from '@ant-design/icons'
import type { GetProps } from 'antd'
import { fill } from 'lodash'
type CustomIconComponentProps = GetProps<typeof Icon>

/**
 * svg自定义icon
 */

const TableSvg = () => (
  <svg width='1em' height='1em' fill='currentColor' viewBox='0 0 200 200'>
    <path d='M0,14.44C0,6.67,6.67,0,14.44,0h58.89c8.89,0,15.56,6.67,15.56,14.44v58.89c0,8.89-6.67,15.56-14.44,15.56H14.44c-7.78,0-14.44-6.67-14.44-14.44V14.44ZM0,125.56c0-7.78,6.67-14.44,14.44-14.44h58.89c8.89,0,15.56,6.67,15.56,14.44v58.89c0,8.89-6.67,15.56-14.44,15.56H14.44c-7.78,0-14.44-6.67-14.44-14.44v-60ZM111.11,14.44c0-7.78,6.67-14.44,14.44-14.44h58.89c8.89,0,15.56,6.67,15.56,14.44v58.89c0,8.89-6.67,15.56-14.44,15.56h-58.89c-8.89,0-15.56-6.67-15.56-14.44V14.44ZM111.11,125.56c0-7.78,6.67-14.44,14.44-14.44h58.89c7.78,0,14.44,6.67,14.44,14.44v58.89c0,7.78-6.67,14.44-14.44,14.44h-58.89c-7.78,0-14.44-6.67-14.44-14.44v-58.89Z' />
  </svg>
)

const CircleSvg = () => (
  <svg width='1em' height='1em' fill='currentColor' viewBox='0 0 200 200'>
    <path d='M100,20c44.11,0,80,35.89,80,80s-35.89,80-80,80S20,144.11,20,100,55.89,20,100,20M100,0C44.77,0,0,44.77,0,100s44.77,100,100,100,100-44.77,100-100S155.23,0,100,0h0Z' />
    <circle cx='100' cy='100' r='55' />
  </svg>
)

const IDSvg = () => (
  <svg width='1em' height='1em' fill='none' viewBox='0 0 44 44'>
    <circle cx='22' cy='22' r='20.75' stroke='currentColor' strokeWidth='3' />
    <path
      d='M11.82 12.436H14.862V31H11.82V12.436ZM18.4977 12.436H25.2837C28.2997 12.436 30.5617 13.268 32.1217 14.932C33.6037 16.492 34.3577 18.754 34.3577 21.718C34.3577 24.656 33.6037 26.918 32.1217 28.504C30.5617 30.168 28.2997 31 25.2837 31H18.4977V12.436ZM21.5397 15.036V28.4H24.7117C27.0257 28.4 28.7157 27.854 29.7817 26.788C30.8217 25.696 31.3417 24.006 31.3417 21.718C31.3417 19.378 30.8217 17.662 29.7817 16.622C28.7157 15.556 27.0257 15.036 24.7117 15.036H21.5397Z'
      fill='currentColor'
    />
  </svg>
)

const MsgSvg = () => (
  <svg
    width='1em'
    height='1em'
    version='1.1'
    x='0px'
    y='0px'
    fill='currentColor'
    viewBox='0 0 30 30'>
    <path
      d='M7.7,24.9c-1.4,0.5-2.8,0.9-4.5,1.5c0.2-0.9,0.3-1.6,0.5-2.2c0.2-0.7,0.4-1.3,0.6-2c-0.4-0.7-0.8-1.3-1.1-2
                                                c-2.2-4-1.8-8.4,1.1-12c5.2-6.4,16-6.4,21.3-0.1c3.5,4.2,3.4,10-0.2,14.1c-3.6,4-9.7,5.6-15.1,3.7C9.5,25.6,8.7,25.3,7.7,24.9z'
    />
  </svg>
)

const IntersmsSvg = () => (
  <svg
    version='1.1'
    x='0px'
    y='0px'
    fill='currentColor'
    width='1em'
    height='1em'
    viewBox='0 0 30 30'>
    <g>
      <path d='M19.9,18.3h-0.2C19.7,18.3,19.8,18.4,19.9,18.3z' />
      <path
        d='M27.4,0.6L15.5,0.5c-1.1,0-2,0.8-2.2,1.8C7,3.1,2.1,8.5,2.1,15.1c0,7.2,5.8,13,13,13c7.1,0,13-5.8,13-13
                                                            c0-1.1-0.2-2.3-0.4-3.3c1.1-0.1,2-1,2-2.2V2.8C29.5,1.6,28.6,0.6,27.4,0.6z M13.3,4.7C13.2,4.7,13.2,4.7,13.3,4.7
                                                            c0-0.1,0-0.1,0-0.1V4.7z M12.8,3.9L12.8,3.9c0.1,0,0.3,0,0.4-0.1v0.4c0,0-0.1,0-0.1,0c-0.2,0.1-0.4,0.4-0.6,0.2
                                                            C12.3,4.2,12.7,3.9,12.8,3.9z M12,14.7c0.2,0.3,0.5,0.5,0.8,0.4c0.3-0.1,0.4-0.5,0.7-0.5c0.5,0,0,0.5,0,0.8
                                                            c-0.1,0.2,0.1,0.2,0.2,0.2c0.2,0,0.4-0.1,0.5,0c0.1,0.1,0.1,0.3,0.2,0.2c-0.2,0.2-0.2,0.6,0.1,0.8c-0.2,0-0.4-0.2-0.5-0.3
                                                            c-0.2-0.2-0.3-0.4-0.5-0.5c-0.2-0.2-0.3-0.1-0.5-0.1c-0.2-0.1-0.3-0.3-0.5-0.4c-0.2-0.2-0.4,0.1-0.6,0c-0.2,0-0.5-0.3-0.8-0.4
                                                            c-0.5-0.2-0.7-0.4-0.8-0.8c-0.2-0.4-0.4-0.5-0.6-0.8c-0.2-0.3-0.3-0.5-0.7-0.7c-0.1,0,0.1,0.3,0.1,0.4c0.2,0.2,0.4,0.5,0.5,0.8
                                                            C9.7,14,9.6,14,9.4,13.7c-0.3-0.4-0.6-0.8-0.8-1.1c0.2,0.2,0.2,0,0-0.2c-0.2-0.2-0.4-0.2-0.5-0.4c-0.5-0.5-0.6-1.1-0.6-1.8
                                                            c0-0.2,0.1-0.4,0.1-0.6c0-0.2-0.2-0.3-0.3-0.5C7.2,9.1,7.1,8.9,7.1,8.9C7,8.7,6.9,8.6,6.8,8.4C6.7,8.3,6.4,8.1,6.1,7.9
                                                            c1.2-1.5,2.8-2.7,4.6-3.5c0,0.1,0.1,0.2,0.1,0.3C11,4.9,11.2,4.9,11.4,5c0,0.3-0.5,0.4-0.7,0.3C10.4,5.2,10,5.2,9.8,5.5
                                                            c0.2,0.1,0.6,0.5,0.5,0.1h0.9c0.2,0,0.5,0.2,0.6,0.1c0.1,0,0.1-0.2,0.2-0.3c-0.1,0-0.2-0.1-0.2,0c0.2-0.2,0.4-0.1,0.7,0.1
                                                            c-0.3,0.2-0.1,0.6,0.2,0.2c0.2-0.3-0.1-0.5-0.3-0.6c0.3-0.4,0.5-0.4,0.8,0c0-0.1,0.1-0.2,0.2-0.2v1.7c0,0-0.1,0.1-0.1,0.1
                                                            C13,6.7,12.6,7,12.5,7.2c-0.3,0.5,0.3,0.8,0.7,0.9v1.4c0,1.2,1,2.2,2.2,2.2l0.5,0l0,0c0,0-0.1,0-0.1,0.1c-0.1,0.2,0.1,0.2,0,0.4
                                                            c-0.1,0.2-0.4,0.3-0.5,0.5l0.1-0.1c-0.2,0.2-0.3,0.2-0.4,0.4c0.1,0.2,0.2,0.8,0.2,0.8c-0.4,0.3-0.6-0.3-0.8-0.5
                                                            c-0.4-0.5-1.1-0.2-1.6-0.2C12.2,13.3,11.6,14,12,14.7z M26.1,11.8c0.1,0.4,0.2,0.7,0.3,1.1L26.1,13c-0.2,0-0.2-0.1-0.3-0.2
                                                            l-0.3-0.3c-0.1-0.2,0-0.2,0-0.4c-0.1-0.1-0.1-0.3-0.1-0.3L26.1,11.8z M22.2,19.6c-0.2,0.3-0.5,0.4-0.6,0.7c-0.1,0.2,0,0.5-0.1,0.8
                                                            c-0.1,0.4-0.2,0.2-0.4,0.5c-0.2,0.2,0,0.2-0.3,0.3c-0.3,0.2-0.5,0.1-0.8,0.4v-0.1C20,22.3,20,22.5,20,22.6
                                                            c-0.1,0.2-0.2,0.3-0.4,0.5c-0.1,0.1-0.6,0.8-0.6,0.8c-0.1-0.1-0.5,0.1-0.5,0c0,0.1,0,0.1,0.1,0.2c-0.1,0.6-0.4,0.7-1,0.7
                                                            c0.1,0.3-0.2,0.2-0.4,0.4c-0.1,0.1-0.1,0.4-0.2,0.5c0,0.1-0.3,0.4-0.3,0.5s0.1,0.2,0.2,0.2c-0.5,0.1-0.8,0.2-1.3,0.2
                                                            c0.1-0.1,0.1-0.2-0.2-0.2c0.1-0.2,0.2-0.3,0.3-0.5v-0.2c0.1-0.3,0.1-0.2,0-0.4c-0.2-0.5,0.1-0.7,0.2-1.2c0.2-0.5,0.2-1.1,0.2-1.7
                                                            c0.1-0.2,0.2-0.8,0-1.1c-0.1-0.3-0.5-0.5-0.8-0.7c-0.3-0.3-0.5-0.5-0.7-0.9c-0.1-0.2-0.2-0.3-0.3-0.5c-0.2-0.4,0-0.2,0-0.4
                                                            s0-0.5,0.1-0.7c0.1-0.2,0.3-0.5,0.5-0.7c0.1-0.2,0-0.4-0.1-0.5c0.1,0,0.2,0,0.3,0c0.5,0.2,0.2,0,0.7-0.3c0.3-0.2,0.3,0,0.5,0
                                                            c0.2,0,0.2-0.2,0.5-0.2c0.2,0.1,0.2,0.2,0.5,0.2h0.2c0.4,0.1,0.7,0.3,1,0.5c0.2,0.2,0.5,0.2,0.8,0.2c0.2,0.1,0.6,0.4,0.6,0.7
                                                            c0,0.1-0.2,0.3-0.2,0.4c0.1,0.1,0.5-0.1,0.5-0.1c0,0.1-0.3,0.2-0.3,0.2c0,0.1,0.2,0.2,0.2,0.2c0.2-0.5,0.4-0.2,0.6-0.1
                                                            c0.2,0.1,0.5,0.1,0.8,0.2c0.2,0.1,0.7,0.2,0.8,0.4C22.5,19.1,22.4,19.4,22.2,19.6z M26.2,18c-0.2-0.1-0.5-0.2-0.6-0.4
                                                            c-0.2-0.2-0.5-0.5-0.6-0.7c-0.2-0.3-0.1-0.5-0.1-0.8c0-0.2-0.2-0.6,0-0.8l0.2-0.2c0.1-0.2,0.1-0.3,0.2-0.5c0.2-0.2,0.3-0.2,0.5-0.4
                                                            c0.2-0.2,0.2-0.2,0.2-0.5c0.1-0.2,0.2-0.4,0.4-0.5c0.1,0.6,0.2,1.1,0.2,1.7C26.5,16.1,26.4,17.1,26.2,18z M28.9,9.5
                                                            c0,1-0.8,1.8-1.8,1.8l-8-0.1l-2.7,2.5l0-2.5l-0.8,0c-1,0-1.8-0.8-1.8-1.8L14,2.8c0-1,0.8-1.8,1.8-1.8h0l11.5,0.1
                                                            c1,0,1.7,0.8,1.8,1.8L28.9,9.5z'
      />
      <path d='M17.9,5.3c-0.4,0-0.8,0.3-0.8,0.8s0.3,0.8,0.8,0.8c0.4,0,0.8-0.3,0.8-0.8S18.3,5.3,17.9,5.3z' />
      <path d='M21.4,5.3c-0.4,0-0.8,0.3-0.8,0.8s0.3,0.8,0.8,0.8s0.8-0.3,0.8-0.8S21.9,5.3,21.4,5.3z' />
      <path d='M25,5.3c-0.4,0-0.8,0.3-0.8,0.8s0.3,0.8,0.8,0.8c0.4,0,0.8-0.3,0.8-0.8S25.4,5.3,25,5.3z' />
    </g>
  </svg>
)

const MmsSvg = () => (
  <svg width='1em' height='1em' fill='currentColor' viewBox='0 0 30 30'>
    <g>
      <path
        d='M20.2,3C17.4,3,15,5.3,15,8.2c0,0.8,0.2,1.6,0.6,2.3L17.2,9c0,0,0.1,0,0.2,0c0,0,0.1,0,0.2,0l1.4,1.4l3.1-3
                                                            c0,0,0.1,0,0.2,0c0,0,0.1,0,0.2,0l2.7,2.6c0.2-0.5,0.3-1.1,0.3-1.7C25.5,5.3,23.1,3,20.2,3z M18.8,7.3c-0.7,0-1.3-0.5-1.3-1.2
                                                            c0-0.7,0.6-1.3,1.3-1.2C19.5,4.8,20,5.4,20,6C20,6.7,19.5,7.3,18.8,7.3z'
      />
      <path
        d='M26.9,11.4c0.4-0.9,0.7-2,0.7-3.1c0-4-3.3-7.3-7.3-7.3c-2.4,0-4.5,1.2-5.9,3C7.7,4.2,2.4,9.1,2.4,15
                                                            c0,2.5,0.9,4.7,2.4,6.6l-1.2,4.5l4.2-2c2,1.3,4.5,2,7.2,2c7,0,12.6-5,12.6-11.1C27.6,13.7,27.3,12.5,26.9,11.4z M20.2,14.6
                                                            c-3.4,0-6.3-2.8-6.3-6.3c0-1.3,0.4-2.5,1.1-3.5c0,0,0,0,0,0c0.1-0.2,0.2-0.3,0.3-0.4c0.1-0.1,0.1-0.1,0.2-0.2
                                                            C16.7,2.8,18.4,2,20.2,2c3.4,0,6.3,2.8,6.3,6.3C26.5,11.7,23.7,14.6,20.2,14.6z'
      />
    </g>
  </svg>
)

const MailSvg = () => (
  <svg width='1em' height='1em' fill='currentColor' viewBox='0 0 30 30'>
    <g>
      <path
        d='M2.4,21.2c0,1.4,1.1,2.6,2.6,2.6h20c1.4,0,2.6-1.1,2.6-2.6V9.2l-10.3,7.7l0,0c-0.8,0.5-1.5,0.8-2.2,0.8
                                                            c-0.7,0-1.4-0.3-2.3-0.8l0,0L2.4,9.1V21.2z'
      />
      <path d='M16.8,16.3l10.7-8c-0.2-1.2-1.3-2.1-2.5-2.1H5c-1.2,0-2.3,0.9-2.5,2.1l10.7,8C14.7,17.2,15.4,17.2,16.8,16.3z' />
    </g>
  </svg>
)

const VoiceSvg = () => (
  <svg width='1em' height='1em' fill='currentColor' viewBox='0 0 30 30'>
    <g>
      <path
        d='M13.1,19.2h4.1c1.4,0,2.5-1.1,2.5-2.5V4.3c0-1.4-1.1-2.5-2.5-2.5h-4.1c-1.4,0-2.5,1.1-2.5,2.5v12.5
                                                            C10.6,18.1,11.7,19.2,13.1,19.2z'
      />
      <path
        d='M23.7,14.7c-0.7,0-1.3,0.5-1.4,1.2c-0.6,3.5-3.6,6.1-7.2,6.1s-6.6-2.7-7.2-6.1c-0.1-0.7-0.7-1.2-1.4-1.2
                                                            c-0.9,0-1.5,0.8-1.4,1.6c0.7,4.3,4.2,7.7,8.6,8.4v2.8c0,0.4,0.3,0.8,0.8,0.8h1.3c0.4,0,0.8-0.3,0.8-0.8v-2.8c4.4-0.6,7.9-4,8.6-8.4
                                                            C25.2,15.5,24.6,14.7,23.7,14.7z'
      />
    </g>
  </svg>
)

const ShortUrlSvg = () => (
  <svg width='1em' height='1em' fill='currentColor' viewBox='0 0 30 30'>
    <g>
      <path
        d='M16.7,18.2c-0.4-0.3-0.8-0.4-1.3-0.4c-0.9,0.1-1.6,1-1.5,1.9c0,0.1,0,0.3,0,0.5c0,2.2-1.8,4-4,4
                                                            c-2.2,0-4-1.8-4-4c0-2.2,1.8-4,4-4c0.1,0,0.3,0,0.5,0c0,0,0.4,0,1,0.1l3.1-3.1c-1-0.2-2.4-0.3-3.7-0.4c0,0-0.5,0-0.8,0
                                                            c-4.1,0-7.5,3.4-7.5,7.5c0,3.9,3,7.1,6.8,7.4l0.7,0c4.1,0,7.5-3.4,7.5-7.5c0-0.3,0-0.6,0-0.8C17.3,18.9,17.1,18.4,16.7,18.2z'
      />
      <path
        d='M20.1,2.4c-4.1,0-7.5,3.4-7.5,7.5c0,0.3,0,0.6,0,0.8c0.1,0.5,0.3,0.9,0.6,1.2c0.4,0.3,0.8,0.4,1.3,0.4
                                                            c0.9-0.1,1.6-1,1.5-1.9c0-0.1,0-0.3,0-0.5c0-2.2,1.8-4,4-4c2.2,0,4,1.8,4,4c0,2.4-2.1,4.3-4.5,4l-1-0.1l-3.1,3.1
                                                            c1.8,0.2,3.7,0.4,3.7,0.4c0.3,0,0.5,0,0.8,0v0c4.1,0,7.5-3.4,7.5-7.5C27.6,5.8,24.3,2.4,20.1,2.4z'
      />
      <path
        d='M9.5,19.5c0,0.3,0.1,0.5,0.3,0.7c0.2,0.2,0.4,0.3,0.7,0.3c0.3,0,0.5-0.1,0.7-0.3c0,0,0,0,0,0l8.9-8.9
                                                            c0,0,0,0,0,0c0.2-0.2,0.3-0.4,0.3-0.7c0-0.3-0.1-0.5-0.3-0.7c-0.4-0.4-1-0.4-1.4,0l-8.9,8.9C9.6,19,9.5,19.2,9.5,19.5z'
      />
    </g>
  </svg>
)

const OnepassSvg = () => (
  <svg width='1em' height='1em' fill='currentColor' viewBox='0 0 30 30'>
    <g>
      <path
        d='M24.9,25.8c-0.3,0.3-7,3.3-7.4,2.8c-1.4-1.8-3.4-1.5-5.9-3.7c-1-0.9-2-1.4-3.1-1.7c-1.5-0.4-4,0.2-4.3-0.9
                                                            c-0.2-1,0.9-2.4,3.4-2c2.8,0.6,4.3,0.2,4.3-0.9c0-0.6-2.8-9-3.4-11.7C8.1,6.3,8.1,5.3,9.3,5c0.9-0.2,1.5,1,2,2.3
                                                            c0.9,2.1,1.1,5.6,2,6c0.1-0.1,0-3,2.8-1.1c0.4-0.2,0.7-3.1,3.1-0.6c0.9,0.6,0.6-2.6,3.4,0.3c3.2,3.2,3.2,9.3,3,10.5
                                                            C25.4,23.5,25.7,25.4,24.9,25.8z'
      />
      <path
        d='M7.2,8.7c-0.1,0-0.2,0-0.3-0.1c-1.1-0.8-1.7-2-1.7-3.3c0-2.2,1.8-4,4-4s4,1.8,4,4c0,0.5-0.1,0.9-0.2,1.4
                                                            C12.8,7,12.5,7.1,12.2,7c-0.3-0.1-0.4-0.4-0.3-0.7c0.1-0.3,0.2-0.7,0.2-1c0-1.6-1.3-2.9-2.9-2.9c-1.6,0-2.9,1.3-2.9,2.9
                                                            c0,0.9,0.5,1.8,1.2,2.4c0.2,0.2,0.3,0.5,0.1,0.8C7.5,8.6,7.4,8.7,7.2,8.7z'
      />
    </g>
  </svg>
)

const IdentificationSvg = () => (
  <svg width='1em' height='1em' fill='currentColor' viewBox='0 0 30 30'>
    <g>
      <path
        d='M25.9,19.7l-2.6,1.5c-0.1,0.1-0.2,0.2-0.2,0.3v3c0,0.1,0.1,0.2,0.2,0.3l2.6,1.5c0.1,0.1,0.2,0.1,0.3,0l2.6-1.5
                                                        c0.1-0.1,0.2-0.2,0.2-0.3v-3c0-0.1-0.1-0.2-0.2-0.3l-2.6-1.5C26.1,19.6,26,19.6,25.9,19.7z'
      />
      <path
        d='M19.8,18.8l2.6,1.5c0.1,0.1,0.2,0.1,0.3,0l2.6-1.5c0.1-0.1,0.2-0.2,0.2-0.3v-3c0-0.1-0.1-0.2-0.2-0.3l-2.6-1.5
                                                        c-0.1-0.1-0.2-0.1-0.3,0l-2.6,1.5c-0.1,0.1-0.2,0.2-0.2,0.3v3C19.7,18.6,19.7,18.7,19.8,18.8z'
      />
      <path
        d='M16.2,21.4v3c0,0.1,0.1,0.2,0.2,0.3l2.6,1.5c0.1,0.1,0.2,0.1,0.3,0l2.6-1.5c0.1-0.1,0.2-0.2,0.2-0.3v-3
                                                        c0-0.1-0.1-0.2-0.2-0.3l-2.6-1.5c-0.1-0.1-0.2-0.1-0.3,0l-2.6,1.5C16.3,21.2,16.2,21.3,16.2,21.4z'
      />
      <path
        d='M18.7,27.3l-3.1-1.8c-0.3-0.2-0.4-0.5-0.4-0.8v-3.5c0-0.3,0.2-0.6,0.4-0.8l1.8-1c-0.1-0.1-0.2-0.2-0.3-0.2
                                                        c-0.2-0.2-0.4-0.5-0.5-0.7c-0.1-0.2-0.1-0.5-0.1-0.7l0-0.8c0-0.4,0.2-0.8,0.5-1c0.3-0.3,0.6-0.5,0.9-0.8c0.2-0.2,0.3-0.3,0.4-0.6
                                                        c0.1-0.2,0.2-0.4,0.3-0.7c0.1-0.3,0.2-0.6,0.3-0.9c0.1,0,0.3-0.1,0.4-0.2c0.1-0.1,0.3-0.2,0.4-0.4c0.2-0.2,0.3-0.5,0.3-0.7
                                                        c0.1-0.3,0.1-0.6,0.1-0.9c0-0.2-0.1-0.5-0.2-0.7c-0.1-0.2-0.2-0.4-0.4-0.6c0-0.7,0-1.5-0.1-2.2c-0.1-0.7-0.2-1.3-0.4-2
                                                        c-0.2-0.7-0.5-1.3-0.9-1.9C17.9,2.8,17.5,2.4,17,2c-0.4-0.3-0.9-0.6-1.4-0.8c-0.5-0.2-0.9-0.3-1.4-0.4c-0.4-0.1-0.9-0.1-1.4-0.1
                                                        c-0.5,0-0.9,0-1.4,0.1c-0.5,0.1-1,0.2-1.4,0.4C9.6,1.4,9.1,1.7,8.7,2C8.2,2.4,7.8,2.8,7.5,3.3C7.1,3.9,6.8,4.5,6.6,5.2
                                                        c-0.2,0.6-0.3,1.3-0.4,2C6.1,7.9,6.1,8.6,6.1,9.3C5.9,9.5,5.8,9.7,5.7,9.9c-0.1,0.2-0.2,0.5-0.2,0.7c0,0.3,0,0.6,0.1,0.9
                                                        c0.1,0.3,0.2,0.5,0.3,0.7c0.1,0.1,0.2,0.3,0.4,0.4c0.1,0.1,0.3,0.2,0.4,0.2c0.1,0.3,0.2,0.6,0.3,0.9c0.1,0.3,0.2,0.5,0.3,0.7
                                                        c0.1,0.2,0.2,0.4,0.4,0.6c0.3,0.2,0.6,0.5,0.9,0.8c0.3,0.3,0.4,0.7,0.5,1l0,0.8c0,0.2,0,0.5-0.1,0.7c-0.1,0.3-0.3,0.5-0.5,0.7
                                                        c-0.3,0.3-0.6,0.5-0.9,0.7c-0.4,0.2-0.7,0.4-1.1,0.5c-0.4,0.2-0.8,0.3-1.3,0.4c-0.4,0.1-0.8,0.3-1.3,0.4c-0.4,0.1-0.8,0.3-1.1,0.5
                                                        c-0.3,0.2-0.6,0.5-0.8,0.8c-0.3,0.3-0.4,0.7-0.5,1.2c-0.2,1-0.2,2-0.1,3c0.1,0.8,0.3,1.3,0.5,1.4c0.3,0.1,0.5,0.2,0.8,0.3
                                                        c0.4,0.1,1,0.2,1.6,0.3c0.6,0.1,1.3,0.2,2.1,0.3c0.8,0.1,1.6,0.2,2.3,0.2c0.8,0.1,1.5,0.1,2.3,0.2c0.7,0,1.4,0.1,1.9,0.1
                                                        c0.5,0,1.2,0,1.9-0.1c0.7,0,1.5-0.1,2.3-0.2c0.8-0.1,1.6-0.1,2.3-0.2c0.8-0.1,1.5-0.2,2.1-0.3c0.6-0.1,1.2-0.2,1.6-0.3
                                                        c0.3,0,0.6-0.1,0.8-0.3c0.2-0.2,0.4-0.7,0.5-1.5c0,0,0,0,0,0l-1.8-1l-3,1.7C19.3,27.4,19,27.4,18.7,27.3z'
      />
    </g>
  </svg>
)

const VfmobileSvg = () => (
  <svg width='1em' height='1em' fill='currentColor' viewBox='0 0 36 36'>
    <g id='图层_2' data-name='图层 2'>
      <g id='图层_1-2' data-name='图层 1'>
        <circle fill='#fff' cx='13.88' cy='16.88' r='1.13' />
        <circle fill='#fff' cx='18.38' cy='16.88' r='1.13' />
        <circle fill='#fff' cx='22.88' cy='16.88' r='1.13' />
        <path
          fill='#fff'
          d='M20.25,6h-4.5a.75.75,0,0,0,0,1.5h4.5a.75.75,0,0,0,0-1.5Z'
        />
        <path
          fill='#fff'
          d='M32.17,21.2a15,15,0,0,1-4.42-1.33V6.15A3.15,3.15,0,0,0,24.6,3H11.4A3.15,3.15,0,0,0,8.25,6.15v23.7A3.15,3.15,0,0,0,11.4,33H24.6A3.07,3.07,0,0,0,26,32.65h0c.29.12.59.24.91.35,3.34-1.12,5.24-3.19,5.7-6.23V21.69A.48.48,0,0,0,32.17,21.2ZM24,31.5H11.4a1.65,1.65,0,0,1-1.65-1.65V6.15A1.65,1.65,0,0,1,11.4,4.5H24.6a1.65,1.65,0,0,1,1.65,1.65V19.81A14.81,14.81,0,0,1,22,21.18a.88.88,0,0,0-.78.87v4.73A6.81,6.81,0,0,0,24,31.5Zm2.4-2.37-3.2-2.8.85-.68,1.7,1.25a20.72,20.72,0,0,1,4.63-3.53l.32.36A18,18,0,0,0,26.37,29.13Z'
        />
        <rect fill='none' width='36' height='36' />
      </g>
    </g>
  </svg>
)

const RcsSVg = () => (
  <svg width='1em' height='1em' fill='currentColor' viewBox='0 0 30 30'>
    <g>
      <path
        d='M27.2,11.3c0.5-1,0.7-2.1,0.7-3.2c0-4.2-3.4-7.6-7.6-7.6c-2.5,0-4.7,1.2-6.1,3C7.5,3.9,2,8.9,2,15
                                                            c0,2.5,0.9,4.9,2.5,6.8l-1.3,4.7l4.3-2.1c2.1,1.3,4.7,2.1,7.4,2.1c7.2,0,13-5.1,13-11.5C28,13.7,27.7,12.5,27.2,11.3z M20.4,1.6
                                                            c3.6,0,6.5,2.9,6.5,6.5s-2.9,6.5-6.5,6.5s-6.5-2.9-6.5-6.5S16.8,1.6,20.4,1.6z'
      />
      <path
        d='M19.1,8.7h1.7c0.4,0,0.6,0.1,0.8,0.2c0.2,0.2,0.3,0.4,0.3,0.8l0.1,0.8c0,0.4,0.1,0.6,0.3,0.8h1.2
                                                            c-0.2-0.2-0.4-0.6-0.4-1l-0.1-1c-0.1-0.6-0.4-1-1-1.1v0c0.3-0.1,0.6-0.3,0.8-0.6C23,7.3,23.1,7,23.1,6.7c0-0.6-0.2-1.1-0.6-1.4
                                                            c-0.4-0.3-0.9-0.4-1.6-0.4H18v6.5h1.1V8.7z M19.1,5.8h1.7c0.4,0,0.8,0.1,1,0.2C21.9,6.1,22,6.4,22,6.8c0,0.3-0.1,0.6-0.3,0.8
                                                            c-0.2,0.2-0.5,0.3-1,0.3h-1.7V5.8z'
      />
    </g>
  </svg>
)

const MdetectSvg = () => (
  <svg width='1.5em' height='1.5em' fill='currentColor' viewBox='0 0 80 80'>
    <g>
      <path
        fill='#fff'
        d='M38.99,60.87c-5.53,0-11.06-2.11-15.27-6.32-8.42-8.42-8.42-22.12,0-30.55,8.42-8.42,22.12-8.42,30.55,0,8.42,8.42,8.42,22.12,0,30.55-4.21,4.21-9.74,6.32-15.27,6.32Zm0-38.39c-4.49,0-8.71,1.75-11.88,4.92-3.17,3.17-4.92,7.39-4.92,11.88s1.75,8.71,4.92,11.88c3.17,3.17,7.39,4.92,11.88,4.92s8.71-1.75,11.88-4.92c6.55-6.55,6.55-17.21,0-23.76-3.17-3.17-7.39-4.92-11.88-4.92Z'
      />
      <path
        fill='#fff'
        d='M60.21,62.32c-.61,0-1.23-.23-1.7-.7l-2.83-2.83c-.94-.94-.94-2.46,0-3.39,.94-.94,2.46-.94,3.39,0l2.83,2.83c.94,.94,.94,2.46,0,3.39-.47,.47-1.08,.7-1.7,.7Z'
      />
      <path
        fill='#fff'
        d='M39.79,45.68c-.11,0-.22-.01-.33-.03-.56-.12-1.01-.52-1.19-1.06l-2.17-6.5-1.92,2.88c-.3,.45-.8,.71-1.33,.71h-2.27c-.88,0-1.6-.72-1.6-1.6s.72-1.6,1.6-1.6h1.41l3.26-4.89c.34-.51,.94-.78,1.54-.7,.61,.08,1.11,.5,1.31,1.08l2.33,6.99,1.76-1.96c.3-.34,.74-.53,1.19-.53h4c.88,0,1.6,.72,1.6,1.6s-.72,1.6-1.6,1.6h-3.29l-3.12,3.47c-.31,.34-.74,.53-1.19,.53Z'
      />
    </g>
  </svg>
)

const AimSvg = () => {
  return (
    <svg width='1.5em' height='1.5em' fill='currentColor' viewBox='0 0 200 200'>
      <defs>
        <linearGradient
          id='_未命名的渐变_2'
          data-name='未命名的渐变 2'
          x1='100'
          y1='483.29'
          x2='100'
          y2='683.29'
          gradientTransform='translate(0 683.29) scale(1 -1)'
          gradientUnits='userSpaceOnUse'>
          <stop offset='0' stopColor='#ea4e56' />
          <stop offset='1' stopColor='#ec7773' />
        </linearGradient>
        <linearGradient
          id='_未命名的渐变_2-2'
          data-name='未命名的渐变 2'
          x1='122.51'
          y1='63.26'
          x2='127.42'
          y2='63.26'
          gradientTransform='matrix(1,0,0,1,0,0)'
          xlinkHref='#_未命名的渐变_2'
        />
        <linearGradient
          id='_未命名的渐变_2-3'
          data-name='未命名的渐变 2'
          x1='103.94'
          y1='62.65'
          x2='145.94'
          y2='62.65'
          gradientTransform='matrix(1,0,0,1,0,0)'
          xlinkHref='#_未命名的渐变_2'
        />
      </defs>
      <g id='_图层_1-2' data-name='图层 1'>
        <g>
          <circle
            style={{ fill: 'url(#_未命名的渐变_2)', strokeWidth: '0px' }}
            cx='100'
            cy='100'
            r='100'
          />
          <path
            style={{ fill: '#fff', strokeWidth: '0px' }}
            d='M100,49.66c-31.87,0-57.62,22.53-57.62,50.34.06,10.93,4.01,21.48,11.14,29.76l-5.21,20.61,22.24-7.03h0c9.11,4.67,19.21,7.08,29.44,7.03,31.82,0,57.64-22.55,57.64-50.36s-25.82-50.34-57.64-50.34ZM107.96,112.36c1.69,1.75,4.07,2.64,6.5,2.43,1.14,0,2.28-.15,3.38-.44.77-.22,1.51-.51,2.21-.88v-4.14h-7.15v-5.69h13.63v12.9l-.49.24c-1.56,1.22-3.32,2.15-5.21,2.75-2.23.63-4.54.93-6.86.88-4.06.21-8.01-1.4-10.75-4.4-.68-.81-1.26-1.69-1.75-2.63h0c-.66,1.14-1.48,2.18-2.43,3.09-2.82,2.69-6.59,4.15-10.49,4.04-1.89,0-3.78-.26-5.6-.78-1.76-.49-3.42-1.32-4.87-2.43-2.93-2.29-4.62-5.82-4.57-9.54h8.15c.1,1.68.84,3.25,2.07,4.4,1.24,1.11,2.86,1.71,4.53,1.65,1.01,0,2.01-.22,2.92-.68.84-.43,1.59-1.02,2.19-1.75.58-.73,1.04-1.55,1.34-2.43.32-.93.49-1.91.49-2.9.06-.97-.04-1.95-.29-2.9-.29-.9-.76-1.73-1.39-2.43-.61-.68-1.36-1.23-2.19-1.61-2.09-.82-4.42-.74-6.45.22-1.03.61-1.91,1.44-2.58,2.43h-7.3l3.99-22.26h22.46v6.74h-16.79l-1.61,9.12h0c.99-1.06,2.19-1.89,3.53-2.43,1.43-.43,2.93-.59,4.43-.49,1.83-.05,3.64.32,5.3,1.07,1.48.7,2.8,1.7,3.87,2.94.43.49.81,1.02,1.14,1.58h0c.51-1.06,1.15-2.06,1.9-2.97,2.54-3.01,6.33-4.68,10.27-4.5,3.13-.2,6.23.66,8.81,2.43,2.22,1.83,3.65,4.44,3.99,7.3l.19,1.12h-6.35l-.17-.78c-.22-1.33-.96-2.51-2.04-3.31-1.32-.81-2.86-1.2-4.4-1.12-2.02-.11-3.97.72-5.3,2.24-1.59,1.99-2.37,4.51-2.19,7.06-.21,2.44.48,4.87,1.95,6.84Z'
          />
          <circle
            style={{ fill: '#fff', strokeWidth: '0px' }}
            cx='124.94'
            cy='62.65'
            r='25'
          />
          <g>
            <rect
              style={{ fill: 'url(#_未命名的渐变_2-2)', strokeWidth: '0px' }}
              x='122.51'
              y='62.39'
              width='4.91'
              height='1.73'
            />
            <path
              style={{ fill: 'url(#_未命名的渐变_2-3)', strokeWidth: '0px' }}
              d='M124.94,41.65c-11.6,0-21,9.4-21,21s9.4,21,21,21,21-9.4,21-21-9.4-21-21-21ZM119.19,52.15l2.55,4.14h-4.09l-2.55-4.14h4.09ZM117.7,73.15h-3.56v-16.48h3.56v16.48ZM135.74,73.15h-4.81v-2.19l-.34,1.42h-5.29v-4.98h-.91l-2.5,5.08h-3.66l2.5-5.08h-1.78v-8.28h1.68l-1.06-2.21h3.66l1.15,2.21h.91l1.25-2.12h3.75l-1.15,2.12h1.83v8.28h-2.69v2.07h.53l.29-1.2h2.5l-.43,1.68h1.01v-14.14h-10.49v-3.27h14.05v20.62Z'
            />
          </g>
        </g>
      </g>
    </svg>
  )
}

const ConsoleSvg = () => (
  <svg
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 30 30'
    xmlSpace='preserve'>
    <path
      d='M18.9,18.3c-0.1,0.3-0.3,0.6-0.5,0.9c-0.3,0.4-0.6,0.8-0.6,1.5c0,2.5,1.9,3.5,4.7,4.5c0.6,0.2,1.1,0.4,1.5,0.6
                                    c1.2-1.2,2.2-2.6,2.9-4.2c0.7-1.7,1.1-3.4,1.1-5.3C28.1,9,22.2,3.1,15,3.1C7.8,3.1,1.9,9,1.9,16.2c0,1.8,0.4,3.6,1.1,5.3
                                    c0.7,1.6,1.7,3,2.9,4.2c0.4-0.2,0.9-0.4,1.5-0.6c2.7-1,4.7-1.9,4.7-4.5c0-0.7-0.3-1.1-0.6-1.5c-0.2-0.3-0.4-0.5-0.5-0.9
                                    c-0.2-0.1-0.6-0.5-0.8-1.7c-0.1-0.8,0-1.3,0.2-1.5c0.1,0,0.1-0.1,0.2-0.1c-0.3-0.8-0.3-1.9-0.3-2.2c-0.2-0.2-0.5-0.8,0.2-2.1
                                    c0.3-0.6,0.7-1,1.2-1.1c0.3-0.1,0.5,0,0.6,0c0.1-0.1,0.3-0.1,0.4-0.1c0.5-0.1,1.4-0.3,2.3-0.3c1.1,0,2.1,0.1,2.9,0.5
                                    c0.9,0.4,1.4,1.3,1.5,2.7c0.1,1,0,2.1-0.1,2.6c0,0,0,0,0,0.1c0.1,0,0.2,0,0.2,0.1c0.2,0.2,0.3,0.7,0.2,1.5
                                    C19.6,17.7,19.1,18.1,18.9,18.3z'
    />
  </svg>
)

const LogoSvg = () => (
  <svg width='1em' height='1em' fill='#fff' viewBox='0 0 30 30'>
    <path
      fill='#0168ff'
      d='M12.4,4c1.4,0.2,2.7,0.6,3.9,1.4c2,1.2,3.6,3.1,4.5,5.2c0.7,1.7,0.9,3.5,0.7,5.3c-0.2,1.4-0.6,2.7-1.4,3.9
                                    c1.5-0.9,2.9-2.2,3.7-3.7c0.7-1.1,1.1-2.3,1.2-3.6c0.2-1.7,0-3.4-0.6-5c-1.2-3.1-4-5.3-7.2-6c-0.5-0.1-0.9-0.1-1.2-0.2
                                    c-4.5-0.4-9,1.5-11.8,5C5.1,5.6,6.1,5,7,4.6C8.8,4,10.6,3.7,12.4,4z'
    />
    <path
      fill='#ff2448'
      d='M3.9,17.5c0.2-1.4,0.6-2.7,1.4-3.9c1.2-2,3-3.6,5.1-4.5c1.7-0.7,3.6-0.9,5.4-0.7c1.4,0.2,2.6,0.6,3.8,1.3
                                    C18.8,8.2,17.5,6.9,16,6c-1.1-0.7-2.3-1.1-3.6-1.2c-1.7-0.2-3.3,0-4.9,0.6c-2.7,1.1-4.8,3.3-5.7,6c-0.2,0.6-0.3,1.3-0.4,1.9
                                    c-0.1,0.6-0.1,1.3-0.1,2c0.1,4,1.9,7.9,5,10.4c-0.7-0.9-1.2-1.8-1.7-2.8C3.9,21.1,3.7,19.3,3.9,17.5z'
    />
    <path
      fill='#43ffbb'
      d='M28.6,16.3c0.5-4.6-1.5-9.1-5-11.9c0.8,0.9,1.3,1.8,1.7,2.8c0.7,1.7,0.9,3.6,0.7,5.3c-0.2,1.4-0.6,2.7-1.4,3.9
                                    c-1.2,2.1-3.1,3.7-5.3,4.5c-1.7,0.7-3.5,0.9-5.2,0.6c-1.4-0.2-2.7-0.6-3.9-1.3c0.9,1.5,2.2,2.8,3.6,3.7c1.1,0.7,2.3,1.1,3.6,1.2
                                    c1.7,0.2,3.4,0,5-0.7c3.1-1.3,5.4-4,5.9-7.3c0.1-0.2,0.1-0.4,0.1-0.5C28.5,16.6,28.5,16.4,28.6,16.3L28.6,16.3z'
    />
    <path
      fill='#ff488a'
      d='M17.4,25.9c-1.4-0.2-2.7-0.6-3.9-1.4c-2-1.2-3.6-3.1-4.5-5.2C8.2,17.7,8,15.9,8.2,14c0.2-1.4,0.6-2.6,1.2-3.8
                                    C8,11,6.7,12.4,5.8,13.8c-0.7,1.1-1.1,2.3-1.2,3.6c-0.2,1.7,0,3.4,0.6,4.9c1.1,2.8,3.3,4.8,6.1,5.7c1.2,0.3,2.3,0.5,3.6,0.5
                                    c4.2,0,8.2-2,10.7-5.2c-0.9,0.8-1.9,1.4-2.9,1.8C21.1,25.9,19.2,26.2,17.4,25.9z'
    />
  </svg>
)

const ChatSvg = () => {
  return (
    <svg width='1em' height='1em' fill='#fff' viewBox='0 0 1024 1024'>
      <path
        fill='#fff'
        d='M998.432 51.2c-0.010 0.002-0.024 0.002-0.032 0-68.667 0-139.989 43.834-166.232 61.722-28.819-6.986-58.955-10.522-89.768-10.522-73.584 0-143.085 20.285-195.699 57.114-55.394 38.778-85.901 91.226-85.901 147.686s30.507 108.909 85.901 147.686c52.614 36.83 122.115 57.114 195.699 57.114s143.085-20.283 195.699-57.114c55.395-38.778 85.901-91.226 85.901-147.686 0-49.368-23.614-96.099-66.843-132.963 4.197-11.805 17.358-37.205 58.616-78.605 5.078-4.678 8.259-11.384 8.259-18.834 0-14.138-11.462-25.598-25.6-25.598zM837.254 166.301c5.52 0 10.962-1.786 15.461-5.195 0.499-0.376 34.571-25.83 76.976-43.093-27.834 40.69-27.155 63.877-24.605 73.629 1.462 5.59 4.771 10.52 9.39 13.99 37.611 28.254 58.323 64.326 58.323 101.568 0 39.27-22.752 76.824-64.061 105.741-44.090 30.862-103.163 47.859-166.339 47.859s-122.25-16.997-166.339-47.859c-41.309-28.917-64.061-66.47-64.061-105.741s22.752-76.824 64.061-105.741c44.090-30.862 103.163-47.859 166.339-47.859 30.451 0 60.048 3.955 87.966 11.757 2.267 0.632 4.587 0.944 6.888 0.944zM25.6 0c-11.507 0-21.6 7.677-24.67 18.766-3.072 11.090 1.634 22.864 11.501 28.784 86.57 51.942 122.485 127.414 135.218 162.755-94.088 72.048-147.648 171.746-147.648 276.094 0 52.704 13.23 103.755 39.323 151.736 24.902 45.794 60.406 86.806 105.526 121.899 91.504 71.17 212.802 110.365 341.55 110.365 116.659 0 229.429-32.992 317.536-92.898 88.816-60.387 146.979-143.942 163.776-235.272 2.557-13.906-6.642-27.251-20.547-29.808-13.902-2.55-27.251 6.64-29.81 20.547-14.301 77.757-64.805 149.565-142.21 202.194-79.702 54.192-182.248 84.037-288.746 84.037-239.97 0-435.2-149.294-435.2-332.8 0-92.946 51.432-182.379 141.107-245.368 8.797-6.178 12.795-17.194 10.013-27.576-5.984-22.325-26.363-83.597-80.878-142.734 66.659 23.341 138.424 63.832 191.434 100.286 6.296 4.328 14.197 5.621 21.544 3.52 48.558-13.888 99.691-20.928 151.981-20.928 14.138 0 25.6-11.461 25.6-25.6s-11.462-25.6-25.6-25.6c-52.907 0-104.8 6.627-154.437 19.707-21.974-14.637-63.040-40.603-112.086-65.005-76.163-37.89-141.528-57.102-194.277-57.102z'
      />
    </svg>
  )
}

// 圆环
export const CircleIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={CircleSvg} {...props} rev={null} />
)

// 四方块
export const TableIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={TableSvg} {...props} rev={null} />
)

// ID
export const IDIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={IDSvg} {...props} rev={null} />
)

// 短信
export const MsgIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={MsgSvg} {...props} rev={null} />
)

// 国际短信
export const IntersmsIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={IntersmsSvg} {...props} rev={null} />
)

// 多媒体彩信
export const MmsIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={MmsSvg} {...props} rev={null} />
)

// 邮件
export const MailIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={MailSvg} {...props} rev={null} />
)

// 语音
export const VoiceIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={VoiceSvg} {...props} rev={null} />
)

// 短网址
export const ShortUrlIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ShortUrlSvg} {...props} rev={null} />
)

// 一键登录
export const OnepassIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={OnepassSvg} {...props} rev={null} />
)

// 身份验证
export const IdentificationIcon = (
  props: Partial<CustomIconComponentProps>,
) => <Icon component={IdentificationSvg} {...props} rev={null} />

// 本机号码认证
export const VfmobileIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={VfmobileSvg} {...props} rev={null} />
)

// 5G RCS 消息
export const RcsIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={RcsSVg} {...props} rev={null} />
)

// 空号检测
export const MdetectIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={MdetectSvg} {...props} rev={null} />
)

// 5G阅信
export const AimIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={AimSvg} {...props} rev={null} />
)

// 控制台
export const ConsoleIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ConsoleSvg} {...props} rev={null} />
)

// Logo-Mini
export const LogoIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={LogoSvg} {...props} rev={null} />
)

// 客服工单按钮
export const ChatIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon
    component={ChatSvg}
    {...props}
    rev={null}
    style={{ transform: 'rotate(180deg) scaleX(-1) translateY(4px)' }}
  />
)
