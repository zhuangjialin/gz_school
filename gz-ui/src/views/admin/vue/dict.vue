<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">
			
			<el-form-item v-if="showTenant" label="租户" class="el-form-item-u">
                <el-select v-model="listQuery.tenantId" clearable placeholder="选择租户" 
                	@change="queryTenantChange" style="width: 150px;">
            		<el-option v-for="item in tenants" :key="item.tenantId" :label="item.name" :value="item.tenantId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="字典项">
                <el-select v-model="listQuery.parentId" filterable placeholder="选择字典项" 
                	@change="getList" style="width: 150px;">
                	<template v-for="item in dicts">
                		<el-option v-if="!item.tenantId" :key="item.id" :label="item.name+'(全局)'" :value="item.id"></el-option>
                		<el-option v-else :key="item.id" :label="item.name" :value="item.id"></el-option>
                	</template>
                </el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" >
                <el-input v-model="listQuery.name" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" >
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
                <el-button class="filter-item"  v-if="isShowBtnAddFirst && listQuery.parentId == '0'" @click="toCreateFirst" type="primary" icon="edit">添加</el-button>
                <el-button class="filter-item"  v-if="isShowBtnAdd && listQuery.parentId != '0' && dictMapping[listQuery.parentId] == tenantId" @click="toCreate" type="primary" icon="edit">添加</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>

	    <el-table-column label="字典名称" width="200px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.parentName}}</span></template>
        </el-table-column>
        
        <el-table-column label="字典编码" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.parentCode}}</span></template>
        </el-table-column>
        
        <el-table-column v-if="!showSecCol" label="键值对数量" width="120px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.count}}</span></template>
        </el-table-column>
        
        <el-table-column v-if="showSecCol" label="键" width="120px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.code}}</span></template>
        </el-table-column>
        
        <el-table-column v-if="showSecCol" label="值" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
        </el-table-column>
        
        <el-table-column label="租户" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.tenantName}}</span></template>
        </el-table-column>

        <el-table-column label="备注" align="center" :show-overflow-tooltip='true'>
            <template slot-scope="scope"><span>{{scope.row.remark}}</span></template>
        </el-table-column>

        <el-table-column label="操作时间" width="180" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operTime}}</span></template>
        </el-table-column>

        <el-table-column label="操作人" width="150" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operName}}</span></template>
        </el-table-column>

        <el-table-column  align="center" label="操作" width="130px" fixed="right">
            <template slot-scope="scope">
	            <el-button v-if="isShowBtnEdit && (showTenant || scope.row.tenantId == tenantId)" type="success" @click="toUpdate(scope.row)">编辑</el-button>
	            <el-button v-if="isShowBtnDel && showTenant" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" class="dailog-body-u" 
    	custom-class="el-dialog-u-add-dict" :append-to-body="true" :modal-append-to-body="false">

        <div class="el-dialog-panel">
            <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="form-body-u">

            	<div v-if="dialogStatus =='createFirst' || dialogStatus =='updateFirst'" style="display: table">
	               <el-form-item label="名称" prop="name" required style="float: left;width: 270px;">
	                   <el-input v-model="form.name" placeholder="请输入字典名称"></el-input>
	               </el-form-item>
	               <el-form-item label="编码" prop="code" required style="float: left;width: 270px;">
	               	<el-tooltip class="item" effect="dark" content="创建后不可修改" placement="top-start">
	                   <el-input v-if="dialogStatus =='createFirst'" v-model="form.code" placeholder="请输入字段编码"></el-input>
	                   <el-input v-else disabled v-model="form.code" placeholder="请输入字段编码"></el-input>
	                </el-tooltip>
	               </el-form-item>
            	</div>
            	<div v-else style="display: table">
            		<el-form-item label="值" prop="name" required style="float: left;width: 270px;">
	                   <el-input v-model="form.name" placeholder="请输入解释"></el-input>
	                </el-form-item>
	                <el-form-item label="键" prop="code" required style="float: left;width: 270px;">
	                   <el-input v-model="form.code" placeholder="请输入键值"></el-input>
	                </el-form-item>
            	</div>
                <div style="display: table;">
                	<el-form-item v-if="showTenant && dialogStatus=='createFirst'" label="租户" style="float: left;width: 270px;">
		                <el-select v-model="form.tenantId" clearable placeholder="选择租户"
		                	@change="tenantChange">
		                  <el-option v-for="item in tenants" :key="item.tenantId" :label="item.name" :value="item.tenantId"></el-option>
		                </el-select>
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
            <el-button :loading=submitBtnLoading v-if="dialogStatus=='update' || dialogStatus=='updateFirst'" 
            		@click="updateHandler()" type="primary">确 定</el-button>
            <el-button :loading=submitBtnLoading v-else @click="createHandler()" type="primary">确 定</el-button>
        </div>
    </el-dialog>
    
</div>
</template>

<style>
.el-dialog-u-add-dict{
  width: 600px;
}
</style>

