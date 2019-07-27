/**
 * @author yonghui.wu
 * @date 2018-9-4 16:16:44
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.admin + '/userOrg/listByPage',
    method: 'get',
    params: query
  });
}

export function checkUnique(value) {
  return fetch({
    url: baseUrl.admin + '/userOrg/checkUnique',
    method: 'get',
    params: {code:value}
  });
}

export function addObj(obj) {
  return fetch({
    url: baseUrl.admin + '/userOrg/add',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.admin + '/userOrg/find',
    method: 'get',
    params:{"id":id}
  });
}

export function delObj(itemCode) {
  return fetch({
    url: baseUrl.admin + '/userOrg/delete',
    method: 'post',
    data:{"itemCode": itemCode}
  });
}

export function updObj(obj) {
  return fetch({
    url: baseUrl.admin + '/userOrg/update',
    method: 'post',
    data: obj
  });
}
export function addUserOrg(obj) {
  return fetch({
    url: baseUrl.admin + '/userOrg/addUserOrg',
    method: 'post',
    data: obj
  });
}
