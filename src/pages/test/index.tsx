import RcsInput from '@/components/rcsInput'
import { useState } from 'react'

const App = () => {
  const [txt, setTxt] = useState('')
  const [blod, setBlod] = useState(false)
  const onChange = (val) => {
    setTxt(val)
  }
  const onBlod = () => {
    setBlod(!blod)
  }
  return (
    <div style={{ margin: '200px auto 0' }}>
      <RcsInput
        text={txt}
        onBlur={() => {}}
        onChange={onChange}
        style={{
          fontWeight: blod ? 'bold' : 'initial',
          fontStyle: 'italic',
          textDecoration: 'underline',
        }}
      />
      <button onClick={onBlod}>b</button>
    </div>
  )
}

export default App
