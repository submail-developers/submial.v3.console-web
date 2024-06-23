import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Col, Flex, Image, Button, Divider } from 'antd'
import { usePoint } from '@/hooks'

import PageContent from '@/components/pageContent'
import Card from './components/card'
import Template from './components/template'
import Info from './components/info'
import Api from './components/api'
import Success from './components/success'
import Error from './components/error'
import Hot from './components/hot'
import Address from './components/address'
import AddressFile from './components/addressFile'
import Send from './components/send'

import topIco from '@/assets/rcs/batchreport/batchreport_ico.png'

import {
  getSendlistReport,
  getSndlistSendanalysisreport,
  getSendlistDeepAnalysisReport,
} from '@/api'
import { API } from 'apis'

import './index.scss'

export default function Fn() {
  const point = usePoint('xl')
  const { id } = useParams()
  const sendRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [reportData, setreportData] = useState<API.GetSendlistReportRes>()

  const [sendanAlysisData, setsendanAlysisData] =
    useState<API.GetSendanalysisreportRes>()

  const [deepAnalysisData, setdeepAnalysisData] =
    useState<API.GetSendlistDeepAnalysisRes>()

  const initData = async () => {
    setLoading(true)
    sendRef.current && sendRef.current.init()
    try {
      const params = { sendlist: id }
      const pAll = await Promise.all([
        getSendlistReport(params),
        getSndlistSendanalysisreport(params),
        getSendlistDeepAnalysisReport(params),
      ])
      const [reportRes, sendRes, deepRes] = pAll
      setreportData(reportRes)
      setsendanAlysisData(sendRes.data)
      setdeepAnalysisData(deepRes.data)

      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    initData()
  }, [])

  return (
    <PageContent extClass='batchreport-detail'>
      <Image src={topIco} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center' className='m-t-4'>
        <div className='fn22 fw-500'>批量任务发送报告</div>
        <Button
          type='primary'
          onClick={initData}
          icon={<i className='icon iconfont icon-shuaxin fn14'></i>}>
          刷新状态
        </Button>
      </Flex>
      <Divider />
      <Row gutter={[24, 24]}>
        {point ? (
          <Col span={24}>
            <Flex gap={24} wrap='wrap'>
              <Template templateId={reportData?.sendlist?.template_id} />
              <Info sendlist={reportData?.sendlist} />
            </Flex>
          </Col>
        ) : (
          <>
            <Col span={24}>
              <Template templateId={reportData?.sendlist?.template_id} />
            </Col>
            <Col span={24}>
              <Info sendlist={reportData?.sendlist} />
            </Col>
          </>
        )}
        <Col span={24}>
          {sendanAlysisData && (
            <Api
              rate={sendanAlysisData.rate}
              address={sendanAlysisData.address}
            />
          )}
        </Col>
        <Col span={24} lg={12}>
          <Card title='成功分析' minHeight={240} loading={loading}>
            {deepAnalysisData && (
              <Success successreason={deepAnalysisData.successreason} />
            )}
          </Card>
        </Col>
        <Col span={24} lg={12}>
          <Card title='失败分析' minHeight={240} loading={loading}>
            {deepAnalysisData && (
              <Error dropreason={deepAnalysisData.dropreason} />
            )}
          </Card>
        </Col>
        <Col span={24}>
          {deepAnalysisData && (
            <Hot
              loading={loading}
              province={deepAnalysisData.province}
              city={deepAnalysisData.city}
            />
          )}
        </Col>
        {reportData && reportData.addressbooks.length > 0 && (
          <Col span={24}>
            <Card title='地址簿列表' minHeight={80} loading={loading}>
              <Address address={reportData.addressbooks} />
            </Card>
          </Col>
        )}
        {reportData && reportData.sendlist.addressfile_oss_path && (
          <Col span={24}>
            <Card title='联系人文件地址' loading={loading}>
              <AddressFile path={reportData.sendlist.addressfile_oss_path} />
            </Card>
          </Col>
        )}
        <Col span={24}>
          <Send id={id} ref={sendRef} />
        </Col>
      </Row>
    </PageContent>
  )
}
