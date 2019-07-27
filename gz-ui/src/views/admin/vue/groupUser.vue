<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">

            <el-form-item class="el-form-item-u" label="">
                <el-input v-model="listQuery.name" clearable placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" >
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
                <el-button v-if="isShowBtnAddUser" class="filter-item" type="primary" @click="openDialog">增加</el-button>
                <el-button v-if="isShowBtnRemoveUser" class="filter-item" type="primary" @click="remove">移除</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' @row-click="rowClick" ref="groupUserTable" :data="list" v-loading.body="listLoading" border fit highlight-current-row 
    	@selection-change="handleSelectionChange">
        <el-table-column type="selection" width="47"></el-table-column>

		<el-table-column label="姓名" width="120px" align="center" fixed="left">
            <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
        </el-table-column>
        
	    <el-table-column label="工号" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.username}}</span></template>
        </el-table-column>
        
	    <el-table-column label="成员类型" width="100px" align="center">
            <template slot-scope="scope"><span>{{typeMapping[scope.row.type]}}</span></template>
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

    <el-dialog :title="'选择用户'" v-if="selectGroupUserVisible" :visible.sync="selectGroupUserVisible" custom-class="select-Group-user-dialog"
    		:append-to-body="true" :modal-append-to-body="false">
      <select-group-user ref="selectGroupUser" :groupCode="groupCode"
                        :close="closeDialog" :callback="selectGroupUserCallback" />
    </el-dialog>
</div>
</template>

<style>
.el-dialog-u-add-groupUser{
  width: 600px;
}
.select-Group-user-dialog {
  width: 600px;
}
</style>

<script>
import {removeUser} from '@/views/admin/api/group';
import {pageByGroup } from '@/views/admin/api/user';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import {getMapFromArr} from '@/utils/arrayUtil';
import { mapGetters } from 'vuex';
export default {
  name: 'groupUser',
  props: {
    groupCode: {
    	type: String
    }
  },
  components: {
    'select-group-user': () => import('./selectGroupUser')
  },
  computed: {
    typeMapping(){
      return getMapFromArr(this.typeArr);
    }
  },
  data() {
    return {
      list: null,
      pager:Pager(),
      listLoading: true,
      listQuery: {
          	groupCode:this.groupCode,
          	name: undefined,
	        type: undefined
      },
      typeArr:[{value:0, name:'组员'},{value:1, name:'组长'}],
      dialogVisible: false,
      dialogStatus: '',
      isShowBtnEdit: false,
      isShowBtnRemoveUser: false,
      isShowBtnAddUser: false,
      submitBtnLoading:false,
      selectGroupUserVisible:false,
      multipleSelection: [],
      tableKey: 0
    }
  },
  created() {
    this.pager.init(this.getList);
    this.getList();
    this.isShowBtnAddUser = hasPermission('group.groupUser.insert');
    this.isShowBtnEdit = hasPermission('group.groupUser.update');
    this.isShowBtnRemoveUser = hasPermission('group.groupUser.delete');
  },
  methods: {
    getList() {
      this.listLoading = true;
      $.extend(this.listQuery, this.pager.getPage());
      pageByGroup(this.listQuery).then(response => {
        this.list = response != null ? response.data.list : null;
        this.pager.render(response != null ? response.data.totalSize : null);
        this.listLoading = false;
      })
    },
    handleSelectionChange(val) {
       this.multipleSelection = val;
    },
    selectGroupUserCallback(){
      this.getList();
    },
    openDialog() {
      if(!this.listQuery.groupCode){
        this.$message({message: '请先选择一个小组',showClose: true,type: 'warning'});
        return ;
      }
      this.selectGroupUserVisible = true;
    },
    closeDialog(){
      this.selectGroupUserVisible = false;
    },
    remove(){
      if(!this.multipleSelection || this.multipleSelection.length < 1){
        this.$message({message: '请选择要移除的用户',showClose: true,type: 'warning'});
        return ;
      }
      var username =[];
      let type = this.multipleSelection[0].type;
      for (var i = 0; i<this.multipleSelection.length;i++) {
      	if(type != this.multipleSelection[i].type){
      		this.$message.warning({message: '单次只能移除相同的成员类型',showClose: true});
        	return ;
      	}
        username.push(this.multipleSelection[i].username);
      }
      this.$confirm('确定要移除这'+username.length+'个用户?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
      	let data={
      		type: type,
      		groupCode:this.groupCode,
      		username:username.join()
      	}
        removeUser(data).then((response) => {
          if(response && response.rel){
            this.$message({message: '移除成功',showClose: true,type: 'success'});
            this.getList();
          }else{
            this.$message({message: response.msg ? response.msg : '移除失败',showClose: true,type: 'error'});
          }
        });
      }).catch(()=>{});
    },
    resetForm() {
      this.form = $.extend(true, {}, this.metadata);
    },
    rowClick(row, event, column) {
    	this.$refs['groupUserTable'].toggleRowSelection(row, this.multipleSelection.indexOf(row)<0);
    }
  }
}
</script>
