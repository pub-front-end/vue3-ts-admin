<template>
  <pub-container>
    <pub-content>
      <pub-content-item class="content-bg">
        <div class="search">
          <pub-render-search
            :items="items"
            :gutter="16"
            :form="searchParams"
            :full-search="false"
            @search="onSearch"
          ></pub-render-search>
        </div>
      </pub-content-item>
      <pub-content-item class="content-bg async-table">
        <pub-async-table
          ref="pub-table"
          :title="$t('pubTable.asyncTitle')"
          page-id="async-table-test"
          :http-request="getUserList"
          :columns="userTableColumns"
          :is-batch-export="isBatchExport"
          :is-batch-del="isBatchDel"
        >
          <template #headerRight>
            <el-button v-waves @click="handleNew">{{ $t('button.new') }}</el-button>
          </template>
          <template #batchBtn>
            <el-button v-waves type="primary" @click="handleOper">{{ $t('button.batchDel') }}</el-button>
          </template>
        </pub-async-table>
      </pub-content-item>
      <pub-content-item class="content-bg">
        <pub-table
          :title="$t('pubTable.staticTitle')"
          page-id="simple-table-test"
          :data="tableData"
          show-type="html"
          :columns="columns"
          :show-sort-table="true"
          @selection-change="selectionChange"
        ></pub-table>
      </pub-content-item>
    </pub-content>
    <pub-editor v-model="newVisible" :type="editorType" :title="editorTitle" @search="onSearch"></pub-editor>
  </pub-container>
