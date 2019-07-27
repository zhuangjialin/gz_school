/**
 * @author bo.liu01
 * @date 2018-7-12 10:48:45
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.admin + '/operLog/listByPage',
    method: 'get',
    params: query
  });
}


export function getObj(id) {
  return fetch({
    url: baseUrl.admin + '/operLog/find',
    method: 'get',
    params:{"id":id}
  });
}

