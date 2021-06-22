<script lang="tsx">
  import { defineComponent, getCurrentInstance, PropType, reactive, ref } from 'vue';
  import { IRenderItem } from '../render';
  import useRenderItem from './render-itme-helper';
  import { getValueByPath, messageFirstError } from '@/utils/tools';
  import ValidateObj from '@/utils/validate';

  export default defineComponent({
    name: 'pub-render-editor',
    props: {
      items: {
        type: Array as PropType<Array<IRenderItem>>,
        default: () => []
      },
      form: {
        type: Object,
        default: () => {}
      },
      labelWidth: {
        type: Number,
        default: 120
      },
      labelSuffix: {
        type: String,
        default: '：'
      },
      size: {
        type: Number,
        default: 12
      },
      gutter: {
        type: Number,
        default: 16
      },
      showButton: {
        type: Boolean,
        default: true
      },
      loading: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'detail'
      }
    },
    emits: ['submit', 'cancel'],
    setup(props: any, { emit }) {
      let vm: any = getCurrentInstance();
      let innerLoading = ref(false);

      const { form } = reactive(props);
      const { renderMap, handleMouseenter } = useRenderItem(props);
      //对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      function resetFields() {
        vm.refs.form?.resetFields();
      }
      // 移除表单项的校验结果
      function clearValidate() {
        vm.refs.form?.clearValidate();
      }

      //表单验证
      function validate() {
        return new Promise((resolve, reject) => {
          vm.refs.form.validate((bool: boolean, errObj: any) => {
            if (bool) {
              resolve(true);
            } else {
              reject(errObj);
            }
          });
        });
      }
      function handleSubmit(e: MouseEvent) {
        innerLoading.value = true;
        e.preventDefault(); //阻止默认事件，避免界面刷新
        vm.refs.form.validate((bool: boolean, errObj: any) => {
          innerLoading.value = false;
          if (bool) {
            emit('submit');
          } else {
            messageFirstError(errObj);
          }
        });
      }
      function handleCancel() {
        emit('cancel');
      }
      function renderRule(item: IRenderItem): any {
        const tempTules =
          item?.rules?.map((r: any) => {
            if (typeof r === 'string') {
              return (ValidateObj as any)[r](item.label);
            } else {
              return r;
            }
          }) || [];

        return tempTules;
      }
      function renderItem(item: IRenderItem) {
        return (
          <pub-col size={item.size || props.size}>
            {item.type === 'title' ? (
              <div class="sub-title">{item.label}</div>
            ) : (
              <el-form-item
                label={item.label}
                prop={item.prop}
                rules={renderRule(item)}
                label-width={props.lableWidthStyle}
              >
                {item.render ? (
                  <div class="pub-edit-item-render--value">{item.render(form)}</div>
                ) : (
                  renderMap[item.type || 'detail'].call(null, item, 'editor')
                )}
              </el-form-item>
            )}
          </pub-col>
        );
      }
      function renderDetailItem(item: IRenderItem) {
        let value = getValueByPath(form, item.prop);
        value = typeof value !== 'number' ? value || '-' : value;
        return (
          <pub-col size={item.size || props.size}>
            {item.type === 'title' ? (
              <div class="sub-title">{item.label}</div>
            ) : (
              <div class="pub-detail-item">
                {item.label ? (
                  <div class="pub-detail-item--label">
                    {item.label} {props.labelSuffix}
                  </div>
                ) : (
                  ''
                )}
                {item.render ? (
                  <div class="pub-detail-item-render--value">{item.render(form)}</div>
                ) : (
                  <el-tooltip
                    effect="dark"
                    placement="bottom-start"
                    open-delay={300}
                    disabled={typeof item.isShowTip === 'undefined' ? true : item.isShowTip}
                    v-slots={{ content: () => <div>{value}</div> }}
                  >
                    <div
                      class="pub-detail-item--value overflow-ellipsis"
                      on-mouseenter={(e: MouseEvent) => handleMouseenter(e, item)}
                    >
                      {value}
                    </div>
                  </el-tooltip>
                )}
              </div>
            )}
          </pub-col>
        );
      }
      function renderDetail() {
        return (
          <div class="pub-detail">
            <el-row gutter={props.gutter}>
              {props.items.map((item: IRenderItem) => {
                return item.show || item.show === undefined ? renderDetailItem(item) : null;
              })}
            </el-row>
            {props.showButton ? (
              <div class="margin-top-1">
                <el-button v-waves onClick={handleCancel}>
                  {vm.ctx.$t('button.back')}
                </el-button>
              </div>
            ) : null}
          </div>
        );
      }

      function renderEditor() {
        return (
          <div class="pub-editor">
            <el-form
              model={form}
              ref="form"
              label-width={props.labelWidth + 'px'}
              label-position="right"
              label-suffix={props.labelSuffix}
              onSubmit={handleSubmit}
            >
              <el-row gutter={props.gutter}>
                {props.items.map((item: IRenderItem) => {
                  return item.show || item.show === undefined ? renderItem(item) : null;
                })}
              </el-row>
              {props.showButton ? (
                <div class="margin-top-1">
                  <el-button
                    v-waves
                    class="margin-right-1"
                    type="primary"
                    native-type="submit"
                    disabled={innerLoading.value}
                    loading={props.loading}
                    onClick={handleSubmit}
                  >
                    {vm.ctx.$t('button.submit')}
                  </el-button>
                  <el-button v-waves onClick={handleCancel}>
                    {vm.ctx.$t('button.cancel')}
                  </el-button>
                </div>
              ) : null}
            </el-form>
          </div>
        );
      }
      return {
        innerLoading,
        renderMap,
        handleSubmit,
        handleCancel,
        renderItem,
        renderDetailItem,
        renderDetail,
        renderEditor,
        validate,
        resetFields,
        clearValidate
      };
    },
    render() {
      return this.type !== 'detail' ? this.renderEditor() : this.renderDetail();
    }
  });
</script>
<style lang="scss">
  .pub-edit-item-render--value {
    text-align: left;
  }
  .pub-editor {
    padding: 0.5rem 0;
    position: relative;
    .el-form-item {
      padding: 0 0.8rem;
      .el-form-item__label,
      .el-form-item__content {
        padding: 0.5rem 0 !important;
      }
    }
  }
</style>

<style lang="scss" scoped>
  .pub-detail {
    padding: 0.5rem 0;
    position: relative;
    &-item {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      padding: 0.1rem 0.8rem 0.1rem 2.5em;
      &--label {
        height: 2.25rem;
        line-height: 2.25rem;
        font-size: 0.875rem;
        text-align: right;
        padding-right: 1rem;
      }
      &-render--value {
        line-height: 2.25rem;
        flex: 1;
        width: 0;
        font-size: 0.875rem;
        text-align: left;
        .pub-detail-item--value {
          width: 100%;
        }
      }
      &--value {
        height: 2.25rem;
        line-height: 2.25rem;
        flex: 1;
        width: 0;
        font-size: 0.875rem;
        text-align: left;
      }
    }
  }
</style>
