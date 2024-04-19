import type { FC } from 'react'
import { memo } from 'react'

import { Box } from './box'
import { Dustbin } from './dustbin'

export default function Container() {
  return (
    <div>
      <div style={{ overflow: 'hidden', clear: 'both' }}>
        <Dustbin />
      </div>
      <div style={{ overflow: 'hidden', clear: 'both' }}>
        <Box name='Glass' />
        <Box name='Banana' />
        <Box name='Paper' />
      </div>
    </div>
  )
}
