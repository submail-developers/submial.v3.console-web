import { useState, useEffect } from 'react'
import {
  Flex,
  Table,
  Row,
  Col,
  Button,
  Divider,
  Image,
  DatePicker,
  Form,
  Select,
  Dropdown,
  Space,
  Input,
  Collapse,
} from 'antd'
import PageContent from '@/components/pageContent'
import { IDIcon } from '@/components/aIcons'
import apiIco1 from '@/assets/rcs/analysis/apiInfo1.png'
import apiIco2 from '@/assets/rcs/analysis/apiInfo2.png'
import apiIco3 from '@/assets/rcs/analysis/apiInfo3.png'
import apiIco4 from '@/assets/rcs/analysis/apiInfo4.png'
import apiIco5 from '@/assets/rcs/analysis/apiInfo5.png'
import apiIco6 from '@/assets/rcs/analysis/apiInfo6.png'
import { useParams } from 'react-router-dom'
import ReactEcharts from 'echarts-for-react'
import type { CollapseProps } from 'antd'
import {
  getSendlistReport,
  getSndlistSendanalysisreport,
  getSendlistDeepAnalysisReport,
  getSendlistLogs,
} from '@/api'
import { API } from 'apis'
import topIco from '@/assets/rcs/batchreport/batchreport_ico.png'
import address from '@/assets/rcs/batchreport/address.png'
import './index.scss'

