import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from 'qs'

function checkStatus(response) {
  return response
}

export class NetWorkError extends Error {
  public response: AxiosResponse
}

export default {
  get(url: string, data: object = {}, params: AxiosRequestConfig = {}) {
    url = Object.keys(data).length ? url + `?${qs.stringify(data)}` : url
    return (
      axios
        .get(url, { ...params })
        // .then(checkStatus)
        .then((o: AxiosResponse) => o.data)
    )
  },
  post(url: string, data: object = {}, config: AxiosRequestConfig = {}) {
    return (
      axios
        .post(url, qs.stringify({ ...data }), config)
        // .then(checkStatus)
        .then((o: AxiosResponse) => o.data)
    )
  },
  formData(
    url: string,
    data: FormData = new FormData(),
    config: AxiosRequestConfig = {}
  ) {
    return (
      axios
        .post(url, data, config)
        // .then(checkStatus)
        .then((o: AxiosResponse) => o.data)
    )
  }
}
