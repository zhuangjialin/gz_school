<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">

            <el-form-item class="el-form-item-u" >
                <el-input v-model="listQuery.jobName" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="启用否">
                <el-select v-model="listQuery.active" placeholder="选择" style="width: 85px;" @keyup.enter.native="getList" class="filter-item">
                  <el-option v-for="item in activeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="类型">
                <el-select v-model="listQuery.type" placeholder="选择类型" style="width: 85px;" @keyup.enter.native="getList" class="filter-item">
                  <el-option v-for="item in typeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" >
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
                <el-button class="filter-item"  v-if="isShowBtnAdd" @click="toCreate" type="primary" icon="edit">添加</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row class="expand-table">
		
		<el-table-column type="expand">
	      <template slot-scope="scope">
	        <el-form label-position="left" inline class="demo-table-expand">
	        	
            	<div style="display: table">
		          	<el-form-item v-if="scope.row.beanClass" label="执行类" style="float: left;width: 480px;">
		          		<span>{{scope.row.beanClass}}</span>
		          	</el-form-item>
		          	<el-form-item v-if="scope.row.beanId" label="组件id" style="float: left;width: 480px;">
		          		<span>{{scope.row.beanId}}</span>
		          	</el-form-item>
		          	<el-form-item label="任务类型" style="float: left;width: 200px;">
		          		<span>{{typeMapping[scope.row.type]}}</span>
		          	</el-form-item>
	          	</div>
	          	<div style="display: table">
		          	<el-form-item label="组件方法" style="float: left;width: 480px;">
		          		<span>{{scope.row.methodName}}</span>
		          	</el-form-item>
		          	<el-form-item label="执行参数" >
		          		<span>{{scope.row.exeParam}}</span>
		          	</el-form-item>
	          	</div>
	          	<div style="display: table">
		          	<el-form-item label="操作时间" style="float: left;width: 480px;">
		          		<span>{{scope.row.operTime}}</span>
		          	</el-form-item>
		          	<el-form-item label="操作人">
		          		<span>{{scope.row.operName}}</span>
		          	</el-form-item>
	          	</div>
	          	<div style="display: table">
	          		<el-form-item label="备注" style="float: left;width: 950px;">
	          			<span>{{scope.row.remark}}</span>
	          		</el-form-item>
	          	</div>
	        </el-form>
	      </template>
	    </el-table-column>
	    <el-table-column label="任务名称" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.jobName}}</span></template>
        </el-table-column>

	    <el-table-column label="任务描述" width="250px" align="center" :show-overflow-tooltip='true'>
            <template slot-scope="scope"><span>{{scope.row.jobDesc}}</span></template>
        </el-table-column>
        
        <el-table-column label="状态" width="100px" align="center">
            <template slot-scope="scope"><span>{{statusMapping[scope.row.status]}}</span></template>
        </el-table-column>

	    <el-table-column label="是否启用" width="100px" align="center" >
            <template slot-scope="scope"><span>{{activeMapping[scope.row.active]}}</span></template>
        </el-table-column>

	    <el-table-column label="con表达式" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.cronExpression}}</span></template>
        </el-table-column>

	    <el-table-column label="表达式描述" min-width="180px" align="center" :show-overflow-tooltip='true'>
            <template slot-scope="scope"><span>{{scope.row.cronExpDesc}}</span></template>
        </el-table-column>
        
        <el-table-column  align="center" label="操作" width="230px" fixed="right">
            <template slot-scope="scope">
            <el-button v-if="isShowBtnEdit" size="small" type="success" @click="toUpdate(scope.row)">编辑</el-button>
            <el-button v-if="isShowBtnAct && scope.row.active" size="small" type="primary" @click="active(scope.row)">停用</el-button>
            <el-button v-if="isShowBtnAct && !scope.row.active" size="small" type="primary" @click="active(scope.row)">启用</el-button>
            <el-button v-if="isShowBtnExe" size="small" type="primary" @click="execute(scope.row)">执行</el-button>
            <el-button v-if="isShowBtnDel" size="small" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" class="dailog-body-u" 
    	custom-class="el-dialog-u-add-taskJob" top="3vh" :append-to-body="true" :modal-append-to-body="false">

        <div class="el-dialog-panel">
            <el-form :model="form" :rules="rules" ref="form" label-width="90px" class="form-body-u">

            	<div style="display: table">
	               <el-form-item label="任务名称" prop="jobName" required style="float: left;width: 270px;">
	                   <el-input v-model="form.jobName" placeholder="请输入任务名称"></el-input>
	               </el-form-item>
	               <el-form-item label="任务类型" prop="type" required style="float: left;width: 270px;">
	                  	<el-radio-group v-model="form.type">
		              		<el-radio v-for="item in typeArr" :key="item.value" :label="item.value">{{item.name}}</el-radio>
		              	</el-radio-group>
	               </el-form-item>
            	</div>
            	
            	<el-form-item label="任务描述" prop="jobDesc" required style="float: left;width: 540px;">
                   <el-input v-model="form.jobDesc" placeholder="请输入任务描述"></el-input>
                </el-form-item>
            	
            	<div style="display: table">
	               <el-form-item label="con表达式" prop="cronExpression" required style="float: left;width: 270px;">
	                   <el-input v-model="form.cronExpression" placeholder="请输入con表达式"></el-input>
	               </el-form-item>
	               <el-form-item label="是否启用" prop="active" required style="float: left;width: 270px;">
	                   	<el-radio-group v-model="form.active">
		              		<el-radio v-for="item in activeArr" :key="item.value" :label="item.value">{{item.name}}</el-radio>
		              	</el-radio-group>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	            	<el-form-item label="表达式说明" prop="cronExpDesc" required style="float: left;width: 540px;">
	                   <el-input v-model="form.cronExpDesc" placeholder="请填写表达式说明"></el-input>
	                </el-form-item>
	            </div>
            	
            	<div style="display: table">
	               <el-form-item label="执行类" prop="beanClass" style="float: left;width: 540px;">
	                   <el-input v-model="form.beanClass" placeholder="请输入组件方法"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="组件id" prop="beanId" style="float: left;width: 270px;">
	                   <el-input v-model="form.beanId" placeholder="请输入组件id"></el-input>
	               </el-form-item>
	               <el-form-item label="组件方法" prop="methodName" required style="float: left;width: 270px;">
	                   <el-input v-model="form.methodName" placeholder="请输入组件方法"></el-input>
	               </el-form-item>
            	</div>
                <div style="display: table;">
	                <el-form-item label="执行参数" prop="remark" style="float: left;width: 540px;">
	                    <el-input type="textarea" v-model="form.exeParam" :autosize="{minRows: 2, maxRows: 5}" placeholder="请输入内容"></el-input>
	                </el-form-item>
                </div>
                <div style="display: table;">
	                <el-form-item label="备注" prop="remark" style="float: left;width: 540px;">
	                    <el-input type="textarea" v-model="form.remark" :autosize="{minRows: 2, maxRows: 5}" placeholder="请输入内容"></el-input>
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
.el-dialog-u-add-taskJob{
  width: 600px;
}
</style>

