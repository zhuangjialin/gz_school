<template>
<div class="app-container calendar-list-container">
	<div class="el-box">
		<div style="width: 55%;">
			<div class="filter-container">
				<el-form :inline="true" :model="listQuery">

					<el-form-item class="el-form-item-u" label="">
						<el-input v-model="listQuery.name" clearable placeholder="输入关键字" style="width: 150px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
					</el-form-item>
					<el-form-item class="el-form-item-u" label="">
						<el-select v-model="listQuery.type" clearable filterable placeholder="选择小组类型" style="width: 100px;">
							<el-option v-for="item in typeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item class="el-form-item-u">
						<el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
						<el-button class="filter-item" v-if="isShowBtnAdd" type="primary" @click="toCreate">添加</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row @current-change="currentChangeHandler">

				<el-table-column label="组名称" width="150px" align="center" fixed="left">
					<template slot-scope="scope"><span>{{scope.row.name}}</span></template>
				</el-table-column>

				<el-table-column label="组编码" width="150px" align="center">
					<template slot-scope="scope"><span>{{scope.row.code}}</span></template>
				</el-table-column>

				<el-table-column label="小组类型" width="100px" align="center">
					<template slot-scope="scope"><span>{{typeMapping[scope.row.type]}}</span></template>
				</el-table-column>

				<el-table-column label="备注" align="center" :show-overflow-tooltip='true'>
					<template slot-scope="scope"><span>{{scope.row.remark}}</span></template>
				</el-table-column>

				<el-table-column label="操作时间" width="180" align="center">
					<template slot-scope="scope"><span>{{scope.row.operTime}}</span></template>
				</el-table-column>

				<el-table-column label="操作人" width="150" align="center">
					<template slot-scope="scope"><span>{{scope.row.operName}}</span></template>
				</el-table-column>

				<el-table-column align="center" label="操作" width="130px" fixed="right">
					<template slot-scope="scope">
						<el-button v-if="isShowBtnEdit" size="small" type="success" @click="toUpdate(scope.row)">编辑</el-button>
						<el-button v-if="isShowBtnDel" size="small" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<div v-show="!listLoading" class="pagination-container">
				<el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()"></el-pagination>
			</div>
		</div>

		<div style="margin-left: 8px;width: 43%;">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span v-if="!curGroup.name" class="el-card-header-text">请选择质检小组</span>
					<span v-else class="el-card-header-text">【{{curGroup.name}}】人员列表</span>
				</div>
				<div>
					<group-user ref="groupUser" :groupCode="curGroup.code" />
				</div>
			</el-card>
		</div>
	</div>

	<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" class="dailog-body-u" custom-class="el-dialog-u-add-group"
			:append-to-body="true" :modal-append-to-body="false">

		<div style="border-style:ridge;">
			<el-form :model="form" :rules="rules" ref="form" label-width="80px" class="form-body-u">

				<div style="display: table">
					<el-form-item label="组编码" required prop="code" style="float: left;width: 270px;">
						<el-tooltip v-if="dialogStatus == 'create'" class="item" effect="dark" content="创建后不可修改" placement="top-start">
							<el-input v-model="form.code" placeholder="请输入小组编码"></el-input>
						</el-tooltip>
						<el-input v-else disabled v-model="form.code" placeholder="请输入小组编码"></el-input>
					</el-form-item>
					<el-form-item label="组名称" required prop="name" style="float: left;width: 270px;">
						<el-input v-model="form.name" placeholder="请输入小组名称"></el-input>
					</el-form-item>
				</div>
				<div style="display: table">
					<el-form-item label="类型" required prop="type" style="float: left;width: 270px;">
						<el-select v-model="form.type" placeholder="选择小组类型" >
							<el-option v-for="item in typeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
						</el-select>
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
			<el-button :loading=submitBtnLoading v-if="dialogStatus=='create'" @click="createHandler()" type="primary">确 定</el-button>
			<el-button :loading=submitBtnLoading v-else @click="updateHandler()" type="primary">确 定</el-button>
		</div>
	</el-dialog>
</div>
</template>

<style>
.el-dialog-u-add-group{
  width: 600px;
}
</style>

