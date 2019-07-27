<template>
	  <div id="tabPanel" class='tabs-view-container'>
		  	<div class="tabs-view" v-for="tag in Array.from(visitedViews)" :name="tag.name">
			  		<router-link :to="tag.path" :key="tag.path">
					      <el-tag :closable="!tag.meta.noClose" :type="isActive(tag.name)?'primary':''" @close='closeViewTabs(tag,$event)'>
					        	{{tag.meta.title}}
					      </el-tag>
				    </router-link>
		  	</div>
	  </div>
</template>

<script>
	import $ from "jquery";
	import {findRoute} from '@/utils/routerUtil';
  export default {
  	created(){
  			this.addViewTabs();
  	},
  	updated(){
  		 this.$nextTick(function(){
	  		 	var tabPanel = $('#tabPanel');
	  		 	var tabPanelWidth = tabPanel.width();
	  		 	if(tabPanel.scrollLeft()<1){
	  		 			tabPanel.scrollLeft(1);
	  		 			if(tabPanel.scrollLeft()<1){
	  		 					//没有滚动条的情况
	  		 					tabPanel.children().removeClass("tabs-view-up");
	  		 					return;
	  		 			}
	  		 	}
        	tabPanel.children().addClass("tabs-view-up");
        	//计算滚动条位置
        	var curDiv = tabPanel.find("div[name="+this.$route.name+"]");
        	var curDivWidth = curDiv.width();
        	if(curDiv.offset().left > tabPanel.offset().left && (curDiv.offset().left + curDivWidth) < (tabPanel.offset().left + tabPanelWidth)){
        			return;
        	}
        	let max = 20;//最多循环20次，防止死循环，浏览器卡死
        	let n = 0;
					if(curDiv.offset().left < tabPanel.offset().left){
							while(curDiv.offset().left < tabPanel.offset().left && n < max){
		        			tabPanel.scrollLeft(tabPanel.scrollLeft() - curDivWidth);
		        			n++;
		        	}
					}
        	
        	if((curDiv.offset().left + curDivWidth) > (tabPanel.offset().left + tabPanelWidth)){
	        		while((curDiv.offset().left + curDivWidth) > (tabPanel.offset().left + tabPanelWidth) && n < max){
	        				tabPanel.scrollLeft(tabPanel.scrollLeft() + curDivWidth);
	        				n++;
	        		}
        	}
        	
        	return;
        	
//      	var position = 0;
//      	var prevAll = curDiv.prevAll();
//      	if(prevAll && prevAll.length){
//		        	$.each(prevAll, (i,item)=>{
//		        			position += $(item).width()+10;
//		        	});
//		        	if(prevAll.length >3){
//			        		position+=curDiv.width()+10;
//		        	}
//      	}
//      	//获取滚动条总宽度
//      	tabPanel.scrollLeft(2000);
//      	var scrollTotalWidth = tabPanel.scrollLeft();
//					//按比例设置滚动条位置
//      	tabPanel.scrollLeft(parseInt(position*scrollTotalWidth/tabPanel[0].scrollWidth));
  		 });
  	},
  	watch: {
	      $route() {
	        	this.addViewTabs();
	      }
   	},
  	mounted(){
    },
    computed: {
	      visitedViews() {
	        	return this.$store.state.app.visitedViews;
	      },
	      routers() {
	        	return this.$store.state.permission.routers;
	      }
    },
    methods: {
      closeViewTabs(view, $event) {
        	this.$store.dispatch('delVisitedViews', view).then(()=>{
		        	this.$store.dispatch('changeRouteInfo', {
		    					name: view.name, meta:{keepAlive: false}
		    			}).then(()=>{
		    			});
        	});
        	if(this.$route.name == view.name){
        			var length = this.visitedViews.length;
				    	if(length){
				    			this.$router.push(this.visitedViews[length-1].path);
				    	}else{
				    			this.$router.push("/home");
				    	}
        	}
        	$event.preventDefault();
      },
      generateRoute() {
	        if (this.$route.matched[this.$route.matched.length - 1].name) {
	          	return this.$route.matched[this.$route.matched.length - 1];
	        }
	        this.$route.matched[0].path = '/';
	        return this.$route.matched[0];
      },
      addViewTabs() {
	      	var view = this.generateRoute();
	      	if(!this.visitedViews.length && view.path =='/callScreen'){
	      			this.$router.push("/home");
	      			return ;
	      	}
	      	if (!this.visitedViews.some(v => v.name === 'home')){
	      			let home = $.extend(true, {}, findRoute(this.routers, "home"));
	      			home.path="/home";
	      			this.$store.dispatch('addVisitedViews', home);
	      	}
	        this.$store.dispatch('addVisitedViews', view).then(()=>{
	        		this.$store.dispatch('changeRouteInfo', {
        					name: view.name, meta:{keepAlive: true}
        			});
	        });
      },
      isActive(name) {
        	return name === this.$route.name;
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tabs-view-container {
  	width: calc(100% - 350px);
  	/*width: calc(100% - 850px);*/
  	height: 50px;
  	overflow-x: auto;
  	overflow-y: hidden;
    vertical-align: top;
    margin-left: -7px;
    display: inline-flex;
		
		.tabs-view {
      margin-left: 10px;
      margin-top: -2px;
    }
    ::-webkit-scrollbar  
		{  
		    width: 8px;  /*滚动条宽度*/
		    height: 8px;  /*滚动条高度*/
		}  
  }
  .tabs-view-up{
  		margin-top: -7px !important;
  }
  
</style>
