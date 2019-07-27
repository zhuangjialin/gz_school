<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">

	    	<el-form-item class="el-form-item-u" label="所属分类">
                <el-input v-model="listQuery.videoCatory" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
	    	<el-form-item class="el-form-item-u" label="实验项目负责人">
                <el-input v-model="listQuery.principal" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
	    	<el-form-item class="el-form-item-u" label="联系电话">
                <el-input v-model="listQuery.phone" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" >
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
                <el-button class="filter-item"  v-if="isShowBtnAdd" @click="toCreate" type="primary" icon="edit">添加</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>

        <el-table-column label="序号" width="65" align="center" fixed="left">
            <template slot-scope="scope"><span>{{scope.row.id}}</span></template>
        </el-table-column>

	    <el-table-column label="所属分类" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.videoCatory}}</span></template>
        </el-table-column>

	    <el-table-column label="实验学时" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.classHour}}</span></template>
        </el-table-column>

	    <el-table-column label="操作步数" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.numberSteps}}</span></template>
        </el-table-column>

	    <el-table-column label="项目负责人" width="120px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.principal}}</span></template>
        </el-table-column>

	    <el-table-column label="联系电话" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.phone}}</span></template>
        </el-table-column>

	    <el-table-column label="实验简介" width="500px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.description}}</span></template>
        </el-table-column>

	    <el-table-column label="权重" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.sort}}</span></template>
        </el-table-column>

	    <el-table-column label="创建时间" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.createTime}}</span></template>
        </el-table-column>

	    <el-table-column label="更新时间" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.updateTime}}</span></template>
        </el-table-column>

	   <!-- <el-table-column label="MP4路径" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.videoUrl}}</span></template>
        </el-table-column>-->

        <el-table-column  align="center" label="操作" width="130px" fixed="right">
            <template slot-scope="scope">
            <el-button v-if="isShowBtnEdit" size="small" type="success" @click="toUpdate(scope.row)">编辑</el-button>
            <el-button v-if="isShowBtnDel" size="small" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" class="dailog-body-u" 
    	custom-class="el-dialog-u-add-video" :append-to-body="true" :modal-append-to-body="false">

        <div class="el-dialog-panel">
            <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="form-body-u">

            	<div style="display: table">
	               <el-form-item label="所属分类" prop="videoCatory" style="float: left;width: 270px;">
	                   <el-input v-model="form.videoCatory" placeholder="请输入所属分类"></el-input>
	               </el-form-item>
	               <el-form-item label="实验学时" prop="classHour" style="float: left;width: 270px;">
	                   <el-input v-model="form.classHour" placeholder="请输入实验学时"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="实验操作步数" prop="numberSteps" style="float: left;width: 270px;">
	                   <el-input v-model="form.numberSteps" placeholder="请输入实验操作步数"></el-input>
	               </el-form-item>
	               <el-form-item label="实验项目负责人" prop="principal" style="float: left;width: 270px;">
	                   <el-input v-model="form.principal" placeholder="请输入实验项目负责人"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="联系电话" prop="phone" style="float: left;width: 270px;">
	                   <el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
	               </el-form-item>
	               <el-form-item label="权重" prop="sort" style="float: left;width: 270px;">
		                <el-input-number v-model="form.sort" placeholder="请输入权重" :min="0" :max="1000">
	                  	</el-input-number>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="MP4路径" prop="videoUrl" style="float: left;width: 540px;">
	                   <el-input v-model="form.videoUrl" placeholder="请输入MP4路径"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="实验简介" prop="description" style="float: left;width: 540px;">
	                   <el-input type="textarea" v-model="form.description" :autosize="{minRows: 2, maxRows: 5}" placeholder="请输入实验简介"></el-input>
	               </el-form-item>
            	</div>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog(false)">取 消</el-button>
            <el-button :loading=submitBtnLoading v-if="dialogStatus=='create'" @click="createHandler()" type="primary">确 定</el-button>
            <el-button :loading=submitBtnLoading v-else @click="updateHandler()" type="primary">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<style>
.el-dialog-u-add-video{
  width: 600px;
}
</style>

