<template>
<div class="app-container calendar-list-container">

  <div class="el-box">
    <div class="el-dialog-panel" style="width: 50%;">
      <div style="margin: 3px; ">
        <div class="filter-container">
          <el-button :loading="listLoading" type="primary" icon="search" style="width: 15%" @click="getList">刷新</el-button>
          <el-input placeholder="输入关键字" clearable style="width: 83%" v-model="filterText" ></el-input>
        </div>

      </div>
      <div style="margin-top: 1px; margin-left: 3px; margin-right: 2px;">
        <el-tree :data="treeData" node-key="id" highlight-current v-loading.body="listLoading"
                 :props="defaultProps" ref="tree"
                 :default-expand-all="true"
                 :filter-node-method="filterNode" class="filter-tree"
                 :render-content="renderContent" :expand-on-click-node="false"
                 @current-change="currentChangeHandler"
                 style="min-height: 500px;max-height: 600px;overflow:auto;">
        </el-tree>
      </div>
    </div>

    <div style="margin-left: 8px;width: 50%;">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span v-if="curNodeData && curNodeData.name" class="el-card-header-text">【{{curNodeData.name}}】人员列表</span>
          <span v-else="curNodeData" class="el-card-header-text">请选择一个机构</span>
        </div>
        <div>
          <department-user ref="departmentUser" :departmentCode="curNodeData.code"></department-user>
        </div>
      </el-card>
    </div>
  </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" custom-class="el-dialog--small-u-deparment"
    		:append-to-body="true" :modal-append-to-body="false">

        <div class="el-dialog-panel">
            <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="form-body-u">

              <div style="display: table">
                <el-form-item label="名称" prop="name" required style="float: left;width: 320px;">
                  <el-input v-model="form.name" placeholder="请输入名称"></el-input>
                </el-form-item>

                <el-form-item label="编码" prop="code" required style="float: left;width: 250px;">
                	<el-tooltip class="item" effect="dark" content="创建后不可修改" placement="top-start">
							      <el-input v-if="dialogStatus == 'create'" v-model="form.code" placeholder="请输入编码"></el-input>
							      <el-input v-else disabled v-model="form.code" placeholder="请输入编码"></el-input>
							    </el-tooltip>
                </el-form-item>
              </div>
              
              <div style="display: table;">
				        <el-form-item label="父机构" required prop="parentName" style="float: left;width: 500px;">
				          <el-input v-model="form.parentName" readonly placeholder="父机构"></el-input>
				        </el-form-item>
				        <el-button @click="openSelectDepart()" type="primary"
				        	 style="float: left;margin-top: 3px;margin-left: 2px;">选择机构</el-button>
				      </div>

              <el-form-item label="备注" prop="remark" style="width: 570px;">
                  <el-input type="textarea" v-model="form.remark" :autosize="{minRows: 2, maxRows: 5}" placeholder="请输入内容"></el-input>
               </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog(false)">取 消</el-button>
            <el-button :loading=submitBtnLoading v-if="dialogStatus=='create'" @click="createHandler()" type="primary">确 定</el-button>
            <el-button :loading=submitBtnLoading v-else @click="updateHandler()" type="primary">确 定</el-button>
        </div>
    </el-dialog>
    
    <!--父机构选择-->
    <el-dialog :title="'选择父机构'" :visible.sync="selectDepartVisible" custom-class="select-depart-dialog"
    		:append-to-body="true" :modal-append-to-body="false">
      <select-depart v-if="selectDepartVisible" ref="selectDepart" :departCode="form.parentCode" :fullCode="form.fullCode" 
      	:initFunc="initSelectFunc" :flag="dialogStatus"
      	:close="closeSelectDepartDialog" :callback="selectDepartCallback"></select-depart>
    </el-dialog>
</div>
</template>
<style>
	.select-depart-dialog{
	  width: 450px;
	}
  .el-dialog--small-u-deparment{
    width: 650px;
  }
  
