import { getPublicKey, getEventHash, signEvent } from 'nostr-tools'

export default async function handler(req, res) {
  const { recipient, sender, badgeName } = req.body
  const key = process.env.API_KEY
  const event = {
    kind: 8,
    pubkey: getPublicKey(key),
    created_at: Math.floor(Date.now() / 1000),
    tags: [
      ["a", `30009:${sender}:${badgeName}`],
      ["p", recipient]],
    content: ''
  }
  event.id = getEventHash(event)
  event.sig = signEvent(event, key)
  
  res.status(200).json(event)
}
