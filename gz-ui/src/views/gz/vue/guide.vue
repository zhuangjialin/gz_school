<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">

	    	<el-form-item class="el-form-item-u" label="技术指导标题">
                <el-input v-model="listQuery.guideName" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
	    	<el-form-item class="el-form-item-u" label="标题">
                <el-input v-model="listQuery.guideTitle" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
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

	    <el-table-column label="技术指导标题" width="200px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.guideName}}</span></template>
        </el-table-column>

	    <el-table-column label="技术指导小图标" width="300px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.guideIcon}}</span></template>
        </el-table-column>

	    <el-table-column label="权重" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.sort}}</span></template>
        </el-table-column>

	    <el-table-column label="具体内容" width="200px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.guideContent}}</span></template>
        </el-table-column>

	    <el-table-column label="标题" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.guideTitle}}</span></template>
        </el-table-column>

	    <el-table-column label="生成的html路径" width="200px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.guideUrl}}</span></template>
        </el-table-column>
        
        <el-table-column label="创建时间" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.createTime}}</span></template>
        </el-table-column>

	    <el-table-column label="更新时间" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.updateTime}}</span></template>
        </el-table-column>


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
    	custom-class="el-dialog-u-add-guide" :append-to-body="true" :modal-append-to-body="false">

        <div class="el-dialog-panel">
            <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="form-body-u">

				<div style="display: table">
	               <el-form-item label="标题" prop="guideTitle" style="float: left;width: 370px;">
	                   <el-input v-model="form.guideTitle" placeholder="请输入标题"></el-input>
	               </el-form-item>
	               <el-form-item label="权重" prop="sort" style="float: left;width: 370px;">
	                <el-input-number v-model="form.sort" placeholder="请输入权重" :min="0" :max="1000">
                  	</el-input-number>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="技术指导标题" prop="guideName" style="float: left;width: 370px;">
	                   <el-input v-model="form.guideName" placeholder="请输入技术指导标题"></el-input>
	               </el-form-item>
	               <el-form-item label="技术指导小图标" prop="guideIcon" style="float: left;width: 370px;">
	                   <el-input v-model="form.guideIcon" placeholder="请输入技术指导小图标"></el-input>
	               </el-form-item>
            	</div>
            	
            	<div style="display: table">
	               <el-form-item label="具体内容" prop="guideContent" style="float: left;width: 740px;">
	                   <el-input v-model="form.guideContent" placeholder="请输入具体内容"></el-input>
	               </el-form-item>
            	</div>
            	
            	<div style="display: table">
	               <el-form-item label="生成的html路径" prop="guideUrl" style="float: left;width: 740px;">
	                   <el-input v-model="form.guideUrl" placeholder="请输入生成的html路径"></el-input>
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
.el-dialog-u-add-guide{
  width: 800px;
}
</style>

<script>
import {page, addObj, getObj, delObj, updObj, checkUnique} from '@/views/gz/api/guide';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
import { mapGetters } from 'vuex';
export default {
  	name: 'guide',
  	data() {
    	return {
      		metadata:{
	        	guideName: undefined,
	        	guideIcon: undefined,
	        	sort: undefined,
	        	createTime: undefined,
	        	updateTime: undefined,
	        	guideContent: undefined,
	        	guideTitle: undefined,
	        	guideUrl: undefined
      		},
      		form: $.extend(true, {}, this.metadata),
      		rules: {
            	guideName: creatValid(check('技术指导标题', 2, 50)),
            	guideIcon: creatValid(check('技术指导小图标', 2, 500)),
            	sort: creatValid(checkNumber('权重', 0, 1000)),
            	guideContent: creatValid(check('具体内容', 2, 500)),
            	guideTitle: creatValid(check('标题', 2, 100)),
            	guideUrl: creatValid(check('生成的html路径', 2, 500))
      		},
      		list: null,
      		pager:Pager(),
      		listLoading: true,
      		listQuery: {
	        	guideName: undefined,
	        	guideIcon: undefined,
	        	sort: undefined,
	        	createTime: undefined,
	        	updateTime: undefined,
	        	guideContent: undefined,
	        	guideTitle: undefined,
	        	guideUrl: undefined
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
    	this.isShowBtnEdit = true;
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