/**
 * @author bo.liu01
 * @date 2018-8-2 15:08:10
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.admin + '/menuTemplate/listByPage',
    method: 'get',
    params: query
  });
}

export function listForComTemplate() {
  return fetch({
    url: baseUrl.admin + '/menuTemplate/listForCom',
    method: 'get'
  });
}

export function addObj(obj) {
  return fetch({
    url: baseUrl.admin + '/menuTemplate/add',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.admin + '/menuTemplate/find',
    method: 'get',
    params:{"id":id}
  });
}

export function delObj(id) {
  return fetch({
    url: baseUrl.admin + '/menuTemplate/delete',
    method: 'post',
    data:{"id": id}
  });
}

export function updObj(obj) {
  return fetch({
    url: baseUrl.admin + '/menuTemplate/update',
    method: 'post',
    data: obj
  });
}

export function treeByTemplate(templateCode) {
  return fetch({
    url: baseUrl.admin + '/menuTemplate/listTreeByTemp',
    method: 'get',
    params: {
      code:templateCode
    }
  });
}

export function saveTemplateMenu(templateCode, addMenu, delMenu) {
  return fetch({
    url: baseUrl.admin + '/menuTemplate/menu/add',
    method: 'post',
    data: {
      code: templateCode,
      addMenu: addMenu,
      delMenu: delMenu
    }
  });
}
