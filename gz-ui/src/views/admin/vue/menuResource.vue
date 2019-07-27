<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">

            <el-form-item class="el-form-item-u">
                <el-input v-model="listQuery.name" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" >
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
              <el-button class="filter-item"  v-if="isShowBtnAdd && menuCode" @click="toAdd" type="primary" icon="edit">添加</el-button>
              <el-button class="filter-item"  :loading=delBtnLoading v-if="isShowBtnDel && menuCode" @click="deleteHandler" type="primary" icon="del">移除</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit
              highlight-current-row @selection-change="selectionChangeHandler"
              show-overflow-tooltip>

        <el-table-column type="selection" width="50"></el-table-column>

        <el-table-column label="模块" width="160px" align="center" fixed="left">
          <template slot-scope="scope"><span>{{scope.row.moduleName}}</span></template>
        </el-table-column>

	      <el-table-column label="名称" width="140px" align="center" fixed="left">
            <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
        </el-table-column>

	      <el-table-column label="编码" width="250px" align="center">
            <template slot-scope="scope"><span>{{scope.row.code}}</span></template>
        </el-table-column>

	      <el-table-column label="链接" width="250" align="center" >
            <template slot-scope="scope"><span>{{scope.row.url}}</span></template>
        </el-table-column>

	      <el-table-column label="方法" width="80px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.method}}</span></template>
        </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>

    <el-dialog title="设置菜单资源" v-if="dialogVisible" :visible.sync="dialogVisible" custom-class="el-dialog--small-u-resselect"
    		:append-to-body="true" :modal-append-to-body="false">

        <select-resource ref="selectResource" :moduleName="moduleName"
                          :menuCode="menuCode" :completeAdd="getList"
                        :closeDialog="closeDialog"/>
    </el-dialog>
</div>
</template>
<style>
  .app-container{
    padding: 10px;
  }
  .el-dialog--small-u-resselect{
    width: 800px;
  }
</style>
<script>
import {page, delObj} from '@/views/admin/api/resource';
import $ from 'jquery';
import {Pager} from '@/components/pager/index';
import {hasPermission} from '@/utils/permissionUtil';
export default {
  name: 'menuRes',
  props: {
    menuCode:undefined,
    moduleName:undefined
  },
  components: {
    'select-resource': () => import('./selectResource')
  },
  data() {
    return {
      list: [],
      olist: [],
      pager:Pager(),
      listLoading: true,
      listQuery: {
          menuCode:this.menuCode,
	      name: undefined
      },
      multipleSelection: [],
      dialogVisible: false,
      dialogStatus: '',
      isShowBtnEdit: true,
      isShowBtnDel: true,
      isShowBtnAdd: true,
      submitBtnLoading:false,
      delBtnLoading:false,
      tableKey: 0
    }
  },
  created() {
    this.pager.init(this.getList);
    this.getList();
    this.isShowBtnDel = hasPermission('menus.relate-delete');
    this.isShowBtnAdd = hasPermission('menus.relate-insert');
  },
  methods: {
    getList() {
      if(!this.listQuery.menuCode){
          this.list = null;
          this.listLoading = false;
          return;
      }
      this.listLoading = true;
      $.extend(this.listQuery, this.pager.getPage());
      page(this.listQuery).then(response => {
        this.list = response.data.list;
        this.olist = response.data.list;
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
    toAdd() {
        this.openDialog();
//      if(this.$refs['resourceSelect']){
//        this.$refs['resourceSelect'].getList();
//      }
    },
    selectionChangeHandler(val) {
        this.multipleSelection = val;
    },
    deleteHandler() {
      if(!this.multipleSelection || this.multipleSelection.length < 1){
        this.$message({message: '请选择要移除的资源',showClose: true,type: 'info'});
        return;
      }
      this.$confirm('确定要移除这些资源?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
          this.delBtnLoading = true;
          var resCodes = [this.multipleSelection.length];
          for(var i=0;i<this.multipleSelection.length;i++){
            resCodes[i]=this.multipleSelection[i].code;
          }
          delObj(this.listQuery.menuCode, resCodes.join(",")).then((response) => {
              if(response && response.rel){
                this.$message({message: '移除成功',showClose: true,type: 'success'});
                this.getList();
              }else{
                this.$message({message: response.msg ? response.msg : '移除失败',showClose: true,type: 'error'});
              }
              this.delBtnLoading = false;
            });
        });
    },
    addHandler() {
      this.$refs['resourceSelect'].addHandler(this);
    }
  }
}
</script>
