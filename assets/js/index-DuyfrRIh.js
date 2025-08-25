const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/js/Home-DdqSaekX.js","assets/js/animations-Cw36nGPf.js","assets/js/vendor-DEQ385Nk.js"])))=>i.map(i=>d[i]);
import{r as e,a as t,g as a}from"./vendor-DEQ385Nk.js";import{r as s,R as r,A as o,m as i}from"./animations-Cw36nGPf.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const a of e)if("childList"===a.type)for(const e of a.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)}).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?t.credentials="include":"anonymous"===e.crossOrigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();var n,l,c={exports:{}},d={};var m,u=(l||(l=1,c.exports=function(){if(n)return d;n=1;var t=e(),a=Symbol.for("react.element"),s=Symbol.for("react.fragment"),r=Object.prototype.hasOwnProperty,o=t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,i={key:!0,ref:!0,__self:!0,__source:!0};function l(e,t,s){var n,l={},c=null,d=null;for(n in void 0!==s&&(c=""+s),void 0!==t.key&&(c=""+t.key),void 0!==t.ref&&(d=t.ref),t)r.call(t,n)&&!i.hasOwnProperty(n)&&(l[n]=t[n]);if(e&&e.defaultProps)for(n in t=e.defaultProps)void 0===l[n]&&(l[n]=t[n]);return{$$typeof:a,type:e,key:c,ref:d,props:l,_owner:o.current}}return d.Fragment=s,d.jsx=l,d.jsxs=l,d}()),c.exports),p={};const h=a(function(){if(m)return p;m=1;var e=t();return p.createRoot=e.createRoot,p.hydrateRoot=e.hydrateRoot,p}());let x,f,g,b={data:""},y=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,v=/\/\*[^]*?\*\/|  +/g,w=/\n+/g,j=(e,t)=>{let a="",s="",r="";for(let o in e){let i=e[o];"@"==o[0]?"i"==o[1]?a=o+" "+i+";":s+="f"==o[1]?j(i,o):o+"{"+j(i,"k"==o[1]?"":t)+"}":"object"==typeof i?s+=j(i,t?t.replace(/([^,])+/g,e=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):o):null!=i&&(o=/^--/.test(o)?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=j.p?j.p(o,i):o+":"+i+";")}return a+(t&&r?t+"{"+r+"}":r)+s},N={},k=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+k(e[a]);return t}return e};function C(e){let t=this||{},a=e.call?e(t.p):e;return((e,t,a,s,r)=>{let o=k(e),i=N[o]||(N[o]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(o));if(!N[i]){let t=o!==e?e:(e=>{let t,a,s=[{}];for(;t=y.exec(e.replace(v,""));)t[4]?s.shift():t[3]?(a=t[3].replace(w," ").trim(),s.unshift(s[0][a]=s[0][a]||{})):s[0][t[1]]=t[2].replace(w," ").trim();return s[0]})(e);N[i]=j(r?{["@keyframes "+i]:t}:t,a?"":"."+i)}let n=a&&N.g?N.g:null;return a&&(N.g=N[i]),l=N[i],c=t,d=s,(m=n)?c.data=c.data.replace(m,l):-1===c.data.indexOf(l)&&(c.data=d?l+c.data:c.data+l),i;var l,c,d,m})(a.unshift?a.raw?((e,t,a)=>e.reduce((e,s,r)=>{let o=t[r];if(o&&o.call){let e=o(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;o=t?"."+t:e&&"object"==typeof e?e.props?"":j(e,""):!1===e?"":e}return e+s+(null==o?"":o)},""))(a,[].slice.call(arguments,1),t.p):a.reduce((e,a)=>Object.assign(e,a&&a.call?a(t.p):a),{}):a,(s=t.target,"object"==typeof window?((s?s.querySelector("#_goober"):window._goober)||Object.assign((s||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:s||b),t.g,t.o,t.k);var s}C.bind({g:1});let E=C.bind({k:1});function I(e,t){let a=this||{};return function(){let t=arguments;return function s(r,o){let i=Object.assign({},r),n=i.className||s.className;a.p=Object.assign({theme:f&&f()},i),a.o=/ *go\d+/.test(n),i.className=C.apply(a,t)+(n?" "+n:"");let l=e;return e[0]&&(l=i.as||e,delete i.as),g&&l[0]&&g(i),x(l,i)}}}var S=(e,t)=>(e=>"function"==typeof e)(e)?e(t):e,A=(()=>{let e=0;return()=>(++e).toString()})(),L=(()=>{let e;return()=>{if(void 0===e&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),$="default",T=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:s}=t;return T(e,{type:e.toasts.find(e=>e.id===s.id)?1:0,toast:s});case 3:let{toastId:r}=t;return{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let o=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+o}))}}},z=[],D={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},O={},R=(e,t=$)=>{O[t]=T(O[t]||D,e),z.forEach(([e,a])=>{e===t&&a(O[t])})},_=e=>Object.keys(O).forEach(t=>R(e,t)),M=(e=$)=>t=>{R(t,e)},P={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},U=e=>(t,a)=>{let s=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||A()}))(t,e,a);return M(s.toasterId||(e=>Object.keys(O).find(t=>O[t].toasts.some(t=>t.id===e)))(s.id))({type:2,toast:s}),s.id},H=(e,t)=>U("blank")(e,t);H.error=U("error"),H.success=U("success"),H.loading=U("loading"),H.custom=U("custom"),H.dismiss=(e,t)=>{let a={type:3,toastId:e};t?M(t)(a):_(a)},H.dismissAll=e=>H.dismiss(void 0,e),H.remove=(e,t)=>{let a={type:4,toastId:e};t?M(t)(a):_(a)},H.removeAll=e=>H.remove(void 0,e),H.promise=(e,t,a)=>{let s=H.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?S(t.success,e):void 0;return r?H.success(r,{id:s,...a,...null==a?void 0:a.success}):H.dismiss(s),e}).catch(e=>{let r=t.error?S(t.error,e):void 0;r?H.error(r,{id:s,...a,...null==a?void 0:a.error}):H.dismiss(s)}),e};var F,B,q,K,W=(e,t="default")=>{let{toasts:a,pausedAt:r}=((e={},t=$)=>{let[a,r]=s.useState(O[t]||D),o=s.useRef(O[t]);s.useEffect(()=>(o.current!==O[t]&&r(O[t]),z.push([t,r]),()=>{let e=z.findIndex(([e])=>e===t);e>-1&&z.splice(e,1)}),[t]);let i=a.toasts.map(t=>{var a,s,r;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(s=e[t.type])?void 0:s.duration)||(null==e?void 0:e.duration)||P[t.type],style:{...e.style,...null==(r=e[t.type])?void 0:r.style,...t.style}}});return{...a,toasts:i}})(e,t),o=s.useRef(new Map).current,i=s.useCallback((e,t=1e3)=>{if(o.has(e))return;let a=setTimeout(()=>{o.delete(e),n({type:4,toastId:e})},t);o.set(e,a)},[]);s.useEffect(()=>{if(r)return;let e=Date.now(),s=a.map(a=>{if(a.duration===1/0)return;let s=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(!(s<0))return setTimeout(()=>H.dismiss(a.id,t),s);a.visible&&H.dismiss(a.id)});return()=>{s.forEach(e=>e&&clearTimeout(e))}},[a,r,t]);let n=s.useCallback(M(t),[t]),l=s.useCallback(()=>{n({type:5,time:Date.now()})},[n]),c=s.useCallback((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),d=s.useCallback(()=>{r&&n({type:6,time:Date.now()})},[r,n]),m=s.useCallback((e,t)=>{let{reverseOrder:s=!1,gutter:r=8,defaultPosition:o}=t||{},i=a.filter(t=>(t.position||o)===(e.position||o)&&t.height),n=i.findIndex(t=>t.id===e.id),l=i.filter((e,t)=>t<n&&e.visible).length;return i.filter(e=>e.visible).slice(...s?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+r,0)},[a]);return s.useEffect(()=>{a.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=o.get(e.id);t&&(clearTimeout(t),o.delete(e.id))}})},[a,i]),{toasts:a,handlers:{updateHeight:c,startPause:l,endPause:d,calculateOffset:m}}},Y=E`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,V=E`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,G=E`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,J=I("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Y} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${V} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${G} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Z=E`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Q=I("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${Z} 1s linear infinite;
`,X=E`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,ee=E`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,te=I("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${X} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${ee} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,ae=I("div")`
  position: absolute;
