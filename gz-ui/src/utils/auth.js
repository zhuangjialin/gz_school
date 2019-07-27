import Cookies from 'js-cookie';
import store from '@/store';

const tokenKey = 'accessToken';
const usernameKey = 'username';
const hisUsernameKey = 'hisUsername';
const loadSoftPhoneKey = 'loadSoftPhone';

export function getUsername() {
	if(store.getters.username){
		return store.getters.username;
	}
  return Cookies.get(usernameKey);
}

export function getLoadSoftPhone() {
  return Cookies.get(loadSoftPhoneKey);
}
export function getHisUsername() {
  return Cookies.get(hisUsernameKey);
}

export function getToken() {
	if(store.getters.token){
		return store.getters.token;
	}
  return Cookies.get(tokenKey);
}

export function removeToken(){
	Cookies.remove(tokenKey);
	Cookies.remove(usernameKey);
}

export function addToken(url) {
  if(url){
    if(url.indexOf('?') > 0) {
      return url + "&token=" + getToken();
    }else{
      return url + "?token=" + getToken();
    }
  }
  return url;
};