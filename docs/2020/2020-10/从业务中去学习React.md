## 从业务中学习 React：五种组件通讯方式对比

> **摘要：** React 的组件通讯从 Props/Events 到 Redux，本质是从父子单线传递到全局状态管理的演进，每种方式适用于不同的组件关系层级。

---

### 一、Props & Events

父组件 Outer 向子组件 Inner 下发属性，Inner 通过事件向 Outer 上传状态：

![通讯示意图](https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-10-07-083409.png)

```javascript
const Inner = ({ name, onClick }) => {
  const currentMode = 'inner'
  return (
    <>
      <h5>current is Inner</h5>
      use father's props:
      <ul>
        <li onClick={() => onClick(currentMode)}>name: {name}</li>
      </ul>
    </>
  )
}

const Outer = () => {
  const handleClick = data => {
    console.log('current has data: ', data)
  }

  const innerProps = {
    name: 'Inner',
    onClick: handleClick
  }

  return (
    <>
      <h5>current is Outer</h5>
      <Inner {...innerProps} />
    </>
  )
}
```

将通用属性统一到一个对象 `innerProps` 内部管理，通过解构赋值传入 Inner。Inner 上传带自身状态的 `onClick` 事件到父组件，通过事件搭建桥梁。

**适用场景：** 父子组件通讯，最基础、最常用。

---

### 二、Context（createContext & useContext）

Context 可以跨层级传递属性，在其包裹中的子组件可以直接访问，不需要层层下发 Props：

![Props 层层下发](https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-10-07-092106.png)

![Context 一次下发](https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-10-07-093130.png)

使用 Context 后，不再将数据层层下发，改为一次定义、随用随取。

关于 Context 的使用有多种方式：16.8 之后的 Hooks（useContext）和 Provider & Consumer，这里暂不展开。

**适用场景：** 跨多层级的组件需要共享同一组数据。

---

### 三、Ref（useRef）

16.8 中的 `useRef` 可以获取子组件的实例或 DOM 节点，在 ProTable 中有很实用的用法：

```javascript
import React, { useRef, useEffect } from 'react'

const Inner = ({ ref }) => {
  const currentMode = 'Inner'

  useEffect(() => {
    const actions = {
      mode: currentMode,
      onChange () {
        console.log('current has changed')
      }
    }
    if (ref && typeof ref === 'function') {
      ref(actions)
    }
    if (ref && typeof ref !== 'function') {
      ref.current = actions
    }
  }, [])

  return <h5>current is Inner</h5>
}

const Outer = () => {
  const innerRef = useRef()

  const handleClick = () => {
    innerRef.current.onChange()
  }

  return (
    <>
      <Inner ref={innerRef} />
      <button onClick={handleClick}>calling inner Change</button>
    </>
  )
}
```

不再拘束于 ref 属性的类型，可以定义为函数或 ref 对象。将事件绑定到 button 上，通过 `ref.current` 访问 Inner 组件的状态。

**适用场景：** 需要直接调用子组件的方法或访问子组件状态。

---

### 四、Render Props & HOC

两者关注的都是**横切关注点**的问题。

- **HOC（高阶组件）**：例如 Redux 中的 `connect` 函数。问题是使用同一个 HOC 时，同名变量会造成属性丢失。
- **Render Props**：组件嵌套层数过多时，会造成类似于回调地狱的问题：

```javascript
const Inner = ({ children, ...props }) => {
  return children(props)
}

const Outer = () => (
  <Inner>
    {children => (
      <p>
        current is Inner
        <Inner children={() => <p>current is children inner</p>} />
      </p>
    )}
  </Inner>
)
```

更多例子可以参考 React 官网的 [Render Props](https://reactjs.org/docs/render-props.html)，以及基于 Render Props 的动画库 [ReactMotion](https://github.com/chenglou/react-motion)。

**适用场景：** 需要复用组件逻辑而不是 UI 结构时。

---

### 五、Redux

16.8 之后 React 推出了 `useReducer`，使用方式与 Redux 相同。日常业务中使用最多的还是 Redux，通过 `react-redux` 暴露的 `connect` 函数沟通数据层与视图层。

![Redux 数据流](https://source-1300700534.cos.ap-shenzhen-fsi.myqcloud.com/2020-10-07-103533.png)

```javascript
const Inner = ({ store }) => {
  const { Store } = store
  return null
}

const mapStateToProps = ({ Store, StoreRoot }) => ({
  store: { Store, StoreRoot }
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Inner)
```

每个视图都有与之对应的 Store，通过 `connect` 函数连接。随着业务复杂，Reducer 越来越多，数据管理难度增大，所以一定要在迭代周期结束后整理 Redux，便于后期维护。

**适用场景：** 全局状态管理，多个不相关组件需要共享同一状态。

---

### 五种方式对比

| 方式 | 数据流向 | 适用层级 | 复杂度 |
|------|----------|----------|--------|
| Props & Events | 父子双向 | 父子 | 低 |
| Context | 顶层 → 任意层级 | 跨层级 | 中 |
| Ref | 父 → 子（直接访问） | 父子 | 低 |
| Render Props / HOC | 逻辑复用 | 任意 | 中 |
| Redux | 全局单向 | 全局 | 高 |
