import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'
import { relayInit } from 'nostr-tools'

const relays = [
  'wss://nostr.mutinywallet.com'
]

export default function Home() {
  const [loading, setLoading] = useState()
  
  async function submit() {
    if (!window.nostr) {
      alert('Must use NIP-07 extension')
      return
    }
    setLoading(true)
    const recipient = await window.nostr.getPublicKey()

    fetch('api/sign-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipient: recipient,
        sender: 'c060b31fe2bbb0be4d393bc7c40a80848a25b8f0e0f382cb5b49c37bf7476cb4',
        badgeName: 'bitcoin-believer'
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
        <title>Badger</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 style={{transform: 'scale(1.3)'}}>The Badger App</h1>
        <img src={'/badge.png'} width="360" style={{marginTop: '20px', marginBottom: '40px'}}/>
        <div style={{transform: 'scale(1.75)'}}>
          {loading ? 'Loading...' : <>
            <input
              type='submit'
              value='Claim this badge'
              onClick={submit}
              style={{padding: '2px 5px'}}/>
          </>}
        </div>
      </main>
    </>
  )
}
