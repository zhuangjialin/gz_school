<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">

			<el-form-item label="租户" v-if="showTenant" class="el-form-item-u">
                <el-select v-model="listQuery.tenantId" clearable placeholder="选择租户" style="width: 150px;">
                  <el-option v-for="item in tenants" :key="item.tenantId" :label="item.name" :value="item.tenantId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="工号姓名">
                <el-input v-model="listQuery.name" size="small" placeholder="输入关键字" style="width: 150px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="状态">
                <el-select v-model="listQuery.status" placeholder="选择状态" style="width: 85px;" @keyup.enter.native="getList" class="filter-item">
                  <el-option v-for="item in statusArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" >
                <el-button class="filter-item" type="primary" size="small" v-waves icon="icm icon-search" @click="getList">搜索</el-button>
                <el-button class="filter-item" v-if="isShowBtnAdd" size="small" @click="toCreate" type="primary" icon="icm icon-friendadd">添加</el-button>
                <el-button class="filter-item" v-if="isShowBtnDel" size="small" type="danger" @click="deleteHandler()" icon="icm icon-shanchu">删除</el-button>
                <el-button class="filter-item" v-if="isShowBtnAdd" size="small" @click="openImportView" type="primary" icon="icm icon-friendfill">导入</el-button>
                <el-popover v-if="isShowBtnAdd" placement="bottom-start" width="140" v-model="exportVisible">
  					<p align="center">确定要导出数据?</p>
				  	<div style="text-align: center;">
				    	<el-button size="mini"  @click="exportVisible = false;">取消</el-button>
				    	<el-button type="primary" size="mini" @click="toExport" >确定</el-button>
				  	</div>
				  	<el-button slot="reference" class="filter-item" :loading="downloadBtnLoading" type="primary" icon="icm icon-down">导出</el-button>
				</el-popover>
                <el-button class="filter-item" v-if="isShowBtnReset" size="small" type="danger" @click="resetPassword()" icon="icm icon-shezhi">重置密码</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
    	@selection-change="handleSelectionChange">

		<el-table-column type="selection" width="47"></el-table-column>
	    <el-table-column label="工号" width="180px" align="center" fixed="left">
            <template slot-scope="scope"><span>{{scope.row.username}}</span></template>
        </el-table-column>

	    <el-table-column label="姓名" width="150px" align="center" fixed="left">
            <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
        </el-table-column>

        <el-table-column label="所属机构" width="450px" align="center" flex>
            <template slot-scope="scope"><span>{{scope.row.departName}}</span></template>
        </el-table-column>

		<el-table-column label="邮箱" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.email}}</span></template>
        </el-table-column>

	    <el-table-column label="入职日期" width="120px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.joinDate}}</span></template>
        </el-table-column>

        <el-table-column label="操作时间" width="180" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operTime}}</span></template>
        </el-table-column>

        <el-table-column label="操作人" width="150" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operName}}</span></template>
        </el-table-column>

        <el-table-column  align="center" label="操作" width="180px" fixed="right">
            <template slot-scope="scope">
	            <el-button class="filter-item" v-if="isShowBtnEdit"  type="success" @click="toUpdate(scope.row)">编辑</el-button>
	            <el-button v-if="isShowBtnRole"  type="primary" @click="toSetUserRole(scope.row)">角色</el-button>
	            <el-button v-if="isShowBtnAuth"  type="primary" @click="toSetUserAuth(scope.row)">权限</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>

    <el-dialog v-if="dialogVisible" :title="textMap[dialogStatus]" :visible.sync="dialogVisible" class="dailog-body-u"
    	custom-class="el-dialog--small-u-adduser" :append-to-body="true" :modal-append-to-body="false">

      <div class="el-dialog-panel">
        <el-form :model="form" :rules="rules" ref="form" label-width="80px"  class="form-body-u">

          <div style="display: table">
            <el-form-item v-if="dialogStatus == 'create'" label="工号" prop="username" required style="float: left;width: 270px;">
            	<el-tooltip class="item" effect="dark" content="创建后不可修改" placement="top-start">
              		<el-input v-model="form.username" width="100px" placeholder="请输入工号"></el-input>
              	</el-tooltip>
            </el-form-item>

			<el-form-item label="姓名" prop="name" required style="float: left;width: 270px;">
              <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
            </el-form-item>

            <el-form-item v-if="dialogStatus == 'update'" label="账号状态" prop="status" style="float: left;width: 270px;">
              <el-radio-group v-model="form.status">
              	<el-radio v-for="item in statusArr" :key="item.value" :label="item.value">{{item.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <div style="display: table">
            <el-form-item label="邮箱" prop="email" style="float: left;width: 270px;">
              <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>

            <el-form-item label="职务" prop="postId" style="float: left;width: 270px;">
                <el-select v-model="form.postId" filterable clearable placeholder="选择职务" style="width: 190px;">
                  <el-option v-for="item in posts" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
          </div>
          <div style="display: table;">
	        <el-form-item label="所属部门" required prop="departName" style="float: left;width: 470px;">
	          <el-input v-model="form.departName" readonly placeholder="所属部门"></el-input>
	        </el-form-item>
	        <el-button @click="toSetSelectDepart()" type="primary"
	        	 style="float: left;margin-top: 3px;margin-left: 2px;">选择部门</el-button>
	      </div>
	      <div style="display: table;">
      		<el-form-item label="入职时间" prop="joinDate" required style="float: left;">
              <el-date-picker  type="date"  v-model="form.joinDate" placeholder="入职时间"
              	:clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="租户" v-if="showTenant" prop="rightTenantId" required style="float: left;width: 270px;">
                <el-select v-model="form.rightTenantId" clearable filterable placeholder="选择租户">
                  <el-option v-for="item in tenants" :key="item.tenantId" :label="item.name" :value="item.tenantId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="离职时间" v-if="form.status==3" prop="leaveDate" style="float: left;">
	          <el-date-picker :clearable="true" type="date" v-model="form.leaveDate" placeholder="离职时间" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </div>

          <el-form-item label="备注" prop="remark" style="width: 541px;">
            <el-input type="textarea" v-model="form.remark" :autosize="{minRows: 2, maxRows: 5}" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog(false)">取 消</el-button>
          <el-button :loading='submitBtnLoading' v-if="dialogStatus=='create'" @click="createHandler()" type="primary">确 定</el-button>
          <el-button :loading='submitBtnLoading' v-else @click="updateHandler()" type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <!--用户角色设置-->
    <el-dialog :title="dialogTitle" v-if="roleDialogVisible" :visible.sync="roleDialogVisible" custom-class="el-dialog--small-u-role"
    		:append-to-body="true" :modal-append-to-body="false">
        <user-role ref="userRole" :username="curUsername" :close="closeUserRoleDialog"></user-role>
    </el-dialog>

    <!--用户权限设置-->
    <el-dialog :title="dialogTitle" v-if="authDialogVisible" :visible.sync="authDialogVisible" top="3vh" custom-class="el-dialog--small-u-auth"
    		:append-to-body="true" :modal-append-to-body="false">
        <user-auth ref="userAuth" :username="curUsername" :close="closeUserAuthDialog"></user-auth>
    </el-dialog>

    <!--用户部门选择-->
    <el-dialog :title="dialogTitle" v-if="selectDepartVisible" :visible.sync="selectDepartVisible" custom-class="select-depart-dialog"
    		:append-to-body="true" :modal-append-to-body="false">
      <select-depart ref="selectDepart" :departCode="form.departCode" :userTenantId="form.tenantId"
      	:close="closeSelectDepartDialog" :callback="selectDepartCallback"></select-depart>
    </el-dialog>

    <!--导入界面-->
    <el-dialog :title="dialogTitle" v-if="importViewVisible" :visible.sync="importViewVisible" 
    		custom-class="import-view-dialog" :append-to-body="true" :modal-append-to-body="false">
      <importView ref="importView" :options="options"
      	:close="closeImportViewDialog" :callback="importViewCallback"/>
    </el-dialog>
</div>
</template>

<style>
.el-dialog--small-u-adduser{
  width: 650px;
}
.el-dialog--small-u-role{
  width: 580px;
}
.el-dialog--small-u-auth{
  width: 450px;
}
.select-depart-dialog{
  width: 450px;
}
.import-view-dialog{
	width: 430px;
}
</style>

<script>
import {page, addObj, getObj, delObj, updObj, checkUser, download_, getTemplateURL, getImportURL} from '@/views/admin/api/user';
import {changePassword} from '@/views/common/login';
import {listForComPost} from '@/views/admin/api/post';
import {listForComTenant} from '@/views/admin/api/tenant';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {formatDate} from '@/utils/dateUtil';
import {Pager} from '@/components/pager/index';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
import { mapGetters } from 'vuex';
export default {
name: 'user',
components: {
  'user-role': () => import('./userRole'),
  'user-auth': () => import('./userAuth'),
  'select-depart': () => import('./selectDepart'),
  'importView': () => import('@/components/ImportView')
},
data() {
  return {
    metadata:{
      username: '',
      status:1,
      name: '',
      departCode: '',
      departName: '',
      postId: '',
      rightTenantId: '',
      joinDate: '',
      leaveDate: undefined,
      remark:''
    },
    form: $.extend(true, {}, this.metadata),
    rules: {
        username: creatValid(checkRequire('工号', 2, 50, this.usernameValidator)),
        email: creatValid(check('邮箱', 2, 50)),
        name: creatValid(checkRequire('姓名', 2, 50)),
        departName: [{required: true, message: '请选择所属部门',trigger: 'blur'}],
        rightTenantId: [{required: true, message: '请选择租户',trigger: 'blur'}],
        joinDate: [{required: true, message: '请选择入职时间',trigger: 'blur'}],
        remark: creatValid(check('备注', 2, 200)),
    },
    list: null,
    pager:Pager(),
    listLoading: true,
    listQuery: {
      tenantId: this.tenantId,
      username: undefined,
      name: undefined,
      status: 1
    },
    posts:[],
    tenants:[],
    statusArr:[
    	{name:"可用", value:1},
    	{name:"不可用", value:2},
    	{name:"注销", value:3}
    ],
    dialogVisible: false,
    dialogStatus: '',
    isShowBtnEdit: false,
    isShowBtnDel: false,
    isShowBtnAdd: false,
    isShowBtnRole: true,
    isShowBtnAuth: true,
    isShowBtnReset:false,
    submitBtnLoading:false,
    downloadBtnLoading:false,
    textMap: {
      update: '修改',
      create: '添加'
    },
    dialogTitle: '',
    roleDialogVisible:false,
    authDialogVisible:false,
    selectDepartVisible:false,
    importViewVisible: false,
    curUsername:undefined,
    tableKey: 0,
    multipleSelection: undefined,
    options:{
    	templateName: '用户导入模板',
    	templateURL: getTemplateURL(),
    	action: getImportURL()
    },
    exportVisible: false
  }
},
created() {
	this.listQuery.tenantId = this.tenantId; 
  this.pager.init(this.getList);
  this.getList();
  this.isShowBtnAdd = hasPermission('user.insert');
  this.isShowBtnAddBatch = hasPermission('user.insertBatch');
  this.isShowBtnEdit = hasPermission('user.update');
  this.isShowBtnDel = hasPermission('user.delete');
  this.isShowBtnRole = hasPermission('user.role');
  this.isShowBtnAuth = hasPermission('user.auth');
  this.isShowBtnReset =hasPermission('user.password-reset');
  if(this.showTenant){
  	this.initTenants();
  }
},
computed: {
	...mapGetters(['tenantId']),
	showTenant(){
		return this.tenantId == 'DEFAULT';
	}
},
methods: {
  initPosts(){
	listForComPost().then(response => {
	    this.posts = response.data;
	});
  },
  initTenants(){
	listForComTenant().then(response => {
	    this.tenants = response.data;
	});
  },
  getList() {
    this.listLoading = true;
    $.extend(this.listQuery, this.pager.getPage());
    page(this.listQuery).then(response => {
      this.list = response.data.list;
      this.pager.render(response.data.totalSize);
      this.listLoading = false;
    })
  },
  handleSelectionChange(val) {
    this.multipleSelection = val;
  },
  openDialog(status){
    this.dialogStatus = status;
    this.dialogVisible = true;
    this.initPosts();
    if(status == 'create'){
    	this.form.joinDate = formatDate(new Date(), 'yyyy-MM-dd');
    }
    if(this.showTenant){
    	this.initTenants();
    }
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
  	  if(!row || !row.id){
  	  	this.$message.warning({message: '请先刷新列表后再编辑',showClose: true,type: 'warning', center: true});
  	  	return ;
  	  }
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
            this.$message({message: '该记录已不存在',showClose: true,type: 'warning'});
          }
      });
  },
  deleteHandler() {
  	if(!this.multipleSelection || this.multipleSelection.length < 1){
	  	this.$message({message: '请选择要删除的用户',showClose: true,type: 'warning'});
	  	return ;
	}
  	var usernames =[];
  	for (var i = 0; i<this.multipleSelection.length;i++) {
  		usernames.push(this.multipleSelection[i].username);
  	}
    this.$confirm('确定要删除这'+usernames.length+'个用户?', '提示', {
      confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
    }).then(() => {
        delObj({usernames:usernames.join()}).then((response) => {
            if(response && response.rel){
              this.$message({message: '删除成功',showClose: true,type: 'success'});
              this.getList();
            }else{
              this.$message({message: response.msg ? response.msg : '删除失败',showClose: true,type: 'error'});
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
            this.$message.success({message: '修改成功',showClose: true});
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
  usernameValidator(rule, value, callback) {
      if(this.dialogStatus == 'create'){
        setTimeout(() => {
          checkUser(value).then(response => {
            if(response.data){
              callback(new Error("用户名已存在"));
            }else{
              callback();
            }
          });
        }, 100);
      }else{
        callback();
      }
  },
  resetPassword() {
    if(!this.multipleSelection || this.multipleSelection.length !== 1){
      this.$message({message: '请选择要重置密码的用户(只能选一个用户)',showClose: true,type: 'warning'});
      return ;
    }
    var username = this.multipleSelection[0].username;
    var data={
      username:username,
      operType: 2
    };
    this.$confirm('确定要重置'+username+'这个用户的密码吗?重置后密码为创建时的默认密码', '提示', {
      confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
    }).then(() => {

      changePassword(data).then((response) => {
        if(response && response.rel){
          this.$message({message: '重置密码成功',showClose: true,type: 'success'});
          this.getList();
        }else{
          this.$message({message: response.msg ? response.msg : '重置密码失败',showClose: true,type: 'error'});
        }
      });
    }).catch(()=>{});
  },
  closeUserRoleDialog(){
    this.roleDialogVisible = false;
  },
  toSetUserRole(row){
    this.dialogTitle = "用户角色设置【"+row.name+"】"
    this.roleDialogVisible = true;
    this.curUsername = row.username;
    if(this.$refs.userRole){
      this.$refs.userRole.getList(row.username);
    }
  },
  closeUserAuthDialog(){
    this.authDialogVisible = false;
  },
  toSetUserAuth(row){
    this.dialogTitle = "用户权限设置【"+row.name+"】"
    this.curUsername = row.username;
    this.authDialogVisible = true;
    if(this.$refs.userAuth){
      this.$refs.userAuth.getList(row.username);
    }
  },
  closeSelectDepartDialog(){
    this.selectDepartVisible = false;
  },
  toSetSelectDepart(){
    this.dialogTitle = "选择部门";
    this.selectDepartVisible = true;
  },
  selectDepartCallback(obj){
  	if(obj){
  		this.form.departCode = obj.departCode;
  		this.form.departName = obj.departName;
  	}
  },
  closeImportViewDialog(){
    this.importViewVisible = false;
  },
  openImportView(){
    this.dialogTitle = "导入用户数据";
    this.importViewVisible = true;
  },
  importViewCallback(obj){
  	this.getList();
  },
  toExport(){
//	this.$confirm('确定要导出这些用户数据?', '提示', {
//    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
//  }).then(() => {
        this.downloadBtnLoading = true;
	  	download_(this.listQuery, ()=>{
	  		this.downloadBtnLoading = false;
	  		this.exportVisible = false;
	  	});
    //}).catch(()=>{});
  }
}
}
</script>
