<template>
	<div>
		<div v-if="loadSoftPhone" class="el-box" style="height: 80px;">
			<div style="width: 100%;">
				<SoftPhone></SoftPhone>
			</div>
		</div>
	    <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened,hideSoftPhone:!loadSoftPhone}">
	    	<div class="el-box" style="height: 52px;">
	    		<div class="logo">
		      		<img class="collapse-logo" v-if="isCollapse" src="static/imgs/favicon.png">
		      		<img class="open-logo" v-else src="static/imgs/bqlogo.png">
			    </div>
			    <div class="navbar-container">
			    	<navbar></navbar>
			    </div>
	    	</div>
	    	<div class="el-box" >
    			<sidebar class="sidebar-container"></sidebar>
		    	<div class="main-container">
					<app-main></app-main>
				</div>
				<AppAside class="appaside-container"/>
	    	</div>
		</div>
	</div>
</template>

<script>
import { Navbar, Sidebar, AppMain, AppAside } from '@/views/layout';
import {checkIE9UpBrowser} from '@/utils/browserUtil';
export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      AppMain,
      AppAside,
//    SoftPhone: () => import('@/views/softPhone/softPhoneView')
    },
    computed: {
	    sidebar() {
	        return this.$store.state.app.sidebar;
	    },
	    isCollapse() {
	        return !this.sidebar.opened;
	    }
//    	loadSoftPhone(){
//    		return this.$store.state.user.loadSoftPhone && checkIE9UpBrowser();
//    	}
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	@import "@/styles/mixin.scss";
	.app-wrapper {
		@include clearfix;
		position: relative;
		height: calc(100% - 80px);
		width: 100%;
		&.hideSidebar {
			.sidebar-container{
				width:36px;
				overflow: inherit;
			}
			.main-container {
				margin-left: 36px;
				width: calc(100% - 40px);
			}
			.navbar-container{
				width: calc(100% - 40px);
			}
		}
		.navbar-container{
			width: calc(100% - 181px);
			border: 1px solid #d1dbe5 ;
		}
		&.hideSoftPhone {
			.sidebar-container {
				height: calc(100% - 52px);
			}
			.main-container {
				height: calc(100% - 52px);
			}
			.appaside-container{
				height: calc(100% - 52px);
			}
		}
		.sidebar-container {
			width: 180px;
			height: calc(100% - 132px);
			position: fixed;
			overflow-y: auto;
			transition: width 0.28s ease-out;
		}
		.main-container {
			width: calc(100% - 180px);
			height: calc(100% - 132px);
			margin-left: 180px;
			position: fixed;
			overflow-y: auto;
			/*transition: margin-left 0.28s ease-out;*/
		}
		.appaside-container {
			width: 220px;
			height: calc(100% - 132px);
			border: 1px solid #ccc;
			position: fixed;
			right: 0px;
			overflow-y: auto;
			z-index: 10100;
			/*transition: width 0.58s ease-out;*/
		}
		.logo{
			background-color: #eef1f6;
		}
		.collapse-logo{
			width: 40px;
			height: 50px;
		}
		.open-logo{
			width: 181px;
			height: 50px;
			border: 1px solid #eef1f6;
		}
	}
</style>
