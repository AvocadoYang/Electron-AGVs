/* eslint-disable no-restricted-globals */
import axios from 'axios'
import { MISSION_CONTROL_URL } from '../configs/config'
const client = axios.create({
  baseURL: MISSION_CONTROL_URL.replace('localhost', location.host).replace('5173', '4000')
})

export default client
