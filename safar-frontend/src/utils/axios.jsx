import axios from 'axios'

const baseUrl = ''
const headers = {
  accept: 'application/json',
  Authorization:
    'Bearer '
}

const instance = axios.create({
  baseURL: baseUrl,
  headers: headers
})

export default instance
