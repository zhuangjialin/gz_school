<template>
<div class="app-container calendar-list-container">
	<div class="el-box">
	<div style="width: 60%;">
	    <div class="filter-container">
	        <el-form :inline="true" :model="listQuery">
	
	            <el-form-item class="el-form-item-u" style="width: 150px;">
	                <el-input v-model="listQuery.name" placeholder="输入关键字" @keyup.enter.native="getList" class="filter-item"> </el-input>
	            </el-form-item>
	            <el-form-item class="el-form-item-u" label="角色类型" >
	              <el-select v-model="listQuery.roleTypeId" clearable filterable placeholder="选择角色类型" style="width: 150px;">
	                <el-option v-for="item in roleTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
	              </el-select>
	            </el-form-item>
	
	            <el-form-item class="el-form-item-u" >
	                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
	                <el-button class="filter-item"  v-if="isShowBtnAdd" @click="toCreate" type="primary" icon="edit">添加</el-button>
	            </el-form-item>
	        </el-form>
	    </div>
	    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
	    	@current-change="currentChangeHandler">
	
		    <el-table-column label="名称" width="180px" align="center" fixed="left">
	            <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
	        </el-table-column>
	        
	        <el-table-column label="编码" width="180px" align="center">
	            <template slot-scope="scope"><span>{{scope.row.code}}</span></template>
	        </el-table-column>
	
		    <el-table-column label="角色类型" width="100px" align="center" >
	            <template slot-scope="scope"><span>{{scope.row.roleTypeName}}</span></template>
	        </el-table-column>
	
	        <el-table-column label="备注" align="center">
	            <template slot-scope="scope"><span>{{scope.row.remark}}</span></template>
	        </el-table-column>
	
	        <el-table-column label="操作时间" width="180" align="center" >
	            <template slot-scope="scope"><span>{{scope.row.operTime}}</span></template>
	        </el-table-column>
	
	        <el-table-column label="操作人" width="150" align="center" >
	            <template slot-scope="scope"><span>{{scope.row.operName}}</span></template>
	        </el-table-column>
	
	        <el-table-column  align="center" label="操作" width="180" fixed="right">
	            <template slot-scope="scope">
	            <el-button v-if="isShowBtnEdit" size="small" type="success" @click="toUpdate(scope.row)">编辑</el-button>
	            <el-button v-if="isShowBtnSetAuth" size="small" type="primary" @click="toSetAuth(scope.row)">权限</el-button>
	            <el-button v-if="isShowBtnDel" size="small" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
	            </template>
	        </el-table-column>
	    </el-table>
	
	    <div v-show="!listLoading" class="pagination-container">
	        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
	    </div>
    </div>
    
    <div style="margin-left: 8px;width: 38%;">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span v-if="!curRole.name" class="el-card-header-text">请选择一个角色</span>
          <span v-else class="el-card-header-text">【{{curRole.name}}】人员列表</span>
        </div>
        <div>
          <role-user ref="roleUser" :roleCode="curRole.code"/>
        </div>
      </el-card>
    </div>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" custom-class="el-dialog--small-u-role"
    		:append-to-body="true" :modal-append-to-body="false">

        <div class="el-dialog-panel">
          <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="form-body-u">

            <div style="display: table">
              <el-form-item label="名称" prop="name" required style="float: left; width: 250px;">
                  <el-input v-model="form.name" placeholder="请输入名称"></el-input>
              </el-form-item>
              
              <el-form-item label="编码" prop="code" required style="float: left; width: 250px;">
                  <el-tooltip v-if="dialogStatus == 'create'" class="item" effect="dark" content="创建后不可修改" placement="top-start">
			        <el-input v-model="form.code" placeholder="请输入编码"></el-input>
			      </el-tooltip>
			      <el-input v-else disabled v-model="form.code" placeholder="请输入编码"></el-input>
              </el-form-item>
            </div>

            <div style="display: table">
              <el-form-item label="角色类型" prop="roleTypeId" required style="float: left; width: 250px;">
                <el-select v-model="form.roleTypeId" filterable placeholder="请选择">
                  <el-option v-for="item in roleTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="备注" style="width: 250px;float: left;">
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
    <el-dialog :title="authDialogTitle" :visible.sync="authDialogVisible" top="3vh" custom-class="el-dialog--small-u-auth"
    		:append-to-body="true" :modal-append-to-body="false">
      <role-auth ref="roleAuth" :close="closeAuthDialog" :roleCode="curRole.code"></role-auth>
    </el-dialog>
