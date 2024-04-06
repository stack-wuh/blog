2018-11-10 -- js打印
===================
业务需要打印文件,原生的jsprint事件是要在element里面写一个内联样式,我觉得很乱,就在网上找了一下,找到了一个jquery的插件jqprint.js,感觉这个库还不错,就用了一下记录下来.

> 插件对应的是jquery-1.4.4.js版本

```html
<section class="main">
  <header class="header">
    <h3>this is test title</h3>
  </header>
  <section class="body">
    this is content for test
  </section>
  <footer class="footer">
    <button type="button" name="button">打印</button>
  </footer>
</section>

<script src="https://cdn.bootcss.com/jquery/1.4.4/jquery.min.js"></script>
<script type="text/javascript" src="./jquery.jsprint.js" ></script>
<script type="text/javascript">
  function handlePrint() {
    $('.main').jqprint({
      debug: false,
      importCss: true,
      printContainer: true,
      operaSupport: true,
    })
  }
</script>

```

这个插件可以使用一下外联样式表, 可以在外部应用的时候加上print就可以使用外部的样式文件了
```html
<link rel="stylesheet" href="/css/master.css" media="print" />
```
