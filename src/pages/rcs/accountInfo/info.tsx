import { useState, useEffect } from 'react'
import { Descriptions, Image } from 'antd'
import type { DescriptionsProps } from 'antd'
import { API } from 'apis'
import { getIndustry } from '@/api'

type Props = {
  customerData?: API.GetDicConfigItems
}

const span = {
  xs: 2,
  sm: 2,
  md: 2,
  lg: 1,
  xl: 1,
  xxl: 1,
}

const certificateTypes = {
  '01': '居民身份证',
  '02': '中国人民解放军军人身份证',
  '03': '中国人民武装警察身份证件',
}

export default function Fn({ customerData }: Props) {
  const [industryText, setindustryText] = useState('')
  const [industryList, setIndustryList] = useState<API.IndustryItem[]>([])
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
  }, [])

  const items: DescriptionsProps['items'] = [
    {
      label: '客户名称',
      span: 2,
      children: customerData.customerName || '-',
    },
    {
      label: '联系人名称',
      span: span,
      children: customerData.customerContactName || '-',
    },
    {
      label: '联系人电话',
      span: span,
      children: customerData.customerContactMob || '-',
    },
    {
      label: '联系人邮箱',
      span: span,
      children: customerData.customerContactEmail || '-',
    },
    {
      label: '行业类型',
      span: span,
      children: industryText || '-',
    },
    {
      label: '证书编号/社会代码/注册号',
      span: span,
      children: customerData.unifySocialCreditCodes || '-',
    },
    {
      label: '责任人姓名',
      span: span,
      children: customerData.enterpriseOwnerName || '-',
    },
    {
      label: '责任人证件类型',
      span: span,
      children: certificateTypes[customerData.certificateType] || '-',
    },
    {
      label: '责任人证件号码',
      span: span,
      children: customerData.certificateCode || '-',
    },
    {
      label: '企业logo',
      span: 2,
      children: (
        <>
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
        </>
      ),
    },
    {
      label: '合同名称',
      span: span,
      children: customerData.contractName || '-',
    },
    {
      label: '合同编号',
      span: span,
      children: customerData.contractNo || '-',
    },
    {
      label: '合同生效期',
      span: span,
      children: customerData.contractEffectiveDate || '-',
    },
    {
      label: '合同失效期',
      span: span,
      children: customerData.contractExpiryDate == '0' ? '是' : '否',
    },
    {
      label: '合同是否续签',
      span: span,
      children: customerData.contractRenewStatus == '0' ? '是' : '否',
    },
    {
      label: '自动续签日期',
      span: span,
      children: customerData.contractRenewDate || '-',
    },
    {
      label: '合同电子扫描件',
      span: 2,
      children: (
        <>
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
        </>
      ),
    },
    {
      label: '备注',
      span: 2,
      children: customerData.remarkText || '-',
    },
  ]
  return (
    <Descriptions
      className='m-t-24'
      title=''
      bordered
      column={2}
      labelStyle={{
        width: 180,
        backgroundColor: 'var(--table-bg)',
        fontSize: '15px',
      }}
      contentStyle={{ fontWeight: 500 }}
      items={items}
    />
  )
}
