<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery">

        <el-form-item class="el-form-item-u">
          <el-select v-model="listQuery.codeType" placeholder="选择类型" style="width: 120px;" @keyup.enter.native="getList" class="filter-item">
            <el-option v-for="item in typeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="el-form-item-u" label="工号/编码">
          <el-input v-model="listQuery.itemCode" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item-u" label="状态">
          <el-select v-model="listQuery.status" placeholder="选择状态" style="width: 120px;" @keyup.enter.native="getList" class="filter-item">
            <el-option v-for="item in statusArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="el-form-item-u" label="上级领导">
          <el-input v-model="listQuery.upperSuperior" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item-u">
          <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
          <el-button class="filter-item" v-if="isShowBtnAdd" @click="openDialog" type="primary" icon="edit">绑定上级领导</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :key='tableKey' ref="resTable" :data="list" v-loading.body="listLoading" border fit highlight-current-row 
    				@selection-change="selectionChangeHandler" @row-click="clickRow">

      <el-table-column type="selection" width="47"></el-table-column>
      <el-table-column label="工号/小组编码" width="200px" align="center">
        	<template slot-scope="scope"><span>{{scope.row.itemCode}}</span></template>
      </el-table-column>
      <el-table-column label="姓名/名称" width="200px" align="center">
        	<template slot-scope="scope"><span>{{scope.row.name}}</span></template>
      </el-table-column>
      <el-table-column label="上级领导" width="180px" align="center">
        	<template slot-scope="scope"><span>{{scope.row.upperSuperiorName}}</span></template>
      </el-table-column>
      <el-table-column label="上级工号" width="180px" align="center">
        	<template slot-scope="scope"><span>{{scope.row.upperSuperior}}</span></template>
      </el-table-column>
      <el-table-column label="操作人" width="200" align="center">
        	<template slot-scope="scope"><span>{{scope.row.operName}}</span></template>
      </el-table-column>
      <el-table-column label="操作时间" width="200" align="center">
        	<template slot-scope="scope"><span>{{scope.row.operTime}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="87px" fixed="right">
	        <template slot-scope="scope">
	            <el-button v-if="isShowBtnDel"  v-show="scope.row.id !=null" size="small" type="danger" @click="deleteHandler(scope.row)">解绑</el-button>
	        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}"
                     @current-change="pager.currentChangeHandler()"></el-pagination>
    </div>
    <!--上级领导选择-->
    <el-dialog :title="'选择上级领导'" :visible.sync="selectUpperSuperiorVisible" custom-class="select-upper-superior-dialog"
    		:append-to-body="true" :modal-append-to-body="false">
      <select-upperSuperior ref="selectUpperSuperior" :itemCodes="itemCodes"
                            :close="closeDialog" :callback="selectUpperSuperiorCallback"></select-upperSuperior>
    </el-dialog>
  </div>
</template>

<style>
  .el-dialog-u-add-userOrg {
    width: 600px;
  }

  .select-upper-superior-dialog {
    width: 600px;
  }
</style>

<script>
  import {page, addObj, getObj, delObj, updObj, checkUnique} from '@/views/admin/api/userOrg';
  import $ from 'jquery';
  import {hasPermission} from '@/utils/permissionUtil';
  import {Pager} from '@/components/pager/index';
  import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
  import {mapGetters} from 'vuex';
  import {getMapFromArr} from '@/utils/arrayUtil';

  export default {
    name: 'userOrg',
    props: {
      itemCode: undefined
    },
    components: {
      'select-upperSuperior': () => import('./selectUserOrg')
    },
    data() {
      return {
        metadata: {
          itemCode: undefined,
          codeType: 2,
          status:0,
          upperSuperior: undefined,
          tenantId: undefined,
          remark: undefined
        },
        form: $.extend(true, {}, this.metadata),
        rules: {
          itemCode: creatValid(check('用户工号', 2, 50)),
          codeType: creatValid(checkNumber('工号类型', 2, 1000)),
          upperSuperior: creatValid(check('上级领导', 2, 50)),
          remark: creatValid(check('', 2, 200)),
        },
        list: null,
        pager: Pager(),
        listLoading: true,
        listQuery: {
          itemCode: this.itemCode,
          codeType: 2,
          upperSuperior: undefined,
          status:0
        },
        typeArr: [{name: '人员关系', value: 1}, {name: '小组关系', value: 2}],
        statusArr: [{name: '全部', value: 0},{name: '已设置', value: 1}, {name: '未设置', value: 2}],
        isShowBtnEdit: false,
        isShowBtnDel: false,
        isShowBtnAdd: false,
        submitBtnLoading: false,
        selectUpperSuperiorVisible: false,
        tableKey: 0,
        arrItemCode: [],
        itemCodes: "",
        multipleSelection: []
      }
    },
    created() {
      this.pager.init(this.getList);
      this.getList();
      this.isShowBtnAdd = hasPermission('userOrg.insert');
      this.isShowBtnEdit = hasPermission('userOrg.update');
      this.isShowBtnDel = hasPermission('userOrg.delete');
    },
    computed: {
      ...mapGetters(['tenantId']),
      typeMapping() {
         return getMapFromArr(this.typeArr);
      }
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
      openDialog(status) {
        if (this.multipleSelection.length === 0) {
          this.$message({message: '请先选择一个小组', showClose: true, type: 'warning'});
          return;
        }
        if(this.multipleSelection[0].codeType === 1){
          this.$message({message: '用户工号请在【小组管理】模块选择上级领导', showClose: true, type: 'warning'});
          return;
        }
        this.arrItemCode = [];
        for (var i = 0; i < this.multipleSelection.length; i++) {

          this.arrItemCode.push(this.multipleSelection[i].itemCode);
        }
        this.itemCodes = this.arrItemCode.join(",");
        this.selectUpperSuperiorVisible = true;
      },
      closeDialog(toClear) {
        this.selectUpperSuperiorVisible = false;
      },
      deleteHandler(row) {
        this.$confirm('确认要解绑该小组的领导?', '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).then(() => {
          delObj(row.itemCode).then((response) => {
            if (response && response.rel) {
              this.$message({message: '解绑成功', showClose: true, type: 'success'});
              this.getList();
            } else {
              this.$message({message: response.msg ? response.msg : '解绑失败', showClose: true, type: 'error'});
            }
          });
        }).catch(() => {
        });
      },
      selectUpperSuperiorCallback() {
        this.getList();
      },
      selectionChangeHandler(val) {
        this.multipleSelection = val;
      },
      clickRow(row, event, column) {
	        this.$refs['resTable'].toggleRowSelection(row, this.multipleSelection.indexOf(row)<0);
      }
    }
  }
</script>
