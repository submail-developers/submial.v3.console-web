import { useEffect, useRef, useState } from 'react'
import codeImg from '@/assets/rcs/send1.png'
import { Image, Flex, Divider, Input } from 'antd'
import PageContent from '@/components/pageContent'
import Mobile from '@/pages/rcs/sandbox/compontent/mobile'
import ChatbotList from './compontent/layout/chatbotList'
import TempList from './compontent/layout/tempList'
import { Outlet } from 'react-router-dom'
import Template from './template'
import { StorePage } from './reducer'

import './index.scss'

const pageW = {
  lg: '100%',
  xl: '100%',
  xxl: '100%',
}
export default function Fn() {
  return (
    <PageContent extClass='sandbox p-16' {...pageW}>
      <StorePage>
        <div className='sandbox-top'>
          {/* <Image src={codeImg} preview={false} width={72}></Image> */}
          <Flex
            justify='space-between'
            align='center'
            style={{ marginTop: '4px' }}>
            <div className='fn22 fw-500'>沙盒环境</div>
          </Flex>
          <Divider className='m-t-12 m-b-16' />
        </div>
        <Flex gap={24} className='sandbox-container'>
          <div className='sandbox-content'>
            <div className='fx sandbox hide-scrollbar'>
              <Template />
              <Mobile />
            </div>
          </div>
        </Flex>
      </StorePage>
    </PageContent>
  )
}