<script>
import {page, addObj, getObj, delObj, updObj, listForCom, checkUnique} from '@/views/admin/api/dict';
import {listForComTenant} from '@/views/admin/api/tenant';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
import { mapGetters } from 'vuex';
import {getMapFromArr} from '@/utils/arrayUtil';
export default {
  	name: 'dict',
  	data() {
    	return {
      		metadata:{
	      		tenantId: this.tenantId,
		        parentId: undefined,
		        code: undefined,
		        name: undefined,
		        remark: undefined
	      	},
      		form: $.extend(true, {}, this.metadata),
      		rules:{},
      		rulesFirst: {
	            code: creatValid(checkRequire('编码', 1, 100, this.codeValidator)),
	            name: creatValid(checkRequire('名称', 1, 100)),
	            remark: creatValid(check('备注', 2, 200))
	      	},
	      	rulesSec: {
	            code: creatValid(checkRequire('键值', 1, 100, this.codeValidator)),
	            name: creatValid(checkRequire('解释', 1, 100)),
	            remark: creatValid(check('备注', 2, 200))
	      	},
      		list: null,
      		pager:Pager(),
      		listLoading: true,
      		listQuery: {
	      		tenantId: this.tenantId,
		        parentId: '0',
		        code: undefined,
		        name: undefined
	      	},
      		dialogVisible: false,
	      	dialogStatus: '',
	      	isShowBtnEdit: false,
	      	isShowBtnDel: false,
	      	isShowBtnAdd: false,
	      	isShowBtnAddFirst: false,
	      	submitBtnLoading:false,
	      	textMap: {
		        update: '修改键值对',
		        create: '添加键值对',
		        createFirst: '添加字典项'
		    },
	      	dialogTitle: '',
	      	tableKey: 0,
	      	dicts:[],
	      	showSecCol:false,
	      	tenants:[]
    	}
  	},
  	created() {
	  	if(!this.listQuery.tenantId && this.tenantId != 'DEFAULT'){
		  	this.listQuery.tenantId = this.tenantId;
		}
	    this.pager.init(this.getList);
	    this.getList();
	    this.isShowBtnAdd = hasPermission('dict.insert');
	    this.isShowBtnAddFirst = hasPermission('dict.insertFirst');
	    this.isShowBtnEdit = hasPermission('dict.update');
	    this.isShowBtnDel = hasPermission('dict.delete');
	    this.initDicts(this.listQuery.tenantId);
	    if(this.showTenant){
		  	this.initTenants();
		}
  	},
  	computed: {
	  	...mapGetters(['tenantId']),
	  	showTenant(){
	  		return this.tenantId == 'DEFAULT';
	  	},
	  	dictMapping(){
	  		return getMapFromArr(this.dicts, 'id', 'tenantId');
	  	}
  	},
  	methods: {
	  	initDicts(tenantId){
			listForCom(tenantId).then(response => {
		    	this.dicts = response.data;
			});
		},
		initTenants(){
			listForComTenant().then(response => {
			    this.tenants = response.data;
			});
		},
		queryTenantChange(val){
			this.initDicts(val);
			this.listQuery.parentId = '0';
			this.getList();
		},
		tenantChange(val){
			this.$refs['form'].validate(()=>{});
		},
    	getList() {
	      	this.listLoading = true;
	      	this.showSecCol = this.listQuery.parentId != '0';
	      	$.extend(this.listQuery, this.pager.getPage());
	      	page(this.listQuery).then(response => {
		        this.list = response.data.list;
		        this.pager.render(response.data.totalSize);
		        this.listLoading = false;
	      	})
	    },
	    openDialog(status){
	      	this.dialogStatus = status;
	      	this.dialogTitle = this.textMap[status];
	      	this.dialogVisible = true;
	    },
    closeDialog(toClear){
      this.dialogVisible = false;
      if(toClear || this.dialogStatus == 'update'){
        this.$refs['form'].resetFields();
      }
    },
    toCreateFirst() {
        this.resetForm();
        this.form.parentId = this.listQuery.parentId;
        if(this.form.parentId == '0'){
        	this.openDialog('createFirst');
        	this.rules = this.rulesFirst;
        }else{
        	this.$message.error({message: '数据异常，请刷新页面重试!',showClose: true});
        }
    },
    toCreate() {
        this.resetForm();
        this.form.parentId = this.listQuery.parentId;
        if(this.form.parentId != '0'){
        	this.openDialog('create');
        	this.rules = this.rulesSec;
        	let obj = this.dicts.find((item)=>{return item.id == this.listQuery.parentId;});
        	this.dialogTitle = '【' +obj.name+ '】' + this.dialogTitle;
        	this.form.tenantId = obj.tenantId;
        }else{
        	this.$message.error({message: '数据异常，请刷新页面重试!',showClose: true});
        }
    },
    toUpdate(row) {
        getObj(row.id).then(response => {
            if(response.data){
				this.form = response.data;
				if(!this.showSecCol){
				  	this.openDialog('updateFirst');
					this.rules = this.rulesFirst;
				}else{
				  	this.openDialog('update');
					this.rules = this.rulesSec;
					this.dialogTitle = '【' +row.parentName+ '】' + this.dialogTitle;
				}
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
          delObj(row.id, row.tenantId).then((response) => {
              if(response && response.rel){
                this.$message({message: '删除成功',showClose: true,type: 'success'});
                this.getList();
                if(row.parentId == '0'){
                	this.initDicts();
                }
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
                this.initDicts();
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
              if(this.form.parentId == '0'){
                	this.initDicts();
               }
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
    codeValidator(rule, value, callback) {
      if(this.dialogStatus == 'create' || this.dialogStatus == 'createFirst'){
        setTimeout(() => {
          checkUnique(this.form.tenantId, this.form.parentId, value).then(response => {
            if(response.data){
              callback(new Error(this.dialogStatus == 'create'? "键值已存在" : "编码已存在"));
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