<template>
	  <div>
		    <template v-for="item in routes">
			      <el-submenu v-if="item.type == 1" :index="item.name">
				        <template slot="title">
					        <i :class="item.icon" ></i>
				          	<span>{{item.title}}</span>
				        </template>
				        <template v-if="item.children && item.children.length > 0">
				          	<sidebar-item :routes='item.children'></sidebar-item>
				        </template>
			      </el-submenu>
			
			      <el-menu-item v-else :index="item.absolutePath" >
			        	<i :class="item.icon" style="color: #50beff;"></i>
			        	<span>{{item.title}}</span>
			      </el-menu-item>
		    </template>
  	</div>
</template>

<script>
  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      }
    }
  }
</script>

