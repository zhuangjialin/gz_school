<template>
	<transition name="slide-fade">
	  	<div v-show="isShow" id="appAsidePanel" class="app-aside-content">
	  		<div class="notify-title">
	  			<div v-if="list.length">
	  				<span>您有 </span>
	  				<span class="notify-title-num">{{list.length}}</span>
	  				<span> 个待处理任务</span>
	  			</div>
	  			<div v-else><span>当前没有待处理任务！</span></div>
	  		</div>
	  		<div class="notify-close">
	  			<div class="el-box" @click="toggleAppAside">
	  				<div class="notify-close-i"><i class="icm icon-Close"></i></div>
	  				<div class="notify-close-text">关闭</div>
	  			</div>
	  		</div>
	  		<div class="notify-more">
	  			<span class="notify-more-text" @click="openMyNotifyList">查看更多通知</span>
	  		</div>
		    <div >
		    	<table class="notify-tb">
	    			<tr v-for="(item, i) in subList">
	    				<td class="notify-tb-no">{{i+1}}.</td>
    					<td class="notify-tb-sub" @click="processNotify(item)">
    						<span >({{item.statusStr}})</span>
    						<span v-if="item.submitTime" class="notify-tb-time">{{item.submitTime.substring(0, 10)}}</span>
    						<span class="notify-tb-content">{{item.name}}</span>
	    				</td>
	    			</tr>
		    	</table>
			    <el-collapse-transition>
			    </el-collapse-transition>
		    </div>
	  	</div>
  	</transition>
</template>

<style scoped>
	
.app-aside-content{
    background-color: #d1d7e5;
    transition: all .2s ease;
}
	
.notify-title{
	margin: 20px 10px 10px 10px;
    text-align: center;
}
.notify-title-num{
	font-size: 16px;
	font-weight: bold;
	color: blue;
}

.notify-close{
	float: left;
	margin-left: 10px;
	margin-top: 3px;
}

.notify-close-i{
	font-size: 14px;
    margin-right: -7px !important;
}

.notify-close-text{
	font-size: 14px;
	margin-top: 0px;
}
.notify-close :hover{
	color: #589df6;
    cursor:pointer;
}

.notify-more{
	text-align: right;
    margin-right: 17px;
    
}
.notify-more-text{
	font-size: 11px;
	text-decoration: underline;
    cursor: pointer;
}

.notify-more span:hover{
	color: #589df6;
    cursor:pointer;
}

.notify-tb{
	margin: 10px 10px 10px 10px;
}
.notify-tb tr:hover{
	color: #589df6;
    cursor:pointer;
}
.notify-tb span{
	font-size: 14px;
}

.notify-tb-no{
	font-size: 14px;
	padding-top: 4px;
	vertical-align: text-top;	
}
.notify-tb-sub{
	cursor: pointer;
}
.notify-tb-time{
	color: rgba(241, 21, 21, 0.84);
}
.notify-tb-content{
	display: block;
    margin: 1px 0px 3px 1px;
}
</style>

