import Cookies from 'js-cookie';

const app = {
	  state: {
		  	appAside: {
			  		show: false,
			  		list: []
		  	},
		    sidebar: {
		      	opened: !+Cookies.get('sidebarStatus')
		    },
		    theme: 'default',
		    livenewsChannels: Cookies.get('livenewsChannels') || '[]',
		    visitedViews: [],
		    callScreens: [],
		    activeCallScreen: ""
	  },
	  mutations: {
		    TOGGLE_APP_ASIDE: state => {
		      	state.appAside.show = !state.appAside.show;
		    },
		    UPDATE_APP_ASIDE_LIST: (state, list) => {
		    		if(list){
			    			state.appAside.list = !state.appAside.list;
		    		}
		    },
		    TOGGLE_SIDEBAR: state => {
	        	Cookies.set('sidebarStatus', state.sidebar.opened ? 1 : 0);
			      state.sidebar.opened = !state.sidebar.opened;
		    },
		    ADD_VISITED_VIEWS: (state, view) => {
			      if (state.visitedViews.some(v => v.name === view.name)) return;
			      state.visitedViews.push({ 
			      		name: view.name, 
			      		path: view.path, 
			      		meta:{
			      				title: !view.meta ? '':view.meta.title, 
			      				noClose: view.meta && view.meta.noClose
			      		}
			      });
		    },
		    DEL_VISITED_VIEWS: (state, view) => {
			      state.visitedViews = state.visitedViews.filter(v => v.name !== view.name);
		    },
		    ADD_CALL_SCREEN: (state, callScreen)=>{
			    	let data = { 
			    				title: callScreen.title, 
			    				name: callScreen.name, 
			    				serviceId: callScreen.serviceId 
			    	};
		    		state.callScreens.push(data);
		    		state.activeCallScreen = data.name;
		    },
		    DEL_CALL_SCREEN: (state, callScreen)=>{
			    	let tabs = state.callScreens;
		        let active = state.activeCallScreen;
		        if (active === callScreen.name) {
		          	tabs.forEach((tab, index) => {
			            if (tab.name === callScreen.name) {
			              	let nextTab = tabs[index + 1] || tabs[index - 1];
			              	if (nextTab) {
			                		active = nextTab.name;
			              	}
			            }
			        });
		        }
	        	state.activeCallScreen = active;
		    		state.callScreens = state.callScreens.filter(tab => tab.name !== callScreen.name);
		    },
		    SET_ACTIVE_CALL_SCREEN: (state, name)=>{
		    		state.activeCallScreen = name;
		    }
	  },
	  actions: {
		    ToggleSideBar: ({ commit }) => {
		      	commit('TOGGLE_SIDEBAR')
		    },
		    ToggleAppAside: ({ commit }) => {
		      	commit('TOGGLE_APP_ASIDE')
		    },
		    UpdateAppAsideList: ({ commit }, list) => {
		      	commit('UPDATE_APP_ASIDE_LIST', list);
		    },
		    addVisitedViews: ({ commit }, view) => {
		      	commit('ADD_VISITED_VIEWS', view)
		    },
		    delVisitedViews: ({ commit }, view) => {
		      	commit('DEL_VISITED_VIEWS', view)
		    },
		    addCallScreen: ({ commit }, callScreen) => {
		      	commit('ADD_CALL_SCREEN', callScreen)
		    },
		    delCallScreen: ({ commit }, callScreen) => {
		      	commit('DEL_CALL_SCREEN', callScreen)
		    },
		    setActiveCallScreen: ({ commit }, name) => {
		      	commit('SET_ACTIVE_CALL_SCREEN', name)
		    }
	  }
};

export default app;
