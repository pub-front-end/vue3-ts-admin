<script lang="tsx">
  import { computed, defineComponent, PropType, reactive, ref, toRefs } from 'vue';
  import { IRenderItem } from '../render';
  import useRenderItem from './render-itme-helper';
  export default defineComponent({
    name: 'pub-render-search',
    props: {
      items: {
        type: Array as PropType<Array<IRenderItem>>,
        default: () => []
      },
      form: {
        type: Object,
        default: () => {}
      },
      tags: {
        type: Array,
        default: () => []
      },
      size: {
        type: Number,
        default: 3
      },
      gutter: {
        type: Number,
        default: 16
      },
      offset: {
        type: Number,
        default: 0
      },
      type: {
        type: String,
        default: ''
      },
      justify: {
        type: String,
        default: 'start'
      },
      reset: {
        type: Function
      },
      fullSearch: {
        type: Boolean,
        default: false
      },
      hasReset: {
        type: Boolean,
        default: true
      }
    },
    emits: ['search', 'closeTag'],
    setup(props: any, { emit }) {
      let isShowMore = ref(false);
      let submitLoading = ref(false);
      let isShowAdvancedSearch = ref(true);
      let resetLoading = ref(false);
      let advancedSearch = ref(true);
      const { form } = reactive(toRefs(props));

      function onSubmit(type = '') {
        if (type === 'click') {
          submitLoading.value = true;
          setTimeout(() => {
            submitLoading.value = false;
          }, 500);
        }

        //下转过来的就将页面重置为1 重置按钮 没有标签页 回到第一页；其他情况不变
        form.currentPage = type === 'click' || type === 'drill' || type === 'noCache' ? 1 : '';
        emit('search', form);
      }
      const { renderMap } = useRenderItem(props);

      const isFormExistValue = computed(() => {
        let tempForm = JSON.parse(JSON.stringify(form));
        tempForm.fullText = '';
        let flag = false;
        Object.values(tempForm).map((item: any) => {
          if (item?.length) {
            flag = true;
          }
        });
        return flag;
      });
      //重置搜索 type: advancedSearch 点击高级搜索的时候 fullText：点击全文检索的时候 drill：下钻过来的时候 click：表示通过按钮点击
      function onReset(type = '') {
        if (type === 'click') {
          resetLoading.value = true;
          setTimeout(() => {
            resetLoading.value = false;
          }, 500);
        }
        // isShowMore = false; // 重置后是否折叠组件
        typeof props.reset === 'function' && props.reset();

        if (isFormExistValue.value) {
          for (let key in form) {
            form[key] = Array.isArray(form[key]) ? [] : '';
          }
        }
        // type !== 'fullText' && this.defaultDatePicker();

        //如果是下钻过来的，先重置查询条件再读取下钻信息
        if (type === 'drill') {
          props.handleRouteQuery();
        }
        //如果点击高级搜索 ，清空全文检索
        if (type === 'advancedSearch') {
          form.fullText = '';
        }
        onSubmit(type);
      }
      //遍历数组
      const seperatorIndex = computed(() => props.items.findIndex((e: IRenderItem) => e.type === 'seperator'));
      const isSeperator = computed(() => seperatorIndex.value !== -1);
      const renderItems = computed(() => {
        let list: IRenderItem[] = [...props.items];
        if (isSeperator.value) {
          if (isShowMore.value) {
            list.splice(seperatorIndex.value, 1);
          } else {
            list = list.slice(0, seperatorIndex.value);
          }
        }
        return list;
      });

      // 折叠
      function packUp() {
        isShowMore.value = false;
      }
      // 展开
      function unfold() {
        isShowMore.value = true;
      }
      // 关闭标签事件
      function closeTag(item: any) {
        emit('closeTag', item);
      }
      function renderItem(item: IRenderItem) {
        return (
          <pub-col size={item.size || props.size}>
            <el-form-item>
              {props.form[item.prop]?.length ? <div class="pub-search-label font-size-small">{item.label}</div> : null}
              {renderMap[item.type || 'detail'].call(null, item)}
            </el-form-item>
          </pub-col>
        );
      }
      return {
        isShowMore,
        submitLoading,
        isShowAdvancedSearch,
        resetLoading,
        advancedSearch,
        onSubmit,
        onReset,
        isSeperator,
        renderItems,
        packUp,
        unfold,
        closeTag,
        renderItem,
        renderMap
      };
    },

    render() {
      return (
        <div class="pub-search">
          <el-form model={this.form}>
            {this.fullSearch && !this.isShowAdvancedSearch.value ? (
              <el-row gutter={this.gutter} type={this.type} justify={this.justify}>
                <pub-col size={6} offset={0}>
                  <el-form-item>
                    <el-input
                      model-value={this.form.fullText}
                      {...{
                        'onUpdate:modelValue': (e: string | number) => {
                          this.form.fullText = typeof e === 'string' ? e.trim() : e;
                        }
                      }}
                      onClear={() => {
                        this.onSubmit();
                      }}
                      placeholder={this.$t('button.fullTextSearch')}
                      clearable
                      v-slots={{
                        append: () => (
                          <el-button
                            type="primary"
                            icon="el-icon-search"
                            native-type="submit"
                            onClick={(e: MouseEvent) => {
                              e.preventDefault();
                              this.onSubmit();
                            }}
                          >
                            {this.$t('button.search')}
                          </el-button>
                        )
                      }}
                    ></el-input>
                  </el-form-item>
                </pub-col>
                <pub-col size={2}>
                  <el-form-item>
                    <el-button
                      class="pub-search-btn"
                      native-type="submit"
                      onClick={() => {
                        this.isShowAdvancedSearch = true;
                        this.advancedSearch = true;
                        this.onReset('advancedSearch');
                      }}
                    >
                      {this.$t('button.advancedSearch')}
                    </el-button>
                  </el-form-item>
                </pub-col>
              </el-row>
            ) : (
              <el-row gutter={this.gutter} type={this.type} justify={this.justify}>
                {this.renderItems.map((item: IRenderItem) => {
                  return this.renderItem(item);
                })}
                <div class="pub-search-btn-group">
                  {this.tags.length ? (
                    <div class="tags-group">
                      {this.tags.map((item: any) => {
                        return (
                          <el-tag class="search-tag" closable on-close={() => this.closeTag(item)}>
                            {item.name}
                          </el-tag>
                        );
                      })}
                    </div>
                  ) : null}

                  {this.isSeperator ? (
                    this.isShowMore ? (
                      <el-button class="pub-search-btn" type="text" onClick={() => (this.isShowMore = false)}>
                        {this.$t('button.packUp')}
                        <i class="el-icon-arrow-up el-icon--right"></i>
                      </el-button>
                    ) : (
                      <el-button class="pub-search-btn" type="text" onClick={() => (this.isShowMore = true)}>
                        {this.$t('button.unfold')}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    )
                  ) : null}
                  <el-button
                    icon="el-icon-search"
                    class="pub-search-btn"
                    type="primary"
                    native-type="submit"
                    loading={this.submitLoading}
                    onClick={(e: MouseEvent) => {
                      e.preventDefault();
                      this.onSubmit('click');
                    }}
                  >
                    {this.$t('button.search')}
                  </el-button>
                  {this.hasReset ? (
                    <el-button
                      class="pub-search-btn"
                      icon="el-icon-refresh"
                      loading={this.resetLoading}
                      onClick={(e: MouseEvent) => {
                        e.preventDefault();
                        this.onReset('click');
                      }}
                    >
                      {this.$t('button.reset')}
                    </el-button>
                  ) : null}
                  {this.fullSearch ? (
                    <el-button
                      class="pub-search-btn"
                      native-type="submit"
                      onClick={(e: MouseEvent) => {
                        e.preventDefault();
                        this.advancedSearch = false;
                        this.isShowAdvancedSearch = false;
                        this.onReset('fullText');
                      }}
                    >
                      {this.$t('button.cancelSearch')}
                    </el-button>
                  ) : null}
                </div>
              </el-row>
            )}
          </el-form>
        </div>
      );
    }
  });
