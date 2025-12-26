"use client"

// axiosClient.js
import axios from 'axios'
//import { BASE_URL } from './baseUrl'{remove by yuvraj}
import { localStorageHelper } from '../helper/storageHelper'
import QueryString from 'qs'

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json'
  },
  timeout: 120000
})

axiosClient.interceptors.request.use(
  async (config) => {
    const token =
      localStorageHelper.getItem('login_data')?.accessToken?.accessToken
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    config.paramsSerializer = (params) => {
      return QueryString.stringify(params, {
        arrayFormat: 'brackets',
        encode: false
      })
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// GET request
export const get = async (endpoint, params = {}) => {
  try {
    const response = await axiosClient.get(endpoint, { params })
    return response.data
  } catch (error) {
    throw error
  }
}

// POST request
export const post = async (endpoint, data) => {
  try {
    const response = await axiosClient.post(endpoint, data)
    return response.data
  } catch (error) {
    throw error
  }
}

// PUT request
export const put = async (endpoint, data) => {
  try {
    const response = await axiosClient.put(endpoint, data)
    return response.data
  } catch (error) {
    throw error
  }
}

// PATCH request
export const patch = async (endpoint, data) => {
  try {
    const response = await axiosClient.patch(endpoint, data)
    return response.data
  } catch (error) {
    throw error
  }
}

export const remove = async (endpoint, params = {}) => {
  try {
    const response = await axiosClient.delete(endpoint, { params })
    return response.data
  } catch (error) {
    throw error
  }
}
