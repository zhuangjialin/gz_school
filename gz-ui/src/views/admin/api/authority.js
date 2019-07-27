/**
 * @author bo.liu01
 * @date 2017-11-13 14:14:19
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function treeByRole(roleCode) {
  return fetch({
    url: baseUrl.admin + '/authority/listTree',
    method: 'get',
    params: {
      roleCode:roleCode
    }
  });
}

export function treeByUser(username) {
  return fetch({
    url: baseUrl.admin + '/authority/listTree',
    method: 'get',
    params: {
      username: username
    }
  });
}

export function saveRoleAuth(roleCode, addAuth, delAuth) {
  return fetch({
    url: baseUrl.admin + '/authority/role/add',
    method: 'post',
    data: {
      roleCode: roleCode,
      addAuth: addAuth,
      delAuth: delAuth
    }
  });
}

export function saveUserAuth(username, addAuth, delAuth) {
  return fetch({
    url: baseUrl.admin + '/authority/user/add',
    method: 'post',
    data: {
      username:username,
      addAuth: addAuth,
      delAuth: delAuth
    }
  });
}
