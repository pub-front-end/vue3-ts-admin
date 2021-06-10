<script lang="tsx">
  import { defineComponent, ref } from 'vue';
  import menuData from './menu-data';

  import { useRoute, useRouter } from 'vue-router';
  // 菜单接口
  export interface Imenu {
    id: string;
    parentId: string;
    name: string;
    type: string;
    level: string;
    target?: string;
    icon?: string;
    childrenMenu?: Imenu[];
    [key: string]: any;
  }
  export default defineComponent({
    setup() {
      const route = useRoute();
      const router = useRouter();
      let defaultActive = ref(route.path);

      const hasChildMenu = (menu: Imenu[]) => {
        return (
          menu &&
          menu.length &&
          menu.findIndex((e) => {
            return e && e.type === '1' && e.isShow === '1';
          }) > -1
        );
      };
      const trunTo = (href: string) => {
        href && router.push(href || '');
      };
      return {
        trunTo,
        hasChildMenu,
        menuTreeList: [menuData],
        defaultActive
      };
    },

    methods: {
      renderMenu(h: any, menuList: Imenu[]) {
        return menuList?.length
          ? menuList.map((item) => {
              let href = item.href;
              const titleSlot = {
                title: () => [
                  <span>
                    <i class={'iconfont ' + item.icon}></i>
                    <span>{item.name}</span>
                  </span>
                ]
              };
              return this.hasChildMenu(item.childrenMenu || []) ? (
                <el-submenu key={item.id} index={item.id || item.href} v-slots={titleSlot}>
                  {this.renderMenu(h, item.childrenMenu || [])}
                </el-submenu>
              ) : item.type === '1' && item.isShow === '1' ? (
                <el-menu-item
                  key={item.id}
                  index={href || item.id}
                  route={href || ''}
                  onClick={() => this.trunTo(href)}
                  v-slots={titleSlot}
                ></el-menu-item>
              ) : null;
            })
          : null;
      },
      handleSelect(key: string, keyPath: string) {
        console.log(key, keyPath);
      }
    },

    render(h: any) {
      return (
        <el-menu class="menu-container" unique-opened={true} default-active={this.defaultActive}>
          {this.renderMenu(h, this.menuTreeList)}
        </el-menu>
      );
    }
  });
</script>
