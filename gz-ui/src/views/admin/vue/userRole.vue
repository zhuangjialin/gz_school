<template>
<div>
  <div class="el-dialog-panel">
    <div class="app-container" style="height: 320px;overflow:auto;">
      <el-transfer v-model="selectedRoleCode" filterable :titles="['角色列表', '已选角色']"
        :button-texts="['移除', '添加']" :data="data" :props="props">
      </el-transfer>
    </div>
  </div>

  <div slot="footer" class="dialog-footer dialog-footer-u">
    <el-button @click="closeDialog()">取 消</el-button>
    <el-button :loading=submitBtnLoading @click="saveHandler()" type="primary">确 定</el-button>
  </div>
</div>
</template>
<style>
  .transfer-footer {
    float: right;
    margin-top: 3px;
    margin-right: 5px;
  }
</style>
<script>
import {list, saveUserRole} from '@/views/admin/api/userRole';
import {subtraction} from '@/utils/arrayUtil';
import $ from 'jquery';
export default {
  name: 'userRole',
  props: {
    username:undefined,
    close:{
      type:Function,
      default:()=>{}
    }
  },
  data() {
    return {
      data: [],
      selectedRoleCode: [],
      _selectedRoleCode: [],
      props: {
        key: 'code',
        label: 'name'
      },
      submitBtnLoading: false
    };
  },
  created(){
      this.getList();
  },
  methods: {
      getList(username){
//          debugger;
        list(username? username : this.username).then((response)=>{
            if(response && response.rel && response.data){
              this.data = response.data.roles;
              this.selectedRoleCode = response.data.roleCodes;
              this._selectedRoleCode = response.data.roleCodes.concat();
              $($('.el-transfer-panel__header')[0]).css('background', '#97a8be');
              $($('.el-transfer-panel__header')[1]).css('background', '#20a0ff');
            }else{
              this.$message({message:'角色加载失败',showClose: true,type: 'error'});
            }
        });
      },
      closeDialog(){
        this.close();
      },
      saveHandler(){
        this.submitBtnLoading = true;
        var addArr = subtraction(this.selectedRoleCode, this._selectedRoleCode);
        var delArr = subtraction(this._selectedRoleCode, this.selectedRoleCode);
        if(addArr.length == 0 && delArr.length == 0){
            this.$message({message:'角色未变化，无需保存',showClose: true,type: 'info'});
          this.submitBtnLoading = false;
            return;
        }
        saveUserRole(this.username, addArr.join(','), delArr.join(',')).then(response=>{
          if(response && response.rel){
            this.$message({message:'保存成功',showClose: true,type: 'success'});
            this.closeDialog();
          }else{
            this.$message({message: response.msg ? response.msg : '保存失败',showClose: true,type: 'error'});
          }
          this.submitBtnLoading = false;
        });
      }
  }
}
</script>
