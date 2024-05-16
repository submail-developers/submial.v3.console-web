import { useEffect, useState } from 'react'
import { Flex, Image, Space, Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import PageContent from '@/components/pageContent'
import { PlusOutlined } from '@ant-design/icons'
import codeImg from '@/assets/rcs/address/address_icon.png'
import { delRcsMeteial, getRcsTempList } from '@/api'
import Address from './addressBook/index' //地址簿
import AddressDetail from './addressBookDetail/index' //地址簿详情
import AddressFile from './addressBookFile/index' //地址簿文件夹
import SeeAddressFile from './seeAddressFile/index' //查看地址簿文件加
import AddressFileDetail from './addressBookFileDetail/index' //地址簿文件夹详情

import { API } from 'apis'
import './index.scss'

export default function Fn() {
  const [activeKey, setActiveKey] = useState('1')
  const [isVisible, setIsVisible] = useState(false)
  const [addressInfo, setAddressInfo] = useState<any>() //地址簿的详细信息
  const onChange = (key: string) => {
    setActiveKey(key)
    if (key == '1' || key == '2') {
      setIsVisible(false)
    }
  }

  const toOne = () => {
    setActiveKey('1')
  }
  const toThree = (info) => {
    setIsVisible(true)
    setAddressInfo(info)
    setActiveKey('3')
  }
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '地址簿',
      children: <Address onchildrenMethod={toThree} />,
    },
    {
      key: '2',
      label: '地址簿文件夹',
      children: <AddressFile />,
    },
    {
      key: '3',
      label: `${isVisible ? addressInfo.name : ''}`,
      children: (
        <AddressDetail onchildrenMethod={toOne} addressInfo={addressInfo} />
      ),
    },
    // {
    //   key: '4',
    //   label: '查看地址簿文件夹',
    //   children: <SeeAddressFile />,
    // },
    // {
    //   key: '5',
    //   label: '地址簿文件夹详情',
    //   children: <AddressFileDetail onchildrenMethod={toThree} />,
    // },
  ]

  useEffect(() => {}, [])

  return (
    <PageContent extClass='address-list' xxl={1400} xl={980}>
      <Image src={codeImg} preview={false} width={72}></Image>
      <Flex
        justify='space-between'
        wrap='wrap'
        gap={12}
        style={{ marginTop: '4px' }}>
        <Space align='baseline'>
          <div className='fn22 fw-500'>地址簿管理</div>
        </Space>
      </Flex>
      <Tabs activeKey={activeKey} items={items} onChange={onChange} />
    </PageContent>
  )
}
