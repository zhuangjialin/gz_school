/**
 * @author jianming.chen
 * @date 2018-8-17 18:12:05
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.admin + '/group/listByPage',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: baseUrl.admin + '/group/add',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.admin + '/group/find',
    method: 'get',
    params:{"id":id}
  });
}

export function delObj(id) {
  return fetch({
    url: baseUrl.admin + '/group/delete',
    method: 'post',
    data:{"id": id}
  });
}

export function updObj(obj) {
  return fetch({
    url: baseUrl.admin + '/group/update',
    method: 'post',
    data: obj
  });
}

export function checkGroup(obj) {
  return fetch({
    url: baseUrl.admin + '/group/checkUnique',
    method: 'get',
    params: {"code":obj}
  });
}

export function removeUser(obj) {
  return fetch({
    url: baseUrl.admin + '/group/removeUser',
    method: 'post',
    data: obj
  });
}

export function addUser(obj) {
  return fetch({
    url: baseUrl.admin + '/group/addUser',
    method: 'post',
    data: obj
  });
}

export function listQtGroup() {
  return fetch({
    url: baseUrl.admin + '/group/listForCom',
    method: 'get',
    params: {type:1}
  });
}

export function listBsGroup() {
  return fetch({
    url: baseUrl.admin + '/group/listForCom',
    method: 'get',
    params: {type:2}
  });
}



