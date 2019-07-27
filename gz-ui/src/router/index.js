'use strict'
import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);

Vue.use(Router);

/* layout */
import Layout from '@/views/layout/Layout';

export const constantRouterMap = [
	{
		path:"/index.html",
		redirect:"/home",
		title: "首页",
		hidden: true,
		meta:{
			title: "首页",
		}
	},{
		path:"/login",
		name: "login",
		component:_import('common/login'),
		hidden: true,
		meta:{
			title: "登录页",
		}
	},{
		path:"/",
		component:Layout,
		redirect: '/home',
		hidden: true,
		children:[{
			path:"home",
			name: "home",
			component: _import('common/home'),
			hidden: true,
			meta: {
				title: "首页",
		        keepAlive: true,
		        noClose: true
		    }
		},{
			path:"person",
			name: "person",
			component:_import('common/person'),
			hidden: true,
			meta: {
				title: "个人中心",
		        keepAlive: true
		    }
		},{
      		path:"password",
      		name: "password",
      		component:_import('common/password'),
      		hidden: true,
			meta: {
				title: "修改密码",
		        keepAlive: true
		    }
    	}]
	}
];

const router =  new Router({
	scrollBehavior: () => ({
    	y: 0
  	}),
	routes:constantRouterMap
})

export default router
