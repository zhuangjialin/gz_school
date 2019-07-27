/**
 * @author liubo
 * @date 2019-7-24 22:52:57
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
	return fetch({
		url: baseUrl.admin + '/video/listByPage',
    	method: 'get',
    	params: query
	});
}

export function checkUnique(value) {
	return fetch({
		url: baseUrl.admin + '/video/checkUnique',
		method: 'get',
		params: {code:value}
	});
}

export function addObj(obj) {
	return fetch({
		url: baseUrl.admin + '/video/add',
		method: 'post',
		data: obj
	});
}

export function getObj(id) {
	return fetch({
	    url: baseUrl.admin + '/video/find',
	    method: 'get',
	    params:{"id":id}
	});
}

export function delObj(id) {
	return fetch({
	    url: baseUrl.admin + '/video/delete',
	    method: 'post',
	    data:{"id": id}
	});
}

export function updObj(obj) {
	return fetch({
	    url: baseUrl.admin + '/video/update',
	    method: 'post',
	    data: obj
	});
}
