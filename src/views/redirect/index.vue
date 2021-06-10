<script lang="tsx">
  import { defineComponent } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  export default defineComponent({
    setup() {
      const route = useRoute();
      const router = useRouter();
      const {
        params: { path },
        query
      } = route;
      let pathStr = Array.isArray(path) ? path.join('/') : path;
      router.replace({ path: '/' + pathStr, query });
      return {};
    },
    render() {
      return <div></div>;
    }
  });
</script>
