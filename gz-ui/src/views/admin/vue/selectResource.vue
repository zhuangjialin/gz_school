<template>
  <div>
    <div class="el-dialog-panel">
      <div class="app-container calendar-list-container">
        <div class="filter-container">
          <el-form :inline="true" :model="listQuery">

						<el-form-item class="el-form-item-u" >
              <el-input v-model="listQuery.moduleCode" size="small" placeholder="输入关键字" style="width: 120px;"
                        @keyup.enter.native="getList" class="filter-item"></el-input>
            </el-form-item>
            <!--<el-form-item class="el-form-item-u" label="名称">
              <el-input v-model="listQuery.name" size="small" placeholder="输入关键字" style="width: 120px;"
                        @keyup.enter.native="getList" class="filter-item"></el-input>
            </el-form-item>-->
            
            <el-form-item class="el-form-item-u">
              <el-button class="filter-item" type="primary" size="small" v-waves icon="search" @click="getList"
                         style="margin-bottom: 3px;">搜索
              </el-button>
            </el-form-item>
            <el-form-item class="el-form-item-u">
              <div>{{selectedMsg}}</div>
            </el-form-item>
            <div style="float: right;">
            	<el-form-item class="el-form-item-u" label="模块">
	                <el-select v-model="curModule" placeholder="选择模块" style="width: 100px;" class="filter-item">
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
                  highlight-current-row @selection-change="selectionChangeHandler"
                  max-height="300" ref="resTable" current-row-key="code">

          <el-table-column type="selection" width="40"></el-table-column>

          <el-table-column label="模块" width="180px" align="center">
            <template slot-scope="scope"><span>{{scope.row.moduleName}}</span></template>
          </el-table-column>

          <el-table-column label="名称" width="180px" align="center">
            <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
          </el-table-column>

          <el-table-column label="链接" align="center">
            <template slot-scope="scope"><span>{{scope.row.url}}</span></template>
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
      <el-button @click="closeDialog()">取 消</el-button>
      <el-button :loading=submitBtnLoading @click="addHandler" type="primary">确 定</el-button>
    </div>
  </div>
</template>
<script>
  import {page, reflush, addMenuResObj, getModule} from '@/views/admin/api/resource';
  import $ from 'jquery';
  import {hasPermission} from '@/utils/permissionUtil';
  import {Pager} from '@/components/pager/index';
  export default {
    name: 'resource',
    props: {
      closeDialog: {
        type: Function,
        default: () => {
        }
      },
      completeAdd:{
        type: Function,
        default: () => {
        }
      },
      moduleName: undefined,
      menuCode: undefined
    },
    data() {
      return {
        list: null,
        pager: Pager(),
        listLoading: true,
        listQuery: {
          menuCode: undefined,
          menuCodeExpect: 1,//使用菜单编码的反向条件查询
          name: undefined,
          moduleCode: undefined,
        },
        isShowBtnReflush:false,
        submitBtnLoading: false,
        selectedMsg: '未选择',
        toAddRes: [],
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
        if (!this.listQuery.moduleCode && !this.listQuery.name) {
          this.listQuery.moduleCode = this.moduleName;
        }
        this.listQuery.menuCode = this.menuCode;
        $.extend(this.listQuery, this.pager.getPage());
        page(this.listQuery).then(response => {
          this.addSelected(response.data.list);
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
      },
      addSelected(list){
        if (this.toAddRes && list) {
          this.list = this.toAddRes.concat(list);
        }
        for (var i = 0; i < this.toAddRes.length; i++) {
          debugger;
          this.$refs['resTable'].toggleRowSelection(this.toAddRes[i]);
        }
      },
      addHandler() {
        if (this.toAddRes && this.toAddRes.length > 0) {
          this.submitBtnLoading = true;
          var resCodes = [];
          for (var i = 0; i < this.toAddRes.length; i++) {
            resCodes.push(this.toAddRes[i].code);
          }
          addMenuResObj(this.menuCode, resCodes.join(',')).then(response => {
            if (response && response.rel) {
              this.closeDialog(true);
              this.$message({message: '添加成功', showClose: true, type: 'success'});
              this.clearTableSelect();
              this.completeAdd();
            } else {
              this.$message({message: response.msg ? response.msg : '添加失败', showClose: true, type: 'error'});
            }
            this.submitBtnLoading = false;
          });
        }
      },
      selectionChangeHandler(val) {
        this.toAddRes = val;
        this.selectedMsg = val && val.length > 0 ? '已选择' + val.length + '个资源' : '未选择';
      },
      clearTableSelect(){
        this.toAddRes = [];
        this.$refs['resTable'].clearSelection();
      }
    }
  }
</script>
