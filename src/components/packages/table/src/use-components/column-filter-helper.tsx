import HttpService from '@/utils/http-service';
import { ElMessage } from 'element-plus';
import Sortable from 'sortablejs';
import { computed, getCurrentInstance, onBeforeMount, reactive, ref, toRef, watch } from 'vue';
import { ItableProps } from './props-helper';

// 监测设备监测口表格数据分页查询
const findPageConfig = (pageId: string) =>
  HttpService.request({
    url: '/personalizedPage/find/' + pageId,
    method: 'get'
  });
const updatePageConfig = (data: any) =>
  HttpService.request({
    url: '/personalizedPage/set',
    method: 'post',
    data
  });

function useColumnFilter(props: ItableProps) {
  let vm: any;
  let pageId = toRef(props, 'pageId');
  let isShowPopover = ref(false);

  const configData = reactive({
    sortColumns: [] as any[], // 有序的column数组
    preSortColumns: [] as any[], // 编辑时有序的column数组
    checkedColumn: [] as any[], // 选中的数组
    preCheckedColumn: [] as any[], // 改变的数组
    labelSortList: [] as any[], // 标签排序数组
    originLabelList: [] as string[], // 最初的标签数组
    sortColumn: null as Sortable | null // 拖拽列对象
  });
  const innerColumnLabelObj = computed(() => {
    const obj: any = {};
    props.columns.forEach((e: any) => {
      obj[e.label] = e;
    });
    return obj;
  });
  const innerColumns = computed(() => {
    const cols = configData.sortColumns.filter((e: any) => e.disabled || configData.checkedColumn.includes(e.label));
    return cols;
  });
  //交换新旧index 位置
  const changeColumn = (newIndex: number, oldIndex: number) => {
    if (configData.preSortColumns[newIndex].disabled) {
      let nextIndex = newIndex;
      // 如果是首尾disabled 表示是全选与操作，不改变位置，改为其最近一位
      if (newIndex === 0) {
        nextIndex = 1;
      } else if (newIndex === configData.preSortColumns.length - 1) {
        nextIndex = newIndex - 1;
      }
      changeColumn(nextIndex, oldIndex);
    } else {
      // 先将原数组原位置删除元素
      const oldC = configData.preSortColumns.splice(oldIndex, 1)[0];
      //再将原数据插入到新位置
      configData.preSortColumns.splice(newIndex, 0, oldC);
    }
  };
  const initSortTable = () => {
    const el = document.querySelectorAll(`.pub-popover--group.${pageId.value}`)[0];
    configData.sortColumn = Sortable.create(el as any, {
      ghostClass: 'sortable-ghost', // drop placeholder的css类名
      onEnd: (event) => {
        const { newIndex, oldIndex } = event;
        changeColumn(newIndex || 0, oldIndex || 0);
      }
    });
  };
  const initFilter = async (columns: any[]) => {
    let temp: any[] = [];
    // 获取初始显示的列
    columns.forEach((item) => {
      if (!item.disabled && item.show) {
        temp.push(item.label);
      }
    });

    // 先占个位置 不然布局要出问题
    configData.checkedColumn = [...temp];
    configData.preCheckedColumn = [...temp];
    // 接口保存到数据库
    if (pageId.value) {
      const { data } = await findPageConfig(pageId.value);
      if (data && data.pageConfig) {
        const pageConfig = JSON.parse(data.pageConfig) || {};
        let { checkedColumn, labelSortList } = pageConfig;
        // 去重
        const totalLabelList = [...new Set([...labelSortList, ...configData.originLabelList])];
        // 长度不相等，表示有新增的列
        const isUpdateColums = totalLabelList.length !== labelSortList.length;
        if (isUpdateColums) {
          const newColumns = (labelSortList.length && totalLabelList.slice(labelSortList.length)) || totalLabelList;
          newColumns.forEach((e: any) => {
            const newIndex = configData.originLabelList.findIndex((label) => label === e);
            labelSortList.splice(newIndex, 0, e);
            // 如果默认显示
            if (innerColumnLabelObj.value[e] && innerColumnLabelObj.value[e].show) {
              checkedColumn.push(e);
            }
          });
        }
        let tempColumns: string[] = [];
        labelSortList.forEach((e: string) => {
          innerColumnLabelObj.value[e] && tempColumns.push(innerColumnLabelObj.value[e]);
        });

        configData.sortColumns = tempColumns;
        configData.preSortColumns = [...tempColumns];

        // 去重
        checkedColumn = [...new Set(checkedColumn)];
        configData.checkedColumn = [...checkedColumn];
        configData.preCheckedColumn = [...checkedColumn];
        // 如果有新增列，主动保存到数据库
        if (isUpdateColums) {
          //this.saveCheckedColumn();
        }
      }
    }
  };
  function saveCheckedColumn() {
    configData.checkedColumn = [...configData.preCheckedColumn];
    configData.sortColumns = [...configData.preSortColumns];
    const labelSortList = configData.sortColumns.map((e) => e.label);
    const pageConfig = JSON.stringify({
      labelSortList,
      checkedColumn: configData.checkedColumn
    });

    if (pageId.value) {
      updatePageConfig({ pageId: pageId.value, pageConfig }).then(() => {
        ElMessage.success('保存成功！');
        isShowPopover.value = false;
      });
    } else {
      isShowPopover.value = false;
    }
  }
  function cancelCheckedColumn() {
    configData.preCheckedColumn = [...configData.checkedColumn];
    isShowPopover.value = false;
  }
  function renderColumnFilter() {
    const referenceSlot = {
      reference: () => <i class="el-icon-s-grid pub-popover--icon"></i>
    };
    return (
      <el-popover
        ref="column-filter"
        class="pub-popover"
        value={isShowPopover}
        onInput={(e: boolean) => {
          isShowPopover.value = e;
        }}
        onHide={cancelCheckedColumn}
        placement="right"
        width={170}
        trigger="click"
        v-slots={referenceSlot}
      >
        <div class="pub-popover--tip">
          <span class="pub-popover--tip__mark">*</span>
          拖拽可修改排序
        </div>
        <el-checkbox-group
          class={'pub-popover--group ' + pageId.value}
          value={configData.preCheckedColumn}
          onInput={(e: any[]) => {
            configData.preCheckedColumn = e;
          }}
          min={1}
          max={15}
        >
          {configData.sortColumns.map((item) => {
            return (
              <el-checkbox
                label={item.label}
                key={item.label}
                disabled={item.disabled}
                class={item.disabled ? 'checkbox-hidden' : ''}
              ></el-checkbox>
            );
          })}
        </el-checkbox-group>
        <div class="pub-popover--button">
          <el-button type="primary" size="mini" onClick={saveCheckedColumn}>
            提 交
          </el-button>
          <el-button type="text" size="mini" onClick={cancelCheckedColumn}>
            取 消
          </el-button>
        </div>
      </el-popover>
    );
  }
  watch(
    () => isShowPopover,
    (val) => {
      if (val) {
        vm.$nextTick(() => {
          initSortTable();
        });
      } else {
        configData.sortColumn && configData.sortColumn.destroy();
      }
    }
  );

  watch(
    () => props.columns,
    (val) => {
      configData.sortColumns = [...val];
      configData.preSortColumns = [...val];
      const originLabelList: string[] = [];
      val.forEach((e) => {
        originLabelList.push(e.label);
      });
      configData.originLabelList = originLabelList;
      initFilter(val);
    },
    {
      immediate: true
    }
  );

  onBeforeMount(() => {
    vm = getCurrentInstance(); //获取组件实例
  });
  return { configData, innerColumnLabelObj, innerColumns, renderColumnFilter };
}

export default useColumnFilter;
