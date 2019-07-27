/**
 * @author bo.liu01
 * @date 2017-11-8 17:09:03
 */
import fetch from '@/utils/fetch';
import {baseUrl, getBusinessModule} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.admin + '/resource/listByPage',
    method: 'get',
    params: query
  });
}

export function getModule(){
	return getBusinessModule();
}

export function reflush(name) {
  return fetch({
    url: baseUrl[name] + '/baseOper/reflush',
    method: 'get'
  });
}

export function addMenuResObj(menuCode, resCodes) {
  return fetch({
    url: baseUrl.admin + '/menuResource/add',
    method: 'post',
    data:{
      "menuCode": menuCode,
      "resourceCode":resCodes
    }
  });
}

export function delObj(menuCode, resCodes) {
  return fetch({
    url: baseUrl.admin + '/menuResource/delete',
    method: 'post',
    data:{
      "menuCode": menuCode,
      "resourceCode":resCodes
    }
  });
}
