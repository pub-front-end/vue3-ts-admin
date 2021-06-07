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
          title="异步表格"
          :http-request="getUserList"
          :columns="userTableColumns"
          :is-batch-export="isBatchExport"
          :is-batch-del="isBatchDel"
        >
          <template #headerRight>
            <div>新增区域</div>
          </template>
          <template v-slot:batchBtn>
            <el-button type="primary" @click="handleOper">批量操作</el-button>
          </template>
        </pub-async-table>
      </pub-content-item>
      <pub-content-item class="content-bg">
        <pub-table
          title="静态表格"
          page-id="simple-table-test"
          :data="tableData"
          show-type="html"
          :columns="columns"
          :show-sort-table="true"
          @test="handleTest"
          @selection-change="selectionChange"
        ></pub-table>
      </pub-content-item>
    </pub-content>
  </pub-container>
</template>
<script lang="tsx">
  import { defineComponent, ref, reactive, computed } from 'vue';
  import { ElMessage } from 'element-plus';
  import { getUserList } from '@/api/user';

  export default defineComponent({
    name: 'pub-container-demo',

    setup() {
      function selectionChange(params: any[]) {
        console.log('selectionChange---', params);
      }
      return {
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
        items: [
          // {
          //   label: '性别',
          //   prop: 'sex',
          //   type: 'select',
          //   size: 3,
          //   placeholder: '选择性别',
          //   data: [
          //     { valueCn: '女', mapKey: '0', disabled: true },
          //     { valueCn: '男', mapKey: '1' }
          //   ]
          // },
          // {
          //   label: '事件等级',
          //   prop: 'interest',
          //   type: 'select',
          //   size: 3,
          //   attrs: { multiple: true, 'collapse-tags': true },
          //   placeholder: '选择兴趣',
          //   data: 'eventLevel'
          // },
          {
            label: '姓名',
            prop: 'name',
            type: 'input',
            placeholder: '输入姓名',
            size: 3
          },
          { type: 'seperator' },
          {
            label: '活动名称',
            prop: 'regionName',
            type: 'input',
            placeholder: '输入活动名称',
            size: 3
          },
          {
            label: '活动区域',
            prop: 'region',
            type: 'input',
            placeholder: '输入活动区域',
            size: 3
          },
          {
            label: '姓名',
            prop: 'date2',
            type: 'input',
            placeholder: '输入姓名',
            size: 3
          }
          // {
          //   label: '住址',
          //   prop: 'address',
          //   type: 'cascader',
          //   size: 3,
          //   placeholder: '试试搜索：住址',
          //   dataProps: { checkStrictly: true },
          //   data: [
          //     {
          //       value: 'sichuan',
          //       label: '四川',
          //       children: [
          //         {
          //           value: 'neijiang',
          //           label: '内江',
          //           children: [
          //             {
          //               value: 'zizhong',
          //               label: '资中'
          //             },
          //             {
          //               value: 'jianyang',
          //               label: '简阳'
          //             }
          //           ]
          //         }
          //       ]
          //     }
          //   ]
          // },
          // {
          //   label: '住址2',
          //   prop: 'address',
          //   type: 'stationSelect',
          //   size: 3
          // },
          // {
          //   label: '出生日期',
          //   prop: 'birthday',
          //   type: 'datePicker',
          //   subType: 'datetime',
          //   size: 3,
          //   attrs: {
          //     placeholder: '选择出生日期'
          //   }
          // },
          // {
          //   label: '时间范围',
          //   prop: 'value4',
          //   type: 'datePicker',
          //   subType: 'datetimerange',
          //   size: 6,
          //   attrs: {
          //     'start-placeholder': '选择开始日期',
          //     'end-placeholder': '选择结束日期'
          //   }
          // }
        ],
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
          { label: '全选', type: 'selection', reserveSelection: true, disabled: true, width: 36 },

          { label: '账号', prop: 'account', show: true, width: 255 },
          { label: '姓名', prop: 'name', show: true, width: 236 },
          { label: '角色名称', prop: 'roleName', show: true },
          { label: '区域名称', prop: 'areaName', show: true },
          { label: '在线状态', prop: 'onlineFlagName', show: true },
          { label: '最近登录时间', prop: 'onlineTime', show: true },
          { label: '最近登录IP', prop: 'loginIp', show: true },
          { label: '账号状态', prop: 'disabledFlagName', show: true },
          {
            label: '操作',
            prop: 'address',
            show: true,
            disabled: true,
            render() {
              return (
                <div>
                  <el-button type="text">编辑</el-button>
                  <el-button type="text" class="button--del">
                    删除
                  </el-button>
                </div>
              );
            }
          }
        ]),
        columns: computed(() => [
          { label: '全选', type: 'selection', reserveSelection: true, disabled: true, width: 36 },

          {
            label: '姓名1111',
            prop: 'name',
            width: 236,
            show: true,
            render(scope: any) {
              return <div>{scope.$index + scope.row.name}</div>;
            }
          },
          { label: '告警子类型看', prop: 'name', width: 236, show: true },
          { label: '日期1', prop: 'date', width: 236, show: true },
          { label: '日期3', prop: 'date', width: 236 },
          { label: '姓名16地址', prop: 'name', customColumn: 'address' },

          { label: '地址', prop: 'address', show: true },
          {
            label: '操作',
            prop: 'address',
            show: true,
            width: 236,
            disabled: true,
            render() {
              return (
                <div>
                  <el-button type="text">编辑</el-button>
                  <el-button type="text" class="button--del">
                    删除
                  </el-button>
                </div>
              );
            }
          }
        ])
      };
    },
    methods: {
      handleTest() {
        console.log('test----------');
      },
      onSearch() {
        console.log(this.searchParams, '------------searchParams');
        // this.$refs['pub-table']?.doRequest(this.searchParams);
      },
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
      },
      handleOper() {
        ElMessage.info('批量操作中...');
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
