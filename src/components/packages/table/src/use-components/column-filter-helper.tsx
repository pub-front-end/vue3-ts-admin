import HttpService from '@/utils/http-service';
import { ElMessage } from 'element-plus';
import Sortable from 'sortablejs';
import { computed, getCurrentInstance, nextTick, onBeforeMount, Ref, ref, toRef, watch } from 'vue';
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
  let vm = getCurrentInstance();
  console.log(`vm===========`, vm);
  let pageId = toRef(props, 'pageId');
  let isShowPopover = ref(false);

  let sortColumn: Sortable; // 拖拽列对象
  let checkedColumn: string[] = []; // 选中的数组
  let preCheckedColumn: Ref<any[]> = ref([]); // 改变的数组
  let sortColumns: Ref<any[]> = ref([]); // 有序的column数组
  let preSortColumns: any[] = []; // 编辑时有序的column数组
  let originLabelList: string[] = []; // 最初的标签数组

  //根据lable获取配置项
  const innerColumnLabelObj = computed(() => {
    const obj: any = {};
    props.columns.forEach((e: any) => {
      obj[e.label] = e;
    });
    return obj;
  });
  const innerColumns = computed(() => {
    const cols = sortColumns.value.filter((e: any) => e.disabled || checkedColumn.includes(e.label));
    return cols;
  });

  function renderColumnFilter() {
    const referenceSlot = {
      reference: () => <i class="el-icon-s-grid pub-popover--icon"></i>
    };
    return (
      <el-popover
        ref="column-filter"
        visible={isShowPopover.value}
        {...{ 'onUpdate:visible': (bool: boolean) => (isShowPopover.value = bool) }}
        placement="right"
        width={170}
        trigger="click"
        v-slots={referenceSlot}
      >
        <div class="pub-popover">
          <div class="pub-popover--tip">
            <span class="pub-popover--tip__mark">*</span>
            拖拽可修改排序
          </div>
          <el-checkbox-group
            class={'pub-popover--group ' + pageId.value}
            model-value={preCheckedColumn.value}
            {...{ 'onUpdate:modelValue': (e: any[]) => (preCheckedColumn.value = e) }}
            min={1}
            max={15}
          >
            {sortColumns.value.map((item: any) => {
              return (
                <el-checkbox
                  label={item.label}
                  key={item.label}
                  disabled={item.disabled || false}
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
        </div>
      </el-popover>
    );
  }
  const initFilter = async (columns: any[]) => {
    let temp: any[] = [];
    // 获取初始显示的列
    columns.forEach((item) => {
      if (!item.disabled && item.show) {
        temp.push(item.label);
      }
    });

    // 先占个位置 不然布局要出问题
    checkedColumn = [...temp];
    preCheckedColumn.value = [...temp];
    // 接口保存到数据库
    // eslint-disable-next-line no-constant-condition
    if (pageId.value && false) {
      const { data } = await findPageConfig(pageId.value);
      if (data && data.pageConfig) {
        const pageConfig = JSON.parse(data.pageConfig) || {};
        let { checkedColumn: localCheckColumn, labelSortList } = pageConfig;
        // 去重
        const totalLabelList = [...new Set([...labelSortList, ...originLabelList])];
        // 长度不相等，表示有新增的列
        const isUpdateColums = totalLabelList.length !== labelSortList.length;
        if (isUpdateColums) {
          const newColumns = (labelSortList.length && totalLabelList.slice(labelSortList.length)) || totalLabelList;
          newColumns.forEach((e: any) => {
            const newIndex = originLabelList.findIndex((label) => label === e);
            labelSortList.splice(newIndex, 0, e);
            // 如果默认显示
            if (innerColumnLabelObj.value[e] && innerColumnLabelObj.value[e].show) {
              localCheckColumn.push(e);
            }
          });
        }
        let tempColumns: string[] = [];
        labelSortList.forEach((e: string) => {
          innerColumnLabelObj.value[e] && tempColumns.push(innerColumnLabelObj.value[e]);
        });

        sortColumns.value = tempColumns;
        preSortColumns = [...tempColumns];

        // 去重
        localCheckColumn = [...new Set(localCheckColumn)];
        checkedColumn = [...localCheckColumn];
        preCheckedColumn.value = [...localCheckColumn];
        // 如果有新增列，主动保存到数据库
        if (isUpdateColums) {
          //this.saveCheckedColumn();
        }
      }
    }
  };
  function saveCheckedColumn() {
    checkedColumn = [...preCheckedColumn.value];
    sortColumns.value = [...preSortColumns];
    const labelSortList = sortColumns.value.map((e: { label: any }) => e.label);
    const pageConfig = JSON.stringify({
      labelSortList,
      checkedColumn: checkedColumn
    });
    //todo 缺少接口支持
    // eslint-disable-next-line no-constant-condition
    if (pageId.value && false) {
      updatePageConfig({ pageId: pageId.value, pageConfig }).then(() => {
        ElMessage.success('保存成功！');
        isShowPopover.value = false;
      });
    } else {
      isShowPopover.value = false;
    }
  }
  function cancelCheckedColumn() {
    preCheckedColumn.value = [...checkedColumn];
    isShowPopover.value = false;
  }

  //交换新旧index 位置
  const changeColumn = (newIndex: number, oldIndex: number) => {
    if (preSortColumns[newIndex].disabled) {
      let nextIndex = newIndex;
      // 如果是首尾disabled 表示是全选与操作，不改变位置，改为其最近一位
      if (newIndex === 0) {
        nextIndex = 1;
      } else if (newIndex === preSortColumns.length - 1) {
        nextIndex = newIndex - 1;
      }
      changeColumn(nextIndex, oldIndex);
    } else {
      // 先将原数组原位置删除元素
      const oldC = preSortColumns.splice(oldIndex, 1)[0];
      //再将原数据插入到新位置
      preSortColumns.splice(newIndex, 0, oldC);
    }
  };
  const initSortTable = () => {
    const el = document.querySelectorAll(`.pub-popover--group.${pageId.value}`)[0];
    sortColumn = Sortable.create(el as any, {
      ghostClass: 'sortable-ghost', // drop placeholder的css类名
      onEnd: (event) => {
        const { newIndex, oldIndex } = event;
        changeColumn(newIndex || 0, oldIndex || 0);
      }
    });
  };
  watch(
    () => isShowPopover.value,
    (val) => {
      if (val) {
        nextTick(() => {
          initSortTable();
        });
      } else {
        sortColumn && sortColumn.destroy();
      }
    }
  );
  watch(
    () => props.columns,
    (val) => {
      sortColumns.value = [...val];
      preSortColumns = [...val];
      const temp: string[] = [];
      val.forEach((e) => {
        originLabelList.push(e.label);
      });
      originLabelList = temp;
      initFilter(val);
    },
    {
      immediate: true
    }
  );

  onBeforeMount(() => {
    vm = getCurrentInstance(); //获取组件实例
  });
  return { innerColumns, renderColumnFilter };
}

export default useColumnFilter;
