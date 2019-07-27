/**
 * @author bo.liu01
 * @date 2018-8-15 14:22:43
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.admin + '/param/listByPage',
    method: 'get',
    params: query
  });
}
export function checkParam(value, tenantId) {
  return fetch({
    url: baseUrl.admin + '/param/checkUnique',
    method: 'get',
    params: {
    	code:value,
    	tenantId:tenantId
    }
  });
}

export function addObj(obj) {
  return fetch({
    url: baseUrl.admin + '/param/add',
    method: 'post',
    data: obj
  });
}

export function getObj(id, tenantId) {
  return fetch({
    url: baseUrl.admin + '/param/find',
    method: 'get',
    params:{
    	id:id,
    	tenantId:tenantId
    }
  });
}

export function delObj(id, tenantId) {
  return fetch({
    url: baseUrl.admin + '/param/delete',
    method: 'post',
    data:{
    	id: id,
    	tenantId:tenantId
    }
  });
}

export function updObj(obj) {
  return fetch({
    url: baseUrl.admin + '/param/update',
    method: 'post',
    data: obj
  });
}
