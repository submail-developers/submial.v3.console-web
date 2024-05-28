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
import { Outlet, useNavigate } from 'react-router-dom'
import ReactEcharts from 'echarts-for-react'
import type { CollapseProps } from 'antd'
// import { getErrorLogs } from '@/api'
import { API } from 'apis'
import topIco from '@/assets/rcs/batchreport/batchreport_ico.png'
import address from '@/assets/rcs/batchreport/address.png'
import './index.scss'

import { useSize, usePoint } from '@/hooks'

const { Option } = Select
const { Panel } = Collapse
export default function Fn() {
  const size = useSize()
  const point = usePoint('lg')

  const [form] = Form.useForm()
  const [getErrorList, setGetErrorList] = useState()
  const nav = useNavigate()
  // 获取错误日志
  // const getList = async () => {
  //   const res = await getErrorLogs({
  //     page: 1,
  //     start: '2022-05-20',
  //     end: '2024-05-22',
  //   })
  // }

  useEffect(() => {
    // getList()
  }, [])

  const dataSource = [
    {
      key: '1',
      mob: '15900898337',
      mobDedail: '中国移动/安徽/合肥',
      tempId: '12332233',
      sendTime: '2023-03-12 17:00',
      endTime: '2023-03-12 17:00',
      fee: '0',
      status: '发送完成',
    },
    {
      key: '1',
      mob: '15900898337',
      mobDedail: '中国移动/安徽/合肥',
      tempId: '12332233',
      sendTime: '2023-03-12 17:00',
      endTime: '2023-03-12 17:00',
      fee: '0',
      status: '发送完成',
    },
  ]

  const columns = [
    {
      title: '手机号',
      dataIndex: 'mob',
      key: 'mob',
      fixed: true,
      width: size == 'small' ? 150 : 200,
      className: size == 'small' ? 'paddingL20' : 'paddingL30',
    },
    {
      title: '号码详情',
      dataIndex: 'mobDedail',
      key: 'mobDedail',
      width: 180,
    },
    {
      title: '模板id',
      dataIndex: 'tempId',
      key: 'tempId',
      width: 120,
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      key: 'sendTime',
      width: 200,
    },
    {
      title: '送达时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 200,
    },
    {
      title: '计费(元)',
      dataIndex: 'fee',
      key: 'fee',
      width: 100,
    },
    {
      title: '送达状态',
      dataIndex: 'status',
      key: 'status',
      width: 200,
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
                  <td>1212</td>
                </tr>

                <tr>
                  <td>联系人</td>
                  <td>张胜男</td>
                </tr>
                <tr>
                  <td>短信回落</td>
                  <td>1212</td>
                </tr>

                <tr>
                  <td>彩信回落</td>
                  <td>1212</td>
                </tr>
                <tr>
                  <td>任务状态</td>
                  <td>发送成功</td>
                </tr>
                <tr>
                  <td>ChatBot名称</td>
                  <td>ChatBot1</td>
                </tr>
                <tr>
                  <td>提交任务时间</td>
                  <td>2024-05-12</td>
                </tr>
                <tr>
                  <td>任务完成时间</td>
                  <td>2024-05-13</td>
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
                <div>99</div>
              </div>
            </div>
          </Col>
          <Col span={24} md={8} xl={6}>
            <div className='api-info-item fx-y-center'>
              <img width='40' src={apiIco1} alt='' />
              <div className='m-l-20'>
                <span className='gray-color-sub'>API请求</span>
                <div>99</div>
              </div>
            </div>
          </Col>
          <Col span={24} md={8} xl={6}>
            <div className='api-info-item fx-y-center'>
              <img width='40' src={apiIco1} alt='' />
              <div className='m-l-20'>
                <span className='gray-color-sub'>API请求</span>
                <div>99</div>
              </div>
            </div>
          </Col>
          <Col span={24} md={8} xl={6}>
            <div className='api-info-item fx-y-center'>
              <img width='40' src={apiIco1} alt='' />
              <div className='m-l-20'>
                <span className='gray-color-sub'>API请求</span>
                <div>99</div>
              </div>
            </div>
          </Col>
          <Col span={24} md={8} xl={6}>
            <div className='api-info-item fx-y-center'>
              <img width='40' src={apiIco1} alt='' />
              <div className='m-l-20'>
                <span className='gray-color-sub'>API请求</span>
                <div>99</div>
              </div>
            </div>
          </Col>
          <Col span={24} md={8} xl={6}>
            <div className='api-info-item fx-y-center'>
              <img width='40' src={apiIco1} alt='' />
              <div className='m-l-20'>
                <span className='gray-color-sub'>API请求</span>
                <div>99</div>
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
          <Col span={24} md={24} xl={15}>
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
            </div>
          </Col>
          <Col span={24} md={24} xl={9}>
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

        <Collapse accordion className='m-t-30' defaultActiveKey={['1']}>
          <Panel header='发送明细' key='1'>
            <Table
              className='theme-cell reset-table'
              columns={columns}
              dataSource={dataSource}
              rowKey={'key'}
              sticky
              pagination={{
                position: ['bottomRight'],
                pageSize: 100,
                pageSizeOptions: [100, 200, 300],
              }}
              scroll={{ x: 'max-content' }}
            />
          </Panel>
        </Collapse>
      </Form>
      <Outlet />
    </PageContent>
  )
}
