import axios from "axios";

const downloadFile = url => {
  return axios({
    method: "get",
    url: `${url}`,
    responseType: "blob" //二进制流
  }).then(res => {
    // 处理返回的文件流
    console.log(res);
    const content = res;
    const blob = new Blob([content], {
      type: "application/vnd.ms-excel;charset=utf-8"
    });
    var date =
      new Date().getFullYear() +
      "" +
      (new Date().getMonth() + 1) +
      "" +
      new Date().getDate() +
      "" +
      new Date().getHours() +
      "" +
      new Date().getMinutes() +
      "" +
      new Date().getSeconds() +
      "" +
      new Date().getMilliseconds();
    const fileName = date + "." + ext;
    if ("download" in document.createElement("a")) {
      // 非IE下载
      const elink = document.createElement("a");
      elink.download = fileName;
      elink.style.display = "none";
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    } else {
      // IE10+下载
      navigator.msSaveBlob(blob, fileName);
    }
  });
};
module.exports = downloadFile;