<script>
import {page, addObj, getObj, delObj, updObj, checkGroup} from '@/views/admin/api/group';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
import { mapGetters } from 'vuex';
import {getMapFromArr} from '@/utils/arrayUtil';
export default {
  name: 'group',
  components: {
    'group-user': () => import('./groupUser')
  },
  data() {
    return {
      metadata:{
	        code: undefined,
	        name: '',
	        type: '',
	        remark: undefined
      },
      form: $.extend(true, {}, this.metadata),
      oldCode:'',
      rules: {
            code: creatValid(checkRequire('小组编码', 2, 50, this.codeValidator)),
            name: creatValid(checkRequire('小组名称', 2, 100)),
            type: {required: true, message: '请选择小组类型', trigger: 'blur'},
            remark: creatValid(check('备注', 2, 200))
      },
      list: null,
      pager:Pager(),
      listLoading: true,
      listQuery: {
	        code: undefined,
	        name: '',
          type: '',
	        remark: undefined
      },
      typeArr: [{value: 1,name: '质检小组'}, {value: 2,name: '业务小组'}],
      tenants:[],
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
      curGroup:{},
      tableKey: 0
    }
  },
  computed: {
    ...mapGetters(['elements']),
    typeMapping(){
      return getMapFromArr(this.typeArr);
    }
  },
  created() {
    this.pager.init(this.getList);
    this.getList();
    this.isShowBtnAdd = hasPermission('group.insert');
    this.isShowBtnEdit = hasPermission('group.update');
    this.isShowBtnDel = hasPermission('group.delete');
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
    openDialog(status){
      this.dialogStatus = status;
      this.dialogVisible = true;
    },
    closeDialog(toClear){
      this.dialogVisible = false;
      if(toClear || this.dialogStatus == 'update'){
        this.$refs['form'].resetFields();
      }
    },
    toCreate() {
        this.resetForm();
        this.openDialog('create');
    },
    toUpdate(row) {
        getObj(row.id).then(response => {
            if(response.data){
              this.form = response.data;
              this.openDialog('update');
            }else{
              this.getList();
              this.$message({message: '该记录已不存在',showClose: true,type: 'warn'});
            }
        });
    },
    deleteHandler(row) {
      this.$confirm('确认要删除该记录?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
          delObj(row.id).then((response) => {
              if(response && response.rel){
                this.$message({message: '删除成功',showClose: true,type: 'success'});
                const index = this.list.indexOf(row);
                this.list.splice(index, 1);
              }else{
                this.$message({message: response.msg ? response.msg : '删除失败',showClose: true,type: 'error'});
              }
            });
        });
    },
    createHandler() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.submitBtnLoading = true;
          addObj(this.form).then(response => {
              if(response && response.rel){
                this.closeDialog(true);
                this.$message({message: '新增成功',showClose: true,type: 'success'});
                this.getList();
              }else{
                this.$message({message: response.msg ? response.msg : '新增失败',showClose: true,type: 'error'});
              }
              this.submitBtnLoading = false;
          });
        } else {
          return false;
        }
      });
    },
    updateHandler() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.submitBtnLoading = true;
          updObj(this.form).then((response) => {
            if(response && response.rel){
              this.closeDialog(true);
              this.getList();
              this.$message({message: '修改成功',showClose: true,type: 'success'});
            }else{
              this.$message({message: response.msg ? response.msg : '修改失败',showClose: true,type: 'error'});
            }
            this.submitBtnLoading = false;
          });
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.form = $.extend(true, {}, this.metadata);
    },
    codeValidator(rule, value, callback) {
      if(this.dialogStatus != 'update' && this.oldCode != value){
        setTimeout(() => {
          checkGroup(value).then(response => {
            if(response.data){
              callback(new Error("编码已存在"));
            }else{
              callback();
            }
          });
        }, 100);
      }else{
        callback();
      }
    },
    curRowClick(row){
      this.curGroup = row;
    },
    currentChangeHandler(data, node) {
      if(!data || this.curGroup.code == data.code){
        return ;
      }
      this.curGroup = data;
      this.$refs['groupUser'].listQuery.groupCode = data.code;
      this.$refs['groupUser'].getList();
    }
  }
}
</script>