</div>
</template>
<style>
  .el-dialog--small-u-role{
    width: 580px;
  }
  .el-dialog--small-u-auth{
    width: 500px;
  }
</style>
<script>
import {page, addObj, getObj, delObj, updObj, checkUnique} from '@/views/admin/api/role';
import {listForCom} from '@/views/admin/api/roleType';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
import { mapGetters } from 'vuex';
export default {
  name: 'role',
  components: {
    'role-auth': () => import('./roleAuth'),
    'role-user': () => import('./roleUser')
  },
  data() {
    return {
      metadata:{
	        code: undefined,
	        name: undefined,
	        roleTypeId: '',
	        remark: undefined
      },
      form: $.extend(true, {}, this.metadata),
      oldCode:'',
      oldName:'',
      rules: {
          code: creatValid(checkRequire('编码', 2, 50, this.codeValidator)),
          name: creatValid(checkRequire('名称', 2, 50, this.nameValidator)),
          roleTypeId: [{required: true, message: '请选择角色类型',trigger: 'blur'}]
      },
      list: null,
      pager:Pager(),
      listLoading: true,
      listQuery: {
	        code: undefined,
	        name: undefined,
	        roleTypeId: '',
	        remark: undefined
      },
      roleTypes:[],
      dialogVisible: false,
      dialogStatus: '',
      isShowBtnEdit: false,
      isShowBtnDel: false,
      isShowBtnAdd: false,
      isShowBtnSetAuth: true,
      submitBtnLoading:false,
      textMap: {
        update: '修改',
        create: '添加'
      },
      authDialogVisible:false,
      curRole:{},
      authDialogTitle:"",
      tableKey: 0
    }
  },
  created() {
    this.pager.init(this.getList);
    this.getList();
    this.isShowBtnAdd = hasPermission('role.insert');
    this.isShowBtnEdit = hasPermission('role.update');
    this.isShowBtnDel = hasPermission('role.delete');
    this.isShowBtnSetAuth = hasPermission('role.auth');
    listForCom().then(response => {
      if(response && response.rel && response.data){
        this.roleTypes = response.data;
      }
    });
  },
  computed: {
    ...mapGetters(['elements'])
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
          this.form.roleTypeId = this.form.roleTypeId + '';
          this.oldCode = this.form.code;
          this.oldName = this.form.name;
          this.openDialog('update');
        }else{
          this.getList();
          this.$message({message: '该记录已不存在',showClose: true,type: 'warn'});
        }
      });
    },
    deleteHandler(row) {
      this.$confirm('确认要删除该角色?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        delObj(row.code).then((response) => {
          if(response && response.rel){
            this.$message({message: '删除成功',showClose: true,type: 'success'});
            const index = this.list.indexOf(row);
            this.list.splice(index, 1);
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
    codeValidator(rule, value, callback) {
      if(this.oldCode != value){
        setTimeout(() => {
          checkUnique({"code":value}).then(response => {
            if(response.data){
              callback(new Error("编码已存在"));
            }else{
              callback();
            }
          });
        }, 100);
      }else{
        callback();
      }
    },
    nameValidator(rule, value, callback) {
      if(this.oldName != value){
        setTimeout(() => {
          checkUnique({"name":value}).then(response => {
            if(response.data){
              callback(new Error("名称已存在"));
            }else{
              callback();
            }
          });
        }, 100);
      }else{
        callback();
      }
    },
    curRowClick(row){
    	this.curRole = row;
    },
    currentChangeHandler(data, node) {
	  if(!data){
		  this.curRole = {};
	      this.$refs['roleUser'].listQuery.roleCode = "";
	      this.$refs['roleUser'].getList();
	      return;
	  }
      if(this.curRole.code == data.code){
        return;
      }
      this.curRole = data;
      this.$refs['roleUser'].listQuery.roleCode = data.code;
      this.$refs['roleUser'].getList();
    },
    closeAuthDialog(){
      this.authDialogVisible = false;
    },
    toSetAuth(row) {
      this.curRole = row;
      this.authDialogTitle = "【"+ row.name + "】角色设置权限";

      if(this.$refs.roleAuth){
        this.$refs.roleAuth.getList(row.code);
      }
      this.authDialogVisible = true;
    }
  }
}
</script>
