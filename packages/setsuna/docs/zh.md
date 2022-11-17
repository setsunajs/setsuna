<h1 align="center">Setsuna.js</h1>




## 介绍

**`setsuna.js`是一个声明式、渐进式，小巧的 web 前端框架，核心优势就是体积小（3kb内）**

**内部模块可插拔可拆卸，主流框架具备的优势能力都会逐渐支持，可以独立运行（有自己的运行时+响应式系统），也可以只用一部分能力，来和主流框架之间行可以形成互补，致力于用于更好的服务于项目的构建和开发**





## 和主流框架的对比

**您可能会有疑问，和`vue , react, ng` 等前端框架对比，生态和稳定性既没有它们全，在概念上也没有`solid, qwik`等概念新，制作这样一个框架有什么意义吗？**   

首先该框架创建的初衷并不是要替代`vue，react` 等主流框架，而是想要达到一个互补的目的，作者本人也是`vue, react`的爱好者，并且非常认可它们的成功和优秀，会对它们每次的新版本发布感到欣喜

但不可否认的是，它们仍旧是存在诸多缺点，例如`vue props 的妥协，react 让人又爱又恨的 hook 机制等`，完美的框架并不存在，大家都在尽力的规避缺点负重前行的探索着，但这些都是框架的作者们该考虑的，更多的开发者关心的则是业务的支持能力怎么样，能不能解决，以及能不能更好的解决自己的问题，就比如

主流框架现在已经形成了各自的生态，优势和特点也已经稳定很平稳下来，这既是优点同时也是问题

+ **对于类型产生的相关问题，vue jsx 反省组件用起来相当难受，模板 setup 中 defineProps 在利益权衡间只能声明在<script/>中，这是不利于复用的，而 react 的类型支持相当好，但是它的更新机制是诸多人受不了的 **

  `setsuna.js`会采用细颗粒度的更新 + jsx 来规避

+ **对于体积产生的相关问题，在跨系统的复用中，有种做法是把组件拆成各自独立的小项目，然后通过某种方式在给按照规则还原拼接回去，而由于这种做法脱离了主应用，我们没有办法提前知道哪些模块是能用到，哪些是没用到的，所以为了程序的正常运行会将所有模块一并打进主应用中，此时 tree shaking 则会失去效用**

  `setsuna.js`会采用插拔的方式来规避，只有一个核心库作为底层必要模块( 非常小，体积开销可以忽略不计 )，采用约定式来限制 api (只要满足您可以接入任意满足约定的模块，方便复用)，最终体积取决于用户自身的选择

+ **对于 webComponent 产生的相关问题，由于主框架都已经形成了稳定的生态链路，它们虽然能够支持 webComponent 但是却并不会对其过度支持，因为你一旦选择某一款框架，使用了框架那一套之后将没有必要再去使用 webComponent**

  `setsuna.js` 会尽可能的提供 `webComponent` 友好的使用方案，如果您有什么想法，也欢迎提供 pr

+ **对于体验相关的问题，这点可以是问题也可以不是问题，因为对于许多的架构师来说，越是成熟越是存在限制，做架构的往往会束手束脚，这也是作者知道的为什么会有很多，明明各种吐槽 react，而选择还往往是 react 的原因**

  `setsuna.js` 的理念就是基于一个 **必要的核心库** + 一个**约定式 API 规范**来作为创建 APP 的根基，并且也会尽量权衡对外暴露的接口，是否足够方便使用者来方便扩展

`setsuna.js`更多的是面向于对于使用现有框架，在某些问题上觉得接受不能的时候，提供的另一种选择，同时也希望在以后的发展过程中，能渐渐形成自己独树一帜的特点，也希望有同样愿望的小伙伴的意见、讨论和加入

目前框架仍处于发展的初期，后续各种新功能（去虚拟DOM，编译优化，SSR框架，BFF层框架，TS等等）都会逐渐开始考虑，陆续的进行支持，所以请给我们一点点的时间~





