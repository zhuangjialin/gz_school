'use strict'
import Vue from 'vue';
import App from './App.vue';
import store from './store';
import ElementUI from 'element-ui';
//import 'element-ui/lib/theme-chalk/index.css';
import 'element-theme-default/lib/index.css';
//import '@/components/theme/custom-theme/index.css'; // 换肤版本element-ui css
//import '@/components/theme/iconfont/iconfont'; // iconfont 具体图标
//import '@/components/theme/iconfont.css'; // iconfont 具体图标
import 'normalize.css/normalize.css';// normalize.css 样式格式化
//import "animate.css";
import '@/styles/index.scss';
//import Multiselect from 'vue-multiselect';// 使用的一个多选框组件，element-ui的select不能满足所有需求
//import 'vue-multiselect/dist/vue-multiselect.min.css';// 多选框组件css
import Sticky from '@/components/Sticky'; // 粘性header组件
import IconSvg from '@/components/Icon-svg';// svg 组件
import vueWaves from '@/components/directive/waves';// 水波纹指令
import router from './router/index.js';
//import NProgress from 'nprogress'; // Progress 进度条
import { getToken } from '@/utils/auth';


Vue.use(ElementUI, { size: 'small', zIndex: 3000});
Vue.use(vueWaves);

var visitedViews = store.state.app.visitedViews;

const whiteList = ['/login', '/index'];
router.beforeEach((to, from, next) => {
	if(!getToken()) { // 判断是否有token
		if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
  			next();
		} else {
  			next('/login'); // 否则全部重定向到登录页
		}
	} else {
		if (to.path === '/login') {
  			next('/');
		} else if(store.getters.menus){// 判断当前用户是否已拉取完user_info信息
			next();
		}else{
			store.dispatch('GetFrontInfo').then(response => {
	  			store.dispatch('GenerateRoutes', response.data.routeConfigs).then(() => {
	    			// 生成路由表
	   	 			router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
	   				next(to.path);
	  			});
			}).catch((e) => {
      			console.error(e);
      			store.dispatch('LoginOut').then(() => {
        			next('/login');
      			});
    		});
		}
  	}
});

router.afterEach((to, from) => {
	if(from && from.path && visitedViews.some(v => v.path == from.path)){
		from.meta.keepAlive = true;
	}
//	if(visitedViews.some(v => v.path == to.path)){
//		to.meta.keepAlive = true;
//	}
});

//使用Vue.mixin的方法拦截了路由离开事件，并在该拦截方法中实现了销毁页面缓存的功能。
//Vue.mixin({
//  beforeRouteLeave:function(to, from, next){
//  	//此处判断是如果返回上一层，你可以根据自己的业务更改此处的判断逻辑，酌情决定是否摧毁本层缓存。
//  	debugger;
//      //if (from && (!from.meta || !from.meta.keepAlive)){
//      if (from && (!store.getters.visitedViews.some(v => v.name === from.name))){
//          if (this.$vnode && this.$vnode.data.keepAlive) {
//              if (this.$vnode.parent && this.$vnode.parent.componentInstance 
//              		&& this.$vnode.parent.componentInstance.cache) {
//                  if (this.$vnode.componentOptions){
//                      var key = this.$vnode.key == null
//                                  ? this.$vnode.componentOptions.Ctor.cid + (this.$vnode.componentOptions.tag ? `::${this.$vnode.componentOptions.tag}` : '')
//                                  : this.$vnode.key;
//                      var cache = this.$vnode.parent.componentInstance.cache;
//                      var keys  = this.$vnode.parent.componentInstance.keys;
//                      if (cache[key]){
//                          if (keys.length) {
//                              var index = keys.indexOf(key);
//                              if (index > -1) {
//                                  keys.splice(index, 1);
//                              }
//                          }
//                          delete cache[key];
//                      }
//                  }
//              }
//          }
//          this.$destroy();
//      }
//      next();
//  },
//});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App },
})

