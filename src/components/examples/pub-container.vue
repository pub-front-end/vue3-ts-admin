<!--L.Dragon-->
<template>
  <pub-container>
    <pub-content v-show="direction === 'vertical'">
      <pub-content-item class="content-bg vertical-item">
        <el-switch
          v-model="direction"
          class="my-switch"
          active-text="竖向布局"
          active-value="vertical"
          inactive-value="horizontal"
          inactive-text="横向布局"
        ></el-switch>
      </pub-content-item>
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
          <pub-content-item class="content-bg vertical-item">
            <el-switch
              v-model="direction"
              class="my-switch"
              active-text="竖向布局"
              active-value="vertical"
              inactive-value="horizontal"
              inactive-text="横向布局"
            ></el-switch>
          </pub-content-item>
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
  .my-switch {
    padding-top: 16px;
  }
  .vertical-item {
    min-height: 200px;
  }
  .content-container {
    flex: 1;
    width: 0;
  }
</style>
