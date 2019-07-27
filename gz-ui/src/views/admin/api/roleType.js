/**
 * @author bo.liu01
 * @date 2017-11-7 16:31:51
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.admin + '/roleType/listByPage',
    method: 'get',
    params: query
  });
}
export function addObj(obj) {
  return fetch({
    url: baseUrl.admin + '/roleType/add',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.admin + '/roleType/find',
    method: 'get',
    params:{"id":id}
  });
}

export function delObj(obj) {
  return fetch({
    url: baseUrl.admin + '/roleType/delete',
    method: 'post',
    data:obj
  });
}

export function updObj(obj) {
  return fetch({
    url: baseUrl.admin + '/roleType/update',
    method: 'post',
    data: obj
  });
}

export function listForCom() {
  return fetch({
    url: baseUrl.admin + '/roleType/listForCom',
    method: 'get'
  });
}

export function checkName(name) {
  return fetch({
    url: baseUrl.admin + '/roleType/checkUnique',
    method: 'get',
    params: { "name" : name }
  });
}
