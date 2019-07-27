<template>
<div>
  <div class="el-dialog-panel" style="width: 100%;">
      <div style="margin: 3px;">
        <div class="filter-container">
          <el-button :loading="listLoading" type="primary" icon="search" style="width: 15%" @click="getList">刷新</el-button>
          <el-input placeholder="输入关键字" style="width: 83%" v-model="filterText" ></el-input>
        </div>

      </div>
      <div style="margin-top: 1px; margin-left: 3px; margin-right: 2px;">
        <el-tree :data="treeData" node-key="code" highlight-current show-checkbox 
        			v-loading.body="listLoading"
                 :props="defaultProps" ref="tree" :accordion="true"
                 :default-expand-all="true" :check-strictly="true"
                 :filter-node-method="filterNode" class="filter-tree"
                 @check="handleCheck" style="min-height: 30px;max-height: 500px;">
        </el-tree>
      </div>
    </div>

  <div slot="footer" class="dialog-footer dialog-footer-u">
    <el-button @click="closeDialog()">取 消</el-button>
    <el-button @click="ok()" type="primary">确定</el-button>
  </div>
</div>
</template>

<script>
import {tree} from '@/views/admin/api/department';
import $ from 'jquery';
export default {
  name: 'selectDepart',
  props: {
    departCode:'',
    flag: '',
    userTenantId: {
    	type:String
    },
    callback:{
      type:Function,
      default:()=>{}
    },
    close:{
      type:Function,
      default:()=>{}
    },
    initFunc:{
      type:Function,
      default: tree
    }
  },
  data() {
    return {
      filterText: '',
      curNodeDataCode: '',
      curNodeDataName: '',
      treeData: null,
      listLoading:true,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs['tree'].filter(val);
    },
    departCode: function(oldVal, newVal){
  		if(oldVal){
  			this.getList();
  		}
  	}
  },
  created() {
    this.getList();
  },
  methods: {
  	getList() {
      this.listLoading = true;
      let data = {
      	tenantId: this.userTenantId
      };
      this.initFunc(data).then(response => {
        this.treeData = response.data;
        this.$refs.tree.setCheckedKeys([]);
        this.$refs.tree.setCheckedKeys([this.departCode]);
        
        this.listLoading = false;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleCheck(data,checked, node) {
	    if(checked){//交叉点击节点
	        this.$refs.tree.setCheckedNodes([]);
	        this.$refs.tree.setCheckedNodes([data]);
	        
	        this.curNodeDataCode = data.code;
	        this.curNodeDataName = data.fullName;
	    }else{//点击已经选中的节点，置空
	        this.$refs.tree.setCheckedNodes([]);
	        
	        if(this.curNodeDataCode == data.code){
		    		this.curNodeDataCode = '';
		      	this.curNodeDataName = '';
		    	}
	    }
    },
    closeDialog(){
      this.close();
    },
    ok(){
    	if(this.callback){
    		this.callback({
    			departCode: this.curNodeDataCode,
    			departName: this.curNodeDataName
    		});
    	}
      this.closeDialog();
    }
  }
}
</script>
