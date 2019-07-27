<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">

            <el-form-item class="el-form-item-u" label="工号">
                <el-input v-model="listQuery.username" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="话务工号">
                <el-input v-model="listQuery.agentNo" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="话务平台">
              <el-select v-model="listQuery.platform" placeholder="选择话务平台" style="width: 130px;" @keyup.enter.native="getList" class="filter-item">
                <el-option v-for="item in platformArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          <el-form-item class="el-form-item-u" label="状态">
            <el-select v-model="listQuery.status" placeholder="选择状态" style="width: 100px;" @keyup.enter.native="getList" class="filter-item">
              <el-option v-for="item in statusArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
            <el-form-item class="el-form-item-u" >
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>

		<el-table-column label="工号" width="180px" align="center" fixed="left">
	        <template slot-scope="scope"><span>{{scope.row.username}}</span></template>
	    </el-table-column>
		<el-table-column label="姓名" width="150px" align="center" >
		    <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
		</el-table-column>
	    <el-table-column label="话务工号" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.agentNo}}</span></template>
        </el-table-column>

	    <el-table-column label="话务平台" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.platform}}</span></template>
        </el-table-column>

        <el-table-column label="备注" align="center" :show-overflow-tooltip='true'>
            <template slot-scope="scope"><span>{{scope.row.remark}}</span></template>
        </el-table-column>

        <el-table-column label="操作时间" width="180" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operTime}}</span></template>
        </el-table-column>

        <el-table-column label="操作人" width="150" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operName}}</span></template>
        </el-table-column>

        <el-table-column  align="center" label="操作" width="180px" fixed="right">
            <template slot-scope="scope" v-if="">
              <el-button v-if="isShowBtnEdit"   size="small" type="success" @click="addOrUpdate(scope.row)">绑定话务工号</el-button>
              <el-button v-if="isShowBtnDel" v-show="scope.row.id !=null" size="small" type="danger" @click="deleteHandler(scope.row)">解绑</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" class="dailog-body-u"
    	custom-class="el-dialog-u-add-userAgent" :append-to-body="true" :modal-append-to-body="false">

        <div class="el-dialog-panel">
            <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="form-body-u">

            	<div style="display: table">
	               <el-form-item label="工号" prop="username" style="float: left;width: 270px;">
	                   <el-input v-model="form.username" readonly="true" placeholder="请输入用户名/工号"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
                <el-form-item label="话务平台" required prop="platform" style="float: left;width: 270px;">
                  <el-select v-model="form.platform" placeholder="选择话务平台" style="width: 150px;">
                    <el-option v-for="item in platformArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>

            	</div>
              <div style="display: table">
                <el-form-item label="话务工号" required prop="agentNo" style="float: left;width: 270px;">
                  <el-input v-model="form.agentNo" clearable placeholder="请输入话务工号"></el-input>
                </el-form-item>
              </div>
                <div style="display: table;">
	                <el-form-item label="备注" prop="remark" style="float: left;width: 540px;">
	                    <el-input type="textarea" v-model="form.remark" :autosize="{minRows: 2, maxRows: 5}" placeholder="请输入内容"></el-input>
	                </el-form-item>
                </div>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog(false)">取 消</el-button>
            <el-button :loading=submitBtnLoading  @click="addOrUpdateHandler()" type="primary">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<style>
.el-dialog-u-add-userAgent{
  width: 600px;
}
</style>

<script>
import {page, addObj, getObj, delObj, updObj, checkUnique} from '@/views/admin/api/userAgent';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
import {getMapFromArr} from '@/utils/arrayUtil';
import { mapGetters } from 'vuex';
export default {
  name: 'userAgent',
  data() {
    return {
      metadata:{
          id:'',
	        username: undefined,
	        agentNo: undefined,
	        platform: '',
	        tenantId: undefined,
	        remark: undefined
      },
      form: $.extend(true, {}, this.metadata),
      rules: {
        username: creatValid(check('用户名/工号', 2, 50)),
        agentNo: creatValid(checkRequire('话务工号', 2, 50)),
        remark: creatValid(check('', 2, 200)),
        platform: {required: true, message: '请选择话务平台', trigger: 'blur'},
      },
      list: null,
      pager:Pager(),
      listLoading: true,
      listQuery: {
	        username: undefined,
	        agentNo: undefined,
	        platform: '',
	        remark: undefined
      },
      dialogVisible: false,
      dialogStatus: '',
      isShowBtnEdit: false,
      isShowBtnDel: false,
      isShowBtnAdd: false,
      submitBtnLoading:false,
      textMap: {
        update: '修改',
        create: '添加'
      },
      tableKey: 0,
      statusArr: [{name: '全部', value: ''},{name: '已选', value: 1}, {name: '未选', value: 2}],
      platformArr:[{name: 'cisco', value: 'cisco'}],
      checkAgentNo:false
    }
  },
  created() {
    this.pager.init(this.getList);
    this.getList();
    this.isShowBtnAdd = hasPermission('userAgent.insert');
    this.isShowBtnEdit = hasPermission('userAgent.update');
    this.isShowBtnDel = hasPermission('userAgent.delete');
  },
  computed: {
  	...mapGetters(['tenantId']),
    typeMapping(){
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
    closeDialog(toClear){
      this.dialogVisible = false;
      if(toClear || this.dialogStatus === 'update'){
        this.$refs['form'].resetFields();
      }
    },
    addOrUpdate(row) {
      this.resetForm();
      this.form.id = row.id;
      this.form.username = row.username;
      this.form.agentNo = row.agentNo;
      this.form.platform = row.platform;
      this.dialogStatus = status;
      this.dialogVisible = true;
    },
    deleteHandler(row) {
      this.$confirm('确认要解绑话务工号?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
          delObj(row.id).then((response) => {
              if(response && response.rel){
                this.$message({message: '解绑成功',showClose: true,type: 'success'});
                this.getList();
              }else{
                this.$message({message: response.msg ? response.msg : '解绑失败',showClose: true,type: 'error'});
              }
            });
        }).catch(()=>{});
    },
    addOrUpdateHandler() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.submitBtnLoading = true;
          if(this.form.id ===undefined){
            addObj(this.form).then(response => {
              // alert(response+"--add--"+response.rel);
              if(response && response.rel){
                this.closeDialog(true);
                this.$message({message: '新增成功',showClose: true,type: 'success'});
                this.getList();
              }
              this.submitBtnLoading = false;
            });
          }else{
            updObj(this.form).then((response) => {
              // alert(response+"--update--"+response.rel+"--"+this.form.id);
              if(response && response.rel){
                this.closeDialog(true);
                this.getList();
                this.$message({message: '修改成功',showClose: true,type: 'success'});
              }
              this.submitBtnLoading = false;
            });

          }
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.form = $.extend(true, {}, this.metadata);
    }
  }
}
</script>
