<template>
    <div style="width: 600px;">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="form-body-u">
        <div style="display: table">
          <el-form-item label="原始密码:" required prop="password" style="float: left;width: 270px;">
            <el-input v-model="form.password" type="password" required placeholder="请输入原始密码"></el-input>
          </el-form-item>
        </div>
        <div style="display: table">
          <el-form-item label="新密码:" required prop="newPassword" style="float: left;width: 270px;">
            <el-input v-model="form.newPassword" type="password" required clearable placeholder="请输入新密码"></el-input>
          </el-form-item>
        </div>
        <div style="display: table">
            <el-form-item label="确认密码:" required prop="confirmPassword" style="float: left;width: 270px;">
              <el-input v-model="form.confirmPassword" type="password" required placeholder="请输入确认新密码"></el-input>
            </el-form-item>
        </div>

      </el-form>
      <div slot="footer" style="margin-left: 100px;">
        <el-button @click="closeDialog(false)">取 消</el-button>
        <el-button :loading=submitBtnLoading  @click="changePassword()" type="primary">确 定</el-button>
      </div>
    </div>
</template>

<style>
  .filter-container .filter-item {
    margin-bottom: 6px;
  }

</style>
<script>
  import {changePassword} from '@/views/common/login';
  import $ from 'jquery';
  import {hasPermission} from '@/utils/permissionUtil';
  import {Pager} from '@/components/pager/index';
  import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';

  import { mapGetters } from 'vuex';
  export default {
    name: 'changePassword',
    data() {
      return {
        metadata:{
          password: undefined,
          newPassword: undefined,
          confirmPassword: undefined,
          operType:1
        },
        form: $.extend(true, {}, this.metadata),
        rules: {
            password: creatValid(checkRequire('原始密码', 2, 30)),
            newPassword: creatValid(checkRequire('新密码', 2, 30)),
            confirmPassword: creatValid(checkRequire('确认密码', 2, 30))
        },
        submitBtnLoading:false,
        tableKey: 0
      }
    },
    created() {

    },
    computed: {
      ...mapGetters(['tenantId'])
    },
    methods: {
      changePassword() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if(this.form.confirmPassword!==this.form.newPassword){
              this.$message({message: '新密码与再次确认密码不一致',showClose: true,type: 'error'});
              return;
            }
            if(this.form.password === this.form.confirmPassword){
              this.$message({message: '原始密码和新密码一致',showClose: true,type: 'error'});
              return;
            }
            this.form.operType=1;
            changePassword(this.form).then((response) => {
              if(response && response.rel){
                this.$message({message: '修改成功',showClose: true,type: 'success'});
                this.$store.dispatch('LoginOut')
                  .then(() => {
                    location.reload(); // 为了重新实例化vue-router对象 避免bug
                  });
              }
              this.submitBtnLoading = false;
            });
          }else {
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
