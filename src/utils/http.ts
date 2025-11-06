import type { AxiosRequestConfig } from 'axios'
import { api } from '@/config/axios'

export const get = async <T>(url: string, config?: AxiosRequestConfig) => {
  const res = await api.get<T>(url, config)
  return res.data
}
export const post = async <TBody, TResp>(
  url: string,
  body: TBody,
  config?: AxiosRequestConfig
) => {
  const res = await api.post<TResp>(url, body, config)
  return res.data
}
export const patch = async <TBody, TResp>(
  url: string,
  body: TBody,
  config?: AxiosRequestConfig
) => {
  const res = await api.patch<TResp>(url, body, config)
  return res.data
}
export const del = async <TResp>(url: string, config?: AxiosRequestConfig) => {
  const res = await api.delete<TResp>(url, config)
  return res.data
}
