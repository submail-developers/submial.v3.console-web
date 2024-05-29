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
} from 'antd'
import PageContent from '@/components/pageContent'
import MyFormItem from '@/components/myFormItem/myFormItem'
import { DownOutlined } from '@ant-design/icons'
// import { getErrorLogs } from '@/api'
import { API } from 'apis'
import topIco from '@/assets/rcs/analysis/analysis_ico.png'
import apiIco1 from '@/assets/rcs/analysis/apiInfo1.png'
import apiIco2 from '@/assets/rcs/analysis/apiInfo2.png'
import apiIco3 from '@/assets/rcs/analysis/apiInfo3.png'
import apiIco4 from '@/assets/rcs/analysis/apiInfo4.png'
import apiIco5 from '@/assets/rcs/analysis/apiInfo5.png'
import apiIco6 from '@/assets/rcs/analysis/apiInfo6.png'
import './index.scss'
import { useSize, usePoint } from '@/hooks'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import ReactEcharts from 'echarts-for-react'
const { Option } = Select
const { RangePicker } = DatePicker
interface FormValues {
  chatbot: any
  time: [Dayjs, Dayjs] | null
}

export default function Fn() {
  const size = useSize()
  const point = usePoint('lg')
  const [form] = Form.useForm()
  const [getErrorList, setGetErrorList] = useState()

  // 获取错误日志
  // const getList = async () => {
  //   const res = await getErrorLogs({
  //     page: 1,
  //     start: '2022-05-20',
  //     end: '2024-05-22',
  //   })
  // }

  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      console.log('From: ', dates[0], ', to: ', dates[1])
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
    } else {
      console.log('Clear')
    }
  }

  useEffect(() => {
    // getList()
  }, [])

  const rangePresets: {
    label: string
    value: [Dayjs, Dayjs]
  }[] = [
    {
      label: '最近 7 天',
      value: [dayjs().add(-7, 'd'), dayjs()],
    },
    {
      label: '最近 15 天',
      value: [dayjs().add(-15, 'd'), dayjs()],
    },
    {
      label: '最近一个月',
      value: [dayjs().add(-30, 'd'), dayjs()],
    },
    {
      label: '最近三个月',
      value: [dayjs().add(-90, 'd'), dayjs()],
    },
  ]

  const chatOptions = [
    {
      value: 0,
      label: '全部ChatBot',
    },
  ]
  const initFormValues: FormValues = {
    chatbot: chatOptions[0],
    time: [dayjs().add(-1, 'd'), dayjs().add(0, 'd')],
  }
  const items = [
    {
      label: '导出 TXT (仅手机号码)',
      key: '0',
    },
    {
      label: '导出 CSV',
      key: '1',
    },

    {
      label: '导出 EXCEL',
      key: '2',
    },
    {
      label: '导出 JSON',
      key: '3',
    },
    {
      label: '导出 XML',
      key: '4',
    },
  ]
  const edit = async (e) => {
    console.log(e)
  }
  // 折线
  const getLineOption = () => ({
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
      },
    ],
  })
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

  const tableList = [
    {
      id: 0,
      name: '福建省',
      count: '2134',
      zhanbi: '24%',
    },
    {
      id: 1,
      name: '广东省',
      count: '134',
      zhanbi: '14%',
    },
    {
      id: 2,
      name: '湖北省',
      count: '12234',
      zhanbi: '34%',
    },
    {
      id: 3,
      name: '江苏省',
      count: '1134',
      zhanbi: '34%',
    },
    {
      id: 4,
      name: '安徽省',
      count: '34',
      zhanbi: '4%',
    },
    {
      id: 5,
      name: '上海市',
      count: '2134',
      zhanbi: '24%',
    },
  ]

  return (
    <PageContent extClass='api-analysis'>
      <Form
        form={form}
        className='api-analysis-form p-b-80'
        name='api-analysis'
        layout='vertical'
        autoComplete='off'
        initialValues={initFormValues}>
        <Image src={topIco} preview={false} width={72}></Image>
        <Flex
          justify='space-between'
          align='center'
          style={{ marginTop: '4px' }}>
          <div className='fn22 fw-500'>API分析报告</div>
          <Button type='primary' size={point ? 'large' : 'middle'}>
            <Dropdown
              className='export'
              menu={{ items, selectable: true, onClick: edit }}
              trigger={['click']}>
              <Space>
                导出
                <DownOutlined rev={null} />
              </Space>
            </Dropdown>
          </Button>
        </Flex>
        <Divider className='line'></Divider>

        <Row gutter={16}>
          <Col className='m-b-20' span={8} md={8} lg={6} xl={4}>
            <Form.Item
              label='全部ChatBot'
              name='chatbot'
              style={{ marginBottom: '0px' }}>
              <Select placeholder='所有标签' popupMatchSelectWidth={120}>
                {chatOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col className='m-b-20'>
            <Form.Item
              label='时间范围'
              name='time'
              style={{ marginBottom: '0px' }}>
              <RangePicker
                size={size}
                clearIcon={false}
                presets={rangePresets}
                onChange={onRangeChange}
                style={{ width: size == 'small' ? 190 : 240 }}></RangePicker>
            </Form.Item>
          </Col>
        </Row>

        <Row className='top-part'>
          <Col span={24} md={24} xl={12}>
            <div className='fn18'>API发送概览</div>
            <ReactEcharts
              option={getLineOption()}
              style={{ height: '300px', width: '100%' }}
              // 其他需要的属性
            />
          </Col>
          <Col span={24} md={24} xl={12}>
            <div className='api-info fx-between-center'>
              <div className='api-info-item fx-y-center'>
                <img width='40' src={apiIco1} alt='' />
                <div className='m-l-20'>
                  <span className='gray-color-sub'>API请求</span>
                  <div>99</div>
                </div>
              </div>
              <div className='api-info-item fx-y-center'>
                <img width='40' src={apiIco2} alt='' />
                <div className='m-l-20'>
                  <span className='gray-color-sub'>发送成功</span>
                  <div>1233</div>
                </div>
              </div>
              <div className='api-info-item fx-y-center'>
                <img width='40' src={apiIco3} alt='' />
                <div className='m-l-20'>
                  <span className='gray-color-sub'>实际收费</span>
                  <div>1</div>
                </div>
              </div>
              <div className='api-info-item fx-y-center'>
                <img width='40' src={apiIco4} alt='' />
                <div className='m-l-20'>
                  <span className='gray-color-sub'>发送失败</span>
                  <div>1</div>
                </div>
              </div>
              <div className='api-info-item fx-y-center'>
                <img width='40' src={apiIco5} alt='' />
                <div className='m-l-20'>
                  <span className='gray-color-sub'>消息上行</span>
                  <div>1</div>
                </div>
              </div>
              <div className='api-info-item fx-y-center'>
                <img width='40' src={apiIco6} alt='' />
                <div className='m-l-20'>
                  <span className='gray-color-sub'>联系人</span>
                  <div>1</div>
                </div>
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

        <Row className='bottom-part m-t-20'>
          <Col span={24} md={24} xl={16}>
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
                    {tableList.map((item, index) => (
                      <tr>
                        <td className='gray-color'>{item.name}</td>
                        <td width='45%;'>
                          <div className='progress'>
                            <div
                              className='progress-bar'
                              style={{ width: item.zhanbi }}></div>
                          </div>
                        </td>
                        <td className='gray-color'>{item.count}</td>
                        <td className='gray-color'>{item.zhanbi}</td>
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
                    {tableList.map((item, index) => (
                      <tr>
                        <td className='gray-color'>{item.name}</td>
                        <td width='45%;'>
                          <div className='progress'>
                            <div
                              className='progress-bar'
                              style={{
                                width: item.zhanbi,
                                backgroundColor: '#47d1cb',
                              }}></div>
                          </div>
                        </td>
                        <td className='gray-color'>{item.count}</td>
                        <td className='gray-color'>{item.zhanbi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    </PageContent>
  )
}
