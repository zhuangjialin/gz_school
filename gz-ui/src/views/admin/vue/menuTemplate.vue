<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">

            <el-form-item class="el-form-item-u" label="模板名称">
                <el-input v-model="listQuery.name" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
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

		<el-table-column label="模板名称" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
        </el-table-column>
        
	    <el-table-column label="模板编码" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.code}}</span></template>
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

        <el-table-column  align="center" label="操作" width="180px" fixed="right">
            <template slot-scope="scope">
            <el-button v-if="isShowBtnEdit" size="small" type="success" @click="toUpdate(scope.row)">编辑</el-button>
            <el-button v-if="isShowBtnEditMenu" size="small" type="primary" @click="toSetMenu(scope.row)">菜单</el-button>
            <el-button v-if="isShowBtnDel" size="small" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" class="dailog-body-u" 
    	custom-class="el-dialog-u-add-menuTemplate" :append-to-body="true" :modal-append-to-body="false">

        <div class="el-dialog-panel">
            <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="form-body-u">

	      		<div style="display: table;">
	                <el-form-item label="模板名称" required prop="name" style="float: left;width: 270px;">
	                    <el-input v-model="form.name" placeholder="请输入模板名称"></el-input>
	                </el-form-item>
	                
	                <el-form-item label="模板编码" required prop="code" style="float: left;width: 270px;">
	                	<el-tooltip v-if="dialogStatus=='create'" class="item" effect="dark" content="创建后不可修改" placement="top-start">
		              		<el-input v-model="form.code" placeholder="请输入模板编码"></el-input>
		              	</el-tooltip>
		              	<el-input v-else :disabled="true" v-model="form.code" placeholder="请输入模板编码"></el-input>
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
    
    <!--模板菜单设置-->
    <el-dialog :title="dialogTitle" v-if="menuDialogVisible" :visible.sync="menuDialogVisible" top="3vh" custom-class="el-dialog-u-menu-menuTemplate"
    		:append-to-body="true" :modal-append-to-body="false">
        <template-menu ref="templateMenu" :templateCode="curTemplateCode" :close="closeMenuDepartDialog"/>
    </el-dialog>
</div>
</template>

<style>
.el-dialog-u-add-menuTemplate{
  width: 600px;
}
.el-dialog-u-menu-menuTemplate{
  width: 450px;
}
</style>

<script>
import {page, addObj, getObj, delObj, updObj} from '@/views/admin/api/menuTemplate';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
import { mapGetters } from 'vuex';
export default {
  name: 'menuTemplate',
  components: {
	  'template-menu': () => import('./template-menu')
  },
  data() {
    return {
      metadata:{
	        code: undefined,
	        name: undefined,
	        remark: undefined
      },
      form: $.extend(true, {}, this.metadata),
      rules: {
            code: creatValid(checkRequire('模板编码', 2, 100)),
            name: creatValid(checkRequire('模板名称', 2, 100)),
            remark: creatValid(check('', 2, 200))
      },
      list: null,
      pager:Pager(),
      listLoading: true,
      listQuery: {
	        code: undefined,
	        name: undefined,
	        remark: undefined
      },
      dialogTitle:'',
      dialogVisible: false,
      menuDialogVisible: false,
      dialogStatus: '',
      isShowBtnEdit: false,
      isShowBtnDel: false,
      isShowBtnAdd: false,
      submitBtnLoading:false,
      textMap: {
        update: '修改',
        create: '添加'
      },
      tableKey: 0,
      curTemplateCode: undefined
    }
  },
  created() {
    this.pager.init(this.getList);
    this.getList();
    this.isShowBtnAdd = hasPermission('menuTemplate-add');
    this.isShowBtnEdit = hasPermission('menuTemplate-update');
    this.isShowBtnDel = hasPermission('menuTemplate-delete');
    this.isShowBtnEditMenu = hasPermission('menuTemplate-editMenu');
  },
  computed: {
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
	toSetMenu(row){
    	this.dialogTitle = "选择菜单【"+row.name+"】"
    	this.curTemplateCode = row.code;
    	this.menuDialogVisible = true;
    	if(this.$refs.templateMenu){
      		this.$refs.templateMenu.getList(row.code);
    	}
  	},
  	closeMenuDepartDialog(){
    	this.menuDialogVisible = false;
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
    resetForm() {
      this.form = $.extend(true, {}, this.metadata);
    }
  }
}
</script>