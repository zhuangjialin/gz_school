/**
 * @author bo.liu01
 * @date 2018-06-28 14:14:19
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';
import {_res} from '@/utils/routerConfig';

export function loginIn(obj) {
  return fetch({
    url: baseUrl.admin + '/login/loginIn',
    method: 'post',
    data: obj
  });
}

export function loginOut() {
  return fetch({
    url: baseUrl.admin + '/login/loginOut',
    method: 'get'
  });
}

//export function getFrontInfo() {
//return new Promise(function(resolve, reject){
//      resolve(_res);
//  });
//}

export function getFrontInfo() {
return fetch({
    url: baseUrl.admin + '/login/front/info',
    method: 'get'
});
}

export function changePassword(obj) {
  return fetch({
    url: baseUrl.admin + '/login/changePassword',
    method: 'post',
    data: obj
  });
}