## 导航

+ <a href="#下载">下载</a>
+ <a href="#组件">组件</a>
+ <a href="#渲染API">渲染API</a>
+ hooks（用于**创建内部状态，以及绑定组件生命周期**的一系列方法的集合）
  + <a href="#useState">useState</a>
  + <a href="#useComputed">useComputed</a>
  + <a href="#useRef">useRef</a>
  + <a href="#useEffect">useEffect</a>
  + <a href="#useprovide--usecontext">useProvide & useContext</a>
  + <a href="#useMount">useMount</a>
  + <a href="#useUpdate">useUpdate</a>
+ <a href="#调度API">调度API</a>
+ 特性组件
  + <a href="#Await">`<Await/>`</a>
  + <a href="#Teleport">`<Teleport/>`</a>
  + <a href="#Fragment">`<Fragment/>`</a>
+ <a href="#web component">web component</a>
+ <a href="#SSR">SSR</a>
+ <a href="https://github.com/usagisah/setsuna">周边设施库</a>
  + <a href="https://github.com/setsunajs/observable/blob/main/docs/zh.md">响应式约定实现 `@setsunajs/observable`</a>
  + <a href="https://github.com/setsunajs/router/blob/main/docs/zh.md">路由 `@setsunajs/router`</a>





## 下载

```bash
npm create setsuna
```

或者，你也可以下载 ***create-setsuna*** 到本地，通过命令行使用

```bash
# 第一步，下载
npm install create-setsuna -g

# 第二步，命令行敲击以下命令
create-setsuna
```





## 组件

```js
// App.jsx
import { render, useState } from "setsuna"

function App() {
  const [num, setNum] = useState(0)
  const add = () => setNum(num() + 1)
  
  return () => <>
    <h1>hello setsuna.js</h1>
  	<p>{ num() }</p>
    <button onClick={add}>++</button>
  </>
}

render( 
  <App/>, 
  document.querySelector("#app") 
)
```

+ 组件基于`jsx`（函数中返回 html 一样的东西）来创建

+ **声明一个组件的定义为，一个组件内部返回一个新的函数，这个新的函数需要返回 JSX**
+ 组件内部中的第一段函数，只会在创建期间调用一次，第二段函数会在每次刷新时重复执行







## 渲染API

`render( VNode, HTMLElement )`

+ `VNode` 也就是组件，可用通过以下两种方式创建 
  + `<App />`
  + `_jsx( ComponentFunction, {msg: "这是传给组件的参数"},  Children1, Children2 )`
+ `HTMLElement` 这是需要挂到的 DOM 节点







## useState

`useState` 用于创建状态，是创建一个状态最基本的单元

```javascript
import { useState } from "setsuna"
export function Comp() {
  const [num, setNum] = useState(0)
  const add = () => {
    setNum(num() + 1)
    /*
    	setNum(n => n + 1)
    */
  }
	
  const [num1, setNum1] = useState(() => 1)

  return () => <div>
    <p>{num()}</p>
    <button onClick={add}>++</button>
  </div>
}
```

+ `useState()` 接收一个参数作为初始值
+ 但如果初始参数是一个函数，则会自动执行函数，取返回值作为初始值
+ 使用后的返回值是一个数组
  + 第一个值是一个，调用后会返回内部最新值的函数
  + 第二值是修改器函数，修改器函数的参数会被作为内部最新的值，同时引发视图的更新。如果参数是函数，则会自动执行采用其返回值，该函数的参数是当前内部最新值



由于`useState()`的实现底层是满足，我们约定的响应式规范的，所以还能支持管道功能

```javascript
import { useState } from "setsuna"
export function Comp() {
	//第二个参数为一个数组，数组中的函数会被当做管道函数
  const [num, setNum] = useState(0, [
    v => v + 1
  ])
  const add = () => setNum(num() + 1)

  return () => <div>
    <p>{num()}</p>
    <button onClick={add}>++</button>
  </div>
}
```

