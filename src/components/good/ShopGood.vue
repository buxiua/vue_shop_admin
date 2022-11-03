<template>
  <div class="shop-good">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="30">
        <el-col :span="5">
          <el-input
            type="text"
            v-model="pageInfo.query"
            clearable
            @clear="getGoodList"
            @change="getGoodList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="addGood">添加</el-button>
        </el-col>
      </el-row>
      <el-table stripe :data="goodList">
        <el-table-column
          prop="goods_id"
          label="id"
          width="100px"
        ></el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="700px"
        ></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="100px"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="100px"
        ></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ getTime(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editGood(scope.row)"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" @click="deleteGood(scope.row)"
              >删除</el-button
            >
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
  </div>
</template>
<script>
export default {
  name: "shop-good",
  data() {
    return {
      goodList: [],
      total: 0,
      pageInfo: {
        pagesize: 10,
        pagenum: 1,
        query: "",
      },
    };
  },
  created() {
    this.getGoodList();
  },
  methods: {
    async getGoodList() {
      const { data: res } = await this.$axios.get("goods", {
        params: this.pageInfo,
      });
      if (res.meta.status === 200) {
        this.pageInfo.pagenum = parseInt(res.data.pagenum);
        this.total = res.data.total;
        this.goodList = res.data.goods;
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    getTime(good) {
      const date = new Date(good.add_time);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const min = date.getMinutes();
      return `${year}-${month}-${day} ${hour}:${min}`;
    },
    handleSizeChange(pagesize) {
      this.pageInfo.pagesize = pagesize;
      this.getGoodList();
    },
    handleCurrentChange(pagenum) {
      this.pageInfo.pagenum = pagenum;
      this.getGoodList();
    },
    async deleteGood(good) {
      this.$confirm("您确定删除该商品吗？", "删除确认", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        callback: async (action) => {
          if (action !== "confirm") {
            return this.$message.info("取消删除");
          }
          const { data: res } = await this.$axios.delete(
            `/goods/${good.goods_id}`
          );
          if (res.meta.status === 200) {
            this.getGoodList();
            this.$message.success(res.meta.msg);
          } else {
            this.$message.error(res.meta.msg);
          }
        },
      });
    },
    addGood() {
      this.$router.push("/good/add");
    },
    editGood(good) {
      // console.log(good);
      this.$router.push({
        name: "goodEdit",
        params: {
          action: "edit",
          good,
        },
      });
    },
  },
};
</script>
<style lang="less"></style>
