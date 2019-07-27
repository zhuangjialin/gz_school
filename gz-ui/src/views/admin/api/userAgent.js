/**
 * @author yonghui.wu
 * @date 2018-9-7 15:33:14
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.admin + '/userAgent/listByPage',
    method: 'get',
    params: query
  });
}

export function checkUnique(value) {
  return fetch({
    url: baseUrl.admin + '/userAgent/checkUnique',
    method: 'get',
    params: {code:value}
  });
}

export function addObj(obj) {
  return fetch({
    url: baseUrl.admin + '/userAgent/add',
    method: 'post',
    data: obj
  });
}

export function getObj(username) {
  return fetch({
    url: baseUrl.admin + '/userAgent/find',
    method: 'get',
    params:{"username":username}
  });
}

export function delObj(id) {
  return fetch({
    url: baseUrl.admin + '/userAgent/delete',
    method: 'post',
    data:{"id": id}
  });
}

export function updObj(obj) {
  return fetch({
    url: baseUrl.admin + '/userAgent/update',
    method: 'post',
    data: obj
  });
}