</script>
<style lang="scss">
  .pub-search {
    text-align: left;
    padding: 0.5rem 1rem;
    .el-form-item {
      .el-input-group__append {
        .el-button--small {
          border-radius: 0 3px 3px 0;
          background: none;
        }
      }
    }
    .el-form-item__content {
      line-height: 1 !important;
    }
    .el-tag {
      max-width: 5rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &-label {
      text-align: left;
      position: absolute;
      top: -0.375rem;
    }
    &-btn-group {
      line-height: 1;
      height: 100%;
      padding: 0.75rem 0 0.75rem 0.5rem;
      display: inline-block;
    }
    .tags-group {
      line-height: 2rem;
      height: 100%;
      float: left;
      margin: 0 1rem 0 0;
      .search-tag {
        border-style: dashed;
        margin: 0 0.3125rem;
        vertical-align: middle;
      }
      ::v-deep .el-tag--small {
        line-height: 2rem;
        height: 2rem;
        margin: 0 0.3125rem;
        vertical-align: middle;
      }
    }
    &-btn {
      float: left;
    }
    .el-radio-group {
      float: left;
      height: 2rem;
      line-height: 2rem;
    }
    .el-select {
      .el-tag {
        .el-tag__close {
          display: none;
        }
      }
    }
  }
</style>
