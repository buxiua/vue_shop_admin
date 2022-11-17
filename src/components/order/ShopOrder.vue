<template>
  <div class="shop-order">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="7">
          <el-input
            v-model="pageInfo.query"
            type="text"
            clearable
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" stripe height="600px">
        <el-table-column
          type="index"
          label="序号"
          width="100px"
        ></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.order_pay === '0'"
              >未付款</el-tag
            >
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editAddr(scope.row)"
              >修改地址</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="logisticsController(scope.row)"
              >物流</el-button
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
    <el-dialog
      title="修改地址"
      width="30%"
      :visible.sync="orderInfo.show"
      :before-close="editDialogBeforeClose"
    >
      <el-form :model="orderInfo" :rules="rules" label-width="100px">
        <el-form-item label="收货地址">
          <el-cascader
            v-model="orderInfo.addr"
            :options="addrList"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详情地址" prop="detailAddr">
          <el-input
            type="text"
            v-model="orderInfo.detailAddr"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogCancelHandler">取消</el-button>
        <el-button type="primary" @click="editDialogConfirmHandler"
          >确定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="物流信息"
      width="40%"
      :visible.sync="logisticInfo.show"
      :before-close="logisticDialogbeforClose"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in logisticInfo.infos"
          :key="index"
          :timestamp="item.time"
        >
          {{ item.message }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer">
        <el-button type="primary" @click="logisticDialogConfireHandler"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import addrList from "@/assets/addr.json";
import infos from "@/assets/logistics.json";
export default {
  name: "shop-order",
  data() {
    return {
      addrList,
      orderList: [],
      pageInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      orderInfo: {
        show: false,
        id: 0,
        addr: "",
        detailAddr: "",
      },
      logisticInfo: {
        show: false,
        infos,
      },
      total: 0,
      rules: {
        detailAddr: [
          { required: true, message: "请输入收货详情地址", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$axios.get("/orders", {
        params: this.pageInfo,
      });
      if (res.meta.status === 200) {
        this.orderList = res.data.goods;
        this.pageInfo.pagenum = Number(res.data.pagenum);
        this.total = res.data.total;
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    editAddr(order) {
      this.orderInfo.id = order.order_id;
      this.orderInfo.show = true;
    },
    logisticsController(order) {
      console.log(order);
      this.logisticInfo.show = true;
    },
    handleSizeChange(pagesize) {
      this.pageInfo.pagesize = pagesize;
      this.getOrderList();
    },
    handleCurrentChange(pagenum) {
      this.pageInfo.pagenum = pagenum;
      this.getOrderList();
    },
    editDialogBeforeClose(done) {
      this.clearOrderInfo();
      done();
    },
    clearOrderInfo() {
      this.orderInfo.id = 0;
      this.orderInfo.addr = "";
      this.orderInfo.detailAddr = "";
    },
    closeEditDialog() {
      this.orderInfo.show = false;
    },
    editDialogCancelHandler() {
      this.clearOrderInfo();
      this.closeEditDialog();
    },
    editDialogConfirmHandler() {
      this.editDialogCancelHandler();
      this.$message.success("地址修改成功");
    },
    handleChange(value) {
      // 笑死，根本没有请求
      console.log(value);
    },
    logisticDialogbeforClose(done) {
      done();
    },
    logisticDialogConfireHandler() {
      this.logisticInfo.show = false;
    },
  },
};
</script>
