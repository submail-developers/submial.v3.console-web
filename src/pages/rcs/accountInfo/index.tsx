import { useState, useEffect } from 'react'
import { Flex, Space, Button, Divider, Image, Spin } from 'antd'
import { NavLink } from 'react-router-dom'
import PageContent from '@/components/pageContent'
import { getDicConfig, getIndustry } from '@/api'
import { API } from 'apis'
import faceImg from '@/assets/rcs/face/account.png'

import yidong from '@/assets/rcs/operator/yidong.png'

enum Status {
  '未提交' = 0,
  '审核通过' = 1,
  '审核未通过' = 2,
  '审核中' = 9,
}
enum StatusColor {
  'color-status-gray' = 0,
  'color-status-success' = 1,
  'color-status-error' = 2,
  'color-status-waiting' = 9,
}
const institutionLicenceTypes = {
  '01': '营业执照',
  '02': '组织机构代码证',
  '03': '事业单位法人证书',
  '04': '社会团体法人登记证书',
  '05': '军队代码',
  '06': '个体户（注册号）',
}

import './index.scss'

export default function Fn() {
  const [loading, setloading] = useState(false)
  const [customerData, setCustomerData] = useState<API.GetDicConfigItems>()
  const [industryText, setindustryText] = useState('')
  const [industryList, setIndustryList] = useState<API.IndustryItem[]>([])

  // 获取客户资料
  const getInfo = async () => {
    setloading(true)
    try {
      const res = await getDicConfig()
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
    getInfo()
  }, [])

  return (
    <PageContent extClass='account-detail'>
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center' style={{ height: 40 }}>
        <div className='fn22 fw-500'>客户资料管理</div>
        {['0', '1', '2'].includes(customerData?.status) && (
          <NavLink to='/console/rcs/account/create'>
            <Button
              type='primary'
              icon={<i className='icon iconfont icon-bianji'></i>}>
              编辑客户资料
            </Button>
          </NavLink>
        )}
      </Flex>
      <Divider />
      {customerData && (
        <>
          <div className='info-title m-b-20'>
            <div className='fx-between-center w-100'>
              <Space className='fw-400 fn13' align='center' size={12}>
                <span className='fw-500 fn18'>客户信息</span>
                <div
                  className={`g-radius-12 p-x-10 p-y-2 ${
                    StatusColor[customerData.status]
                  }`}>
                  {Status[customerData.status]}
                </div>
              </Space>
              <Space className='fw-500 fn14' align='center'>
                <span>支持运营商</span>
                <img src={yidong} style={{ width: '30px' }} alt='' />
                <span>移动</span>
              </Space>
            </div>
          </div>
          {customerData.status == '2' && (
            <div className='color-warning-red g-radius-4 p-x-16 p-y-8 fn13 m-t-24'>
              <span className='icon iconfont icon-dengpao fn12 m-r-2'></span>
              未通过原因：{customerData?.reject_reason || '-'}
            </div>
          )}
          <table className='cus-tab m-t-24'>
            <tbody>
              <tr>
                <td>客户名称</td>
                <td colSpan={3}>{customerData.customerName || '-'}</td>
              </tr>

              <tr>
                <td>联系人名称</td>
                <td>{customerData.customerContactName || '-'}</td>
                <td>联系人电话</td>
                <td>{customerData.customerContactMob || '-'}</td>
              </tr>
              <tr>
                <td>联系人邮箱</td>
                <td>{customerData.customerContactEmail || '-'}</td>
                <td>行业类型</td>
                <td>{industryText || '-'}</td>
              </tr>

              <tr>
                <td>证书编号/社会代码/注册号</td>
                <td>
                  {/* {institutionLicenceTypes[customerData.institutionLicenceType]} */}
                  {customerData.unifySocialCreditCodes || '-'}
                </td>
                <td>责任人姓名</td>
                <td>{customerData.enterpriseOwnerName || '-'}</td>
              </tr>
              <tr>
                <td>责任人证件类型</td>
                <td>
                  {customerData.certificateType === '01'
                    ? '居民身份证'
                    : customerData.certificateType === '02'
                    ? '中国人民解放军军人身份证'
                    : customerData.certificateType === '03'
                    ? '中国人民武装警察身份证件'
                    : '-'}
                </td>
                <td>责任人证件号码</td>
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
                  {customerData.contractAccessory ? (
                    <>
                      <span className='icon iconfont icon-lianjie fn12 m-r-4 gray-color'></span>
                      <a
                        className='fn14 fw-400'
                        style={{ textDecoration: 'underline' }}
                        href={customerData.contractAccessory}
                        target='blank'>
                        查看文件
                      </a>
                    </>
                  ) : (
                    '-'
                  )}
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
