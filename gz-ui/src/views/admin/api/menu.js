/**
 * @author bo.liu01
 * @date 2017-11-8 17:09:03
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function tree() {
  return fetch({
    url: baseUrl.admin + '/menu/listTree',
    method: 'get'
  });
}

export function listForCom(obj) {
  return fetch({
    url: baseUrl.admin + '/menu/listForCom',
    method: 'get',
    params: obj
  });
}

export function addObj(obj) {
  return fetch({
    url: baseUrl.admin + '/menu/add',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.admin + '/menu/find',
    method: 'get',
    params:{"id":id}
  });
}

export function delObj(code) {
  return fetch({
    url: baseUrl.admin + '/menu/delete',
    method: 'post',
    data:{"code": code}
  });
}

export function updObj(obj) {
  return fetch({
    url: baseUrl.admin + '/menu/update',
    method: 'post',
    data: obj
  });
}
