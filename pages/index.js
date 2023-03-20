import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { useRef, useState } from 'react'
import { nip19, relayInit } from 'nostr-tools'

const relays = [
  'wss://nostr.mutinywallet.com'
]

export default function Home() {
  const input = useRef()
  const [loading, setLoading] = useState()
  
  function submit() {
    const { type, data } = nip19.decode(input.current.value)
    setLoading(true)

    fetch('api/sign-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipient: data,
        sender: 'c060b31fe2bbb0be4d393bc7c40a80848a25b8f0e0f382cb5b49c37bf7476cb4',
        badgeName: 'unconfirmed-autist'
      })
    })
    .then(response => response.json())
    .then(async event => {
      console.log('Success:', event);
      const relay = relayInit(relays[0])

      relay.on('connect', () => {
        console.log(`connected to ${relay.url}`)
      })
      relay.on('error', () => {
        console.log(`failed to connect to ${relay.url}`)
      })
      
      await relay.connect()

      const pub = relay.publish(event)
      pub.on('ok', () => {
        console.log(`${relay.url} has accepted our event`)
        window.location = 'https://badges.page'
      })
      pub.on('failed', reason => {
        console.log(`failed to publish to ${relay.url}: ${reason}`)
      })
    })
  }

  return (
    <>
      <Head>
        <title>Badge Mint</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <img src={'/autism.png'} width="360" style={{marginBottom: '20px'}}/>
        <div className={styles.description} style={{transform: 'scale(1.3)', transformOrigin: 'top'}}>
          <p style={{background: '#233'}}>
            Enter your npub to claim this badge:
            <br/>
            <input ref={input} style={{padding: '4px', marginTop: '10px', width: '475px'}}/>
            <br/><br/>
            {loading ? 'Loading...' : <>
              <input onClick={submit} type='submit' style={{padding: '2px 5px'}}/>
            </>}
          </p>
        </div>
      </main>
    </>
  )
}
