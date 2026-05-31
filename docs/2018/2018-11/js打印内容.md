## 2018-11-10 jsPrint：用 jQuery 插件替代原生打印的方案

> **一句话：** 原生 `window.print()` 需要内联样式侵入 DOM，用 `jqprint.js` 可以在不破坏结构的前提下实现打印。

---

### 问题

业务需求：点击按钮打印页面中的指定区域。

原生 `window.print()` 的局限：

- 必须给打印元素加内联样式 `@media print`
- 样式侵入 DOM 结构，维护成本高
- 打印范围和页面范围难以分离

---

### 方案：jqprint.js

> 插件版本要求：jQuery 1.4.4

**HTML 结构：**

```html
<section class="main">
  <header class="header">
    <h3>this is test title</h3>
  </header>
  <section class="body">
    this is content for test
  </section>
  <footer class="footer">
    <button type="button" onclick="handlePrint()">打印</button>
  </footer>
</section>
```

**调用方式：**

```js
function handlePrint() {
  $('.main').jqprint({
    debug: false,
    importCss: true,       // 引入外部样式
    printContainer: true,  // 打印容器本身
    operaSupport: true,    // 兼容 Opera
  });
}
```

**样式表关联（关键配置）：**

```html
<link rel="stylesheet" href="/css/master.css" media="print" />
```

通过 `media="print"` 将打印样式和屏幕样式分离，避免内联样式污染。

---

### 对比

| 方式 | 优点 | 缺点 |
|------|------|------|
| 原生 `window.print()` | 零依赖 | 样式侵入 DOM、难以控制范围 |
| `jqprint.js` | 样式分离、范围可控 | 依赖 jQuery 1.4.4、插件已老旧 |

---

### 结论

对于需要精确控制打印区域的场景，`jqprint.js` 是一个轻量可行的方案。但如果项目不使用 jQuery，可能需要寻找纯 JS 替代方案。
