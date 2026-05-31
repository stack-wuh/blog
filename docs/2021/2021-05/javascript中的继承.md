## JavaScript 中的继承：从原型链到 Class

> **摘要：** JS 的继承方案经历了原型链、构造函数、组合、原型式、寄生式、寄生组合的演进，ES6 的 class extends 本质仍是寄生组合继承的语法糖。

---

出于 ES6 中 class 类继承的好奇，在 babel 里试了一下，发现 ES6 中 class 类继承实际是**寄生组合式继承**。

红宝书中主要介绍了 6 种实现继承的方案：

1. 原型链继承
2. 构造函数继承
3. 组合式继承
4. 原型式继承
5. 寄生式继承
6. 寄生组合式继承

以下只记录主要的设计代码和基本原理，详细例子可访问 [CodeSandbox](https://codesandbox.io/dashboard/all/js%20--%20%E7%BB%A7%E6%89%BF?workspace=ebfb60f6-b82b-4dbb-95e9-2e5ecd4a085d)。

---

## 原型链继承

基本思想是利用原型，让一个引用类型继承另一个引用类型的属性和方法。

每个构造函数都有原型对象，原型对象中有指针指向构造函数，实例也有指向原型对象的指针。让原型对象等于另一个类型的实例，该原型对象就具有了另一个类型的构造函数，层层递进形成实例与原型的链条。

```js
function SuperType () {
  this.name = 'super'
}
SuperType.prototype.getName = function () { return this.name }

function SubType () {
  this.name = 'sub'
}

SubType.prototype = new SuperType()
SubType.prototype.getSubName = function () { return this.name }
```

**注意：**

1. 重写子类原型的语句必须出现在声明子类原型方法之前
2. 超类中声明的复杂类型会被后代子类共享（**最大缺点**）
3. 不能使用对象字面量创建原型方法，会切断原型链
4. 无法给超类构造函数传参

---

## 借用构造函数

在子类构造函数中调用超类构造函数：

```js
function Super (name) {
  this.name = 'super' || name
}
function Sub (name) {
  Super.call(this, name)
  this.name = 'sub'
}
```

**注意：**

1. 可以单独给实例传递参数
2. 属性和方法全部绑定在 this 上，只能在构造函数内部声明，**扩展性降低**
3. 超类原型中定义的属性对子类不可见

---

## 组合继承

利用原型链实现方法继承，利用构造函数实现属性继承：

```js
function Super (name) {
  this.name = 'super' || name
}
Super.prototype.getName = function () {
  return this.name
}

function Sub () {
  Super.call(this)
  this.age = 20
}

Sub.prototype = new Super()
Sub.prototype.constructor = Sub
```

**注意：** 需要两次调用超类构造函数。

---

## 原型式继承

没有严格意义的构造函数，基于一个对象生成另一个新对象：

```js
function object (o) {
  function F () {}
  F.prototype = o
  return new F()
}
```

**注意：**

1. 复杂类型值会被每个实例共享
2. ES5 中新增 `Object.create`，效果与 object 方法一致

---

## 寄生式继承

创建一个封装继承过程的函数，在函数内部对新对象增强后返回：

```js
function inherit (o) {
  var prototype = object(o)
  prototype.getName = function () {
    return this.name
  }
  return prototype
}
```

**注意：** 封装过程全部在函数内部，没有办法扩展。

---

## 寄生组合式继承

通过构造函数继承属性，通过原型链混成形式继承方法。不必为了子类原型调用超类构造函数，只需要超类原型的副本。

```js
function Super () {
  this.name = 'super'
}
Super.prototype.getName = function () { return this.name }

function Sub () {
  this.subname = 'sub'
}

function inherit (subType, superType) {
  const prototype = object(superType.prototype)
  prototype.constructor = subType
  subType.prototype = prototype
  return prototype
}

inherit(Sub, Super)
```

可以对比 babel 对 class 继承的转换，从实现思想上来说是一致的。

---

## Class 与 extends

ES6 实现了基于类的继承方案：

```js
class Parent {}

class Child extends Parent {
  constructor (props) {
    super(props)
  }
}
```

ES5 中先创建子类 this，然后将父类属性和方法添加到子类 this。ES6 中先将父类实例添加到 this，再用子类构造函数修改 this。

**注意：**

1. ES5 实现中存在 `__proto__` 属性，指向对应构造函数的 prototype。Class 同时具有 `__proto__` 与 `prototype` 两条继承链
2. 子类 `__proto__` 表示构造函数继承，指向父类：`Child.__proto__ === Parent`
3. 子类 prototype 的 `__proto__` 表示方法继承，指向父类 prototype：`Child.prototype.__proto__ === Parent.prototype`

---

## 各方案对比

| 继承方式 | 共享方法 | 独立属性 | 可传参 | 调用父类次数 |
|----------|----------|----------|--------|--------------|
| 原型链 | 是 | 否 | 否 | 1 |
| 借用构造函数 | 否 | 是 | 是 | 每实例 1 次 |
| 组合继承 | 是 | 是 | 是 | 2 |
| 原型式 | 是 | 否 | 否 | 0 |
| 寄生式 | 是 | 否 | 否 | 0 |
| 寄生组合 | 是 | 是 | 是 | 1 |

**寄生组合继承是基于类型继承最有效的方式。**
