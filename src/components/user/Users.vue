<template>
  <div class="shop_users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 头部操作 -->
      <el-row>
        <el-col :span="7">
          <el-input
            type="text"
            v-model="params.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :offset="1" :span="4">
          <el-button type="primary" @click="addInfo.show = true"
            >添加用户
          </el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column type="index" width="80" label="序号"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="name" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              @change="changeUserState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
              ><el-button
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="editUser(scope.row)"
              >
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
              ><el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="deleteUser(scope.row)"
              >
              </el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="更改"
              placement="top"
              :enterable="false"
              ><el-button
                type="warning"
                size="small"
                icon="el-icon-setting"
                @click="editUserRole(scope.row)"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandler"
        @current-change="currentPageChangeHandler"
        :current-page="params.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="添加用户"
      :visible.sync="addInfo.show"
      width="30%"
      :beforeClose="addDialogBeforeCloseHandler"
    >
      <el-form
        ref="addForm"
        :model="addInfo"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="username">
          <el-input v-model="addInfo.username" />
        </el-form-item>
        <el-form-item label="电话号码" prop="mobile">
          <el-input v-model="addInfo.mobile" />
        </el-form-item>
        <el-form-item label="电子邮件" prop="email">
          <el-input v-model="addInfo.email" type="email" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addInfo.password" type="password" />
        </el-form-item>
        <el-form-item label="重复密码" prop="repeatPassword">
          <el-input type="password" v-model="addInfo.repeatPassword" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogCancelHandler">取 消</el-button>
        <el-button type="primary" @click="addDialogConfirmHandler"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="修改用户"
      width="30%"
      :visible.sync="modifyInfo.show"
      :before-close="modifyDialogBeforeCloseHandler"
    >
      <el-form
        ref="modifyForm"
        :model="modifyInfo"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="username">
          <el-input v-model="modifyInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="mobile">
          <el-input v-model="modifyInfo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="电子邮件" prop="email">
          <el-input v-model="modifyInfo.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="modifyDialogCancelHandler">取消</el-button>
        <el-button type="primary" @click="modifyDialogConfirmHandler"
          >确定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="修改权限"
      width="30%"
      :visible.sync="roleInfo.show"
      :before-close="roleDialogBeforeCloseHandler"
    >
      <el-row>
        <p>当前用户：{{ roleInfo.username }}</p>
      </el-row>
      <el-row>
        <p>当前用户角色：{{ roleInfo.role_name }}</p>
      </el-row>
      <el-select v-model="roleInfo.rid" placeholder="请选择新的角色">
        <el-option
          v-for="item in roles"
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span slot="footer">
        <el-button @click="roleDialogCancelHandler">取消</el-button>
        <el-button @click="roleDialogConfirmHandler" type="primary"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "shop-users",
  components: {},
  data() {
    let phoneReg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
    const checkPhone = (rule, value, callback) => {
      if (phoneReg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的电话号码"));
      }
    };
    let emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    const checkEmail = (rule, value, callback) => {
      if (emailReg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的电子邮件"));
      }
    };
    const checkRepeatPassword = (rule, value, callback) => {
      if (value !== this.addInfo.password) {
        callback(new Error("输入的两次秘密不相同"));
      } else {
        callback();
      }
    };
    return {
      roles: [],
      userList: [],
      params: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      totalNum: 0,
      addInfo: {
        show: false,
        email: "",
        mobile: "",
        password: "",
        username: "",
        repeatPassword: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户姓名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          {
            validator: checkPhone,
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入用户电子邮件", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "密码必须在6到20位之间",
            trigger: "blur",
          },
        ],
        repeatPassword: [
          {
            required: true,
            message: "请再次输入密码",
            trigger: "blur",
          },
          {
            validator: checkRepeatPassword,
            trigger: "blur",
          },
        ],
      },
      modifyInfo: {
        show: false,
        id: "",
        username: "",
        email: "",
        mobile: "",
      },
      roleInfo: {
        show: false,
        id: 0,
        username: "",
        role_name: "",
        rid: 0,
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async changeUserState(userInfo) {
      try {
        const { data: res } = await this.$axios.put(
          `users/${userInfo.id}/state/${userInfo.mg_state}`
        );
        if (res.meta.status === 200) {
          this.$message.success(res.meta.msg);
        } else {
          this.$message.error(res.meta.msg);
          userInfo.mg_state = !userInfo.mg_state;
        }
      } catch (e) {
        console.log(e);
        this.$message.error("网络错误");
        userInfo.mg_state = !userInfo.mg_state;
      }
    },
    sizeChangeHandler(value) {
      this.params.pagenum = 1;
      this.params.pagesize = value;
      this.getUserList();
    },
    currentPageChangeHandler(value) {
      this.params.pagenum = value;
      this.getUserList();
    },
    search() {
      this.getUserList();
    },
    async getUserList() {
      try {
        const { data: res } = await this.$axios.get("users", {
          params: this.params,
        });
        if (res.meta.status === 200) {
          const data = res.data;
          this.totalNum = data.total;
          this.params.pagenum = data.pagenum;
          this.userList = data.users;
        } else {
          this.$message.info(res.meta.message);
        }
      } catch (e) {
        console.log(e);
        this.$message.error("网络错误");
      }
    },
    clearAddInfo() {
      // 清除添加信息
      this.addInfo.email = "";
      this.addInfo.mobile = "";
      this.addInfo.password = "";
      this.addInfo.username = "";
      this.addInfo.repeatPassword = "";
    },
    addDialogBeforeCloseHandler(done) {
      this.clearAddInfo(); // 清除添加用户信息
      done();
    },
    addDialogClose() {
      this.addInfo.show = false;
    },
    addDialogCancelHandler() {
      this.clearAddInfo();
      this.addDialogClose();
    },
    addDialogConfirmHandler() {
      // 发送添加用户请求
      this.$refs.addForm.validate(async (result) => {
        if (!result) {
          return this.$message.error("请输入正确的内容");
        }
        const { data: res } = await this.$axios.post("/users", {
          username: this.addInfo.username,
          mobile: this.addInfo.mobile,
          email: this.addInfo.email,
          password: this.addInfo.password,
        });
        if (res.meta.status === 201) {
          this.$message.success(res.meta.msg);
          this.clearAddInfo();
          this.addDialogClose();
          this.getUserList();
        } else {
          this.$message.error(res.meta.msg);
        }
      });
    },
    deleteUser(user) {
      this.$alert("确认删除该用户吗？", "删除用户", {
        confirmButtonText: "确定",
        callback: async (action) => {
          if (action === "confirm") {
            const { data: res } = await this.$axios.delete(`/users/${user.id}`);
            if (res.meta.status === 200) {
              this.$message.success(res.meta.msg);
              this.getUserList();
            } else {
              this.$message.error(res.meta.msg);
            }
          }
        },
      });
    },
    editUser(user) {
      console.log(user);
      this.modifyInfo.id = user.id;
      this.modifyInfo.username = user.username;
      this.modifyInfo.mobile = user.mobile;
      this.modifyInfo.email = user.email;
      this.modifyInfo.show = true;
    },
    modifyDialogBeforeCloseHandler(done) {
      this.clearModifyInfo();
      done();
    },
    clearModifyInfo() {
      this.modifyInfo.id = 0;
      this.modifyInfo.username = "";
      this.modifyInfo.email = "";
      this.modifyInfo.mobile = "";
    },
    modifyDialogClose() {
      this.modifyInfo.show = false;
    },
    modifyDialogCancelHandler() {
      this.clearModifyInfo();
      this.modifyDialogClose();
    },
    modifyDialogConfirmHandler() {
      this.$refs.modifyForm.validate(async (result) => {
        if (!result) {
          return this.$message.error("请输入正确的信息");
        }
        const { data: res } = await this.$axios.put(
          `/users/${this.modifyInfo.id}`,
          {
            email: this.modifyInfo.email,
            mobile: this.modifyInfo.mobile,
          }
        );
        if (res.meta.status === 200) {
          const item = this.userList.find(
            (item) => item.id === this.modifyInfo.id
          );
          item.email = this.modifyInfo.email;
          item.mobile = this.modifyInfo.mobile;
          this.clearModifyInfo();
          this.modifyDialogClose();
          this.$message.success(res.meta.msg);
        } else {
          this.$message.error(res.meta.msg);
        }
      });
    },
    editUserRole(user) {
      if (this.roles.length === 0) {
        this.$axios.get("/roles").then(({ data: res }) => {
          if (res.meta.status === 200) {
            this.roles = res.data;
          } else {
            this.$message.error(res.meta.msg);
          }
        });
      }
      this.roleInfo.username = user.username;
      this.roleInfo.role_name = user.role_name;
      this.roleInfo.id = user.id;
      this.roleInfo.show = true;
      this.roleInfo.rid = "";
    },
    clearRoleInfo() {
      this.roleInfo.username = "";
      this.roleInfo.role_name = "";
      this.roleInfo.id = 0;
      this.roleInfo.rid = 0;
    },
    roleDialogClose() {
      this.roleInfo.show = false;
    },
    roleDialogBeforeCloseHandler(done) {
      this.clearRoleInfo();
      done();
    },
    roleDialogCancelHandler() {
      this.clearRoleInfo();
      this.roleDialogClose();
    },
    async roleDialogConfirmHandler() {
      if (!this.roleInfo.rid) {
        return this.$message.error("请选择正确的角色");
      }
      const { data: res } = await this.$axios.put(
        `/users/${this.roleInfo.id}/role`,
        {
          rid: this.roleInfo.rid,
        }
      );
      if (res.meta.status === 200) {
        const user = this.userList.find((item) => item.id === this.roleInfo.id);
        const roleName = this.roles.find(
          (item) => item.id === this.roleInfo.rid
        ).roleName;
        user.role_name = roleName;
        this.roleDialogClose();
        this.clearRoleInfo();
        this.$message.success(res.meta.msg);
      } else {
        this.$message.error(res.meta.msg);
      }
    },
  },
};
</script>
<style lang="less"></style>
