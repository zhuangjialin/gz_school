<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">

            <el-form-item class="el-form-item-u" label="名称">
                <el-input v-model="listQuery.name" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <!--<el-form-item class="el-form-item-u" label="部门">
                <el-input v-model="listQuery.departmentCode" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>-->
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

	    <el-table-column label="名称" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
        </el-table-column>

	      <!--<el-table-column label="部门" width="250px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.departmentName}}</span></template>
        </el-table-column>-->

        <el-table-column label="备注" align="center">
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
            <el-button v-if="isShowBtnEdit" size="small" type="success" @click="toUpdate(scope.row)">编辑</el-button>
            <el-button v-if="isShowBtnDel" size="small" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" custom-class="el-dialog--small-u-post"
    		:append-to-body="true" :modal-append-to-body="false">

        <div class="el-dialog-panel">
            <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="form-body-u">

              <div style="display: table">
                <el-form-item label="名称" prop="name" required style="float: left">
                  <el-input v-model="form.name" placeholder="请输入名称"></el-input>
                </el-form-item>
              </div>

                <el-form-item label="备注" prop="remark" style="width: 255px;">
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
</div>
</template>

<style>
  .el-dialog--small-u-post{
    width: 320px;
  }
</style>
<script>
import {page, addObj, getObj, delObj, updObj} from '@/views/admin/api/post';
import {hasPermission} from '@/utils/permissionUtil';
import $ from 'jquery';
import {Pager} from '@/components/pager/index';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
import { mapGetters } from 'vuex';
export default {
  name: 'post',
  data() {
    return {
      metadata:{
	        name: undefined,
	        departmentCode: '',
	        remark: undefined
      },
      form: $.extend(true, {}, this.metadata),
      rules: {
            name: creatValid(checkRequire('名称', 2, 100)),
            //departmentCode: [{required: true, message: '请选择部门',trigger: 'blur'}],
            remark: creatValid(check('', 2, 200))
      },
      list: null,
      pager:Pager(),
      listLoading: true,
      listQuery: {
	        name: undefined,
	        departmentCode: undefined,
	        remark: undefined
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
    this.isShowBtnAdd = hasPermission('post.insert');
    this.isShowBtnEdit = hasPermission('post.update');
    this.isShowBtnDel = hasPermission('post.delete');
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
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
          delObj(row.id).then((response) => {
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
    }
  }
}
</script>
