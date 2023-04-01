## [JS]继承学习

### 原型链继承

原型链继承就是利用原型, 使类型A继承类型B的属性和方法

```js
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
log(sub_n_1.name) // sub_n_1

```

缺点:

+ 通过原型来实现继承时, 原型会变成另一个类型的实例, 另一个类型的实例属性变成了它的原型属性, 该原型的引用属性会共享给所有实例
+ 在构造子类实例的时候, 不能给构造函数添加额外的参数, 它会共享给所有的子类实例 