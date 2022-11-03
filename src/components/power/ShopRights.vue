<template>
  <div class="shop-rights">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card v-show="rightList.length">
      <el-table :data="rightList" border stripe>
        <el-table-column
          type="index"
          label="序号"
          width="100px"
        ></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="权限路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <el-tag slot-scope="item" :type="getLevelType(item.row)">
            level {{ item.row.level }}
          </el-tag>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
const levelMap = {
  0: "info",
  1: "success",
  2: "warning",
};
export default {
  name: "shop-rights",
  data() {
    return {
      rightList: [],
    };
  },
  async created() {
    const { data: res } = await this.$axios.get("/rights/list");
    if (res.meta.status === 200) {
      this.rightList = res.data;
    } else {
      this.$message.error(res.meta.msg);
    }
  },
  methods: {
    getLevelType(row) {
      return levelMap[row.level];
    },
  },
};
</script>
<style></style>
