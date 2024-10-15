import socketIO from 'socket.io-client'
console.log(window.env.VITE_REACT_APP_MISSION_CONTROL_URL)
console.log(
  `${window.env.VITE_REACT_APP_MISSION_CONTROL_URL.replace('localhost', location.host).replace('5173', '4000')}/dashboard`
)
const io = socketIO(
  // eslint-disable-next-line no-restricted-globals
  `${window.env.VITE_REACT_APP_MISSION_CONTROL_URL.replace('localhost', location.host).replace('5173', '4000')}/dashboard`
)
