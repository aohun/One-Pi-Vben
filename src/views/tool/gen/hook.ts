import { useLocalStorage } from '@vueuse/core';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { onMounted } from 'vue';

export function useGenTipHook() {
  const readTip = useLocalStorage('__read_how_to_gen', false);

  onMounted(() => {
    /** 引导 */
    if (readTip.value) {
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
            element: '#how-to-edit',
            popover: { title: '提示', description: '(1)如何生成写在这了!', ...defaultProps },
          },
          {
            element: '#how-to-edit',
            popover: { title: '提示', description: '(2)如何生成写在这了!', ...defaultProps },
          },
          {
            element: '#how-to-edit',
            popover: {
              title: '提示',
              description: '(3)如何生成写在这了!',
              ...defaultProps,
              nextBtnText: '知道了',
            },
          },
        ],
        onDestroyed: () => {
          readTip.value = true;
        },
      });
      showDriver.drive();
    }, 1000);
  });
}
