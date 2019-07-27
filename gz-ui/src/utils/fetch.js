'use strict'
import Vue from 'vue';
import Axios from 'axios';
import { getToken, removeToken} from '@/utils/auth';

const vm = new Vue();

const instance = Axios.create({
    timeout: 120000
})

// 拦截request,设置全局请求为ajax请求
instance.interceptors.request.use(config => {
	config.headers = {
      'Content-Type': 'application/json'
    }
	var token = getToken();
	if(token) {
		config.headers['Authorization'] = token;
	}
	//get 请求自动加时间戳，防止304缓存数据
	if(!config.method || config.method.toLocaleLowerCase() == 'get'){
		if(config.url){
			if(config.url.indexOf('?') > 0) {
		      	config.url += "&_t=" + new Date().getTime();
		    }else{
		      	config.url += "?_t=" + new Date().getTime();
		    }
		}
	}
	return config	
})

//拦截响应response，并做一些错误处理
instance.interceptors.response.use(
    response => {
    	if(response.data.msg && !response.data.rel){
    		vm.$message.error(response.data.msg)
    	}
      return response.data;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 返回 401 清除token信息并跳转到登录页面
                    removeToken();
                    location.replace('/icm');
                    vm.$message.error({message:"登录超时，请重新登录！",showClose: true});
                    break;
                case 404:
                    // 返回 404 清除token信息并跳转到登录页面
                    vm.$message.error({message:"请求的地址无效！",showClose: true});
                    break;
              	case 500:
       				//500,服务器连接失败
       				var msg = error.response.data.msg;
       				msg = msg || '网关错误';
                    vm.$message.error({message:msg + ", 请稍后重试!",showClose: true});
                    break;
                default:
			        vm.$message.error({message:error.response.status + " , " + error.response.data.msg, showClose: true});
			        break;
   		    	}
   	  	}else{
          vm.$message.error({message:"服务器无响应",showClose: true})
        }
	    return Promise.reject(error)   // 返回接口返回的错误信息
	}
);

export default instance;