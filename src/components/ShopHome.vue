<template>
  <el-container class="shop_home">
    <el-header>
      <div class="logo_info">
        <img src="https://placekitten.com/50" alt="logo" />
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="logout" type="danger">退出登陆</el-button>
    </el-header>
    <el-container class="section-container">
      <el-aside :width="asideWidth">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="rgb(31, 55, 59) "
          text-color="white"
          active-text-color="aqua"
          router
          :collapse-transition="false"
          :collapse="collapse"
        >
          <el-submenu
            v-for="item in orderMenuList"
            :key="item.id"
            :index="item.path"
          >
            <template slot="title">
              <i class="el-icon-edit"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.id"
              :index="child.path"
            >
              <i class="el-icon-edit"></i>
              <span>{{ child.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: "shop-home",
  data() {
    return {
      menuList: [],
      collapse: false,
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      const { data: res } = await this.$axios.get("menus");
      if (res.meta.status === 200) {
        this.menuList = res.data;
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    toggleCollapse() {
      this.collapse = !this.collapse;
    },
  },
  computed: {
    orderMenuList() {
      const clone = [...this.menuList];
      return clone.sort((a, b) => a.order - b.order);
    },
    asideWidth() {
      if (this.collapse) {
        return "64px";
      }
      return "240px";
    },
  },
};
</script>
<style lang="less" scoped>
.el-header {
  background-color: rgba(32, 32, 32, 0.9);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo_info {
    height: 100%;
    display: flex;
    align-items: center;
    color: aliceblue;
    img {
      border-radius: 50%;
    }
    span {
      margin-left: 10px;
      font-size: 1.3em;
    }
  }
}
.section-container {
  overflow: hidden;
}
.el-aside {
  overflow: overlay;
  background-color: rgb(31, 55, 59);
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: aliceblue;
}

.shop_home {
  height: 100%;
}

.toggle-button {
  height: 30px;
  text-align: center;
  line-height: 30px;
  letter-spacing: 4px;
  cursor: pointer;
  user-select: none;
  background-color: rgba(32, 32, 32, 0.9);
  color: white;
}
</style>
