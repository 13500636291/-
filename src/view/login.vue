<template>
  <div class="login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="container">
          <el-form-item prop="username">
              <el-input v-model="ruleForm.username" placeholder="请输入邮箱" prefix-icon="el-icon-message"></el-input>
          </el-form-item>
          <el-form-item prop="password">
              <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码" prefix-icon="el-icon-view" @keyup.enter.native="enterSubmitForm"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="submitForm" class="submit">提交</el-button>
          </el-form-item>
          <el-form-item>
              <el-button @click="resetForm('ruleForm')" class="reset">重置</el-button>
          </el-form-item>
      </el-form>
  </div>
</template>

<script>
import {loginPost} from '@/api/index'
  export default {
    data() {
      return {
        ruleForm: {
          username:'',
          password: '',
        },
        rules: {
          username: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {type:'email',required: true,message: '请输入正确的邮箱格式', trigger: 'blur' }
          ],
          password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {min:4,message: '请输入密码最低4位数', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
        submitForm() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    loginPost(this.ruleForm).then(res => {
                        if (res.retCode==2000) {
                            localStorage.setItem("myToken", res.data.jwt);
                            localStorage.setItem("deadTime", res.data.expiredAt-new Date().getTime());
                            this.$message({
                                message: res.info.tip,
                                type: "success"
                            });
                            setTimeout(() => {
                                this.$router.push("/");
                            }, 1500);
                        } else {
                            this.$message({
                                message: res.info.tip,
                                type: "warning"
                            });
                        }
                    }).catch(err=>{
                        this.$message({
                            message: '报错:'+err,
                            type: "error"
                        });
                    });
                } else {
                    this.$message({
                        message: '请输入用户名密码',
                        type: "error"
                    });
                    return false;
                }
            });
        },
        enterSubmitForm(ev){
            if(ev.keyCode==13){
                this.submitForm();
            }
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },

    },
  }
</script>
<style lang="scss" scoped>
.login {
  width: 100%;
  min-width: 350pt;
  height: 100%;
  background-color: #122043;
  position: fixed;
  .container{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 350pt;
    padding: 50pt 40pt 20pt 40pt;
    background-color: white;
    .submit {
      width: 100%;
    }
    .reset {
      width: 100%;
    }
  }
}
</style>
