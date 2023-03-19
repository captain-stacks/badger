import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { useRef } from 'react'
import { nip19 } from 'nostr-tools'

export default function Home() {
  const input = useRef()
  
  function submit() {
    const { type, data } = nip19.decode(input.current.value)
    fetch('api/sign-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipient: data,
        badgeId: 'c060b31fe2bbb0be4d393bc7c40a80848a25b8f0e0f382cb5b49c37bf7476cb4',
        badgeName: 'bitcoin-believer'
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
  }

  return (
    <>
      <Head>
        <title>Badge Mint</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <img src={'/autism.png'}/>
        <div className={styles.description} style={{transform: 'scale(1.5)', transformOrigin: 'top left'}}>
          <p style={{background: '#233'}}>
            Enter your npub to claim this badge:
            <br/>
            <input ref={input} style={{padding: '4px', marginTop: '10px', width: '475px'}}/>
            <br/><br/>
            <input onClick={submit} type='submit' style={{padding: '2px 5px'}}/>
          </p>
        </div>
      </main>
    </>
  )
}
