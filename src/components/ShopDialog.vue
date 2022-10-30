<template>
  <el-dialog v-bind="$attrs" class="shop-dialog">
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="sufix"></slot>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelHandler">取 消</el-button>
      <el-button type="primary" @click="$emit('determine')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "shop-default",
  props: {
    formProps: {
      type: Array,
      required: false,
      validator(formProps) {
        if (!Array.isArray(formProps)) {
          return false;
        }
        for (let i = 0; i < formProps.length; i++) {
          const item = formProps[i];
          if (typeof item.name !== "string") {
            return false;
          }
          if (typeof item.prop !== "string") {
            return false;
          }
        }
        return true;
      },
    },
  },
  methods: {
    //
    cancelHandler() {},
  },
  computed: {
    rules() {
      return this.formProps.map((item) => {
        return {
          [item.prop]: item.rules,
        };
      });
    },
  },
};
</script>
<style lang="less"></style>
