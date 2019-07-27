import {constantRouterMap} from '@/router';
import Layout from '@/views/layout/Layout';
import AppMain from '@/views/layout/AppMain';
import {findRoute} from '@/utils/routerUtil';

const _import = require('@/router/_import_' + process.env.NODE_ENV);

export function filterRouter(routeConfigs) {
  	let accessedRouters = routeConfigs.filter(route => {
	    if(route.component && route.type === 2){//类型, 1父菜单，2子菜单，3按钮
	      	route.component = _import(route.component);
	    }else if(route.type === 1){
		     route.component = !route.parentCode? Layout : AppMain;
	    }
	    if (route.children && route.children.length) {
	      	filterRouter(route.children);
	    }
	    return true;
  	});
  	return accessedRouters;
}

const permission = {
	state: {
    	routers: constantRouterMap,
    	addRouters: []
	},
	mutations: {
	    SET_ROUTERS: (state, routeConfigs) => {
	      	state.addRouters = routeConfigs;
	      	state.routers = constantRouterMap.concat(routeConfigs);
	    },
	    SET_ROUTE_INFO: (state, route) => {
	    	let tgRoute = findRoute(state.routers, route.name);
  			if(tgRoute){
  				if(!tgRoute.meta){
  					tgRoute.meta = {};
  				}
				tgRoute.meta.keepAlive = route.meta && route.meta.keepAlive;
  			}
	    }
	},
	actions: {
	    GenerateRoutes({ commit }, routeConfigs) {
	      	return new Promise(resolve => {
		        const accessedRouters = filterRouter(routeConfigs);
		        commit('SET_ROUTERS', accessedRouters);
		        resolve();
	      	});
	    },
	    changeRouteInfo({ commit }, route) {
	      	return new Promise(resolve => {
		      	if(route && route.name){
	          		commit('SET_ROUTE_INFO', route);
		      	}
	          	resolve();
	      	});
	    }
	}
};

export default permission;
