<template>
  <div class="shop-roles">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="7">
          <el-button type="primary" @click="addClickHandler"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="roleList" stripe>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row
              class="level0"
              v-for="level0 in props.row.children"
              :key="level0.id"
            >
              <el-col :span="4" class="level0">
                <el-tag
                  type="danger"
                  closable
                  @close="deleteRight(props.row, level0)"
                >
                  {{ level0.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="20">
                <el-row
                  class="level1"
                  v-for="level1 in level0.children"
                  :key="level1.id"
                >
                  <el-col :span="5">
                    <el-tag
                      type="success"
                      closable
                      @close="deleteRight(props.row, level1)"
                    >
                      {{ level1.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right" />
                  </el-col>
                  <el-col :span="19">
                    <el-tag
                      class="level2"
                      type="warning"
                      v-for="level2 in level1.children"
                      :key="level2.id"
                      closable
                      @close="deleteRight(props.row, level2)"
                      >{{ level2.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="id" width="100px">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="editClickHandler(scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" @click="deleteRole(scope.row)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              @click="settingClickHandler(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="添加角色"
      width="30%"
      :visible.sync="addRole.show"
      :before-close="addDialogBeforeCloseHandler"
    >
      <el-form
        ref="addFormRef"
        :model="addRole"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input type="text" v-model="addRole.roleName" />
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input type="text" v-model="addRole.roleDesc" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogCancelHandler">取消</el-button>
        <el-button @click="addDialogConfirmHandler" type="primary"
          >确定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="修改角色"
      width="30%"
      :visible.sync="editRole.show"
      :before-close="editDialogBeforeCloseHandler"
    >
      <el-form
        ref="editFormRef"
        :model="editRole"
        :rules="rules"
        label-width="30%"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input type="text" v-model="editRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input type="text" v-model="editRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogCancelHandler">取消</el-button>
        <el-button @click="editDialogConfirmHandler" type="primary"
          >确定</el-button
        >
      </span>
    </el-dialog>
    <!-- 权限修改 -->
    <el-dialog
      title="权限修改"
      width="50%"
      :visible.sync="settingRole.show"
      :before-close="settingDialogBeforeCloseHandler"
    >
      <p>当前角色：{{ settingRole.roleName }}</p>
      <p>当前角色描述：{{ settingRole.roleDesc }}</p>
      <el-tree
        ref="treeRef"
        :data="rightTree"
        :props="{
          label: 'authName',
          children: 'children',
        }"
        node-key="id"
        show-checkbox
        default-expand-all
        :default-checked-keys="settingRole.rids"
      >
      </el-tree>

      <span slot="footer">
        <el-button @click="settingDialogCancelHandler">取消</el-button>
        <el-button @click="settingDialogConfirmHandler" type="primary"
          >确认</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "shop-roles",
  data() {
    return {
      rightTree: [],
      roleList: [],
      addRole: {
        show: false,
        roleName: "",
        roleDesc: "",
      },
      editRole: {
        show: false,
        id: "",
        roleName: "",
        roleDesc: "",
      },
      settingRole: {
        show: false,
        id: "",
        roleName: "",
        roleDesc: "",
        rids: [105, 116],
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          { min: 2, message: "角色名至少两个字符", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$axios.get("/roles");
      if (res.meta.status === 200) {
        this.roleList = res.data;
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    deleteRight(role, right) {
      this.$confirm(
        `你确定删除该角色(${role.roleName})的权限(${right.authName})吗？`,
        "删除权限",
        {
          type: "warning",
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          callback: async (action) => {
            if (action === "confirm") {
              const { data: res } = await this.$axios.delete(
                `/roles/${role.id}/rights/${right.id}`
              );

              if (res.meta.status === 200) {
                // 删除成功
                // 删除指定节点的值
                role.children = res.data;
                this.$message.success(res.meta.msg);
              } else {
                this.$message.error(res.meta.msg);
              }
            }
          },
        }
      );
    },
    addClickHandler() {
      this.addRole.show = true;
    },
    addDialogBeforeCloseHandler(done) {
      this.clearAddRole();
      done();
    },
    clearAddRole() {
      this.addRole.roleName = "";
      this.addRole.roleDesc = "";
    },
    closeAddDialog() {
      this.addRole.show = false;
    },
    addDialogCancelHandler() {
      this.clearAddRole();
      this.closeAddDialog();
    },
    addDialogConfirmHandler() {
      this.$refs.addFormRef.validate(async (result) => {
        if (!result) {
          return this.$message.error("请按照指定的要求填写表单");
        }
        const { data: res } = await this.$axios.post("/roles", {
          roleName: this.addRole.roleName,
          roleDesc: this.addRole.roleDesc,
        });
        if (res.meta.status === 201) {
          this.getRoleList();
          this.$message.success(res.meta.msg);
          this.clearAddRole();
          this.closeAddDialog();
        } else {
          this.$message.error(res.meta.msg);
        }
      });
    },
    editClickHandler(role) {
      console.log(role);
      this.editRole.id = role.id;
      this.editRole.roleName = role.roleName;
      this.editRole.roleDesc = role.roleDesc;
      this.editRole.show = true;
    },
    editDialogBeforeCloseHandler(done) {
      this.clearEditRole();
      done();
    },
    clearEditRole() {
      this.editRole.id = "";
      this.editRole.roleName = "";
      this.editRole.roleDesc = "";
    },
    closeEditDialog() {
      this.editRole.show = false;
    },
    editDialogCancelHandler() {
      this.clearEditRole();
      this.closeEditDialog();
    },
    editDialogConfirmHandler() {
      this.$refs.editFormRef.validate(async (result) => {
        if (!result) {
          return this.$message.error("请按照制定的要求填写表单");
        }
        const { data: res } = await this.$axios.put(
          `/roles/${this.editRole.id}`,
          {
            roleId: this.editRole.id,
            roleName: this.editRole.roleName,
            roleDesc: this.editRole.roleDesc,
          }
        );
        if (res.meta.status === 200) {
          const role = this.roleList.find(
            (item) => item.id === this.editRole.id
          );
          role.roleName = this.editRole.roleName;
          role.roleDesc = this.editRole.roleDesc;
          this.clearEditRole();
          this.closeEditDialog();
          this.$message.success(res.meta.msg);
        } else {
          this.$message.error(res.meta.msg);
        }
      });
    },
    deleteRole(role) {
      this.$confirm("你确定删除该角色吗？", "删除确认", {
        type: "warning",
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        callback: async (action) => {
          if (action === "confirm") {
            const { data: res } = await this.$axios.delete(`/roles/${role.id}`);
            if (res.meta.status === 200) {
              this.getRoleList();
              this.$message.success(res.meta.msg);
            } else {
              this.$message.error(res.meta.msg);
            }
          }
        },
      });
    },
    async settingClickHandler(role) {
      if (this.rightTree.length === 0) {
        const { data: res } = await this.$axios.get("/rights/tree");
        if (res.meta.status === 200) {
          this.rightTree = res.data;
        } else {
          this.$message.error(res.meta.msg);
        }
      }
      this.settingRole.id = role.id;
      this.settingRole.roleName = role.roleName;
      this.settingRole.roleDesc = role.roleDesc;
      this.settingRole.rids = this.getDefaultRids(role);
      this.settingRole.show = true;
    },
    clearSettingRole() {
      this.settingRole.id = "";
      this.settingRole.roleDesc = "";
      this.settingRole.roleName = "";
      this.settingRole.rids = [];
    },
    closeSettingDialog() {
      this.settingRole.show = false;
    },
    settingDialogBeforeCloseHandler(done) {
      this.clearSettingRole();
      done();
    },
    settingDialogCancelHandler() {
      this.clearSettingRole();
      this.closeSettingDialog();
    },
    async settingDialogConfirmHandler() {
      const checkedNodes = this.$refs.treeRef.getCheckedNodes(false, true);
      const rids = checkedNodes.map((item) => {
        return item.id;
      });
      const { data: res } = await this.$axios.post(
        `/roles/${this.settingRole.id}/rights/`,
        {
          rids: rids.join(","),
        }
      );
      if (res.meta.status === 200) {
        this.getRoleList();
        this.$message.success(res.meta.msg);
        this.clearSettingRole();
        this.closeSettingDialog();
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    getDefaultRids(role) {
      const result = [];
      role.children.forEach((level0) => {
        level0.children.forEach((level1) => {
          level1.children.forEach((item) => {
            result.push(item.id);
          });
        });
      });
      return result;
    },
  },
};
</script>
<style lang="less" scoped>
.el-row.level0,
.el-row.level1 {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  &:last-child {
    border-bottom: none;
  }
}
.el-tag.level2 {
  margin: 5px;
}

.el-tree {
  height: 400px;
  overflow-y: scroll;
  overflow-y: overlay;
}
</style>
