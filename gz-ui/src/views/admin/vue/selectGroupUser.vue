<template>
  <div>
    <div class="el-dialog-panel" style="overflow: hidden;">
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
            
            <el-form-item class="el-form-item-u" required label="成员类型" style="float: right !important;">
		          <el-select v-model="typeValue" filterable placeholder="选择成员类型" style="width: 100px;">
		            <el-option v-for="item in typeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
		          </el-select>
		        </el-form-item>
          </el-form>
        </div>
        <el-table :key='tableKey' :data="list" @row-click="clickRow" v-loading.body="listLoading" border fit
                  highlight-current-row @selection-change="selectionChangeHandler"
                  max-height="300" ref="resTable" current-row-key="code">

          	<el-table-column type="selection" width="47"></el-table-column>
		    		<el-table-column label="姓名"  align="center" >
	            <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
        		</el-table-column>
        		<el-table-column label="工号" width="160px" align="center">
	            <template slot-scope="scope"><span>{{scope.row.username}}</span></template>
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
      <el-button @click="closeDialog(true)">取 消</el-button>
      <el-button :loading=submitBtnLoading @click="addHandler" type="primary">确 定</el-button>
    </div>
  </div>
</template>
<script>
  import {addUser} from '@/views/admin/api/group';
  import {pageGroupUserToChoose } from '@/views/admin/api/user';
  import {getMapFromArr} from '@/utils/arrayUtil';
  import $ from 'jquery';
  import {Pager} from '@/components/pager/index';
  export default {
    name: 'selectGroupUser',
    props: {
    	groupCode: {
	    		type: String,
	      	required: true
	    },
      close: {
        type: Function,
        default: () => {
        }
      },
      callback:{
        type: Function,
        default: () => {
        }
      }
    },
    data() {
      return {
        list: null,
        pager: Pager(),
        listLoading: true,
        listQuery: {
          groupCode: this.groupCode
        },
        typeArr: [{value: 0, name: '组员'}, {value: 1, name: '组长'}],
        submitBtnLoading: false,
        selectedMsg: '未选择',
        toAdds: [],
        tableKey: 0,
        typeValue: 0
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
        pageGroupUserToChoose(this.listQuery).then(response => {
          this.list = response.data.list;
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
	      var username = [];
	      for (var i = 0; i < this.toAdds.length; i++) {
	        username.push(this.toAdds[i].username);
	      }
	      var data={
          groupCode:this.groupCode,
	      	username: username.join(','),
          type: this.typeValue
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
      clickRow(row, event, column) {
	        this.$refs['resTable'].toggleRowSelection(row, this.toAdds.indexOf(row)<0);
      }
    }
  }
</script>
