<template>
  <div :class="prefixCls" :style="{ width: containerWidth }">
    <ImgUpload
      :fullscreen="fullscreen"
      @uploading="handleImageUploading"
      @done="handleDone"
      v-if="showImageUpload"
      v-show="editorRef"
      :disabled="disabled"
    />
    <Editor
      :init="initOptions"
      :tinymceScriptSrc="tinymceScriptSrc"
      v-model="modelValue"
      :style="{ visibility: 'hidden' }"
      v-if="!initOptions.inline && changeTheme"
    />
    <slot v-else></slot>
  </div>
</template>

<script lang="ts" setup>
  import type { Editor as EditorType } from 'tinymce/tinymce';
  import { IPropTypes } from '@tinymce/tinymce-vue/lib/cjs/main/ts/components/EditorPropTypes';
  import Editor from '@tinymce/tinymce-vue';

  import {
    computed,
    nextTick,
    ref,
    unref,
    watch,
    onDeactivated,
    onBeforeUnmount,
    PropType,
    useAttrs,
  } from 'vue';
  import ImgUpload from './ImgUpload.vue';
  import { plugins as defaultPlugins, toolbar as defaultToolbar } from './tinymce';
  import { buildShortUUID } from '@/utils/uuid';
  import { bindHandlers } from './helper';
  import { onMountedOrActivated } from '@vben/hooks';
  import { useDesign } from '@/hooks/web/useDesign';
  import { isNumber } from '@/utils/is';
  import { useLocale } from '@/locales/useLocale';
  import { useAppStore } from '@/store/modules/app';
  import { uploadApi } from '@/api/upload';

  defineOptions({ name: 'Tinymce', inheritAttrs: false });

  type InitOptions = IPropTypes['init'];

  const props = defineProps({
    options: {
      type: Object as PropType<Partial<InitOptions>>,
      default: () => ({}),
    },
    value: {
      type: String,
    },

    toolbar: {
      type: String,
      default: defaultToolbar,
    },
    plugins: {
      type: String,
      default: defaultPlugins,
    },
    height: {
      type: [Number, String] as PropType<string | number>,
      required: false,
      default: 400,
    },
    width: {
      type: [Number, String] as PropType<string | number>,
      required: false,
      default: 'auto',
    },
    showImageUpload: {
      type: Boolean,
      default: true,
    },
  });

  const modelValue = defineModel('modelValue', { type: String, default: '' });
  /**
   * https://www.jianshu.com/p/59a9c3802443
   * 使用自托管方案（本地）代替cdn  没有key的限制
   * 注意publicPath要以/结尾
   */
  const tinymceScriptSrc = import.meta.env.VITE_PUBLIC_PATH + 'tinymce/tinymce.min.js';

  const emit = defineEmits(['change']);

  const attrs = useAttrs();
  const editorRef = ref<EditorType>();
  const fullscreen = ref(false);
  const tinymceId = ref<string>(buildShortUUID('tiny-vue'));
  const elRef = ref<HTMLElement | null>(null);

  const { prefixCls } = useDesign('tinymce-container');

  const appStore = useAppStore();

  const containerWidth = computed(() => {
    const width = props.width;
    if (isNumber(width)) {
      return `${width}px`;
    }
    return width;
  });

  const skinName = computed(() => {
    return appStore.getDarkMode === 'light' ? 'oxide' : 'oxide-dark';
  });

  const contentCss = computed(() => {
    return appStore.getDarkMode === 'light' ? 'default' : 'dark';
  });

  /**
   * 通过v-if来挂载/卸载组件 来完成主题切换
   */
  const changeTheme = ref(true);
  watch(
    () => appStore.getDarkMode,
    () => {
      if (!editorRef.value) {
        return;
      }
      destroy();
      changeTheme.value = false;
      // 放在下一次tick来切换
      nextTick(() => {
        changeTheme.value = true;
      });
    },
  );

  const langName = computed(() => {
    const lang = useLocale().getLocale.value;
    return ['zh_CN', 'en'].includes(lang) ? lang : 'zh_CN';
  });

  const initOptions = computed((): InitOptions => {
    const { height, options, toolbar, plugins } = props;
    return {
      height,
      toolbar,
      plugins,
      menubar: 'file edit view insert format tools table help',
      contextmenu: 'link image table',
      image_caption: true,
      image_advtab: true, // 图片高级选项
      importcss_append: true,
      quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
      noneditable_class: 'mceNonEditable',
      toolbar_mode: 'sliding',
      license_key: 'gpl',
      /**
       * 允许粘贴图片 默认base64格式
       * images_upload_handler启用时为上传
       */
      paste_data_images: true,
      language: langName.value,
      branding: false, // 显示右下角的'使用 TinyMCE 构建'
      default_link_target: '_blank',
      link_title: false,
      auto_focus: true,
      skin: skinName.value,
      content_css: contentCss.value,
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
      /**
       * 覆盖默认的base64行为
       * @param blobInfo
       * 大坑 不要调用这两个函数  success failure:
       * 使用resolve/reject代替
       */
      images_upload_handler: (blobInfo) => {
        return new Promise((resolve, reject) => {
          const file = blobInfo.blob();
          const filename = blobInfo.filename();
          uploadApi({ file, filename })
            .then(({ url }) => {
              console.log('tinymce上传图片: ', url);
              resolve(url);
            })
            .catch((e) => {
              console.error('tinymce上传图片失败: ', e);
              reject(e.message);
            });
        });
      },
      ...options,
      setup: (editor) => {
        editorRef.value = editor;
        editor.on('init', (e) => initSetup(e));
      },
    };
  });

  const disabled = computed(() => {
    const { options } = props;
    const getDisabled = options && Reflect.get(options, 'readonly');
    const editor = unref(editorRef);
    if (editor) {
      editor.mode.set(getDisabled ? 'readonly' : 'design');
    }
    return getDisabled ?? false;
  });

  watch(
    () => attrs.disabled,
    () => {
      const editor = unref(editorRef);
      if (!editor) {
        return;
      }
      editor.mode.set(attrs.disabled ? 'readonly' : 'design');
    },
  );

  onMountedOrActivated(() => {
    if (!initOptions.value.inline) {
      tinymceId.value = buildShortUUID('tiny-vue');
    }
    nextTick(() => {
      setTimeout(() => {
        initEditor();
      }, 30);
    });
  });

  onBeforeUnmount(() => {
    destroy();
  });

  onDeactivated(() => {
    destroy();
  });

  function destroy() {
    const editor = unref(editorRef);
    editor?.destroy();
  }

  function initEditor() {
    const el = unref(elRef);
    if (el) {
      el.style.visibility = '';
    }
  }

  function initSetup(e) {
    const editor = unref(editorRef);
    if (!editor) {
      return;
    }
    const value = modelValue.value || '';

    editor.setContent(value);
    bindModelHandlers(editor);
    bindHandlers(e, attrs, unref(editorRef));
  }

  function setValue(editor: Record<string, any>, val?: string, prevVal?: string) {
    if (
      editor &&
      typeof val === 'string' &&
      val !== prevVal &&
      val !== editor.getContent({ format: attrs.outputFormat })
    ) {
      editor.setContent(val);
    }
  }

  function bindModelHandlers(editor: any) {
    const modelEvents = attrs.modelEvents ? attrs.modelEvents : null;
    const normalizedEvents = Array.isArray(modelEvents) ? modelEvents.join(' ') : modelEvents;

    watch(
      () => modelValue.value,
      (val, prevVal) => {
        setValue(editor, val, prevVal);
      },
    );

    watch(
      () => props.value,
      (val, prevVal) => {
        setValue(editor, val, prevVal);
      },
      {
        immediate: true,
      },
    );

    editor.on(normalizedEvents ? normalizedEvents : 'change keyup undo redo', () => {
      const content = editor.getContent({ format: attrs.outputFormat });
      emit('change', content);
    });

    editor.on('FullscreenStateChanged', (e) => {
      fullscreen.value = e.state;
    });
  }

  function handleImageUploading(name: string) {
    const editor = unref(editorRef);
    if (!editor) {
      return;
    }
    editor.execCommand('mceInsertContent', false, getUploadingImgName(name));
    const content = editor?.getContent() ?? '';
    setValue(editor, content);
  }

  function handleDone(name: string, url: string) {
    const editor = unref(editorRef);
    if (!editor) {
      return;
    }
    const content = editor?.getContent() ?? '';
    const val = content?.replace(getUploadingImgName(name), `<img src="${url}"/>`) ?? '';
    setValue(editor, val);
  }

  function getUploadingImgName(name: string) {
    return `[uploading:${name}]`;
  }
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-tinymce-container';

  .@{prefix-cls} {
    position: relative;
    line-height: normal;

    textarea {
      visibility: hidden;
      z-index: -1;
    }
  }

  /**
  隐藏upgrade按钮 跟图片上传冲突
  */
  .tox-promotion {
    display: none !important;
  }
</style>
