import axios from 'axios'

const server = axios.create({
  baseURL: 'http://35.198.251.76'
})

export default server