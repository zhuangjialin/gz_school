<template>
	<div>
		<div class="el-dialog-panel">
			<div class="app-container calendar-list-container" :loading='submitFileLoading'>
				<div>
					<div class="step-header">第一步：下载导入模板</div>	
					<div class="step-content">
						<a class="download-url" @click="downloadTemplate" style="text-decoration: underline;">{{opt.templateName}}</a>
					</div>
				</div>
				<div>
					<div class="step-header">第二步：导入数据</div>	
					<div class="step-content">
						<el-upload ref="upload" :accept="opt.accept" :multiple="false" :limit="1" :on-exceed="exceedHandler"
						  :action="opt.action" :before-upload="beforeUpload" :headers="opt.headers"
						  :on-success="handleSuccess" :on-error="handleError" :show-file-list="true"
						  :file-list="fileList" :auto-upload="false" >
						  <el-button slot="trigger" size="small" type="primary" >选择文件</el-button>
						  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">导入系统</el-button>
						  <div slot="tip" class="el-upload__tip">单次不能超过<span>{{opt.maxRow}}</span>条数据</div>
						</el-upload>
						
					</div>
				
				</div>
				<div>
					<div class="step-header">第三步：查看导入结果</div>	
					<div class="step-content">
						<div v-if="result.msg">
							<span style="font-weight: bold;">{{result.msg}}</span>
							<span style="color: #0bb556;font-weight: bold;">成功{{result.success}}条</span>
							<span v-if="result.fail > 0">
								<span>，</span>
								<span style="color: red;font-weight: bold;">
									失败<span>{{result.fail}}</span>条
								</span>
							</span>
							<span>!</span>
							<span v-if="result.f" style="color: red;font-weight: bold;text-decoration: underline;">
								<a @click="downloadResult">下载失败原因</a>
							</span>
						</div>
						<div v-else>{{opt.origResultMsg}}</div>
					</div>
				
				</div>
			</div>
		</div>
		
		<div slot="footer" class="dialog-footer dialog-footer-u">
	      <el-button @click="closeDialog">关 闭</el-button>
	    </div>
	</div>
</template>

<style>
.step-header{
	font-size: 14px;
    font-weight: bold;
    font-family: "微软雅黑";
}
.step-content{
	margin-left: 29px;
    margin-top: 10px;
    margin-bottom: 10px;
}

.download-url{
	color: blue;
	font-weight: bold;
}
	
</style>

<script>
import $ from 'jquery';
import {downloadFile, downloadFileHidden} from '@/components/downloadUtil';
import { addToken} from '@/utils/auth';
  export default {
    name: 'importView',
    props: {
      options: {
        type: Object,
        default: {},
        required: true
      },
      close: {
        type: Function,
        default: () => {
        }
      },
      callback:{
        type: Function,
        default: () => {
        }
      }
    },
    data() {
      return {
      	metadata: {
      		action: '',
      		origResultMsg:'暂无结果',
      		maxRow: 1000,
      		limitSize: 5,
      		accept: '.xls,.xlsx',
      		templateName: '用户导入模板',
	    	templateURL: '',
	    	headers:{
	    		//'Content-Type': 'multipart/form-data'
	    	}
      	},
      	opt: {},
        fileList:[],
        submitFileLoading: false,
        result:{
        	msg:'',
        	fail:0,
        	success:0,
        	f:'',
        	s:''
        }
        
      }
    },
    created() {
      this.opt = $.extend(this.opt, this.metadata);
      this.opt = $.extend(this.opt, this.options);
      if(this.opt.action){
      	this.opt.action = addToken(this.opt.action); 
      }
    },
    methods: {
    	downloadTemplate(){
    		downloadFile({
			    url: this.opt.templateURL,
			    method: 'get'
			});
    	},
    	submitUpload() {
    		//debugger;
    		/*if(!this.fileList || this.fileList.length == 0){
    			this.$message.warning({message: '请选择文件',showClose: true});
    			return ;
    		}*/
    		this.submitFileLoading = true;
	    	this.$refs.upload.submit();
	    	this.submitFileLoading = false;
	  	},
	  	handleSuccess(response, file, fileList) {
	    	if(response && response.rel){
	    		if(this.callback && this.callback instanceof Function){
		  			this.callback();
		  		}
	    		var data = response.data;
	    		if(!data){
	    			this.$message.warning({message: '导入结果未知，接口未返回导入结果',showClose: true});
	    			return false;
	    		}
	    		this.result.msg = '导入结果：';
	    		this.result.success = data.success;
	    		this.result.fail = data.fail;
	    		if(data.fail > 0){
    				this.result.f = data.path;
    				this.result.s = data.sign;
	    		}
	    	}else{
	    		var msg = response && response.msg ? response.msg:'导入失败!';
	    		this.$message.error({message: msg,showClose: true});
	    		//this.$refs.upload.abort(file);
	    	}
	    	return false;
	  	},
	  	handleError(err, file, fileList) {
  			var msg = err && err.error ? err.error:'导入时程序出错啦!';
    		this.$message.error({message: msg,showClose: true});
	  	},
	  	exceedHandler(files, fileList){
  			this.$message.warning({message: '单次只能导入一个文件',showClose: true});
  			return false;
	  	},
	  	beforeUpload(file){
	  		if(!file){
	  			this.$message.warning({message: '请选择文件',showClose: true});
	  			return false;
	  		}
	  		var fileType=file.name.substring(file.name.lastIndexOf('.'));
            if(this.opt.accept.indexOf(fileType) < 0) {
            	this.$message.warning({message: '只允许请选择'+this.opt.accept+'文件',showClose: true});
            	return false;
            }
            var flag = file.size / 1024 / 1024 < this.opt.limitSize;
            if(!flag) {  
                this.$message.warning({message: '导入文件大小不能超过 '+this.opt.limitSize+'MB!', showClose: true});
                return false;
            }  
            return true;
	  	},
	  	closeDialog(){
	  		if(this.close && this.close instanceof Function){
	  			this.close();
	  		}
	  	},
	  	downloadResult(){
	  		downloadFileHidden({
	  			f:this.result.f,
	  			s:this.result.s
	  		});
	  	}
    }
  }
</script>

<style scoped>


</style>
