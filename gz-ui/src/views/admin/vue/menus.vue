<template>
<div class="app-container calendar-list-container">

    <div class="el-box">
      <div class="el-dialog-panel" style="width: 35%;">
        <div style="margin: 3px; ">
          <div class="filter-container">
            <el-button :loading="listLoading" type="primary" icon="search" style="width: 17%" @click="getList">刷新</el-button>
            <el-button v-if="isShowBtnAdd"  type="primary" icon="edit" style="width: 17%" @click="toCreate()">添加</el-button>
            <el-input placeholder="输入关键字" style="width: 62%" v-model="filterText" ></el-input>
          </div>

        </div>
        <div style="margin-top: 1px; margin-left: 3px; margin-right: 2px;">
          	<el-tree :data="treeData" node-key="code" highlight-current v-loading.body="listLoading"
                   :props="defaultProps" ref="tree"
                   :default-expand-all="false"
                   :default-expanded-keys="defaultExpandedKeys"
                   :filter-node-method="filterNode" class="filter-tree"
                    :expand-on-click-node="true"
                   @current-change="currentChangeHandler"
                   style="min-height: 500px;max-height: 600px;overflow:auto;">
          		<span class="custom-tree-node" slot-scope="{ node, data }">
	        		<span v-if="data.type == 3">
	        			<i class="icm icon-xuanzeanniu node-i_bt" ></i>
	        		</span>
	        		<span v-else-if="data.type == 2">
	        			<i v-if="data.icon" :class="data.icon+' node-i_page'" ></i>
	        			<i v-else class="icm icon-yemian node-i_page" ></i>
	        		</span>
	        		<span v-else>
	        			<i v-if="data.icon" :class="data.icon+' node-i_dir'" ></i>
	        			<i v-else  class="icm icon-folder_icon node-i_dir"></i>
	        		</span>
	        		<span class="node-i_text">{{node.label}}</span>
	        		<span class="el-tree-node-button-u">
	        			<el-button v-if="isShowBtnAdd && data.type && data.type !== 3" size="mini" type="primary"
	        			 		@click="toCreate(data)">添加</el-button>
		        		<el-button v-if="isShowBtnEdit" size="mini" type="success" @click="toUpdate(data)">修改</el-button>
		        		<el-button v-if="isShowBtnDel" size="mini" type="danger" @click="deleteHandler(data)">删除</el-button>
	        		</span>
	        	</span>
          	</el-tree>
        </div>
      </div>

      <div style="margin-left: 8px;width: 65%;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span v-if="curNodeData.name" class="el-card-header-text">
            	【{{curNodeData.parentName +'.'+ curNodeData.name}}】资源列表
            </span>
            <span v-else class="el-card-header-text">资源列表</span>
          </div>
          <div>
            <menu-resource ref="menuResource" :menuCode="curNodeData.code"
                           :moduleName="moduleName"/>
          </div>
        </el-card>
      </div>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" custom-class="el-dialog--small-u1"
    		:append-to-body="true" :modal-append-to-body="false">

        <div class="el-dialog-panel">
            <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="form-body-u">

              <div style="display: table">
                <el-form-item label="名称" prop="name" required style="float: left;width: 270px;">
                  <el-input v-model="form.name" placeholder="请输入名称"></el-input>
                </el-form-item>

                <el-form-item label="编码" prop="code" required style="float: left;width: 270px;">
                  <el-tooltip v-if="dialogStatus == 'create'" class="item" effect="dark" content="创建后不可修改" placement="top-start">
              		<el-input v-model="form.code" placeholder="请输入编码"></el-input>
               	  </el-tooltip>
                  <el-input v-else v-model="form.code" :disabled="true" placeholder="请输入编码"></el-input>
                </el-form-item>
              </div>

			  <div style="display: table" v-if="form.type == 1 || form.type == 2">
				<el-form-item label="上级菜单" prop="parentCode" style="float: left;width: 270px;">
                  <el-select v-model="form.parentCode" filterable clearable style="width: 190px;"
                  	@change="parentCodeChangeHandler" placeholder="选择上级菜单">
                    <el-option v-for="item in allMenus" :key="item.code" :label="item.name" :value="item.code" :disabled="item.disabled"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="类型" prop="type" required style="float: left;width: 270px;">
                  <el-select v-model="form.type" placeholder="选择类型" style="width: 190px;">
                    <el-option v-for="item in types" :key="item.code" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div style="display: table">
                <el-form-item v-if="form.type == 2" label="链接" prop="url" required style="width: 540px;">
                  <el-input v-model="form.url" placeholder="请输入链接"></el-input>
                </el-form-item>
              </div>

              <div style="display: table" v-if="form.type == 1 || form.type == 2">
                <el-form-item label="图标" prop="icon" style="float: left;width: 270px;">
                  <el-input v-model="form.icon" placeholder="请输入图标"></el-input>
                </el-form-item>

                <el-form-item label="排序号" prop="sortNum" style="float: left;width: 280px;">
                  <el-input-number v-model="form.sortNum" placeholder="请输入排序号" :min="0" :max="1000"
                  		style="width: 190px;">
                  </el-input-number>
                </el-form-item>
              </div>
              <div style="display: table">
                <el-form-item label="备注" prop="remark" style="width: 540px;">
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
  .el-dialog--small-u1{
    width: 650px;
  }
