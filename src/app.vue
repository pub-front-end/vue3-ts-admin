<template>
  <div class="app">
    <router-view />
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import NProgress from 'nprogress';

  export default defineComponent({
    setup() {
      const router = useRouter();
      const state = reactive({});
      router.beforeEach((to, from) => {
        console.log(to, from);
        NProgress.start();
      });
      router.afterEach(() => {
        NProgress.done();
      });

      return {
        state
      };
    }
  });
</script>
<style lang="scss">
  #app,
  .app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    width: 100%;
    height: 100%;
    & > div {
      width: 100%;
      height: 100%;
    }
  }
</style>
