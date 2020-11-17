import request from '@/utils/request'

export function getShiftList(data) {
  return request({
    url: '/shift/list',
    method: 'get',
    params: data
  })
}

export function addShift(data) {
  return request({
    url: '/shift/add',
    method: 'post',
    data
  })
}

export function updateShift(data) {
  return request({
    url: '/shift/update',
    method: 'post',
    data
  })
}

export function deleteShift(id) {
  return request({
    url: '/shift/delete',
    method: 'post',
    params: id
  })
}