这个例子中，每次点击后，事件会 +1，新的值在改变后会经过管道，最终采用的值将会是管道处理后的返回值

关于规范的具体内容可以查看我们的另一个库 <a href="">@setsunajs/observable</a>





## useComputed

`useComputed`适用于作为派发状态，即当一个响应式的状态改变后，会触发自身的`getter`函数，然后计算最新的值

```javascript
import { useState, useComputed } from "setsuna"
export function Comp() {
  const [num, setNum] = useState(0)
  const add = () => setNum(num() + 1)
	
	const [num1] = useComputed([num], () => num() + 1)
  const [num2, setNum2] = useComputed([num], {
    get: () => num() + 1,
    set: (newValue) => num(newValue)
  })

  return () => <div>
    <p>{num()} -- {num1()} </p>
    <button onClick={add}>++</button>
  </div>
```

+ 创建期间有两个参数
  + 第一个参数是一个要观察的数组，可以接收多个响应式的值
  + 第二个参数有两种写法
    + 直接是函数的话，则为`getter`获取器函数
    + 如果是对象，则可以自定义`getter/setter 获取器/修改器`函数
+ 返回值和 `useState` 一致，但如果没有定义`setter`修改器，在修改时会报错





## useRef

`useRef` 是另一种形式的`useState`，唯一的区别在于，`useRef`的值被修改时，不会触发视图的更新

在获取 dom 节点时推荐使用使用

```javascript
import { useRef } from "setsuna"
export function Comp() {
  const [ref, setRef] = useRef(null)

  return () => <div ref={ref}></div>
```





## useEffect

用于监听响应式状态的改变

```javascript
import { useState, useEffect } from "setsuna"
export function Comp() {
  const [num, setNum] = useState(0)
  const add = () => {
    setNum(num() + 1)
  }
	
  useEffect([num], newValue => {
    console.log(newValue)
  })

  return () => <div>
    <p>{num()}</p>
    <button onClick={add}>++</button>
  </div>
}
```

参数分别为

+ 一个需要监听的响应式值组成的数组
+ 一个接收最新值的回调函数



## useProvide & useContext

用于**创建和消费，跨组件层级的响应式状态**

```javascript
import { useProvide, useContext } from "setsuna"
function App() {
  const [provide, setProvide] = useProvide("key", 0)
  const add = () => setProvide(provide() + 1)
  
  return <div>
 		<button onClick={add}>++</button>  
  	<hr />
    <Child1 />
  </div>
}

function Child1() {
  return () => <Child2 />
}

function Child2() {
  const ctx = useContext("key")
  return () => <div>ctx: {ctx()}</div>
}
```

`useProvide` 有两个参数，分别是

+ 唯一 key
+ 初始值

返回值和 `useState` 一致



`useContext` 有两个参数，分别是

+ 顶层`useProvide`提供的 key
+ 可选的默认值，如果在使用的过程中找不到顶层提供的值，则会采用默认值，如果该参数没有提供，默认是`undefined`

返回值是一个，永远返回当前上下文，使用 key 的最新值函数





## useMount

挂载相关的生命周期函数

```javascript
import { useMount } from "setsuna"

function Comp() {
	useMount(() => {
    console.log("第一段函数，在挂载到 DOM 后调用")
    
    return () => {
      console.log("第二段函数，在组件卸载后调用")
    }
  })
  return () => <div></div>
}
```

会发现并没有提供，挂载前，卸载前 这两个阶段的回调函数，这是有意为之

因为挂载前相当于，组件函数第一段执行期间

卸载前被用到的地方微乎其微，目前提供





## useUpdate

更新相关的生命周期函数

```javascript
import { useUpdate } from "setsuna"

function Comp() {
	useUpdate(() => {
    console.log("第一段函数，会在 `有效更新前` 调用 ")
    
    return () => {
      console.log("第二段函数，会在 `有效更新后 ` 调用")
    }
  })
  return () => <div></div>
}
```





