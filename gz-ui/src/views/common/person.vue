<template>
  <div style="width: 800px;">
  		<div style="float: left;">
					<el-form :model="form" :rules="rules" ref="form" label-width="80px" class="form-body-u">
						<div style="display: table">
							<el-form-item label="工号" prop="username" style="float: left">
								<el-input v-model="form.username" readOnly="true" width="100px"></el-input>
							</el-form-item>
							<el-form-item label="姓名" prop="name" style="float: left">
								<el-input v-model="form.name" placeholder="请输入姓名"></el-input>
							</el-form-item>
						</div>
						<div style="display: table">
							<el-form-item label="邮箱" prop="email" style="float: left">
								<el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
							</el-form-item>
					
							<el-form-item label="职务" prop="postId" style="float: left;width: 270px;">
								<el-select v-model="form.postId" placeholder="选择职务">
									<el-option v-for="item in posts" :key="item.id" :label="item.name" :value="item.id"></el-option>
								</el-select>
							</el-form-item>
						</div>
						<div style="display: table;">
							<el-form-item label="所属部门" prop="departName" style="float: left;width: 540px;">
								<el-input v-model="form.departName" readonly placeholder="所属部门"></el-input>
							</el-form-item>
						</div>
						<div style="display: table;">
							<el-form-item label="入职时间" prop="joinDate" style="float: left;">
								<el-input v-model="form.joinDate" readonly placeholder="入职时间"></el-input>
							</el-form-item>
						</div>
					
						<el-form-item label="备注" prop="remark" style="width: 541px;">
							<el-input type="textarea" readonly v-model="form.remark" :autosize="{minRows: 2, maxRows: 5}" placeholder="请输入内容"></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" style="text-align: center;">
			      <el-button @click="closeDialog(false)">取 消</el-button>
			      <!--<el-button :loading='submitBtnLoading' @click="updateHandler()" type="primary">确 定</el-button>-->
			    </div>
  		</div>
    	<div label="头像" style="float: right;margin-top: 30px;">
          <el-upload class="avatar-uploader" accept=".jpg" 
            :action="opt.action" list-type="picture"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload" :headers="opt.headers">
            <img v-if="portraitImg" :src="portraitImg" class="avatar"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
    	</div>
  </div>
</template>

<style>
  .filter-container .filter-item {
    margin-bottom: 6px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border-radius:50%;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
    border-radius:50%;
  }

  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }

</style>
<script>
  import {updObj, getByUsername, getUploadPortraitUrl, getPortraitImg} from '@/views/admin/api/user';

  import $ from 'jquery';
  import {hasPermission} from '@/utils/permissionUtil';
  import {listForComPost} from '@/views/admin/api/post';
  import {addToken} from '@/utils/auth';
  import {mapGetters} from 'vuex';

  export default {
    name: 'person',
    data() {
      return {
        metadata: {
          operType: 1,
          postId: '',
          action: '',
          headers: {
          },
          path: '',
          sign: ''
        },
        form: $.extend(true, {}, this.metadata),
        rules: {},
        submitBtnLoading: false,
        tableKey: 0,
        posts: [],
        portraitImg: '',
        opt: {},
        options: {
          action: getUploadPortraitUrl()
        },
        username: ''
      }
    },
    created() {
      this.opt = $.extend(this.opt, this.metadata);
      this.opt = $.extend(this.opt, this.options);
      if (this.opt.action) {
        this.opt.action = addToken(this.opt.action);
      }
      this.toUpdate(this.userInfo.username);
    },
    computed: {
      ...mapGetters(['tenantId', 'userInfo'])
    },
    methods: {
      resetForm() {
        this.form = $.extend(true, {}, this.metadata);
      },
      toUpdate(username) {
        if (!username) {
          this.$message.warning({message: '请先刷新列表后再编辑', showClose: true, type: 'warning', center: true});
          return;
        }
        getByUsername(username).then(response => {
          if (response.data) {
            this.form = response.data;
            let f = this.userInfo.path;
            let s = this.userInfo.sign;
            if (this.form.path) {
              f = this.form.path;
              s = this.form.sign;
            }
            if(f && s){
              this.portraitImg = addToken(getPortraitImg(f, s));
            }
            this.initPosts();
          } else {
            this.$message({message: '该记录已不存在', showClose: true, type: 'warning'});
          }
        });
      },
      updateHandler() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.$confirm('确认要修改该个人资料？确定将重新登录', '提示', {
              confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
            }).then(() => {
              this.submitBtnLoading = true;
              updObj(this.form).then((response) => {
                if (response && response.rel) {
                  this.$message.success({message: '修改成功', showClose: true});
                  this.$store.dispatch('LoginOut')
                    .then(() => {
                      location.reload(); // 为了重新实例化vue-router对象 避免bug
                    });
                } else {
                  this.$message({message: response.msg ? response.msg : '修改失败', showClose: true, type: 'error'});
                }
                this.submitBtnLoading = false;
              });
            });
          } else {
            return false;
          }
        });
      },
      initPosts() {
        listForComPost().then(response => {
          this.posts = response.data;
        });
      },
      handleAvatarSuccess(res, file) {
        this.portraitImg = URL.createObjectURL(file.raw);
        this.form.path = res.data.path;
        this.form.sign = res.data.sign;
        this.$store.dispatch('UpdatePortrait').then(()=>{
				});
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    }
  }
</script>