</template>
<script lang="tsx">
  import { defineComponent, ref, reactive, computed, toRefs } from 'vue';
  import { ElMessage } from 'element-plus';
  import { getUserList } from '@/api/user';
  import pubEditor from './pub-editor.vue';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    name: 'pub-container-demo',
    components: { pubEditor },

    setup() {
      const { t } = useI18n();
      const state = reactive({
        newVisible: false,
        editorType: 'edit',
        editorTitle: t('pubTable.user') + t('button.edit')
      });
      function selectionChange(params: any[]) {
        console.log('selectionChange---', params);
      }
      function handleNew() {
        state.newVisible = true;
        state.editorType = 'new';
        state.editorTitle = t('button.new') + t('pubTable.user');
      }
      function showUser() {
        state.newVisible = true;
        state.editorType = 'detail';
        state.editorTitle = t('button.show') + t('pubTable.user');
      }
      function handleEdit() {
        state.newVisible = true;
        state.editorType = 'edit';
        state.editorTitle = t('button.edit') + t('pubTable.user');
      }
      function handleDel(id: string) {
        console.log('handleDel---', id);
      }
      function handleOper() {
        ElMessage.info('批量操作中...');
      }

     function onSearch() {
        console.log(this.searchParams, '------------searchParams');
         this.$refs['pub-table']?.doRequest(this.searchParams);
      }
      return {
        ...toRefs(state),
        onSearch,
        handleOper,
        handleNew,
        selectionChange,
        getUserList,
        isBatchDel: ref(true),
        isBatchExport: ref(true),
        searchParams: reactive({
          fullText: '', //全文检索字段
          name: '',
          account: '',
          sex: '',
          address: [],
          birthday: '',
          value4: []
        }),
        items: computed((): Pub.RenderItem[] => [
          {
            label: t('pubTable.sex'), //'性别',
            prop: 'sex',
            type: 'select',
            size: 3,
            data: [
              { valueCn: '女', mapKey: '0' },
              { valueCn: '男', mapKey: '1' }
            ]
          },
          {
            label: t('pubTable.name'), //'姓名',
            prop: 'name',
            type: 'input',
            size: 3
          },

          {
            label: t('pubTable.address'), //'住址',
            prop: 'address',
            type: 'cascader',
            size: 3,
            dataProps: { checkStrictly: true },
            data: [
              {
                value: 'sichuan',
                label: '四川',
                children: [
                  {
                    value: 'neijiang',
                    label: '内江',
                    children: [
                      {
                        value: 'zizhong',
                        label: '资中'
                      },
                      {
                        value: 'jianyang',
                        label: '简阳'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          { type: 'seperator', label: '', prop: '' },
          {
            label: t('pubTable.regionName'), //'活动名称',
            prop: 'regionName',
            type: 'input',
            size: 3
          },
          {
            label: t('pubTable.region'), //'活动区域',
            prop: 'region',
            type: 'input',
            size: 3
          }
        ]),
        tableData: [
          {
            date: '2016-05-01',
            name: '王小虎',
            address: "<b class='key' style='color:red'>上海市11普陀</b>"
          },
          {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-05',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-06',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-08',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-09',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-10',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-11',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-12',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-13',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-14',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-14',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-14',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-14',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-14',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-14',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-14',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-14',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-14',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }
        ],
        userTableColumns: computed(() => [
          {
            label: t('info.selectAll'),
            labelZh: '全选',
            type: 'selection',
            reserveSelection: true,
            disabled: true,
            width: 36
          },

          { label: t('pubTable.name'), labelZh: '姓名', prop: 'name', show: true, width: 236 },
          { label: t('pubTable.address'), labelZh: '地址', prop: 'address', show: true },
          { label: t('pubTable.date'), labelZh: '时间', prop: 'date', show: true },
          {
            label: t('info.oper'),
            labelZh: '操作',
            prop: 'address',
            disabled: true,
            width: '250',
            render: (scope: Pub.Scope) => {
              const { id = '', onlineFlag, defaultFlag } = scope.row;

              const buttonGroup: Pub.ButtonItem[] = [
                {
                  type: 'primary',
                  icon: 'el-icon-document',
                  defaultName: t('button.detail'),
                  oper: () => {
                    showUser();
                  }
                },
                {
                  type: 'primary',
                  // icon: 'el-icon-document',
                  defaultName: t('button.detail'),
                  oper: () => {
                    showUser();
                  }
                },
                {
                  type: 'primary',
                  icon: 'el-icon-edit',
                  defaultName: t('button.edit'), //'编辑',
                  permission: 'sys:user:edit',
                  //disabled: onlineFlag === '1',
                  oper: () => {
                    handleEdit();
                  }
                },
                {
                  type: 'danger',
                  permission: 'sys:user:delete',
                  popconfirm: true,
                  icon: 'el-icon-delete',
                  defaultName: t('button.del'), //'删除',
                  disabledMsg: t('info.undeletable'), // '不可删除在线用户与内置用户',
                  popTitle: t('info.delTip'), //`此操作将永久删除该用户（${account}），是否继续？`,
                  disabled: onlineFlag === '1' || defaultFlag === '1',
                  oper: () => {
                    handleDel(id);
                  }
                }
              ];
              return <pub-render-button items={buttonGroup}></pub-render-button>;
            }
          }
        ]),
        columns: computed(() => [
          { label: '全选', type: 'selection', reserveSelection: true, disabled: true, width: 36 },
          {
            label: t('pubTable.name') + 55,
            labelZh: '姓名1111',
            prop: 'name',
            width: 236,
            show: true,
            render(scope: any) {
              return <div>{scope.$index + scope.row.name}</div>;
            }
          },
          { label: t('pubTable.name') + 11, labelZh: '姓名1111', prop: 'name', width: 236, show: true },
          { label: t('pubTable.date'), labelZh: '日期1', prop: 'date', width: 236, show: true },
          { label: t('pubTable.date') + 33, labelZh: '日期3', prop: 'date', width: 236 },
          { label: t('pubTable.name') + 22, labelZh: '姓名222', prop: 'name', customColumn: 'address' },

          { label: t('pubTable.name'), labelZh: '地址', prop: 'address', show: true },

          {
            label: t('info.oper'),
            labelZh: '操作',
            prop: 'address',
            disabled: true,
            width: '250',
            render: () => {
              const buttonGroup: Pub.ButtonItem[] = [
                {
                  type: 'primary',
                  icon: 'el-icon-document',
                  defaultName: t('button.detail'),
                  oper: () => {
                    showUser();
                  }
                },
                {
                  type: 'primary',
                  icon: 'el-icon-edit',
                  defaultName: t('button.edit'),
                  oper: () => {
                    showUser();
                  }
                }
              ];
              return <pub-render-button items={buttonGroup}></pub-render-button>;
            }
          }
        ])
      };
    },
    methods: {
     ,
      onReset() {
        this.searchParams = {
          fullText: '', //全文检索字段
          name: '',
          account: '',
          sex: '',
          address: [],
          birthday: '',
          value4: []
        };
        this.onSearch();
      }
    }
  });
</script>
<style lang="scss">
  .breadcrumb {
    height: 2.5rem;
    line-height: 2.5rem;
    margin: 0 0 1rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
  }
  .pub-table--input {
    background-color: inherit;
    .el-input__inner {
      border-width: 0;
      background-color: inherit;
    }
    .el-input__inner:focus {
      border-width: 1px;
      background-color: white;
    }
  }

  .search {
    padding: 0.5rem;
    &-item {
      width: 160px;
      margin: 0.5rem 1rem;
    }
  }
  .async-table {
    height: 20rem;
  }
</style>
