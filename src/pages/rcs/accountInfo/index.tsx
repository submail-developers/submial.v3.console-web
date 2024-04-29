import { useState, useEffect } from 'react'
import { Flex, Space, Row, Col, Button, Divider, Image } from 'antd'
import { NavLink } from 'react-router-dom'
import PageContent from '@/components/pageContent'
import { getDicConfig } from '@/api'
import { API } from 'apis'
import jiqirenImg from '@/assets/rcs/gunali.png'
import './index.scss'

interface DataType extends API.GetDicConfigItems {}

type DownLoadProps = {
  fileName: string
  url: string
}

const DownLoad = ({ url, fileName }: DownLoadProps) => {
  const arr = url.split('.')
  const suffix = arr[arr.length - 1]

  return (
    <>
      {fileName}
      <a
        href={
          'https://asset.usm.cn/3fdf9da0-adb3-42f5-bb87-2f3b3b665d62.jpg?imageView2/0/format/webp/q/100/ignore-error/1'
        }
        target='_blank'
        download={`${fileName}.${suffix}`}
        title='点击下载'>
        .{suffix}
      </a>
    </>
  )
}

export default function Fn() {
  const [loading, setloading] = useState(false)
  const [customerData, setCustomerData] = useState<API.GetDicConfigItems>()
  const [auditingStatus, setAuditingStatus] = useState()

  // 获取客户资料
  const search = async (ifshowLoading = false) => {
    try {
      ifshowLoading && setloading(true)
      const params = ''
      const res = await getDicConfig(params)
      setCustomerData(res.data)
      setloading(false)
    } catch (error) {
      setloading(false)
    }
  }
  useEffect(() => {
    search(true)
  }, [])

  return (
    <PageContent extClass='account-detail'>
      {customerData && (
        <>
          <Image src={jiqirenImg} preview={false} width={72}></Image>
          <Flex
            justify='space-between'
            align='center'
            style={{ marginTop: '4px' }}>
            <div className='fn22 fw-500'>客户资料管理</div>
            <Space>
              <NavLink to='/console/rcs/account/create/0'>
                <Button type='primary'>
                  <i className='icon iconfont icon-bianji'></i>编辑
                </Button>
              </NavLink>

              <Button type='primary' danger>
                <i className='icon iconfont icon-shanchu'></i>
                删除
              </Button>
            </Space>
          </Flex>
          <Divider className='line'></Divider>
          <div className='info-title' style={{ marginBottom: '20px' }}>
            客户信息
            <div className='auditing-status fn16'>
              审核状态
              {customerData.status == '0' ? (
                <span className='gray-color'>未提交</span>
              ) : customerData.status == '1' ? (
                <span className='color-status-success'>审核通过</span>
              ) : customerData.status == '2' ? (
                <span className='color-status-error'>未通过</span>
              ) : (
                <span className='color-status-waiting'>待审核</span>
              )}
            </div>
          </div>

          <table className='border'>
            <tbody>
              <tr>
                <td>客户名称</td>
                <td colSpan={3}>{customerData.customerName}</td>
              </tr>
              <tr>
                <td>客户邮箱</td>
                <td>{customerData.customerContactEmail}</td>
                <td>客户电话</td>
                <td>{customerData.customerContactMob}</td>
              </tr>
              <tr>
                <td>归属区域</td>
                <td colSpan={3}>{customerData.belongRegionCode}</td>
              </tr>
              <tr>
                <td>客户详细地址</td>
                <td colSpan={3}>
                  上海市普陀区金沙江路1977弄金环商务花园3座705
                </td>
              </tr>
              <tr>
                <td>企业统一社会代码</td>
                <td>
                  {customerData.unifySocialCreditCodes == null
                    ? '-'
                    : customerData.unifySocialCreditCodes}
                </td>
                <td>企业责任人姓名</td>
                <td>
                  {customerData.enterpriseOwnerName == null
                    ? '-'
                    : customerData.enterpriseOwnerName}
                </td>
              </tr>
              <tr>
                <td>企业责任人证件类型</td>
                <td>
                  {customerData.certificateType == '1'
                    ? '居民身份证'
                    : customerData.certificateType == '2'
                    ? '中国人民解放军军人身份证'
                    : customerData.certificateType == '3'
                    ? '中国人民武装警察身份证件'
                    : '-'}
                </td>
                <td>企业责任人证件号码</td>
                <td>
                  {customerData.certificateCode == null
                    ? '-'
                    : customerData.certificateCode}
                </td>
              </tr>
              <tr>
                <td>营业执照</td>
                <td colSpan={3}>yingyezhizhao.pdf</td>
              </tr>
              <tr>
                <td>备注</td>
                <td colSpan={3}>-</td>
              </tr>
              <tr>
                <td>合同信息</td>
                <td colSpan={3}>
                  <DownLoad
                    fileName={customerData.contractName}
                    url={customerData.contractAccessory}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </PageContent>
  )
}
