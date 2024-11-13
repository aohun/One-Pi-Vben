import { useLocalStorage } from '@vueuse/core';
import { driver } from 'driver.js';
import { onMounted } from 'vue';
import 'driver.js/dist/driver.css';

export function useMenuTipHook() {
  const readMenuTip = useLocalStorage('readMenuTip', false);

  onMounted(() => {
    /** 引导 */
    if (readMenuTip.value) {
      return;
    }
    setTimeout(() => {
      const defaultProps = {
        nextBtnText: '下一步',
        prevBtnText: '上一步',
      };
      const showDriver = driver({
        showProgress: true,
        allowClose: false,
        steps: [
          {
            element: '#refreshMenu',
            popover: {
              title: '提示',
              description: '点这里可控制是否刷新, 知道了否?',
              ...defaultProps,
            },
          },
          {
            element: '.ant-table-body',
            popover: {
              title: '提示',
              description: '双击表格行可展开/折叠, 知道了否?',
              ...defaultProps,
              nextBtnText: '知道了',
            },
          },
        ],
        onDestroyed() {
          readMenuTip.value = true;
        },
      });
      showDriver.drive();
    }, 1000);
  });
}
