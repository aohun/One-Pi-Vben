<template>
  <div class="h-[calc(100vh-180px)] overflow-scroll">
    <!-- 由于外层设置了占满高度(overflow-hidden) 这里必要要减去高度(剩下的) 否则滚动无效 -->
    <Form
      :model="formData"
      :colon="false"
      name="basic"
      label-align="left"
      :label-col="{ span: 6 }"
      autocomplete="off"
    >
      <!-- 手风琴模式, 默认只能展开一个面板 -->
      <Collapse v-model:activeKey="currentCollapseItem" accordion>
        <CollapsePanel key="1" header="常规">
          <FormItem label="节点id" name="id" :rules="[{ required: true, message: '输入节点ID' }]">
            <Input v-model:value="formData.id" placeholder="输入节点ID" @change="idChange" />
          </FormItem>
          <FormItem label="节点名称" name="name" :rules="[{ required: false }]">
            <Input v-model:value="formData.name" placeholder="输入节点名称" @change="nameChange" />
          </FormItem>
          <FormItem
            v-if="showConfig.skipExpression"
            label="跳过表达式"
            name="skipExpression"
            :rules="[{ required: false }]"
          >
            <Input
              v-model:value="formData.skipExpression"
              placeholder="输入跳过表达式"
              @change="skipExpressionChange"
            />
          </FormItem>
          <FormItem
            v-if="showConfig.skipExpression"
            label="关联表单"
            name="formKey"
            :rules="[{ required: false }]"
          >
            <Select
              v-model:value="formData.formKey"
              :options="formOptions"
              placeholder="请选择表单"
              allow-clear
              @select="formKeyChange"
            />
          </FormItem>
        </CollapsePanel>
        <CollapsePanel key="2" header="任务">
          <FormItem v-if="showConfig.async" label="是否异步" name="async">
            <Switch
              v-model:checked="formData.async"
              checkedChildren="是"
              unCheckedChildren="否"
              @change="syncChange"
            />
          </FormItem>
          <!-- 由于这里没有用FormItem 需要手动加上margin -->
          <Tabs class="h-200px mb-24px" tab-position="left">
            <TabPane key="save" tab="身份存储">
              <FormItem label="分配人员">
                <Input
                  v-model:value="formData.assignee"
                  readonly
                  @click="handleOpenUserSelect(false)"
                  placeholder="点击选择人员(单选)"
                  @change="fixedAssigneeChange"
                />
              </FormItem>
              <FormItem label="候选人员">
                <Badge :count="selectUserLength">
                  <a-button type="primary" size="small" @click="handleOpenUserSelect(true)"
                    >选择人员</a-button
                  >
                </Badge>
              </FormItem>
              <FormItem label="候选组">
                <Badge :count="selectRoleLength">
                  <a-button type="primary" size="small" @click="handleOpenRoleSelect"
                    >选择组</a-button
                  >
                </Badge>
              </FormItem>
            </TabPane>
            <!-- <TabPane key="fix" tab="固定值">
              <FormItem label="分配类型" name="auditUserType">
                <Select
                  v-model:value="formData.allocationType"
                  :options="allocationTypeSelectOptions"
                />
              </FormItem>
              <FormItem v-if="formData.allocationType === AllocationTypeEnum.USER" label="分配人员">
                <Input
                  v-model:value="formData.fixedAssignee"
                  readonly
                  placeholder="点击选择人员(单选)"
                  @change="fixedAssigneeChange"
                  @click="handleOpenUserSelect(false)"
                />
              </FormItem>
              <div v-if="formData.allocationType === AllocationTypeEnum.CANDIDATE">
                <FormItem label="候选人员">
                  <Badge :count="selectUserLength">
                    <a-button type="primary" size="small" @click="handleOpenUserSelect(true)"
                      >选择人员</a-button
                    >
                  </Badge>
                </FormItem>
                <FormItem label="候选组">
                  <Badge :count="selectRoleLength">
                    <a-button type="primary" size="small" @click="handleOpenRoleSelect"
                      >选择组</a-button
                    >
                  </Badge>
                </FormItem>
              </div>
              <FormItem
                v-if="
                  formData.allocationType === AllocationTypeEnum.SPECIFY && showConfig.specifyDesc
                "
              >
                <RadioGroup v-model:value="formData.specifyDesc" button-style="solid" size="small">
                  <RadioButton v-for="item in specifyDesc" :key="item.value" :value="item.value">{{
                    item.label
                  }}</RadioButton>
                </RadioGroup>
              </FormItem>
            </TabPane> -->
          </Tabs>
          <!--  -->
          <FormItem v-if="showConfig.dueDate" label="到期时间" name="dueDate">
            <DueDateInput
              :value="formData.dueDate"
              placeholder="选择到期时间"
              @change="dueDateChange"
          /></FormItem>
          <FormItem v-if="showConfig.priority" label="优先级" name="priority">
            <InputNumber
              v-model="formData.priority"
              placeholder="请输入"
              @change="priorityChange"
            />
          </FormItem>
        </CollapsePanel>
        <CollapsePanel key="3" header="多实例">
          <FormItem label="多实例类型">
            <Select
              v-model:value="formData.multiInstanceType"
              :options="multiInstanceTypeOptions"
              @change="multiInstanceTypeChange"
            />
          </FormItem>
          <!-- 详细设置 -->
          <div v-if="formData.multiInstanceType !== MultiInstanceTypeEnum.NONE">
            <FormItem
              label="集合"
              tooltip="属性会作为表达式进行解析。如果表达式解析为字符串而不是一个集合 
                不论是因为本身配置的就是静态字符串值，还是表达式计算结果为字符串
                这个字符串都会被当做变量名，并从流程变量中用于获取实际的集合。"
            >
              <Input
                v-model:value="formData.collection"
                placeholder="请输入"
                @change="collectionChange"
              />
            </FormItem>
            <FormItem
              label="元素变量"
              tooltip="每创建一个用户任务前，先以该元素变量为label，集合中的一项为value，
                        创建（局部）流程变量，该局部流程变量被用于指派用户任务。
                        一般来说，该字符串应与指定人员变量相同。"
            >
              <Input
                v-model:value="formData.elementVariable"
                placeholder="请输入"
                @change="elementVariableChange"
              />
            </FormItem>
            <FormItem
              label="完成条件"
              tooltip="多实例活动在所有实例都完成时结束，然而也可以指定一个表达式，在每个实例
                        结束时进行计算。当表达式计算为true时，将销毁所有剩余的实例，并结束多实例
                        活动，继续执行流程。例如 ${nrOfCompletedInstances/nrOfInstances >= 0.6 }，
                        表示当任务完成60%时，该节点就算完成"
            >
              <Input
                v-model:value="formData.completionCondition"
                placeholder="请输入"
                @change="completionConditionChange"
              />
            </FormItem>
          </div>
        </CollapsePanel>
        <CollapsePanel key="4" header="任务监听器">
          <TaskListener v-if="showConfig.taskListener" :element="element" />
        </CollapsePanel>
        <CollapsePanel key="5" header="执行监听器">
          <ExecutionListener v-if="showConfig.executionListener" :element="element" />
        </CollapsePanel>
      </Collapse>
    </Form>
    <!-- modal -->
    <!-- 用户选择 -->
    <UserSelectModal
      @register="registerUserSelectModal"
      @bpmn-single-done="onSingleUserSelectDone"
      @bpmn-multiple-done="onMultipleUserSelectDone"
    />
    <!-- 角色选择 -->
    <RoleSelectModal @register="registerRoleSelectModal" @select-done="onRoleSelectDone" />
  </div>
