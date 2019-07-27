/**
 * @author bo.liu01
 * @date 2017-11-7 16:31:51
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.admin + '/role/listByPage',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: baseUrl.admin + '/role/add',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.admin + '/role/find',
    method: 'get',
    params:{"id":id}
  });
}

export function delObj(code) {
  return fetch({
    url: baseUrl.admin + '/role/delete',
    method: 'post',
    data:{"code": code}
  });
}

export function updObj(obj) {
  return fetch({
    url: baseUrl.admin + '/role/update',
    method: 'post',
    data: obj
  });
}

export function checkUnique(obj) {
  return fetch({
    url: baseUrl.admin + '/role/checkUnique',
    method: 'get',
    params: obj
  });
}

export function addUser(obj) {
  return fetch({
    url: baseUrl.admin + '/role/addUser',
    method: 'post',
    data: obj
  });
}

export function removeUser(obj) {
  return fetch({
    url: baseUrl.admin + '/role/removeUser',
    method: 'post',
    data: obj
  });
}
