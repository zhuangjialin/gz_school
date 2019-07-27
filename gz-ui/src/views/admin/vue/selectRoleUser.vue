<template>
  <div>
    <div class="el-dialog-panel">
      <div class="app-container calendar-list-container">
        <div class="filter-container">
          <el-form :inline="true" :model="listQuery">

            <el-form-item class="el-form-item-u" >
              <el-input v-model="listQuery.name" size="small" placeholder="输入关键字" style="width: 120px;"
                        @keyup.enter.native="getList" class="filter-item"></el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u">
              <el-button class="filter-item" type="primary" size="small" v-waves icon="search" @click="getList"
                         style="margin-bottom: 3px;">搜索
              </el-button>
            </el-form-item>
            <el-form-item class="el-form-item-u">
              <div>{{selectedMsg}}</div>
            </el-form-item>
          </el-form>
        </div>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit
                  highlight-current-row @selection-change="selectionChangeHandler"
                  max-height="300" ref="resTable" current-row-key="code">

          	<el-table-column type="selection" width="40"></el-table-column>
		    		<el-table-column label="工号" width="160px" align="center">
	            <template slot-scope="scope"><span>{{scope.row.username}}</span></template>
	        	</el-table-column>
	
		    		<el-table-column label="姓名"  align="center" >
	            <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
        		</el-table-column>

        </el-table>

        <div v-show="!listLoading" class="pagination-container">
          <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize"
                         :layout="pager.layout" :page-sizes="pager.sizes"
                         @size-change="function(val){pager.sizeChangeHandler(val)}"
                         @current-change="pager.currentChangeHandler()"></el-pagination>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer dialog-footer-u">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button :loading=submitBtnLoading @click="addHandler" type="primary">确 定</el-button>
    </div>
  </div>
</template>
<script>
  import {addUser} from '@/views/admin/api/role';
  import {pageRoleUserToChoose } from '@/views/admin/api/user';
  import $ from 'jquery';
  import {Pager} from '@/components/pager/index';
  export default {
    name: 'selectRoleUser',
    props: {
      close: {
        type: Function,
        default: () => {
        }
      },
      callback:{
        type: Function,
        default: () => {
        }
      },
      roleCode: {
      	type: String,
      	required: true
      }
    },
    data() {
      return {
        list: null,
        pager: Pager(),
        listLoading: true,
        listQuery: {
          roleCode: this.roleCode
        },
        submitBtnLoading: false,
        selectedMsg: '未选择',
        toAdds: [],
        tableKey: 0
      }
    },
    created() {
      this.pager.init(this.getList);
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        $.extend(this.listQuery, this.pager.getPage());
        pageRoleUserToChoose(this.listQuery).then(response => {
          this.list = response.data.list
          this.pager.render(response.data.totalSize);
          this.listLoading = false;
        })
      },
      addHandler() {
      	if(!this.toAdds || this.toAdds.length == 0){
      		this.$message({message: '请选择用户',showClose: true,type: 'warning'});
      		return;
      	}
	      this.submitBtnLoading = true;
	      var usernames = [];
	      for (var i = 0; i < this.toAdds.length; i++) {
	        usernames.push(this.toAdds[i].username);
	      }
	      var data={
	      	roleCode:this.roleCode,
	      	usernames: usernames.join(',')
	      };
	      addUser(data).then(response => {
	        if (response && response.rel) {
	          this.closeDialog(true);
	          this.$message({message: '添加成功', showClose: true, type: 'success'});
	          this.clearTableSelect();
	          this.callback();
	        } else {
	          this.$message({message: response.msg ? response.msg : '添加失败', showClose: true, type: 'error'});
	        }
	        this.submitBtnLoading = false;
	      });
      },
      selectionChangeHandler(val) {
        this.toAdds = val;
        this.selectedMsg = val && val.length > 0 ? '已选择' + val.length + '个人员' : '未选择';
      },
      clearTableSelect(){
        this.toAdds = [];
        this.$refs['resTable'].clearSelection();
      },
      closeDialog(){
	      this.close();
	    },
    }
  }
</script>
