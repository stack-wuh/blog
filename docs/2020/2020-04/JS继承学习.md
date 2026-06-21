## JS 继承：原型链、组合与寄生组合的实现与取舍

> **摘要：** JS 的继承方案经历了从原型链到组合再到寄生组合的演进，核心取舍是在共享方法与避免引用属性污染之间找到平衡。

---

### 原型链继承

原型链继承利用原型让一个类型继承另一个类型的属性和方法：

```javascript
function SuperN () {
  this.name = 'super_n'
  this.books = ['js', 'css', 'node']
}

SuperN.prototype.getName = function () {
  console.log(this.name)
}

function SubN () {
  this.name = 'sub_n'
}

SubN.prototype = new SuperN()

var sub_n_1 = new SubN()
var sub_n_2 = new SubN()

sub_n_1.name = 'sub_n_1'
console.log(sub_n_1.name) // sub_n_1
```

**缺点：**

1. 通过原型实现继承时，原型会变成另一个类型的实例，另一个类型的实例属性变成了它的原型属性，该原型的引用属性（如数组）会被所有实例共享
2. 在构造子类实例时，不能给父类构造函数传参

---

### 经典继承（借用构造函数）

在子类构造函数内部调用父类构造函数：

```javascript
function SubN () {
  SuperN.call(this)
}
```

**优点：** 可以传参，引用属性不会被共享。
**缺点：** 方法都在构造函数中定义，无法复用。

---

### 组合继承

结合原型链和经典继承：

```javascript
function SubN () {
  SuperN.call(this)  // 继承实例属性
}
SubN.prototype = new SuperN()  // 继承原型方法
SubN.prototype.constructor = SubN
```

这是最常用的继承方式，但父类构造函数会被调用两次。

---

### 寄生组合继承（推荐）

```javascript
function inheritPrototype (sub, super) {
  var prototype = Object.create(super.prototype)
  prototype.constructor = sub
  sub.prototype = prototype
}

function SubN () {
  SuperN.call(this)
}
inheritPrototype(SubN, SuperN)
```

只调用一次父类构造函数，同时保持原型链完整，是目前最成熟的继承方案。

---

### 各方案对比

| 继承方式 | 共享方法 | 独立属性 | 可传参 | 调用父类次数 |
|----------|----------|----------|--------|--------------|
| 原型链 | 是 | 否 | 否 | 1 |
| 经典继承 | 否 | 是 | 是 | 每实例 1 次 |
| 组合继承 | 是 | 是 | 是 | 2 |
| 寄生组合 | 是 | 是 | 是 | 1 |
