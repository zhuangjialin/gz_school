<template>
<div >
      <div class="el-dialog-panel">
        <div style="margin: 3px; ">
            <el-input placeholder="输入关键字" v-model="filterText" ></el-input>
        </div>
        <div class="el-dialog-panel">
          <el-tree :data="treeData" node-key="code" highlight-current v-loading.body="listLoading"
                   :props="defaultProps" ref="tree" show-checkbox
                   :default-expand-all="false" :default-checked-keys=checkedKeys
                   @check-change="checkChangeHandler" :check-strictly="false"
                   :filter-node-method="filterNode" class="filter-tree"
                   :default-expanded-keys="openKeys"
                   style="max-height: 450px;overflow:auto;">
          		<span class="custom-tree-node" slot-scope="{ node, data }">
		        		<span v-if="data.type == 3"><i class="icm icon-xuanzeanniu node-i_bt"></i></span>
		        		<span v-else-if="data.type == 2"><i class="icm icon-yemian node-i_page" ></i></span>
		        		<span v-else><i class="icm icon-folder_icon node-i_dir"></i></span>
		        		<span class="node-i_text">{{node.label}}</span>
		        	</span>
          </el-tree>
        </div>
      </div>
      <div slot="footer" class="dialog-footer dialog-footer-u">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button :loading=submitBtnLoading @click="addHandler()" type="primary">确 定</el-button>
        <span v-if="toAddMenuNum > 0">共{{toAddMenuNum}}个菜单</span>
        <span v-else>未选择</span>
      </div>
</div>
</template>
<script>
import {treeByTenant, saveTenantMenu} from '@/views/admin/api/tenant';
import {subtraction} from '@/utils/arrayUtil';
import $ from 'jquery';
import { mapGetters } from 'vuex';
export default {
  name: 'tenantMenu',
  props: {
    tenantId:undefined,
    close:{
      type:Function,
      default:()=>{}
    }
  },
  data() {
    return {
      filterText: '',
      treeData: null,
      checkedKeys: [],
      selfOwnedKeys:[],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      listLoading:true,
      openKeys:[],
      submitBtnLoading:false,
      toAddMenuNum:0
    }
  },
  watch:{
    filterText(val) {
      this.$refs['tree'].filter(val);
    }
  },
  created() {
      this.getList();
  },
  computed: {
  },
  methods: {
    getList(tenantId) {
      this.listLoading = true;
      treeByTenant(tenantId? tenantId :this.tenantId).then(response => {
        if(response && response.data && response.data.menu){
          this.treeData = response.data.menu;
          this.checkedKeys = response.data.owned;
          this.selfOwnedKeys = response.data.selfOwned;
          this.toAddMenuNum = response.data.selfOwned.length;
          this.openKeys = response.data.openKeys;
        }else{
          this.$message({message: '加载菜单失败',showClose: true,type: 'error'});
        }
        this.listLoading = false;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    closeDialog(){
      this.close();
    },
    checkChangeHandler(){
        this.toAddMenuNum = this.calcChecked(this.$refs.tree.getCheckedNodes()).length;
    },
    calcChecked(nodes){
			if(!nodes || !nodes.length){
				return [];
			}
			var arr = [];
			for(var i=0;i<nodes.length;i++){
			  if(!nodes[i].disabled && nodes[i].type == 3){
			    arr.push(nodes[i].code);
			  }
			}
			return arr;
    },
    addHandler(){
      this.submitBtnLoading = true;
      var arr = this.calcChecked(this.$refs.tree.getCheckedNodes());
      var addArr = subtraction(arr, this.selfOwnedKeys);
      var delArr = subtraction(this.selfOwnedKeys, arr);
      if(addArr.length == 0 && delArr.length == 0){
        this.$message({message:'菜单未变化，无需保存',showClose: true,type: 'info'});
        this.submitBtnLoading = false;
        return;
      }
      saveTenantMenu(this.tenantId, addArr.join(','), delArr.join(',')).then(response => {
        if(response && response.rel){
          this.closeDialog();
          this.$message({message: '保存成功',showClose: true,type: 'success'});
        }else{
          this.$message({message: response.msg ? response.msg : '保存失败',showClose: true,type: 'error'});
        }
        this.submitBtnLoading = false;
      });
    }
  }
}
</script>
