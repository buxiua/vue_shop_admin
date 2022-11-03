<template>
  <div class="good-edit">
    <el-page-header @back="goBack" :content="headerContent"></el-page-header>
    <el-card>
      <el-row>
        <el-col :span="24">
          <el-steps align-center :active="activeIndex" finish-status="success">
            <el-step
              v-for="(item, index) in steps"
              :title="item"
              :key="index"
            ></el-step>
          </el-steps>
        </el-col>
      </el-row>
      <el-form
        ref="goodFormRef"
        label-position="top"
        :model="goodInfo"
        :rules="goodInfoRules"
      >
        <el-tabs v-model="active" tab-position="left">
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="good_name">
              <el-input v-model="goodInfo.good_name" type="text"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="good_price">
              <el-input v-model="goodInfo.good_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="good_weight">
              <el-input v-model="goodInfo.good_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="good_number">
              <el-input v-model="goodInfo.good_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="good_cate">
              <el-cascader
                v-model="goodInfo.good_cate"
                :options="categoryList"
                :props="{
                  expandTrigger: 'hover',
                  value: 'cat_id',
                  label: 'cat_name',
                }"
                @change="categotySelectorHandleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数"> </el-tab-pane>
          <el-tab-pane label="商品属性"></el-tab-pane>
          <el-tab-pane label="商品图片"> </el-tab-pane>
          <el-tab-pane label="商品内容"> </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
const map = {
  add: "添加商品",
  edit: "修改商品",
};
export default {
  name: "good-eidt",
  props: {
    action: String,
    good: {
      type: Object,
      required: false,
    },
  },
  data() {
    const checkNum = (value) => {
      return !isNaN(Number(value));
    };
    // eslint-disable-next-line no-unused-vars
    const checkInt = (value) => {
      return Number.isInteger(Number(value));
    };
    const greaterThan = (num) => {
      return (value) => {
        return Number(value) > num;
      };
    };
    const all = (...checkFuncs) => {
      return function (value) {
        for (let i = 0; i < checkFuncs.length; i++) {
          if (!checkFuncs[i](value)) {
            return false;
          }
        }
        return true;
      };
    };
    const checkNumAndGreaterThan0 = (msg) => {
      return (rule, value, callback) => {
        const checkFunc = all(checkNum, greaterThan(0));
        if (!checkFunc(value)) {
          return callback(new Error(msg));
        }
        return callback();
      };
    };
    return {
      steps: [
        "基本信息",
        "商品参数",
        "商品属性",
        "商品图片",
        "商品内容",
        "完成",
      ],
      active: "0",
      categoryList: [],
      goodInfo: {
        good_name: "",
        good_price: 0,
        good_weight: 0,
        good_number: 0,
        good_cate: [],
      },
      goodInfoRules: {
        good_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        good_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          {
            validator: checkNumAndGreaterThan0("商品价格必须是大于0的数值"),
            trigger: "blur",
          },
        ],
        good_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
          {
            validator: checkNumAndGreaterThan0("商品重量必须是大于0的数值"),
            trigger: "blur",
          },
        ],
        good_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              const checkFunc = all(checkNum, checkInt, greaterThan(0));
              if (!checkFunc(value)) {
                return callback(new Error("商品数量必须是大于0的整数值"));
              }
              return callback();
            },
          },
        ],
        good_cate: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    if (this.action === "edit" && this.good === undefined) {
      this.$alert("未获取到商品信息，请回退", {
        confirmButtonText: "确定",
        callback: () => {
          this.$router.back();
        },
      });
    } else {
      this.getCategoryList();
    }
  },
  computed: {
    headerContent() {
      return map[this.action];
    },
    activeIndex() {
      return parseInt(this.active);
    },
  },
  methods: {
    goBack() {
      this.$confirm("确定回退吗？填写的内容将不会保存", "回退确定", {
        type: "warning",
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        callback: (action) => {
          if (action === "confirm") {
            this.$router.back();
          }
        },
      });
      // this.$router.back();
    },
    async getCategoryList() {
      const { data: res } = await this.$axios.get("/categories");
      if (res.meta.status === 200) {
        this.categoryList = res.data;
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    categotySelectorHandleChange(value) {
      if (value.length === 3) {
        return;
      }
      this.$message.error("只能选择三级分类中的值");
      this.goodInfo.good_cate = [];
    },
  },
};
</script>
<style lang="less">
.good-form-container {
  margin-top: 20px;
}
.el-page-header {
  margin-bottom: 10px;
}
</style>
