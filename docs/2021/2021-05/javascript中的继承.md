## javascript中的继承

这两天没事，在翻看红宝书的继承篇，重新学习了一下下js中的继承。出于对Es6中class 类继承的好奇，我在babel里面试了一下，才发现Es6中class类继承，实际是寄生组合式继承，也是一下我要介绍的一种， 如图：

![](https://src.wuh.site/2021-05/2021-05-10-081908.png)



在红宝书中主要介绍了一下5中实现继承的方案：

1. 原型链继承
2. 构造函数继承
3. 组合式继承
4. 原型继承
5. 寄生继承
6. 寄生组合式继承

以下，我只记录它们主要的设计代码和基本原理，其实例可以访问我的[codesandbox][codesandbox]，里面有继承篇详细的例子。



### 原型链继承

基本思想就是利用原型，让一个引用类型可以继承使用另一个引用类型的属性和方法。详情查看例子[原型链继承][prototype]。

每一个构造函数都有一个原型对象，而原型对象中又有一个指针指向构造函数，实例也有一个指向原型对象的指针。如果让原型对象等于另一个类型的实例，那该原型对象就具有了另一个类型的构造函数。如果另一个类型的原型中又有另一个类型的实例，层层递进就有形成了一种实例与原型的链条，这个就是**原型链**。

对SubType的原型对象改写为SuperType的实例，此时可以将SuperType称之为SubType的超类，那SubType即为子类。

如果继续将SubType作为超类，对SubType2改写原型对象，那SubType2将同时具有SuperType和SubType的属性和方法，尽管SupType2不是SuperType的子类。这个就是继承链最简单的一个实现例子，

```js
function SuperType () {
  this.name = 'super'
}
SuperType.prototype.getName = function () { return this.name }

function SubType () {
  this.name = 'sub'
}

Sub.prototype = new SuperType()
Sub.prototype.getSubName = function () { return this.name }

function SubType2 () {}
SubType2.prototype = new SubType()

```

**注意:  **

1. 需要注意的是，重写子类原型的语句必须出现在声明Sub原型方法之前，原因很简单，因为原型链继承是重写子类原型对象。重写语句后自定义子类的属性和方法会被删除。
2. 在使用原型链继承时，如果超类中声明了复杂类型，后代子类会共享复杂类型的值。比如：子类1 更新了一个数组的元素的值，本次更新会反应到子类2。**这个也是原型链继承的一个最大的缺点。**
3. 不能使用对象字面量去创建原型方法，因为使用字面量后实质上是重写了原型链，切断与原来的原型链之间的联系。
4. 没有办法在不影响全部实例的前提下，给超类的构造函数传递参数。

### 借用构造函数

在子类的构造函数中调用超类的构造函数，即为借用构造函数的基本原理。详情查看例子[借用构造函数][constructor]

借用构造函数方法的出现就是为了解决原型链继承的复杂类型值会被各个实例共享的问题。

在子类的构造函数中调用超类的构造函数，其实质是将超类绑定在this中的属性复制到子类中，只有在调用子类的构造函数时，才执行超类的构造函数，所以现在的参数问题得以解决，各个实例间不会互相影响。

```jsvascript
function Super (name) {
	this.name = 'super' || name
}
function Sub (name) {
	Super.call(this, name)

	this.name = 'sub'	
}
```

**注意: **

1. 相对于原型链继承，借用构造函数可以单独给实例传递参数了。因为属性是绑定在this上面的，只有在创建实例的时候才赋值，所以实例之间互不影响。
2. 但是，在解决了复杂类型值的问题之后，借用构造函数又有一个新的问题。属性和方法全部绑定在this上面，所以只能在构造函数内部继续声明其他的属性和方法，**扩展性降低。**
3. 同时，在超类的原型中定义的属性，对于子类而言不可见。**所以必须在超类的构造函数中声明属性。**



### 组合继承

利用原型链实现方法的基础和利用构造函数实现属性的继承，就是组合继承的基本原理。结合了原型链和借用构造函数的技术，同时具有了它们的优点。详情查看例子[组合继承][combination]

在重写了子类的原型后，Sup.prototype实质上指向了Super.prototype，在Sup.prototype.constructor指向的是Super，这里需要手动将Sub.prototype.constructor指向Sub。

```jsvascript
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

**注意: **

1. 组合继承唯一一点就是需要两次调用超类的构造函数。



### 原型式继承

没有严格意义的构造函数，原型可以基于一个对象生成另外一个新对象，还不必为它声明额外的类型，就是原型式继承的基本原理。详情查看例子[原型式继承][prototypal]

原型继承的实现特别简单，公式一样的三句代码。object函数实际是创建基于传入的对象o，生成的副本。每一个由object函数生成的副本，其状态都被共享了。

但是对实例进行扩展的方法是不会被共享的。

```javascript
function object (o) {
  function F () {}
  F.prototype = o
  return new F()
}
```

**注意: **

1. 其复杂类型值的问题，如同原型链继承一样，会被每一个实例共享
2. 在es5中，已经新增Object.create方法，其效果与object方法一致



### 寄生式继承

寄生式继承，是与原型式继承密不可分的。其基本思想就是，仅创建一个封装继承过程的函数，在函数内部对新对象进行增强，然后返回增强的新对象。详情查看例子[寄生式继承][parasitic]

就这样在由寄生式继承的函数返回的新对象，就有了源对象origin的属性和增强的属性。

所以，寄生式继承和原型式继承，主要针对的是对象间的继承，而非自定义构造函数。

```javascript
function inherit (o) {
  var prototype = object(o)
  prototype.getName = function () {
    return this.name
  }
  
  return prototype
}
```

**注意：**

1. 其缺点与借用构造函数相似，其封装过程全部在函数内部，没有办法进行扩展。



### 寄生组合式继承

寄生组合式继承，指的是通过构造函数来继承属性，通过原型链的混成形式来继承方法。其基本原理就是： 不必为了子类的原型而调用超类的构造函数，我们需要的就是超类原型的一个副本。详情查看例子[寄生组合式继承][parasitic-combination]

可以使用寄生式继承来继承超类的原型，再将结果指定给子类的原型。

寄生组合继承，可以减去一步在子类外部调用的超类构造函数，避免将一些额外的属性附加到子类的原型链中，而且原型链还能保持不变。

所以，开发人员一致认为寄生组合式继承是引用类型最理想的继承范式。

```javasc
function Super () {
	this.name = 'super'
}
Super.ptototype.getName = function () {  return this.name }

function Sub () {
	this.subname = 'sub'
}

function inherit (subType, SuperType) {
	const prototype = object(SuperType)
	prototype.constructor = subType
	subType.prototype = prototype
	
	return prototype
}

inherit(Sub, Super)
```

可以回到顶部，查看babel对class类继承实现的转换，仔细一对比，发现其实没有什么大的不同，从实现思想上来说是一致的。

### Class 与 extends

ES6终于实现了基于类继承的方案了。可以使用extends关键字实现继承, 但是在子类中必须使用super关键字，因为子类没有自己的this。

```javascript
class Parent {}

class Child extends Parent {
  constructor (props) {
    super(props)
  }
}
```

在ES5中，先创建的是子类的this，然后将父类的属性和方法添加到子类的this当中。 在ES6中，先将父类的实例添加到this中，然后用子类的构造函数去修改this。

**注意：**

1. 在大多数浏览器的Es5的实现中，都存在一个`__proto__`属性，该属性总是指向对应构造函数的prototype属性。Class作为构造函数的语法糖，同时具有`__proto__`与`prototype`两条继承链。
2. 子类的`__proto__`属性，表示构造函数的继承，总是指向父类。 `Child.__proto__ === Parent`
3. 子类prototype中的`__proto__`，表示方法的继承，总是指向父类的`prototype`。  `Child.prototype.__proto__ === Parent.prototype`
4. 在类继承中，`__proto__`属性是层层嵌套的，子类的`__proto__`属性的`__proto__`属性指向的就是父类的`__proto__`。 `Child.__proto__.__proto__ === Parent.__proto__`

### 总结

1. 在js中主要通过原型链实现继承。原型链的继承就是通过将一个类型的实例赋值给另一个构造函数的原型。这样，子类就可以访问超类中的属性和方法，与基于类继承相似。
2. 原型链继承的问题是所有对象实例共享所有继承的属性和方法，因此不适于单独使用，而解决的方法就是借用构造函数。
3. 借用构造函数，是通过在子类的构造函数中调用超类的构造函数。这样就可以做到，每一个实例有自己的属性和方法，但是也限制了子类的扩展，因为只能在构造函数内部声明其他属性和方法。
4. 使用最多的继承模式是组合继承，集成了原型链继承和借用构造函数优势。通过原型链来扩展方法，通过借用构造函数来实现实例属性的继承，唯一缺点就是必须调用两次超类构造函数，造成效率缺失。
5. 原型式继承，是针对于对象的一种继承模式，如非必要声明构造函数，可以使用该模式，其实质就是对源对象进行浅复制。
6. 寄生式继承, 与原型式继承息息相关。基于源对象生成一个新对象，然后对这个新对象增强后返回。
7. 寄生组合继承，为了解决组合继承会两次调用超类构造函数而造成效率低下的问题，将寄生式继承和组合式继承结合。通过寄生式继承对超类原型对象浅复制，然后对子类原型的构造函数修正，最后改写子类的原型对象。

**寄生组合继承是基于类型继承最有效的方式。**



[codesandbox]: https://codesandbox.io/dashboard/all/js%20--%20%E7%BB%A7%E6%89%BF?workspace=ebfb60f6-b82b-4dbb-95e9-2e5ecd4a085d
[prototype]: https://codesandbox.io/s/inherit--prototype-kgvtr
[constructor]: https://codesandbox.io/s/inherit--constructor-dhlco
[ combination ]: https://codesandbox.io/s/inherit--combine-scxx5
[prototypal]: https://codesandbox.io/s/inherit--prototypal-c1o3b
[parasitic]: https://codesandbox.io/s/inherit--parasitic-49rq6

[parasitic-combination]: https://codesandbox.io/s/inheritance--parasitic-combination-9pytp