## 调度 API

调度相关目前只有一个 `nextTick`函数，该函数不强制在组件的上下文期间调用，它会确保在组件更新完成后调用

可以认为这是一个能在组件外调用的 `useMount` 第一段函数

该函数接收一个回调函数

```javascript
import { nextTick } from "setsuna"

nextTick(() => {
  //do...
})
```





## Fragment

文档脆片，该组件在视图上不会渲染出实际的节点，用于解决组件必须被包裹在某个节点的问题

该组件会默认全局引入

```javascript
//import { Fragment } from "setsuna"

function Component() {
  //第一种方式
  return <>123</>
}

function Component() {
  //第二种方式
  return <Fragment>123</Fragment>
}
```





## Await

该组件为异步组件，该组件会扫描所有的**浅层节点（没有经过嵌套）**，如果存在`函数，Promise`则会执行他们并等待他们的完成

在等待过程中，会显示可选参数`fallback`参数的节点信息

该组件还有一个可选的active`参数，`active`接收一个函数，用于决定内部，是否应该重复执行内部所有的异步行为，默认为 `false`，即第一次执行完后，如果没有指定该参数，则后续永远都不会重新执行，同时也意味着，如果内部使用到了外部的响应式的值的话，此时不会进行更新

```javascript
export function Comp() {
  const [num, setNum] = useState(0)
  const add = () => {
    setNum(num() + 1)
  }


  return () => <div>
    <p>{num()}</p>
    <button onClick={add}>++</button>

    <Await active={() => num() % 2 === 0} fallback={<h1>占位节点</h1>}>
      { Promise.resolve(1) }
      { () => Promise.resolve(2) }
    </Await>
  </div>
}
```

该组件为其他框架中的`<Suspense/>`的下位替代品

在结合实际业务的运用场景，以`<Suspense/>`的创建初衷来说，现阶段用起来作者觉得并不是十分满意，但不能保证以后会有更加的使用场景，所以以`Await`为关键字作为同功能替代





## Teleport

传送门组件，可以将子节点挂载到指定的 DOM 节点上，对于`<Tost/>`这种弹窗组件会很好用

```javascript
import { Teleport } from "setsuna"

export function Comp() {
  const [num, setNum] = useState(0)
  const add = () => {
    setNum(num() + 1)
  }


  return () => <div>
    <p>{num()}</p>
    <button onClick={add}>++</button>
    { num % 2 === 0 ? <Teleport to="body">{num()}</Teleport> : null }
  </div>
}
```





## web component

`setsuna.js`支持把自己的运行时系统嵌到`web component`中使用，这也是最为广泛的用法

```javascript
import { defineElement } from "setsuna"
defineElement('custom-component', attrs => {
  const [num1, setNum1] = useState(0)
  const add = () => setNum1(num1() + 1)

  return () => (
    <div>web component</div>
  )
})

function App() {
  return () => <div> <custom-component/> </div>
}
```

上边的使用方式会定义一个全局的自定义标签，然后直接使用即可

同时还支持以下的做法，即把声明的内容作为一个组件来使用，行为同组件一致

```javascript
import { defineElement } from "setsuna"
const cusElement = defineElement('custom-component', attrs => {
  const [num1, setNum1] = useState(0)
  const add = () => setNum1(num1() + 1)

  return () => (
    <div>web component</div>
  )
})
const CustomComponent = cusElement.wrapper()

function App() {
  return () => <div> <CustomComponent/> </div>
}
```





## SSR

`renderToString`

```javascript
import { hydrate, renderToString } from "setsuna"

function App() {
  return () => <div>
  	hello component  
  </div>
}

//server
const generator = renderToString()
generator.subscribe(html => {
  console.log( html )//字符串化的值
})
generator.next(<App />)


//client
hydrate(html)
```

`renderToStream`还在实验阶段，不稳定

