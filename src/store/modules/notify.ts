import { defineStore } from 'pinia';
import { store } from '@/store';
import { useGlobSetting } from '@/hooks/setting';
import { useWebSocket, useEventSource } from '@vueuse/core';
import { getToken } from '@/utils/auth';
import { tabListData, TabItem } from '@/layouts/default/header/components/notify/data';
import { useUserStoreWithOut } from '@/store/modules/user';
import dayjs from 'dayjs';
import { isUrl } from '@/utils/is';
import { useMessage } from '@/hooks/web/useMessage';
import { watch } from 'vue';

interface NotifyState {
  listData: TabItem[];
}

const { notification } = useMessage();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function listenWithWebSocket(listData: TabItem[]) {
  // 从配置文件获取的为String类型
  const { websocketEnable } = useGlobSetting();
  if (!websocketEnable) {
    console.log('当前未开启websocket.');
    return;
  }
  const { apiUrl, clientId } = useGlobSetting();
  let apiUrlStr = String(apiUrl);
  /**
   * 这里可能有两种情况 兼容dev模式的proxy或者prod模式但是没有用全路径比如http://xxx/xxx
   * 1. apiUrl为https://xxx.com/xxx
   * 2. apiUrl为/xxx
   * 转换后为http链接形式
   */
  if (!isUrl(apiUrl)) {
    // 协议+域名
    apiUrlStr = `${window.location.protocol}//${window.location.host}${apiUrl}`;
  }
  // 这里是http链接形式
  let websocketAddr = `${apiUrlStr}/resource/websocket?clientid=${clientId}&Authorization=Bearer ${getToken()}`;
  // http/https处理
  if (window.location.protocol.includes('https')) {
    websocketAddr = websocketAddr.replace('https://', 'wss://');
  } else {
    websocketAddr = websocketAddr.replace('http://', 'ws://');
  }
  // console.log('websocketUrl: ' + websocketAddr);

  /**
   * 功能太强大了 自动重连  自动发送心跳  连退出登录自动断开都做了
   */
  useWebSocket(websocketAddr, {
    autoReconnect: {
      // 重连最大次数
      retries: 3,
      // 重连间隔
      delay: 1000,
      onFailed() {
        console.log('websocket重连失败.');
      },
    },
    heartbeat: {
      message: JSON.stringify({ type: 'ping' }),
      // 发送心跳的间隔
      interval: 10000,
      // 接收到心跳response的超时时间
      pongTimeout: 2000,
    },
    onConnected() {
      console.log('websocket已经连接');
    },
    onDisconnected() {
      console.log('websocket已经断开');
    },
    onMessage: (_, message) => {
      console.log('接收到消息: ' + message.data);
      // 需要id不同 否则list foreach会有bug
      const id = 'notify-' + listData[0].list.length;
      // 获取uid
      const uid = useUserStoreWithOut().userInfo?.userId || 0;
      // 添加到通知就是第一个index
      listData[0].list.unshift({
        id,
        uid,
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
        title: message.data,
        description: '',
        datetime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        type: '1',
      });

      notification.info({
        message: '收到新消息',
        description: message.data,
        duration: 3,
      });
    },
  });
}

function listenWithSSE(listData: TabItem[]) {
  const { apiUrl, clientId } = useGlobSetting();
  const sseAddr = `${apiUrl}/resource/sse?clientid=${clientId}&Authorization=Bearer ${getToken()}`;

  const { data } = useEventSource(sseAddr, [], {
    autoReconnect: {
      retries: 3,
      delay: 1000,
      onFailed() {
        console.log('sse重连失败.');
      },
    },
  });

  watch(data, (message) => {
    if (!message) return;

    console.log('接收到消息: ' + message);
    // 需要id不同 否则list foreach会有bug
    const id = 'notify-' + listData[0].list.length;
    // 获取uid
    const uid = useUserStoreWithOut().userInfo?.userId || 0;
    // 添加到通知就是第一个index
    listData[0].list.unshift({
      id,
      uid,
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
      title: message,
      description: '',
      datetime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      type: '1',
    });

    notification.info({
      message: '收到新消息',
      description: message,
      duration: 3,
    });

    data.value = null;
  });
}

export const useNotifyStore = defineStore('notify', {
  state: (): NotifyState => ({
    listData: tabListData,
  }),
  getters: {
    // 当前用户所有消息的数量
    count(state) {
      const userStore = useUserStoreWithOut();
      const uid = userStore.userInfo?.userId || 0;
      let count = 0;
      for (let i = 0; i < state.listData.length; i++) {
        count += state.listData[i].list.filter((item) => item.uid === uid).length;
      }
      return count;
    },
    // 当前用户所有未读消息数量
    unreadCount(state) {
      const userStore = useUserStoreWithOut();
      const uid = userStore.userInfo?.userId || 0;
      let count = 0;
      for (let i = 0; i < state.listData.length; i++) {
        // 这里显示消息数量 使用删除线作为条件
        // 只显示当前用户的消息
        count += state.listData[i].list.filter(
          (item) => item.uid === uid && !item.titleDelete,
        ).length;
      }
      return count;
    },
    // 所有消息 根据uid显示
    userMessageList(state): TabItem[] {
      const userStore = useUserStoreWithOut();
      const uid = userStore.userInfo?.userId || 0;
      return state.listData.map((item) => {
        return {
          ...item,
          list: item.list.filter((item) => item.uid === uid),
        };
      });
    },
  },
  actions: {
    listeningMessage() {
      // listenWithWebSocket(this.listData);
      listenWithSSE(this.listData);
    },
    clearAll() {
      const userStore = useUserStoreWithOut();
      const uid = userStore.userInfo?.userId || 0;
      /**
       * 去掉当前用户的所有消息
       */
      this.listData = this.listData.map((item) => {
        return {
          ...item,
          list: item.list.filter((node) => node.uid !== uid),
        };
      });
    },
    readAll() {
      const userStore = useUserStoreWithOut();
      const uid = userStore.userInfo?.userId || 0;
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i].list.forEach((item) => {
          if (item.uid === uid) {
            item.read = true;
            item.titleDelete = true;
          }
        });
      }
    },
  },
  persist: true,
});

export function useNotifyStoreWithOut() {
  return useNotifyStore(store);
}
