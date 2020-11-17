import request from '@/utils/request'

export function getPaperList(data) {
  return request({
    url: '/train/list',
    method: 'get',
    params: data
  })
}
export function getTrainList(data) {
  return request({
    url: '/trains/list',
    method: 'get',
    params: data
  })
}
export function getTrainDetail(data) {
  return request({
    url: '/trains/detail',
    method: 'get',
    params: data
  })
}
export function viewtrain(data) {
  return request({
    url: '/train/view',
    method: 'get',
    params: data
  })
}

export function addPaper(data) {
  return request({
    url: '/train/add',
    method: 'post',
    data
  })
}

export function updatePaper(data) {
  return request({
    url: '/train/update',
    method: 'post',
    data
  })
}


export function deletePaper(data) {
  return request({
    url: '/train/delete',
    method: 'post',
    data
  })
}


export function queryPaperById(data) {
  return request({
    url: '/train/queryPaperById',
    method: 'post',
    data
  })
}

export function editPaper(data) {
  return request({
    url: '/train/editPaper',
    method: 'post',
    data
  })
}

//获取各种题型数量
export function getCount() {
  return request({
    url: '/train/count',
    method: 'get'
  })
}
