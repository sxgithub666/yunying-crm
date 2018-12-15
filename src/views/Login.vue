<template>
  <div class="login">
    <div class="loginbg">
      <img src="../assets/images/bg1.jpg">
    </div>
    <div class="loginForm">
      <el-form class="demo-ruleForm login-container" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px">
        <h3 class="title">运营部后台管理系统</h3>
        <el-form-item prop="account">
          <el-input v-model="ruleForm.account" clearable auto-complete="off" placeholder="账号">
            <template slot="prepend">
              <i style="padding-right:0" class="iconfont icon-icon"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input v-model="ruleForm.checkPass" @keyup.enter.native="handleSubmit" clearable auto-complete="off" placeholder="密码">
            <template slot="prepend">
              <i style="padding-right:0" class="iconfont icon-mima1"></i>
            </template>
          </el-input>
        </el-form-item>
        <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">登录</el-button>
          <!--<el-button @click.native.prevent="handleReset">重置</el-button>-->
        </el-form-item>
      </el-form>
    </div>
    
  </div>
  
</template>

<script>
  import { login } from '@/api/api';
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        ruleForm: {
          account: '',
          checkPass: ''
        },
        rules: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        },
        checked: true
      };
    },
    methods: {
      handleReset() {
        this.$refs.ruleForm.resetFields();
      },
      handleSubmit(ev) {
        var _this = this;
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.logining = true;
            var loginParams = { login_id: this.ruleForm.account, password: this.ruleForm.checkPass };
            // var loginParams = { username: this.ruleForm.account, password: this.ruleForm.checkPass };
            login(loginParams).then(res => {
              this.logining = false;
              let { errMsg ,errCode, user , result} = res;
              if (errCode !== "200") {
                this.$message({ message: errMsg, type: 'error' });
              } else {
                sessionStorage.setItem('user', JSON.stringify(result.userInfo));
                sessionStorage.setItem('menu', JSON.stringify(result.userMenu));
                const path = result.userMenu[0].url;
                // this.$router.push({path: path === null ? result.router[0].children[0].path : path});
                this.$router.push({ path: path });
              }
            });
          } else {
            return false;
          }
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
 @media screen and (max-width: 1440px) {
    .login {
      font-size: 10px
    }
  }

  @media screen and (min-width: 1441px) and (max-width: 1680px) {
    .login {
      font-size: 11px
    }
  }

  @media screen and (min-width: 1681px) {
    .login {
      font-size: 14px
    }
  }
.login{
  width: 100%;
  height: 100%;
  position: relative;
 
  img{
    width: 100%;
    height: 100%;
    /*max-width: 1920px;*/
    position: fixed;
    left: 50%;
    margin-left: -50%;
    z-index: -1;
  }
  .loginForm{
    display: flex;
    justify-content: center;
     .login-container {
      /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
      -webkit-border-radius: 5px;
      border-radius: 5px;
      -moz-border-radius: 5px;
      background-clip: padding-box;
      margin: 180px auto;
      width: 350px;
      padding: 35px 35px 15px 35px;
      background: #fff;
      border: 1px solid #eaeaea;
      box-shadow: 0 0 25px #cac6c6;
      .title {
        font-size: 18px;
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
      }
      .remember {
        margin: 0px 0px 35px 0px;
      }
    }
  }
}
 
    
  
</style>