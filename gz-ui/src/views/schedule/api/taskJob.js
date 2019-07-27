/**
 * @author bo.liu01
 * @date 2018-8-21 10:39:53
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.schedule + '/taskJob/listByPage',
    method: 'get',
    params: query
  });
}

export function checkUnique(value) {
  return fetch({
    url: baseUrl.schedule + '/taskJob/checkUnique',
    method: 'get',
    params: {jobName:value}
  });
}

export function addObj(obj) {
  return fetch({
    url: baseUrl.schedule + '/taskJob/add',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.schedule + '/taskJob/find',
    method: 'get',
    params:{"id":id}
  });
}

export function delObj(id) {
  return fetch({
    url: baseUrl.schedule + '/taskJob/delete',
    method: 'post',
    data:{"id": id}
  });
}

export function updObj(obj) {
  return fetch({
    url: baseUrl.schedule + '/taskJob/update',
    method: 'post',
    data: obj
  });
}

export function active(id, active) {
  return fetch({
    url: baseUrl.schedule + '/taskJob/active',
    method: 'post',
    data: {id:id, active:active?0:1}
  });
}

export function execute(id, active) {
  return fetch({
    url: baseUrl.schedule + '/taskJob/execute',
    method: 'post',
    data: {id:id}
  });
}
