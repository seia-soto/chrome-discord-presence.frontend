import * as React from 'react'
import PropTypes from 'prop-types'

import {
  Heading
} from '@chakra-ui/react'

const AltHeading = props => {
  return (
    <Heading size='md' style={{ paddingTop: '8px' }}>
      {props.children}
    </Heading>
  )
}

AltHeading.propTypes = {
  children: PropTypes.any
}

export default AltHeading
