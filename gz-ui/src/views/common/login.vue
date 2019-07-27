<template>
  <div @keydown.enter="login" class="login">
  	<div class="bgImg">  
        <img src="static/imgs/login.jpg"/>  
				<div class="grid-content">
						<div class="leftContain ">
								<div class="head">
										<!--<img src="static/imgs/logobig.png">-->
								</div>
						</div>
				</div>
				<div class="grid-content">
					<div class="rightContain" >
							<h2 class="title">系统登录</h2>
							<div>
									<el-input class="ipt mgt" size="large" placeholder="请输入工号" v-model="username">
											<i slot="prepend" class="icm icon-icon_signal_fill login-icon"></i>
									</el-input>
							</div>
							<div>
									<el-input v-if="isShowPwd" type="password" class="ipt mgt" size="large" :show-password="true" placeholder="请输入密码" v-model="password">
											<i slot="prepend" class="icm icon-password login-icon"></i>
									</el-input>
							</div>
							<div class="load-softphone">
									<el-checkbox v-if="isIE9_up" v-model="loadSoftPhone">加载软电话</el-checkbox>
									<el-tooltip v-else class="item" effect="dark" content="非IE浏览器无法使用软电话功能！" placement="right">
							      	<el-checkbox disabled v-model="loadSoftPhone">加载软电话</el-checkbox>
							    </el-tooltip>
							</div>
							<div style="margin-top: 10px;">
									<el-button size="meddle" @click="login" :loading="loading" class="login-btn ipt" type="primary">登录</el-button>
							</div>
					</div>
				</div>
		 	 	<div class="copyright">Copyright © 2014 billionscredit.com,All Rights Reserved 深圳市佰仟金融服务有限公司 版权所有 粤ICP备 14012749号</div>
  	</div>
  </div>
</template>

<style scoped>
	.login-icon{
		margin-right: 4px;
	}
	.load-softphone{
			text-align: left;
    	padding-left: 33px;
    	padding-top: 10px;
    	display: none;
	}
	.login-btn{
		margin-top: 0.5rem;
	}
	/*common*/
	.mgt{
		margin-top: 1rem;
	}

	.grid-content {
		border-radius: 4px;
		height: 42.3125rem;
		display:flex;/*Flex布局*/
		display: -webkit-flex; /* Safari */
		align-items:center;/*指定垂直居中*/
	}


	.login{
		box-sizing: border-box;
		overflow: hidden;
		position: relative;
		width: 100%;
		height: 100vh;
	}
	.bgImg{
    position:relative;
  }
  .bgImg img{
     position:absolute;
     z-index:-1;
  }
	/*.bgImg{
		background: url("/static/imgs/login.jpg") no-repeat;
	}*/
	.leftContain{
		position: absolute;
		left: 15rem;
		top: 6.25rem;
		box-sizing: border-box;
		padding: 0.5rem;

	}
	.rightContain{
		position: absolute;
		top: 6.25rem;
		left: 43.75rem;
		width: 26rem;
		height: 20rem;
		background-color: #f9f9f9;	
		box-sizing: border-box;
		text-align: center;
		padding: 0 2rem 0 2rem;
	}
	.head{
		text-align: center;
	}
	.head img{
		width: 15rem;
	}
	h2.title{
		margin-bottom: 12px;
		margin-top: 1.5rem;
		font-size: 1.8rem;
	}
	.ipt{
		width: 18rem;
	}
	.copyright{
		position: absolute;
		left: 0;
		right: 0;
		text-align: center;
		bottom: 2rem;
		color: white;
		font-size: 0.8rem;
	}
	    
	
</style>

<script>
import {loginIn} from '@/views/common/login';
import { getHisUsername, getLoadSoftPhone} from '@/utils/auth';
import $ from 'jquery';
import {checkIE9UpBrowser} from '@/utils/browserUtil';

export default {
		data(){
				return {
						loading:false,
						username:"",
						password:"",
						loadSoftPhone: false,
						loginType:"1",	//域账号登录0，工号登录1
						isIE9_up: false,
						isShowPwd: false
				}
		},
		created(){
	    	this.isIE9_up = checkIE9UpBrowser();
	    	this.username = getHisUsername();
	    	if(!this.isShowPwd){
	    			this.isShowPwd = true;
	    	}
	    	this.password = "";
	    	if(this.isIE9_up){
	    			var b = getLoadSoftPhone();
	    			if(b && b==1 && b=="1"){
	    				this.loadSoftPhone = true;
	    			}else{
	    				this.loadSoftPhone = false;
	    			}
	    	}else{
	    		this.loadSoftPhone = false;
	    	}
		},
		methods:{
				//登录之后保存accessToken、userName
				login(){
						if(!this.username && !this.password ){
								this.$message.error("请填写账号密码！");
								return;
						}
						if(!this.username){
								this.$message.error("请填写账号！");
								return;
						}if(!this.password){
								this.$message.error("请填写密码！");
								return;
						}
						this.loading=true;
						var data = {
								username: this.username,
								password: this.password,
								loadSoftPhone: this.loadSoftPhone?'1':'0'
						};
						this.$store.dispatch('LoginIn', data).then(res => {
								if(res.rel){
										if(this.loadSoftPhone && res.data.loadSoftPhone != '1' && res.data.loadSoftPhone != 1 ){
												this.$message.info("您的工号配置不完整，无法加载软电话!");
										}
										this.$router.replace("/home");
								}else{
										this.$message.error(res.data.msg);
										this.loading=false;
								}
						}).catch(err => {
								this.loading=false;
						});
				}
		}		
}
</script>

