<template>

	<section class="app-main">
		<transition name="fade" mode="out-in">
			<div>
				<keep-alive>
					<router-view v-if="$route.meta && $route.meta.keepAlive"></router-view>
				</keep-alive>
				<router-view v-if="!($route.meta && $route.meta.keepAlive)"></router-view>
			</div>
		</transition>
	</section>
</template>

<script>
	import {pathToCode} from "@/utils/js_function";
	export default {
  	name: 'AppMain',
  	computed: {
	    key() {
	      	return this.$route.path ;//? pathToCode(this.$route.path) : this.$route +new Date();
	    }
  	}
}
</script>
