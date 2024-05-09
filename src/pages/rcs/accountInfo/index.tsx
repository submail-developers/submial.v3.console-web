import { useState, useEffect } from 'react'
import { Flex, Space, Row, Col, Button, Divider, Image } from 'antd'
import { NavLink } from 'react-router-dom'
import PageContent from '@/components/pageContent'
import { getDicConfig } from '@/api'
import { API } from 'apis'
import jiqirenImg from '@/assets/rcs/gunali.png'
import './index.scss'
import yidong from '@/assets/rcs/operator/yidong.png'
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
              <NavLink to='/console/rcs/account/create/1'>
                <Button type='primary'>
                  <i className='icon iconfont icon-bianji'></i>编辑客户资料
                </Button>
              </NavLink>
            </Space>
          </Flex>
          <Divider className='line'></Divider>
          <div className='info-title' style={{ marginBottom: '20px' }}>
            客户信息
            <div className='fn16'>
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
            <div className='auditing-status fn14'>
              支持运营商 &nbsp;
              <img src={yidong} style={{ width: '30px' }} alt='' />
              &nbsp; 移动
            </div>
          </div>

          <table className='border'>
            <tbody>
              <tr>
                <td>客户名称</td>
                <td colSpan={3}>{customerData.customerName}</td>
              </tr>

              <tr>
                <td>联系人名称</td>
                <td>{customerData.customerContactName}</td>
                <td>联系人邮箱</td>
                <td>{customerData.customerContactEmail}</td>
              </tr>
              <tr>
                <td>联系人电话</td>
                <td colSpan={3}>{customerData.customerContactMob}</td>
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
                  {customerData.certificateType === '01'
                    ? '居民身份证'
                    : customerData.certificateType === '02'
                    ? '中国人民解放军军人身份证'
                    : customerData.certificateType === '03'
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
                <td>备注</td>
                <td colSpan={3}>-</td>
              </tr>
              <tr>
                <td>合同信息</td>
                <td colSpan={3}>
                  {customerData.contractAccessory && '已上传'}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </PageContent>
  )
}
