/**
 * @author bo.liu01
 * @date 2017-11-8 17:09:03
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function tree(obj) {
  return fetch({
    url: baseUrl.admin + '/department/listTree',
    method: 'get',
    params: obj
  });
}

export function treeByCon(obj) {
  return fetch({
    url: baseUrl.admin + '/department/listTreeByCon',
    method: 'get',
    params: obj
  });
}

export function addObj(obj) {
  return fetch({
    url: baseUrl.admin + '/department/add',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.admin + '/department/find',
    method: 'get',
    params:{"id":id}
  });
}

export function delObj(id) {
  return fetch({
    url: baseUrl.admin + '/department/delete',
    method: 'post',
    data:{"id": id}
  });
}

export function updObj(obj) {
  return fetch({
    url: baseUrl.admin + '/department/update',
    method: 'post',
    data: obj
  });
}

export function addUser(obj) {
  return fetch({
    url: baseUrl.admin + '/department/addUser',
    method: 'post',
    data: obj
  });
}

export function removeUser(obj) {
  return fetch({
    url: baseUrl.admin + '/department/removeUser',
    method: 'post',
    data: obj
  });
}

