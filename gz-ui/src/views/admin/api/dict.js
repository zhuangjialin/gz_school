/**
 * @author bo.liu01
 * @date 2018-8-15 14:22:43
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.admin + '/dict/listByPage',
    method: 'get',
    params: query
  });
}

export function checkUnique(tenantId, parentId, value) {
  return fetch({
    url: baseUrl.admin + '/dict/checkUnique',
    method: 'get',
    params: {
    	tenantId:tenantId,
    	parentId:parentId,
    	code:value
    }
  });
}
export function listForCom(tenantId) {
  return fetch({
    url: baseUrl.admin + '/dict/listForCom',
    method: 'get',
    params: {
    	tenantId:tenantId
    }
  });
}

export function addObj(obj) {
  return fetch({
    url: baseUrl.admin + '/dict/add',
    method: 'post',
    data: obj
  });
}

export function getObj(id, tenantId) {
  return fetch({
    url: baseUrl.admin + '/dict/find',
    method: 'get',
    params:{"id":id, tenantId:tenantId}
  });
}

export function delObj(id,  tenantId) {
  return fetch({
    url: baseUrl.admin + '/dict/delete',
    method: 'post',
    data:{
    	id: id,
    	tenantId:tenantId
    }
  });
}

export function updObj(obj) {
  return fetch({
    url: baseUrl.admin + '/dict/update',
    method: 'post',
    data: obj
  });
}
