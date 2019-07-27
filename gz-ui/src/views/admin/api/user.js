/**
 * @author bo.liu01
 * @date 2017-11-7 10:19:22
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';
import {downloadFile} from '@/components/downloadUtil';

export function page(query) {
  return fetch({
    url: baseUrl.admin + '/user/listByPage',
    method: 'get',
    params: query
  });
}

export function download_(query, callback) {
  downloadFile({
    url: baseUrl.admin + '/user/download',
    method: 'get',
    params: query
  }, callback);
}

export function getTemplateURL() {
	return baseUrl.admin + '/user/downloadTemp';
}

export function getImportURL() {//多加一个zuul可以防止文件名中文乱码
	return baseUrl.zuul + '/zuul/admin/user/importData';
}

export function addObj(obj) {
  return fetch({
    url: baseUrl.admin + '/user/add',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.admin + '/user/find',
    method: 'get',
    params:{"id":id}
  });
}

export function delObj(obj) {
  return fetch({
    url: baseUrl.admin + '/user/delete',
    method: 'post',
    data:obj
  });
}

export function updObj(obj) {
  return fetch({
    url: baseUrl.admin + '/user/update',
    method: 'post',
    data: obj
  });
}

export function checkUser(username) {
  return fetch({
    url: baseUrl.admin + '/user/checkUnique',
    method: 'get',
    params: { "username" : username }
  });
}

export function pageDepartUserToChoose(obj) {
  return fetch({
    url: baseUrl.admin + '/user/listDepartUser_',
    method: 'get',
    params: obj
  });
}

export function pageByDepart(query) {
  return fetch({
    url: baseUrl.admin + '/user/listByDepart',
    method: 'get',
    params: query
  });
}

export function pageByRole(query) {
  return fetch({
    url: baseUrl.admin + '/user/listByRole',
    method: 'get',
    params: query
  });
}

export function pageRoleUserToChoose(obj) {
  return fetch({
    url: baseUrl.admin + '/user/listByRole_',
    method: 'get',
    params: obj
  });
}

export function pageByGroup(query) {
  return fetch({
    url: baseUrl.admin + '/user/listByGroup',
    method: 'get',
    params: query
  });
}

export function pageGroupUserToChoose(obj) {
  return fetch({
    url: baseUrl.admin + '/user/listByGroup_',
    method: 'get',
    params: obj
  });
}
export function getByUsername(username) {
  return fetch({
    url: baseUrl.admin + '/user/find',
    method: 'get',
    params: {"username": username}
  });
}

export function getCurInfo() {
  return fetch({
    url: baseUrl.admin + '/user/getCurInfo',
    method: 'get'
  });
}

export function getUploadPortraitUrl() {
  return baseUrl.zuul + '/zuul/admin/user/uploadPortrait';
}
export function getPortraitImg(f,s) {
  return baseUrl.admin + '/common/img?f='+f+'&s='+s;
}


