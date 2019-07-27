'use strict'

/** 基础url地址 */
var apiUrl = process.env.BASE_API;

const baseUrl = {
	eureka: apiUrl + "/icmEurekaServer/",
	zuul: apiUrl + "/icm-api",
//	admin: apiUrl + "/icm-api/admin",
	admin: apiUrl + "/admin",
	schedule: apiUrl + "/icm-api/schedule",
	quality: apiUrl + "/icm-api/quality",
	softPhone: apiUrl + "/icm-api/softPhone",
	notify: apiUrl + "/icm-api/notify"
}

export function getBase(module, actUrl){
	return baseUrl[module] + actUrl;
}

export function getBaseModule(){
	var ops = [];
	for (var p in baseUrl) {
		ops.push({name:p, value:p});
	}
	return ops;
}

export function getBusinessModule(){
	var ops = [];
	for (var p in baseUrl) {
		if(p == 'eureka' || p == 'zuul'){
			continue;
		}
		ops.push({name:p, value:p});
	}
	return ops;
}

export {
	baseUrl
}
