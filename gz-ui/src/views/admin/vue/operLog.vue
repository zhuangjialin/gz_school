<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">

            <el-form-item v-if="!userInfo.tenantId" class="el-form-item-u" label="租户">
                <el-input v-model="listQuery.tenantId" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="操作模块">
                <el-input v-model="listQuery.moduleName" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="操作名称">
                <el-input v-model="listQuery.operationName" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="操作人">
                <el-input v-model="listQuery.operUser" placeholder="输入姓名或账号" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" >
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>

	    <el-table-column v-if="!userInfo.tenantId" label="租户" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.tenantName}}</span></template>
        </el-table-column>

	    <el-table-column label="操作模块" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.moduleName}}</span></template>
        </el-table-column>

	    <el-table-column label="操作名称" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operationName}}</span></template>
        </el-table-column>

	    <el-table-column label="操作ip" width="130px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.ipAddress}}</span></template>
        </el-table-column>

        <el-table-column label="操作时间" width="180" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operTime}}</span></template>
        </el-table-column>

        <el-table-column label="操作人" width="180" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operName}}</span></template>
        </el-table-column>
        
        <el-table-column label="操作工号" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operUser}}</span></template>
        </el-table-column>

        <el-table-column  align="center" label="操作" width="87px" fixed="right">
            <template slot-scope="scope">
            <el-button size="small" type="success" @click="toDetail(scope.row)">查看</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>

    <el-dialog :title="'查看'" :visible.sync="dialogVisible" :append-to-body="true" :modal-append-to-body="false"
    	class="dailog-body-u" custom-class="dialog-operlog">

        <div class="el-dialog-panel">
            <el-form :model="form" ref="form" label-width="80px" class="form-body-u">
                
                <div style="display: table">
	                <el-form-item label="操作模块" prop="moduleName" style="float: left">
	                    <el-input v-model="form.moduleName" :readonly="true"></el-input>
	                </el-form-item>
	
	                <el-form-item label="操作名称" prop="operationName" style="float: left">
	                    <el-input v-model="form.operationName" :readonly="true"></el-input>
	                </el-form-item>
                </div>
                
                <div style="display: table">
					<el-form-item label="操作人" style="float: left">
	                    <el-input v-model="form.operName" :readonly="true"></el-input>
	                </el-form-item>
					
	                <el-form-item label="操作账号" style="float: left">
	                    <el-input v-model="form.operUser" :readonly="true"></el-input>
	                </el-form-item>
                </div>

				<div style="display: table">
					<el-form-item label="租户" prop="tenantName" style="float: left">
	                    <el-input v-model="form.tenantName" :readonly="true"></el-input>
	                </el-form-item>
					
	                <el-form-item label="操作ip" prop="ipAddress" style="float: left">
	                    <el-input v-model="form.ipAddress" :readonly="true"></el-input>
	                </el-form-item>
                </div>

                <el-form-item label="操作内容" prop="content" style="width: 540px;">
                    <el-input type="textarea" v-model="form.content" :readonly="true" :autosize="{minRows: 2, maxRows: 10}"></el-input>
                </el-form-item>

				<div style="display: table">
	                <el-form-item label="操作时间" style="float: left">
	                    <el-input v-model="form.operTime" :readonly="true" ></el-input>
	                </el-form-item>
	                
	                <el-form-item label="备注" prop="remark" style="float: left">
	                    <el-input v-model="form.remark" :readonly="true" ></el-input>
	                </el-form-item>
                </div>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog(false)">关闭</el-button>
        </div>
    </el-dialog>
</div>
</template>

<style>
.dialog-operlog{
  width: 610px;
}
	
</style>

<script>
import {page, getObj} from '@/views/admin/api/operLog';
import $ from 'jquery';
import {Pager} from '@/components/pager/index';
import { mapGetters } from 'vuex';
export default {
  name: 'operLog',
  data() {
    return {
      metadata:{},
      form: $.extend(true, {}, this.metadata),
      list: null,
      pager:Pager(),
      listLoading: true,
      listQuery: {
	        tenantId: undefined,
	        moduleName: undefined,
	        operationName: undefined,
	        operUser: undefined
      },
      dialogVisible: false,
      submitBtnLoading:false,
      tableKey: 0
    }
  },
  created() {
    this.pager.init(this.getList);
    this.getList();
  },
  computed: {
  	...mapGetters(['userInfo'])
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
    openDialog(){
      this.dialogVisible = true;
    },
    closeDialog(){
      this.dialogVisible = false;
    },
    toDetail(row) {
        if(row){
          this.form = row;
          this.openDialog();
        }else{
          this.getList();
          this.$message({message: '该记录已不存在',showClose: true,type: 'warn'});
        }
    },
    resetForm() {
      this.form = $.extend(true, {}, this.metadata);
    }
  }
}
</script>