<template>
  <div class="shop_login">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="https://placekitten.com/200" alt="avatar" />
      </div>
      <!-- 表单区域 -->
      <el-form
        ref="loginFormRef"
        :rules="LoginFormRules"
        :model="loginForm"
        label-width="80px"
        class="login_form"
      >
        <el-form-item label="账号" prop="account">
          <el-input
            v-model="loginForm.account"
            prefix-icon="iconfont icon-user"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password">
            <i slot="prefix" class="el-input__icon iconfont icon-password"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="reset">清除</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "shop_login",
  data() {
    return {
      loginForm: {
        account: "",
        password: "",
      },
      LoginFormRules: {
        account: [
          { required: true, message: "请输入你的账号", trigger: "blur" },
          {
            min: 3,
            max: 13,
            message: "长度在 3 到 13 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入你的密码", trigger: "blur" },
          { min: 4, max: 10, message: "长度在4到10个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async (result) => {
        if (!result) {
          return;
        }
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(255, 255, 255, 0.7)",
        });
        try {
          const { data } = await this.$axios.post("/login", {
            username: this.loginForm.account,
            password: this.loginForm.password,
          });
          loading.close();
          console.log(data);
          if (data.meta.status !== 200) {
            this.$message.error(data.meta.msg);
          } else {
            this.$message.success(data.meta.msg);
            window.sessionStorage.setItem("token", data.data.token);
            this.$router.push("/home");
          }
        } catch (e) {
          this.$message.error("网络异常");
          loading.close();
        }
      });
    },
    reset() {
      this.$refs.loginFormRef.resetFields();
    },
  },
};
</script>
<style lang="less" scoped>
.shop_login {
  background-color: #2b4b6b;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: white;
    border-radius: 10px;
    position: relative;
    .avatar_box {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 130px;
      width: 130px;
      // border: 1px solid black;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      background-color: #eee;
      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
      }
    }
    .login_form {
      position: absolute;
      bottom: 20px;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