import { useSize, usePoint } from '@/hooks'
enum statusNum {
  '无状态' = 0,
  '成功',
  '失败',
  '已撤回',
}
enum statusStyle {
  'text-color' = 0,
  'success-color',
  'error-color',
  'gray-color',
}
const { Option } = Select
const { Panel } = Collapse
export default function Fn() {
  const { id } = useParams()
  const size = useSize()
  const point = usePoint('lg')
  const [form] = Form.useForm()
  const [detailList, setDetailList] = useState(null)
  const [analysisDetailList, setAnalysisDetailList] = useState(null)

  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(40)
  const [total, setTotal] = useState<number>(0)
  const [historyList, setHistoryList] = useState<API.GetSendlistLogsItems[]>()

  const [city, setCity] = useState([])
  const [cityTotal, setCityTotal] = useState([])
  const [province, setProvince] = useState([])
  const [provinceTotal, setProvinceTotal] = useState([])

  // 获取报告详情
  const getDetailList = async () => {
    try {
      const res = await getSendlistReport({
        sendlist: id,
      })
      setDetailList(res.sendlist)
    } catch (error) {}
  }
  // 获取概览详情
  const getAnalysisDetailList = async () => {
    try {
      const res = await getSndlistSendanalysisreport({
        sendlist: id,
      })
      setAnalysisDetailList(res.data)
    } catch (error) {}
  }
  // 概览数据分析
  const getDeepAnalysisReport = async () => {
    try {
      const res = await getSendlistDeepAnalysisReport({
        sendlist: id,
      })

      let cityToalArr = []
      let _cityData = res.data.city.map((item, index) => {
        cityToalArr.push(item.cnt)
        let obj = { ...item, index: `${index}` }
        return obj
      })

      setCity(_cityData)
      setCityTotal(cityToalArr)

      let provinceTotalArr = []
      let _provinceData = res.data.province.map((item, index) => {
        provinceTotalArr.push(item.cnt)
        let obj = { ...item, index: `${index}` }
        return obj
      })
      setProvince(_provinceData)
      setProvinceTotal(provinceTotalArr)
    } catch (error) {}
  }
  // 获取发送明细
  const getSendlistLogsList = async () => {
    try {
      const res = await getSendlistLogs({
        sendlist: id,
      })
      setHistoryList(res.history)
      setTotal(res.row)
    } catch (error) {}
  }
  useEffect(() => {
    getDetailList()
    getAnalysisDetailList()
    getDeepAnalysisReport()
    getSendlistLogsList()
  }, [])

  const totalCity = cityTotal.reduce(
    (acc, curr) => parseInt(acc) + parseInt(curr),
    0,
  )
  const totalProvince = provinceTotal.reduce(
    (acc, curr) => parseInt(acc) + parseInt(curr),
    0,
  )

  const calculatePercentageCity = (number) => {
    if (totalCity === 0) return 0
    return ((number / totalCity) * 100).toFixed(2)
  }

  const calculatePercentagePro = (number) => {
    if (totalProvince === 0) return 0
    return ((number / totalProvince) * 100).toFixed(2)
  }

  const columns = [
    {
      title: '手机号',
      dataIndex: 'to',
      fixed: true,
      width: size == 'small' ? 150 : 200,
      className: size == 'small' ? 'paddingL20' : 'paddingL30',
    },
    {
      title: '号码详情',
      dataIndex: 'mobDedail',
      key: 'mobDedail',
      width: 200,
      render: (_, record) => (
        <div>
          {record.mobileType}/{record.mobileArea}
        </div>
      ),
    },
    {
      title: '模板ID',
      dataIndex: 'sign',
      width: 120,
    },
    {
      title: '发送时间',
      dataIndex: 'send',
      width: 200,
    },
    {
      title: '送达时间',
      dataIndex: 'sent',
      width: 200,
    },
    {
      title: '计费(元)',
      dataIndex: 'fee',
      width: 100,
      render: (_, record) => <div>1</div>,
    },
    {
      title: '送达状态',
      dataIndex: 'status',
      width: 200,
      render: (_, record) => (
        <div className={statusStyle[record.status]}>
          {statusNum[record.status]}
        </div>
      ),
    },
  ]
  // 环装
  const getHuanSucOption = {
    tooltip: {
      trigger: 'item',
    },
    title: {
      text: '成功率 ',
      left: '32%',
      top: '46%',
      textStyle: {
        color: '#282b31',
        fontSize: 14,
        align: 'center',
      },
    },

    color: ['#C6CDCC', '#EFF9B4', '#0698EC'],
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '60%'],
        avoidLabelOverlap: false,
        center: ['40%', '50%'],
        label: {
          show: false,
          position: 'left',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [{ value: 1048 }, { value: 735 }, { value: 580 }],
      },
    ],
  }
  const getHuanFailOption = {
    tooltip: {
      trigger: 'item',
    },
    title: {
      text: '失败率 ',
      left: '32%',
      top: '46%',
      textStyle: {
        color: '#282b31',
        fontSize: 14,
        align: 'center',
      },
    },

    color: ['#EFF9B4', '#FF4D4F'],
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '60%'],
        avoidLabelOverlap: false,
        center: ['40%', '50%'],
        label: {
          show: false,
          position: 'left',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [{ value: 1048 }, { value: 735 }],
      },
    ],
  }

  return (
    <PageContent extClass='batchreport-detail'>
      <Form
        form={form}
        className='batchreport-detail-form p-b-60'
        name='batchreport-detail'
        layout='vertical'
        autoComplete='off'
        initialValues={{
          type: 'all',
          sendStatus: 'all',
          order_by: 'send',
        }}>
        <Image src={topIco} preview={false} width={72}></Image>
        <Flex
          justify='space-between'
          align='center'
          style={{ marginTop: '4px' }}>
          <div className='fn22 fw-500'>批量任务发送报告</div>

          <Button type='primary' size={point ? 'large' : 'middle'}>
            <i className='icon iconfont icon-shuaxin fn14 m-r-10'></i> 刷新状态
          </Button>
        </Flex>
        <Divider className='line'></Divider>

        <Row gutter={30}>
          <Col span={24} md={6} xl={8}>
            <div className='tem-view'>
              <div>演示文字</div>
              <span className='gray-color-sub fn12'>
                创建时间：2024-05-19 16：23：21
              </span>
              <div className='view-cont'></div>
              <div className='sign'>
                <IDIcon />
                <span>演示文字</span>
              </div>
            </div>
          </Col>
          <Col span={24} md={16} xl={16}>
            <table className='table-info'>
              <tbody>
                <tr>
                  <td>任务名称</td>
                  <td>{detailList?.title}</td>
                </tr>

                <tr>
                  <td>联系人</td>
                  <td>{detailList?.address}</td>
                </tr>
                <tr>
                  <td>短信回落</td>
                  <td>
                    {detailList && detailList.shortMessageSupported
                      ? '支持'
                      : '否'}
                  </td>
                </tr>

                <tr>
                  <td>彩信回落</td>
                  <td>
                    {detailList && detailList.multimediaMessageSupported
                      ? '支持'
                      : '否'}
                  </td>
                </tr>
                <tr>
                  <td>任务状态</td>
                  <td>
                    {detailList && detailList.status == '1'
                      ? '发送完成'
                      : detailList && detailList.status == '0'
                      ? '尚未开始'
                      : '已撤销'}
                  </td>
                </tr>
                <tr>
                  <td>Chatbot名称</td>
                  <td>{detailList?.chatbot_name}</td>
                </tr>
                <tr>
                  <td>提交任务时间</td>
                  <td>{detailList?.send}</td>
                </tr>
                <tr>
                  <td>任务完成时间</td>
                  <td>{detailList?.sent}</td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
        <Row className='m-t-30'>
          <Col span={24} md={8} xl={6}>
            <div className='api-info-item fx-y-center'>
              <img width='40' src={apiIco1} alt='' />
              <div className='m-l-20'>
                <span className='gray-color-sub'>API请求</span>
                <div>
                  {analysisDetailList && analysisDetailList.rate.request}
                </div>
              </div>
            </div>
          </Col>
          <Col span={24} md={8} xl={6}>
            <div className='api-info-item fx-y-center'>
              <img width='40' src={apiIco2} alt='' />
              <div className='m-l-20'>
                <span className='gray-color-sub'>发送成功</span>
                <div>
                  {analysisDetailList && analysisDetailList.rate.deliveryed}
                </div>
              </div>
            </div>
          </Col>
          <Col span={24} md={8} xl={6}>
            <div className='api-info-item fx-y-center'>
              <img width='40' src={apiIco4} alt='' />
              <div className='m-l-20'>
                <span className='gray-color-sub'>发送失败</span>
                <div>
                  {analysisDetailList && analysisDetailList.rate.dropped}
                </div>
              </div>
            </div>
          </Col>
          <Col span={24} md={8} xl={6}>
            <div className='api-info-item fx-y-center'>
              <img width='40' src={apiIco3} alt='' />
              <div className='m-l-20'>
                <span className='gray-color-sub'>计费</span>
                <div>{analysisDetailList && analysisDetailList.rate.fee}</div>
              </div>
            </div>
          </Col>
          <Col span={24} md={8} xl={6}>
            <div className='api-info-item fx-y-center'>
              <img width='40' src={apiIco6} alt='' />
              <div className='m-l-20'>
                <span className='gray-color-sub'>联系人</span>
                <div>{analysisDetailList && analysisDetailList.address}</div>
              </div>
            </div>
          </Col>
        </Row>

        <Row gutter={16} className='middle-part m-t-30'>
          <Col className='middle-part-item1' span={24} md={24} xl={12}>
            <div className='boder'>
              <div className='fn18'>成功分析</div>
              <div className='fx-y-center flex-wrap'>
                <div style={{ width: '280px' }}>
                  <ReactEcharts option={getHuanSucOption} />
                </div>
                <div className='title-info'>
                  <div className='fx-y-center'>
                    <span
                      className='yuan'
                      style={{ background: '#0698EC' }}></span>
                    <span className='title'>下发为5G消息</span> 54 (12%)
                  </div>
                  <div className='fx-y-center m-t-12 m-b-12'>
                    <span
                      className='yuan'
                      style={{ background: '#C6CDCC' }}></span>
                    <span className='title'>回落为彩信</span> 54 (12%)
                  </div>
                  <div className='fx-y-center'>
                    <span
                      className='yuan'
                      style={{ background: '#EFF9B4' }}></span>
                    <span className='title'>回落为彩信</span>54 (12%)
                  </div>
                </div>
              </div>
            </div>
          </Col>

          <Col className='middle-part-item1' span={24} md={24} xl={12}>
            <div className='boder'>
              <div className='fn18'>失败分析</div>
              <div className='fx-y-center flex-wrap'>
                <div style={{ width: '280px' }}>
                  <ReactEcharts option={getHuanFailOption} />
                </div>
                <div className='title-info'>
                  <div className='fx-y-center'>
                    <span
                      className='yuan'
                      style={{ background: '#FF4D4F' }}></span>
                    <span className='title' style={{ width: '170px' }}>
                      网关黑名单
                    </span>{' '}
                    54 (12%)
                  </div>
                  <div className='fx-y-center m-t-12'>
                    <span
                      className='yuan'
                      style={{ background: '#EFF9B4' }}></span>
                    <span className='title' style={{ width: '170px' }}>
                      空号/停机/关机/无法接通
                    </span>{' '}
                    54 (12%)
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row gutter={16} className='bottom-part m-t-20'>
          <Col span={24} md={24} xl={16}>
            <div className='border'>
              <div className='fn18'>热度分析</div>
              <div className='m-t-30 fx-between-center flex-wrap'>
                <div className='legend-content'>
                  <table className='legend-table'>
                    <tbody>
                      <tr className='title sticky-top'>
                        <td className='gray-color'>省份</td>
                        <td></td>
                        <td className='gray-color'>数量</td>
                        <td className='gray-color'>占比</td>
                      </tr>
                      {province.map((item, index) => (
                        <tr key={item.index}>
                          <td className='gray-color'>{item.province}</td>
                          <td width='45%;'>
                            <div className='progress'>
                              <div
                                className='progress-bar'
                                style={{
                                  width: calculatePercentagePro(item.cnt) + '%',
                                }}></div>
                            </div>
                          </td>
                          <td className='gray-color'>{item.cnt}</td>
                          <td className='gray-color'>
                            {calculatePercentagePro(item.cnt)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className='legend-content'>
                  <table className='legend-table'>
                    <tbody>
                      <tr className='title sticky-top'>
                        <td className='gray-color'>城市</td>
                        <td></td>
                        <td className='gray-color'>数量</td>
                        <td className='gray-color'>占比</td>
                      </tr>
                      {city.map((item, index) => (
                        <tr key={item.index}>
                          <td className='gray-color'>{item.city}</td>
                          <td width='45%;'>
                            <div className='progress'>
                              <div
                                className='progress-bar'
                                style={{
                                  width:
                                    calculatePercentageCity(item.cnt) + '%',
                                  backgroundColor: '#47d1cb',
                                }}></div>
                            </div>
                          </td>
                          <td className='gray-color'>{item.cnt}</td>
                          <td className='gray-color'>
                            {calculatePercentageCity(item.cnt)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Col>
          <Col span={24} md={24} xl={8}>
            <div className='border'>
              <div className='fn18'>热度分析</div>
              <div className='m-t-30'>
                <div className='fx-y-center'>
                  <img width='40' src={address} alt='' className='m-r-20' />
                  <div className='address-info'>
                    <div>地址簿1</div>
                    <span className='gray-color-sub fn12'>99个联系人</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Collapse
          className='m-t-30'
          defaultActiveKey={['1']}
          items={[
            {
              key: '1',
              label: '发送明细',
              children: (
                <Table
                  className='theme-cell reset-table'
                  columns={columns}
                  dataSource={historyList}
                  rowKey={'sendID'}
                  sticky
                  pagination={{
                    position: ['bottomRight'],
                    pageSize: 100,
                    pageSizeOptions: [100, 200, 300],
                  }}
                  scroll={{ x: 'max-content' }}
                />
              ),
            },
          ]}
        />
      </Form>
    </PageContent>
  )
}
