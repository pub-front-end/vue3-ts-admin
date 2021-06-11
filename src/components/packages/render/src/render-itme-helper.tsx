import { pinyinQuery, tree2Array } from '@/utils/tools';
import { reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { IPubValue, IRenderItem } from '../render';
const trimStr = (str: string | number) => (typeof str === 'string' ? str.trim() : str);
function useRenderItem(props: any) {
  const { t } = useI18n();
  const selectDataObj = reactive({} as any);

  const { form } = reactive(toRefs(props));

  //输入框
  function renderInput(item: IRenderItem, type?: string) {
    let key = item.prop;
    return (
      <el-input
        model-value={form[key]}
        {...{
          'onUpdate:modelValue': (e: string | number) => {
            form[key] = trimStr(e);
          }
        }}
        placeholder={type === 'editor' ? t('info.please') + t('info.input') + item.label : item.label}
        type={item.textarea ? 'textarea' : ''}
        disabled={item.disabled}
        showPassword={item.showPassword}
        autosize
        maxlength={item.maxlength ? item.maxlength : ''}
        show-word-limit
        clearable
      />
    );
  }
  function renderSelect(item: IRenderItem, type?: string) {
    let key = item.prop;
    let k = item.optionKeyMap ? item.optionKeyMap : { value: 'mapKey', label: 'valueCn' };
    let selectData = item.data || [];
    if (!selectDataObj[key] && selectData.length) {
      selectDataObj[key] = JSON.parse(JSON.stringify(selectData));
    }
    return (
      <el-select
        model-value={form[key]}
        {...{
          'onUpdate:modelValue': (e: string | number) => {
            form[key] = trimStr(e);
          }
        }}
        placeholder={type === 'editor' ? t('info.please') + t('info.select') + item.label : item.label}
        disabled={item.disabled}
        clearable={item.isclearable === false ? item.isclearable : true}
        filterable
        filter-method={(value: any) => filterMethod(value, selectData, key, k.label)}
        default-first-option={true}
        collapse-tags
        {...item.attrs}
      >
        {selectDataObj[key].map((v: IPubValue) => {
          return <el-option key={v[k.value]} value={v[k.value]} label={v[k.label]} disabled={v.disabled}></el-option>;
        })}
      </el-select>
    );
  }
  function filterMethod(value: string, data: any[], key: string, searchKey: string) {
    selectDataObj[key] = pinyinQuery(data, value, searchKey);
  }
  //级联选择
  function renderCascader(item: IRenderItem, type?: string) {
    let key = item.prop;
    const optionsData: any = item.data;
    if (
      (!selectDataObj[key] && optionsData.length) ||
      JSON.stringify(selectDataObj[key]) !== JSON.stringify(optionsData)
    ) {
      selectDataObj[key] = optionsData;
    }
    return (
      <el-cascader
        model-value={form[key]}
        {...{
          'onUpdate:modelValue': (e: any) => {
            if (typeof e !== 'undefined') {
              form[key] = Array.isArray(form[key]) ? e : e[e?.length - 1] || '';
              if (item.callback) {
                item.callback(e);
              }
            }
          }
        }}
        options={selectDataObj[key]}
        placeholder={type === 'editor' ? t('info.please') + t('info.select') + item.label : item.label}
        props={item.dataProps}
        clearable={item.isclearable === false ? item.isclearable : true}
        filterable
        collapse-tags
        disabled={item.disabled}
        show-all-levels={false}
        filter-method={(node: any, keyword: string) =>
          filterCascader(node, keyword, tree2Array(JSON.parse(JSON.stringify(optionsData)), 'detail'))
        }
        {...item.attrs}
      ></el-cascader>
    );
  }
  function filterCascader(node: any, keyword: string, value: any) {
    let result = pinyinQuery(value, keyword, 'valueCn');
    return result.map((item: any) => {
      return item.valueCn === node.label;
    });
  }
  //自定义
  function renderCustom(item: IRenderItem) {
    return typeof item.render === 'function' ? item.render(item) : null;
  }
  // 鼠标事件 hover时 计算是否超长显示tip
  function handleMouseenter(e: MouseEvent, item: IRenderItem) {
    if (typeof item.isShowTip === 'undefined') {
      let clientWidth = (e.target as HTMLElement).clientWidth;
      let scrollWidth = (e.target as HTMLElement).scrollWidth;
      item.isShowTip = scrollWidth > clientWidth ? false : true;
      //强制更新
      // this.$nextTick(() => {
      //   this.$forceUpdate();
      // });
    }
  }
  // 编辑界面的详情 默认不超长提示
  function renderDetail(item: IRenderItem, type?: string, isTip = false) {
    return item.isTip || isTip ? (
      <el-tooltip
        effect="light"
        placement="bottom-start"
        open-delay={300}
        disabled={item.isShowTip}
        v-slots={{
          content: () => <div>{form[item.prop || 0] || '-'}</div>
        }}
      >
        <div class="overflow-ellipsis text-align-left" onMouseenter={(e: MouseEvent) => handleMouseenter(e, item)}>
          {form[item.prop || 0] || '-'}
        </div>
      </el-tooltip>
    ) : (
      <div class="overflow-ellipsis text-align-left">{form[item.prop || 0] || '-'}</div>
    );
  }
  const renderMap: any = {
    input: renderInput,
    cascader: renderCascader,
    render: renderCustom,
    detail: renderDetail,
    select: renderSelect
  };
  return {
    renderMap,
    handleMouseenter
  };
}

export default useRenderItem;
