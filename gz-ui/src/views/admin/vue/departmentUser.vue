<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">

            <el-form-item class="el-form-item-u">
                <el-input v-model="listQuery.name" clearable placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" >
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
                <el-button v-if="isShowBtnAddUser && showOper" class="filter-item" type="primary" @click="openDialog">增加</el-button>
                <el-button v-if="isShowBtnRemoveUser && showOper" class="filter-item" type="primary" @click="remove">移除</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
              max-height="500" @selection-change="handleSelectionChange">

        <el-table-column type="selection" width="47"></el-table-column>
	    <el-table-column label="工号" width="150px" align="center">
            <template slot-scope="scope"><span>{{scope.row.username}}</span></template>
        </el-table-column>

	      <el-table-column label="姓名" width="150px" align="center" flex>
            <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
        </el-table-column>

        <el-table-column label="操作时间" width="180" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operTime}}</span></template>
        </el-table-column>

        <el-table-column label="操作人" width="150" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operName}}</span></template>
        </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>
    
    <!--用户部门选择-->
    <el-dialog :title="'选择用户'" :visible.sync="selectDepartUserVisible" custom-class="select-depart-user-dialog"
    		:append-to-body="true" :modal-append-to-body="false">
      <select-depart-user ref="selectDepartUser" :departmentCode="departmentCode" 
      	:close="closeDialog" :callback="selectDepartUserCallback" />
    </el-dialog>

</div>
</template>

<style>
  .select-depart-user-dialog{
  width: 500px;
}
</style>

<script>
import {pageByDepart} from '@/views/admin/api/user';
import {removeUser} from '@/views/admin/api/department';
import $ from 'jquery';
import {Pager} from '@/components/pager/index';
import {hasPermission} from '@/utils/permissionUtil';
import { mapGetters } from 'vuex';
export default {
  name: 'departmentUser',
  props: {
      departmentCode: undefined
  },
  components: {
	  'select-depart-user': () => import('./selectDepartUser')
  },
  data() {
    return {
      list: null,
      pager:Pager(),
      listLoading: true,
      listQuery: {
        departmentCode:this.departmentCode,
        username: undefined,
        name: undefined
      },
      tableKey: 0,
      selectDepartUserVisible:false,
      isShowBtnAddUser: false,
      isShowBtnRemoveUser: false,
      multipleSelection: undefined
    }
  },
  created() {
    this.pager.init(this.getList);
    this.getList();
    this.isShowBtnAddUser = hasPermission('department.addUser');
    this.isShowBtnRemoveUser = hasPermission('department.removeUser');
  },
  computed: {
    showOper(){
    	return this.departmentCode!= 'bqjr_top_0';
    }
  },
  methods: {
    getList() {
      this.listLoading = true;
      $.extend(this.listQuery, this.pager.getPage());
      pageByDepart(this.listQuery).then(response => {
        this.list = response.data.list;
        this.pager.render(response.data.totalSize);
        this.listLoading = false;
      })
    },
    openDialog(){
    	if(!this.listQuery.departmentCode){
    		this.$message({message: '请先选择一个机构',showClose: true,type: 'warning'});
    		return ;
    	}
    	if(this.$refs['selectDepartUser'] && this.$refs['selectDepartUser'].listQuery){
    		this.$refs['selectDepartUser'].listQuery.departmentCode = this.listQuery.departmentCode;
    		this.$refs['selectDepartUser'].getList();
    	}
    	this.selectDepartUserVisible = true;
	},
	closeDialog(){
    	this.selectDepartUserVisible = false;
   	},
   	selectDepartUserCallback(){
   		this.getList();
   	},
   	handleSelectionChange(val) {
	    this.multipleSelection = val;
	  },
   	remove(){
   		if(!this.multipleSelection || this.multipleSelection.length < 1){
		  	this.$message({message: '请选择要移除的用户',showClose: true,type: 'warning'});
		  	return ;
		}
	  	var usernames =[];
	  	for (var i = 0; i<this.multipleSelection.length;i++) {
	  		usernames.push(this.multipleSelection[i].username);
	  	}
	  	console.log(usernames);
	    this.$confirm('确定要移除这'+usernames.length+'个用户?', '提示', {
	      confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
	    }).then(() => {
	        removeUser({usernames:usernames.join()}).then((response) => {
	            if(response && response.rel){
	              this.$message({message: '移除成功',showClose: true,type: 'success'});
	              this.getList();
	            }else{
	              this.$message({message: response.msg ? response.msg : '移除失败',showClose: true,type: 'error'});
	            }
	          });
	      }).catch(()=>{});
   	}
  }
}
</script>
