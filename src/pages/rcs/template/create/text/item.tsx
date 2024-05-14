import './index.scss'

type Props = {
  message: string
}
export default function Fn({ message }: Props) {
  return (
    <div className='center-content text-center-content p-t-16'>
      <div className='card-des fn13'>{message}</div>
    </div>
  )
}
