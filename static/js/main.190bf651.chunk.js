(this["webpackJsonptwitter-topic-transitions"]=this["webpackJsonptwitter-topic-transitions"]||[]).push([[0],{188:function(e,t,n){},199:function(e,t,n){"use strict";n.r(t);var c=n(0),r=(n(186),n(187),n(188),n(19)),i=n(2),s=n(20),a=n(5),o=n.n(a),l=n(11),d=n(1),u=n(3),j=n(4),b=n(71),h=n.n(b),f=n(72),x=n.n(f),m=n(73),O=n.n(m),p=h()().dbscan,v=x()().layout,g=(O()().tsne,n(16));function w(e,t,n){if(0===e.length)return{x:0,y:0,s:1};var c=Math.min.apply(Math,Object(g.a)(e.map((function(e){return e.x-e.r})))),r=Math.max.apply(Math,Object(g.a)(e.map((function(e){return e.x+e.r})))),i=Math.min.apply(Math,Object(g.a)(e.map((function(e){return e.y-e.r})))),s=r-c,a=Math.max.apply(Math,Object(g.a)(e.map((function(e){return e.y+e.r}))))-i;return{x:c+s/2,y:i+a/2,s:Math.min(t/s,n/a)}}var y=function(e,t,n,c){var r=document.createElementNS("http://www.w3.org/2000/svg","text");r.textContent=e,r.setAttributeNS(null,"font-family",n),r.setAttributeNS(null,"font-weight",c);var i=document.createElementNS("http://www.w3.org/2000/svg","svg");i.appendChild(r),document.body.appendChild(i);for(var s=0,a=100,o=0;o<10;++o){var l=(s+a)/2;r.setAttributeNS(null,"font-size",l);var d=r.getBBox(),u=d.width,j=d.height;Math.sqrt(Math.pow(u,2)+Math.pow(j,2))/2<=t?s=l:a=l}return document.body.removeChild(i),s},N=function(e){return new Date(e.time).getTime()};function k(e){var t=new Date(e.time),n=new Date(e.stopTime);return 36e5*e.tweetCount/(n-t)}function C(){return W.apply(this,arguments)}function W(){return(W=Object(l.a)(o.a.mark((function e(){var t,n,c,r,i,s,a,l,d,b,h,f,x,m,O,g;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("data.json");case 2:return t=e.sent,e.next=5,t.json();case 5:n=e.sent,c=j.g(j.b).domain(j.a(n.dailyCount,N)),r=Object(u.a)(n.dailyCount);try{for(r.s();!(i=r.n()).done;)(s=i.value).color=c(N(s))}catch(o){r.e(o)}finally{r.f()}a=j.h().domain(j.a(n.topics,k)).range([3,15]),l=Object(u.a)(n.topics);try{for(l.s();!(d=l.n()).done;)(b=d.value).tweetPerHour=k(b),b.r=0,b.r0=a(b.tweetPerHour),b.color=c(N(b))}catch(o){l.e(o)}finally{l.f()}return h=j.h().domain(j.a(n.words,(function(e){return e.count}))).range([10,50]),n.words.forEach((function(e,t){e.x*=10,e.y*=10,e.r=h(e.count),e.fontSize=y(e.word,e.r,"700")})),f=20,e.next=17,p(n.words.map((function(e){return[e.x,e.y]})),f,2);case 17:return x=e.sent,(m=x.clusters).forEach((function(e,t){var c,r=Object(u.a)(e);try{for(r.s();!(c=r.n()).done;){var i=c.value;n.words[i].cluster=t}}catch(o){r.e(o)}finally{r.f()}})),e.next=22,v(n.words,f);case 22:return O=e.sent,g=j.f(j.j),n.words.forEach((function(e,t){var n=O[t],c=n.x,r=n.y;e.x=c,e.y=r,e.color=void 0===e.cluster?"lightgray":g(e.cluster)})),n.wordClusters=m,e.abrupt("return",n);case 27:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var T=Object(s.b)({name:"app",initialState:{topics:[],words:[],dailyCount:[],topicClusters:[],wordClusters:[],selectionRadius:3,selectedTopics:[],selectedWords:[],minWordCount:0},reducers:{loadData:function(e,t){return Object.assign({},e,t.payload)},updateSelectionRadius:function(e,t){return Object.assign({},e,{selectionRadius:t.payload})},selectTopics:function(e,t){return Object.assign({},e,{selectedTopics:t.payload})},updateMinWordCount:function(e,t){return Object.assign({},e,{minWordCount:t.payload})},toggleWord:function(e,t){var n=t.payload,c=e.selectedWords.indexOf(n),r=Array.from(e.selectedWords);return c<0?r.push(n):r.splice(c,1),Object.assign({},e,{selectedWords:r})}}}),S=n(13);function D(e){var t=e.render,n=Object(d.useRef)(),r=Object(d.useState)(0),i=Object(S.a)(r,2),s=i[0],a=i[1],o=Object(d.useState)(0),l=Object(S.a)(o,2),u=l[0],j=l[1];return Object(d.useEffect)((function(){function e(){a(n.current.clientWidth),j(n.current.clientHeight)}return e(),window.addEventListener("resize",e),function(){window.removeEventListener("resize",e)}}),[]),Object(c.jsx)("div",{style:{width:"100%",height:"100%"},ref:n,children:t(s,u)})}function M(e){var t=e.label,n=e.children;return Object(c.jsxs)("div",{className:"field is-horizontal",children:[Object(c.jsx)("div",{className:"field-label is-normal",children:Object(c.jsx)("label",{className:"label",children:t})}),Object(c.jsx)("div",{className:"field-body",children:n})]})}function z(e){var t=e.width,n=e.height,r=Object(i.b)(),s=Object(i.c)((function(e){return e.topics})),a=Object(i.c)((function(e){return e.selectionRadius})),d=Object(i.c)((function(e){var t=e.selectedTopics;return new Set(t)})),b=10,h=10,f=t-b-10,x=n-h-10,m=w(s,f,x),O=m.x,v=m.y,g=m.s;function y(e){return(e-O)*g}function N(e){return(e-v)*g}var k=j.c().x((function(e){return y(e.x)})).y((function(e){return N(e.y)})),C=j.k("%Y-%m-%d %H:%M");return Object(c.jsx)("svg",{viewBox:"0 0 ".concat(t," ").concat(n),children:Object(c.jsx)("g",{transform:"translate(".concat(b,", ").concat(h,")"),children:Object(c.jsxs)("g",{transform:"translate(".concat(f/2,",").concat(x/2,")"),children:[Object(c.jsx)("g",{children:Object(c.jsx)("path",{fill:"none",stroke:"lightgray",strokeWidth:"3",opacity:"0.5",d:k(s)})}),Object(c.jsx)("g",{children:s.map((function(e,t){return Object(c.jsx)("g",{className:"is-clickable",opacity:0===d.size||d.has(e.id)?1:.1,style:{transitionProperty:"opacity",transitionDuration:"1s",transitionTimingFunction:"ease"},transform:"translate(".concat(y(e.x),", ").concat(N(e.y),")"),onClick:Object(l.a)(o.a.mark((function t(){var n,c,i,l,j,b,h;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!d.has(e.id)){t.next=3;break}return r(T.actions.selectTopics([])),t.abrupt("return");case 3:return t.next=5,p(s.map((function(e){return[e.x,e.y]})),a,1);case 5:n=t.sent,c=n.clusters,i=Object(u.a)(c),t.prev=8,i.s();case 10:if((l=i.n()).done){t.next=32;break}j=l.value,b=Object(u.a)(j),t.prev=13,b.s();case 15:if((h=b.n()).done){t.next=22;break}if(h.value!==e.id){t.next=20;break}return r(T.actions.selectTopics(j)),t.abrupt("return");case 20:t.next=15;break;case 22:t.next=27;break;case 24:t.prev=24,t.t0=t.catch(13),b.e(t.t0);case 27:return t.prev=27,b.f(),t.finish(27);case 30:t.next=10;break;case 32:t.next=37;break;case 34:t.prev=34,t.t1=t.catch(8),i.e(t.t1);case 37:return t.prev=37,i.f(),t.finish(37);case 40:case"end":return t.stop()}}),t,null,[[8,34,37,40],[13,24,27,30]])}))),children:Object(c.jsx)("circle",{r:e.r0,opacity:"0.7",fill:e.color,children:Object(c.jsxs)("title",{children:[C(new Date(e.time)),"-",C(new Date(e.stopTime))]})})},t)}))})]})})})}function A(){var e=Object(i.b)(),t=Object(i.c)((function(e){return e.selectionRadius}));return Object(c.jsxs)("div",{style:{position:"relative",width:"100%",height:"100%"},children:[Object(c.jsx)("div",{className:"p-3",children:Object(c.jsx)(M,{label:"Selection Radius",children:Object(c.jsxs)("div",{className:"field has-addons",children:[Object(c.jsx)("div",{className:"control",children:Object(c.jsx)("button",{disabled:t<=0,className:"button",onClick:function(){e(T.actions.updateSelectionRadius(t-1))},children:Object(c.jsx)("span",{className:"icon",children:Object(c.jsx)("i",{className:"fas fa-minus"})})})}),Object(c.jsx)("div",{className:"control is-expanded",children:Object(c.jsx)("input",{className:"input",type:"number",min:"0",value:t,onChange:function(t){e(T.actions.updateSelectionRadius(+t.target.value))}})}),Object(c.jsx)("div",{className:"control",children:Object(c.jsx)("button",{className:"button",onClick:function(){e(T.actions.updateSelectionRadius(t+1))},children:Object(c.jsx)("span",{className:"icon",children:Object(c.jsx)("i",{className:"fas fa-plus"})})})})]})})}),Object(c.jsx)("div",{style:{position:"absolute",top:"64px",right:0,bottom:0,left:0},children:Object(c.jsx)(D,{render:function(e,t){return Object(c.jsx)(z,{width:e,height:t})}})})]})}function B(e){var t=e.width,n=e.height,r=Object(i.b)(),s=Object(i.c)((function(e){return e.topics})),a=Object(i.c)((function(e){return e.words})),o=Object(i.c)((function(e){return e.dailyCount})),l=Object(i.c)((function(e){var t=e.topics;return e.selectedTopics.map((function(e){return t[e]}))})),d=Object(i.c)((function(e){var t=e.selectedWords;return new Set(t)})),u=20,b=60,h=t-b-60,f=n-u-50,x="#363636",m=h/o.length+1,O=j.k("%Y-%m-%d"),p=j.i().domain(j.a(o,(function(e){return new Date(e.time)}))).range([m/2,h-m/2]),v=j.e().domain([0,j.d(o,(function(e){return e.tweetCount}))]).range([0,f]).nice(),g=j.e().domain([0,j.d(o,(function(e){return 0===d.size?100:j.d(Array.from(d),(function(t){return e.words[t]}))}))]).range([f,0]).nice();return Object(c.jsx)("svg",{width:t,height:n,children:Object(c.jsxs)("g",{transform:"translate(".concat(b,",").concat(u,")"),children:[Object(c.jsx)("g",{children:o.map((function(e,t){var n=new Date(e.time),i=new Date(n.getTime()+864e5),a=0===l.length||l.some((function(e){var t=new Date(e.time),c=new Date(e.stopTime);return n<=c&&t<=i}));return Object(c.jsx)("g",{style:{transitionProperty:"opacity",transitionDuration:"1s",transitionTimingFunction:"ease"},opacity:a?1:.1,children:Object(c.jsx)("rect",{className:"is-clickable",x:p(new Date(e.time))-m/2,y:f-v(e.tweetCount),width:m,height:v(e.tweetCount),fill:e.color,onClick:function(){0!==l.length&&a?r(T.actions.selectTopics([])):r(T.actions.selectTopics(s.filter((function(e){var t=new Date(e.time),c=new Date(e.stopTime);return n<=c&&t<=i})).map((function(e){return e.id}))))}})},e.time)}))}),Object(c.jsx)("g",{children:a.map((function(e){var t=j.c().x((function(e){return p(new Date(e.time))}));return d.has(e.id)?t.y((function(t){return g(t.words[e.id])})):t.y((function(){return g(0)})),Object(c.jsx)("g",{className:"is-clickable",onClick:function(){r(T.actions.toggleWord(e.id))},children:Object(c.jsx)("path",{style:{transitionPropery:"d",transitionDuration:"1s",transitionTimingFunction:"ease"},d:t(o),fill:"none",opacity:"0.9",stroke:d.has(e.id)?e.color:"none",strokeWidth:"5",children:Object(c.jsx)("title",{children:e.word})})},e.id)}))}),Object(c.jsx)("g",{children:a.map((function(e){if(!d.has(e.id))return null;var t=o.reduce((function(t,n,c){return n.words[e.id]>o[t].words[e.id]?c:t}),0),n=o[t];return Object(c.jsx)("g",{className:"is-clickable",onClick:function(){r(T.actions.toggleWord(e.id))},children:Object(c.jsx)("text",{x:p(new Date(n.time)),y:g(n.words[e.id]),textAnchor:"middle",dominantBaseline:"text-after-edge",fontWeight:"700",fontSize:"12",fill:x,children:e.word})},e.id)}))}),Object(c.jsxs)("g",{transform:"translate(0,".concat(f,")"),children:[Object(c.jsx)("line",{x1:"0",y1:"0",x2:h,y2:"0",stroke:x}),Object(c.jsx)("g",{children:p.ticks().map((function(e,t){return Object(c.jsxs)("g",{transform:"translate(".concat(p(e),",0)"),children:[Object(c.jsx)("line",{x1:"0",y1:"0",x2:"0",y2:"5",stroke:x}),Object(c.jsx)("g",{transform:"rotate(-30)",children:Object(c.jsx)("text",{x:"-5",textAnchor:"end",dominantBaseline:"text-before-edge",fontWeight:"700",fontSize:"10",fill:x,children:O(e)})})]},t)}))})]}),Object(c.jsxs)("g",{children:[Object(c.jsx)("text",{transform:"translate(-50,".concat(f/2,")rotate(-90)"),textAnchor:"middle",dominantBaseline:"central",fontWeight:"700",fontSize:"16",fill:x,children:"Tweet Count"}),Object(c.jsx)("line",{x1:"0",y1:f,x2:"0",y2:"0",stroke:x}),Object(c.jsx)("g",{children:v.ticks().map((function(e,t){return Object(c.jsxs)("g",{transform:"translate(0,".concat(f-v(e),")"),children:[Object(c.jsx)("line",{x1:"0",y1:"0",x2:"-5",y2:"0",stroke:x}),Object(c.jsx)("text",{x:"-7",textAnchor:"end",dominantBaseline:"central",fontWeight:"700",fontSize:"12",fill:x,children:e})]},t)}))})]}),Object(c.jsxs)("g",{transform:"translate(".concat(h,",0)"),children:[Object(c.jsx)("text",{transform:"translate(40,".concat(f/2,")rotate(-90)"),textAnchor:"middle",dominantBaseline:"central",fontWeight:"700",fontSize:"16",fill:x,children:"Word Occurence"}),Object(c.jsx)("line",{x1:"0",y1:f,x2:"0",y2:"0",stroke:x}),Object(c.jsx)("g",{children:g.ticks().map((function(e,t){return Object(c.jsxs)("g",{transform:"translate(0,".concat(g(e),")"),children:[Object(c.jsx)("line",{x1:"0",y1:"0",x2:"5",y2:"0",stroke:x}),Object(c.jsx)("text",{x:"7",textAnchor:"start",dominantBaseline:"central",fontWeight:"700",fontSize:"12",fill:x,children:e})]},t)}))})]})]})})}function R(){return Object(c.jsx)(D,{render:function(e,t){return Object(c.jsx)(B,{width:e,height:t})}})}function E(e){var t=e.width,n=e.height,r=Object(i.b)(),s=Object(i.c)((function(e){return e.words})),a=Object(i.c)((function(e){return e.selectedTopics})),o=Object(i.c)((function(e){var t=e.selectedWords;return new Set(t)})),l=Object(i.c)((function(e){return e.minWordCount})),d=10,u=10,j=t-d-10,b=n-u-10,h=w(s,j,b),f=h.x,x=h.y,m=h.s;return Object(c.jsx)("svg",{viewBox:"0 0 ".concat(t," ").concat(n),children:Object(c.jsx)("g",{transform:"translate(".concat(d,", ").concat(u,")"),children:Object(c.jsx)("g",{transform:"translate(".concat(j/2,",").concat(b/2,")"),children:Object(c.jsx)("g",{transform:"scale(".concat(m,")"),children:Object(c.jsx)("g",{transform:"translate(".concat(-f,",").concat(-x,")"),children:s.map((function(e){var t=0===a.length?e.count:a.reduce((function(t,n){return t+e.topicCount[n]}),0),n=t<l?0:1,i=Math.sqrt(t/e.count);return Object(c.jsxs)("g",{className:"is-clickable",opacity:n,style:{transitionProperty:"opacity",transitionDuration:"1s",transitionTimingFunction:"ease"},transform:"translate(".concat(e.x,", ").concat(e.y,")"),onClick:function(){r(T.actions.toggleWord(e.id))},children:[Object(c.jsx)("title",{children:"".concat(e.word)}),Object(c.jsx)("circle",{r:e.r,opacity:i,style:{transitionProperty:"opacity",transitionDuration:"1s",transitionTimingFunction:"ease"},fill:e.color}),Object(c.jsx)("circle",{r:e.r,fill:"none",stroke:o.has(e.id)?"#363636":"none",strokeWidth:"2"}),Object(c.jsx)("text",{className:"is-unselectable",fontSize:e.fontSize,textAnchor:"middle",dominantBaseline:"central",fontWeight:"700",fill:"#363636",children:e.word})]},e.id)}))})})})})})}function F(e){var t=e.words,n=e.selectedTopics,r=Object(i.b)(),s=Object(i.c)((function(e){return e.minWordCount}));return Object(c.jsxs)("div",{style:{position:"relative",width:"100%",height:"100%"},children:[Object(c.jsx)("div",{className:"p-3",children:Object(c.jsx)(M,{label:"Min Word Count",children:Object(c.jsxs)("div",{className:"field has-addons",children:[Object(c.jsx)("div",{className:"control",children:Object(c.jsx)("button",{disabled:s<=0,className:"button",onClick:function(){r(T.actions.updateMinWordCount(s-1))},children:Object(c.jsx)("span",{className:"icon",children:Object(c.jsx)("i",{className:"fas fa-minus"})})})}),Object(c.jsx)("div",{className:"control is-expanded",children:Object(c.jsx)("input",{className:"input",type:"number",min:"1",value:s,onChange:function(e){r(T.actions.updateMinWordCount(+e.target.value))}})}),Object(c.jsx)("div",{className:"control",children:Object(c.jsx)("button",{className:"button",onClick:function(){r(T.actions.updateMinWordCount(s+1))},children:Object(c.jsx)("span",{className:"icon",children:Object(c.jsx)("i",{className:"fas fa-plus"})})})})]})})}),Object(c.jsx)("div",{style:{position:"absolute",top:"64px",right:0,bottom:0,left:0},children:Object(c.jsx)(D,{render:function(e,r){return Object(c.jsx)(E,{words:t,selectedTopics:n,width:e,height:r})}})})]})}var P=function(){var e=Object(i.b)();return Object(d.useEffect)((function(){Object(l.a)(o.a.mark((function t(){var n;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,C();case 2:n=t.sent,e(T.actions.loadData(n));case 4:case"end":return t.stop()}}),t)})))()}),[e]),Object(c.jsxs)(c.Fragment,{children:[Object(c.jsxs)("nav",{className:"navbar is-info",role:"navigation","aria-label":"main navigation",children:[Object(c.jsx)("div",{className:"navbar-brand",children:Object(c.jsx)("a",{className:"navbar-item",href:".",children:Object(c.jsx)("h1",{children:"Visualization of Twitter Toppic Toransitions"})})}),Object(c.jsxs)("div",{className:"navbar-menu",children:[Object(c.jsx)("div",{className:"navbar-start",children:Object(c.jsx)("a",{className:"navbar-item",href:".",onClick:function(e){e.preventDefault(),alert("Demo application for viaulization of twitter topic transitions.\nRecommended display resolution: Over Full HD\nDeveloped by: https://vdslab.jp")},children:"About"})}),Object(c.jsx)("div",{className:"navbar-end",children:Object(c.jsx)("div",{className:"navbar-item",children:Object(c.jsxs)("div",{className:"buttons",children:[Object(c.jsx)("button",{className:"button",onClick:function(){e(T.actions.selectTopics([]))},children:"Clear Selection"}),Object(c.jsx)("button",{className:"button",onClick:function(){document.querySelector("#content").requestFullscreen()},children:Object(c.jsx)("span",{className:"icon",children:Object(c.jsx)("i",{className:"fas fa-expand"})})}),Object(c.jsx)("button",{className:"button",onClick:function(){alert("TBD")},children:Object(c.jsx)("span",{className:"icon",children:Object(c.jsx)("i",{className:"fas fa-cogs"})})})]})})})]})]}),Object(c.jsx)("main",{className:"main has-background-info-light",children:Object(c.jsxs)("div",{className:"main-contents",children:[Object(c.jsx)("div",{className:"timeline-view p-3",children:Object(c.jsx)("div",{className:"box is-paddingless is-radiusless",children:Object(c.jsx)(R,{})})}),Object(c.jsx)("div",{className:"projection-view p-3",children:Object(c.jsx)("div",{className:"box is-paddingless is-radiusless",children:Object(c.jsx)(A,{})})}),Object(c.jsx)("div",{className:"word-bubble-view p-3",children:Object(c.jsx)("div",{className:"box is-paddingless is-radiusless",children:Object(c.jsx)(F,{})})})]})})]})},q=Object(s.a)({reducer:T.reducer,middleware:function(e){return e({immutableCheck:!1,serializableCheck:!1})}});Object(r.render)(Object(c.jsx)(i.a,{store:q,children:Object(c.jsx)(P,{})}),document.querySelector("#content"))},71:function(e,t,n){var c=n(28),r=["dbscan"];e.exports=function(){var e=new Worker(n.p+"0122b5b0cedbbdb80a18.worker.js",{name:"[hash].worker.js"});return c(e,r),e}},72:function(e,t,n){var c=n(28),r=["layout"];e.exports=function(){var e=new Worker(n.p+"b518c8092a4e2e3e1009.worker.js",{name:"[hash].worker.js"});return c(e,r),e}},73:function(e,t,n){var c=n(28),r=["tsne"];e.exports=function(){var e=new Worker(n.p+"9398b91f8e7660e9636f.worker.js",{name:"[hash].worker.js"});return c(e,r),e}}},[[199,1,2]]]);
//# sourceMappingURL=main.190bf651.chunk.js.map