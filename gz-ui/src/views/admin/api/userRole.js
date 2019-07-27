/**
 * @author bo.liu01
 * @date 2017-11-13 14:14:20
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function list(username) {
  return fetch({
    url: baseUrl.admin + '/userRole/listRole',
    method: 'get',
    params:{
      username:username
    }
  });
}

export function saveUserRole(username, addRole, delRole) {
  return fetch({
    url: baseUrl.admin + '/userRole/save',
    method: 'post',
    data: {
      username:username,
      addRole:addRole,
      delRole:delRole
    }
  });
}
