/**
 * @author bo.liu01
 * @date 2017-11-13 14:14:20
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.admin + '/module/listByPage',
    method: 'get',
    params: query
  });
}

export function listForCom() {
  return fetch({
    url: baseUrl.admin + '/module/listForCom',
    method: 'get'
  });
}

export function addObj(obj) {
  return fetch({
    url: baseUrl.admin + '/module/add',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.admin + '/module/find',
    method: 'get',
    params:{"id":id}
  });
}

export function delObj(id) {
  return fetch({
    url: baseUrl.admin + '/module/delete',
    method: 'post',
    data:{"id": id}
  });
}

export function updObj(obj) {
  return fetch({
    url: baseUrl.admin + '/module/update',
    method: 'post',
    data: obj
  });
}
