/**
 * @author bo.liu01
 * @date 2017-11-16 14:44:05
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.admin + '/departmentUser/listByPage',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: baseUrl.admin + '/departmentUser/add',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.admin + '/departmentUser/find',
    method: 'get',
    params:{"id":id}
  });
}

export function delObj(id) {
  return fetch({
    url: baseUrl.admin + '/departmentUser/delete',
    method: 'post',
    data:{"id": id}
  });
}

export function updObj(obj) {
  return fetch({
    url: baseUrl.admin + '/departmentUser/update',
    method: 'post',
    data: obj
  });
}
