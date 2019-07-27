
export function findRoute(routeConfigs, name) {
	let route;
	let rs = null;
	for(let i=0;i<routeConfigs.length;i++){
		route = routeConfigs[i];
		if(route.component && route.name == name){
			rs = route;
			break;
  		}else if (route.children && route.children.length) {
	      	rs = findRoute(route.children, name);
	      	if(rs){
	      		break;
	      	}
	    }
	}
	return rs;
}