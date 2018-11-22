import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from 'qs'
import history from 'src/history'
import { clearToast, toast } from 'src/utils/utils'

function checkStatus (error: AxiosError) {
  console.log(error.response)
  throw error
/*  if (error.response.status === 499) {
    clearToast()
    toast('请先登录')
    history.push('/login')
  }*/
}

export class NetWorkError extends Error {
  public response: AxiosResponse
}

export default {
  get (url: string, data: object = {}, params: AxiosRequestConfig = {}) {
    url = Object.keys(data).length ? url + `?${qs.stringify(data)}` : url
    return (
      axios
        .get(url, { ...params })
        .catch(res => checkStatus(res))
        // .then(checkStatus)
        .then((o: AxiosResponse) => o.data)
    )
  },
  post (url: string, data: object = {}, config: AxiosRequestConfig = {}) {
    return (
      axios
        .post(url, qs.stringify({ ...data }), config)
        .catch(res => checkStatus(res))
        // .then(checkStatus)
        .then((o: AxiosResponse) => o.data)
    )
  },
  formData (
    url: string,
    data: FormData = new FormData(),
    config: AxiosRequestConfig = {}
  ) {
    return (
      axios
        .post(url, data, config)
        .catch(res => checkStatus(res))
        // .then(checkStatus)
        .then((o: AxiosResponse) => o.data)
    )
  }
}
