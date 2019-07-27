<template>

<el-menu class="navbar" mode="horizontal">

  <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
  <!--<levelbar></levelbar>-->
  <tabs-view></tabs-view>
  <error-log v-if="log.length>0" class="errLog-container" :logsList="log"></error-log>
  <div class="option-menu">
	  	<!--<div class="click-hover" style="float: right;" @click="toggleAppAside">
	  			<i class="icm icon-comment commont" ></i>
	  	</div>-->
	  	<div class="click-hover" style="float: right;min-width: 115px;" @click="avatarHandler">
				  <el-dropdown class="avatar-container" trigger="click" placement="bottom-end">
					  	<div class="el-box">
					  			<div class="avatar-wrapper">
				            	<img v-if="showPortrait" :src="showPortrait" class="user-avatar">
				            	<img v-else src="static/imgs/default_portrait1.jpg" class="user-avatar">
							    </div>
							    <div class="avatar-name">
							    		<div class="avatar-name-item1">{{name}}</div>
							    		<div class="avatar-name-item2">{{username}}</div>
							    </div>
					  	</div>
				    
					    <el-dropdown-menu class="user-dropdown user-dropdown-u" slot="dropdown">
						      <router-link class='inlineBlock' to="/person">
							        <el-dropdown-item>
							        		<span class="el-dropdown-item-u-i"><i class="icm icon-home" style="font-size: 18px"></i></span>
							        		<span class="el-dropdown-item-u">个人中心 </span>
							        </el-dropdown-item>
						      </router-link>
						      <el-dropdown-item>
						      		<screenfull :textName="'全屏显示'"></screenfull>
						      </el-dropdown-item>
				          <router-link class='inlineBlock' to="/password">
					            <el-dropdown-item>
					              	<span class="el-dropdown-item-u-i"><i class="icm icon-shezhi" style="font-size: 18px"></i></span>
					              	<span class="el-dropdown-item-u">修改密码 </span>
					            </el-dropdown-item>
				          </router-link>
				          <div id="exist_btn" style="background-color: #97a8be;" @click="logout">
					          	<el-dropdown-item divided>
								      		<span class="el-dropdown-item-u-i"><i class="icm icon-tuichu" style="font-size: 18px;"></i></span>
								        	<span class="el-dropdown-item-u">退出系统</span>
								      </el-dropdown-item>
				          </div>
					    </el-dropdown-menu>
				  </el-dropdown>
	  	</div>
		  <!--<div class="notification click-hover" @click="toggleAppAside">
				  <i v-if="appAsidelistSize>0" class="icm icon-tongzhifill" style="font-size: 25px;margin-left: 12px;"></i>
				  <i v-else class="icm icon-tongzhi notification-none" style="font-size: 25px;"></i>
				  <sup class="el-badge__content notification-bubble" v-if="appAsidelistSize>0">{{appAsidelistSize}}</sup>
		  </div>-->

  </div>
</el-menu>
</template>

<script>
import {getPortraitImg} from '@/views/admin/api/user';
import { mapGetters } from 'vuex';
import Levelbar from './Levelbar';
import TabsView from './TabsView';
import Hamburger from '@/components/Hamburger';
import Screenfull from '@/components/Screenfull';
import errLogStore from '@/store/errLog';
import {addToken} from '@/utils/auth';

import $ from 'jquery';
export default {
	  components: {
		    Levelbar,
		    TabsView,
		    Hamburger,
		    Screenfull
	  },
	  data() {
		    return {
			      log: errLogStore.state.errLog,
			      portrait:'',
			      isNeedToggleAppAside:false
		    }
	  },
	  created() {
	    	$("#appAsidePanel").focusout(()=>{
//	    			debugger;
//		    		if(this.appAside.show){
			    			this.toggleAppAside();
//		    		}
				});
	  },
	  computed: { 
		  	...mapGetters([
		      'sidebar',
		      'name',
		      'username',
		      'appAside',
		      'userInfo'
		    ]),
		    showPortrait(){
			    	if(this.userInfo.sign){
			      	return this.portrait=addToken(getPortraitImg(this.userInfo.path, this.userInfo.sign));
			    	}else{
			    		return "";
			    	}
		    },
		    appAsidelistSize(){
						return this.appAside.list.length;
				}
	  },
	  methods: {
		    toggleSideBar() {
		      	this.$store.dispatch('ToggleSideBar');
		    },
		    logout() {
		    	this.$confirm("确认要退出系统么", '提示', {
	          	confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
	        }).then(() => {
	        		this.$store.dispatch('LoginOut').then(() => {
				          location.reload(); // 为了重新实例化vue-router对象 避免bug
				      });
	        }).catch(()=>{});
		    },
		    avatarHandler(){
		    		$(".avatar-wrapper").trigger("click");
		    },
		    toggleAppAside (e) {
		      	this.$store.dispatch('ToggleAppAside');
		      	if(this.appAside.show){
			    			$("#appAsidePanel").focus();
		    		}
		    }
	  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .user-dropdown-u{
      	border-radius: 10px;
      	z-index: 10105 !important;
    }
    .el-dropdown-item-u-i{
    		margin-left: -3px;
    }
    .el-dropdown-item-u{
    		margin-left: -8px;
    }

    .navbar {
    		width: 100%;
      	height: 50px;
      	line-height: 50px;
      	border-radius: 0 !important;
    }
    .hamburger-container {
        line-height: 58px;
        height: 50px;
        float: left;
        padding: 0 10px;
    }
    .errLog-container {
        display: inline-block;
        position: absolute;
        right: 150px;
    }
    .option-menu{
    	/*position: absolute;
    	right: 85px;
		  top: 1px;*/
		  float: right;
		  margin-right: 10px;
    }
    .screenfull {
        position: absolute;
        right: 7px;
        top: 14px;
        color: red;
    }
    .notification {
        /*position: absolute;
		    right: 85px;
		    top: 1px;*/
		    margin-top: -1px;
		   	float: right;
		    color: #727272;
		    cursor: pointer;
    }
    .notification-none{
    	  color: #97a8be;
    }
    .notification-bubble{
    		margin-left: -40px;
    		margin-top: -2px;
    }
    .user-avatar {
        width: 48px;
        height: 48px;
        margin-top: 1px;
        border-radius: 50em;
        /*border: ridge #48576a52;*/
    }
    .avatar-wrapper {
        cursor: pointer;
        position: relative;
        height: 50px;
    }

    .click-hover:hover{
				background-color: #97A1BE;
				cursor: pointer;
		}
    .avatar-container {
        height: 50px;
        display: inline-block;
        float: left;
    }
    .avatar-name{
    	  margin-right: 6px;
    		margin-left: 5px;
    		color: #8391a5;
    		text-align: center;
    }
    .avatar-name-item1{
    		line-height: 15px;
    		margin-top: 10px;
    }
    .avatar-name-item2{
    		line-height: 15px;
    		margin-top: 3px;
    }
    .commont {
    	  margin-right: 7px;
		    margin-left: 6px;
		    font-size: 25px;
		    color: blue;
		    cursor: pointer;
    }
    #exist_btn hover {
		 		color: red;
		}
</style>
