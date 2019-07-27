<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">

            <el-form-item class="el-form-item-u" label="名称">
                <el-input v-model="listQuery.name" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="模块">
                <el-input v-model="listQuery.moduleCode" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" >
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList" >搜索</el-button>
            </el-form-item>
            <div style="float: right;">
            	<el-form-item class="el-form-item-u" label="服务">
	                <el-select v-model="curModule" placeholder="选择服务" style="width: 100px;" class="filter-item">
	                  <el-option v-for="item in modules" :key="item.value" :label="item.name" :value="item.value"></el-option>
	                </el-select>
	            </el-form-item>
            	<el-form-item class="el-form-item-u">
	            	<el-button class="filter-item" v-if="isShowBtnReflush" type="primary" icon="" @click="reflush">刷新资源</el-button>
	            </el-form-item>
            </div>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit
              highlight-current-row max-height="500" ref="resTable">

        <el-table-column label="模块" width="150px" align="center" fixed="left">
          <template slot-scope="scope"><span>{{scope.row.moduleName}}</span></template>
        </el-table-column>

	      <el-table-column label="名称" width="150px" align="center" fixed="left">
            <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
        </el-table-column>

	      <el-table-column label="编码" width="250px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.code}}</span></template>
        </el-table-column>

	      <el-table-column label="链接" width="300px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.url}}</span></template>
        </el-table-column>

	      <el-table-column label="请求方法" width="100" align="center" >
            <template slot-scope="scope"><span>{{scope.row.method}}</span></template>
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
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>
</div>
</template>
<style>

</style>
<script>
import {page, reflush, getModule} from '@/views/admin/api/resource';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
export default {
  name: 'resource',
  props: {
    menuCode:undefined,
    resChange:{
        type:Function,
        default:null
    }
  },
  data() {
    return {
      list: [],
      pager:Pager(),
      listLoading: true,
      listQuery: {
	        name: undefined,
	        moduleCode: undefined,
      },
      isShowBtnReflush: false,
      tableKey: 0,
      mudules:[],
      curModule: undefined
    }
  },
  created() {
    this.pager.init(this.getList);
    this.getList();
    this.isShowBtnReflush = hasPermission('resource.reflush');
    this.modules = getModule();
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
    reflush() {
      	if(!this.curModule){
			this.$message({message: '请选择模块', showClose: true, type: 'warning'});
			return;
		}
	  	reflush(this.curModule).then(response => {
	    	this.$message({message: '正在刷新', showClose: true, type: 'success'});
	  	});
    }
  }
}
</script>
