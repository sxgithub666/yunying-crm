<template>
  <div class="login">
    <div class="loginbg">
      <img src="../assets/images/bg3.jpg">
    </div>
    <div class="loginForm">
      <el-form class="demo-ruleForm login-container" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px">
        <h3 class="title">运营部后台管理系统</h3>
        <el-form-item prop="account">
          <el-input v-model="ruleForm.account" clearable auto-complete="off" placeholder="请输入账号">
            <template slot="prepend">
              <i style="padding-right:0" class="iconfont icon-icon"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input v-model="ruleForm.checkPass" @keyup.enter.native="handleSubmit" clearable placeholder="请输入密码">
            <template slot="prepend">
              <i style="padding-right:0" class="iconfont icon-mima1"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    
  </div>
  
</template>

<script>
  import { login } from '@/api/api';
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
      createCompare(property){
        return function(a,b){
          var value1 = a[property];
          var value2 = b[property];
          return value1-value2;
        }
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
                result.userMenu=result.userMenu.sort(this.createCompare('order_num'));
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
    position: fixed;
    left: 50%;
    margin-left: -50%;
    z-index: -1;
  }
  .loginForm{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
     .login-container {
      -webkit-border-radius: 5px;
      border-radius: 5px;
      -moz-border-radius: 5px;
      background-clip: padding-box;
      width: 350px;
      padding: 35px 35px 15px 35px;
      box-shadow: 0 0 25px #cac6c6;
      .title {
        font-size: 20px;
        font-family: SimSun;
        margin: 0px auto 40px auto;
        text-align: center;
        color: #fff;
        letter-spacing: 2px;
      }
      .remember {
        margin: 0px 0px 35px 0px;
      }
    }
  }
}
 
    
  
</style>