<script>
import {page, addObj, getObj, delObj, updObj, checkUnique} from '@/views/gz/api/video';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
import { mapGetters } from 'vuex';
export default {
  	name: 'video',
  	data() {
    	return {
      		metadata:{
	        	videoCatory: undefined,
	        	classHour: undefined,
	        	numberSteps: undefined,
	        	principal: undefined,
	        	phone: undefined,
	        	description: undefined,
	        	sort: undefined,
	        	createTime: undefined,
	        	updateTime: undefined,
	        	videoUrl: undefined
      		},
      		form: $.extend(true, {}, this.metadata),
      		rules: {
            	videoCatory: creatValid(check('所属分类', 2, 50)),
            	classHour: creatValid(checkNumber('实验学时', 2, 1000)),
            	numberSteps: creatValid(checkNumber('实验操作步数', 2, 1000)),
            	principal: creatValid(check('实验项目负责人', 2, 10)),
            	phone: creatValid(check('联系电话', 2, 11)),
            	description: creatValid(check('实验简介', 2, 1000)),
            	sort: creatValid(checkNumber('权重', 0, 1000)),
            	videoUrl: creatValid(check('MP4路径', 2, 500))
      		},
      		list: null,
      		pager:Pager(),
      		listLoading: true,
      		listQuery: {
	        	videoCatory: undefined,
	        	classHour: undefined,
	        	numberSteps: undefined,
	        	principal: undefined,
	        	phone: undefined,
	        	description: undefined,
	        	sort: undefined,
	        	createTime: undefined,
	        	updateTime: undefined,
	        	videoUrl: undefined
      		},
      		dialogVisible: false,
      		dialogStatus: '',
      		isShowBtnEdit: false,
      		isShowBtnDel: false,
      		isShowBtnAdd: false,
      		submitBtnLoading:false,
      		textMap: {
        		update: '修改',
        		create: '添加'
      		},
      		tableKey: 0
    	}
  	},
  	created() {
    	this.pager.init(this.getList);
    	this.getList();
    	this.isShowBtnAdd = true;
    	this.isShowBtnEdit = true
    	this.isShowBtnDel = true;
  	},
  	computed: {
  		...mapGetters(['tenantId']),
  	},
 	methods: {
    	getList() {
      		this.listLoading = true;
      		$.extend(this.listQuery, this.pager.getPage());
      		page(this.listQuery).then(response => {
	        	this.list = response.data.list;
	       		this.pager.render(response.data.totalSize);
	        	this.listLoading = false;
	      	})
    	},
	    openDialog(status){
	      	this.dialogStatus = status;
	      	this.dialogVisible = true;
	    },
	    closeDialog(toClear){
	      	this.dialogVisible = false;
	      	if(toClear || this.dialogStatus == 'update'){
	        	this.$refs['form'].resetFields();
	      	}
	    },
	    toCreate() {
	        this.resetForm();
	        this.openDialog('create');
	    },
	    toUpdate(row) {
	        getObj(row.id).then(response => {
	            if(response.data){
	              	this.form = response.data;
	              	this.openDialog('update');
	              	if(this.$refs['form'] && this.$refs['form'].validate){
	                	let func = (obj)=>{setTimeout(()=>{obj.validate();}, 200);};
	                	func(this.$refs['form']);
	              	}
	            }else{
	              	this.getList();
	              	this.$message.warn({message: '该记录已不存在',showClose: true});
	            }
	        });
	    },
	    deleteHandler(row) {
	      	this.$confirm('确认要删除该记录?', '提示', {
	        	confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
	      	}).then(() => {
	          	delObj(row.id).then((response) => {
	              	if(response && response.rel){
	                	this.$message.success({message: '删除成功',showClose: true});
	                	this.getList();
	              	}else{
	                	this.$message.error({message: response.msg ? response.msg : '删除失败',showClose: true});
	              	}
	            });
	        }).catch(()=>{});
	    },
	    createHandler() {
	      	this.$refs['form'].validate(valid => {
	        	if (valid) {
		          	this.submitBtnLoading = true;
		          	addObj(this.form).then(response => {
		              	if(response && response.rel){
		                	this.closeDialog(true);
		                	this.$message.success({message: '新增成功',showClose: true});
		                	this.getList();
		              	}else{
		                	this.$message.error({message: response.msg ? response.msg : '新增失败',showClose: true});
		              	}
		              	this.submitBtnLoading = false;
		          	});
	        	} else {
	          		return false;
	        	}
	      	});
	    },
	    updateHandler() {
	      	this.$refs['form'].validate(valid => {
	        	if (valid) {
	          		this.submitBtnLoading = true;
	          		updObj(this.form).then((response) => {
	            		if(response && response.rel){
			              	this.closeDialog(true);
			              	this.getList();
			              	this.$message.success({message: '修改成功',showClose: true});
		            	}else{
		              		this.$message.error({message: response.msg ? response.msg : '修改失败',showClose: true});
		            	}
		            	this.submitBtnLoading = false;
		          	});
	        	} else {
	          		return false;
	        	}
	      	});
	    },
	    codeValidator(rule, value, callback) {
	      	if(this.dialogStatus == 'create'){
	        	setTimeout(() => {
	          		checkUnique(value).then(response => {
	            		if(response.data){
	              			callback(new Error("参数编码已存在"));
	            		}else{
	              			callback();
	            		}
	          		});
	        	}, 100);
	      	}else{
	        	callback();
	      	}
	    },
	    resetForm() {
	      	this.form = $.extend(true, {}, this.metadata);
	    }
  	}
}
</script>