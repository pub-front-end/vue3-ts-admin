<!--L.Dragon-->
<template>
  <pub-container>
    <div class="breadcrumb content-bg">
      <el-switch
        v-model="direction"
        active-text="竖向布局"
        active-value="vertical"
        inactive-value="horizontal"
        inactive-text="横向布局"
      ></el-switch>
    </div>
    <pub-content v-show="direction === 'vertical'">
      <pub-content-item class="content-bg vertical-item">1</pub-content-item>
      <pub-content-item class="content-bg vertical-item">1</pub-content-item>
      <pub-content-item class="content-bg vertical-item">1</pub-content-item>
      <pub-content-item class="content-bg vertical-item">1</pub-content-item>
      <pub-content-item class="content-bg vertical-item">1</pub-content-item>
      <pub-content-item class="content-bg vertical-item" style="background: orange" min-height="10rem">
        2
      </pub-content-item>
    </pub-content>
    <pub-content v-show="direction === 'horizontal'" direction="horizontal">
      <pub-content-item class="content-bg" style="min-width: 200px">1</pub-content-item>
      <pub-content-item class="content-container">
        <pub-content padding="0">
          <pub-content-item class="content-bg vertical-item">1</pub-content-item>
          <pub-content-item class="content-bg vertical-item">1</pub-content-item>
          <pub-content-item class="content-bg vertical-item">1</pub-content-item>
          <pub-content-item class="content-bg vertical-item">1</pub-content-item>
          <pub-content-item class="content-bg vertical-item">1</pub-content-item>
          <pub-content-item class="content-bg vertical-item" style="background: orange">2</pub-content-item>
        </pub-content>
      </pub-content-item>
      <pub-content-item class="content-bg" min-height="10rem" style="min-width: 200px">1</pub-content-item>
    </pub-content>
  </pub-container>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  export default defineComponent({
    name: 'pub-container-demo',
    setup() {
      return {
        direction: ref('vertical')
      };
    }
  });
</script>
<style lang="scss" scoped>
  .breadcrumb {
    height: 2.5rem;
    line-height: 2.5rem;
    margin: 0 0 1rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
  }
  .vertical-item {
    min-height: 200px;
  }
  .content-container {
    flex: 1;
    width: 0;
  }
</style>
