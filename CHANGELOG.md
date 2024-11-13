# 1.4.5

**Refactor**

使用其他方案重构`路由参数`的处理

**Fix**

超级管理员切换租户后 字典丢失并且不会重新加载

部门树超过屏幕高度后无法滚动 -> 设置固定高度

用户管理 更新时岗位选择option无法正常显示

**Feature**

某些人不按规范使用也从不看控制台导致的页面白屏 增加提示信息

增加菜单名称i18n功能

**Other**

升级ant-design-vue至最新版本(v4.2.5)

用户管理 优化岗位选择placeholder

# 1.4.4

**Feature**

SSE(Server-Sent Events) 推送功能 替代websocket

菜单管理 路由参数

客户端管理 秘钥生成

**Fix**

菜单管理 路由参数无法保存 queryParam -> params

部门管理 deptCategory参数

超级管理员租户切换 清除字典缓存

ImageUpload ossId被错误转为Number造成精度丢失

字典数据 切换Select&查询 会两次请求接口(watch)

**Other**

锁定 & 升级依赖到latest版本(vben5组件ready后准备归档)

路由为一级菜单时 添加redirect跳转到第一个子菜单 解决白屏

代码结构优化

# 1.4.3

**Fix**

由于sass自动升级导致启动时控制台warning

(需删除node_modules重新安装依赖)

# 1.4.2

**Refactor**

主题色直接从`appStore`获取

**Bug Fixed**

代码生成 上级菜单选择无效

代码生成 菜单select回显需要严格(类型)相等

# 1.4.1

**Feature**

TinyMCE改为自托管(本地)模式, 解决需要使用key的问题

特别鸣谢: https://www.jianshu.com/p/59a9c3802443 的方案

**其他**

# 1.4.0

**Feature**

后台返回的路由动态生成组件name 解决`组件缓存需要和后端路由name一致`问题

~~全局`ConfigProvider`添加`getPopupContainer` 默认挂载在父节点上 防止滚动/拖动产生的不跟随问题 (默认挂载为body)~~

```
该功能有大量问题 包括setting-drawer字体颜色在夜间模式不会改变 及一些组件的z-index异常
```

完善`代码生成`功能 😅

富文本编辑器: 新增依赖: @tinymce/tinymce-vue 升级tinymce至最新版本(v7)

富文本编辑器: 使用上传后的url替代默认的base64内联

**Fix**

代码生成模板 id为非必填项

# 1.3.5

**Feature**

新增导出功能(带查询参数)

duplicateRoutesChecker 路由name重复检查器

**Refactor**

重构用户选择`UserSelect`组件, 不用在父页面多次引入, 增加对应type的emit即可

**Bug Fixed**

**其他**

修改全局名称为`Ruoyi Plus` -> `Plus Admin`

eslint/typescript扫描 修复全局报错 现在不会有任何报错(vscode)

因Vxe-Table 4.7版本类型定义与4.6不同 回滚为4.6版本

导出取消`PopConfirmButton`二次确认 改为`Button`

更新`update_icon.sql`文件

# 1.3.4

**Refactor**

合并最新vben Upload组件 添加demo

根据后端重构oauth相关功能

**Bug Fixed**

**其他**

通知提醒的分页样式

