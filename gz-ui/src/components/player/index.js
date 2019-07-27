/**
 * Created by bo.liu01 on 2017/10/18.
 */
"use strict";

import $ from 'jquery';
import {addToken} from '@/utils/auth';

export function Player() {
  return {
    status: 0,
    //audioContext: null,
    source: null, //the audio source
    analyser: undefined,
    audioDivObj: undefined,
    audioObj: undefined,
    canvasObj: undefined,
    canvasContext: undefined,
    url: undefined,
    isInited:false,
    timer: undefined,

    initData: function(id) {
      if(!this.isInited){
        //init html
        this.audioId = id;
        this.audioDivObj = document.getElementById(id);
        if (!this.audioDivObj) {
          console.error("播放器初始化对象不存在");
          throw new Error("播放器初始化对象不存在");
        }
        this.canvasObj = this.audioDivObj.getElementsByTagName("canvas")[0];
        this.canvasContext = this.canvasObj.getContext('2d');
        this.audioObj = this.audioDivObj.getElementsByTagName("audio")[0];
        this.audioObj.volume = 0.5;
        // this.audioObj = document.querySelector("#audioId")

        //init audioContext
        this.prepareAPI();

        //init analyser
        this.analyser = window.audioContext.createAnalyser();
        this.source = window.audioContext.createMediaElementSource(this.audioObj);
        this.source.connect(this.analyser);//截取音频信号
        this.analyser.connect(window.audioContext.destination);//声音连接到扬声器

        //draw canvas
        this.drawSpectrum(this.analyser);
        this.start();

        //init events
        this.audioObj.oncanplay = ()=>{
          if(this.audioObj.paused){
            this.info('录音加载OK!', 'success');
          }
        };
        this.audioObj.onended = ()=>{
          this.info('播放结束啦!');
        };
        this.audioObj.onplay = ()=> {
          $(".pl_bt.play").text('暂停');
          this.status = 1;
          this.info('正在播放...');
        };
        this.audioObj.onpause = ()=> {
          $(".pl_bt.play").text('播放');
          this.status = 0;
          this.info('播放暂停');
        };
        this.audioObj.onstalled = ()=>{
          this.info('录音文件无法下载!', 'error');
        };
        this.audioObj.onerror = ()=>{
          this.info('录音文件加载失败!', 'error');
        };
        this.isInited = true;
      }
      return this;
    },
    prepareAPI: function () {
    	if(!window.audioContext){
    		window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
		    try {
		        window.audioContext = new window.AudioContext();
		    } catch (e) {
		        console.log(e);
		    }
    	}
    },
    info:function (text, type) {
      let o = $(".pl_bt.label_tip");
      o.text(text);
      if(type === 'success'){
        o.css("color", "#13ce66");
      }else if(type === 'error'){
        o.css("color", "#ff0011");
      }else{
        o.css("color", "#000");
      }
    },
    load: function (url) {
      this.info('录音加载中...');
      if(!url || url === ""){
        this.url = "";
        this.info('未找到录音文件哦!', 'error');
      }else {
        this.url = addToken(url);
      }
      this.audioObj.src = this.url;
      this.audioObj.load();
      this.start();
    },
    start:function () {

    },
    play: function () {
      if (this.audioObj.paused) {
        this.audioObj.play();
      } else {
        this.audioObj.pause();
      }
    },
    replay: function () {
      this.audioObj.currentTime = 0;
    },
    speed: function (val) {//快进或者快退
      this.audioObj.currentTime += (val);
    },
    playRate: function (val) {//播放速率
      if (val && val > 0) {
        this.audioObj.playbackRate = val;
      }
    },
    drawSpectrum:function(analyser){
      	var canvas = this.canvasObj;
      	var cwidth = canvas.width;
      	var cheight = canvas.height - 2;
      	// var _cheight = canvas.height - 2;
      	var meterWidth = 8;//width of the meters in the spectrum
      	var gap = 1;//gap between meters
      	var meterWidthAndGap = meterWidth + gap;
      	var capHeight = 2;
      	var capStyle = '#fff';
      	var meterNum = canvas.width / (meterWidthAndGap);//count of the meters
      	var capYPositionArray = [];////store the vertical position of hte caps for the preivous frame
      	var ctx = this.canvasContext;
      	ctx.clearRect(0, 0, canvas.width, canvas.height);
      	var gradient = ctx.createLinearGradient(0, 0, 0, 119);
      	gradient.addColorStop(1, '#0f0');
      	gradient.addColorStop(0.5, '#ff0');
      	gradient.addColorStop(0, '#f00');

      	var allCapsReachBottom = false;
      	var status = 1;
      	var pausedCount = 100;
      	// debugger;
      	var drawMeter = ()=>{

        	var array = new Uint8Array(this.analyser.frequencyBinCount);
        	if(this.audioObj.paused){
	          	if(pausedCount < 1){
	           		return ;
	          	}
	          	for (var i = array.length - 1; i >= 0; i--) {
	            	array[i] = 0;
	          	}
	          	pausedCount-- ;
	        }else{
	          	pausedCount = 100;
	          	this.analyser.getByteFrequencyData(array);
	        }
	        // console.log(array);
	        if (status === 0) {
	          	//fix when some sounds end the value still not back to zero
	          	for (var i = array.length - 1; i >= 0; i--) {
	            	array[i] = 0;
	          	}
	          	allCapsReachBottom = true;
	          	for (i = capYPositionArray.length - 1; i >= 0; i--) {
	            	allCapsReachBottom = allCapsReachBottom && (capYPositionArray[i] === 0);
	          	}
	          	if (allCapsReachBottom) {
	            	return;
	          	}
	        }

	        // debugger;
	        var step = Math.round((array.length - 800)/ meterNum); //sample limited data from the total array
	        ctx.clearRect(0, 0, cwidth, cheight);
	        for (var i = 0; i < meterNum; i++) {
		        var value = array[i * step]/4;
		        if (capYPositionArray.length < Math.round(meterNum)) {
		            capYPositionArray.push(value);
		        }
		        ctx.fillStyle = capStyle;
		        //draw the cap, with transition effect
		        if (value < capYPositionArray[i]) {
		            ctx.fillRect(i * meterWidthAndGap+1, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
		        } else {
		        	ctx.fillRect(i * meterWidthAndGap+1, cheight - value, meterWidth, capHeight);
		            capYPositionArray[i] = value;
		        }
		        ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
		        ctx.fillRect(i * meterWidthAndGap +1 /*meterWidth+gap*/ , cheight - value + capHeight, meterWidth, Math.floor(value-1)); //the meter
	        }
      	}
      	drawMeter(analyser);
      	this.timer = setInterval(function () {
            drawMeter(this.analyser);
        }, 12);
    }
  };
};

export function getRates() {
  return [{
    value: 2,
    label: 'x2'
  }, {
    value: 1.8,
    label: 'x1.8'
  }, {
    value: 1.6,
    label: 'x1.6'
  }, {
    value: 1.4,
    label: 'x1.4'
  }, {
    value: 1.2,
    label: 'x1.2'
  }, {
    value: 1.0,
    label: 'x1.0'
  }, {
    value: 0.8,
    label: 'x0.8'
  }, {
    value: 0.6,
    label: 'x0.6'
  }];
}
