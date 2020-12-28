import * as React from 'react'

import {
  ChakraProvider as UIProvider,
  Box,
  Container,
  Checkbox,
  Heading,
  Text,
  Link,
  extendTheme
} from '@chakra-ui/react'

import AltHeading from './components/AltHeading'

import './styles/fontOverrides.css'

const App = props => {
  const { useEffect, useState } = React
  const [ping, setPing] = useState({})
  const [port, setPort] = useState()
  const [isActive, setActive] = useState(false)
  const [isCheckboxActive, setCheckboxActive] = useState(false)

  const theme = extendTheme({
    fonts: {
      body: 'Inter',
      heading: 'Inter',
      mono: 'Inter'
    }
  })

  useEffect(() => {
    if (!chrome.extension) {
      setPing({
        tab: 'Developer mode',
        ping: -1,
        account: 'Test user'
      })

      return
    }

    const messagePort = window.chrome.extension.connect({ name: 'background.js' })

    if (!messagePort) {
      alert('The bridge between the background resource is not prepared. Try re-openning the popup.')

      return
    }

    setPort(messagePort)

    messagePort.onMessage.addListener(message => {
      switch (message) {
        case 'invalid-token': {
          setActive(false)
          setCheckboxActive(true)

          alert('Your Discord token seems like invalid, please try again.')

          break
        }
        case 'client-connecting': {
          setActive(true)
          setCheckboxActive(false)

          break
        }
        case 'client-connected': {
          setActive(true)
          setCheckboxActive(true)

          messagePort.postMessage('get-statics')

          break
        }
        case 'client-deprecated': {
          setActive(false)
          setCheckboxActive(true)

          break
        }
        case 'first-run': {
          setActive(false)
          setCheckboxActive(true)

          break
        }
        default: {
          if (!message.startsWith('data-')) return

          const sectors = message.split(';')
          const key = sectors[0].replace('data-', '')
          const data = JSON.parse(sectors.splice(1)[0])

          switch (key) {
            case 'client-statics': {
              setPing(data || {})

              break
            }
          }
        }
      }
    })

    // NOTE: post-process status;
    messagePort.postMessage('get-status')
  }, []) // NOTE: run only once;

  return (
    <UIProvider theme={theme} initialColorMode='dark'>
      <Container
        style={{
          padding: '16px'
        }}
      >
        <Heading size='lg'>Chrome Rich-Presence</Heading>
        <Box style={{ paddingTop: '12px' }}>
          <AltHeading>Settings</AltHeading>
          <Checkbox
            isChecked={isActive}
            isDisabled={!isCheckboxActive}
            onChange={event => {
              const { checked } = event.target

              setActive(checked)

              if (!port) return
              if (checked) {
                setCheckboxActive(false)
                port.postMessage('enable-rich-presence')
              } else {
                setCheckboxActive(false)
                port.postMessage('disable-rich-presence')
              }
            }}
          >
            Active rich-presence
          </Checkbox>
        </Box>
        {
          ping.account && (
            <Box style={{ paddingTop: '12px' }}>
              <AltHeading>Inspect</AltHeading>
              <Text><b>Tab name</b> {ping.tab}</Text>
              <Text><b>Client account</b> {ping.account}</Text>
            </Box>
          )
        }
        <Box style={{ paddingTop: '12px' }}>
          <AltHeading>Credit</AltHeading>
          <Text>
            Copyright {new Date().getFullYear() || 2020}{' '}
            <Link href='https://github.com/Seia-Soto' target='_blank' rel='noreferrer'>Seia-Soto</Link>.
          </Text>
        </Box>
      </Container>
    </UIProvider>
  )
}

export default App