<script>
import { mapGetters } from 'vuex';
import {hasPermission} from '@/utils/permissionUtil';
import SockJS from  'sockjs-client';
import  Stomp from 'stompjs';
export default {
	name: 'AppAside',
	data() {
	    return {
	    	stompClient:'',
            timer:'',
            
	    	maxContentLength: 22,
	    	maxShowNum: 10,
	    	isShowMyNotify: false,
		    testList:[{
		    	name:'审批任务审批任务审批任务审批任务审批任务',
		    	submitTime:'2019-03-20 12:45:12',
		    	statusStr:'未读',
		    	actionType: 1,
		    	actionParamObject: { path: "/quality/task/mainTaskApproval"}
		    }, {
		    	name:'质检评分',
		    	submitTime:'2019-03-20 12:45:12',
		    	statusStr:'未读',
		    	actionType: 1,
		    	actionParamObject: { path: "/quality/task/mainTaskEvaluation"}
		    }, {
		    	name:'质检评dddddd分',
		    	submitTime:'2019-03-20 12:45:12',
		    	statusStr:'未读',
		    	actionType: 1,
		    	actionParamObject: { path: "/quality/task/mainTaskEvaluation"}
		    }, {
		    	name:'质检评质检评分质检评分质检评分质检评分质检评分质检评分',
		    	submitTime:'2019-03-20 12:45:12',
		    	statusStr:'未读',
		    	actionType: 1,
		    	actionParamObject: { path: "/quality/task/mainTaskEvaluation"}
		    }, {
		    	name:'质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分',
		    	submitTime:'2019-03-20 12:45:12',
		    	statusStr:'已阅读',
		    	actionType: 1,
		    	actionParamObject: { path: "/quality/task/mainTaskEvaluation"}
		    }]
	    }
  	},
  	mounted(){
        //this.initWebSocket();
    },
    beforeDestroy: ()=>{
        // 页面离开时断开连接,清除定时器
        this.disconnect();
        clearInterval(this.timer);
    },
  	created(){
  		this.isShowMyNotify = hasPermission("myNotify.view");	
  	},
	computed:{
		...mapGetters([
		    'appAside'
		]),
		isShow() {
		    return this.appAside.show
		},
		list(){
			if(!this.appAside.list || !this.appAside.list.length){
				//return [];
				return this.testList;
			}
		},
		subList(){
//			if(!this.appAside.list || !this.appAside.list.length){
//				return [];
//			}
//			this.appAside.list.forEach((i, item)=>{
//				if(item.name.length > 20){
//					item._name = item.name;
//					item.name = item.name.substring(0, 20)+'...';
//				}
//			});
			var arr = [];
			let item;
			for (var i=0; i < this.testList.length; i++) {
				item = this.testList[i];
			    if(item.name.length > this.maxContentLength){
					item._name = item.name;
					item.name = item.name.substring(0, this.maxContentLength)+'...';
				}
				arr.push(item);
				if(arr.length >= this.maxShowNum){
					break;
				}
			}
			return arr;
		}
	},
	methods:{
		openMyNotifyList(){
			if(!this.isShowMyNotify){
				this.$message.error({message: '您没有通知列表功能权限, 请联系管理员!',showClose: true});
				return ;
			}
			this.toggleAppAside();
			this.$router.push("/quality/notify/myNotify");
		},
		processNotify(row){
			if(row.actionType == 1){
				this.$router.push(row.actionParamObject.path);
			}
		},
		toggleAppAside (e) {
		  	this.$store.dispatch('ToggleAppAside');
		},
		
		initWebSocket() {
            this.connection();
            let that= this;
            // 断开重连机制,尝试发送消息,捕获异常发生时重连
            this.timer = setInterval(() => {
                try {
                    that.stompClient.send("test");
                } catch (err) {
                    console.log("断线了，开始重新连接: " + err);
                    that.connection();
                }
            }, 1000*120);//2分钟检查一次是否断线
        },  
        connection() {
            // 建立连接对象
            let socket = new SockJS('http://10.10.91.4:8081/ws');
            // 获取STOMP子协议的客户端对象
            this.stompClient = Stomp.over(socket);
            // 定义客户端的认证信息,按需求配置
            let headers = {
                Authorization:''
            }
            // 向服务器发起websocket连接
            this.stompClient.connect(headers,() => {
                this.stompClient.subscribe('/topic/public', (msg) => { // 订阅服务端提供的某个topic
                    console.log('广播成功')
                    console.log(msg);  // msg.body存放的是服务端发送给我们的信息
                },headers);
                this.stompClient.send("/app/chat.addUser",
                    headers,
                    JSON.stringify({sender: '',chatType: 'JOIN'}),
                )   //用户加入接口
            }, (err) => {
                // 连接发生错误时的处理函数
                console.log('失败')
                console.log(err);
            });
        },    //连接 后台
        disconnect() {
            if (this.stompClient) {
                this.stompClient.disconnect();
            }
        },  // 断开连接
	}
	
}
</script>
