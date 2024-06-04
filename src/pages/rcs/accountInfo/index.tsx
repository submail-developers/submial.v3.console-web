import { useState, useEffect } from 'react'
import { Flex, Space, Row, Col, Button, Divider, Image, Spin } from 'antd'
import { NavLink } from 'react-router-dom'
import PageContent from '@/components/pageContent'
import { getDicConfig, getIndustry } from '@/api'
import { API } from 'apis'
import jiqirenImg from '@/assets/rcs/gunali.png'
import yidong from '@/assets/rcs/operator/yidong.png'
interface DataType extends API.GetDicConfigItems {}

import './index.scss'

export default function Fn() {
  const [loading, setloading] = useState(false)
  const [customerData, setCustomerData] = useState<API.GetDicConfigItems>()
  const [industryText, setindustryText] = useState('')
  const [industryList, setIndustryList] = useState<API.IndustryItem[]>([])

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
  // 获取行业类型
  const getIndustryList = async () => {
    try {
      const res = await getIndustry()
      setIndustryList(res.data)
    } catch (error) {}
  }

  useEffect(() => {
    if (customerData && industryList.length > 0) {
      industryList.forEach((item) => {
        if (item.value == customerData.businessType) {
          item.children.forEach((i) => {
            if (i.value == customerData.industryTypeCode) {
              setindustryText(`${item.label} / ${i.label}`)
            }
          })
        }
      })
    }
  }, [customerData, industryList])

  useEffect(() => {
    getIndustryList()
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
            {['1', '2'].includes(customerData.status) && (
              <NavLink to='/console/rcs/account/create/1'>
                <Button
                  type='primary'
                  icon={<i className='icon iconfont icon-bianji'></i>}>
                  编辑客户资料
                </Button>
              </NavLink>
            )}
          </Flex>
          <Divider className='line'></Divider>
          <div className='info-title m-b-20'>
            客户信息
            <div className='fn13'>
              {customerData.status == '0' ? (
                <span className='gray-color'>未提交</span>
              ) : customerData.status == '1' ? (
                <span className='color-status-success'>审核通过</span>
              ) : customerData.status == '2' ? (
                <span className='color-status-error'>未通过</span>
              ) : (
                <span className='color-status-waiting'>审核中</span>
              )}
            </div>
            <div className='auditing-status fn14'>
              支持运营商 &nbsp;
              <img src={yidong} style={{ width: '30px' }} alt='' />
              &nbsp; 移动
            </div>
          </div>
          {customerData.status == '2' && customerData.reject_reason && (
            <div className='color-warning-red g-radius-4 p-x-16 p-y-8 fn13 m-t-24'>
              <span className='icon iconfont icon-dengpao fn12 m-r-2'></span>
              未通过原因：{customerData.reject_reason}
            </div>
          )}
          <table className='border m-t-24'>
            <tbody>
              <tr>
                <td>客户名称</td>
                <td colSpan={3}>{customerData.customerName}</td>
              </tr>

              <tr>
                <td>联系人名称</td>
                <td>{customerData.customerContactName}</td>
                <td>联系人电话</td>
                <td>{customerData.customerContactMob}</td>
              </tr>
              <tr>
                <td>联系人邮箱</td>
                <td>{customerData.customerContactEmail}</td>
                <td>行业类型</td>
                <td>{industryText || '-'}</td>
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
                <td>企业logo</td>
                <td colSpan={3}>
                  {customerData.companyLogo ? (
                    <Image
                      width={40}
                      height={40}
                      preview={false}
                      src={customerData.companyLogo || ''}
                    />
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
              <tr>
                <td>合同名称</td>
                <td>{customerData.contractName || '-'}</td>
                <td>合同编号</td>
                <td>{customerData.contractNo || '-'}</td>
              </tr>
              <tr>
                <td>合同生效期</td>
                <td>{customerData.contractEffectiveDate || '-'}</td>
                <td>合同失效期</td>
                <td>{customerData.contractExpiryDate || '-'}</td>
              </tr>
              <tr>
                <td>合同是否续签</td>
                <td>{customerData.contractRenewStatus == '0' ? '是' : '否'}</td>
                <td>自动续签日期</td>
                <td>{customerData.contractRenewDate || '-'}</td>
              </tr>
              <tr>
                <td>合同电子扫描件</td>
                <td colSpan={3}>
                  <span className='icon iconfont icon-lianjie fn12 m-r-4 gray-color'></span>
                  <a
                    className='fn14 fw-400'
                    style={{ textDecoration: 'underline' }}
                    href={customerData.contractAccessory}
                    target='blank'>
                    查看文件
                  </a>
                </td>
              </tr>
              <tr>
                <td>备注</td>
                <td colSpan={3}>{customerData.remarkText || '-'}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
      {loading && (
        <div className='fx-center-center m-t-32'>
          <Spin />
        </div>
      )}
    </PageContent>
  )
}
