import request from '@/utils/request'

export function getQuestionList(data) {
  return request({
    url: '/question/list',
    method: 'get',
    params: data
  })
}

// export function addQuestion(data) {
//   return request({
//     url: '/question/add',
//     method: 'post',
//     data
//   })
// }

// export function getFillList(data) {
//   return request({
//     url: '/fill/list',
//     method: 'get',
//     params: data
//   })
// }

// export function getJudgeList(data) {
//   return request({
//     url: '/judge/list',
//     method: 'get',
//     params: data
//   })
// }

// export function getSingleList(data) {
//   return request({
//     url: '/single/list',
//     method: 'get',
//     params: data
//   })
// }

// export function getMultiList(data) {
//   return request({
//     url: '/multi/list',
//     method: 'get',
//     params: data
//   })
// }

export function addFill(data) {
  return request({
    url: '/fill/add',
    method: 'post',
    data
  })
}

export function addJudge(data) {
  return request({
    url: '/judge/add',
    method: 'post',
    data
  })
}

export function addSingle(data) {
  return request({
    url: '/single/add',
    method: 'post',
    data
  })
}

export function addMulti(data) {
  return request({
    url: '/multi/add',
    method: 'post',
    data
  })
}

export function editFill(data) {
  return request({
    url: '/fill/edit',
    method: 'post',
    data
  })
}

export function editJudge(data) {
  return request({
    url: '/judge/edit',
    method: 'post',
    data
  })
}

export function editSingle(data) {
  return request({
    url: '/single/edit',
    method: 'post',
    data
  })
}

export function editMulti(data) {
  return request({
    url: '/multi/edit',
    method: 'post',
    data
  })
}
//删除

export function deleteFill(data) {
  return request({
    url: '/fill/delete',
    method: 'post',
    data
  })
}

export function deleteJudge(data) {
  return request({
    url: '/judge/delete',
    method: 'post',
    data
  })
}

export function deleteSingle(data) {
  return request({
    url: '/single/delete',
    method: 'post',
    data
  })
}

export function deleteMulti(data) {
  return request({
    url: '/multi/delete',
    method: 'post',
    data
  })
}
export function importBdDeptdoc1(data) {
  return request({
    url: '/fill/importCost',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export function importBdDeptdoc2(data) {
  return request({
    url: '/judge/importCost',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export function importBdDeptdoc3(data) {
  return request({
    url: '/single/importCost',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export function importBdDeptdoc4(data) {
  return request({
    url: '/multi/importCost',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getProfeOne(data) {
  return request({
    url: '/profe/listOne',
    method: 'get',
    params: data
  })
}
export function getShiftfeOne(data) {
  return request({
    url: '/shift/lists',
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