`,se=I("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,re=E`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,oe=I("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${re} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,ie=({toast:e})=>{let{icon:t,type:a,iconTheme:r}=e;return void 0!==t?"string"==typeof t?s.createElement(oe,null,t):t:"blank"===a?null:s.createElement(se,null,s.createElement(Q,{...r}),"loading"!==a&&s.createElement(ae,null,"error"===a?s.createElement(J,{...r}):s.createElement(te,{...r})))},ne=e=>`\n0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}\n100% {transform: translate3d(0,0,0) scale(1); opacity:1;}\n`,le=e=>`\n0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}\n100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}\n`,ce=I("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,de=I("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,me=s.memo(({toast:e,position:t,style:a,children:r})=>{let o=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[s,r]=L()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[ne(a),le(a)];return{animation:t?`${E(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${E(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=s.createElement(ie,{toast:e}),n=s.createElement(de,{...e.ariaProps},S(e.message,e));return s.createElement(ce,{className:e.className,style:{...o,...a,...e.style}},"function"==typeof r?r({icon:i,message:n}):s.createElement(s.Fragment,null,i,n))});F=s.createElement,j.p=B,x=F,f=q,g=K;var ue=({id:e,className:t,style:a,onHeightUpdate:r,children:o})=>{let i=s.useCallback(t=>{if(t){let a=()=>{let a=t.getBoundingClientRect().height;r(e,a)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return s.createElement("div",{ref:i,className:t,style:a},o)},pe=C`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,he=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:r,children:o,toasterId:i,containerStyle:n,containerClassName:l})=>{let{toasts:c,handlers:d}=W(a,i);return s.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(a=>{let i=a.position||t,n=((e,t)=>{let a=e.includes("top"),s=a?{top:0}:{bottom:0},r=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:L()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(a?1:-1)}px)`,...s,...r}})(i,d.calculateOffset(a,{reverseOrder:e,gutter:r,defaultPosition:t}));return s.createElement(ue,{id:a.id,key:a.id,onHeightUpdate:d.updateHeight,className:a.visible?pe:"",style:n},"custom"===a.type?S(a.message,a):o?o(a):s.createElement(me,{toast:a,position:i}))}))},xe=H;const fe={},ge=function(e,t,a){let s=Promise.resolve();if(t&&t.length>0){let e=function(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:"fulfilled",value:e}),e=>({status:"rejected",reason:e}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),r=a?.nonce||a?.getAttribute("nonce");s=e(t.map(e=>{if((e=function(e){return"/"+e}(e))in fe)return;fe[e]=!0;const t=e.endsWith(".css"),a=t?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${e}"]${a}`))return;const s=document.createElement("link");return s.rel=t?"stylesheet":"modulepreload",t||(s.as="script"),s.crossOrigin="",s.href=e,r&&s.setAttribute("nonce",r),document.head.appendChild(s),t?new Promise((t,a)=>{s.addEventListener("load",t),s.addEventListener("error",()=>a(new Error(`Unable to preload CSS for ${e}`)))}):void 0}))}function r(e){const t=new Event("vite:preloadError",{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return s.then(t=>{for(const e of t||[])"rejected"===e.status&&r(e.reason);return e().catch(r)})};class be extends r.Component{constructor(e){super(e),this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(e){return{hasError:!0}}componentDidCatch(e,t){this.setState({error:e,errorInfo:t})}render(){return this.state.hasError?u.jsx("div",{className:"min-h-screen flex items-center justify-center bg-slate-900",children:u.jsxs("div",{className:"text-center p-8",children:[u.jsxs("div",{className:"mb-8",children:[u.jsx("div",{className:"w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-4",children:u.jsx("svg",{className:"w-10 h-10 text-red-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:u.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"})})}),u.jsx("h1",{className:"text-2xl font-bold text-white mb-2",children:"Algo salió mal"}),u.jsx("p",{className:"text-gray-300 mb-6",children:"Ha ocurrido un error inesperado. Por favor, recarga la página."})]}),u.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4",children:[u.jsx("button",{onClick:()=>window.location.reload(),className:"bg-yellow-500 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors",children:"Recargar página"}),u.jsx("button",{onClick:()=>window.location.href="/",className:"border border-yellow-500/50 text-yellow-500 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500/10 transition-colors",children:"Ir al inicio"})]})]})}):this.props.children}}const ye={whatsapp:{number:"+19298336069",channel:"https://tr.ee/WhatsAppChannel-iku-cabalactiva"},email:"kabbalahuniversal@gmail.com",instagram:"https://instagram.com/ikuuniversal",facebook:{institute:"https://facebook.com/institutokabbalahuniversal"},youtube:"https://youtube.com/@kabbalahu",tiktok:"https://tiktok.com/@ikuuniversal",telegram:"https://t.me/IKUUNIVERSAL"},ve={defaultTitle:"IKU Cábala Activa | Herramientas Espirituales del Maestro Isaac Benzaquén",defaultDescription:"Descubre la sabiduría ancestral de la Cábala con herramientas espirituales personalizadas: Carta Astral, Constelación Familiar, Limpieza Áurica y Meditación Cabalística.",keywords:["cábala","kabbalah","Isaac Benzaquén","carta astral cabalística","constelación familiar","limpieza áurica","meditación cabalística","espiritualidad","desarrollo personal","sabiduría ancestral","árbol de la vida","crecimiento espiritual"],ogImage:"https://iku-cabalactiva.com/images/og-image.jpg"},we="19298336069",je=(e="whatsapp")=>{switch(e){case"whatsapp":default:return we;case"display":return"+1 929-833-6069";case"international":return"+1 (929) 833-6069"}},Ne=e=>e.replace(/[^0-9]/g,"")===we,ke=(e="")=>{try{const t=((e="")=>{Ne(ye.whatsapp.number);const t=je("whatsapp"),a=encodeURIComponent(e);return`https://wa.me/${t}${e?`?text=${a}`:""}`})(e);window.open(t,"_blank")||(window.location.href=t)}catch(t){const a=je("whatsapp");window.location.href=`https://wa.me/${a}${e?`?text=${encodeURIComponent(e)}`:""}`}},Ce={general:"Hola, quiero información sobre Cábala Activa. ¿Podrías guiarme?",consulta:"Hola, tengo algunas preguntas sobre las herramientas cabalísticas.",sesion:"Hola, me gustaría agendar una sesión. ¿Cuál es la disponibilidad?"},Ee=()=>{const[e,t]=s.useState(!1),[a,r]=s.useState(!1);s.useEffect(()=>{const e=()=>{r(window.scrollY>50)};return window.addEventListener("scroll",e),()=>window.removeEventListener("scroll",e)},[]);const n=e=>{const t=document.getElementById(e);t&&t.scrollIntoView({behavior:"smooth"})},l=[{id:"hero",label:"Inicio"},{id:"herramientas",label:"Herramientas"},{id:"maestro",label:"Maestro"},{id:"pricing",label:"Precios"},{id:"testimonios",label:"Testimonios"},{id:"contact",label:"Contacto"}];return u.jsx("header",{className:"fixed top-0 w-full z-40 transition-all duration-300 "+(a?"bg-slate-900/95 backdrop-blur-lg border-b border-yellow-500/20 shadow-lg":"bg-transparent"),children:u.jsxs("nav",{className:"container mx-auto px-4 sm:px-6 lg:px-8",children:[u.jsxs("div",{className:"flex items-center justify-between h-16 lg:h-20",children:[u.jsxs("button",{onClick:()=>n("hero"),className:"flex items-center space-x-3 group",children:[u.jsx("div",{className:"w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300",children:u.jsx("span",{className:"text-slate-900 font-bold text-lg lg:text-xl",children:"IKU"})}),u.jsxs("div",{className:"hidden sm:block",children:[u.jsx("div",{className:"text-white font-semibold text-lg lg:text-xl",children:"IKU Cábala Activa"}),u.jsx("div",{className:"text-yellow-500 text-xs lg:text-sm",children:"Sabiduría Ancestral"})]})]}),u.jsx("div",{className:"hidden lg:flex items-center space-x-8",children:l.map(e=>u.jsxs("button",{onClick:()=>n(e.id),className:"text-gray-300 hover:text-yellow-500 transition-colors duration-200 relative group",children:[e.label,u.jsx("span",{className:"absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-200 group-hover:w-full"})]},e.id))}),u.jsxs("div",{className:"flex items-center space-x-4",children:[u.jsxs("button",{onClick:()=>ke(Ce.general),className:"hidden sm:flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200",children:[u.jsx("span",{children:"💬"}),u.jsx("span",{className:"hidden md:inline",children:"WhatsApp"})]}),u.jsx("button",{onClick:()=>t(!e),className:"lg:hidden text-white hover:text-yellow-500 transition-colors duration-200",children:e?u.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:u.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})}):u.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:u.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 6h16M4 12h16M4 18h16"})})})]})]}),u.jsx(o,{children:e&&u.jsx(i.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},className:"lg:hidden bg-slate-800/95 backdrop-blur-lg rounded-lg mt-2 overflow-hidden relative z-50",children:u.jsxs("div",{className:"px-4 py-6 space-y-4",children:[l.map(e=>u.jsx("button",{onClick:a=>{a.preventDefault(),a.stopPropagation(),t(!1),setTimeout(()=>{n(e.id)},100)},className:"block w-full text-left text-gray-300 hover:text-yellow-500 transition-colors duration-200 py-2 cursor-pointer",style:{pointerEvents:"auto",touchAction:"manipulation",userSelect:"none"},children:e.label},e.id)),u.jsxs("button",{onClick:()=>{ke(Ce.general),t(!1)},className:"flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 w-full justify-center cursor-pointer",style:{pointerEvents:"auto",touchAction:"manipulation",userSelect:"none"},children:[u.jsx("span",{children:"💬"}),u.jsx("span",{children:"Contactar por WhatsApp"})]})]})})})]})})},Ie=({variant:e="default",className:t=""})=>{const a=[{name:"WhatsApp",url:ye.whatsapp.channel,icon:"💬",color:"hover:text-green-500"},{name:"Instagram",url:ye.instagram,icon:"📷",color:"hover:text-pink-500"},{name:"Facebook",url:ye.facebook.institute,icon:"📘",color:"hover:text-blue-500"},{name:"YouTube",url:ye.youtube,icon:"📺",color:"hover:text-red-500"},{name:"TikTok",url:ye.tiktok,icon:"🎵",color:"hover:text-purple-500"},{name:"Telegram",url:ye.telegram,icon:"✈️",color:"hover:text-blue-400"}],s="footer"===e?"flex space-x-4":"flex flex-wrap gap-3";return u.jsx("div",{className:`${s} ${t}`,children:a.map(t=>u.jsxs("a",{href:t.url,target:"_blank",rel:"noopener noreferrer",className:`text-gray-300 ${t.color} transition-colors duration-200 flex items-center space-x-2`,title:`Síguenos en ${t.name}`,children:[u.jsx("span",{className:"text-xl",children:t.icon}),"extended"===e&&u.jsx("span",{className:"text-sm",children:t.name})]},t.name))})},Se=()=>{const e=(new Date).getFullYear();return u.jsx("footer",{className:"bg-slate-900 border-t border-yellow-500/20",children:u.jsxs("div",{className:"container mx-auto px-6 py-12",children:[u.jsxs("div",{className:"grid md:grid-cols-4 gap-8",children:[u.jsxs("div",{className:"md:col-span-2",children:[u.jsxs("div",{className:"flex items-center space-x-3 mb-4",children:[u.jsx("div",{className:"w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-full flex items-center justify-center",children:u.jsx("span",{className:"text-slate-900 font-bold text-lg",children:"IKU"})}),u.jsxs("div",{children:[u.jsx("div",{className:"text-white font-semibold text-lg",children:"Instituto de Kabbalah Universal"}),u.jsx("div",{className:"text-yellow-500 text-sm",children:"IKU Cábala Activa"})]})]}),u.jsx("p",{className:"text-gray-300 text-sm leading-relaxed mb-4",children:"Conecta con la sabiduría ancestral de la Cábala קבלה a través de herramientas espirituales personalizadas del Maestro y Rabino Isaac Benzaquén."}),u.jsx(Ie,{variant:"footer"})]}),u.jsxs("div",{children:[u.jsx("h3",{className:"text-white font-semibold mb-4",children:"Enlaces Rápidos"}),u.jsxs("ul",{className:"space-y-2",children:[u.jsx("li",{children:u.jsx("a",{href:"#herramientas",className:"text-gray-300 hover:text-yellow-500 transition-colors text-sm",children:"Herramientas"})}),u.jsx("li",{children:u.jsx("a",{href:"#maestro",className:"text-gray-300 hover:text-yellow-500 transition-colors text-sm",children:"Sobre el Maestro"})}),u.jsx("li",{children:u.jsx("a",{href:"#pricing",className:"text-gray-300 hover:text-yellow-500 transition-colors text-sm",children:"Precios"})}),u.jsx("li",{children:u.jsx("a",{href:"#testimonios",className:"text-gray-300 hover:text-yellow-500 transition-colors text-sm",children:"Testimonios"})}),u.jsx("li",{children:u.jsx("a",{href:"#contact",className:"text-gray-300 hover:text-yellow-500 transition-colors text-sm",children:"Contacto"})})]})]}),u.jsxs("div",{children:[u.jsx("h3",{className:"text-white font-semibold mb-4",children:"Contacto"}),u.jsxs("div",{className:"space-y-2",children:[u.jsxs("p",{className:"text-gray-300 text-sm",children:["📧 ",ye.email]}),u.jsxs("p",{className:"text-gray-300 text-sm",children:["💬 WhatsApp: ",ye.whatsapp.number]}),u.jsx("p",{className:"text-gray-300 text-sm",children:"🌐 iku-cabalactiva.com"}),u.jsx("p",{className:"text-gray-300 text-sm",children:"🇻🇪 Venezuela"})]})]})]}),u.jsxs("div",{className:"border-t border-gray-700 mt-8 pt-8 text-center",children:[u.jsxs("p",{className:"text-gray-400 text-sm",children:["© ",e," Instituto de Kabbalah Universal - IKU Cábala Activa. Todos los derechos reservados."]}),u.jsx("p",{className:"text-gray-400 text-xs mt-2",children:"Maestro y Rabino Isaac Benzaquén | Transformación espiritual a través de la Kabbalah קבלה"})]})]})})},Ae=()=>(s.useEffect(()=>{window.scrollTo(0,0)},[]),null),Le=({title:e=ve.defaultTitle,description:t=ve.defaultDescription,keywords:a=ve.keywords.join(", "),image:r=ve.ogImage,url:o="https://iku-cabalactiva.com/"})=>u.jsxs(u.Fragment,{children:[u.jsx("title",{children:e}),u.jsx("meta",{name:"description",content:t}),u.jsx("meta",{name:"keywords",content:a}),u.jsx("meta",{property:"og:title",content:e}),u.jsx("meta",{property:"og:description",content:t}),u.jsx("meta",{property:"og:type",content:"website"}),u.jsx("meta",{property:"og:url",content:o}),u.jsx("meta",{property:"og:image",content:r}),u.jsx("meta",{name:"twitter:card",content:"summary_large_image"}),u.jsx("meta",{name:"twitter:title",content:e}),u.jsx("meta",{name:"twitter:description",content:t}),u.jsx("meta",{name:"twitter:image",content:r}),u.jsx("link",{rel:"canonical",href:o}),u.jsx("script",{type:"application/ld+json",children:s.useMemo(()=>JSON.stringify({"@context":"https://schema.org","@type":"Organization",name:"IKU Cábala Activa",url:"https://iku-cabalactiva.com",logo:"https://iku-cabalactiva.com/images/logo.png",description:"Instituto de Kabbalah Universal especializado en herramientas espirituales cabalísticas",founder:{"@type":"Person",name:"Isaac Benzaquén",jobTitle:"Maestro y Rabino de Cábala"},serviceType:["Carta Astral Cabalística","Constelación Familiar","Limpieza Áurica","Meditación Cabalística"],areaServed:"Worldwide",availableLanguage:["Spanish","English","Hebrew"]}),[])})]}),$e=()=>{const[e,t]=s.useState(!0),[a,r]=s.useState(!1);return e?u.jsxs("div",{className:"fixed bottom-6 right-6 z-50",children:[u.jsx(o,{children:a&&u.jsxs(i.div,{initial:{opacity:0,x:20},animate:{opacity:1,x:0},exit:{opacity:0,x:20},className:"absolute bottom-16 right-0 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg whitespace-nowrap",children:[u.jsx("div",{className:"text-sm font-semibold",children:"¿Necesitas ayuda?"}),u.jsx("div",{className:"text-xs text-gray-300",children:"Escríbenos por WhatsApp"}),u.jsx("div",{className:"absolute -bottom-1 right-4 w-2 h-2 bg-slate-800 transform rotate-45"})]})}),u.jsx(i.button,{initial:{scale:0},animate:{scale:1},whileHover:{scale:1.1},whileTap:{scale:.9},onClick:()=>{ke(Ce.general)},onMouseEnter:()=>r(!0),onMouseLeave:()=>r(!1),className:"w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200",children:u.jsx("svg",{className:"w-8 h-8 text-white",fill:"currentColor",viewBox:"0 0 24 24",children:u.jsx("path",{d:"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"})})}),u.jsx("button",{onClick:()=>t(!1),className:"absolute -top-2 -right-2 w-6 h-6 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center text-white text-xs",children:"×"})]}):null},Te=({size:e="default",message:t})=>u.jsxs("div",{className:"flex flex-col items-center justify-center min-h-[200px] space-y-4",children:[u.jsx(i.div,{className:`${{small:"w-6 h-6",default:"w-12 h-12",large:"w-16 h-16"}[e]} border-4 border-yellow-500/30 border-t-yellow-500 rounded-full`,animate:{rotate:360},transition:{duration:1,repeat:1/0,ease:"linear"}}),t&&u.jsx(i.p,{className:"text-gray-300 text-sm",initial:{opacity:0},animate:{opacity:1},transition:{delay:.2},children:t})]}),ze=()=>{const[e,t]=s.useState(!1),[a,r]=s.useState("");s.useEffect(()=>{const e=e=>{e.clientY<=0&&!localStorage.getItem("exitIntentShown")&&(t(!0),localStorage.setItem("exitIntentShown","true"))};return document.addEventListener("mouseleave",e),()=>document.removeEventListener("mouseleave",e)},[]);return u.jsx(o,{children:e&&u.jsx(i.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4",children:u.jsxs(i.div,{initial:{scale:.8,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.8,opacity:0},className:"bg-slate-800 rounded-lg p-8 max-w-md w-full border border-yellow-500",children:[u.jsx("button",{onClick:()=>t(!1),className:"absolute top-4 right-4 text-gray-400 hover:text-white",children:"✕"}),u.jsx("h2",{className:"text-yellow-500 font-bold text-2xl mb-4 text-center",children:"¡ESPERA! 🎁"}),u.jsxs("p",{className:"text-white mb-6 text-center",children:["Descarga GRATIS ",u.jsx("strong",{children:'"Los 7 Secretos de la Cábala"'}),"y recibe un ",u.jsx("strong",{className:"text-yellow-500",children:"descuento del 20%"})," en tu primera sesión"]}),u.jsxs("form",{onSubmit:e=>{e.preventDefault();const s=encodeURIComponent(`Hola, quiero el PDF "7 Secretos de la Cábala" y mi descuento del 20%. Mi email: ${a}`);window.open(`https://wa.me/19298336069?text=${s}`,"_blank"),t(!1)},className:"space-y-4",children:[u.jsx("input",{type:"email",placeholder:"Tu email aquí",value:a,onChange:e=>r(e.target.value),required:!0,className:"w-full p-3 rounded-lg bg-slate-700 text-white border border-gray-600 focus:border-yellow-500"}),u.jsx("button",{type:"submit",className:"w-full bg-yellow-500 text-slate-900 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors",children:"DESCARGAR GRATIS + DESCUENTO"})]}),u.jsx("p",{className:"text-gray-400 text-xs text-center mt-4",children:"🔒 100% privado • No spam • Descuento válido por 48 horas"})]})})})},De=r.lazy(()=>ge(()=>import("./Home-DdqSaekX.js").then(e=>e.H),__vite__mapDeps([0,1,2])));function Oe(){return u.jsxs(be,{children:[u.jsx(Le,{}),u.jsx(Ae,{}),u.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white",children:[u.jsx(Ee,{}),u.jsx("main",{children:u.jsx(s.Suspense,{fallback:u.jsx(Te,{message:"Cargando página..."}),children:u.jsx(De,{})})}),u.jsx(Se,{}),u.jsx($e,{}),u.jsx(ze,{})]})]})}const Re=document.getElementById("root");if(!Re)throw new Error('Root element not found. Make sure there is a div with id="root" in your HTML.');h.createRoot(Re).render(u.jsxs(r.StrictMode,{children:[u.jsx(Oe,{}),u.jsx(he,{position:"top-right",toastOptions:{duration:4e3,style:{background:"#1f2937",color:"#f9fafb",borderRadius:"12px",boxShadow:"0 10px 25px rgba(0, 0, 0, 0.1)"},success:{iconTheme:{primary:"#D4AF37",secondary:"#ffffff"}},error:{iconTheme:{primary:"#ef4444",secondary:"#ffffff"}}}})]}));export{Te as L,ye as S,Ce as W,ge as _,Ie as a,u as j,ke as o,xe as z};
//# sourceMappingURL=index-DuyfrRIh.js.map
