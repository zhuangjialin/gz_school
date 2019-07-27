<template>
	<div id="audioDiv">
        <div >
          	<canvas style="background-color: #000;" height="70" width="900" ></canvas>
          	<audio src="" controls="controls" autobuffer="true" style="width: 899px;"
          		crossOrigin="anonymous">
            	<p>您的浏览器暂不支持该特性，请您更换最新的谷歌、火狐、IE浏览器！</p>
          	</audio>
        </div>
        <div class="pl_bts">
          	<el-select style="width: 75px;" size="small" v-model="playRateValue" @change="playRateChangeHandler">
            	<el-option v-for="item in playRateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          	</el-select>
          	<el-button type="primary" size="small" class="pl_bt play" @click="player.play()" status="0">播放</el-button>
          	<el-button type="primary" size="small" class="pl_bt replay" style="margin-left: 1px;" @click="player.replay()">重放</el-button>
          	<el-button type="primary" size="small" class="pl_bt speed_5" style="margin-left: 1px;" @click="player.speed(5)">快进5秒</el-button>
         	<el-button type="primary" size="small" class="pl_bt speed-5" style="margin-left: 1px;" @click="player.speed(-5)">快退5秒</el-button>
          	<label class="pl_bt label_tip"></label>
        </div>
  	</div>
</template>

<script>
</script>

<style>
</style>