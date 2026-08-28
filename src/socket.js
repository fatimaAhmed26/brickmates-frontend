
import { io } from 'socket.io-client'

const BACK_END_URL = import.meta.env.VITE_BACK_END_SERVER_URL

const socket = io(BACK_END_URL, {
  autoConnect: false,
})

export default socket
