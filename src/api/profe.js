import request from '@/utils/request'

export function getProfeList(data) {
  return request({
    url: '/profe/list',
    method: 'get',
    params: data
  })
}

export function addProfe(data) {
  return request({
    url: '/profe/add',
    method: 'post',
    data
  })
}

export function updateProfe(data) {
  return request({
    url: '/profe/update',
    method: 'post',
    data
  })
}

export function deleteProfe(id) {
  return request({
    url: '/profe/delete',
    method: 'post',
    params: id
  })
}

export function getProfeOne(data) {
  return request({
    url: '/profe/listOne',
    method: 'get',
    params: data
  })
}

export function getProfeById(data) {
  return request({
    url: '/profe/listById',
    method: 'get',
    params: data
  })
}
