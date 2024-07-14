import axios from "axios";
export const serverAddress = "http://152.136.110.235:8000/api";
export const localAddress = "http://127.0.0.1:8000/api"

export function post(url, data) {
  return new Promise((resolve, reject) => {
    axios
      .post(localAddress + url, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error)
      });
  });
}
export function get(url, param) {
  return new Promise((resolve, reject) => {
    axios
      .get(localAddress + url, {
        params: param,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        // ElNotification({
        //   message: "网络连接失败",
        //   type: "error",
        //   showClose: true,
        //   position: "top-right",
        //   duration: 2000,
        // });
      });
  });
}