</style>

<script>
import {tree, listForCom, addObj, getObj, delObj, updObj} from '@/views/admin/api/menu';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {creatValid, checkRequire, check, checkNumber, checkNumberRequire} from '@/components/public/validator';
import {createButton} from '@/utils/treeUtil';
export default {
  name: 'menus',
  components: {
    'menu-resource': () => import('./menuResource')
  },
  data() {
    return {
      metadata:{
	        parentCode: '',
	        name: undefined,
	        code: '',
	        type: 2,
	        url: undefined,
	        icon: undefined,
	        sortNum: 0,
	        remark: undefined
      },
      form: $.extend(true, {}, this.metadata),
      rules: {
            name: creatValid(checkRequire('名称', 2, 100)),
            code: creatValid(checkRequire('编码', 2, 100)),
            path: creatValid(checkRequire('路径', 2, 50)),
            type: [{type:'number',required: true, message: '请选择类型',trigger: 'blur'}],
            url: creatValid(checkRequire('链接', 2, 300)),
            icon: creatValid(check('图标', 2, 50)),
            sortNum: creatValid(checkNumber('排序号', 0, 1000)),
            remark: creatValid(check('备注', 2, 200))
      },
      filterText: '',
      treeData: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultExpandedKeys:[],
      curNodeData:{id:undefined},
      moduleName:undefined,
      types0:[
        {name:"菜单目录", code:1},
        {name:"菜单", code:2},
        {name:"按钮", code:3}
      ],
      types:[],
      parentCode:'',
      allMenus:[],
      listLoading: true,
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
      tableKey: 0
    }
  },
  watch:{
    filterText(val) {
      this.$refs['tree'].filter(val);
    }
  },
  created() {
    this.getList();
    this.isShowBtnAdd = hasPermission('menus.insert');
    this.isShowBtnEdit = hasPermission('menus.update');
    this.isShowBtnDel = hasPermission('menus.delete');
  },
  methods: {
    initAllMenus(){
      listForCom({}).then(response => {
        this.allMenus = response.data;
      });
    },
    getList() {
      this.listLoading = true;
      tree().then(response => {
        this.treeData = response.data;
        this.listLoading = false;
      });
      this.initAllMenus();
    },
    parentCodeChangeHandler(val){
      for(var i = 0;i< this.allMenus.length;i++){
        if(this.allMenus[i].code == val){
          this.parentCode = this.allMenus[i].code;
          break;
        }
      };
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    currentChangeHandler(data, node) {
      if(this.curNodeData.id == data.id || data.type != 3){
        return;
      }
      this.curNodeData = data;
      this.moduleName = data.parentName;
      this.$refs['menuResource'].listQuery.menuCode = data.code;
      this.$refs['menuResource'].multipleSelection = [];
      this.$refs['menuResource'].getList();
    },
    setAllMenus(data){
      if(this.allMenus){
        if(data && data.code){
          for(var i=0;i<this.allMenus.length;i++){
              this.allMenus[i].disabled = this.allMenus[i].code == data.code;
          }
        }else{
          for(var i=0;i<this.allMenus.length;i++){
            this.allMenus[i].disabled = false;
          }
        }
      }
    },
    openDialog(status){
      this.dialogStatus = status;
      this.dialogVisible = true;
    },
    closeDialog(toClear){
      if(toClear || this.dialogStatus == 'update'){
        this.$refs['form'].resetFields();
      }
      this.dialogVisible = false;
      this.parentCode = '';
      this.parentFullPath = '';
    },
    filterTypes(data, addSub){
      if((addSub && data && data.type === 2) //子菜单
          || (data && data.type === 3)){//按钮
        this.types = this.types0.filter((val)=>{
          return val.code == 3;
        });
        this.form.type = 3;
      }else {
        this.types = this.types0.filter((val)=>{
          return val.code != 3;
        });
        this.form.type = !data ? 1 : 2;
      }
    },
    toCreate(data, node) {
        this.resetForm();
        this.form.parentCode = data && data.code ? data.code : '';
        this.filterTypes(data, true);
        this.setAllMenus();
        this.openDialog('create');
    },
    toUpdate(row) {
        getObj(row.id).then(response => {
            if(response.data){
              this.filterTypes(response.data);
              this.form = response.data;
              this.openDialog('update');
              this.setAllMenus(response.data);
              if(this.$refs['form'] && this.$refs['form'].validate){
                let func = (obj)=>{setTimeout(()=>{obj.validate();}, 200);};
                func(this.$refs['form']);
              }
            }else{
              this.getList();
              this.$message({message: '该记录已不存在',showClose: true,type: 'warn'});
            }
        });
    },
    deleteHandler(row, store) {
      this.$confirm('确认要删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
          delObj(row.code).then((response) => {
              if(response && response.rel){
                this.$message({message: '删除成功',showClose: true,type: 'success'});
                this.$refs['tree'].remove(row);
                this.initAllMenus();
              }else{
                this.$message({message: response.msg ? response.msg : '删除失败',showClose: true,type: 'error'});
              }
            });
        }).catch(()=>{});
    },
    createHandler() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.submitBtnLoading = true;
          addObj(this.form).then(response => {
              if(response && response.rel){
                this.defaultExpandedKeys = [];
                if(this.form.code.indexOf(this.form.parentCode+'.') > 0){
                	this.defaultExpandedKeys.push(this.form.code);
                }else{
                	this.defaultExpandedKeys.push(this.form.parentCode+'.' +this.form.code);
                }
                this.getList();
                this.closeDialog(true);
                this.$message({message: '新增成功',showClose: true,type: 'success'});
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
              this.defaultExpandedKeys = [];
              this.defaultExpandedKeys.push(this.form.code);
              this.getList();
              this.closeDialog(true);
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
    renderContent:function(createElement, { node, data, store }) {

      var getContent = (createElement, node, data, store)=>{
        var arr = [];
        if(this.isShowBtnAdd && data.type && data.type !== 3){
          arr.push(createButton(createElement, '添加','primary', ()=>{this.toCreate(data, store);}));
        }
        if(this.isShowBtnEdit){
          arr.push(createButton(createElement, '修改','success', ()=>{this.toUpdate(data);}));
        }
        if(this.isShowBtnDel){
          arr.push(createButton(createElement, '删除','danger', ()=>{this.deleteHandler(data, store);}));
        }
        return arr;
      };
      return createElement('span', [
        createElement('span', node.label),
        createElement('span', {attrs:{
            style:"float: right; margin-right: 5px;"
          }},
          getContent(createElement, node, data, store)
        ),
      ]);
    }
  }
}
</script>
