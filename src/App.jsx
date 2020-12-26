import * as React from 'react'

import {
  ChakraProvider as UIProvider,
  Box,
  Container,
  Checkbox,
  Heading,
  Text,
  Link,
  useToast
} from '@chakra-ui/react'

import AltHeading from './components/AltHeading'

const App = props => {
  const { useEffect, useState } = React
  const toast = useToast()
  const [ping, setPing] = useState({})
  const [port, setPort] = useState()
  const [isActive, setActive] = useState(false)
  const [isCheckboxActive, setCheckboxActive] = useState(false)

  useEffect(() => {
    if (new URL(window.location.href).port !== 8080) {
      setPing({
        tab: 'Developer mode',
        ping: -1,
        account: 'Test user'
      })

      return
    }

    const messagePort = chrome.extension.connect({ name: 'background.js' })

    if (!messagePort) {
      toast('The bridge between the background resource is not prepared. Try re-openning the popup.')

      return
    }

    setPort(messagePort)

    port.onMessage.addListener(message => {
      switch (message) {
        case 'invalid-token': {
          setActive(false)
          setCheckboxActive(true)

          toast('Your Discord token seems like invalid, please try again.')

          break
        }
        case 'client-connected': {
          setCheckboxActive(true)

          toast('Discord client connected to the gateway.')

          break
        }
        case 'client-deprecated': {
          setCheckboxActive(true)

          toast('Your Discord client is now disconnected.')

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
    port.postMessage('get-status')
  }, []) // NOTE: run only once;

  return (
    <UIProvider>
      <Container
        style={{
          padding: '16px 0'
        }}
      >
        <Heading size='lg'>Chrome Rich-Presence</Heading>
        <Box style={{ padding: '12px 0' }}>
          <AltHeading>Settings</AltHeading>
          <Checkbox
            isChecked={isActive}
            isDisabled={isCheckboxActive}
            onChange={event => {
              const { checked } = event.target

              setActive(checked)

              if (!port) return
              if (isActive) {
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
            <Box style={{ padding: '12px 0' }}>
              <AltHeading>Inspect</AltHeading>
              <Text><b>Tab name</b> {ping.tab}</Text>
              <Text><b>Client ping</b> {ping.ping}ms</Text>
              <Text><b>Client account</b> {ping.account}</Text>
            </Box>
          )
        }
        <Box style={{ padding: '12px 0' }}>
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
