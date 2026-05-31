## 浅尝一下 UI 设计

> **摘要：** 从 Ant Design 的设计思想出发，用 CSS 变量定义了一套博客的基础设计系统，包括间距、色彩、动效和布局规范。

---

![blank](https://cdn.wuh.site/2021-04-18-103230.png)

博客前端项目基础功能做的差不多了，现在就差设计 UI。奈何不是专业的 UI，只能从前端的角度和一些专业的设计文档去实现。

---

## 布局基础值

构建网站布局时，前端会依据设计图确认一些基础值：

1. 间距相关
2. 色彩相关
3. 动效相关
4. 交互相关
5. 布局相关

对设计的初级了解主要来自于 [Ant Design](https://ant.design/docs/spec/introduce-cn) 的设计思想。先用原生 CSS 实现，以后再考虑改为 less。

```css
:root {
  --padding-base: 8px;
  --margin-base: 8px;
  --font-size-base: 14px;
  --border-radius-base: 3px;
  --line-height-base: 22px;
  --transition-base: all .5s ease;
}
```

基础属性定义后，延伸出派生属性：

```css
:root {
  --margin-base-2: calc(2 * var(--margin-base));
  --margin-base-3: calc(3 * var(--margin-base));
  --border-radius-2: calc(2 * var(--border-radius-base));
  --line-height-default: calc(var(--font-size-base) + 10 - 2);
}
```

派生属性全部集中到一个样式文件，不在组件中再次定义，保证全局样式一致性。

---

## 设计规范要点

| 维度 | 规范 | 说明 |
|------|------|------|
| 字号 | lineHeight = fontSize + 10 - 2 | 基础字号 14px，行高 22px |
| 字重 | 400、500、600 三种 | 参考 Antd Typograph 组件 |
| 字体颜色 | 主、次、辅助、标题色 | 提前定义，保证整体和谐 |
| 暗黑模式 | 准备一套反色方案 | 可用 Antd 工具生成 |

页面布局结构设计：

1. 顶级标题 / 二级标题 / 三级标题
2. 一级菜单 / 二级菜单
3. 基础描述文案 / 基本文案
4. 背景色对比 / Border 外边框
5. Strong 增强 / Small 渐弱
6. Shadow 阴影 / Hover 类型色彩

从「克制」方向调整：

- 页面 Heading 最多三级（H1、H3、H6）
- 菜单最多两级
- 文章详情不多做大样式调整，多加细节
- 三级字重：Strong=600、Normal=500、Small=400
- 手势交互增强：对比色彩、BorderRadius
- 渐进动画：全部使用 transition

---

## 基础设置值

1. Padding 和 Margin 基数 8px，整数倍增加
2. BorderRadius 基数 3px
3. FontSize 基数 14px
4. LineHeight 基数 22px，与 FontSize 成线性关系
5. 定义主题色、中性色和反色
6. 定义多组背景色对应不同场景
7. Border 边框色直接使用主题色或中性色
8. 定义动画函数：ease、linear、自定义贝塞尔曲线
9. 辅助色可以丰富一点

---

## Heading 类型主题

生成两套文字色，对应 light 和 dark 模式：

```css
/** Light **/
--color-base: #ebecec;
--color-base-10: #0d0d0d;
--color-base-9: #333333;
/* ... */

/** Dark **/
--color-base: #141313;
--color-base-10: #fafafa;
--color-base-9: #f8f8f8;
/* ... */
```

映射到具体用途：

```css
--title-normal-color: var(--color-base-10);
--title-less-color: var(--color-base-9);
--text-primary-color: var(--color-base-8);
--text-less-color: var(--color-base-7);
--text-second-color: var(--color-base-6);
--disabled-color: var(--color-base-5);
--border-color: var(--color-base-4);
--divider-color: var(--color-base-3);
--background-color: var(--color-base-2);
--table-head-color: var(--color-base-1);
```

---

## 中性色与辅助色

中性色以 Gray 为基准生成，大于 7 的为 Dark 模式色彩，小于 7 的为 Light 模式色彩。

灰色是百搭色彩，最适合做背景色。辅助色选择时要考虑与背景色和字色的搭配，最好从主题色出发选择相近色系。

---

## Transition 与 Animate

最少准备两套动画：入场和出场。

例如 hover 特效时，hover 类中定义入场动画（如 ease-in），当前标签类中定义出场动画（如 ease-out）。

---

## 间距设置

基础基于 8px，几何倍数增减。页面间距值全部统一，结构上看更整齐。

除 8n 外，还可以使用 em 和 rem：
- em 相对于父级标签字号
- rem 相对于根标签字号

使用场景有差异。用 em 可通过 fontSize 轻松实现自适应组件，如 AudioControl 和 Button 组件就是通过 fontSize 控制样式。

---

## 富结构化缺省页

### 404 页面

在内容型项目中，不想看枯燥的 404 提示。查询关键字无反馈时，给用户推荐内容的快捷入口，引导点击进入博客页面，留住流量。

资源类 404 可给动画或引入腾讯 404 服务，让错误给用户丰富有趣的体验。

### Empty 空状态

为弥补内容和资源缺失带来的不良体验，设计有意思的 Empty 展示页：

- 简单动画吸引视线
- 类 bilibili 火星文
- 引流快捷入口

---

## 定制型设计

专注模式、精简模式等定制型设计可以提升用户停留时长。

可提供：
- 两套布局：菜单固定左侧 / 菜单固定顶部
- 两套视觉：Light / Dark，根据系统时间自动切换
- 精简模式：阅读时减少交互和按钮，增加自定义行高、字号、字色、背景色
- 国际化：中英文切换、简繁体切换

---

## 简洁而不简单

Antd 设计文档始终在描述三个思想：**自然、高效、克制**。表达"简简单单才是美"。

视觉上的细节少了，但开发的工作多了。单是色彩就至少准备 40 多个，看不见的工作赋予了视觉上的简单以另一种不简单。

做好设计并非以上描述的这么简单，有很多内容都不知道，毕竟不是专业设计师。但从前端角度分析怎么去做设计，让项目做得更好一点、更快一点、更简单一点。

简洁而不简单，把背后的工作留给自己慢慢品，把清新留给用户。