</style>
<script>
import {tree, addObj, getObj, delObj, updObj, treeByCon} from '@/views/admin/api/department';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {creatValid, checkRequire, check, checkNumberRequire} from '@/components/public/validator';
import {createButton} from '@/utils/treeUtil';
export default {
  name: 'department',
  components: {
    'department-user': () => import('./departmentUser'),
    'select-depart': () => import('./selectDepart')
  },
  data() {
    return {
      metadata:{
	        name: undefined,
	        code: undefined,
	        fullCode: undefined,
	        parentCode: '',
	        parentName: '',
	        remark: undefined
      },
      form: $.extend(true, {}, this.metadata),
      rules: {
            name: creatValid(checkRequire('名称', 2, 100)),
            code: creatValid(checkRequire('编码', 2, 50)),
            parentName: [{required: true, message: '请选择父机构',trigger: 'blur'}],
            remark: creatValid(check('备注', 2, 200))
      },
      filterText: '',
      treeData: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      curNodeData:{id:undefined, name:''},
      listLoading: true,
      selectDepartVisible:false,
      dialogVisible: false,
      dialogStatus: '',
      isShowBtnEdit: false,
      isShowBtnDel: false,
      isShowBtnAdd: false,
      submitBtnLoading:false,
      textMap: {
        update: '修改',
        create: '添加'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs['tree'].filter(val);
    }
  },
  created() {
    this.getList();
    this.isShowBtnAdd = hasPermission('department.insert');
    this.isShowBtnEdit = hasPermission('department.update');
    this.isShowBtnDel = hasPermission('department.delete');
  },
  methods: {
    getList() {
      this.listLoading = true;
      tree().then(response => {
        this.treeData = response.data;
        this.listLoading = false;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    currentChangeHandler(data, node) {
      if(this.curNodeData.code == data.code){
        return;
      }
      this.curNodeData = data;
      this.$refs['departmentUser'].listQuery.departmentCode = data.code;
      this.$refs['departmentUser'].getList();
    },
    initSelectFunc(flag){
    	if(flag=='create'){
    		return treeByCon({});
    	}else{
    		return treeByCon({fullCode:this.curNodeData.fullCode});
    	}
    },
    closeSelectDepartDialog(){
	    this.selectDepartVisible = false;
	  },
    openSelectDepart(){
	    this.selectDepartVisible = true;
	  },
	  selectDepartCallback(obj){
	  	if(obj){
	  		this.form.parentCode = obj.departCode;
	  		this.form.parentName = obj.departName;
	  	}
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
    toCreate(data, store) {
        this.resetForm();
        this.form.parentCode = data.code;
        this.form.parentName = data.fullName;
        this.openDialog('create');
    },
    toUpdate(row) {
        getObj(row.id).then(response => {
            if(response.data){
            		var data = response.data;
              	this.form = response.data;
              	this.openDialog('update');
            }else if(response.msg){
            		this.$message({message: response.msg,showClose: true,type: 'error'});
            }else {
              	this.getList();
              	this.$message({message: '该记录已不存在',showClose: true,type: 'warn'});
            }
        });
    },
    deleteHandler(row, store) {
      	this.$confirm('确定要删除该机构?', '提示', {
        	confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      	}).then(() => {
          	delObj(row.id).then((response) => {
              	if(response && response.rel){
                		this.$message({message: '删除成功',showClose: true,type: 'success'});
                		store.remove(row);
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
    resetForm() {
      this.form = $.extend(true, {}, this.metadata);
    },
    renderContent(createElement, { node, data, store }) {
      	var getContent = (createElement, node, data, store)=>{
		        var arr = [];
		        if(this.isShowBtnAdd){
		        	arr.push(createButton(createElement, '添加','primary', ()=>{this.toCreate(data, store);}));	
		        }
		        
		        if(data.parentCode){
			        	if(this.isShowBtnEdit){
			        			arr.push(createButton(createElement, '编辑','success', ()=>{this.toUpdate(data);}));
			        	}
			        	if(this.isShowBtnDel){
						  		arr.push(createButton(createElement, '删除','danger', ()=>{this.deleteHandler(data, store);}));
								}
	        	}
	        	return arr;
      	};
      	return createElement('span', [
	        createElement('span', node.label),
	        createElement('span', {attrs:{style:"float: right; margin-right: 5px"}},
          			getContent(createElement, node, data, store)),
      	]);
    }
  }
}
</script>
