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
import { DownOutlined } from '@ant-design/icons'
import { getUnionAnalysis, getChatbot } from '@/api'
import { API } from 'apis'
import topIco from '@/assets/rcs/analysis/analysis_ico.png'
import apiIco1 from '@/assets/rcs/analysis/apiInfo1.png'
import apiIco2 from '@/assets/rcs/analysis/apiInfo2.png'
import apiIco3 from '@/assets/rcs/analysis/apiInfo3.png'
import apiIco4 from '@/assets/rcs/analysis/apiInfo4.png'
import apiIco5 from '@/assets/rcs/analysis/apiInfo5.png'
import apiIco6 from '@/assets/rcs/analysis/apiInfo6.png'
import { getApiIcoPath } from './type'

import './index.scss'
import { useSize, usePoint } from '@/hooks'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import ReactEcharts from 'echarts-for-react'
const { Option } = Select
const { RangePicker } = DatePicker

const allChatBot = {
  id: 'all',
  name: '全部ChatBot',
} as API.ChatbotItem

export default function Fn() {
  const size = useSize()
  const point = usePoint('lg')
  const [form] = Form.useForm()
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(40)
  const [total, setTotal] = useState<number>(0)
  const [chatBotList, setChatBotList] = useState<API.ChatbotItem[]>([
    allChatBot,
  ])
  const [rate, setRate] = useState([])
  const [city, setCity] = useState([])
  const [cityTotal, setCityTotal] = useState([])
  const [province, setProvince] = useState([])
  const [provinceTotal, setProvinceTotal] = useState([])

  const [pointsData, setPointsData] = useState(null)

  const [selectedRange, setSelectedRange] = useState([])
  const [chartData, setChartData] = useState({
    request: [],
    deliveryed: [],
    dropped: [],
    fee: [],
  })
  const [dates, setDates] = useState([])

  const [deliveryed, setDeliveryed] = useState('') //成功率
  const [dropped, setDropped] = useState('') //失败率

  const [fiveg, setFiveg] = useState('') //5g
  const [sms, setSms] = useState('') //短信
  const [mms, setMms] = useState('') //彩信

  const [fivegNum, setFivegNum] = useState('') //5gnum
  const [smsNum, setSmsNum] = useState('') //短信num
  const [mmsNum, setMmsNum] = useState('') //彩信num

  // 理由
  const [noNewsReason, setNoNewsReason] = useState('')
  const [noSignReason, setNoSignReason] = useState('')
  const [netBlackReason, setNetBlackReason] = useState('')
  //数量
  const [noNewsNum, setNoNewsNum] = useState('')
  const [noSignNum, setNoSignNum] = useState('')
  const [netBlackNum, setNetBlackNum] = useState('')
  //
  const [noNews, setNoNews] = useState('') //无法投递消息
  const [noSign, setNoSign] = useState('') //短信签名受限
  const [netBlack, setNetBlack] = useState('') //网关黑名单

  useEffect(() => {
    console.log(selectedRange)
    if (selectedRange.length === 2) {
      const startDate = selectedRange[0]
      const endDate = selectedRange[1]

      const allDates = []
      for (
        let date = new Date(startDate);
        date <= new Date(endDate);
        date.setDate(date.getDate() + 1)
      ) {
        allDates.push(date.toISOString().split('T')[0])
        setDates(allDates)
      }

      const alignedData = {
        request: alignSeries(pointsData.request, allDates),
        deliveryed: alignSeries(pointsData.deliveryed, allDates),
        dropped: alignSeries(pointsData.dropped, allDates),
        fee: alignSeries(pointsData.fee, allDates),
      }
      setChartData(alignedData)
    }
  }, [selectedRange, pointsData])

  const alignSeries = (series, dates) => {
    return dates.map((date) => {
      const match = series.find((item) => item.dateflg === date)
      return match ? match.cnt : 0
    })
  }
  const onRangeChange = (dates) => {
    getList()
    setSelectedRange(dates)
  }
  const getOption = () => {
    const option = {
      tooltip: {
        trigger: 'axis',
      },
      color: ['#1764ff', '#00a97b', '#f00011', '#f19d25'],
      xAxis: {
        type: 'category',
        data: dates,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '发送',
          data: chartData.request,
          type: 'line',
        },
        {
          name: '成功',
          data: chartData.deliveryed,
          type: 'line',
        },
        {
          name: '失败',
          data: chartData.dropped,
          type: 'line',
        },
        {
          name: '计费',
          data: chartData.fee,
          type: 'line',
        },
      ],
    }
    return option
  }

  // 获取chatbot
  const getChatbotList = async () => {
    try {
      const res = await getChatbot({
        page: currentPage,
        limit: pageSize,
        appid: '',
        keywords: '',
        status: 'all',
      })
      setChatBotList([...chatBotList, ...res.list])
    } catch (error) {}
  }

  // 获取分析报告
  const getList = async () => {
    try {
      const formValues = form.getFieldsValue()
      const start =
        (formValues.time && formValues.time[0].format('YYYY-MM-DD')) || ''
      const end =
        (formValues.time && formValues.time[1].format('YYYY-MM-DD')) || ''
      const res = await getUnionAnalysis({
        appid: formValues.chatbot,
        start,
        end,
      })
      if (res.status == 'success') {
        let arr = []
        arr.push(res.analysis.rate)
        setRate(arr)
        setPointsData(res.analysis.points)

        // 总数
        let totalCount =
          parseInt(res.analysis.rate.deliveryed) +
          parseInt(res.analysis.rate.dropped)

        // 成功率
        let _suc = (
          (parseInt(res.analysis.rate.deliveryed) / totalCount) *
          100
        ).toFixed(2)
        setDeliveryed(_suc)
        // 失败率
        let _fail = (
          (parseInt(res.analysis.rate.dropped) / totalCount) *
          100
        ).toFixed(2)
        setDropped(_fail)

        // 总数 -5g sms mms
        let total5gsms = res.analysis.successreason.reduce(
          (sum, item) => sum + parseInt(item.cnt),
          0,
        )

        let fiveg = res.analysis.successreason[0].cnt
        let sms = res.analysis.successreason[1].cnt
        let mms = res.analysis.successreason[2].cnt
        setFivegNum(fiveg)
        setSmsNum(sms)
        setMmsNum(mms)

        let _fiveg = ((parseInt(fiveg) / total5gsms) * 100).toFixed(2)
        let _sms = ((parseInt(sms) / total5gsms) * 100).toFixed(2)
        let _mms = ((parseInt(mms) / total5gsms) * 100).toFixed(2)
        setFiveg(_fiveg)
        setSms(_sms)
        setMms(_mms)

        let totalFail = res.analysis.dropreason.reduce(
          (sum, item) => sum + parseInt(item.cnt),
          0,
        )
        let _noNewsReason = res.analysis.dropreason[0].reason
        let _noNews = res.analysis.dropreason[0].cnt
        setNoNewsReason(_noNewsReason)
        setNoNewsNum(_noNews)
        let noNews = ((parseInt(_noNews) / totalFail) * 100).toFixed(2)
        setNoNews(noNews)

        let _noSignReason = res.analysis.dropreason[1].reason
        let _noSign = res.analysis.dropreason[1].cnt
        setNoSignReason(_noSignReason)
        setNoSignNum(_noSign)
        let noSign = ((parseInt(_noSign) / totalFail) * 100).toFixed(2)
        setNoSign(noNews)

        let _netBlackReason = res.analysis.dropreason[2].reason
        let _netBlackNum = res.analysis.dropreason[2].cnt
        setNetBlackReason(_netBlackReason)
        setNetBlackNum(_netBlackNum)
        let netBlack = ((parseInt(_netBlackNum) / totalFail) * 100).toFixed(2)
        setNetBlack(netBlack)

        let cityToalArr = []
        let _cityData = res.analysis.city.map((item, index) => {
          cityToalArr.push(item.cnt)
          let obj = { ...item, index: `${index}` }
          return obj
        })
        setCity(_cityData)
        setCityTotal(cityToalArr)

        let provinceTotalArr = []
        let _provinceData = res.analysis.province.map((item, index) => {
          provinceTotalArr.push(item.cnt)
          let obj = { ...item, index: `${index}` }
          return obj
        })
        setProvince(_provinceData)
        setProvinceTotal(provinceTotalArr)
      }
    } catch (error) {}
  }

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

  useEffect(() => {
    getList()
    getChatbotList()
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

  // 环装
  const getHuanSucOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    title: {
      text: `成功率：${deliveryed}%`,
      left: '21%',
      top: '46%',
      textStyle: {
        color: '#282b31',
        fontSize: 13,
        align: 'center',
      },
    },

    color: ['#0698EC', '#47D1CB', '#9DF3FF'],
    series: [
      {
        type: 'pie',
        radius: ['40%', '60%'],
        avoidLabelOverlap: false,
        center: ['40%', '50%'],
        label: {
          show: false,
          position: 'left',
        },

        labelLine: {
          show: false,
        },

        data: [
          { name: '下发为5G消息', value: fivegNum },
          { name: '回落为短信', value: smsNum },
          { name: '回落为彩信', value: mmsNum },
        ],
      },
    ],
  }
  const getHuanFailOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    title: {
      text: `失败率 ${dropped}%`,
      left: '22%',
      top: '46%',
      textStyle: {
        color: '#282b31',
        fontSize: 13,
        align: 'center',
      },
    },

    color: ['#FF4D4F', '#ffba00', '#fd7e14'],
    series: [
      {
        type: 'pie',
        radius: ['40%', '60%'],
        avoidLabelOverlap: false,
        center: ['40%', '50%'],
        label: {
          show: false,
          position: 'left',
        },
        labelLine: {
          show: false,
        },
        data: [
          { name: noNewsReason, value: noNewsNum },
          { name: noSignReason, value: noSignNum },
          { name: netBlackReason, value: netBlackNum },
        ],
      },
    ],
  }

  return (
    <PageContent extClass='api-analysis'>
      <Form
        form={form}
        className='api-analysis-form p-b-80'
        name='api-analysis'
        layout='vertical'
        autoComplete='off'
        initialValues={{
          chatbot: 'all',
          time: [dayjs().add(-15, 'd'), dayjs().add(0, 'd')],
        }}>
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
              label='ChatBot选择'
              name='chatbot'
              style={{ marginBottom: '0px' }}>
              <Select placeholder='所有标签' popupMatchSelectWidth={120}>
                {chatBotList.map((option) => (
                  <Option key={option.id} value={option.id}>
                    {option.name}
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
                clearIcon={false}
                presets={rangePresets}
                onChange={onRangeChange}
                style={{ width: size == 'small' ? 190 : 240 }}></RangePicker>
            </Form.Item>
          </Col>
          <Col span={6} md={4} xl={3}>
            <Form.Item label=' '>
              <Button
                type='primary'
                className='w-100'
                htmlType='submit'
                onClick={() => getList()}>
                查询
              </Button>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} className='top-part'>
          <Col span={24} md={24} xl={12}>
            <div className='fn18'>API发送概览</div>
            <ReactEcharts
              option={getOption()}
              style={{ height: '300px', width: '100%' }}
            />
          </Col>
          <Col span={24} md={24} xl={12}>
            <div className='api-info fx-between-center'>
              <div className='api-info-item fx-y-center'>
                <img width='40' src={apiIco1} alt='' />
                <div className='m-l-20'>
                  <span className='gray-color-sub'>API请求</span>
                  <div>{rate.length > 0 && rate[0].request}</div>
                </div>
              </div>
              <div className='api-info-item fx-y-center'>
                <img width='40' src={apiIco2} alt='' />
                <div className='m-l-20'>
                  <span className='gray-color-sub'>发送成功</span>
                  <div>{rate.length > 0 && rate[0].deliveryed}</div>
                </div>
              </div>
              <div className='api-info-item fx-y-center'>
                <img width='40' src={apiIco4} alt='' />
                <div className='m-l-20'>
                  <span className='gray-color-sub'>发送失败</span>
                  <div>{rate.length > 0 && rate[0].dropped} </div>
                </div>
              </div>
              <div className='api-info-item fx-y-center'>
                <img width='40' src={apiIco3} alt='' />
                <div className='m-l-20'>
                  <span className='gray-color-sub'>实际收费</span>
                  <div>{rate.length > 0 && rate[0].fee}</div>
                </div>
              </div>
              <div className='api-info-item fx-y-center'>
                <img width='40' src={apiIco6} alt='' />
                <div className='m-l-20'>
                  <span className='gray-color-sub'>联系人</span>
                  <div>{rate.length > 0 && rate[0].address}</div>
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
                    <span className='title'>下发为5G消息</span> {fivegNum} (
                    {fiveg}%)
                  </div>
                  <div className='fx-y-center m-t-12 m-b-12'>
                    <span
                      className='yuan'
                      style={{ background: '#47D1CB' }}></span>
                    <span className='title'>回落为短信</span> {smsNum} ({sms}%)
                  </div>
                  <div className='fx-y-center'>
                    <span
                      className='yuan'
                      style={{ background: '#9DF3FF' }}></span>
                    <span className='title'>回落为彩信</span>
                    {mmsNum} ({mms}%)
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
                    <span className='title' style={{ width: '120px' }}>
                      {noNewsReason}
                    </span>
                    {noNewsNum} ({noNews}%)
                  </div>
                  <div className='fx-y-center m-t-12'>
                    <span
                      className='yuan'
                      style={{ background: '#ffba00' }}></span>
                    <span className='title' style={{ width: '120px' }}>
                      {noSignReason}
                    </span>{' '}
                    {noSignNum} ({noSign}%)
                  </div>
                  <div className='fx-y-center m-t-12'>
                    <span
                      className='yuan'
                      style={{ background: '#fd7e14' }}></span>
                    <span className='title' style={{ width: '120px' }}>
                      {netBlackReason}
                    </span>{' '}
                    {netBlackNum} ({netBlack}%)
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
                                width: calculatePercentageCity(item.cnt) + '%',
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
          </Col>
        </Row>
      </Form>
    </PageContent>
  )
}
