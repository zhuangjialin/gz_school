<template>
	<div>
	    <el-menu mode="vertical" unique-opened 
	    	background-color="#373d41" text-color="#fff" active-text-color="#20a0ff"
	             :default-active="$route.path" :collapse="isCollapse" :router="true">
	      	<div class='menu-wrapper'>
	        	<sidebar-item :routes='menus'></sidebar-item>
	      	</div>
	    </el-menu>
    </div>
</template>

<style>
	
	
</style>

<script>
  import { mapGetters } from 'vuex';
  import SidebarItem from './SidebarItem';
  export default {
    components: { SidebarItem },
    computed: {
      ...mapGetters([
        'sidebar',
        'menus'
      ]),
      isCollapse() {
        return !this.sidebar.opened;
      }
    }
  }
</script>