修复 [vue-router 4.3.2 -> 4.3.3](https://github.com/vuejs/router/compare/v4.3.2...v4.3.3#diff-bd14e588139087e2c8f184c61b6978ffb473a2d63261ce07b19c8ffd9882d955R551) warn `permissionGuard.ts:82 [Vue Router warn]: Finding ancestor route "/:path(.*)*" failed for "/:path(.*)*"`

Vxe-Table 升级 4.7.25 需要重新`pnpm install`

# 1.3.3

**Refactor**

`TableSwitch`组件去除二次确认Modal, 可直接切换

**Bug Fixed**

流程设计器 单选 在id为undefined下打开窗口会错误赋值id-0

**其他**

锁定vxe-table版本号 "vxe-table": "~4.6.3", 防止版本冲突

# 1.3.2

**Bug Fixed**

强制指定vite-config模块的postcss版本 解决高版本unocss报错问题(unocss版本暂时锁死0.60.4)

修复消息通知点击通知一直弹窗不会关闭的问题

# 1.3.1

**Feature**

系统主题切换功能(重磅登场!)

**Bug Fixed**

暂时降级@Unocss到0.58.9版本 更高版本报错无法运行

# 1.3.0

合并最新vben依赖

**Feature**

加签/减签功能

# 1.2.0(大版本更新)

**Bug Fixed**

当存在`菜单根目录为菜单`形式(比如演示站的微信群) & login?redirect=%252F(即/) 会错误调转到`对应的第一个根目录菜单的页面`(空页面) 解决: 判断为/跳转到首页

官方的element使用ParentView来处理二级菜单 使用ParentView的菜单不应被添加到路由(添加到侧边菜单就够了)

ps: 相同name的路由 后一个会覆盖前一个(https://www.cnblogs.com/mochenxiya/p/16732793.html)

OSS 图片拓展名大写无法预览 -> toLowerCase()比较

代码生成 编辑 下拉框组件在展开状态下滚动不会跟随 -> 官方方案: [注意，如果发现下拉菜单跟随页面滚动，或者需要在其他弹层中触发 Select，请尝试使用 getPopupContainer={triggerNode => triggerNode.parentNode} 将下拉弹层渲染节点固定在触发器的父元素中。](https://www.antdv.com/components/select-cn#api)

**Refactor**

主题色(primaryColor)由`#0960bd`修改为`#1677FF`[AntDesign品牌色](https://ant-design.antgroup.com/docs/spec/colors-cn#%E4%BA%A7%E5%93%81%E7%BA%A7%E8%89%B2%E5%BD%A9%E4%BD%93%E7%B3%BB)

使用Ant Design推荐的设计规范 将表格按钮从title栏(左边)移动到toolbar(右边)

详见:

- [有很多按钮组，如何确定顺序](https://ant-design.antgroup.com/docs/spec/buttons-cn#%E6%9C%89%E5%BE%88%E5%A4%9A%E6%8C%89%E9%92%AE%E7%BB%84%E5%A6%82%E4%BD%95%E7%A1%AE%E5%AE%9A%E9%A1%BA%E5%BA%8F)
- [按钮区](https://ant-design.antgroup.com/docs/spec/buttons-cn#%E6%8C%89%E9%92%AE%E5%8C%BA)

修改部分按钮颜色(比如导出)改为次要按钮

部分需要二次确认的操作(删除) 由modal改为popConfirm

- [覆盖层](https://ant-design.antgroup.com/docs/spec/stay-cn#%E8%A6%86%E7%9B%96%E5%B1%82)

代码生成-编辑 Table编辑组件改为`VxeTable` 性能对比原来的`AntTable`性能大幅提升

BasicTable 使用`reload`代替`reloadWithCallback` 官方已经修复modal会有关闭两次动画问题

**Feature**

`VITE_GLOB_ENABLE_ENCRYPT`全局请求加解密开关

适配官方workflow版本(预览版)

TableAction的dropdown按钮支持绑定按钮样式

代码生成-代码预览 支持根据文件的不同类型切换不同的预览显示

BasicTable reload添加`doNotClearSelectRows`参数 默认reload会清空当前表格所有选中行

租户管理 `未添加任何租户套餐时`不允许打开`新增租户抽屉`并弹出提示(所有东西填完了发现没法选择租户套餐所以也没办法提交😅)

**其他**

客户端管理 id为1(默认PC客户端)不可进行禁用

Oss配置 新增添加提示信息

默认登录页 登录中disabled第三方登录

上传文件/头像上传 超时时间设置为30s

**依赖更新**

npm依赖升级至目前最新

新增依赖 bpmn-js bpmn-js-token-simulation diagram-js diagram-js-minimap didi tiny-svg

| 依赖                     | 功能                  |
| ------------------------ | --------------------- |
| bpmn-js                  | bpmn核心依赖          |
| diagram-js               | 创建/管理bpmn图形界面 |
| bpmn-js-token-simulation | 流程图执行模拟        |
| diagram-js-minimap       | 流程图小地图          |
| didi                     | 依赖注入              |
| tiny-svg                 | svg依赖               |

# 1.1.10

租户套餐 增加预览菜单功能

去除表格上部表单 重置/搜索的前置图标

默认DictTag的primary色由`blue`改为`primary`

字典标签重构 支持`自定义颜色`+`css属性(前置/后置小点效果)`

unocss支持iconify图标 不用再导入Icon组件

- 即`<div class="i-material-symbols-light:13mp-outline-sharp"></div>`写法

~~用户管理 新增/修改 部门选择改为`级联选择器`组件~~ (由于修改了岗位和部门联动逻辑, 恢复成下拉)

# 1.1.9

**Bug Fixed**

当存在`菜单根目录为菜单`形式(比如演示站的微信群) & login?redirect=%252F(即/) 会错误调转到`对应的第一个根目录菜单的页面`(空页面) 解决: 判断为/跳转到首页

官方的element使用ParentView来处理二级菜单 使用ParentView的菜单不应被添加到路由(添加到侧边菜单就够了)

ps: 相同name的路由 后一个会覆盖前一个(https://www.cnblogs.com/mochenxiya/p/16732793.html)

**Refactor**

主题色(primaryColor)由`#0960bd`修改为`#1677FF`[AntDesign品牌色](https://ant-design.antgroup.com/docs/spec/colors-cn#%E4%BA%A7%E5%93%81%E7%BA%A7%E8%89%B2%E5%BD%A9%E4%BD%93%E7%B3%BB)

使用Ant Design推荐的设计规范 将表格按钮从title栏(左边)移动到toolbar(右边)

详见:

- [有很多按钮组，如何确定顺序](https://ant-design.antgroup.com/docs/spec/buttons-cn#%E6%9C%89%E5%BE%88%E5%A4%9A%E6%8C%89%E9%92%AE%E7%BB%84%E5%A6%82%E4%BD%95%E7%A1%AE%E5%AE%9A%E9%A1%BA%E5%BA%8F)
- [按钮区](https://ant-design.antgroup.com/docs/spec/buttons-cn#%E6%8C%89%E9%92%AE%E5%8C%BA)

修改部分按钮颜色(比如导出)改为次要按钮

部分需要二次确认的操作(删除) 由modal改为popConfirm

- [覆盖层](https://ant-design.antgroup.com/docs/spec/stay-cn#%E8%A6%86%E7%9B%96%E5%B1%82)

代码生成-编辑 Table编辑组件改为`VxeTable` 性能对比原来的`AntTable`性能大幅提升

BasicTable 使用`reload`代替`reloadWithCallback` 官方已经修复modal会有关闭两次动画问题

**Feature**

`VITE_GLOB_ENABLE_ENCRYPT`全局请求加解密开关

TableAction的dropdown按钮支持绑定按钮样式

代码生成-代码预览 支持根据文件的不同类型切换不同的预览显示

BasicTable reload添加`doNotClearSelectRows`参数 默认reload会清空当前表格所有选中行

租户管理 `未添加任何租户套餐时`不允许打开`新增租户抽屉`并弹出提示(所有东西填完了发现没法选择租户套餐所以也没办法提交)

**其他**

客户端管理 id为1(默认PC客户端)不可进行禁用

Oss配置 新增添加提示信息

默认登录页 登录中disabled第三方登录

**依赖更新**

npm依赖升级至目前最新

# 1.1.8

**Bug Fixed**

使用filter方法替代findNodeAll(用于排除节点) (findNodeAll由于children拼写错误导致运行成功--!)

用户管理 用户导入 下载模板modal添加z-index(设置过小会有bug) 否则下载模板时会遮挡loading效果

角色管理 分配角色 导入由modal改为抽屉 修复表格翻页会重置勾选状态

**Refactor**

逻辑更新 去除websocket相关**VITE_GLOB_WEBSOCKET_URL** 兼容apiUrl为http链接/非链接形式 即使用http://aaa.com/bbb或/bbb都行

**Feature**

登录重定向 即登录页login?redirect=重定向地址(即1.1.6有bug被移除 vben官方已经修复)

- 在登录超时/踢下线/修改角色下线(即403)等一些会携带redirect /login?redirect=xxx地址
- 如果是正常登出则不带redirect /login
- redirect如果是不存在的地址(手动地址栏输入/更改角色权限导致菜单不存在)则跳转到默认首页

增加`手机号登录`的支持

**其他**

oss的图片预览组件TableImg改为异步导入 解决table加载时间过长(loading会在图片加载完成结束 改为异步则不会有限制)

大量的拼写错误(还是建议安装一个拼写检查工具 vscode没有自带 --!)

去除接口前缀相关**VITE_GLOB_API_URL_PREFIX** 直接拼接在**VITE_GLOB_API_URL**即可

# 1.1.7

**Bug Fixed**

租户套餐 在未操作菜单情况下(比如直接点确定/改备注后点确定) transformIdStr函数转number导致丢失精度 -> id直接用string

src/router/guard/permissionGuard.ts 外链不能被添加到路由(漏了)

**Feature**

租户套餐 隐藏租户相关菜单 只有superadmin可以操作 分配了也没法用

角色管理 隐藏租户相关菜单 只有superadmin可以操作 分配了也没法用

角色管理 小管理员(admin)不可操作(防止误操作把自己权限玩没)

**其他**

登录 有验证码和无验证码时input宽度(404-400px)统一 原版本在有验证码情况下input宽度太长了

用户管理 部门树选择 ->改为/

菜单管理 菜单树选择 ->改为/

部门管理 部门树选择 ->改为/

用户管理 左侧部门树增加图标

角色管理 仅超级管理员可修改小管理员菜单

# 1.1.6-fix

~~登录重定向 即登录页login?redirect=重定向地址~~ **功能有严重BUG 回滚版本**

# 1.1.6

**Bug Fixed**

修复同一个字典多次请求api(页面/modal/drawer会加载三次), 现在只会请求一次

角色管理 分配用户 Number(roleId)导致精度丢失 -> 改为string

/@/ => @/(新版vben已不支持/@/路径)

pinia-plugin-persistedstate插件无法持久化(key的问题)

**Feature**

登录页面 租户和验证码都加载完成登录按钮才可用(enable)

**有严重BUG 于1.1.6-fix版本删除** ~~登录重定向 即登录页login?redirect=重定向地址~~

- ~~在登录超时/踢下线/修改角色下线(即403)等一些会携带redirect~~
- ~~如果是正常登出则不带redirect~~
- ~~redirect如果是不存在的地址则跳转到默认首页~~

**其他**

控制台warning: [DOM] Found 2 elements with non-unique id #form_item_configKey: (More info: https://goo.gl/9p2vKq) 主要是由于id冲突(即搜索和更新用的同一个id) 表单添加上name参数即可

改了一些代码(oxlint warning) 主要是代码风格

# 1.1.5

**Bug Fixed**

无

**Feature**

无

**其他**

用户管理 默认头像

userStore 默认头像

操作日志 添加id

客户端管理 pc不允许禁用(编辑里仍然可以修改)

消息通知 style

# 1.1.4

**Bug Fixed**

夜间模式通过刷新加载会有短暂白屏问题

回滚部门管理代码 逻辑有问题 --!

**Feature**

用户管理 部门树skeleton加载

**其他**

用户管理 用户信息modal使用skeleton加载

oss配置 v-auth

代码生成 v-auth

# 1.1.3

**Bug Fixed**

无

**Feature**

用户管理 用户信息预览

添加使用modal/drawer页面打开时的loading

代码生成 - 代码预览样式优化

代码生成 - 树表

**其他**

个人中心 绑定item间距

# 1.1.2

**Bug Fixed**

通知公告 - 删除(变量写错了导致无法删除)

**Feature**

通知公告 - 预览

富文本编辑器(TinyMce)支持图片大小修改(右键修改)

富文本编辑器(TinyMce)支持图片粘贴 (base64格式非上传)

**大部分组件新增抽屉 极少数表单只有几行的没加**

部门管理 切换上级部门时 对应的负责人列表也会变化

登录日志 根据浏览器/系统名称显示对应图标

在线用户 根据浏览器/系统名称显示对应图标

**其他**

手机端不显示租户切换(有遮挡)

租户下拉框样式优化

- 用户管理-用户导入 样式更新
- 用户管理-密码修改 样式更新
- 操作日志 添加'部门'

**大部分页面支持移动端(聊胜于无)**

# 1.1.1

**Bug Fixed**

(样式)按钮点击后任然有焦点

(样式)TableSetting居中

**Feature**

操作日志支持模态框/抽屉打开 可自行选择

操作日志清空添加等待时间5S 等待完成才能点击 防止误操作

登录日志清空添加等待时间5S 等待完成才能点击 防止误操作

个人中心添加loading效果

**其他**

菜单管理 为按钮时不再显示"新增按钮"(不合逻辑)

树表(如菜单管理/部门管理)去除空children 这样前面就不会有展开/关闭图标了

代码生成-多选删除 按钮样式

CollapseContainer border-radius 2px -> 6px

缓存监控 添加图标

表格圆角 2px -> 6px

# 1.1.0 (2024年1月16日)

**依赖更新**

- 升级目前最新最新vben

**Bug Fixed**

- 修复表格在开启border情况下 左边有一条竖线的样式问题
- 修复tab的关闭按钮"X"没有居中样式问题

**Feature**

- 树表支持双击展开/折叠 -菜单管理/部门管理

**其他**

- 登录后右上角昵称默认加粗显示

# 1.0.0 (2023-11-1)

**依赖更新**

- 升级目前最新最新vben 使用antv4版本

# 0.1.0

没写 初始完成版本 使用antv3版本
