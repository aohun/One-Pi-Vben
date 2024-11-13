import { Menu } from '@/api/system/menu/model';
import { isUrl } from '@/utils/is';
import { Tag } from 'ant-design-vue';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'TreeItem',
  props: {
    data: {
      type: Object as PropType<Menu>,
      required: true,
    },
  },
  setup(props) {
    interface TagProp {
      color: string;
      text: string;
    }

    const menuTagProp = computed<TagProp>(() => {
      if (isUrl(props.data.path)) {
        return { text: '外链', color: 'pink' };
      }
      const type = props.data.menuType;
      if (type === 'M') return { text: '目录', color: 'green' };
      if (type === 'C') return { text: '菜单', color: 'blue' };
      if (type === 'F') return { text: '按钮', color: '' };
      return { text: '未知', color: 'error' };
    });

    return () => (
      <div class="flex gap-6px">
        <span>{props.data.menuName}</span>
        <Tag color={menuTagProp.value.color}>{menuTagProp.value.text}</Tag>
      </div>
    );
  },
});
