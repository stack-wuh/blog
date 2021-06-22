### 从业务中去学习React

在辛苦忙碌了两个多月之后，我终于有时间来写一写博客啦，尽管我当初给自己规定的目标是每一个星期出一篇。在业务工作当中我透支了全部精力，没办法静心去写，现在终于有时间啦。

#### Vue2.0 VS React16.8

毫无疑问，现在市场上的公司用的不是Vue就是React，这里的Vue当然指的是Vue2.0。除此之外，Ng的市场份额远不及Vue以及React，所以目前前端的技术栈就大致上分为：以React为主导的React技术栈和以Vue为主导的Vue技术栈。

我是由Vue技术栈转的React技术栈的前端开发工程师。

我使用React的时间其实真的不太久，不过一年时间。我个人认为对于React的深刻了解以及学习方式都来自于我使用Vue时的经验，它使我快速精进，下面我们就从最常用的组件通讯作为入口，做一个分析。

#### 一、Props&&Events(属性下发以及事件上传)

![](https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-10-07-083409.png)

如上图: 其父级组件Outer与子组件Inner的通讯，通过在outer中注册一些属性下发给Inner组件，这种方式就是React以及Vue中最普通的通讯方式：**Props** 。

通常，我们会在父组件中定义一些属性或者是事件，然后将这一些属性作为Inner的属性赋值，类似于原html标签中的data-*。在原生的html或者是Jquery中我们可以将一些数据缓存在html标签的data- * 属性中。这样可以通过DOM或者是BOM的事件获取目标元素之后，访问缓存在目标对象中的data-*值。

到了React中可以这样使用，其实现如下：

```javascript
const Inner = ({
  name,
  onClick
}) => {
  const currentMode = 'inner'
  return (<>
  	  <h5>current is Inner</h5>
          use father's props:
          <ul>
          	<li onClick={() => onClick(currentMode)}>name: {name}</li>
          </ul>
          </>)
}
const Outer = () => {
  const handleClick = data => {
    console.log('current has data: ', data)
  }
  
  const innerProps = {
    name: 'Inner',
    onClick: handleClick
  }
  return (<>
  	  <h5>current is Outer</h5>
          <Inner {...innerProps} />
          </>)
}
```

如上，我简单的实现了一个Props通讯。我们将一些通用到同一个组件的属性，统一到一个对象innerProps内部去管理，然后通过解构赋值到Inner组件中。Inner组件上传了带着自身状态的onClick事件到父组件中，这样它们通过onClick事件搭建了一个桥梁，就形成了Inner向Outer传递的事件。这个就是Props的下发以及Events事件的上传。



#### 二、Context(createContext&useContext)

Context是React中相当特殊的一个属性，使用它可以跨层级传递我们提前定义的属性，在其包裹中的子组件就可以访问和使用这些属性啦，其示意图如下：

<img src="https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-10-07-092106.png" style="zoom:80%;" />

普通的下发模式下，只能通过将Props一层一层的向下传递，一直传递到需要使用的组件Inner中，此时就可以在Inner中的Props中访问到数据，其嵌套层数越深我们需要传递的次数就越多，为了解决这样的场景，我们可以引入React中的准备的Context，在应用了Context之后，其模型变为如下：![](https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-10-07-093130.png)

在定义使用了Context之后，我们改变了传递的模型，不再将数据层层下发，改为一次下发，随用随取。在需要的组件中，获取在Outer中定义的元数据。

关于Context的使用又有多种方式，比如在16.8之后的Hooks和Provider&Consumer，我将会独立一个章节介绍其使用模式。

#### 三、Ref(useRef)

在16.8中我们可以使用一些React的顶层API，其中有一个好玩的钩子：useRef。在ProTable中有一个相当酷的玩法，如下:

```javascript
import React, { useRef, useEffect } from 'react'

const Inner = ({
  ref
}) => {
  const currentMode = 'Inner'
  useEffect(() => {
    const actions = {
      mode: currentMode,
      onChange () {
        console.log('currnet has changed')
      }
    }
    if (ref && typeof ref === 'function') {
      ref(actions)
    }
    if (ref && typeof ref !== 'function') {
      ref.current = actions
    }
  }, [])
  return (<>
            <h5>current is Inner</h5>
          </>)
}

const Outer = () => {
  const innerRef = useRef()
  
  const handleClick = () => {
    innerRef.current.onChange()
  }
  return (<>
            <Inner ref={innerRef} />
	    <button onClick={handleClick}>calling inner Change</button>
          </>)
}
```

如上，这时我们不再拘束于ref属性的类型，它可以定义为一个函数，也可以是一个ref对象。现在我们将事件绑定到了button元素上，同时可以将Inner组件的状态通过ref.current 访问到。

#### 四、Render Props & HOC

他们关注的都是横切关注点的问题，例如Redux中的connect函数就是一个高阶组件，在引入了HOC之后，又会存在额外的问题，比如在使用同一个HOC时，有同名的变量存在时，会造成属性丢失的问题。

而在使用Render Props模式时，同样面临着一个棘手的问题，如果组件的嵌套层数过多，就会造成类似于回调地狱的问题。如下：

```javascript
const Inner = ({ children, ...props }) => {
  return children(props)
}

const Outer = () => {
  return (<>
          	<Inner>
          	{
    		  children => (<p>
    				current is Inner
    			        <Inner children={() => (<p>current is children inner</p>)}>
    			       </p>)
  		}
          	</Inner>
          </>)
}
```

更多的可以查看React官网中关于[Render Props](https://reactjs.org/docs/render-props.html)的例子，github上有一个基于Render props的动画库[ReactMotion](https://github.com/chenglou/react-motion)

#### 五、Redux

在16.8之后，React推出了useReducer，useReducer 的使用于 Redux 的使用相同。在日常的业务中我们使用的最多的应该还是Redux，Redux与React没有直接的关联，我们在React应用中的使用的类库是基于Redux封装的react-redux，它暴露了一个connect沟通数据层与视图层，这样不管我们的视图层中的组件嵌套多少层，我们都可以将数据托管到Redux中，其使用方式也与Context相似。

示意图如下:

![](https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-10-07-103533.png)

我们将数据存储到每一个Store中，每一个视图都有与之对应的一个Store或者是多个Store，而沟通二者的桥梁就是connect函数，其实现如下:

```javascript
const Inner = ({
  store
}) => {
  const { Store } = store
  
  return null
}

const mapStateToProps = ({ Store, StoreRoot }) => ({ 
  store: {
    Store,
    StoreRoot
  }
})
const mapDispatchToProps = dispatch => ({ dispatch })
const combineCm = connect(mapStateToProps, mapDispatchToProps)(Inner)
export default combineCm
```

随着业务的处理越来越复杂，我们定义的Reducer越来越多，数据也会变得越来越难以管理，所以我们一定要在一个迭代周期结束之后，整理我们的redux，以便于后期的维护和迭代。
