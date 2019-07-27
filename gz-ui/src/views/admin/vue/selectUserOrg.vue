<template>
  <div>
    <div class="el-dialog-panel">
      <div class="app-container calendar-list-container">
        <div class="filter-container">
          <el-form :inline="true" :model="listQuery">

            <el-form-item class="el-form-item-u">
              <el-input v-model="listQuery.name" size="small" placeholder="输入工号关键字" style="width: 120px;"
                        @keyup.enter.native="getList" class="filter-item"></el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u">
              <el-button class="filter-item" type="primary" size="small" v-waves icon="search" @click="getList"
                         style="margin-bottom: 3px;">搜索
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  max-height="300" ref="resTable" current-row-key="code">
          <el-table-column label="单选" width="80">
            <template slot-scope="scope">
              <el-radio :label="scope.$index" v-model="radio" @change.native="getCurrentRow(scope.row.username)">&nbsp;</el-radio>
            </template>

          </el-table-column>
          <el-table-column label="工号" width="160px" align="center">
            <template slot-scope="scope"><span>{{scope.row.username}}</span></template>
          </el-table-column>

          <el-table-column label="姓名" align="center">
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
      <el-button @click="closeDialog(true)">取 消</el-button>
      <el-button :loading=submitBtnLoading @click="addHandler" type="primary">确 定</el-button>
    </div>
  </div>
</template>
<style>
  .filter-container .filter-item {
    margin-bottom: 6px;
  }

</style>
<script>
  import {addUserOrg} from '@/views/admin/api/userOrg';
  import {page} from '@/views/admin/api/user';
  import {getMapFromArr} from '@/utils/arrayUtil';
  import $ from 'jquery';
  import {Pager} from '@/components/pager/index';
  export default {
    name: 'selectUpperSuperior',
    props: {
      itemCodes: String,
      close: {
        type: Function,
        default: () => {
        }
      },
      callback: {
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
          arrItemCode: []
        },
        submitBtnLoading: false,
        selectedMsg: '未选择',
        toAdds: [],
        tableKey: 0,
        typeValue: undefined,
        sguArrID: [],
        upperSuperior: "",
        radio:""
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
        page(this.listQuery).then(response => {
          this.list = response.data.list
          this.pager.render(response.data.totalSize);
          this.listLoading = false;
        })
      },
      addHandler() {
        if (this.upperSuperior === "") {
          this.$message({message: '请选择上级领导', showClose: true, type: 'warning'});
          return;
        }
        var data = {
          itemCodes: this.itemCodes,
          upperSuperior: this.upperSuperior
        };
        this.$confirm('之前的上级领导会覆盖，确认要重新配置上级领导?', '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).then(() => {
            this.submitBtnLoading = true;
            addUserOrg(data).then(response => {
              if (response && response.rel) {
                this.closeDialog(true);
                this.$message({message: '添加成功', showClose: true, type: 'success'});
                this.callback();
              } else {
                this.$message({message: response.msg ? response.msg : '添加失败', showClose: true, type: 'error'});
              }
              this.submitBtnLoading = false;
            });
          }).catch(() => {
        });
      },
      closeDialog(toClear){
        this.close();
      },
      getCurrentRow(upperSuperior) {
        this.upperSuperior = upperSuperior;
      }
    }
  }
</script>
