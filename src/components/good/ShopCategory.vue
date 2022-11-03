<template>
  <div class="shop-category">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addCategory">添加分类</el-button>
      <el-table
        height="600px"
        row-key="cat_id"
        :tree-props="{ children: 'children' }"
        stripe
        :data="categoryList"
      >
        <el-table-column prop="cat_id" label="序号"></el-table-column>
        <el-table-column prop="cat_name" label="名称"></el-table-column>
        <el-table-column prop="id" label="是否有效">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cat_deleted" type="danger">已删除</el-tag>
            <el-tag v-else type="primary">正常</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="级别">
          <template slot-scope="scope">
            <el-tag :type="type[scope.row.cat_level]"
              >level{{ scope.row.cat_level }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="editCategory(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deleteCategory(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      :title="dialogTitle"
      width="30%"
      :visible.sync="categoryInfo.show"
      :before-close="dialogBeforeCloseHandler"
    >
      <el-form
        ref="addFormRef"
        :model="categoryInfo"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input type="text" v-model="categoryInfo.cat_name"></el-input>
        </el-form-item>
        <el-form-item v-if="categoryInfo.action === 'add'" label="父级分类">
          <el-cascader
            :options="categories"
            @change="checkedNodeChangeHandler"
            :props="{ checkStrictly: true, value: 'cat_id', label: 'cat_name' }"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogCancelHandler">取消</el-button>
        <el-button @click="dialogConfirmHandler" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "shop-category",
  data() {
    return {
      categories: [],
      type: ["warning", "success", "danger"],
      categoryList: [],
      total: 0,
      pageInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10,
      },
      categoryInfo: {
        action: "add",
        show: false,
        cat_level: 0,
        cat_name: "",
        cat_pid: 0,
        cat_id: 0,
      },
      rules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCategoryList();
  },
  computed: {
    dialogTitle() {
      return this.categoryInfo.action === "add" ? "添加分类" : "修改分类";
    },
  },
  methods: {
    async getCategoryList() {
      const { data: res } = await this.$axios.get("categories", {
        params: this.pageInfo,
      });
      if (res.meta.status === 200) {
        this.pageInfo.pagenum = res.data.pagenum <= 0 ? 1 : res.data.pagenum;
        this.pageInfo.pagesize = res.data.pagesize;
        this.total = res.data.total;
        this.categoryList = res.data.result;
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    handleSizeChange(pagesize) {
      this.pageInfo.pagesize = pagesize;
      this.getCategoryList();
    },
    handleCurrentChange(pagenum) {
      this.pageInfo.pagenum = pagenum;
      this.getCategoryList();
    },
    editCategory(category) {
      this.categoryInfo.show = true;
      this.categoryInfo.action = "edit";
      this.categoryInfo.cat_name = category.cat_name;
      this.categoryInfo.cat_id = category.cat_id;
    },
    deleteCategory(category) {
      this.$confirm("你确定要删除该分类吗？", "删除确认", {
        type: "warning",
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        callback: async (action) => {
          if (action === "confirm") {
            const { data: res } = await this.$axios.delete(
              `/categories/${category.cat_id}`
            );
            if (res.meta.status === 200) {
              this.getCategoryList();
              this.$message.success(res.meta.msg);
            } else {
              this.$message.error(res.meta.msg);
            }
          }
        },
      });
    },
    async addCategory() {
      this.categoryInfo.action = "add";
      this.categoryInfo.show = true;
      const { data: res } = await this.$axios.get("/categories?type=2");
      if (res.meta.status === 200) {
        this.categories = res.data;
      }
    },
    clearCategoryInfo() {
      this.categoryInfo.cat_level = 0;
      this.categoryInfo.cat_pid = 0;
      this.categoryInfo.cat_name = "";
      this.categoryInfo.cat_id = 0;
    },
    closeDialog() {
      this.categoryInfo.show = false;
    },
    dialogBeforeCloseHandler(done) {
      this.clearCategoryInfo();
      done();
    },
    dialogCancelHandler() {
      this.clearCategoryInfo();
      this.closeDialog();
    },
    dialogConfirmHandler() {
      this.$refs.addFormRef.validate(async (result) => {
        if (!result) {
          return this.$message.error("请按照要求正确填写表单");
        }
        const { cat_level, cat_name, cat_pid } = this.categoryInfo;
        let res;
        if (this.categoryInfo.action === "add") {
          ({ data: res } = await this.$axios.post("/categories", {
            cat_level,
            cat_name,
            cat_pid,
          }));
        } else {
          // 修改分类的api
          ({ data: res } = await this.$axios.put(
            `/categories/${this.categoryInfo.cat_id}`,
            {
              cat_name: this.categoryInfo.cat_name,
            }
          ));
        }

        if (
          (this.categoryInfo.action === "add" && res.meta.status === 201) ||
          (this.categoryInfo.action === "edit" && res.meta.status === 200)
        ) {
          this.getCategoryList();
          this.clearCategoryInfo();
          this.closeDialog();
          this.$message.success(res.meta.msg);
        } else {
          this.$message.error(res.meta.msg);
        }
      });
    },
    checkedNodeChangeHandler(checkedList) {
      this.categoryInfo.cat_level = checkedList.length;
      this.categoryInfo.cat_pid = checkedList.at(-1);
    },
  },
};
</script>
<style lang="less"></style>
