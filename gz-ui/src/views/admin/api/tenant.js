/**
 * @author bo.liu01
 * @date 2018-7-5 13:05:21
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.admin + '/tenant/listByPage',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: baseUrl.admin + '/tenant/add',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.admin + '/tenant/find',
    method: 'get',
    params:{"id":id}
  });
}

export function delObj(id) {
  return fetch({
    url: baseUrl.admin + '/tenant/delete',
    method: 'post',
    data:{"id": id}
  });
}

export function updObj(obj) {
  return fetch({
    url: baseUrl.admin + '/tenant/update',
    method: 'post',
    data: obj
  });
}

export function listForComTenant() {
  return fetch({
    url: baseUrl.admin + '/tenant/listForCom',
    method: 'get'
  });
}

export function treeByTenant(tenantId) {
  return fetch({
    url: baseUrl.admin + '/tenant/listTreeByTenant',
    method: 'get',
    params: {
      tenantId:tenantId
    }
  });
}

export function saveTenantMenu(tenantId, addMenu, delMenu) {
  return fetch({
    url: baseUrl.admin + '/tenant/menu/add',
    method: 'post',
    data: {
      tenantId: tenantId,
      addMenu: addMenu,
      delMenu: delMenu
    }
  });
}