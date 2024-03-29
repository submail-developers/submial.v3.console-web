import { CloseOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Space, Typography } from 'antd'
import { ProFormDependency } from '@ant-design/pro-components'

const App = () => {
  const [form] = Form.useForm()

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      form={form}
      name='dynamic_form_complex'
      style={{ maxWidth: 600 }}
      autoComplete='off'
      initialValues={{
        items: [
          {
            name: '${param1}',
            value: '',
          },
          {
            name: '${param2}',
            value: '',
          },
        ],
      }}>
      <Form.List name='items'>
        {(fields, { add, remove }) => (
          <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
            {fields.map((field) => (
              <Card
                size='small'
                title={`Item ${field.name + 1}`}
                key={field.key}
                extra={
                  <CloseOutlined
                    onClick={() => {
                      remove(field.name)
                    }}
                    rev={null}
                  />
                }>
                <Form.Item label='name' name={[field.name, 'name']}>
                  <Input />
                </Form.Item>

                <ProFormDependency name={[field.name, 'name']}>
                  {(daaa) => {
                    return (
                      <>
                        <Typography>
                          <pre>{JSON.stringify(daaa, null, 2)}</pre>
                        </Typography>
                        <Form.Item
                          label={'value'}
                          name={[field.name, 'example']}>
                          <Input />
                        </Form.Item>
                      </>
                    )
                  }}
                </ProFormDependency>
              </Card>
            ))}

            <Button type='dashed' onClick={() => add()} block>
              + Add Item
            </Button>
          </div>
        )}
      </Form.List>

      <Form.Item noStyle shouldUpdate>
        {() => (
          <Typography>
            <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
          </Typography>
        )}
      </Form.Item>
    </Form>
  )
}

export default App
