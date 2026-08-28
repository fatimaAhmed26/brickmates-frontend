const BACK_END_URL = import.meta.env.VITE_BACK_END_SERVER_URL

const index = async (roomId) => {
  const res = await fetch(`${BACK_END_URL}/messages/${roomId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
  return res.json()
}

const conversations = async () => {
  const res = await fetch(`${BACK_END_URL}/messages`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
  return res.json()
}


export { index,
    conversations
 }