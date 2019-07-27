
"use strict";
import Vue from 'vue';
import $ from 'jquery';
import {baseUrl} from '@/base/baseURL';
import fetch from '@/utils/fetch';
import {getToken} from '@/utils/auth';

const vm = new Vue();

// 下载
export function downloadFile (_op, callback) {
	var op = {
	    method: 'get'
	};
	op = $.extend(op, _op);
	fetch(op).then(response => {
      if(response && response.rel && response.data){
			if(response.data.f && response.data.s){
				downloadFileHidden(response.data);
			}else{
				vm.$message.error("文件地址为空");
			}
		}else{
			var msg = response&& response.msg ? response.msg:"文件下载失败";
			vm.$message.error({message: msg,showClose: true});
		}
		if(callback && callback instanceof Function){
			callback();
		}
    });
}

export function downloadFileHidden(params){
	var form = document.createElement("form");
	form.setAttribute("id", "_downloadform_");
    form.setAttribute("style", "display:none");  
    form.setAttribute("target", "");  
    form.setAttribute("method", "get");  
    form.setAttribute("action", baseUrl.admin + '/common/download');
    params.token = getToken();
    if(params){
    	for(var key in params){
    	    var input1 = document.createElement("input"); 
    	    input1.setAttribute("type", "hidden");  
    	    input1.setAttribute("name", key); 
    	    input1.setAttribute("value", params[key]);
    	    form.appendChild(input1);
        }
    }
    document.body.appendChild(form);
    form.submit();
}