<script>
import {page, addObj, getObj, delObj, updObj, checkUnique, execute, active} from '@/views/schedule/api/taskJob';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {getMapFromArr} from '@/utils/arrayUtil';
import {Pager} from '@/components/pager/index';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
import { mapGetters } from 'vuex';
export default {
  name: 'taskJob',
  data() {
    return {
      metadata:{
	        jobName: undefined,
	        jobDesc: undefined,
	        active: 1,
	        cronExpression: undefined,
	        cronExpDesc: undefined,
	        beanClass: undefined,
	        beanId: undefined,
	        methodName: undefined,
	        exeParam: '',
	        type: 1,
	        remark: undefined
      },
      form: $.extend(true, {}, this.metadata),
      rules: {
            jobName: creatValid(checkRequire('任务名称', 2, 100,  this.nameValidator)),
            jobDesc: creatValid(checkRequire('任务描述', 2, 300)),
            cronExpression: creatValid(checkRequire('con表达式', 2, 50)),
            cronExpDesc: creatValid(checkRequire('表达式描述', 2, 100)),
            beanClass: creatValid(check('执行类', 2, 100, this.beanValidator)),
            beanId: creatValid(check('组件id', 2, 100, this.beanValidator)),
            methodName: creatValid(checkRequire('组件方法', 2, 100)),
            exeParam: creatValid(check('执行参数', 2, 950)),
            remark: creatValid(check('备注', 2, 200))
      },
      list: null,
      pager:Pager(),
      listLoading: true,
      listQuery: {
	        jobName: undefined,
	        active: undefined,
	        type: undefined
      },
      dialogVisible: false,
      dialogStatus: '',
      isShowBtnEdit: false,
      isShowBtnDel: false,
      isShowBtnAdd: false,
      isShowBtnExe: false,
      isShowBtnAct: false,
      submitBtnLoading:false,
      textMap: {
        update: '修改',
        create: '添加'
      },
      typeArr:[{value:1, name:'有状态'},{value:0, name:'无状态'}],
      activeArr:[{value:1, name:'启用'},{value:0, name:'不启用'}],
      statusArr:[{
      		value:'NONE', name:'已删除'
      	},{
			value:'NORMAL', name:'正常'
		},{
			value:'PAUSED', name:'暂停'
		},{
			value:'COMPLETE', name:'触发完成'
		},{
			value:'BLOCKED', name:'线程阻塞'
		},{
			value:'ERROR', name:'出现错误' 
		},{
			value:'RUNNING', name:'正在执行' 
		}],
      tableKey: 0
    }
  },
  created() {
    this.pager.init(this.getList);
    this.getList();
    this.isShowBtnAdd = hasPermission('taskJob.insert');
    this.isShowBtnEdit = hasPermission('taskJob.update');
    this.isShowBtnDel = hasPermission('taskJob.delete');
    this.isShowBtnExe = hasPermission('taskJob.execute');
    this.isShowBtnAct = hasPermission('taskJob.active');
  },
  computed: {
  	...mapGetters(['tenantId']),
  	typeMapping(){
  		return getMapFromArr(this.typeArr);
  	},
  	activeMapping(){
  		return getMapFromArr(this.activeArr);
  	},
  	statusMapping(){
  		return getMapFromArr(this.statusArr);
  	}
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
              this.$message({message: '该记录已不存在',showClose: true,type: 'warn'});
            }
        });
    },
    deleteHandler(row) {
      this.$confirm('确认要删除该记录?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
          delObj(row.id).then((response) => {
              if(response && response.rel){
                this.$message({message: '删除成功',showClose: true,type: 'success'});
                this.getList();
              }else{
                this.$message({message: response.msg ? response.msg : '删除失败',showClose: true,type: 'error'});
              }
            });
        });
    },
    createHandler() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.submitBtnLoading = true;
          addObj(this.form).then(response => {
              if(response && response.rel){
                this.closeDialog(true);
                this.$message({message: '新增成功',showClose: true,type: 'success'});
                this.getList();
              }else{
                this.$message({message: response.msg ? response.msg : '新增失败',showClose: true,type: 'error'});
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
              this.$message({message: '修改成功',showClose: true,type: 'success'});
            }else{
              this.$message({message: response.msg ? response.msg : '修改失败',showClose: true,type: 'error'});
            }
            this.submitBtnLoading = false;
          });
        } else {
          return false;
        }
      });
    },
    execute(row){
    	this.$confirm('确认要立即执行该任务?', '提示', {
	        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
	    }).then(() => {
          execute(row.id).then((response) => {
              if(response && response.rel){
                this.$message({message: '执行成功',showClose: true,type: 'success'});
                this.getList();
              }else{
                this.$message({message: response.msg ? response.msg : '执行失败',showClose: true,type: 'error'});
              }
            });
        });
    },
    active(row){
    	var o = row.active ? '停用':'启用';
    	this.$confirm('确认要'+o+'该任务?', '提示', {
	        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
	    }).then(() => {
          active(row.id, row.active).then((response) => {
              if(response && response.rel){
                this.$message({message: o+'成功',showClose: true,type: 'success'});
                this.getList();
              }else{
                this.$message({message: response.msg ? response.msg : o+'失败',showClose: true,type: 'error'});
              }
            });
        });
    },
    nameValidator(rule, value, callback) {
      if(this.dialogStatus == 'create'){
        setTimeout(() => {
          checkUnique(value).then(response => {
            if(response.data){
              callback(new Error("任务名称已存在"));
            }else{
              callback();
            }
          });
        }, 100);
      }else{
        callback();
      }
    },
    beanValidator(rule, value, callback) {
    	if(!this.form.beanClass && !this.form.beanId){
    		callback(new Error("组件id和执行类至少有一个不为空"));
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