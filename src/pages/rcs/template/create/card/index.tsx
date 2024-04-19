import {} from 'react'
import {} from 'antd'
import { useParams, useLocation, useSearchParams } from 'react-router-dom'
import Meteial from '../components/meteial'
import Page from '../page'
import './index.scss'

export default function Fn() {
  const [searchParams] = useSearchParams()
  const name = decodeURIComponent(searchParams.get('name'))
  return (
    <Page left={<Meteial />} content={<>content</>} right={<>right</>}></Page>
  )
}