</template>

<script setup lang="ts">
  import {
    Collapse,
    FormItem,
    Input,
    Form,
    Switch,
    Tabs,
    Select,
    InputNumber,
    Badge,
  } from 'ant-design-vue';
  import {
    AllocationTypeEnum,
    MultiInstanceTypeEnum,
    SpecifyDescEnum,
  } from '@/components/BpmnDesign/enums';
  import { wfFormManageSelectList } from '@/api/workflow/formManage';
  import { computed, onBeforeMount, ref, toRaw } from 'vue';
  import usePanel from '../hooks/usePanel';
  import useParseElement from '../hooks/useParseElement';
  import type { ModdleElement } from 'bpmn';
  import type { TaskPanel } from 'bpmnDesign';
  import type { User } from '@/api/system/user/model';
  import RoleSelectModal from '@/components/BpmnDesign/components/RoleSelectModal.vue';
  import UserSelectModal from '@/views/workflow/components/UserSelectModal/index.vue';
  import { useModal } from '@/components/Modal';
  import TaskListener from './property/TaskListener.vue';
  import ExecutionListener from '@/components/BpmnDesign/panel/property/ExecutionListener.vue';
  import DueDateInput from '@/components/BpmnDesign/panel/property/DueDateInput.vue';

  const CollapsePanel = Collapse.Panel;
  const TabPane = Tabs.TabPane;

  const [registerRoleSelectModal, { openModal: openRoleSelectModal }] = useModal();
  // 用户选择
  const [registerUserSelectModal, { openModal: openUserSelectModal }] = useModal();

  function idWithType(id: string) {
    if (Number(id) > 2 ** 53) {
      return id;
    }
    return Number(id);
  }
  /**
   * 打开用户选择窗口
   * multiple 是否为多选
   */
  function handleOpenUserSelect(multiple: boolean) {
    if (multiple) {
      const userIds: (string | number)[] = [];
      if (formData.value.candidateUsers) {
        const ids = formData.value.candidateUsers.split(',');
        // 使用严格相等 必须转换成正确类型的id
        ids.forEach((id) => {
          const _id = idWithType(id);
          return userIds.push(_id);
        });
      }
      openUserSelectModal(true, { userIds, type: 'bpmnMultiple' });
    } else {
      console.log(formData.value.assignee);
      // undefined直接打开选择窗口
      if (!formData.value.assignee) {
        openUserSelectModal(true, { type: 'bpmnSingle' });
        return;
      }
      const id = formData.value.assignee;
      const _id = idWithType(id);
      openUserSelectModal(true, { type: 'bpmnSingle', userIds: [_id] });
    }
  }

  /**
   * user多选
   */
  function onMultipleUserSelectDone(userList: User[]) {
    console.log(userList);
    let extensionElements: any = getExtensionElements();
    extensionElements.values = extensionElements.values.filter(
      (item) => item.$type !== 'flowable:extCandidateUsers',
    );
    if (userList.length === 0) {
      formData.value.candidateUsers = undefined;
      updateProperties({ 'flowable:candidateUsers': undefined });
    } else {
      const userIds = userList.map((item) => item.userId).join(',');
      formData.value.candidateUsers = userIds;
      updateProperties({ 'flowable:candidateUsers': userIds });
      const extCandidateUsersElement: any = createModdleElement(
        'flowable:extCandidateUsers',
        { body: '' },
        extensionElements,
      );
      extensionElements.values.push(extCandidateUsersElement);
      const users = userList.map((item) => {
        return {
          userId: item.userId,
          userName: item.userName,
        };
      });
      extCandidateUsersElement.body = JSON.stringify(users);
    }
    if (extensionElements.values.length === 0) {
      extensionElements = undefined;
    }
    updateProperties({ extensionElements: extensionElements });
  }

  /**
   * user单选
   */
  function onSingleUserSelectDone(userlist: User[]) {
    console.log(userlist);
    const user: User | undefined = userlist.length !== 0 ? userlist[0] : undefined;
    updateProperties({ 'flowable:assignee': user?.userId });
    assignee.value = user ? user : ({ userName: '' } as any);
    formData.value.assignee = String(user?.userId);
    let extensionElements: any = getExtensionElements();
    extensionElements.values = extensionElements
      .get('values')
      .filter((item) => item.$type !== 'flowable:extAssignee');
    if (user) {
      const extAssigneeElement: any = createModdleElement(
        'flowable:extAssignee',
        { body: '' },
        extensionElements,
      );
      extensionElements.get('values').push(extAssigneeElement);
      extAssigneeElement.body = JSON.stringify({ userName: user.userName, userId: user.userId });
    }
    if (extensionElements.values.length === 0) {
      extensionElements = undefined;
    }
    updateProperties({ extensionElements: extensionElements });
  }

  /**
   * 角色选择
   */
  function handleOpenRoleSelect() {
    /** 这里id.join(',') */
    const roleIds = formData.value.candidateGroups || '';
    // 空字符串无法触发回调???
    openRoleSelectModal(true, { roleIds });
  }

  /**
   * 角色选择完毕
   */
  function onRoleSelectDone(roleIdList: string[]) {
    console.log(roleIdList);
    if (roleIdList.length === 0) {
      formData.value.candidateGroups = '';
      updateProperties({ 'flowable:candidateGroups': undefined });
    } else {
      const roleIds = roleIdList.join(',');
      formData.value.candidateGroups = roleIds;
      updateProperties({ 'flowable:candidateGroups': roleIds });
    }
  }

  interface PropType {
    element: ModdleElement;
  }
  const props = withDefaults(defineProps<PropType>(), {});
  const {
    showConfig,
    nameChange,
    idChange,
    updateProperties,
    getExtensionElements,
    createModdleElement,
    formKeyChange,
  } = usePanel({
    element: toRaw(props.element),
  });
  const { parseData } = useParseElement({
    element: toRaw(props.element),
  });

  const initFormData = {
    id: '',
    name: '',
    dueDate: '',
    multiInstanceType: MultiInstanceTypeEnum.NONE,
    allocationType: AllocationTypeEnum.USER,
    specifyDesc: SpecifyDescEnum.SPECIFY_SINGLE,
  };

  const formData = ref({ ...initFormData, ...parseData<TaskPanel>() });
  const assignee = ref<Partial<User>>({
    userName: '',
  });

  const formOptions = ref<any[]>([]);
  onBeforeMount(async () => {
    const ret = await wfFormManageSelectList();
    const options = ret.map((item) => ({
      label: item.formName + ' - ' + item.router,
      value: item.formType + ':' + item.id,
    }));
    formOptions.value = options;
  });

  /** 默认展开的面板 */
  const currentCollapseItem = ref(['1']);

  const multiInstanceTypeOptions = [
    { label: '无', value: MultiInstanceTypeEnum.NONE },
    {
      label: '串行(顺序收到审批)',
      value: MultiInstanceTypeEnum.SERIAL,
    },
    {
      label: '并行(同时收到审批)',
      value: MultiInstanceTypeEnum.PARALLEL,
    },
  ];

  const skipExpressionChange = (e: Event & { target: { value?: string | undefined } }) => {
    const value = e.target.value;
    updateProperties({
      'flowable:skipExpression': value && value.length > 0 ? value : undefined,
    });
  };

  const syncChange = (newVal: any) => {
    updateProperties({ 'flowable:async': newVal });
  };

  // 优先级
  const priorityChange = (newVal: string | number) => {
    updateProperties({ 'flowable:priority': newVal });
  };

  /**
   * 分配人员
   */
  const fixedAssigneeChange = (e: Event & { target: { value?: string | undefined } }) => {
    const newVal = e.target.value;
    updateProperties({ 'flowable:assignee': newVal && newVal.length > 0 ? newVal : undefined });
  };

  /**
   * 多实例类型
   * 回调参数为string
   */
  const multiInstanceTypeChange = (newVal: any) => {
    if (newVal !== MultiInstanceTypeEnum.NONE) {
      let loopCharacteristics: any = props.element.businessObject.get('loopCharacteristics');
      if (!loopCharacteristics) {
        loopCharacteristics = createModdleElement(
          'bpmn:MultiInstanceLoopCharacteristics',
          {},
          props.element.businessObject,
        );
      }
      loopCharacteristics.isSequential = newVal === MultiInstanceTypeEnum.SERIAL;
      updateProperties({ loopCharacteristics: loopCharacteristics });
    } else {
      updateProperties({ loopCharacteristics: undefined });
    }
  };

  /**
   * 多实例 - 集合
   */
  const collectionChange = (e: Event & { target: { value?: string | undefined } }) => {
    const value = e.target.value;
    let loopCharacteristics: any = props.element.businessObject.get('loopCharacteristics');
    if (!loopCharacteristics) {
      loopCharacteristics = createModdleElement(
        'bpmn:MultiInstanceLoopCharacteristics',
        {},
        props.element.businessObject,
      );
    }
    loopCharacteristics.collection = value && value.length > 0 ? value : undefined;
    updateProperties({ loopCharacteristics: loopCharacteristics });
  };

  /**
   * 元素变量
   */
  const elementVariableChange = (e: Event & { target: { value?: string | undefined } }) => {
    const value = e.target.value;
    let loopCharacteristics: any = props.element.businessObject.get('loopCharacteristics');
    if (!loopCharacteristics) {
      loopCharacteristics = createModdleElement(
        'bpmn:MultiInstanceLoopCharacteristics',
        {},
        props.element.businessObject,
      );
    }
    loopCharacteristics.elementVariable = value && value.length > 0 ? value : undefined;
    updateProperties({ loopCharacteristics: loopCharacteristics });
  };

  /**
   * 完成条件
   */
  const completionConditionChange = (e: Event & { target: { value?: string | undefined } }) => {
    let loopCharacteristics: any =
      props.element.businessObject.get<ModdleElement>('loopCharacteristics');
    if (!loopCharacteristics) {
      loopCharacteristics = createModdleElement(
        'bpmn:MultiInstanceLoopCharacteristics',
        {},
        props.element.businessObject,
      );
    }
    const newVal = e.target.value;
    if (newVal && newVal.length > 0) {
      if (!loopCharacteristics.completionCondition) {
        loopCharacteristics.completionCondition = createModdleElement(
          'bpmn:Expression',
          { body: newVal },
          loopCharacteristics,
        );
      } else {
        loopCharacteristics.completionCondition.body = newVal;
      }
    } else {
      loopCharacteristics.completionCondition = undefined;
    }
    updateProperties({ loopCharacteristics: loopCharacteristics });
  };

  /**
   *
   * 到期时间
   */
  const dueDateChange = (e: Event & { target: { value?: string | undefined } }) => {
    const newVal = e.target.value;
    updateProperties({ 'flowable:dueDate': newVal && newVal.length > 0 ? newVal : undefined });
  };

  const selectUserLength = computed(() => {
    if (formData.value.candidateUsers) {
      return formData.value.candidateUsers.split(',').length;
    } else {
      return 0;
    }
  });
  const selectRoleLength = computed(() => {
    if (formData.value.candidateGroups) {
      return formData.value.candidateGroups.split(',').length;
    } else {
      return 0;
    }
  });

  onBeforeMount(() => {
    const extensionElements = getExtensionElements(false);
    if (extensionElements && extensionElements.get('values')) {
      let extAssigneeElement: any = extensionElements
        .get<any[]>('values')
        .find((item) => item.$type === 'flowable:extAssignee');
      if (extAssigneeElement) {
        assignee.value = JSON.parse(extAssigneeElement.body);
      }
    }

    if (formData.value.loopCharacteristics) {
      const loopCharacteristics = formData.value.loopCharacteristics;
      formData.value.collection = loopCharacteristics.collection || '';
      formData.value.elementVariable = loopCharacteristics.elementVariable || '';
      formData.value.completionCondition = loopCharacteristics.completionCondition?.body || '';
      formData.value.multiInstanceType = loopCharacteristics.isSequential
        ? MultiInstanceTypeEnum.SERIAL
        : MultiInstanceTypeEnum.PARALLEL;
    }

    if (formData.value.assignee) {
      formData.value.fixedAssignee = formData.value.assignee;
    }
  });
</script>

<style scoped></style>
