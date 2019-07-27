import {loginIn, loginOut, getFrontInfo} from '@/views/common/login';
import Cookies from 'js-cookie';
import {removeToken, addToken} from '@/utils/auth';
import {getCurInfo} from '@/views/admin/api/user';


const user = {
	  state: {
	  	userInfo: {},
	    username: '',
	    loadSoftPhone: false,
	    tenantId:'',
	    actualTenantId:'',
	    token: '',
	    name: '',
	    portrait: '',
	    loginTime: '',
	    roles: [],
	    menus: undefined,
	    permissions: undefined,
	    setting: {
	
	    }
	  },

	  mutations: {
	    SET_USERNAME: (state, username) => {
	      state.username = username;
	    },
	    SET_USER_INFO: (state, userInfo) => {
	      state.userInfo = userInfo;
	    },
	    SET_TENANT_ID: (state, tenantId) => {
	      state.tenantId = tenantId;
	    },
	    SET_ACTUAL_TENANT_ID: (state, actualTenantId) => {
	      state.actualTenantId = actualTenantId;
	    },
	    SET_LOGIN_TIME: (state, loginTime) => {
	      state.loginTime = loginTime;
	    },
	    SET_TOKEN: (state, token) => {
	      state.token = token;
	    },
	    SET_REMARK: (state, remark) => {
	      state.remark = remark;
	    },
	    SET_SETTING: (state, setting) => {
	      state.setting = setting;
	    },
	    SET_NAME: (state, name) => {
	      state.name = name;
	    },
	    SET_PORTRAIT: (state, portrait) => {
	      state.portrait = portrait;
	    },
	    SET_ROLES: (state, roles) => {
	      state.roles = roles;
	    },
	    SET_MENUS: (state, menus) => {
	      state.menus = menus;
	    },
	    SET_PERMISSIONS: (state, permissions) => {
	      state.permissions = permissions;
	    },
	    SET_LOAD_SOFTPHONE: (state, loadSoftPhone) => {
	      state.loadSoftPhone = loadSoftPhone;
	    },
	    LOGIN_SUCCESS: () => {
	      console.log('login success');
	    }
	    
	  },

	  actions: {
	  	LoginIn({ commit}, obj){
		  		return new Promise((resolve, reject) => {
			        loginIn(obj).then(response => {
				          commit('SET_TOKEN', response.data.accessToken);
				          commit('SET_USERNAME', response.data.username);
				          commit('SET_LOAD_SOFTPHONE', response.data.loadSoftPhone==1||response.data.loadSoftPhone=='1');
				          Cookies.remove("accessToken");
				          Cookies.remove("username");
				          Cookies.remove("hisUsername");
				          Cookies.remove("loadSoftPhone");
				          Cookies.set("accessToken", response.data.accessToken, 1);
				          Cookies.set("username", response.data.username, 1);
				          Cookies.set("hisUsername", response.data.username, 10);
				          Cookies.set("loadSoftPhone", response.data.loadSoftPhone, 10);
				          resolve(response);
			        }).catch(error => {
			          	reject(error);
			        });
		      });
	  	},
	    // 获取用户信息
	    GetFrontInfo({ commit}) {
		      return new Promise((resolve, reject) => {
			        getFrontInfo().then(response => {
				          const info = response.data.info;
				          commit('SET_USER_INFO', response.data.info);
				          commit('SET_ROLES', response.data.roles);
				          commit('SET_MENUS', response.data.routeConfigs);
				          commit('SET_PERMISSIONS', response.data.permissions);
				          
				          commit('SET_LOAD_SOFTPHONE', info.loadSoftPhone==1||info.loadSoftPhone=='1');
				          commit('SET_NAME', info.name);
				          commit('SET_USERNAME', info.username);
				          commit('SET_TENANT_ID', info.rightTenantId);
				          commit('SET_ACTUAL_TENANT_ID', info.tenantId);
				          commit('SET_PORTRAIT', info.portrait);
				          commit('SET_LOGIN_TIME', info.loginTime);
				          
				          resolve(response);
			        }).catch(error => {
			          	reject(error);
			        });
		      });
	    },
	
	    // 登出
	    LoginOut({commit, state }) {
		      return new Promise((resolve, reject) => {
			        loginOut().then(() => {
				          commit('SET_TOKEN', '');
				          commit('SET_ROLES', []);
				          commit('SET_MENUS', undefined);
				          commit('SET_PERMISSIONS', undefined);
				          removeToken();
				          resolve();
			        }).catch(error => {
			          	reject(error);
			        });
		      });
	    },
	    UpdatePortrait({commit, state }){
	    		return new Promise((resolve, reject) => {
			        getCurInfo().then(response => {
			        		commit('SET_USER_INFO', response.data);
			        }).catch(error => {
			          	reject(error);
			        });
		      });
		  }
	  }
};

export default user;
