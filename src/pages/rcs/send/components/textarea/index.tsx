import { useState } from 'react'
import { Form, Input } from 'antd'
import { ProFormDependency } from '@ant-design/pro-components'

export default function Fn() {
  return (
    <Form.Item name='textarea'>
      <Input.TextArea
        autoSize={{ minRows: 4, maxRows: 4 }}
        placeholder='请输入联系人手机号码，多个联系人请每行输入一个手机号码'
      />
    </Form.Item>
  )
}
