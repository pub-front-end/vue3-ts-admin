<!--Linjl-->
<script lang="tsx">
  import { computed, defineComponent, PropType } from 'vue';
  import pubPopconfirm from './components/pub-popconfirm.vue';
  import { IButtonItem } from '../render';
  export default defineComponent({
    name: 'pub-render-button',
    components: { pubPopconfirm },
    props: {
      items: {
        type: Array as PropType<Array<IButtonItem>>,
        default: () => []
      }
    },
    setup(props: any) {
      const operatePermissionObj: any = {};
      const permissionItems = computed(() => {
        let tempItems: IButtonItem[] = [];
        props.items.forEach((item: IButtonItem) => {
          item.sort = item.sort || 0; // 不写sort默认放在最前面
          item.name = item.name || item.defaultName;

          if (!item.permission) {
            tempItems.push(item);
          } else {
            // 有按钮权限才显示
            tempItems.push(item);
            // if (operatePermissionObj[item.permission]) {
            //   tempItems.push(item);
            // }
          }
        });
        // 根据sort排序0-9
        // tempItems.sort((a: any, b: any) => a.sort - b.sort);
        return tempItems;
      });
      return { operatePermissionObj, permissionItems };
    },
    render() {
      return (
        <div class="pub-button">
          <el-button-group>
            {this.permissionItems.map((item: IButtonItem) => {
              return item.popconfirm && !item.disabled ? (
                <div class="pub-button-tip el-button el-button--small">
                  <pub-popconfirm
                    title={item.popTitle}
                    name={item.name}
                    type={item.type}
                    typeIcon={item.icon}
                    reconfirm={item.reconfirm}
                    reconfirmLabel={item.reconfirmLabel}
                    onConfirm={() => {
                      item.oper?.call(null);
                    }}
                  ></pub-popconfirm>
                </div>
              ) : item.icon || item.disabled ? (
                <el-tooltip
                  content={(item.disabled && item.disabledMsg) || item.name}
                  enterable={false}
                  hide-after={item.disabled ? 1000 : 500}
                  placement="top-start"
                >
                  <div class={'pub-button-tip el-button el-button--small'}>
                    <el-button
                      v-waves
                      class={item.class || ''}
                      type={item.type || 'primary'}
                      icon={item.icon}
                      disabled={item.disabled}
                      onClick={() => {
                        item.oper?.call(null);
                      }}
                    >
                      {(!item.icon && item.name) || ''}
                    </el-button>
                  </div>
                </el-tooltip>
              ) : (
                <div class={'pub-button-tip el-button el-button--small'}>
                  <el-button
                    v-waves
                    class={item.class || ''}
                    type={item.type || 'primary'}
                    disabled={item.disabled}
                    onClick={() => {
                      item.oper?.call(null);
                    }}
                  >
                    {item.name}
                  </el-button>
                </div>
              );
            })}
          </el-button-group>
        </div>
      );
    }
  });
</script>
<style lang="scss" scoped>
  .pub-button {
    .pub-button-tip {
      display: inline-block;
      padding: 0;
    }

    .el-button-group > {
      .pub-button-tip:first-child:last-child {
        display: inline-block;
        padding: 0;
        .el-button {
          border-radius: 4px !important;
        }
      }
      .pub-button-tip:first-child {
        border-left: none;
      }
      .pub-button-tip:last-child {
        border-right: none;
      }
      .pub-button-tip:not(:first-child) {
        border-left: 1px solid rgba(0, 0, 0, 0.2);
      }
      .pub-button-tip:not(:last-child) {
        border-right: 1px solid rgba(0, 0, 0, 0.2);
      }
    }
  }
</style>
