(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function t(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(i){if(i.ep)return;i.ep=!0;const o=t(i);fetch(i.href,o)}})();var Uo=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Br(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Wp={exports:{}},ws={},Kp={exports:{}},re={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var $i=Symbol.for("react.element"),Qm=Symbol.for("react.portal"),Xm=Symbol.for("react.fragment"),Zm=Symbol.for("react.strict_mode"),Jm=Symbol.for("react.profiler"),ey=Symbol.for("react.provider"),ny=Symbol.for("react.context"),ty=Symbol.for("react.forward_ref"),ry=Symbol.for("react.suspense"),iy=Symbol.for("react.memo"),oy=Symbol.for("react.lazy"),lu=Symbol.iterator;function sy(e){return e===null||typeof e!="object"?null:(e=lu&&e[lu]||e["@@iterator"],typeof e=="function"?e:null)}var Vp={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},qp=Object.assign,Yp={};function jr(e,n,t){this.props=e,this.context=n,this.refs=Yp,this.updater=t||Vp}jr.prototype.isReactComponent={};jr.prototype.setState=function(e,n){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,n,"setState")};jr.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Qp(){}Qp.prototype=jr.prototype;function Hl(e,n,t){this.props=e,this.context=n,this.refs=Yp,this.updater=t||Vp}var Gl=Hl.prototype=new Qp;Gl.constructor=Hl;qp(Gl,jr.prototype);Gl.isPureReactComponent=!0;var cu=Array.isArray,Xp=Object.prototype.hasOwnProperty,Wl={current:null},Zp={key:!0,ref:!0,__self:!0,__source:!0};function Jp(e,n,t){var r,i={},o=null,s=null;if(n!=null)for(r in n.ref!==void 0&&(s=n.ref),n.key!==void 0&&(o=""+n.key),n)Xp.call(n,r)&&!Zp.hasOwnProperty(r)&&(i[r]=n[r]);var a=arguments.length-2;if(a===1)i.children=t;else if(1<a){for(var l=Array(a),c=0;c<a;c++)l[c]=arguments[c+2];i.children=l}if(e&&e.defaultProps)for(r in a=e.defaultProps,a)i[r]===void 0&&(i[r]=a[r]);return{$$typeof:$i,type:e,key:o,ref:s,props:i,_owner:Wl.current}}function ay(e,n){return{$$typeof:$i,type:e.type,key:n,ref:e.ref,props:e.props,_owner:e._owner}}function Kl(e){return typeof e=="object"&&e!==null&&e.$$typeof===$i}function ly(e){var n={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(t){return n[t]})}var uu=/\/+/g;function Gs(e,n){return typeof e=="object"&&e!==null&&e.key!=null?ly(""+e.key):n.toString(36)}function _o(e,n,t,r,i){var o=typeof e;(o==="undefined"||o==="boolean")&&(e=null);var s=!1;if(e===null)s=!0;else switch(o){case"string":case"number":s=!0;break;case"object":switch(e.$$typeof){case $i:case Qm:s=!0}}if(s)return s=e,i=i(s),e=r===""?"."+Gs(s,0):r,cu(i)?(t="",e!=null&&(t=e.replace(uu,"$&/")+"/"),_o(i,n,t,"",function(c){return c})):i!=null&&(Kl(i)&&(i=ay(i,t+(!i.key||s&&s.key===i.key?"":(""+i.key).replace(uu,"$&/")+"/")+e)),n.push(i)),1;if(s=0,r=r===""?".":r+":",cu(e))for(var a=0;a<e.length;a++){o=e[a];var l=r+Gs(o,a);s+=_o(o,n,t,l,i)}else if(l=sy(e),typeof l=="function")for(e=l.call(e),a=0;!(o=e.next()).done;)o=o.value,l=r+Gs(o,a++),s+=_o(o,n,t,l,i);else if(o==="object")throw n=String(e),Error("Objects are not valid as a React child (found: "+(n==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":n)+"). If you meant to render a collection of children, use an array instead.");return s}function Yi(e,n,t){if(e==null)return e;var r=[],i=0;return _o(e,r,"","",function(o){return n.call(t,o,i++)}),r}function cy(e){if(e._status===-1){var n=e._result;n=n(),n.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=n)}if(e._status===1)return e._result.default;throw e._result}var Ge={current:null},Co={transition:null},uy={ReactCurrentDispatcher:Ge,ReactCurrentBatchConfig:Co,ReactCurrentOwner:Wl};re.Children={map:Yi,forEach:function(e,n,t){Yi(e,function(){n.apply(this,arguments)},t)},count:function(e){var n=0;return Yi(e,function(){n++}),n},toArray:function(e){return Yi(e,function(n){return n})||[]},only:function(e){if(!Kl(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};re.Component=jr;re.Fragment=Xm;re.Profiler=Jm;re.PureComponent=Hl;re.StrictMode=Zm;re.Suspense=ry;re.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=uy;re.cloneElement=function(e,n,t){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=qp({},e.props),i=e.key,o=e.ref,s=e._owner;if(n!=null){if(n.ref!==void 0&&(o=n.ref,s=Wl.current),n.key!==void 0&&(i=""+n.key),e.type&&e.type.defaultProps)var a=e.type.defaultProps;for(l in n)Xp.call(n,l)&&!Zp.hasOwnProperty(l)&&(r[l]=n[l]===void 0&&a!==void 0?a[l]:n[l])}var l=arguments.length-2;if(l===1)r.children=t;else if(1<l){a=Array(l);for(var c=0;c<l;c++)a[c]=arguments[c+2];r.children=a}return{$$typeof:$i,type:e.type,key:i,ref:o,props:r,_owner:s}};re.createContext=function(e){return e={$$typeof:ny,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:ey,_context:e},e.Consumer=e};re.createElement=Jp;re.createFactory=function(e){var n=Jp.bind(null,e);return n.type=e,n};re.createRef=function(){return{current:null}};re.forwardRef=function(e){return{$$typeof:ty,render:e}};re.isValidElement=Kl;re.lazy=function(e){return{$$typeof:oy,_payload:{_status:-1,_result:e},_init:cy}};re.memo=function(e,n){return{$$typeof:iy,type:e,compare:n===void 0?null:n}};re.startTransition=function(e){var n=Co.transition;Co.transition={};try{e()}finally{Co.transition=n}};re.unstable_act=function(){throw Error("act(...) is not supported in production builds of React.")};re.useCallback=function(e,n){return Ge.current.useCallback(e,n)};re.useContext=function(e){return Ge.current.useContext(e)};re.useDebugValue=function(){};re.useDeferredValue=function(e){return Ge.current.useDeferredValue(e)};re.useEffect=function(e,n){return Ge.current.useEffect(e,n)};re.useId=function(){return Ge.current.useId()};re.useImperativeHandle=function(e,n,t){return Ge.current.useImperativeHandle(e,n,t)};re.useInsertionEffect=function(e,n){return Ge.current.useInsertionEffect(e,n)};re.useLayoutEffect=function(e,n){return Ge.current.useLayoutEffect(e,n)};re.useMemo=function(e,n){return Ge.current.useMemo(e,n)};re.useReducer=function(e,n,t){return Ge.current.useReducer(e,n,t)};re.useRef=function(e){return Ge.current.useRef(e)};re.useState=function(e){return Ge.current.useState(e)};re.useSyncExternalStore=function(e,n,t){return Ge.current.useSyncExternalStore(e,n,t)};re.useTransition=function(){return Ge.current.useTransition()};re.version="18.2.0";Kp.exports=re;var A=Kp.exports;const dy=Br(A);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var py=A,fy=Symbol.for("react.element"),hy=Symbol.for("react.fragment"),gy=Object.prototype.hasOwnProperty,my=py.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,yy={key:!0,ref:!0,__self:!0,__source:!0};function ef(e,n,t){var r,i={},o=null,s=null;t!==void 0&&(o=""+t),n.key!==void 0&&(o=""+n.key),n.ref!==void 0&&(s=n.ref);for(r in n)gy.call(n,r)&&!yy.hasOwnProperty(r)&&(i[r]=n[r]);if(e&&e.defaultProps)for(r in n=e.defaultProps,n)i[r]===void 0&&(i[r]=n[r]);return{$$typeof:fy,type:e,key:o,ref:s,props:i,_owner:my.current}}ws.Fragment=hy;ws.jsx=ef;ws.jsxs=ef;Wp.exports=ws;var f=Wp.exports,Pa={},nf={exports:{}},un={},tf={exports:{}},rf={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function n(R,M){var b=R.length;R.push(M);e:for(;0<b;){var $=b-1>>>1,W=R[$];if(0<i(W,M))R[$]=M,R[b]=W,b=$;else break e}}function t(R){return R.length===0?null:R[0]}function r(R){if(R.length===0)return null;var M=R[0],b=R.pop();if(b!==M){R[0]=b;e:for(var $=0,W=R.length,E=W>>>1;$<E;){var X=2*($+1)-1,te=R[X],ie=X+1,Te=R[ie];if(0>i(te,b))ie<W&&0>i(Te,te)?(R[$]=Te,R[ie]=b,$=ie):(R[$]=te,R[X]=b,$=X);else if(ie<W&&0>i(Te,b))R[$]=Te,R[ie]=b,$=ie;else break e}}return M}function i(R,M){var b=R.sortIndex-M.sortIndex;return b!==0?b:R.id-M.id}if(typeof performance=="object"&&typeof performance.now=="function"){var o=performance;e.unstable_now=function(){return o.now()}}else{var s=Date,a=s.now();e.unstable_now=function(){return s.now()-a}}var l=[],c=[],u=1,d=null,p=3,h=!1,v=!1,w=!1,S=typeof setTimeout=="function"?setTimeout:null,g=typeof clearTimeout=="function"?clearTimeout:null,m=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function y(R){for(var M=t(c);M!==null;){if(M.callback===null)r(c);else if(M.startTime<=R)r(c),M.sortIndex=M.expirationTime,n(l,M);else break;M=t(c)}}function _(R){if(w=!1,y(R),!v)if(t(l)!==null)v=!0,C(N);else{var M=t(c);M!==null&&O(_,M.startTime-R)}}function N(R,M){v=!1,w&&(w=!1,g(D),D=-1),h=!0;var b=p;try{for(y(M),d=t(l);d!==null&&(!(d.expirationTime>M)||R&&!H());){var $=d.callback;if(typeof $=="function"){d.callback=null,p=d.priorityLevel;var W=$(d.expirationTime<=M);M=e.unstable_now(),typeof W=="function"?d.callback=W:d===t(l)&&r(l),y(M)}else r(l);d=t(l)}if(d!==null)var E=!0;else{var X=t(c);X!==null&&O(_,X.startTime-M),E=!1}return E}finally{d=null,p=b,h=!1}}var k=!1,I=null,D=-1,z=5,U=-1;function H(){return!(e.unstable_now()-U<z)}function G(){if(I!==null){var R=e.unstable_now();U=R;var M=!0;try{M=I(!0,R)}finally{M?J():(k=!1,I=null)}}else k=!1}var J;if(typeof m=="function")J=function(){m(G)};else if(typeof MessageChannel<"u"){var Q=new MessageChannel,q=Q.port2;Q.port1.onmessage=G,J=function(){q.postMessage(null)}}else J=function(){S(G,0)};function C(R){I=R,k||(k=!0,J())}function O(R,M){D=S(function(){R(e.unstable_now())},M)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(R){R.callback=null},e.unstable_continueExecution=function(){v||h||(v=!0,C(N))},e.unstable_forceFrameRate=function(R){0>R||125<R?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):z=0<R?Math.floor(1e3/R):5},e.unstable_getCurrentPriorityLevel=function(){return p},e.unstable_getFirstCallbackNode=function(){return t(l)},e.unstable_next=function(R){switch(p){case 1:case 2:case 3:var M=3;break;default:M=p}var b=p;p=M;try{return R()}finally{p=b}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(R,M){switch(R){case 1:case 2:case 3:case 4:case 5:break;default:R=3}var b=p;p=R;try{return M()}finally{p=b}},e.unstable_scheduleCallback=function(R,M,b){var $=e.unstable_now();switch(typeof b=="object"&&b!==null?(b=b.delay,b=typeof b=="number"&&0<b?$+b:$):b=$,R){case 1:var W=-1;break;case 2:W=250;break;case 5:W=1073741823;break;case 4:W=1e4;break;default:W=5e3}return W=b+W,R={id:u++,callback:M,priorityLevel:R,startTime:b,expirationTime:W,sortIndex:-1},b>$?(R.sortIndex=b,n(c,R),t(l)===null&&R===t(c)&&(w?(g(D),D=-1):w=!0,O(_,b-$))):(R.sortIndex=W,n(l,R),v||h||(v=!0,C(N))),R},e.unstable_shouldYield=H,e.unstable_wrapCallback=function(R){var M=p;return function(){var b=p;p=M;try{return R.apply(this,arguments)}finally{p=b}}}})(rf);tf.exports=rf;var by=tf.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var of=A,cn=by;function j(e){for(var n="https://reactjs.org/docs/error-decoder.html?invariant="+e,t=1;t<arguments.length;t++)n+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+e+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var sf=new Set,wi={};function Yt(e,n){Rr(e,n),Rr(e+"Capture",n)}function Rr(e,n){for(wi[e]=n,e=0;e<n.length;e++)sf.add(n[e])}var et=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Ba=Object.prototype.hasOwnProperty,vy=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,du={},pu={};function wy(e){return Ba.call(pu,e)?!0:Ba.call(du,e)?!1:vy.test(e)?pu[e]=!0:(du[e]=!0,!1)}function xy(e,n,t,r){if(t!==null&&t.type===0)return!1;switch(typeof n){case"function":case"symbol":return!0;case"boolean":return r?!1:t!==null?!t.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function Sy(e,n,t,r){if(n===null||typeof n>"u"||xy(e,n,t,r))return!0;if(r)return!1;if(t!==null)switch(t.type){case 3:return!n;case 4:return n===!1;case 5:return isNaN(n);case 6:return isNaN(n)||1>n}return!1}function We(e,n,t,r,i,o,s){this.acceptsBooleans=n===2||n===3||n===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=t,this.propertyName=e,this.type=n,this.sanitizeURL=o,this.removeEmptyString=s}var De={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){De[e]=new We(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var n=e[0];De[n]=new We(n,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){De[e]=new We(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){De[e]=new We(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){De[e]=new We(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){De[e]=new We(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){De[e]=new We(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){De[e]=new We(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){De[e]=new We(e,5,!1,e.toLowerCase(),null,!1,!1)});var Vl=/[\-:]([a-z])/g;function ql(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var n=e.replace(Vl,ql);De[n]=new We(n,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var n=e.replace(Vl,ql);De[n]=new We(n,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var n=e.replace(Vl,ql);De[n]=new We(n,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){De[e]=new We(e,1,!1,e.toLowerCase(),null,!1,!1)});De.xlinkHref=new We("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){De[e]=new We(e,1,!1,e.toLowerCase(),null,!0,!0)});function Yl(e,n,t,r){var i=De.hasOwnProperty(n)?De[n]:null;(i!==null?i.type!==0:r||!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(Sy(n,t,i,r)&&(t=null),r||i===null?wy(n)&&(t===null?e.removeAttribute(n):e.setAttribute(n,""+t)):i.mustUseProperty?e[i.propertyName]=t===null?i.type===3?!1:"":t:(n=i.attributeName,r=i.attributeNamespace,t===null?e.removeAttribute(n):(i=i.type,t=i===3||i===4&&t===!0?"":""+t,r?e.setAttributeNS(r,n,t):e.setAttribute(n,t))))}var it=of.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Qi=Symbol.for("react.element"),lr=Symbol.for("react.portal"),cr=Symbol.for("react.fragment"),Ql=Symbol.for("react.strict_mode"),ja=Symbol.for("react.profiler"),af=Symbol.for("react.provider"),lf=Symbol.for("react.context"),Xl=Symbol.for("react.forward_ref"),Fa=Symbol.for("react.suspense"),za=Symbol.for("react.suspense_list"),Zl=Symbol.for("react.memo"),lt=Symbol.for("react.lazy"),cf=Symbol.for("react.offscreen"),fu=Symbol.iterator;function Wr(e){return e===null||typeof e!="object"?null:(e=fu&&e[fu]||e["@@iterator"],typeof e=="function"?e:null)}var we=Object.assign,Ws;function ti(e){if(Ws===void 0)try{throw Error()}catch(t){var n=t.stack.trim().match(/\n( *(at )?)/);Ws=n&&n[1]||""}return`
`+Ws+e}var Ks=!1;function Vs(e,n){if(!e||Ks)return"";Ks=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(n)if(n=function(){throw Error()},Object.defineProperty(n.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(n,[])}catch(c){var r=c}Reflect.construct(e,[],n)}else{try{n.call()}catch(c){r=c}e.call(n.prototype)}else{try{throw Error()}catch(c){r=c}e()}}catch(c){if(c&&r&&typeof c.stack=="string"){for(var i=c.stack.split(`
`),o=r.stack.split(`
`),s=i.length-1,a=o.length-1;1<=s&&0<=a&&i[s]!==o[a];)a--;for(;1<=s&&0<=a;s--,a--)if(i[s]!==o[a]){if(s!==1||a!==1)do if(s--,a--,0>a||i[s]!==o[a]){var l=`
`+i[s].replace(" at new "," at ");return e.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",e.displayName)),l}while(1<=s&&0<=a);break}}}finally{Ks=!1,Error.prepareStackTrace=t}return(e=e?e.displayName||e.name:"")?ti(e):""}function ky(e){switch(e.tag){case 5:return ti(e.type);case 16:return ti("Lazy");case 13:return ti("Suspense");case 19:return ti("SuspenseList");case 0:case 2:case 15:return e=Vs(e.type,!1),e;case 11:return e=Vs(e.type.render,!1),e;case 1:return e=Vs(e.type,!0),e;default:return""}}function Ua(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case cr:return"Fragment";case lr:return"Portal";case ja:return"Profiler";case Ql:return"StrictMode";case Fa:return"Suspense";case za:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case lf:return(e.displayName||"Context")+".Consumer";case af:return(e._context.displayName||"Context")+".Provider";case Xl:var n=e.render;return e=e.displayName,e||(e=n.displayName||n.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Zl:return n=e.displayName||null,n!==null?n:Ua(e.type)||"Memo";case lt:n=e._payload,e=e._init;try{return Ua(e(n))}catch{}}return null}function Ey(e){var n=e.type;switch(e.tag){case 24:return"Cache";case 9:return(n.displayName||"Context")+".Consumer";case 10:return(n._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=n.render,e=e.displayName||e.name||"",n.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return n;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Ua(n);case 8:return n===Ql?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n}return null}function Et(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function uf(e){var n=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function _y(e){var n=uf(e)?"checked":"value",t=Object.getOwnPropertyDescriptor(e.constructor.prototype,n),r=""+e[n];if(!e.hasOwnProperty(n)&&typeof t<"u"&&typeof t.get=="function"&&typeof t.set=="function"){var i=t.get,o=t.set;return Object.defineProperty(e,n,{configurable:!0,get:function(){return i.call(this)},set:function(s){r=""+s,o.call(this,s)}}),Object.defineProperty(e,n,{enumerable:t.enumerable}),{getValue:function(){return r},setValue:function(s){r=""+s},stopTracking:function(){e._valueTracker=null,delete e[n]}}}}function Xi(e){e._valueTracker||(e._valueTracker=_y(e))}function df(e){if(!e)return!1;var n=e._valueTracker;if(!n)return!0;var t=n.getValue(),r="";return e&&(r=uf(e)?e.checked?"true":"false":e.value),e=r,e!==t?(n.setValue(e),!0):!1}function $o(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function $a(e,n){var t=n.checked;return we({},n,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:t??e._wrapperState.initialChecked})}function hu(e,n){var t=n.defaultValue==null?"":n.defaultValue,r=n.checked!=null?n.checked:n.defaultChecked;t=Et(n.value!=null?n.value:t),e._wrapperState={initialChecked:r,initialValue:t,controlled:n.type==="checkbox"||n.type==="radio"?n.checked!=null:n.value!=null}}function pf(e,n){n=n.checked,n!=null&&Yl(e,"checked",n,!1)}function Ha(e,n){pf(e,n);var t=Et(n.value),r=n.type;if(t!=null)r==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+t):e.value!==""+t&&(e.value=""+t);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}n.hasOwnProperty("value")?Ga(e,n.type,t):n.hasOwnProperty("defaultValue")&&Ga(e,n.type,Et(n.defaultValue)),n.checked==null&&n.defaultChecked!=null&&(e.defaultChecked=!!n.defaultChecked)}function gu(e,n,t){if(n.hasOwnProperty("value")||n.hasOwnProperty("defaultValue")){var r=n.type;if(!(r!=="submit"&&r!=="reset"||n.value!==void 0&&n.value!==null))return;n=""+e._wrapperState.initialValue,t||n===e.value||(e.value=n),e.defaultValue=n}t=e.name,t!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,t!==""&&(e.name=t)}function Ga(e,n,t){(n!=="number"||$o(e.ownerDocument)!==e)&&(t==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+t&&(e.defaultValue=""+t))}var ri=Array.isArray;function xr(e,n,t,r){if(e=e.options,n){n={};for(var i=0;i<t.length;i++)n["$"+t[i]]=!0;for(t=0;t<e.length;t++)i=n.hasOwnProperty("$"+e[t].value),e[t].selected!==i&&(e[t].selected=i),i&&r&&(e[t].defaultSelected=!0)}else{for(t=""+Et(t),n=null,i=0;i<e.length;i++){if(e[i].value===t){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}n!==null||e[i].disabled||(n=e[i])}n!==null&&(n.selected=!0)}}function Wa(e,n){if(n.dangerouslySetInnerHTML!=null)throw Error(j(91));return we({},n,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function mu(e,n){var t=n.value;if(t==null){if(t=n.children,n=n.defaultValue,t!=null){if(n!=null)throw Error(j(92));if(ri(t)){if(1<t.length)throw Error(j(93));t=t[0]}n=t}n==null&&(n=""),t=n}e._wrapperState={initialValue:Et(t)}}function ff(e,n){var t=Et(n.value),r=Et(n.defaultValue);t!=null&&(t=""+t,t!==e.value&&(e.value=t),n.defaultValue==null&&e.defaultValue!==t&&(e.defaultValue=t)),r!=null&&(e.defaultValue=""+r)}function yu(e){var n=e.textContent;n===e._wrapperState.initialValue&&n!==""&&n!==null&&(e.value=n)}function hf(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ka(e,n){return e==null||e==="http://www.w3.org/1999/xhtml"?hf(n):e==="http://www.w3.org/2000/svg"&&n==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Zi,gf=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(n,t,r,i){MSApp.execUnsafeLocalFunction(function(){return e(n,t,r,i)})}:e}(function(e,n){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=n;else{for(Zi=Zi||document.createElement("div"),Zi.innerHTML="<svg>"+n.valueOf().toString()+"</svg>",n=Zi.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;n.firstChild;)e.appendChild(n.firstChild)}});function xi(e,n){if(n){var t=e.firstChild;if(t&&t===e.lastChild&&t.nodeType===3){t.nodeValue=n;return}}e.textContent=n}var si={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Cy=["Webkit","ms","Moz","O"];Object.keys(si).forEach(function(e){Cy.forEach(function(n){n=n+e.charAt(0).toUpperCase()+e.substring(1),si[n]=si[e]})});function mf(e,n,t){return n==null||typeof n=="boolean"||n===""?"":t||typeof n!="number"||n===0||si.hasOwnProperty(e)&&si[e]?(""+n).trim():n+"px"}function yf(e,n){e=e.style;for(var t in n)if(n.hasOwnProperty(t)){var r=t.indexOf("--")===0,i=mf(t,n[t],r);t==="float"&&(t="cssFloat"),r?e.setProperty(t,i):e[t]=i}}var Ty=we({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Va(e,n){if(n){if(Ty[e]&&(n.children!=null||n.dangerouslySetInnerHTML!=null))throw Error(j(137,e));if(n.dangerouslySetInnerHTML!=null){if(n.children!=null)throw Error(j(60));if(typeof n.dangerouslySetInnerHTML!="object"||!("__html"in n.dangerouslySetInnerHTML))throw Error(j(61))}if(n.style!=null&&typeof n.style!="object")throw Error(j(62))}}function qa(e,n){if(e.indexOf("-")===-1)return typeof n.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Ya=null;function Jl(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Qa=null,Sr=null,kr=null;function bu(e){if(e=Wi(e)){if(typeof Qa!="function")throw Error(j(280));var n=e.stateNode;n&&(n=_s(n),Qa(e.stateNode,e.type,n))}}function bf(e){Sr?kr?kr.push(e):kr=[e]:Sr=e}function vf(){if(Sr){var e=Sr,n=kr;if(kr=Sr=null,bu(e),n)for(e=0;e<n.length;e++)bu(n[e])}}function wf(e,n){return e(n)}function xf(){}var qs=!1;function Sf(e,n,t){if(qs)return e(n,t);qs=!0;try{return wf(e,n,t)}finally{qs=!1,(Sr!==null||kr!==null)&&(xf(),vf())}}function Si(e,n){var t=e.stateNode;if(t===null)return null;var r=_s(t);if(r===null)return null;t=r[n];e:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(t&&typeof t!="function")throw Error(j(231,n,typeof t));return t}var Xa=!1;if(et)try{var Kr={};Object.defineProperty(Kr,"passive",{get:function(){Xa=!0}}),window.addEventListener("test",Kr,Kr),window.removeEventListener("test",Kr,Kr)}catch{Xa=!1}function Ry(e,n,t,r,i,o,s,a,l){var c=Array.prototype.slice.call(arguments,3);try{n.apply(t,c)}catch(u){this.onError(u)}}var ai=!1,Ho=null,Go=!1,Za=null,Ny={onError:function(e){ai=!0,Ho=e}};function Iy(e,n,t,r,i,o,s,a,l){ai=!1,Ho=null,Ry.apply(Ny,arguments)}function Ay(e,n,t,r,i,o,s,a,l){if(Iy.apply(this,arguments),ai){if(ai){var c=Ho;ai=!1,Ho=null}else throw Error(j(198));Go||(Go=!0,Za=c)}}function Qt(e){var n=e,t=e;if(e.alternate)for(;n.return;)n=n.return;else{e=n;do n=e,n.flags&4098&&(t=n.return),e=n.return;while(e)}return n.tag===3?t:null}function kf(e){if(e.tag===13){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function vu(e){if(Qt(e)!==e)throw Error(j(188))}function Oy(e){var n=e.alternate;if(!n){if(n=Qt(e),n===null)throw Error(j(188));return n!==e?null:e}for(var t=e,r=n;;){var i=t.return;if(i===null)break;var o=i.alternate;if(o===null){if(r=i.return,r!==null){t=r;continue}break}if(i.child===o.child){for(o=i.child;o;){if(o===t)return vu(i),e;if(o===r)return vu(i),n;o=o.sibling}throw Error(j(188))}if(t.return!==r.return)t=i,r=o;else{for(var s=!1,a=i.child;a;){if(a===t){s=!0,t=i,r=o;break}if(a===r){s=!0,r=i,t=o;break}a=a.sibling}if(!s){for(a=o.child;a;){if(a===t){s=!0,t=o,r=i;break}if(a===r){s=!0,r=o,t=i;break}a=a.sibling}if(!s)throw Error(j(189))}}if(t.alternate!==r)throw Error(j(190))}if(t.tag!==3)throw Error(j(188));return t.stateNode.current===t?e:n}function Ef(e){return e=Oy(e),e!==null?_f(e):null}function _f(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var n=_f(e);if(n!==null)return n;e=e.sibling}return null}var Cf=cn.unstable_scheduleCallback,wu=cn.unstable_cancelCallback,My=cn.unstable_shouldYield,Dy=cn.unstable_requestPaint,Se=cn.unstable_now,Ly=cn.unstable_getCurrentPriorityLevel,ec=cn.unstable_ImmediatePriority,Tf=cn.unstable_UserBlockingPriority,Wo=cn.unstable_NormalPriority,Py=cn.unstable_LowPriority,Rf=cn.unstable_IdlePriority,xs=null,zn=null;function By(e){if(zn&&typeof zn.onCommitFiberRoot=="function")try{zn.onCommitFiberRoot(xs,e,void 0,(e.current.flags&128)===128)}catch{}}var Nn=Math.clz32?Math.clz32:zy,jy=Math.log,Fy=Math.LN2;function zy(e){return e>>>=0,e===0?32:31-(jy(e)/Fy|0)|0}var Ji=64,eo=4194304;function ii(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Ko(e,n){var t=e.pendingLanes;if(t===0)return 0;var r=0,i=e.suspendedLanes,o=e.pingedLanes,s=t&268435455;if(s!==0){var a=s&~i;a!==0?r=ii(a):(o&=s,o!==0&&(r=ii(o)))}else s=t&~i,s!==0?r=ii(s):o!==0&&(r=ii(o));if(r===0)return 0;if(n!==0&&n!==r&&!(n&i)&&(i=r&-r,o=n&-n,i>=o||i===16&&(o&4194240)!==0))return n;if(r&4&&(r|=t&16),n=e.entangledLanes,n!==0)for(e=e.entanglements,n&=r;0<n;)t=31-Nn(n),i=1<<t,r|=e[t],n&=~i;return r}function Uy(e,n){switch(e){case 1:case 2:case 4:return n+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function $y(e,n){for(var t=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,o=e.pendingLanes;0<o;){var s=31-Nn(o),a=1<<s,l=i[s];l===-1?(!(a&t)||a&r)&&(i[s]=Uy(a,n)):l<=n&&(e.expiredLanes|=a),o&=~a}}function Ja(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Nf(){var e=Ji;return Ji<<=1,!(Ji&4194240)&&(Ji=64),e}function Ys(e){for(var n=[],t=0;31>t;t++)n.push(e);return n}function Hi(e,n,t){e.pendingLanes|=n,n!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,n=31-Nn(n),e[n]=t}function Hy(e,n){var t=e.pendingLanes&~n;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=n,e.mutableReadLanes&=n,e.entangledLanes&=n,n=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<t;){var i=31-Nn(t),o=1<<i;n[i]=0,r[i]=-1,e[i]=-1,t&=~o}}function nc(e,n){var t=e.entangledLanes|=n;for(e=e.entanglements;t;){var r=31-Nn(t),i=1<<r;i&n|e[r]&n&&(e[r]|=n),t&=~i}}var ce=0;function If(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var Af,tc,Of,Mf,Df,el=!1,no=[],mt=null,yt=null,bt=null,ki=new Map,Ei=new Map,ut=[],Gy="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function xu(e,n){switch(e){case"focusin":case"focusout":mt=null;break;case"dragenter":case"dragleave":yt=null;break;case"mouseover":case"mouseout":bt=null;break;case"pointerover":case"pointerout":ki.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ei.delete(n.pointerId)}}function Vr(e,n,t,r,i,o){return e===null||e.nativeEvent!==o?(e={blockedOn:n,domEventName:t,eventSystemFlags:r,nativeEvent:o,targetContainers:[i]},n!==null&&(n=Wi(n),n!==null&&tc(n)),e):(e.eventSystemFlags|=r,n=e.targetContainers,i!==null&&n.indexOf(i)===-1&&n.push(i),e)}function Wy(e,n,t,r,i){switch(n){case"focusin":return mt=Vr(mt,e,n,t,r,i),!0;case"dragenter":return yt=Vr(yt,e,n,t,r,i),!0;case"mouseover":return bt=Vr(bt,e,n,t,r,i),!0;case"pointerover":var o=i.pointerId;return ki.set(o,Vr(ki.get(o)||null,e,n,t,r,i)),!0;case"gotpointercapture":return o=i.pointerId,Ei.set(o,Vr(Ei.get(o)||null,e,n,t,r,i)),!0}return!1}function Lf(e){var n=Pt(e.target);if(n!==null){var t=Qt(n);if(t!==null){if(n=t.tag,n===13){if(n=kf(t),n!==null){e.blockedOn=n,Df(e.priority,function(){Of(t)});return}}else if(n===3&&t.stateNode.current.memoizedState.isDehydrated){e.blockedOn=t.tag===3?t.stateNode.containerInfo:null;return}}}e.blockedOn=null}function To(e){if(e.blockedOn!==null)return!1;for(var n=e.targetContainers;0<n.length;){var t=nl(e.domEventName,e.eventSystemFlags,n[0],e.nativeEvent);if(t===null){t=e.nativeEvent;var r=new t.constructor(t.type,t);Ya=r,t.target.dispatchEvent(r),Ya=null}else return n=Wi(t),n!==null&&tc(n),e.blockedOn=t,!1;n.shift()}return!0}function Su(e,n,t){To(e)&&t.delete(n)}function Ky(){el=!1,mt!==null&&To(mt)&&(mt=null),yt!==null&&To(yt)&&(yt=null),bt!==null&&To(bt)&&(bt=null),ki.forEach(Su),Ei.forEach(Su)}function qr(e,n){e.blockedOn===n&&(e.blockedOn=null,el||(el=!0,cn.unstable_scheduleCallback(cn.unstable_NormalPriority,Ky)))}function _i(e){function n(i){return qr(i,e)}if(0<no.length){qr(no[0],e);for(var t=1;t<no.length;t++){var r=no[t];r.blockedOn===e&&(r.blockedOn=null)}}for(mt!==null&&qr(mt,e),yt!==null&&qr(yt,e),bt!==null&&qr(bt,e),ki.forEach(n),Ei.forEach(n),t=0;t<ut.length;t++)r=ut[t],r.blockedOn===e&&(r.blockedOn=null);for(;0<ut.length&&(t=ut[0],t.blockedOn===null);)Lf(t),t.blockedOn===null&&ut.shift()}var Er=it.ReactCurrentBatchConfig,Vo=!0;function Vy(e,n,t,r){var i=ce,o=Er.transition;Er.transition=null;try{ce=1,rc(e,n,t,r)}finally{ce=i,Er.transition=o}}function qy(e,n,t,r){var i=ce,o=Er.transition;Er.transition=null;try{ce=4,rc(e,n,t,r)}finally{ce=i,Er.transition=o}}function rc(e,n,t,r){if(Vo){var i=nl(e,n,t,r);if(i===null)oa(e,n,r,qo,t),xu(e,r);else if(Wy(i,e,n,t,r))r.stopPropagation();else if(xu(e,r),n&4&&-1<Gy.indexOf(e)){for(;i!==null;){var o=Wi(i);if(o!==null&&Af(o),o=nl(e,n,t,r),o===null&&oa(e,n,r,qo,t),o===i)break;i=o}i!==null&&r.stopPropagation()}else oa(e,n,r,null,t)}}var qo=null;function nl(e,n,t,r){if(qo=null,e=Jl(r),e=Pt(e),e!==null)if(n=Qt(e),n===null)e=null;else if(t=n.tag,t===13){if(e=kf(n),e!==null)return e;e=null}else if(t===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;e=null}else n!==e&&(e=null);return qo=e,null}function Pf(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Ly()){case ec:return 1;case Tf:return 4;case Wo:case Py:return 16;case Rf:return 536870912;default:return 16}default:return 16}}var pt=null,ic=null,Ro=null;function Bf(){if(Ro)return Ro;var e,n=ic,t=n.length,r,i="value"in pt?pt.value:pt.textContent,o=i.length;for(e=0;e<t&&n[e]===i[e];e++);var s=t-e;for(r=1;r<=s&&n[t-r]===i[o-r];r++);return Ro=i.slice(e,1<r?1-r:void 0)}function No(e){var n=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&n===13&&(e=13)):e=n,e===10&&(e=13),32<=e||e===13?e:0}function to(){return!0}function ku(){return!1}function dn(e){function n(t,r,i,o,s){this._reactName=t,this._targetInst=i,this.type=r,this.nativeEvent=o,this.target=s,this.currentTarget=null;for(var a in e)e.hasOwnProperty(a)&&(t=e[a],this[a]=t?t(o):o[a]);return this.isDefaultPrevented=(o.defaultPrevented!=null?o.defaultPrevented:o.returnValue===!1)?to:ku,this.isPropagationStopped=ku,this}return we(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var t=this.nativeEvent;t&&(t.preventDefault?t.preventDefault():typeof t.returnValue!="unknown"&&(t.returnValue=!1),this.isDefaultPrevented=to)},stopPropagation:function(){var t=this.nativeEvent;t&&(t.stopPropagation?t.stopPropagation():typeof t.cancelBubble!="unknown"&&(t.cancelBubble=!0),this.isPropagationStopped=to)},persist:function(){},isPersistent:to}),n}var Fr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},oc=dn(Fr),Gi=we({},Fr,{view:0,detail:0}),Yy=dn(Gi),Qs,Xs,Yr,Ss=we({},Gi,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:sc,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Yr&&(Yr&&e.type==="mousemove"?(Qs=e.screenX-Yr.screenX,Xs=e.screenY-Yr.screenY):Xs=Qs=0,Yr=e),Qs)},movementY:function(e){return"movementY"in e?e.movementY:Xs}}),Eu=dn(Ss),Qy=we({},Ss,{dataTransfer:0}),Xy=dn(Qy),Zy=we({},Gi,{relatedTarget:0}),Zs=dn(Zy),Jy=we({},Fr,{animationName:0,elapsedTime:0,pseudoElement:0}),eb=dn(Jy),nb=we({},Fr,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),tb=dn(nb),rb=we({},Fr,{data:0}),_u=dn(rb),ib={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},ob={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},sb={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function ab(e){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(e):(e=sb[e])?!!n[e]:!1}function sc(){return ab}var lb=we({},Gi,{key:function(e){if(e.key){var n=ib[e.key]||e.key;if(n!=="Unidentified")return n}return e.type==="keypress"?(e=No(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?ob[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:sc,charCode:function(e){return e.type==="keypress"?No(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?No(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),cb=dn(lb),ub=we({},Ss,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Cu=dn(ub),db=we({},Gi,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:sc}),pb=dn(db),fb=we({},Fr,{propertyName:0,elapsedTime:0,pseudoElement:0}),hb=dn(fb),gb=we({},Ss,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),mb=dn(gb),yb=[9,13,27,32],ac=et&&"CompositionEvent"in window,li=null;et&&"documentMode"in document&&(li=document.documentMode);var bb=et&&"TextEvent"in window&&!li,jf=et&&(!ac||li&&8<li&&11>=li),Tu=" ",Ru=!1;function Ff(e,n){switch(e){case"keyup":return yb.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function zf(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var ur=!1;function vb(e,n){switch(e){case"compositionend":return zf(n);case"keypress":return n.which!==32?null:(Ru=!0,Tu);case"textInput":return e=n.data,e===Tu&&Ru?null:e;default:return null}}function wb(e,n){if(ur)return e==="compositionend"||!ac&&Ff(e,n)?(e=Bf(),Ro=ic=pt=null,ur=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return jf&&n.locale!=="ko"?null:n.data;default:return null}}var xb={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Nu(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n==="input"?!!xb[e.type]:n==="textarea"}function Uf(e,n,t,r){bf(r),n=Yo(n,"onChange"),0<n.length&&(t=new oc("onChange","change",null,t,r),e.push({event:t,listeners:n}))}var ci=null,Ci=null;function Sb(e){Zf(e,0)}function ks(e){var n=fr(e);if(df(n))return e}function kb(e,n){if(e==="change")return n}var $f=!1;if(et){var Js;if(et){var ea="oninput"in document;if(!ea){var Iu=document.createElement("div");Iu.setAttribute("oninput","return;"),ea=typeof Iu.oninput=="function"}Js=ea}else Js=!1;$f=Js&&(!document.documentMode||9<document.documentMode)}function Au(){ci&&(ci.detachEvent("onpropertychange",Hf),Ci=ci=null)}function Hf(e){if(e.propertyName==="value"&&ks(Ci)){var n=[];Uf(n,Ci,e,Jl(e)),Sf(Sb,n)}}function Eb(e,n,t){e==="focusin"?(Au(),ci=n,Ci=t,ci.attachEvent("onpropertychange",Hf)):e==="focusout"&&Au()}function _b(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return ks(Ci)}function Cb(e,n){if(e==="click")return ks(n)}function Tb(e,n){if(e==="input"||e==="change")return ks(n)}function Rb(e,n){return e===n&&(e!==0||1/e===1/n)||e!==e&&n!==n}var An=typeof Object.is=="function"?Object.is:Rb;function Ti(e,n){if(An(e,n))return!0;if(typeof e!="object"||e===null||typeof n!="object"||n===null)return!1;var t=Object.keys(e),r=Object.keys(n);if(t.length!==r.length)return!1;for(r=0;r<t.length;r++){var i=t[r];if(!Ba.call(n,i)||!An(e[i],n[i]))return!1}return!0}function Ou(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Mu(e,n){var t=Ou(e);e=0;for(var r;t;){if(t.nodeType===3){if(r=e+t.textContent.length,e<=n&&r>=n)return{node:t,offset:n-e};e=r}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=Ou(t)}}function Gf(e,n){return e&&n?e===n?!0:e&&e.nodeType===3?!1:n&&n.nodeType===3?Gf(e,n.parentNode):"contains"in e?e.contains(n):e.compareDocumentPosition?!!(e.compareDocumentPosition(n)&16):!1:!1}function Wf(){for(var e=window,n=$o();n instanceof e.HTMLIFrameElement;){try{var t=typeof n.contentWindow.location.href=="string"}catch{t=!1}if(t)e=n.contentWindow;else break;n=$o(e.document)}return n}function lc(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n&&(n==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||n==="textarea"||e.contentEditable==="true")}function Nb(e){var n=Wf(),t=e.focusedElem,r=e.selectionRange;if(n!==t&&t&&t.ownerDocument&&Gf(t.ownerDocument.documentElement,t)){if(r!==null&&lc(t)){if(n=r.start,e=r.end,e===void 0&&(e=n),"selectionStart"in t)t.selectionStart=n,t.selectionEnd=Math.min(e,t.value.length);else if(e=(n=t.ownerDocument||document)&&n.defaultView||window,e.getSelection){e=e.getSelection();var i=t.textContent.length,o=Math.min(r.start,i);r=r.end===void 0?o:Math.min(r.end,i),!e.extend&&o>r&&(i=r,r=o,o=i),i=Mu(t,o);var s=Mu(t,r);i&&s&&(e.rangeCount!==1||e.anchorNode!==i.node||e.anchorOffset!==i.offset||e.focusNode!==s.node||e.focusOffset!==s.offset)&&(n=n.createRange(),n.setStart(i.node,i.offset),e.removeAllRanges(),o>r?(e.addRange(n),e.extend(s.node,s.offset)):(n.setEnd(s.node,s.offset),e.addRange(n)))}}for(n=[],e=t;e=e.parentNode;)e.nodeType===1&&n.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof t.focus=="function"&&t.focus(),t=0;t<n.length;t++)e=n[t],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Ib=et&&"documentMode"in document&&11>=document.documentMode,dr=null,tl=null,ui=null,rl=!1;function Du(e,n,t){var r=t.window===t?t.document:t.nodeType===9?t:t.ownerDocument;rl||dr==null||dr!==$o(r)||(r=dr,"selectionStart"in r&&lc(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),ui&&Ti(ui,r)||(ui=r,r=Yo(tl,"onSelect"),0<r.length&&(n=new oc("onSelect","select",null,n,t),e.push({event:n,listeners:r}),n.target=dr)))}function ro(e,n){var t={};return t[e.toLowerCase()]=n.toLowerCase(),t["Webkit"+e]="webkit"+n,t["Moz"+e]="moz"+n,t}var pr={animationend:ro("Animation","AnimationEnd"),animationiteration:ro("Animation","AnimationIteration"),animationstart:ro("Animation","AnimationStart"),transitionend:ro("Transition","TransitionEnd")},na={},Kf={};et&&(Kf=document.createElement("div").style,"AnimationEvent"in window||(delete pr.animationend.animation,delete pr.animationiteration.animation,delete pr.animationstart.animation),"TransitionEvent"in window||delete pr.transitionend.transition);function Es(e){if(na[e])return na[e];if(!pr[e])return e;var n=pr[e],t;for(t in n)if(n.hasOwnProperty(t)&&t in Kf)return na[e]=n[t];return e}var Vf=Es("animationend"),qf=Es("animationiteration"),Yf=Es("animationstart"),Qf=Es("transitionend"),Xf=new Map,Lu="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Ct(e,n){Xf.set(e,n),Yt(n,[e])}for(var ta=0;ta<Lu.length;ta++){var ra=Lu[ta],Ab=ra.toLowerCase(),Ob=ra[0].toUpperCase()+ra.slice(1);Ct(Ab,"on"+Ob)}Ct(Vf,"onAnimationEnd");Ct(qf,"onAnimationIteration");Ct(Yf,"onAnimationStart");Ct("dblclick","onDoubleClick");Ct("focusin","onFocus");Ct("focusout","onBlur");Ct(Qf,"onTransitionEnd");Rr("onMouseEnter",["mouseout","mouseover"]);Rr("onMouseLeave",["mouseout","mouseover"]);Rr("onPointerEnter",["pointerout","pointerover"]);Rr("onPointerLeave",["pointerout","pointerover"]);Yt("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Yt("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Yt("onBeforeInput",["compositionend","keypress","textInput","paste"]);Yt("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Yt("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Yt("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var oi="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Mb=new Set("cancel close invalid load scroll toggle".split(" ").concat(oi));function Pu(e,n,t){var r=e.type||"unknown-event";e.currentTarget=t,Ay(r,n,void 0,e),e.currentTarget=null}function Zf(e,n){n=(n&4)!==0;for(var t=0;t<e.length;t++){var r=e[t],i=r.event;r=r.listeners;e:{var o=void 0;if(n)for(var s=r.length-1;0<=s;s--){var a=r[s],l=a.instance,c=a.currentTarget;if(a=a.listener,l!==o&&i.isPropagationStopped())break e;Pu(i,a,c),o=l}else for(s=0;s<r.length;s++){if(a=r[s],l=a.instance,c=a.currentTarget,a=a.listener,l!==o&&i.isPropagationStopped())break e;Pu(i,a,c),o=l}}}if(Go)throw e=Za,Go=!1,Za=null,e}function ge(e,n){var t=n[ll];t===void 0&&(t=n[ll]=new Set);var r=e+"__bubble";t.has(r)||(Jf(n,e,2,!1),t.add(r))}function ia(e,n,t){var r=0;n&&(r|=4),Jf(t,e,r,n)}var io="_reactListening"+Math.random().toString(36).slice(2);function Ri(e){if(!e[io]){e[io]=!0,sf.forEach(function(t){t!=="selectionchange"&&(Mb.has(t)||ia(t,!1,e),ia(t,!0,e))});var n=e.nodeType===9?e:e.ownerDocument;n===null||n[io]||(n[io]=!0,ia("selectionchange",!1,n))}}function Jf(e,n,t,r){switch(Pf(n)){case 1:var i=Vy;break;case 4:i=qy;break;default:i=rc}t=i.bind(null,n,t,e),i=void 0,!Xa||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(i=!0),r?i!==void 0?e.addEventListener(n,t,{capture:!0,passive:i}):e.addEventListener(n,t,!0):i!==void 0?e.addEventListener(n,t,{passive:i}):e.addEventListener(n,t,!1)}function oa(e,n,t,r,i){var o=r;if(!(n&1)&&!(n&2)&&r!==null)e:for(;;){if(r===null)return;var s=r.tag;if(s===3||s===4){var a=r.stateNode.containerInfo;if(a===i||a.nodeType===8&&a.parentNode===i)break;if(s===4)for(s=r.return;s!==null;){var l=s.tag;if((l===3||l===4)&&(l=s.stateNode.containerInfo,l===i||l.nodeType===8&&l.parentNode===i))return;s=s.return}for(;a!==null;){if(s=Pt(a),s===null)return;if(l=s.tag,l===5||l===6){r=o=s;continue e}a=a.parentNode}}r=r.return}Sf(function(){var c=o,u=Jl(t),d=[];e:{var p=Xf.get(e);if(p!==void 0){var h=oc,v=e;switch(e){case"keypress":if(No(t)===0)break e;case"keydown":case"keyup":h=cb;break;case"focusin":v="focus",h=Zs;break;case"focusout":v="blur",h=Zs;break;case"beforeblur":case"afterblur":h=Zs;break;case"click":if(t.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":h=Eu;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":h=Xy;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":h=pb;break;case Vf:case qf:case Yf:h=eb;break;case Qf:h=hb;break;case"scroll":h=Yy;break;case"wheel":h=mb;break;case"copy":case"cut":case"paste":h=tb;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":h=Cu}var w=(n&4)!==0,S=!w&&e==="scroll",g=w?p!==null?p+"Capture":null:p;w=[];for(var m=c,y;m!==null;){y=m;var _=y.stateNode;if(y.tag===5&&_!==null&&(y=_,g!==null&&(_=Si(m,g),_!=null&&w.push(Ni(m,_,y)))),S)break;m=m.return}0<w.length&&(p=new h(p,v,null,t,u),d.push({event:p,listeners:w}))}}if(!(n&7)){e:{if(p=e==="mouseover"||e==="pointerover",h=e==="mouseout"||e==="pointerout",p&&t!==Ya&&(v=t.relatedTarget||t.fromElement)&&(Pt(v)||v[nt]))break e;if((h||p)&&(p=u.window===u?u:(p=u.ownerDocument)?p.defaultView||p.parentWindow:window,h?(v=t.relatedTarget||t.toElement,h=c,v=v?Pt(v):null,v!==null&&(S=Qt(v),v!==S||v.tag!==5&&v.tag!==6)&&(v=null)):(h=null,v=c),h!==v)){if(w=Eu,_="onMouseLeave",g="onMouseEnter",m="mouse",(e==="pointerout"||e==="pointerover")&&(w=Cu,_="onPointerLeave",g="onPointerEnter",m="pointer"),S=h==null?p:fr(h),y=v==null?p:fr(v),p=new w(_,m+"leave",h,t,u),p.target=S,p.relatedTarget=y,_=null,Pt(u)===c&&(w=new w(g,m+"enter",v,t,u),w.target=y,w.relatedTarget=S,_=w),S=_,h&&v)n:{for(w=h,g=v,m=0,y=w;y;y=tr(y))m++;for(y=0,_=g;_;_=tr(_))y++;for(;0<m-y;)w=tr(w),m--;for(;0<y-m;)g=tr(g),y--;for(;m--;){if(w===g||g!==null&&w===g.alternate)break n;w=tr(w),g=tr(g)}w=null}else w=null;h!==null&&Bu(d,p,h,w,!1),v!==null&&S!==null&&Bu(d,S,v,w,!0)}}e:{if(p=c?fr(c):window,h=p.nodeName&&p.nodeName.toLowerCase(),h==="select"||h==="input"&&p.type==="file")var N=kb;else if(Nu(p))if($f)N=Tb;else{N=_b;var k=Eb}else(h=p.nodeName)&&h.toLowerCase()==="input"&&(p.type==="checkbox"||p.type==="radio")&&(N=Cb);if(N&&(N=N(e,c))){Uf(d,N,t,u);break e}k&&k(e,p,c),e==="focusout"&&(k=p._wrapperState)&&k.controlled&&p.type==="number"&&Ga(p,"number",p.value)}switch(k=c?fr(c):window,e){case"focusin":(Nu(k)||k.contentEditable==="true")&&(dr=k,tl=c,ui=null);break;case"focusout":ui=tl=dr=null;break;case"mousedown":rl=!0;break;case"contextmenu":case"mouseup":case"dragend":rl=!1,Du(d,t,u);break;case"selectionchange":if(Ib)break;case"keydown":case"keyup":Du(d,t,u)}var I;if(ac)e:{switch(e){case"compositionstart":var D="onCompositionStart";break e;case"compositionend":D="onCompositionEnd";break e;case"compositionupdate":D="onCompositionUpdate";break e}D=void 0}else ur?Ff(e,t)&&(D="onCompositionEnd"):e==="keydown"&&t.keyCode===229&&(D="onCompositionStart");D&&(jf&&t.locale!=="ko"&&(ur||D!=="onCompositionStart"?D==="onCompositionEnd"&&ur&&(I=Bf()):(pt=u,ic="value"in pt?pt.value:pt.textContent,ur=!0)),k=Yo(c,D),0<k.length&&(D=new _u(D,e,null,t,u),d.push({event:D,listeners:k}),I?D.data=I:(I=zf(t),I!==null&&(D.data=I)))),(I=bb?vb(e,t):wb(e,t))&&(c=Yo(c,"onBeforeInput"),0<c.length&&(u=new _u("onBeforeInput","beforeinput",null,t,u),d.push({event:u,listeners:c}),u.data=I))}Zf(d,n)})}function Ni(e,n,t){return{instance:e,listener:n,currentTarget:t}}function Yo(e,n){for(var t=n+"Capture",r=[];e!==null;){var i=e,o=i.stateNode;i.tag===5&&o!==null&&(i=o,o=Si(e,t),o!=null&&r.unshift(Ni(e,o,i)),o=Si(e,n),o!=null&&r.push(Ni(e,o,i))),e=e.return}return r}function tr(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Bu(e,n,t,r,i){for(var o=n._reactName,s=[];t!==null&&t!==r;){var a=t,l=a.alternate,c=a.stateNode;if(l!==null&&l===r)break;a.tag===5&&c!==null&&(a=c,i?(l=Si(t,o),l!=null&&s.unshift(Ni(t,l,a))):i||(l=Si(t,o),l!=null&&s.push(Ni(t,l,a)))),t=t.return}s.length!==0&&e.push({event:n,listeners:s})}var Db=/\r\n?/g,Lb=/\u0000|\uFFFD/g;function ju(e){return(typeof e=="string"?e:""+e).replace(Db,`
`).replace(Lb,"")}function oo(e,n,t){if(n=ju(n),ju(e)!==n&&t)throw Error(j(425))}function Qo(){}var il=null,ol=null;function sl(e,n){return e==="textarea"||e==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var al=typeof setTimeout=="function"?setTimeout:void 0,Pb=typeof clearTimeout=="function"?clearTimeout:void 0,Fu=typeof Promise=="function"?Promise:void 0,Bb=typeof queueMicrotask=="function"?queueMicrotask:typeof Fu<"u"?function(e){return Fu.resolve(null).then(e).catch(jb)}:al;function jb(e){setTimeout(function(){throw e})}function sa(e,n){var t=n,r=0;do{var i=t.nextSibling;if(e.removeChild(t),i&&i.nodeType===8)if(t=i.data,t==="/$"){if(r===0){e.removeChild(i),_i(n);return}r--}else t!=="$"&&t!=="$?"&&t!=="$!"||r++;t=i}while(t);_i(n)}function vt(e){for(;e!=null;e=e.nextSibling){var n=e.nodeType;if(n===1||n===3)break;if(n===8){if(n=e.data,n==="$"||n==="$!"||n==="$?")break;if(n==="/$")return null}}return e}function zu(e){e=e.previousSibling;for(var n=0;e;){if(e.nodeType===8){var t=e.data;if(t==="$"||t==="$!"||t==="$?"){if(n===0)return e;n--}else t==="/$"&&n++}e=e.previousSibling}return null}var zr=Math.random().toString(36).slice(2),jn="__reactFiber$"+zr,Ii="__reactProps$"+zr,nt="__reactContainer$"+zr,ll="__reactEvents$"+zr,Fb="__reactListeners$"+zr,zb="__reactHandles$"+zr;function Pt(e){var n=e[jn];if(n)return n;for(var t=e.parentNode;t;){if(n=t[nt]||t[jn]){if(t=n.alternate,n.child!==null||t!==null&&t.child!==null)for(e=zu(e);e!==null;){if(t=e[jn])return t;e=zu(e)}return n}e=t,t=e.parentNode}return null}function Wi(e){return e=e[jn]||e[nt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function fr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(j(33))}function _s(e){return e[Ii]||null}var cl=[],hr=-1;function Tt(e){return{current:e}}function me(e){0>hr||(e.current=cl[hr],cl[hr]=null,hr--)}function fe(e,n){hr++,cl[hr]=e.current,e.current=n}var _t={},je=Tt(_t),Ye=Tt(!1),Gt=_t;function Nr(e,n){var t=e.type.contextTypes;if(!t)return _t;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===n)return r.__reactInternalMemoizedMaskedChildContext;var i={},o;for(o in t)i[o]=n[o];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=n,e.__reactInternalMemoizedMaskedChildContext=i),i}function Qe(e){return e=e.childContextTypes,e!=null}function Xo(){me(Ye),me(je)}function Uu(e,n,t){if(je.current!==_t)throw Error(j(168));fe(je,n),fe(Ye,t)}function eh(e,n,t){var r=e.stateNode;if(n=n.childContextTypes,typeof r.getChildContext!="function")return t;r=r.getChildContext();for(var i in r)if(!(i in n))throw Error(j(108,Ey(e)||"Unknown",i));return we({},t,r)}function Zo(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||_t,Gt=je.current,fe(je,e),fe(Ye,Ye.current),!0}function $u(e,n,t){var r=e.stateNode;if(!r)throw Error(j(169));t?(e=eh(e,n,Gt),r.__reactInternalMemoizedMergedChildContext=e,me(Ye),me(je),fe(je,e)):me(Ye),fe(Ye,t)}var qn=null,Cs=!1,aa=!1;function nh(e){qn===null?qn=[e]:qn.push(e)}function Ub(e){Cs=!0,nh(e)}function Rt(){if(!aa&&qn!==null){aa=!0;var e=0,n=ce;try{var t=qn;for(ce=1;e<t.length;e++){var r=t[e];do r=r(!0);while(r!==null)}qn=null,Cs=!1}catch(i){throw qn!==null&&(qn=qn.slice(e+1)),Cf(ec,Rt),i}finally{ce=n,aa=!1}}return null}var gr=[],mr=0,Jo=null,es=0,mn=[],yn=0,Wt=null,Qn=1,Xn="";function Ot(e,n){gr[mr++]=es,gr[mr++]=Jo,Jo=e,es=n}function th(e,n,t){mn[yn++]=Qn,mn[yn++]=Xn,mn[yn++]=Wt,Wt=e;var r=Qn;e=Xn;var i=32-Nn(r)-1;r&=~(1<<i),t+=1;var o=32-Nn(n)+i;if(30<o){var s=i-i%5;o=(r&(1<<s)-1).toString(32),r>>=s,i-=s,Qn=1<<32-Nn(n)+i|t<<i|r,Xn=o+e}else Qn=1<<o|t<<i|r,Xn=e}function cc(e){e.return!==null&&(Ot(e,1),th(e,1,0))}function uc(e){for(;e===Jo;)Jo=gr[--mr],gr[mr]=null,es=gr[--mr],gr[mr]=null;for(;e===Wt;)Wt=mn[--yn],mn[yn]=null,Xn=mn[--yn],mn[yn]=null,Qn=mn[--yn],mn[yn]=null}var ln=null,sn=null,ye=!1,Rn=null;function rh(e,n){var t=vn(5,null,null,0);t.elementType="DELETED",t.stateNode=n,t.return=e,n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)}function Hu(e,n){switch(e.tag){case 5:var t=e.type;return n=n.nodeType!==1||t.toLowerCase()!==n.nodeName.toLowerCase()?null:n,n!==null?(e.stateNode=n,ln=e,sn=vt(n.firstChild),!0):!1;case 6:return n=e.pendingProps===""||n.nodeType!==3?null:n,n!==null?(e.stateNode=n,ln=e,sn=null,!0):!1;case 13:return n=n.nodeType!==8?null:n,n!==null?(t=Wt!==null?{id:Qn,overflow:Xn}:null,e.memoizedState={dehydrated:n,treeContext:t,retryLane:1073741824},t=vn(18,null,null,0),t.stateNode=n,t.return=e,e.child=t,ln=e,sn=null,!0):!1;default:return!1}}function ul(e){return(e.mode&1)!==0&&(e.flags&128)===0}function dl(e){if(ye){var n=sn;if(n){var t=n;if(!Hu(e,n)){if(ul(e))throw Error(j(418));n=vt(t.nextSibling);var r=ln;n&&Hu(e,n)?rh(r,t):(e.flags=e.flags&-4097|2,ye=!1,ln=e)}}else{if(ul(e))throw Error(j(418));e.flags=e.flags&-4097|2,ye=!1,ln=e}}}function Gu(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;ln=e}function so(e){if(e!==ln)return!1;if(!ye)return Gu(e),ye=!0,!1;var n;if((n=e.tag!==3)&&!(n=e.tag!==5)&&(n=e.type,n=n!=="head"&&n!=="body"&&!sl(e.type,e.memoizedProps)),n&&(n=sn)){if(ul(e))throw ih(),Error(j(418));for(;n;)rh(e,n),n=vt(n.nextSibling)}if(Gu(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(j(317));e:{for(e=e.nextSibling,n=0;e;){if(e.nodeType===8){var t=e.data;if(t==="/$"){if(n===0){sn=vt(e.nextSibling);break e}n--}else t!=="$"&&t!=="$!"&&t!=="$?"||n++}e=e.nextSibling}sn=null}}else sn=ln?vt(e.stateNode.nextSibling):null;return!0}function ih(){for(var e=sn;e;)e=vt(e.nextSibling)}function Ir(){sn=ln=null,ye=!1}function dc(e){Rn===null?Rn=[e]:Rn.push(e)}var $b=it.ReactCurrentBatchConfig;function Cn(e,n){if(e&&e.defaultProps){n=we({},n),e=e.defaultProps;for(var t in e)n[t]===void 0&&(n[t]=e[t]);return n}return n}var ns=Tt(null),ts=null,yr=null,pc=null;function fc(){pc=yr=ts=null}function hc(e){var n=ns.current;me(ns),e._currentValue=n}function pl(e,n,t){for(;e!==null;){var r=e.alternate;if((e.childLanes&n)!==n?(e.childLanes|=n,r!==null&&(r.childLanes|=n)):r!==null&&(r.childLanes&n)!==n&&(r.childLanes|=n),e===t)break;e=e.return}}function _r(e,n){ts=e,pc=yr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&n&&(qe=!0),e.firstContext=null)}function xn(e){var n=e._currentValue;if(pc!==e)if(e={context:e,memoizedValue:n,next:null},yr===null){if(ts===null)throw Error(j(308));yr=e,ts.dependencies={lanes:0,firstContext:e}}else yr=yr.next=e;return n}var Bt=null;function gc(e){Bt===null?Bt=[e]:Bt.push(e)}function oh(e,n,t,r){var i=n.interleaved;return i===null?(t.next=t,gc(n)):(t.next=i.next,i.next=t),n.interleaved=t,tt(e,r)}function tt(e,n){e.lanes|=n;var t=e.alternate;for(t!==null&&(t.lanes|=n),t=e,e=e.return;e!==null;)e.childLanes|=n,t=e.alternate,t!==null&&(t.childLanes|=n),t=e,e=e.return;return t.tag===3?t.stateNode:null}var ct=!1;function mc(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function sh(e,n){e=e.updateQueue,n.updateQueue===e&&(n.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Zn(e,n){return{eventTime:e,lane:n,tag:0,payload:null,callback:null,next:null}}function wt(e,n,t){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,se&2){var i=r.pending;return i===null?n.next=n:(n.next=i.next,i.next=n),r.pending=n,tt(e,t)}return i=r.interleaved,i===null?(n.next=n,gc(r)):(n.next=i.next,i.next=n),r.interleaved=n,tt(e,t)}function Io(e,n,t){if(n=n.updateQueue,n!==null&&(n=n.shared,(t&4194240)!==0)){var r=n.lanes;r&=e.pendingLanes,t|=r,n.lanes=t,nc(e,t)}}function Wu(e,n){var t=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,t===r)){var i=null,o=null;if(t=t.firstBaseUpdate,t!==null){do{var s={eventTime:t.eventTime,lane:t.lane,tag:t.tag,payload:t.payload,callback:t.callback,next:null};o===null?i=o=s:o=o.next=s,t=t.next}while(t!==null);o===null?i=o=n:o=o.next=n}else i=o=n;t={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:o,shared:r.shared,effects:r.effects},e.updateQueue=t;return}e=t.lastBaseUpdate,e===null?t.firstBaseUpdate=n:e.next=n,t.lastBaseUpdate=n}function rs(e,n,t,r){var i=e.updateQueue;ct=!1;var o=i.firstBaseUpdate,s=i.lastBaseUpdate,a=i.shared.pending;if(a!==null){i.shared.pending=null;var l=a,c=l.next;l.next=null,s===null?o=c:s.next=c,s=l;var u=e.alternate;u!==null&&(u=u.updateQueue,a=u.lastBaseUpdate,a!==s&&(a===null?u.firstBaseUpdate=c:a.next=c,u.lastBaseUpdate=l))}if(o!==null){var d=i.baseState;s=0,u=c=l=null,a=o;do{var p=a.lane,h=a.eventTime;if((r&p)===p){u!==null&&(u=u.next={eventTime:h,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var v=e,w=a;switch(p=n,h=t,w.tag){case 1:if(v=w.payload,typeof v=="function"){d=v.call(h,d,p);break e}d=v;break e;case 3:v.flags=v.flags&-65537|128;case 0:if(v=w.payload,p=typeof v=="function"?v.call(h,d,p):v,p==null)break e;d=we({},d,p);break e;case 2:ct=!0}}a.callback!==null&&a.lane!==0&&(e.flags|=64,p=i.effects,p===null?i.effects=[a]:p.push(a))}else h={eventTime:h,lane:p,tag:a.tag,payload:a.payload,callback:a.callback,next:null},u===null?(c=u=h,l=d):u=u.next=h,s|=p;if(a=a.next,a===null){if(a=i.shared.pending,a===null)break;p=a,a=p.next,p.next=null,i.lastBaseUpdate=p,i.shared.pending=null}}while(!0);if(u===null&&(l=d),i.baseState=l,i.firstBaseUpdate=c,i.lastBaseUpdate=u,n=i.shared.interleaved,n!==null){i=n;do s|=i.lane,i=i.next;while(i!==n)}else o===null&&(i.shared.lanes=0);Vt|=s,e.lanes=s,e.memoizedState=d}}function Ku(e,n,t){if(e=n.effects,n.effects=null,e!==null)for(n=0;n<e.length;n++){var r=e[n],i=r.callback;if(i!==null){if(r.callback=null,r=t,typeof i!="function")throw Error(j(191,i));i.call(r)}}}var ah=new of.Component().refs;function fl(e,n,t,r){n=e.memoizedState,t=t(r,n),t=t==null?n:we({},n,t),e.memoizedState=t,e.lanes===0&&(e.updateQueue.baseState=t)}var Ts={isMounted:function(e){return(e=e._reactInternals)?Qt(e)===e:!1},enqueueSetState:function(e,n,t){e=e._reactInternals;var r=He(),i=St(e),o=Zn(r,i);o.payload=n,t!=null&&(o.callback=t),n=wt(e,o,i),n!==null&&(In(n,e,i,r),Io(n,e,i))},enqueueReplaceState:function(e,n,t){e=e._reactInternals;var r=He(),i=St(e),o=Zn(r,i);o.tag=1,o.payload=n,t!=null&&(o.callback=t),n=wt(e,o,i),n!==null&&(In(n,e,i,r),Io(n,e,i))},enqueueForceUpdate:function(e,n){e=e._reactInternals;var t=He(),r=St(e),i=Zn(t,r);i.tag=2,n!=null&&(i.callback=n),n=wt(e,i,r),n!==null&&(In(n,e,r,t),Io(n,e,r))}};function Vu(e,n,t,r,i,o,s){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,o,s):n.prototype&&n.prototype.isPureReactComponent?!Ti(t,r)||!Ti(i,o):!0}function lh(e,n,t){var r=!1,i=_t,o=n.contextType;return typeof o=="object"&&o!==null?o=xn(o):(i=Qe(n)?Gt:je.current,r=n.contextTypes,o=(r=r!=null)?Nr(e,i):_t),n=new n(t,o),e.memoizedState=n.state!==null&&n.state!==void 0?n.state:null,n.updater=Ts,e.stateNode=n,n._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=i,e.__reactInternalMemoizedMaskedChildContext=o),n}function qu(e,n,t,r){e=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(t,r),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(t,r),n.state!==e&&Ts.enqueueReplaceState(n,n.state,null)}function hl(e,n,t,r){var i=e.stateNode;i.props=t,i.state=e.memoizedState,i.refs=ah,mc(e);var o=n.contextType;typeof o=="object"&&o!==null?i.context=xn(o):(o=Qe(n)?Gt:je.current,i.context=Nr(e,o)),i.state=e.memoizedState,o=n.getDerivedStateFromProps,typeof o=="function"&&(fl(e,n,o,t),i.state=e.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(n=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),n!==i.state&&Ts.enqueueReplaceState(i,i.state,null),rs(e,t,i,r),i.state=e.memoizedState),typeof i.componentDidMount=="function"&&(e.flags|=4194308)}function Qr(e,n,t){if(e=t.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(t._owner){if(t=t._owner,t){if(t.tag!==1)throw Error(j(309));var r=t.stateNode}if(!r)throw Error(j(147,e));var i=r,o=""+e;return n!==null&&n.ref!==null&&typeof n.ref=="function"&&n.ref._stringRef===o?n.ref:(n=function(s){var a=i.refs;a===ah&&(a=i.refs={}),s===null?delete a[o]:a[o]=s},n._stringRef=o,n)}if(typeof e!="string")throw Error(j(284));if(!t._owner)throw Error(j(290,e))}return e}function ao(e,n){throw e=Object.prototype.toString.call(n),Error(j(31,e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e))}function Yu(e){var n=e._init;return n(e._payload)}function ch(e){function n(g,m){if(e){var y=g.deletions;y===null?(g.deletions=[m],g.flags|=16):y.push(m)}}function t(g,m){if(!e)return null;for(;m!==null;)n(g,m),m=m.sibling;return null}function r(g,m){for(g=new Map;m!==null;)m.key!==null?g.set(m.key,m):g.set(m.index,m),m=m.sibling;return g}function i(g,m){return g=kt(g,m),g.index=0,g.sibling=null,g}function o(g,m,y){return g.index=y,e?(y=g.alternate,y!==null?(y=y.index,y<m?(g.flags|=2,m):y):(g.flags|=2,m)):(g.flags|=1048576,m)}function s(g){return e&&g.alternate===null&&(g.flags|=2),g}function a(g,m,y,_){return m===null||m.tag!==6?(m=ha(y,g.mode,_),m.return=g,m):(m=i(m,y),m.return=g,m)}function l(g,m,y,_){var N=y.type;return N===cr?u(g,m,y.props.children,_,y.key):m!==null&&(m.elementType===N||typeof N=="object"&&N!==null&&N.$$typeof===lt&&Yu(N)===m.type)?(_=i(m,y.props),_.ref=Qr(g,m,y),_.return=g,_):(_=Po(y.type,y.key,y.props,null,g.mode,_),_.ref=Qr(g,m,y),_.return=g,_)}function c(g,m,y,_){return m===null||m.tag!==4||m.stateNode.containerInfo!==y.containerInfo||m.stateNode.implementation!==y.implementation?(m=ga(y,g.mode,_),m.return=g,m):(m=i(m,y.children||[]),m.return=g,m)}function u(g,m,y,_,N){return m===null||m.tag!==7?(m=zt(y,g.mode,_,N),m.return=g,m):(m=i(m,y),m.return=g,m)}function d(g,m,y){if(typeof m=="string"&&m!==""||typeof m=="number")return m=ha(""+m,g.mode,y),m.return=g,m;if(typeof m=="object"&&m!==null){switch(m.$$typeof){case Qi:return y=Po(m.type,m.key,m.props,null,g.mode,y),y.ref=Qr(g,null,m),y.return=g,y;case lr:return m=ga(m,g.mode,y),m.return=g,m;case lt:var _=m._init;return d(g,_(m._payload),y)}if(ri(m)||Wr(m))return m=zt(m,g.mode,y,null),m.return=g,m;ao(g,m)}return null}function p(g,m,y,_){var N=m!==null?m.key:null;if(typeof y=="string"&&y!==""||typeof y=="number")return N!==null?null:a(g,m,""+y,_);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case Qi:return y.key===N?l(g,m,y,_):null;case lr:return y.key===N?c(g,m,y,_):null;case lt:return N=y._init,p(g,m,N(y._payload),_)}if(ri(y)||Wr(y))return N!==null?null:u(g,m,y,_,null);ao(g,y)}return null}function h(g,m,y,_,N){if(typeof _=="string"&&_!==""||typeof _=="number")return g=g.get(y)||null,a(m,g,""+_,N);if(typeof _=="object"&&_!==null){switch(_.$$typeof){case Qi:return g=g.get(_.key===null?y:_.key)||null,l(m,g,_,N);case lr:return g=g.get(_.key===null?y:_.key)||null,c(m,g,_,N);case lt:var k=_._init;return h(g,m,y,k(_._payload),N)}if(ri(_)||Wr(_))return g=g.get(y)||null,u(m,g,_,N,null);ao(m,_)}return null}function v(g,m,y,_){for(var N=null,k=null,I=m,D=m=0,z=null;I!==null&&D<y.length;D++){I.index>D?(z=I,I=null):z=I.sibling;var U=p(g,I,y[D],_);if(U===null){I===null&&(I=z);break}e&&I&&U.alternate===null&&n(g,I),m=o(U,m,D),k===null?N=U:k.sibling=U,k=U,I=z}if(D===y.length)return t(g,I),ye&&Ot(g,D),N;if(I===null){for(;D<y.length;D++)I=d(g,y[D],_),I!==null&&(m=o(I,m,D),k===null?N=I:k.sibling=I,k=I);return ye&&Ot(g,D),N}for(I=r(g,I);D<y.length;D++)z=h(I,g,D,y[D],_),z!==null&&(e&&z.alternate!==null&&I.delete(z.key===null?D:z.key),m=o(z,m,D),k===null?N=z:k.sibling=z,k=z);return e&&I.forEach(function(H){return n(g,H)}),ye&&Ot(g,D),N}function w(g,m,y,_){var N=Wr(y);if(typeof N!="function")throw Error(j(150));if(y=N.call(y),y==null)throw Error(j(151));for(var k=N=null,I=m,D=m=0,z=null,U=y.next();I!==null&&!U.done;D++,U=y.next()){I.index>D?(z=I,I=null):z=I.sibling;var H=p(g,I,U.value,_);if(H===null){I===null&&(I=z);break}e&&I&&H.alternate===null&&n(g,I),m=o(H,m,D),k===null?N=H:k.sibling=H,k=H,I=z}if(U.done)return t(g,I),ye&&Ot(g,D),N;if(I===null){for(;!U.done;D++,U=y.next())U=d(g,U.value,_),U!==null&&(m=o(U,m,D),k===null?N=U:k.sibling=U,k=U);return ye&&Ot(g,D),N}for(I=r(g,I);!U.done;D++,U=y.next())U=h(I,g,D,U.value,_),U!==null&&(e&&U.alternate!==null&&I.delete(U.key===null?D:U.key),m=o(U,m,D),k===null?N=U:k.sibling=U,k=U);return e&&I.forEach(function(G){return n(g,G)}),ye&&Ot(g,D),N}function S(g,m,y,_){if(typeof y=="object"&&y!==null&&y.type===cr&&y.key===null&&(y=y.props.children),typeof y=="object"&&y!==null){switch(y.$$typeof){case Qi:e:{for(var N=y.key,k=m;k!==null;){if(k.key===N){if(N=y.type,N===cr){if(k.tag===7){t(g,k.sibling),m=i(k,y.props.children),m.return=g,g=m;break e}}else if(k.elementType===N||typeof N=="object"&&N!==null&&N.$$typeof===lt&&Yu(N)===k.type){t(g,k.sibling),m=i(k,y.props),m.ref=Qr(g,k,y),m.return=g,g=m;break e}t(g,k);break}else n(g,k);k=k.sibling}y.type===cr?(m=zt(y.props.children,g.mode,_,y.key),m.return=g,g=m):(_=Po(y.type,y.key,y.props,null,g.mode,_),_.ref=Qr(g,m,y),_.return=g,g=_)}return s(g);case lr:e:{for(k=y.key;m!==null;){if(m.key===k)if(m.tag===4&&m.stateNode.containerInfo===y.containerInfo&&m.stateNode.implementation===y.implementation){t(g,m.sibling),m=i(m,y.children||[]),m.return=g,g=m;break e}else{t(g,m);break}else n(g,m);m=m.sibling}m=ga(y,g.mode,_),m.return=g,g=m}return s(g);case lt:return k=y._init,S(g,m,k(y._payload),_)}if(ri(y))return v(g,m,y,_);if(Wr(y))return w(g,m,y,_);ao(g,y)}return typeof y=="string"&&y!==""||typeof y=="number"?(y=""+y,m!==null&&m.tag===6?(t(g,m.sibling),m=i(m,y),m.return=g,g=m):(t(g,m),m=ha(y,g.mode,_),m.return=g,g=m),s(g)):t(g,m)}return S}var Ar=ch(!0),uh=ch(!1),Ki={},Un=Tt(Ki),Ai=Tt(Ki),Oi=Tt(Ki);function jt(e){if(e===Ki)throw Error(j(174));return e}function yc(e,n){switch(fe(Oi,n),fe(Ai,e),fe(Un,Ki),e=n.nodeType,e){case 9:case 11:n=(n=n.documentElement)?n.namespaceURI:Ka(null,"");break;default:e=e===8?n.parentNode:n,n=e.namespaceURI||null,e=e.tagName,n=Ka(n,e)}me(Un),fe(Un,n)}function Or(){me(Un),me(Ai),me(Oi)}function dh(e){jt(Oi.current);var n=jt(Un.current),t=Ka(n,e.type);n!==t&&(fe(Ai,e),fe(Un,t))}function bc(e){Ai.current===e&&(me(Un),me(Ai))}var be=Tt(0);function is(e){for(var n=e;n!==null;){if(n.tag===13){var t=n.memoizedState;if(t!==null&&(t=t.dehydrated,t===null||t.data==="$?"||t.data==="$!"))return n}else if(n.tag===19&&n.memoizedProps.revealOrder!==void 0){if(n.flags&128)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var la=[];function vc(){for(var e=0;e<la.length;e++)la[e]._workInProgressVersionPrimary=null;la.length=0}var Ao=it.ReactCurrentDispatcher,ca=it.ReactCurrentBatchConfig,Kt=0,ve=null,_e=null,Re=null,os=!1,di=!1,Mi=0,Hb=0;function Le(){throw Error(j(321))}function wc(e,n){if(n===null)return!1;for(var t=0;t<n.length&&t<e.length;t++)if(!An(e[t],n[t]))return!1;return!0}function xc(e,n,t,r,i,o){if(Kt=o,ve=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,Ao.current=e===null||e.memoizedState===null?Vb:qb,e=t(r,i),di){o=0;do{if(di=!1,Mi=0,25<=o)throw Error(j(301));o+=1,Re=_e=null,n.updateQueue=null,Ao.current=Yb,e=t(r,i)}while(di)}if(Ao.current=ss,n=_e!==null&&_e.next!==null,Kt=0,Re=_e=ve=null,os=!1,n)throw Error(j(300));return e}function Sc(){var e=Mi!==0;return Mi=0,e}function Pn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Re===null?ve.memoizedState=Re=e:Re=Re.next=e,Re}function Sn(){if(_e===null){var e=ve.alternate;e=e!==null?e.memoizedState:null}else e=_e.next;var n=Re===null?ve.memoizedState:Re.next;if(n!==null)Re=n,_e=e;else{if(e===null)throw Error(j(310));_e=e,e={memoizedState:_e.memoizedState,baseState:_e.baseState,baseQueue:_e.baseQueue,queue:_e.queue,next:null},Re===null?ve.memoizedState=Re=e:Re=Re.next=e}return Re}function Di(e,n){return typeof n=="function"?n(e):n}function ua(e){var n=Sn(),t=n.queue;if(t===null)throw Error(j(311));t.lastRenderedReducer=e;var r=_e,i=r.baseQueue,o=t.pending;if(o!==null){if(i!==null){var s=i.next;i.next=o.next,o.next=s}r.baseQueue=i=o,t.pending=null}if(i!==null){o=i.next,r=r.baseState;var a=s=null,l=null,c=o;do{var u=c.lane;if((Kt&u)===u)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),r=c.hasEagerState?c.eagerState:e(r,c.action);else{var d={lane:u,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(a=l=d,s=r):l=l.next=d,ve.lanes|=u,Vt|=u}c=c.next}while(c!==null&&c!==o);l===null?s=r:l.next=a,An(r,n.memoizedState)||(qe=!0),n.memoizedState=r,n.baseState=s,n.baseQueue=l,t.lastRenderedState=r}if(e=t.interleaved,e!==null){i=e;do o=i.lane,ve.lanes|=o,Vt|=o,i=i.next;while(i!==e)}else i===null&&(t.lanes=0);return[n.memoizedState,t.dispatch]}function da(e){var n=Sn(),t=n.queue;if(t===null)throw Error(j(311));t.lastRenderedReducer=e;var r=t.dispatch,i=t.pending,o=n.memoizedState;if(i!==null){t.pending=null;var s=i=i.next;do o=e(o,s.action),s=s.next;while(s!==i);An(o,n.memoizedState)||(qe=!0),n.memoizedState=o,n.baseQueue===null&&(n.baseState=o),t.lastRenderedState=o}return[o,r]}function ph(){}function fh(e,n){var t=ve,r=Sn(),i=n(),o=!An(r.memoizedState,i);if(o&&(r.memoizedState=i,qe=!0),r=r.queue,kc(mh.bind(null,t,r,e),[e]),r.getSnapshot!==n||o||Re!==null&&Re.memoizedState.tag&1){if(t.flags|=2048,Li(9,gh.bind(null,t,r,i,n),void 0,null),Ne===null)throw Error(j(349));Kt&30||hh(t,n,i)}return i}function hh(e,n,t){e.flags|=16384,e={getSnapshot:n,value:t},n=ve.updateQueue,n===null?(n={lastEffect:null,stores:null},ve.updateQueue=n,n.stores=[e]):(t=n.stores,t===null?n.stores=[e]:t.push(e))}function gh(e,n,t,r){n.value=t,n.getSnapshot=r,yh(n)&&bh(e)}function mh(e,n,t){return t(function(){yh(n)&&bh(e)})}function yh(e){var n=e.getSnapshot;e=e.value;try{var t=n();return!An(e,t)}catch{return!0}}function bh(e){var n=tt(e,1);n!==null&&In(n,e,1,-1)}function Qu(e){var n=Pn();return typeof e=="function"&&(e=e()),n.memoizedState=n.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Di,lastRenderedState:e},n.queue=e,e=e.dispatch=Kb.bind(null,ve,e),[n.memoizedState,e]}function Li(e,n,t,r){return e={tag:e,create:n,destroy:t,deps:r,next:null},n=ve.updateQueue,n===null?(n={lastEffect:null,stores:null},ve.updateQueue=n,n.lastEffect=e.next=e):(t=n.lastEffect,t===null?n.lastEffect=e.next=e:(r=t.next,t.next=e,e.next=r,n.lastEffect=e)),e}function vh(){return Sn().memoizedState}function Oo(e,n,t,r){var i=Pn();ve.flags|=e,i.memoizedState=Li(1|n,t,void 0,r===void 0?null:r)}function Rs(e,n,t,r){var i=Sn();r=r===void 0?null:r;var o=void 0;if(_e!==null){var s=_e.memoizedState;if(o=s.destroy,r!==null&&wc(r,s.deps)){i.memoizedState=Li(n,t,o,r);return}}ve.flags|=e,i.memoizedState=Li(1|n,t,o,r)}function Xu(e,n){return Oo(8390656,8,e,n)}function kc(e,n){return Rs(2048,8,e,n)}function wh(e,n){return Rs(4,2,e,n)}function xh(e,n){return Rs(4,4,e,n)}function Sh(e,n){if(typeof n=="function")return e=e(),n(e),function(){n(null)};if(n!=null)return e=e(),n.current=e,function(){n.current=null}}function kh(e,n,t){return t=t!=null?t.concat([e]):null,Rs(4,4,Sh.bind(null,n,e),t)}function Ec(){}function Eh(e,n){var t=Sn();n=n===void 0?null:n;var r=t.memoizedState;return r!==null&&n!==null&&wc(n,r[1])?r[0]:(t.memoizedState=[e,n],e)}function _h(e,n){var t=Sn();n=n===void 0?null:n;var r=t.memoizedState;return r!==null&&n!==null&&wc(n,r[1])?r[0]:(e=e(),t.memoizedState=[e,n],e)}function Ch(e,n,t){return Kt&21?(An(t,n)||(t=Nf(),ve.lanes|=t,Vt|=t,e.baseState=!0),n):(e.baseState&&(e.baseState=!1,qe=!0),e.memoizedState=t)}function Gb(e,n){var t=ce;ce=t!==0&&4>t?t:4,e(!0);var r=ca.transition;ca.transition={};try{e(!1),n()}finally{ce=t,ca.transition=r}}function Th(){return Sn().memoizedState}function Wb(e,n,t){var r=St(e);if(t={lane:r,action:t,hasEagerState:!1,eagerState:null,next:null},Rh(e))Nh(n,t);else if(t=oh(e,n,t,r),t!==null){var i=He();In(t,e,r,i),Ih(t,n,r)}}function Kb(e,n,t){var r=St(e),i={lane:r,action:t,hasEagerState:!1,eagerState:null,next:null};if(Rh(e))Nh(n,i);else{var o=e.alternate;if(e.lanes===0&&(o===null||o.lanes===0)&&(o=n.lastRenderedReducer,o!==null))try{var s=n.lastRenderedState,a=o(s,t);if(i.hasEagerState=!0,i.eagerState=a,An(a,s)){var l=n.interleaved;l===null?(i.next=i,gc(n)):(i.next=l.next,l.next=i),n.interleaved=i;return}}catch{}finally{}t=oh(e,n,i,r),t!==null&&(i=He(),In(t,e,r,i),Ih(t,n,r))}}function Rh(e){var n=e.alternate;return e===ve||n!==null&&n===ve}function Nh(e,n){di=os=!0;var t=e.pending;t===null?n.next=n:(n.next=t.next,t.next=n),e.pending=n}function Ih(e,n,t){if(t&4194240){var r=n.lanes;r&=e.pendingLanes,t|=r,n.lanes=t,nc(e,t)}}var ss={readContext:xn,useCallback:Le,useContext:Le,useEffect:Le,useImperativeHandle:Le,useInsertionEffect:Le,useLayoutEffect:Le,useMemo:Le,useReducer:Le,useRef:Le,useState:Le,useDebugValue:Le,useDeferredValue:Le,useTransition:Le,useMutableSource:Le,useSyncExternalStore:Le,useId:Le,unstable_isNewReconciler:!1},Vb={readContext:xn,useCallback:function(e,n){return Pn().memoizedState=[e,n===void 0?null:n],e},useContext:xn,useEffect:Xu,useImperativeHandle:function(e,n,t){return t=t!=null?t.concat([e]):null,Oo(4194308,4,Sh.bind(null,n,e),t)},useLayoutEffect:function(e,n){return Oo(4194308,4,e,n)},useInsertionEffect:function(e,n){return Oo(4,2,e,n)},useMemo:function(e,n){var t=Pn();return n=n===void 0?null:n,e=e(),t.memoizedState=[e,n],e},useReducer:function(e,n,t){var r=Pn();return n=t!==void 0?t(n):n,r.memoizedState=r.baseState=n,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:n},r.queue=e,e=e.dispatch=Wb.bind(null,ve,e),[r.memoizedState,e]},useRef:function(e){var n=Pn();return e={current:e},n.memoizedState=e},useState:Qu,useDebugValue:Ec,useDeferredValue:function(e){return Pn().memoizedState=e},useTransition:function(){var e=Qu(!1),n=e[0];return e=Gb.bind(null,e[1]),Pn().memoizedState=e,[n,e]},useMutableSource:function(){},useSyncExternalStore:function(e,n,t){var r=ve,i=Pn();if(ye){if(t===void 0)throw Error(j(407));t=t()}else{if(t=n(),Ne===null)throw Error(j(349));Kt&30||hh(r,n,t)}i.memoizedState=t;var o={value:t,getSnapshot:n};return i.queue=o,Xu(mh.bind(null,r,o,e),[e]),r.flags|=2048,Li(9,gh.bind(null,r,o,t,n),void 0,null),t},useId:function(){var e=Pn(),n=Ne.identifierPrefix;if(ye){var t=Xn,r=Qn;t=(r&~(1<<32-Nn(r)-1)).toString(32)+t,n=":"+n+"R"+t,t=Mi++,0<t&&(n+="H"+t.toString(32)),n+=":"}else t=Hb++,n=":"+n+"r"+t.toString(32)+":";return e.memoizedState=n},unstable_isNewReconciler:!1},qb={readContext:xn,useCallback:Eh,useContext:xn,useEffect:kc,useImperativeHandle:kh,useInsertionEffect:wh,useLayoutEffect:xh,useMemo:_h,useReducer:ua,useRef:vh,useState:function(){return ua(Di)},useDebugValue:Ec,useDeferredValue:function(e){var n=Sn();return Ch(n,_e.memoizedState,e)},useTransition:function(){var e=ua(Di)[0],n=Sn().memoizedState;return[e,n]},useMutableSource:ph,useSyncExternalStore:fh,useId:Th,unstable_isNewReconciler:!1},Yb={readContext:xn,useCallback:Eh,useContext:xn,useEffect:kc,useImperativeHandle:kh,useInsertionEffect:wh,useLayoutEffect:xh,useMemo:_h,useReducer:da,useRef:vh,useState:function(){return da(Di)},useDebugValue:Ec,useDeferredValue:function(e){var n=Sn();return _e===null?n.memoizedState=e:Ch(n,_e.memoizedState,e)},useTransition:function(){var e=da(Di)[0],n=Sn().memoizedState;return[e,n]},useMutableSource:ph,useSyncExternalStore:fh,useId:Th,unstable_isNewReconciler:!1};function Mr(e,n){try{var t="",r=n;do t+=ky(r),r=r.return;while(r);var i=t}catch(o){i=`
Error generating stack: `+o.message+`
`+o.stack}return{value:e,source:n,stack:i,digest:null}}function pa(e,n,t){return{value:e,source:null,stack:t??null,digest:n??null}}function gl(e,n){try{console.error(n.value)}catch(t){setTimeout(function(){throw t})}}var Qb=typeof WeakMap=="function"?WeakMap:Map;function Ah(e,n,t){t=Zn(-1,t),t.tag=3,t.payload={element:null};var r=n.value;return t.callback=function(){ls||(ls=!0,_l=r),gl(e,n)},t}function Oh(e,n,t){t=Zn(-1,t),t.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var i=n.value;t.payload=function(){return r(i)},t.callback=function(){gl(e,n)}}var o=e.stateNode;return o!==null&&typeof o.componentDidCatch=="function"&&(t.callback=function(){gl(e,n),typeof r!="function"&&(xt===null?xt=new Set([this]):xt.add(this));var s=n.stack;this.componentDidCatch(n.value,{componentStack:s!==null?s:""})}),t}function Zu(e,n,t){var r=e.pingCache;if(r===null){r=e.pingCache=new Qb;var i=new Set;r.set(n,i)}else i=r.get(n),i===void 0&&(i=new Set,r.set(n,i));i.has(t)||(i.add(t),e=uv.bind(null,e,n,t),n.then(e,e))}function Ju(e){do{var n;if((n=e.tag===13)&&(n=e.memoizedState,n=n!==null?n.dehydrated!==null:!0),n)return e;e=e.return}while(e!==null);return null}function ed(e,n,t,r,i){return e.mode&1?(e.flags|=65536,e.lanes=i,e):(e===n?e.flags|=65536:(e.flags|=128,t.flags|=131072,t.flags&=-52805,t.tag===1&&(t.alternate===null?t.tag=17:(n=Zn(-1,1),n.tag=2,wt(t,n,1))),t.lanes|=1),e)}var Xb=it.ReactCurrentOwner,qe=!1;function $e(e,n,t,r){n.child=e===null?uh(n,null,t,r):Ar(n,e.child,t,r)}function nd(e,n,t,r,i){t=t.render;var o=n.ref;return _r(n,i),r=xc(e,n,t,r,o,i),t=Sc(),e!==null&&!qe?(n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~i,rt(e,n,i)):(ye&&t&&cc(n),n.flags|=1,$e(e,n,r,i),n.child)}function td(e,n,t,r,i){if(e===null){var o=t.type;return typeof o=="function"&&!Oc(o)&&o.defaultProps===void 0&&t.compare===null&&t.defaultProps===void 0?(n.tag=15,n.type=o,Mh(e,n,o,r,i)):(e=Po(t.type,null,r,n,n.mode,i),e.ref=n.ref,e.return=n,n.child=e)}if(o=e.child,!(e.lanes&i)){var s=o.memoizedProps;if(t=t.compare,t=t!==null?t:Ti,t(s,r)&&e.ref===n.ref)return rt(e,n,i)}return n.flags|=1,e=kt(o,r),e.ref=n.ref,e.return=n,n.child=e}function Mh(e,n,t,r,i){if(e!==null){var o=e.memoizedProps;if(Ti(o,r)&&e.ref===n.ref)if(qe=!1,n.pendingProps=r=o,(e.lanes&i)!==0)e.flags&131072&&(qe=!0);else return n.lanes=e.lanes,rt(e,n,i)}return ml(e,n,t,r,i)}function Dh(e,n,t){var r=n.pendingProps,i=r.children,o=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(n.mode&1))n.memoizedState={baseLanes:0,cachePool:null,transitions:null},fe(vr,on),on|=t;else{if(!(t&1073741824))return e=o!==null?o.baseLanes|t:t,n.lanes=n.childLanes=1073741824,n.memoizedState={baseLanes:e,cachePool:null,transitions:null},n.updateQueue=null,fe(vr,on),on|=e,null;n.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=o!==null?o.baseLanes:t,fe(vr,on),on|=r}else o!==null?(r=o.baseLanes|t,n.memoizedState=null):r=t,fe(vr,on),on|=r;return $e(e,n,i,t),n.child}function Lh(e,n){var t=n.ref;(e===null&&t!==null||e!==null&&e.ref!==t)&&(n.flags|=512,n.flags|=2097152)}function ml(e,n,t,r,i){var o=Qe(t)?Gt:je.current;return o=Nr(n,o),_r(n,i),t=xc(e,n,t,r,o,i),r=Sc(),e!==null&&!qe?(n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~i,rt(e,n,i)):(ye&&r&&cc(n),n.flags|=1,$e(e,n,t,i),n.child)}function rd(e,n,t,r,i){if(Qe(t)){var o=!0;Zo(n)}else o=!1;if(_r(n,i),n.stateNode===null)Mo(e,n),lh(n,t,r),hl(n,t,r,i),r=!0;else if(e===null){var s=n.stateNode,a=n.memoizedProps;s.props=a;var l=s.context,c=t.contextType;typeof c=="object"&&c!==null?c=xn(c):(c=Qe(t)?Gt:je.current,c=Nr(n,c));var u=t.getDerivedStateFromProps,d=typeof u=="function"||typeof s.getSnapshotBeforeUpdate=="function";d||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(a!==r||l!==c)&&qu(n,s,r,c),ct=!1;var p=n.memoizedState;s.state=p,rs(n,r,s,i),l=n.memoizedState,a!==r||p!==l||Ye.current||ct?(typeof u=="function"&&(fl(n,t,u,r),l=n.memoizedState),(a=ct||Vu(n,t,a,r,p,l,c))?(d||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(n.flags|=4194308)):(typeof s.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=r,n.memoizedState=l),s.props=r,s.state=l,s.context=c,r=a):(typeof s.componentDidMount=="function"&&(n.flags|=4194308),r=!1)}else{s=n.stateNode,sh(e,n),a=n.memoizedProps,c=n.type===n.elementType?a:Cn(n.type,a),s.props=c,d=n.pendingProps,p=s.context,l=t.contextType,typeof l=="object"&&l!==null?l=xn(l):(l=Qe(t)?Gt:je.current,l=Nr(n,l));var h=t.getDerivedStateFromProps;(u=typeof h=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(a!==d||p!==l)&&qu(n,s,r,l),ct=!1,p=n.memoizedState,s.state=p,rs(n,r,s,i);var v=n.memoizedState;a!==d||p!==v||Ye.current||ct?(typeof h=="function"&&(fl(n,t,h,r),v=n.memoizedState),(c=ct||Vu(n,t,c,r,p,v,l)||!1)?(u||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(r,v,l),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(r,v,l)),typeof s.componentDidUpdate=="function"&&(n.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof s.componentDidUpdate!="function"||a===e.memoizedProps&&p===e.memoizedState||(n.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||a===e.memoizedProps&&p===e.memoizedState||(n.flags|=1024),n.memoizedProps=r,n.memoizedState=v),s.props=r,s.state=v,s.context=l,r=c):(typeof s.componentDidUpdate!="function"||a===e.memoizedProps&&p===e.memoizedState||(n.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||a===e.memoizedProps&&p===e.memoizedState||(n.flags|=1024),r=!1)}return yl(e,n,t,r,o,i)}function yl(e,n,t,r,i,o){Lh(e,n);var s=(n.flags&128)!==0;if(!r&&!s)return i&&$u(n,t,!1),rt(e,n,o);r=n.stateNode,Xb.current=n;var a=s&&typeof t.getDerivedStateFromError!="function"?null:r.render();return n.flags|=1,e!==null&&s?(n.child=Ar(n,e.child,null,o),n.child=Ar(n,null,a,o)):$e(e,n,a,o),n.memoizedState=r.state,i&&$u(n,t,!0),n.child}function Ph(e){var n=e.stateNode;n.pendingContext?Uu(e,n.pendingContext,n.pendingContext!==n.context):n.context&&Uu(e,n.context,!1),yc(e,n.containerInfo)}function id(e,n,t,r,i){return Ir(),dc(i),n.flags|=256,$e(e,n,t,r),n.child}var bl={dehydrated:null,treeContext:null,retryLane:0};function vl(e){return{baseLanes:e,cachePool:null,transitions:null}}function Bh(e,n,t){var r=n.pendingProps,i=be.current,o=!1,s=(n.flags&128)!==0,a;if((a=s)||(a=e!==null&&e.memoizedState===null?!1:(i&2)!==0),a?(o=!0,n.flags&=-129):(e===null||e.memoizedState!==null)&&(i|=1),fe(be,i&1),e===null)return dl(n),e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(n.mode&1?e.data==="$!"?n.lanes=8:n.lanes=1073741824:n.lanes=1,null):(s=r.children,e=r.fallback,o?(r=n.mode,o=n.child,s={mode:"hidden",children:s},!(r&1)&&o!==null?(o.childLanes=0,o.pendingProps=s):o=As(s,r,0,null),e=zt(e,r,t,null),o.return=n,e.return=n,o.sibling=e,n.child=o,n.child.memoizedState=vl(t),n.memoizedState=bl,e):_c(n,s));if(i=e.memoizedState,i!==null&&(a=i.dehydrated,a!==null))return Zb(e,n,s,r,a,i,t);if(o){o=r.fallback,s=n.mode,i=e.child,a=i.sibling;var l={mode:"hidden",children:r.children};return!(s&1)&&n.child!==i?(r=n.child,r.childLanes=0,r.pendingProps=l,n.deletions=null):(r=kt(i,l),r.subtreeFlags=i.subtreeFlags&14680064),a!==null?o=kt(a,o):(o=zt(o,s,t,null),o.flags|=2),o.return=n,r.return=n,r.sibling=o,n.child=r,r=o,o=n.child,s=e.child.memoizedState,s=s===null?vl(t):{baseLanes:s.baseLanes|t,cachePool:null,transitions:s.transitions},o.memoizedState=s,o.childLanes=e.childLanes&~t,n.memoizedState=bl,r}return o=e.child,e=o.sibling,r=kt(o,{mode:"visible",children:r.children}),!(n.mode&1)&&(r.lanes=t),r.return=n,r.sibling=null,e!==null&&(t=n.deletions,t===null?(n.deletions=[e],n.flags|=16):t.push(e)),n.child=r,n.memoizedState=null,r}function _c(e,n){return n=As({mode:"visible",children:n},e.mode,0,null),n.return=e,e.child=n}function lo(e,n,t,r){return r!==null&&dc(r),Ar(n,e.child,null,t),e=_c(n,n.pendingProps.children),e.flags|=2,n.memoizedState=null,e}function Zb(e,n,t,r,i,o,s){if(t)return n.flags&256?(n.flags&=-257,r=pa(Error(j(422))),lo(e,n,s,r)):n.memoizedState!==null?(n.child=e.child,n.flags|=128,null):(o=r.fallback,i=n.mode,r=As({mode:"visible",children:r.children},i,0,null),o=zt(o,i,s,null),o.flags|=2,r.return=n,o.return=n,r.sibling=o,n.child=r,n.mode&1&&Ar(n,e.child,null,s),n.child.memoizedState=vl(s),n.memoizedState=bl,o);if(!(n.mode&1))return lo(e,n,s,null);if(i.data==="$!"){if(r=i.nextSibling&&i.nextSibling.dataset,r)var a=r.dgst;return r=a,o=Error(j(419)),r=pa(o,r,void 0),lo(e,n,s,r)}if(a=(s&e.childLanes)!==0,qe||a){if(r=Ne,r!==null){switch(s&-s){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(r.suspendedLanes|s)?0:i,i!==0&&i!==o.retryLane&&(o.retryLane=i,tt(e,i),In(r,e,i,-1))}return Ac(),r=pa(Error(j(421))),lo(e,n,s,r)}return i.data==="$?"?(n.flags|=128,n.child=e.child,n=dv.bind(null,e),i._reactRetry=n,null):(e=o.treeContext,sn=vt(i.nextSibling),ln=n,ye=!0,Rn=null,e!==null&&(mn[yn++]=Qn,mn[yn++]=Xn,mn[yn++]=Wt,Qn=e.id,Xn=e.overflow,Wt=n),n=_c(n,r.children),n.flags|=4096,n)}function od(e,n,t){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n),pl(e.return,n,t)}function fa(e,n,t,r,i){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:r,tail:t,tailMode:i}:(o.isBackwards=n,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=t,o.tailMode=i)}function jh(e,n,t){var r=n.pendingProps,i=r.revealOrder,o=r.tail;if($e(e,n,r.children,t),r=be.current,r&2)r=r&1|2,n.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=n.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&od(e,t,n);else if(e.tag===19)od(e,t,n);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break e;for(;e.sibling===null;){if(e.return===null||e.return===n)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(fe(be,r),!(n.mode&1))n.memoizedState=null;else switch(i){case"forwards":for(t=n.child,i=null;t!==null;)e=t.alternate,e!==null&&is(e)===null&&(i=t),t=t.sibling;t=i,t===null?(i=n.child,n.child=null):(i=t.sibling,t.sibling=null),fa(n,!1,i,t,o);break;case"backwards":for(t=null,i=n.child,n.child=null;i!==null;){if(e=i.alternate,e!==null&&is(e)===null){n.child=i;break}e=i.sibling,i.sibling=t,t=i,i=e}fa(n,!0,t,null,o);break;case"together":fa(n,!1,null,null,void 0);break;default:n.memoizedState=null}return n.child}function Mo(e,n){!(n.mode&1)&&e!==null&&(e.alternate=null,n.alternate=null,n.flags|=2)}function rt(e,n,t){if(e!==null&&(n.dependencies=e.dependencies),Vt|=n.lanes,!(t&n.childLanes))return null;if(e!==null&&n.child!==e.child)throw Error(j(153));if(n.child!==null){for(e=n.child,t=kt(e,e.pendingProps),n.child=t,t.return=n;e.sibling!==null;)e=e.sibling,t=t.sibling=kt(e,e.pendingProps),t.return=n;t.sibling=null}return n.child}function Jb(e,n,t){switch(n.tag){case 3:Ph(n),Ir();break;case 5:dh(n);break;case 1:Qe(n.type)&&Zo(n);break;case 4:yc(n,n.stateNode.containerInfo);break;case 10:var r=n.type._context,i=n.memoizedProps.value;fe(ns,r._currentValue),r._currentValue=i;break;case 13:if(r=n.memoizedState,r!==null)return r.dehydrated!==null?(fe(be,be.current&1),n.flags|=128,null):t&n.child.childLanes?Bh(e,n,t):(fe(be,be.current&1),e=rt(e,n,t),e!==null?e.sibling:null);fe(be,be.current&1);break;case 19:if(r=(t&n.childLanes)!==0,e.flags&128){if(r)return jh(e,n,t);n.flags|=128}if(i=n.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),fe(be,be.current),r)break;return null;case 22:case 23:return n.lanes=0,Dh(e,n,t)}return rt(e,n,t)}var Fh,wl,zh,Uh;Fh=function(e,n){for(var t=n.child;t!==null;){if(t.tag===5||t.tag===6)e.appendChild(t.stateNode);else if(t.tag!==4&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===n)break;for(;t.sibling===null;){if(t.return===null||t.return===n)return;t=t.return}t.sibling.return=t.return,t=t.sibling}};wl=function(){};zh=function(e,n,t,r){var i=e.memoizedProps;if(i!==r){e=n.stateNode,jt(Un.current);var o=null;switch(t){case"input":i=$a(e,i),r=$a(e,r),o=[];break;case"select":i=we({},i,{value:void 0}),r=we({},r,{value:void 0}),o=[];break;case"textarea":i=Wa(e,i),r=Wa(e,r),o=[];break;default:typeof i.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Qo)}Va(t,r);var s;t=null;for(c in i)if(!r.hasOwnProperty(c)&&i.hasOwnProperty(c)&&i[c]!=null)if(c==="style"){var a=i[c];for(s in a)a.hasOwnProperty(s)&&(t||(t={}),t[s]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(wi.hasOwnProperty(c)?o||(o=[]):(o=o||[]).push(c,null));for(c in r){var l=r[c];if(a=i!=null?i[c]:void 0,r.hasOwnProperty(c)&&l!==a&&(l!=null||a!=null))if(c==="style")if(a){for(s in a)!a.hasOwnProperty(s)||l&&l.hasOwnProperty(s)||(t||(t={}),t[s]="");for(s in l)l.hasOwnProperty(s)&&a[s]!==l[s]&&(t||(t={}),t[s]=l[s])}else t||(o||(o=[]),o.push(c,t)),t=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,a=a?a.__html:void 0,l!=null&&a!==l&&(o=o||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(o=o||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(wi.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&ge("scroll",e),o||a===l||(o=[])):(o=o||[]).push(c,l))}t&&(o=o||[]).push("style",t);var c=o;(n.updateQueue=c)&&(n.flags|=4)}};Uh=function(e,n,t,r){t!==r&&(n.flags|=4)};function Xr(e,n){if(!ye)switch(e.tailMode){case"hidden":n=e.tail;for(var t=null;n!==null;)n.alternate!==null&&(t=n),n=n.sibling;t===null?e.tail=null:t.sibling=null;break;case"collapsed":t=e.tail;for(var r=null;t!==null;)t.alternate!==null&&(r=t),t=t.sibling;r===null?n||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function Pe(e){var n=e.alternate!==null&&e.alternate.child===e.child,t=0,r=0;if(n)for(var i=e.child;i!==null;)t|=i.lanes|i.childLanes,r|=i.subtreeFlags&14680064,r|=i.flags&14680064,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)t|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=t,n}function ev(e,n,t){var r=n.pendingProps;switch(uc(n),n.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Pe(n),null;case 1:return Qe(n.type)&&Xo(),Pe(n),null;case 3:return r=n.stateNode,Or(),me(Ye),me(je),vc(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(so(n)?n.flags|=4:e===null||e.memoizedState.isDehydrated&&!(n.flags&256)||(n.flags|=1024,Rn!==null&&(Rl(Rn),Rn=null))),wl(e,n),Pe(n),null;case 5:bc(n);var i=jt(Oi.current);if(t=n.type,e!==null&&n.stateNode!=null)zh(e,n,t,r,i),e.ref!==n.ref&&(n.flags|=512,n.flags|=2097152);else{if(!r){if(n.stateNode===null)throw Error(j(166));return Pe(n),null}if(e=jt(Un.current),so(n)){r=n.stateNode,t=n.type;var o=n.memoizedProps;switch(r[jn]=n,r[Ii]=o,e=(n.mode&1)!==0,t){case"dialog":ge("cancel",r),ge("close",r);break;case"iframe":case"object":case"embed":ge("load",r);break;case"video":case"audio":for(i=0;i<oi.length;i++)ge(oi[i],r);break;case"source":ge("error",r);break;case"img":case"image":case"link":ge("error",r),ge("load",r);break;case"details":ge("toggle",r);break;case"input":hu(r,o),ge("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!o.multiple},ge("invalid",r);break;case"textarea":mu(r,o),ge("invalid",r)}Va(t,o),i=null;for(var s in o)if(o.hasOwnProperty(s)){var a=o[s];s==="children"?typeof a=="string"?r.textContent!==a&&(o.suppressHydrationWarning!==!0&&oo(r.textContent,a,e),i=["children",a]):typeof a=="number"&&r.textContent!==""+a&&(o.suppressHydrationWarning!==!0&&oo(r.textContent,a,e),i=["children",""+a]):wi.hasOwnProperty(s)&&a!=null&&s==="onScroll"&&ge("scroll",r)}switch(t){case"input":Xi(r),gu(r,o,!0);break;case"textarea":Xi(r),yu(r);break;case"select":case"option":break;default:typeof o.onClick=="function"&&(r.onclick=Qo)}r=i,n.updateQueue=r,r!==null&&(n.flags|=4)}else{s=i.nodeType===9?i:i.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=hf(t)),e==="http://www.w3.org/1999/xhtml"?t==="script"?(e=s.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=s.createElement(t,{is:r.is}):(e=s.createElement(t),t==="select"&&(s=e,r.multiple?s.multiple=!0:r.size&&(s.size=r.size))):e=s.createElementNS(e,t),e[jn]=n,e[Ii]=r,Fh(e,n,!1,!1),n.stateNode=e;e:{switch(s=qa(t,r),t){case"dialog":ge("cancel",e),ge("close",e),i=r;break;case"iframe":case"object":case"embed":ge("load",e),i=r;break;case"video":case"audio":for(i=0;i<oi.length;i++)ge(oi[i],e);i=r;break;case"source":ge("error",e),i=r;break;case"img":case"image":case"link":ge("error",e),ge("load",e),i=r;break;case"details":ge("toggle",e),i=r;break;case"input":hu(e,r),i=$a(e,r),ge("invalid",e);break;case"option":i=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},i=we({},r,{value:void 0}),ge("invalid",e);break;case"textarea":mu(e,r),i=Wa(e,r),ge("invalid",e);break;default:i=r}Va(t,i),a=i;for(o in a)if(a.hasOwnProperty(o)){var l=a[o];o==="style"?yf(e,l):o==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&gf(e,l)):o==="children"?typeof l=="string"?(t!=="textarea"||l!=="")&&xi(e,l):typeof l=="number"&&xi(e,""+l):o!=="suppressContentEditableWarning"&&o!=="suppressHydrationWarning"&&o!=="autoFocus"&&(wi.hasOwnProperty(o)?l!=null&&o==="onScroll"&&ge("scroll",e):l!=null&&Yl(e,o,l,s))}switch(t){case"input":Xi(e),gu(e,r,!1);break;case"textarea":Xi(e),yu(e);break;case"option":r.value!=null&&e.setAttribute("value",""+Et(r.value));break;case"select":e.multiple=!!r.multiple,o=r.value,o!=null?xr(e,!!r.multiple,o,!1):r.defaultValue!=null&&xr(e,!!r.multiple,r.defaultValue,!0);break;default:typeof i.onClick=="function"&&(e.onclick=Qo)}switch(t){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(n.flags|=4)}n.ref!==null&&(n.flags|=512,n.flags|=2097152)}return Pe(n),null;case 6:if(e&&n.stateNode!=null)Uh(e,n,e.memoizedProps,r);else{if(typeof r!="string"&&n.stateNode===null)throw Error(j(166));if(t=jt(Oi.current),jt(Un.current),so(n)){if(r=n.stateNode,t=n.memoizedProps,r[jn]=n,(o=r.nodeValue!==t)&&(e=ln,e!==null))switch(e.tag){case 3:oo(r.nodeValue,t,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&oo(r.nodeValue,t,(e.mode&1)!==0)}o&&(n.flags|=4)}else r=(t.nodeType===9?t:t.ownerDocument).createTextNode(r),r[jn]=n,n.stateNode=r}return Pe(n),null;case 13:if(me(be),r=n.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(ye&&sn!==null&&n.mode&1&&!(n.flags&128))ih(),Ir(),n.flags|=98560,o=!1;else if(o=so(n),r!==null&&r.dehydrated!==null){if(e===null){if(!o)throw Error(j(318));if(o=n.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(j(317));o[jn]=n}else Ir(),!(n.flags&128)&&(n.memoizedState=null),n.flags|=4;Pe(n),o=!1}else Rn!==null&&(Rl(Rn),Rn=null),o=!0;if(!o)return n.flags&65536?n:null}return n.flags&128?(n.lanes=t,n):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(n.child.flags|=8192,n.mode&1&&(e===null||be.current&1?Ce===0&&(Ce=3):Ac())),n.updateQueue!==null&&(n.flags|=4),Pe(n),null);case 4:return Or(),wl(e,n),e===null&&Ri(n.stateNode.containerInfo),Pe(n),null;case 10:return hc(n.type._context),Pe(n),null;case 17:return Qe(n.type)&&Xo(),Pe(n),null;case 19:if(me(be),o=n.memoizedState,o===null)return Pe(n),null;if(r=(n.flags&128)!==0,s=o.rendering,s===null)if(r)Xr(o,!1);else{if(Ce!==0||e!==null&&e.flags&128)for(e=n.child;e!==null;){if(s=is(e),s!==null){for(n.flags|=128,Xr(o,!1),r=s.updateQueue,r!==null&&(n.updateQueue=r,n.flags|=4),n.subtreeFlags=0,r=t,t=n.child;t!==null;)o=t,e=r,o.flags&=14680066,s=o.alternate,s===null?(o.childLanes=0,o.lanes=e,o.child=null,o.subtreeFlags=0,o.memoizedProps=null,o.memoizedState=null,o.updateQueue=null,o.dependencies=null,o.stateNode=null):(o.childLanes=s.childLanes,o.lanes=s.lanes,o.child=s.child,o.subtreeFlags=0,o.deletions=null,o.memoizedProps=s.memoizedProps,o.memoizedState=s.memoizedState,o.updateQueue=s.updateQueue,o.type=s.type,e=s.dependencies,o.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),t=t.sibling;return fe(be,be.current&1|2),n.child}e=e.sibling}o.tail!==null&&Se()>Dr&&(n.flags|=128,r=!0,Xr(o,!1),n.lanes=4194304)}else{if(!r)if(e=is(s),e!==null){if(n.flags|=128,r=!0,t=e.updateQueue,t!==null&&(n.updateQueue=t,n.flags|=4),Xr(o,!0),o.tail===null&&o.tailMode==="hidden"&&!s.alternate&&!ye)return Pe(n),null}else 2*Se()-o.renderingStartTime>Dr&&t!==1073741824&&(n.flags|=128,r=!0,Xr(o,!1),n.lanes=4194304);o.isBackwards?(s.sibling=n.child,n.child=s):(t=o.last,t!==null?t.sibling=s:n.child=s,o.last=s)}return o.tail!==null?(n=o.tail,o.rendering=n,o.tail=n.sibling,o.renderingStartTime=Se(),n.sibling=null,t=be.current,fe(be,r?t&1|2:t&1),n):(Pe(n),null);case 22:case 23:return Ic(),r=n.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(n.flags|=8192),r&&n.mode&1?on&1073741824&&(Pe(n),n.subtreeFlags&6&&(n.flags|=8192)):Pe(n),null;case 24:return null;case 25:return null}throw Error(j(156,n.tag))}function nv(e,n){switch(uc(n),n.tag){case 1:return Qe(n.type)&&Xo(),e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 3:return Or(),me(Ye),me(je),vc(),e=n.flags,e&65536&&!(e&128)?(n.flags=e&-65537|128,n):null;case 5:return bc(n),null;case 13:if(me(be),e=n.memoizedState,e!==null&&e.dehydrated!==null){if(n.alternate===null)throw Error(j(340));Ir()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 19:return me(be),null;case 4:return Or(),null;case 10:return hc(n.type._context),null;case 22:case 23:return Ic(),null;case 24:return null;default:return null}}var co=!1,Be=!1,tv=typeof WeakSet=="function"?WeakSet:Set,K=null;function br(e,n){var t=e.ref;if(t!==null)if(typeof t=="function")try{t(null)}catch(r){xe(e,n,r)}else t.current=null}function xl(e,n,t){try{t()}catch(r){xe(e,n,r)}}var sd=!1;function rv(e,n){if(il=Vo,e=Wf(),lc(e)){if("selectionStart"in e)var t={start:e.selectionStart,end:e.selectionEnd};else e:{t=(t=e.ownerDocument)&&t.defaultView||window;var r=t.getSelection&&t.getSelection();if(r&&r.rangeCount!==0){t=r.anchorNode;var i=r.anchorOffset,o=r.focusNode;r=r.focusOffset;try{t.nodeType,o.nodeType}catch{t=null;break e}var s=0,a=-1,l=-1,c=0,u=0,d=e,p=null;n:for(;;){for(var h;d!==t||i!==0&&d.nodeType!==3||(a=s+i),d!==o||r!==0&&d.nodeType!==3||(l=s+r),d.nodeType===3&&(s+=d.nodeValue.length),(h=d.firstChild)!==null;)p=d,d=h;for(;;){if(d===e)break n;if(p===t&&++c===i&&(a=s),p===o&&++u===r&&(l=s),(h=d.nextSibling)!==null)break;d=p,p=d.parentNode}d=h}t=a===-1||l===-1?null:{start:a,end:l}}else t=null}t=t||{start:0,end:0}}else t=null;for(ol={focusedElem:e,selectionRange:t},Vo=!1,K=n;K!==null;)if(n=K,e=n.child,(n.subtreeFlags&1028)!==0&&e!==null)e.return=n,K=e;else for(;K!==null;){n=K;try{var v=n.alternate;if(n.flags&1024)switch(n.tag){case 0:case 11:case 15:break;case 1:if(v!==null){var w=v.memoizedProps,S=v.memoizedState,g=n.stateNode,m=g.getSnapshotBeforeUpdate(n.elementType===n.type?w:Cn(n.type,w),S);g.__reactInternalSnapshotBeforeUpdate=m}break;case 3:var y=n.stateNode.containerInfo;y.nodeType===1?y.textContent="":y.nodeType===9&&y.documentElement&&y.removeChild(y.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(j(163))}}catch(_){xe(n,n.return,_)}if(e=n.sibling,e!==null){e.return=n.return,K=e;break}K=n.return}return v=sd,sd=!1,v}function pi(e,n,t){var r=n.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var i=r=r.next;do{if((i.tag&e)===e){var o=i.destroy;i.destroy=void 0,o!==void 0&&xl(n,t,o)}i=i.next}while(i!==r)}}function Ns(e,n){if(n=n.updateQueue,n=n!==null?n.lastEffect:null,n!==null){var t=n=n.next;do{if((t.tag&e)===e){var r=t.create;t.destroy=r()}t=t.next}while(t!==n)}}function Sl(e){var n=e.ref;if(n!==null){var t=e.stateNode;switch(e.tag){case 5:e=t;break;default:e=t}typeof n=="function"?n(e):n.current=e}}function $h(e){var n=e.alternate;n!==null&&(e.alternate=null,$h(n)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(n=e.stateNode,n!==null&&(delete n[jn],delete n[Ii],delete n[ll],delete n[Fb],delete n[zb])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Hh(e){return e.tag===5||e.tag===3||e.tag===4}function ad(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Hh(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function kl(e,n,t){var r=e.tag;if(r===5||r===6)e=e.stateNode,n?t.nodeType===8?t.parentNode.insertBefore(e,n):t.insertBefore(e,n):(t.nodeType===8?(n=t.parentNode,n.insertBefore(e,t)):(n=t,n.appendChild(e)),t=t._reactRootContainer,t!=null||n.onclick!==null||(n.onclick=Qo));else if(r!==4&&(e=e.child,e!==null))for(kl(e,n,t),e=e.sibling;e!==null;)kl(e,n,t),e=e.sibling}function El(e,n,t){var r=e.tag;if(r===5||r===6)e=e.stateNode,n?t.insertBefore(e,n):t.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(El(e,n,t),e=e.sibling;e!==null;)El(e,n,t),e=e.sibling}var Oe=null,Tn=!1;function ot(e,n,t){for(t=t.child;t!==null;)Gh(e,n,t),t=t.sibling}function Gh(e,n,t){if(zn&&typeof zn.onCommitFiberUnmount=="function")try{zn.onCommitFiberUnmount(xs,t)}catch{}switch(t.tag){case 5:Be||br(t,n);case 6:var r=Oe,i=Tn;Oe=null,ot(e,n,t),Oe=r,Tn=i,Oe!==null&&(Tn?(e=Oe,t=t.stateNode,e.nodeType===8?e.parentNode.removeChild(t):e.removeChild(t)):Oe.removeChild(t.stateNode));break;case 18:Oe!==null&&(Tn?(e=Oe,t=t.stateNode,e.nodeType===8?sa(e.parentNode,t):e.nodeType===1&&sa(e,t),_i(e)):sa(Oe,t.stateNode));break;case 4:r=Oe,i=Tn,Oe=t.stateNode.containerInfo,Tn=!0,ot(e,n,t),Oe=r,Tn=i;break;case 0:case 11:case 14:case 15:if(!Be&&(r=t.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){i=r=r.next;do{var o=i,s=o.destroy;o=o.tag,s!==void 0&&(o&2||o&4)&&xl(t,n,s),i=i.next}while(i!==r)}ot(e,n,t);break;case 1:if(!Be&&(br(t,n),r=t.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=t.memoizedProps,r.state=t.memoizedState,r.componentWillUnmount()}catch(a){xe(t,n,a)}ot(e,n,t);break;case 21:ot(e,n,t);break;case 22:t.mode&1?(Be=(r=Be)||t.memoizedState!==null,ot(e,n,t),Be=r):ot(e,n,t);break;default:ot(e,n,t)}}function ld(e){var n=e.updateQueue;if(n!==null){e.updateQueue=null;var t=e.stateNode;t===null&&(t=e.stateNode=new tv),n.forEach(function(r){var i=pv.bind(null,e,r);t.has(r)||(t.add(r),r.then(i,i))})}}function _n(e,n){var t=n.deletions;if(t!==null)for(var r=0;r<t.length;r++){var i=t[r];try{var o=e,s=n,a=s;e:for(;a!==null;){switch(a.tag){case 5:Oe=a.stateNode,Tn=!1;break e;case 3:Oe=a.stateNode.containerInfo,Tn=!0;break e;case 4:Oe=a.stateNode.containerInfo,Tn=!0;break e}a=a.return}if(Oe===null)throw Error(j(160));Gh(o,s,i),Oe=null,Tn=!1;var l=i.alternate;l!==null&&(l.return=null),i.return=null}catch(c){xe(i,n,c)}}if(n.subtreeFlags&12854)for(n=n.child;n!==null;)Wh(n,e),n=n.sibling}function Wh(e,n){var t=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(_n(n,e),Dn(e),r&4){try{pi(3,e,e.return),Ns(3,e)}catch(w){xe(e,e.return,w)}try{pi(5,e,e.return)}catch(w){xe(e,e.return,w)}}break;case 1:_n(n,e),Dn(e),r&512&&t!==null&&br(t,t.return);break;case 5:if(_n(n,e),Dn(e),r&512&&t!==null&&br(t,t.return),e.flags&32){var i=e.stateNode;try{xi(i,"")}catch(w){xe(e,e.return,w)}}if(r&4&&(i=e.stateNode,i!=null)){var o=e.memoizedProps,s=t!==null?t.memoizedProps:o,a=e.type,l=e.updateQueue;if(e.updateQueue=null,l!==null)try{a==="input"&&o.type==="radio"&&o.name!=null&&pf(i,o),qa(a,s);var c=qa(a,o);for(s=0;s<l.length;s+=2){var u=l[s],d=l[s+1];u==="style"?yf(i,d):u==="dangerouslySetInnerHTML"?gf(i,d):u==="children"?xi(i,d):Yl(i,u,d,c)}switch(a){case"input":Ha(i,o);break;case"textarea":ff(i,o);break;case"select":var p=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!o.multiple;var h=o.value;h!=null?xr(i,!!o.multiple,h,!1):p!==!!o.multiple&&(o.defaultValue!=null?xr(i,!!o.multiple,o.defaultValue,!0):xr(i,!!o.multiple,o.multiple?[]:"",!1))}i[Ii]=o}catch(w){xe(e,e.return,w)}}break;case 6:if(_n(n,e),Dn(e),r&4){if(e.stateNode===null)throw Error(j(162));i=e.stateNode,o=e.memoizedProps;try{i.nodeValue=o}catch(w){xe(e,e.return,w)}}break;case 3:if(_n(n,e),Dn(e),r&4&&t!==null&&t.memoizedState.isDehydrated)try{_i(n.containerInfo)}catch(w){xe(e,e.return,w)}break;case 4:_n(n,e),Dn(e);break;case 13:_n(n,e),Dn(e),i=e.child,i.flags&8192&&(o=i.memoizedState!==null,i.stateNode.isHidden=o,!o||i.alternate!==null&&i.alternate.memoizedState!==null||(Rc=Se())),r&4&&ld(e);break;case 22:if(u=t!==null&&t.memoizedState!==null,e.mode&1?(Be=(c=Be)||u,_n(n,e),Be=c):_n(n,e),Dn(e),r&8192){if(c=e.memoizedState!==null,(e.stateNode.isHidden=c)&&!u&&e.mode&1)for(K=e,u=e.child;u!==null;){for(d=K=u;K!==null;){switch(p=K,h=p.child,p.tag){case 0:case 11:case 14:case 15:pi(4,p,p.return);break;case 1:br(p,p.return);var v=p.stateNode;if(typeof v.componentWillUnmount=="function"){r=p,t=p.return;try{n=r,v.props=n.memoizedProps,v.state=n.memoizedState,v.componentWillUnmount()}catch(w){xe(r,t,w)}}break;case 5:br(p,p.return);break;case 22:if(p.memoizedState!==null){ud(d);continue}}h!==null?(h.return=p,K=h):ud(d)}u=u.sibling}e:for(u=null,d=e;;){if(d.tag===5){if(u===null){u=d;try{i=d.stateNode,c?(o=i.style,typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"):(a=d.stateNode,l=d.memoizedProps.style,s=l!=null&&l.hasOwnProperty("display")?l.display:null,a.style.display=mf("display",s))}catch(w){xe(e,e.return,w)}}}else if(d.tag===6){if(u===null)try{d.stateNode.nodeValue=c?"":d.memoizedProps}catch(w){xe(e,e.return,w)}}else if((d.tag!==22&&d.tag!==23||d.memoizedState===null||d===e)&&d.child!==null){d.child.return=d,d=d.child;continue}if(d===e)break e;for(;d.sibling===null;){if(d.return===null||d.return===e)break e;u===d&&(u=null),d=d.return}u===d&&(u=null),d.sibling.return=d.return,d=d.sibling}}break;case 19:_n(n,e),Dn(e),r&4&&ld(e);break;case 21:break;default:_n(n,e),Dn(e)}}function Dn(e){var n=e.flags;if(n&2){try{e:{for(var t=e.return;t!==null;){if(Hh(t)){var r=t;break e}t=t.return}throw Error(j(160))}switch(r.tag){case 5:var i=r.stateNode;r.flags&32&&(xi(i,""),r.flags&=-33);var o=ad(e);El(e,o,i);break;case 3:case 4:var s=r.stateNode.containerInfo,a=ad(e);kl(e,a,s);break;default:throw Error(j(161))}}catch(l){xe(e,e.return,l)}e.flags&=-3}n&4096&&(e.flags&=-4097)}function iv(e,n,t){K=e,Kh(e)}function Kh(e,n,t){for(var r=(e.mode&1)!==0;K!==null;){var i=K,o=i.child;if(i.tag===22&&r){var s=i.memoizedState!==null||co;if(!s){var a=i.alternate,l=a!==null&&a.memoizedState!==null||Be;a=co;var c=Be;if(co=s,(Be=l)&&!c)for(K=i;K!==null;)s=K,l=s.child,s.tag===22&&s.memoizedState!==null?dd(i):l!==null?(l.return=s,K=l):dd(i);for(;o!==null;)K=o,Kh(o),o=o.sibling;K=i,co=a,Be=c}cd(e)}else i.subtreeFlags&8772&&o!==null?(o.return=i,K=o):cd(e)}}function cd(e){for(;K!==null;){var n=K;if(n.flags&8772){var t=n.alternate;try{if(n.flags&8772)switch(n.tag){case 0:case 11:case 15:Be||Ns(5,n);break;case 1:var r=n.stateNode;if(n.flags&4&&!Be)if(t===null)r.componentDidMount();else{var i=n.elementType===n.type?t.memoizedProps:Cn(n.type,t.memoizedProps);r.componentDidUpdate(i,t.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var o=n.updateQueue;o!==null&&Ku(n,o,r);break;case 3:var s=n.updateQueue;if(s!==null){if(t=null,n.child!==null)switch(n.child.tag){case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}Ku(n,s,t)}break;case 5:var a=n.stateNode;if(t===null&&n.flags&4){t=a;var l=n.memoizedProps;switch(n.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&t.focus();break;case"img":l.src&&(t.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(n.memoizedState===null){var c=n.alternate;if(c!==null){var u=c.memoizedState;if(u!==null){var d=u.dehydrated;d!==null&&_i(d)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(j(163))}Be||n.flags&512&&Sl(n)}catch(p){xe(n,n.return,p)}}if(n===e){K=null;break}if(t=n.sibling,t!==null){t.return=n.return,K=t;break}K=n.return}}function ud(e){for(;K!==null;){var n=K;if(n===e){K=null;break}var t=n.sibling;if(t!==null){t.return=n.return,K=t;break}K=n.return}}function dd(e){for(;K!==null;){var n=K;try{switch(n.tag){case 0:case 11:case 15:var t=n.return;try{Ns(4,n)}catch(l){xe(n,t,l)}break;case 1:var r=n.stateNode;if(typeof r.componentDidMount=="function"){var i=n.return;try{r.componentDidMount()}catch(l){xe(n,i,l)}}var o=n.return;try{Sl(n)}catch(l){xe(n,o,l)}break;case 5:var s=n.return;try{Sl(n)}catch(l){xe(n,s,l)}}}catch(l){xe(n,n.return,l)}if(n===e){K=null;break}var a=n.sibling;if(a!==null){a.return=n.return,K=a;break}K=n.return}}var ov=Math.ceil,as=it.ReactCurrentDispatcher,Cc=it.ReactCurrentOwner,wn=it.ReactCurrentBatchConfig,se=0,Ne=null,Ee=null,Me=0,on=0,vr=Tt(0),Ce=0,Pi=null,Vt=0,Is=0,Tc=0,fi=null,Ve=null,Rc=0,Dr=1/0,Vn=null,ls=!1,_l=null,xt=null,uo=!1,ft=null,cs=0,hi=0,Cl=null,Do=-1,Lo=0;function He(){return se&6?Se():Do!==-1?Do:Do=Se()}function St(e){return e.mode&1?se&2&&Me!==0?Me&-Me:$b.transition!==null?(Lo===0&&(Lo=Nf()),Lo):(e=ce,e!==0||(e=window.event,e=e===void 0?16:Pf(e.type)),e):1}function In(e,n,t,r){if(50<hi)throw hi=0,Cl=null,Error(j(185));Hi(e,t,r),(!(se&2)||e!==Ne)&&(e===Ne&&(!(se&2)&&(Is|=t),Ce===4&&dt(e,Me)),Xe(e,r),t===1&&se===0&&!(n.mode&1)&&(Dr=Se()+500,Cs&&Rt()))}function Xe(e,n){var t=e.callbackNode;$y(e,n);var r=Ko(e,e===Ne?Me:0);if(r===0)t!==null&&wu(t),e.callbackNode=null,e.callbackPriority=0;else if(n=r&-r,e.callbackPriority!==n){if(t!=null&&wu(t),n===1)e.tag===0?Ub(pd.bind(null,e)):nh(pd.bind(null,e)),Bb(function(){!(se&6)&&Rt()}),t=null;else{switch(If(r)){case 1:t=ec;break;case 4:t=Tf;break;case 16:t=Wo;break;case 536870912:t=Rf;break;default:t=Wo}t=eg(t,Vh.bind(null,e))}e.callbackPriority=n,e.callbackNode=t}}function Vh(e,n){if(Do=-1,Lo=0,se&6)throw Error(j(327));var t=e.callbackNode;if(Cr()&&e.callbackNode!==t)return null;var r=Ko(e,e===Ne?Me:0);if(r===0)return null;if(r&30||r&e.expiredLanes||n)n=us(e,r);else{n=r;var i=se;se|=2;var o=Yh();(Ne!==e||Me!==n)&&(Vn=null,Dr=Se()+500,Ft(e,n));do try{lv();break}catch(a){qh(e,a)}while(!0);fc(),as.current=o,se=i,Ee!==null?n=0:(Ne=null,Me=0,n=Ce)}if(n!==0){if(n===2&&(i=Ja(e),i!==0&&(r=i,n=Tl(e,i))),n===1)throw t=Pi,Ft(e,0),dt(e,r),Xe(e,Se()),t;if(n===6)dt(e,r);else{if(i=e.current.alternate,!(r&30)&&!sv(i)&&(n=us(e,r),n===2&&(o=Ja(e),o!==0&&(r=o,n=Tl(e,o))),n===1))throw t=Pi,Ft(e,0),dt(e,r),Xe(e,Se()),t;switch(e.finishedWork=i,e.finishedLanes=r,n){case 0:case 1:throw Error(j(345));case 2:Mt(e,Ve,Vn);break;case 3:if(dt(e,r),(r&130023424)===r&&(n=Rc+500-Se(),10<n)){if(Ko(e,0)!==0)break;if(i=e.suspendedLanes,(i&r)!==r){He(),e.pingedLanes|=e.suspendedLanes&i;break}e.timeoutHandle=al(Mt.bind(null,e,Ve,Vn),n);break}Mt(e,Ve,Vn);break;case 4:if(dt(e,r),(r&4194240)===r)break;for(n=e.eventTimes,i=-1;0<r;){var s=31-Nn(r);o=1<<s,s=n[s],s>i&&(i=s),r&=~o}if(r=i,r=Se()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*ov(r/1960))-r,10<r){e.timeoutHandle=al(Mt.bind(null,e,Ve,Vn),r);break}Mt(e,Ve,Vn);break;case 5:Mt(e,Ve,Vn);break;default:throw Error(j(329))}}}return Xe(e,Se()),e.callbackNode===t?Vh.bind(null,e):null}function Tl(e,n){var t=fi;return e.current.memoizedState.isDehydrated&&(Ft(e,n).flags|=256),e=us(e,n),e!==2&&(n=Ve,Ve=t,n!==null&&Rl(n)),e}function Rl(e){Ve===null?Ve=e:Ve.push.apply(Ve,e)}function sv(e){for(var n=e;;){if(n.flags&16384){var t=n.updateQueue;if(t!==null&&(t=t.stores,t!==null))for(var r=0;r<t.length;r++){var i=t[r],o=i.getSnapshot;i=i.value;try{if(!An(o(),i))return!1}catch{return!1}}}if(t=n.child,n.subtreeFlags&16384&&t!==null)t.return=n,n=t;else{if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function dt(e,n){for(n&=~Tc,n&=~Is,e.suspendedLanes|=n,e.pingedLanes&=~n,e=e.expirationTimes;0<n;){var t=31-Nn(n),r=1<<t;e[t]=-1,n&=~r}}function pd(e){if(se&6)throw Error(j(327));Cr();var n=Ko(e,0);if(!(n&1))return Xe(e,Se()),null;var t=us(e,n);if(e.tag!==0&&t===2){var r=Ja(e);r!==0&&(n=r,t=Tl(e,r))}if(t===1)throw t=Pi,Ft(e,0),dt(e,n),Xe(e,Se()),t;if(t===6)throw Error(j(345));return e.finishedWork=e.current.alternate,e.finishedLanes=n,Mt(e,Ve,Vn),Xe(e,Se()),null}function Nc(e,n){var t=se;se|=1;try{return e(n)}finally{se=t,se===0&&(Dr=Se()+500,Cs&&Rt())}}function qt(e){ft!==null&&ft.tag===0&&!(se&6)&&Cr();var n=se;se|=1;var t=wn.transition,r=ce;try{if(wn.transition=null,ce=1,e)return e()}finally{ce=r,wn.transition=t,se=n,!(se&6)&&Rt()}}function Ic(){on=vr.current,me(vr)}function Ft(e,n){e.finishedWork=null,e.finishedLanes=0;var t=e.timeoutHandle;if(t!==-1&&(e.timeoutHandle=-1,Pb(t)),Ee!==null)for(t=Ee.return;t!==null;){var r=t;switch(uc(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Xo();break;case 3:Or(),me(Ye),me(je),vc();break;case 5:bc(r);break;case 4:Or();break;case 13:me(be);break;case 19:me(be);break;case 10:hc(r.type._context);break;case 22:case 23:Ic()}t=t.return}if(Ne=e,Ee=e=kt(e.current,null),Me=on=n,Ce=0,Pi=null,Tc=Is=Vt=0,Ve=fi=null,Bt!==null){for(n=0;n<Bt.length;n++)if(t=Bt[n],r=t.interleaved,r!==null){t.interleaved=null;var i=r.next,o=t.pending;if(o!==null){var s=o.next;o.next=i,r.next=s}t.pending=r}Bt=null}return e}function qh(e,n){do{var t=Ee;try{if(fc(),Ao.current=ss,os){for(var r=ve.memoizedState;r!==null;){var i=r.queue;i!==null&&(i.pending=null),r=r.next}os=!1}if(Kt=0,Re=_e=ve=null,di=!1,Mi=0,Cc.current=null,t===null||t.return===null){Ce=1,Pi=n,Ee=null;break}e:{var o=e,s=t.return,a=t,l=n;if(n=Me,a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,u=a,d=u.tag;if(!(u.mode&1)&&(d===0||d===11||d===15)){var p=u.alternate;p?(u.updateQueue=p.updateQueue,u.memoizedState=p.memoizedState,u.lanes=p.lanes):(u.updateQueue=null,u.memoizedState=null)}var h=Ju(s);if(h!==null){h.flags&=-257,ed(h,s,a,o,n),h.mode&1&&Zu(o,c,n),n=h,l=c;var v=n.updateQueue;if(v===null){var w=new Set;w.add(l),n.updateQueue=w}else v.add(l);break e}else{if(!(n&1)){Zu(o,c,n),Ac();break e}l=Error(j(426))}}else if(ye&&a.mode&1){var S=Ju(s);if(S!==null){!(S.flags&65536)&&(S.flags|=256),ed(S,s,a,o,n),dc(Mr(l,a));break e}}o=l=Mr(l,a),Ce!==4&&(Ce=2),fi===null?fi=[o]:fi.push(o),o=s;do{switch(o.tag){case 3:o.flags|=65536,n&=-n,o.lanes|=n;var g=Ah(o,l,n);Wu(o,g);break e;case 1:a=l;var m=o.type,y=o.stateNode;if(!(o.flags&128)&&(typeof m.getDerivedStateFromError=="function"||y!==null&&typeof y.componentDidCatch=="function"&&(xt===null||!xt.has(y)))){o.flags|=65536,n&=-n,o.lanes|=n;var _=Oh(o,a,n);Wu(o,_);break e}}o=o.return}while(o!==null)}Xh(t)}catch(N){n=N,Ee===t&&t!==null&&(Ee=t=t.return);continue}break}while(!0)}function Yh(){var e=as.current;return as.current=ss,e===null?ss:e}function Ac(){(Ce===0||Ce===3||Ce===2)&&(Ce=4),Ne===null||!(Vt&268435455)&&!(Is&268435455)||dt(Ne,Me)}function us(e,n){var t=se;se|=2;var r=Yh();(Ne!==e||Me!==n)&&(Vn=null,Ft(e,n));do try{av();break}catch(i){qh(e,i)}while(!0);if(fc(),se=t,as.current=r,Ee!==null)throw Error(j(261));return Ne=null,Me=0,Ce}function av(){for(;Ee!==null;)Qh(Ee)}function lv(){for(;Ee!==null&&!My();)Qh(Ee)}function Qh(e){var n=Jh(e.alternate,e,on);e.memoizedProps=e.pendingProps,n===null?Xh(e):Ee=n,Cc.current=null}function Xh(e){var n=e;do{var t=n.alternate;if(e=n.return,n.flags&32768){if(t=nv(t,n),t!==null){t.flags&=32767,Ee=t;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Ce=6,Ee=null;return}}else if(t=ev(t,n,on),t!==null){Ee=t;return}if(n=n.sibling,n!==null){Ee=n;return}Ee=n=e}while(n!==null);Ce===0&&(Ce=5)}function Mt(e,n,t){var r=ce,i=wn.transition;try{wn.transition=null,ce=1,cv(e,n,t,r)}finally{wn.transition=i,ce=r}return null}function cv(e,n,t,r){do Cr();while(ft!==null);if(se&6)throw Error(j(327));t=e.finishedWork;var i=e.finishedLanes;if(t===null)return null;if(e.finishedWork=null,e.finishedLanes=0,t===e.current)throw Error(j(177));e.callbackNode=null,e.callbackPriority=0;var o=t.lanes|t.childLanes;if(Hy(e,o),e===Ne&&(Ee=Ne=null,Me=0),!(t.subtreeFlags&2064)&&!(t.flags&2064)||uo||(uo=!0,eg(Wo,function(){return Cr(),null})),o=(t.flags&15990)!==0,t.subtreeFlags&15990||o){o=wn.transition,wn.transition=null;var s=ce;ce=1;var a=se;se|=4,Cc.current=null,rv(e,t),Wh(t,e),Nb(ol),Vo=!!il,ol=il=null,e.current=t,iv(t),Dy(),se=a,ce=s,wn.transition=o}else e.current=t;if(uo&&(uo=!1,ft=e,cs=i),o=e.pendingLanes,o===0&&(xt=null),By(t.stateNode),Xe(e,Se()),n!==null)for(r=e.onRecoverableError,t=0;t<n.length;t++)i=n[t],r(i.value,{componentStack:i.stack,digest:i.digest});if(ls)throw ls=!1,e=_l,_l=null,e;return cs&1&&e.tag!==0&&Cr(),o=e.pendingLanes,o&1?e===Cl?hi++:(hi=0,Cl=e):hi=0,Rt(),null}function Cr(){if(ft!==null){var e=If(cs),n=wn.transition,t=ce;try{if(wn.transition=null,ce=16>e?16:e,ft===null)var r=!1;else{if(e=ft,ft=null,cs=0,se&6)throw Error(j(331));var i=se;for(se|=4,K=e.current;K!==null;){var o=K,s=o.child;if(K.flags&16){var a=o.deletions;if(a!==null){for(var l=0;l<a.length;l++){var c=a[l];for(K=c;K!==null;){var u=K;switch(u.tag){case 0:case 11:case 15:pi(8,u,o)}var d=u.child;if(d!==null)d.return=u,K=d;else for(;K!==null;){u=K;var p=u.sibling,h=u.return;if($h(u),u===c){K=null;break}if(p!==null){p.return=h,K=p;break}K=h}}}var v=o.alternate;if(v!==null){var w=v.child;if(w!==null){v.child=null;do{var S=w.sibling;w.sibling=null,w=S}while(w!==null)}}K=o}}if(o.subtreeFlags&2064&&s!==null)s.return=o,K=s;else e:for(;K!==null;){if(o=K,o.flags&2048)switch(o.tag){case 0:case 11:case 15:pi(9,o,o.return)}var g=o.sibling;if(g!==null){g.return=o.return,K=g;break e}K=o.return}}var m=e.current;for(K=m;K!==null;){s=K;var y=s.child;if(s.subtreeFlags&2064&&y!==null)y.return=s,K=y;else e:for(s=m;K!==null;){if(a=K,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:Ns(9,a)}}catch(N){xe(a,a.return,N)}if(a===s){K=null;break e}var _=a.sibling;if(_!==null){_.return=a.return,K=_;break e}K=a.return}}if(se=i,Rt(),zn&&typeof zn.onPostCommitFiberRoot=="function")try{zn.onPostCommitFiberRoot(xs,e)}catch{}r=!0}return r}finally{ce=t,wn.transition=n}}return!1}function fd(e,n,t){n=Mr(t,n),n=Ah(e,n,1),e=wt(e,n,1),n=He(),e!==null&&(Hi(e,1,n),Xe(e,n))}function xe(e,n,t){if(e.tag===3)fd(e,e,t);else for(;n!==null;){if(n.tag===3){fd(n,e,t);break}else if(n.tag===1){var r=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(xt===null||!xt.has(r))){e=Mr(t,e),e=Oh(n,e,1),n=wt(n,e,1),e=He(),n!==null&&(Hi(n,1,e),Xe(n,e));break}}n=n.return}}function uv(e,n,t){var r=e.pingCache;r!==null&&r.delete(n),n=He(),e.pingedLanes|=e.suspendedLanes&t,Ne===e&&(Me&t)===t&&(Ce===4||Ce===3&&(Me&130023424)===Me&&500>Se()-Rc?Ft(e,0):Tc|=t),Xe(e,n)}function Zh(e,n){n===0&&(e.mode&1?(n=eo,eo<<=1,!(eo&130023424)&&(eo=4194304)):n=1);var t=He();e=tt(e,n),e!==null&&(Hi(e,n,t),Xe(e,t))}function dv(e){var n=e.memoizedState,t=0;n!==null&&(t=n.retryLane),Zh(e,t)}function pv(e,n){var t=0;switch(e.tag){case 13:var r=e.stateNode,i=e.memoizedState;i!==null&&(t=i.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(j(314))}r!==null&&r.delete(n),Zh(e,t)}var Jh;Jh=function(e,n,t){if(e!==null)if(e.memoizedProps!==n.pendingProps||Ye.current)qe=!0;else{if(!(e.lanes&t)&&!(n.flags&128))return qe=!1,Jb(e,n,t);qe=!!(e.flags&131072)}else qe=!1,ye&&n.flags&1048576&&th(n,es,n.index);switch(n.lanes=0,n.tag){case 2:var r=n.type;Mo(e,n),e=n.pendingProps;var i=Nr(n,je.current);_r(n,t),i=xc(null,n,r,e,i,t);var o=Sc();return n.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(n.tag=1,n.memoizedState=null,n.updateQueue=null,Qe(r)?(o=!0,Zo(n)):o=!1,n.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,mc(n),i.updater=Ts,n.stateNode=i,i._reactInternals=n,hl(n,r,e,t),n=yl(null,n,r,!0,o,t)):(n.tag=0,ye&&o&&cc(n),$e(null,n,i,t),n=n.child),n;case 16:r=n.elementType;e:{switch(Mo(e,n),e=n.pendingProps,i=r._init,r=i(r._payload),n.type=r,i=n.tag=hv(r),e=Cn(r,e),i){case 0:n=ml(null,n,r,e,t);break e;case 1:n=rd(null,n,r,e,t);break e;case 11:n=nd(null,n,r,e,t);break e;case 14:n=td(null,n,r,Cn(r.type,e),t);break e}throw Error(j(306,r,""))}return n;case 0:return r=n.type,i=n.pendingProps,i=n.elementType===r?i:Cn(r,i),ml(e,n,r,i,t);case 1:return r=n.type,i=n.pendingProps,i=n.elementType===r?i:Cn(r,i),rd(e,n,r,i,t);case 3:e:{if(Ph(n),e===null)throw Error(j(387));r=n.pendingProps,o=n.memoizedState,i=o.element,sh(e,n),rs(n,r,null,t);var s=n.memoizedState;if(r=s.element,o.isDehydrated)if(o={element:r,isDehydrated:!1,cache:s.cache,pendingSuspenseBoundaries:s.pendingSuspenseBoundaries,transitions:s.transitions},n.updateQueue.baseState=o,n.memoizedState=o,n.flags&256){i=Mr(Error(j(423)),n),n=id(e,n,r,t,i);break e}else if(r!==i){i=Mr(Error(j(424)),n),n=id(e,n,r,t,i);break e}else for(sn=vt(n.stateNode.containerInfo.firstChild),ln=n,ye=!0,Rn=null,t=uh(n,null,r,t),n.child=t;t;)t.flags=t.flags&-3|4096,t=t.sibling;else{if(Ir(),r===i){n=rt(e,n,t);break e}$e(e,n,r,t)}n=n.child}return n;case 5:return dh(n),e===null&&dl(n),r=n.type,i=n.pendingProps,o=e!==null?e.memoizedProps:null,s=i.children,sl(r,i)?s=null:o!==null&&sl(r,o)&&(n.flags|=32),Lh(e,n),$e(e,n,s,t),n.child;case 6:return e===null&&dl(n),null;case 13:return Bh(e,n,t);case 4:return yc(n,n.stateNode.containerInfo),r=n.pendingProps,e===null?n.child=Ar(n,null,r,t):$e(e,n,r,t),n.child;case 11:return r=n.type,i=n.pendingProps,i=n.elementType===r?i:Cn(r,i),nd(e,n,r,i,t);case 7:return $e(e,n,n.pendingProps,t),n.child;case 8:return $e(e,n,n.pendingProps.children,t),n.child;case 12:return $e(e,n,n.pendingProps.children,t),n.child;case 10:e:{if(r=n.type._context,i=n.pendingProps,o=n.memoizedProps,s=i.value,fe(ns,r._currentValue),r._currentValue=s,o!==null)if(An(o.value,s)){if(o.children===i.children&&!Ye.current){n=rt(e,n,t);break e}}else for(o=n.child,o!==null&&(o.return=n);o!==null;){var a=o.dependencies;if(a!==null){s=o.child;for(var l=a.firstContext;l!==null;){if(l.context===r){if(o.tag===1){l=Zn(-1,t&-t),l.tag=2;var c=o.updateQueue;if(c!==null){c=c.shared;var u=c.pending;u===null?l.next=l:(l.next=u.next,u.next=l),c.pending=l}}o.lanes|=t,l=o.alternate,l!==null&&(l.lanes|=t),pl(o.return,t,n),a.lanes|=t;break}l=l.next}}else if(o.tag===10)s=o.type===n.type?null:o.child;else if(o.tag===18){if(s=o.return,s===null)throw Error(j(341));s.lanes|=t,a=s.alternate,a!==null&&(a.lanes|=t),pl(s,t,n),s=o.sibling}else s=o.child;if(s!==null)s.return=o;else for(s=o;s!==null;){if(s===n){s=null;break}if(o=s.sibling,o!==null){o.return=s.return,s=o;break}s=s.return}o=s}$e(e,n,i.children,t),n=n.child}return n;case 9:return i=n.type,r=n.pendingProps.children,_r(n,t),i=xn(i),r=r(i),n.flags|=1,$e(e,n,r,t),n.child;case 14:return r=n.type,i=Cn(r,n.pendingProps),i=Cn(r.type,i),td(e,n,r,i,t);case 15:return Mh(e,n,n.type,n.pendingProps,t);case 17:return r=n.type,i=n.pendingProps,i=n.elementType===r?i:Cn(r,i),Mo(e,n),n.tag=1,Qe(r)?(e=!0,Zo(n)):e=!1,_r(n,t),lh(n,r,i),hl(n,r,i,t),yl(null,n,r,!0,e,t);case 19:return jh(e,n,t);case 22:return Dh(e,n,t)}throw Error(j(156,n.tag))};function eg(e,n){return Cf(e,n)}function fv(e,n,t,r){this.tag=e,this.key=t,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function vn(e,n,t,r){return new fv(e,n,t,r)}function Oc(e){return e=e.prototype,!(!e||!e.isReactComponent)}function hv(e){if(typeof e=="function")return Oc(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Xl)return 11;if(e===Zl)return 14}return 2}function kt(e,n){var t=e.alternate;return t===null?(t=vn(e.tag,n,e.key,e.mode),t.elementType=e.elementType,t.type=e.type,t.stateNode=e.stateNode,t.alternate=e,e.alternate=t):(t.pendingProps=n,t.type=e.type,t.flags=0,t.subtreeFlags=0,t.deletions=null),t.flags=e.flags&14680064,t.childLanes=e.childLanes,t.lanes=e.lanes,t.child=e.child,t.memoizedProps=e.memoizedProps,t.memoizedState=e.memoizedState,t.updateQueue=e.updateQueue,n=e.dependencies,t.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},t.sibling=e.sibling,t.index=e.index,t.ref=e.ref,t}function Po(e,n,t,r,i,o){var s=2;if(r=e,typeof e=="function")Oc(e)&&(s=1);else if(typeof e=="string")s=5;else e:switch(e){case cr:return zt(t.children,i,o,n);case Ql:s=8,i|=8;break;case ja:return e=vn(12,t,n,i|2),e.elementType=ja,e.lanes=o,e;case Fa:return e=vn(13,t,n,i),e.elementType=Fa,e.lanes=o,e;case za:return e=vn(19,t,n,i),e.elementType=za,e.lanes=o,e;case cf:return As(t,i,o,n);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case af:s=10;break e;case lf:s=9;break e;case Xl:s=11;break e;case Zl:s=14;break e;case lt:s=16,r=null;break e}throw Error(j(130,e==null?e:typeof e,""))}return n=vn(s,t,n,i),n.elementType=e,n.type=r,n.lanes=o,n}function zt(e,n,t,r){return e=vn(7,e,r,n),e.lanes=t,e}function As(e,n,t,r){return e=vn(22,e,r,n),e.elementType=cf,e.lanes=t,e.stateNode={isHidden:!1},e}function ha(e,n,t){return e=vn(6,e,null,n),e.lanes=t,e}function ga(e,n,t){return n=vn(4,e.children!==null?e.children:[],e.key,n),n.lanes=t,n.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},n}function gv(e,n,t,r,i){this.tag=n,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Ys(0),this.expirationTimes=Ys(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ys(0),this.identifierPrefix=r,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function Mc(e,n,t,r,i,o,s,a,l){return e=new gv(e,n,t,a,l),n===1?(n=1,o===!0&&(n|=8)):n=0,o=vn(3,null,null,n),e.current=o,o.stateNode=e,o.memoizedState={element:r,isDehydrated:t,cache:null,transitions:null,pendingSuspenseBoundaries:null},mc(o),e}function mv(e,n,t){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:lr,key:r==null?null:""+r,children:e,containerInfo:n,implementation:t}}function ng(e){if(!e)return _t;e=e._reactInternals;e:{if(Qt(e)!==e||e.tag!==1)throw Error(j(170));var n=e;do{switch(n.tag){case 3:n=n.stateNode.context;break e;case 1:if(Qe(n.type)){n=n.stateNode.__reactInternalMemoizedMergedChildContext;break e}}n=n.return}while(n!==null);throw Error(j(171))}if(e.tag===1){var t=e.type;if(Qe(t))return eh(e,t,n)}return n}function tg(e,n,t,r,i,o,s,a,l){return e=Mc(t,r,!0,e,i,o,s,a,l),e.context=ng(null),t=e.current,r=He(),i=St(t),o=Zn(r,i),o.callback=n??null,wt(t,o,i),e.current.lanes=i,Hi(e,i,r),Xe(e,r),e}function Os(e,n,t,r){var i=n.current,o=He(),s=St(i);return t=ng(t),n.context===null?n.context=t:n.pendingContext=t,n=Zn(o,s),n.payload={element:e},r=r===void 0?null:r,r!==null&&(n.callback=r),e=wt(i,n,s),e!==null&&(In(e,i,s,o),Io(e,i,s)),s}function ds(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function hd(e,n){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var t=e.retryLane;e.retryLane=t!==0&&t<n?t:n}}function Dc(e,n){hd(e,n),(e=e.alternate)&&hd(e,n)}function yv(){return null}var rg=typeof reportError=="function"?reportError:function(e){console.error(e)};function Lc(e){this._internalRoot=e}Ms.prototype.render=Lc.prototype.render=function(e){var n=this._internalRoot;if(n===null)throw Error(j(409));Os(e,n,null,null)};Ms.prototype.unmount=Lc.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var n=e.containerInfo;qt(function(){Os(null,e,null,null)}),n[nt]=null}};function Ms(e){this._internalRoot=e}Ms.prototype.unstable_scheduleHydration=function(e){if(e){var n=Mf();e={blockedOn:null,target:e,priority:n};for(var t=0;t<ut.length&&n!==0&&n<ut[t].priority;t++);ut.splice(t,0,e),t===0&&Lf(e)}};function Pc(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Ds(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function gd(){}function bv(e,n,t,r,i){if(i){if(typeof r=="function"){var o=r;r=function(){var c=ds(s);o.call(c)}}var s=tg(n,r,e,0,null,!1,!1,"",gd);return e._reactRootContainer=s,e[nt]=s.current,Ri(e.nodeType===8?e.parentNode:e),qt(),s}for(;i=e.lastChild;)e.removeChild(i);if(typeof r=="function"){var a=r;r=function(){var c=ds(l);a.call(c)}}var l=Mc(e,0,!1,null,null,!1,!1,"",gd);return e._reactRootContainer=l,e[nt]=l.current,Ri(e.nodeType===8?e.parentNode:e),qt(function(){Os(n,l,t,r)}),l}function Ls(e,n,t,r,i){var o=t._reactRootContainer;if(o){var s=o;if(typeof i=="function"){var a=i;i=function(){var l=ds(s);a.call(l)}}Os(n,s,e,i)}else s=bv(t,n,e,i,r);return ds(s)}Af=function(e){switch(e.tag){case 3:var n=e.stateNode;if(n.current.memoizedState.isDehydrated){var t=ii(n.pendingLanes);t!==0&&(nc(n,t|1),Xe(n,Se()),!(se&6)&&(Dr=Se()+500,Rt()))}break;case 13:qt(function(){var r=tt(e,1);if(r!==null){var i=He();In(r,e,1,i)}}),Dc(e,1)}};tc=function(e){if(e.tag===13){var n=tt(e,134217728);if(n!==null){var t=He();In(n,e,134217728,t)}Dc(e,134217728)}};Of=function(e){if(e.tag===13){var n=St(e),t=tt(e,n);if(t!==null){var r=He();In(t,e,n,r)}Dc(e,n)}};Mf=function(){return ce};Df=function(e,n){var t=ce;try{return ce=e,n()}finally{ce=t}};Qa=function(e,n,t){switch(n){case"input":if(Ha(e,t),n=t.name,t.type==="radio"&&n!=null){for(t=e;t.parentNode;)t=t.parentNode;for(t=t.querySelectorAll("input[name="+JSON.stringify(""+n)+'][type="radio"]'),n=0;n<t.length;n++){var r=t[n];if(r!==e&&r.form===e.form){var i=_s(r);if(!i)throw Error(j(90));df(r),Ha(r,i)}}}break;case"textarea":ff(e,t);break;case"select":n=t.value,n!=null&&xr(e,!!t.multiple,n,!1)}};wf=Nc;xf=qt;var vv={usingClientEntryPoint:!1,Events:[Wi,fr,_s,bf,vf,Nc]},Zr={findFiberByHostInstance:Pt,bundleType:0,version:"18.2.0",rendererPackageName:"react-dom"},wv={bundleType:Zr.bundleType,version:Zr.version,rendererPackageName:Zr.rendererPackageName,rendererConfig:Zr.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:it.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Ef(e),e===null?null:e.stateNode},findFiberByHostInstance:Zr.findFiberByHostInstance||yv,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.2.0-next-9e3b772b8-20220608"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var po=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!po.isDisabled&&po.supportsFiber)try{xs=po.inject(wv),zn=po}catch{}}un.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=vv;un.createPortal=function(e,n){var t=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Pc(n))throw Error(j(200));return mv(e,n,null,t)};un.createRoot=function(e,n){if(!Pc(e))throw Error(j(299));var t=!1,r="",i=rg;return n!=null&&(n.unstable_strictMode===!0&&(t=!0),n.identifierPrefix!==void 0&&(r=n.identifierPrefix),n.onRecoverableError!==void 0&&(i=n.onRecoverableError)),n=Mc(e,1,!1,null,null,t,!1,r,i),e[nt]=n.current,Ri(e.nodeType===8?e.parentNode:e),new Lc(n)};un.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var n=e._reactInternals;if(n===void 0)throw typeof e.render=="function"?Error(j(188)):(e=Object.keys(e).join(","),Error(j(268,e)));return e=Ef(n),e=e===null?null:e.stateNode,e};un.flushSync=function(e){return qt(e)};un.hydrate=function(e,n,t){if(!Ds(n))throw Error(j(200));return Ls(null,e,n,!0,t)};un.hydrateRoot=function(e,n,t){if(!Pc(e))throw Error(j(405));var r=t!=null&&t.hydratedSources||null,i=!1,o="",s=rg;if(t!=null&&(t.unstable_strictMode===!0&&(i=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onRecoverableError!==void 0&&(s=t.onRecoverableError)),n=tg(n,null,e,1,t??null,i,!1,o,s),e[nt]=n.current,Ri(e),r)for(e=0;e<r.length;e++)t=r[e],i=t._getVersion,i=i(t._source),n.mutableSourceEagerHydrationData==null?n.mutableSourceEagerHydrationData=[t,i]:n.mutableSourceEagerHydrationData.push(t,i);return new Ms(n)};un.render=function(e,n,t){if(!Ds(n))throw Error(j(200));return Ls(null,e,n,!1,t)};un.unmountComponentAtNode=function(e){if(!Ds(e))throw Error(j(40));return e._reactRootContainer?(qt(function(){Ls(null,null,e,!1,function(){e._reactRootContainer=null,e[nt]=null})}),!0):!1};un.unstable_batchedUpdates=Nc;un.unstable_renderSubtreeIntoContainer=function(e,n,t,r){if(!Ds(t))throw Error(j(200));if(e==null||e._reactInternals===void 0)throw Error(j(38));return Ls(e,n,t,!1,r)};un.version="18.2.0-next-9e3b772b8-20220608";function ig(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(ig)}catch(e){console.error(e)}}ig(),nf.exports=un;var og=nf.exports;const xv=Br(og);var md=og;Pa.createRoot=md.createRoot,Pa.hydrateRoot=md.hydrateRoot;const Bo=0,sg=24*60,ma=sg-Bo,Sv=[{id:1,title:"Meeting A",start:9*60+30,end:11*60},{id:2,title:"Meeting B",start:10*60,end:12*60},{id:3,title:"Meeting C",start:13*60,end:14*60},{id:4,title:"Meeting D",start:13*60+30,end:15*60}];function kv(e){const n=[...e].sort((o,s)=>o.start-s.start),t=[];let r=[],i=-1/0;for(const o of n)!r.length||o.start<i?(r.push(o),i=Math.max(i,o.end)):(yd(r,t),r=[o],i=o.end);return r.length&&yd(r,t),t}function yd(e,n){const t=100/e.length;e.forEach((r,i)=>{n.push({...r,width:t,left:i*t})})}function Ev(){const e=kv(Sv),[n,t]=A.useState(new Date);A.useEffect(()=>{const s=setInterval(()=>{t(new Date)},6e4);return()=>clearInterval(s)},[]);const r=n.getHours()*60+n.getMinutes(),i=r>=Bo&&r<=sg,o=(r-Bo)/ma*100;return f.jsxs("div",{className:"calendar-wrapper",children:[f.jsx("div",{className:"time-column",children:Array.from({length:24}).map((s,a)=>f.jsxs("div",{className:"time-label",children:[0+a,":00"]},a))}),f.jsxs("div",{className:"calendar",children:[Array.from({length:24}).map((s,a)=>f.jsx("div",{className:"hour-line"},a)),i&&f.jsx("div",{className:"now-line",style:{top:`${o}%`},children:f.jsx("div",{className:"now-dot"})}),e.map(s=>f.jsx("div",{className:"event",style:{top:`${(s.start-Bo)/ma*100}%`,height:`${(s.end-s.start)/ma*100}%`,left:`${s.left}%`,width:`${s.width}%`},children:s.title},s.id))]})]})}const _v=Object.freeze(Object.defineProperty({__proto__:null,default:Ev},Symbol.toStringTag,{value:"Module"}));function Cv(){const e=["Slide 1","Slide 2","Slide 3"],[n,t]=A.useState(0),r=e.length;function i(){t(s=>(s+1)%r)}function o(){t(s=>(s-1+r)%r)}return f.jsxs("div",{className:"carousel-container",children:[f.jsxs("div",{className:"carousel",children:[f.jsx("button",{onClick:o,children:"←"}),f.jsx("div",{className:"carousel-window",children:f.jsx("div",{className:"carousel-track",style:{transform:`translateX(-${n*100}%)`},children:e.map((s,a)=>f.jsx("div",{className:"carousel-item",children:s},a))})}),f.jsx("button",{onClick:i,children:"→"})]}),f.jsx("div",{className:"dots",children:e.map((s,a)=>f.jsx("span",{className:`dot ${a===n?"active":""}`,onClick:()=>t(a)},a))})]})}const Tv=Object.freeze(Object.defineProperty({__proto__:null,default:Cv},Symbol.toStringTag,{value:"Module"})),jo=[{id:1,label:"Parent 1",children:[{id:2,label:"Child 1-1"},{id:3,label:"Child 1-2"}]},{id:4,label:"Parent 2",children:[{id:5,label:"Child 2-1",children:[{id:6,label:"Grandchild 2-1-1"}]}]}],Rv=A.memo(function e({node:n,checked:t,onCheck:r}){const i=A.useRef(null);return A.useEffect(()=>{i.current&&(i.current.indeterminate=Nv(n,t))},[n.id,t]),f.jsxs("li",{children:[f.jsxs("label",{children:[f.jsx("input",{ref:i,type:"checkbox",checked:t[n.id]??!1,onChange:o=>r(n,o.target.checked)}),f.jsx("span",{className:"node-label",children:n.label})]}),n.children&&f.jsx("ul",{children:n.children.map(o=>f.jsx(e,{node:o,checked:t,onCheck:r},o.id))})]})});function Nv(e,n){if(!e.children)return!1;const t=e.children.filter(r=>n[r.id]).length;return t>0&&t<e.children.length}function Iv({nodes:e,checked:n,onCheck:t}){return f.jsx("div",{className:"checkbox-tree",children:f.jsx("ul",{children:e.map(r=>f.jsx(Rv,{node:r,checked:n,onCheck:t},r.id))})})}function ag(e){let n={};for(const t of e)n[t.id]=!1,t.children&&(n={...n,...ag(t.children)});return n}function lg(e,n,t){if(t[e.id]=n,e.children)for(const r of e.children)lg(r,n,t)}const Nl=(e,n,t)=>{for(const r of n)if(r.children){if(r.children.some(i=>i.id===e.id)){t[r.id]=r.children.every(i=>t[i.id]),Nl(r,jo,t);return}Nl(e,r.children,t)}};function Av(){const[e,n]=A.useState(()=>ag(jo));function t(r,i){const o={...e};lg(r,i,o),Nl(r,jo,o),n(o)}return f.jsxs("div",{className:"tree-container",children:[f.jsx("h2",{children:"Hierarchical Checkbox Tree"}),f.jsx(Iv,{nodes:jo,checked:e,onCheck:t})]})}const Ov=Object.freeze(Object.defineProperty({__proto__:null,default:Av},Symbol.toStringTag,{value:"Module"})),bd=new Set(["3-3","3-4","4-3"]);function Mv(){const n=[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]],[t]=A.useState([0,0]),[r]=A.useState([7,7]),[i,o]=A.useState([]),s=()=>{const a=Array.from({length:8},()=>Array(8).fill(!1)),l=Array.from({length:8},()=>Array(8).fill(null)),c=[];for(c.push(t),a[t[0]][t[1]]=!0;c.length;){const[p,h]=c.shift();if(p===r[0]&&h===r[1])break;for(let[v,w]of n){const S=p+v,g=h+w;S>=0&&g>=0&&S<8&&g<8&&!a[S][g]&&!bd.has(`${S}-${g}`)&&(a[S][g]=!0,l[S][g]=[p,h],c.push([S,g]))}}if(!a[r[0]][r[1]]){alert("Target is unreachable!");return}const u=[];let d=r;for(;d;)u.push(d),d=l[d[0]][d[1]];o(u.reverse())};return f.jsxs("div",{className:"container",children:[f.jsx("h2",{children:"♞ Knight Shortest Path"}),f.jsx("button",{onClick:s,children:"Find Shortest Path"}),f.jsx("div",{className:"board",style:{display:"grid",gridTemplateColumns:"repeat(8, 40px)",gap:"2px",marginTop:"20px"},children:Array.from({length:8*8}).map((a,l)=>{const c=Math.floor(l/8),u=l%8,d=c===t[0]&&u===t[1],p=c===r[0]&&u===r[1],h=i.some(([S,g])=>S===c&&g===u),v=bd.has(`${c}-${u}`),w=(c+u)%2===1;return f.jsxs("div",{className:`cell
                ${w?"dark":"light"}
                ${h?"path":""}
                ${d?"start":""}
                ${p?"end":""}
                ${v?"blocked":""}`,style:{width:"40px",height:"40px",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid #ccc",backgroundColor:h?"lightgreen":v?"black":w?"#779556":"#ebecd0",color:v?"white":"inherit",fontWeight:"bold"},children:[v&&"X",d&&"S",p&&"T"]},`${c}-${u}`)})}),f.jsxs("div",{className:"legend",children:[f.jsx("div",{children:"🟩 Path = BFS shortest path"}),f.jsx("div",{children:"⬛ X = Blocked"}),f.jsx("div",{children:"S = Start"}),f.jsx("div",{children:"T = Target"})]})]})}const Dv=Object.freeze(Object.defineProperty({__proto__:null,default:Mv},Symbol.toStringTag,{value:"Module"}));function Lv(){const n=new Set(["3-3","3-4","4-3"]),[t]=A.useState([0,0]),[r]=A.useState([7,7]),[i,o]=A.useState([]),s=()=>{const a=Array.from({length:8},()=>Array(8).fill(!1)),l=Array.from({length:8},()=>Array(8).fill(null)),c=[t];for(a[t[0]][t[1]]=!0;c.length;){const[p,h]=c.shift();if(p===r[0]&&h===r[1])break;const v=[[1,0],[-1,0],[0,1],[0,-1]];for(let[w,S]of v){let g=p+w,m=h+S;for(;g>=0&&m>=0&&g<8&&m<8&&!n.has(`${g}-${m}`);)a[g][m]||(a[g][m]=!0,l[g][m]=[p,h],c.push([g,m])),g+=w,m+=S}}if(!a[r[0]][r[1]]){alert("Target is unreachable!");return}const u=[];let d=r;for(;d;)u.push(d),d=l[d[0]][d[1]];o(u.reverse())};return f.jsxs("div",{className:"container",children:[f.jsx("h2",{children:"♜ Rook Shortest Path"}),f.jsx("button",{onClick:s,children:"Find Shortest Path"}),f.jsx("div",{className:"board",style:{display:"grid",gridTemplateColumns:"repeat(8, 40px)",gap:"2px",marginTop:"20px"},children:Array.from({length:8}).map((a,l)=>Array.from({length:8}).map((c,u)=>{const d=(l+u)%2===1,p=l===t[0]&&u===t[1],h=l===r[0]&&u===r[1],v=n.has(`${l}-${u}`),w=i.some(([S,g])=>S===l&&g===u);return f.jsxs("div",{className:`cell
                  ${d?"dark":"light"}
                  ${v?"blocked":""}
                  ${w?"path":""}
                  ${p?"start":""}
                  ${h?"end":""}`,style:{width:"40px",height:"40px",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid #ccc",backgroundColor:w?"lightgreen":v?"black":d?"#779556":"#ebecd0",color:v?"white":"inherit",fontWeight:"bold"},children:[v&&"X",p&&"S",h&&"T"]},`${l}-${u}`)}))}),f.jsxs("div",{className:"legend",children:[f.jsx("div",{children:"🟩 Green: Shortest path"}),f.jsx("div",{children:"⬛ X: Blocked cell"}),f.jsx("div",{children:"S: Start"}),f.jsx("div",{children:"T: Target"}),f.jsx("div",{children:"Each straight line = 1 rook move"})]})]})}const Pv=Object.freeze(Object.defineProperty({__proto__:null,default:Lv},Symbol.toStringTag,{value:"Module"}));function Bv(){const[e,n]=A.useState([]),t=A.useRef(null);function r(o,s){const a=o.x-s.x,l=o.y-s.y;return Math.sqrt(a*a+l*l)<o.r+s.r}function i(o){const s=t.current.getBoundingClientRect(),a={id:Date.now(),x:o.clientX-s.left,y:o.clientY-s.top,r:50,color:"blue"};n(l=>{const c=[...l,a];return c.map(u=>{let d=!1;for(let p of c)if(u.id!==p.id&&r(u,p)){d=!0;break}return{...u,color:d?"red":"blue"}})})}return f.jsx("div",{ref:t,className:"canvas",onClick:i,children:e.map(o=>f.jsx("div",{className:"circle",style:{left:o.x-o.r,top:o.y-o.r,width:o.r*2,height:o.r*2,background:o.color}},o.id))})}const jv=Object.freeze(Object.defineProperty({__proto__:null,default:Bv},Symbol.toStringTag,{value:"Module"}));function Fv({rows:e=6,cols:n=7}){const r=()=>Array.from({length:e},()=>Array(n).fill(null)),[i,o]=A.useState(r),[s,a]=A.useState("Y"),[l,c]=A.useState(null),u=[[0,1],[1,0],[1,1],[1,-1]],d=(w,S,g,m,y,_)=>{let N=S+m,k=g+y,I=0;for(;N>=0&&k>=0&&N<e&&k<n&&w[N][k]===_;)I++,N+=m,k+=y;return I},p=(w,S,g,m)=>{for(let[y,_]of u)if(1+d(w,S,g,y,_,m)+d(w,S,g,-y,-_,m)>=4)return!0;return!1},h=w=>{if(l)return;const S=i.map(g=>[...g]);for(let g=e-1;g>=0;g--)if(!S[g][w]){S[g][w]=s,p(S,g,w,s)?c(s):a(m=>m==="Y"?"R":"Y"),o(S);return}},v=()=>{o(r()),a("Y"),c(null)};return f.jsxs("div",{style:{textAlign:"center"},children:[f.jsx("h2",{children:l?`Winner: ${l}`:`Turn: ${s}`}),f.jsx("div",{style:{marginBottom:10,display:"flex",justifyContent:"center",gap:10},children:Array.from({length:n}).map((w,S)=>f.jsx("button",{onClick:()=>h(S),children:"↓"},S))}),f.jsx("div",{style:{display:"grid",gridTemplateColumns:`repeat(${n}, 60px)`,gap:6,justifyContent:"center"},children:i.map((w,S)=>w.map((g,m)=>f.jsx("div",{style:{width:60,height:60,borderRadius:"50%",background:g==="Y"?"yellow":g==="R"?"red":"#ddd"}},`${S}-${m}`)))}),f.jsx("button",{onClick:v,style:{marginTop:20},children:"Reset"})]})}const zv=Object.freeze(Object.defineProperty({__proto__:null,default:Fv},Symbol.toStringTag,{value:"Module"})),vd=[{id:1,name:"Alice",age:32,role:"Engineer",salary:12e4},{id:2,name:"Bob",age:28,role:"Designer",salary:9e4},{id:3,name:"Carol",age:40,role:"Manager",salary:15e4},{id:4,name:"Dave",age:35,role:"Engineer",salary:13e4},{id:5,name:"Eve",age:29,role:"Engineer",salary:11e4},{id:6,name:"Frank",age:45,role:"Director",salary:18e4},{id:7,name:"Grace",age:27,role:"Designer",salary:85e3}];function Uv(){const[e,n]=A.useState(""),[t,r]=A.useState(null),[i,o]=A.useState("asc"),[s,a]=A.useState(1),l=3,u=[...vd.filter(S=>S.name.toLowerCase().includes(e.toLowerCase())||S.role.toLowerCase().includes(e.toLowerCase()))].sort((S,g)=>t?S[t]<g[t]?i==="asc"?-1:1:S[t]>g[t]?i==="asc"?1:-1:0:0),d=Math.ceil(u.length/l),p=(s-1)*l,h=u.slice(p,p+l),v=S=>{t===S?o(i==="asc"?"desc":"asc"):(r(S),o("asc"))},w=S=>{n(S.target.value),a(1)};return f.jsxs("div",{className:"dataTableWrapper",children:[f.jsx("h2",{children:"Employee Table"}),f.jsx("input",{placeholder:"Filter by name or role",value:e,onChange:w}),f.jsxs("table",{border:"1",cellPadding:8,children:[f.jsx("thead",{children:f.jsx("tr",{children:Object.keys(vd[0]).map(S=>f.jsxs("th",{onClick:()=>v(S),children:[S,t===S&&(i==="asc"?" ▲":" ▼")]},S))})}),f.jsx("tbody",{children:h.map(S=>f.jsx("tr",{children:Object.keys(S).map(g=>f.jsx("td",{children:S[g]},g))},S.id))})]}),f.jsxs("div",{style:{marginTop:10},children:[f.jsx("button",{disabled:s===1,onClick:()=>a(S=>S-1),children:"Prev"}),f.jsxs("span",{style:{margin:"0 10px"},children:["Page ",s," of ",d]}),f.jsx("button",{disabled:s===d,onClick:()=>a(S=>S+1),children:"Next"})]})]})}const $v=Object.freeze(Object.defineProperty({__proto__:null,default:Uv},Symbol.toStringTag,{value:"Module"}));function Hv(e,n){let t;return function(...i){clearTimeout(t),t=setTimeout(()=>e.apply(this,i),n)}}const wd=500;function Gv(){const[e,n]=A.useState(0),[t,r]=A.useState(0),i=A.useRef(()=>r(a=>a+1)),o=A.useMemo(()=>Hv(()=>i.current(),wd),[]),s=()=>{n(a=>a+1),o()};return f.jsxs("div",{children:[f.jsx("button",{type:"button",onClick:s,children:"Click me fast"}),f.jsxs("p",{children:["Raw clicks: ",f.jsx("b",{children:e})]}),f.jsxs("p",{children:["Debounced calls: ",f.jsx("b",{children:t})]}),f.jsxs("p",{style:{color:"#8b95a9",fontSize:13},children:["The debounced counter fires once, ",wd,"ms after you stop clicking."]})]})}const Wv=Object.freeze(Object.defineProperty({__proto__:null,default:Gv},Symbol.toStringTag,{value:"Module"})),xd=680,Sd=420,Kv=["#000000","#e53935","#1976d2","#388e3c","#f57c00","#7b1fa2","#ffffff"];function Vv(){const e=A.useRef(null),n=A.useRef(null),[t,r]=A.useState(!1),[i,o]=A.useState("pen"),[s,a]=A.useState("#000000"),[l,c]=A.useState(4);function u(S){const g=e.current.getBoundingClientRect(),m=S.touches?S.touches[0].clientX:S.clientX,y=S.touches?S.touches[0].clientY:S.clientY;return{x:m-g.left,y:y-g.top}}const d=A.useCallback(S=>{S.preventDefault(),r(!0),n.current=u(S)},[]),p=A.useCallback(S=>{if(S.preventDefault(),!t||!n.current)return;const g=e.current.getContext("2d"),m=u(S);g.beginPath(),g.moveTo(n.current.x,n.current.y),g.lineTo(m.x,m.y),g.strokeStyle=i==="eraser"?"#ffffff":s,g.lineWidth=i==="eraser"?24:l,g.lineCap="round",g.lineJoin="round",g.stroke(),n.current=m},[t,i,s,l]),h=A.useCallback(()=>{r(!1),n.current=null},[]);function v(){e.current.getContext("2d").clearRect(0,0,xd,Sd)}function w(){const S=document.createElement("a");S.download="drawing.png",S.href=e.current.toDataURL(),S.click()}return f.jsxs("div",{style:{padding:20,fontFamily:"sans-serif",userSelect:"none"},children:[f.jsx("h2",{style:{marginBottom:12},children:"Drawing Board"}),f.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:12,flexWrap:"wrap"},children:[["pen","eraser"].map(S=>f.jsx("button",{onClick:()=>o(S),style:{padding:"6px 16px",border:"none",borderRadius:6,cursor:"pointer",background:i===S?"#1976d2":"#eeeeee",color:i===S?"#fff":"#333",fontWeight:i===S?600:400,textTransform:"capitalize"},children:S==="pen"?"✏️ Pen":"🧹 Eraser"},S)),f.jsxs("div",{style:{display:"flex",gap:6,alignItems:"center"},children:[Kv.map(S=>f.jsx("div",{onClick:()=>{a(S),o("pen")},style:{width:24,height:24,borderRadius:"50%",background:S,cursor:"pointer",border:s===S&&i==="pen"?"3px solid #1976d2":"2px solid #ccc",boxSizing:"border-box"}},S)),f.jsx("input",{type:"color",value:s,onChange:S=>{a(S.target.value),o("pen")},style:{width:28,height:28,cursor:"pointer",border:"none",padding:0},title:"Custom color"})]}),f.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6},children:[f.jsxs("span",{style:{fontSize:13,color:"#555"},children:["Size: ",l,"px"]}),f.jsx("input",{type:"range",min:1,max:30,value:l,onChange:S=>c(Number(S.target.value)),style:{width:80}})]}),f.jsx("button",{onClick:v,style:{padding:"6px 14px",background:"#ffebee",color:"#c62828",border:"1px solid #ef9a9a",borderRadius:6,cursor:"pointer"},children:"Clear"}),f.jsx("button",{onClick:w,style:{padding:"6px 14px",background:"#e8f5e9",color:"#2e7d32",border:"1px solid #a5d6a7",borderRadius:6,cursor:"pointer"},children:"Save PNG"})]}),f.jsx("canvas",{ref:e,width:xd,height:Sd,style:{border:"2px solid #ccc",borderRadius:8,cursor:i==="eraser"?"cell":"crosshair",display:"block",background:"#ffffff",touchAction:"none"},onMouseDown:d,onMouseMove:p,onMouseUp:h,onMouseLeave:h,onTouchStart:d,onTouchMove:p,onTouchEnd:h}),f.jsx("p",{style:{marginTop:8,fontSize:12,color:"#aaa"},children:"Draw with mouse or touch. Shift to eraser, or click Eraser button."})]})}const qv=Object.freeze(Object.defineProperty({__proto__:null,default:Vv},Symbol.toStringTag,{value:"Module"})),Yv={id:"root",name:"root",isFolder:!0,items:[{id:"public",name:"public",isFolder:!0,items:[{id:"index.html",name:"index.html",isFolder:!1,items:[]},{id:"robots.txt",name:"robots.txt",isFolder:!1,items:[]}]},{id:"src",name:"src",isFolder:!0,items:[{id:"components",name:"components",isFolder:!0,items:[{id:"Header.js",name:"Header.js",isFolder:!1,items:[]},{id:"Footer.js",name:"Footer.js",isFolder:!1,items:[]}]},{id:"App.js",name:"App.js",isFolder:!1,items:[]},{id:"index.js",name:"index.js",isFolder:!1,items:[]}]},{id:"package.json",name:"package.json",isFolder:!1,items:[]},{id:"README.md",name:"README.md",isFolder:!1,items:[]}]};function Qv(e,n){let t=null;function r(o){if(!o.isFolder)return o;const s=o.items.findIndex(a=>a.id===n);return s!==-1?(t=o.items[s],{...o,items:o.items.filter(a=>a.id!==n)}):{...o,items:o.items.map(a=>r(a))}}return[r(e),t]}function cg(e,n,t){return e.id===n?{...e,items:[...e.items,t]}:e.isFolder?{...e,items:e.items.map(r=>cg(r,n,t))}:e}function Xv(e,n,t){if(n===t||Zv(e,n,t))return null;const[r,i]=Qv(e,n);return i?cg(r,t,i):null}function Zv(e,n,t){function r(o,s){return o.id===s?!0:o.isFolder?o.items.some(a=>r(a,s)):!1}function i(o){return o.id===n?r(o,t):o.isFolder?o.items.some(s=>i(s)):!1}return i(e)}function ug({node:e,onDragStart:n,onDrop:t,draggedId:r}){const[i,o]=A.useState(!0),[s,a]=A.useState(!1),l=e.id===r;function c(w){w.stopPropagation(),n(e.id)}function u(w){e.isFolder&&(w.preventDefault(),w.stopPropagation(),a(!0))}function d(w){w.stopPropagation(),a(!1)}function p(w){e.isFolder&&(w.preventDefault(),w.stopPropagation(),a(!1),t(e.id))}const h=e.isFolder?i?"📂":"📁":"📄",v=["tree-node",e.isFolder?"folder":"file",l?"dragging":"",s?"drag-over":""].filter(Boolean).join(" ");return f.jsxs("div",{children:[f.jsxs("div",{className:v,draggable:!0,onDragStart:c,onDragOver:u,onDragLeave:d,onDrop:p,onClick:()=>e.isFolder&&o(w=>!w),children:[f.jsx("span",{className:"node-icon",children:h}),f.jsx("span",{className:"node-name",children:e.name})]}),e.isFolder&&i&&f.jsxs("div",{className:"children",children:[e.items.map(w=>f.jsx(ug,{node:w,onDragStart:n,onDrop:t,draggedId:r},w.id)),e.items.length===0&&f.jsx("div",{className:"empty-folder",children:"empty folder"})]})]})}function Jv(){const[e,n]=A.useState(Yv),[t,r]=A.useState(null);function i(a){r(a)}function o(a){if(!t)return;const l=Xv(e,t,a);l&&n(l),r(null)}function s(){r(null)}return f.jsxs("div",{className:"app",onDragEnd:s,children:[f.jsx("h2",{children:"File Explorer"}),f.jsx("p",{className:"hint",children:"Drag any file or folder and drop it onto a folder to move it."}),f.jsx("div",{className:"explorer-container",children:f.jsx(ug,{node:e,onDragStart:i,onDrop:o,draggedId:t})})]})}const ew=Object.freeze(Object.defineProperty({__proto__:null,default:Jv},Symbol.toStringTag,{value:"Module"})),nw={id:"1",name:"root",isFolder:!0,items:[{id:"2",name:"public",isFolder:!0,items:[{id:"3",name:"index.html",isFolder:!1,items:[]},{id:"4",name:"robots.txt",isFolder:!1,items:[]}]},{id:"5",name:"src",isFolder:!0,items:[{id:"6",name:"components",isFolder:!0,items:[{id:"7",name:"Header.js",isFolder:!1,items:[]}]},{id:"8",name:"App.js",isFolder:!1,items:[]}]}]};function dg({explorerData:e,handleInsertNode:n}){const[t,r]=A.useState(!1),[i,o]=A.useState(null),s=e.isFolder,a=s?t?"📂":"📁":"📄",l=()=>{r(p=>!p)},c=(p,h)=>{p.stopPropagation(),r(!0),o(h)},u=p=>{p.key==="Enter"&&p.target.value.trim()&&(n(e.id,p.target.value,i==="folder"),o(null))},d=()=>{o(null)};return f.jsxs(f.Fragment,{children:[f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",maxWidth:"350px",cursor:"pointer"},onClick:l,children:[f.jsxs("div",{style:{display:"flex",gap:10},children:[f.jsx("span",{children:a}),f.jsx("span",{children:e.name})]}),s&&f.jsxs("div",{style:{display:"flex",gap:5},children:[f.jsx("button",{onClick:p=>c(p,"folder"),children:"Folder +"}),f.jsx("button",{onClick:p=>c(p,"file"),children:"File +"})]})]}),t&&f.jsxs("div",{children:[i&&f.jsxs("div",{style:{display:"flex",gap:5,paddingLeft:20},children:[f.jsx("span",{children:i==="folder"?"📁":"📄"}),f.jsx("input",{type:"text",autoFocus:!0,onKeyDown:u,onBlur:d})]}),e.items.map(p=>f.jsx("div",{style:{padding:"5px 10px"},children:f.jsx(dg,{explorerData:p,handleInsertNode:n})},p.id))]})]})}function tw(){const[e,n]=A.useState(nw),t=(i,o,s)=>{const a=structuredClone(e);function l(c){if(c.id===i&&c.isFolder)return c.items.unshift({id:Date.now(),name:o,isFolder:s,items:[]}),!0;if(!c.items)return!1;for(const u of c.items)if(l(u))return!0;return!1}return l(a),a},r=(i,o,s)=>{const a=t(i,o,s);n(a)};return f.jsx(dg,{explorerData:e,handleInsertNode:r})}const rw=Object.freeze(Object.defineProperty({__proto__:null,default:tw},Symbol.toStringTag,{value:"Module"}));function iw(){const[e,n]=A.useState([]),[t,r]=A.useState(!1),[i]=A.useState([[1,1,1],[1,0,1],[1,1,1]]),o=i.flat().filter(l=>l===1).length,s=()=>{r(!0);const l=setInterval(()=>{n(c=>{const u=[...c];return u.pop(),u.length==0&&clearInterval(l),u})},300)},a=(l,c)=>{if(t||e.includes(c))return;const u=[...e,c];n(u),u.length===o&&s()};return A.useEffect(()=>{console.log(e)},[e]),f.jsx("div",{className:"wrapper",children:f.jsx("div",{className:"gridWrapper",style:{gridTemplateColumns:`repeat(${i[0].length}, 1fr)`},children:i.flat().map((l,c)=>{const u=e.includes(c);return l===0?f.jsx("div",{},c):f.jsx("div",{className:"gridItem",style:{background:u?"green":"white"},onClick:d=>a(d,c),children:c+1},c)})})})}const ow=Object.freeze(Object.defineProperty({__proto__:null,default:iw},Symbol.toStringTag,{value:"Module"})),st=5,hn=40;function sw(){const[e,n]=A.useState(!1),[t,r]=A.useState(null),[i,o]=A.useState(null),[s,a]=A.useState([]),l=A.useRef(null),c=A.useRef(!1),u=S=>{const g=l.current.getBoundingClientRect(),m=S.clientX-g.left,y=S.clientY-g.top,_=Math.floor(m/hn);return{row:Math.floor(y/hn),col:_}},d=S=>{if(S.button!==0)return;c.current=!1;const g=u(S);r(g),o(g),n(!0),a([])},p=S=>{if(!e)return;c.current=!0;const g=u(S);o(g)},h=()=>{if(!e||(n(!1),!t||!i))return;const S=Math.min(t.row,i.row),g=Math.max(t.row,i.row),m=Math.min(t.col,i.col),y=Math.max(t.col,i.col),_=[];for(let N=S;N<=g;N++)for(let k=m;k<=y;k++)N>=0&&N<st&&k>=0&&k<st&&_.push(`${N},${k}`);a(_)};A.useEffect(()=>{console.log(s)},[s]);const v=S=>{c.current||e||(a([]),r(null),o(null))},w=[];for(let S=0;S<st;S++)for(let g=0;g<st;g++){const m=`${S},${g}`,y=s.includes(m);w.push(f.jsx("div",{style:{width:hn,height:hn,border:"1px solid #000",boxSizing:"border-box",background:y?"purple":"#fff",display:"inline-block"}},m))}return f.jsxs("div",{ref:l,style:{width:st*hn,height:st*hn,userSelect:"none",position:"relative"},onMouseDown:d,onMouseMove:p,onMouseUp:h,onClick:v,children:[f.jsx("div",{style:{width:st*hn,height:st*hn,display:"flex",flexWrap:"wrap"},children:w}),e&&t&&i&&f.jsx("div",{style:{position:"absolute",left:Math.min(t.col,i.col)*hn,top:Math.min(t.row,i.row)*hn,width:(Math.abs(i.col-t.col)+1)*hn,height:(Math.abs(i.row-t.row)+1)*hn,background:"rgba(128,0,128,0.2)",border:"1px dashed purple",pointerEvents:"none",zIndex:1}})]})}const aw=Object.freeze(Object.defineProperty({__proto__:null,default:sw},Symbol.toStringTag,{value:"Module"}));function lw(){return f.jsxs("div",{class:"page",children:[f.jsx("header",{class:"header",children:"Header"}),f.jsxs("div",{class:"body",children:[f.jsx("nav",{class:"left",children:"Left Sidebar"}),f.jsx("main",{class:"content",children:"Main Content"}),f.jsx("aside",{class:"right",children:"Right Sidebar"})]}),f.jsx("footer",{class:"footer",children:"Footer"})]})}const cw=Object.freeze(Object.defineProperty({__proto__:null,default:lw},Symbol.toStringTag,{value:"Module"})),uw=e=>new Promise((n,t)=>{setTimeout(()=>{const r=new Array(20);for(let i=0;i<20;i++)r[i]={id:Math.random()+Date.now(),title:`This is post #${e*20+i+1} - this is the content`};n(r)},1e3)}),dw=()=>{const[e,n]=A.useState([]),[t,r]=A.useState(!0),[i,o]=A.useState(0),[s,a]=A.useState(!1),l=A.useRef(null);return A.useEffect(()=>{(async()=>{a(!0);const u=await uw(i);n(d=>[...d,...u]),a(!1),u.length===0&&r(!1)})()},[i]),A.useEffect(()=>{const c=new IntersectionObserver(u=>{u[0].isIntersecting&&!s&&t&&o(d=>d+1)},{threshold:1});return l.current&&c.observe(l.current),()=>{l.current&&c.unobserve(l.current)}},[s,t]),f.jsxs("div",{style:{maxWidth:"400px",margin:"0 auto",padding:"20px"},children:[f.jsx("ul",{children:e.map(c=>f.jsx("li",{style:{padding:"20px",border:"1px solid #ccc",marginBottom:"10px",background:"#f7f7f7"},children:c.title},c.id))}),t&&f.jsx("div",{ref:l,style:{height:"50px",textAlign:"center",padding:"10px",fontWeight:"bold"},children:s?"Loading":"Scroll Down to load"})]})},pw=Object.freeze(Object.defineProperty({__proto__:null,default:dw},Symbol.toStringTag,{value:"Module"})),fw={todo:[{id:1,text:"Design UI"},{id:2,text:"Write API"}],inProgress:[{id:3,text:"Build Kanban"}],done:[{id:4,text:"Setup Repo"}]},hw=[{key:"todo",title:"Todo"},{key:"inProgress",title:"In Progress"},{key:"done",title:"Done"}];function gw(){const[e,n]=A.useState(fw),[t,r]=A.useState(null),i=(c,u)=>{r({colKey:c,index:u})},o=(c,u)=>{if(!t)return;const{colKey:d,index:p}=t;d===c&&p===u||(n(h=>{const v={...h},w=[...v[d]],[S]=w.splice(p,1),g=[...v[c]];return g.splice(u,0,S),v[d]=w,v[c]=g,v}),r(null))},s=c=>c.preventDefault(),a=c=>{const u=prompt("Card title?");u&&n(d=>({...d,[c]:[...d[c],{id:Date.now(),text:u}]}))},l=(c,u)=>{n(d=>({...d,[c]:d[c].filter((p,h)=>h!==u)}))};return f.jsx("div",{className:"kanban",children:hw.map(c=>f.jsxs("div",{className:"column",onDragOver:s,children:[f.jsx("h3",{children:c.title}),e[c.key].map((u,d)=>f.jsxs("div",{className:"card",draggable:!0,onDragStart:()=>i(c.key,d),onDrop:()=>o(c.key,d),children:[u.text,f.jsx("button",{className:"delete",onClick:()=>l(c.key,d),children:"✕"})]},u.id)),f.jsx("button",{className:"add",onClick:()=>a(c.key),children:"+ Add"})]},c.key))})}const mw=Object.freeze(Object.defineProperty({__proto__:null,default:gw},Symbol.toStringTag,{value:"Module"}));function yw({isOpen:e,title:n,children:t,onClose:r,onPrimary:i,primaryText:o="Save",secondaryText:s="Cancel",showClose:a=!0}){const l=A.useRef(null);return A.useEffect(()=>{if(!e)return;const c=d=>{d.key==="Escape"&&r()},u=d=>{l.current&&!l.current.contains(d.target)&&r()};return document.addEventListener("keydown",c),document.addEventListener("mousedown",u),document.body.style.overflow="hidden",()=>{document.removeEventListener("keydown",c),document.removeEventListener("mousedown",u),document.body.style.overflow="auto"}},[e,r]),e?xv.createPortal(f.jsx("div",{className:"overlay",children:f.jsxs("div",{className:"modal",ref:l,children:[a&&f.jsx("button",{className:"close",onClick:r,children:"×"}),f.jsx("h3",{children:n}),f.jsx("div",{className:"content",children:t}),f.jsxs("div",{className:"actions",children:[f.jsx("button",{onClick:r,children:s}),f.jsx("button",{onClick:i,children:o})]})]})}),document.body):null}function bw(){const[e,n]=A.useState(null),t=a=>{n(l=>!l||a.priority>l.priority?a:l)},r=()=>n(null),i=()=>{t({title:"Settings",priority:1,content:f.jsxs("div",{children:[f.jsx("p",{children:"Configure your preferences:"}),f.jsxs("label",{children:[f.jsx("input",{type:"checkbox"})," Enable notifications"]}),f.jsx("br",{}),f.jsx("button",{style:{marginTop:10,color:"red"},onClick:o,children:"Delete Account"})]}),primaryText:"Save",onPrimary:()=>{alert("Settings saved!"),r()}})},o=()=>{t({title:"⚠️ Confirm Delete",priority:10,content:"Are you sure you want to delete your account? This cannot be undone.",primaryText:"Delete",onPrimary:()=>{alert("Account deleted!"),r()}})},s=()=>{setTimeout(()=>{t({title:"🚨 Connection Lost",priority:100,content:"Unable to connect to server. Please check your internet connection.",primaryText:"Retry",onPrimary:()=>{alert("Retrying..."),r()}})},2e3),alert("Error will appear in 2 seconds (even if another modal is open)")};return f.jsxs("div",{style:{padding:20},children:[f.jsx("h2",{children:"Modal Priority Demo"}),f.jsxs("div",{style:{display:"flex",gap:10},children:[f.jsx("button",{onClick:i,children:"Open Settings (Priority: 1)"}),f.jsx("button",{onClick:s,children:"Simulate Error in 2s (Priority: 100)"})]}),f.jsx("p",{style:{marginTop:10,color:"#666"},children:'Try: Open Settings → Click "Delete Account" → High priority modal replaces it'}),f.jsx(yw,{isOpen:!!e,title:e==null?void 0:e.title,onClose:r,onPrimary:(e==null?void 0:e.onPrimary)||r,primaryText:e==null?void 0:e.primaryText,children:e==null?void 0:e.content})]})}const vw=Object.freeze(Object.defineProperty({__proto__:null,default:bw},Symbol.toStringTag,{value:"Module"}));function pg({comment:e,onReply:n,onEdit:t,onDelete:r}){var p;const[i,o]=A.useState(!1),[s,a]=A.useState(!1),[l,c]=A.useState(e.text),[u,d]=A.useState("");return f.jsxs("div",{style:{marginLeft:"20px",marginTop:12},children:[s?f.jsxs(f.Fragment,{children:[f.jsx("input",{type:"text",value:l,onChange:h=>c(h.target.value)}),f.jsx("button",{onClick:()=>{t(e,l),a(!1)},children:"Submit"})]}):f.jsxs("span",{children:[f.jsx("span",{children:e.text}),f.jsx("br",{}),"author: ",f.jsx("b",{children:e.author})]}),f.jsxs("div",{children:[f.jsx("button",{onClick:()=>{o(h=>!h)},children:"Reply"}),f.jsx("button",{onClick:()=>{a(h=>!h)},children:"Edit"}),f.jsx("button",{onClick:()=>{r(e)},children:"Delete"})]}),i&&f.jsxs("div",{style:{marginTop:0},children:[f.jsx("input",{type:"text",value:u,onChange:h=>d(h.target.value),placeholder:"write a reply..."}),f.jsx("button",{onClick:()=>{n(e,u),d(""),o(!1)},children:"Save"})]}),(p=e==null?void 0:e.children)==null?void 0:p.map(h=>f.jsx(pg,{comment:h,onReply:n,onDelete:r,onEdit:t},h.id))]})}function fg(e,n,t){return e.map(r=>r.id==n.id?{...r,children:[...r.children,t]}:{...r,children:fg(r.children,n,t)})}function hg(e,n,t){return e.map(r=>r.id==n.id?{...r,text:t}:{...r,children:hg(r.children,n,t)})}function gg(e,n){return e.filter(t=>t.id!==n).map(t=>({...t,children:gg(t.children,n)}))}const ww=[{id:1,author:"Alice",text:"This is the first comment",children:[{id:2,author:"Bob",text:"This is a reply",children:[]}]}];function xw(){const[e,n]=A.useState(ww),t=A.useCallback((o,s)=>{if(!s.trim())return;const a={id:Date.now()+Math.random()*10,author:"You",text:s,children:[]};n(l=>fg(l,o,a))},[]),r=A.useCallback((o,s)=>{n(a=>hg(a,o,s))},[]),i=A.useCallback(o=>{n(s=>gg(s,o.id))},[]);return f.jsx("div",{style:{padding:16,maxWidth:"100%"},children:e.map(o=>f.jsx(pg,{onEdit:r,onDelete:i,onReply:t,comment:o},o.id))})}function Sw(){return f.jsx(xw,{})}const kw=Object.freeze(Object.defineProperty({__proto__:null,default:Sw},Symbol.toStringTag,{value:"Module"}));function Ew(){const[e,n]=A.useState([]),t=A.useRef({}),r=(o,s="info",a=3e3)=>{const l=Date.now(),c={id:l,message:o,type:s};n(u=>[...u,c]),t.current[l]=setTimeout(()=>{i(l)},a)},i=o=>{clearTimeout(t.current[o]),delete t.current[o],n(s=>s.filter(a=>a.id!==o))};return f.jsxs("div",{className:"container",children:[f.jsx("h2",{children:"🔔 Notification System"}),f.jsxs("div",{className:"buttons",children:[f.jsx("button",{onClick:()=>r("Success!","success"),children:"Success"}),f.jsx("button",{onClick:()=>r("Error occurred","error"),children:"Error"}),f.jsx("button",{onClick:()=>r("Info message","info"),children:"Info"})]}),f.jsx("div",{className:"toast-container",children:e.map(o=>f.jsxs("div",{className:`toast ${o.type}Bg`,children:[f.jsx("span",{children:o.message}),f.jsx("button",{onClick:()=>i(o.id),children:"✕"})]},o.id))})]})}const _w=Object.freeze(Object.defineProperty({__proto__:null,default:Ew},Symbol.toStringTag,{value:"Module"})),rr=6;function Cw(){const[e,n]=A.useState(Array(rr).fill("")),[t,r]=A.useState(!1),i=A.useRef([]);function o(p,h){if(!/^\d*$/.test(h))return;const v=[...e];v[p]=h.slice(-1),n(v),h&&p<rr-1&&i.current[p+1].focus()}function s(p,h){h.key==="Backspace"&&!e[p]&&p>0&&i.current[p-1].focus()}function a(p){p.preventDefault();const h=p.clipboardData.getData("text").replace(/\D/g,"").slice(0,rr),v=[...e];for(let S=0;S<h.length;S++)v[S]=h[S];n(v);const w=Math.min(h.length,rr-1);i.current[w].focus()}function l(){r(!0),setTimeout(()=>r(!1),2e3)}function c(){n(Array(rr).fill("")),r(!1),i.current[0].focus()}const d=e.join("").length===rr;return f.jsxs("div",{style:{padding:40,fontFamily:"sans-serif",textAlign:"center",maxWidth:480,margin:"0 auto"},children:[f.jsx("h2",{style:{marginBottom:4},children:"OTP Verification"}),f.jsxs("p",{style:{color:"#666",marginBottom:32},children:["Enter the 6-digit code sent to ",f.jsx("strong",{children:"+91 98765 43210"})]}),f.jsx("div",{style:{display:"flex",gap:12,justifyContent:"center",marginBottom:28},children:e.map((p,h)=>f.jsx("input",{ref:v=>i.current[h]=v,type:"text",inputMode:"numeric",maxLength:1,value:p,onChange:v=>o(h,v.target.value),onKeyDown:v=>s(h,v),onPaste:a,style:{width:52,height:60,fontSize:26,textAlign:"center",border:`2px solid ${p?"#1976d2":"#ccc"}`,borderRadius:10,outline:"none",transition:"border-color 0.15s",color:"#1a1a1a"}},h))}),t?f.jsx("p",{style:{color:"#2e7d32",fontWeight:600,fontSize:18,marginBottom:16},children:"Verified successfully!"}):f.jsx("button",{onClick:l,disabled:!d,style:{padding:"12px 40px",fontSize:16,background:d?"#1976d2":"#e0e0e0",color:d?"#fff":"#9e9e9e",border:"none",borderRadius:8,cursor:d?"pointer":"not-allowed",marginBottom:12,display:"block",width:"100%"},children:"Verify OTP"}),f.jsx("button",{onClick:c,style:{background:"none",border:"none",color:"#1976d2",cursor:"pointer",fontSize:14,textDecoration:"underline"},children:"Clear"}),f.jsxs("p",{style:{marginTop:24,color:"#999",fontSize:13},children:["Didn't receive it?"," ",f.jsx("span",{style:{color:"#1976d2",cursor:"pointer"},onClick:()=>alert("OTP resent!"),children:"Resend OTP"})]})]})}const Tw=Object.freeze(Object.defineProperty({__proto__:null,default:Cw},Symbol.toStringTag,{value:"Module"}));function Rw(){const[e,n]=A.useState([{id:1,vote:0,label:"Blogs",color:"green"},{id:2,vote:0,label:"Forums",color:"red"},{id:3,vote:0,label:"Photos",color:"blue"},{id:4,vote:0,label:"Docs",color:"orange"}]),t=460,r=e.reduce((o,s)=>o+s.vote,0),i=o=>{n(s=>s.map(a=>a.id===o.id?{...a,vote:a.vote+1}:a))};return f.jsx("div",{children:f.jsx("div",{style:{display:"flex",gap:10,display:"flex"},children:e.map(o=>{const s=r===0?0:Math.round(o.vote/r*100);return f.jsxs("div",{style:{flexDirection:"column",gap:10,display:"flex"},children:[f.jsx("div",{style:{display:"flex",background:"#d7d7d7",height:t,width:50,alignItems:"flex-end"},children:f.jsx("div",{style:{background:o.color,height:`${s}%`,width:"100%"}})}),f.jsxs("div",{style:{display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center",gap:10},children:[f.jsx("label",{children:`${s}%`}),f.jsx("button",{onClick:()=>i(o),children:"Vote"}),f.jsx("label",{children:o.label})]})]})})})})}const Nw=Object.freeze(Object.defineProperty({__proto__:null,default:Rw},Symbol.toStringTag,{value:"Module"}));function Iw({isActive:e,isPaused:n,onComplete:t}){const[r,i]=A.useState(0);return A.useEffect(()=>{if(!e||n||r>=100)return;const o=setTimeout(()=>{i(s=>{if(s>=100){clearTimeout(o);return}return s+1})},20);return()=>clearTimeout(o)},[e,n,r]),A.useEffect(()=>{r>=100&&t()},[r,t]),f.jsx("div",{style:{height:20,background:"#e0e0e0",margin:"10px 0",borderRadius:5,overflow:"hidden"},children:f.jsx("div",{style:{height:"20px",width:`${r}%`,background:r>=100?"green":"#2196f3",transition:"width 20ms linear"}})})}function Aw(){const[n,t]=A.useState([Date.now()]),[r,i]=A.useState(!0),[o,s]=A.useState(0),a=()=>{i(d=>!d)},l=()=>{t(d=>[...d,Date.now()+Math.random()])},c=()=>{t([Date.now()]),s(0),i(!0)},u=d=>{d===o&&s(p=>p+1)};return f.jsxs("div",{style:{maxWidth:400,margin:"20px auto"},children:[f.jsxs("div",{style:{display:"flex",gap:10,marginBottom:20},children:[f.jsx("button",{onClick:a,children:r?"Start":"Pause"}),f.jsx("button",{onClick:l,children:"Add"}),f.jsx("button",{onClick:c,children:"Reset"})]}),f.jsx(f.Fragment,{children:n.map((d,p)=>{const h=p>=o&&p<o+3;return f.jsx(Iw,{isActive:h,isPaused:r,onComplete:()=>u(p)},d)})})]})}const Ow=Object.freeze(Object.defineProperty({__proto__:null,default:Aw},Symbol.toStringTag,{value:"Module"}));function Mw(){return new Promise((e,n)=>{const t=Math.random()*3e3+500;setTimeout(()=>{Math.random()>.7?n(`${name} Failed`):e(`${name} Success`)},t)})}function Dw(){const[e,n]=A.useState(0),[t,r]=A.useState([]),[i,o]=A.useState(!1),s=5,a=["Auth","Payment","User Profile","Notifications","Analytics"],l=async()=>{o(!0),n(0),r([]);const c=a.map(u=>Mw().then(d=>{r(p=>[...p,{status:"success",value:d}])}).catch(d=>{r(p=>[...p,{status:"failed",value:d}])}).finally(()=>{n(d=>{const p=100/s;return Math.min(d+p,100)})}));await Promise.allSettled(c),o(!1)};return f.jsxs(f.Fragment,{children:[f.jsx("div",{className:"progress-track",children:f.jsx("div",{className:"progress-fill",style:{width:`${e}%`,background:e===100?"green":"blue"}})}),f.jsx("button",{onClick:l,disabled:i,children:i?"processing":"Start Services"})]})}const Lw=Object.freeze(Object.defineProperty({__proto__:null,default:Dw},Symbol.toStringTag,{value:"Module"})),Pw="React is a JavaScript library for building user interfaces. It was created by Facebook and is now maintained by Meta. React uses a virtual DOM to efficiently update the real DOM. When state changes, React compares the new virtual DOM with the previous one and only updates the parts that actually changed. This process is called reconciliation. React components can be written as functions or classes, though functional components with hooks are now the preferred approach. Popular features include useState for state management, useEffect for side effects, and useContext for sharing data across components.";function Bw({text:e,query:n}){if(!n)return e;const t=e.split(new RegExp(`(${n})`,"gi"));return console.log(t),t.map((r,i)=>r.toLowerCase()===n.toLowerCase()?f.jsx("mark",{style:{background:"#fef08a"},children:r},i):r)}function jw(){const[e,n]=A.useState("");return f.jsxs("div",{style:{padding:20,fontFamily:"sans-serif"},children:[f.jsx("h2",{children:"Search Highlighter"}),f.jsx("input",{type:"text",placeholder:"Search...",value:e,onChange:t=>n(t.target.value),style:{padding:8,fontSize:16,width:300}}),f.jsx("p",{style:{lineHeight:1.8,marginTop:20},children:f.jsx(Bw,{text:Pw,query:e})})]})}const Fw=Object.freeze(Object.defineProperty({__proto__:null,default:jw},Symbol.toStringTag,{value:"Module"})),zw=["A","B","C","D","E","F","G"],kd=[1,2,3,4,5,6,7,8],fo=250,mg=new Set(["A3","A7","B2","B5","C4","C8","D1","D6","E3","E5","F2","F7","G4","G6"]);function Uw(e,n){return mg.has(e)?"booked":n.has(e)?"selected":"available"}const $w={available:{background:"#e8f5e9",borderColor:"#a5d6a7",color:"#333",cursor:"pointer"},selected:{background:"#1976d2",borderColor:"#1565c0",color:"#fff",cursor:"pointer"},booked:{background:"#e0e0e0",borderColor:"#bdbdbd",color:"#9e9e9e",cursor:"not-allowed"}};function Hw(){const[e,n]=A.useState(new Set);function t(s){mg.has(s)||n(a=>{const l=new Set(a);return l.has(s)?l.delete(s):l.add(s),l})}function r(){n(new Set)}const i=[...e].sort(),o=e.size*fo;return f.jsxs("div",{style:{padding:24,fontFamily:"sans-serif",maxWidth:560},children:[f.jsx("h2",{style:{marginBottom:4},children:"Select Your Seats"}),f.jsxs("p",{style:{color:"#666",marginBottom:20,fontSize:14},children:["Bengaluru → Mumbai · Express Bus · ₹",fo,"/seat"]}),f.jsx("div",{style:{display:"flex",gap:20,marginBottom:20},children:[["Available","#e8f5e9","#a5d6a7"],["Selected","#1976d2","#1565c0"],["Booked","#e0e0e0","#bdbdbd"]].map(([s,a,l])=>f.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6},children:[f.jsx("div",{style:{width:18,height:18,background:a,border:`2px solid ${l}`,borderRadius:4}}),f.jsx("span",{style:{fontSize:13},children:s})]},s))}),f.jsx("div",{style:{display:"flex",gap:6,marginBottom:6,marginLeft:28},children:kd.map(s=>f.jsx("div",{style:{width:44,textAlign:"center",fontSize:12,color:"#999",fontWeight:600},children:s},s))}),zw.map(s=>f.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:6},children:[f.jsx("div",{style:{width:22,fontWeight:700,fontSize:14,color:"#555"},children:s}),kd.map(a=>{const l=`${s}${a}`,c=Uw(l,e);return f.jsx("button",{onClick:()=>t(l),disabled:c==="booked",title:c==="booked"?`${l} — Booked`:`${l} — ₹${fo}`,style:{width:44,height:40,border:"2px solid",borderRadius:6,fontSize:11,fontWeight:600,transition:"background 0.1s, transform 0.1s",...$w[c]},children:l},l)})]},s)),f.jsx("div",{style:{marginTop:24,padding:16,background:"#f8f9fa",borderRadius:10,border:"1px solid #e0e0e0"},children:e.size===0?f.jsx("p",{style:{color:"#999",margin:0},children:"No seats selected. Click a seat to select it."}):f.jsxs(f.Fragment,{children:[f.jsxs("p",{style:{margin:"0 0 8px"},children:[f.jsx("strong",{children:"Seats:"})," ",i.join(", ")]}),f.jsxs("p",{style:{margin:"0 0 16px"},children:[f.jsx("strong",{children:"Total:"})," ₹",o," (",e.size," seat",e.size!==1?"s":""," × ₹",fo,")"]}),f.jsxs("div",{style:{display:"flex",gap:10},children:[f.jsx("button",{onClick:()=>alert(`Booked: ${i.join(", ")}
Total: ₹${o}`),style:{padding:"10px 28px",background:"#1976d2",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:15},children:"Book Now"}),f.jsx("button",{onClick:r,style:{padding:"10px 18px",background:"#fff",color:"#666",border:"1px solid #ddd",borderRadius:6,cursor:"pointer"},children:"Clear"})]})]})})]})}const Gw=Object.freeze(Object.defineProperty({__proto__:null,default:Hw},Symbol.toStringTag,{value:"Module"})),wr=10,Il=100,gi={2:38,7:14,8:31,28:84},mi={16:6,49:11,62:19,87:24};function Ww(e){const n=Math.floor((e-1)/wr),t=wr-1-n;let r=(e-1)%wr;return n%2===1&&(r=wr-1-r),{row:t,col:r}}function Kw(){const e=Array.from({length:wr},()=>Array(wr).fill(null));for(let n=1;n<=Il;n++){const{row:t,col:r}=Ww(n);e[t][r]=n}return e}function Vw(){const e=[[1]],n=new Set([1]);for(;e.length;){const t=e.shift(),r=t[t.length-1];if(r===Il)return t;for(let i=1;i<=6;i++){let o=r+i;o>Il||(gi[o]&&(o=gi[o]),mi[o]&&(o=mi[o]),n.has(o)||(n.add(o),e.push([...t,o])))}}return[]}function qw(){const e=Kw(),[n,t]=A.useState([]),r=new Set(n);return f.jsxs("div",{style:{padding:20,fontFamily:"system-ui"},children:[f.jsx("h2",{children:"🎲 Snake & Ladder – Shortest Path"}),f.jsx("button",{onClick:()=>t(Vw()),style:{padding:"8px 14px",background:"#2563eb",color:"white",border:"none",borderRadius:6,cursor:"pointer"},children:"Show Shortest Path"}),n.length>0&&f.jsxs("div",{style:{margin:"10px 0",fontWeight:"bold"},children:["Minimum dice throws: ",n.length-1]}),f.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(10, 60px)",gap:8,width:"fit-content",marginTop:10},children:e.map((i,o)=>i.map((s,a)=>{const l=(o+a)%2===1;let c=l?"#779556":"#ebecd0";return s===1?c="#22c55e":s===100?c="#ef4444":r.has(s)?c="#facc15":(gi[s]||mi[s])&&(c=l?"#557536":"#dbdcc0"),f.jsxs("div",{style:{width:60,height:60,background:c,border:"1px solid rgba(0,0,0,0.1)",fontSize:11,textAlign:"center",display:"flex",flexDirection:"column",justifyContent:"center",color:s===1||s===100?"white":"inherit",fontWeight:"bold"},children:[f.jsx("strong",{children:s}),gi[s]&&f.jsxs("span",{style:{color:"green",fontSize:10},children:["🪜 → ",gi[s]]}),mi[s]&&f.jsxs("span",{style:{color:"red",fontSize:10},children:["🐍 → ",mi[s]]})]},s)}))}),f.jsxs("div",{style:{marginTop:12,fontSize:14},children:[f.jsx("div",{children:"🟨 Shortest path (BFS)"}),f.jsx("div",{children:"🪜 Ladder"}),f.jsx("div",{children:"🐍 Snake"})]})]})}const Yw=Object.freeze(Object.defineProperty({__proto__:null,default:qw},Symbol.toStringTag,{value:"Module"}));function Ed({totalStars:e=5,onChange:n}){const[t,r]=A.useState(0),[i,o]=A.useState(0);return f.jsx("div",{className:"star-container",children:[...Array(e)].map((s,a)=>{const l=a+1;return f.jsx("button",{className:`star ${l<=(i||t)?"on":"off"}`,onClick:()=>{r(l),n&&n(l)},onMouseEnter:()=>o(l),onMouseLeave:()=>o(0),onDoubleClick:()=>{r(0),o(0),n&&n(0)},children:f.jsx("span",{className:"star-icon",children:"★"})},l)})})}function Qw(){const[e,n]=A.useState(0),t=r=>{console.log("User selected:",r),n(r)};return f.jsxs("div",{style:{padding:"50px",fontFamily:"sans-serif"},children:[f.jsx("h1",{children:"Rate this Product"}),f.jsx(Ed,{onChange:t}),f.jsxs("p",{children:["Current Rating: ",f.jsx("strong",{children:e})," / 5"]}),f.jsx("hr",{}),f.jsx("h3",{children:"Rate your Uber Driver (10 scale)"}),f.jsx(Ed,{totalStars:10})]})}const Xw=Object.freeze(Object.defineProperty({__proto__:null,default:Qw},Symbol.toStringTag,{value:"Module"})),Zw=[1,2,3,4,5];function Jw(){const[e,n]=A.useState(0),[t,r]=A.useState(0),i=t||e;return f.jsxs("div",{className:"sr-rating",onMouseLeave:()=>r(0),children:[Zw.map(o=>f.jsx("span",{className:o<=i?"sr-star sr-filled":"sr-star",role:"button",tabIndex:0,"aria-label":`Rate ${o} out of 5`,onMouseEnter:()=>r(o),onClick:()=>n(o),onKeyDown:s=>{(s.key==="Enter"||s.key===" ")&&n(o)},children:"★"},o)),f.jsx("p",{className:"sr-label",children:e?`${e} / 5`:"No rating yet"})]})}const ex=Object.freeze(Object.defineProperty({__proto__:null,default:Jw},Symbol.toStringTag,{value:"Module"})),ho=["Personal Info","Address","Payment","Review & Submit"];function nx({data:e,onChange:n}){return f.jsxs("div",{style:Yn.fields,children:[f.jsx(Jn,{label:"Full Name",value:e.name,onChange:t=>n("name",t),placeholder:"Arjun Kumar"}),f.jsx(Jn,{label:"Email",value:e.email,onChange:t=>n("email",t),placeholder:"arjun@example.com",type:"email"}),f.jsx(Jn,{label:"Phone",value:e.phone,onChange:t=>n("phone",t),placeholder:"+91 98765 43210"})]})}function tx({data:e,onChange:n}){return f.jsxs("div",{style:Yn.fields,children:[f.jsx(Jn,{label:"Street",value:e.street,onChange:t=>n("street",t),placeholder:"123 MG Road"}),f.jsx(Jn,{label:"City",value:e.city,onChange:t=>n("city",t),placeholder:"Bengaluru"}),f.jsx(Jn,{label:"Pincode",value:e.pincode,onChange:t=>n("pincode",t),placeholder:"560001"})]})}function rx({data:e,onChange:n}){return f.jsxs("div",{style:Yn.fields,children:[f.jsx(Jn,{label:"Card Number",value:e.card,onChange:t=>n("card",t),placeholder:"4242 4242 4242 4242"}),f.jsxs("div",{style:{display:"flex",gap:12},children:[f.jsx("div",{style:{flex:1},children:f.jsx(Jn,{label:"Expiry",value:e.expiry,onChange:t=>n("expiry",t),placeholder:"MM/YY"})}),f.jsx("div",{style:{flex:1},children:f.jsx(Jn,{label:"CVV",value:e.cvv,onChange:t=>n("cvv",t),placeholder:"123"})})]})]})}function ix({data:e}){const n=[["Name",e.name],["Email",e.email],["Phone",e.phone],["Street",e.street],["City",e.city],["Pincode",e.pincode],["Card",e.card?`**** **** **** ${e.card.slice(-4)}`:"—"]];return f.jsxs("div",{children:[f.jsx("p",{style:{color:"#666",marginBottom:16},children:"Please review your details before submitting."}),f.jsx("table",{style:{width:"100%",borderCollapse:"collapse"},children:f.jsx("tbody",{children:n.map(([t,r])=>f.jsxs("tr",{children:[f.jsx("td",{style:{padding:"8px 12px",color:"#666",fontWeight:500,width:"40%"},children:t}),f.jsx("td",{style:{padding:"8px 12px",color:"#1a1a1a"},children:r||f.jsx("span",{style:{color:"#bbb"},children:"—"})})]},t))})})]})}function Jn({label:e,value:n,onChange:t,placeholder:r,type:i="text"}){return f.jsxs("div",{style:{marginBottom:16},children:[f.jsx("label",{style:{display:"block",fontWeight:500,marginBottom:6,color:"#444"},children:e}),f.jsx("input",{type:i,value:n,onChange:o=>t(o.target.value),placeholder:r,style:{width:"100%",padding:"10px 12px",fontSize:15,border:"1.5px solid #ccc",borderRadius:6,outline:"none",boxSizing:"border-box"}})]})}function ox(e,n){return e===0?n.name.trim()&&n.email.trim()&&n.phone.trim():e===1?n.street.trim()&&n.city.trim()&&n.pincode.trim():e===2?n.card.trim()&&n.expiry.trim()&&n.cvv.trim():!0}const _d={name:"",email:"",phone:"",street:"",city:"",pincode:"",card:"",expiry:"",cvv:""};function sx(){const[e,n]=A.useState(0),[t,r]=A.useState(_d),[i,o]=A.useState(!1);function s(c,u){r(d=>({...d,[c]:u}))}function a(){o(!0)}if(i)return f.jsxs("div",{style:{padding:40,textAlign:"center",fontFamily:"sans-serif"},children:[f.jsx("div",{style:{fontSize:56,marginBottom:16},children:"✓"}),f.jsx("h2",{style:{color:"#2e7d32"},children:"Order Placed!"}),f.jsxs("p",{style:{color:"#666"},children:["Confirmation sent to ",t.email]}),f.jsx("button",{onClick:()=>{o(!1),n(0),r(_d)},style:Yn.btnSecondary,children:"Start Over"})]});const l=ox(e,t);return f.jsxs("div",{style:{padding:24,fontFamily:"sans-serif",maxWidth:540,margin:"0 auto"},children:[f.jsx("div",{style:{display:"flex",alignItems:"center",marginBottom:32},children:ho.map((c,u)=>f.jsxs("div",{style:{display:"flex",alignItems:"center",flex:u<ho.length-1?1:"none"},children:[f.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center"},children:[f.jsx("div",{style:{width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:600,background:u<e?"#2e7d32":u===e?"#1976d2":"#e0e0e0",color:u<=e?"#fff":"#999",transition:"background 0.2s"},children:u<e?"✓":u+1}),f.jsx("span",{style:{fontSize:11,marginTop:4,color:u===e?"#1976d2":"#999",whiteSpace:"nowrap"},children:c})]}),u<ho.length-1&&f.jsx("div",{style:{flex:1,height:2,background:u<e?"#2e7d32":"#e0e0e0",margin:"0 4px",marginBottom:18}})]},u))}),f.jsxs("div",{style:{minHeight:200},children:[e===0&&f.jsx(nx,{data:t,onChange:s}),e===1&&f.jsx(tx,{data:t,onChange:s}),e===2&&f.jsx(rx,{data:t,onChange:s}),e===3&&f.jsx(ix,{data:t})]}),f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginTop:24},children:[f.jsx("button",{onClick:()=>n(c=>c-1),disabled:e===0,style:e===0?{...Yn.btnSecondary,opacity:.4,cursor:"not-allowed"}:Yn.btnSecondary,children:"Back"}),e<ho.length-1?f.jsx("button",{onClick:()=>n(c=>c+1),disabled:!l,style:l?Yn.btnPrimary:{...Yn.btnPrimary,opacity:.5,cursor:"not-allowed"},children:"Next"}):f.jsx("button",{onClick:a,style:Yn.btnSuccess,children:"Place Order"})]})]})}const Yn={fields:{display:"flex",flexDirection:"column"},btnPrimary:{padding:"10px 28px",background:"#1976d2",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:15},btnSecondary:{padding:"10px 28px",background:"#f5f5f5",color:"#444",border:"1px solid #ddd",borderRadius:6,cursor:"pointer",fontSize:15},btnSuccess:{padding:"10px 28px",background:"#2e7d32",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:15}},ax=Object.freeze(Object.defineProperty({__proto__:null,default:sx},Symbol.toStringTag,{value:"Module"})),ya=[{id:"profile",label:"Profile",Content:()=>f.jsxs("div",{children:[f.jsx("h3",{style:{marginTop:0},children:"Your Profile"}),f.jsxs("p",{children:[f.jsx("strong",{children:"Name:"})," Arjun Kumar"]}),f.jsxs("p",{children:[f.jsx("strong",{children:"Email:"})," arjun@example.com"]}),f.jsxs("p",{children:[f.jsx("strong",{children:"Role:"})," Frontend Engineer"]})]})},{id:"orders",label:"Orders",Content:()=>f.jsxs("div",{children:[f.jsx("h3",{style:{marginTop:0},children:"Recent Orders"}),["#ORD-001 — Laptop Stand","#ORD-002 — Keyboard","#ORD-003 — Monitor"].map(e=>f.jsx("p",{style:{padding:"8px 0",borderBottom:"1px solid #eee"},children:e},e))]})},{id:"settings",label:"Settings",Content:()=>f.jsxs("div",{children:[f.jsx("h3",{style:{marginTop:0},children:"Settings"}),f.jsxs("label",{style:{display:"flex",alignItems:"center",gap:8},children:[f.jsx("input",{type:"checkbox",defaultChecked:!0})," Email notifications"]}),f.jsxs("label",{style:{display:"flex",alignItems:"center",gap:8,marginTop:8},children:[f.jsx("input",{type:"checkbox"})," SMS alerts"]})]})},{id:"billing",label:"Billing",Content:()=>f.jsxs("div",{children:[f.jsx("h3",{style:{marginTop:0},children:"Billing"}),f.jsxs("p",{children:["Plan: ",f.jsx("strong",{children:"Pro — ₹999/month"})]}),f.jsxs("p",{children:["Next renewal: ",f.jsx("strong",{children:"July 18, 2026"})]})]})}];function lx(){const[e,n]=A.useState("profile"),[t,r]=A.useState(()=>new Set(["profile"])),i=A.useRef({});function o(a){var l;n(a),r(c=>new Set([...c,a])),(l=i.current[a])==null||l.focus()}function s(a){const l=ya.map(u=>u.id),c=l.indexOf(e);a.key==="ArrowRight"?(a.preventDefault(),o(l[(c+1)%l.length])):a.key==="ArrowLeft"?(a.preventDefault(),o(l[(c-1+l.length)%l.length])):a.key==="Home"?(a.preventDefault(),o(l[0])):a.key==="End"&&(a.preventDefault(),o(l[l.length-1]))}return f.jsxs("div",{style:{padding:24,fontFamily:"sans-serif",maxWidth:600},children:[f.jsx("h2",{style:{marginBottom:20},children:"Account"}),f.jsx("div",{role:"tablist",style:{display:"flex",borderBottom:"2px solid #e0e0e0"},children:ya.map(a=>{const l=a.id===e;return f.jsx("button",{role:"tab","aria-selected":l,"aria-controls":`panel-${a.id}`,id:`tab-${a.id}`,ref:c=>i.current[a.id]=c,onClick:()=>o(a.id),onKeyDown:s,tabIndex:l?0:-1,style:{padding:"10px 20px",border:"none",background:"none",cursor:"pointer",borderBottom:l?"2px solid #1976d2":"2px solid transparent",color:l?"#1976d2":"#666",fontWeight:l?600:400,fontSize:15,marginBottom:-2,outline:"none"},children:a.label},a.id)})}),ya.map(a=>f.jsx("div",{role:"tabpanel",id:`panel-${a.id}`,"aria-labelledby":`tab-${a.id}`,hidden:a.id!==e,style:{padding:"20px 4px"},children:t.has(a.id)?f.jsx(a.Content,{}):null},a.id)),f.jsx("p",{style:{marginTop:16,fontSize:12,color:"#aaa"},children:"Keyboard: ← → to switch tabs, Home / End to jump to first / last"})]})}const cx=Object.freeze(Object.defineProperty({__proto__:null,default:lx},Symbol.toStringTag,{value:"Module"}));function ux({size:e=5}){const n=e,t=n,r=()=>Array.from({length:n},()=>Array(n).fill(null)),[i,o]=A.useState(r),[s,a]=A.useState("X"),[l,c]=A.useState(null),[u,d]=A.useState(0),p=[[0,1],[1,0]],h=(g,m,y,_,N,k)=>{let I=m+_,D=y+N,z=0;for(;I>=0&&D>=0&&I<g.length&&D<g[0].length&&g[I][D]===k;)z++,I+=_,D+=N;return z},v=(g,m,y,_)=>{for(let[N,k]of p)if(1+h(g,m,y,N,k,_)+h(g,m,y,-N,-k,_)>=t)return!0;return!1},w=(g,m)=>{if(i[g][m]||l)return;const y=i.map(_=>[..._]);y[g][m]=s,v(y,g,m,s)?c(s):u+1===n*n?c("Draw"):a(s==="X"?"O":"X"),o(y),d(u+1)},S=()=>{o(r()),a("X"),c(null),d(0)};return f.jsxs("div",{style:{textAlign:"center"},children:[f.jsx("h2",{children:l?l==="Draw"?"It's a Draw!":`Winner: ${l}`:`Turn: ${s}`}),f.jsx("div",{style:{display:"grid",gridTemplateColumns:`repeat(${n}, 80px)`,gap:"5px",justifyContent:"center"},children:i.map((g,m)=>g.map((y,_)=>f.jsx("button",{onClick:()=>w(m,_),style:{width:80,height:80,fontSize:24,cursor:"pointer"},children:y},`${m}-${_}`)))}),f.jsx("button",{onClick:S,style:{marginTop:20},children:"Reset"})]})}const dx=Object.freeze(Object.defineProperty({__proto__:null,default:ux},Symbol.toStringTag,{value:"Module"}));class px{constructor(n,t){this.capacity=n,this.refillRate=t,this.tokens=n,this.lastRefill=Date.now()}refill(){const n=Date.now(),r=(n-this.lastRefill)/1e3*this.refillRate;this.tokens=Math.min(this.capacity,this.tokens+r),this.lastRefill=n}allow(){return this.refill(),this.tokens>=1?(this.tokens-=1,!0):!1}}function fx(){const e=A.useRef(new px(5,1)),[n,t]=A.useState(5),[r,i]=A.useState([]),o=()=>{const s=e.current.allow();t(e.current.tokens.toFixed(2)),i(a=>[`${s?"✅ Allowed":"❌ Blocked"} at ${new Date().toLocaleTimeString()}`,...a])};return A.useEffect(()=>{const s=setInterval(()=>{e.current.refill(),t(e.current.tokens.toFixed(2))},100);return()=>clearInterval(s)},[]),f.jsxs("div",{style:{padding:20,fontFamily:"sans-serif"},children:[f.jsx("h2",{children:"🪣 Token Bucket Rate Limiter"}),f.jsxs("p",{children:[f.jsx("b",{children:"Capacity:"})," 5 tokens | ",f.jsx("b",{children:"Refill Rate:"})," 1 token/sec"]}),f.jsxs("p",{children:[f.jsx("b",{children:"Tokens:"})," ",n]}),f.jsx("button",{onClick:o,children:"Send Request"}),f.jsx("div",{style:{marginTop:16},children:r.slice(0,6).map((s,a)=>f.jsx("div",{children:s},a))})]})}const hx=Object.freeze(Object.defineProperty({__proto__:null,default:fx},Symbol.toStringTag,{value:"Module"}));function gx(){const e={red:{backgroundColor:"red",duration:4e3,next:"green"},yellow:{backgroundColor:"yellow",duration:900,next:"red"},green:{backgroundColor:"green",duration:3e3,next:"yellow"}},[n,t]=A.useState("red");return A.useEffect(()=>{const r=e[n],i=setTimeout(()=>{t(r.next)},r.duration);return()=>clearTimeout(i)},[n]),f.jsx("div",{className:"traffic-light-container",children:Object.keys(e).map(r=>f.jsx("div",{className:"light",style:{backgroundColor:r===n?e[r].backgroundColor:""}},r))})}function mx(){return f.jsx(gx,{})}const yx=Object.freeze(Object.defineProperty({__proto__:null,default:mx},Symbol.toStringTag,{value:"Module"})),bx=[{id:1,title:"HTML"},{id:2,title:"JavaScript"},{id:3,title:"CSS"},{id:4,title:"TypeScript"}];function vx(){const[e,n]=A.useState(bx),[t,r]=A.useState([]),[i,o]=A.useState(new Set),s=p=>{o(h=>{const v=new Set(h);return v.has(p)?v.delete(p):v.add(p),v})},a=p=>p.filter(h=>i.has(h.id)),l=p=>p.filter(h=>!i.has(h.id)),c=p=>{o(h=>{const v=new Set(h);return p.forEach(w=>v.delete(w.id)),v})},u=()=>{const p=a(e);p.length!==0&&(r(h=>[...h,...p]),n(h=>l(h)),c(p))},d=()=>{const p=a(t);p.length!==0&&(n(h=>[...h,...p]),r(h=>l(h)),c(p))};return f.jsxs("div",{style:ps.container,children:[f.jsx(Cd,{title:"Available",items:e,checkedIds:i,onToggle:s}),f.jsxs("div",{style:ps.actions,children:[f.jsx("button",{onClick:u,children:">"}),f.jsx("button",{onClick:d,children:"<"})]}),f.jsx(Cd,{title:"Selected",items:t,checkedIds:i,onToggle:s})]})}function Cd({title:e,items:n,checkedIds:t,onToggle:r}){return f.jsxs("div",{style:ps.list,children:[f.jsx("h4",{children:e}),n.map(i=>f.jsxs("label",{style:ps.item,children:[f.jsx("input",{type:"checkbox",checked:t.has(i.id),onChange:()=>r(i.id)}),f.jsx("span",{style:{marginLeft:8},children:i.title})]},i.id))]})}const ps={container:{display:"flex",gap:20,alignItems:"center"},list:{border:"1px solid #ccc",padding:10,width:160,height:220,overflowY:"auto"},item:{display:"flex",alignItems:"center",marginBottom:6,cursor:"pointer"},actions:{display:"flex",flexDirection:"column",gap:10}},wx=Object.freeze(Object.defineProperty({__proto__:null,default:vx},Symbol.toStringTag,{value:"Module"}));function xx(e,n){const[t,r]=A.useState("");return A.useEffect(()=>{const i=setTimeout(()=>{r(e)},n);return()=>clearTimeout(i)},[e]),t}function Sx(){const[e,n]=A.useState(""),[t,r]=A.useState(!1),[i,o]=A.useState(null),[s,a]=A.useState([]),l=A.useRef(new Map),c=A.useRef(null),u=xx(e,1e3);return A.useEffect(()=>{var v;if(o(!1),r(!0),!u){a([]);return}if(l.current.has(u)){a(l.current.get(u)),r(!1);return}(v=c.current)==null||v.abort();const d=new AbortController;c.current=d;const p=c.current.signal;return(async()=>{const w="https://dummyjson.com/products/search?q=";try{const g=await(await fetch(w+u,{signal:p})).json();a(g.products),l.current.set(u,g.products)}catch(S){if(S.name!=="AbortError")return;o(S)}finally{r(!1)}})(),()=>{d.abort()}},[u]),f.jsxs("div",{style:{position:"relative"},children:[f.jsx("input",{type:"text",placeholder:"write here...",onChange:d=>n(d.target.value),style:{width:"100%",padding:10}}),f.jsxs("div",{style:{position:"absolute",padding:20,border:"1px solid #ccc",width:"100%",borderRadius:"4px",display:s.length?"flex":"none",background:"#fbfbfbff"},children:[t&&f.jsx("div",{children:"Loading..."}),f.jsx("ul",{style:{padding:0,margin:0},children:s.map(d=>f.jsx("div",{style:{padding:"10px 10px 10px 20px"},children:d.title}))})]})]})}const kx=Object.freeze(Object.defineProperty({__proto__:null,default:Sx},Symbol.toStringTag,{value:"Module"})),ba=200;function Ex({items:e}){const[n,t]=A.useState(0),[r,i]=A.useState(0),o=A.useRef(null);A.useLayoutEffect(()=>{if(o.current&&!r){const p=o.current.getBoundingClientRect().height;i(p)}},[r]);const s=A.useCallback(p=>{t(p.target.scrollTop)});if(!r)return f.jsx("div",{style:{height:ba},children:f.jsx("div",{ref:o,children:e[0]})});const a=r*e.length,l=Math.floor(n/r),c=l+Math.ceil(ba/r),u=e.slice(l,c),d=l*r;return f.jsx("div",{onScroll:s,style:{height:ba,overflowY:"auto",border:"1px solid #ccc"},children:f.jsx("div",{style:{height:a,position:"relative"},children:f.jsx("div",{style:{transform:`translateY(${d}px)`},children:u.map((p,h)=>f.jsx("div",{style:{height:r,display:"flex",alignItems:"center",paddingLeft:12,borderBottom:"1px solid #eee",boxSizing:"border-box"},children:p},l+h))})})})}function _x(){const e=Array.from({length:2e4},(n,t)=>`Item ${t+1}`);return f.jsxs("div",{style:{padding:20},children:[f.jsx("h2",{children:"Virtualized List Demo"}),f.jsx(Ex,{items:e})]})}const Cx=Object.freeze(Object.defineProperty({__proto__:null,default:_x},Symbol.toStringTag,{value:"Module"})),At=5,va=6,Td=["REACT","STATE","PROPS","HOOKS","ASYNC","AWAIT","ARRAY","OBJECT","CLASS","SUPER","CONST","TIMER","FETCH","PROXY","CACHE","QUERY","MODAL","INPUT","VALID","ERROR","FRAME","SCOPE","BUILD","STACK","QUEUE","GRAPH","TREES","NODES","LINKS","ROUTE"],gn={DEFAULT:"#d3d6da",CORRECT:"#6aaa64",PRESENT:"#c9b458",ABSENT:"#787c7e",TILE_BG:"#ffffff",BORDER:"#d3d6da"},Tx=[["Q","W","E","R","T","Y","U","I","O","P"],["A","S","D","F","G","H","J","K","L"],["ENTER","Z","X","C","V","B","N","M","BACKSPACE"]];function Rx(){const[e]=A.useState(()=>Td[Math.floor(Math.random()*Td.length)]),[n,t]=A.useState([]),[r,i]=A.useState(""),[o,s]=A.useState("playing"),[a,l]=A.useState({}),c=A.useRef(null),u=m=>{const y=Array(At).fill(null),_=e.split(""),N=m.split(""),k={};for(let I=0;I<At;I++)N[I]===_[I]?y[I]="correct":k[_[I]]=(k[_[I]]||0)+1;for(let I=0;I<At;I++){if(y[I]==="correct")continue;const D=N[I];k[D]&&k[D]>0?(y[I]="present",k[D]--):y[I]="absent"}return y},d=(m,y)=>{const _={...a};for(let N=0;N<m.length;N++){const k=m[N],I=y[N];_[k]!=="correct"&&(_[k]==="present"&&I==="absent"||(_[k]=I))}l(_)},p=()=>{if(r.length!==At){alert(`Word must be ${At} letters long!`);return}const m=u(r);d(r,m);const y=[...n,r];if(t(y),i(""),r===e){s("won");return}if(y.length>=va){s("lost");return}},h=m=>{o==="playing"&&(m==="ENTER"?p():m==="BACKSPACE"?i(y=>y.slice(0,-1)):m.length===1&&/^[A-Z]$/.test(m)&&r.length<At&&i(y=>y+m))},v=()=>{window.location.reload()};A.useEffect(()=>{const m=y=>{o==="playing"&&(y.key==="Enter"?(y.preventDefault(),h("ENTER")):y.key==="Backspace"?(y.preventDefault(),h("BACKSPACE")):/^[a-zA-Z]$/.test(y.key)&&(y.preventDefault(),h(y.key.toUpperCase())))};return window.addEventListener("keydown",m),()=>window.removeEventListener("keydown",m)},[r,o,n]),A.useEffect(()=>{c.current&&c.current.focus()},[]);const w=(m,y,_)=>{let N=gn.TILE_BG,k=gn.BORDER,I="#000";return y==="correct"?(N=gn.CORRECT,I="#fff",k=gn.CORRECT):y==="present"?(N=gn.PRESENT,I="#fff",k=gn.PRESENT):y==="absent"?(N=gn.ABSENT,I="#fff",k=gn.ABSENT):m&&(k="#888"),f.jsx("div",{style:{width:"62px",height:"62px",border:`2px solid ${k}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"32px",fontWeight:"bold",backgroundColor:N,color:I,textTransform:"uppercase",transition:"all 0.3s ease",userSelect:"none"},children:m},_)},S=(m,y)=>{const _=m.split(""),N=y<n.length?u(m):[];return f.jsx("div",{style:{display:"flex",gap:"5px",marginBottom:"5px"},children:Array.from({length:At}).map((k,I)=>w(_[I]||"",N[I],I))},y)},g=m=>{const y=m==="ENTER"||m==="BACKSPACE",_=a[m];let N=gn.DEFAULT,k="#000";return _==="correct"?(N=gn.CORRECT,k="#fff"):_==="present"?(N=gn.PRESENT,k="#fff"):_==="absent"&&(N=gn.ABSENT,k="#fff"),f.jsx("button",{onClick:()=>h(m),disabled:o!=="playing",style:{padding:y?"12px 16px":"12px 10px",fontSize:y?"12px":"14px",fontWeight:"600",border:"none",borderRadius:"4px",backgroundColor:o!=="playing"?"#d3d6da":N,color:k,cursor:o!=="playing"?"not-allowed":"pointer",minWidth:y?"65px":"32px",transition:"all 0.1s",textTransform:"uppercase",opacity:o!=="playing"?.6:1},onMouseDown:I=>{o==="playing"&&(I.currentTarget.style.transform="scale(0.95)")},onMouseUp:I=>{I.currentTarget.style.transform="scale(1)"},onMouseLeave:I=>{I.currentTarget.style.transform="scale(1)"},children:m==="BACKSPACE"?"⌫":m},m)};return f.jsxs("div",{ref:c,tabIndex:0,style:{maxWidth:"500px",margin:"0 auto",padding:"20px",fontFamily:"Arial, sans-serif",outline:"none"},children:[f.jsxs("div",{style:{textAlign:"center",marginBottom:"20px",borderBottom:"1px solid #d3d6da",paddingBottom:"16px"},children:[f.jsx("h1",{style:{fontSize:"36px",fontWeight:"bold",margin:"0 0 8px 0",letterSpacing:"0.05em"},children:"WORDLE"}),f.jsx("p",{style:{fontSize:"14px",color:"#666",margin:0},children:"Guess the 5-letter word in 6 tries"})]}),f.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:"30px"},children:[n.map((m,y)=>S(m,y)),o==="playing"&&n.length<va&&S(r,n.length),Array.from({length:va-n.length-(o==="playing"?1:0)}).map((m,y)=>S("",n.length+y+1))]}),o!=="playing"&&f.jsx("div",{style:{textAlign:"center",marginBottom:"20px",padding:"20px",backgroundColor:o==="won"?"#6aaa64":"#787c7e",color:"#fff",borderRadius:"8px",fontWeight:"bold"},children:o==="won"?f.jsxs(f.Fragment,{children:[f.jsx("div",{style:{fontSize:"24px",marginBottom:"8px"},children:"🎉 You Win!"}),f.jsxs("div",{style:{fontSize:"16px"},children:["You guessed the word in ",n.length," ",n.length===1?"try":"tries","!"]})]}):f.jsxs(f.Fragment,{children:[f.jsx("div",{style:{fontSize:"24px",marginBottom:"8px"},children:"Game Over"}),f.jsxs("div",{style:{fontSize:"16px"},children:["The word was: ",f.jsx("strong",{children:e})]})]})}),o!=="playing"&&f.jsx("div",{style:{textAlign:"center",marginBottom:"30px"},children:f.jsx("button",{onClick:v,style:{padding:"12px 40px",fontSize:"16px",fontWeight:"600",border:"none",borderRadius:"6px",backgroundColor:"#1976d2",color:"white",cursor:"pointer",transition:"all 0.2s"},onMouseEnter:m=>{m.currentTarget.style.backgroundColor="#1565c0"},onMouseLeave:m=>{m.currentTarget.style.backgroundColor="#1976d2"},children:"Play Again"})}),f.jsx("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"6px"},children:Tx.map((m,y)=>f.jsx("div",{style:{display:"flex",gap:"6px"},children:m.map(_=>g(_))},y))}),f.jsxs("div",{style:{marginTop:"30px",padding:"20px",backgroundColor:"#f5f5f5",borderRadius:"8px",fontSize:"14px",lineHeight:"1.6",color:"#555"},children:[f.jsx("strong",{children:"How to Play:"}),f.jsxs("ul",{style:{marginLeft:"20px",marginTop:"8px",marginBottom:0},children:[f.jsx("li",{children:"Type or click letters to make a 5-letter word"}),f.jsx("li",{children:"Press ENTER to submit your guess"}),f.jsx("li",{children:"Green = correct letter in correct position"}),f.jsx("li",{children:"Yellow = correct letter in wrong position"}),f.jsx("li",{children:"Gray = letter not in word"}),f.jsx("li",{children:"You have 6 attempts to guess the word!"})]})]}),!1]})}const Nx=Object.freeze(Object.defineProperty({__proto__:null,default:Rx},Symbol.toStringTag,{value:"Module"})),Ix=`import React, {useState, useEffect} from "react";

/**
 * ============================================================================
 * PROBLEM: Calendar Day View Layout
 * ============================================================================
 *
 * INTUITION:
 * We need to render events on a vertical timeline.
 * 1. Vertical Position (Top/Height): Determined by start/end time relative to the day boundaries.
 * 2. Horizontal Position (Left/Width): Determined by overlaps.
 *    - If events overlap, they must share the horizontal space to avoid visual collision.
 *    - A simple approach is to group overlapping events and divide width equally.
 *
 * ALGORITHM (Simple Grouping):
 * 1. Sort events by start time.
 * 2. Iterate through events and build "groups" of overlapping events.
 *    - If the current event overlaps with the previous one (or the group), add to current group.
 *    - If not, the group is complete. "Distribute" width among them and start a new group.
 * 3. Distribute:
 *    - Count N events in group.
 *    - Width = 100% / N.
 *    - Left = Index * Width.
 *
 * ============================================================================
 * DRY RUN
 * ============================================================================
 * Events: A (9:30-11:00), B (10:00-12:00), C (12:00-13:00)
 *
 * 1. Sort: A, B, C.
 * 2. Process A: Group is empty. Group = [A].
 * 3. Process B: Does A overlap B? (11:00 > 10:00) -> YES. Group = [A, B].
 * 4. Process C: Does B overlap C? (12:00 > 12:00) -> NO.
 *    - Distribute [A, B]:
 *      - A: width 50%, left 0%.
 *      - B: width 50%, left 50%.
 *    - Start new Group = [C].
 * 5. End: Distribute [C]:
 *    - C: width 100%, left 0%.
 * ============================================================================
 */

const START_MIN = 0;   // 9:00 AM (540 min)
const END_MIN = 24 * 60;    // 6:00 PM (1080 min)
const DAY_RANGE = END_MIN - START_MIN;

const events = [
  { id: 1, title: "Meeting A", start: 9 * 60 + 30, end: 11 * 60 },
  { id: 2, title: "Meeting B", start: 10 * 60, end: 12 * 60 },
  { id: 3, title: "Meeting C", start: 13 * 60, end: 14 * 60 },
  { id: 4, title: "Meeting D", start: 13 * 60 + 30, end: 15 * 60 },
];

function layoutEvents(events) {
  /**
   * Core idea:
   * We group events that overlap in time.
   * Overlap is determined against the *maximum end time* seen so far,
   * not just the previous event.
   */

  // Sort events by start time so we can sweep left → right
  const sorted = [...events].sort((a, b) => a.start - b.start);
  const result = [];

  // Current overlapping group
  let group = [];

  // Tracks the furthest end time of the current group.
  // This is the key invariant:
  // As long as next.start < maxEnd, it overlaps with *some* event in the group.
  let maxEnd = -Infinity;

  for (const event of sorted) {
    /**
     * Case 1: Start a new group OR continue the current overlapping group
     *
     * We continue the group if:
     *   event.start < maxEnd
     *
     * Why?
     * Because it overlaps with at least one event already in the group,
     * even if it does NOT overlap with the immediately previous event.
     */
    if (!group.length || event.start < maxEnd) {
      group.push(event);
      // Update the invariant for the group
      maxEnd = Math.max(maxEnd, event.end);
    } else {
      /**
       * Case 2: No overlap with the current group
       *
       * Finalize layout for the previous group,
       * then start a new group with this event.
       */
      distribute(group, result);
      group = [event];
      maxEnd = event.end;
    }
  }

  // Finalize the last group if it exists
  if (group.length) {
    distribute(group, result);
  }

  return result;
}

/**
 * Assigns horizontal layout for a group of overlapping events.
 *
 * All events in the group share equal width and are placed side-by-side.
 * This assumes vertical positioning is handled elsewhere.
 */
function distribute(group, result) {
  const width = 100 / group.length;

  group.forEach((event, index) => {
    result.push({
      ...event,
      width,
      left: index * width,
    });
  });
}




export default function CalendarDayView() {
  const laidOut = layoutEvents(events);
  const [now, setNow] = useState(new Date());

  // Update "Current Time" indicator every minute
  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, 60000); // update every minute

    return () => clearInterval(id);
  }, []);

  // Calculate "Now" line position
  const currentMinutes =
    now.getHours() * 60 + now.getMinutes();

  const showNow =
    currentMinutes >= START_MIN &&
    currentMinutes <= END_MIN;

  const nowTop =
    ((currentMinutes - START_MIN) / DAY_RANGE) * 100;

  return (
    <div className="calendar-wrapper">
      {/* Time column */}
      <div className="time-column">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="time-label">
            {0 + i}:00
          </div>
        ))}
      </div>

      {/* Day column */}
      <div className="calendar">
        {/* Background Grid Lines */}
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="hour-line" />
        ))}

        {/* Red "Current Time" Line */}
        {showNow && (
          <div
            className="now-line"
            style={{ top: \`\${nowTop}%\` }}
          >
            <div className="now-dot" />
          </div>
        )}

        {/* Render Events */}
        {laidOut.map((e) => (
          <div
            key={e.id}
            className="event"
            style={{
              // Convert minutes to percentage of container height
              top: \`\${((e.start - START_MIN) / DAY_RANGE) * 100}%\`,
              height: \`\${((e.end - e.start) / DAY_RANGE) * 100}%\`,
              left: \`\${e.left}%\`,
              width: \`\${e.width}%\`,
            }}
          >
            {e.title}
          </div>
        ))}
      </div>
    </div>
  );
}
`,Ax=`.calendar-wrapper {
    display: flex;
    font-family: system-ui, sans-serif;
}

.time-column {
    width: 60px;
    padding-top: 20px;
}

.time-label {
    height: 60px;
    font-size: 12px;
    color: #555;
}

.calendar {
    position: relative;
    height: 540px;
    /* 9 hours × 60px */
    width: 600px;
    border-left: 1px solid #ccc;
    background: #fafafa;
}

.hour-line {
    position: relative;
    height: 60px;
    border-bottom: 1px solid #e5e7eb;
}

.event {
    position: absolute;
    background: #3b82f6;
    color: white;
    padding: 6px;
    border-radius: 6px;
    font-size: 12px;
    box-sizing: border-box;
}

.now-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: red;
    z-index: 10;
}

.now-dot {
    position: absolute;
    left: -6px;
    top: -4px;
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 50%;
}`,Ox=`import { useState } from "react";

export default function Carousel() {
  const items = ["Slide 1", "Slide 2", "Slide 3"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = items.length;

  function next() {
    setCurrentIndex((prev) => (prev + 1) % total);
  }

  function prev() {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }

  return (
    <div className="carousel-container">
        <div className="carousel">
        <button onClick={prev}>←</button>

        <div className="carousel-window">
            <div
            className="carousel-track"
            style={{ transform: \`translateX(-\${currentIndex * 100}%)\` }}
            >
            {items.map((item, index) => (
                <div className="carousel-item" key={index}>
                {item}
                </div>
            ))}
            </div>
        </div>

        <button onClick={next}>→</button>
        </div>
        <div className="dots">
            {items.map((_, index) => (
            <span
                key={index}
                className={\`dot \${index === currentIndex ? "active" : ""}\`}
                onClick={() => setCurrentIndex(index)}
            />
            ))}
        </div>
    </div>
  );
}
`,Mx=`.carousel-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.carousel {
    display: flex;
    align-items: center;
    gap: 12px;
}

.carousel-window {
    width: 300px;
    overflow: hidden;
}

.carousel-track {
    display: flex;
    transition: transform 0.4s ease;
}

.carousel-item {
    min-width: 300px;
    height: 180px;
    background: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

/* 🔵 Dots */
.dots {
    display: flex;
    gap: 8px;
    margin-top: 10px;
}

.dot {
    width: 10px;
    height: 10px;
    background: #bbb;
    border-radius: 50%;
    cursor: pointer;
}

.dot.active {
    background: #333;
}`,Dx=`import { useRef, useEffect, memo } from "react";

// ---------------------------------------------------------------------------
// TreeNode — renders a single checkbox + its children recursively
// memo() prevents re-render if props haven't changed (important for large trees)
// ---------------------------------------------------------------------------
const TreeNode = memo(function TreeNode({ node, checked, onCheck }) {
  const inputRef = useRef(null);

  // Indeterminate state: some children checked, but not all
  // This is a DOM property — can't be set via React props, must use a ref
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = isIndeterminate(node, checked);
    }
  }, [node.id, checked]);

  return (
    <li>
      <label>
        <input
          ref={inputRef}
          type="checkbox"
          checked={checked[node.id] ?? false}
          onChange={(e) => onCheck(node, e.target.checked)}
        />
        <span className="node-label">{node.label}</span>
      </label>

      {/* Recurse into children if they exist */}
      {node.children && (
        <ul>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              checked={checked}
              onCheck={onCheck}
            />
          ))}
        </ul>
      )}
    </li>
  );
});

// ---------------------------------------------------------------------------
// isIndeterminate — true when SOME (not all) children are checked
// Only leaf nodes are never indeterminate
// ---------------------------------------------------------------------------
function isIndeterminate(node, checked) {
  if (!node.children) return false;

  const checkedCount = node.children.filter(
    (child) => checked[child.id],
  ).length;

  // Partial selection = some checked, not all checked
  return checkedCount > 0 && checkedCount < node.children.length;
}

// ---------------------------------------------------------------------------
// CheckboxTree — entry point, wraps the list in a semantic container
// ---------------------------------------------------------------------------
export default function CheckboxTree({ nodes, checked, onCheck }) {
  return (
    <div className="checkbox-tree">
      <ul>
        {nodes.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            checked={checked}
            onCheck={onCheck}
          />
        ))}
      </ul>
    </div>
  );
}
`,Lx=`import { useState } from "react";
import { treeData } from "./data";
import CheckboxTree from "./CheckboxTree";

// ---------------------------------------------------------------------------
// STATE DESIGN: flat map { [id]: boolean } instead of nested tree state
// Why flat? O(1) lookup and update per node. No deep cloning needed.
// { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false }
// ---------------------------------------------------------------------------
function getInitialChecked(nodes) {
  let state = {};
  for (const node of nodes) {
    state[node.id] = false;
    if (node.children) {
      // Merge child states into the same flat map
      state = { ...state, ...getInitialChecked(node.children) };
    }
  }
  return state;
}

// ---------------------------------------------------------------------------
// DOWNWARD PROPAGATION — check/uncheck a node AND all its descendants
// Pattern: DFS — set current node, then recurse into children
// ---------------------------------------------------------------------------
function setDescendants(node, value, state) {
  state[node.id] = value;
  if (node.children) {
    for (const child of node.children) {
      setDescendants(child, value, state);
    }
  }
}

// ---------------------------------------------------------------------------
// UPWARD PROPAGATION — after changing a node, update all its ancestors
// Rule: parent is checked only when ALL its children are checked
// Pattern: search from root, find the parent of the changed node, update it,
// then recurse upward until we reach the root
// ---------------------------------------------------------------------------
const updateAncestors = (changedNode, nodes, state) => {
  for (const node of nodes) {
    if (!node.children) continue;

    if (node.children.some((c) => c.id === changedNode.id)) {
      // direct assignment — no need for ternary
      state[node.id] = node.children.every((c) => state[c.id]);
      updateAncestors(node, treeData, state); // walk upward
      return; // found parent — stop searching siblings
    }

    updateAncestors(changedNode, node.children, state); // search deeper
  }
};

// ---------------------------------------------------------------------------
// App — owns the checked state and wires the two propagation functions
// ---------------------------------------------------------------------------
export default function App() {
  const [checked, setChecked] = useState(() => getInitialChecked(treeData));

  function handleCheck(node, value) {
    // Always work on a shallow copy — never mutate state directly
    const next = { ...checked };

    // Step 1: propagate downward (check/uncheck all descendants)
    setDescendants(node, value, next);

    // Step 2: propagate upward (recalculate all ancestor states)
    updateAncestors(node, treeData, next);

    setChecked(next);
  }

  return (
    <div className="tree-container">
      <h2>Hierarchical Checkbox Tree</h2>
      <CheckboxTree nodes={treeData} checked={checked} onCheck={handleCheck} />
    </div>
  );
}
`,Px=`export const treeData = [
  // Define the hierarchical checkbox structure
  {
    id: 1,
    label: "Parent 1",
    children: [
      { id: 2, label: "Child 1-1" }, // Child node
      { id: 3, label: "Child 1-2" }, // Child node
    ],
  },
  {
    id: 4,
    label: "Parent 2",
    children: [
      {
        id: 5,
        label: "Child 2-1",
        children: [
          { id: 6, label: "Grandchild 2-1-1" }, // Grandchild node
        ],
      },
    ],
  },
];
`,Bx=`.checkbox-tree {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  user-select: none;
}

.checkbox-tree ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.checkbox-tree ul ul {
  padding-left: 24px;
  margin-left: 8px;
  border-left: 1px dashed #ccc;
}

.checkbox-tree li {
  position: relative;
  padding: 4px 0;
}

/* Horizontal connector line */
.checkbox-tree ul ul > li::before {
  content: "";
  position: absolute;
  left: -16px;
  top: 14px;
  width: 12px;
  height: 1px;
  border-bottom: 1px dashed #ccc;
}

.checkbox-tree label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.15s;
}

.checkbox-tree label:hover {
  background-color: #f0f7ff;
}

/* Custom checkbox styling */
.checkbox-tree input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #2563eb;
}

/* Node text */
.node-label {
  color: #333;
}

/* Checked state styling */
.checkbox-tree label.checked .node-label {
  color: #2563eb;
  font-weight: 500;
}

/* Expand/collapse icon area (if needed later) */
.node-toggle {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  font-size: 10px;
}

/* Container styling */
.tree-container {
  padding: 16px;
  max-width: 400px;
}

.tree-container h2 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #333;
}

/* Indeterminate state indicator (visual only) */
.checkbox-tree input[type="checkbox"]:indeterminate {
  opacity: 0.6;
}
`,jx=`import { useState } from "react";

/**
 * ============================================================================
 * PROBLEM: Knight Shortest Path (BFS)
 * ============================================================================
 *
 * INTUITION:
 * A Knight in chess moves in an "L" shape: 2 squares in one cardinal direction
 * (horizontal or vertical) and then 1 square perpendicular to that direction.
 *
 * Unlike the Rook, the Knight "jumps" directly to the destination square.
 * It does not slide through intermediate squares.
 *
 * We want to find the minimum number of moves to get from Start to Target.
 * Since the graph is unweighted (each move = 1 step), BFS is the optimal algorithm.
 *
 * ALGORITHM (BFS):
 * 1. Start at (0,0).
 * 2. Explore all 8 possible Knight moves.
 * 3. If a move lands on a valid, unvisited board square, add it to the Queue.
 * 4. Track the 'parent' of each square to reconstruct the path later.
 * 5. Stop when we reach the Target.
 *
 * ============================================================================
 * DRY RUN EXAMPLE
 * ============================================================================
 * Board 8x8. Start (0,0). Target (2,1).
 *
 * 1. Queue: [(0,0)]
 * 2. Pop (0,0).
 *    - Possible moves: (1,2), (2,1).
 *    - (1,2): Valid. Queue push. Parent=(0,0).
 *    - (2,1): Valid. Queue push. Parent=(0,0).
 *
 * 3. Pop (1,2).
 *    - Explore neighbors...
 *
 * 4. Pop (2,1).
 *    - This is Target!
 *    - Path reconstruction: (2,1) -> Parent is (0,0).
 *    - Result: (0,0) -> (2,1). 1 Move.
 * ============================================================================
 */

const blocked = new Set([
  "3-3",
  "3-4",
  "4-3",
]);

export default function KnightShortestPath() {
  const N = 8;

  const knightMoves = [
    [2, 1], [2, -1], [-2, 1], [-2, -1],
    [1, 2], [1, -2], [-1, 2], [-1, -2],
  ];

  const [start] = useState([0, 0]);
  const [target] = useState([7, 7]);
  const [path, setPath] = useState([]);

  const bfs = () => {
    const visited = Array.from({ length: N }, () =>
      Array(N).fill(false)
    );
    const parent = Array.from({ length: N }, () =>
      Array(N).fill(null)
    );

    const queue = [];
    queue.push(start);
    visited[start[0]][start[1]] = true;

    while (queue.length) {
      const [r, c] = queue.shift();

      if (r === target[0] && c === target[1]) break;

      // Explore all 8 possible L-shaped moves
      for (let [dr, dc] of knightMoves) {
        const nr = r + dr;
        const nc = c + dc;

        if (
          nr >= 0 &&
          nc >= 0 &&
          nr < N &&
          nc < N &&
          !visited[nr][nc] &&
          !blocked.has(\`\${nr}-\${nc}\`)
        ) {
          visited[nr][nc] = true;
          parent[nr][nc] = [r, c];
          queue.push([nr, nc]);
        }
      }
    }

    // If target was never reached
    if (!visited[target[0]][target[1]]) {
      alert("Target is unreachable!");
      return;
    }

    const result = [];
    let curr = target;

    while (curr) {
      result.push(curr);
      curr = parent[curr[0]][curr[1]];
    }

    setPath(result.reverse());
  };

  return (
    <div className="container">
      <h2>♞ Knight Shortest Path</h2>

      <button onClick={bfs}>Find Shortest Path</button>

      <div
        className="board"
        style={{
          display: "grid",
          gridTemplateColumns: \`repeat(\${N}, 40px)\`, // Ensure grid layout
          gap: "2px",
          marginTop: "20px",
        }}
      >
        {Array.from({ length: N * N }).map((_, idx) => {
          const r = Math.floor(idx / N);
          const c = idx % N;

          const isStart = r === start[0] && c === start[1];
          const isEnd = r === target[0] && c === target[1];
          const isPath = path.some(([x, y]) => x === r && y === c);
          const isBlocked = blocked.has(\`\${r}-\${c}\`);
          const isDark = (r + c) % 2 === 1;

          return (
            <div
              key={\`\${r}-\${c}\`}
              className={\`cell
                \${isDark ? "dark" : "light"}
                \${isPath ? "path" : ""}
                \${isStart ? "start" : ""}
                \${isEnd ? "end" : ""}
                \${isBlocked ? "blocked" : ""}\`}
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #ccc",
                backgroundColor: isPath ? "lightgreen" : isBlocked ? "black" : isDark ? "#779556" : "#ebecd0",
                color: isBlocked ? "white" : "inherit",
                fontWeight: "bold"
              }}
            >
              {isBlocked && "X"}
              {isStart && "S"}
              {isEnd && "T"}
            </div>
          );
        })}
      </div>

      <div className="legend">
        <div>🟩 Path = BFS shortest path</div>
        <div>⬛ X = Blocked</div>
        <div>S = Start</div>
        <div>T = Target</div>
      </div>
    </div>
  );
}
`,Fx=`.container {
    padding: 20px;
    font-family: sans-serif;
}

button {
    padding: 8px 14px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.board {
    display: grid;
    grid-template-columns: repeat(8, 50px);
    gap: 6px;
    margin-top: 20px;
}

.cell {
    height: 50px;
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    border-radius: 6px;
}

/* Chessboard base colors */
.cell.light {
    background: #f0f0f0;
}

.cell.dark {
    background: #bdbdbd;
}

/* Path overrides */
.cell.path {
    background: #a7f3d0;
}

/* Start / End overrides */
.cell.start {
    background: #22c55e;
    color: white;
}

.cell.end {
    background: #ef4444;
    color: white;
}`,zx=`import { useState } from "react";

/**
 * ============================================================================
 * PROBLEM: Rook Shortest Path (BFS)
 * ============================================================================
 *
 * INTUITION:
 * A Rook in chess can move any number of squares horizontally or vertically,
 * stopping only at the edge of the board or before a blocked square.
 *
 * We want to find the minimum number of *moves* (turns) to get from Start to Target.
 * This is a shortest-path problem on a graph where:
 * - Nodes: Each cell (r, c).
 * - Edges: From a cell, edges exist to ALL cells reachable in a straight line.
 * - Weight: 1 (each slide counts as 1 move).
 *
 * ALGORITHM (BFS with Sliding):
 * 1. Start at (0,0).
 * 2. For the current cell, explore all 4 directions (Up, Down, Left, Right).
 * 3. In each direction, "slide" continuously until we hit a wall or block.
 * 4. Add every cell encountered during the slide to the Queue (if not visited).
 * 5. IMPORTANT: Even if a cell is visited, we must continue sliding through it
 *    because the Rook can pass through visited squares to reach new ones.
 *
 * ============================================================================
 * DRY RUN EXAMPLE
 * ============================================================================
 * Board 4x4. Start (0,0). Target (0,2). Blocked (0,1).
 *
 * 1. Queue: [(0,0)]
 * 2. Pop (0,0).
 *    - Slide Right:
 *      - Check (0,1): BLOCKED. Stop sliding right.
 *    - Slide Down:
 *      - (1,0): New. Queue push (1,0). Parent=(0,0).
 *      - (2,0): New. Queue push (2,0). Parent=(0,0).
 *      - (3,0): New. Queue push (3,0). Parent=(0,0).
 *
 * 3. Pop (1,0).
 *    - Slide Right:
 *      - (1,1): New. Queue push. Parent=(1,0).
 *      - (1,2): New. Queue push. Parent=(1,0).
 *    - Slide Up:
 *      - (0,0): Visited. Continue.
 *
 * 4. Eventually we pop (1,2) (or similar) and slide Up to reach (0,2).
 *    Path: (0,0) -> (1,0) -> (1,2) -> (0,2) (3 moves).
 *    (Note: Direct path (0,0)->(0,2) was blocked).
 * ============================================================================
 */

export default function RookShortestPath() {
  const N = 8;

  // Example blocked cells
  const blocked = new Set([
    "3-3",
    "3-4",
    "4-3",
  ]);

  const [start] = useState([0, 0]);
  const [target] = useState([7, 7]);
  const [path, setPath] = useState([]);

  const bfs = () => {
    const visited = Array.from({ length: N }, () =>
      Array(N).fill(false)
    );
    const parent = Array.from({ length: N }, () =>
      Array(N).fill(null)
    );

    const queue = [start];
    visited[start[0]][start[1]] = true;

    while (queue.length) {
      const [r, c] = queue.shift();

      if (r === target[0] && c === target[1]) break;

      // 4 directions: down, up, right, left
      const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];

      for (let [dr, dc] of directions) {
        let nr = r + dr;
        let nc = c + dc;

        // SLIDE continuously in one direction
        // A Rook moves until it hits a boundary or a blocked cell
        while (
          nr >= 0 &&
          nc >= 0 &&
          nr < N &&
          nc < N &&
          !blocked.has(\`\${nr}-\${nc}\`)
        ) {
          // If we haven't visited this cell yet, record it
          if (!visited[nr][nc]) {
            visited[nr][nc] = true;
            parent[nr][nc] = [r, c];
            queue.push([nr, nc]);
          }
          nr += dr;
          nc += dc;
        }
      }
    }

    // If target was never reached
    if (!visited[target[0]][target[1]]) {
      alert("Target is unreachable!");
      return;
    }

    // reconstruct path
    const result = [];
    let curr = target;

    while (curr) {
      result.push(curr);
      curr = parent[curr[0]][curr[1]];
    }

    setPath(result.reverse());
  };


  return (
    <div className="container">
      <h2>♜ Rook Shortest Path</h2>

      <button onClick={bfs}>Find Shortest Path</button>

      <div
        className="board"
        style={{
          display: "grid",
          gridTemplateColumns: \`repeat(\${N}, 40px)\`, // Ensure grid layout
          gap: "2px",
          marginTop: "20px",
        }}
      >
        {Array.from({ length: N }).map((_, r) =>
          Array.from({ length: N }).map((_, c) => {
            const isDark = (r + c) % 2 === 1;
            const isStart = r === start[0] && c === start[1];
            const isEnd = r === target[0] && c === target[1];
            const isBlocked = blocked.has(\`\${r}-\${c}\`);
            const isPath = path.some(([x, y]) => x === r && y === c);

            return (
              <div
                key={\`\${r}-\${c}\`} // FIX: Added missing key prop
                className={\`cell
                  \${isDark ? "dark" : "light"}
                  \${isBlocked ? "blocked" : ""}
                  \${isPath ? "path" : ""}
                  \${isStart ? "start" : ""}
                  \${isEnd ? "end" : ""}\`}
                style={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #ccc",
                  backgroundColor: isPath ? "lightgreen" : isBlocked ? "black" : isDark ? "#779556" : "#ebecd0",
                  color: isBlocked ? "white" : "inherit",
                  fontWeight: "bold"
                }}
              >
                {isBlocked && "X"}
                {isStart && "S"}
                {isEnd && "T"}
              </div>
            );
          })
        )}
      </div>

      <div className="legend">
        <div>🟩 Green: Shortest path</div>
        <div>⬛ X: Blocked cell</div>
        <div>S: Start</div>
        <div>T: Target</div>
        <div>Each straight line = 1 rook move</div>
      </div>
    </div>
  );
}
`,Ux=`.board {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    width: 360px;
    margin: 20px auto;
}

.cell {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 16px;
    box-sizing: border-box;
}

/* Chessboard colors */
.light {
    background: #f0d9b5;
}

.dark {
    background: #b58863;
}

/* Start / End */
.start {
    background: #22c55e !important;
    color: white;
}

.end {
    background: #ef4444 !important;
    color: white;
}

/* Blocked cell */
.blocked {
    background: black !important;
    color: white;
}

/* Path */
.path {
    background: #4ade80 !important;
}

/* Legend */
.legend {
    margin-top: 16px;
    font-size: 14px;
}`,$x=`import { useRef, useState } from "react";

export default function CircleCollide() {
  const [circles, setCircles] = useState([]);
  const containerRef = useRef(null);

  // Check if two circles overlap
  function isColliding(c1, c2) {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < c1.r + c2.r;
  }

  function handleClick(e) {
    const rect = containerRef.current.getBoundingClientRect();

    const newCircle = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      r: 50,
      color: "blue"
    };

    setCircles(prevCircles => {
      const updatedCircles = [...prevCircles, newCircle];

      return updatedCircles.map(circle => {
        let hasCollision = false;

        for (let other of updatedCircles) {
          if (circle.id === other.id) continue;

          if (isColliding(circle, other)) {
            hasCollision = true;
            break;
          }
        }

        return {
          ...circle,
          color: hasCollision ? "red" : "blue"
        };
      });
    });
  }

  return (
    <div
      ref={containerRef}
      className="canvas"
      onClick={handleClick}
    >
      {circles.map(circle => (
        <div
          key={circle.id}
          className="circle"
          style={{
            left: circle.x - circle.r,
            top: circle.y - circle.r,
            width: circle.r * 2,
            height: circle.r * 2,
            background: circle.color
          }}
        />
      ))}
    </div>
  );
}
`,Hx=`.wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: sans-serif;
}

.canvas {
    position: relative;
    /* Critical for absolute positioning of children */
    width: 50vw;
    height: 80vh;
    border: 2px solid #333;
    background-color: #f0f0f0;
    cursor: crosshair;
    overflow: hidden;
}

.circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.6;
    /* See-through so we can spot overlaps easier */
    transition: background-color 0.3s ease;
    pointer-events: none;
    /* Let clicks pass through to canvas (optional) */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}`,Gx=`import { useState } from "react";

export default function ConnectFour({ rows = 6, cols = 7 }) {
  const WIN = 4;

  const createBoard = () =>
    Array.from({ length: rows }, () => Array(cols).fill(null));

  const [board, setBoard] = useState(createBoard);
  const [player, setPlayer] = useState("Y");
  const [winner, setWinner] = useState(null);

  // 4 base directions (horizontal, vertical, diagonals)
  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal \\
    [1, -1], // diagonal /
  ];

  const count = (board, r, c, dr, dc, player) => {
    let nr = r + dr;
    let nc = c + dc;
    let cnt = 0;

    while (
      nr >= 0 &&
      nc >= 0 &&
      nr < rows &&
      nc < cols &&
      board[nr][nc] === player
    ) {
      cnt++;
      nr += dr;
      nc += dc;
    }

    return cnt;
  };

  const checkWin = (board, r, c, player) => {
    for (let [dr, dc] of directions) {
      const total =
        1 +
        count(board, r, c, dr, dc, player) +
        count(board, r, c, -dr, -dc, player);

      if (total >= WIN) return true;
    }
    return false;
  };

  const dropCoin = (col) => {
    if (winner) return;

    const newBoard = board.map((row) => [...row]);

    // gravity
    for (let r = rows - 1; r >= 0; r--) {
      if (!newBoard[r][col]) {
        newBoard[r][col] = player;

        if (checkWin(newBoard, r, col, player)) {
          setWinner(player);
        } else {
          setPlayer((p) => (p === "Y" ? "R" : "Y"));
        }

        setBoard(newBoard);
        return;
      }
    }
  };

  const reset = () => {
    setBoard(createBoard());
    setPlayer("Y");
    setWinner(null);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>{winner ? \`Winner: \${winner}\` : \`Turn: \${player}\`}</h2>

      {/* column controls */}
      <div
        style={{
          marginBottom: 10,
          display: "flex",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {Array.from({ length: cols }).map((_, c) => (
          <button key={c} onClick={() => dropCoin(c)}>
            ↓
          </button>
        ))}
      </div>

      {/* board */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: \`repeat(\${cols}, 60px)\`,
          gap: 6,
          justifyContent: "center",
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={\`\${r}-\${c}\`}
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background:
                  cell === "Y" ? "yellow" : cell === "R" ? "red" : "#ddd",
              }}
            />
          )),
        )}
      </div>

      <button onClick={reset} style={{ marginTop: 20 }}>
        Reset
      </button>
    </div>
  );
}
`,Wx=`import { useState } from "react";

const data = [
  { id: 1, name: "Alice", age: 32, role: "Engineer", salary: 120000 },
  { id: 2, name: "Bob", age: 28, role: "Designer", salary: 90000 },
  { id: 3, name: "Carol", age: 40, role: "Manager", salary: 150000 },
  { id: 4, name: "Dave", age: 35, role: "Engineer", salary: 130000 },
  { id: 5, name: "Eve", age: 29, role: "Engineer", salary: 110000 },
  { id: 6, name: "Frank", age: 45, role: "Director", salary: 180000 },
  { id: 7, name: "Grace", age: 27, role: "Designer", salary: 85000 }
];

export default function App() {
  const [filterText, setFilterText] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const pageSize = 3;

  // 1. Filter
  const filtered = data.filter(row =>
    row.name.toLowerCase().includes(filterText.toLowerCase()) ||
    row.role.toLowerCase().includes(filterText.toLowerCase())
  );

  // 2. Sort
  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;

    if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // 3. Pagination
  const totalPages = Math.ceil(sorted.length / pageSize);
  const start = (page - 1) * pageSize;
  const paginated = sorted.slice(start, start + pageSize);

  // Handle sort click
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Reset page when filter changes
  const onFilterChange = (e) => {
    setFilterText(e.target.value);
    setPage(1);
  };

  return (
    <div className="dataTableWrapper">
      <h2>Employee Table</h2>

      <input
        placeholder="Filter by name or role"
        value={filterText}
        onChange={onFilterChange}
      />

      <table border="1" cellPadding={8}>
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key} onClick={() => handleSort(key)}>
                {key}
                {sortKey === key && (sortOrder === "asc" ? " ▲" : " ▼")}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginated.map((row) => (
            <tr key={row.id}>
              {Object.keys(row).map((key) => (
                <td key={key}>{row[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 10 }}>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages}
        </span>

        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
`,Kx=`import { useMemo, useRef, useState } from 'react'
import { debounce } from './debounce.js'

const DELAY_MS = 500

export default function DebounceDemo() {
  const [rawCount, setRawCount] = useState(0)
  const [debouncedCount, setDebouncedCount] = useState(0)

  // useRef + useMemo so the debounced wrapper survives re-renders. Recreating
  // it every render would reset its pending timer, and nothing would ever be
  // debounced.
  const bumpRef = useRef(() => setDebouncedCount((count) => count + 1))
  const bumpDebounced = useMemo(() => debounce(() => bumpRef.current(), DELAY_MS), [])

  const handleClick = () => {
    setRawCount((count) => count + 1)
    bumpDebounced()
  }

  return (
    <div>
      <button type="button" onClick={handleClick}>
        Click me fast
      </button>
      <p>
        Raw clicks: <b>{rawCount}</b>
      </p>
      <p>
        Debounced calls: <b>{debouncedCount}</b>
      </p>
      <p style={{ color: '#8b95a9', fontSize: 13 }}>
        The debounced counter fires once, {DELAY_MS}ms after you stop clicking.
      </p>
    </div>
  )
}
`,Vx=`/**
 * Postpone calling \`fn\` until \`delay\` ms have passed since the last call to
 * the returned wrapper. A burst of calls collapses into one invocation.
 */
export function debounce(fn, delay) {
  let timeoutId

  // A regular function (not an arrow) so \`this\` stays dynamic and can be
  // forwarded to fn -- otherwise obj.debounced() would lose its receiver.
  return function debounced(...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}
`,qx=`import { useRef, useState, useCallback } from "react";

const CANVAS_W = 680;
const CANVAS_H = 420;
const COLORS = ["#000000", "#e53935", "#1976d2", "#388e3c", "#f57c00", "#7b1fa2", "#ffffff"];

export default function App() {
  const canvasRef = useRef(null);
  const lastPos = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pen");   // "pen" | "eraser"
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(4);

  function getCanvasPos(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    // support touch events too
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  const startDraw = useCallback((e) => {
    e.preventDefault();
    setIsDrawing(true);
    lastPos.current = getCanvasPos(e);
  }, []);

  const draw = useCallback((e) => {
    e.preventDefault();
    if (!isDrawing || !lastPos.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const pos = getCanvasPos(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.lineWidth = tool === "eraser" ? 24 : size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    lastPos.current = pos;
  }, [isDrawing, tool, color, size]);

  const stopDraw = useCallback(() => {
    setIsDrawing(false);
    lastPos.current = null;
  }, []);

  function clearCanvas() {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  }

  function downloadCanvas() {
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  }

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", userSelect: "none" }}>
      <h2 style={{ marginBottom: 12 }}>Drawing Board</h2>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        {/* Tool buttons */}
        {["pen", "eraser"].map(t => (
          <button
            key={t}
            onClick={() => setTool(t)}
            style={{
              padding: "6px 16px", border: "none", borderRadius: 6, cursor: "pointer",
              background: tool === t ? "#1976d2" : "#eeeeee",
              color: tool === t ? "#fff" : "#333",
              fontWeight: tool === t ? 600 : 400,
              textTransform: "capitalize",
            }}
          >
            {t === "pen" ? "✏️ Pen" : "🧹 Eraser"}
          </button>
        ))}

        {/* Quick color palette */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {COLORS.map(c => (
            <div
              key={c}
              onClick={() => { setColor(c); setTool("pen"); }}
              style={{
                width: 24, height: 24, borderRadius: "50%", background: c, cursor: "pointer",
                border: color === c && tool === "pen" ? "3px solid #1976d2" : "2px solid #ccc",
                boxSizing: "border-box",
              }}
            />
          ))}
          {/* Custom color */}
          <input
            type="color"
            value={color}
            onChange={e => { setColor(e.target.value); setTool("pen"); }}
            style={{ width: 28, height: 28, cursor: "pointer", border: "none", padding: 0 }}
            title="Custom color"
          />
        </div>

        {/* Brush size */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#555" }}>Size: {size}px</span>
          <input
            type="range" min={1} max={30} value={size}
            onChange={e => setSize(Number(e.target.value))}
            style={{ width: 80 }}
          />
        </div>

        {/* Actions */}
        <button onClick={clearCanvas} style={{ padding: "6px 14px", background: "#ffebee", color: "#c62828", border: "1px solid #ef9a9a", borderRadius: 6, cursor: "pointer" }}>
          Clear
        </button>
        <button onClick={downloadCanvas} style={{ padding: "6px 14px", background: "#e8f5e9", color: "#2e7d32", border: "1px solid #a5d6a7", borderRadius: 6, cursor: "pointer" }}>
          Save PNG
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={{
          border: "2px solid #ccc",
          borderRadius: 8,
          cursor: tool === "eraser" ? "cell" : "crosshair",
          display: "block",
          background: "#ffffff",
          touchAction: "none",
        }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />

      <p style={{ marginTop: 8, fontSize: 12, color: "#aaa" }}>
        Draw with mouse or touch. Shift to eraser, or click Eraser button.
      </p>
    </div>
  );
}`,Yx=`import { useState } from "react";

// ---------------------------------------------------------------------------
// FileExplorer — recursive component, renders one node (file or folder)
// Props:
//   node           — current tree node { id, name, isFolder, items }
//   onDragStart    — called when this node starts being dragged
//   onDrop         — called when something is dropped ON this folder
//   draggedId      — id of the node currently being dragged (for visual hints)
// ---------------------------------------------------------------------------
export default function FileExplorer({ node, onDragStart, onDrop, draggedId }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);

  const isBeingDragged = node.id === draggedId;

  // --- Drag source handlers ---
  function handleDragStart(e) {
    e.stopPropagation(); // prevent parent nodes from also firing dragStart
    onDragStart(node.id);
  }

  // --- Drop target handlers (folders only) ---
  function handleDragOver(e) {
    if (!node.isFolder) return;
    e.preventDefault();  // required to allow drop
    e.stopPropagation();
    setIsDragOver(true);
  }

  function handleDragLeave(e) {
    e.stopPropagation();
    setIsDragOver(false);
  }

  function handleDrop(e) {
    if (!node.isFolder) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    onDrop(node.id); // tell parent: drop happened on this folder
  }

  const icon = node.isFolder ? (isOpen ? "📂" : "📁") : "📄";

  const className = [
    "tree-node",
    node.isFolder ? "folder" : "file",
    isBeingDragged ? "dragging" : "",
    isDragOver ? "drag-over" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <div
        className={className}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => node.isFolder && setIsOpen((prev) => !prev)}
      >
        <span className="node-icon">{icon}</span>
        <span className="node-name">{node.name}</span>
      </div>

      {/* Render children if folder is open */}
      {node.isFolder && isOpen && (
        <div className="children">
          {node.items.map((child) => (
            <FileExplorer
              key={child.id}
              node={child}
              onDragStart={onDragStart}
              onDrop={onDrop}
              draggedId={draggedId}
            />
          ))}
          {node.items.length === 0 && (
            <div className="empty-folder">empty folder</div>
          )}
        </div>
      )}
    </div>
  );
}
`,Qx=`import { useState } from "react";
import { initialTree } from "./data";
import { moveNode } from "./treeUtils";
import FileExplorer from "./FileExplorer";

// ---------------------------------------------------------------------------
// STATE DESIGN
// - tree: the full nested tree structure (single source of truth)
// - draggedId: id of the node currently being dragged (null when not dragging)
//
// WHY store only draggedId instead of the full dragged node?
// The node already lives in the tree — we don't need a copy.
// We just need to know WHICH node to move when drop fires.
// ---------------------------------------------------------------------------

export default function Solution() {
  const [tree, setTree] = useState(initialTree);
  const [draggedId, setDraggedId] = useState(null);

  // Called when user starts dragging any node
  function handleDragStart(id) {
    setDraggedId(id);
  }

  // Called when user drops onto a folder
  function handleDrop(destinationFolderId) {
    if (!draggedId) return;

    // moveNode handles all validation (can't drop into self, can't drop into descendant)
    const updatedTree = moveNode(tree, draggedId, destinationFolderId);

    if (updatedTree) {
      setTree(updatedTree);
    }

    setDraggedId(null);
  }

  // Reset draggedId if drag ends without a valid drop (e.g. dropped outside)
  function handleDragEnd() {
    setDraggedId(null);
  }

  return (
    <div className="app" onDragEnd={handleDragEnd}>
      <h2>File Explorer</h2>
      <p className="hint">Drag any file or folder and drop it onto a folder to move it.</p>
      <div className="explorer-container">
        <FileExplorer
          node={tree}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          draggedId={draggedId}
        />
      </div>
    </div>
  );
}
`,Xx=`export const initialTree = {
  id: "root",
  name: "root",
  isFolder: true,
  items: [
    {
      id: "public",
      name: "public",
      isFolder: true,
      items: [
        { id: "index.html", name: "index.html", isFolder: false, items: [] },
        { id: "robots.txt", name: "robots.txt", isFolder: false, items: [] },
      ],
    },
    {
      id: "src",
      name: "src",
      isFolder: true,
      items: [
        {
          id: "components",
          name: "components",
          isFolder: true,
          items: [
            { id: "Header.js", name: "Header.js", isFolder: false, items: [] },
            { id: "Footer.js", name: "Footer.js", isFolder: false, items: [] },
          ],
        },
        { id: "App.js", name: "App.js", isFolder: false, items: [] },
        { id: "index.js", name: "index.js", isFolder: false, items: [] },
      ],
    },
    { id: "package.json", name: "package.json", isFolder: false, items: [] },
    { id: "README.md", name: "README.md", isFolder: false, items: [] },
  ],
};
`,Zx=`.app {
  font-family: monospace;
  padding: 24px;
  max-width: 480px;
}

.app h2 {
  margin-bottom: 4px;
}

.hint {
  font-size: 12px;
  color: #888;
  margin-bottom: 16px;
}

.explorer-container {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px;
  background: #fafafa;
}

/* Each tree node row */
.tree-node {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: grab;
  user-select: none;
  border: 2px solid transparent;
  transition: background 0.1s, border-color 0.1s;
}

.tree-node:hover {
  background: #f0f0f0;
}

/* Visual feedback: node being dragged */
.tree-node.dragging {
  opacity: 0.4;
}

/* Visual feedback: valid drop target */
.tree-node.drag-over {
  background: #e8f4fd;
  border-color: #4a9eed;
}

.node-icon {
  font-size: 14px;
}

.node-name {
  font-size: 13px;
}

/* Indent children */
.children {
  padding-left: 20px;
  border-left: 1px dashed #ddd;
  margin-left: 10px;
}

.empty-folder {
  font-size: 11px;
  color: #aaa;
  padding: 2px 8px;
  font-style: italic;
}
`,Jx=`// ---------------------------------------------------------------------------
// Tree Utilities
// All functions are pure — they return a new tree, never mutate the original.
// The tree shape: { id, name, isFolder, items: [] }
// ---------------------------------------------------------------------------

// Remove a node by id from the tree, return [newTree, removedNode]
// We need the removed node so we can insert it at the new location.
export function removeNode(tree, targetId) {
  let removed = null;

  function recurse(node) {
    if (!node.isFolder) return node;

    const index = node.items.findIndex((item) => item.id === targetId);

    if (index !== -1) {
      // Found the node in this folder's direct children — remove it
      removed = node.items[index];
      return {
        ...node,
        items: node.items.filter((item) => item.id !== targetId),
      };
    }

    // Not a direct child — search deeper
    return {
      ...node,
      items: node.items.map((item) => recurse(item)),
    };
  }

  const newTree = recurse(tree);
  return [newTree, removed];
}

// Insert a node as a child of the folder with destinationId
export function insertNode(tree, destinationId, nodeToInsert) {
  if (tree.id === destinationId) {
    // This is the target folder — append the node to its items
    return {
      ...tree,
      items: [...tree.items, nodeToInsert],
    };
  }

  if (!tree.isFolder) return tree;

  return {
    ...tree,
    items: tree.items.map((item) => insertNode(item, destinationId, nodeToInsert)),
  };
}

// Move a node: remove from old location, insert into new folder
// Returns the updated tree, or null if the move is invalid.
export function moveNode(tree, draggedId, destinationFolderId) {
  // Guard: can't drop a folder into itself or its own descendant
  if (draggedId === destinationFolderId) return null;
  if (isDescendant(tree, draggedId, destinationFolderId)) return null;

  const [treeWithoutDragged, removed] = removeNode(tree, draggedId);
  if (!removed) return null;

  return insertNode(treeWithoutDragged, destinationFolderId, removed);
}

// Check if potentialDescendantId is inside ancestorId
// Used to prevent dropping a folder into its own child
function isDescendant(tree, ancestorId, potentialDescendantId) {
  function findAncestor(node) {
    if (node.id !== ancestorId) return null;
    return node; // found the ancestor
  }

  function searchUnder(node, targetId) {
    if (node.id === targetId) return true;
    if (!node.isFolder) return false;
    return node.items.some((item) => searchUnder(item, targetId));
  }

  // Find the ancestor node first, then check if potentialDescendant is under it
  function findAndCheck(node) {
    if (node.id === ancestorId) {
      return searchUnder(node, potentialDescendantId);
    }
    if (!node.isFolder) return false;
    return node.items.some((item) => findAndCheck(item));
  }

  return findAndCheck(tree);
}
`,eS=`import { useState } from "react";

export function Folder({ explorerData, handleInsertNode }) {
  const [expanded, setExpanded] = useState(false);
  const [createMode, setCreateMode] = useState(null); 
  // null | "folder" | "file"

  const isFolder = explorerData.isFolder;

  const icon = isFolder
    ? expanded ? "📂" : "📁"
    : "📄";

  const handleToggle = () => {
    setExpanded(prev => !prev);
  };

  const handleAdd = (e, type) => {
    e.stopPropagation();
    setExpanded(true);
    setCreateMode(type);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      handleInsertNode(
        explorerData.id,
        e.target.value,
        createMode === "folder"
      );
      setCreateMode(null);
    }
  };

  const handleBlur = () => {
    setCreateMode(null);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "350px",
          cursor: "pointer"
        }}
        onClick={handleToggle}
      >
        <div style={{ display: "flex", gap: 10 }}>
          <span>{icon}</span>
          <span>{explorerData.name}</span>
        </div>

        {isFolder && (
          <div style={{ display: "flex", gap: 5 }}>
            <button onClick={(e) => handleAdd(e, "folder")}>
              Folder +
            </button>
            <button onClick={(e) => handleAdd(e, "file")}>
              File +
            </button>
          </div>
        )}
      </div>

      {expanded && (
        <div>
          {createMode && (
            <div style={{ display: "flex", gap: 5, paddingLeft: 20 }}>
              <span>{createMode === "folder" ? "📁" : "📄"}</span>
              <input
                type="text"
                autoFocus
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
              />
            </div>
          )}

          {explorerData.items.map((item) => (
            <div key={item.id} style={{ padding: "5px 10px" }}>
              <Folder
                explorerData={item}
                handleInsertNode={handleInsertNode}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
`,nS=`import { useEffect, useState } from "react";

import { data } from "./data";
import { Folder } from "./Folder";

export default function App() {
  const [explorerData, setExplorerData] = useState(data);

  const insertNode = (folderId, itemName, isFolder) => {
    const copyNode = structuredClone(explorerData);

    function traverse(node) {
      if (node.id === folderId && node.isFolder) {
        node.items.unshift({
          id: Date.now(),
          name: itemName,
          isFolder,
          items: [],
        });

        return true; // stop traversal
      }

      if (!node.items) return false;

      for (const child of node.items) {
        if (traverse(child)) {
          return true;
        }
      }

      return false;
    }

    traverse(copyNode);

    return copyNode;
  };

  const handleInsertNode = (folderId, item, isFolder) => {
    const finalTree = insertNode(folderId, item, isFolder);
    setExplorerData(finalTree);
  };

  return (
    <Folder explorerData={explorerData} handleInsertNode={handleInsertNode} />
  );
}
`,tS=`export const data = {
  id: "1",
  name: "root",
  isFolder: true,
  items: [
    {
      id: "2",
      name: "public",
      isFolder: true,
      items: [
        { id: "3", name: "index.html", isFolder: false, items: [] },
        { id: "4", name: "robots.txt", isFolder: false, items: [] },
      ],
    },
    {
      id: "5",
      name: "src",
      isFolder: true,
      items: [
        {
          id: "6",
          name: "components",
          isFolder: true,
          items: [{ id: "7", name: "Header.js", isFolder: false, items: [] }],
        },
        { id: "8", name: "App.js", isFolder: false, items: [] },
      ],
    },
  ],
};
`,rS=`
import { useEffect, useState } from "react";

export default function App() {
  const [order, setOrder] = useState([]);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const [config] = useState([
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ]);

  // Dynamically calculate the total number of interactive cells (where value is 1)
  const targetCount = config.flat().filter((val) => val === 1).length;

  const handleDeactivatingCells = () => {
    setIsDeactivating(true);

    const timer = setInterval(() => {
      setOrder((prev) => {
        const newOrder = [...prev];
        newOrder.pop();
        if (newOrder.length == 0) {
          clearInterval(timer);
        }
        return newOrder;
      });
    }, 300);
  };

  const handleClick = (ev, index) => {
    if (isDeactivating || order.includes(index)) return;
    const newOrder = [...order, index];
    setOrder(newOrder);

    if (newOrder.length === targetCount) {
      handleDeactivatingCells();
    }
  };

  useEffect(() => {
    console.log(order);
  }, [order]);

  return (
    <div className="wrapper">
      <div
        className="gridWrapper"
        style={{
          gridTemplateColumns: \`repeat(\${config[0].length}, 1fr)\`,
        }}
      >
        {config.flat().map((item, index) => {
          const isActive = order.includes(index);
          return item === 0 ? (
            <div key={index}></div>
          ) : (
            <div
              key={index}
              className="gridItem"
              style={{ background: isActive ? "green" : "white" }}
              onClick={(ev) => handleClick(ev, index)}
            >
              {index + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}
`,iS=`.App {
    font-family: sans-serif;
    text-align: center;
}

.wrapper {
    max-width: 400px;
}

.gridWrapper {
    display: grid;
    gap: 20px;
}

.gridItem {
    display: flex;
    width: 100px;
    height: 100px;
    border: 1px solid #ccc;
    justify-content: center;
    text-align: center;
    align-items: center;
}`,oS=`import React, { useState, useRef, useEffect } from "react"; // Import React and hooks

const GRID_SIZE = 5; // 10x10 grid
const CELL_SIZE = 40; // 20px x 20px

export default function App() {
  const [selecting, setSelecting] = useState(false); // Track if user is dragging
  const [start, setStart] = useState(null); // Selection start {row, col}
  const [end, setEnd] = useState(null); // Selection end {row, col}
  const [selected, setSelected] = useState([]); // Array of selected cell keys
  const gridRef = useRef(null); // Ref to grid for mouse position
  const didDragRef = useRef(false);

  // Helper to get cell from mouse event
  const getCellFromEvent = (e) => {
    const rect = gridRef.current.getBoundingClientRect(); // Get grid position
    const x = e.clientX - rect.left; // X relative to grid
    const y = e.clientY - rect.top; // Y relative to grid
    const col = Math.floor(x / CELL_SIZE); // Column index
    const row = Math.floor(y / CELL_SIZE); // Row index
    return { row, col };
  };

  // Mouse down: start selection
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    didDragRef.current = false;
    const cell = getCellFromEvent(e);
    setStart(cell);
    setEnd(cell);
    setSelecting(true);
    setSelected([]); // Reset previous selection
  };

  // Mouse move: update selection
  const handleMouseMove = (e) => {
    if (!selecting) return;
    didDragRef.current = true;
    const cell = getCellFromEvent(e);
    setEnd(cell);
  };

  // Mouse up: finalize selection
  const handleMouseUp = () => {
    if (!selecting) return;
    setSelecting(false);
    if (!start || !end) return;
    // Calculate selected cells
    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);
    const minCol = Math.min(start.col, end.col);
    const maxCol = Math.max(start.col, end.col);
    const newSelected = [];
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
          newSelected.push(\`\${r},\${c}\`);
        }
      }
    }
    setSelected(newSelected);
  };

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  // Click anywhere resets selection
  const handleGridClick = (e) => {
    if (didDragRef.current) return;
    if (!selecting) {
      setSelected([]);
      setStart(null);
      setEnd(null);
    }
  };

  // Render grid cells
  const cells = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const key = \`\${row},\${col}\`;
      const isSelected = selected.includes(key);
      cells.push(
        <div
          key={key}
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            border: "1px solid #000",
            boxSizing: "border-box",
            background: isSelected ? "purple" : "#fff",
            display: "inline-block",
          }}
        />,
      );
    }
  }

  return (
    <div
      ref={gridRef}
      style={{
        width: GRID_SIZE * CELL_SIZE,
        height: GRID_SIZE * CELL_SIZE,
        userSelect: "none",
        position: "relative",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleGridClick}
    >
      <div
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {cells}
      </div>
      {/* Optional: Draw selection rectangle */}
      {selecting && start && end && (
        <div
          style={{
            position: "absolute",
            left: Math.min(start.col, end.col) * CELL_SIZE,
            top: Math.min(start.row, end.row) * CELL_SIZE,
            width: (Math.abs(end.col - start.col) + 1) * CELL_SIZE,
            height: (Math.abs(end.row - start.row) + 1) * CELL_SIZE,
            background: "rgba(128,0,128,0.2)",
            border: "1px dashed purple",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}
    </div>
  );
}
`,sS=`
export default function App(){
    return (
        <div class="page">
            <header class="header">Header</header>

            <div class="body">
                <nav class="left">Left Sidebar</nav>
                <main class="content">Main Content</main>
                <aside class="right">Right Sidebar</aside>
            </div>

            <footer class="footer">Footer</footer>
        </div>

    )
}`,aS=`* {
    box-sizing: border-box;
    margin: 0;
}

.page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.header,
.footer {
    background: #333;
    color: white;
    padding: 16px;
    text-align: center;
}

.body {
    flex: 1;
    display: flex;
}

.left,
.right {
    width: 200px;
    background: #f4f4f4;
    padding: 16px;
}

.content {
    flex: 1;
    background: #fff;
    padding: 16px;
}`,lS=`import {useState, useRef, useEffect} from "react"


const fetchPosts = (page) =>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            const newItems = new Array(20);
            for(let i=0; i<20; i++){
                newItems[i] = {
                    id: Math.random() + Date.now(),
                    title: \`This is post #\${page * 20 + i+1} - this is the content\`
                }
            }
            resolve(newItems)
        }, 1000)
    })
    
}

const InfiniteScroll = () => {
    const [data, setData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const observerTarget = useRef(null);

    useEffect(()=>{
        const loadData = async()=>{
            setIsLoading(true);
            const newItems = await fetchPosts(page);
            setData((prev) => [...prev, ...newItems]);
            setIsLoading(false)

            if(newItems.length === 0) setHasMore(false);
        }
        loadData();
    }, [page])


    useEffect(()=>{
        const observer = new IntersectionObserver((entries)=>{
            if(entries[0].isIntersecting && !isLoading && hasMore){
                setPage((prev)=> prev+1);
            }
        }, {threshold: 1.0})

        if(observerTarget.current){
            observer.observe(observerTarget.current)
        }

        return () =>{
            if(observerTarget.current){
                observer.unobserve(observerTarget.current);
            }
        }
    }, [isLoading, hasMore]);


    return(
        <div style={{maxWidth: "400px", margin: "0 auto", padding: "20px"}}>
            <ul>
                {data.map((item)=>{
                    return (
                        <li key={item.id} style={{padding: "20px", border: "1px solid #ccc", marginBottom: "10px", background: "#f7f7f7"}}>
                            {item.title}
                        </li>
                    )
                })}
            </ul>

            {hasMore && (
                <div ref={observerTarget} style={{height: "50px", textAlign: "center", padding: "10px", fontWeight: "bold"}}>
                    {isLoading ? "Loading" : "Scroll Down to load"}
                </div>
            )}
        </div>
    )
}

export default InfiniteScroll;`,cS=`import { useState } from "react";

const initialBoard = {
  todo: [
    { id: 1, text: "Design UI" },
    { id: 2, text: "Write API" },
  ],
  inProgress: [
    { id: 3, text: "Build Kanban" },
  ],
  done: [
    { id: 4, text: "Setup Repo" },
  ],
};

const columns = [
  { key: "todo", title: "Todo" },
  { key: "inProgress", title: "In Progress" },
  { key: "done", title: "Done" },
];

export default function KanbanBoard() {
  const [board, setBoard] = useState(initialBoard);
  const [dragged, setDragged] = useState(null);

  // ---------------- DRAG HANDLERS ----------------

  const onDragStart = (colKey, index) => {
    setDragged({ colKey, index });
  };

  const onDrop = (targetColKey, targetIndex) => {
    if (!dragged) return;

    const { colKey: sourceCol, index: sourceIndex } = dragged;

    if (sourceCol === targetColKey && sourceIndex === targetIndex) return;

    setBoard((prev) => {
      const next = { ...prev };

      const sourceList = [...next[sourceCol]];
      const [moved] = sourceList.splice(sourceIndex, 1);

      const targetList = [...next[targetColKey]];
      targetList.splice(targetIndex, 0, moved);

      next[sourceCol] = sourceList;
      next[targetColKey] = targetList;

      return next;
    });

    setDragged(null);
  };

  const onDragOver = (e) => e.preventDefault();

  // ---------------- CRUD ----------------

  const addCard = (colKey) => {
    const text = prompt("Card title?");
    if (!text) return;

    setBoard((prev) => ({
      ...prev,
      [colKey]: [...prev[colKey], { id: Date.now(), text }],
    }));
  };

  const deleteCard = (colKey, index) => {
    setBoard((prev) => ({
      ...prev,
      [colKey]: prev[colKey].filter((_, i) => i !== index),
    }));
  };

  // ---------------- UI ----------------

  return (
    <div className="kanban">
      {columns.map((col) => (
        <div
          key={col.key}
          className="column"
          onDragOver={onDragOver}
        >
          <h3>{col.title}</h3>

          {board[col.key].map((card, index) => (
            <div
              key={card.id}
              className="card"
              draggable
              onDragStart={() => onDragStart(col.key, index)}
              onDrop={() => onDrop(col.key, index)}
            >
              {card.text}
              <button
                className="delete"
                onClick={() => deleteCard(col.key, index)}
              >
                ✕
              </button>
            </div>
          ))}

          <button className="add" onClick={() => addCard(col.key)}>
            + Add
          </button>
        </div>
      ))}
    </div>
  );
}
`,uS=`.kanban {
    display: flex;
    gap: 16px;
    padding: 20px;
    font-family: system-ui, sans-serif;
}

.column {
    background: #f3f4f6;
    padding: 12px;
    border-radius: 8px;
    width: 260px;
    min-height: 300px;
}

.column h3 {
    margin-bottom: 10px;
}

.card {
    background: white;
    padding: 10px;
    border-radius: 6px;
    margin-bottom: 8px;
    cursor: grab;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card:active {
    cursor: grabbing;
}

.delete {
    border: none;
    background: transparent;
    cursor: pointer;
}

.add {
    width: 100%;
    margin-top: 8px;
}`,dS=`import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

export default function Modal({
  isOpen,
  title,
  children,
  onClose,
  onPrimary,
  primaryText = "Save",
  secondaryText = "Cancel",
  showClose = true,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    const handleMouseDown = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="overlay">
      <div className="modal" ref={modalRef}>
        {showClose && (
          <button className="close" onClick={onClose}>×</button>
        )}

        <h3>{title}</h3>

        <div className="content">{children}</div>

        <div className="actions">
          <button onClick={onClose}>{secondaryText}</button>
          <button onClick={onPrimary}>{primaryText}</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
`,pS=`import { useState } from "react";
import Modal from "./Modal";

export default function App() {
  const [modal, setModal] = useState(null);
  // modal = { priority, title, content, onPrimary, primaryText }

  const openModal = (newModal) => {
    setModal((current) => {
      if (!current || newModal.priority > current.priority) {
        return newModal;
      }
      return current;
    });
  };

  const closeModal = () => setModal(null);

  // Low priority: Settings modal
  const openSettings = () => {
    openModal({
      title: "Settings",
      priority: 1,
      content: (
        <div>
          <p>Configure your preferences:</p>
          <label>
            <input type="checkbox" /> Enable notifications
          </label>
          <br />
          <button
            style={{ marginTop: 10, color: "red" }}
            onClick={openDeleteConfirm}
          >
            Delete Account
          </button>
        </div>
      ),
      primaryText: "Save",
      onPrimary: () => {
        alert("Settings saved!");
        closeModal();
      },
    });
  };

  // High priority: Confirmation modal (triggered from within Settings)
  const openDeleteConfirm = () => {
    openModal({
      title: "⚠️ Confirm Delete",
      priority: 10,
      content: "Are you sure you want to delete your account? This cannot be undone.",
      primaryText: "Delete",
      onPrimary: () => {
        alert("Account deleted!");
        closeModal();
      },
    });
  };

  // Simulate async error (highest priority)
  const simulateError = () => {
    setTimeout(() => {
      openModal({
        title: "🚨 Connection Lost",
        priority: 100,
        content: "Unable to connect to server. Please check your internet connection.",
        primaryText: "Retry",
        onPrimary: () => {
          alert("Retrying...");
          closeModal();
        },
      });
    }, 2000);
    alert("Error will appear in 2 seconds (even if another modal is open)");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Modal Priority Demo</h2>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={openSettings}>Open Settings (Priority: 1)</button>
        <button onClick={simulateError}>Simulate Error in 2s (Priority: 100)</button>
      </div>
      <p style={{ marginTop: 10, color: "#666" }}>
        Try: Open Settings → Click "Delete Account" → High priority modal replaces it
      </p>

      <Modal
        isOpen={!!modal}
        title={modal?.title}
        onClose={closeModal}
        onPrimary={modal?.onPrimary || closeModal}
        primaryText={modal?.primaryText}
      >
        {modal?.content}
      </Modal>
    </div>
  );
}
`,fS=`/* Overlay - semi-transparent backdrop */
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* Modal container */
.modal {
    background: white;
    padding: 24px;
    width: 100%;
    max-width: 420px;
    position: relative;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideIn 0.25s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* Modal title */
.modal h3 {
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    padding-right: 30px;
}

/* Modal content area */
.content {
    color: #4a4a4a;
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 24px;
}

/* Close button */
.close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 28px;
    height: 28px;
    border: none;
    background: #f5f5f5;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
}

.close:hover {
    background: #e5e5e5;
    color: #333;
}

.close:active {
    transform: scale(0.95);
}

/* Action buttons container */
.actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 8px;
}

/* Base button styles */
.actions button {
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s ease;
    border: none;
}

/* Secondary button (Cancel) */
.actions button:first-child {
    background: #f5f5f5;
    color: #333;
}

.actions button:first-child:hover {
    background: #e5e5e5;
}

/* Primary button (Confirm/Save) */
.actions button:last-child {
    background: #2563eb;
    color: white;
}

.actions button:last-child:hover {
    background: #1d4ed8;
}

.actions button:active {
    transform: scale(0.98);
}

/* Danger variant for delete actions */
.modal.danger .actions button:last-child {
    background: #dc2626;
}

.modal.danger .actions button:last-child:hover {
    background: #b91c1c;
}

/* Responsive */
@media (max-width: 480px) {
    .modal {
        margin: 16px;
        max-width: calc(100% - 32px);
    }

    .actions {
        flex-direction: column-reverse;
    }

    .actions button {
        width: 100%;
    }
}`,hS=`import {useState} from "react";
export function CommentsItem({comment, onReply, onEdit, onDelete}){
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);
    const [replyText, setReplyText] = useState("")

    return(
        <div style={{marginLeft: "20px", marginTop: 12}}>
            {isEditing ? <>
                <input type="text" value={editText} onChange={(e)=>setEditText(e.target.value)}/>
                <button onClick={()=>{onEdit(comment, editText); setIsEditing(false)}}>Submit</button>
            </> : <span>
                    <span>{comment.text}</span>
                    <br/>
                    author: <b>{comment.author}</b>
                </span>}
                <div>
                    <button onClick={()=>{setIsReplying(v=> !v)}}>Reply</button>
                    <button onClick={()=>{setIsEditing(v=> !v)}}>Edit</button>
                    <button onClick={()=>{onDelete(comment)}}>Delete</button>
                </div>
                {isReplying && (
                    <div style={{marginTop: 0}}>
                        <input type="text" value={replyText} onChange={(ev)=>setReplyText(ev.target.value)} placeholder="write a reply..."/>
                        <button onClick={()=> {onReply(comment, replyText); setReplyText(""); setIsReplying(false)}}>Save</button>
                    </div>

                )}

                {comment?.children?.map(child=>{
                    return <CommentsItem key={child.id} comment={child} onReply={onReply} onDelete={onDelete} onEdit={onEdit}/>
                })}
        </div>

    )
}`,gS=`export function addReply(tree, item, newComment){
    return tree.map((node)=>{
        if(node.id == item.id){
            return {...node, children: [...node.children, newComment ]}
        }
        return {...node, children: addReply(node.children, item, newComment)}
    })
}

export function updateComment(tree, item, text){
    return tree.map((node)=>{
        if(node.id == item.id){
            return {...node, text: text}
        }
        return {...node, children: updateComment(node.children, item, text)}
    })
}

export function deleteComment(tree, id){
    return tree.filter((node)=> node.id!==id).map((node)=>({...node, children: deleteComment(node.children, id)}))
}`,mS=`import { useCallback } from "react";
import { CommentsItem } from "./CommentItems";
import { addReply, updateComment, deleteComment } from "./CommentsHelper";
import {initialComments} from "./data"
import {useState} from "react";

export default function CommentsSection(){
    const [commentsData, setCommentsData] = useState(initialComments);

    const handleReply = useCallback((item, text) =>{
        if(!text.trim()) return;
        const newComment = {
            id: Date.now()+Math.random()*10,
            author: "You",
            text: text,
            children: []
        }
        setCommentsData(prev => addReply(prev, item, newComment))

    }, [])

    const handleEdit = useCallback((item, text) =>{
        setCommentsData(prev => updateComment(prev, item, text))
    }, [])

    const handleDelete = useCallback((item) =>{
        setCommentsData(prev=> deleteComment(prev, item.id))
    }, [])


    return(<div style={{padding: 16, maxWidth: "100%"}}>
        {commentsData.map((item)=>{
            return <CommentsItem onEdit={handleEdit} onDelete={handleDelete} onReply={handleReply} key={item.id} comment={item}/>
        })}
    </div>)
}`,yS=`import CommentsSection from "./CommentsSection";

export default function App(){
  return <CommentsSection/>
}`,bS=`export const initialComments = [
  {
    id: 1,
    author: "Alice",
    text: "This is the first comment",
    children: [
      {
        id: 2,
        author: "Bob",
        text: "This is a reply",
        children: [],
      },
    ],
  },
];
`,vS=`import { useState, useRef } from "react";

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState([]);
  const timers = useRef({}); // id -> timeout

  const showNotification = (message, type = "info", ttl = 3000) => {
    const id = Date.now();

    const notification = {
      id,
      message,
      type,
    };

    setNotifications((prev) => [...prev, notification]);

    timers.current[id] = setTimeout(() => {
      removeNotification(id);
    }, ttl);
  };

  const removeNotification = (id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];

    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );
  };

  return (
    <div className="container">
      <h2>🔔 Notification System</h2>

      <div className="buttons">
        <button onClick={() => showNotification("Success!", "success")}>
          Success
        </button>
        <button onClick={() => showNotification("Error occurred", "error")}>
          Error
        </button>
        <button onClick={() => showNotification("Info message", "info")}>
          Info
        </button>
      </div>

      <div className="toast-container">
        {notifications.map((n) => (
          <div key={n.id} className={\`toast \${n.type}Bg\`}>
            <span>{n.message}</span>
            <button onClick={() => removeNotification(n.id)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
`,wS=`.buttons{
    gap: 10px;
    display: flex
}
.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;

    display: flex;
    flex-direction: column;
    gap: 10px;

    z-index: 9999;
    pointer-events: none;
    /* optional */
}

.toast {
    pointer-events: auto;

    width: 280px;
    max-width: 320px;

    padding: 12px 14px;
    border-radius: 6px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    font-size: 14px;
    color: white;

    box-sizing: border-box;
}
.toast.successBg {
    background: #22c55e;
}

.toast.errorBg {
    background: #ef4444;
}

.toast.infoBg {
    background: #3b82f6;
}

.toast button {
    background: transparent;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
}`,xS=`import { useRef, useState } from "react";

const OTP_LENGTH = 6;

export default function App() {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [verified, setVerified] = useState(false);
  const inputs = useRef([]);

  function handleChange(index, value) {
    if (!/^\\d*$/.test(value)) return; // digits only
    const next = [...otp];
    next[index] = value.slice(-1); // keep last char if browser fires with 2 chars
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1].focus();
    }
  }

  // Backspace on an empty box → focus previous box
  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  }

  // Paste: spread digits across boxes starting at focused box
  function handlePaste(e) {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\\D/g, "")
      .slice(0, OTP_LENGTH);
    const next = [...otp];
    for (let i = 0; i < digits.length; i++) next[i] = digits[i];
    setOtp(next);
    const lastFilled = Math.min(digits.length, OTP_LENGTH - 1);
    inputs.current[lastFilled].focus();
  }

  function handleVerify() {
    setVerified(true);
    setTimeout(() => setVerified(false), 2000);
  }

  function handleClear() {
    setOtp(Array(OTP_LENGTH).fill(""));
    setVerified(false);
    inputs.current[0].focus();
  }

  const value = otp.join("");
  const isComplete = value.length === OTP_LENGTH;

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 4 }}>OTP Verification</h2>
      <p style={{ color: "#666", marginBottom: 32 }}>
        Enter the 6-digit code sent to <strong>+91 98765 43210</strong>
      </p>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 28 }}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => (inputs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={handlePaste}
            style={{
              width: 52,
              height: 60,
              fontSize: 26,
              textAlign: "center",
              border: \`2px solid \${digit ? "#1976d2" : "#ccc"}\`,
              borderRadius: 10,
              outline: "none",
              transition: "border-color 0.15s",
              color: "#1a1a1a",
            }}
          />
        ))}
      </div>

      {verified ? (
        <p style={{ color: "#2e7d32", fontWeight: 600, fontSize: 18, marginBottom: 16 }}>
          Verified successfully!
        </p>
      ) : (
        <button
          onClick={handleVerify}
          disabled={!isComplete}
          style={{
            padding: "12px 40px",
            fontSize: 16,
            background: isComplete ? "#1976d2" : "#e0e0e0",
            color: isComplete ? "#fff" : "#9e9e9e",
            border: "none",
            borderRadius: 8,
            cursor: isComplete ? "pointer" : "not-allowed",
            marginBottom: 12,
            display: "block",
            width: "100%",
          }}
        >
          Verify OTP
        </button>
      )}

      <button
        onClick={handleClear}
        style={{
          background: "none",
          border: "none",
          color: "#1976d2",
          cursor: "pointer",
          fontSize: 14,
          textDecoration: "underline",
        }}
      >
        Clear
      </button>

      <p style={{ marginTop: 24, color: "#999", fontSize: 13 }}>
        Didn't receive it?{" "}
        <span
          style={{ color: "#1976d2", cursor: "pointer" }}
          onClick={() => alert("OTP resent!")}
        >
          Resend OTP
        </span>
      </p>
    </div>
  );
}`,SS=`import { useEffect, useState } from "react";

export default function App() {
  const [options, setOptions] = useState([
    { id: 1, vote: 0, label: "Blogs", color: "green" },
    { id: 2, vote: 0, label: "Forums", color: "red" },
    { id: 3, vote: 0, label: "Photos", color: "blue" },
    { id: 4, vote: 0, label: "Docs", color: "orange" },
  ]);
  const MAX_HEIGHT = 460;

  const totalSum = options.reduce((sum, o) => sum + o.vote, 0);

  const handleClick = (item) => {
    setOptions((prev) => {
      return prev.map((option) => {
        if (option.id === item.id) {
          return { ...option, vote: option.vote + 1 };
        } else {
          return option;
        }
      });
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 10,
          display: "flex",
        }}
      >
        {options.map((item) => {
          const percentage =
            totalSum === 0 ? 0 : Math.round((item.vote / totalSum) * 100);
          return (
            <div style={{ flexDirection: "column", gap: 10, display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  background: "#d7d7d7",
                  height: MAX_HEIGHT,
                  width: 50,
                  alignItems: "flex-end",
                }}
              >
                <div
                  style={{
                    background: item.color,
                    height: \`\${percentage}%\`,
                    width: "100%",
                  }}
                ></div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <label>{\`\${percentage}%\`}</label>
                <button onClick={() => handleClick(item)}>Vote</button>
                <label>{item.label}</label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
`,kS=`import { useState } from "react";
import ProgressBar from "./progressBar";

export default function ProgressManager(){
  const LIMIT = 3;
  const [bars, setBars] = useState([Date.now()])
  const [isPaused, setIsPaused] = useState(true);
  const [finishCount, setFinnishCount] = useState(0);

  const togglePause = () =>{
    setIsPaused((prev)=> !prev);
  }

  const addBar = ()=>{
    setBars((prev)=> [...prev, Date.now() + Math.random()])
  }

  const reset = () =>{
    setBars([Date.now()]);
    setFinnishCount(0);
    setIsPaused(true);
  }

  const handleComplete = (index) =>{
    if(index === finishCount){
      setFinnishCount(prev => prev+1)
    }
  }




  return(
    <div style={{maxWidth: 400, margin: "20px auto"}}>
      <div style={{display: "flex", gap: 10, marginBottom: 20}}>
        <button onClick={togglePause}>{isPaused ? "Start" : "Pause"}</button>
        <button onClick={addBar}>Add</button>
        <button onClick={reset}>Reset</button>
      </div>

      
      <>
        {bars.map((id, index)=>{
          const isActive = index >= finishCount && index < finishCount+LIMIT
          return (
            <ProgressBar
              key={id}
              isActive={isActive}
              isPaused={isPaused}
              onComplete={()=> handleComplete(index)}
            />
          )
        })}
      </>
    </div>
  )
}`,ES=`import { useState, useEffect } from "react";

export default function ProgressBar({isActive, isPaused, onComplete}){
  const [progress, setProgress] = useState(0);

useEffect(()=>{
    if(!isActive || isPaused || progress >= 100) return;
    const timer = setTimeout(()=>{
        setProgress((prev) =>{
            if(prev >= 100){
                clearTimeout(timer);
                return;
            }
            return prev+1
        })
    }, 20)
    return () => clearTimeout(timer)
}, [isActive, isPaused, progress])

useEffect(() =>{
    if(progress >= 100){
        onComplete()
    }
}, [progress, onComplete])


  return(
    <div style={{height: 20, background: "#e0e0e0", margin: "10px 0", borderRadius: 5, overflow: 'hidden'}}>
      <div style={{
        height: "20px",
        width: \`\${progress}%\`,
        background: progress >= 100 ? "green" : "#2196f3",
        transition: "width 20ms linear"
      }}></div>
    </div>
  )
}`,_S=`import {useState} from "react";

function PromiseProgress(){
    return new Promise((resolve, reject)=>{
        const duration = Math.random() * 3000 + 500;

        setTimeout(()=>{
            if(Math.random() > .7){
                reject(\`\${name} Failed\`)
            } else{
                resolve(\`\${name} Success\`)
            }
        }, duration)
    })
}


export default  function App(){
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState([]);
    const [isRunning, setIsRunning] = useState(false);

    const TOTAL_NUMBERS = 5;

    const serviceName = ["Auth", "Payment", "User Profile", "Notifications", "Analytics"];

    

    const handleStart = async () =>{
        setIsRunning(true);
        setProgress(0);
        setResults([]);
        
        const promises = serviceName.map((name) => {
        return PromiseProgress(name)
        .then((val)=>{
            setResults((prev) => [...prev, {status: "success", value: val}])
        })
        .catch(err=>{
            setResults((prev)=> [...prev, {status:"failed", value: err}])
        })
        .finally(()=>{
            setProgress((prev) => {
                const increment = 100 / TOTAL_NUMBERS;
                return Math.min(prev+increment, 100)
            })
        })
    });
    await Promise.allSettled(promises)
    setIsRunning(false)
    }


    return (
        <>
        <div className="progress-track">
            <div className="progress-fill" style={{width: \`\${progress}%\`, background: progress===100 ? "green" : "blue"}}></div>
        </div>
        <button onClick={handleStart} disabled={isRunning}>{isRunning? "processing" : "Start Services"}</button>  
    </>  
)

}`,CS=`.container {
    font-family: sans-serif;
    max-width: 400px;
    margin: 50px auto;
    text-align: center;
}

.progress-track {
    width: 100%;
    height: 20px;
    background-color: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
    /* Keeps the inner bar inside the rounded corners */
    margin: 20px 0;
}

.progress-fill {
    height: 100%;
    transition: width 0.3s ease-in-out;
    /* Smooth animation */
}

.results {
    margin-top: 20px;
    text-align: left;
    border: 1px solid #ccc;
    padding: 10px;
    min-height: 100px;
}`,TS=`import { useState } from "react";

const TEXT = \`React is a JavaScript library for building user interfaces. It was created by Facebook and is now maintained by Meta. React uses a virtual DOM to efficiently update the real DOM. When state changes, React compares the new virtual DOM with the previous one and only updates the parts that actually changed. This process is called reconciliation. React components can be written as functions or classes, though functional components with hooks are now the preferred approach. Popular features include useState for state management, useEffect for side effects, and useContext for sharing data across components.\`;

function Highlight({ text, query }) {
  if (!query) return text;

  const parts = text.split(new RegExp(\`(\${query})\`, "gi"));
  console.log(parts)
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} style={{ background: "#fef08a" }}>{part}</mark>
    ) : (
      part
    )
  );
}

export default function App() {
  const [query, setQuery] = useState("");

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>Search Highlighter</h2>

      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: 8, fontSize: 16, width: 300 }}
      />

      <p style={{ lineHeight: 1.8, marginTop: 20 }}>
        <Highlight text={TEXT} query={query} />
      </p>
    </div>
  );
}
`,RS=`.search-highlighter {
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  max-width: 700px;
  margin: 0 auto;
}

.search-highlighter h1 {
  margin-bottom: 24px;
  color: #333;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.search-box input {
  flex: 1;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
}

.search-box input:focus {
  border-color: #4a90d9;
}

.match-count {
  color: #666;
  font-size: 14px;
  white-space: nowrap;
}

.content {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  line-height: 1.8;
  color: #333;
}

.highlight {
  background-color: #fff59d;
  padding: 2px 4px;
  border-radius: 3px;
}

.custom-text {
  margin-top: 24px;
}

.custom-text h3 {
  margin-bottom: 12px;
  color: #555;
  font-size: 14px;
}

.custom-text textarea {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 2px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
}

.custom-text textarea:focus {
  border-color: #4a90d9;
}
`,NS=`import { useState } from "react";

const ROWS = ["A", "B", "C", "D", "E", "F", "G"];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8];
const PRICE_PER_SEAT = 250;

// Pre-booked seats (fixed so the grid looks realistic)
const BOOKED = new Set(["A3", "A7", "B2", "B5", "C4", "C8", "D1", "D6", "E3", "E5", "F2", "F7", "G4", "G6"]);

function getSeatStatus(id, selected) {
  if (BOOKED.has(id)) return "booked";
  if (selected.has(id)) return "selected";
  return "available";
}

const STATUS_STYLE = {
  available: { background: "#e8f5e9", borderColor: "#a5d6a7", color: "#333", cursor: "pointer" },
  selected:  { background: "#1976d2", borderColor: "#1565c0", color: "#fff", cursor: "pointer" },
  booked:    { background: "#e0e0e0", borderColor: "#bdbdbd", color: "#9e9e9e", cursor: "not-allowed" },
};

export default function App() {
  const [selected, setSelected] = useState(new Set());

  function toggleSeat(id) {
    if (BOOKED.has(id)) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  const sortedSelected = [...selected].sort();
  const total = selected.size * PRICE_PER_SEAT;

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 560 }}>
      <h2 style={{ marginBottom: 4 }}>Select Your Seats</h2>
      <p style={{ color: "#666", marginBottom: 20, fontSize: 14 }}>
        Bengaluru → Mumbai · Express Bus · ₹{PRICE_PER_SEAT}/seat
      </p>

      {/* Legend */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        {[["Available", "#e8f5e9", "#a5d6a7"], ["Selected", "#1976d2", "#1565c0"], ["Booked", "#e0e0e0", "#bdbdbd"]].map(([label, bg, border]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 18, height: 18, background: bg, border: \`2px solid \${border}\`, borderRadius: 4 }} />
            <span style={{ fontSize: 13 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Column header */}
      <div style={{ display: "flex", gap: 6, marginBottom: 6, marginLeft: 28 }}>
        {COLS.map(c => (
          <div key={c} style={{ width: 44, textAlign: "center", fontSize: 12, color: "#999", fontWeight: 600 }}>
            {c}
          </div>
        ))}
      </div>

      {/* Seat grid */}
      {ROWS.map(row => (
        <div key={row} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <div style={{ width: 22, fontWeight: 700, fontSize: 14, color: "#555" }}>{row}</div>
          {COLS.map(col => {
            const id = \`\${row}\${col}\`;
            const status = getSeatStatus(id, selected);
            return (
              <button
                key={id}
                onClick={() => toggleSeat(id)}
                disabled={status === "booked"}
                title={status === "booked" ? \`\${id} — Booked\` : \`\${id} — ₹\${PRICE_PER_SEAT}\`}
                style={{
                  width: 44, height: 40,
                  border: "2px solid",
                  borderRadius: 6,
                  fontSize: 11, fontWeight: 600,
                  transition: "background 0.1s, transform 0.1s",
                  ...STATUS_STYLE[status],
                }}
              >
                {id}
              </button>
            );
          })}
        </div>
      ))}

      {/* Booking summary */}
      <div style={{
        marginTop: 24, padding: 16, background: "#f8f9fa",
        borderRadius: 10, border: "1px solid #e0e0e0",
      }}>
        {selected.size === 0 ? (
          <p style={{ color: "#999", margin: 0 }}>No seats selected. Click a seat to select it.</p>
        ) : (
          <>
            <p style={{ margin: "0 0 8px" }}>
              <strong>Seats:</strong> {sortedSelected.join(", ")}
            </p>
            <p style={{ margin: "0 0 16px" }}>
              <strong>Total:</strong> ₹{total} ({selected.size} seat{selected.size !== 1 ? "s" : ""} × ₹{PRICE_PER_SEAT})
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => alert(\`Booked: \${sortedSelected.join(", ")}\\nTotal: ₹\${total}\`)}
                style={{ padding: "10px 28px", background: "#1976d2", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 15 }}
              >
                Book Now
              </button>
              <button
                onClick={clearSelection}
                style={{ padding: "10px 18px", background: "#fff", color: "#666", border: "1px solid #ddd", borderRadius: 6, cursor: "pointer" }}
              >
                Clear
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}`,IS=`import { useState } from "react";

/**
 * ============================================================================
 * PROBLEM: Snake and Ladder - Shortest Path (BFS)
 * ============================================================================
 *
 * INTUITION:
 * The Snake and Ladder game can be modeled as a Directed Graph.
 * - Nodes: Squares 1 to 100.
 * - Edges: From square X, you can go to X+1, X+2, ..., X+6 (dice roll).
 * - Jumps: If a square has a snake or ladder, there is a directed edge
 *   from the start to the end of the snake/ladder (0 cost for the jump itself,
 *   but the dice roll counts as 1 move).
 *
 * We want the minimum dice throws to reach 100.
 * Since edges (dice throws) have equal weight (1 move), BFS is optimal.
 *
 * ALGORITHM:
 * 1. Start BFS from Node 1.
 * 2. For current node \`curr\`, try all dice rolls (1 to 6).
 * 3. Calculate \`next\` position.
 * 4. Check for Snake or Ladder at \`next\`. If present, move \`next\` to destination.
 * 5. If \`next\` hasn't been visited, add to queue and mark visited.
 * 6. Track the path taken to reconstruct it later.
 *
 * ============================================================================
 * DRY RUN EXAMPLE
 * ============================================================================
 * Start: 1. Target: 100.
 * Ladder: 2 -> 38.
 *
 * 1. Queue: [[1]]
 * 2. Pop [1]. Neighbors:
 *    - Roll 1 -> Land on 2 -> Ladder to 38. Path: [1, 38]. Push to Queue.
 *    - Roll 2 -> Land on 3. Path: [1, 3]. Push.
 *    ...
 *    - Roll 6 -> Land on 7. Path: [1, 7]. Push.
 *
 * 3. Pop [1, 38]. Neighbors of 38:
 *    - Roll 1 -> 39. Path: [1, 38, 39].
 *    ...
 *
 * 4. Eventually reach 100. The first time we see 100, that path is shortest.
 * ============================================================================
 */

const SIZE = 10;
const TOTAL = 100;

// snakes & ladders
const ladders = {
  2: 38,
  7: 14,
  8: 31,
  28: 84,
};

const snakes = {
  16: 6,
  49: 11,
  62: 19,
  87: 24,
};

// map number → (row, col)
function getPosition(num) {
  const rowFromBottom = Math.floor((num - 1) / SIZE);
  const row = SIZE - 1 - rowFromBottom;

  let col = (num - 1) % SIZE;
  // Zigzag: odd rows from bottom go right-to-left
  if (rowFromBottom % 2 === 1) col = SIZE - 1 - col;

  return { row, col };
}

// build grid
function buildGrid() {
  const grid = Array.from({ length: SIZE }, () =>
    Array(SIZE).fill(null)
  );

  for (let n = 1; n <= TOTAL; n++) {
    const { row, col } = getPosition(n);
    grid[row][col] = n;
  }
  return grid;
}

// BFS shortest path
function shortestPath() {
  const queue = [[1]]; // Store full paths: [[1], [1, 38], ...]
  const visited = new Set([1]); // Avoid cycles and redundant processing

  while (queue.length) {
    const path = queue.shift();
    const curr = path[path.length - 1];

    // Reached the end?
    if (curr === TOTAL) return path;

    // Try all 6 dice outcomes
    for (let d = 1; d <= 6; d++) {
      let next = curr + d;
      if (next > TOTAL) continue;

      // Apply jumps immediately
      if (ladders[next]) next = ladders[next];
      if (snakes[next]) next = snakes[next];

      // If not visited, add new path to queue
      if (!visited.has(next)) {
        visited.add(next);
        queue.push([...path, next]);
      }
    }
  }
  return [];
}

export default function SnakeAndLadder() {
  const grid = buildGrid();
  const [path, setPath] = useState([]);

  const pathSet = new Set(path);

  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <h2>🎲 Snake & Ladder – Shortest Path</h2>

      <button
        onClick={() => setPath(shortestPath())}
        style={{
          padding: "8px 14px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Show Shortest Path
      </button>

      {path.length > 0 && (
        <div style={{ margin: "10px 0", fontWeight: "bold" }}>
          Minimum dice throws: {path.length - 1}
        </div>
      )}

      {/* INLINE GRID — NO CSS OVERRIDE */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 60px)",
          gap: 8,
          width: "fit-content",
          marginTop: 10,
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            // Determine cell color
            const isDark = (r + c) % 2 === 1;
            let bg = isDark ? "#779556" : "#ebecd0"; // Chessboard style

            if (cell === 1) bg = "#22c55e"; // Start Green
            else if (cell === 100) bg = "#ef4444"; // End Red
            else if (pathSet.has(cell)) bg = "#facc15"; // Path Yellow
            else if (ladders[cell] || snakes[cell]) bg = isDark ? "#557536" : "#dbdcc0"; // Slightly different for special cells

          return (
            <div
              key={cell}
              style={{
                width: 60,
                height: 60,
                background: bg,
                border: "1px solid rgba(0,0,0,0.1)",
                fontSize: 11,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                color: (cell === 1 || cell === 100) ? "white" : "inherit",
                fontWeight: "bold"
              }}
            >
              <strong>{cell}</strong>

              {ladders[cell] && (
                <span style={{ color: "green", fontSize: 10 }}>
                  🪜 → {ladders[cell]}
                </span>
              )}

              {snakes[cell] && (
                <span style={{ color: "red", fontSize: 10 }}>
                  🐍 → {snakes[cell]}
                </span>
              )}
            </div>
          );
        })
      )}
      </div>

      <div style={{ marginTop: 12, fontSize: 14 }}>
        <div>🟨 Shortest path (BFS)</div>
        <div>🪜 Ladder</div>
        <div>🐍 Snake</div>
      </div>
    </div>
  );
}
`,AS=`.container {
    padding: 20px;
    font-family: system-ui, sans-serif;
    max-width: 800px;
}

button {
    padding: 8px 14px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 10px;
}

button:hover {
    background: #1e40af;
}

.moves {
    margin: 10px 0;
    font-weight: bold;
}

.board {
    display: grid;
    grid-template-columns: repeat(10, 60px);
    gap: 8px;
    width: fit-content;
    /* 🔑 THIS */
}

.cell {
    width: 60px;
    height: 60px;
    background: #eee;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
}

.cell-number {
    font-weight: bold;
}

.cell.path {
    background: #a7f3d0;
}

.cell.start {
    background: #22c55e;
    color: white;
}

.cell.end {
    background: #ef4444;
    color: white;
}

.ladder {
    color: green;
    font-size: 10px;
}

.snake {
    color: red;
    font-size: 10px;
}

.legend {
    margin-top: 14px;
    font-size: 14px;
}`,OS=`import { useState } from "react";
import StarRating from "./StarRating";

export default function App() {
  const [currentRating, setCurrentRating] = useState(0);

  const handleRatingChange = (newRating) => {
    console.log("User selected:", newRating);
    setCurrentRating(newRating);
  };

  return (
    <div style={{ padding: "50px", fontFamily: "sans-serif" }}>
      <h1>Rate this Product</h1>
      
      {/* Usage 1: Default 5 Stars */}
      <StarRating onChange={handleRatingChange} />
      
      <p>Current Rating: <strong>{currentRating}</strong> / 5</p>

      <hr />

      {/* Usage 2: Custom 10 Stars */}
      <h3>Rate your Uber Driver (10 scale)</h3>
      <StarRating totalStars={10} />
    </div>
  );
}`,MS=`import { useState } from "react";

export default function StarRating({ totalStars = 5, onChange }) {
  const [rating, setRating] = useState(0); // The clicked rating
  const [hover, setHover] = useState(0);   // The star currently being hovered

  return (
    <div className="star-container">
      {/* Create an array of length 'totalStars' */}
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1; // Convert 0-index to 1-based value

        return (
          <button
            key={starValue}
            className={\`star \${starValue <= (hover || rating) ? "on" : "off"}\`}
            onClick={() => {
              setRating(starValue);
              if (onChange) onChange(starValue);
            }}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            onDoubleClick={()=>{
                setRating(0);
                setHover(0);
                if (onChange) onChange(0);
            }}
          >
            <span className="star-icon">&#9733;</span>
          </button>
        );
      })}
    </div>
  );
}`,DS=`/* Container to align stars */
.star-container {
    display: flex;
    gap: 4px;
}

/* Reset default button styles */
button.star {
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 0;
    font-size: 2rem;
    /* Size of the star */
    transition: transform 0.2s;
    /* Nice pop effect */
}

/* Add a slight pop when clicking/hovering */
button.star:active {
    transform: scale(1.2);
}

/* The actual star character color */
.star-icon {
    transition: color 0.2s;
}

/* Default State (Grey/Empty) */
.star.off .star-icon {
    color: #e4e5e9;
}

/* Active State (Gold/Filled) */
.star.on .star-icon {
    color: #ffc107;
}`,LS=`import { useState } from 'react'

const STARS = [1, 2, 3, 4, 5]

export default function StarRating() {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)

  // Hover wins while the pointer is over the widget; otherwise show what the
  // user actually committed.
  const active = hovered || rating

  return (
    <div className="sr-rating" onMouseLeave={() => setHovered(0)}>
      {STARS.map((value) => (
        <span
          key={value}
          className={value <= active ? 'sr-star sr-filled' : 'sr-star'}
          role="button"
          tabIndex={0}
          aria-label={\`Rate \${value} out of 5\`}
          onMouseEnter={() => setHovered(value)}
          onClick={() => setRating(value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') setRating(value)
          }}
        >
          ★
        </span>
      ))}
      <p className="sr-label">{rating ? \`\${rating} / 5\` : 'No rating yet'}</p>
    </div>
  )
}
`,PS=`.sr-rating { display: flex; align-items: center; gap: 4px; }

.sr-star {
  font-size: 32px;
  line-height: 1;
  color: #4a5163;
  cursor: pointer;
  user-select: none;
  transition: color 0.12s ease;
}

.sr-star.sr-filled { color: #f5b301; }

.sr-label { margin-left: 14px; font-size: 14px; color: #8b95a9; }
`,BS=`import { useState } from "react";

const STEPS = ["Personal Info", "Address", "Payment", "Review & Submit"];

// ── Step components ──────────────────────────────────────────────────────────

function StepPersonal({ data, onChange }) {
  return (
    <div style={styles.fields}>
      <Field label="Full Name" value={data.name} onChange={v => onChange("name", v)} placeholder="Arjun Kumar" />
      <Field label="Email" value={data.email} onChange={v => onChange("email", v)} placeholder="arjun@example.com" type="email" />
      <Field label="Phone" value={data.phone} onChange={v => onChange("phone", v)} placeholder="+91 98765 43210" />
    </div>
  );
}

function StepAddress({ data, onChange }) {
  return (
    <div style={styles.fields}>
      <Field label="Street" value={data.street} onChange={v => onChange("street", v)} placeholder="123 MG Road" />
      <Field label="City" value={data.city} onChange={v => onChange("city", v)} placeholder="Bengaluru" />
      <Field label="Pincode" value={data.pincode} onChange={v => onChange("pincode", v)} placeholder="560001" />
    </div>
  );
}

function StepPayment({ data, onChange }) {
  return (
    <div style={styles.fields}>
      <Field label="Card Number" value={data.card} onChange={v => onChange("card", v)} placeholder="4242 4242 4242 4242" />
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Field label="Expiry" value={data.expiry} onChange={v => onChange("expiry", v)} placeholder="MM/YY" />
        </div>
        <div style={{ flex: 1 }}>
          <Field label="CVV" value={data.cvv} onChange={v => onChange("cvv", v)} placeholder="123" />
        </div>
      </div>
    </div>
  );
}

function StepReview({ data }) {
  const rows = [
    ["Name", data.name], ["Email", data.email], ["Phone", data.phone],
    ["Street", data.street], ["City", data.city], ["Pincode", data.pincode],
    ["Card", data.card ? \`**** **** **** \${data.card.slice(-4)}\` : "—"],
  ];
  return (
    <div>
      <p style={{ color: "#666", marginBottom: 16 }}>Please review your details before submitting.</p>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <td style={{ padding: "8px 12px", color: "#666", fontWeight: 500, width: "40%" }}>{label}</td>
              <td style={{ padding: "8px 12px", color: "#1a1a1a" }}>{value || <span style={{ color: "#bbb" }}>—</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Shared Field component ───────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontWeight: 500, marginBottom: 6, color: "#444" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "10px 12px", fontSize: 15,
          border: "1.5px solid #ccc", borderRadius: 6, outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

// ── Validation per step ──────────────────────────────────────────────────────

function isStepValid(step, data) {
  if (step === 0) return data.name.trim() && data.email.trim() && data.phone.trim();
  if (step === 1) return data.street.trim() && data.city.trim() && data.pincode.trim();
  if (step === 2) return data.card.trim() && data.expiry.trim() && data.cvv.trim();
  return true; // Review step is always valid
}

// ── Main Wizard ──────────────────────────────────────────────────────────────

const INITIAL = { name: "", email: "", phone: "", street: "", city: "", pincode: "", card: "", expiry: "", cvv: "" };

export default function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  function update(field, value) {
    setData(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✓</div>
        <h2 style={{ color: "#2e7d32" }}>Order Placed!</h2>
        <p style={{ color: "#666" }}>Confirmation sent to {data.email}</p>
        <button onClick={() => { setSubmitted(false); setStep(0); setData(INITIAL); }} style={styles.btnSecondary}>
          Start Over
        </button>
      </div>
    );
  }

  const valid = isStepValid(step, data);

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 540, margin: "0 auto" }}>
      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
        {STEPS.map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: "50%", display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600,
                  background: i < step ? "#2e7d32" : i === step ? "#1976d2" : "#e0e0e0",
                  color: i <= step ? "#fff" : "#999",
                  transition: "background 0.2s",
                }}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 11, marginTop: 4, color: i === step ? "#1976d2" : "#999", whiteSpace: "nowrap" }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < step ? "#2e7d32" : "#e0e0e0", margin: "0 4px", marginBottom: 18 }} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div style={{ minHeight: 200 }}>
        {step === 0 && <StepPersonal data={data} onChange={update} />}
        {step === 1 && <StepAddress data={data} onChange={update} />}
        {step === 2 && <StepPayment data={data} onChange={update} />}
        {step === 3 && <StepReview data={data} />}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
        <button
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
          style={step === 0 ? { ...styles.btnSecondary, opacity: 0.4, cursor: "not-allowed" } : styles.btnSecondary}
        >
          Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!valid}
            style={!valid ? { ...styles.btnPrimary, opacity: 0.5, cursor: "not-allowed" } : styles.btnPrimary}
          >
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} style={styles.btnSuccess}>
            Place Order
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  fields: { display: "flex", flexDirection: "column" },
  btnPrimary: {
    padding: "10px 28px", background: "#1976d2", color: "#fff",
    border: "none", borderRadius: 6, cursor: "pointer", fontSize: 15,
  },
  btnSecondary: {
    padding: "10px 28px", background: "#f5f5f5", color: "#444",
    border: "1px solid #ddd", borderRadius: 6, cursor: "pointer", fontSize: 15,
  },
  btnSuccess: {
    padding: "10px 28px", background: "#2e7d32", color: "#fff",
    border: "none", borderRadius: 6, cursor: "pointer", fontSize: 15,
  },
};`,jS=`import { useState, useRef } from "react";

const TABS = [
  {
    id: "profile",
    label: "Profile",
    Content: () => (
      <div>
        <h3 style={{ marginTop: 0 }}>Your Profile</h3>
        <p><strong>Name:</strong> Arjun Kumar</p>
        <p><strong>Email:</strong> arjun@example.com</p>
        <p><strong>Role:</strong> Frontend Engineer</p>
      </div>
    ),
  },
  {
    id: "orders",
    label: "Orders",
    Content: () => (
      <div>
        <h3 style={{ marginTop: 0 }}>Recent Orders</h3>
        {["#ORD-001 — Laptop Stand", "#ORD-002 — Keyboard", "#ORD-003 — Monitor"].map(o => (
          <p key={o} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>{o}</p>
        ))}
      </div>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    Content: () => (
      <div>
        <h3 style={{ marginTop: 0 }}>Settings</h3>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" defaultChecked /> Email notifications
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <input type="checkbox" /> SMS alerts
        </label>
      </div>
    ),
  },
  {
    id: "billing",
    label: "Billing",
    Content: () => (
      <div>
        <h3 style={{ marginTop: 0 }}>Billing</h3>
        <p>Plan: <strong>Pro — ₹999/month</strong></p>
        <p>Next renewal: <strong>July 18, 2026</strong></p>
      </div>
    ),
  },
];

export default function App() {
  const [activeId, setActiveId] = useState("profile");
  // Track which tabs have been visited for lazy rendering
  const [visited, setVisited] = useState(() => new Set(["profile"]));
  const tabRefs = useRef({});

  function activate(id) {
    setActiveId(id);
    setVisited(prev => new Set([...prev, id]));
    tabRefs.current[id]?.focus();
  }

  // Keyboard navigation: ArrowLeft/Right cycle tabs, Home/End jump to ends
  function handleKeyDown(e) {
    const ids = TABS.map(t => t.id);
    const current = ids.indexOf(activeId);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      activate(ids[(current + 1) % ids.length]);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      activate(ids[(current - 1 + ids.length) % ids.length]);
    } else if (e.key === "Home") {
      e.preventDefault();
      activate(ids[0]);
    } else if (e.key === "End") {
      e.preventDefault();
      activate(ids[ids.length - 1]);
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 600 }}>
      <h2 style={{ marginBottom: 20 }}>Account</h2>

      {/* Tab list with ARIA roles */}
      <div role="tablist" style={{ display: "flex", borderBottom: "2px solid #e0e0e0" }}>
        {TABS.map(tab => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={\`panel-\${tab.id}\`}
              id={\`tab-\${tab.id}\`}
              ref={el => (tabRefs.current[tab.id] = el)}
              onClick={() => activate(tab.id)}
              onKeyDown={handleKeyDown}
              // Roving tabIndex: only the active tab is in the tab order
              tabIndex={isActive ? 0 : -1}
              style={{
                padding: "10px 20px",
                border: "none",
                background: "none",
                cursor: "pointer",
                borderBottom: isActive ? "2px solid #1976d2" : "2px solid transparent",
                color: isActive ? "#1976d2" : "#666",
                fontWeight: isActive ? 600 : 400,
                fontSize: 15,
                marginBottom: -2,
                outline: "none",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab panels — hidden via \`hidden\` attribute; content only mounts after first visit */}
      {TABS.map(tab => (
        <div
          key={tab.id}
          role="tabpanel"
          id={\`panel-\${tab.id}\`}
          aria-labelledby={\`tab-\${tab.id}\`}
          hidden={tab.id !== activeId}
          style={{ padding: "20px 4px" }}
        >
          {visited.has(tab.id) ? <tab.Content /> : null}
        </div>
      ))}

      <p style={{ marginTop: 16, fontSize: 12, color: "#aaa" }}>
        Keyboard: ← → to switch tabs, Home / End to jump to first / last
      </p>
    </div>
  );
}`,FS=`import { useState } from "react";

export default function TicTacToe({ size = 5 }) {
  const n = size;
  const WIN = n;

  const createBoard = () =>
    Array.from({ length: n }, () => Array(n).fill(null));

  const [board, setBoard] = useState(createBoard);
  const [player, setPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [moves, setMoves] = useState(0);

  // Horizontal + Vertical only
  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
  ];

  const count = (board, r, c, dr, dc, player) => {
    let nr = r + dr;
    let nc = c + dc;
    let cnt = 0;

    while (
      nr >= 0 &&
      nc >= 0 &&
      nr < board.length &&
      nc < board[0].length &&
      board[nr][nc] === player
    ) {
      cnt++;
      nr += dr;
      nc += dc;
    }

    return cnt;
  };

  const checkWin = (board, row, col, player) => {
    for (let [dr, dc] of directions) {
      const total =
        1 +
        count(board, row, col, dr, dc, player) +
        count(board, row, col, -dr, -dc, player);

      if (total >= WIN) return true;
    }
    return false;
  };

  const handleClick = (r, c) => {
    if (board[r][c] || winner) return;

    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = player;

    if (checkWin(newBoard, r, c, player)) {
      setWinner(player);
    } else if (moves + 1 === n * n) {
      setWinner("Draw");
    } else {
      setPlayer(player === "X" ? "O" : "X");
    }

    setBoard(newBoard);
    setMoves(moves + 1);
  };

  const reset = () => {
    setBoard(createBoard());
    setPlayer("X");
    setWinner(null);
    setMoves(0);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>
        {winner
          ? winner === "Draw"
            ? "It's a Draw!"
            : \`Winner: \${winner}\`
          : \`Turn: \${player}\`}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: \`repeat(\${n}, 80px)\`,
          gap: "5px",
          justifyContent: "center",
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={\`\${r}-\${c}\`}
              onClick={() => handleClick(r, c)}
              style={{
                width: 80,
                height: 80,
                fontSize: 24,
                cursor: "pointer",
              }}
            >
              {cell}
            </button>
          )),
        )}
      </div>

      <button onClick={reset} style={{ marginTop: 20 }}>
        Reset
      </button>
    </div>
  );
}
`,zS=`import { useEffect, useRef, useState } from "react";

/**
 * ============================================================================
 * PROBLEM: Token Bucket Rate Limiter
 * ============================================================================
 *
 * INTUITION:
 * Imagine a physical bucket that holds "tokens".
 * 1. The bucket has a maximum capacity (e.g., 10 tokens).
 * 2. Tokens are added to the bucket at a fixed rate (e.g., 1 token per second).
 * 3. When a request arrives, it must consume a token to proceed.
 * 4. If the bucket has tokens, one is removed, and the request is allowed.
 * 5. If the bucket is empty, the request is dropped (rate limited).
 *
 * WHY IT'S USEFUL:
 * - Allows for "bursts" of traffic up to the bucket capacity.
 * - Enforces a long-term average rate.
 * - Very efficient (O(1) time complexity).
 *
 * ALGORITHM (Lazy Refill):
 * Instead of a background timer constantly adding tokens (which is expensive),
 * we calculate the number of tokens to add ONLY when a request comes in or
 * when we need to check the state.
 *
 * Formula:
 * NewTokens = (CurrentTime - LastRefillTime) * RefillRate
 * CurrentTokens = Math.min(Capacity, OldTokens + NewTokens)
 *
 * ============================================================================
 * DRY RUN EXAMPLE
 * ============================================================================
 * Settings: Capacity = 3, Refill Rate = 1 token/sec
 * Start: T=0s, Tokens=3 (Full)
 *
 * 1. T=0.1s: Request A arrives.
 *    - Refill: (0.1 - 0) * 1 = 0.1 tokens added. Total = 3.1 -> Cap at 3.
 *    - Consume: 3 - 1 = 2 tokens left.
 *    - Result: ✅ Allowed
 *
 * 2. T=0.2s: Request B arrives.
 *    - Refill: (0.2 - 0.1) * 1 = 0.1 tokens added. Total = 2.1.
 *    - Consume: 2.1 - 1 = 1.1 tokens left.
 *    - Result: ✅ Allowed
 *
 * 3. T=0.3s: Request C arrives.
 *    - Refill: (0.3 - 0.2) * 1 = 0.1 tokens added. Total = 1.2.
 *    - Consume: 1.2 - 1 = 0.2 tokens left.
 *    - Result: ✅ Allowed
 *
 * 4. T=0.4s: Request D arrives.
 *    - Refill: (0.4 - 0.3) * 1 = 0.1 tokens added. Total = 0.3.
 *    - Consume: Not enough tokens (0.3 < 1).
 *    - Result: ❌ Blocked
 *
 * 5. T=1.4s: Request E arrives.
 *    - Refill: (1.4 - 0.4) * 1 = 1.0 tokens added. Total = 1.3.
 *    - Consume: 1.3 - 1 = 0.3 tokens left.
 *    - Result: ✅ Allowed
 * ============================================================================
 */

class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity; // Max tokens the bucket can hold
    this.refillRate = refillRate; // Tokens added per second
    this.tokens = capacity; // Start full
    this.lastRefill = Date.now(); // Timestamp of last update
  }

  /**
   * Lazy Refill Strategy:
   * Instead of a setInterval adding tokens every second, we calculate
   * how many tokens *should* have been added since the last time we checked.
   */
  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000; // Convert ms to seconds
    const add = elapsed * this.refillRate; // Rate * Time = Tokens

    // Add tokens, but don't exceed capacity
    this.tokens = Math.min(this.capacity, this.tokens + add);
    this.lastRefill = now;
  }

  /**
   * Attempt to consume 1 token.
   * Returns true if allowed, false if blocked.
   */
  allow() {
    this.refill(); // Always update state before checking
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}

export default function TokenBucketDemo() {
  // Use useRef to keep the bucket instance alive across re-renders
  // without resetting its state (tokens, lastRefill).
  const bucketRef = useRef(new TokenBucket(5, 1));
  const [tokens, setTokens] = useState(5);
  const [logs, setLogs] = useState([]);

  const sendRequest = () => {
    const allowed = bucketRef.current.allow();
    setTokens(bucketRef.current.tokens.toFixed(2));

    setLogs((prev) => [
      \`\${allowed ? "✅ Allowed" : "❌ Blocked"} at \${new Date().toLocaleTimeString()}\`,
      ...prev,
    ]);
  };

  // UI auto-refresh token count
  // This is purely for visualization so the user sees the number go up.
  // The actual algorithm works without this interval.
  useEffect(() => {
    const id = setInterval(() => {
      bucketRef.current.refill();
      setTokens(bucketRef.current.tokens.toFixed(2));
    }, 100); // Update UI every 100ms for smoothness

    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>🪣 Token Bucket Rate Limiter</h2>
      <p>
        <b>Capacity:</b> 5 tokens | <b>Refill Rate:</b> 1 token/sec
      </p>

      <p><b>Tokens:</b> {tokens}</p>
      <button onClick={sendRequest}>Send Request</button>

      <div style={{ marginTop: 16 }}>
        {logs.slice(0, 6).map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
}
`,US=`import TrafficLight from "./TrafficLight";

export default function App(){
    return <TrafficLight/>
}`,$S=`import { useState, useEffect } from "react";

export default function TrafficLight(){
    const LIGHTS_CONFIG = {
        red: {
            backgroundColor: "red",
            duration: 4000,
            next: "green",
        },
        yellow: {
            backgroundColor: "yellow",
            duration: 900,
            next: "red",
        },
        green: {
            backgroundColor: "green",
            duration: 3000,
            next: "yellow",
        },
    };

    const [activeLight, setActiveLight] = useState("red");

    useEffect(()=>{
        const currentConfig = LIGHTS_CONFIG[activeLight];
        const timer = setTimeout(()=>{
            setActiveLight(currentConfig.next)
        }, currentConfig.duration)

        return ()=> clearTimeout(timer)
    }, [activeLight]);


    return(
        <div className="traffic-light-container">
            {Object.keys(LIGHTS_CONFIG).map((colorKey) =>{
                return <div key={colorKey} className="light" 
                style={{
                    backgroundColor: colorKey===activeLight ? LIGHTS_CONFIG[colorKey].backgroundColor : "", 
                }} />
            })}
        </div>
    )

}`,HS=`.traffic-light-container{
    display: flex;
    flex-direction:column;
    align-items: center;
    gap: 10px;
    background-color: #333;
    padding: 20px;
    border-radius: 10px;
    width: 60px;
    margin: 50px auto;
}

.light{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    transition: opacity .3s ease;
    box-shadow: 0 0 10px rgba(0,0,0,.5) inset;
}`,GS=`import { useState } from "react";

// Mock Data
const data = [
  { id: 1, title: "HTML" },
  { id: 2, title: "JavaScript" },
  { id: 3, title: "CSS" },
  { id: 4, title: "TypeScript" },
];

export default function TransferList() {
  // Location state
  const [leftItems, setLeftItems] = useState(data);
  const [rightItems, setRightItems] = useState([]);

  // Selection state (store IDs, not objects)
  const [checkedIds, setCheckedIds] = useState(new Set());

  /* -------------------- Helpers -------------------- */

  const toggleChecked = (id) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const intersection = (items) =>
    items.filter((item) => checkedIds.has(item.id));

  const difference = (items) =>
    items.filter((item) => !checkedIds.has(item.id));

  const clearChecked = (items) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      items.forEach((item) => next.delete(item.id));
      return next;
    });
  };

  /* -------------------- Actions -------------------- */

  const moveRight = () => {
    const selected = intersection(leftItems);
    if (selected.length === 0) return;

    setRightItems((prev) => [...prev, ...selected]);
    setLeftItems((prev) => difference(prev));
    clearChecked(selected);
  };

  const moveLeft = () => {
    const selected = intersection(rightItems);
    if (selected.length === 0) return;

    setLeftItems((prev) => [...prev, ...selected]);
    setRightItems((prev) => difference(prev));
    clearChecked(selected);
  };

  /* -------------------- UI -------------------- */

  return (
    <div style={styles.container}>
      <ItemList
        title="Available"
        items={leftItems}
        checkedIds={checkedIds}
        onToggle={toggleChecked}
      />

      <div style={styles.actions}>
        <button onClick={moveRight}>&gt;</button>
        <button onClick={moveLeft}>&lt;</button>
      </div>

      <ItemList
        title="Selected"
        items={rightItems}
        checkedIds={checkedIds}
        onToggle={toggleChecked}
      />
    </div>
  );
}

/* -------------------- Reusable List -------------------- */

function ItemList({ title, items, checkedIds, onToggle }) {
  return (
    <div style={styles.list}>
      <h4>{title}</h4>
      {items.map((item) => (
        <label key={item.id} style={styles.item}>
          <input
            type="checkbox"
            checked={checkedIds.has(item.id)}
            onChange={() => onToggle(item.id)}
          />
          <span style={{ marginLeft: 8 }}>{item.title}</span>
        </label>
      ))}
    </div>
  );
}

/* -------------------- Styles -------------------- */

const styles = {
  container: {
    display: "flex",
    gap: 20,
    alignItems: "center",
  },
  list: {
    border: "1px solid #ccc",
    padding: 10,
    width: 160,
    height: 220,
    overflowY: "auto",
  },
  item: {
    display: "flex",
    alignItems: "center",
    marginBottom: 6,
    cursor: "pointer",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
};
`,WS=`import { useState, useEffect, useRef } from "react";
import useDebounce from "./useDebounce";

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [result, setResult] = useState([]);
  const cache = useRef(new Map());
  const abortRef = useRef(null);

  const debouncedTerm = useDebounce(inputValue, 1000);

  useEffect(() => {
    setError(false);
    setLoading(true);

    if (!debouncedTerm) {
      setResult([]);
      return;
    }

    if (cache.current.has(debouncedTerm)) {
      setResult(cache.current.get(debouncedTerm));
      setLoading(false);

      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const signal = abortRef.current.signal;

    const fetchData = async () => {
      const url = "https://dummyjson.com/products/search?q=";
      try {
        const response = await fetch(url + debouncedTerm, { signal });
        const data = await response.json();
        setResult(data.products);
        cache.current.set(debouncedTerm, data.products);
      } catch (err) {
        if (err.name !== "AbortError") {
          return;
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    return () => {
      controller.abort();
    };
  }, [debouncedTerm]);


  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        placeholder="write here..."
        onChange={(e) => setInputValue(e.target.value)}
        style={{ width: "100%", padding: 10 }}
      />
      <div
        style={{
          position: "absolute",
          padding: 20,
          border: "1px solid #ccc",
          width: "100%",
          borderRadius: "4px",
          display: result.length ? "flex" : "none",
          background: "#fbfbfbff"
        }}
      >
        {loading && <div>Loading...</div>}
        <ul style={{ padding: 0, margin: 0 }}>
          {result.map((item) => {
            return (
              <div style={{ padding: "10px 10px 10px 20px" }}>{item.title}</div>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
`,KS=`import {useState, useEffect} from "react"

export default function useDebounceValue(value, delay){
    const [debouncedValue, setDebouncedValue] = useState("");

    useEffect(()=>{
        const handler = setTimeout(()=>{
            setDebouncedValue(value);
        }, delay)
        return ()=> clearTimeout(handler);
    }, [value])

    return debouncedValue;
}`,VS=`import VirtualList from "./VirtualList";

export default function App() {
  // Simulate large dataset
  const items = Array.from(
    { length: 20000 },
    (_, index) => \`Item \${index + 1}\`
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>Virtualized List Demo</h2>
      <VirtualList items={items} />
    </div>
  );
}
`,qS=`import { useCallback } from "react";
import { useState, useLayoutEffect, useEffect, useRef } from "react";

const CONTAINER_HEIGHT = 200;
const OVERSCAN = 5;

export default function VirtualList({items}){
  const [scrollTop, setScrollTop] = useState(0);  
  const [itemHeight, setItemHeight] = useState(0);

  const firstItemRef = useRef(null);

  useLayoutEffect(()=>{
    if(firstItemRef.current && !itemHeight){
      const height = firstItemRef.current.getBoundingClientRect().height;
      setItemHeight(height);
    }
  }, [itemHeight])

  const handleScroll = useCallback((e)=>{
    setScrollTop(e.target.scrollTop);
  })


  if(!itemHeight){
    return(<div style={{height: CONTAINER_HEIGHT}}>
      <div ref={firstItemRef}>{items[0]}</div>
    </div>)
  }


  const totalHeight = itemHeight * items.length;
  const start = Math.floor(scrollTop / itemHeight);
  const end = start + Math.ceil(CONTAINER_HEIGHT / itemHeight);

  const visible = items.slice(start, end);
  const offset = start * itemHeight;


  return(
    <div
      onScroll={handleScroll}
      style={{
        height: CONTAINER_HEIGHT,
        overflowY: "auto",
        border: "1px solid #ccc"
      }}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: \`translateY(\${offset}px)\` }}>
          {visible.map((item, index) => (
            <div
              key={start + index}
              style={{
                height: itemHeight,
                display: "flex",
                alignItems: "center",
                paddingLeft: 12,
                borderBottom: "1px solid #eee",
                boxSizing: "border-box"
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

}`,YS=`import React, { useState } from "react";

const wordsDict = ["bottle", "button", "direct", "camera", "cactus", "friend"];
const selectedWord = wordsDict[Math.floor(Math.random() * wordsDict.length)];

const COLORS = {
  correct: "green",
  present: "goldenrod",
  absent: "#888",
};

export default function App() {
  console.log(selectedWord);
  const [guessWord, setGuessWord] = useState("");
  const [word] = useState(selectedWord.split(""));
  const [guesses, setGuesses] = useState([]);

  const evaluateGuess = (word, guessWord) => {
    const res = Array(word.length).fill("");
    const freq = {};

    // First pass
    for (let i = 0; i < word.length; i++) {
      if (word[i] === guessWord[i]) {
        res[i] = "correct";
      } else {
        freq[word[i]] = (freq[word[i]] || 0) + 1;
      }
    }

    // Second pass
    for (let i = 0; i < word.length; i++) {
      if (res[i] === "correct") continue;

      const letter = guessWord[i];
      if (freq[letter] > 0) {
        res[i] = "present";
        freq[letter]--;
      } else {
        res[i] = "absent";
      }
    }

    setGuesses((prev) => [
      ...prev,
      { letters: guessWord.split(""), result: res },
    ]);

    setGuessWord("");
  };

  return (
    <>
      <input
        value={guessWord}
        onChange={(e) => setGuessWord(e.target.value)}
        maxLength={word.length}
      />

      <button onClick={() => evaluateGuess(word, guessWord)}>Submit</button>

      <div style={{ marginTop: 20 }}>
        {console.log(guesses)}
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", gap: 6 }}>
            {guess.letters.map((letter, i) => (
              <div
                key={i}
                style={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  backgroundColor: COLORS[guess.result[i]],
                  color: "white",
                  borderRadius: 4,
                }}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
`,QS=`/**
 * Wordle - Word Guessing Game
 *
 * Problem: Clone of NYT Wordle where players have 6 attempts to guess a 5-letter word.
 * After each guess, tiles change color to show how close the guess was.
 *
 * Key Concepts:
 * - Game state management (guesses, current guess, game status)
 * - Letter frequency counting for correct color assignment
 * - Keyboard event handling
 * - Win/lose conditions
 * - Reset functionality
 *
 * Colors:
 * - Default (Light Gray): #d3d6da
 * - Correct (Green): #6aaa64 - Letter in correct position
 * - Present (Yellow): #c9b458 - Letter in word but wrong position
 * - Absent (Dark Gray): #787c7e - Letter not in word
 *
 * Time Complexity: O(1) per guess (constant word length)
 * Space Complexity: O(1) - max 6 guesses of 5 letters
 */

import { useState, useEffect, useRef } from 'react'

// ==================== CONSTANTS ====================
const WORD_LENGTH = 5
const MAX_GUESSES = 6

// Word bank for random selection
const WORD_BANK = [
  'REACT', 'STATE', 'PROPS', 'HOOKS', 'ASYNC', 'AWAIT',
  'ARRAY', 'OBJECT', 'CLASS', 'SUPER', 'CONST', 'TIMER',
  'FETCH', 'PROXY', 'CACHE', 'QUERY', 'MODAL', 'INPUT',
  'VALID', 'ERROR', 'FRAME', 'SCOPE', 'BUILD', 'STACK',
  'QUEUE', 'GRAPH', 'TREES', 'NODES', 'LINKS', 'ROUTE'
]

// Wordle color scheme
const COLORS = {
  DEFAULT: '#d3d6da',
  CORRECT: '#6aaa64',
  PRESENT: '#c9b458',
  ABSENT: '#787c7e',
  TILE_BG: '#ffffff',
  BORDER: '#d3d6da',
}

// Keyboard layout (standard QWERTY)
const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
]

// ==================== MAIN COMPONENT ====================
function Wordle() {
  // Select random target word on mount (new word per game session)
  const [targetWord] = useState(() =>
    WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]
  )

  // All submitted guesses (array of strings)
  const [guesses, setGuesses] = useState([])

  // Current guess being typed (not submitted yet)
  const [currentGuess, setCurrentGuess] = useState('')

  // Game status: 'playing', 'won', 'lost'
  const [gameStatus, setGameStatus] = useState('playing')

  // Track letter states for keyboard coloring
  // { 'A': 'correct', 'B': 'present', 'C': 'absent', ... }
  const [letterStates, setLetterStates] = useState({})

  // Ref for game container to focus on mount
  const gameRef = useRef(null)

  // ==================== GAME LOGIC ====================

  /**
   * Evaluate a guess and return color for each letter
   *
   * Algorithm:
   * 1. First pass: Mark all correct (exact position matches) as GREEN
   * 2. Build frequency map of remaining letters in target
   * 3. Second pass: For non-green letters, check if present (YELLOW) or absent (GRAY)
   *
   * This ensures correct behavior for duplicate letters.
   * Example: Target = ROBOT, Guess = FLOOR
   * - F: absent (gray)
   * - L: absent (gray)
   * - O: correct (green) - first O matches position 3
   * - O: absent (gray) - second O doesn't match, and target only has 2 O's, one already used
   * - R: present (yellow) - R exists but wrong position
   */
  const evaluateGuess = (guess) => {
    const result = Array(WORD_LENGTH).fill(null)
    const targetLetters = targetWord.split('')
    const guessLetters = guess.split('')

    // Frequency map of target letters (for tracking used letters)
    const targetFreq = {}

    // First pass: Mark correct positions (GREEN)
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        result[i] = 'correct'
      } else {
        // Build frequency map for remaining letters
        targetFreq[targetLetters[i]] = (targetFreq[targetLetters[i]] || 0) + 1
      }
    }

    // Second pass: Mark present (YELLOW) or absent (GRAY)
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (result[i] === 'correct') continue // Already marked as correct

      const letter = guessLetters[i]

      if (targetFreq[letter] && targetFreq[letter] > 0) {
        result[i] = 'present'
        targetFreq[letter]-- // Consume one instance
      } else {
        result[i] = 'absent'
      }
    }

    return result
  }

  /**
   * Update keyboard letter states based on guess evaluation
   * Priority: correct > present > absent
   * (Don't downgrade a correct letter to present or absent)
   */
  const updateLetterStates = (guess, evaluation) => {
    const newStates = { ...letterStates }

    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i]
      const state = evaluation[i]

      // Priority system: correct > present > absent
      if (newStates[letter] === 'correct') continue // Don't downgrade
      if (newStates[letter] === 'present' && state === 'absent') continue // Don't downgrade

      newStates[letter] = state
    }

    setLetterStates(newStates)
  }

  /**
   * Handle guess submission
   */
  const submitGuess = () => {
    // Validation: Must be exactly 5 letters
    if (currentGuess.length !== WORD_LENGTH) {
      alert(\`Word must be \${WORD_LENGTH} letters long!\`)
      return
    }

    // Evaluate the guess
    const evaluation = evaluateGuess(currentGuess)

    // Update letter states for keyboard
    updateLetterStates(currentGuess, evaluation)

    // Add to guesses array
    const newGuesses = [...guesses, currentGuess]
    setGuesses(newGuesses)

    // Clear current guess
    setCurrentGuess('')

    // Check win condition
    if (currentGuess === targetWord) {
      setGameStatus('won')
      return
    }

    // Check lose condition (used all attempts)
    if (newGuesses.length >= MAX_GUESSES) {
      setGameStatus('lost')
      return
    }
  }

  /**
   * Handle keyboard input (both virtual and physical)
   */
  const handleKeyPress = (key) => {
    // Ignore input if game is over
    if (gameStatus !== 'playing') return

    if (key === 'ENTER') {
      submitGuess()
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1))
    } else if (key.length === 1 && /^[A-Z]$/.test(key)) {
      // Only allow letters, max 5
      if (currentGuess.length < WORD_LENGTH) {
        setCurrentGuess(prev => prev + key)
      }
    }
  }

  /**
   * Reset game with new random word
   */
  const resetGame = () => {
    // Force component remount to get new random word
    window.location.reload()
  }

  // ==================== KEYBOARD LISTENERS ====================

  useEffect(() => {
    const handlePhysicalKeyboard = (e) => {
      if (gameStatus !== 'playing') return

      if (e.key === 'Enter') {
        e.preventDefault()
        handleKeyPress('ENTER')
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        handleKeyPress('BACKSPACE')
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault()
        handleKeyPress(e.key.toUpperCase())
      }
    }

    window.addEventListener('keydown', handlePhysicalKeyboard)
    return () => window.removeEventListener('keydown', handlePhysicalKeyboard)
  }, [currentGuess, gameStatus, guesses])

  // Focus game container on mount for keyboard events
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.focus()
    }
  }, [])

  // ==================== RENDER HELPERS ====================

  /**
   * Render a single tile (letter cell)
   */
  const renderTile = (letter, state, index) => {
    // Determine background color based on state
    let bgColor = COLORS.TILE_BG
    let borderColor = COLORS.BORDER
    let textColor = '#000'

    if (state === 'correct') {
      bgColor = COLORS.CORRECT
      textColor = '#fff'
      borderColor = COLORS.CORRECT
    } else if (state === 'present') {
      bgColor = COLORS.PRESENT
      textColor = '#fff'
      borderColor = COLORS.PRESENT
    } else if (state === 'absent') {
      bgColor = COLORS.ABSENT
      textColor = '#fff'
      borderColor = COLORS.ABSENT
    } else if (letter) {
      // Has letter but not evaluated yet
      borderColor = '#888'
    }

    return (
      <div
        key={index}
        style={{
          width: '62px',
          height: '62px',
          border: \`2px solid \${borderColor}\`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          fontWeight: 'bold',
          backgroundColor: bgColor,
          color: textColor,
          textTransform: 'uppercase',
          transition: 'all 0.3s ease',
          userSelect: 'none',
        }}
      >
        {letter}
      </div>
    )
  }

  /**
   * Render a complete guess row (submitted or current)
   */
  const renderGuessRow = (guess, rowIndex) => {
    const letters = guess.split('')
    const evaluation = rowIndex < guesses.length ? evaluateGuess(guess) : []

    return (
      <div
        key={rowIndex}
        style={{
          display: 'flex',
          gap: '5px',
          marginBottom: '5px',
        }}
      >
        {Array.from({ length: WORD_LENGTH }).map((_, i) =>
          renderTile(letters[i] || '', evaluation[i], i)
        )}
      </div>
    )
  }

  /**
   * Render keyboard key
   */
  const renderKey = (key) => {
    const isSpecial = key === 'ENTER' || key === 'BACKSPACE'
    const state = letterStates[key]

    let bgColor = COLORS.DEFAULT
    let textColor = '#000'

    if (state === 'correct') {
      bgColor = COLORS.CORRECT
      textColor = '#fff'
    } else if (state === 'present') {
      bgColor = COLORS.PRESENT
      textColor = '#fff'
    } else if (state === 'absent') {
      bgColor = COLORS.ABSENT
      textColor = '#fff'
    }

    return (
      <button
        key={key}
        onClick={() => handleKeyPress(key)}
        disabled={gameStatus !== 'playing'}
        style={{
          padding: isSpecial ? '12px 16px' : '12px 10px',
          fontSize: isSpecial ? '12px' : '14px',
          fontWeight: '600',
          border: 'none',
          borderRadius: '4px',
          backgroundColor: gameStatus !== 'playing' ? '#d3d6da' : bgColor,
          color: textColor,
          cursor: gameStatus !== 'playing' ? 'not-allowed' : 'pointer',
          minWidth: isSpecial ? '65px' : '32px',
          transition: 'all 0.1s',
          textTransform: 'uppercase',
          opacity: gameStatus !== 'playing' ? 0.6 : 1,
        }}
        onMouseDown={(e) => {
          if (gameStatus === 'playing') {
            e.currentTarget.style.transform = 'scale(0.95)'
          }
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        {key === 'BACKSPACE' ? '⌫' : key}
      </button>
    )
  }

  // ==================== RENDER ====================
  return (
    <div
      ref={gameRef}
      tabIndex={0}
      style={{
        maxWidth: '500px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        outline: 'none',
      }}
    >
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '20px',
        borderBottom: '1px solid #d3d6da',
        paddingBottom: '16px',
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          margin: '0 0 8px 0',
          letterSpacing: '0.05em',
        }}>WORDLE</h1>
        <p style={{
          fontSize: '14px',
          color: '#666',
          margin: 0,
        }}>
          Guess the 5-letter word in 6 tries
        </p>
      </div>

      {/* Game Board */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '30px',
      }}>
        {/* Submitted guesses */}
        {guesses.map((guess, i) => renderGuessRow(guess, i))}

        {/* Current guess row (if game is still playing) */}
        {gameStatus === 'playing' && guesses.length < MAX_GUESSES &&
          renderGuessRow(currentGuess, guesses.length)
        }

        {/* Empty rows */}
        {Array.from({
          length: MAX_GUESSES - guesses.length - (gameStatus === 'playing' ? 1 : 0)
        }).map((_, i) => renderGuessRow('', guesses.length + i + 1))}
      </div>

      {/* Game Status */}
      {gameStatus !== 'playing' && (
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          padding: '20px',
          backgroundColor: gameStatus === 'won' ? '#6aaa64' : '#787c7e',
          color: '#fff',
          borderRadius: '8px',
          fontWeight: 'bold',
        }}>
          {gameStatus === 'won' ? (
            <>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎉 You Win!</div>
              <div style={{ fontSize: '16px' }}>
                You guessed the word in {guesses.length} {guesses.length === 1 ? 'try' : 'tries'}!
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>Game Over</div>
              <div style={{ fontSize: '16px' }}>
                The word was: <strong>{targetWord}</strong>
              </div>
            </>
          )}
        </div>
      )}

      {/* Reset Button */}
      {gameStatus !== 'playing' && (
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button
            onClick={resetGame}
            style={{
              padding: '12px 40px',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#1976d2',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1565c0'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1976d2'
            }}
          >
            Play Again
          </button>
        </div>
      )}

      {/* Virtual Keyboard */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
      }}>
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: 'flex',
              gap: '6px',
            }}
          >
            {row.map(key => renderKey(key))}
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#555',
      }}>
        <strong>How to Play:</strong>
        <ul style={{ marginLeft: '20px', marginTop: '8px', marginBottom: 0 }}>
          <li>Type or click letters to make a 5-letter word</li>
          <li>Press ENTER to submit your guess</li>
          <li>Green = correct letter in correct position</li>
          <li>Yellow = correct letter in wrong position</li>
          <li>Gray = letter not in word</li>
          <li>You have 6 attempts to guess the word!</li>
        </ul>
      </div>

      {/* Debug Info (only visible in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#856404',
        }}>
          <strong>DEV MODE:</strong> Target word is <code>{targetWord}</code>
        </div>
      )}
    </div>
  )
}

// ==================== EXPORT ====================
export default Wordle

/**
 * KEY LEARNING POINTS:
 *
 * 1. Letter Frequency Algorithm
 *    - Two-pass approach prevents duplicate letter bugs
 *    - First pass: Mark exact matches (GREEN)
 *    - Second pass: Check remaining letters for presence (YELLOW/GRAY)
 *    - Example: ROBOT vs FLOOR correctly shows only one O as green
 *
 * 2. State Management
 *    - Separate guesses (submitted) from currentGuess (typing)
 *    - letterStates tracks keyboard coloring with priority system
 *    - gameStatus controls UI and interactions
 *
 * 3. Keyboard Handling
 *    - Both virtual (onClick) and physical (onKeyDown) keyboards
 *    - Event prevention to avoid form submission
 *    - Disabled when game is over
 *
 * 4. Visual Feedback
 *    - Smooth transitions with CSS
 *    - Button press effects (scale on click)
 *    - Color coding matches official Wordle
 *
 * 5. Edge Cases Handled
 *    - Duplicate letters (frequency tracking)
 *    - Incomplete words (validation)
 *    - Game over state (disable input)
 *    - Keyboard priority (correct > present > absent)
 *
 * COMPLEXITY:
 * - Time: O(1) per guess (constant 5 letters)
 * - Space: O(1) - max 6 guesses × 5 letters = 30 cells
 *
 * INTERVIEW FOLLOW-UPS:
 *
 * Q: How to handle word validation (check if word exists in dictionary)?
 * A: Add WORD_LIST array/Set, check \`if (!WORD_LIST.has(guess)) alert('Not in word list')\`
 *
 * Q: How to add animations for tile flips?
 * A: Use CSS keyframes + delay based on index:
 *    animation: flip 0.5s ease \${i * 0.1}s;
 *
 * Q: How to persist game state across page refreshes?
 * A: Use localStorage to save/load guesses, currentGuess, targetWord
 *
 * Q: How to add a "Share Results" feature (emoji grid)?
 * A: Map evaluation to emojis: correct=🟩, present=🟨, absent=⬛
 *    Copy to clipboard with navigator.clipboard.writeText()
 *
 * Q: How to add hard mode (must use revealed hints)?
 * A: Validate that guess contains all green letters in correct positions
 *    and all yellow letters somewhere in the word
 */
`,XS=`# Calendar Day View

Lay out a day's events on a timeline, side by side where they overlap.

## Requirements

- Vertical position and height come from each event's start and end time.
- Overlapping events share the horizontal space instead of covering each other.
- Non-overlapping events use the full width.

## How it works

The two axes are computed independently:

- **Vertical** is a direct mapping from time to pixels.
- **Horizontal** depends on collisions, so events are sorted by start time and
  swept into groups of mutually overlapping events. Each group of \`N\` events
  gets \`width = 100% / N\`, and event \`i\` is offset to \`left = i * width\`.

## Interview traps

- **Transitive overlap.** A overlaps B, B overlaps C, but A and C do not.
  They must still share width, because the group is defined by the chain — not
  by pairwise overlap. Grouping must track the running maximum end time of the
  group, not just the previous event's end.
- Sorting by end time instead of start time breaks the sweep.
- Zero-length or inverted events (\`end <= start\`) need an explicit decision.
`,ZS=`# Carousel / Slider

## Problem Statement

Build a **Carousel** (image slider) component that displays items one at a time with smooth sliding transitions, navigation controls, and indicator dots. This is one of the most common UI patterns on the web.

This pattern is essential for:
- Hero banners on landing pages
- Product image galleries (e-commerce)
- Testimonial showcases
- Feature highlights
- Photo galleries
- Onboarding flows (mobile apps)

---

## Requirements

### Functional Requirements

1. **Slide Display**
   - Show one slide at a time
   - Each slide fills the visible area
   - Support any content (images, text, components)

2. **Navigation Buttons**
   - Previous (←) and Next (→) buttons
   - Navigate to adjacent slides
   - Loop from last to first and vice versa

3. **Dot Indicators**
   - Show one dot per slide
   - Highlight current slide's dot
   - Click dot to jump to that slide

4. **Smooth Transitions**
   - Animate slide changes
   - CSS-based transitions
   - No janky movements

5. **Infinite Loop**
   - Next on last slide → goes to first
   - Previous on first slide → goes to last

### Non-Functional Requirements

- Smooth 60fps animations
- Responsive to container width
- Touch-friendly (clickable areas)
- No external dependencies

---

## Visual Representation

\`\`\`
Component Structure:
+--------------------------------------------------+
|                carousel-container                 |
|  +----------------------------------------------+|
|  |                  carousel                     ||
|  | +----+  +------------------------------+ +--+||
|  | | ← |  |      carousel-window          | |→ |||
|  | |prev|  |   (overflow: hidden)         | |nxt|||
|  | +----+  |  +--------+--------+--------+| +--+||
|  |         |  | Slide  | Slide  | Slide  ||     ||
|  |         |  |   1    |   2    |   3    ||     ||
|  |         |  +--------+--------+--------+|     ||
|  |         |       carousel-track         |     ||
|  |         |   (flex, translateX)         |     ||
|  |         +------------------------------+     ||
|  +----------------------------------------------+|
|                    ●  ○  ○                        |
|                     dots                          |
+--------------------------------------------------+

Sliding Mechanism:
+------------------+
|  Visible Window  |  (overflow: hidden)
|  +---------------|---------------------------+
|  | +-----------+ | +-----------+ +-----------+
|  | |  Slide 1  | | |  Slide 2  | |  Slide 3  |
|  | |  (100%)   | | |  (100%)   | |  (100%)   |
|  | +-----------+ | +-----------+ +-----------+
|  +---------------|---------------------------+
|                  |     translateX(-100%)
+------------------+

Index 0: translateX(0%)      → Shows Slide 1
Index 1: translateX(-100%)   → Shows Slide 2
Index 2: translateX(-200%)   → Shows Slide 3
\`\`\`

---

## Key Concepts & Intuition

### 1. The Sliding Mechanism

\`\`\`jsx
<div className="carousel-window" style={{ overflow: 'hidden' }}>
    <div
        className="carousel-track"
        style={{
            display: 'flex',
            transform: \`translateX(-\${currentIndex * 100}%)\`
        }}
    >
        {slides.map(slide => (
            <div className="carousel-item" style={{ width: '100%', flexShrink: 0 }}>
                {slide}
            </div>
        ))}
    </div>
</div>
\`\`\`

**How it works:**
1. All slides sit side-by-side in a flex container (track)
2. Each slide is 100% width of the window
3. Track is wider than window (300% for 3 slides)
4. Window hides overflow
5. \`translateX\` shifts the track left to reveal different slides

### 2. Infinite Loop Navigation

\`\`\`javascript
// Next: wrap around using modulo
function next() {
    setCurrentIndex((prev) => (prev + 1) % total);
}

// Prev: add total before modulo to handle negative
function prev() {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
}
\`\`\`

**Why \`+ total\` for prev?**
\`\`\`
Without + total:
  (0 - 1) % 3 = -1 % 3 = -1  ❌ Invalid index!

With + total:
  (0 - 1 + 3) % 3 = 2 % 3 = 2  ✓ Last slide
\`\`\`

### 3. Modulo Operator Magic

\`\`\`javascript
total = 3 (slides: 0, 1, 2)

// Forward navigation:
(0 + 1) % 3 = 1  // 0 → 1
(1 + 1) % 3 = 2  // 1 → 2
(2 + 1) % 3 = 0  // 2 → 0 (wraps!)

// Backward navigation:
(2 - 1 + 3) % 3 = 4 % 3 = 1  // 2 → 1
(1 - 1 + 3) % 3 = 3 % 3 = 0  // 1 → 0
(0 - 1 + 3) % 3 = 2 % 3 = 2  // 0 → 2 (wraps!)
\`\`\`

### 4. CSS Transition Animation

\`\`\`css
.carousel-track {
    display: flex;
    transition: transform 0.3s ease-in-out;
}

.carousel-item {
    width: 100%;
    flex-shrink: 0;  /* Prevent items from shrinking */
}
\`\`\`

**Why \`flex-shrink: 0\`?**
Without it, flex items would shrink to fit the container, making all slides visible at once.

### 5. Dot Indicators

\`\`\`jsx
<div className="dots">
    {items.map((_, index) => (
        <span
            key={index}
            className={\`dot \${index === currentIndex ? 'active' : ''}\`}
            onClick={() => setCurrentIndex(index)}
        />
    ))}
</div>
\`\`\`

---

## Implementation Tips

### 1. Basic CSS Setup

\`\`\`css
.carousel-container {
    width: 100%;
    max-width: 600px;
}

.carousel {
    display: flex;
    align-items: center;
}

.carousel-window {
    overflow: hidden;
    flex: 1;
}

.carousel-track {
    display: flex;
    transition: transform 0.3s ease-in-out;
}

.carousel-item {
    width: 100%;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
\`\`\`

### 2. Dot Styling

\`\`\`css
.dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 10px;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ccc;
    cursor: pointer;
    transition: background 0.2s;
}

.dot.active {
    background: #333;
}
\`\`\`

### 3. Button Styling

\`\`\`css
.carousel button {
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 18px;
}

.carousel button:hover {
    background: rgba(0, 0, 0, 0.8);
}
\`\`\`

---

## Common Interview Questions

### Q1: How would you implement auto-play?

\`\`\`javascript
useEffect(() => {
    const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % total);
    }, 3000);  // Change every 3 seconds

    return () => clearInterval(interval);  // Cleanup
}, [total]);

// Pause on hover
const [isPaused, setIsPaused] = useState(false);

useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % total);
    }, 3000);

    return () => clearInterval(interval);
}, [total, isPaused]);

// In JSX:
<div
    onMouseEnter={() => setIsPaused(true)}
    onMouseLeave={() => setIsPaused(false)}
>
\`\`\`

### Q2: How would you add touch/swipe support?

\`\`\`javascript
const [touchStart, setTouchStart] = useState(0);
const [touchEnd, setTouchEnd] = useState(0);

const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
};

const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
};

const handleTouchEnd = () => {
    const swipeDistance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (swipeDistance > minSwipeDistance) {
        next();  // Swiped left → next slide
    } else if (swipeDistance < -minSwipeDistance) {
        prev();  // Swiped right → previous slide
    }
};

// In JSX:
<div
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
>
\`\`\`

### Q3: How would you implement infinite loop with smooth animation?

\`\`\`javascript
// Clone first and last slides
const extendedItems = [items[items.length - 1], ...items, items[0]];
// [Clone of Last, ...originals..., Clone of First]

// Start at index 1 (first real slide)
const [displayIndex, setDisplayIndex] = useState(1);

// When reaching clone, jump without animation
useEffect(() => {
    if (displayIndex === 0) {
        // At clone of last, jump to real last
        setTimeout(() => {
            trackRef.current.style.transition = 'none';
            setDisplayIndex(items.length);
            requestAnimationFrame(() => {
                trackRef.current.style.transition = 'transform 0.3s';
            });
        }, 300);
    }
    // Similar for other direction...
}, [displayIndex]);
\`\`\`

### Q4: How would you accept slides as props?

\`\`\`jsx
function Carousel({ children, autoPlay = false, interval = 3000 }) {
    const slides = React.Children.toArray(children);
    const total = slides.length;
    // ... rest of implementation
}

// Usage:
<Carousel autoPlay interval={5000}>
    <img src="slide1.jpg" alt="Slide 1" />
    <img src="slide2.jpg" alt="Slide 2" />
    <div className="custom-slide">Custom Content</div>
</Carousel>
\`\`\`

### Q5: How would you add keyboard navigation?

\`\`\`javascript
useEffect(() => {
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
\`\`\`

### Q6: How would you implement fade transition instead of slide?

\`\`\`jsx
// Change from translateX to opacity
<div className="carousel-track">
    {items.map((item, index) => (
        <div
            className="carousel-item"
            style={{
                position: 'absolute',
                opacity: index === currentIndex ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out'
            }}
        >
            {item}
        </div>
    ))}
</div>
\`\`\`

---

## Edge Cases to Consider

1. **Single slide** - Hide navigation buttons
2. **Empty slides** - Handle gracefully
3. **Dynamic slides** - Adding/removing slides
4. **Fast clicking** - Prevent animation stacking
5. **Page visibility** - Pause autoplay when tab hidden
6. **Accessibility** - Keyboard navigation, ARIA labels
7. **RTL languages** - Reverse direction
8. **Lazy loading** - Load images as needed

---

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Initial render | O(n) | O(n) |
| Navigation | O(1) | O(1) |
| Dot click | O(1) | O(1) |
| Re-render | O(n) | O(n) |

Where n = number of slides

---

## Performance Optimizations

### 1. Lazy Load Images

\`\`\`jsx
<img
    src={index === currentIndex ? slide.src : undefined}
    data-src={slide.src}
    loading="lazy"
/>
\`\`\`

### 2. Use CSS Transform (GPU Accelerated)

\`\`\`css
/* Good: Uses GPU */
transform: translateX(-100%);

/* Bad: Causes layout recalculation */
left: -100%;
margin-left: -100%;
\`\`\`

### 3. Debounce Rapid Navigation

\`\`\`javascript
const [isAnimating, setIsAnimating] = useState(false);

const next = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => (prev + 1) % total);
    setTimeout(() => setIsAnimating(false), 300);  // Match transition duration
};
\`\`\`

### 4. Preload Adjacent Images

\`\`\`javascript
useEffect(() => {
    // Preload next and previous images
    const nextIndex = (currentIndex + 1) % total;
    const prevIndex = (currentIndex - 1 + total) % total;

    [nextIndex, prevIndex].forEach(idx => {
        const img = new Image();
        img.src = slides[idx].src;
    });
}, [currentIndex]);
\`\`\`

### 5. Use will-change for Animation

\`\`\`css
.carousel-track {
    will-change: transform;  /* Hint to browser */
}
\`\`\`

---

## Real-World Applications

1. **E-commerce** - Product image galleries
2. **Landing Pages** - Hero banners, feature highlights
3. **Portfolios** - Project showcases
4. **Testimonials** - Customer review carousels
5. **News Sites** - Featured article sliders
6. **Mobile Apps** - Onboarding screens
7. **Social Media** - Story viewers, post galleries

---

## Related Patterns

- **Infinite Scroll** - Vertical continuous loading
- **Tabs** - Content switching without animation
- **Accordion** - Expandable content sections
- **Lightbox** - Full-screen image viewer
- **Gallery Grid** - Multiple items visible
- **Thumbnail Strip** - Small preview carousel
`,JS=`# Hierarchical Checkbox Tree

## Problem Statement

Build a **Hierarchical Checkbox Tree** component where checking/unchecking a parent checkbox automatically affects all its descendants, and the parent's state reflects its children's state. This is a classic tree data structure problem with UI synchronization.

This pattern is essential for:
- File/folder permission systems
- Category filters in e-commerce
- Organization hierarchy selection
- Settings panels with grouped options
- Access control interfaces
- Nested todo lists

---

## Requirements

### Functional Requirements

1. **Tree Rendering**
   - Render nested checkbox items recursively
   - Display parent-child relationships visually
   - Support arbitrary depth levels

2. **Downward Propagation**
   - Checking a parent checks ALL descendants
   - Unchecking a parent unchecks ALL descendants

3. **Upward Propagation**
   - Parent becomes checked when ALL children are checked
   - Parent becomes unchecked when ANY child is unchecked

4. **State Management**
   - Maintain flat state object for all nodes
   - Efficient updates without re-rendering entire tree

### Non-Functional Requirements

- Handle deeply nested trees (10+ levels)
- Performant with many nodes (1000+)
- Accessible (keyboard navigation, ARIA)
- Visual hierarchy indication

---

## Visual Representation

\`\`\`
Initial State (all unchecked):
☐ Parent 1
│
├── ☐ Child 1-1
│
└── ☐ Child 1-2

☐ Parent 2
│
└── ☐ Child 2-1
    │
    └── ☐ Grandchild 2-1-1


After checking "Parent 1" (downward propagation):
☑ Parent 1          ← checked
│
├── ☑ Child 1-1     ← auto-checked
│
└── ☑ Child 1-2     ← auto-checked

☐ Parent 2


After checking only "Child 2-1" (upward propagation):
☐ Parent 1

☐ Parent 2          ← still unchecked (not all children checked)
│
└── ☑ Child 2-1     ← checked
    │
    └── ☑ Grandchild 2-1-1  ← auto-checked


After checking all children of Parent 2:
☑ Parent 2          ← auto-checked (all children now checked)
│
└── ☑ Child 2-1
    │
    └── ☑ Grandchild 2-1-1
\`\`\`

---

## Key Concepts & Intuition

### 1. Tree Data Structure

\`\`\`javascript
const treeData = [
  {
    id: 1,
    label: "Parent 1",
    children: [
      { id: 2, label: "Child 1-1" },
      { id: 3, label: "Child 1-2" },
    ],
  },
  {
    id: 4,
    label: "Parent 2",
    children: [
      {
        id: 5,
        label: "Child 2-1",
        children: [
          { id: 6, label: "Grandchild 2-1-1" },
        ],
      },
    ],
  },
];
\`\`\`

### 2. Flat State Object

\`\`\`javascript
// Instead of nested state, use flat object
const [checked, setChecked] = useState({
  1: false,  // Parent 1
  2: false,  // Child 1-1
  3: false,  // Child 1-2
  4: false,  // Parent 2
  5: false,  // Child 2-1
  6: false,  // Grandchild 2-1-1
});
\`\`\`

**Why flat?** Easier to update any node in O(1), avoids deep cloning.

### 3. Initialize State Recursively

\`\`\`javascript
const getInitialChecked = (nodes) => {
  let checked = {};
  nodes.forEach((node) => {
    checked[node.id] = false;
    if (node.children) {
      checked = { ...checked, ...getInitialChecked(node.children) };
    }
  });
  return checked;
};
\`\`\`

### 4. Downward Propagation (Set Descendants)

\`\`\`javascript
const setDescendants = (node, value, checkedState) => {
  checkedState[node.id] = value;
  if (node.children) {
    node.children.forEach((child) => {
      setDescendants(child, value, checkedState);
    });
  }
};
\`\`\`

**Pattern:** DFS traversal - set current node, then recursively set all children.

### 5. Upward Propagation (Update Ancestors)

\`\`\`javascript
const updateAncestors = (node, nodes, checkedState) => {
  for (const parent of nodes) {
    // Check if this parent contains the node as direct child
    if (parent.children?.some((child) => child.id === node.id)) {
      // Parent is checked only if ALL children are checked
      checkedState[parent.id] = parent.children.every(
        (child) => checkedState[child.id]
      );
      // Continue upward
      updateAncestors(parent, treeData, checkedState);
    } else if (parent.children) {
      // Search deeper
      updateAncestors(node, parent.children, checkedState);
    }
  }
};
\`\`\`

**Pattern:** Find parent of changed node, update its state based on children, recurse upward.

### 6. Combined Handler

\`\`\`javascript
const handleCheck = (node, value) => {
  const newChecked = { ...checked };

  // 1. Set this node and all descendants
  setDescendants(node, value, newChecked);

  // 2. Update all ancestors
  updateAncestors(node, treeData, newChecked);

  setChecked(newChecked);
};
\`\`\`

---

## Implementation Tips

### 1. Recursive Component

\`\`\`javascript
function CheckboxTree({ nodes, checked, onCheck }) {
  return (
    <ul>
      {nodes.map((node) => (
        <li key={node.id}>
          <label>
            <input
              type="checkbox"
              checked={checked[node.id]}
              onChange={(e) => onCheck(node, e.target.checked)}
            />
            {node.label}
          </label>
          {node.children && (
            <CheckboxTree
              nodes={node.children}
              checked={checked}
              onCheck={onCheck}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
\`\`\`

### 2. Indeterminate State (Partial Selection)

\`\`\`javascript
// When some but not all children are checked
const isIndeterminate = (node, checkedState) => {
  if (!node.children) return false;

  const checkedCount = node.children.filter(
    (child) => checkedState[child.id]
  ).length;

  return checkedCount > 0 && checkedCount < node.children.length;
};

// Apply to checkbox
<input
  type="checkbox"
  checked={checked[node.id]}
  ref={(el) => {
    if (el) el.indeterminate = isIndeterminate(node, checked);
  }}
/>
\`\`\`

### 3. Visual Hierarchy with CSS

\`\`\`css
.checkbox-tree ul ul {
  padding-left: 24px;
  margin-left: 8px;
  border-left: 1px dashed #ccc;
}
\`\`\`

---

## Common Interview Questions

### Q1: How would you implement indeterminate state?

\`\`\`javascript
// Indeterminate = some children checked, but not all
const getNodeState = (node, checkedState) => {
  if (!node.children) {
    return checkedState[node.id] ? 'checked' : 'unchecked';
  }

  const childStates = node.children.map(c => getNodeState(c, checkedState));
  const allChecked = childStates.every(s => s === 'checked');
  const someChecked = childStates.some(s => s === 'checked' || s === 'indeterminate');

  if (allChecked) return 'checked';
  if (someChecked) return 'indeterminate';
  return 'unchecked';
};
\`\`\`

### Q2: How would you handle async data loading?

\`\`\`javascript
const [expanded, setExpanded] = useState({});
const [loading, setLoading] = useState({});

const handleExpand = async (node) => {
  if (node.children || loading[node.id]) return;

  setLoading(prev => ({ ...prev, [node.id]: true }));
  const children = await fetchChildren(node.id);

  // Update tree data with loaded children
  updateTreeNode(node.id, { children });
  setLoading(prev => ({ ...prev, [node.id]: false }));
  setExpanded(prev => ({ ...prev, [node.id]: true }));
};
\`\`\`

### Q3: How would you optimize for 10,000+ nodes?

\`\`\`javascript
// 1. Virtualization - only render visible nodes
import { VariableSizeList } from 'react-window';

// 2. Flatten tree for virtualized rendering
const flattenTree = (nodes, depth = 0) => {
  return nodes.flatMap(node => [
    { ...node, depth },
    ...(expanded[node.id] && node.children
      ? flattenTree(node.children, depth + 1)
      : [])
  ]);
};

// 3. Memoize expensive calculations
const memoizedFlatten = useMemo(
  () => flattenTree(treeData),
  [treeData, expanded]
);
\`\`\`

### Q4: How would you implement search/filter?

\`\`\`javascript
const [filter, setFilter] = useState('');

const filterTree = (nodes, term) => {
  return nodes.reduce((acc, node) => {
    const matchesLabel = node.label.toLowerCase().includes(term.toLowerCase());
    const filteredChildren = node.children
      ? filterTree(node.children, term)
      : [];

    if (matchesLabel || filteredChildren.length > 0) {
      acc.push({
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : node.children,
      });
    }
    return acc;
  }, []);
};
\`\`\`

### Q5: How would you add drag-and-drop reordering?

\`\`\`javascript
const [draggedNode, setDraggedNode] = useState(null);
const [dropTarget, setDropTarget] = useState(null);

const handleDrop = (targetNode) => {
  // Remove from old location
  // Insert at new location
  // Update tree structure
  const newTree = moveNode(treeData, draggedNode, targetNode);
  setTreeData(newTree);
};
\`\`\`

---

## Edge Cases to Consider

1. **Empty tree** - Handle gracefully
2. **Single node** - No children to propagate
3. **Deep nesting** - 20+ levels deep
4. **Circular references** - Validate tree structure
5. **Duplicate IDs** - Ensure uniqueness
6. **Concurrent updates** - Race conditions
7. **Large trees** - Performance optimization
8. **Accessibility** - Keyboard navigation

---

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Initialize state | O(n) | O(n) |
| Set descendants | O(k) | O(d) |
| Update ancestors | O(d × b) | O(d) |
| Render tree | O(n) | O(d) |

Where n = total nodes, k = descendants count, d = tree depth, b = branching factor

---

## Performance Optimizations

### 1. Memoize Child Components

\`\`\`javascript
const TreeNode = React.memo(({ node, checked, onCheck }) => (
  // ...
));
\`\`\`

### 2. Use Immer for State Updates

\`\`\`javascript
import produce from 'immer';

const handleCheck = (node, value) => {
  setChecked(produce(draft => {
    setDescendants(node, value, draft);
    updateAncestors(node, treeData, draft);
  }));
};
\`\`\`

### 3. Batch State Updates

\`\`\`javascript
// React 18 auto-batches, but for older versions:
import { unstable_batchedUpdates } from 'react-dom';

unstable_batchedUpdates(() => {
  setChecked(newChecked);
  setExpanded(newExpanded);
});
\`\`\`

---

## File Structure

\`\`\`
lld-018-checkbox-hierarchy/
├── CheckboxTree.jsx  # Recursive tree component
├── Solution.jsx      # Main app with state logic
├── data.js           # Sample tree data
├── styles.css        # Tree styling
└── problem.md        # This file
\`\`\`

---

## Real-World Applications

1. **File Systems** - Folder permission checkboxes
2. **E-commerce** - Category filter trees
3. **Admin Panels** - Role/permission management
4. **Settings** - Grouped option toggles
5. **Email** - Folder/label selection
6. **Org Charts** - Department selection
7. **Menu Builders** - Nested menu item selection

---

## Related Patterns

- **Tree Traversal** - DFS, BFS algorithms
- **State Machines** - Checked, unchecked, indeterminate
- **Virtualized Lists** - For large trees
- **Recursive Components** - Self-referencing render
- **Compound Components** - Tree.Node, Tree.Branch
`,e0=`# Knight Shortest Path

Fewest knight moves between two squares on a chessboard.

## Requirements

- The knight moves in an L: two squares one way, then one perpendicular.
- Find the minimum number of moves from start to target.
- Display the route taken, not only its length.

## How it works

Each square is a node; each of the eight legal knight moves is an edge. Every
move costs the same, so **BFS** yields the shortest path — the first time a
square is dequeued, it was reached in the minimum number of moves.

Crucially the knight **jumps**: intermediate squares are irrelevant, so each
move is a single edge to a single destination. (Contrast with the Rook, where
one move can span many squares and needs a slide.)

Each square records the square it was reached from, and the path is rebuilt by
walking those links backwards from the target.

## Interview traps

- Using DFS. It finds *a* path, not the *shortest* one.
- Forgetting the visited set — the knight's graph has cycles everywhere.
- Off-by-one board bounds on all eight offsets.
`,n0=`# Rook Shortest Path

Fewest rook moves between two squares, with blocked squares in the way.

## Requirements

- The rook slides any distance horizontally or vertically.
- One slide, however long, counts as **one move**.
- Blocked squares stop a slide; find the minimum number of moves.

## How it works

Still BFS, but the edge definition differs from the Knight's. A single rook
move reaches **every** square along a ray, so expanding a node means sliding in
all four directions and enqueueing each square passed through.

One subtlety worth stating in an interview: when sliding, you must **keep going
through already-visited squares**. A visited square only means "we know the
cheapest way to stop here" — the rook can still pass over it to reach an
unvisited square further along. Stopping the slide at the first visited cell
silently produces wrong answers on some boards.

## Interview traps

- Treating each step of a slide as a separate move — that solves a different
  problem (king/grid distance).
- Halting a slide at a visited square, as above.
- Not stopping *before* a blocked square.
`,t0=`# Circle Collision Detection

## Problem Statement

Build an interactive canvas where users can click to place circles. Circles should detect collisions with other circles and change color to indicate overlap. This demonstrates fundamental collision detection algorithms used in games and physics simulations.

This pattern is essential for:
- Game development (character/object collisions)
- Physics simulations
- Drag-and-drop interfaces with collision awareness
- Interactive data visualizations
- UI element overlap detection

---

## Requirements

### Functional Requirements

1. **Circle Placement**
   - Click anywhere on the canvas to place a circle
   - Circle appears centered at click position
   - Each circle has a fixed radius (50px)

2. **Collision Detection**
   - Detect when circles overlap
   - Check new circle against all existing circles
   - Re-check all circles when a new one is added

3. **Visual Feedback**
   - Non-colliding circles are blue
   - Colliding circles turn red
   - Both overlapping circles should be red

4. **State Management**
   - Track all circles with their positions
   - Update colors based on collision state
   - Each circle needs unique identifier

### Non-Functional Requirements

- Smooth placement without lag
- Accurate collision detection
- Clean visual representation
- Responsive to container size

---

## Visual Representation

\`\`\`
Initial State (Empty Canvas):
+------------------------------------------+
|                                          |
|                                          |
|                                          |
|        Click anywhere to place           |
|               a circle                   |
|                                          |
|                                          |
+------------------------------------------+

After First Click:
+------------------------------------------+
|                                          |
|         ┌─────────┐                      |
|         │  BLUE   │                      |
|         │    ●    │  <- No collision     |
|         │         │                      |
|         └─────────┘                      |
|                                          |
+------------------------------------------+

After Second Click (No Collision):
+------------------------------------------+
|                                          |
|    ┌─────────┐          ┌─────────┐     |
|    │  BLUE   │          │  BLUE   │     |
|    │    ●    │          │    ●    │     |
|    │         │          │         │     |
|    └─────────┘          └─────────┘     |
|                                          |
+------------------------------------------+

After Third Click (Collision!):
+------------------------------------------+
|                                          |
|    ┌─────────┐    ┌─────────┐           |
|    │  BLUE   │    │   RED   │           |
|    │    ●    │    │    ●────┼───┐       |
|    │         │    │         │RED│       |
|    └─────────┘    └─────────┼───┘       |
|                             └───┘        |
|         distance < r1 + r2 = COLLISION   |
+------------------------------------------+
\`\`\`

---

## Key Concepts & Intuition

### 1. Euclidean Distance Formula

\`\`\`javascript
// Distance between two points in 2D space
function getDistance(c1, c2) {
    const dx = c1.x - c2.x;  // Horizontal distance
    const dy = c1.y - c2.y;  // Vertical distance
    return Math.sqrt(dx * dx + dy * dy);  // Pythagorean theorem
}
\`\`\`

\`\`\`
        c1 (x1, y1)
         ●
         |\\
         | \\
      dy |  \\ distance
         |   \\
         |____\\
              ● c2 (x2, y2)
           dx

distance = √(dx² + dy²)
\`\`\`

### 2. Circle Collision Condition

\`\`\`javascript
function isColliding(c1, c2) {
    const distance = getDistance(c1, c2);
    return distance < c1.r + c2.r;  // Sum of radii
}
\`\`\`

\`\`\`
No Collision (distance > r1 + r2):
    ●───────────●
   r1    gap    r2

Touching (distance = r1 + r2):
    ●─────●
   r1    r2

Collision (distance < r1 + r2):
    ●──●
   r1 r2  (overlapping)
\`\`\`

### 3. Coordinate Transformation

\`\`\`javascript
function handleClick(e) {
    const rect = containerRef.current.getBoundingClientRect();

    // Convert viewport coordinates to container-relative
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
}
\`\`\`

\`\`\`
Viewport (screen):           Container (relative):
+------------------+         +------------------+
| Browser          |         | (0,0)            |
|   +----------+   |         |   ●              |
|   | Container|   |   -->   |  (x,y)           |
|   |    ●     |   |         |                  |
|   +----------+   |         +------------------+
+------------------+

x = clientX - rect.left
y = clientY - rect.top
\`\`\`

### 4. O(n²) Collision Check

\`\`\`javascript
// Check every circle against every other circle
return updatedCircles.map(circle => {
    let hasCollision = false;

    for (let other of updatedCircles) {
        if (circle.id === other.id) continue;  // Skip self

        if (isColliding(circle, other)) {
            hasCollision = true;
            break;  // One collision is enough
        }
    }

    return { ...circle, color: hasCollision ? 'red' : 'blue' };
});
\`\`\`

### 5. Functional State Update

\`\`\`javascript
setCircles(prevCircles => {
    // 1. Add new circle
    const updatedCircles = [...prevCircles, newCircle];

    // 2. Recalculate collisions for ALL circles
    return updatedCircles.map(circle => ({
        ...circle,
        color: checkCollision(circle, updatedCircles) ? 'red' : 'blue'
    }));
});
\`\`\`

**Why functional update?**
- Access previous state correctly
- Avoid stale closure issues
- Atomic update (add + recalculate in one render)

---

## Implementation Tips

### 1. Circle Data Structure

\`\`\`javascript
const circle = {
    id: Date.now(),     // Unique identifier
    x: 150,             // Center X coordinate
    y: 200,             // Center Y coordinate
    r: 50,              // Radius
    color: 'blue'       // 'blue' or 'red'
};
\`\`\`

### 2. Rendering Circles with CSS

\`\`\`jsx
<div
    className="circle"
    style={{
        left: circle.x - circle.r,    // Position from top-left
        top: circle.y - circle.r,
        width: circle.r * 2,          // Diameter
        height: circle.r * 2,
        background: circle.color,
        borderRadius: '50%',
        position: 'absolute'
    }}
/>
\`\`\`

### 3. Container Setup

\`\`\`jsx
<div
    ref={containerRef}
    className="canvas"
    onClick={handleClick}
    style={{
        position: 'relative',  // For absolute children
        width: '100%',
        height: '400px',
        border: '1px solid #ccc'
    }}
>
\`\`\`

### 4. Unique IDs

\`\`\`javascript
// Simple: timestamp (may collide with rapid clicks)
id: Date.now()

// Better: timestamp + random
id: Date.now() + Math.random()

// Best: UUID or incrementing counter
id: crypto.randomUUID()
\`\`\`

---

## Common Interview Questions

### Q1: Why check all circles after adding a new one?

**Answer:** When a new circle is added, it might collide with an existing blue circle, turning both red. But also, adding a circle doesn't change existing collision states—so we could optimize by only checking the new circle. However, for simplicity and correctness, rechecking all ensures consistent state.

### Q2: How would you optimize for thousands of circles?

**Answer:** Use spatial partitioning:

\`\`\`javascript
// Quadtree: Divide space into quadrants
class Quadtree {
    constructor(bounds, capacity = 4) {
        this.bounds = bounds;
        this.capacity = capacity;
        this.circles = [];
        this.divided = false;
    }

    // Only check circles in nearby quadrants
    query(range) { /* ... */ }
}

// Grid-based: Divide into cells
const grid = new Map();  // cellKey -> circles[]
const cellSize = 100;    // Larger than max circle diameter

function getCellKey(x, y) {
    return \`\${Math.floor(x / cellSize)},\${Math.floor(y / cellSize)}\`;
}
\`\`\`

### Q3: How would you implement draggable circles?

\`\`\`javascript
const [dragging, setDragging] = useState(null);

const handleMouseDown = (circleId) => setDragging(circleId);

const handleMouseMove = (e) => {
    if (!dragging) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCircles(prev => prev.map(c =>
        c.id === dragging ? { ...c, x, y } : c
    ));

    // Recalculate collisions
    recalculateCollisions();
};

const handleMouseUp = () => setDragging(null);
\`\`\`

### Q4: How would you handle circles of different sizes?

\`\`\`javascript
const handleClick = (e) => {
    const radius = Math.random() * 40 + 20;  // 20-60px

    const newCircle = {
        id: Date.now(),
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        r: radius,  // Variable radius
        color: 'blue'
    };
    // ... collision detection works the same
};
\`\`\`

### Q5: How would you implement circle removal on click?

\`\`\`javascript
const handleCircleClick = (e, circleId) => {
    e.stopPropagation();  // Don't place new circle

    setCircles(prev => {
        const filtered = prev.filter(c => c.id !== circleId);
        // Recalculate: removed circle's partners may no longer collide
        return filtered.map(c => ({
            ...c,
            color: checkCollision(c, filtered) ? 'red' : 'blue'
        }));
    });
};
\`\`\`

### Q6: How would you animate collision response?

\`\`\`javascript
// Bounce circles apart on collision
function resolveCollision(c1, c2) {
    const dx = c2.x - c1.x;
    const dy = c2.y - c1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Overlap amount
    const overlap = (c1.r + c2.r) - distance;

    // Normalize direction
    const nx = dx / distance;
    const ny = dy / distance;

    // Push apart
    c1.x -= nx * overlap / 2;
    c1.y -= ny * overlap / 2;
    c2.x += nx * overlap / 2;
    c2.y += ny * overlap / 2;
}
\`\`\`

---

## Edge Cases to Consider

1. **Exact overlap** - Circles placed at same position
2. **Boundary circles** - Circle extends outside container
3. **Rapid clicks** - Multiple circles added quickly
4. **Chain collisions** - A collides with B, B collides with C
5. **Touch events** - Mobile support
6. **Circle removal** - Update collision state of remaining
7. **Large circles** - Radius larger than container
8. **Zero distance** - Division by zero in direction calculation

---

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Add circle | O(n) | O(1) |
| Check single collision | O(1) | O(1) |
| Check all collisions | O(n²) | O(1) |
| Render | O(n) | O(n) |

Where n = number of circles

### Optimization with Spatial Partitioning

| Operation | Naive | Quadtree | Grid |
|-----------|-------|----------|------|
| Add | O(n) | O(log n) | O(1) |
| Check all | O(n²) | O(n log n) | O(n × k) |

Where k = average circles per cell

---

## Performance Optimizations

### 1. Early Exit on Collision

\`\`\`javascript
for (let other of circles) {
    if (isColliding(circle, other)) {
        return true;  // Don't check remaining
    }
}
\`\`\`

### 2. Skip Redundant Checks

\`\`\`javascript
// Only check pairs once
for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {  // j starts at i+1
        if (isColliding(circles[i], circles[j])) {
            circles[i].colliding = true;
            circles[j].colliding = true;
        }
    }
}
\`\`\`

### 3. Squared Distance (Avoid sqrt)

\`\`\`javascript
function isCollidingFast(c1, c2) {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const distanceSquared = dx * dx + dy * dy;
    const radiusSum = c1.r + c2.r;
    return distanceSquared < radiusSum * radiusSum;  // No sqrt!
}
\`\`\`

### 4. RequestAnimationFrame for Drag

\`\`\`javascript
const handleMouseMove = (e) => {
    if (!dragging) return;

    requestAnimationFrame(() => {
        // Update position and check collisions
    });
};
\`\`\`

---

## Real-World Applications

1. **Game Development** - Character collision, bullet detection
2. **Physics Engines** - Ball simulations, particle systems
3. **CAD Software** - Component overlap detection
4. **Map Applications** - Marker clustering, overlap prevention
5. **UI Libraries** - Tooltip/popover positioning
6. **Data Visualization** - Force-directed graphs, bubble charts

---

## Related Patterns

- **AABB Collision** - Axis-Aligned Bounding Box (rectangles)
- **Spatial Hashing** - Grid-based collision optimization
- **Quadtree** - Hierarchical spatial partitioning
- **Sweep and Prune** - Sorting-based broad phase
- **Physics Simulation** - Velocity, mass, bounce response
`,r0=`# Connect 4

Two players drop discs into a 7-column grid; first to line up four in a row
wins.

## Requirements

- Clicking a column drops a disc to the **lowest empty row** in that column.
- Players alternate; the game announces a winner and stops accepting moves.
- Wins count horizontally, vertically, and on both diagonals.

## How it works

Gravity is a single scan from the bottom row upward for the first empty cell.

Win detection avoids rescanning the whole board. Because a win must involve the
disc just played, it only counts outward from that one cell:

\`\`\`
total = 1 + count(direction) + count(opposite direction)
\`\`\`

Four directions are checked — horizontal, vertical, and the two diagonals —
each walking outward while cells match the current player. That is O(1) work
per move instead of O(rows × cols).

## Interview traps

- Only checking the four "forward" directions misses wins extending backwards;
  each direction must be counted **both ways** from the placed disc.
- A full board with no winner is a draw — easy to forget.
- Board size is parameterised (\`rows\`, \`cols\`), so nothing may hardcode 6×7.
`,i0=`# Data Table

A table with text filtering, column sorting, and pagination working together.

## Requirements

- The filter box matches against name or role, case-insensitively.
- Clicking a column header sorts by it; clicking the same header again flips
  the direction.
- Results are paginated; page controls reflect the filtered/sorted set.

## How it works

The three operations form a strict pipeline, and **the order matters**:

\`\`\`
filter  ->  sort  ->  paginate
\`\`\`

Filtering first means sorting and pagination only ever see relevant rows.
Paginating last means page 2 shows the second page of the *final* result set.
Sorting before filtering would waste work; paginating before filtering would
produce pages with wildly varying sizes.

Note the sort copies the array (\`[...filtered].sort()\`) — \`Array.sort\` mutates
in place, and mutating derived state is how subtle rendering bugs start.

## Interview traps

- **Stale page index.** Filtering down to fewer pages while sitting on page 5
  leaves you on an empty page unless the page resets.
- Sorting mixed types (\`age\` numeric vs \`name\` string) with one comparator
  works here because \`<\`/\`>\` handle both, but it breaks on \`null\`.
- Derived state should be computed during render, not mirrored into \`useState\`.
`,o0=`# Debounce

\`debounce(fn, delay)\` returns a wrapped function that postpones calling \`fn\`
until \`delay\` ms have elapsed since the **last** call. Rapid successive calls
collapse into a single invocation.

## How to see it work

Click the button rapidly in the Preview tab. The raw counter increments on
every click; the debounced counter increments **once**, 500ms after you stop.

## How it works

The pending timer id lives in a closure variable. Every call clears the
previous timer before scheduling a new one, so only the final call in a burst
ever fires.

The returned wrapper is a regular \`function\`, not an arrow — that keeps \`this\`
dynamic so it can be forwarded with \`fn.apply(this, args)\`. An arrow function
would capture \`this\` from the definition site instead, breaking method usage
like \`obj.debouncedMethod()\`.

## Debounce vs. throttle

Debounce waits for the activity to *stop* — good for search-as-you-type or
resize handlers. Throttle fires at a steady maximum rate *during* activity —
good for scroll position tracking.
`,s0=`# Drawing Board

## Problem Statement

Build a canvas-based freehand drawing tool with pen, eraser, color picker, and brush size controls. Adobe and Google ask this to test Canvas API knowledge and mouse/touch event handling.

## Requirements

1. **Freehand drawing** — mouse drag draws a smooth stroke
2. **Eraser** — overwrites strokes with white
3. **Color palette** + custom color picker
4. **Brush size slider**
5. **Clear canvas** button
6. **Save as PNG** (bonus — tests \`toDataURL\`)
7. Touch support (\`onTouchStart/Move/End\`)

## Key Interview Points

### Core drawing loop
\`\`\`js
// Store last position, draw line segment on each mouse move
const lastPos = useRef(null);

function startDraw(e) {
  drawing = true;
  lastPos.current = getPos(e);
}

function draw(e) {
  if (!drawing) return;
  const pos = getPos(e);
  ctx.beginPath();
  ctx.moveTo(lastPos.current.x, lastPos.current.y);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  lastPos.current = pos;
}
\`\`\`

Why \`moveTo → lineTo\` instead of just \`lineTo\`: each \`mousemove\` fires fast but not continuously — drawing line *segments* from last to current gives a smooth stroke. Just \`arc\` on each point creates dots, not lines.

### Getting position relative to canvas
\`\`\`js
function getCanvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}
\`\`\`
\`e.offsetX/offsetY\` breaks when child elements exist inside the canvas container.

### Eraser = draw in white
\`\`\`js
ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
ctx.lineWidth  = tool === "eraser" ? 24 : size;
\`\`\`

### Download canvas
\`\`\`js
const link = document.createElement("a");
link.download = "drawing.png";
link.href = canvas.toDataURL(); // base64 PNG
link.click();
\`\`\`

### Touch support
\`\`\`jsx
onTouchStart={startDraw}
onTouchMove={draw}
onTouchEnd={stopDraw}
// In getPos: e.touches ? e.touches[0].clientX : e.clientX
\`\`\`
Also set \`touchAction: "none"\` on the canvas to prevent scroll while drawing.

## What interviewers look for

- \`lineTo\` approach (not \`arc\` per point)
- \`lastPos.current\` as a ref, not state (ref avoids re-renders on every mouse move)
- Correct \`getBoundingClientRect()\` offset calculation
- \`lineCap: "round"\` and \`lineJoin: "round"\` for smooth edges
- \`onMouseLeave\` → \`stopDraw\` (strokes don't ghost when cursor leaves canvas)`,a0=`# File Explorer with Drag & Drop

## Problem Statement

Build a **File Explorer** component that renders a nested tree of files and folders, and allows users to **drag any node (file or folder) and drop it into a different folder** to move it.

---

## Requirements

### Functional
- Render a nested file/folder tree recursively
- Click a folder to expand/collapse it
- Drag any file or folder to a different folder to move it
- A folder cannot be dropped into itself or its own descendant

### Non-Functional
- Visual feedback: highlight the drop target while dragging
- Dragged node appears faded while in flight
- Empty folders show a placeholder

---

## Visual Representation

\`\`\`
📂 root
  📂 public
    📄 index.html       ← drag this...
    📄 robots.txt
  📂 src
    📂 components       ← ...drop here → index.html moves into components
      📄 Header.js
      📄 Footer.js
    📄 App.js
  📄 package.json
\`\`\`

---

## Key Concepts

### 1. State Design

\`\`\`
tree       — the full nested tree (single source of truth)
draggedId  — id of the node being dragged (null when idle)
\`\`\`

Why store only \`draggedId\` instead of the full node object?
The node already lives in the tree. We don't need a copy — just an id to locate it.

### 2. Drag & Drop — 3 Events That Matter

| Event | Where | What it does |
|---|---|---|
| \`onDragStart\` | any node | records which node is being dragged |
| \`onDragOver\` | folder only | calls \`e.preventDefault()\` to allow drop |
| \`onDrop\` | folder only | triggers the move with \`(draggedId → destinationId)\` |

> \`e.preventDefault()\` in \`onDragOver\` is mandatory — without it, drop events don't fire.

### 3. Tree Mutation — Two Pure Functions

\`\`\`
removeNode(tree, id)  → [newTree, removedNode]   // find and extract the node
insertNode(tree, destinationId, node)  → newTree  // append node into target folder
moveNode = removeNode + insertNode + validation
\`\`\`

All functions return a new tree — never mutate state directly.

### 4. Validation — Prevent Invalid Drops

\`\`\`
draggedId === destinationId         → can't drop into itself
isDescendant(tree, draggedId, destId) → can't drop into own child/grandchild
\`\`\`

### 5. stopPropagation — Critical for Nested DnD

\`\`\`jsx
onDragStart: e.stopPropagation()  // only the innermost node fires dragStart
onDrop: e.stopPropagation()       // only the innermost folder receives the drop
\`\`\`

Without this, every ancestor folder also fires — causing the wrong node to be
recorded as dragged, or the wrong folder to receive the drop.

---

## Interview Follow-Up Questions

**Q: How would you support dropping a file between nodes (not just into a folder)?**

Track drop position (before/after a node) using \`getBoundingClientRect()\` on dragOver.
Compare \`e.clientY\` to the node's midpoint to determine above/below.

**Q: How would you persist the tree to a backend?**

On every successful move, POST the updated tree or just the delta
\`{ movedId, destinationId }\` to an API. Optimistic update locally, rollback on error.

**Q: How would you handle 10,000+ nodes?**

Virtualize the visible list using \`react-window\`. Flatten the tree into a visible
array (respecting expand/collapse state), render only the rows in the viewport.

**Q: What if two users move the same file simultaneously?**

Last-write-wins for simple cases. For conflict resolution: operational transforms
or CRDTs — same pattern as collaborative editors.

---

## Complexity

| Operation | Time | Space |
|---|---|---|
| removeNode | O(n) | O(d) — recursion depth |
| insertNode | O(n) | O(d) |
| isDescendant | O(n) | O(d) |
| Full move | O(n) | O(d) |

n = total nodes, d = tree depth
`,l0=`# File Explorer / Folder Tree

## Problem Statement

Build a **File Explorer** component that displays a hierarchical folder structure with the ability to expand/collapse folders and add new files/folders.

## Requirements

### Core Features
1. Display nested folder/file structure
2. Expand/collapse folders on click
3. Add new folders within existing folders
4. Add new files within folders
5. Visual differentiation between files and folders

### User Interactions
- Click folder → expand/collapse
- Click "Folder +" → add new folder (input appears)
- Click "File +" → add new file (input appears)
- Press Enter in input → create item
- Click outside input (blur) → cancel creation

## Visual Representation

\`\`\`
📂 root
├── 📁 public (click to expand)
│   ├── 📄 index.html
│   └── 📄 robots.txt
├── 📂 src (expanded)
│   ├── 📁 components
│   │   └── 📄 Header.js
│   └── 📄 App.js
│   [Folder +] [File +]     ← Action buttons
│   ┌─────────────────┐
│   │ 📁 [new folder] │     ← Input for new folder
│   └─────────────────┘
\`\`\`

## Key Concepts & Intuition

### 1. Recursive Tree Structure

The data structure is **self-referential** - each folder contains items that can themselves be folders:

\`\`\`javascript
{
  id: "1",
  name: "root",
  isFolder: true,
  items: [                    // Children array
    {
      id: "2",
      name: "src",
      isFolder: true,
      items: [...]            // Nested children
    },
    {
      id: "3",
      name: "index.js",
      isFolder: false,
      items: []               // Files have empty items
    }
  ]
}
\`\`\`

### 2. Recursive Component Pattern

The \`Folder\` component renders itself for each child - this is the **recursive component pattern**:

\`\`\`jsx
function Folder({ explorerData }) {
  return (
    <div>
      {explorerData.name}
      {explorerData.items.map(item => (
        <Folder key={item.id} explorerData={item} />  // Recursion!
      ))}
    </div>
  );
}
\`\`\`

**Base Case:** When \`items\` is empty or component is a file
**Recursive Case:** When \`isFolder: true\` and has items

### 3. Tree Traversal for Mutations

To insert a node, we must **traverse the entire tree** to find the target folder:

\`\`\`javascript
function insertNode(tree, targetId, newItem, isFolder) {
  // Deep clone to avoid mutation
  const copy = structuredClone(tree);

  function traverse(node) {
    // Found the target folder
    if (node.id === targetId && node.isFolder) {
      node.items.unshift(newItem);
      return true;
    }
    // Keep searching in children
    for (let child of node.items) {
      if (traverse(child)) return true;
    }
    return false;
  }

  traverse(copy);
  return copy;
}
\`\`\`

### 4. State Lifting Pattern

State is managed at the **top level** (\`App\`) and passed down via props:

\`\`\`
      App (holds explorerData state)
        │
        ▼ passes handleInsertNode
      Folder
        │
        ▼ passes handleInsertNode
      Folder (child)
        │
        ▼ calls handleInsertNode(folderId, name, isFolder)
      ...
\`\`\`

## Implementation Tips

### Component State Structure

\`\`\`javascript
// Each Folder manages its own UI state
const [expanded, setExpanded] = useState(false);
const [folderState, setFolderState] = useState({
  isVisible: false,  // Is input field shown?
  isFolder: null     // Creating folder or file?
});
\`\`\`

### Event Propagation

Use \`stopPropagation()\` to prevent button clicks from triggering folder expand/collapse:

\`\`\`jsx
<button onClick={(e) => {
  e.stopPropagation();  // Don't expand folder
  handleAdd(true);      // Show folder input
}}>
  Folder +
</button>
\`\`\`

### Key Press Handling

\`\`\`javascript
const handleFileName = (e) => {
  if (e.keyCode === 13) {  // Enter key
    handleInsertNode(folderId, e.target.value, isFolder);
    hideInput();
  }
};
\`\`\`

## Data Flow Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                         App                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  explorerData: { id, name, isFolder, items: [...] } │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                   │
│                   handleInsertNode                           │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              insertNode(tree, id, name)              │   │
│  │                    (Deep Clone)                      │   │
│  │                    (Traverse)                        │   │
│  │                    (Insert)                          │   │
│  │                    (Return new tree)                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                   │
│                   setExplorerData                            │
│                          │                                   │
│                          ▼                                   │
│                    Re-render tree                            │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Common Interview Questions

1. **Why use \`structuredClone\` instead of spread operator?**
   - Spread is shallow - nested objects still share references
   - \`structuredClone\` creates a true deep copy
   - Ensures immutability for React state updates

2. **Why manage expanded state locally in each Folder?**
   - Each folder independently tracks if it's expanded
   - No need to lift this state - it's purely local UI concern
   - Better performance (only re-renders affected folder)

3. **How would you implement delete?**
   - Similar tree traversal
   - Filter out node with matching ID
   - Return new tree without the deleted node

4. **How would you implement rename?**
   - Find node by ID
   - Update the \`name\` property
   - Return modified tree

## Edge Cases to Handle

- [ ] Empty folder name - prevent creation
- [ ] Duplicate names - allow or warn?
- [ ] Deep nesting - UI indentation
- [ ] Special characters in names
- [ ] Very long file/folder names

## Potential Extensions

1. **Delete files/folders**
2. **Rename files/folders**
3. **Drag and drop** to move items
4. **Search** within file tree
5. **File icons** based on extension
6. **Lazy loading** for large trees

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Insert Node | O(n) | O(n) |
| Render Tree | O(n) | O(h) |
| Toggle Expand | O(1) | O(1) |

Where n = total nodes, h = tree height (recursion stack)
`,c0=`# Grid Lights - Understanding the Code

## What Are We Building?

Imagine a 3×3 grid of light switches (but the center one is missing!). When you click a light, it turns green. Once ALL lights are green, they automatically turn off one by one in **reverse order** - like rewinding a video!

Think of it like this: You're turning on Christmas lights, and once they're all on, they turn off in the reverse order you turned them on, creating a satisfying "undo" animation.

---

## The Problem Statement

Build a 3×3 grid of cells (8 cells total, center is omitted):

\`\`\`
[ ] [ ] [ ]
[ ] [X] [ ]    X = center (omitted)
[ ] [ ] [ ]
\`\`\`

**Requirements:**
1. Click a cell → it turns green (activated)
2. Once ALL cells are green → they deactivate in **reverse order**
3. Deactivation has a **300ms delay** between each cell
4. You cannot click cells during deactivation animation

---

## Visual Example

**Step 1:** User clicks cells in this order:
\`\`\`
[1] [2] [3]
[4] [X] [5]
[6] [7] [8]
\`\`\`

**Step 2:** All cells are green!

**Step 3:** Auto-deactivation (reverse order with 300ms delay):
\`\`\`
Turn off 8 → wait 300ms
Turn off 7 → wait 300ms
Turn off 6 → wait 300ms
Turn off 5 → wait 300ms
Turn off 4 → wait 300ms
Turn off 3 → wait 300ms
Turn off 2 → wait 300ms
Turn off 1 → done!
\`\`\`

---

## The Challenge: State Management

### Challenge 1: How Do We Track Click Order?

**Wrong Approach:**
\`\`\`javascript
const [activated, setActivated] = useState({
  0: false, 1: false, 2: false,
  3: false, /* skip 4 */, 5: false,
  6: false, 7: false, 8: false
})
\`\`\`

**Problem:** This tells us WHICH cells are active, but not the ORDER they were clicked!

**Correct Approach:**
\`\`\`javascript
const [activationOrder, setActivationOrder] = useState([])
// Example: [0, 3, 7, 1, ...] means cell 0 was clicked first, then 3, then 7, etc.
\`\`\`

---

## Key Concepts Explained

### 1. Grid Indexing (Omitting Center)

A 3×3 grid has 9 positions (0-8):
\`\`\`
[0] [1] [2]
[3] [4] [5]
[6] [7] [8]
\`\`\`

But we omit index 4 (center), so valid cells are: \`[0, 1, 2, 3, 5, 6, 7, 8]\`

**How to check if a cell is the center:**
\`\`\`javascript
const isCenter = (index) => index === 4
\`\`\`

---

### 2. Tracking Activation Order

We use an **array** to store the order:

\`\`\`javascript
const [activationOrder, setActivationOrder] = useState([])

// User clicks cell 0 → [0]
// User clicks cell 7 → [0, 7]
// User clicks cell 3 → [0, 7, 3]
\`\`\`

**Why an array?**
- Preserves order (objects don't)
- Easy to check: "Is cell 5 activated?" → \`activationOrder.includes(5)\`
- Easy to reverse: \`[...activationOrder].reverse()\`

---

### 3. The Deactivation Animation

Once all 8 cells are activated, we need to:
1. Reverse the order: \`[0, 7, 3, 1, 5, 2, 8, 6]\` → \`[6, 8, 2, 5, 1, 3, 7, 0]\`
2. Remove one cell every 300ms

**Using setTimeout:**
\`\`\`javascript
const deactivate = () => {
  const reversed = [...activationOrder].reverse()

  reversed.forEach((cellIndex, i) => {
    setTimeout(() => {
      // Remove this cell from activationOrder
      setActivationOrder(current => current.filter(idx => idx !== cellIndex))
    }, i * 300)  // 0ms, 300ms, 600ms, 900ms, ...
  })
}
\`\`\`

**The Math:**
- Cell at position 0 in reversed array: \`i = 0\` → \`0 * 300 = 0ms\` (immediate)
- Cell at position 1: \`i = 1\` → \`1 * 300 = 300ms\`
- Cell at position 2: \`i = 2\` → \`2 * 300 = 600ms\`
- ...and so on

---

### 4. Preventing Clicks During Animation

**Problem:** User might click during deactivation, breaking the animation!

**Solution:** Track animation state

\`\`\`javascript
const [isDeactivating, setIsDeactivating] = useState(false)

const handleCellClick = (index) => {
  if (isDeactivating) return  // ✅ Block clicks during animation

  // ... rest of logic
}
\`\`\`

---

## The Algorithm (Step-by-Step)

### Step 1: Render the Grid

\`\`\`javascript
const grid = [0, 1, 2, 3, 4, 5, 6, 7, 8]

return (
  <div className="grid">
    {grid.map(index => {
      if (index === 4) {
        return <div key={index} className="empty-cell" />  // Center is empty
      }

      const isActive = activationOrder.includes(index)

      return (
        <div
          key={index}
          className={\`cell \${isActive ? 'active' : ''}\`}
          onClick={() => handleCellClick(index)}
        />
      )
    })}
  </div>
)
\`\`\`

---

### Step 2: Handle Cell Clicks

\`\`\`javascript
const handleCellClick = (index) => {
  // Guard: Don't allow clicks during animation
  if (isDeactivating) return

  // Guard: Cell is already activated
  if (activationOrder.includes(index)) return

  // Add cell to activation order
  const newOrder = [...activationOrder, index]
  setActivationOrder(newOrder)

  // Check if all cells are now activated
  if (newOrder.length === 8) {  // 8 cells (excluding center)
    startDeactivation(newOrder)
  }
}
\`\`\`

---

### Step 3: Deactivation Animation

\`\`\`javascript
const startDeactivation = (order) => {
  setIsDeactivating(true)

  const reversed = [...order].reverse()

  reversed.forEach((cellIndex, i) => {
    setTimeout(() => {
      setActivationOrder(current =>
        current.filter(idx => idx !== cellIndex)
      )

      // If this is the last cell, re-enable clicks
      if (i === reversed.length - 1) {
        setIsDeactivating(false)
      }
    }, i * 300)
  })
}
\`\`\`

---

## Edge Cases to Handle

### Edge Case 1: User Clicks Same Cell Twice

**Problem:** Cell gets added to array twice!

**Solution:** Check before adding
\`\`\`javascript
if (activationOrder.includes(index)) return  // Already activated
\`\`\`

---

### Edge Case 2: User Clicks During Deactivation

**Problem:** Animation breaks, order gets messed up

**Solution:** Block all clicks
\`\`\`javascript
if (isDeactivating) return  // Animation in progress
\`\`\`

---

### Edge Case 3: User Clicks Center Cell

**Problem:** Center should not be clickable!

**Solution:** Don't render a clickable cell there
\`\`\`javascript
if (index === 4) {
  return <div key={index} />  // Not clickable
}
\`\`\`

---

## Common Mistakes (Learn from These!)

### ❌ Mistake 1: Using Object for State

\`\`\`javascript
// ❌ WRONG: Loses order information
const [cells, setCells] = useState({
  0: false, 1: false, ...
})
\`\`\`

**Why it fails:** You can't tell which cell was clicked first!

**Fix:** Use an array to track order:
\`\`\`javascript
const [activationOrder, setActivationOrder] = useState([])
\`\`\`

---

### ❌ Mistake 2: Not Blocking Clicks During Animation

\`\`\`javascript
const handleCellClick = (index) => {
  // ❌ Missing guard!
  setActivationOrder([...activationOrder, index])
}
\`\`\`

**Result:** User can click during deactivation → chaos!

**Fix:**
\`\`\`javascript
if (isDeactivating) return
\`\`\`

---

### ❌ Mistake 3: Wrong setTimeout Logic

\`\`\`javascript
// ❌ WRONG: All setTimeout calls use same 'i'
for (let i = 0; i < reversed.length; i++) {
  setTimeout(() => {
    deactivate(reversed[i])  // 'i' is always the last value!
  }, i * 300)
}
\`\`\`

**Why it fails:** JavaScript closures! \`i\` is the same variable.

**Fix:** Use \`forEach\` or pass \`i\` correctly:
\`\`\`javascript
reversed.forEach((cell, i) => {
  setTimeout(() => deactivate(cell), i * 300)
})
\`\`\`

---

### ❌ Mistake 4: Forgetting to Re-enable Clicks

\`\`\`javascript
const startDeactivation = () => {
  setIsDeactivating(true)
  // ... animation ...
  // ❌ Forgot to set back to false!
}
\`\`\`

**Result:** After animation, all clicks are permanently blocked!

**Fix:** Set \`isDeactivating\` back to \`false\` when done.

---

## Complexity Analysis

### Time Complexity
- **Rendering grid:** O(9) = O(1) (constant 9 cells)
- **Click handler:** O(n) where n = cells activated (check if includes)
- **Deactivation:** O(n) where n = 8 cells
- **Overall:** O(n) but n is constant (8), so effectively **O(1)**

### Space Complexity
- **activationOrder array:** O(n) where n ≤ 8
- **Timers:** O(n) for setTimeout references
- **Overall:** O(n) but n ≤ 8, so effectively **O(1)**

---

## Interview Tips

### What to Explain

1. **Why use an array for state?** Order matters!
2. **Why block clicks during animation?** Prevent race conditions
3. **How setTimeout works with forEach:** Each iteration gets its own closure
4. **Why filter instead of pop?** Safer state update (immutable)

### What Interviewers Look For

- Do you handle edge cases? (same cell clicked twice, center cell, clicks during animation)
- Do you explain your state management choice?
- Do you test the animation visually?
- Do you write clean, readable code?

### Follow-Up Questions You Might Get

**Q: What if grid is 5×5 instead of 3×3?**
A: Same logic, just change the grid size and omit center index calculation: \`Math.floor(size * size / 2)\`

**Q: What if we want different delay (not 300ms)?**
A: Extract as a constant or prop: \`const DEACTIVATION_DELAY = 300\`

**Q: What if user wants to reset manually?**
A: Add a "Reset" button: \`onClick={() => setActivationOrder([])}\`

**Q: How would you test this?**
A:
1. Click all cells → verify all turn green
2. Wait for animation → verify reverse order
3. Try clicking during animation → verify blocked
4. Click same cell twice → verify no duplicate

---

## Key Takeaways

✅ **Use array for order tracking** (not object)
✅ **Block interactions during animation** (guard clauses)
✅ **setTimeout with forEach** for staggered animations
✅ **Immutable state updates** (filter, spread operator)
✅ **Handle edge cases** (duplicate clicks, animation state)

---

**Now play with the interactive component above!** Try clicking cells in different orders and watch the reverse animation. Notice how it always deactivates in the exact reverse order you clicked them! 🎨
`,u0=`# Grid Selection (Drag to Select)

## Problem Statement

Build a **Grid Selection** component that allows users to click and drag to select multiple cells in a grid. This pattern mimics the selection behavior found in spreadsheets (Excel, Google Sheets) and file managers.

This pattern is essential for:
- Spreadsheet applications
- File manager grid views
- Image gallery bulk selection
- Calendar date range pickers
- Seat selection interfaces
- Game board editors

---

## Requirements

### Functional Requirements

1. **Grid Rendering**
   - Render an N x N grid of cells
   - Each cell should be visually distinct

2. **Click and Drag Selection**
   - Mouse down starts selection
   - Mouse move updates selection rectangle
   - Mouse up finalizes selection
   - Only left-click triggers selection

3. **Selection Rectangle**
   - Show visual overlay while dragging
   - Highlight cells within selection area
   - Support selection in any direction (top-left to bottom-right, etc.)

4. **Selection State**
   - Track which cells are selected
   - Highlight selected cells after mouse up
   - Click on empty area to deselect all

5. **Edge Cases**
   - Handle drag outside grid bounds
   - Distinguish between click and drag

### Non-Functional Requirements

- Smooth selection experience (no lag)
- No text selection during drag
- Performant with larger grids
- Works across browsers

---

## Visual Representation

\`\`\`
Initial State (5x5 Grid):
+---+---+---+---+---+
|   |   |   |   |   |
+---+---+---+---+---+
|   |   |   |   |   |
+---+---+---+---+---+
|   |   |   |   |   |
+---+---+---+---+---+
|   |   |   |   |   |
+---+---+---+---+---+
|   |   |   |   |   |
+---+---+---+---+---+

During Drag (selection rectangle):
+---+---+---+---+---+
|   | ╔═══════╗ |   |
+---+-║-+---+-║-+---+
|   | ║ |   | ║ |   |
+---+-║-+---+-║-+---+
|   | ╚═══════╝ |   |
+---+---+---+---+---+
|   |   |   |   |   |
+---+---+---+---+---+
      ↑ Dashed overlay

After Selection (cells highlighted):
+---+---+---+---+---+
|   |███|███|███|   |
+---+---+---+---+---+
|   |███|███|███|   |
+---+---+---+---+---+
|   |███|███|███|   |
+---+---+---+---+---+
|   |   |   |   |   |
+---+---+---+---+---+
      ↑ Purple/selected cells
\`\`\`

---

## Key Concepts & Intuition

### 1. Converting Mouse Position to Cell Index

\`\`\`javascript
const getCellFromEvent = (e) => {
  const rect = gridRef.current.getBoundingClientRect();
  const x = e.clientX - rect.left;  // X relative to grid
  const y = e.clientY - rect.top;   // Y relative to grid
  const col = Math.floor(x / CELL_SIZE);
  const row = Math.floor(y / CELL_SIZE);
  return { row, col };
};
\`\`\`

**Key insight:** Divide mouse position by cell size to get grid coordinates.

### 2. Selection State Machine

\`\`\`
IDLE → (mousedown) → SELECTING → (mouseup) → IDLE
                          ↑
                     (mousemove)
\`\`\`

\`\`\`javascript
const [selecting, setSelecting] = useState(false);
const [start, setStart] = useState(null);     // {row, col}
const [end, setEnd] = useState(null);         // {row, col}
const [selected, setSelected] = useState([]); // ["0,1", "0,2", ...]
\`\`\`

### 3. Calculating Selected Cells

\`\`\`javascript
const handleMouseUp = () => {
  // Get bounding box of selection
  const minRow = Math.min(start.row, end.row);
  const maxRow = Math.max(start.row, end.row);
  const minCol = Math.min(start.col, end.col);
  const maxCol = Math.max(start.col, end.col);

  // Collect all cells in rectangle
  const newSelected = [];
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
        newSelected.push(\`\${r},\${c}\`);
      }
    }
  }
  setSelected(newSelected);
};
\`\`\`

**Why Math.min/max?** Selection can go any direction - user might drag right-to-left or bottom-to-top.

### 4. Selection Rectangle Overlay

\`\`\`javascript
{selecting && start && end && (
  <div
    style={{
      position: "absolute",
      left: Math.min(start.col, end.col) * CELL_SIZE,
      top: Math.min(start.row, end.row) * CELL_SIZE,
      width: (Math.abs(end.col - start.col) + 1) * CELL_SIZE,
      height: (Math.abs(end.row - start.row) + 1) * CELL_SIZE,
      background: "rgba(128,0,128,0.2)",
      border: "1px dashed purple",
      pointerEvents: "none",
    }}
  />
)}
\`\`\`

**Why pointerEvents: none?** Allows mouse events to pass through to the grid.

### 5. Distinguishing Click vs Drag

\`\`\`javascript
const didDragRef = useRef(false);

const handleMouseDown = (e) => {
  didDragRef.current = false;  // Reset on each mousedown
  // ...
};

const handleMouseMove = (e) => {
  if (!selecting) return;
  didDragRef.current = true;   // Mark as dragged
  // ...
};

const handleGridClick = () => {
  if (didDragRef.current) return;  // Don't reset if was dragging
  setSelected([]);
};
\`\`\`

---

## Implementation Tips

### 1. Prevent Text Selection

\`\`\`javascript
<div style={{ userSelect: "none" }}>
  {/* grid */}
</div>
\`\`\`

### 2. Grid Layout Options

\`\`\`javascript
// Option 1: Flexbox wrap
<div style={{ display: "flex", flexWrap: "wrap", width: GRID_SIZE * CELL_SIZE }}>
  {cells}
</div>

// Option 2: CSS Grid
<div style={{ display: "grid", gridTemplateColumns: \`repeat(\${GRID_SIZE}, \${CELL_SIZE}px)\` }}>
  {cells}
</div>
\`\`\`

### 3. Cell Key Format

\`\`\`javascript
// Use "row,col" string as key
const key = \`\${row},\${col}\`;
const isSelected = selected.includes(key);

// Alternative: Use Set for O(1) lookup
const selectedSet = new Set(selected);
const isSelected = selectedSet.has(key);
\`\`\`

### 4. Boundary Checking

\`\`\`javascript
// Clamp cell coordinates to grid bounds
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
const row = clamp(Math.floor(y / CELL_SIZE), 0, GRID_SIZE - 1);
const col = clamp(Math.floor(x / CELL_SIZE), 0, GRID_SIZE - 1);
\`\`\`

---

## Common Interview Questions

### Q1: How would you implement multi-selection (Ctrl+click)?

\`\`\`javascript
const handleMouseUp = (e) => {
  const newSelected = /* calculate cells */;

  if (e.ctrlKey || e.metaKey) {
    // Add to existing selection
    setSelected(prev => [...new Set([...prev, ...newSelected])]);
  } else {
    // Replace selection
    setSelected(newSelected);
  }
};
\`\`\`

### Q2: How would you implement Shift+click range selection?

\`\`\`javascript
const lastClickedRef = useRef(null);

const handleCellClick = (row, col, e) => {
  if (e.shiftKey && lastClickedRef.current) {
    // Select range from last clicked to current
    const range = getCellsInRange(lastClickedRef.current, { row, col });
    setSelected(range);
  } else {
    lastClickedRef.current = { row, col };
    setSelected([\`\${row},\${col}\`]);
  }
};
\`\`\`

### Q3: How would you optimize for large grids (1000x1000)?

\`\`\`javascript
// 1. Virtualization - only render visible cells
import { FixedSizeGrid } from 'react-window';

// 2. Use Set instead of Array for selection
const [selected, setSelected] = useState(new Set());

// 3. Memoize cell rendering
const Cell = React.memo(({ row, col, isSelected }) => (
  <div style={{ background: isSelected ? 'purple' : 'white' }} />
));
\`\`\`

### Q4: How would you add keyboard navigation?

\`\`\`javascript
useEffect(() => {
  const handleKeyDown = (e) => {
    if (!focusedCell) return;

    const moves = {
      ArrowUp: { row: -1, col: 0 },
      ArrowDown: { row: 1, col: 0 },
      ArrowLeft: { row: 0, col: -1 },
      ArrowRight: { row: 0, col: 1 },
    };

    const move = moves[e.key];
    if (move) {
      setFocusedCell(prev => ({
        row: clamp(prev.row + move.row, 0, GRID_SIZE - 1),
        col: clamp(prev.col + move.col, 0, GRID_SIZE - 1),
      }));
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [focusedCell]);
\`\`\`

### Q5: How would you handle touch devices?

\`\`\`javascript
const handleTouchStart = (e) => {
  const touch = e.touches[0];
  handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY, button: 0 });
};

const handleTouchMove = (e) => {
  const touch = e.touches[0];
  handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
};

// Add to grid element
onTouchStart={handleTouchStart}
onTouchMove={handleTouchMove}
onTouchEnd={handleMouseUp}
\`\`\`

---

## Edge Cases to Consider

1. **Drag outside grid** - Clamp coordinates to valid range
2. **Single click** - Should select one cell or deselect all?
3. **Right-click** - Should trigger context menu, not selection
4. **Rapid clicks** - Debounce or handle appropriately
5. **Window resize** - Recalculate grid boundaries
6. **Scroll during selection** - Handle scroll offset
7. **Touch vs mouse** - Different event handling
8. **Performance** - Large grids need optimization

---

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| getCellFromEvent | O(1) | O(1) |
| Calculate selection | O(w × h) | O(w × h) |
| Render grid | O(n²) | O(n²) |
| Check if selected | O(k) or O(1) | O(k) |

Where n = grid size, w/h = selection dimensions, k = selected count

---

## Performance Optimizations

### 1. Use Set for Selection

\`\`\`javascript
// O(1) lookup instead of O(n)
const [selected, setSelected] = useState(new Set());
const isSelected = selected.has(\`\${row},\${col}\`);
\`\`\`

### 2. Memoize Cells

\`\`\`javascript
const Cell = React.memo(({ row, col, isSelected }) => (
  <div className={isSelected ? 'selected' : ''} />
));
\`\`\`

### 3. Throttle Mouse Move

\`\`\`javascript
const throttledMouseMove = useMemo(
  () => throttle(handleMouseMove, 16), // ~60fps
  []
);
\`\`\`

---

## File Structure

\`\`\`
lld-017-grid-selection/
├── Solution.jsx     # Main component with selection logic
├── styles.css       # Grid and cell styling (optional)
└── problem.md       # This file
\`\`\`

---

## Real-World Applications

1. **Spreadsheets** - Excel, Google Sheets cell selection
2. **File Managers** - Desktop icon selection
3. **Image Editors** - Marquee selection tool
4. **Calendar Apps** - Date range selection
5. **Seat Booking** - Theater/flight seat selection
6. **Game Editors** - Tile map selection
7. **Design Tools** - Multi-element selection

---

## Related Patterns

- **Virtualized Grid** - Render only visible cells
- **Drag and Drop** - Move selected items
- **Lasso Selection** - Free-form selection
- **Touch Gestures** - Pinch, swipe for mobile
`,d0=`# Holy Grail Layout

## Problem Statement

Build the classic **Holy Grail Layout** - a common web page structure with a header, footer, left sidebar, main content area, and right sidebar. This is one of the most fundamental CSS layout patterns every frontend developer should master.

## Requirements

### Core Features
1. **Header**: Full-width bar at the top
2. **Footer**: Full-width bar at the bottom
3. **Left Sidebar**: Fixed-width navigation area
4. **Right Sidebar**: Fixed-width auxiliary content area
5. **Main Content**: Flexible center area that expands to fill available space

### Layout Behavior
- The layout should fill the entire viewport height (100vh minimum)
- Header and footer should have fixed heights
- Sidebars should have fixed widths
- Main content should be fluid and take remaining space
- Footer should stick to the bottom even with minimal content

## Visual Representation

\`\`\`
┌──────────────────────────────────────────────────┐
│                     HEADER                        │
│                  (full width)                     │
├────────────┬─────────────────────┬───────────────┤
│            │                     │               │
│   LEFT     │                     │    RIGHT      │
│  SIDEBAR   │    MAIN CONTENT     │   SIDEBAR     │
│            │                     │               │
│  (fixed    │    (flexible,       │   (fixed      │
│   width)   │     expands)        │    width)     │
│            │                     │               │
├────────────┴─────────────────────┴───────────────┤
│                     FOOTER                        │
│                  (full width)                     │
└──────────────────────────────────────────────────┘
\`\`\`

## Why "Holy Grail"?

This layout pattern earned its name because for many years (pre-Flexbox/Grid era), achieving this seemingly simple layout was notoriously difficult with pure CSS. It was the "holy grail" that web developers sought after.

**Historical challenges:**
- Equal-height columns without tables
- Sticky footer without JavaScript
- Fluid center with fixed sidebars
- Source order independence

## Key Concepts & Intuition

### 1. Flexbox Solution (Modern Approach)

The page structure uses nested flexbox containers:

\`\`\`css
/* Outer container: vertical flex for header/body/footer */
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Middle section: horizontal flex for sidebars + content */
.body {
  flex: 1;            /* Take all available space */
  display: flex;      /* Another flex container */
}

/* Main content expands, sidebars stay fixed */
.content {
  flex: 1;            /* Grow to fill space */
}

.left, .right {
  width: 200px;       /* Fixed width sidebars */
}
\`\`\`

### 2. Understanding \`flex: 1\`

\`\`\`css
flex: 1;
/* Shorthand for: */
flex-grow: 1;     /* Grow to fill available space */
flex-shrink: 1;   /* Shrink if necessary */
flex-basis: 0;    /* Start from 0 width, then grow */
\`\`\`

**Why \`flex: 1\` on \`.body\`?**
- Header and footer have natural heights
- \`.body\` takes ALL remaining vertical space
- This pushes footer to bottom automatically

**Why \`flex: 1\` on \`.content\`?**
- Sidebars have fixed widths (200px each)
- Content takes ALL remaining horizontal space
- Sidebar widths are respected

### 3. The Sticky Footer Problem

Without \`min-height: 100vh\` and \`flex: 1\`:

\`\`\`
┌──────────────┐         ┌──────────────┐
│    Header    │         │    Header    │
├──────────────┤         ├──────────────┤
│   Content    │   vs    │   Content    │
│   (short)    │         │   (tall)     │
├──────────────┤         │              │
│    Footer    │         │              │
├──────────────┤         ├──────────────┤
│    Empty     │         │    Footer    │
│    Space     │         └──────────────┘
└──────────────┘
     BAD!                     GOOD!
\`\`\`

**The fix:** \`min-height: 100vh\` ensures page always fills viewport, and \`flex: 1\` on body pushes footer down.

### 4. Box-Sizing Reset

\`\`\`css
* {
  box-sizing: border-box;
  margin: 0;
}
\`\`\`

**Why this matters:**
- \`border-box\`: Padding and borders are included in width/height calculations
- Without it, \`width: 200px\` + \`padding: 16px\` = 232px actual width
- Reset prevents unexpected spacing issues

## HTML Structure

\`\`\`html
<div class="page">
  <header class="header">Header</header>

  <div class="body">
    <nav class="left">Left Sidebar</nav>
    <main class="content">Main Content</main>
    <aside class="right">Right Sidebar</aside>
  </div>

  <footer class="footer">Footer</footer>
</div>
\`\`\`

**Semantic HTML usage:**
- \`<header>\`: Page header content
- \`<nav>\`: Navigation links
- \`<main>\`: Primary content
- \`<aside>\`: Supplementary content
- \`<footer>\`: Page footer content

## Implementation Tips

### Making It Responsive

\`\`\`css
@media (max-width: 768px) {
  .body {
    flex-direction: column;
  }

  .left, .right {
    width: 100%;
    order: 1;  /* Reorder for mobile */
  }

  .content {
    order: 0;  /* Content first on mobile */
  }
}
\`\`\`

### CSS Grid Alternative

\`\`\`css
.page {
  display: grid;
  min-height: 100vh;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 200px 1fr 200px;
  grid-template-areas:
    "header header header"
    "left   main   right"
    "footer footer footer";
}

.header  { grid-area: header; }
.left    { grid-area: left; }
.content { grid-area: main; }
.right   { grid-area: right; }
.footer  { grid-area: footer; }
\`\`\`

## Common Interview Questions

1. **Why use Flexbox over floats?**
   - Equal-height columns automatic
   - No clearfix hacks needed
   - Easy vertical centering
   - Source order independence

2. **How would you collapse sidebars on mobile?**
   - Media queries + \`flex-direction: column\`
   - Or use CSS Grid with responsive \`grid-template-areas\`

3. **What if you need one sidebar only?**
   - Simply remove one sidebar element
   - Flexbox automatically adjusts

4. **How to make sidebars collapsible with JavaScript?**
   \`\`\`javascript
   const toggleSidebar = () => {
     sidebar.style.width = sidebar.style.width === '0px' ? '200px' : '0px';
   };
   \`\`\`

## Edge Cases to Handle

- [ ] Very long content in sidebars (overflow handling)
- [ ] Very short page content (footer still at bottom)
- [ ] Extremely narrow viewports
- [ ] RTL (right-to-left) language support
- [ ] Print stylesheets

## Potential Extensions

1. **Collapsible sidebars** with toggle buttons
2. **Sticky header** that stays visible on scroll
3. **Resizable sidebars** with drag handles
4. **Responsive breakpoints** for tablet/mobile
5. **Dark mode** theme support
6. **Scrollable sidebars** with fixed header/footer

## Complexity Analysis

| Aspect | Complexity |
|--------|------------|
| HTML Structure | O(1) - Fixed elements |
| CSS Rules | O(1) - Constant |
| Responsive Logic | O(1) - Media queries |
| Rendering | O(1) - Browser handles layout |

This is a pure CSS solution with zero JavaScript!

## Key Insight

The Holy Grail layout demonstrates the power of Flexbox's **main axis** and **cross axis** concepts:

\`\`\`
Outer Flex (column):
┌─────────────┐
│   Header    │ ← Main axis: vertical
├─────────────┤
│    Body     │ ← flex: 1 (grows vertically)
├─────────────┤
│   Footer    │
└─────────────┘

Inner Flex (row):
┌────┬──────┬────┐
│ L  │  M   │ R  │ ← Main axis: horizontal
│    │      │    │
└────┴──────┴────┘
       ↑
       flex: 1 (grows horizontally)
\`\`\`

Master this nested flex pattern for any complex layout!
`,p0=`# Infinite Scroll

## Problem Statement

Build an **Infinite Scroll** component that automatically loads more content as the user scrolls to the bottom of the page. This is a core UX pattern used in social media feeds, product listings, and content-heavy applications.

This pattern is essential for:
- Social media feeds (Twitter, Facebook, Instagram)
- E-commerce product listings
- News/blog article feeds
- Image galleries
- Chat message history

---

## Requirements

### Functional Requirements

1. **Initial Load**
   - Load first batch of items (20 posts) on mount
   - Display items in a scrollable list

2. **Scroll Detection**
   - Detect when user scrolls near the bottom
   - Use IntersectionObserver (not scroll events)
   - Trigger next page fetch automatically

3. **Pagination**
   - Track current page number
   - Fetch next page of data when triggered
   - Append new items to existing list

4. **Loading State**
   - Show loading indicator while fetching
   - Prevent duplicate fetches during loading
   - Display "Scroll down to load" when idle

5. **End of Data**
   - Detect when no more data is available
   - Hide loading indicator when done
   - Stop observing when \`hasMore\` is false

### Non-Functional Requirements

- Smooth scrolling experience
- No scroll jank or stuttering
- Efficient DOM updates
- Memory-efficient observer cleanup

---

## Visual Representation

\`\`\`
Initial State (Loading):
+------------------------------------------+
|  +------------------------------------+  |
|  | Post #1 - this is the content      |  |
|  +------------------------------------+  |
|  +------------------------------------+  |
|  | Post #2 - this is the content      |  |
|  +------------------------------------+  |
|  +------------------------------------+  |
|  | Post #3 - this is the content      |  |
|  +------------------------------------+  |
|                   ...                    |
|  +------------------------------------+  |
|  | Post #20 - this is the content     |  |
|  +------------------------------------+  |
|                                          |
|         [ Scroll Down to load ]          |
|          ^^^^^^^^^^^^^^^^^^^^^^^^^       |
|          Sentinel element (observed)     |
+------------------------------------------+

Scrolled to Bottom (Loading More):
+------------------------------------------+
|  +------------------------------------+  |
|  | Post #18 - this is the content     |  |
|  +------------------------------------+  |
|  +------------------------------------+  |
|  | Post #19 - this is the content     |  |
|  +------------------------------------+  |
|  +------------------------------------+  |
|  | Post #20 - this is the content     |  |
|  +------------------------------------+  |
|                                          |
|              [ Loading... ]              |
|                                          |
+------------------------------------------+

After Load (New Items Appended):
+------------------------------------------+
|  +------------------------------------+  |
|  | Post #20 - this is the content     |  |
|  +------------------------------------+  |
|  +------------------------------------+  |
|  | Post #21 - this is the content     |  | <- New
|  +------------------------------------+  |
|  +------------------------------------+  |
|  | Post #22 - this is the content     |  | <- New
|  +------------------------------------+  |
|                   ...                    |
|         [ Scroll Down to load ]          |
+------------------------------------------+
\`\`\`

---

## Key Concepts & Intuition

### 1. IntersectionObserver vs Scroll Events

\`\`\`javascript
// BAD: Scroll events fire constantly (performance killer)
window.addEventListener('scroll', () => {
    const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
    if (bottom) loadMore();
});

// GOOD: IntersectionObserver only fires on visibility change
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        loadMore();
    }
}, { threshold: 1.0 });
\`\`\`

**Why IntersectionObserver?**
- Browser-optimized, runs off main thread
- Only fires when visibility changes
- No need for debouncing/throttling
- Built-in threshold control

### 2. Sentinel Element Pattern

\`\`\`jsx
// The "sentinel" is an empty element at the bottom
<div ref={observerTarget} style={{ height: '50px' }}>
    {isLoading ? 'Loading...' : 'Scroll down'}
</div>

// When this element becomes visible, trigger load
\`\`\`

**Key insight:** We observe a sentinel element, not scroll position. When it enters the viewport, we know the user has scrolled to the bottom.

### 3. Preventing Race Conditions

\`\`\`javascript
useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        // Guard conditions prevent duplicate fetches
        if (entries[0].isIntersecting && !isLoading && hasMore) {
            setPage(prev => prev + 1);
        }
    }, { threshold: 1.0 });
    // ...
}, [isLoading, hasMore]); // Re-create observer when guards change
\`\`\`

### 4. Data Fetching Pattern

\`\`\`javascript
// Separate effect for data fetching
useEffect(() => {
    const loadData = async () => {
        setIsLoading(true);
        const newItems = await fetchPosts(page);
        setData(prev => [...prev, ...newItems]); // Append, don't replace
        setIsLoading(false);

        if (newItems.length === 0) setHasMore(false);
    };
    loadData();
}, [page]); // Triggers when page changes
\`\`\`

### 5. Cleanup on Unmount

\`\`\`javascript
useEffect(() => {
    // Setup
    observer.observe(observerTarget.current);

    // Cleanup - CRITICAL for preventing memory leaks
    return () => {
        if (observerTarget.current) {
            observer.unobserve(observerTarget.current);
        }
    };
}, [isLoading, hasMore]);
\`\`\`

---

## Implementation Tips

### 1. Generating Unique IDs

\`\`\`javascript
// Combine random + timestamp for uniqueness
id: Math.random() + Date.now()

// Better: Use index offset for predictable IDs
id: page * PAGE_SIZE + index + 1
\`\`\`

### 2. Observer Configuration

\`\`\`javascript
const observer = new IntersectionObserver(callback, {
    root: null,           // Use viewport as root
    rootMargin: '0px',    // No margin
    threshold: 1.0        // 100% visible to trigger
});

// For earlier trigger (pre-fetch):
{ rootMargin: '100px' }   // Trigger 100px before visible
{ threshold: 0.5 }        // Trigger when 50% visible
\`\`\`

### 3. Conditional Rendering of Sentinel

\`\`\`jsx
{hasMore && (
    <div ref={observerTarget}>
        {isLoading ? 'Loading...' : 'Scroll down'}
    </div>
)}
\`\`\`

**Why conditional?** When there's no more data, we don't need the sentinel element. Removing it stops unnecessary observations.

### 4. Smooth Loading Experience

\`\`\`css
.loading-indicator {
    height: 50px;           /* Fixed height prevents layout shift */
    text-align: center;
    padding: 10px;
}
\`\`\`

---

## Common Interview Questions

### Q1: Why IntersectionObserver instead of scroll events?

**Answer:** IntersectionObserver is browser-optimized and runs asynchronously off the main thread. Scroll events fire on every pixel scrolled (potentially 60+ times per second), requiring manual debouncing and causing scroll jank. IntersectionObserver only fires when visibility actually changes.

### Q2: How would you implement "load more" button as fallback?

\`\`\`jsx
const LoadMoreButton = ({ onClick, isLoading, hasMore }) => {
    if (!hasMore) return null;

    return (
        <button onClick={onClick} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load More'}
        </button>
    );
};

// Useful when IntersectionObserver not supported
// or for accessibility preferences
\`\`\`

### Q3: How would you handle errors during fetch?

\`\`\`javascript
const [error, setError] = useState(null);

const loadData = async () => {
    try {
        setIsLoading(true);
        setError(null);
        const newItems = await fetchPosts(page);
        setData(prev => [...prev, ...newItems]);
    } catch (err) {
        setError('Failed to load. Tap to retry.');
        setPage(prev => prev - 1); // Revert page increment
    } finally {
        setIsLoading(false);
    }
};
\`\`\`

### Q4: How would you implement virtual scrolling for very large lists?

**Answer:** For lists with 10,000+ items, render only visible items plus buffer. Libraries like \`react-window\` or \`react-virtualized\` handle this:

\`\`\`jsx
import { FixedSizeList } from 'react-window';

<FixedSizeList
    height={600}
    itemCount={data.length}
    itemSize={80}
>
    {({ index, style }) => (
        <div style={style}>{data[index].title}</div>
    )}
</FixedSizeList>
\`\`\`

### Q5: How would you add pull-to-refresh?

\`\`\`javascript
const [refreshing, setRefreshing] = useState(false);

const handleRefresh = async () => {
    setRefreshing(true);
    setPage(0);
    setData([]);
    setHasMore(true);
    const freshData = await fetchPosts(0);
    setData(freshData);
    setRefreshing(false);
};
\`\`\`

### Q6: How would you persist scroll position across navigation?

\`\`\`javascript
// Save position before unmount
useEffect(() => {
    return () => {
        sessionStorage.setItem('scrollPos', window.scrollY);
        sessionStorage.setItem('loadedPages', page);
    };
}, [page]);

// Restore on mount
useEffect(() => {
    const savedPage = sessionStorage.getItem('loadedPages');
    if (savedPage) {
        // Load all pages up to saved position
        // Then restore scroll position
    }
}, []);
\`\`\`

---

## Edge Cases to Consider

1. **Fast scrolling** - User scrolls faster than data loads
2. **Empty response** - API returns empty array (end of data)
3. **Network failure** - Handle retry logic
4. **Component unmount** - Clean up observer to prevent memory leaks
5. **Duplicate items** - Server returns overlapping data
6. **Rapid page changes** - Multiple concurrent requests
7. **Mobile touch** - Works with touch scrolling
8. **Browser back** - Preserve scroll position and loaded data

---

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Initial render | O(n) | O(n) |
| Append items | O(m) | O(n+m) |
| Observer callback | O(1) | O(1) |
| Cleanup | O(1) | O(1) |

Where n = current items, m = new items per page

---

## Performance Optimizations

### 1. Memoize List Items

\`\`\`jsx
const MemoizedItem = React.memo(({ item }) => (
    <li>{item.title}</li>
));

// Prevents re-render of existing items when new ones added
\`\`\`

### 2. Use Keys Properly

\`\`\`jsx
// Good: Stable, unique keys
<li key={item.id}>

// Bad: Index as key (breaks with prepending)
<li key={index}>
\`\`\`

### 3. Debounce Rapid Intersections

\`\`\`javascript
const debouncedSetPage = useMemo(
    () => debounce(() => setPage(p => p + 1), 200),
    []
);
\`\`\`

---

## Real-World Applications

1. **Social Media Feeds** - Twitter, Instagram, LinkedIn
2. **E-commerce** - Product search results, category pages
3. **Email Clients** - Gmail, Outlook message lists
4. **Chat Applications** - Message history loading
5. **Documentation** - Long article/comment sections
6. **Image Galleries** - Pinterest-style layouts

---

## Related Patterns

- **Virtualized Lists** - Render only visible items
- **Pagination** - Traditional page-based navigation
- **Cursor-based Pagination** - API pattern for infinite scroll
- **Pull to Refresh** - Mobile refresh pattern
- **Skeleton Loading** - Placeholder while fetching
`,f0=`# Kanban Board

Three columns of cards, draggable between them, with add and delete.

## Requirements

- Drag a card from one column and drop it into another.
- Add a card to any column; remove any card.
- The dragged card lands in the drop target's column.

## How it works

State is one object keyed by column (\`todo\`, \`inProgress\`, \`done\`), each
holding an ordered array of cards. Moving a card is therefore a remove from one
array plus an insert into another, done immutably so React sees new references.

Dragging uses the **native HTML5 drag-and-drop** API rather than mouse events:
\`draggable\`, \`onDragStart\`, \`onDragOver\`, \`onDrop\`. The one non-obvious
requirement is that \`onDragOver\` **must** call \`preventDefault()\` — without it
the browser refuses to fire a drop, and nothing happens.

The card being dragged is held in a ref/state so the drop handler knows what
moved and where it came from.

## Interview traps

- Omitting \`preventDefault()\` in \`onDragOver\` — the single most common cause of
  "my drop handler never runs".
- Mutating the source array with \`splice\` and reusing the same reference, so
  React skips the re-render.
- HTML5 drag-and-drop does not work on touch devices; a pointer-event based
  implementation is needed for mobile.
`,h0=`# Modal with Priority System

## Problem Statement

Build a **Modal Component** with a priority-based system that determines which modal should be displayed when multiple modals compete for visibility. Higher priority modals can replace lower priority ones, ensuring critical information (errors, confirmations) always takes precedence.

This pattern is essential for:
- Confirmation dialogs for dangerous actions
- System error alerts that must interrupt user flow
- Authentication prompts
- Multi-step workflows with nested confirmations

---

## Requirements

### Functional Requirements

1. **Modal Display**
   - Show modal with overlay backdrop
   - Display title, content, and action buttons
   - Close on overlay click or ESC key
   - Prevent body scroll when open

2. **Priority System**
   - Each modal has a priority level (number)
   - Higher priority modals replace lower priority ones
   - Lower priority modals cannot replace higher priority ones
   - Only one modal visible at a time

3. **Nested Modal Triggering**
   - Buttons inside a modal can trigger another modal
   - If new modal has higher priority, it replaces current
   - Example: Settings (priority 1) → Delete Confirm (priority 10)

4. **Async Modal Triggering**
   - Modals can be triggered by async events (API errors, timers)
   - High priority async modals interrupt any open modal

### Non-Functional Requirements

- Accessible (ESC to close, focus management)
- Portal rendering to avoid z-index issues
- Body scroll lock when modal is open
- Clean event listener cleanup

---

## Visual Representation

\`\`\`
Initial State:
+------------------------------------------+
|                                          |
|  [ Open Settings ]  [ Simulate Error ]   |
|                                          |
+------------------------------------------+

Settings Modal Open (Priority: 1):
+------------------------------------------+
|  +------------------------------------+  |
|  |  Settings                      X   |  |
|  |  --------------------------------  |  |
|  |  Configure your preferences:       |  |
|  |  [x] Enable notifications          |  |
|  |                                    |  |
|  |  [ Delete Account ]  <- triggers   |  |
|  |                         priority 10|  |
|  |  --------------------------------  |  |
|  |          [ Cancel ]  [ Save ]      |  |
|  +------------------------------------+  |
+------------------------------------------+

After clicking "Delete Account" (Priority: 10 replaces 1):
+------------------------------------------+
|  +------------------------------------+  |
|  |  ⚠️ Confirm Delete             X   |  |
|  |  --------------------------------  |  |
|  |  Are you sure you want to delete   |  |
|  |  your account? This cannot be      |  |
|  |  undone.                           |  |
|  |  --------------------------------  |  |
|  |          [ Cancel ]  [ Delete ]    |  |
|  +------------------------------------+  |
+------------------------------------------+

Async Error Interrupts (Priority: 100):
+------------------------------------------+
|  +------------------------------------+  |
|  |  🚨 Connection Lost            X   |  |
|  |  --------------------------------  |  |
|  |  Unable to connect to server.      |  |
|  |  Please check your internet.       |  |
|  |  --------------------------------  |  |
|  |          [ Cancel ]  [ Retry ]     |  |
|  +------------------------------------+  |
+------------------------------------------+
\`\`\`

---

## Key Concepts & Intuition

### 1. Priority-Based State Update

\`\`\`javascript
const openModal = (newModal) => {
  setModal((current) => {
    // No modal open OR new modal has higher priority
    if (!current || newModal.priority > current.priority) {
      return newModal;
    }
    // Keep current modal (new one has lower/equal priority)
    return current;
  });
};
\`\`\`

**Key insight:** Using functional state update ensures we compare against the latest state, avoiding race conditions.

### 2. Portal Rendering

\`\`\`javascript
import ReactDOM from "react-dom";

return ReactDOM.createPortal(
  <div className="overlay">
    <div className="modal">{/* content */}</div>
  </div>,
  document.body
);
\`\`\`

**Why Portals?**
- Renders modal at document body level
- Avoids z-index conflicts with parent components
- Overlay covers entire viewport reliably

### 3. Click Outside to Close

\`\`\`javascript
const modalRef = useRef(null);

const handleMouseDown = (e) => {
  if (modalRef.current && !modalRef.current.contains(e.target)) {
    onClose();
  }
};

document.addEventListener("mousedown", handleMouseDown);
\`\`\`

**Why mousedown instead of click?** Prevents issues where drag-selecting text accidentally closes the modal.

### 4. ESC Key Handler

\`\`\`javascript
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
  };
  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, [onClose]);
\`\`\`

### 5. Body Scroll Lock

\`\`\`javascript
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
  }
  return () => {
    document.body.style.overflow = "auto";
  };
}, [isOpen]);
\`\`\`

---

## Implementation Tips

### 1. Modal Props Structure

\`\`\`javascript
const modalConfig = {
  title: "Settings",
  priority: 1,
  content: <SettingsForm />,  // Can be JSX
  primaryText: "Save",
  onPrimary: handleSave,
};
\`\`\`

### 2. Triggering Nested Modals

\`\`\`javascript
// Inside a low-priority modal, trigger high-priority
<button onClick={() => openModal({
  title: "Confirm",
  priority: 10,  // Higher than parent
  content: "Are you sure?",
  onPrimary: handleConfirm,
})}>
  Delete
</button>
\`\`\`

### 3. Async Modal Triggering

\`\`\`javascript
// API error triggers modal regardless of what's open
fetch('/api/data').catch(() => {
  openModal({
    title: "Error",
    priority: 100,  // Always wins
    content: "Request failed",
  });
});
\`\`\`

### 4. Priority Guidelines

| Priority | Use Case |
|----------|----------|
| 1-10 | Normal UI modals (settings, forms) |
| 11-50 | Confirmations (delete, submit) |
| 51-99 | Warnings (unsaved changes) |
| 100+ | System errors (connection lost, auth expired) |

---

## Common Interview Questions

### Q1: Why use a single modal state instead of a stack/queue?

**Answer:** For most applications, only one modal should be visible at a time. A stack adds complexity for features rarely needed. If you need modal history (back button), then use an array:

\`\`\`javascript
const [modals, setModals] = useState([]);
const currentModal = modals[modals.length - 1];
\`\`\`

### Q2: How would you prevent closing a critical modal?

\`\`\`javascript
<Modal
  isOpen={isOpen}
  onClose={modal.priority < 50 ? closeModal : undefined}
  showClose={modal.priority < 50}
>
\`\`\`

High-priority modals can disable the close button and overlay click.

### Q3: How would you animate modal transitions?

\`\`\`css
.modal {
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
\`\`\`

### Q4: How would you handle form state when modal is replaced?

\`\`\`javascript
// Option 1: Warn user before replacing
const openModal = (newModal) => {
  setModal((current) => {
    if (current?.hasUnsavedChanges && newModal.priority <= current.priority) {
      // Show warning instead
      return current;
    }
    return newModal;
  });
};

// Option 2: Save form state before replacing
const openModal = (newModal) => {
  setModal((current) => {
    if (current) saveDraft(current);
    return newModal;
  });
};
\`\`\`

### Q5: How would you add a "Go Back" feature?

\`\`\`javascript
const [modalHistory, setModalHistory] = useState([]);

const openModal = (newModal) => {
  setModalHistory(prev => [...prev, modal]); // Save current
  setModal(newModal);
};

const goBack = () => {
  const previous = modalHistory[modalHistory.length - 1];
  setModalHistory(prev => prev.slice(0, -1));
  setModal(previous);
};
\`\`\`

---

## Edge Cases to Consider

1. **Rapid clicks** - User clicks multiple triggers quickly
2. **Async race conditions** - Multiple API errors at same time
3. **Memory leaks** - Cleanup event listeners on unmount
4. **Focus management** - Return focus to trigger element on close
5. **Mobile keyboards** - Modal position when keyboard opens
6. **Long content** - Scrollable modal body
7. **Nested portals** - Modal inside modal edge cases

---

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| openModal | O(1) | O(1) |
| closeModal | O(1) | O(1) |
| Render | O(1) | O(1) |
| Event setup/cleanup | O(1) | O(1) |

---

## File Structure

\`\`\`
lld-016-modal/
├── Modal.jsx        # Presentational component with portal
├── Solution.jsx     # App with priority logic & demo
├── styles.css       # Overlay and modal styles
└── problem.md       # This file
\`\`\`

---

## Real-World Applications

1. **Confirmation Dialogs** - Delete, logout, destructive actions
2. **Error Alerts** - API failures, connection issues
3. **Auth Prompts** - Session expired, re-login required
4. **Form Wizards** - Multi-step with nested confirmations
5. **Media Lightbox** - Image/video preview
6. **Cookie Consent** - GDPR compliance banners

---

## Related Patterns

- **Portal Pattern** - Render outside React tree
- **Compound Components** - Modal.Header, Modal.Body, Modal.Footer
- **Context API** - Global modal state (for larger apps)
- **State Machine** - Complex modal flows (XState)
`,g0=`# Nested Comments / Threaded Discussion

## Problem Statement

Build a **Nested Comments** system (like Reddit, Hacker News, or any threaded discussion) where users can:
- View hierarchical comment threads
- Reply to any comment (creating nested replies)
- Edit existing comments
- Delete comments

## Requirements

### Core Features
1. Display nested comment threads with proper indentation
2. Reply to any comment (nested infinitely)
3. Edit comment text
4. Delete comments
5. Show author name for each comment

### User Interactions
- Click "Reply" → show reply input
- Click "Edit" → switch to edit mode
- Click "Delete" → remove comment
- Submit → save changes

## Visual Representation

\`\`\`
┌────────────────────────────────────────────────┐
│ This is the first comment                      │
│ author: Alice                                  │
│ [Reply] [Edit] [Delete]                        │
│                                                │
│   ┌────────────────────────────────────────┐  │
│   │ This is a reply                        │  │
│   │ author: Bob                            │  │
│   │ [Reply] [Edit] [Delete]                │  │
│   │                                        │  │
│   │   ┌────────────────────────────────┐  │  │
│   │   │ Nested reply to Bob           │  │  │
│   │   │ author: You                    │  │  │
│   │   │ [Reply] [Edit] [Delete]        │  │  │
│   │   └────────────────────────────────┘  │  │
│   └────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
\`\`\`

## Key Concepts & Intuition

### 1. Recursive Data Structure

Comments form a **tree** where each comment can have children:

\`\`\`javascript
{
  id: 1,
  author: "Alice",
  text: "This is the first comment",
  children: [
    {
      id: 2,
      author: "Bob",
      text: "This is a reply",
      children: [
        {
          id: 3,
          author: "You",
          text: "Nested reply",
          children: []
        }
      ]
    }
  ]
}
\`\`\`

### 2. Recursive Component for Rendering

\`\`\`jsx
function CommentItem({ comment, onReply, onEdit, onDelete }) {
  return (
    <div style={{ marginLeft: "20px" }}>
      <p>{comment.text}</p>
      <span>author: {comment.author}</span>
      <button onClick={() => onReply(comment)}>Reply</button>

      {/* Recursively render children */}
      {comment.children.map(child => (
        <CommentItem
          key={child.id}
          comment={child}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
\`\`\`

### 3. Recursive Tree Operations

#### Add Reply
Find the parent comment and add to its children:

\`\`\`javascript
function addReply(tree, parentComment, newComment) {
  return tree.map(node => {
    if (node.id === parentComment.id) {
      // Found parent - add reply to children
      return {
        ...node,
        children: [...node.children, newComment]
      };
    }
    // Not found - search in children
    return {
      ...node,
      children: addReply(node.children, parentComment, newComment)
    };
  });
}
\`\`\`

#### Update Comment
Find and update the text:

\`\`\`javascript
function updateComment(tree, targetComment, newText) {
  return tree.map(node => {
    if (node.id === targetComment.id) {
      return { ...node, text: newText };
    }
    return {
      ...node,
      children: updateComment(node.children, targetComment, newText)
    };
  });
}
\`\`\`

#### Delete Comment
Filter out the comment:

\`\`\`javascript
function deleteComment(tree, id) {
  return tree
    .filter(node => node.id !== id)  // Remove if found at this level
    .map(node => ({
      ...node,
      children: deleteComment(node.children, id)  // Search in children
    }));
}
\`\`\`

### 4. The map().map() Pattern

Notice how operations always:
1. \`.map()\` to iterate through current level
2. Recurse with \`.map()\` (or other operation) on children

\`\`\`javascript
tree.map(node => ({
  ...node,
  children: recursiveOperation(node.children, ...)
}));
\`\`\`

This ensures we:
- Create new objects (immutability)
- Visit every node
- Maintain tree structure

## Component Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    CommentsSection                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  State: commentsData (array of comment trees)        │   │
│  │  Handlers: handleReply, handleEdit, handleDelete     │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                   │
│            map through root comments                         │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  CommentItem                         │   │
│  │  Props: comment, onReply, onEdit, onDelete          │   │
│  │  Local State: isReplying, isEditing, editText       │   │
│  │                                                      │   │
│  │  Renders:                                            │   │
│  │  - Comment text & author                            │   │
│  │  - Action buttons                                   │   │
│  │  - Reply input (if isReplying)                      │   │
│  │  - Edit input (if isEditing)                        │   │
│  │  - Children (recursive)                             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Implementation Tips

### Local UI State vs Global Data State

\`\`\`javascript
// GLOBAL (lifted to parent): The actual comment data
const [commentsData, setCommentsData] = useState(initialComments);

// LOCAL (in CommentItem): UI interactions
const [isReplying, setIsReplying] = useState(false);
const [isEditing, setIsEditing] = useState(false);
const [editText, setEditText] = useState(comment.text);
\`\`\`

### Unique ID Generation

\`\`\`javascript
const newComment = {
  id: Date.now() + Math.random() * 10,  // Simple unique ID
  author: "You",
  text: replyText,
  children: []
};
\`\`\`

**Note:** In production, use UUID or server-generated IDs.

### useCallback for Handlers

Since handlers are passed down through recursion, wrap them in \`useCallback\` to prevent unnecessary re-renders:

\`\`\`javascript
const handleReply = useCallback((item, text) => {
  if (!text.trim()) return;
  setCommentsData(prev => addReply(prev, item, newComment));
}, []);
\`\`\`

## Common Interview Questions

1. **Why is the comment tree an array at the root level?**
   - Supports multiple top-level comments
   - Each root comment has its own thread
   - More flexible than single-root tree

2. **How does indentation work?**
   - Each \`CommentItem\` has \`marginLeft: 20px\`
   - Recursive nesting accumulates margin
   - Level 1: 20px, Level 2: 40px, Level 3: 60px...

3. **What if we want to collapse threads?**
   - Add \`isCollapsed\` state to each CommentItem
   - Conditionally render children based on state
   - Similar to the File Explorer pattern

4. **How would you handle very deep nesting?**
   - Cap visual indentation at certain level
   - "Continue thread →" link to separate view
   - Virtualization for performance

## Edge Cases to Handle

- [ ] Empty reply text - prevent submission
- [ ] Delete comment with children - delete entire subtree or just parent?
- [ ] Edit to empty text - prevent or allow?
- [ ] Very long comments - truncate with "show more"
- [ ] XSS prevention - sanitize user input

## Potential Extensions

1. **Upvote/Downvote** with sorting
2. **Collapse/Expand** threads
3. **Load more** replies (pagination)
4. **Timestamps** and relative time
5. **User avatars**
6. **Markdown support**
7. **@ mentions**

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Add Reply | O(n) | O(n) |
| Update Comment | O(n) | O(n) |
| Delete Comment | O(n) | O(n) |
| Render Tree | O(n) | O(h) |

Where n = total comments, h = max nesting depth

## Key Insight

The pattern is the same for File Explorer and Nested Comments:
- **Recursive data structure** (tree)
- **Recursive component** for rendering
- **Recursive functions** for mutations (add, edit, delete)
- **Immutable updates** (create new tree, don't mutate)

Master this pattern and you can build any tree-based UI!
`,m0=`# Notification System

Toast notifications that stack and auto-dismiss.

## Requirements

- Show a notification with a message and type (info, success, error).
- Each dismisses itself after a time-to-live.
- Notifications can also be dismissed manually, and several can stack.

## How it works

Notifications live in an array; each is given a unique id on creation. A
\`setTimeout\` per notification schedules its removal, and the timer ids are kept
in a **ref keyed by notification id**.

The ref matters: timers are not render output, and storing them in state would
trigger pointless re-renders while making cleanup racy. Manual dismissal clears
the pending timer before removing the toast, so a later firing timer cannot
remove a *different* notification that has since taken the same array position.

## Interview traps

- **Using array index as identity.** Remove the first toast and every later
  index shifts, so a pending timer dismisses the wrong one. Stable ids fix it.
- Leaking timers by not clearing them on manual dismiss or unmount.
- \`Date.now()\` as an id collides when two notifications are created in the same
  millisecond — a counter is safer.
`,y0=`# OTP Input

## Problem Statement

Build a 6-digit OTP (One-Time Password) input component. It should behave like the input screens seen in Paytm, PhonePe, CRED, and Uber — individual boxes, auto-advancing focus, and paste support.

## Requirements

1. **6 individual input boxes** — one digit each
2. **Auto-focus next** — typing a digit moves focus to the next box automatically
3. **Backspace handling** — pressing Backspace on an empty box focuses the previous box
4. **Paste support** — pasting \`123456\` fills all boxes at once
5. **Digits only** — reject non-numeric input
6. **Verify button** — enabled only when all 6 boxes are filled

## Key Interview Points

### useRef for DOM access
\`\`\`js
const inputs = useRef([]);
// Collect refs: ref={el => inputs.current[i] = el}
// Focus:        inputs.current[index].focus()
\`\`\`

### Auto-advance on change
\`\`\`js
if (value && index < OTP_LENGTH - 1) {
  inputs.current[index + 1].focus();
}
\`\`\`

### Backspace → focus previous
\`\`\`js
if (e.key === "Backspace" && !otp[index] && index > 0) {
  inputs.current[index - 1].focus();
}
\`\`\`

### Paste handling
\`\`\`js
function handlePaste(e) {
  e.preventDefault();
  const digits = e.clipboardData.getData("text").replace(/\\D/g, "").slice(0, 6);
  // spread across state array, focus last filled box
}
\`\`\`

## What interviewers look for

- Correct backspace + empty-box navigation
- Paste working across all boxes (not just the focused one)
- Not using \`type="number"\` (use \`type="text" inputMode="numeric"\`)
- Controlled inputs via state array, not individual \`useState\` per box`,b0=`# Poll Widget

A live bar-chart poll where each bar grows in proportion to its share of votes.

## Requirements

- Clicking an option increments its vote count.
- Bars are sized relative to the total votes cast.
- Bars re-scale as votes come in.

## How it works

Each bar's height is its share of the total:

\`\`\`
height = (votes / totalVotes) * MAX_HEIGHT
\`\`\`

Because the denominator is the running total, adding a vote to one option
visibly shrinks the others — the bars always represent proportions, not raw
counts.

Votes are updated immutably: \`map\` produces a new array, replacing only the
clicked option's object.

## Interview traps

- **Division by zero.** Before any vote, \`totalVotes\` is 0 and every height
  becomes \`NaN\`, which silently produces broken styles. Guard the zero case.
- Mutating \`option.vote++\` in place instead of returning a new object, so React
  does not re-render.
- Rounding every bar independently means the percentages may not sum to 100.
`,v0=`# Progress Bars IV - Understanding the Code

## What Are We Building?

Imagine you have multiple progress bars on the screen. When you click "Start", they should fill up gradually — but here's the twist: **only 3 bars can fill at the same time**. When one finishes, the next one in line starts filling.

Think of it like a checkout line at a store with 3 cashiers. When cashier 1 finishes with a customer, the next person in line moves up. That's exactly what we're doing here!

---

## The Big Challenge: Why Not Use CSS?

You might think: "Can't I just use CSS animations?"

\`\`\`css
.bar {
  transition: width 2s ease;
}
\`\`\`

**Problem:** CSS animations can't be paused! Once they start, they run to completion. But our requirement says we need a "Pause" button that freezes the bars at their current position and can resume later.

**Solution:** Use JavaScript to control the animation frame-by-frame using \`setInterval\`.

---

## Part 1: How Do We Store Progress?

### The State

\`\`\`javascript
const [progression, setProgression] = useState([0])
\`\`\`

This is an **array of numbers** where each number represents a bar's percentage (0 to 100).

**Example:**
\`\`\`javascript
[0, 35.5, 60, 100, 20]
\`\`\`
- Bar 1: 0% (hasn't started)
- Bar 2: 35.5% (halfway done)
- Bar 3: 60% (more than halfway)
- Bar 4: 100% (completely filled)
- Bar 5: 20% (just started)

**Why numbers instead of booleans?**

If we used booleans (\`true\`/\`false\`), we could only track "done" or "not done". But we need to know the **exact percentage** so we can pause at, say, 37.5% and resume from there.

---

## Part 2: The Animation Loop

### How do we animate?

We use \`setInterval\` to run a function **every 10 milliseconds**.

\`\`\`javascript
setInterval(() => {
  // This runs 100 times per second!
  // Each time, we increment the bars by 0.5%
}, 10)
\`\`\`

**The Math:**
- Target: Go from 0% → 100% in 2 seconds (2000ms)
- Interval: Run every 10ms
- How many times does it run? 2000ms ÷ 10ms = **200 times**
- Increment per run: 100% ÷ 200 = **0.5%**

So: 0.5% × 200 runs = 100% in 2000ms ✅

**Why 10ms?**
- Humans perceive smooth motion at 60 frames per second (fps)
- 60fps = 16.67ms per frame
- 10ms < 16.67ms → Looks buttery smooth! 🧈

---

## Part 3: The "3 at a Time" Rule

Here's the clever part. How do we make sure only 3 bars fill at once?

### The Algorithm

\`\`\`javascript
let barsUpdated = 0  // Counter: how many bars did we update?

for (let i = 0; i < bars.length; i++) {
  if (barsUpdated >= 3) break  // Stop after 3 bars

  if (bars[i] < 100) {  // Is this bar not full?
    bars[i] += 0.5      // Increment it
    barsUpdated++       // Count it
  }
}
\`\`\`

**Let's trace through an example:**

**Initial state:** \`[0, 0, 0, 0, 0]\` (5 empty bars)

**After Start (tick 1):**
\`\`\`
Loop i=0: bars[0] = 0 → 0.5, barsUpdated = 1
Loop i=1: bars[1] = 0 → 0.5, barsUpdated = 2
Loop i=2: bars[2] = 0 → 0.5, barsUpdated = 3
Loop i=3: barsUpdated >= 3, STOP
Result: [0.5, 0.5, 0.5, 0, 0]
\`\`\`

**After bar 0 reaches 100%:** \`[100, 99, 98, 0, 0]\`
\`\`\`
Loop i=0: bars[0] = 100, skip it (already full)
Loop i=1: bars[1] = 99 → 99.5, barsUpdated = 1
Loop i=2: bars[2] = 98 → 98.5, barsUpdated = 2
Loop i=3: bars[3] = 0 → 0.5, barsUpdated = 3  ← Bar 4 starts!
Loop i=4: barsUpdated >= 3, STOP
Result: [100, 99.5, 98.5, 0.5, 0]
\`\`\`

**See the magic?** We don't need a queue! Just loop from the start, skip full bars, and stop after 3 updates.

---

## Part 4: Why useRef for the Timer ID?

When we start the interval, JavaScript gives us an ID so we can stop it later.

\`\`\`javascript
const timerId = setInterval(() => {...}, 10)
// timerId might be: 123

// Later, to stop it:
clearInterval(123)
\`\`\`

**Question:** Should we store this ID in state?

\`\`\`javascript
const [timerId, setTimerId] = useState(null)  // ❌ DON'T DO THIS
\`\`\`

**Problem:** Every time we update \`timerId\`, React re-renders the component. That's wasteful!

**Solution:** Use \`useRef\` — it stores data that **persists across renders but doesn't trigger re-renders**.

\`\`\`javascript
const timerIdRef = useRef(null)  // ✅ DO THIS

// Set it:
timerIdRef.current = setInterval(...)

// Read it:
clearInterval(timerIdRef.current)
\`\`\`

Think of \`useRef\` as a "secret pocket" where you can store stuff without telling React.

---

## Part 5: The Stale Closure Problem (IMPORTANT!)

This is the trickiest part. Let's say you write this:

\`\`\`javascript
const start = () => {
  setInterval(() => {
    const newProgression = progression.map(p => p + 0.5)
    setProgression(newProgression)
  }, 10)
}
\`\`\`

**Problem:** The \`progression\` variable inside the interval is **frozen** at the moment you called \`start()\`. It never updates!

**Example:**
\`\`\`
Initial: progression = [0]
You click Start
Interval starts, captures progression = [0]

Tick 1: progression = [0] → [0.5], setProgression([0.5])
Tick 2: progression is STILL [0] in the closure! → [0.5] again
Tick 3: progression is STILL [0]! → [0.5] again
\`\`\`

The bar is stuck at 0.5% forever! 😱

**Solution: Callback Form of setState**

\`\`\`javascript
setProgression((currentProgression) => {
  // React gives you the LATEST value here!
  return currentProgression.map(p => p + 0.5)
})
\`\`\`

Now React gives us the **most recent value** every time, so the animation works correctly.

---

## Part 6: Why Clone the Array?

React uses something called **reference equality** to detect changes.

\`\`\`javascript
const arr = [1, 2, 3]
arr[0] = 999
setProgression(arr)  // ❌ React says: "Same array reference, no change!"
\`\`\`

**React only re-renders if the reference changes.**

**Solution: Clone first, then mutate**

\`\`\`javascript
const newArr = arr.slice()  // Create a copy
newArr[0] = 999
setProgression(newArr)      // ✅ New reference, React re-renders!
\`\`\`

**Analogy:** Imagine your teacher checks homework by looking at the notebook cover. If it's the same notebook, they assume nothing changed. But if you give them a new notebook (even with similar content), they'll check inside!

---

## Button Handlers Explained

### 1. Start Button

\`\`\`javascript
const start = () => {
  // Guard: Prevent multiple intervals
  if (timerIdRef.current !== null) return

  setIsRunning(true)

  timerIdRef.current = setInterval(() => {
    setProgression((current) => {
      const copy = current.slice()  // Clone
      let updated = 0

      for (let i = 0; i < copy.length && updated < 3; i++) {
        if (copy[i] < 100) {
          copy[i] = Math.min(copy[i] + 0.5, 100)  // Increment, cap at 100
          updated++
        }
      }

      return copy  // Return new array
    })
  }, 10)
}
\`\`\`

**Step-by-step:**
1. Check if interval already running → if yes, do nothing
2. Save the interval ID in \`timerIdRef\`
3. Every 10ms:
   - Clone the array (for React to detect change)
   - Find first 3 non-full bars
   - Increment each by 0.5%
   - Cap at 100 (use \`Math.min\` to prevent 100.5%)
   - Return new array → triggers re-render

### 2. Pause Button

\`\`\`javascript
const pause = () => {
  clearInterval(timerIdRef.current)  // Stop the interval
  timerIdRef.current = null          // Clear the ID
  setIsRunning(false)
}
\`\`\`

Simple! Just stop the timer. The current percentages are preserved in state.

### 3. Add Button

\`\`\`javascript
const addBar = () => {
  setProgression((current) => current.concat(0))
}
\`\`\`

Append a new bar at 0%. If the animation is running and there are < 3 active bars, it will start filling automatically on the next tick!

### 4. Reset Button

\`\`\`javascript
const reset = () => {
  pause()               // Stop animation first
  setProgression([0])   // Reset to one empty bar
}
\`\`\`

---

## Common Mistakes (Learn from These!)

### ❌ Mistake 1: Mutating State Directly

\`\`\`javascript
progression[0] += 0.5
setProgression(progression)  // React won't detect this!
\`\`\`

**Why it fails:** Same array reference.

**Fix:** Clone first!
\`\`\`javascript
const copy = progression.slice()
copy[0] += 0.5
setProgression(copy)
\`\`\`

---

### ❌ Mistake 2: Forgetting the Guard Check

\`\`\`javascript
const start = () => {
  setInterval(...)  // No guard!
}
\`\`\`

If you click "Start" 5 times, you'll have **5 intervals running**, making bars fill 5× faster!

**Fix:** Add guard check:
\`\`\`javascript
if (timerIdRef.current !== null) return
\`\`\`

---

### ❌ Mistake 3: Not Capping at 100

\`\`\`javascript
bars[i] += 0.5  // Could go 100, 100.5, 101, 101.5...
\`\`\`

Floating point math isn't perfect. Use \`Math.min\` to cap:
\`\`\`javascript
bars[i] = Math.min(bars[i] + 0.5, 100)
\`\`\`

---

### ❌ Mistake 4: Using setTimeout Instead of setInterval

\`\`\`javascript
setTimeout(() => { ... }, 10)  // Runs ONCE
\`\`\`

\`setTimeout\` runs once. \`setInterval\` runs repeatedly. Big difference!

---

## Mental Model: The Factory Analogy

Imagine a factory with **3 workers** on an assembly line:

- **Workers** = The 3 concurrent slots
- **Boxes** = The progress bars
- **Filling a box** = Incrementing from 0% → 100%

**Rules:**
1. Workers always work on the first 3 unfilled boxes from the left
2. When a worker finishes a box (100%), they move to the next unfilled box
3. "Pause" = Workers freeze, remember their position
4. "Resume" = Workers continue from where they stopped

---

## Try It Yourself (Exercises)

Play with the component above and observe:

1. **Click Start** → First 3 bars fill together
2. **Click Add 5 times** → Bars 4 and 5 wait in line
3. **Click Pause at 50%** → Notice exact percentages are preserved
4. **Click Start again** → Bars resume from 50%, not restart from 0!
5. **Let all bars fill** → Click Add → New bar starts immediately (slot available)

---

## Key Takeaways

✅ **State = Array of percentages** (so we can pause/resume)
✅ **setInterval every 10ms** (smooth 60fps animation)
✅ **Loop from start, stop after 3** (auto-queue behavior)
✅ **useRef for timer ID** (no unnecessary re-renders)
✅ **Callback setState** (avoid stale closure)
✅ **Clone before mutate** (React detects changes)

---

## Still Confused? Let's Debug Together!

**Q: Why is my bar stuck at 0.5%?**
A: You forgot the callback form of \`setState\`. The closure captured old state.

**Q: Why do bars fill 10× faster after I click Start multiple times?**
A: You forgot the guard check. Multiple intervals are running.

**Q: Why doesn't React re-render after I change \`progression[0]\`?**
A: You mutated the array directly. React checks references, not contents.

---

**Now scroll up and play with the component!** Click the buttons, watch the bars, and see the concepts in action. 🚀
`,w0=`# Promise Progress Tracker

## Problem Statement

Build a **Promise Progress Tracker** component that executes multiple asynchronous operations concurrently and displays real-time progress as each operation completes.

This is a common pattern for:
- File upload progress with multiple files
- Batch API calls with progress indication
- Service health checks with visual feedback
- Data migration progress tracking

---

## Requirements

### Functional Requirements

1. **Multiple Concurrent Operations**
   - Execute 5 simulated service calls concurrently
   - Services: Auth, Payment, User Profile, Notifications, Analytics
   - Each service has random completion time (500ms - 3500ms)

2. **Progress Tracking**
   - Display a progress bar that fills incrementally
   - Progress updates as each promise resolves OR rejects
   - Progress = (completed promises / total promises) * 100

3. **Result Tracking**
   - Track success/failure status of each service
   - Display results as they complete
   - Show final summary when all complete

4. **UI Controls**
   - Start button to initiate all operations
   - Button disabled while operations are running
   - Visual feedback for running state

### Non-Functional Requirements

- Smooth progress bar animation
- Handle both resolved and rejected promises
- No blocking - UI remains responsive
- Clean state reset on restart

---

## Visual Representation

\`\`\`
Initial State:
+------------------------------------------+
| [========================] 0%            |
|                                          |
| [ Start Services ]                       |
+------------------------------------------+

Running State (60% complete):
+------------------------------------------+
| [===============         ] 60%           |
|  ^^^^^^^^^^^^^ Blue fill                 |
|                                          |
| [ Processing... ] (disabled)             |
|                                          |
| Results:                                 |
| - Auth: Success                          |
| - Payment: Failed                        |
| - User Profile: Success                  |
+------------------------------------------+

Completed State (100%):
+------------------------------------------+
| [=========================] 100%         |
|  ^^^^^^^^^^^^^^^^^^^^^^^^^ Green fill    |
|                                          |
| [ Start Services ]                       |
|                                          |
| Results:                                 |
| - Auth: Success                          |
| - Payment: Failed                        |
| - User Profile: Success                  |
| - Notifications: Success                 |
| - Analytics: Success                     |
+------------------------------------------+
\`\`\`

---

## Key Concepts & Intuition

### 1. Promise.allSettled vs Promise.all

\`\`\`javascript
// Promise.all - Fails fast on first rejection
Promise.all(promises)  // Rejects if ANY promise rejects

// Promise.allSettled - Waits for ALL to complete
Promise.allSettled(promises)  // Always resolves with status array
// Returns: [
//   { status: 'fulfilled', value: result },
//   { status: 'rejected', reason: error }
// ]
\`\`\`

**Why allSettled?** We want progress to reach 100% regardless of individual failures.

### 2. Progress Increment Pattern

\`\`\`javascript
const TOTAL = 5;

// Each completion adds equal portion
.finally(() => {
    setProgress(prev => {
        const increment = 100 / TOTAL;
        return Math.min(prev + increment, 100);
    });
})
\`\`\`

**Key insight:** Use \`.finally()\` to update progress on BOTH success and failure.

### 3. Chaining for Side Effects

\`\`\`javascript
const promises = services.map(name => {
    return simulateService(name)
        .then(val => {
            // Side effect: track success
            setResults(prev => [...prev, { status: 'success', value: val }]);
        })
        .catch(err => {
            // Side effect: track failure
            setResults(prev => [...prev, { status: 'failed', value: err }]);
        })
        .finally(() => {
            // Always: update progress
            setProgress(prev => prev + increment);
        });
});
\`\`\`

### 4. State Management Strategy

\`\`\`javascript
const [progress, setProgress] = useState(0);      // 0-100
const [results, setResults] = useState([]);        // Array of outcomes
const [isRunning, setIsRunning] = useState(false); // Lock state

const handleStart = async () => {
    // 1. Reset state
    setIsRunning(true);
    setProgress(0);
    setResults([]);

    // 2. Execute all
    await Promise.allSettled(promises);

    // 3. Unlock
    setIsRunning(false);
};
\`\`\`

---

## Implementation Tips

### 1. Simulating Async Operations

\`\`\`javascript
function simulateService(name) {
    return new Promise((resolve, reject) => {
        const duration = Math.random() * 3000 + 500; // 500-3500ms

        setTimeout(() => {
            if (Math.random() > 0.3) {  // 70% success rate
                resolve(\`\${name} Success\`);
            } else {
                reject(\`\${name} Failed\`);
            }
        }, duration);
    });
}
\`\`\`

### 2. Progress Bar Styling

\`\`\`css
.progress-track {
    width: 100%;
    height: 20px;
    background-color: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;  /* Keeps fill inside rounded corners */
}

.progress-fill {
    height: 100%;
    transition: width 0.3s ease-in-out;  /* Smooth animation */
}
\`\`\`

### 3. Dynamic Color Based on Progress

\`\`\`jsx
<div
    className="progress-fill"
    style={{
        width: \`\${progress}%\`,
        background: progress === 100 ? 'green' : 'blue'
    }}
/>
\`\`\`

### 4. Preventing Race Conditions

\`\`\`javascript
// Use functional updates to ensure correct state
setProgress(prev => Math.min(prev + increment, 100));
setResults(prev => [...prev, newResult]);
\`\`\`

---

## Common Interview Questions

### Q1: Why use Promise.allSettled instead of Promise.all?

**Answer:** \`Promise.all\` short-circuits on the first rejection, which would prevent the progress bar from reaching 100% if any service fails. \`Promise.allSettled\` waits for all promises to complete regardless of outcome, ensuring accurate progress tracking.

### Q2: How would you add retry logic for failed services?

\`\`\`javascript
async function withRetry(fn, maxRetries = 3) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err;
            await delay(1000 * Math.pow(2, i)); // Exponential backoff
        }
    }
    throw lastError;
}
\`\`\`

### Q3: How would you implement cancellation?

\`\`\`javascript
const [abortController, setAbortController] = useState(null);

const handleStart = () => {
    const controller = new AbortController();
    setAbortController(controller);

    promises.forEach(p => {
        if (controller.signal.aborted) return;
        // Execute promise
    });
};

const handleCancel = () => {
    abortController?.abort();
    setIsRunning(false);
};
\`\`\`

### Q4: How would you show individual progress for each service?

\`\`\`javascript
const [serviceProgress, setServiceProgress] = useState({
    Auth: { status: 'pending', progress: 0 },
    Payment: { status: 'pending', progress: 0 },
    // ...
});

// Update individual service progress
setServiceProgress(prev => ({
    ...prev,
    [name]: { status: 'running', progress: 50 }
}));
\`\`\`

### Q5: How would you handle rate limiting (max 2 concurrent)?

\`\`\`javascript
async function asyncPool(limit, items, fn) {
    const results = [];
    const executing = [];

    for (const item of items) {
        const p = fn(item);
        results.push(p);

        if (limit <= items.length) {
            const e = p.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);
            if (executing.length >= limit) {
                await Promise.race(executing);
            }
        }
    }

    return Promise.allSettled(results);
}
\`\`\`

---

## Edge Cases to Consider

1. **Rapid restarts** - What if user clicks Start before previous run completes?
2. **All failures** - Progress should still reach 100%
3. **Instantaneous completion** - Handle 0ms duration gracefully
4. **Memory leaks** - Clean up timeouts on unmount
5. **Floating point precision** - Use \`Math.min(prev + increment, 100)\` to cap at 100

---

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Initialize | O(n) | O(n) |
| Track progress | O(1) per update | O(n) results |
| Render | O(n) | O(1) |

Where n = number of services

---

## Real-World Applications

1. **File Upload Progress** - Track multiple file uploads
2. **API Health Dashboard** - Monitor multiple endpoints
3. **Batch Processing** - Show progress of data transformations
4. **Deployment Pipelines** - Track CI/CD step completion
5. **Form Submission** - Multiple API calls with combined progress

---

## Related Patterns

- **Concurrent Request Limiting** - Control parallelism
- **Retry with Backoff** - Handle transient failures
- **Request Cancellation** - AbortController pattern
- **Optimistic Updates** - Show progress before confirmation
`,x0=`# Search Highlighter

Highlight every occurrence of a search term inside a block of text, live as
the user types.

## Requirements

- Typing in the input highlights all case-insensitive matches in the passage.
- An empty query renders the text untouched.
- Matches keep the passage's original casing — only the background changes.

## How it works

The whole trick is \`String.split\` with a **capturing** group:

\`\`\`js
text.split(new RegExp(\`(\${query})\`, 'gi'))
\`\`\`

Without the parentheses, \`split\` discards the delimiters and the matches would
vanish. With them, the matches are kept *in* the resulting array, so the parts
alternate: text, match, text, match… Each part is then compared
case-insensitively against the query and wrapped in \`<mark>\` when it matches.

## Interview traps

- **Regex injection.** The query is interpolated straight into a \`RegExp\`, so a
  user typing \`(\` or \`*\` throws a syntax error. Production code escapes the
  query first (\`query.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&')\`).
- **Rebuilding the regex every keystroke** is wasteful on long text — memoize it.
- Using array index as \`key\` is acceptable here only because the list is
  regenerated wholesale on every render and never reordered.
`,S0=`# Seat Picker

## Problem Statement

Build a bus/flight seat selection UI. Users click seats to select or deselect them. Pre-booked seats are disabled. A summary shows selected seats and total price. Uber and BookMyShow ask this exact problem.

## Requirements

1. **Grid of seats** — rows A–G, columns 1–8 (adapt for any size)
2. **Three states** — available (green), selected (blue), booked (grey/disabled)
3. **Toggle selection** — click available seat to select, click again to deselect
4. **Booked seats are disabled** — cannot be clicked
5. **Summary panel** — shows selected seat IDs, count, and total price
6. **Clear selection** button

## Key Interview Points

### State: a Set, not an array
\`\`\`js
const [selected, setSelected] = useState(new Set());

function toggleSeat(id) {
  setSelected(prev => {
    const next = new Set(prev);   // must create new Set for React to detect change
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
}
\`\`\`
Why Set over array: \`has()\` is O(1), \`delete()\` is O(1). Array \`includes()\` + \`filter()\` is O(n) per click.

### Seat ID scheme
\`\`\`js
const id = \`\${row}\${col}\`; // "A3", "B7" etc.
const BOOKED = new Set(["A3", "B5", ...]); // O(1) lookup
\`\`\`

### Derive status, don't store it
\`\`\`js
function getSeatStatus(id, selected) {
  if (BOOKED.has(id)) return "booked";
  if (selected.has(id)) return "selected";
  return "available";
}
\`\`\`
Status is derived on every render from the single \`selected\` Set — no separate \`bookedSeats\` state needed.

### Disabled button = no handler needed
\`\`\`jsx
<button disabled={status === "booked"} onClick={() => toggleSeat(id)}>
\`\`\`
\`disabled\` prevents click events natively — no need for \`if (BOOKED.has(id)) return\`.

## What interviewers look for

- Set for O(1) lookup (not array)
- New Set on toggle (immutable update pattern)
- Derived status function (not stored separately)
- Correct \`disabled\` usage
- Summary derived from \`selected.size\` (no separate counter state)`,k0=`# Snakes and Ladders

Find the minimum number of dice throws needed to reach square 100.

## Requirements

- Model the board as a graph and compute the fewest moves to the final square.
- Snakes and ladders teleport you on arrival.
- Show the actual sequence of squares, not just the move count.

## How it works

The board is a **directed graph**: from square \`X\` there are edges to
\`X+1 … X+6\` (the six dice outcomes). Landing on a snake or ladder immediately
redirects to its destination.

Every dice throw costs exactly 1, so all edges have equal weight — which makes
**BFS** optimal. The first time BFS reaches a square, it has reached it in the
fewest possible throws; no weighting or priority queue is needed.

The path is reconstructed by carrying the route along in the queue.

## Interview traps

- Reaching for Dijkstra. It works, but it is unnecessary machinery when every
  edge weight is 1 — BFS is the right tool.
- Forgetting that the jump itself is free: the dice roll counts as one move,
  the snake/ladder that follows does not.
- Not marking squares visited turns this into an exponential walk.
`,E0=`# Star Rating

## Problem Statement

Build an interactive **Star Rating** component that allows users to rate items on a configurable scale. This is a fundamental UI pattern used across e-commerce, review platforms, and feedback systems.

This pattern is essential for:
- E-commerce product reviews (Amazon, Flipkart)
- App store ratings (Google Play, App Store)
- Restaurant/hotel reviews (Yelp, TripAdvisor)
- Service feedback (Uber, Ola driver ratings)
- Content ratings (Netflix, IMDb)

---

## Requirements

### Functional Requirements

1. **Star Display**
   - Render configurable number of stars (default: 5)
   - Each star is clickable
   - Stars should be visually distinct (filled vs empty)

2. **Hover Preview**
   - Highlight stars up to the hovered position
   - Show user what rating they would set
   - Reset preview when mouse leaves

3. **Click Selection**
   - Click a star to set the rating
   - Rating persists after mouse leaves
   - Notify parent component via callback

4. **Reset Functionality**
   - Double-click to reset rating to 0
   - Clear both rating and hover state

5. **Customization**
   - Support custom total stars (5, 10, etc.)
   - Accept onChange callback for parent notification

### Non-Functional Requirements

- Smooth hover transitions
- Accessible via keyboard (button elements)
- No external dependencies
- Responsive to different sizes

---

## Visual Representation

\`\`\`
Initial State (No Rating):
+------------------------------------------+
|                                          |
|     ☆     ☆     ☆     ☆     ☆           |
|    (1)   (2)   (3)   (4)   (5)          |
|                                          |
|     Current Rating: 0 / 5                |
+------------------------------------------+

Hover State (Hovering on star 3):
+------------------------------------------+
|                                          |
|     ★     ★     ★     ☆     ☆           |
|    (1)   (2)   (3)   (4)   (5)          |
|     ^     ^     ^                        |
|   Highlighted (preview)                  |
|                                          |
+------------------------------------------+

After Click (Rating set to 3):
+------------------------------------------+
|                                          |
|     ★     ★     ★     ☆     ☆           |
|    (1)   (2)   (3)   (4)   (5)          |
|                                          |
|     Current Rating: 3 / 5                |
+------------------------------------------+

Hover After Selection (Hovering on star 5):
+------------------------------------------+
|                                          |
|     ★     ★     ★     ★     ★           |
|    (1)   (2)   (3)   (4)   (5)          |
|                 ^     ^     ^            |
|           Preview overrides rating       |
|                                          |
+------------------------------------------+
\`\`\`

---

## Key Concepts & Intuition

### 1. Dual State Management

\`\`\`javascript
const [rating, setRating] = useState(0);  // Persisted selection
const [hover, setHover] = useState(0);    // Temporary preview

// The magic: hover takes precedence over rating
const displayValue = hover || rating;
\`\`\`

**Why two states?**
- \`rating\` persists after mouse leaves
- \`hover\` provides preview without committing
- OR operator gives hover priority when non-zero

### 2. Star Highlighting Logic

\`\`\`jsx
className={\`star \${starValue <= (hover || rating) ? "on" : "off"}\`}
\`\`\`

**How it works:**
\`\`\`
If hover = 3: stars 1,2,3 are "on", stars 4,5 are "off"
If hover = 0, rating = 2: stars 1,2 are "on", stars 3,4,5 are "off"
\`\`\`

### 3. Converting Index to Value

\`\`\`javascript
{[...Array(totalStars)].map((_, index) => {
    const starValue = index + 1;  // 0-based to 1-based
    // ...
})}
\`\`\`

**Why +1?**
- Array index is 0-based (0, 1, 2, 3, 4)
- Star values are 1-based (1, 2, 3, 4, 5)
- Rating of "0" means no selection

### 4. Event Handlers

\`\`\`jsx
<button
    onClick={() => {
        setRating(starValue);
        onChange?.(starValue);  // Optional chaining
    }}
    onMouseEnter={() => setHover(starValue)}
    onMouseLeave={() => setHover(0)}
    onDoubleClick={() => {
        setRating(0);
        setHover(0);
        onChange?.(0);
    }}
>
\`\`\`

### 5. Using Buttons for Accessibility

\`\`\`jsx
// Good: Buttons are focusable and keyboard accessible
<button className="star">★</button>

// Bad: Divs require manual accessibility handling
<div className="star" tabIndex={0} role="button">★</div>
\`\`\`

---

## Implementation Tips

### 1. Creating Star Array

\`\`\`javascript
// Method 1: Spread empty array
[...Array(5)].map((_, i) => ...)

// Method 2: Array.from
Array.from({ length: 5 }, (_, i) => ...)

// Method 3: Array.fill
Array(5).fill().map((_, i) => ...)
\`\`\`

### 2. Unicode Stars

\`\`\`javascript
// Filled star
<span>&#9733;</span>  // ★

// Empty star
<span>&#9734;</span>  // ☆

// Or use CSS to toggle
.star.on { color: gold; }
.star.off { color: gray; }
\`\`\`

### 3. Preventing Text Selection

\`\`\`css
.star-container {
    user-select: none;  /* Prevent text selection on double-click */
}
\`\`\`

### 4. Smooth Transitions

\`\`\`css
.star {
    transition: color 0.2s ease, transform 0.1s ease;
}

.star:hover {
    transform: scale(1.1);
}
\`\`\`

---

## Common Interview Questions

### Q1: How does the hover preview work without affecting the saved rating?

**Answer:** We maintain two separate states: \`rating\` for the persisted selection and \`hover\` for the temporary preview. The display logic uses \`hover || rating\`, so hover takes precedence when non-zero. When the mouse leaves (\`onMouseLeave\`), we reset hover to 0, revealing the saved rating.

### Q2: How would you implement half-star ratings?

\`\`\`javascript
const [rating, setRating] = useState(0);

const handleClick = (e, starValue) => {
    const rect = e.target.getBoundingClientRect();
    const isLeftHalf = e.clientX - rect.left < rect.width / 2;
    setRating(isLeftHalf ? starValue - 0.5 : starValue);
};

// Render with gradient for half-filled stars
<div style={{
    background: \`linear-gradient(90deg, gold \${percentage}%, gray \${percentage}%)\`
}}>
\`\`\`

### Q3: How would you make this a controlled component?

\`\`\`javascript
// Controlled: value comes from props
function StarRating({ value, onChange, totalStars = 5 }) {
    const [hover, setHover] = useState(0);

    return (
        // Use 'value' prop instead of internal state
        // Call onChange instead of internal setRating
    );
}

// Usage
<StarRating value={userRating} onChange={setUserRating} />
\`\`\`

### Q4: How would you add keyboard navigation?

\`\`\`javascript
const handleKeyDown = (e, starValue) => {
    if (e.key === 'ArrowRight') {
        setRating(Math.min(starValue + 1, totalStars));
    } else if (e.key === 'ArrowLeft') {
        setRating(Math.max(starValue - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
        setRating(starValue);
    }
};
\`\`\`

### Q5: How would you handle read-only display?

\`\`\`jsx
function StarRating({ value, readOnly = false, totalStars = 5 }) {
    if (readOnly) {
        return (
            <div className="star-container">
                {[...Array(totalStars)].map((_, i) => (
                    <span key={i} className={\`star \${i < value ? 'on' : 'off'}\`}>
                        ★
                    </span>
                ))}
            </div>
        );
    }
    // ... interactive version
}
\`\`\`

---

## Edge Cases to Consider

1. **Rapid clicking** - Multiple clicks in quick succession
2. **Touch devices** - No hover state available
3. **Zero rating** - Valid state vs no selection
4. **Fractional ratings** - Display 3.5 stars from API
5. **Very large scales** - 100-star rating (rare but possible)
6. **RTL languages** - Stars should go right-to-left
7. **Color blindness** - Don't rely only on color
8. **Screen readers** - Announce current rating

---

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Initial render | O(n) | O(1) |
| Hover update | O(n) | O(1) |
| Click update | O(n) | O(1) |
| Re-render | O(n) | O(1) |

Where n = number of stars (typically 5-10)

---

## Performance Optimizations

### 1. Memoize Star Component

\`\`\`jsx
const Star = React.memo(({ value, isActive, onHover, onClick }) => (
    <button
        className={\`star \${isActive ? 'on' : 'off'}\`}
        onMouseEnter={() => onHover(value)}
        onClick={() => onClick(value)}
    >
        ★
    </button>
));
\`\`\`

### 2. useCallback for Handlers

\`\`\`javascript
const handleHover = useCallback((value) => setHover(value), []);
const handleClick = useCallback((value) => {
    setRating(value);
    onChange?.(value);
}, [onChange]);
\`\`\`

### 3. CSS-only Hover (No JS)

\`\`\`css
/* Pure CSS hover using sibling selectors */
.star-container:hover .star { color: gray; }
.star:hover,
.star:hover ~ .star { color: gold; }  /* This won't work - need inverse */

/* Actually need flexbox row-reverse trick for pure CSS */
\`\`\`

---

## Real-World Applications

1. **E-commerce** - Product reviews and ratings
2. **App Stores** - App rating and feedback
3. **Food Delivery** - Restaurant and dish ratings
4. **Ride Sharing** - Driver and rider ratings
5. **Streaming** - Content recommendations
6. **Hotels/Travel** - Accommodation reviews
7. **Job Portals** - Company and interview ratings

---

## Related Patterns

- **Like/Dislike** - Binary rating (thumbs up/down)
- **Emoji Reactions** - Multiple sentiment options
- **NPS Score** - 0-10 scale rating
- **Slider Rating** - Continuous value selection
- **Review Form** - Rating + text feedback
`,_0=`# Star Rating

A 5-star rating widget with hover preview.

## Requirements

- Hovering a star previews that rating — every star up to and including the
  hovered one fills.
- Moving the pointer off the widget restores the committed rating.
- Clicking a star commits that rating.
- Show the committed rating as text, or "No rating yet".

## How it works

Two pieces of state: the committed \`rating\`, and a transient \`hovered\` value.
The displayed value is \`hovered || rating\` — hover wins while the pointer is
over the widget, and falls back to the real rating once it leaves.

\`onMouseLeave\` sits on the **container**, not on each star. Putting it on each
star would clear the preview while moving between adjacent stars, making the
fill flicker.
`,C0=`# Stepper Wizard

## Problem Statement

Build a multi-step form wizard (checkout flow) with a progress indicator, per-step validation, and a final review screen. Common in Salesforce, Adobe, and Flipkart rounds.

## Requirements

1. **4 steps** — Personal Info → Address → Payment → Review & Submit
2. **Step indicator** at the top showing done / active / pending states
3. **Per-step validation** — Next button disabled until required fields filled
4. **Back/Next navigation** — Back always enabled (except step 1), Next gated by validation
5. **Review step** — shows all collected data before final submit
6. **Success screen** after submit

## Key Interview Points

### Shared form state (single object, not per-step state)
\`\`\`js
const [data, setData] = useState({ name: "", email: "", street: "", card: "" });
function update(field, value) {
  setData(prev => ({ ...prev, [field]: value }));
}
\`\`\`
Why: keeps data alive when navigating back, avoids prop-drilling multiple setters.

### Validation per step
\`\`\`js
function isStepValid(step, data) {
  if (step === 0) return data.name && data.email && data.phone;
  if (step === 1) return data.street && data.city;
  if (step === 2) return data.card && data.cvv;
  return true;
}
\`\`\`

### Step indicator pattern
\`\`\`jsx
// Circle: green checkmark if completed, blue if active, grey if pending
i < step ? "✓" : i + 1
background: i < step ? "green" : i === step ? "blue" : "grey"
\`\`\`

### Connector line between steps
\`\`\`jsx
{i < STEPS.length - 1 && (
  <div style={{ flex: 1, height: 2, background: i < step ? "green" : "grey" }} />
)}
\`\`\`

## What interviewers look for

- Single shared form state (not 4 separate useState objects)
- Validation gates on Next, not just on submit
- Connector lines update correctly as steps complete
- Review step derived from shared state (no duplication)
- Clean separation: wizard shell vs. individual step components`,T0=`# Tabs

## Problem Statement

Build an accessible Tab component with keyboard navigation and lazy rendering. This is a Google and Salesforce staple — interviewers expect ARIA roles and keyboard support, not just click handlers.

## Requirements

1. **Tab list** with multiple tabs; clicking switches the active panel
2. **Keyboard navigation** — ArrowLeft/Right cycles tabs, Home/End jump to first/last
3. **Roving tabIndex** — only the active tab is focusable via Tab key
4. **Lazy rendering** — a tab's content mounts only on first visit, not before
5. **ARIA roles** — \`tablist\`, \`tab\`, \`tabpanel\`, \`aria-selected\`, \`aria-controls\`

## Key Interview Points

### Roving tabIndex pattern
\`\`\`jsx
// Active tab: tabIndex={0} (in the tab sequence)
// Inactive tabs: tabIndex={-1} (focusable only via JS, not Tab key)
tabIndex={isActive ? 0 : -1}
\`\`\`

### Keyboard handler
\`\`\`js
function handleKeyDown(e) {
  if (e.key === "ArrowRight") activate(ids[(current + 1) % ids.length]);
  if (e.key === "ArrowLeft")  activate(ids[(current - 1 + ids.length) % ids.length]);
  if (e.key === "Home") activate(ids[0]);
  if (e.key === "End")  activate(ids[ids.length - 1]);
}
\`\`\`

### Lazy loading with a \`visited\` Set
\`\`\`js
const [visited, setVisited] = useState(new Set(["tab1"]));
// On activate:
setVisited(prev => new Set([...prev, id]));
// In panel:
{visited.has(tab.id) ? <tab.Content /> : null}
\`\`\`

### ARIA wiring
\`\`\`jsx
<div role="tablist">
  <button role="tab" aria-selected={isActive} aria-controls={\`panel-\${id}\`} />
</div>
<div role="tabpanel" aria-labelledby={\`tab-\${id}\`} hidden={!isActive} />
\`\`\`

## What interviewers look for

- ARIA roles (many candidates skip this)
- Roving tabIndex — not \`tabIndex={0}\` on all tabs
- \`hidden\` attribute on panels (not CSS \`display:none\` via class)
- Lazy rendering to avoid mounting expensive panels unnecessarily
- Wrapping arrow key navigation (last tab → first, first → last)`,R0=`# Tic-Tac-Toe (N x N)

Tic-tac-toe generalised to any board size, where the win length equals the
board dimension.

## Requirements

- Board size comes from the \`size\` prop (defaults to 5×5) — nothing hardcodes 3.
- Players alternate X and O; a filled cell cannot be replayed.
- A line of \`N\` marks wins; a full board with no line is a draw.

## How it works

Like Connect 4, win detection runs only from the cell just played, counting
outward in each direction and summing both ways plus the cell itself.

> **Note on this implementation:** it checks **horizontal and vertical only** —
> the \`directions\` array contains \`[0,1]\` and \`[1,0]\`, with no diagonals. On a
> real board a diagonal line therefore does not register as a win. Adding
> \`[1,1]\` and \`[1,-1]\` would complete it; the counting logic already handles
> any direction vector unchanged.

## Interview traps

- Hardcoding 3-in-a-row, or the eight classic win lines, fails the moment the
  board is parameterised.
- Draw detection needs a move counter (or a board scan) — "no winner" alone is
  not a draw until the board is full.
`,N0=`# Token Bucket Rate Limiter

Allow bursts up to a capacity while enforcing a steady long-run rate.

## Requirements

- The bucket holds up to \`capacity\` tokens.
- Tokens refill at a fixed rate.
- A request consumes one token; with none available it is rejected.

## How it works

The key idea is **lazy refill**. A background timer ticking tokens in would be
wasteful and imprecise. Instead the token count is computed on demand from
elapsed time:

\`\`\`
newTokens = (now - lastRefill) * refillRate
tokens    = Math.min(capacity, tokens + newTokens)
\`\`\`

That makes every check O(1), exact regardless of timer drift, and cheap enough
to run per request.

Because the bucket can hold a full \`capacity\`, traffic may **burst** up to that
many requests instantly — then it is throttled to the refill rate. That burst
tolerance is the property that distinguishes token bucket from a fixed window.

## Interview traps

- Forgetting to clamp at \`capacity\`, letting tokens accumulate forever and
  destroying the rate limit.
- Using a background interval instead of lazy refill (wasteful, and drifts).
- **Token bucket vs leaky bucket:** token bucket permits bursts; leaky bucket
  smooths output to a constant rate. Interviewers ask for the difference.
`,I0=`# Traffic Light Simulator

## Problem Statement

Build a **Traffic Light** component that simulates a real traffic signal, automatically cycling through red, yellow, and green lights with appropriate timing.

## Requirements

### Core Features
1. Display three lights: Red, Yellow, Green
2. Only one light is active at a time
3. Lights cycle automatically: Red → Green → Yellow → Red
4. Each light has configurable duration
5. Visual indication of active vs inactive lights

### Timing Requirements
- **Red**: 4 seconds (longest - safety)
- **Yellow**: 0.9 seconds (brief warning)
- **Green**: 3 seconds (go!)

## Visual Representation

\`\`\`
    ┌──────────┐
    │  ┌────┐  │
    │  │ 🔴 │  │  ← Red (4s)
    │  └────┘  │
    │  ┌────┐  │
    │  │ ⚫ │  │  ← Yellow (inactive)
    │  └────┘  │
    │  ┌────┐  │
    │  │ ⚫ │  │  ← Green (inactive)
    │  └────┘  │
    └──────────┘

         ↓ (after 4 seconds)

    ┌──────────┐
    │  ┌────┐  │
    │  │ ⚫ │  │  ← Red (inactive)
    │  └────┘  │
    │  ┌────┐  │
    │  │ ⚫ │  │  ← Yellow (inactive)
    │  └────┘  │
    │  ┌────┐  │
    │  │ 🟢 │  │  ← Green (3s)
    │  └────┘  │
    └──────────┘
\`\`\`

## State Machine

Traffic lights follow a simple **state machine**:

\`\`\`
    ┌─────────────────────────────────────┐
    │                                     │
    ▼                                     │
┌───────┐        ┌─────────┐        ┌─────┴───┐
│  RED  │───────▶│  GREEN  │───────▶│ YELLOW  │
└───────┘ 4000ms └─────────┘ 3000ms └─────────┘
                                      900ms
\`\`\`

## Key Concepts & Intuition

### 1. Configuration-Driven Design

Instead of hardcoding logic, use a **config object** that defines each state:

\`\`\`javascript
const LIGHTS_CONFIG = {
  red: {
    backgroundColor: "red",
    duration: 4000,
    next: "green"       // What comes next?
  },
  yellow: {
    backgroundColor: "yellow",
    duration: 900,
    next: "red"
  },
  green: {
    backgroundColor: "green",
    duration: 3000,
    next: "yellow"
  }
};
\`\`\`

**Benefits:**
- Easy to modify timing
- Easy to add/remove lights
- Logic is declarative, not imperative
- Single source of truth

### 2. State Transitions with useEffect

The \`useEffect\` hook handles automatic transitions:

\`\`\`javascript
const [activeLight, setActiveLight] = useState("red");

useEffect(() => {
  const currentConfig = LIGHTS_CONFIG[activeLight];

  // Schedule transition to next light
  const timer = setTimeout(() => {
    setActiveLight(currentConfig.next);
  }, currentConfig.duration);

  // Cleanup: cancel timer if light changes early
  return () => clearTimeout(timer);
}, [activeLight]);
\`\`\`

**How it works:**
1. Effect runs when \`activeLight\` changes
2. Sets timeout for current light's duration
3. Timeout fires → updates to next light
4. State change triggers re-render
5. Effect runs again (goto step 2)
6. Infinite cycle!

### 3. Cleanup Function - Why It Matters

\`\`\`javascript
return () => clearTimeout(timer);
\`\`\`

**Without cleanup:**
- If component unmounts mid-cycle, timer still fires
- Tries to update state on unmounted component
- React warning: "Can't perform state update on unmounted component"

**With cleanup:**
- Timer is cancelled when effect re-runs or component unmounts
- No memory leaks or warnings

### 4. Dynamic Rendering with Config

\`\`\`jsx
{Object.keys(LIGHTS_CONFIG).map((colorKey) => (
  <div
    key={colorKey}
    className="light"
    style={{
      backgroundColor: colorKey === activeLight
        ? LIGHTS_CONFIG[colorKey].backgroundColor
        : ""  // Inactive lights get no color
    }}
  />
))}
\`\`\`

This approach:
- Renders lights from config (not hardcoded)
- Easy to add a 4th light if needed
- Consistent order from config keys

## Implementation Tips

### CSS for Traffic Light

\`\`\`css
.traffic-light-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background-color: #333;      /* Dark housing */
  padding: 20px;
  border-radius: 10px;
  width: 60px;
  margin: 50px auto;
}

.light {
  width: 50px;
  height: 50px;
  border-radius: 50%;          /* Circular lights */
  transition: opacity 0.3s;    /* Smooth on/off */
  box-shadow: 0 0 10px rgba(0,0,0,0.5) inset;  /* 3D depth */
}
\`\`\`

### Adding a "Glow" Effect for Active Light

\`\`\`css
.light.active {
  box-shadow:
    0 0 20px currentColor,     /* Outer glow */
    0 0 40px currentColor,     /* Bigger glow */
    inset 0 0 10px rgba(255,255,255,0.5);  /* Inner shine */
}
\`\`\`

## Common Interview Questions

1. **Why use setTimeout instead of setInterval?**
   - Each light has different duration
   - setTimeout with dynamic delay is simpler
   - setInterval would need complex duration tracking

2. **How would you pause/resume the traffic light?**
   \`\`\`javascript
   const [isPaused, setIsPaused] = useState(false);

   useEffect(() => {
     if (isPaused) return;  // Don't schedule if paused
     // ... rest of effect
   }, [activeLight, isPaused]);
   \`\`\`

3. **How to handle a "pedestrian crossing" button?**
   - Add intermediate state or interrupt logic
   - Force transition to red, hold for crossing duration
   - Resume normal cycle

4. **Why start with red?**
   - Safety: red is the safest default
   - Real traffic lights start with red

## Edge Cases to Handle

- [ ] Component unmount during transition
- [ ] Very fast duration changes (race conditions)
- [ ] Browser tab becomes inactive (timers may throttle)
- [ ] Accessibility: add ARIA labels for screen readers

## Potential Extensions

1. **Countdown timer** display for each light
2. **Pedestrian signal** (walk/don't walk)
3. **Emergency mode** (all red or flashing)
4. **Configurable durations** via props
5. **Multiple traffic lights** in sync
6. **Sound effects** for visually impaired

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Render | O(1) | O(1) |
| State Transition | O(1) | O(1) |
| Timer Setup | O(1) | O(1) |

Extremely lightweight component!

## Key Insight

This pattern (config-driven state machine with useEffect) applies to many UI components:

- **Carousels/Slideshows**: auto-advance slides
- **Toast notifications**: auto-dismiss
- **Animation sequences**: timed transitions
- **Game timers**: countdown mechanics
- **Pomodoro timers**: work/break cycles

Master this pattern for any time-based UI behavior!
`,A0=`# Transfer List

## Problem Statement

Build a **Transfer List** component (also known as "Shuttle" or "Dual Listbox") that allows users to move items between two lists using selection and action buttons. This is a common UI pattern found in admin panels, permission managers, and form builders.

## Requirements

### Core Features
1. Display two lists side by side (left and right)
2. Each list shows items with checkboxes for selection
3. Arrow buttons between lists to transfer selected items
4. Items can be selected/deselected by clicking checkboxes
5. Selected items move to the target list and become deselected

### Interaction Flow
1. User checks items in either list
2. User clicks transfer button (\`>\` or \`<\`)
3. Checked items move to the other list
4. Moved items become unchecked in the new list

## Visual Representation

\`\`\`
┌─────────────────┐     ┌───┐     ┌─────────────────┐
│  Left List      │     │   │     │  Right List     │
├─────────────────┤     │ > │     ├─────────────────┤
│ ☑ HTML          │     │   │     │                 │
│ ☐ JavaScript    │ ──► ├───┤     │                 │
│ ☑ CSS           │     │   │     │                 │
│ ☐ TypeScript    │     │ < │     │                 │
└─────────────────┘     │   │     └─────────────────┘
                        └───┘

         ↓ (After clicking ">")

┌─────────────────┐     ┌───┐     ┌─────────────────┐
│  Left List      │     │   │     │  Right List     │
├─────────────────┤     │ > │     ├─────────────────┤
│ ☐ JavaScript    │     │   │     │ ☐ HTML          │
│ ☐ TypeScript    │     ├───┤     │ ☐ CSS           │
│                 │     │   │     │                 │
│                 │     │ < │     │                 │
└─────────────────┘     │   │     └─────────────────┘
                        └───┘
\`\`\`

## State Machine

\`\`\`
           ┌─────────────────────────────────────────┐
           │                                         │
           ▼                                         │
┌─────────────────┐     ┌─────────────────┐         │
│  Select Item    │────▶│  Item Checked   │─────────┘
└─────────────────┘     └─────────────────┘    (toggle)
                               │
                               │ (click transfer)
                               ▼
                        ┌─────────────────┐
                        │  Move to Other  │
                        │  List + Uncheck │
                        └─────────────────┘
\`\`\`

## Key Concepts & Intuition

### 1. State Structure

Three pieces of state are needed:

\`\`\`javascript
const [leftItems, setLeftItems] = useState(initialData);
const [rightItems, setRightItems] = useState([]);
const [checkedItems, setCheckedItems] = useState(new Set());
\`\`\`

**Why use a Set for checkedItems?**
- O(1) lookup for \`.has(item)\`
- O(1) add/delete operations
- Perfect for tracking "is this item checked?"

### 2. Set Operations: Intersection & Difference

Two helper functions power the transfer logic:

\`\`\`javascript
// Get items that are BOTH in list AND checked
const intersection = (list, checked) => {
  return list.filter(item => checked.has(item));
};

// Get items that are in list but NOT checked
const not = (list, checked) => {
  return list.filter(item => !checked.has(item));
};
\`\`\`

**Visual explanation:**

\`\`\`
leftItems = [A, B, C, D]
checkedItems = {A, C, X, Y}  (X, Y might be from right list)

intersection(leftItems, checkedItems) = [A, C]     ← Items to move
not(leftItems, checkedItems) = [B, D]              ← Items to keep
\`\`\`

### 3. Transfer Logic (Move Right)

\`\`\`javascript
const handleMoveRight = () => {
  // 1. Find which left items are checked
  const leftChecked = intersection(leftItems, checkedItems);

  if (leftChecked.length === 0) return;  // Safety check

  // 2. Add checked items to right list
  setRightItems(prev => [...prev, ...leftChecked]);

  // 3. Remove checked items from left list
  setLeftItems(prev => not(prev, checkedItems));

  // 4. Uncheck the moved items (CRITICAL!)
  const newChecked = new Set(checkedItems);
  leftChecked.forEach(item => newChecked.delete(item));
  setCheckedItems(newChecked);
};
\`\`\`

**Why uncheck after moving?**
- Prevents items from appearing "pre-selected" in new list
- User expects fresh state after transfer
- Avoids confusion about what's selected where

### 4. Toggle Checkbox Logic

\`\`\`javascript
const handleToggle = (item) => {
  const newChecked = new Set(checkedItems);

  if (newChecked.has(item)) {
    newChecked.delete(item);  // Uncheck
  } else {
    newChecked.add(item);     // Check
  }

  setCheckedItems(newChecked);
};
\`\`\`

**Why create new Set?**
- React needs new reference to trigger re-render
- \`set.add()\` mutates in place (won't trigger update)
- \`new Set(oldSet)\` creates shallow copy

### 5. Single Source of Truth for Checkboxes

Notice we use ONE \`checkedItems\` Set for BOTH lists:

\`\`\`javascript
// Works for items in either list!
const isChecked = checkedItems.has(item);
\`\`\`

**Alternative (worse) approach:**
\`\`\`javascript
// DON'T DO THIS - harder to manage
const [leftChecked, setLeftChecked] = useState(new Set());
const [rightChecked, setRightChecked] = useState(new Set());
\`\`\`

## Implementation Tips

### Reusable List Component

\`\`\`jsx
const ItemList = ({ items, checked, onToggle }) => (
  <div className="list-container">
    {items.map((item) => (
      <label key={item.id}>
        <input
          type="checkbox"
          checked={checked.has(item)}
          onChange={() => onToggle(item)}
        />
        <span>{item.title}</span>
      </label>
    ))}
  </div>
);
\`\`\`

### CSS Styling

\`\`\`css
.transfer-list {
  display: flex;
  gap: 20px;
  align-items: center;
}

.list-container {
  border: 1px solid #ccc;
  padding: 10px;
  width: 150px;
  height: 200px;
  overflow-y: auto;
}

.transfer-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.transfer-buttons button {
  padding: 8px 16px;
  cursor: pointer;
}
\`\`\`

## Common Interview Questions

1. **Why use object reference in Set instead of ID?**
   \`\`\`javascript
   // Using object reference (current approach)
   checkedItems.has(item)  // Simple, works if same object

   // Using ID (more robust for real apps)
   checkedIds.has(item.id)  // Works even with different object references
   \`\`\`

2. **How would you add "Select All" functionality?**
   \`\`\`javascript
   const selectAllLeft = () => {
     const newChecked = new Set(checkedItems);
     leftItems.forEach(item => newChecked.add(item));
     setCheckedItems(newChecked);
   };
   \`\`\`

3. **How to disable transfer buttons when nothing is selected?**
   \`\`\`jsx
   <button
     onClick={handleMoveRight}
     disabled={intersection(leftItems, checkedItems).length === 0}
   >
     &gt;
   </button>
   \`\`\`

4. **How would you handle drag-and-drop transfer?**
   - Use HTML5 Drag and Drop API or library like \`react-dnd\`
   - On drop, perform same logic as button click
   - Update UI to show drop zones

5. **How to persist selections across page refresh?**
   \`\`\`javascript
   // Save to localStorage on change
   useEffect(() => {
     localStorage.setItem('leftItems', JSON.stringify(leftItems));
     localStorage.setItem('rightItems', JSON.stringify(rightItems));
   }, [leftItems, rightItems]);
   \`\`\`

## Edge Cases to Handle

- [ ] Empty lists (show placeholder message)
- [ ] Very long item names (text overflow)
- [ ] Duplicate items (ensure unique IDs)
- [ ] Many items (virtualization for performance)
- [ ] Keyboard navigation (a11y)
- [ ] Screen reader support (ARIA labels)

## Potential Extensions

1. **Search/Filter** items within each list
2. **Drag and drop** reordering within lists
3. **Move all** buttons (\`>>\` and \`<<\`)
4. **Sorting** items alphabetically
5. **Grouping** items by category
6. **Async loading** items from API
7. **Undo/Redo** transfer actions

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Toggle checkbox | O(1) | O(n) for Set copy |
| Check if selected | O(1) | - |
| Move items | O(k) | O(k) where k = items moved |
| Render list | O(n) | O(n) |

Very efficient with Set-based selection tracking!

## Key Insight

This pattern demonstrates the power of **Set operations** in React state management:

\`\`\`
Mathematical Set Theory    →    React Implementation
─────────────────────────────────────────────────────
A ∩ B (intersection)       →    filter(item => set.has(item))
A - B (difference)         →    filter(item => !set.has(item))
A ∪ B (union)              →    new Set([...setA, ...setB])
\`\`\`

The Transfer List is essentially a visual representation of moving elements between sets!

## Real-World Applications

This component pattern is used in:

- **Permission managers**: Assign roles to users
- **Email clients**: Move messages between folders
- **Form builders**: Select which fields to include
- **Shopping carts**: Move items to wishlist
- **Task managers**: Move tasks between columns
- **Playlist editors**: Add/remove songs
`,O0=`# Typeahead / Autocomplete Search

## Problem Statement

Build a **Typeahead/Autocomplete** component that searches for products as the user types in an input field. The component should fetch results from an API and display them efficiently.

## Requirements

### Core Features
1. Text input field that triggers search
2. Fetch results from API as user types
3. Display search results below the input
4. Handle loading and error states

### Performance Requirements
- **Debounce** user input to avoid excessive API calls
- **Cancel** pending requests when user types new characters
- Clear results when input is empty

## Visual Representation

\`\`\`
┌─────────────────────────────────────────┐
│  🔍 Search products (e.g. 'phone')...   │
└─────────────────────────────────────────┘
           │
           ▼  (after debounce delay)
┌─────────────────────────────────────────┐
│  📱 iPhone 15                           │
│  📱 Samsung Galaxy                      │
│  📱 Google Pixel                        │
│  ...                                    │
└─────────────────────────────────────────┘
\`\`\`

## Key Concepts & Intuition

### 1. Debouncing - Why and How?

**Problem:** If we fetch on every keystroke, typing "phone" creates 5 API calls (p, ph, pho, phon, phone).

**Solution:** Wait for user to stop typing before making the API call.

\`\`\`
User types: p...h...o...n...e
            │   │   │   │   │
            ▼   ▼   ▼   ▼   ▼
Without debounce: 5 API calls ❌

With 500ms debounce:
p → wait... (user still typing)
h → reset timer, wait...
o → reset timer, wait...
n → reset timer, wait...
e → reset timer, wait... → 500ms passes → 1 API call ✅
\`\`\`

### 2. Request Cancellation with AbortController

**Problem:** User types "apple", API starts fetching. User changes to "banana". Now we have a **race condition** - what if "apple" results arrive AFTER "banana" results?

**Solution:** Cancel the previous request when a new one starts.

\`\`\`javascript
const controller = new AbortController();
fetch(url, { signal: controller.signal });

// Later, to cancel:
controller.abort();
\`\`\`

### 3. Cleanup Function Pattern

The \`useEffect\` cleanup function runs:
- Before the effect runs again (when dependencies change)
- When the component unmounts

\`\`\`javascript
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });

  // This runs BEFORE the next effect
  return () => controller.abort();
}, [searchTerm]);
\`\`\`

## Implementation Tips

### Custom Debounce Hook

\`\`\`javascript
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
\`\`\`

### Data Flow

\`\`\`
User Input → useState → useDebounce → Debounced Value → useEffect → API Call
     │                                                                  │
     └────────────────────────────────────────────────────────────────┘
                                Results → UI
\`\`\`

## Common Interview Questions

1. **Why debounce instead of throttle?**
   - Debounce waits for "quiet time" - perfect for search (user finished typing)
   - Throttle limits rate - better for continuous events (scroll, resize)

2. **What happens if you don't cancel requests?**
   - Race conditions: old results might overwrite new results
   - Memory leaks: state updates on unmounted components
   - Wasted bandwidth

3. **How to handle errors gracefully?**
   - Distinguish between AbortError (intentional) and real errors
   - Don't show error UI when request was intentionally cancelled

## Edge Cases to Handle

- [ ] Empty search term - clear results
- [ ] Network errors - show error state
- [ ] Aborted requests - don't show error
- [ ] Rapid typing - only latest request matters
- [ ] Component unmount during fetch - prevent state update

## API Used

\`\`\`
https://dummyjson.com/products/search?q={searchTerm}
\`\`\`

Returns: \`{ products: [...], total: number, skip: number, limit: number }\`

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Debounce | O(1) | O(1) |
| API Call | O(n) | O(n) |
| Render Results | O(n) | O(n) |

Where n = number of search results
`,M0=`# Virtual List (Windowing)

## Problem Statement

Build a **Virtualized List** component that efficiently renders large datasets (10,000+ items) by only rendering items visible in the viewport. This is a critical performance optimization for data-heavy applications.

This pattern is essential for:
- Large data tables and spreadsheets
- Chat applications (message history)
- Social media feeds
- File explorers
- Log viewers
- IDE code editors
- Dropdown menus with many options

---

## Requirements

### Functional Requirements

1. **Render Visible Items Only**
   - Calculate which items are in the viewport
   - Render only those items (plus buffer)
   - Update on scroll

2. **Dynamic Height Measurement**
   - Measure item height automatically
   - Don't hardcode item dimensions
   - Support variable heights (optional)

3. **Scroll Behavior**
   - Maintain native scroll feel
   - Show correct scrollbar size
   - Support smooth scrolling

4. **Overscan Buffer**
   - Render extra items above/below viewport
   - Prevent blank flashes during fast scroll
   - Configurable buffer size

5. **Performance**
   - Handle 20,000+ items smoothly
   - 60fps scroll performance
   - Minimal DOM nodes

### Non-Functional Requirements

- No scroll jank or stuttering
- Accurate scrollbar representation
- Memory efficient
- Quick initial render

---

## Visual Representation

\`\`\`
Traditional Rendering (20,000 items):
+------------------------------------------+
|  DOM: 20,000 nodes                       |
|  +------------------------------------+  |
|  | Item 1                             |  |
|  | Item 2                             |  |
|  | Item 3                             |  |
|  | ...                                |  |
|  | Item 19,998                        |  |
|  | Item 19,999                        |  |
|  | Item 20,000                        |  |
|  +------------------------------------+  |
|  Memory: HIGH | Performance: SLOW        |
+------------------------------------------+

Virtual Rendering (20,000 items):
+------------------------------------------+
|  DOM: ~15-20 nodes                       |
|  +------------------------------------+  |
|  | Spacer (maintains scroll height)   |  |
|  |  +------------------------------+  |  |
|  |  | Translated Window            |  |  |
|  |  |  +------------------------+  |  |  |
|  |  |  | Item 45 (overscan)     |  |  |  |
|  |  |  | Item 46 (overscan)     |  |  |  |
|  |  |  | Item 47 (visible)      |  |  |  | <- Viewport
|  |  |  | Item 48 (visible)      |  |  |  |
|  |  |  | Item 49 (visible)      |  |  |  |
|  |  |  | Item 50 (overscan)     |  |  |  |
|  |  |  | Item 51 (overscan)     |  |  |  |
|  |  |  +------------------------+  |  |  |
|  |  +------------------------------+  |  |
|  +------------------------------------+  |
|  Memory: LOW | Performance: FAST         |
+------------------------------------------+

Spacer Technique:
+------------------------------------------+
| Container (overflow: auto)               |
|  +------------------------------------+  |
|  | Spacer div                         |  |
|  | height: totalItems × itemHeight    |  |
|  | (creates correct scrollbar)        |  |
|  |                                    |  |
|  |  ↓ translateY(startIndex × height) |  |
|  |  +----------------------------+    |  |
|  |  | Actual rendered items      |    |  |
|  |  | (only visible + buffer)    |    |  |
|  |  +----------------------------+    |  |
|  |                                    |  |
|  +------------------------------------+  |
+------------------------------------------+
\`\`\`

---

## Key Concepts & Intuition

### 1. The Core Formula

\`\`\`javascript
// How many items fit in the viewport?
const visibleCount = Math.ceil(CONTAINER_HEIGHT / itemHeight);

// Which item is at the top of the viewport?
const startIndex = Math.floor(scrollTop / itemHeight);

// Add overscan buffer
const bufferedStart = Math.max(0, startIndex - OVERSCAN);
const bufferedEnd = Math.min(totalItems, startIndex + visibleCount + OVERSCAN);
\`\`\`

### 2. Spacer for Correct Scrollbar

\`\`\`jsx
// Outer container: scrollable, fixed height
<div style={{ height: CONTAINER_HEIGHT, overflowY: 'auto' }}>
    {/* Spacer: full height of all items (creates scrollbar) */}
    <div style={{ height: totalItems * itemHeight, position: 'relative' }}>
        {/* Window: positioned at correct scroll offset */}
        <div style={{ transform: \`translateY(\${startIndex * itemHeight}px)\` }}>
            {/* Only render visible items */}
            {visibleItems.map(...)}
        </div>
    </div>
</div>
\`\`\`

**Why this structure?**
- Container gives us \`scrollTop\` and scroll events
- Spacer creates correct total height (accurate scrollbar)
- Inner div uses \`translateY\` to position visible items

### 3. Dynamic Height Measurement

\`\`\`javascript
const [itemHeight, setItemHeight] = useState(null);
const firstItemRef = useRef(null);

// Measure first item ONCE on mount
useLayoutEffect(() => {
    if (firstItemRef.current && !itemHeight) {
        const height = firstItemRef.current.getBoundingClientRect().height;
        setItemHeight(height);
    }
}, [itemHeight]);

// Initial render: show only first item for measurement
if (!itemHeight) {
    return (
        <div style={{ height: CONTAINER_HEIGHT, overflowY: 'auto' }}>
            <div ref={firstItemRef}>{items[0]}</div>
        </div>
    );
}
\`\`\`

**Why useLayoutEffect?**
- Runs synchronously after DOM mutation
- Blocks paint until complete
- Prevents flash of un-virtualized content

### 4. Scroll Handler

\`\`\`javascript
const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
}, []);

// scrollTop triggers re-calculation of visible window
\`\`\`

### 5. Overscan Buffer

\`\`\`javascript
const OVERSCAN = 5;  // Render 5 extra items above/below

const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - OVERSCAN);
const endIndex = Math.min(totalItems, startIndex + visibleCount + OVERSCAN * 2);
\`\`\`

**Why overscan?**
- Prevents blank areas during fast scrolling
- Items pre-rendered before they become visible
- Trade-off: more DOM nodes vs smoother experience

---

## Implementation Tips

### 1. Calculate Visible Window

\`\`\`javascript
const totalItems = items.length;
const visibleCount = Math.ceil(CONTAINER_HEIGHT / itemHeight);

const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - OVERSCAN);
const endIndex = Math.min(totalItems, startIndex + visibleCount + OVERSCAN * 2);

const visibleItems = items.slice(startIndex, endIndex);
const totalHeight = totalItems * itemHeight;
const offsetY = startIndex * itemHeight;
\`\`\`

### 2. Use Transform (GPU Accelerated)

\`\`\`jsx
// Good: GPU-accelerated, smooth
<div style={{ transform: \`translateY(\${offsetY}px)\` }}>

// Bad: Causes layout recalculation
<div style={{ marginTop: offsetY }}>
<div style={{ top: offsetY, position: 'absolute' }}>
\`\`\`

### 3. Key Strategy

\`\`\`jsx
// Use actual index as key, not array position
{visibleItems.map((item, localIndex) => (
    <div key={startIndex + localIndex}>  {/* Real index */}
        {item}
    </div>
))}
\`\`\`

### 4. Container Styles

\`\`\`jsx
<div
    onScroll={handleScroll}
    style={{
        height: CONTAINER_HEIGHT,
        overflowY: 'auto',
        border: '1px solid #ccc'
    }}
>
\`\`\`

---

## Common Interview Questions

### Q1: Why not just use CSS \`overflow: auto\` and let browser handle it?

**Answer:** The browser will still create DOM nodes for all 20,000 items. Each DOM node consumes memory (~1KB+ with styles). Virtual scrolling keeps DOM count constant (~20 nodes) regardless of data size.

### Q2: How would you handle variable height items?

\`\`\`javascript
// Option 1: Measure all heights upfront (expensive)
const heights = items.map(item => measureHeight(item));

// Option 2: Measure on demand and cache
const heightCache = useRef(new Map());

const getItemHeight = (index) => {
    if (!heightCache.current.has(index)) {
        // Render offscreen, measure, cache
        heightCache.current.set(index, measuredHeight);
    }
    return heightCache.current.get(index);
};

// Option 3: Estimate + adjust (react-virtualized approach)
const estimatedHeight = 50;
const [measuredHeights, setMeasuredHeights] = useState({});

// Calculate positions using known heights + estimates
\`\`\`

### Q3: How would you implement scroll-to-index?

\`\`\`javascript
const scrollToIndex = (index) => {
    const targetOffset = index * itemHeight;
    containerRef.current.scrollTop = targetOffset;
};

// For variable heights:
const scrollToIndex = (index) => {
    const targetOffset = heights
        .slice(0, index)
        .reduce((sum, h) => sum + h, 0);
    containerRef.current.scrollTop = targetOffset;
};
\`\`\`

### Q4: How would you implement infinite loading with virtual list?

\`\`\`javascript
useEffect(() => {
    // When near bottom, load more
    const remainingItems = totalItems - (startIndex + visibleCount);
    if (remainingItems < OVERSCAN && hasMore && !isLoading) {
        loadMoreItems();
    }
}, [startIndex, visibleCount, hasMore, isLoading]);
\`\`\`

### Q5: Why use translateY instead of absolute positioning?

**Answer:** \`transform: translateY()\` is GPU-accelerated and doesn't cause layout recalculation. Absolute positioning with \`top\` triggers layout calculations, which is slower for frequent updates during scrolling.

### Q6: How would you handle horizontal scrolling (virtual grid)?

\`\`\`javascript
const visibleRowStart = Math.floor(scrollTop / rowHeight);
const visibleRowEnd = visibleRowStart + Math.ceil(containerHeight / rowHeight);

const visibleColStart = Math.floor(scrollLeft / colWidth);
const visibleColEnd = visibleColStart + Math.ceil(containerWidth / colWidth);

// Render only cells in visible range
for (let row = visibleRowStart; row < visibleRowEnd; row++) {
    for (let col = visibleColStart; col < visibleColEnd; col++) {
        // Render cell at (row, col)
    }
}
\`\`\`

---

## Edge Cases to Consider

1. **Empty list** - Handle gracefully
2. **Single item** - Should still work
3. **Rapid scrolling** - Overscan helps, but may need throttling
4. **Window resize** - Recalculate visible count
5. **Item height change** - Remeasure or invalidate cache
6. **Dynamic data** - Items added/removed during scroll
7. **Scroll restoration** - Maintain position after data change
8. **Accessibility** - Screen readers need all content
9. **Search/filter** - Jump to matched item

---

## Complexity Analysis

| Operation | Traditional | Virtual |
|-----------|-------------|---------|
| Initial render | O(n) | O(k) |
| Memory (DOM) | O(n) | O(k) |
| Scroll | O(n) reflow | O(k) transform |
| Search | O(n) | O(k) render + O(n) search |

Where n = total items, k = visible items + buffer (~20)

### Performance Comparison

| Items | Traditional DOM | Virtual DOM | Memory Savings |
|-------|-----------------|-------------|----------------|
| 100 | 100 nodes | ~20 nodes | 80% |
| 1,000 | 1,000 nodes | ~20 nodes | 98% |
| 10,000 | 10,000 nodes | ~20 nodes | 99.8% |
| 100,000 | Crashes | ~20 nodes | 99.98% |

---

## Performance Optimizations

### 1. Memoize Item Component

\`\`\`jsx
const ListItem = React.memo(({ item, style }) => (
    <div style={style}>{item.content}</div>
));
\`\`\`

### 2. Throttle Scroll Handler

\`\`\`javascript
const handleScroll = useMemo(
    () => throttle((e) => {
        setScrollTop(e.target.scrollTop);
    }, 16),  // ~60fps
    []
);
\`\`\`

### 3. Use CSS contain

\`\`\`css
.list-item {
    contain: layout style paint;  /* Isolate repaints */
}
\`\`\`

### 4. Avoid Inline Styles

\`\`\`javascript
// Bad: Creates new object every render
style={{ height: itemHeight }}

// Good: Memoize or use CSS
const itemStyle = useMemo(() => ({
    height: itemHeight
}), [itemHeight]);
\`\`\`

### 5. Use requestAnimationFrame

\`\`\`javascript
const handleScroll = (e) => {
    if (rafId.current) return;

    rafId.current = requestAnimationFrame(() => {
        setScrollTop(e.target.scrollTop);
        rafId.current = null;
    });
};
\`\`\`

---

## Real-World Applications

1. **Spreadsheets** - Google Sheets, Excel Online
2. **Chat Apps** - Slack, Discord message history
3. **Social Media** - Twitter, Facebook feeds
4. **File Managers** - Dropbox, Google Drive
5. **Log Viewers** - Developer tools, monitoring
6. **Code Editors** - VSCode, Monaco editor
7. **Data Tables** - Admin dashboards, analytics
8. **Dropdowns** - Select with 1000+ options

---

## Libraries & Alternatives

| Library | Features | Size |
|---------|----------|------|
| react-window | Fixed/Variable heights, Grid | 6kb |
| react-virtualized | Full-featured, complex | 33kb |
| @tanstack/virtual | Framework agnostic | 5kb |
| react-virtuoso | Auto-sizing, grouped | 15kb |

### When to Build Custom vs Use Library

**Build custom when:**
- Fixed height items only
- Simple use case
- Bundle size critical
- Learning purposes

**Use library when:**
- Variable heights needed
- Complex features (sticky headers, infinite load)
- Production application
- Grid virtualization needed

---

## Related Patterns

- **Infinite Scroll** - Load more data on scroll
- **Pagination** - Page-based data loading
- **Windowing** - General term for virtualization
- **Recycling** - Reuse DOM nodes (mobile native)
- **Lazy Loading** - Load content on demand
`,D0=`# Wordle - Word Guessing Game

## What Are We Building?

A clone of the viral word game **Wordle** by Josh Wardle (acquired by The New York Times). Players have **6 attempts** to guess a **5-letter word**, with colored feedback after each guess showing which letters are correct, present in the word, or absent.

Think of it like a combination of Mastermind and Hangman, where you use deductive reasoning and letter frequency knowledge to narrow down possibilities with each guess!

---

## The Problem Statement

Build a web-based Wordle game with the following requirements:

### Core Rules
1. A random 5-letter word is chosen at the start
2. Player has 6 attempts to guess the word
3. After each guess, tiles change color:
   - 🟩 **Green**: Letter is correct and in the right position
   - 🟨 **Yellow**: Letter is in the word but wrong position
   - ⬛ **Gray**: Letter is not in the word at all
4. Game ends when player guesses correctly (win) or uses all 6 attempts (lose)

### Interface Requirements
- 6×5 grid of letter tiles
- Virtual on-screen keyboard with color feedback
- Physical keyboard support
- "Play Again" button after game ends

### Simplified Constraints
- No need to validate if guess is a real English word
- New random word selected each game (not daily word)
- Show target word in dev mode for testing

---

## Visual Example

### Game Flow

**Initial State:**
\`\`\`
[ ] [ ] [ ] [ ] [ ]
[ ] [ ] [ ] [ ] [ ]
[ ] [ ] [ ] [ ] [ ]
[ ] [ ] [ ] [ ] [ ]
[ ] [ ] [ ] [ ] [ ]
[ ] [ ] [ ] [ ] [ ]
\`\`\`

**After Guess 1: "SLATE"** (Target: "REACT")
\`\`\`
[S] [L] [A] [T] [E]  ← S=gray, L=gray, A=yellow, T=yellow, E=green
[ ] [ ] [ ] [ ] [ ]
...
\`\`\`

**After Guess 2: "GREAT"** (Target: "REACT")
\`\`\`
[S] [L] [A] [T] [E]
[G] [R] [E] [A] [T]  ← G=gray, R=green, E=green, A=green, T=green
...
\`\`\`

**After Guess 3: "REACT"** (Target: "REACT")
\`\`\`
[S] [L] [A] [T] [E]
[G] [R] [E] [A] [T]
[R] [E] [A] [C] [T]  ← All green! You win! 🎉
...
\`\`\`

---

## Color Scheme (Official Wordle Colors)

| State | Color | Hex Code | Meaning |
|-------|-------|----------|---------|
| **Default** | Light Gray | \`#d3d6da\` | Empty or not yet evaluated |
| **Correct** | Green | \`#6aaa64\` | Letter in correct position |
| **Present** | Yellow | \`#c9b458\` | Letter in word, wrong position |
| **Absent** | Dark Gray | \`#787c7e\` | Letter not in word |

---

## The Challenge: Duplicate Letter Logic

### Challenge 1: Handling Duplicate Letters Correctly

**Wrong Approach:**
\`\`\`javascript
// ❌ Naive: Check each letter independently
guess.split('').map(letter =>
  target.includes(letter) ? 'present' : 'absent'
)
\`\`\`

**Problem:** This doesn't account for:
1. **Exact position matches** (should be GREEN, not YELLOW)
2. **Letter frequency** (if target has one 'O' but guess has two 'O's)

**Example Bug:**
- Target: \`ROBOT\`
- Guess: \`FLOOR\`
- Naive result: F=gray, L=gray, **O=yellow**, **O=yellow**, R=yellow
- ❌ **Wrong!** Second 'O' should be gray (target only has 2 O's, and first O already matched)

**Correct Approach: Two-Pass Algorithm**

\`\`\`javascript
function evaluateGuess(guess, target) {
  const result = Array(5).fill(null)
  const targetFreq = {}

  // PASS 1: Mark exact matches (GREEN)
  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) {
      result[i] = 'correct'
    } else {
      // Build frequency map of remaining target letters
      targetFreq[target[i]] = (targetFreq[target[i]] || 0) + 1
    }
  }

  // PASS 2: Check for present (YELLOW) or absent (GRAY)
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'correct') continue // Skip already marked

    const letter = guess[i]
    if (targetFreq[letter] > 0) {
      result[i] = 'present'
      targetFreq[letter]-- // Consume one instance
    } else {
      result[i] = 'absent'
    }
  }

  return result
}
\`\`\`

**Correct Result:**
- Target: \`ROBOT\`
- Guess: \`FLOOR\`
- Result: F=gray, L=gray, **O=green** (position match), **O=gray** (no more O's left), R=yellow

---

## Key Concepts Explained

### 1. Game State Management

We need to track multiple pieces of state:

\`\`\`javascript
const [targetWord] = useState(() => getRandomWord()) // Selected once on mount
const [guesses, setGuesses] = useState([])           // ["SLATE", "GREAT", ...]
const [currentGuess, setCurrentGuess] = useState('') // "REA" (being typed)
const [gameStatus, setGameStatus] = useState('playing') // 'playing' | 'won' | 'lost'
const [letterStates, setLetterStates] = useState({}) // { 'A': 'correct', 'B': 'absent', ... }
\`\`\`

**Why separate \`guesses\` and \`currentGuess\`?**
- \`guesses\`: Submitted and evaluated guesses (immutable history)
- \`currentGuess\`: Temporary input (can be modified with backspace)

---

### 2. Keyboard Letter States (Priority System)

The virtual keyboard changes color based on letter usage across all guesses:

**Priority Rules:**
- 🟩 **Green (correct)** beats everything
- 🟨 **Yellow (present)** beats gray
- ⬛ **Gray (absent)** is lowest priority

**Example:**
- Guess 1: "SLATE" → A is yellow (present)
- Guess 2: "GREAT" → A is green (correct)
- Keyboard should show A as **green**, not yellow

**Implementation:**
\`\`\`javascript
function updateLetterStates(guess, evaluation) {
  const newStates = { ...letterStates }

  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i]
    const state = evaluation[i]

    // Don't downgrade: correct > present > absent
    if (newStates[letter] === 'correct') continue
    if (newStates[letter] === 'present' && state === 'absent') continue

    newStates[letter] = state
  }

  setLetterStates(newStates)
}
\`\`\`

---

### 3. Keyboard Input Handling

Support both physical and virtual keyboards:

**Physical Keyboard:**
\`\`\`javascript
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') submitGuess()
    else if (e.key === 'Backspace') setCurrentGuess(prev => prev.slice(0, -1))
    else if (/^[a-z]$/i.test(e.key)) {
      setCurrentGuess(prev =>
        prev.length < 5 ? prev + e.key.toUpperCase() : prev
      )
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [currentGuess, gameStatus])
\`\`\`

**Virtual Keyboard:**
\`\`\`javascript
<button onClick={() => handleKeyPress('A')}>A</button>
<button onClick={() => handleKeyPress('ENTER')}>ENTER</button>
<button onClick={() => handleKeyPress('BACKSPACE')}>⌫</button>
\`\`\`

---

### 4. Win/Lose Conditions

**Win Condition:**
\`\`\`javascript
if (currentGuess === targetWord) {
  setGameStatus('won')
}
\`\`\`

**Lose Condition:**
\`\`\`javascript
if (guesses.length >= 6 && currentGuess !== targetWord) {
  setGameStatus('lost')
}
\`\`\`

**Blocking Input:**
\`\`\`javascript
const handleKeyPress = (key) => {
  if (gameStatus !== 'playing') return // ✅ Ignore input after game ends
  // ... rest of logic
}
\`\`\`

---

## The Algorithm (Step-by-Step)

### Step 1: Initialize Game

\`\`\`javascript
// Select random word on mount (useState with initializer function)
const [targetWord] = useState(() =>
  WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]
)

// Initialize empty state
const [guesses, setGuesses] = useState([])
const [currentGuess, setCurrentGuess] = useState('')
const [gameStatus, setGameStatus] = useState('playing')
const [letterStates, setLetterStates] = useState({})
\`\`\`

---

### Step 2: Handle Letter Input

\`\`\`javascript
const handleKeyPress = (key) => {
  if (gameStatus !== 'playing') return

  if (key === 'ENTER') {
    // Submit guess
    if (currentGuess.length === 5) {
      submitGuess()
    }
  } else if (key === 'BACKSPACE') {
    // Remove last letter
    setCurrentGuess(prev => prev.slice(0, -1))
  } else if (/^[A-Z]$/.test(key)) {
    // Add letter (max 5)
    if (currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key)
    }
  }
}
\`\`\`

---

### Step 3: Evaluate Guess (Two-Pass Algorithm)

\`\`\`javascript
const evaluateGuess = (guess) => {
  const result = Array(5).fill(null)
  const targetFreq = {}

  // Pass 1: Mark exact matches (correct = green)
  for (let i = 0; i < 5; i++) {
    if (guess[i] === targetWord[i]) {
      result[i] = 'correct'
    } else {
      targetFreq[targetWord[i]] = (targetFreq[targetWord[i]] || 0) + 1
    }
  }

  // Pass 2: Check present (yellow) or absent (gray)
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'correct') continue

    const letter = guess[i]
    if (targetFreq[letter] > 0) {
      result[i] = 'present'
      targetFreq[letter]--
    } else {
      result[i] = 'absent'
    }
  }

  return result
}
\`\`\`

---

### Step 4: Update Keyboard States

\`\`\`javascript
const updateLetterStates = (guess, evaluation) => {
  const newStates = { ...letterStates }

  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i]
    const state = evaluation[i]

    // Priority: correct > present > absent
    if (newStates[letter] === 'correct') continue
    if (newStates[letter] === 'present' && state === 'absent') continue

    newStates[letter] = state
  }

  setLetterStates(newStates)
}
\`\`\`

---

### Step 5: Check Win/Lose

\`\`\`javascript
const submitGuess = () => {
  if (currentGuess.length !== 5) {
    alert('Word must be 5 letters!')
    return
  }

  const evaluation = evaluateGuess(currentGuess)
  updateLetterStates(currentGuess, evaluation)

  const newGuesses = [...guesses, currentGuess]
  setGuesses(newGuesses)
  setCurrentGuess('')

  // Check win
  if (currentGuess === targetWord) {
    setGameStatus('won')
    return
  }

  // Check lose
  if (newGuesses.length >= 6) {
    setGameStatus('lost')
  }
}
\`\`\`

---

## Edge Cases to Handle

### Edge Case 1: Duplicate Letters

**Problem:** Target has 1 'O', guess has 2 'O's

**Solution:** Use frequency map, consume letters as you match them

**Test Case:**
\`\`\`javascript
// Target: ROBOT, Guess: FLOOR
// Expected: F=gray, L=gray, O=green, O=gray, R=yellow
\`\`\`

---

### Edge Case 2: Keyboard Priority

**Problem:** Letter appears in multiple guesses with different states

**Solution:** Priority system: correct > present > absent

**Test Case:**
\`\`\`javascript
// Guess 1: "SLATE" → T=gray
// Guess 2: "GREAT" → T=yellow
// Keyboard should show T as YELLOW (don't downgrade from yellow to gray)
\`\`\`

---

### Edge Case 3: Input After Game Ends

**Problem:** User keeps typing after winning/losing

**Solution:** Guard clause at start of \`handleKeyPress\`

\`\`\`javascript
if (gameStatus !== 'playing') return
\`\`\`

---

### Edge Case 4: Incomplete Word Submission

**Problem:** User presses ENTER with less than 5 letters

**Solution:** Validate length before submitting

\`\`\`javascript
if (currentGuess.length !== 5) {
  alert('Word must be 5 letters!')
  return
}
\`\`\`

---

## Common Mistakes (Learn from These!)

### ❌ Mistake 1: Single-Pass Evaluation

\`\`\`javascript
// ❌ WRONG: Check all letters in one pass
guess.split('').map((letter, i) => {
  if (letter === target[i]) return 'correct'
  if (target.includes(letter)) return 'present'
  return 'absent'
})
\`\`\`

**Why it fails:** Duplicate letters aren't handled correctly.

**Fix:** Use two-pass algorithm with frequency map.

---

### ❌ Mistake 2: Not Tracking Letter Frequency

\`\`\`javascript
// ❌ WRONG: Mark all matching letters as yellow
for (let i = 0; i < 5; i++) {
  if (target.includes(guess[i])) {
    result[i] = 'present'
  }
}
\`\`\`

**Problem:** If target is "ROBOT" and guess is "OOOOO", all 5 O's become yellow (wrong!)

**Fix:** Decrement frequency as you use letters.

---

### ❌ Mistake 3: Downgrading Keyboard Letter States

\`\`\`javascript
// ❌ WRONG: Always overwrite with latest state
letterStates[letter] = evaluation[i]
\`\`\`

**Problem:** If A was green in guess 1, but gray in guess 2, keyboard shows gray (wrong!)

**Fix:** Implement priority system (correct > present > absent).

---

### ❌ Mistake 4: Not Preventing Default on Physical Keyboard

\`\`\`javascript
// ❌ WRONG: Missing preventDefault
window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitGuess() // Browser might submit a form!
})
\`\`\`

**Fix:** Always call \`e.preventDefault()\` for handled keys.

---

## Complexity Analysis

### Time Complexity

| Operation | Complexity | Notes |
|-----------|------------|-------|
| **Evaluate guess** | O(n) | n = 5 (word length), effectively **O(1)** |
| **Update keyboard** | O(n) | n = 5 letters per guess, **O(1)** |
| **Render grid** | O(m × n) | m = 6 rows, n = 5 letters, effectively **O(1)** |
| **Submit guess** | O(n) | n = 5, **O(1)** |

**Overall:** O(1) - constant time (word length is fixed)

---

### Space Complexity

| Structure | Space | Notes |
|-----------|-------|-------|
| **guesses** | O(m × n) | Max 6 guesses × 5 letters = 30 cells, **O(1)** |
| **letterStates** | O(k) | k = 26 letters, **O(1)** |
| **targetFreq** | O(k) | Max 26 unique letters, **O(1)** |

**Overall:** O(1) - constant space

---

## Interview Tips

### What to Explain

1. **Two-pass algorithm**: Why it's necessary for duplicate letters
2. **Keyboard priority system**: Why correct > present > absent
3. **State separation**: Why \`guesses\` vs \`currentGuess\` matters
4. **Edge cases**: Duplicate letters, incomplete words, post-game input

### What Interviewers Look For

✅ **Correct duplicate letter handling** (most critical!)
✅ **Clean state management** (no unnecessary re-renders)
✅ **Keyboard accessibility** (both virtual and physical)
✅ **Win/lose logic** (proper game flow)
✅ **Visual feedback** (colors, animations, button states)

---

## Follow-Up Questions You Might Get

### Q: How would you validate if a guess is a real word?

**A:** Maintain a \`VALID_WORDS\` Set for O(1) lookup:

\`\`\`javascript
const VALID_WORDS = new Set(['REACT', 'SLATE', 'GREAT', ...])

const submitGuess = () => {
  if (!VALID_WORDS.has(currentGuess)) {
    alert('Not in word list!')
    return
  }
  // ... rest of logic
}
\`\`\`

---

### Q: How would you add tile flip animations?

**A:** Use CSS animations with staggered delays:

\`\`\`javascript
const renderTile = (letter, state, index) => {
  const delay = state ? index * 0.2 : 0 // Flip tiles sequentially

  return (
    <div
      style={{
        animation: state ? \`flip 0.5s ease \${delay}s\` : 'none',
        // ... other styles
      }}
    >
      {letter}
    </div>
  )
}

// CSS:
// @keyframes flip {
//   0% { transform: rotateX(0); }
//   50% { transform: rotateX(90deg); }
//   100% { transform: rotateX(0); }
// }
\`\`\`

---

### Q: How would you persist game state across refreshes?

**A:** Use \`localStorage\`:

\`\`\`javascript
// Save on every state change
useEffect(() => {
  localStorage.setItem('wordle-state', JSON.stringify({
    targetWord,
    guesses,
    currentGuess,
    gameStatus,
    letterStates,
  }))
}, [guesses, currentGuess, gameStatus])

// Load on mount
const [state, setState] = useState(() => {
  const saved = localStorage.getItem('wordle-state')
  return saved ? JSON.parse(saved) : initialState
})
\`\`\`

---

### Q: How would you add a "Share Results" feature?

**A:** Generate emoji grid and copy to clipboard:

\`\`\`javascript
const shareResults = () => {
  const emojiGrid = guesses.map(guess => {
    const evaluation = evaluateGuess(guess)
    return evaluation.map(state => {
      if (state === 'correct') return '🟩'
      if (state === 'present') return '🟨'
      return '⬛'
    }).join('')
  }).join('\\n')

  const text = \`Wordle \${guesses.length}/6\\n\\n\${emojiGrid}\`

  navigator.clipboard.writeText(text)
  alert('Copied to clipboard!')
}

// Output:
// Wordle 3/6
//
// ⬛⬛🟨🟨🟩
// ⬛🟩🟩🟩🟩
// 🟩🟩🟩🟩🟩
\`\`\`

---

### Q: How would you implement "Hard Mode" (must use revealed hints)?

**A:** Validate guess contains all green/yellow letters:

\`\`\`javascript
const validateHardMode = (guess) => {
  // Check all green letters are in correct positions
  for (let i = 0; i < guesses.length; i++) {
    const prevGuess = guesses[i]
    const prevEval = evaluateGuess(prevGuess)

    for (let j = 0; j < 5; j++) {
      if (prevEval[j] === 'correct' && guess[j] !== prevGuess[j]) {
        alert(\`Must use \${prevGuess[j]} in position \${j + 1}\`)
        return false
      }
    }
  }

  // Check all yellow letters are present somewhere
  const yellowLetters = new Set()
  guesses.forEach(g => {
    const eval = evaluateGuess(g)
    g.split('').forEach((letter, i) => {
      if (eval[i] === 'present') yellowLetters.add(letter)
    })
  })

  for (const letter of yellowLetters) {
    if (!guess.includes(letter)) {
      alert(\`Must include \${letter}\`)
      return false
    }
  }

  return true
}
\`\`\`

---

## Testing Strategy

### Manual Test Cases

1. **Duplicate letters**: Target = "ROBOT", Guess = "FLOOR"
   - ✅ First O should be green, second O should be gray

2. **All correct**: Guess matches target
   - ✅ All tiles green, game status = "won"

3. **No matches**: Guess = "ABCDE", Target = "FGHIJ"
   - ✅ All tiles gray

4. **Six wrong guesses**: Use all attempts without winning
   - ✅ Game status = "lost", show target word

5. **Keyboard priority**: A is yellow in guess 1, green in guess 2
   - ✅ Keyboard A should be green (not downgraded)

6. **Incomplete word**: Press ENTER with 3 letters
   - ✅ Show alert, don't submit

7. **Physical keyboard**: Type with keyboard, press Enter/Backspace
   - ✅ Should work identically to virtual keyboard

---

### Automated Tests (Jest + RTL)

\`\`\`javascript
import { render, screen, fireEvent } from '@testing-library/react'
import Wordle from './Solution'

test('handles duplicate letters correctly', () => {
  // Mock random to return specific word
  jest.spyOn(Math, 'random').mockReturnValue(0) // First word in array

  render(<Wordle />)

  // Type and submit "FLOOR" (if target is "ROBOT")
  fireEvent.click(screen.getByText('F'))
  // ... continue typing
  fireEvent.click(screen.getByText('ENTER'))

  // Check first O is green, second O is gray
  const tiles = screen.getAllByTestId('tile')
  expect(tiles[2]).toHaveStyle({ backgroundColor: '#6aaa64' }) // Green
  expect(tiles[3]).toHaveStyle({ backgroundColor: '#787c7e' }) // Gray
})
\`\`\`

---

## Key Takeaways

✅ **Two-pass evaluation** handles duplicate letters correctly
✅ **Frequency map** tracks remaining target letters
✅ **Priority system** prevents keyboard state downgrades
✅ **State separation** (guesses vs currentGuess) simplifies logic
✅ **Guard clauses** prevent input after game ends
✅ **Keyboard support** (both virtual and physical) improves UX

---

**Now play the interactive Wordle game above and practice your word-guessing skills!** 🎯

Try testing edge cases like duplicate letters (FLOOR vs ROBOT) or using the physical keyboard!
`,yg=[{id:"calendar-day-view",title:"Calendar Day View",category:"Machine Coding",difficulty:"Hard"},{id:"circle-collide",title:"Circle Collision Detection",category:"Machine Coding",difficulty:"Medium"},{id:"progress-bars-iv",title:"Concurrent Progress Bars",category:"Machine Coding",difficulty:"Medium"},{id:"connect-4",title:"Connect 4",category:"Machine Coding",difficulty:"Medium"},{id:"data-table",title:"Data Table",category:"Machine Coding",difficulty:"Medium"},{id:"debounce",title:"Debounce",category:"JavaScript",difficulty:"Medium"},{id:"drawing-board",title:"Drawing Board",category:"Machine Coding",difficulty:"Medium"},{id:"file-explorer",title:"File Explorer",category:"Machine Coding",difficulty:"Medium"},{id:"file-explorer-dnd",title:"File Explorer with Drag & Drop",category:"Machine Coding",difficulty:"Hard"},{id:"grid-lights",title:"Grid Lights",category:"Machine Coding",difficulty:"Medium"},{id:"grid-selection",title:"Grid Selection",category:"Machine Coding",difficulty:"Medium"},{id:"holy-grail",title:"Holy Grail Layout",category:"Machine Coding",difficulty:"Easy"},{id:"carousel",title:"Image Carousel",category:"Machine Coding",difficulty:"Medium"},{id:"infinite-scroll",title:"Infinite Scroll",category:"Machine Coding",difficulty:"Medium"},{id:"kanban-board",title:"Kanban Board",category:"Machine Coding",difficulty:"Hard"},{id:"chess-board-knight-shortest-path",title:"Knight Shortest Path",category:"JavaScript",difficulty:"Hard"},{id:"modal",title:"Modal / Dialog",category:"Machine Coding",difficulty:"Medium"},{id:"checkbox-hierarchy",title:"Nested Checkboxes",category:"Machine Coding",difficulty:"Medium"},{id:"nested-comments",title:"Nested Comments",category:"Machine Coding",difficulty:"Medium"},{id:"notification-system",title:"Notification System",category:"Machine Coding",difficulty:"Medium"},{id:"otp-input",title:"OTP Input",category:"Machine Coding",difficulty:"Medium"},{id:"poll-widget",title:"Poll Widget",category:"Machine Coding",difficulty:"Easy"},{id:"promise-progress",title:"Promise Progress",category:"JavaScript",difficulty:"Medium"},{id:"chess-board-rook-shortest-path",title:"Rook Shortest Path",category:"JavaScript",difficulty:"Medium"},{id:"search-highlighter",title:"Search Highlighter",category:"Machine Coding",difficulty:"Easy"},{id:"seat-picker",title:"Seat Picker",category:"Machine Coding",difficulty:"Medium"},{id:"snake-ladder",title:"Snakes and Ladders",category:"Machine Coding",difficulty:"Medium"},{id:"star-rating",title:"Star Rating",category:"Machine Coding",difficulty:"Easy"},{id:"star-rating-lld",title:"Star Rating (LLD)",category:"Machine Coding",difficulty:"Easy"},{id:"stepper-wizard",title:"Stepper Wizard",category:"Machine Coding",difficulty:"Medium"},{id:"tabs",title:"Tabs",category:"Machine Coding",difficulty:"Easy"},{id:"tic-tac-toe-dynamic",title:"Tic-Tac-Toe (N x N)",category:"Machine Coding",difficulty:"Medium"},{id:"token-bucket",title:"Token Bucket Rate Limiter",category:"JavaScript",difficulty:"Hard"},{id:"traffic-light",title:"Traffic Light Controller",category:"Machine Coding",difficulty:"Medium"},{id:"transfer-list",title:"Transfer List",category:"Machine Coding",difficulty:"Medium"},{id:"typeahead",title:"Typeahead / Autocomplete",category:"Machine Coding",difficulty:"Medium"},{id:"virtual-list",title:"Virtual List",category:"Machine Coding",difficulty:"Hard"},{id:"wordle",title:"Wordle",category:"Machine Coding",difficulty:"Medium"}],fs="Solution.jsx";function L0(e){const n={};for(const[t,r]of Object.entries(e)){const i=t.split("/");if(i.length!==3)continue;const[,o,s]=i;!o||!s||(n[o]||(n[o]=[]),n[o].push({name:s,code:r}))}for(const t of Object.values(n))t.sort((r,i)=>r.name===fs?-1:i.name===fs?1:r.name.localeCompare(i.name));return n}const P0=/^@(keyframes|font-face|counter-style|property|layer)\b/i,B0=/^@(media|supports|container|layer)\b/i;function j0(e){return`[data-problem="${e}"]`}function bg(e,n){const t=e[n];if(t==="/"&&e[n+1]==="*"){const r=e.indexOf("*/",n+2);return r===-1?e.length:r+2}if(t==='"'||t==="'"){let r=n+1;for(;r<e.length&&e[r]!==t;)r+=e[r]==="\\"?2:1;return r+1}return n}function F0(e){let n=0;for(;n<e.length;){const t=bg(e,n);if(t!==n){n=t;continue}if(e[n]==="{")return n;n+=1}return-1}function z0(e){const n=[];let t=0,r=0,i=0;for(;i<e.length;){const s=bg(e,i);if(s!==i){i=s;continue}const a=e[i];a==="{"?t+=1:a==="}"&&(t-=1,t===0&&(n.push(e.slice(r,i+1)),r=i+1)),i+=1}const o=e.slice(r);return o.trim()&&n.push(o),n}function U0(e,n){return e.split(",").map(t=>{const r=t.trim();return r?r.startsWith(n)?r:`${n} ${r}`:null}).filter(Boolean).join(", ")}function vg(e,n){if(!e)return"";const t=j0(n);return z0(e).map(r=>{const i=F0(r);if(i===-1)return r;const o=r.slice(0,i),s=r.slice(i+1,r.lastIndexOf("}")),[,a="",l=""]=o.match(/^((?:\s|\/\*[\s\S]*?\*\/)*)([\s\S]*)$/)??[],c=l.trim();return P0.test(c)?r:B0.test(c)?`${a}${l}{${vg(s,n)}}`:c?`${a}${U0(l,t)} {${s}}`:r}).join("")}const $0=Object.assign({"./calendar-day-view/Solution.jsx":_v,"./carousel/Solution.jsx":Tv,"./checkbox-hierarchy/Solution.jsx":Ov,"./chess-board-knight-shortest-path/Solution.jsx":Dv,"./chess-board-rook-shortest-path/Solution.jsx":Pv,"./circle-collide/Solution.jsx":jv,"./connect-4/Solution.jsx":zv,"./data-table/Solution.jsx":$v,"./debounce/Solution.jsx":Wv,"./drawing-board/Solution.jsx":qv,"./file-explorer-dnd/Solution.jsx":ew,"./file-explorer/Solution.jsx":rw,"./grid-lights/Solution.jsx":ow,"./grid-selection/Solution.jsx":aw,"./holy-grail/Solution.jsx":cw,"./infinite-scroll/Solution.jsx":pw,"./kanban-board/Solution.jsx":mw,"./modal/Solution.jsx":vw,"./nested-comments/Solution.jsx":kw,"./notification-system/Solution.jsx":_w,"./otp-input/Solution.jsx":Tw,"./poll-widget/Solution.jsx":Nw,"./progress-bars-iv/Solution.jsx":Ow,"./promise-progress/Solution.jsx":Lw,"./search-highlighter/Solution.jsx":Fw,"./seat-picker/Solution.jsx":Gw,"./snake-ladder/Solution.jsx":Yw,"./star-rating-lld/Solution.jsx":Xw,"./star-rating/Solution.jsx":ex,"./stepper-wizard/Solution.jsx":ax,"./tabs/Solution.jsx":cx,"./tic-tac-toe-dynamic/Solution.jsx":dx,"./token-bucket/Solution.jsx":hx,"./traffic-light/Solution.jsx":yx,"./transfer-list/Solution.jsx":wx,"./typeahead/Solution.jsx":kx,"./virtual-list/Solution.jsx":Cx,"./wordle/Solution.jsx":Nx}),H0=Object.assign({"./calendar-day-view/Solution.jsx":Ix,"./calendar-day-view/styles.css":Ax,"./carousel/Solution.jsx":Ox,"./carousel/styles.css":Mx,"./checkbox-hierarchy/CheckboxTree.jsx":Dx,"./checkbox-hierarchy/Solution.jsx":Lx,"./checkbox-hierarchy/data.js":Px,"./checkbox-hierarchy/styles.css":Bx,"./chess-board-knight-shortest-path/Solution.jsx":jx,"./chess-board-knight-shortest-path/styles.css":Fx,"./chess-board-rook-shortest-path/Solution.jsx":zx,"./chess-board-rook-shortest-path/styles.css":Ux,"./circle-collide/Solution.jsx":$x,"./circle-collide/styles.css":Hx,"./connect-4/Solution.jsx":Gx,"./data-table/Solution.jsx":Wx,"./debounce/Solution.jsx":Kx,"./debounce/debounce.js":Vx,"./drawing-board/Solution.jsx":qx,"./file-explorer-dnd/FileExplorer.jsx":Yx,"./file-explorer-dnd/Solution.jsx":Qx,"./file-explorer-dnd/data.js":Xx,"./file-explorer-dnd/styles.css":Zx,"./file-explorer-dnd/treeUtils.js":Jx,"./file-explorer/Folder.jsx":eS,"./file-explorer/Solution.jsx":nS,"./file-explorer/data.jsx":tS,"./grid-lights/Solution.jsx":rS,"./grid-lights/styles.css":iS,"./grid-selection/Solution.jsx":oS,"./holy-grail/Solution.jsx":sS,"./holy-grail/styles.css":aS,"./infinite-scroll/Solution.jsx":lS,"./kanban-board/Solution.jsx":cS,"./kanban-board/styles.css":uS,"./modal/Modal.jsx":dS,"./modal/Solution.jsx":pS,"./modal/styles.css":fS,"./nested-comments/CommentItems.jsx":hS,"./nested-comments/CommentsHelper.jsx":gS,"./nested-comments/CommentsSection.jsx":mS,"./nested-comments/Solution.jsx":yS,"./nested-comments/data.js":bS,"./notification-system/Solution.jsx":vS,"./notification-system/styles.css":wS,"./otp-input/Solution.jsx":xS,"./poll-widget/Solution.jsx":SS,"./progress-bars-iv/Solution.jsx":kS,"./progress-bars-iv/progressBar.jsx":ES,"./promise-progress/Solution.jsx":_S,"./promise-progress/styles.css":CS,"./search-highlighter/Solution.jsx":TS,"./search-highlighter/styles.css":RS,"./seat-picker/Solution.jsx":NS,"./snake-ladder/Solution.jsx":IS,"./snake-ladder/styles.css":AS,"./star-rating-lld/Solution.jsx":OS,"./star-rating-lld/StarRating.jsx":MS,"./star-rating-lld/styles.css":DS,"./star-rating/Solution.jsx":LS,"./star-rating/styles.css":PS,"./stepper-wizard/Solution.jsx":BS,"./tabs/Solution.jsx":jS,"./tic-tac-toe-dynamic/Solution.jsx":FS,"./token-bucket/Solution.jsx":zS,"./traffic-light/Solution.jsx":US,"./traffic-light/TrafficLight.jsx":$S,"./traffic-light/styles.css":HS,"./transfer-list/Solution.jsx":GS,"./typeahead/Solution.jsx":WS,"./typeahead/useDebounce.jsx":KS,"./virtual-list/Solution.jsx":VS,"./virtual-list/VirtualList.jsx":qS,"./wordle/SimplifiedWordle.jsx":YS,"./wordle/Solution.jsx":QS}),G0=Object.assign({"./calendar-day-view/problem.md":XS,"./carousel/problem.md":ZS,"./checkbox-hierarchy/problem.md":JS,"./chess-board-knight-shortest-path/problem.md":e0,"./chess-board-rook-shortest-path/problem.md":n0,"./circle-collide/problem.md":t0,"./connect-4/problem.md":r0,"./data-table/problem.md":i0,"./debounce/problem.md":o0,"./drawing-board/problem.md":s0,"./file-explorer-dnd/problem.md":a0,"./file-explorer/problem.md":l0,"./grid-lights/problem.md":c0,"./grid-selection/problem.md":u0,"./holy-grail/problem.md":d0,"./infinite-scroll/problem.md":p0,"./kanban-board/problem.md":f0,"./modal/problem.md":h0,"./nested-comments/problem.md":g0,"./notification-system/problem.md":m0,"./otp-input/problem.md":y0,"./poll-widget/problem.md":b0,"./progress-bars-iv/problem.md":v0,"./promise-progress/problem.md":w0,"./search-highlighter/problem.md":x0,"./seat-picker/problem.md":S0,"./snake-ladder/problem.md":k0,"./star-rating-lld/problem.md":E0,"./star-rating/problem.md":_0,"./stepper-wizard/problem.md":C0,"./tabs/problem.md":T0,"./tic-tac-toe-dynamic/problem.md":R0,"./token-bucket/problem.md":N0,"./traffic-light/problem.md":I0,"./transfer-list/problem.md":A0,"./typeahead/problem.md":O0,"./virtual-list/problem.md":M0,"./wordle/problem.md":D0}),W0=L0(H0);function K0(){return yg}function V0(e){const n=yg.find(s=>s.id===e);if(!n)throw new Error(`Unknown problem id: ${e}`);const t=$0[`./${e}/${fs}`];if(!(t!=null&&t.default))throw new Error(`Problem "${e}" is missing a default export in ${fs}`);const r=G0[`./${e}/problem.md`];if(r===void 0)throw new Error(`Problem "${e}" is missing problem.md`);const i=W0[e];if(!(i!=null&&i.length))throw new Error(`Problem "${e}" has no source files`);const o=i.filter(s=>s.name.endsWith(".css")).map(s=>vg(s.code,e)).join(`
`);return{...n,Component:t.default,markdown:r,files:i,css:o}}const wa="All";function q0({problems:e,selectedId:n,onSelect:t}){const[r,i]=A.useState(""),[o,s]=A.useState(wa),a=A.useMemo(()=>[wa,...new Set(e.map(c=>c.category))],[e]),l=A.useMemo(()=>{const c=r.trim().toLowerCase();return e.filter(u=>o!==wa&&u.category!==o?!1:c?`${u.title} ${u.category}`.toLowerCase().includes(c):!0)},[e,r,o]);return f.jsxs("nav",{className:"sidebar",children:[f.jsxs("div",{className:"sidebar-brand",children:["Play",f.jsx("span",{children:"ground"})]}),f.jsx("input",{className:"sidebar-search",type:"search",value:r,placeholder:"Search problems…",onChange:c=>i(c.target.value)}),f.jsx("div",{className:"sidebar-filters",children:a.map(c=>f.jsx("button",{type:"button",className:c===o?"chip active":"chip",onClick:()=>s(c),children:c},c))}),f.jsxs("ul",{className:"sidebar-list",children:[l.map(c=>f.jsx("li",{children:f.jsxs("button",{type:"button",className:c.id===n?"item active":"item",onClick:()=>t(c.id),children:[f.jsx("span",{className:"item-title",children:c.title}),f.jsx("span",{className:`difficulty ${c.difficulty.toLowerCase()}`,children:c.difficulty})]})},c.id)),l.length===0&&f.jsx("li",{className:"sidebar-empty",children:"No matches."})]})]})}function Y0(e,n){const t={};return(e[e.length-1]===""?[...e,""]:e).join((t.padRight?" ":"")+","+(t.padLeft===!1?"":" ")).trim()}const Q0=/^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,X0=/^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,Z0={};function Rd(e,n){return(Z0.jsx?X0:Q0).test(e)}const J0=/[ \t\n\f\r]/g;function ek(e){return typeof e=="object"?e.type==="text"?Nd(e.value):!1:Nd(e)}function Nd(e){return e.replace(J0,"")===""}class Vi{constructor(n,t,r){this.normal=t,this.property=n,r&&(this.space=r)}}Vi.prototype.normal={};Vi.prototype.property={};Vi.prototype.space=void 0;function wg(e,n){const t={},r={};for(const i of e)Object.assign(t,i.property),Object.assign(r,i.normal);return new Vi(t,r,n)}function Al(e){return e.toLowerCase()}class Je{constructor(n,t){this.attribute=t,this.property=n}}Je.prototype.attribute="";Je.prototype.booleanish=!1;Je.prototype.boolean=!1;Je.prototype.commaOrSpaceSeparated=!1;Je.prototype.commaSeparated=!1;Je.prototype.defined=!1;Je.prototype.mustUseProperty=!1;Je.prototype.number=!1;Je.prototype.overloadedBoolean=!1;Je.prototype.property="";Je.prototype.spaceSeparated=!1;Je.prototype.space=void 0;let nk=0;const ee=Xt(),ke=Xt(),Ol=Xt(),F=Xt(),de=Xt(),Ut=Xt(),rn=Xt();function Xt(){return 2**++nk}const Ml=Object.freeze(Object.defineProperty({__proto__:null,boolean:ee,booleanish:ke,commaOrSpaceSeparated:rn,commaSeparated:Ut,number:F,overloadedBoolean:Ol,spaceSeparated:de},Symbol.toStringTag,{value:"Module"})),xa=Object.keys(Ml);class Bc extends Je{constructor(n,t,r,i){let o=-1;if(super(n,t),Id(this,"space",i),typeof r=="number")for(;++o<xa.length;){const s=xa[o];Id(this,xa[o],(r&Ml[s])===Ml[s])}}}Bc.prototype.defined=!0;function Id(e,n,t){t&&(e[n]=t)}function Ur(e){const n={},t={};for(const[r,i]of Object.entries(e.properties)){const o=new Bc(r,e.transform(e.attributes||{},r),i,e.space);e.mustUseProperty&&e.mustUseProperty.includes(r)&&(o.mustUseProperty=!0),n[r]=o,t[Al(r)]=r,t[Al(o.attribute)]=r}return new Vi(n,t,e.space)}const xg=Ur({properties:{ariaActiveDescendant:null,ariaAtomic:ke,ariaAutoComplete:null,ariaBusy:ke,ariaChecked:ke,ariaColCount:F,ariaColIndex:F,ariaColSpan:F,ariaControls:de,ariaCurrent:null,ariaDescribedBy:de,ariaDetails:null,ariaDisabled:ke,ariaDropEffect:de,ariaErrorMessage:null,ariaExpanded:ke,ariaFlowTo:de,ariaGrabbed:ke,ariaHasPopup:null,ariaHidden:ke,ariaInvalid:null,ariaKeyShortcuts:null,ariaLabel:null,ariaLabelledBy:de,ariaLevel:F,ariaLive:null,ariaModal:ke,ariaMultiLine:ke,ariaMultiSelectable:ke,ariaOrientation:null,ariaOwns:de,ariaPlaceholder:null,ariaPosInSet:F,ariaPressed:ke,ariaReadOnly:ke,ariaRelevant:null,ariaRequired:ke,ariaRoleDescription:de,ariaRowCount:F,ariaRowIndex:F,ariaRowSpan:F,ariaSelected:ke,ariaSetSize:F,ariaSort:null,ariaValueMax:F,ariaValueMin:F,ariaValueNow:F,ariaValueText:null,role:null},transform(e,n){return n==="role"?n:"aria-"+n.slice(4).toLowerCase()}});function Sg(e,n){return n in e?e[n]:n}function kg(e,n){return Sg(e,n.toLowerCase())}const tk=Ur({attributes:{acceptcharset:"accept-charset",classname:"class",htmlfor:"for",httpequiv:"http-equiv"},mustUseProperty:["checked","multiple","muted","selected"],properties:{abbr:null,accept:Ut,acceptCharset:de,accessKey:de,action:null,allow:null,allowFullScreen:ee,allowPaymentRequest:ee,allowUserMedia:ee,alpha:ee,alt:null,as:null,async:ee,autoCapitalize:null,autoComplete:de,autoFocus:ee,autoPlay:ee,blocking:de,capture:null,charSet:null,checked:ee,cite:null,className:de,closedBy:null,colorSpace:null,cols:F,colSpan:F,command:null,commandFor:null,content:null,contentEditable:ke,controls:ee,controlsList:de,coords:F|Ut,crossOrigin:null,data:null,dateTime:null,decoding:null,default:ee,defer:ee,dir:null,dirName:null,disabled:ee,download:Ol,draggable:ke,encType:null,enterKeyHint:null,fetchPriority:null,form:null,formAction:null,formEncType:null,formMethod:null,formNoValidate:ee,formTarget:null,headers:de,height:F,hidden:Ol,high:F,href:null,hrefLang:null,htmlFor:de,httpEquiv:de,id:null,imageSizes:null,imageSrcSet:null,inert:ee,inputMode:null,integrity:null,is:null,isMap:ee,itemId:null,itemProp:de,itemRef:de,itemScope:ee,itemType:de,kind:null,label:null,lang:null,language:null,list:null,loading:null,loop:ee,low:F,manifest:null,max:null,maxLength:F,media:null,method:null,min:null,minLength:F,multiple:ee,muted:ee,name:null,nonce:null,noModule:ee,noValidate:ee,onAbort:null,onAfterPrint:null,onAuxClick:null,onBeforeMatch:null,onBeforePrint:null,onBeforeToggle:null,onBeforeUnload:null,onBlur:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onContextLost:null,onContextMenu:null,onContextRestored:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnded:null,onError:null,onFocus:null,onFormData:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLanguageChange:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadEnd:null,onLoadStart:null,onMessage:null,onMessageError:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRejectionHandled:null,onReset:null,onResize:null,onScroll:null,onScrollEnd:null,onSecurityPolicyViolation:null,onSeeked:null,onSeeking:null,onSelect:null,onSlotChange:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnhandledRejection:null,onUnload:null,onVolumeChange:null,onWaiting:null,onWheel:null,open:ee,optimum:F,pattern:null,ping:de,placeholder:null,playsInline:ee,popover:null,popoverTarget:null,popoverTargetAction:null,poster:null,preload:null,readOnly:ee,referrerPolicy:null,rel:de,required:ee,reversed:ee,rows:F,rowSpan:F,sandbox:de,scope:null,scoped:ee,seamless:ee,selected:ee,shadowRootClonable:ee,shadowRootCustomElementRegistry:ee,shadowRootDelegatesFocus:ee,shadowRootMode:null,shadowRootSerializable:ee,shape:null,size:F,sizes:null,slot:null,span:F,spellCheck:ke,src:null,srcDoc:null,srcLang:null,srcSet:null,start:F,step:null,style:null,tabIndex:F,target:null,title:null,translate:null,type:null,typeMustMatch:ee,useMap:null,value:ke,width:F,wrap:null,writingSuggestions:null,align:null,aLink:null,archive:de,axis:null,background:null,bgColor:null,border:F,borderColor:null,bottomMargin:F,cellPadding:null,cellSpacing:null,char:null,charOff:null,classId:null,clear:null,code:null,codeBase:null,codeType:null,color:null,compact:ee,declare:ee,event:null,face:null,frame:null,frameBorder:null,hSpace:F,leftMargin:F,link:null,longDesc:null,lowSrc:null,marginHeight:F,marginWidth:F,noResize:ee,noHref:ee,noShade:ee,noWrap:ee,object:null,profile:null,prompt:null,rev:null,rightMargin:F,rules:null,scheme:null,scrolling:ke,standby:null,summary:null,text:null,topMargin:F,valueType:null,version:null,vAlign:null,vLink:null,vSpace:F,allowTransparency:null,autoCorrect:null,autoSave:null,credentialless:ee,disablePictureInPicture:ee,disableRemotePlayback:ee,exportParts:Ut,part:de,prefix:null,property:null,results:F,security:null,unselectable:null},space:"html",transform:kg}),rk=Ur({attributes:{accentHeight:"accent-height",alignmentBaseline:"alignment-baseline",arabicForm:"arabic-form",baselineShift:"baseline-shift",capHeight:"cap-height",className:"class",clipPath:"clip-path",clipRule:"clip-rule",colorInterpolation:"color-interpolation",colorInterpolationFilters:"color-interpolation-filters",colorProfile:"color-profile",colorRendering:"color-rendering",crossOrigin:"crossorigin",dataType:"datatype",dominantBaseline:"dominant-baseline",enableBackground:"enable-background",fillOpacity:"fill-opacity",fillRule:"fill-rule",floodColor:"flood-color",floodOpacity:"flood-opacity",fontFamily:"font-family",fontSize:"font-size",fontSizeAdjust:"font-size-adjust",fontStretch:"font-stretch",fontStyle:"font-style",fontVariant:"font-variant",fontWeight:"font-weight",glyphName:"glyph-name",glyphOrientationHorizontal:"glyph-orientation-horizontal",glyphOrientationVertical:"glyph-orientation-vertical",hrefLang:"hreflang",horizAdvX:"horiz-adv-x",horizOriginX:"horiz-origin-x",horizOriginY:"horiz-origin-y",imageRendering:"image-rendering",letterSpacing:"letter-spacing",lightingColor:"lighting-color",markerEnd:"marker-end",markerMid:"marker-mid",markerStart:"marker-start",maskType:"mask-type",navDown:"nav-down",navDownLeft:"nav-down-left",navDownRight:"nav-down-right",navLeft:"nav-left",navNext:"nav-next",navPrev:"nav-prev",navRight:"nav-right",navUp:"nav-up",navUpLeft:"nav-up-left",navUpRight:"nav-up-right",onAbort:"onabort",onActivate:"onactivate",onAfterPrint:"onafterprint",onBeforePrint:"onbeforeprint",onBegin:"onbegin",onCancel:"oncancel",onCanPlay:"oncanplay",onCanPlayThrough:"oncanplaythrough",onChange:"onchange",onClick:"onclick",onClose:"onclose",onCopy:"oncopy",onCueChange:"oncuechange",onCut:"oncut",onDblClick:"ondblclick",onDrag:"ondrag",onDragEnd:"ondragend",onDragEnter:"ondragenter",onDragExit:"ondragexit",onDragLeave:"ondragleave",onDragOver:"ondragover",onDragStart:"ondragstart",onDrop:"ondrop",onDurationChange:"ondurationchange",onEmptied:"onemptied",onEnd:"onend",onEnded:"onended",onError:"onerror",onFocus:"onfocus",onFocusIn:"onfocusin",onFocusOut:"onfocusout",onHashChange:"onhashchange",onInput:"oninput",onInvalid:"oninvalid",onKeyDown:"onkeydown",onKeyPress:"onkeypress",onKeyUp:"onkeyup",onLoad:"onload",onLoadedData:"onloadeddata",onLoadedMetadata:"onloadedmetadata",onLoadStart:"onloadstart",onMessage:"onmessage",onMouseDown:"onmousedown",onMouseEnter:"onmouseenter",onMouseLeave:"onmouseleave",onMouseMove:"onmousemove",onMouseOut:"onmouseout",onMouseOver:"onmouseover",onMouseUp:"onmouseup",onMouseWheel:"onmousewheel",onOffline:"onoffline",onOnline:"ononline",onPageHide:"onpagehide",onPageShow:"onpageshow",onPaste:"onpaste",onPause:"onpause",onPlay:"onplay",onPlaying:"onplaying",onPopState:"onpopstate",onProgress:"onprogress",onRateChange:"onratechange",onRepeat:"onrepeat",onReset:"onreset",onResize:"onresize",onScroll:"onscroll",onSeeked:"onseeked",onSeeking:"onseeking",onSelect:"onselect",onShow:"onshow",onStalled:"onstalled",onStorage:"onstorage",onSubmit:"onsubmit",onSuspend:"onsuspend",onTimeUpdate:"ontimeupdate",onToggle:"ontoggle",onUnload:"onunload",onVolumeChange:"onvolumechange",onWaiting:"onwaiting",onZoom:"onzoom",overlinePosition:"overline-position",overlineThickness:"overline-thickness",paintOrder:"paint-order",panose1:"panose-1",pointerEvents:"pointer-events",referrerPolicy:"referrerpolicy",renderingIntent:"rendering-intent",shapeRendering:"shape-rendering",stopColor:"stop-color",stopOpacity:"stop-opacity",strikethroughPosition:"strikethrough-position",strikethroughThickness:"strikethrough-thickness",strokeDashArray:"stroke-dasharray",strokeDashOffset:"stroke-dashoffset",strokeLineCap:"stroke-linecap",strokeLineJoin:"stroke-linejoin",strokeMiterLimit:"stroke-miterlimit",strokeOpacity:"stroke-opacity",strokeWidth:"stroke-width",tabIndex:"tabindex",textAnchor:"text-anchor",textDecoration:"text-decoration",textRendering:"text-rendering",transformOrigin:"transform-origin",typeOf:"typeof",underlinePosition:"underline-position",underlineThickness:"underline-thickness",unicodeBidi:"unicode-bidi",unicodeRange:"unicode-range",unitsPerEm:"units-per-em",vAlphabetic:"v-alphabetic",vHanging:"v-hanging",vIdeographic:"v-ideographic",vMathematical:"v-mathematical",vectorEffect:"vector-effect",vertAdvY:"vert-adv-y",vertOriginX:"vert-origin-x",vertOriginY:"vert-origin-y",wordSpacing:"word-spacing",writingMode:"writing-mode",xHeight:"x-height",playbackOrder:"playbackorder",timelineBegin:"timelinebegin"},properties:{about:rn,accentHeight:F,accumulate:null,additive:null,alignmentBaseline:null,alphabetic:F,amplitude:F,arabicForm:null,ascent:F,attributeName:null,attributeType:null,azimuth:F,bandwidth:null,baselineShift:null,baseFrequency:null,baseProfile:null,bbox:null,begin:null,bias:F,by:null,calcMode:null,capHeight:F,className:de,clip:null,clipPath:null,clipPathUnits:null,clipRule:null,color:null,colorInterpolation:null,colorInterpolationFilters:null,colorProfile:null,colorRendering:null,content:null,contentScriptType:null,contentStyleType:null,crossOrigin:null,cursor:null,cx:null,cy:null,d:null,dataType:null,defaultAction:null,descent:F,diffuseConstant:F,direction:null,display:null,dur:null,divisor:F,dominantBaseline:null,download:ee,dx:null,dy:null,edgeMode:null,editable:null,elevation:F,enableBackground:null,end:null,event:null,exponent:F,externalResourcesRequired:null,fill:null,fillOpacity:F,fillRule:null,filter:null,filterRes:null,filterUnits:null,floodColor:null,floodOpacity:null,focusable:null,focusHighlight:null,fontFamily:null,fontSize:null,fontSizeAdjust:null,fontStretch:null,fontStyle:null,fontVariant:null,fontWeight:null,format:null,fr:null,from:null,fx:null,fy:null,g1:Ut,g2:Ut,glyphName:Ut,glyphOrientationHorizontal:null,glyphOrientationVertical:null,glyphRef:null,gradientTransform:null,gradientUnits:null,handler:null,hanging:F,hatchContentUnits:null,hatchUnits:null,height:null,href:null,hrefLang:null,horizAdvX:F,horizOriginX:F,horizOriginY:F,id:null,ideographic:F,imageRendering:null,initialVisibility:null,in:null,in2:null,intercept:F,k:F,k1:F,k2:F,k3:F,k4:F,kernelMatrix:rn,kernelUnitLength:null,keyPoints:null,keySplines:null,keyTimes:null,kerning:null,lang:null,lengthAdjust:null,letterSpacing:null,lightingColor:null,limitingConeAngle:F,local:null,markerEnd:null,markerMid:null,markerStart:null,markerHeight:null,markerUnits:null,markerWidth:null,mask:null,maskContentUnits:null,maskType:null,maskUnits:null,mathematical:null,max:null,media:null,mediaCharacterEncoding:null,mediaContentEncodings:null,mediaSize:F,mediaTime:null,method:null,min:null,mode:null,name:null,navDown:null,navDownLeft:null,navDownRight:null,navLeft:null,navNext:null,navPrev:null,navRight:null,navUp:null,navUpLeft:null,navUpRight:null,numOctaves:null,observer:null,offset:null,onAbort:null,onActivate:null,onAfterPrint:null,onBeforePrint:null,onBegin:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnd:null,onEnded:null,onError:null,onFocus:null,onFocusIn:null,onFocusOut:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadStart:null,onMessage:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onMouseWheel:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRepeat:null,onReset:null,onResize:null,onScroll:null,onSeeked:null,onSeeking:null,onSelect:null,onShow:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnload:null,onVolumeChange:null,onWaiting:null,onZoom:null,opacity:null,operator:null,order:null,orient:null,orientation:null,origin:null,overflow:null,overlay:null,overlinePosition:F,overlineThickness:F,paintOrder:null,panose1:null,path:null,pathLength:F,patternContentUnits:null,patternTransform:null,patternUnits:null,phase:null,ping:de,pitch:null,playbackOrder:null,pointerEvents:null,points:null,pointsAtX:F,pointsAtY:F,pointsAtZ:F,preserveAlpha:null,preserveAspectRatio:null,primitiveUnits:null,propagate:null,property:rn,r:null,radius:null,referrerPolicy:null,refX:null,refY:null,rel:rn,rev:rn,renderingIntent:null,repeatCount:null,repeatDur:null,requiredExtensions:rn,requiredFeatures:rn,requiredFonts:rn,requiredFormats:rn,resource:null,restart:null,result:null,rotate:null,rx:null,ry:null,scale:null,seed:null,shapeRendering:null,side:null,slope:null,snapshotTime:null,specularConstant:F,specularExponent:F,spreadMethod:null,spacing:null,startOffset:null,stdDeviation:null,stemh:null,stemv:null,stitchTiles:null,stopColor:null,stopOpacity:null,strikethroughPosition:F,strikethroughThickness:F,string:null,stroke:null,strokeDashArray:rn,strokeDashOffset:null,strokeLineCap:null,strokeLineJoin:null,strokeMiterLimit:F,strokeOpacity:F,strokeWidth:null,style:null,surfaceScale:F,syncBehavior:null,syncBehaviorDefault:null,syncMaster:null,syncTolerance:null,syncToleranceDefault:null,systemLanguage:rn,tabIndex:F,tableValues:null,target:null,targetX:F,targetY:F,textAnchor:null,textDecoration:null,textRendering:null,textLength:null,timelineBegin:null,title:null,transformBehavior:null,type:null,typeOf:rn,to:null,transform:null,transformOrigin:null,u1:null,u2:null,underlinePosition:F,underlineThickness:F,unicode:null,unicodeBidi:null,unicodeRange:null,unitsPerEm:F,values:null,vAlphabetic:F,vMathematical:F,vectorEffect:null,vHanging:F,vIdeographic:F,version:null,vertAdvY:F,vertOriginX:F,vertOriginY:F,viewBox:null,viewTarget:null,visibility:null,width:null,widths:null,wordSpacing:null,writingMode:null,x:null,x1:null,x2:null,xChannelSelector:null,xHeight:F,y:null,y1:null,y2:null,yChannelSelector:null,z:null,zoomAndPan:null},space:"svg",transform:Sg}),Eg=Ur({properties:{xLinkActuate:null,xLinkArcRole:null,xLinkHref:null,xLinkRole:null,xLinkShow:null,xLinkTitle:null,xLinkType:null},space:"xlink",transform(e,n){return"xlink:"+n.slice(5).toLowerCase()}}),_g=Ur({attributes:{xmlnsxlink:"xmlns:xlink"},properties:{xmlnsXLink:null,xmlns:null},space:"xmlns",transform:kg}),Cg=Ur({properties:{xmlBase:null,xmlLang:null,xmlSpace:null},space:"xml",transform(e,n){return"xml:"+n.slice(3).toLowerCase()}}),ik={classId:"classID",dataType:"datatype",itemId:"itemID",strokeDashArray:"strokeDasharray",strokeDashOffset:"strokeDashoffset",strokeLineCap:"strokeLinecap",strokeLineJoin:"strokeLinejoin",strokeMiterLimit:"strokeMiterlimit",typeOf:"typeof",xLinkActuate:"xlinkActuate",xLinkArcRole:"xlinkArcrole",xLinkHref:"xlinkHref",xLinkRole:"xlinkRole",xLinkShow:"xlinkShow",xLinkTitle:"xlinkTitle",xLinkType:"xlinkType",xmlnsXLink:"xmlnsXlink"},ok=/[A-Z]/g,Ad=/-[a-z]/g,sk=/^data[-\w.:]+$/i;function ak(e,n){const t=Al(n);let r=n,i=Je;if(t in e.normal)return e.property[e.normal[t]];if(t.length>4&&t.slice(0,4)==="data"&&sk.test(n)){if(n.charAt(4)==="-"){const o=n.slice(5).replace(Ad,ck);r="data"+o.charAt(0).toUpperCase()+o.slice(1)}else{const o=n.slice(4);if(!Ad.test(o)){let s=o.replace(ok,lk);s.charAt(0)!=="-"&&(s="-"+s),n="data"+s}}i=Bc}return new i(r,n)}function lk(e){return"-"+e.toLowerCase()}function ck(e){return e.charAt(1).toUpperCase()}const uk=wg([xg,tk,Eg,_g,Cg],"html"),jc=wg([xg,rk,Eg,_g,Cg],"svg");function dk(e){return e.join(" ").trim()}var Fc={},Od=/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g,pk=/\n/g,fk=/^\s*/,hk=/^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/,gk=/^:\s*/,mk=/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/,yk=/^[;\s]*/,bk=/^\s+|\s+$/g,vk=`
`,Md="/",Dd="*",Lt="",wk="comment",xk="declaration";function Sk(e,n){if(typeof e!="string")throw new TypeError("First argument must be a string");if(!e)return[];n=n||{};var t=1,r=1;function i(v){var w=v.match(pk);w&&(t+=w.length);var S=v.lastIndexOf(vk);r=~S?v.length-S:r+v.length}function o(){var v={line:t,column:r};return function(w){return w.position=new s(v),c(),w}}function s(v){this.start=v,this.end={line:t,column:r},this.source=n.source}s.prototype.content=e;function a(v){var w=new Error(n.source+":"+t+":"+r+": "+v);if(w.reason=v,w.filename=n.source,w.line=t,w.column=r,w.source=e,!n.silent)throw w}function l(v){var w=v.exec(e);if(w){var S=w[0];return i(S),e=e.slice(S.length),w}}function c(){l(fk)}function u(v){var w;for(v=v||[];w=d();)w!==!1&&v.push(w);return v}function d(){var v=o();if(!(Md!=e.charAt(0)||Dd!=e.charAt(1))){for(var w=2;Lt!=e.charAt(w)&&(Dd!=e.charAt(w)||Md!=e.charAt(w+1));)++w;if(w+=2,Lt===e.charAt(w-1))return a("End of comment missing");var S=e.slice(2,w-2);return r+=2,i(S),e=e.slice(w),r+=2,v({type:wk,comment:S})}}function p(){var v=o(),w=l(hk);if(w){if(d(),!l(gk))return a("property missing ':'");var S=l(mk),g=v({type:xk,property:Ld(w[0].replace(Od,Lt)),value:S?Ld(S[0].replace(Od,Lt)):Lt});return l(yk),g}}function h(){var v=[];u(v);for(var w;w=p();)w!==!1&&(v.push(w),u(v));return v}return c(),h()}function Ld(e){return e?e.replace(bk,Lt):Lt}var kk=Sk,Ek=Uo&&Uo.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(Fc,"__esModule",{value:!0});Fc.default=Ck;const _k=Ek(kk);function Ck(e,n){let t=null;if(!e||typeof e!="string")return t;const r=(0,_k.default)(e),i=typeof n=="function";return r.forEach(o=>{if(o.type!=="declaration")return;const{property:s,value:a}=o;i?n(s,a,o):a&&(t=t||{},t[s]=a)}),t}var Ps={};Object.defineProperty(Ps,"__esModule",{value:!0});Ps.camelCase=void 0;var Tk=/^--[a-zA-Z0-9_-]+$/,Rk=/-([a-z])/g,Nk=/^[^-]+$/,Ik=/^-(webkit|moz|ms|o|khtml)-/,Ak=/^-(ms)-/,Ok=function(e){return!e||Nk.test(e)||Tk.test(e)},Mk=function(e,n){return n.toUpperCase()},Pd=function(e,n){return"".concat(n,"-")},Dk=function(e,n){return n===void 0&&(n={}),Ok(e)?e:(e=e.toLowerCase(),n.reactCompat?e=e.replace(Ak,Pd):e=e.replace(Ik,Pd),e.replace(Rk,Mk))};Ps.camelCase=Dk;var Lk=Uo&&Uo.__importDefault||function(e){return e&&e.__esModule?e:{default:e}},Pk=Lk(Fc),Bk=Ps;function Dl(e,n){var t={};return!e||typeof e!="string"||(0,Pk.default)(e,function(r,i){r&&i&&(t[(0,Bk.camelCase)(r,n)]=i)}),t}Dl.default=Dl;var jk=Dl;const Fk=Br(jk),Tg=Rg("end"),zc=Rg("start");function Rg(e){return n;function n(t){const r=t&&t.position&&t.position[e]||{};if(typeof r.line=="number"&&r.line>0&&typeof r.column=="number"&&r.column>0)return{line:r.line,column:r.column,offset:typeof r.offset=="number"&&r.offset>-1?r.offset:void 0}}}function zk(e){const n=zc(e),t=Tg(e);if(n&&t)return{start:n,end:t}}function yi(e){return!e||typeof e!="object"?"":"position"in e||"type"in e?Bd(e.position):"start"in e||"end"in e?Bd(e):"line"in e||"column"in e?Ll(e):""}function Ll(e){return jd(e&&e.line)+":"+jd(e&&e.column)}function Bd(e){return Ll(e&&e.start)+"-"+Ll(e&&e.end)}function jd(e){return e&&typeof e=="number"?e:1}class Fe extends Error{constructor(n,t,r){super(),typeof t=="string"&&(r=t,t=void 0);let i="",o={},s=!1;if(t&&("line"in t&&"column"in t?o={place:t}:"start"in t&&"end"in t?o={place:t}:"type"in t?o={ancestors:[t],place:t.position}:o={...t}),typeof n=="string"?i=n:!o.cause&&n&&(s=!0,i=n.message,o.cause=n),!o.ruleId&&!o.source&&typeof r=="string"){const l=r.indexOf(":");l===-1?o.ruleId=r:(o.source=r.slice(0,l),o.ruleId=r.slice(l+1))}if(!o.place&&o.ancestors&&o.ancestors){const l=o.ancestors[o.ancestors.length-1];l&&(o.place=l.position)}const a=o.place&&"start"in o.place?o.place.start:o.place;this.ancestors=o.ancestors||void 0,this.cause=o.cause||void 0,this.column=a?a.column:void 0,this.fatal=void 0,this.file="",this.message=i,this.line=a?a.line:void 0,this.name=yi(o.place)||"1:1",this.place=o.place||void 0,this.reason=this.message,this.ruleId=o.ruleId||void 0,this.source=o.source||void 0,this.stack=s&&o.cause&&typeof o.cause.stack=="string"?o.cause.stack:"",this.actual=void 0,this.expected=void 0,this.note=void 0,this.url=void 0}}Fe.prototype.file="";Fe.prototype.name="";Fe.prototype.reason="";Fe.prototype.message="";Fe.prototype.stack="";Fe.prototype.column=void 0;Fe.prototype.line=void 0;Fe.prototype.ancestors=void 0;Fe.prototype.cause=void 0;Fe.prototype.fatal=void 0;Fe.prototype.place=void 0;Fe.prototype.ruleId=void 0;Fe.prototype.source=void 0;const Uc={}.hasOwnProperty,Uk=new Map,$k=/[A-Z]/g,Hk=new Set(["table","tbody","thead","tfoot","tr"]),Gk=new Set(["td","th"]),Ng="https://github.com/syntax-tree/hast-util-to-jsx-runtime";function Wk(e,n){if(!n||n.Fragment===void 0)throw new TypeError("Expected `Fragment` in options");const t=n.filePath||void 0;let r;if(n.development){if(typeof n.jsxDEV!="function")throw new TypeError("Expected `jsxDEV` in options when `development: true`");r=Jk(t,n.jsxDEV)}else{if(typeof n.jsx!="function")throw new TypeError("Expected `jsx` in production options");if(typeof n.jsxs!="function")throw new TypeError("Expected `jsxs` in production options");r=Zk(t,n.jsx,n.jsxs)}const i={Fragment:n.Fragment,ancestors:[],components:n.components||{},create:r,elementAttributeNameCase:n.elementAttributeNameCase||"react",evaluater:n.createEvaluater?n.createEvaluater():void 0,filePath:t,ignoreInvalidStyle:n.ignoreInvalidStyle||!1,passKeys:n.passKeys!==!1,passNode:n.passNode||!1,schema:n.space==="svg"?jc:uk,stylePropertyNameCase:n.stylePropertyNameCase||"dom",tableCellAlignToStyle:n.tableCellAlignToStyle!==!1},o=Ig(i,e,void 0);return o&&typeof o!="string"?o:i.create(e,i.Fragment,{children:o||void 0},void 0)}function Ig(e,n,t){if(n.type==="element")return Kk(e,n,t);if(n.type==="mdxFlowExpression"||n.type==="mdxTextExpression")return Vk(e,n);if(n.type==="mdxJsxFlowElement"||n.type==="mdxJsxTextElement")return Yk(e,n,t);if(n.type==="mdxjsEsm")return qk(e,n);if(n.type==="root")return Qk(e,n,t);if(n.type==="text")return Xk(e,n)}function Kk(e,n,t){const r=e.schema;let i=r;n.tagName.toLowerCase()==="svg"&&r.space==="html"&&(i=jc,e.schema=i),e.ancestors.push(n);const o=Og(e,n.tagName,!1),s=eE(e,n);let a=Hc(e,n);return Hk.has(n.tagName)&&(a=a.filter(function(l){return typeof l=="string"?!ek(l):!0})),Ag(e,s,o,n),$c(s,a),e.ancestors.pop(),e.schema=r,e.create(n,o,s,t)}function Vk(e,n){if(n.data&&n.data.estree&&e.evaluater){const r=n.data.estree.body[0];return r.type,e.evaluater.evaluateExpression(r.expression)}Bi(e,n.position)}function qk(e,n){if(n.data&&n.data.estree&&e.evaluater)return e.evaluater.evaluateProgram(n.data.estree);Bi(e,n.position)}function Yk(e,n,t){const r=e.schema;let i=r;n.name==="svg"&&r.space==="html"&&(i=jc,e.schema=i),e.ancestors.push(n);const o=n.name===null?e.Fragment:Og(e,n.name,!0),s=nE(e,n),a=Hc(e,n);return Ag(e,s,o,n),$c(s,a),e.ancestors.pop(),e.schema=r,e.create(n,o,s,t)}function Qk(e,n,t){const r={};return $c(r,Hc(e,n)),e.create(n,e.Fragment,r,t)}function Xk(e,n){return n.value}function Ag(e,n,t,r){typeof t!="string"&&t!==e.Fragment&&e.passNode&&(n.node=r)}function $c(e,n){if(n.length>0){const t=n.length>1?n:n[0];t&&(e.children=t)}}function Zk(e,n,t){return r;function r(i,o,s,a){const c=Array.isArray(s.children)?t:n;return a?c(o,s,a):c(o,s)}}function Jk(e,n){return t;function t(r,i,o,s){const a=Array.isArray(o.children),l=zc(r);return n(i,o,s,a,{columnNumber:l?l.column-1:void 0,fileName:e,lineNumber:l?l.line:void 0},void 0)}}function eE(e,n){const t={};let r,i;for(i in n.properties)if(i!=="children"&&Uc.call(n.properties,i)){const o=tE(e,i,n.properties[i]);if(o){const[s,a]=o;e.tableCellAlignToStyle&&s==="align"&&typeof a=="string"&&Gk.has(n.tagName)?r=a:t[s]=a}}if(r){const o=t.style||(t.style={});o[e.stylePropertyNameCase==="css"?"text-align":"textAlign"]=r}return t}function nE(e,n){const t={};for(const r of n.attributes)if(r.type==="mdxJsxExpressionAttribute")if(r.data&&r.data.estree&&e.evaluater){const o=r.data.estree.body[0];o.type;const s=o.expression;s.type;const a=s.properties[0];a.type,Object.assign(t,e.evaluater.evaluateExpression(a.argument))}else Bi(e,n.position);else{const i=r.name;let o;if(r.value&&typeof r.value=="object")if(r.value.data&&r.value.data.estree&&e.evaluater){const a=r.value.data.estree.body[0];a.type,o=e.evaluater.evaluateExpression(a.expression)}else Bi(e,n.position);else o=r.value===null?!0:r.value;t[i]=o}return t}function Hc(e,n){const t=[];let r=-1;const i=e.passKeys?new Map:Uk;for(;++r<n.children.length;){const o=n.children[r];let s;if(e.passKeys){const l=o.type==="element"?o.tagName:o.type==="mdxJsxFlowElement"||o.type==="mdxJsxTextElement"?o.name:void 0;if(l){const c=i.get(l)||0;s=l+"-"+c,i.set(l,c+1)}}const a=Ig(e,o,s);a!==void 0&&t.push(a)}return t}function tE(e,n,t){const r=ak(e.schema,n);if(!(t==null||typeof t=="number"&&Number.isNaN(t))){if(Array.isArray(t)&&(t=r.commaSeparated?Y0(t):dk(t)),r.property==="style"){let i=typeof t=="object"?t:rE(e,String(t));return e.stylePropertyNameCase==="css"&&(i=iE(i)),["style",i]}return[e.elementAttributeNameCase==="react"&&r.space?ik[r.property]||r.property:r.attribute,t]}}function rE(e,n){try{return Fk(n,{reactCompat:!0})}catch(t){if(e.ignoreInvalidStyle)return{};const r=t,i=new Fe("Cannot parse `style` attribute",{ancestors:e.ancestors,cause:r,ruleId:"style",source:"hast-util-to-jsx-runtime"});throw i.file=e.filePath||void 0,i.url=Ng+"#cannot-parse-style-attribute",i}}function Og(e,n,t){let r;if(!t)r={type:"Literal",value:n};else if(n.includes(".")){const i=n.split(".");let o=-1,s;for(;++o<i.length;){const a=Rd(i[o])?{type:"Identifier",name:i[o]}:{type:"Literal",value:i[o]};s=s?{type:"MemberExpression",object:s,property:a,computed:!!(o&&a.type==="Literal"),optional:!1}:a}r=s}else r=Rd(n)&&!/^[a-z]/.test(n)?{type:"Identifier",name:n}:{type:"Literal",value:n};if(r.type==="Literal"){const i=r.value;return Uc.call(e.components,i)?e.components[i]:i}if(e.evaluater)return e.evaluater.evaluateExpression(r);Bi(e)}function Bi(e,n){const t=new Fe("Cannot handle MDX estrees without `createEvaluater`",{ancestors:e.ancestors,place:n,ruleId:"mdx-estree",source:"hast-util-to-jsx-runtime"});throw t.file=e.filePath||void 0,t.url=Ng+"#cannot-handle-mdx-estrees-without-createevaluater",t}function iE(e){const n={};let t;for(t in e)Uc.call(e,t)&&(n[oE(t)]=e[t]);return n}function oE(e){let n=e.replace($k,sE);return n.slice(0,3)==="ms-"&&(n="-"+n),n}function sE(e){return"-"+e.toLowerCase()}const Sa={action:["form"],cite:["blockquote","del","ins","q"],data:["object"],formAction:["button","input"],href:["a","area","base","link"],icon:["menuitem"],itemId:null,manifest:["html"],ping:["a","area"],poster:["video"],src:["audio","embed","iframe","img","input","script","source","track","video"]},aE={};function lE(e,n){const t=aE,r=typeof t.includeImageAlt=="boolean"?t.includeImageAlt:!0,i=typeof t.includeHtml=="boolean"?t.includeHtml:!0;return Mg(e,r,i)}function Mg(e,n,t){if(cE(e)){if("value"in e)return e.type==="html"&&!t?"":e.value;if(n&&"alt"in e&&e.alt)return e.alt;if("children"in e)return Fd(e.children,n,t)}return Array.isArray(e)?Fd(e,n,t):""}function Fd(e,n,t){const r=[];let i=-1;for(;++i<e.length;)r[i]=Mg(e[i],n,t);return r.join("")}function cE(e){return!!(e&&typeof e=="object")}const zd=document.createElement("i");function Gc(e){const n="&"+e+";";zd.innerHTML=n;const t=zd.textContent;return t.charCodeAt(t.length-1)===59&&e!=="semi"||t===n?!1:t}function $n(e,n,t,r){const i=e.length;let o=0,s;if(n<0?n=-n>i?0:i+n:n=n>i?i:n,t=t>0?t:0,r.length<1e4)s=Array.from(r),s.unshift(n,t),e.splice(...s);else for(t&&e.splice(n,t);o<r.length;)s=r.slice(o,o+1e4),s.unshift(n,0),e.splice(...s),o+=1e4,n+=1e4}function bn(e,n){return e.length>0?($n(e,e.length,0,n),e):n}const Ud={}.hasOwnProperty;function uE(e){const n={};let t=-1;for(;++t<e.length;)dE(n,e[t]);return n}function dE(e,n){let t;for(t in n){const i=(Ud.call(e,t)?e[t]:void 0)||(e[t]={}),o=n[t];let s;if(o)for(s in o){Ud.call(i,s)||(i[s]=[]);const a=o[s];pE(i[s],Array.isArray(a)?a:a?[a]:[])}}}function pE(e,n){let t=-1;const r=[];for(;++t<n.length;)(n[t].add==="after"?e:r).push(n[t]);$n(e,0,0,r)}function Dg(e,n){const t=Number.parseInt(e,n);return t<9||t===11||t>13&&t<32||t>126&&t<160||t>55295&&t<57344||t>64975&&t<65008||(t&65535)===65535||(t&65535)===65534||t>1114111?"�":String.fromCodePoint(t)}function Tr(e){return e.replace(/[\t\n\r ]+/g," ").replace(/^ | $/g,"").toLowerCase().toUpperCase()}const Fn=Nt(/[A-Za-z]/),an=Nt(/[\dA-Za-z]/),fE=Nt(/[#-'*+\--9=?A-Z^-~]/);function Pl(e){return e!==null&&(e<32||e===127)}const Bl=Nt(/\d/),hE=Nt(/[\dA-Fa-f]/),gE=Nt(/[!-/:-@[-`{-~]/);function Z(e){return e!==null&&e<-2}function Ze(e){return e!==null&&(e<0||e===32)}function le(e){return e===-2||e===-1||e===32}const mE=Nt(new RegExp("\\p{P}|\\p{S}","u")),yE=Nt(/\s/);function Nt(e){return n;function n(t){return t!==null&&t>-1&&e.test(String.fromCharCode(t))}}function $r(e){const n=[];let t=-1,r=0,i=0;for(;++t<e.length;){const o=e.charCodeAt(t);let s="";if(o===37&&an(e.charCodeAt(t+1))&&an(e.charCodeAt(t+2)))i=2;else if(o<128)/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(o))||(s=String.fromCharCode(o));else if(o>55295&&o<57344){const a=e.charCodeAt(t+1);o<56320&&a>56319&&a<57344?(s=String.fromCharCode(o,a),i=1):s="�"}else s=String.fromCharCode(o);s&&(n.push(e.slice(r,t),encodeURIComponent(s)),r=t+i+1,s=""),i&&(t+=i,i=0)}return n.join("")+e.slice(r)}function he(e,n,t,r){const i=r?r-1:Number.POSITIVE_INFINITY;let o=0;return s;function s(l){return le(l)?(e.enter(t),a(l)):n(l)}function a(l){return le(l)&&o++<i?(e.consume(l),a):(e.exit(t),n(l))}}const bE={tokenize:vE};function vE(e){const n=e.attempt(this.parser.constructs.contentInitial,r,i);let t;return n;function r(a){if(a===null){e.consume(a);return}return e.enter("lineEnding"),e.consume(a),e.exit("lineEnding"),he(e,n,"linePrefix")}function i(a){return e.enter("paragraph"),o(a)}function o(a){const l=e.enter("chunkText",{contentType:"text",previous:t});return t&&(t.next=l),t=l,s(a)}function s(a){if(a===null){e.exit("chunkText"),e.exit("paragraph"),e.consume(a);return}return Z(a)?(e.consume(a),e.exit("chunkText"),o):(e.consume(a),s)}}const wE={tokenize:xE},$d={tokenize:SE};function xE(e){const n=this,t=[];let r=0,i,o,s;return a;function a(y){if(r<t.length){const _=t[r];return n.containerState=_[1],e.attempt(_[0].continuation,l,c)(y)}return c(y)}function l(y){if(r++,n.containerState._closeFlow){n.containerState._closeFlow=void 0,i&&m();const _=n.events.length;let N=_,k;for(;N--;)if(n.events[N][0]==="exit"&&n.events[N][1].type==="chunkFlow"){k=n.events[N][1].end;break}g(r);let I=_;for(;I<n.events.length;)n.events[I][1].end={...k},I++;return $n(n.events,N+1,0,n.events.slice(_)),n.events.length=I,c(y)}return a(y)}function c(y){if(r===t.length){if(!i)return p(y);if(i.currentConstruct&&i.currentConstruct.concrete)return v(y);n.interrupt=!!(i.currentConstruct&&!i._gfmTableDynamicInterruptHack)}return n.containerState={},e.check($d,u,d)(y)}function u(y){return i&&m(),g(r),p(y)}function d(y){return n.parser.lazy[n.now().line]=r!==t.length,s=n.now().offset,v(y)}function p(y){return n.containerState={},e.attempt($d,h,v)(y)}function h(y){return r++,t.push([n.currentConstruct,n.containerState]),p(y)}function v(y){if(y===null){i&&m(),g(0),e.consume(y);return}return i=i||n.parser.flow(n.now()),e.enter("chunkFlow",{_tokenizer:i,contentType:"flow",previous:o}),w(y)}function w(y){if(y===null){S(e.exit("chunkFlow"),!0),g(0),e.consume(y);return}return Z(y)?(e.consume(y),S(e.exit("chunkFlow")),r=0,n.interrupt=void 0,a):(e.consume(y),w)}function S(y,_){const N=n.sliceStream(y);if(_&&N.push(null),y.previous=o,o&&(o.next=y),o=y,i.defineSkip(y.start),i.write(N),n.parser.lazy[y.start.line]){let k=i.events.length;for(;k--;)if(i.events[k][1].start.offset<s&&(!i.events[k][1].end||i.events[k][1].end.offset>s))return;const I=n.events.length;let D=I,z,U;for(;D--;)if(n.events[D][0]==="exit"&&n.events[D][1].type==="chunkFlow"){if(z){U=n.events[D][1].end;break}z=!0}for(g(r),k=I;k<n.events.length;)n.events[k][1].end={...U},k++;$n(n.events,D+1,0,n.events.slice(I)),n.events.length=k}}function g(y){let _=t.length;for(;_-- >y;){const N=t[_];n.containerState=N[1],N[0].exit.call(n,e)}t.length=y}function m(){i.write([null]),o=void 0,i=void 0,n.containerState._closeFlow=void 0}}function SE(e,n,t){return he(e,e.attempt(this.parser.constructs.document,n,t),"linePrefix",this.parser.constructs.disable.null.includes("codeIndented")?void 0:4)}function Hd(e){if(e===null||Ze(e)||yE(e))return 1;if(mE(e))return 2}function Wc(e,n,t){const r=[];let i=-1;for(;++i<e.length;){const o=e[i].resolveAll;o&&!r.includes(o)&&(n=o(n,t),r.push(o))}return n}const jl={name:"attention",resolveAll:kE,tokenize:EE};function kE(e,n){let t=-1,r,i,o,s,a,l,c,u;for(;++t<e.length;)if(e[t][0]==="enter"&&e[t][1].type==="attentionSequence"&&e[t][1]._close){for(r=t;r--;)if(e[r][0]==="exit"&&e[r][1].type==="attentionSequence"&&e[r][1]._open&&n.sliceSerialize(e[r][1]).charCodeAt(0)===n.sliceSerialize(e[t][1]).charCodeAt(0)){if((e[r][1]._close||e[t][1]._open)&&(e[t][1].end.offset-e[t][1].start.offset)%3&&!((e[r][1].end.offset-e[r][1].start.offset+e[t][1].end.offset-e[t][1].start.offset)%3))continue;l=e[r][1].end.offset-e[r][1].start.offset>1&&e[t][1].end.offset-e[t][1].start.offset>1?2:1;const d={...e[r][1].end},p={...e[t][1].start};Gd(d,-l),Gd(p,l),s={type:l>1?"strongSequence":"emphasisSequence",start:d,end:{...e[r][1].end}},a={type:l>1?"strongSequence":"emphasisSequence",start:{...e[t][1].start},end:p},o={type:l>1?"strongText":"emphasisText",start:{...e[r][1].end},end:{...e[t][1].start}},i={type:l>1?"strong":"emphasis",start:{...s.start},end:{...a.end}},e[r][1].end={...s.start},e[t][1].start={...a.end},c=[],e[r][1].end.offset-e[r][1].start.offset&&(c=bn(c,[["enter",e[r][1],n],["exit",e[r][1],n]])),c=bn(c,[["enter",i,n],["enter",s,n],["exit",s,n],["enter",o,n]]),c=bn(c,Wc(n.parser.constructs.insideSpan.null,e.slice(r+1,t),n)),c=bn(c,[["exit",o,n],["enter",a,n],["exit",a,n],["exit",i,n]]),e[t][1].end.offset-e[t][1].start.offset?(u=2,c=bn(c,[["enter",e[t][1],n],["exit",e[t][1],n]])):u=0,$n(e,r-1,t-r+3,c),t=r+c.length-u-2;break}}for(t=-1;++t<e.length;)e[t][1].type==="attentionSequence"&&(e[t][1].type="data");return e}function EE(e,n){const t=this.parser.constructs.attentionMarkers.null,r=this.previous,i=Hd(r);let o;return s;function s(l){return o=l,e.enter("attentionSequence"),a(l)}function a(l){if(l===o)return e.consume(l),a;const c=e.exit("attentionSequence"),u=Hd(l),d=!u||u===2&&i||t.includes(l),p=!i||i===2&&u||t.includes(r);return c._open=!!(o===42?d:d&&(i||!p)),c._close=!!(o===42?p:p&&(u||!d)),n(l)}}function Gd(e,n){e.column+=n,e.offset+=n,e._bufferIndex+=n}const _E={name:"autolink",tokenize:CE};function CE(e,n,t){let r=0;return i;function i(h){return e.enter("autolink"),e.enter("autolinkMarker"),e.consume(h),e.exit("autolinkMarker"),e.enter("autolinkProtocol"),o}function o(h){return Fn(h)?(e.consume(h),s):h===64?t(h):c(h)}function s(h){return h===43||h===45||h===46||an(h)?(r=1,a(h)):c(h)}function a(h){return h===58?(e.consume(h),r=0,l):(h===43||h===45||h===46||an(h))&&r++<32?(e.consume(h),a):(r=0,c(h))}function l(h){return h===62?(e.exit("autolinkProtocol"),e.enter("autolinkMarker"),e.consume(h),e.exit("autolinkMarker"),e.exit("autolink"),n):h===null||h===32||h===60||Pl(h)?t(h):(e.consume(h),l)}function c(h){return h===64?(e.consume(h),u):fE(h)?(e.consume(h),c):t(h)}function u(h){return an(h)?d(h):t(h)}function d(h){return h===46?(e.consume(h),r=0,u):h===62?(e.exit("autolinkProtocol").type="autolinkEmail",e.enter("autolinkMarker"),e.consume(h),e.exit("autolinkMarker"),e.exit("autolink"),n):p(h)}function p(h){if((h===45||an(h))&&r++<63){const v=h===45?p:d;return e.consume(h),v}return t(h)}}const Bs={partial:!0,tokenize:TE};function TE(e,n,t){return r;function r(o){return le(o)?he(e,i,"linePrefix")(o):i(o)}function i(o){return o===null||Z(o)?n(o):t(o)}}const Lg={continuation:{tokenize:NE},exit:IE,name:"blockQuote",tokenize:RE};function RE(e,n,t){const r=this;return i;function i(s){if(s===62){const a=r.containerState;return a.open||(e.enter("blockQuote",{_container:!0}),a.open=!0),e.enter("blockQuotePrefix"),e.enter("blockQuoteMarker"),e.consume(s),e.exit("blockQuoteMarker"),o}return t(s)}function o(s){return le(s)?(e.enter("blockQuotePrefixWhitespace"),e.consume(s),e.exit("blockQuotePrefixWhitespace"),e.exit("blockQuotePrefix"),n):(e.exit("blockQuotePrefix"),n(s))}}function NE(e,n,t){const r=this;return i;function i(s){return le(s)?he(e,o,"linePrefix",r.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(s):o(s)}function o(s){return e.attempt(Lg,n,t)(s)}}function IE(e){e.exit("blockQuote")}const Pg={name:"characterEscape",tokenize:AE};function AE(e,n,t){return r;function r(o){return e.enter("characterEscape"),e.enter("escapeMarker"),e.consume(o),e.exit("escapeMarker"),i}function i(o){return gE(o)?(e.enter("characterEscapeValue"),e.consume(o),e.exit("characterEscapeValue"),e.exit("characterEscape"),n):t(o)}}const Bg={name:"characterReference",tokenize:OE};function OE(e,n,t){const r=this;let i=0,o,s;return a;function a(d){return e.enter("characterReference"),e.enter("characterReferenceMarker"),e.consume(d),e.exit("characterReferenceMarker"),l}function l(d){return d===35?(e.enter("characterReferenceMarkerNumeric"),e.consume(d),e.exit("characterReferenceMarkerNumeric"),c):(e.enter("characterReferenceValue"),o=31,s=an,u(d))}function c(d){return d===88||d===120?(e.enter("characterReferenceMarkerHexadecimal"),e.consume(d),e.exit("characterReferenceMarkerHexadecimal"),e.enter("characterReferenceValue"),o=6,s=hE,u):(e.enter("characterReferenceValue"),o=7,s=Bl,u(d))}function u(d){if(d===59&&i){const p=e.exit("characterReferenceValue");return s===an&&!Gc(r.sliceSerialize(p))?t(d):(e.enter("characterReferenceMarker"),e.consume(d),e.exit("characterReferenceMarker"),e.exit("characterReference"),n)}return s(d)&&i++<o?(e.consume(d),u):t(d)}}const Wd={partial:!0,tokenize:DE},Kd={concrete:!0,name:"codeFenced",tokenize:ME};function ME(e,n,t){const r=this,i={partial:!0,tokenize:N};let o=0,s=0,a;return l;function l(k){return c(k)}function c(k){const I=r.events[r.events.length-1];return o=I&&I[1].type==="linePrefix"?I[2].sliceSerialize(I[1],!0).length:0,a=k,e.enter("codeFenced"),e.enter("codeFencedFence"),e.enter("codeFencedFenceSequence"),u(k)}function u(k){return k===a?(s++,e.consume(k),u):s<3?t(k):(e.exit("codeFencedFenceSequence"),le(k)?he(e,d,"whitespace")(k):d(k))}function d(k){return k===null||Z(k)?(e.exit("codeFencedFence"),r.interrupt?n(k):e.check(Wd,w,_)(k)):(e.enter("codeFencedFenceInfo"),e.enter("chunkString",{contentType:"string"}),p(k))}function p(k){return k===null||Z(k)?(e.exit("chunkString"),e.exit("codeFencedFenceInfo"),d(k)):le(k)?(e.exit("chunkString"),e.exit("codeFencedFenceInfo"),he(e,h,"whitespace")(k)):k===96&&k===a?t(k):(e.consume(k),p)}function h(k){return k===null||Z(k)?d(k):(e.enter("codeFencedFenceMeta"),e.enter("chunkString",{contentType:"string"}),v(k))}function v(k){return k===null||Z(k)?(e.exit("chunkString"),e.exit("codeFencedFenceMeta"),d(k)):k===96&&k===a?t(k):(e.consume(k),v)}function w(k){return e.attempt(i,_,S)(k)}function S(k){return e.enter("lineEnding"),e.consume(k),e.exit("lineEnding"),g}function g(k){return o>0&&le(k)?he(e,m,"linePrefix",o+1)(k):m(k)}function m(k){return k===null||Z(k)?e.check(Wd,w,_)(k):(e.enter("codeFlowValue"),y(k))}function y(k){return k===null||Z(k)?(e.exit("codeFlowValue"),m(k)):(e.consume(k),y)}function _(k){return e.exit("codeFenced"),n(k)}function N(k,I,D){let z=0;return U;function U(q){return k.enter("lineEnding"),k.consume(q),k.exit("lineEnding"),H}function H(q){return k.enter("codeFencedFence"),le(q)?he(k,G,"linePrefix",r.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(q):G(q)}function G(q){return q===a?(k.enter("codeFencedFenceSequence"),J(q)):D(q)}function J(q){return q===a?(z++,k.consume(q),J):z>=s?(k.exit("codeFencedFenceSequence"),le(q)?he(k,Q,"whitespace")(q):Q(q)):D(q)}function Q(q){return q===null||Z(q)?(k.exit("codeFencedFence"),I(q)):D(q)}}}function DE(e,n,t){const r=this;return i;function i(s){return s===null?t(s):(e.enter("lineEnding"),e.consume(s),e.exit("lineEnding"),o)}function o(s){return r.parser.lazy[r.now().line]?t(s):n(s)}}const ka={name:"codeIndented",tokenize:PE},LE={partial:!0,tokenize:BE};function PE(e,n,t){const r=this;return i;function i(c){return e.enter("codeIndented"),he(e,o,"linePrefix",5)(c)}function o(c){const u=r.events[r.events.length-1];return u&&u[1].type==="linePrefix"&&u[2].sliceSerialize(u[1],!0).length>=4?s(c):t(c)}function s(c){return c===null?l(c):Z(c)?e.attempt(LE,s,l)(c):(e.enter("codeFlowValue"),a(c))}function a(c){return c===null||Z(c)?(e.exit("codeFlowValue"),s(c)):(e.consume(c),a)}function l(c){return e.exit("codeIndented"),n(c)}}function BE(e,n,t){const r=this;return i;function i(s){return r.parser.lazy[r.now().line]?t(s):Z(s)?(e.enter("lineEnding"),e.consume(s),e.exit("lineEnding"),i):he(e,o,"linePrefix",5)(s)}function o(s){const a=r.events[r.events.length-1];return a&&a[1].type==="linePrefix"&&a[2].sliceSerialize(a[1],!0).length>=4?n(s):Z(s)?i(s):t(s)}}const jE={name:"codeText",previous:zE,resolve:FE,tokenize:UE};function FE(e){let n=e.length-4,t=3,r,i;if((e[t][1].type==="lineEnding"||e[t][1].type==="space")&&(e[n][1].type==="lineEnding"||e[n][1].type==="space")){for(r=t;++r<n;)if(e[r][1].type==="codeTextData"){e[t][1].type="codeTextPadding",e[n][1].type="codeTextPadding",t+=2,n-=2;break}}for(r=t-1,n++;++r<=n;)i===void 0?r!==n&&e[r][1].type!=="lineEnding"&&(i=r):(r===n||e[r][1].type==="lineEnding")&&(e[i][1].type="codeTextData",r!==i+2&&(e[i][1].end=e[r-1][1].end,e.splice(i+2,r-i-2),n-=r-i-2,r=i+2),i=void 0);return e}function zE(e){return e!==96||this.events[this.events.length-1][1].type==="characterEscape"}function UE(e,n,t){let r=0,i,o;return s;function s(d){return e.enter("codeText"),e.enter("codeTextSequence"),a(d)}function a(d){return d===96?(e.consume(d),r++,a):(e.exit("codeTextSequence"),l(d))}function l(d){return d===null?t(d):d===32?(e.enter("space"),e.consume(d),e.exit("space"),l):d===96?(o=e.enter("codeTextSequence"),i=0,u(d)):Z(d)?(e.enter("lineEnding"),e.consume(d),e.exit("lineEnding"),l):(e.enter("codeTextData"),c(d))}function c(d){return d===null||d===32||d===96||Z(d)?(e.exit("codeTextData"),l(d)):(e.consume(d),c)}function u(d){return d===96?(e.consume(d),i++,u):i===r?(e.exit("codeTextSequence"),e.exit("codeText"),n(d)):(o.type="codeTextData",c(d))}}class $E{constructor(n){this.left=n?[...n]:[],this.right=[]}get(n){if(n<0||n>=this.left.length+this.right.length)throw new RangeError("Cannot access index `"+n+"` in a splice buffer of size `"+(this.left.length+this.right.length)+"`");return n<this.left.length?this.left[n]:this.right[this.right.length-n+this.left.length-1]}get length(){return this.left.length+this.right.length}shift(){return this.setCursor(0),this.right.pop()}slice(n,t){const r=t??Number.POSITIVE_INFINITY;return r<this.left.length?this.left.slice(n,r):n>this.left.length?this.right.slice(this.right.length-r+this.left.length,this.right.length-n+this.left.length).reverse():this.left.slice(n).concat(this.right.slice(this.right.length-r+this.left.length).reverse())}splice(n,t,r){const i=t||0;this.setCursor(Math.trunc(n));const o=this.right.splice(this.right.length-i,Number.POSITIVE_INFINITY);return r&&Jr(this.left,r),o.reverse()}pop(){return this.setCursor(Number.POSITIVE_INFINITY),this.left.pop()}push(n){this.setCursor(Number.POSITIVE_INFINITY),this.left.push(n)}pushMany(n){this.setCursor(Number.POSITIVE_INFINITY),Jr(this.left,n)}unshift(n){this.setCursor(0),this.right.push(n)}unshiftMany(n){this.setCursor(0),Jr(this.right,n.reverse())}setCursor(n){if(!(n===this.left.length||n>this.left.length&&this.right.length===0||n<0&&this.left.length===0))if(n<this.left.length){const t=this.left.splice(n,Number.POSITIVE_INFINITY);Jr(this.right,t.reverse())}else{const t=this.right.splice(this.left.length+this.right.length-n,Number.POSITIVE_INFINITY);Jr(this.left,t.reverse())}}}function Jr(e,n){let t=0;if(n.length<1e4)e.push(...n);else for(;t<n.length;)e.push(...n.slice(t,t+1e4)),t+=1e4}function jg(e){const n={};let t=-1,r,i,o,s,a,l,c;const u=new $E(e);for(;++t<u.length;){for(;t in n;)t=n[t];if(r=u.get(t),t&&r[1].type==="chunkFlow"&&u.get(t-1)[1].type==="listItemPrefix"&&(l=r[1]._tokenizer.events,o=0,o<l.length&&l[o][1].type==="lineEndingBlank"&&(o+=2),o<l.length&&l[o][1].type==="content"))for(;++o<l.length&&l[o][1].type!=="content";)l[o][1].type==="chunkText"&&(l[o][1]._isInFirstContentOfListItem=!0,o++);if(r[0]==="enter")r[1].contentType&&(Object.assign(n,HE(u,t)),t=n[t],c=!0);else if(r[1]._container){for(o=t,i=void 0;o--;)if(s=u.get(o),s[1].type==="lineEnding"||s[1].type==="lineEndingBlank")s[0]==="enter"&&(i&&(u.get(i)[1].type="lineEndingBlank"),s[1].type="lineEnding",i=o);else if(!(s[1].type==="linePrefix"||s[1].type==="listItemIndent"))break;i&&(r[1].end={...u.get(i)[1].start},a=u.slice(i,t),a.unshift(r),u.splice(i,t-i+1,a))}}return $n(e,0,Number.POSITIVE_INFINITY,u.slice(0)),!c}function HE(e,n){const t=e.get(n)[1],r=e.get(n)[2];let i=n-1;const o=[];let s=t._tokenizer;s||(s=r.parser[t.contentType](t.start),t._contentTypeTextTrailing&&(s._contentTypeTextTrailing=!0));const a=s.events,l=[],c={};let u,d,p=-1,h=t,v=0,w=0;const S=[w];for(;h;){for(;e.get(++i)[1]!==h;);o.push(i),h._tokenizer||(u=r.sliceStream(h),h.next||u.push(null),d&&s.defineSkip(h.start),h._isInFirstContentOfListItem&&(s._gfmTasklistFirstContentOfListItem=!0),s.write(u),h._isInFirstContentOfListItem&&(s._gfmTasklistFirstContentOfListItem=void 0)),d=h,h=h.next}for(h=t;++p<a.length;)a[p][0]==="exit"&&a[p-1][0]==="enter"&&a[p][1].type===a[p-1][1].type&&a[p][1].start.line!==a[p][1].end.line&&(w=p+1,S.push(w),h._tokenizer=void 0,h.previous=void 0,h=h.next);for(s.events=[],h?(h._tokenizer=void 0,h.previous=void 0):S.pop(),p=S.length;p--;){const g=a.slice(S[p],S[p+1]),m=o.pop();l.push([m,m+g.length-1]),e.splice(m,2,g)}for(l.reverse(),p=-1;++p<l.length;)c[v+l[p][0]]=v+l[p][1],v+=l[p][1]-l[p][0]-1;return c}const GE={resolve:KE,tokenize:VE},WE={partial:!0,tokenize:qE};function KE(e){return jg(e),e}function VE(e,n){let t;return r;function r(a){return e.enter("content"),t=e.enter("chunkContent",{contentType:"content"}),i(a)}function i(a){return a===null?o(a):Z(a)?e.check(WE,s,o)(a):(e.consume(a),i)}function o(a){return e.exit("chunkContent"),e.exit("content"),n(a)}function s(a){return e.consume(a),e.exit("chunkContent"),t.next=e.enter("chunkContent",{contentType:"content",previous:t}),t=t.next,i}}function qE(e,n,t){const r=this;return i;function i(s){return e.exit("chunkContent"),e.enter("lineEnding"),e.consume(s),e.exit("lineEnding"),he(e,o,"linePrefix")}function o(s){if(s===null||Z(s))return t(s);const a=r.events[r.events.length-1];return!r.parser.constructs.disable.null.includes("codeIndented")&&a&&a[1].type==="linePrefix"&&a[2].sliceSerialize(a[1],!0).length>=4?n(s):e.interrupt(r.parser.constructs.flow,t,n)(s)}}function Fg(e,n,t,r,i,o,s,a,l){const c=l||Number.POSITIVE_INFINITY;let u=0;return d;function d(g){return g===60?(e.enter(r),e.enter(i),e.enter(o),e.consume(g),e.exit(o),p):g===null||g===32||g===41||Pl(g)?t(g):(e.enter(r),e.enter(s),e.enter(a),e.enter("chunkString",{contentType:"string"}),w(g))}function p(g){return g===62?(e.enter(o),e.consume(g),e.exit(o),e.exit(i),e.exit(r),n):(e.enter(a),e.enter("chunkString",{contentType:"string"}),h(g))}function h(g){return g===62?(e.exit("chunkString"),e.exit(a),p(g)):g===null||g===60||Z(g)?t(g):(e.consume(g),g===92?v:h)}function v(g){return g===60||g===62||g===92?(e.consume(g),h):h(g)}function w(g){return!u&&(g===null||g===41||Ze(g))?(e.exit("chunkString"),e.exit(a),e.exit(s),e.exit(r),n(g)):u<c&&g===40?(e.consume(g),u++,w):g===41?(e.consume(g),u--,w):g===null||g===32||g===40||Pl(g)?t(g):(e.consume(g),g===92?S:w)}function S(g){return g===40||g===41||g===92?(e.consume(g),w):w(g)}}function zg(e,n,t,r,i,o){const s=this;let a=0,l;return c;function c(h){return e.enter(r),e.enter(i),e.consume(h),e.exit(i),e.enter(o),u}function u(h){return a>999||h===null||h===91||h===93&&!l||h===94&&!a&&"_hiddenFootnoteSupport"in s.parser.constructs?t(h):h===93?(e.exit(o),e.enter(i),e.consume(h),e.exit(i),e.exit(r),n):Z(h)?(e.enter("lineEnding"),e.consume(h),e.exit("lineEnding"),u):(e.enter("chunkString",{contentType:"string"}),d(h))}function d(h){return h===null||h===91||h===93||Z(h)||a++>999?(e.exit("chunkString"),u(h)):(e.consume(h),l||(l=!le(h)),h===92?p:d)}function p(h){return h===91||h===92||h===93?(e.consume(h),a++,d):d(h)}}function Ug(e,n,t,r,i,o){let s;return a;function a(p){return p===34||p===39||p===40?(e.enter(r),e.enter(i),e.consume(p),e.exit(i),s=p===40?41:p,l):t(p)}function l(p){return p===s?(e.enter(i),e.consume(p),e.exit(i),e.exit(r),n):(e.enter(o),c(p))}function c(p){return p===s?(e.exit(o),l(s)):p===null?t(p):Z(p)?(e.enter("lineEnding"),e.consume(p),e.exit("lineEnding"),he(e,c,"linePrefix")):(e.enter("chunkString",{contentType:"string"}),u(p))}function u(p){return p===s||p===null||Z(p)?(e.exit("chunkString"),c(p)):(e.consume(p),p===92?d:u)}function d(p){return p===s||p===92?(e.consume(p),u):u(p)}}function bi(e,n){let t;return r;function r(i){return Z(i)?(e.enter("lineEnding"),e.consume(i),e.exit("lineEnding"),t=!0,r):le(i)?he(e,r,t?"linePrefix":"lineSuffix")(i):n(i)}}const YE={name:"definition",tokenize:XE},QE={partial:!0,tokenize:ZE};function XE(e,n,t){const r=this;let i;return o;function o(h){return e.enter("definition"),s(h)}function s(h){return zg.call(r,e,a,t,"definitionLabel","definitionLabelMarker","definitionLabelString")(h)}function a(h){return i=Tr(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)),h===58?(e.enter("definitionMarker"),e.consume(h),e.exit("definitionMarker"),l):t(h)}function l(h){return Ze(h)?bi(e,c)(h):c(h)}function c(h){return Fg(e,u,t,"definitionDestination","definitionDestinationLiteral","definitionDestinationLiteralMarker","definitionDestinationRaw","definitionDestinationString")(h)}function u(h){return e.attempt(QE,d,d)(h)}function d(h){return le(h)?he(e,p,"whitespace")(h):p(h)}function p(h){return h===null||Z(h)?(e.exit("definition"),r.parser.defined.push(i),n(h)):t(h)}}function ZE(e,n,t){return r;function r(a){return Ze(a)?bi(e,i)(a):t(a)}function i(a){return Ug(e,o,t,"definitionTitle","definitionTitleMarker","definitionTitleString")(a)}function o(a){return le(a)?he(e,s,"whitespace")(a):s(a)}function s(a){return a===null||Z(a)?n(a):t(a)}}const JE={name:"hardBreakEscape",tokenize:e_};function e_(e,n,t){return r;function r(o){return e.enter("hardBreakEscape"),e.consume(o),i}function i(o){return Z(o)?(e.exit("hardBreakEscape"),n(o)):t(o)}}const n_={name:"headingAtx",resolve:t_,tokenize:r_};function t_(e,n){let t=e.length-2,r=3,i,o;return e[r][1].type==="whitespace"&&(r+=2),t-2>r&&e[t][1].type==="whitespace"&&(t-=2),e[t][1].type==="atxHeadingSequence"&&(r===t-1||t-4>r&&e[t-2][1].type==="whitespace")&&(t-=r+1===t?2:4),t>r&&(i={type:"atxHeadingText",start:e[r][1].start,end:e[t][1].end},o={type:"chunkText",start:e[r][1].start,end:e[t][1].end,contentType:"text"},$n(e,r,t-r+1,[["enter",i,n],["enter",o,n],["exit",o,n],["exit",i,n]])),e}function r_(e,n,t){let r=0;return i;function i(u){return e.enter("atxHeading"),o(u)}function o(u){return e.enter("atxHeadingSequence"),s(u)}function s(u){return u===35&&r++<6?(e.consume(u),s):u===null||Ze(u)?(e.exit("atxHeadingSequence"),a(u)):t(u)}function a(u){return u===35?(e.enter("atxHeadingSequence"),l(u)):u===null||Z(u)?(e.exit("atxHeading"),n(u)):le(u)?he(e,a,"whitespace")(u):(e.enter("atxHeadingText"),c(u))}function l(u){return u===35?(e.consume(u),l):(e.exit("atxHeadingSequence"),a(u))}function c(u){return u===null||u===35||Ze(u)?(e.exit("atxHeadingText"),a(u)):(e.consume(u),c)}}const i_=["address","article","aside","base","basefont","blockquote","body","caption","center","col","colgroup","dd","details","dialog","dir","div","dl","dt","fieldset","figcaption","figure","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hr","html","iframe","legend","li","link","main","menu","menuitem","nav","noframes","ol","optgroup","option","p","param","search","section","summary","table","tbody","td","tfoot","th","thead","title","tr","track","ul"],Vd=["pre","script","style","textarea"],o_={concrete:!0,name:"htmlFlow",resolveTo:l_,tokenize:c_},s_={partial:!0,tokenize:d_},a_={partial:!0,tokenize:u_};function l_(e){let n=e.length;for(;n--&&!(e[n][0]==="enter"&&e[n][1].type==="htmlFlow"););return n>1&&e[n-2][1].type==="linePrefix"&&(e[n][1].start=e[n-2][1].start,e[n+1][1].start=e[n-2][1].start,e.splice(n-2,2)),e}function c_(e,n,t){const r=this;let i,o,s,a,l;return c;function c(E){return u(E)}function u(E){return e.enter("htmlFlow"),e.enter("htmlFlowData"),e.consume(E),d}function d(E){return E===33?(e.consume(E),p):E===47?(e.consume(E),o=!0,w):E===63?(e.consume(E),i=3,r.interrupt?n:b):Fn(E)?(e.consume(E),s=String.fromCharCode(E),S):t(E)}function p(E){return E===45?(e.consume(E),i=2,h):E===91?(e.consume(E),i=5,a=0,v):Fn(E)?(e.consume(E),i=4,r.interrupt?n:b):t(E)}function h(E){return E===45?(e.consume(E),r.interrupt?n:b):t(E)}function v(E){const X="CDATA[";return E===X.charCodeAt(a++)?(e.consume(E),a===X.length?r.interrupt?n:G:v):t(E)}function w(E){return Fn(E)?(e.consume(E),s=String.fromCharCode(E),S):t(E)}function S(E){if(E===null||E===47||E===62||Ze(E)){const X=E===47,te=s.toLowerCase();return!X&&!o&&Vd.includes(te)?(i=1,r.interrupt?n(E):G(E)):i_.includes(s.toLowerCase())?(i=6,X?(e.consume(E),g):r.interrupt?n(E):G(E)):(i=7,r.interrupt&&!r.parser.lazy[r.now().line]?t(E):o?m(E):y(E))}return E===45||an(E)?(e.consume(E),s+=String.fromCharCode(E),S):t(E)}function g(E){return E===62?(e.consume(E),r.interrupt?n:G):t(E)}function m(E){return le(E)?(e.consume(E),m):U(E)}function y(E){return E===47?(e.consume(E),U):E===58||E===95||Fn(E)?(e.consume(E),_):le(E)?(e.consume(E),y):U(E)}function _(E){return E===45||E===46||E===58||E===95||an(E)?(e.consume(E),_):N(E)}function N(E){return E===61?(e.consume(E),k):le(E)?(e.consume(E),N):y(E)}function k(E){return E===null||E===60||E===61||E===62||E===96?t(E):E===34||E===39?(e.consume(E),l=E,I):le(E)?(e.consume(E),k):D(E)}function I(E){return E===l?(e.consume(E),l=null,z):E===null||Z(E)?t(E):(e.consume(E),I)}function D(E){return E===null||E===34||E===39||E===47||E===60||E===61||E===62||E===96||Ze(E)?N(E):(e.consume(E),D)}function z(E){return E===47||E===62||le(E)?y(E):t(E)}function U(E){return E===62?(e.consume(E),H):t(E)}function H(E){return E===null||Z(E)?G(E):le(E)?(e.consume(E),H):t(E)}function G(E){return E===45&&i===2?(e.consume(E),C):E===60&&i===1?(e.consume(E),O):E===62&&i===4?(e.consume(E),$):E===63&&i===3?(e.consume(E),b):E===93&&i===5?(e.consume(E),M):Z(E)&&(i===6||i===7)?(e.exit("htmlFlowData"),e.check(s_,W,J)(E)):E===null||Z(E)?(e.exit("htmlFlowData"),J(E)):(e.consume(E),G)}function J(E){return e.check(a_,Q,W)(E)}function Q(E){return e.enter("lineEnding"),e.consume(E),e.exit("lineEnding"),q}function q(E){return E===null||Z(E)?J(E):(e.enter("htmlFlowData"),G(E))}function C(E){return E===45?(e.consume(E),b):G(E)}function O(E){return E===47?(e.consume(E),s="",R):G(E)}function R(E){if(E===62){const X=s.toLowerCase();return Vd.includes(X)?(e.consume(E),$):G(E)}return Fn(E)&&s.length<8?(e.consume(E),s+=String.fromCharCode(E),R):G(E)}function M(E){return E===93?(e.consume(E),b):G(E)}function b(E){return E===62?(e.consume(E),$):E===45&&i===2?(e.consume(E),b):G(E)}function $(E){return E===null||Z(E)?(e.exit("htmlFlowData"),W(E)):(e.consume(E),$)}function W(E){return e.exit("htmlFlow"),n(E)}}function u_(e,n,t){const r=this;return i;function i(s){return Z(s)?(e.enter("lineEnding"),e.consume(s),e.exit("lineEnding"),o):t(s)}function o(s){return r.parser.lazy[r.now().line]?t(s):n(s)}}function d_(e,n,t){return r;function r(i){return e.enter("lineEnding"),e.consume(i),e.exit("lineEnding"),e.attempt(Bs,n,t)}}const p_={name:"htmlText",tokenize:f_};function f_(e,n,t){const r=this;let i,o,s;return a;function a(b){return e.enter("htmlText"),e.enter("htmlTextData"),e.consume(b),l}function l(b){return b===33?(e.consume(b),c):b===47?(e.consume(b),N):b===63?(e.consume(b),y):Fn(b)?(e.consume(b),D):t(b)}function c(b){return b===45?(e.consume(b),u):b===91?(e.consume(b),o=0,v):Fn(b)?(e.consume(b),m):t(b)}function u(b){return b===45?(e.consume(b),h):t(b)}function d(b){return b===null?t(b):b===45?(e.consume(b),p):Z(b)?(s=d,O(b)):(e.consume(b),d)}function p(b){return b===45?(e.consume(b),h):d(b)}function h(b){return b===62?C(b):b===45?p(b):d(b)}function v(b){const $="CDATA[";return b===$.charCodeAt(o++)?(e.consume(b),o===$.length?w:v):t(b)}function w(b){return b===null?t(b):b===93?(e.consume(b),S):Z(b)?(s=w,O(b)):(e.consume(b),w)}function S(b){return b===93?(e.consume(b),g):w(b)}function g(b){return b===62?C(b):b===93?(e.consume(b),g):w(b)}function m(b){return b===null||b===62?C(b):Z(b)?(s=m,O(b)):(e.consume(b),m)}function y(b){return b===null?t(b):b===63?(e.consume(b),_):Z(b)?(s=y,O(b)):(e.consume(b),y)}function _(b){return b===62?C(b):y(b)}function N(b){return Fn(b)?(e.consume(b),k):t(b)}function k(b){return b===45||an(b)?(e.consume(b),k):I(b)}function I(b){return Z(b)?(s=I,O(b)):le(b)?(e.consume(b),I):C(b)}function D(b){return b===45||an(b)?(e.consume(b),D):b===47||b===62||Ze(b)?z(b):t(b)}function z(b){return b===47?(e.consume(b),C):b===58||b===95||Fn(b)?(e.consume(b),U):Z(b)?(s=z,O(b)):le(b)?(e.consume(b),z):C(b)}function U(b){return b===45||b===46||b===58||b===95||an(b)?(e.consume(b),U):H(b)}function H(b){return b===61?(e.consume(b),G):Z(b)?(s=H,O(b)):le(b)?(e.consume(b),H):z(b)}function G(b){return b===null||b===60||b===61||b===62||b===96?t(b):b===34||b===39?(e.consume(b),i=b,J):Z(b)?(s=G,O(b)):le(b)?(e.consume(b),G):(e.consume(b),Q)}function J(b){return b===i?(e.consume(b),i=void 0,q):b===null?t(b):Z(b)?(s=J,O(b)):(e.consume(b),J)}function Q(b){return b===null||b===34||b===39||b===60||b===61||b===96?t(b):b===47||b===62||Ze(b)?z(b):(e.consume(b),Q)}function q(b){return b===47||b===62||Ze(b)?z(b):t(b)}function C(b){return b===62?(e.consume(b),e.exit("htmlTextData"),e.exit("htmlText"),n):t(b)}function O(b){return e.exit("htmlTextData"),e.enter("lineEnding"),e.consume(b),e.exit("lineEnding"),R}function R(b){return le(b)?he(e,M,"linePrefix",r.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(b):M(b)}function M(b){return e.enter("htmlTextData"),s(b)}}const Kc={name:"labelEnd",resolveAll:y_,resolveTo:b_,tokenize:v_},h_={tokenize:w_},g_={tokenize:x_},m_={tokenize:S_};function y_(e){let n=-1;const t=[];for(;++n<e.length;){const r=e[n][1];if(t.push(e[n]),r.type==="labelImage"||r.type==="labelLink"||r.type==="labelEnd"){const i=r.type==="labelImage"?4:2;r.type="data",n+=i}}return e.length!==t.length&&$n(e,0,e.length,t),e}function b_(e,n){let t=e.length,r=0,i,o,s,a;for(;t--;)if(i=e[t][1],o){if(i.type==="link"||i.type==="labelLink"&&i._inactive)break;e[t][0]==="enter"&&i.type==="labelLink"&&(i._inactive=!0)}else if(s){if(e[t][0]==="enter"&&(i.type==="labelImage"||i.type==="labelLink")&&!i._balanced&&(o=t,i.type!=="labelLink")){r=2;break}}else i.type==="labelEnd"&&(s=t);const l={type:e[o][1].type==="labelLink"?"link":"image",start:{...e[o][1].start},end:{...e[e.length-1][1].end}},c={type:"label",start:{...e[o][1].start},end:{...e[s][1].end}},u={type:"labelText",start:{...e[o+r+2][1].end},end:{...e[s-2][1].start}};return a=[["enter",l,n],["enter",c,n]],a=bn(a,e.slice(o+1,o+r+3)),a=bn(a,[["enter",u,n]]),a=bn(a,Wc(n.parser.constructs.insideSpan.null,e.slice(o+r+4,s-3),n)),a=bn(a,[["exit",u,n],e[s-2],e[s-1],["exit",c,n]]),a=bn(a,e.slice(s+1)),a=bn(a,[["exit",l,n]]),$n(e,o,e.length,a),e}function v_(e,n,t){const r=this;let i=r.events.length,o,s;for(;i--;)if((r.events[i][1].type==="labelImage"||r.events[i][1].type==="labelLink")&&!r.events[i][1]._balanced){o=r.events[i][1];break}return a;function a(p){return o?o._inactive?d(p):(s=r.parser.defined.includes(Tr(r.sliceSerialize({start:o.end,end:r.now()}))),e.enter("labelEnd"),e.enter("labelMarker"),e.consume(p),e.exit("labelMarker"),e.exit("labelEnd"),l):t(p)}function l(p){return p===40?e.attempt(h_,u,s?u:d)(p):p===91?e.attempt(g_,u,s?c:d)(p):s?u(p):d(p)}function c(p){return e.attempt(m_,u,d)(p)}function u(p){return n(p)}function d(p){return o._balanced=!0,t(p)}}function w_(e,n,t){return r;function r(d){return e.enter("resource"),e.enter("resourceMarker"),e.consume(d),e.exit("resourceMarker"),i}function i(d){return Ze(d)?bi(e,o)(d):o(d)}function o(d){return d===41?u(d):Fg(e,s,a,"resourceDestination","resourceDestinationLiteral","resourceDestinationLiteralMarker","resourceDestinationRaw","resourceDestinationString",32)(d)}function s(d){return Ze(d)?bi(e,l)(d):u(d)}function a(d){return t(d)}function l(d){return d===34||d===39||d===40?Ug(e,c,t,"resourceTitle","resourceTitleMarker","resourceTitleString")(d):u(d)}function c(d){return Ze(d)?bi(e,u)(d):u(d)}function u(d){return d===41?(e.enter("resourceMarker"),e.consume(d),e.exit("resourceMarker"),e.exit("resource"),n):t(d)}}function x_(e,n,t){const r=this;return i;function i(a){return zg.call(r,e,o,s,"reference","referenceMarker","referenceString")(a)}function o(a){return r.parser.defined.includes(Tr(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)))?n(a):t(a)}function s(a){return t(a)}}function S_(e,n,t){return r;function r(o){return e.enter("reference"),e.enter("referenceMarker"),e.consume(o),e.exit("referenceMarker"),i}function i(o){return o===93?(e.enter("referenceMarker"),e.consume(o),e.exit("referenceMarker"),e.exit("reference"),n):t(o)}}const k_={name:"labelStartImage",resolveAll:Kc.resolveAll,tokenize:E_};function E_(e,n,t){const r=this;return i;function i(a){return e.enter("labelImage"),e.enter("labelImageMarker"),e.consume(a),e.exit("labelImageMarker"),o}function o(a){return a===91?(e.enter("labelMarker"),e.consume(a),e.exit("labelMarker"),e.exit("labelImage"),s):t(a)}function s(a){return a===94&&"_hiddenFootnoteSupport"in r.parser.constructs?t(a):n(a)}}const __={name:"labelStartLink",resolveAll:Kc.resolveAll,tokenize:C_};function C_(e,n,t){const r=this;return i;function i(s){return e.enter("labelLink"),e.enter("labelMarker"),e.consume(s),e.exit("labelMarker"),e.exit("labelLink"),o}function o(s){return s===94&&"_hiddenFootnoteSupport"in r.parser.constructs?t(s):n(s)}}const Ea={name:"lineEnding",tokenize:T_};function T_(e,n){return t;function t(r){return e.enter("lineEnding"),e.consume(r),e.exit("lineEnding"),he(e,n,"linePrefix")}}const Fo={name:"thematicBreak",tokenize:R_};function R_(e,n,t){let r=0,i;return o;function o(c){return e.enter("thematicBreak"),s(c)}function s(c){return i=c,a(c)}function a(c){return c===i?(e.enter("thematicBreakSequence"),l(c)):r>=3&&(c===null||Z(c))?(e.exit("thematicBreak"),n(c)):t(c)}function l(c){return c===i?(e.consume(c),r++,l):(e.exit("thematicBreakSequence"),le(c)?he(e,a,"whitespace")(c):a(c))}}const Ke={continuation:{tokenize:O_},exit:D_,name:"list",tokenize:A_},N_={partial:!0,tokenize:L_},I_={partial:!0,tokenize:M_};function A_(e,n,t){const r=this,i=r.events[r.events.length-1];let o=i&&i[1].type==="linePrefix"?i[2].sliceSerialize(i[1],!0).length:0,s=0;return a;function a(h){const v=r.containerState.type||(h===42||h===43||h===45?"listUnordered":"listOrdered");if(v==="listUnordered"?!r.containerState.marker||h===r.containerState.marker:Bl(h)){if(r.containerState.type||(r.containerState.type=v,e.enter(v,{_container:!0})),v==="listUnordered")return e.enter("listItemPrefix"),h===42||h===45?e.check(Fo,t,c)(h):c(h);if(!r.interrupt||h===49)return e.enter("listItemPrefix"),e.enter("listItemValue"),l(h)}return t(h)}function l(h){return Bl(h)&&++s<10?(e.consume(h),l):(!r.interrupt||s<2)&&(r.containerState.marker?h===r.containerState.marker:h===41||h===46)?(e.exit("listItemValue"),c(h)):t(h)}function c(h){return e.enter("listItemMarker"),e.consume(h),e.exit("listItemMarker"),r.containerState.marker=r.containerState.marker||h,e.check(Bs,r.interrupt?t:u,e.attempt(N_,p,d))}function u(h){return r.containerState.initialBlankLine=!0,o++,p(h)}function d(h){return le(h)?(e.enter("listItemPrefixWhitespace"),e.consume(h),e.exit("listItemPrefixWhitespace"),p):t(h)}function p(h){return r.containerState.size=o+r.sliceSerialize(e.exit("listItemPrefix"),!0).length,n(h)}}function O_(e,n,t){const r=this;return r.containerState._closeFlow=void 0,e.check(Bs,i,o);function i(a){return r.containerState.furtherBlankLines=r.containerState.furtherBlankLines||r.containerState.initialBlankLine,he(e,n,"listItemIndent",r.containerState.size+1)(a)}function o(a){return r.containerState.furtherBlankLines||!le(a)?(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,s(a)):(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,e.attempt(I_,n,s)(a))}function s(a){return r.containerState._closeFlow=!0,r.interrupt=void 0,he(e,e.attempt(Ke,n,t),"linePrefix",r.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(a)}}function M_(e,n,t){const r=this;return he(e,i,"listItemIndent",r.containerState.size+1);function i(o){const s=r.events[r.events.length-1];return s&&s[1].type==="listItemIndent"&&s[2].sliceSerialize(s[1],!0).length===r.containerState.size?n(o):t(o)}}function D_(e){e.exit(this.containerState.type)}function L_(e,n,t){const r=this;return he(e,i,"listItemPrefixWhitespace",r.parser.constructs.disable.null.includes("codeIndented")?void 0:5);function i(o){const s=r.events[r.events.length-1];return!le(o)&&s&&s[1].type==="listItemPrefixWhitespace"?n(o):t(o)}}const qd={name:"setextUnderline",resolveTo:P_,tokenize:B_};function P_(e,n){let t=e.length,r,i,o;for(;t--;)if(e[t][0]==="enter"){if(e[t][1].type==="content"){r=t;break}e[t][1].type==="paragraph"&&(i=t)}else e[t][1].type==="content"&&e.splice(t,1),!o&&e[t][1].type==="definition"&&(o=t);const s={type:"setextHeading",start:{...e[r][1].start},end:{...e[e.length-1][1].end}};return e[i][1].type="setextHeadingText",o?(e.splice(i,0,["enter",s,n]),e.splice(o+1,0,["exit",e[r][1],n]),e[r][1].end={...e[o][1].end}):e[r][1]=s,e.push(["exit",s,n]),e}function B_(e,n,t){const r=this;let i;return o;function o(c){let u=r.events.length,d;for(;u--;)if(r.events[u][1].type!=="lineEnding"&&r.events[u][1].type!=="linePrefix"&&r.events[u][1].type!=="content"){d=r.events[u][1].type==="paragraph";break}return!r.parser.lazy[r.now().line]&&(r.interrupt||d)?(e.enter("setextHeadingLine"),i=c,s(c)):t(c)}function s(c){return e.enter("setextHeadingLineSequence"),a(c)}function a(c){return c===i?(e.consume(c),a):(e.exit("setextHeadingLineSequence"),le(c)?he(e,l,"lineSuffix")(c):l(c))}function l(c){return c===null||Z(c)?(e.exit("setextHeadingLine"),n(c)):t(c)}}const j_={tokenize:F_};function F_(e){const n=this,t=e.attempt(Bs,r,e.attempt(this.parser.constructs.flowInitial,i,he(e,e.attempt(this.parser.constructs.flow,i,e.attempt(GE,i)),"linePrefix")));return t;function r(o){if(o===null){e.consume(o);return}return e.enter("lineEndingBlank"),e.consume(o),e.exit("lineEndingBlank"),n.currentConstruct=void 0,t}function i(o){if(o===null){e.consume(o);return}return e.enter("lineEnding"),e.consume(o),e.exit("lineEnding"),n.currentConstruct=void 0,t}}const z_={resolveAll:Hg()},U_=$g("string"),$_=$g("text");function $g(e){return{resolveAll:Hg(e==="text"?H_:void 0),tokenize:n};function n(t){const r=this,i=this.parser.constructs[e],o=t.attempt(i,s,a);return s;function s(u){return c(u)?o(u):a(u)}function a(u){if(u===null){t.consume(u);return}return t.enter("data"),t.consume(u),l}function l(u){return c(u)?(t.exit("data"),o(u)):(t.consume(u),l)}function c(u){if(u===null)return!0;const d=i[u];let p=-1;if(d)for(;++p<d.length;){const h=d[p];if(!h.previous||h.previous.call(r,r.previous))return!0}return!1}}}function Hg(e){return n;function n(t,r){let i=-1,o;for(;++i<=t.length;)o===void 0?t[i]&&t[i][1].type==="data"&&(o=i,i++):(!t[i]||t[i][1].type!=="data")&&(i!==o+2&&(t[o][1].end=t[i-1][1].end,t.splice(o+2,i-o-2),i=o+2),o=void 0);return e?e(t,r):t}}function H_(e,n){let t=0;for(;++t<=e.length;)if((t===e.length||e[t][1].type==="lineEnding")&&e[t-1][1].type==="data"){const r=e[t-1][1],i=n.sliceStream(r);let o=i.length,s=-1,a=0,l;for(;o--;){const c=i[o];if(typeof c=="string"){for(s=c.length;c.charCodeAt(s-1)===32;)a++,s--;if(s)break;s=-1}else if(c===-2)l=!0,a++;else if(c!==-1){o++;break}}if(n._contentTypeTextTrailing&&t===e.length&&(a=0),a){const c={type:t===e.length||l||a<2?"lineSuffix":"hardBreakTrailing",start:{_bufferIndex:o?s:r.start._bufferIndex+s,_index:r.start._index+o,line:r.end.line,column:r.end.column-a,offset:r.end.offset-a},end:{...r.end}};r.end={...c.start},r.start.offset===r.end.offset?Object.assign(r,c):(e.splice(t,0,["enter",c,n],["exit",c,n]),t+=2)}t++}return e}const G_={42:Ke,43:Ke,45:Ke,48:Ke,49:Ke,50:Ke,51:Ke,52:Ke,53:Ke,54:Ke,55:Ke,56:Ke,57:Ke,62:Lg},W_={91:YE},K_={[-2]:ka,[-1]:ka,32:ka},V_={35:n_,42:Fo,45:[qd,Fo],60:o_,61:qd,95:Fo,96:Kd,126:Kd},q_={38:Bg,92:Pg},Y_={[-5]:Ea,[-4]:Ea,[-3]:Ea,33:k_,38:Bg,42:jl,60:[_E,p_],91:__,92:[JE,Pg],93:Kc,95:jl,96:jE},Q_={null:[jl,z_]},X_={null:[42,95]},Z_={null:[]},J_=Object.freeze(Object.defineProperty({__proto__:null,attentionMarkers:X_,contentInitial:W_,disable:Z_,document:G_,flow:V_,flowInitial:K_,insideSpan:Q_,string:q_,text:Y_},Symbol.toStringTag,{value:"Module"}));function e1(e,n,t){let r={_bufferIndex:-1,_index:0,line:t&&t.line||1,column:t&&t.column||1,offset:t&&t.offset||0};const i={},o=[];let s=[],a=[];const l={attempt:I(N),check:I(k),consume:m,enter:y,exit:_,interrupt:I(k,{interrupt:!0})},c={code:null,containerState:{},defineSkip:w,events:[],now:v,parser:e,previous:null,sliceSerialize:p,sliceStream:h,write:d};let u=n.tokenize.call(c,l);return n.resolveAll&&o.push(n),c;function d(H){return s=bn(s,H),S(),s[s.length-1]!==null?[]:(D(n,0),c.events=Wc(o,c.events,c),c.events)}function p(H,G){return t1(h(H),G)}function h(H){return n1(s,H)}function v(){const{_bufferIndex:H,_index:G,line:J,column:Q,offset:q}=r;return{_bufferIndex:H,_index:G,line:J,column:Q,offset:q}}function w(H){i[H.line]=H.column,U()}function S(){let H;for(;r._index<s.length;){const G=s[r._index];if(typeof G=="string")for(H=r._index,r._bufferIndex<0&&(r._bufferIndex=0);r._index===H&&r._bufferIndex<G.length;)g(G.charCodeAt(r._bufferIndex));else g(G)}}function g(H){u=u(H)}function m(H){Z(H)?(r.line++,r.column=1,r.offset+=H===-3?2:1,U()):H!==-1&&(r.column++,r.offset++),r._bufferIndex<0?r._index++:(r._bufferIndex++,r._bufferIndex===s[r._index].length&&(r._bufferIndex=-1,r._index++)),c.previous=H}function y(H,G){const J=G||{};return J.type=H,J.start=v(),c.events.push(["enter",J,c]),a.push(J),J}function _(H){const G=a.pop();return G.end=v(),c.events.push(["exit",G,c]),G}function N(H,G){D(H,G.from)}function k(H,G){G.restore()}function I(H,G){return J;function J(Q,q,C){let O,R,M,b;return Array.isArray(Q)?W(Q):"tokenize"in Q?W([Q]):$(Q);function $(ie){return Te;function Te(Ie){const pn=Ie!==null&&ie[Ie],fn=Ie!==null&&ie.null,On=[...Array.isArray(pn)?pn:pn?[pn]:[],...Array.isArray(fn)?fn:fn?[fn]:[]];return W(On)(Ie)}}function W(ie){return O=ie,R=0,ie.length===0?C:E(ie[R])}function E(ie){return Te;function Te(Ie){return b=z(),M=ie,ie.partial||(c.currentConstruct=ie),ie.name&&c.parser.constructs.disable.null.includes(ie.name)?te():ie.tokenize.call(G?Object.assign(Object.create(c),G):c,l,X,te)(Ie)}}function X(ie){return H(M,b),q}function te(ie){return b.restore(),++R<O.length?E(O[R]):C}}}function D(H,G){H.resolveAll&&!o.includes(H)&&o.push(H),H.resolve&&$n(c.events,G,c.events.length-G,H.resolve(c.events.slice(G),c)),H.resolveTo&&(c.events=H.resolveTo(c.events,c))}function z(){const H=v(),G=c.previous,J=c.currentConstruct,Q=c.events.length,q=Array.from(a);return{from:Q,restore:C};function C(){r=H,c.previous=G,c.currentConstruct=J,c.events.length=Q,a=q,U()}}function U(){r.line in i&&r.column<2&&(r.column=i[r.line],r.offset+=i[r.line]-1)}}function n1(e,n){const t=n.start._index,r=n.start._bufferIndex,i=n.end._index,o=n.end._bufferIndex;let s;if(t===i)s=[e[t].slice(r,o)];else{if(s=e.slice(t,i),r>-1){const a=s[0];typeof a=="string"?s[0]=a.slice(r):s.shift()}o>0&&s.push(e[i].slice(0,o))}return s}function t1(e,n){let t=-1;const r=[];let i;for(;++t<e.length;){const o=e[t];let s;if(typeof o=="string")s=o;else switch(o){case-5:{s="\r";break}case-4:{s=`
`;break}case-3:{s=`\r
`;break}case-2:{s=n?" ":"	";break}case-1:{if(!n&&i)continue;s=" ";break}default:s=String.fromCharCode(o)}i=o===-2,r.push(s)}return r.join("")}function r1(e){const r={constructs:uE([J_,...(e||{}).extensions||[]]),content:i(bE),defined:[],document:i(wE),flow:i(j_),lazy:{},string:i(U_),text:i($_)};return r;function i(o){return s;function s(a){return e1(r,o,a)}}}function i1(e){for(;!jg(e););return e}const Yd=/[\0\t\n\r]/g;function o1(){let e=1,n="",t=!0,r;return i;function i(o,s,a){const l=[];let c,u,d,p,h;for(o=n+(typeof o=="string"?o.toString():new TextDecoder(s||void 0).decode(o)),d=0,n="",t&&(o.charCodeAt(0)===65279&&d++,t=void 0);d<o.length;){if(Yd.lastIndex=d,c=Yd.exec(o),p=c&&c.index!==void 0?c.index:o.length,h=o.charCodeAt(p),!c){n=o.slice(d);break}if(h===10&&d===p&&r)l.push(-3),r=void 0;else switch(r&&(l.push(-5),r=void 0),d<p&&(l.push(o.slice(d,p)),e+=p-d),h){case 0:{l.push(65533),e++;break}case 9:{for(u=Math.ceil(e/4)*4,l.push(-2);e++<u;)l.push(-1);break}case 10:{l.push(-4),e=1;break}default:r=!0,e=1}d=p+1}return a&&(r&&l.push(-5),n&&l.push(n),l.push(null)),l}}const s1=/\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;function a1(e){return e.replace(s1,l1)}function l1(e,n,t){if(n)return n;if(t.charCodeAt(0)===35){const i=t.charCodeAt(1),o=i===120||i===88;return Dg(t.slice(o?2:1),o?16:10)}return Gc(t)||e}const Gg={}.hasOwnProperty;function c1(e,n,t){return n&&typeof n=="object"&&(t=n,n=void 0),u1(t)(i1(r1(t).document().write(o1()(e,n,!0))))}function u1(e){const n={transforms:[],canContainEols:["emphasis","fragment","heading","paragraph","strong"],enter:{autolink:o(Mn),autolinkProtocol:z,autolinkEmail:z,atxHeading:o(pe),blockQuote:o(fn),characterEscape:z,characterReference:z,codeFenced:o(On),codeFencedFenceInfo:s,codeFencedFenceMeta:s,codeIndented:o(On,s),codeText:o(It,s),codeTextData:z,data:z,codeFlowValue:z,definition:o(en),definitionDestinationString:s,definitionLabelString:s,definitionTitleString:s,emphasis:o(Hn),hardBreakEscape:o(oe),hardBreakTrailing:o(oe),htmlFlow:o(ze,s),htmlFlowData:z,htmlText:o(ze,s),htmlTextData:z,image:o(P),label:s,link:o(Mn),listItem:o(Y),listItemValue:p,listOrdered:o(ne,d),listUnordered:o(ne),paragraph:o(kn),reference:E,referenceString:s,resourceDestinationString:s,resourceTitleString:s,setextHeading:o(pe),strong:o(Ae),thematicBreak:o(Wn)},exit:{atxHeading:l(),atxHeadingSequence:N,autolink:l(),autolinkEmail:pn,autolinkProtocol:Ie,blockQuote:l(),characterEscapeValue:U,characterReferenceMarkerHexadecimal:te,characterReferenceMarkerNumeric:te,characterReferenceValue:ie,characterReference:Te,codeFenced:l(S),codeFencedFence:w,codeFencedFenceInfo:h,codeFencedFenceMeta:v,codeFlowValue:U,codeIndented:l(g),codeText:l(q),codeTextData:U,data:U,definition:l(),definitionDestinationString:_,definitionLabelString:m,definitionTitleString:y,emphasis:l(),hardBreakEscape:l(G),hardBreakTrailing:l(G),htmlFlow:l(J),htmlFlowData:U,htmlText:l(Q),htmlTextData:U,image:l(O),label:M,labelText:R,lineEnding:H,link:l(C),listItem:l(),listOrdered:l(),listUnordered:l(),paragraph:l(),referenceString:X,resourceDestinationString:b,resourceTitleString:$,resource:W,setextHeading:l(D),setextHeadingLineSequence:I,setextHeadingText:k,strong:l(),thematicBreak:l()}};Wg(n,(e||{}).mdastExtensions||[]);const t={};return r;function r(x){let T={type:"root",children:[]};const L={stack:[T],tokenStack:[],config:n,enter:a,exit:c,buffer:s,resume:u,data:t},B=[];let V=-1;for(;++V<x.length;)if(x[V][1].type==="listOrdered"||x[V][1].type==="listUnordered")if(x[V][0]==="enter")B.push(V);else{const ae=B.pop();V=i(x,ae,V)}for(V=-1;++V<x.length;){const ae=n[x[V][0]];Gg.call(ae,x[V][1].type)&&ae[x[V][1].type].call(Object.assign({sliceSerialize:x[V][2].sliceSerialize},L),x[V][1])}if(L.tokenStack.length>0){const ae=L.tokenStack[L.tokenStack.length-1];(ae[1]||Qd).call(L,void 0,ae[0])}for(T.position={start:at(x.length>0?x[0][1].start:{line:1,column:1,offset:0}),end:at(x.length>0?x[x.length-2][1].end:{line:1,column:1,offset:0})},V=-1;++V<n.transforms.length;)T=n.transforms[V](T)||T;return T}function i(x,T,L){let B=T-1,V=-1,ae=!1,En,nn,Hr,Gr;for(;++B<=L;){const tn=x[B];switch(tn[1].type){case"listUnordered":case"listOrdered":case"blockQuote":{tn[0]==="enter"?V++:V--,Gr=void 0;break}case"lineEndingBlank":{tn[0]==="enter"&&(En&&!Gr&&!V&&!Hr&&(Hr=B),Gr=void 0);break}case"linePrefix":case"listItemValue":case"listItemMarker":case"listItemPrefix":case"listItemPrefixWhitespace":break;default:Gr=void 0}if(!V&&tn[0]==="enter"&&tn[1].type==="listItemPrefix"||V===-1&&tn[0]==="exit"&&(tn[1].type==="listUnordered"||tn[1].type==="listOrdered")){if(En){let nr=B;for(nn=void 0;nr--;){const Kn=x[nr];if(Kn[1].type==="lineEnding"||Kn[1].type==="lineEndingBlank"){if(Kn[0]==="exit")continue;nn&&(x[nn][1].type="lineEndingBlank",ae=!0),Kn[1].type="lineEnding",nn=nr}else if(!(Kn[1].type==="linePrefix"||Kn[1].type==="blockQuotePrefix"||Kn[1].type==="blockQuotePrefixWhitespace"||Kn[1].type==="blockQuoteMarker"||Kn[1].type==="listItemIndent"))break}Hr&&(!nn||Hr<nn)&&(En._spread=!0),En.end=Object.assign({},nn?x[nn][1].start:tn[1].end),x.splice(nn||B,0,["exit",En,tn[2]]),B++,L++}if(tn[1].type==="listItemPrefix"){const nr={type:"listItem",_spread:!1,start:Object.assign({},tn[1].start),end:void 0};En=nr,x.splice(B,0,["enter",nr,tn[2]]),B++,L++,Hr=void 0,Gr=!0}}}return x[T][1]._spread=ae,L}function o(x,T){return L;function L(B){a.call(this,x(B),B),T&&T.call(this,B)}}function s(){this.stack.push({type:"fragment",children:[]})}function a(x,T,L){this.stack[this.stack.length-1].children.push(x),this.stack.push(x),this.tokenStack.push([T,L||void 0]),x.position={start:at(T.start),end:void 0}}function l(x){return T;function T(L){x&&x.call(this,L),c.call(this,L)}}function c(x,T){const L=this.stack.pop(),B=this.tokenStack.pop();if(B)B[0].type!==x.type&&(T?T.call(this,x,B[0]):(B[1]||Qd).call(this,x,B[0]));else throw new Error("Cannot close `"+x.type+"` ("+yi({start:x.start,end:x.end})+"): it’s not open");L.position.end=at(x.end)}function u(){return lE(this.stack.pop())}function d(){this.data.expectingFirstListItemValue=!0}function p(x){if(this.data.expectingFirstListItemValue){const T=this.stack[this.stack.length-2];T.start=Number.parseInt(this.sliceSerialize(x),10),this.data.expectingFirstListItemValue=void 0}}function h(){const x=this.resume(),T=this.stack[this.stack.length-1];T.lang=x}function v(){const x=this.resume(),T=this.stack[this.stack.length-1];T.meta=x}function w(){this.data.flowCodeInside||(this.buffer(),this.data.flowCodeInside=!0)}function S(){const x=this.resume(),T=this.stack[this.stack.length-1];T.value=x.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g,""),this.data.flowCodeInside=void 0}function g(){const x=this.resume(),T=this.stack[this.stack.length-1];T.value=x.replace(/(\r?\n|\r)$/g,"")}function m(x){const T=this.resume(),L=this.stack[this.stack.length-1];L.label=T,L.identifier=Tr(this.sliceSerialize(x)).toLowerCase()}function y(){const x=this.resume(),T=this.stack[this.stack.length-1];T.title=x}function _(){const x=this.resume(),T=this.stack[this.stack.length-1];T.url=x}function N(x){const T=this.stack[this.stack.length-1];if(!T.depth){const L=this.sliceSerialize(x).length;T.depth=L}}function k(){this.data.setextHeadingSlurpLineEnding=!0}function I(x){const T=this.stack[this.stack.length-1];T.depth=this.sliceSerialize(x).codePointAt(0)===61?1:2}function D(){this.data.setextHeadingSlurpLineEnding=void 0}function z(x){const L=this.stack[this.stack.length-1].children;let B=L[L.length-1];(!B||B.type!=="text")&&(B=Gn(),B.position={start:at(x.start),end:void 0},L.push(B)),this.stack.push(B)}function U(x){const T=this.stack.pop();T.value+=this.sliceSerialize(x),T.position.end=at(x.end)}function H(x){const T=this.stack[this.stack.length-1];if(this.data.atHardBreak){const L=T.children[T.children.length-1];L.position.end=at(x.end),this.data.atHardBreak=void 0;return}!this.data.setextHeadingSlurpLineEnding&&n.canContainEols.includes(T.type)&&(z.call(this,x),U.call(this,x))}function G(){this.data.atHardBreak=!0}function J(){const x=this.resume(),T=this.stack[this.stack.length-1];T.value=x}function Q(){const x=this.resume(),T=this.stack[this.stack.length-1];T.value=x}function q(){const x=this.resume(),T=this.stack[this.stack.length-1];T.value=x}function C(){const x=this.stack[this.stack.length-1];if(this.data.inReference){const T=this.data.referenceType||"shortcut";x.type+="Reference",x.referenceType=T,delete x.url,delete x.title}else delete x.identifier,delete x.label;this.data.referenceType=void 0}function O(){const x=this.stack[this.stack.length-1];if(this.data.inReference){const T=this.data.referenceType||"shortcut";x.type+="Reference",x.referenceType=T,delete x.url,delete x.title}else delete x.identifier,delete x.label;this.data.referenceType=void 0}function R(x){const T=this.sliceSerialize(x),L=this.stack[this.stack.length-2];L.label=a1(T),L.identifier=Tr(T).toLowerCase()}function M(){const x=this.stack[this.stack.length-1],T=this.resume(),L=this.stack[this.stack.length-1];if(this.data.inReference=!0,L.type==="link"){const B=x.children;L.children=B}else L.alt=T}function b(){const x=this.resume(),T=this.stack[this.stack.length-1];T.url=x}function $(){const x=this.resume(),T=this.stack[this.stack.length-1];T.title=x}function W(){this.data.inReference=void 0}function E(){this.data.referenceType="collapsed"}function X(x){const T=this.resume(),L=this.stack[this.stack.length-1];L.label=T,L.identifier=Tr(this.sliceSerialize(x)).toLowerCase(),this.data.referenceType="full"}function te(x){this.data.characterReferenceType=x.type}function ie(x){const T=this.sliceSerialize(x),L=this.data.characterReferenceType;let B;L?(B=Dg(T,L==="characterReferenceMarkerNumeric"?10:16),this.data.characterReferenceType=void 0):B=Gc(T);const V=this.stack[this.stack.length-1];V.value+=B}function Te(x){const T=this.stack.pop();T.position.end=at(x.end)}function Ie(x){U.call(this,x);const T=this.stack[this.stack.length-1];T.url=this.sliceSerialize(x)}function pn(x){U.call(this,x);const T=this.stack[this.stack.length-1];T.url="mailto:"+this.sliceSerialize(x)}function fn(){return{type:"blockquote",children:[]}}function On(){return{type:"code",lang:null,meta:null,value:""}}function It(){return{type:"inlineCode",value:""}}function en(){return{type:"definition",identifier:"",label:null,title:null,url:""}}function Hn(){return{type:"emphasis",children:[]}}function pe(){return{type:"heading",depth:0,children:[]}}function oe(){return{type:"break"}}function ze(){return{type:"html",value:""}}function P(){return{type:"image",title:null,url:"",alt:null}}function Mn(){return{type:"link",title:null,url:"",children:[]}}function ne(x){return{type:"list",ordered:x.type==="listOrdered",start:null,spread:x._spread,children:[]}}function Y(x){return{type:"listItem",spread:x._spread,checked:null,children:[]}}function kn(){return{type:"paragraph",children:[]}}function Ae(){return{type:"strong",children:[]}}function Gn(){return{type:"text",value:""}}function Wn(){return{type:"thematicBreak"}}}function at(e){return{line:e.line,column:e.column,offset:e.offset}}function Wg(e,n){let t=-1;for(;++t<n.length;){const r=n[t];Array.isArray(r)?Wg(e,r):d1(e,r)}}function d1(e,n){let t;for(t in n)if(Gg.call(n,t))switch(t){case"canContainEols":{const r=n[t];r&&e[t].push(...r);break}case"transforms":{const r=n[t];r&&e[t].push(...r);break}case"enter":case"exit":{const r=n[t];r&&Object.assign(e[t],r);break}}}function Qd(e,n){throw e?new Error("Cannot close `"+e.type+"` ("+yi({start:e.start,end:e.end})+"): a different token (`"+n.type+"`, "+yi({start:n.start,end:n.end})+") is open"):new Error("Cannot close document, a token (`"+n.type+"`, "+yi({start:n.start,end:n.end})+") is still open")}function p1(e){const n=this;n.parser=t;function t(r){return c1(r,{...n.data("settings"),...e,extensions:n.data("micromarkExtensions")||[],mdastExtensions:n.data("fromMarkdownExtensions")||[]})}}function f1(e,n){const t={type:"element",tagName:"blockquote",properties:{},children:e.wrap(e.all(n),!0)};return e.patch(n,t),e.applyData(n,t)}function h1(e,n){const t={type:"element",tagName:"br",properties:{},children:[]};return e.patch(n,t),[e.applyData(n,t),{type:"text",value:`
`}]}function g1(e,n){const t=n.value?n.value+`
`:"",r={},i=n.lang?n.lang.split(/\s+/):[];i.length>0&&(r.className=["language-"+i[0]]);let o={type:"element",tagName:"code",properties:r,children:[{type:"text",value:t}]};return n.meta&&(o.data={meta:n.meta}),e.patch(n,o),o=e.applyData(n,o),o={type:"element",tagName:"pre",properties:{},children:[o]},e.patch(n,o),o}function m1(e,n){const t={type:"element",tagName:"del",properties:{},children:e.all(n)};return e.patch(n,t),e.applyData(n,t)}function y1(e,n){const t={type:"element",tagName:"em",properties:{},children:e.all(n)};return e.patch(n,t),e.applyData(n,t)}function b1(e,n){const t=typeof e.options.clobberPrefix=="string"?e.options.clobberPrefix:"user-content-",r=String(n.identifier).toUpperCase(),i=$r(r.toLowerCase()),o=e.footnoteOrder.indexOf(r);let s,a=e.footnoteCounts.get(r);a===void 0?(a=0,e.footnoteOrder.push(r),s=e.footnoteOrder.length):s=o+1,a+=1,e.footnoteCounts.set(r,a);const l={type:"element",tagName:"a",properties:{href:"#"+t+"fn-"+i,id:t+"fnref-"+i+(a>1?"-"+a:""),dataFootnoteRef:!0,ariaDescribedBy:["footnote-label"]},children:[{type:"text",value:String(s)}]};e.patch(n,l);const c={type:"element",tagName:"sup",properties:{},children:[l]};return e.patch(n,c),e.applyData(n,c)}function v1(e,n){const t={type:"element",tagName:"h"+n.depth,properties:{},children:e.all(n)};return e.patch(n,t),e.applyData(n,t)}function w1(e,n){if(e.options.allowDangerousHtml){const t={type:"raw",value:n.value};return e.patch(n,t),e.applyData(n,t)}}function Kg(e,n){const t=n.referenceType;let r="]";if(t==="collapsed"?r+="[]":t==="full"&&(r+="["+(n.label||n.identifier)+"]"),n.type==="imageReference")return[{type:"text",value:"!["+n.alt+r}];const i=e.all(n),o=i[0];o&&o.type==="text"?o.value="["+o.value:i.unshift({type:"text",value:"["});const s=i[i.length-1];return s&&s.type==="text"?s.value+=r:i.push({type:"text",value:r}),i}function x1(e,n){const t=String(n.identifier).toUpperCase(),r=e.definitionById.get(t);if(!r)return Kg(e,n);const i={src:$r(r.url||""),alt:n.alt};r.title!==null&&r.title!==void 0&&(i.title=r.title);const o={type:"element",tagName:"img",properties:i,children:[]};return e.patch(n,o),e.applyData(n,o)}function S1(e,n){const t={src:$r(n.url)};n.alt!==null&&n.alt!==void 0&&(t.alt=n.alt),n.title!==null&&n.title!==void 0&&(t.title=n.title);const r={type:"element",tagName:"img",properties:t,children:[]};return e.patch(n,r),e.applyData(n,r)}function k1(e,n){const t={type:"text",value:n.value.replace(/\r?\n|\r/g," ")};e.patch(n,t);const r={type:"element",tagName:"code",properties:{},children:[t]};return e.patch(n,r),e.applyData(n,r)}function E1(e,n){const t=String(n.identifier).toUpperCase(),r=e.definitionById.get(t);if(!r)return Kg(e,n);const i={href:$r(r.url||"")};r.title!==null&&r.title!==void 0&&(i.title=r.title);const o={type:"element",tagName:"a",properties:i,children:e.all(n)};return e.patch(n,o),e.applyData(n,o)}function _1(e,n){const t={href:$r(n.url)};n.title!==null&&n.title!==void 0&&(t.title=n.title);const r={type:"element",tagName:"a",properties:t,children:e.all(n)};return e.patch(n,r),e.applyData(n,r)}function C1(e,n,t){const r=e.all(n),i=t?T1(t):Vg(n),o={},s=[];if(typeof n.checked=="boolean"){const u=r[0];let d;u&&u.type==="element"&&u.tagName==="p"?d=u:(d={type:"element",tagName:"p",properties:{},children:[]},r.unshift(d)),d.children.length>0&&d.children.unshift({type:"text",value:" "}),d.children.unshift({type:"element",tagName:"input",properties:{type:"checkbox",checked:n.checked,disabled:!0},children:[]}),o.className=["task-list-item"]}let a=-1;for(;++a<r.length;){const u=r[a];(i||a!==0||u.type!=="element"||u.tagName!=="p")&&s.push({type:"text",value:`
`}),u.type==="element"&&u.tagName==="p"&&!i?s.push(...u.children):s.push(u)}const l=r[r.length-1];l&&(i||l.type!=="element"||l.tagName!=="p")&&s.push({type:"text",value:`
`});const c={type:"element",tagName:"li",properties:o,children:s};return e.patch(n,c),e.applyData(n,c)}function T1(e){let n=!1;if(e.type==="list"){n=e.spread||!1;const t=e.children;let r=-1;for(;!n&&++r<t.length;)n=Vg(t[r])}return n}function Vg(e){const n=e.spread;return n??e.children.length>1}function R1(e,n){const t={},r=e.all(n);let i=-1;for(typeof n.start=="number"&&n.start!==1&&(t.start=n.start);++i<r.length;){const s=r[i];if(s.type==="element"&&s.tagName==="li"&&s.properties&&Array.isArray(s.properties.className)&&s.properties.className.includes("task-list-item")){t.className=["contains-task-list"];break}}const o={type:"element",tagName:n.ordered?"ol":"ul",properties:t,children:e.wrap(r,!0)};return e.patch(n,o),e.applyData(n,o)}function N1(e,n){const t={type:"element",tagName:"p",properties:{},children:e.all(n)};return e.patch(n,t),e.applyData(n,t)}function I1(e,n){const t={type:"root",children:e.wrap(e.all(n))};return e.patch(n,t),e.applyData(n,t)}function A1(e,n){const t={type:"element",tagName:"strong",properties:{},children:e.all(n)};return e.patch(n,t),e.applyData(n,t)}function O1(e,n){const t=e.all(n),r=t.shift(),i=[];if(r){const s={type:"element",tagName:"thead",properties:{},children:e.wrap([r],!0)};e.patch(n.children[0],s),i.push(s)}if(t.length>0){const s={type:"element",tagName:"tbody",properties:{},children:e.wrap(t,!0)},a=zc(n.children[1]),l=Tg(n.children[n.children.length-1]);a&&l&&(s.position={start:a,end:l}),i.push(s)}const o={type:"element",tagName:"table",properties:{},children:e.wrap(i,!0)};return e.patch(n,o),e.applyData(n,o)}function M1(e,n,t){const r=t?t.children:void 0,o=(r?r.indexOf(n):1)===0?"th":"td",s=t&&t.type==="table"?t.align:void 0,a=s?s.length:n.children.length;let l=-1;const c=[];for(;++l<a;){const d=n.children[l],p={},h=s?s[l]:void 0;h&&(p.align=h);let v={type:"element",tagName:o,properties:p,children:[]};d&&(v.children=e.all(d),e.patch(d,v),v=e.applyData(d,v)),c.push(v)}const u={type:"element",tagName:"tr",properties:{},children:e.wrap(c,!0)};return e.patch(n,u),e.applyData(n,u)}function D1(e,n){const t={type:"element",tagName:"td",properties:{},children:e.all(n)};return e.patch(n,t),e.applyData(n,t)}const Xd=9,Zd=32;function L1(e){const n=String(e),t=/\r?\n|\r/g;let r=t.exec(n),i=0;const o=[];for(;r;)o.push(Jd(n.slice(i,r.index),i>0,!0),r[0]),i=r.index+r[0].length,r=t.exec(n);return o.push(Jd(n.slice(i),i>0,!1)),o.join("")}function Jd(e,n,t){let r=0,i=e.length;if(n){let o=e.codePointAt(r);for(;o===Xd||o===Zd;)r++,o=e.codePointAt(r)}if(t){let o=e.codePointAt(i-1);for(;o===Xd||o===Zd;)i--,o=e.codePointAt(i-1)}return i>r?e.slice(r,i):""}function P1(e,n){const t={type:"text",value:L1(String(n.value))};return e.patch(n,t),e.applyData(n,t)}function B1(e,n){const t={type:"element",tagName:"hr",properties:{},children:[]};return e.patch(n,t),e.applyData(n,t)}const j1={blockquote:f1,break:h1,code:g1,delete:m1,emphasis:y1,footnoteReference:b1,heading:v1,html:w1,imageReference:x1,image:S1,inlineCode:k1,linkReference:E1,link:_1,listItem:C1,list:R1,paragraph:N1,root:I1,strong:A1,table:O1,tableCell:D1,tableRow:M1,text:P1,thematicBreak:B1,toml:go,yaml:go,definition:go,footnoteDefinition:go};function go(){}const qg=-1,js=0,vi=1,hs=2,Vc=3,qc=4,Yc=5,Qc=6,Yg=7,Qg=8,{defineProperty:F1}=Object,Xg=typeof self=="object"?self:globalThis,ep=(e,n)=>{switch(e){case"Function":case"SharedWorker":case"Worker":case"eval":case"setInterval":case"setTimeout":throw new TypeError("unable to deserialize "+e)}return new Xg[e](n)},z1=(e,n)=>{const t=(i,o)=>(e.set(o,i),i),r=i=>{if(e.has(i))return e.get(i);const[o,s]=n[i];switch(o){case js:case qg:return t(s,i);case vi:{const a=t([],i);for(const l of s)a.push(r(l));return a}case hs:{const a=t({},i);for(const[l,c]of s){const u=r(l),d=r(c);u==="__proto__"?F1(a,u,{value:d,configurable:!0,enumerable:!0,writable:!0}):a[u]=d}return a}case Vc:return t(new Date(s),i);case qc:{const{source:a,flags:l}=s;return t(new RegExp(a,l),i)}case Yc:{const a=t(new Map,i);for(const[l,c]of s)a.set(r(l),r(c));return a}case Qc:{const a=t(new Set,i);for(const l of s)a.add(r(l));return a}case Yg:{const{name:a,message:l}=s;return t(typeof Xg[a]=="function"?ep(a,l):new Error(l),i)}case Qg:return t(BigInt(s),i);case"BigInt":return t(Object(BigInt(s)),i);case"ArrayBuffer":return t(new Uint8Array(s).buffer,s);case"DataView":{const{buffer:a}=new Uint8Array(s);return t(new DataView(a),s)}}return t(ep(o,s),i)};return r},np=e=>z1(new Map,e)(0),Dt="",{toString:U1}={},{keys:$1}=Object,ei=e=>{const n=typeof e;if(n!=="object"||!e)return[js,n];const t=U1.call(e).slice(8,-1);switch(t){case"Array":return[vi,Dt];case"Object":return[hs,Dt];case"Date":return[Vc,Dt];case"RegExp":return[qc,Dt];case"Map":return[Yc,Dt];case"Set":return[Qc,Dt];case"DataView":return[vi,t]}return t.includes("Array")?[vi,t]:e instanceof Error?[Yg,e.name||"Error"]:[hs,t]},mo=([e,n])=>e===js&&(n==="function"||n==="symbol"),H1=(e,n,t,r)=>{const i=(s,a)=>{const l=r.push(s)-1;return t.set(a,l),l},o=s=>{if(t.has(s))return t.get(s);let[a,l]=ei(s);switch(a){case js:{let u=s;switch(l){case"bigint":a=Qg,u=s.toString();break;case"function":case"symbol":if(e)throw new TypeError("unable to serialize "+l);u=null;break;case"undefined":return i([qg],s)}return i([a,u],s)}case vi:{if(l){let p=s;return l==="DataView"?p=new Uint8Array(s.buffer):l==="ArrayBuffer"&&(p=new Uint8Array(s)),i([l,[...p]],s)}const u=[],d=i([a,u],s);for(const p of s)u.push(o(p));return d}case hs:{if(l)switch(l){case"BigInt":return i([l,s.toString()],s);case"Boolean":case"Number":case"String":return i([l,s.valueOf()],s)}if(n&&"toJSON"in s)return o(s.toJSON());const u=[],d=i([a,u],s);for(const p of $1(s))(e||!mo(ei(s[p])))&&u.push([o(p),o(s[p])]);return d}case Vc:return i([a,isNaN(s.getTime())?Dt:s.toISOString()],s);case qc:{const{source:u,flags:d}=s;return i([a,{source:u,flags:d}],s)}case Yc:{const u=[],d=i([a,u],s);for(const[p,h]of s)(e||!(mo(ei(p))||mo(ei(h))))&&u.push([o(p),o(h)]);return d}case Qc:{const u=[],d=i([a,u],s);for(const p of s)(e||!mo(ei(p)))&&u.push(o(p));return d}}const{message:c}=s;return i([a,{name:l,message:c}],s)};return o},tp=(e,{json:n,lossy:t}={})=>{const r=[];return H1(!(n||t),!!n,new Map,r)(e),r},gs=typeof structuredClone=="function"?(e,n)=>n&&("json"in n||"lossy"in n)?np(tp(e,n)):structuredClone(e):(e,n)=>np(tp(e,n));function G1(e,n){const t=[{type:"text",value:"↩"}];return n>1&&t.push({type:"element",tagName:"sup",properties:{},children:[{type:"text",value:String(n)}]}),t}function W1(e,n){return"Back to reference "+(e+1)+(n>1?"-"+n:"")}function K1(e){const n=typeof e.options.clobberPrefix=="string"?e.options.clobberPrefix:"user-content-",t=e.options.footnoteBackContent||G1,r=e.options.footnoteBackLabel||W1,i=e.options.footnoteLabel||"Footnotes",o=e.options.footnoteLabelTagName||"h2",s=e.options.footnoteLabelProperties||{className:["sr-only"]},a=[];let l=-1;for(;++l<e.footnoteOrder.length;){const c=e.footnoteById.get(e.footnoteOrder[l]);if(!c)continue;const u=e.all(c),d=String(c.identifier).toUpperCase(),p=$r(d.toLowerCase());let h=0;const v=[],w=e.footnoteCounts.get(d);for(;w!==void 0&&++h<=w;){v.length>0&&v.push({type:"text",value:" "});let m=typeof t=="string"?t:t(l,h);typeof m=="string"&&(m={type:"text",value:m}),v.push({type:"element",tagName:"a",properties:{href:"#"+n+"fnref-"+p+(h>1?"-"+h:""),dataFootnoteBackref:"",ariaLabel:typeof r=="string"?r:r(l,h),className:["data-footnote-backref"]},children:Array.isArray(m)?m:[m]})}const S=u[u.length-1];if(S&&S.type==="element"&&S.tagName==="p"){const m=S.children[S.children.length-1];m&&m.type==="text"?m.value+=" ":S.children.push({type:"text",value:" "}),S.children.push(...v)}else u.push(...v);const g={type:"element",tagName:"li",properties:{id:n+"fn-"+p},children:e.wrap(u,!0)};e.patch(c,g),a.push(g)}if(a.length!==0)return{type:"element",tagName:"section",properties:{dataFootnotes:!0,className:["footnotes"]},children:[{type:"element",tagName:o,properties:{...gs(s),id:"footnote-label"},children:[{type:"text",value:i}]},{type:"text",value:`
`},{type:"element",tagName:"ol",properties:{},children:e.wrap(a,!0)},{type:"text",value:`
`}]}}const Xc=function(e){if(e==null)return Q1;if(typeof e=="function")return Fs(e);if(typeof e=="object")return Array.isArray(e)?V1(e):q1(e);if(typeof e=="string")return Y1(e);throw new Error("Expected function, string, or object as test")};function V1(e){const n=[];let t=-1;for(;++t<e.length;)n[t]=Xc(e[t]);return Fs(r);function r(...i){let o=-1;for(;++o<n.length;)if(n[o].apply(this,i))return!0;return!1}}function q1(e){const n=e;return Fs(t);function t(r){const i=r;let o;for(o in e)if(i[o]!==n[o])return!1;return!0}}function Y1(e){return Fs(n);function n(t){return t&&t.type===e}}function Fs(e){return n;function n(t,r,i){return!!(X1(t)&&e.call(this,t,typeof r=="number"?r:void 0,i||void 0))}}function Q1(){return!0}function X1(e){return e!==null&&typeof e=="object"&&"type"in e}const Zg=[],Z1=!0,rp=!1,J1="skip";function eC(e,n,t,r){let i;typeof n=="function"&&typeof t!="function"?(r=t,t=n):i=n;const o=Xc(i),s=r?-1:1;a(e,void 0,[])();function a(l,c,u){const d=l&&typeof l=="object"?l:{};if(typeof d.type=="string"){const h=typeof d.tagName=="string"?d.tagName:typeof d.name=="string"?d.name:void 0;Object.defineProperty(p,"name",{value:"node ("+(l.type+(h?"<"+h+">":""))+")"})}return p;function p(){let h=Zg,v,w,S;if((!n||o(l,c,u[u.length-1]||void 0))&&(h=nC(t(l,u)),h[0]===rp))return h;if("children"in l&&l.children){const g=l;if(g.children&&h[0]!==J1)for(w=(r?g.children.length:-1)+s,S=u.concat(g);w>-1&&w<g.children.length;){const m=g.children[w];if(v=a(m,w,S)(),v[0]===rp)return v;w=typeof v[1]=="number"?v[1]:w+s}}return h}}}function nC(e){return Array.isArray(e)?e:typeof e=="number"?[Z1,e]:e==null?Zg:[e]}function Zc(e,n,t,r){let i,o,s;typeof n=="function"&&typeof t!="function"?(o=void 0,s=n,i=t):(o=n,s=t,i=r),eC(e,o,a,i);function a(l,c){const u=c[c.length-1],d=u?u.children.indexOf(l):void 0;return s(l,d,u)}}const Fl={}.hasOwnProperty,tC={};function rC(e,n){const t=n||tC,r=new Map,i=new Map,o=new Map,s={...j1,...t.handlers},a={all:c,applyData:oC,definitionById:r,footnoteById:i,footnoteCounts:o,footnoteOrder:[],handlers:s,one:l,options:t,patch:iC,wrap:aC};return Zc(e,function(u){if(u.type==="definition"||u.type==="footnoteDefinition"){const d=u.type==="definition"?r:i,p=String(u.identifier).toUpperCase();d.has(p)||d.set(p,u)}}),a;function l(u,d){const p=u.type,h=a.handlers[p];if(Fl.call(a.handlers,p)&&h)return h(a,u,d);if(a.options.passThrough&&a.options.passThrough.includes(p)){if("children"in u){const{children:w,...S}=u,g=gs(S);return g.children=a.all(u),g}return gs(u)}return(a.options.unknownHandler||sC)(a,u,d)}function c(u){const d=[];if("children"in u){const p=u.children;let h=-1;for(;++h<p.length;){const v=a.one(p[h],u);if(v){if(h&&p[h-1].type==="break"&&(!Array.isArray(v)&&v.type==="text"&&(v.value=ip(v.value)),!Array.isArray(v)&&v.type==="element")){const w=v.children[0];w&&w.type==="text"&&(w.value=ip(w.value))}Array.isArray(v)?d.push(...v):d.push(v)}}}return d}}function iC(e,n){e.position&&(n.position=zk(e))}function oC(e,n){let t=n;if(e&&e.data){const r=e.data.hName,i=e.data.hChildren,o=e.data.hProperties;if(typeof r=="string")if(t.type==="element")t.tagName=r;else{const s="children"in t?t.children:[t];t={type:"element",tagName:r,properties:{},children:s}}t.type==="element"&&o&&Object.assign(t.properties,gs(o)),"children"in t&&t.children&&i!==null&&i!==void 0&&(t.children=i)}return t}function sC(e,n){const t=n.data||{},r="value"in n&&!(Fl.call(t,"hProperties")||Fl.call(t,"hChildren"))?{type:"text",value:n.value}:{type:"element",tagName:"div",properties:{},children:e.all(n)};return e.patch(n,r),e.applyData(n,r)}function aC(e,n){const t=[];let r=-1;for(n&&t.push({type:"text",value:`
`});++r<e.length;)r&&t.push({type:"text",value:`
`}),t.push(e[r]);return n&&e.length>0&&t.push({type:"text",value:`
`}),t}function ip(e){let n=0,t=e.charCodeAt(n);for(;t===9||t===32;)n++,t=e.charCodeAt(n);return e.slice(n)}function op(e,n){const t=rC(e,n),r=t.one(e,void 0),i=K1(t),o=Array.isArray(r)?{type:"root",children:r}:r||{type:"root",children:[]};return i&&o.children.push({type:"text",value:`
`},i),o}function lC(e,n){return e&&"run"in e?async function(t,r){const i=op(t,{file:r,...n});await e.run(i,r)}:function(t,r){return op(t,{file:r,...e||n})}}function sp(e){if(e)throw e}var zo=Object.prototype.hasOwnProperty,Jg=Object.prototype.toString,ap=Object.defineProperty,lp=Object.getOwnPropertyDescriptor,cp=function(n){return typeof Array.isArray=="function"?Array.isArray(n):Jg.call(n)==="[object Array]"},up=function(n){if(!n||Jg.call(n)!=="[object Object]")return!1;var t=zo.call(n,"constructor"),r=n.constructor&&n.constructor.prototype&&zo.call(n.constructor.prototype,"isPrototypeOf");if(n.constructor&&!t&&!r)return!1;var i;for(i in n);return typeof i>"u"||zo.call(n,i)},dp=function(n,t){ap&&t.name==="__proto__"?ap(n,t.name,{enumerable:!0,configurable:!0,value:t.newValue,writable:!0}):n[t.name]=t.newValue},pp=function(n,t){if(t==="__proto__")if(zo.call(n,t)){if(lp)return lp(n,t).value}else return;return n[t]},cC=function e(){var n,t,r,i,o,s,a=arguments[0],l=1,c=arguments.length,u=!1;for(typeof a=="boolean"&&(u=a,a=arguments[1]||{},l=2),(a==null||typeof a!="object"&&typeof a!="function")&&(a={});l<c;++l)if(n=arguments[l],n!=null)for(t in n)r=pp(a,t),i=pp(n,t),a!==i&&(u&&i&&(up(i)||(o=cp(i)))?(o?(o=!1,s=r&&cp(r)?r:[]):s=r&&up(r)?r:{},dp(a,{name:t,newValue:e(u,s,i)})):typeof i<"u"&&dp(a,{name:t,newValue:i}));return a};const _a=Br(cC);function zl(e){if(typeof e!="object"||e===null)return!1;const n=Object.getPrototypeOf(e);return(n===null||n===Object.prototype||Object.getPrototypeOf(n)===null)&&!(Symbol.toStringTag in e)&&!(Symbol.iterator in e)}function uC(){const e=[],n={run:t,use:r};return n;function t(...i){let o=-1;const s=i.pop();if(typeof s!="function")throw new TypeError("Expected function as last argument, not "+s);a(null,...i);function a(l,...c){const u=e[++o];let d=-1;if(l){s(l);return}for(;++d<i.length;)(c[d]===null||c[d]===void 0)&&(c[d]=i[d]);i=c,u?dC(u,a)(...c):s(null,...c)}}function r(i){if(typeof i!="function")throw new TypeError("Expected `middelware` to be a function, not "+i);return e.push(i),n}}function dC(e,n){let t;return r;function r(...s){const a=e.length>s.length;let l;a&&s.push(i);try{l=e.apply(this,s)}catch(c){const u=c;if(a&&t)throw u;return i(u)}a||(l&&l.then&&typeof l.then=="function"?l.then(o,i):l instanceof Error?i(l):o(l))}function i(s,...a){t||(t=!0,n(s,...a))}function o(s){i(null,s)}}const Bn={basename:pC,dirname:fC,extname:hC,join:gC,sep:"/"};function pC(e,n){if(n!==void 0&&typeof n!="string")throw new TypeError('"ext" argument must be a string');qi(e);let t=0,r=-1,i=e.length,o;if(n===void 0||n.length===0||n.length>e.length){for(;i--;)if(e.codePointAt(i)===47){if(o){t=i+1;break}}else r<0&&(o=!0,r=i+1);return r<0?"":e.slice(t,r)}if(n===e)return"";let s=-1,a=n.length-1;for(;i--;)if(e.codePointAt(i)===47){if(o){t=i+1;break}}else s<0&&(o=!0,s=i+1),a>-1&&(e.codePointAt(i)===n.codePointAt(a--)?a<0&&(r=i):(a=-1,r=s));return t===r?r=s:r<0&&(r=e.length),e.slice(t,r)}function fC(e){if(qi(e),e.length===0)return".";let n=-1,t=e.length,r;for(;--t;)if(e.codePointAt(t)===47){if(r){n=t;break}}else r||(r=!0);return n<0?e.codePointAt(0)===47?"/":".":n===1&&e.codePointAt(0)===47?"//":e.slice(0,n)}function hC(e){qi(e);let n=e.length,t=-1,r=0,i=-1,o=0,s;for(;n--;){const a=e.codePointAt(n);if(a===47){if(s){r=n+1;break}continue}t<0&&(s=!0,t=n+1),a===46?i<0?i=n:o!==1&&(o=1):i>-1&&(o=-1)}return i<0||t<0||o===0||o===1&&i===t-1&&i===r+1?"":e.slice(i,t)}function gC(...e){let n=-1,t;for(;++n<e.length;)qi(e[n]),e[n]&&(t=t===void 0?e[n]:t+"/"+e[n]);return t===void 0?".":mC(t)}function mC(e){qi(e);const n=e.codePointAt(0)===47;let t=yC(e,!n);return t.length===0&&!n&&(t="."),t.length>0&&e.codePointAt(e.length-1)===47&&(t+="/"),n?"/"+t:t}function yC(e,n){let t="",r=0,i=-1,o=0,s=-1,a,l;for(;++s<=e.length;){if(s<e.length)a=e.codePointAt(s);else{if(a===47)break;a=47}if(a===47){if(!(i===s-1||o===1))if(i!==s-1&&o===2){if(t.length<2||r!==2||t.codePointAt(t.length-1)!==46||t.codePointAt(t.length-2)!==46){if(t.length>2){if(l=t.lastIndexOf("/"),l!==t.length-1){l<0?(t="",r=0):(t=t.slice(0,l),r=t.length-1-t.lastIndexOf("/")),i=s,o=0;continue}}else if(t.length>0){t="",r=0,i=s,o=0;continue}}n&&(t=t.length>0?t+"/..":"..",r=2)}else t.length>0?t+="/"+e.slice(i+1,s):t=e.slice(i+1,s),r=s-i-1;i=s,o=0}else a===46&&o>-1?o++:o=-1}return t}function qi(e){if(typeof e!="string")throw new TypeError("Path must be a string. Received "+JSON.stringify(e))}const bC={cwd:vC};function vC(){return"/"}function Ul(e){return!!(e!==null&&typeof e=="object"&&"href"in e&&e.href&&"protocol"in e&&e.protocol&&e.auth===void 0)}function wC(e){if(typeof e=="string")e=new URL(e);else if(!Ul(e)){const n=new TypeError('The "path" argument must be of type string or an instance of URL. Received `'+e+"`");throw n.code="ERR_INVALID_ARG_TYPE",n}if(e.protocol!=="file:"){const n=new TypeError("The URL must be of scheme file");throw n.code="ERR_INVALID_URL_SCHEME",n}return xC(e)}function xC(e){if(e.hostname!==""){const r=new TypeError('File URL host must be "localhost" or empty on darwin');throw r.code="ERR_INVALID_FILE_URL_HOST",r}const n=e.pathname;let t=-1;for(;++t<n.length;)if(n.codePointAt(t)===37&&n.codePointAt(t+1)===50){const r=n.codePointAt(t+2);if(r===70||r===102){const i=new TypeError("File URL path must not include encoded / characters");throw i.code="ERR_INVALID_FILE_URL_PATH",i}}return decodeURIComponent(n)}const Ca=["history","path","basename","stem","extname","dirname"];class em{constructor(n){let t;n?Ul(n)?t={path:n}:typeof n=="string"||SC(n)?t={value:n}:t=n:t={},this.cwd="cwd"in t?"":bC.cwd(),this.data={},this.history=[],this.messages=[],this.value,this.map,this.result,this.stored;let r=-1;for(;++r<Ca.length;){const o=Ca[r];o in t&&t[o]!==void 0&&t[o]!==null&&(this[o]=o==="history"?[...t[o]]:t[o])}let i;for(i in t)Ca.includes(i)||(this[i]=t[i])}get basename(){return typeof this.path=="string"?Bn.basename(this.path):void 0}set basename(n){Ra(n,"basename"),Ta(n,"basename"),this.path=Bn.join(this.dirname||"",n)}get dirname(){return typeof this.path=="string"?Bn.dirname(this.path):void 0}set dirname(n){fp(this.basename,"dirname"),this.path=Bn.join(n||"",this.basename)}get extname(){return typeof this.path=="string"?Bn.extname(this.path):void 0}set extname(n){if(Ta(n,"extname"),fp(this.dirname,"extname"),n){if(n.codePointAt(0)!==46)throw new Error("`extname` must start with `.`");if(n.includes(".",1))throw new Error("`extname` cannot contain multiple dots")}this.path=Bn.join(this.dirname,this.stem+(n||""))}get path(){return this.history[this.history.length-1]}set path(n){Ul(n)&&(n=wC(n)),Ra(n,"path"),this.path!==n&&this.history.push(n)}get stem(){return typeof this.path=="string"?Bn.basename(this.path,this.extname):void 0}set stem(n){Ra(n,"stem"),Ta(n,"stem"),this.path=Bn.join(this.dirname||"",n+(this.extname||""))}fail(n,t,r){const i=this.message(n,t,r);throw i.fatal=!0,i}info(n,t,r){const i=this.message(n,t,r);return i.fatal=void 0,i}message(n,t,r){const i=new Fe(n,t,r);return this.path&&(i.name=this.path+":"+i.name,i.file=this.path),i.fatal=!1,this.messages.push(i),i}toString(n){return this.value===void 0?"":typeof this.value=="string"?this.value:new TextDecoder(n||void 0).decode(this.value)}}function Ta(e,n){if(e&&e.includes(Bn.sep))throw new Error("`"+n+"` cannot be a path: did not expect `"+Bn.sep+"`")}function Ra(e,n){if(!e)throw new Error("`"+n+"` cannot be empty")}function fp(e,n){if(!e)throw new Error("Setting `"+n+"` requires `path` to be set too")}function SC(e){return!!(e&&typeof e=="object"&&"byteLength"in e&&"byteOffset"in e)}const kC=function(e){const r=this.constructor.prototype,i=r[e],o=function(){return i.apply(o,arguments)};return Object.setPrototypeOf(o,r),o},EC={}.hasOwnProperty;class Jc extends kC{constructor(){super("copy"),this.Compiler=void 0,this.Parser=void 0,this.attachers=[],this.compiler=void 0,this.freezeIndex=-1,this.frozen=void 0,this.namespace={},this.parser=void 0,this.transformers=uC()}copy(){const n=new Jc;let t=-1;for(;++t<this.attachers.length;){const r=this.attachers[t];n.use(...r)}return n.data(_a(!0,{},this.namespace)),n}data(n,t){return typeof n=="string"?arguments.length===2?(Aa("data",this.frozen),this.namespace[n]=t,this):EC.call(this.namespace,n)&&this.namespace[n]||void 0:n?(Aa("data",this.frozen),this.namespace=n,this):this.namespace}freeze(){if(this.frozen)return this;const n=this;for(;++this.freezeIndex<this.attachers.length;){const[t,...r]=this.attachers[this.freezeIndex];if(r[0]===!1)continue;r[0]===!0&&(r[0]=void 0);const i=t.call(n,...r);typeof i=="function"&&this.transformers.use(i)}return this.frozen=!0,this.freezeIndex=Number.POSITIVE_INFINITY,this}parse(n){this.freeze();const t=yo(n),r=this.parser||this.Parser;return Na("parse",r),r(String(t),t)}process(n,t){const r=this;return this.freeze(),Na("process",this.parser||this.Parser),Ia("process",this.compiler||this.Compiler),t?i(void 0,t):new Promise(i);function i(o,s){const a=yo(n),l=r.parse(a);r.run(l,a,function(u,d,p){if(u||!d||!p)return c(u);const h=d,v=r.stringify(h,p);TC(v)?p.value=v:p.result=v,c(u,p)});function c(u,d){u||!d?s(u):o?o(d):t(void 0,d)}}}processSync(n){let t=!1,r;return this.freeze(),Na("processSync",this.parser||this.Parser),Ia("processSync",this.compiler||this.Compiler),this.process(n,i),gp("processSync","process",t),r;function i(o,s){t=!0,sp(o),r=s}}run(n,t,r){hp(n),this.freeze();const i=this.transformers;return!r&&typeof t=="function"&&(r=t,t=void 0),r?o(void 0,r):new Promise(o);function o(s,a){const l=yo(t);i.run(n,l,c);function c(u,d,p){const h=d||n;u?a(u):s?s(h):r(void 0,h,p)}}}runSync(n,t){let r=!1,i;return this.run(n,t,o),gp("runSync","run",r),i;function o(s,a){sp(s),i=a,r=!0}}stringify(n,t){this.freeze();const r=yo(t),i=this.compiler||this.Compiler;return Ia("stringify",i),hp(n),i(n,r)}use(n,...t){const r=this.attachers,i=this.namespace;if(Aa("use",this.frozen),n!=null)if(typeof n=="function")l(n,t);else if(typeof n=="object")Array.isArray(n)?a(n):s(n);else throw new TypeError("Expected usable value, not `"+n+"`");return this;function o(c){if(typeof c=="function")l(c,[]);else if(typeof c=="object")if(Array.isArray(c)){const[u,...d]=c;l(u,d)}else s(c);else throw new TypeError("Expected usable value, not `"+c+"`")}function s(c){if(!("plugins"in c)&&!("settings"in c))throw new Error("Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither");a(c.plugins),c.settings&&(i.settings=_a(!0,i.settings,c.settings))}function a(c){let u=-1;if(c!=null)if(Array.isArray(c))for(;++u<c.length;){const d=c[u];o(d)}else throw new TypeError("Expected a list of plugins, not `"+c+"`")}function l(c,u){let d=-1,p=-1;for(;++d<r.length;)if(r[d][0]===c){p=d;break}if(p===-1)r.push([c,...u]);else if(u.length>0){let[h,...v]=u;const w=r[p][1];zl(w)&&zl(h)&&(h=_a(!0,w,h)),r[p]=[c,h,...v]}}}}const _C=new Jc().freeze();function Na(e,n){if(typeof n!="function")throw new TypeError("Cannot `"+e+"` without `parser`")}function Ia(e,n){if(typeof n!="function")throw new TypeError("Cannot `"+e+"` without `compiler`")}function Aa(e,n){if(n)throw new Error("Cannot call `"+e+"` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.")}function hp(e){if(!zl(e)||typeof e.type!="string")throw new TypeError("Expected node, got `"+e+"`")}function gp(e,n,t){if(!t)throw new Error("`"+e+"` finished async. Use `"+n+"` instead")}function yo(e){return CC(e)?e:new em(e)}function CC(e){return!!(e&&typeof e=="object"&&"message"in e&&"messages"in e)}function TC(e){return typeof e=="string"||RC(e)}function RC(e){return!!(e&&typeof e=="object"&&"byteLength"in e&&"byteOffset"in e)}const NC="https://github.com/remarkjs/react-markdown/blob/main/changelog.md",mp=[],yp={allowDangerousHtml:!0},IC=/^(https?|ircs?|mailto|xmpp)$/i,AC=[{from:"astPlugins",id:"remove-buggy-html-in-markdown-parser"},{from:"allowDangerousHtml",id:"remove-buggy-html-in-markdown-parser"},{from:"allowNode",id:"replace-allownode-allowedtypes-and-disallowedtypes",to:"allowElement"},{from:"allowedTypes",id:"replace-allownode-allowedtypes-and-disallowedtypes",to:"allowedElements"},{from:"className",id:"remove-classname"},{from:"disallowedTypes",id:"replace-allownode-allowedtypes-and-disallowedtypes",to:"disallowedElements"},{from:"escapeHtml",id:"remove-buggy-html-in-markdown-parser"},{from:"includeElementIndex",id:"#remove-includeelementindex"},{from:"includeNodeIndex",id:"change-includenodeindex-to-includeelementindex"},{from:"linkTarget",id:"remove-linktarget"},{from:"plugins",id:"change-plugins-to-remarkplugins",to:"remarkPlugins"},{from:"rawSourcePos",id:"#remove-rawsourcepos"},{from:"renderers",id:"change-renderers-to-components",to:"components"},{from:"source",id:"change-source-to-children",to:"children"},{from:"sourcePos",id:"#remove-sourcepos"},{from:"transformImageUri",id:"#add-urltransform",to:"urlTransform"},{from:"transformLinkUri",id:"#add-urltransform",to:"urlTransform"}];function OC(e){const n=MC(e),t=DC(e);return LC(n.runSync(n.parse(t),t),e)}function MC(e){const n=e.rehypePlugins||mp,t=e.remarkPlugins||mp,r=e.remarkRehypeOptions?{...e.remarkRehypeOptions,...yp}:yp;return _C().use(p1).use(t).use(lC,r).use(n)}function DC(e){const n=e.children||"",t=new em;return typeof n=="string"&&(t.value=n),t}function LC(e,n){const t=n.allowedElements,r=n.allowElement,i=n.components,o=n.disallowedElements,s=n.skipHtml,a=n.unwrapDisallowed,l=n.urlTransform||PC;for(const u of AC)Object.hasOwn(n,u.from)&&(""+u.from+(u.to?"use `"+u.to+"` instead":"remove it")+NC+u.id,void 0);return Zc(e,c),Wk(e,{Fragment:f.Fragment,components:i,ignoreInvalidStyle:!0,jsx:f.jsx,jsxs:f.jsxs,passKeys:!0,passNode:!0});function c(u,d,p){if(u.type==="raw"&&p&&typeof d=="number")return s?p.children.splice(d,1):p.children[d]={type:"text",value:u.value},d;if(u.type==="element"){let h;for(h in Sa)if(Object.hasOwn(Sa,h)&&Object.hasOwn(u.properties,h)){const v=u.properties[h],w=Sa[h];(w===null||w.includes(u.tagName))&&(u.properties[h]=l(String(v||""),h,u))}}if(u.type==="element"){let h=t?!t.includes(u.tagName):o?o.includes(u.tagName):!1;if(!h&&r&&typeof d=="number"&&(h=!r(u,d,p)),h&&p&&typeof d=="number")return a&&u.children?p.children.splice(d,1,...u.children):p.children.splice(d,1),d}}}function PC(e){const n=e.indexOf(":"),t=e.indexOf("?"),r=e.indexOf("#"),i=e.indexOf("/");return n===-1||i!==-1&&n>i||t!==-1&&n>t||r!==-1&&n>r||IC.test(e.slice(0,n))?e:""}const bp=function(e,n,t){const r=Xc(t);if(!e||!e.type||!e.children)throw new Error("Expected parent node");if(typeof n=="number"){if(n<0||n===Number.POSITIVE_INFINITY)throw new Error("Expected positive finite number as index")}else if(n=e.children.indexOf(n),n<0)throw new Error("Expected child node or index");for(;++n<e.children.length;)if(r(e.children[n],n,e))return e.children[n]},Zt=function(e){if(e==null)return FC;if(typeof e=="string")return jC(e);if(typeof e=="object")return BC(e);if(typeof e=="function")return eu(e);throw new Error("Expected function, string, or array as `test`")};function BC(e){const n=[];let t=-1;for(;++t<e.length;)n[t]=Zt(e[t]);return eu(r);function r(...i){let o=-1;for(;++o<n.length;)if(n[o].apply(this,i))return!0;return!1}}function jC(e){return eu(n);function n(t){return t.tagName===e}}function eu(e){return n;function n(t,r,i){return!!(zC(t)&&e.call(this,t,typeof r=="number"?r:void 0,i||void 0))}}function FC(e){return!!(e&&typeof e=="object"&&"type"in e&&e.type==="element"&&"tagName"in e&&typeof e.tagName=="string")}function zC(e){return e!==null&&typeof e=="object"&&"type"in e&&"tagName"in e}const vp=/\n/g,wp=/[\t ]+/g,$l=Zt("br"),xp=Zt(qC),UC=Zt("p"),Sp=Zt("tr"),$C=Zt(["datalist","head","noembed","noframes","noscript","rp","script","style","template","title",VC,YC]),nm=Zt(["address","article","aside","blockquote","body","caption","center","dd","dialog","dir","dl","dt","div","figure","figcaption","footer","form,","h1","h2","h3","h4","h5","h6","header","hgroup","hr","html","legend","li","listing","main","menu","nav","ol","p","plaintext","pre","section","ul","xmp"]);function HC(e,n){const t=n||{},r="children"in e?e.children:[],i=nm(e),o=im(e,{whitespace:t.whitespace||"normal"}),s=[];(e.type==="text"||e.type==="comment")&&s.push(...rm(e,{breakBefore:!0,breakAfter:!0}));let a=-1;for(;++a<r.length;)s.push(...tm(r[a],e,{whitespace:o,breakBefore:a?void 0:i,breakAfter:a<r.length-1?$l(r[a+1]):i}));const l=[];let c;for(a=-1;++a<s.length;){const u=s[a];typeof u=="number"?c!==void 0&&u>c&&(c=u):u&&(c!==void 0&&c>-1&&l.push(`
`.repeat(c)||" "),c=-1,l.push(u))}return l.join("")}function tm(e,n,t){return e.type==="element"?GC(e,n,t):e.type==="text"?t.whitespace==="normal"?rm(e,t):WC(e):[]}function GC(e,n,t){const r=im(e,t),i=e.children||[];let o=-1,s=[];if($C(e))return s;let a,l;for($l(e)||Sp(e)&&bp(n,e,Sp)?l=`
`:UC(e)?(a=2,l=2):nm(e)&&(a=1,l=1);++o<i.length;)s=s.concat(tm(i[o],e,{whitespace:r,breakBefore:o?void 0:a,breakAfter:o<i.length-1?$l(i[o+1]):l}));return xp(e)&&bp(n,e,xp)&&s.push("	"),a&&s.unshift(a),l&&s.push(l),s}function rm(e,n){const t=String(e.value),r=[],i=[];let o=0;for(;o<=t.length;){vp.lastIndex=o;const l=vp.exec(t),c=l&&"index"in l?l.index:t.length;r.push(KC(t.slice(o,c).replace(/[\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g,""),o===0?n.breakBefore:!0,c===t.length?n.breakAfter:!0)),o=c+1}let s=-1,a;for(;++s<r.length;)r[s].charCodeAt(r[s].length-1)===8203||s<r.length-1&&r[s+1].charCodeAt(0)===8203?(i.push(r[s]),a=void 0):r[s]?(typeof a=="number"&&i.push(a),i.push(r[s]),a=0):(s===0||s===r.length-1)&&i.push(0);return i}function WC(e){return[String(e.value)]}function KC(e,n,t){const r=[];let i=0,o;for(;i<e.length;){wp.lastIndex=i;const s=wp.exec(e);o=s?s.index:e.length,!i&&!o&&s&&!n&&r.push(""),i!==o&&r.push(e.slice(i,o)),i=s?o+s[0].length:o}return i!==o&&!t&&r.push(""),r.join(" ")}function im(e,n){if(e.type==="element"){const t=e.properties||{};switch(e.tagName){case"listing":case"plaintext":case"xmp":return"pre";case"nobr":return"nowrap";case"pre":return t.wrap?"pre-wrap":"pre";case"td":case"th":return t.noWrap?"nowrap":n.whitespace;case"textarea":return"pre-wrap"}}return n.whitespace}function VC(e){return!!(e.properties||{}).hidden}function qC(e){return e.tagName==="td"||e.tagName==="th"}function YC(e){return e.tagName==="dialog"&&!(e.properties||{}).open}function QC(e){const n=e.regex,t=e.COMMENT("//","$",{contains:[{begin:/\\\n/}]}),r="decltype\\(auto\\)",i="[a-zA-Z_]\\w*::",s="(?!struct)("+r+"|"+n.optional(i)+"[a-zA-Z_]\\w*"+n.optional("<[^<>]+>")+")",a={className:"type",begin:"\\b[a-z\\d_]*_t\\b"},c={className:"string",variants:[{begin:'(u8?|U|L)?"',end:'"',illegal:"\\n",contains:[e.BACKSLASH_ESCAPE]},{begin:"(u8?|U|L)?'("+"\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)"+"|.)",end:"'",illegal:"."},e.END_SAME_AS_BEGIN({begin:/(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,end:/\)([^()\\ ]{0,16})"/})]},u={className:"number",variants:[{begin:"[+-]?(?:(?:[0-9](?:'?[0-9])*\\.(?:[0-9](?:'?[0-9])*)?|\\.[0-9](?:'?[0-9])*)(?:[Ee][+-]?[0-9](?:'?[0-9])*)?|[0-9](?:'?[0-9])*[Ee][+-]?[0-9](?:'?[0-9])*|0[Xx](?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*(?:\\.(?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)?)?|\\.[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)[Pp][+-]?[0-9](?:'?[0-9])*)(?:[Ff](?:16|32|64|128)?|(BF|bf)16|[Ll]|)"},{begin:"[+-]?\\b(?:0[Bb][01](?:'?[01])*|0[Xx][0-9A-Fa-f](?:'?[0-9A-Fa-f])*|0(?:'?[0-7])*|[1-9](?:'?[0-9])*)(?:[Uu](?:LL?|ll?)|[Uu][Zz]?|(?:LL?|ll?)[Uu]?|[Zz][Uu]|)"}],relevance:0},d={className:"meta",begin:/#\s*[a-z]+\b/,end:/$/,keywords:{keyword:"if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"},contains:[{begin:/\\\n/,relevance:0},e.inherit(c,{className:"string"}),{className:"string",begin:/<.*?>/},t,e.C_BLOCK_COMMENT_MODE]},p={className:"title",begin:n.optional(i)+e.IDENT_RE,relevance:0},h=n.optional(i)+e.IDENT_RE+"\\s*\\(",v=["alignas","alignof","and","and_eq","asm","atomic_cancel","atomic_commit","atomic_noexcept","auto","bitand","bitor","break","case","catch","class","co_await","co_return","co_yield","compl","concept","const_cast|10","consteval","constexpr","constinit","continue","decltype","default","delete","do","dynamic_cast|10","else","enum","explicit","export","extern","false","final","for","friend","goto","if","import","inline","module","mutable","namespace","new","noexcept","not","not_eq","nullptr","operator","or","or_eq","override","private","protected","public","reflexpr","register","reinterpret_cast|10","requires","return","sizeof","static_assert","static_cast|10","struct","switch","synchronized","template","this","thread_local","throw","transaction_safe","transaction_safe_dynamic","true","try","typedef","typeid","typename","union","using","virtual","volatile","while","xor","xor_eq"],w=["bool","char","char16_t","char32_t","char8_t","double","float","int","long","short","void","wchar_t","unsigned","signed","const","static"],S=["any","auto_ptr","barrier","binary_semaphore","bitset","complex","condition_variable","condition_variable_any","counting_semaphore","deque","false_type","flat_map","flat_set","future","imaginary","initializer_list","istringstream","jthread","latch","lock_guard","multimap","multiset","mutex","optional","ostringstream","packaged_task","pair","promise","priority_queue","queue","recursive_mutex","recursive_timed_mutex","scoped_lock","set","shared_future","shared_lock","shared_mutex","shared_timed_mutex","shared_ptr","stack","string_view","stringstream","timed_mutex","thread","true_type","tuple","unique_lock","unique_ptr","unordered_map","unordered_multimap","unordered_multiset","unordered_set","variant","vector","weak_ptr","wstring","wstring_view"],g=["abort","abs","acos","apply","as_const","asin","atan","atan2","calloc","ceil","cerr","cin","clog","cos","cosh","cout","declval","endl","exchange","exit","exp","fabs","floor","fmod","forward","fprintf","fputs","free","frexp","fscanf","future","invoke","isalnum","isalpha","iscntrl","isdigit","isgraph","islower","isprint","ispunct","isspace","isupper","isxdigit","labs","launder","ldexp","log","log10","make_pair","make_shared","make_shared_for_overwrite","make_tuple","make_unique","malloc","memchr","memcmp","memcpy","memset","modf","move","pow","printf","putchar","puts","realloc","scanf","sin","sinh","snprintf","sprintf","sqrt","sscanf","std","stderr","stdin","stdout","strcat","strchr","strcmp","strcpy","strcspn","strlen","strncat","strncmp","strncpy","strpbrk","strrchr","strspn","strstr","swap","tan","tanh","terminate","to_underlying","tolower","toupper","vfprintf","visit","vprintf","vsprintf"],_={type:w,keyword:v,literal:["NULL","false","nullopt","nullptr","true"],built_in:["_Pragma"],_type_hints:S},N={className:"function.dispatch",relevance:0,keywords:{_hint:g},begin:n.concat(/\b/,`(?!${v.join("|")})`,e.IDENT_RE,n.lookahead(/(<[^<>]+>|)\s*\(/))},k=[N,d,a,t,e.C_BLOCK_COMMENT_MODE,u,c],I={variants:[{begin:/=/,end:/;/},{begin:/\(/,end:/\)/},{beginKeywords:"new throw return else",end:/;/}],keywords:_,contains:k.concat([{begin:/\(/,end:/\)/,keywords:_,contains:k.concat(["self"]),relevance:0}]),relevance:0},D={className:"function",begin:"("+s+"[\\*&\\s]+)+"+h,returnBegin:!0,end:/[{;=]/,excludeEnd:!0,keywords:_,illegal:/[^\w\s\*&:<>.]/,contains:[{begin:r,keywords:_,relevance:0},{begin:h,returnBegin:!0,contains:[p],relevance:0},{begin:/::/,relevance:0},{begin:/:/,endsWithParent:!0,contains:[c,u]},{relevance:0,match:/,/},{className:"params",begin:/\(/,end:/\)/,keywords:_,relevance:0,contains:[t,e.C_BLOCK_COMMENT_MODE,c,u,a,{begin:/\(/,end:/\)/,keywords:_,relevance:0,contains:["self",t,e.C_BLOCK_COMMENT_MODE,c,u,a]}]},a,t,e.C_BLOCK_COMMENT_MODE,d]};return{name:"C++",aliases:["cc","c++","h++","hpp","hh","hxx","cxx"],keywords:_,illegal:"</",classNameAliases:{"function.dispatch":"built_in"},contains:[].concat(I,D,N,k,[d,{begin:"\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array|tuple|optional|variant|function|flat_map|flat_set)\\s*<(?!<)",end:">",keywords:_,contains:["self",a]},{begin:e.IDENT_RE+"::",keywords:_},{match:[/\b(?:enum(?:\s+(?:class|struct))?|class|struct|union)/,/\s+/,/\w+/],className:{1:"keyword",3:"title.class"}}])}}function XC(e){const n={type:["boolean","byte","word","String"],built_in:["KeyboardController","MouseController","SoftwareSerial","EthernetServer","EthernetClient","LiquidCrystal","RobotControl","GSMVoiceCall","EthernetUDP","EsploraTFT","HttpClient","RobotMotor","WiFiClient","GSMScanner","FileSystem","Scheduler","GSMServer","YunClient","YunServer","IPAddress","GSMClient","GSMModem","Keyboard","Ethernet","Console","GSMBand","Esplora","Stepper","Process","WiFiUDP","GSM_SMS","Mailbox","USBHost","Firmata","PImage","Client","Server","GSMPIN","FileIO","Bridge","Serial","EEPROM","Stream","Mouse","Audio","Servo","File","Task","GPRS","WiFi","Wire","TFT","GSM","SPI","SD"],_hints:["setup","loop","runShellCommandAsynchronously","analogWriteResolution","retrieveCallingNumber","printFirmwareVersion","analogReadResolution","sendDigitalPortPair","noListenOnLocalhost","readJoystickButton","setFirmwareVersion","readJoystickSwitch","scrollDisplayRight","getVoiceCallStatus","scrollDisplayLeft","writeMicroseconds","delayMicroseconds","beginTransmission","getSignalStrength","runAsynchronously","getAsynchronously","listenOnLocalhost","getCurrentCarrier","readAccelerometer","messageAvailable","sendDigitalPorts","lineFollowConfig","countryNameWrite","runShellCommand","readStringUntil","rewindDirectory","readTemperature","setClockDivider","readLightSensor","endTransmission","analogReference","detachInterrupt","countryNameRead","attachInterrupt","encryptionType","readBytesUntil","robotNameWrite","readMicrophone","robotNameRead","cityNameWrite","userNameWrite","readJoystickY","readJoystickX","mouseReleased","openNextFile","scanNetworks","noInterrupts","digitalWrite","beginSpeaker","mousePressed","isActionDone","mouseDragged","displayLogos","noAutoscroll","addParameter","remoteNumber","getModifiers","keyboardRead","userNameRead","waitContinue","processInput","parseCommand","printVersion","readNetworks","writeMessage","blinkVersion","cityNameRead","readMessage","setDataMode","parsePacket","isListening","setBitOrder","beginPacket","isDirectory","motorsWrite","drawCompass","digitalRead","clearScreen","serialEvent","rightToLeft","setTextSize","leftToRight","requestFrom","keyReleased","compassRead","analogWrite","interrupts","WiFiServer","disconnect","playMelody","parseFloat","autoscroll","getPINUsed","setPINUsed","setTimeout","sendAnalog","readSlider","analogRead","beginWrite","createChar","motorsStop","keyPressed","tempoWrite","readButton","subnetMask","debugPrint","macAddress","writeGreen","randomSeed","attachGPRS","readString","sendString","remotePort","releaseAll","mouseMoved","background","getXChange","getYChange","answerCall","getResult","voiceCall","endPacket","constrain","getSocket","writeJSON","getButton","available","connected","findUntil","readBytes","exitValue","readGreen","writeBlue","startLoop","IPAddress","isPressed","sendSysex","pauseMode","gatewayIP","setCursor","getOemKey","tuneWrite","noDisplay","loadImage","switchPIN","onRequest","onReceive","changePIN","playFile","noBuffer","parseInt","overflow","checkPIN","knobRead","beginTFT","bitClear","updateIR","bitWrite","position","writeRGB","highByte","writeRed","setSpeed","readBlue","noStroke","remoteIP","transfer","shutdown","hangCall","beginSMS","endWrite","attached","maintain","noCursor","checkReg","checkPUK","shiftOut","isValid","shiftIn","pulseIn","connect","println","localIP","pinMode","getIMEI","display","noBlink","process","getBand","running","beginSD","drawBMP","lowByte","setBand","release","bitRead","prepare","pointTo","readRed","setMode","noFill","remove","listen","stroke","detach","attach","noTone","exists","buffer","height","bitSet","circle","config","cursor","random","IRread","setDNS","endSMS","getKey","micros","millis","begin","print","write","ready","flush","width","isPIN","blink","clear","press","mkdir","rmdir","close","point","yield","image","BSSID","click","delay","read","text","move","peek","beep","rect","line","open","seek","fill","size","turn","stop","home","find","step","tone","sqrt","RSSI","SSID","end","bit","tan","cos","sin","pow","map","abs","max","min","get","run","put"],literal:["DIGITAL_MESSAGE","FIRMATA_STRING","ANALOG_MESSAGE","REPORT_DIGITAL","REPORT_ANALOG","INPUT_PULLUP","SET_PIN_MODE","INTERNAL2V56","SYSTEM_RESET","LED_BUILTIN","INTERNAL1V1","SYSEX_START","INTERNAL","EXTERNAL","DEFAULT","OUTPUT","INPUT","HIGH","LOW"]},t=QC(e),r=t.keywords;return r.type=[...r.type,...n.type],r.literal=[...r.literal,...n.literal],r.built_in=[...r.built_in,...n.built_in],r._hints=n._hints,t.name="Arduino",t.aliases=["ino"],t.supersetOf="cpp",t}function ZC(e){const n=e.regex,t={},r={begin:/\$\{/,end:/\}/,contains:["self",{begin:/:-/,contains:[t]}]};Object.assign(t,{className:"variable",variants:[{begin:n.concat(/\$[\w\d#@][\w\d_]*/,"(?![\\w\\d])(?![$])")},r]});const i={className:"subst",begin:/\$\(/,end:/\)/,contains:[e.BACKSLASH_ESCAPE]},o=e.inherit(e.COMMENT(),{match:[/(^|\s)/,/#.*$/],scope:{2:"comment"}}),s={begin:/<<-?\s*(?=\w+)/,starts:{contains:[e.END_SAME_AS_BEGIN({begin:/(\w+)/,end:/(\w+)/,className:"string"})]}},a={className:"string",begin:/"/,end:/"/,contains:[e.BACKSLASH_ESCAPE,t,i]};i.contains.push(a);const l={match:/\\"/},c={className:"string",begin:/'/,end:/'/},u={match:/\\'/},d={begin:/\$?\(\(/,end:/\)\)/,contains:[{begin:/\d+#[0-9a-f]+/,className:"number"},e.NUMBER_MODE,t]},p=["fish","bash","zsh","sh","csh","ksh","tcsh","dash","scsh"],h=e.SHEBANG({binary:`(${p.join("|")})`,relevance:10}),v={className:"function",begin:/\w[\w\d_]*\s*\(\s*\)\s*\{/,returnBegin:!0,contains:[e.inherit(e.TITLE_MODE,{begin:/\w[\w\d_]*/})],relevance:0},w=["if","then","else","elif","fi","time","for","while","until","in","do","done","case","esac","coproc","function","select"],S=["true","false"],g={match:/(\/[a-z._-]+)+/},m=["break","cd","continue","eval","exec","exit","export","getopts","hash","pwd","readonly","return","shift","test","times","trap","umask","unset"],y=["alias","bind","builtin","caller","command","declare","echo","enable","help","let","local","logout","mapfile","printf","read","readarray","source","sudo","type","typeset","ulimit","unalias"],_=["autoload","bg","bindkey","bye","cap","chdir","clone","comparguments","compcall","compctl","compdescribe","compfiles","compgroups","compquote","comptags","comptry","compvalues","dirs","disable","disown","echotc","echoti","emulate","fc","fg","float","functions","getcap","getln","history","integer","jobs","kill","limit","log","noglob","popd","print","pushd","pushln","rehash","sched","setcap","setopt","stat","suspend","ttyctl","unfunction","unhash","unlimit","unsetopt","vared","wait","whence","where","which","zcompile","zformat","zftp","zle","zmodload","zparseopts","zprof","zpty","zregexparse","zsocket","zstyle","ztcp"],N=["chcon","chgrp","chown","chmod","cp","dd","df","dir","dircolors","ln","ls","mkdir","mkfifo","mknod","mktemp","mv","realpath","rm","rmdir","shred","sync","touch","truncate","vdir","b2sum","base32","base64","cat","cksum","comm","csplit","cut","expand","fmt","fold","head","join","md5sum","nl","numfmt","od","paste","ptx","pr","sha1sum","sha224sum","sha256sum","sha384sum","sha512sum","shuf","sort","split","sum","tac","tail","tr","tsort","unexpand","uniq","wc","arch","basename","chroot","date","dirname","du","echo","env","expr","factor","groups","hostid","id","link","logname","nice","nohup","nproc","pathchk","pinky","printenv","printf","pwd","readlink","runcon","seq","sleep","stat","stdbuf","stty","tee","test","timeout","tty","uname","unlink","uptime","users","who","whoami","yes"];return{name:"Bash",aliases:["sh","zsh"],keywords:{$pattern:/\b[a-z][a-z0-9._-]+\b/,keyword:w,literal:S,built_in:[...m,...y,"set","shopt",..._,...N]},contains:[h,e.SHEBANG(),v,d,o,s,g,a,l,c,u,t]}}function JC(e){const n=e.regex,t=e.COMMENT("//","$",{contains:[{begin:/\\\n/}]}),r="decltype\\(auto\\)",i="[a-zA-Z_]\\w*::",s="("+r+"|"+n.optional(i)+"[a-zA-Z_]\\w*"+n.optional("<[^<>]+>")+")",a={className:"type",variants:[{begin:"\\b[a-z\\d_]*_t\\b"},{match:/\batomic_[a-z]{3,6}\b/}]},c={className:"string",variants:[{begin:'(u8?|U|L)?"',end:'"',illegal:"\\n",contains:[e.BACKSLASH_ESCAPE]},{begin:"(u8?|U|L)?'("+"\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)"+"|.)",end:"'",illegal:"."},e.END_SAME_AS_BEGIN({begin:/(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,end:/\)([^()\\ ]{0,16})"/})]},u={className:"number",variants:[{match:/\b(0b[01']+)/},{match:/(-?)\b([\d']+(\.[\d']*)?|\.[\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)/},{match:/(-?)\b(0[xX][a-fA-F0-9]+(?:'[a-fA-F0-9]+)*(?:\.[a-fA-F0-9]*(?:'[a-fA-F0-9]*)*)?(?:[pP][-+]?[0-9]+)?(l|L)?(u|U)?)/},{match:/(-?)\b\d+(?:'\d+)*(?:\.\d*(?:'\d*)*)?(?:[eE][-+]?\d+)?/}],relevance:0},d={className:"meta",begin:/#\s*[a-z]+\b/,end:/$/,keywords:{keyword:"if else elif endif define undef warning error line pragma _Pragma ifdef ifndef elifdef elifndef include"},contains:[{begin:/\\\n/,relevance:0},e.inherit(c,{className:"string"}),{className:"string",begin:/<.*?>/},t,e.C_BLOCK_COMMENT_MODE]},p={className:"title",begin:n.optional(i)+e.IDENT_RE,relevance:0},h=n.optional(i)+e.IDENT_RE+"\\s*\\(",S={keyword:["asm","auto","break","case","continue","default","do","else","enum","extern","for","fortran","goto","if","inline","register","restrict","return","sizeof","typeof","typeof_unqual","struct","switch","typedef","union","volatile","while","_Alignas","_Alignof","_Atomic","_Generic","_Noreturn","_Static_assert","_Thread_local","alignas","alignof","noreturn","static_assert","thread_local","_Pragma"],type:["float","double","signed","unsigned","int","short","long","char","void","_Bool","_BitInt","_Complex","_Imaginary","_Decimal32","_Decimal64","_Decimal96","_Decimal128","_Decimal64x","_Decimal128x","_Float16","_Float32","_Float64","_Float128","_Float32x","_Float64x","_Float128x","const","static","constexpr","complex","bool","imaginary"],literal:"true false NULL",built_in:"std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr"},g=[d,a,t,e.C_BLOCK_COMMENT_MODE,u,c],m={variants:[{begin:/=/,end:/;/},{begin:/\(/,end:/\)/},{beginKeywords:"new throw return else",end:/;/}],keywords:S,contains:g.concat([{begin:/\(/,end:/\)/,keywords:S,contains:g.concat(["self"]),relevance:0}]),relevance:0},y={begin:"("+s+"[\\*&\\s]+)+"+h,returnBegin:!0,end:/[{;=]/,excludeEnd:!0,keywords:S,illegal:/[^\w\s\*&:<>.]/,contains:[{begin:r,keywords:S,relevance:0},{begin:h,returnBegin:!0,contains:[e.inherit(p,{className:"title.function"})],relevance:0},{relevance:0,match:/,/},{className:"params",begin:/\(/,end:/\)/,keywords:S,relevance:0,contains:[t,e.C_BLOCK_COMMENT_MODE,c,u,a,{begin:/\(/,end:/\)/,keywords:S,relevance:0,contains:["self",t,e.C_BLOCK_COMMENT_MODE,c,u,a]}]},a,t,e.C_BLOCK_COMMENT_MODE,d]};return{name:"C",aliases:["h"],keywords:S,disableAutodetect:!0,illegal:"</",contains:[].concat(m,y,g,[d,{begin:e.IDENT_RE+"::",keywords:S},{className:"class",beginKeywords:"enum class struct union",end:/[{;:<>=]/,contains:[{beginKeywords:"final class struct"},e.TITLE_MODE]}]),exports:{preprocessor:d,strings:c,keywords:S}}}function eT(e){const n=e.regex,t=e.COMMENT("//","$",{contains:[{begin:/\\\n/}]}),r="decltype\\(auto\\)",i="[a-zA-Z_]\\w*::",s="(?!struct)("+r+"|"+n.optional(i)+"[a-zA-Z_]\\w*"+n.optional("<[^<>]+>")+")",a={className:"type",begin:"\\b[a-z\\d_]*_t\\b"},c={className:"string",variants:[{begin:'(u8?|U|L)?"',end:'"',illegal:"\\n",contains:[e.BACKSLASH_ESCAPE]},{begin:"(u8?|U|L)?'("+"\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)"+"|.)",end:"'",illegal:"."},e.END_SAME_AS_BEGIN({begin:/(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,end:/\)([^()\\ ]{0,16})"/})]},u={className:"number",variants:[{begin:"[+-]?(?:(?:[0-9](?:'?[0-9])*\\.(?:[0-9](?:'?[0-9])*)?|\\.[0-9](?:'?[0-9])*)(?:[Ee][+-]?[0-9](?:'?[0-9])*)?|[0-9](?:'?[0-9])*[Ee][+-]?[0-9](?:'?[0-9])*|0[Xx](?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*(?:\\.(?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)?)?|\\.[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)[Pp][+-]?[0-9](?:'?[0-9])*)(?:[Ff](?:16|32|64|128)?|(BF|bf)16|[Ll]|)"},{begin:"[+-]?\\b(?:0[Bb][01](?:'?[01])*|0[Xx][0-9A-Fa-f](?:'?[0-9A-Fa-f])*|0(?:'?[0-7])*|[1-9](?:'?[0-9])*)(?:[Uu](?:LL?|ll?)|[Uu][Zz]?|(?:LL?|ll?)[Uu]?|[Zz][Uu]|)"}],relevance:0},d={className:"meta",begin:/#\s*[a-z]+\b/,end:/$/,keywords:{keyword:"if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"},contains:[{begin:/\\\n/,relevance:0},e.inherit(c,{className:"string"}),{className:"string",begin:/<.*?>/},t,e.C_BLOCK_COMMENT_MODE]},p={className:"title",begin:n.optional(i)+e.IDENT_RE,relevance:0},h=n.optional(i)+e.IDENT_RE+"\\s*\\(",v=["alignas","alignof","and","and_eq","asm","atomic_cancel","atomic_commit","atomic_noexcept","auto","bitand","bitor","break","case","catch","class","co_await","co_return","co_yield","compl","concept","const_cast|10","consteval","constexpr","constinit","continue","decltype","default","delete","do","dynamic_cast|10","else","enum","explicit","export","extern","false","final","for","friend","goto","if","import","inline","module","mutable","namespace","new","noexcept","not","not_eq","nullptr","operator","or","or_eq","override","private","protected","public","reflexpr","register","reinterpret_cast|10","requires","return","sizeof","static_assert","static_cast|10","struct","switch","synchronized","template","this","thread_local","throw","transaction_safe","transaction_safe_dynamic","true","try","typedef","typeid","typename","union","using","virtual","volatile","while","xor","xor_eq"],w=["bool","char","char16_t","char32_t","char8_t","double","float","int","long","short","void","wchar_t","unsigned","signed","const","static"],S=["any","auto_ptr","barrier","binary_semaphore","bitset","complex","condition_variable","condition_variable_any","counting_semaphore","deque","false_type","flat_map","flat_set","future","imaginary","initializer_list","istringstream","jthread","latch","lock_guard","multimap","multiset","mutex","optional","ostringstream","packaged_task","pair","promise","priority_queue","queue","recursive_mutex","recursive_timed_mutex","scoped_lock","set","shared_future","shared_lock","shared_mutex","shared_timed_mutex","shared_ptr","stack","string_view","stringstream","timed_mutex","thread","true_type","tuple","unique_lock","unique_ptr","unordered_map","unordered_multimap","unordered_multiset","unordered_set","variant","vector","weak_ptr","wstring","wstring_view"],g=["abort","abs","acos","apply","as_const","asin","atan","atan2","calloc","ceil","cerr","cin","clog","cos","cosh","cout","declval","endl","exchange","exit","exp","fabs","floor","fmod","forward","fprintf","fputs","free","frexp","fscanf","future","invoke","isalnum","isalpha","iscntrl","isdigit","isgraph","islower","isprint","ispunct","isspace","isupper","isxdigit","labs","launder","ldexp","log","log10","make_pair","make_shared","make_shared_for_overwrite","make_tuple","make_unique","malloc","memchr","memcmp","memcpy","memset","modf","move","pow","printf","putchar","puts","realloc","scanf","sin","sinh","snprintf","sprintf","sqrt","sscanf","std","stderr","stdin","stdout","strcat","strchr","strcmp","strcpy","strcspn","strlen","strncat","strncmp","strncpy","strpbrk","strrchr","strspn","strstr","swap","tan","tanh","terminate","to_underlying","tolower","toupper","vfprintf","visit","vprintf","vsprintf"],_={type:w,keyword:v,literal:["NULL","false","nullopt","nullptr","true"],built_in:["_Pragma"],_type_hints:S},N={className:"function.dispatch",relevance:0,keywords:{_hint:g},begin:n.concat(/\b/,`(?!${v.join("|")})`,e.IDENT_RE,n.lookahead(/(<[^<>]+>|)\s*\(/))},k=[N,d,a,t,e.C_BLOCK_COMMENT_MODE,u,c],I={variants:[{begin:/=/,end:/;/},{begin:/\(/,end:/\)/},{beginKeywords:"new throw return else",end:/;/}],keywords:_,contains:k.concat([{begin:/\(/,end:/\)/,keywords:_,contains:k.concat(["self"]),relevance:0}]),relevance:0},D={className:"function",begin:"("+s+"[\\*&\\s]+)+"+h,returnBegin:!0,end:/[{;=]/,excludeEnd:!0,keywords:_,illegal:/[^\w\s\*&:<>.]/,contains:[{begin:r,keywords:_,relevance:0},{begin:h,returnBegin:!0,contains:[p],relevance:0},{begin:/::/,relevance:0},{begin:/:/,endsWithParent:!0,contains:[c,u]},{relevance:0,match:/,/},{className:"params",begin:/\(/,end:/\)/,keywords:_,relevance:0,contains:[t,e.C_BLOCK_COMMENT_MODE,c,u,a,{begin:/\(/,end:/\)/,keywords:_,relevance:0,contains:["self",t,e.C_BLOCK_COMMENT_MODE,c,u,a]}]},a,t,e.C_BLOCK_COMMENT_MODE,d]};return{name:"C++",aliases:["cc","c++","h++","hpp","hh","hxx","cxx"],keywords:_,illegal:"</",classNameAliases:{"function.dispatch":"built_in"},contains:[].concat(I,D,N,k,[d,{begin:"\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array|tuple|optional|variant|function|flat_map|flat_set)\\s*<(?!<)",end:">",keywords:_,contains:["self",a]},{begin:e.IDENT_RE+"::",keywords:_},{match:[/\b(?:enum(?:\s+(?:class|struct))?|class|struct|union)/,/\s+/,/\w+/],className:{1:"keyword",3:"title.class"}}])}}function nT(e){const n=["bool","byte","char","decimal","delegate","double","dynamic","enum","float","int","long","nint","nuint","object","sbyte","short","string","ulong","uint","ushort"],t=["public","private","protected","static","internal","protected","abstract","async","extern","override","unsafe","virtual","new","sealed","partial"],r=["default","false","null","true"],i=["abstract","as","base","break","case","catch","class","const","continue","do","else","event","explicit","extern","finally","fixed","for","foreach","goto","if","implicit","in","interface","internal","is","lock","namespace","new","operator","out","override","params","private","protected","public","readonly","record","ref","return","scoped","sealed","sizeof","stackalloc","static","struct","switch","this","throw","try","typeof","unchecked","unsafe","using","virtual","void","volatile","while"],o=["add","alias","and","ascending","args","async","await","by","descending","dynamic","equals","file","from","get","global","group","init","into","join","let","nameof","not","notnull","on","or","orderby","partial","record","remove","required","scoped","select","set","unmanaged","value|0","var","when","where","with","yield"],s={keyword:i.concat(o),built_in:n,literal:r},a=e.inherit(e.TITLE_MODE,{begin:"[a-zA-Z](\\.?\\w)*"}),l={className:"number",variants:[{begin:"\\b(0b[01']+)"},{begin:"(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)"},{begin:"(-?)(\\b0[xX][a-fA-F0-9'_]+|(\\b[\\d'_]+(\\.[\\d'_]*)?|\\.[\\d'_]+)([eE][-+]?[\\d'_]+)?)"}],relevance:0},c={className:"string",begin:/"""("*)(?!")(.|\n)*?"""\1/,relevance:1},u={className:"string",begin:'@"',end:'"',contains:[{begin:'""'}]},d=e.inherit(u,{illegal:/\n/}),p={className:"subst",begin:/\{/,end:/\}/,keywords:s},h=e.inherit(p,{illegal:/\n/}),v={className:"string",begin:/\$"/,end:'"',illegal:/\n/,contains:[{begin:/\{\{/},{begin:/\}\}/},e.BACKSLASH_ESCAPE,h]},w={className:"string",begin:/\$@"/,end:'"',contains:[{begin:/\{\{/},{begin:/\}\}/},{begin:'""'},p]},S=e.inherit(w,{illegal:/\n/,contains:[{begin:/\{\{/},{begin:/\}\}/},{begin:'""'},h]});p.contains=[w,v,u,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,l,e.C_BLOCK_COMMENT_MODE],h.contains=[S,v,d,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,l,e.inherit(e.C_BLOCK_COMMENT_MODE,{illegal:/\n/})];const g={variants:[c,w,v,u,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},m={begin:"<",end:">",contains:[{beginKeywords:"in out"},a]},y=e.IDENT_RE+"(<"+e.IDENT_RE+"(\\s*,\\s*"+e.IDENT_RE+")*>)?(\\[\\])?",_={begin:"@"+e.IDENT_RE,relevance:0};return{name:"C#",aliases:["cs","c#"],keywords:s,illegal:/::/,contains:[e.COMMENT("///","$",{returnBegin:!0,contains:[{className:"doctag",variants:[{begin:"///",relevance:0},{begin:"<!--|-->"},{begin:"</?",end:">"}]}]}),e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{className:"meta",begin:"#",end:"$",keywords:{keyword:"if else elif endif define undef warning error line region endregion pragma checksum"}},g,l,{beginKeywords:"class interface",relevance:0,end:/[{;=]/,illegal:/[^\s:,]/,contains:[{beginKeywords:"where class"},a,m,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{beginKeywords:"namespace",relevance:0,end:/[{;=]/,illegal:/[^\s:]/,contains:[a,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{beginKeywords:"record",relevance:0,end:/[{;=]/,illegal:/[^\s:]/,contains:[a,m,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{className:"meta",begin:"^\\s*\\[(?=[\\w])",excludeBegin:!0,end:"\\]",excludeEnd:!0,contains:[{className:"string",begin:/"/,end:/"/}]},{beginKeywords:"new return throw await else",relevance:0},{className:"function",begin:"("+y+"\\s+)+"+e.IDENT_RE+"\\s*(<[^=]+>\\s*)?\\(",returnBegin:!0,end:/\s*[{;=]/,excludeEnd:!0,keywords:s,contains:[{beginKeywords:t.join(" "),relevance:0},{begin:e.IDENT_RE+"\\s*(<[^=]+>\\s*)?\\(",returnBegin:!0,contains:[e.TITLE_MODE,m],relevance:0},{match:/\(\)/},{className:"params",begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:s,relevance:0,contains:[g,l,e.C_BLOCK_COMMENT_MODE]},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},_]}}const tT=e=>({IMPORTANT:{scope:"meta",begin:"!important"},BLOCK_COMMENT:e.C_BLOCK_COMMENT_MODE,HEXCOLOR:{scope:"number",begin:/#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/},UNICODE_RANGE:{scope:"number",begin:/\b[Uu]\+[0-9A-Fa-f][0-9A-Fa-f?]{0,4}(-[0-9A-Fa-f][0-9A-Fa-f]{0,4})?/},FUNCTION_DISPATCH:{className:"built_in",begin:/[\w-]+(?=\()/},ATTRIBUTE_SELECTOR_MODE:{scope:"selector-attr",begin:/\[/,end:/\]/,illegal:"$",contains:[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},CSS_NUMBER_MODE:{scope:"number",begin:e.NUMBER_RE+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",relevance:0},CSS_VARIABLE:{className:"attr",begin:/--[A-Za-z_][A-Za-z0-9_-]*/}}),rT=["a","abbr","address","article","aside","audio","b","blockquote","body","button","canvas","caption","cite","code","dd","del","details","dfn","div","dl","dt","em","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","html","i","iframe","img","input","ins","kbd","label","legend","li","main","mark","menu","nav","object","ol","optgroup","option","p","picture","q","quote","samp","section","select","source","span","strong","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","ul","var","video"],iT=["defs","g","marker","mask","pattern","svg","switch","symbol","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feFlood","feGaussianBlur","feImage","feMerge","feMorphology","feOffset","feSpecularLighting","feTile","feTurbulence","linearGradient","radialGradient","stop","circle","ellipse","image","line","path","polygon","polyline","rect","text","use","textPath","tspan","foreignObject","clipPath"],oT=[...rT,...iT],sT=["any-hover","any-pointer","aspect-ratio","color","color-gamut","color-index","device-aspect-ratio","device-height","device-width","display-mode","forced-colors","grid","height","hover","inverted-colors","monochrome","orientation","overflow-block","overflow-inline","pointer","prefers-color-scheme","prefers-contrast","prefers-reduced-motion","prefers-reduced-transparency","resolution","scan","scripting","update","width","min-width","max-width","min-height","max-height"].sort().reverse(),aT=["active","any-link","blank","checked","current","default","defined","dir","disabled","drop","empty","enabled","first","first-child","first-of-type","fullscreen","future","focus","focus-visible","focus-within","has","host","host-context","hover","indeterminate","in-range","invalid","is","lang","last-child","last-of-type","left","link","local-link","not","nth-child","nth-col","nth-last-child","nth-last-col","nth-last-of-type","nth-of-type","only-child","only-of-type","optional","out-of-range","past","placeholder-shown","read-only","read-write","required","right","root","scope","target","target-within","user-invalid","valid","visited","where"].sort().reverse(),lT=["after","backdrop","before","cue","cue-region","first-letter","first-line","grammar-error","marker","part","placeholder","selection","slotted","spelling-error"].sort().reverse(),cT=["accent-color","align-content","align-items","align-self","alignment-baseline","all","anchor-name","animation","animation-composition","animation-delay","animation-direction","animation-duration","animation-fill-mode","animation-iteration-count","animation-name","animation-play-state","animation-range","animation-range-end","animation-range-start","animation-timeline","animation-timing-function","appearance","aspect-ratio","backdrop-filter","backface-visibility","background","background-attachment","background-blend-mode","background-clip","background-color","background-image","background-origin","background-position","background-position-x","background-position-y","background-repeat","background-size","baseline-shift","block-size","border","border-block","border-block-color","border-block-end","border-block-end-color","border-block-end-style","border-block-end-width","border-block-start","border-block-start-color","border-block-start-style","border-block-start-width","border-block-style","border-block-width","border-bottom","border-bottom-color","border-bottom-left-radius","border-bottom-right-radius","border-bottom-style","border-bottom-width","border-collapse","border-color","border-end-end-radius","border-end-start-radius","border-image","border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width","border-inline","border-inline-color","border-inline-end","border-inline-end-color","border-inline-end-style","border-inline-end-width","border-inline-start","border-inline-start-color","border-inline-start-style","border-inline-start-width","border-inline-style","border-inline-width","border-left","border-left-color","border-left-style","border-left-width","border-radius","border-right","border-right-color","border-right-style","border-right-width","border-spacing","border-start-end-radius","border-start-start-radius","border-style","border-top","border-top-color","border-top-left-radius","border-top-right-radius","border-top-style","border-top-width","border-width","bottom","box-align","box-decoration-break","box-direction","box-flex","box-flex-group","box-lines","box-ordinal-group","box-orient","box-pack","box-shadow","box-sizing","break-after","break-before","break-inside","caption-side","caret-color","clear","clip","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","color-scheme","column-count","column-fill","column-gap","column-rule","column-rule-color","column-rule-style","column-rule-width","column-span","column-width","columns","contain","contain-intrinsic-block-size","contain-intrinsic-height","contain-intrinsic-inline-size","contain-intrinsic-size","contain-intrinsic-width","container","container-name","container-type","content","content-visibility","counter-increment","counter-reset","counter-set","cue","cue-after","cue-before","cursor","cx","cy","direction","display","dominant-baseline","empty-cells","enable-background","field-sizing","fill","fill-opacity","fill-rule","filter","flex","flex-basis","flex-direction","flex-flow","flex-grow","flex-shrink","flex-wrap","float","flood-color","flood-opacity","flow","font","font-display","font-family","font-feature-settings","font-kerning","font-language-override","font-optical-sizing","font-palette","font-size","font-size-adjust","font-smooth","font-smoothing","font-stretch","font-style","font-synthesis","font-synthesis-position","font-synthesis-small-caps","font-synthesis-style","font-synthesis-weight","font-variant","font-variant-alternates","font-variant-caps","font-variant-east-asian","font-variant-emoji","font-variant-ligatures","font-variant-numeric","font-variant-position","font-variation-settings","font-weight","forced-color-adjust","gap","glyph-orientation-horizontal","glyph-orientation-vertical","grid","grid-area","grid-auto-columns","grid-auto-flow","grid-auto-rows","grid-column","grid-column-end","grid-column-start","grid-gap","grid-row","grid-row-end","grid-row-start","grid-template","grid-template-areas","grid-template-columns","grid-template-rows","hanging-punctuation","height","hyphenate-character","hyphenate-limit-chars","hyphens","icon","image-orientation","image-rendering","image-resolution","ime-mode","initial-letter","initial-letter-align","inline-size","inset","inset-area","inset-block","inset-block-end","inset-block-start","inset-inline","inset-inline-end","inset-inline-start","isolation","justify-content","justify-items","justify-self","kerning","left","letter-spacing","lighting-color","line-break","line-height","line-height-step","list-style","list-style-image","list-style-position","list-style-type","margin","margin-block","margin-block-end","margin-block-start","margin-bottom","margin-inline","margin-inline-end","margin-inline-start","margin-left","margin-right","margin-top","margin-trim","marker","marker-end","marker-mid","marker-start","marks","mask","mask-border","mask-border-mode","mask-border-outset","mask-border-repeat","mask-border-slice","mask-border-source","mask-border-width","mask-clip","mask-composite","mask-image","mask-mode","mask-origin","mask-position","mask-repeat","mask-size","mask-type","masonry-auto-flow","math-depth","math-shift","math-style","max-block-size","max-height","max-inline-size","max-width","min-block-size","min-height","min-inline-size","min-width","mix-blend-mode","nav-down","nav-index","nav-left","nav-right","nav-up","none","normal","object-fit","object-position","offset","offset-anchor","offset-distance","offset-path","offset-position","offset-rotate","opacity","order","orphans","outline","outline-color","outline-offset","outline-style","outline-width","overflow","overflow-anchor","overflow-block","overflow-clip-margin","overflow-inline","overflow-wrap","overflow-x","overflow-y","overlay","overscroll-behavior","overscroll-behavior-block","overscroll-behavior-inline","overscroll-behavior-x","overscroll-behavior-y","padding","padding-block","padding-block-end","padding-block-start","padding-bottom","padding-inline","padding-inline-end","padding-inline-start","padding-left","padding-right","padding-top","page","page-break-after","page-break-before","page-break-inside","paint-order","pause","pause-after","pause-before","perspective","perspective-origin","place-content","place-items","place-self","pointer-events","position","position-anchor","position-visibility","print-color-adjust","quotes","r","resize","rest","rest-after","rest-before","right","rotate","row-gap","ruby-align","ruby-position","scale","scroll-behavior","scroll-margin","scroll-margin-block","scroll-margin-block-end","scroll-margin-block-start","scroll-margin-bottom","scroll-margin-inline","scroll-margin-inline-end","scroll-margin-inline-start","scroll-margin-left","scroll-margin-right","scroll-margin-top","scroll-padding","scroll-padding-block","scroll-padding-block-end","scroll-padding-block-start","scroll-padding-bottom","scroll-padding-inline","scroll-padding-inline-end","scroll-padding-inline-start","scroll-padding-left","scroll-padding-right","scroll-padding-top","scroll-snap-align","scroll-snap-stop","scroll-snap-type","scroll-timeline","scroll-timeline-axis","scroll-timeline-name","scrollbar-color","scrollbar-gutter","scrollbar-width","shape-image-threshold","shape-margin","shape-outside","shape-rendering","speak","speak-as","src","stop-color","stop-opacity","stroke","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width","tab-size","table-layout","text-align","text-align-all","text-align-last","text-anchor","text-combine-upright","text-decoration","text-decoration-color","text-decoration-line","text-decoration-skip","text-decoration-skip-ink","text-decoration-style","text-decoration-thickness","text-emphasis","text-emphasis-color","text-emphasis-position","text-emphasis-style","text-indent","text-justify","text-orientation","text-overflow","text-rendering","text-shadow","text-size-adjust","text-transform","text-underline-offset","text-underline-position","text-wrap","text-wrap-mode","text-wrap-style","timeline-scope","top","touch-action","transform","transform-box","transform-origin","transform-style","transition","transition-behavior","transition-delay","transition-duration","transition-property","transition-timing-function","translate","unicode-bidi","unicode-range","user-modify","user-select","vector-effect","vertical-align","view-timeline","view-timeline-axis","view-timeline-inset","view-timeline-name","view-transition-name","visibility","voice-balance","voice-duration","voice-family","voice-pitch","voice-range","voice-rate","voice-stress","voice-volume","white-space","white-space-collapse","widows","width","will-change","word-break","word-spacing","word-wrap","writing-mode","x","y","z-index","zoom"].sort().reverse();function uT(e){const n=e.regex,t=tT(e),r={begin:/-(webkit|moz|ms|o)-(?=[a-z])/},i="and or not only",o=/@-?\w[\w]*(-\w+)*/,s="[a-zA-Z-][a-zA-Z0-9_-]*",a=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE];return{name:"CSS",case_insensitive:!0,illegal:/[=|'\$]/,keywords:{keyframePosition:"from to"},classNameAliases:{keyframePosition:"selector-tag"},contains:[t.BLOCK_COMMENT,r,t.CSS_NUMBER_MODE,{className:"selector-id",begin:/#[A-Za-z0-9_-]+/,relevance:0},{className:"selector-class",begin:"\\."+s,relevance:0},t.ATTRIBUTE_SELECTOR_MODE,{className:"selector-pseudo",variants:[{begin:":("+aT.join("|")+")"},{begin:":(:)?("+lT.join("|")+")"}]},t.CSS_VARIABLE,{className:"attribute",begin:"\\b("+cT.join("|")+")\\b"},{begin:/:/,end:/[;}{]/,contains:[t.BLOCK_COMMENT,t.HEXCOLOR,t.IMPORTANT,t.CSS_NUMBER_MODE,t.UNICODE_RANGE,...a,{begin:/(url|data-uri)\(/,end:/\)/,relevance:0,keywords:{built_in:"url data-uri"},contains:[...a,{className:"string",begin:/[^)]/,endsWithParent:!0,excludeEnd:!0}]},t.FUNCTION_DISPATCH]},{begin:n.lookahead(/@/),end:"[{;]",relevance:0,illegal:/:/,contains:[{className:"keyword",begin:o},{begin:/\s/,endsWithParent:!0,excludeEnd:!0,relevance:0,keywords:{$pattern:/[a-z-]+/,keyword:i,attribute:sT.join(" ")},contains:[{begin:/[a-z-]+(?=:)/,className:"attribute"},...a,t.CSS_NUMBER_MODE]}]},{className:"selector-tag",begin:"\\b("+oT.join("|")+")\\b"}]}}function dT(e){const n=e.regex;return{name:"Diff",aliases:["patch"],contains:[{className:"meta",relevance:10,match:n.either(/^@@ +-\d+,\d+ +\+\d+,\d+ +@@/,/^@@ +-\d+ +\+\d+,\d+ +@@/,/^@@ +-\d+,\d+ +\+\d+ +@@/,/^@@ +-\d+ +\+\d+ +@@/,/^\*\*\* +\d+,\d+ +\*\*\*\*$/,/^--- +\d+,\d+ +----$/)},{className:"comment",variants:[{begin:n.either(/Index: /,/^index/,/={3,}/,/^-{3}/,/^\*{3} /,/^\+{3}/,/^diff --git/),end:/$/},{match:/^\*{15}$/}]},{className:"addition",begin:/^\+/,end:/$/},{className:"deletion",begin:/^-/,end:/$/},{className:"addition",begin:/^!/,end:/$/}]}}function pT(e){const o={keyword:["break","case","chan","const","continue","default","defer","else","fallthrough","for","func","go","goto","if","import","interface","map","package","range","return","select","struct","switch","type","var"],type:["bool","byte","complex64","complex128","error","float32","float64","int8","int16","int32","int64","string","uint8","uint16","uint32","uint64","int","uint","uintptr","rune"],literal:["true","false","iota","nil"],built_in:["append","cap","close","complex","copy","imag","len","make","new","panic","print","println","real","recover","delete"]};return{name:"Go",aliases:["golang"],keywords:o,illegal:"</",contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{className:"string",variants:[e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,{begin:"`",end:"`"}]},{className:"number",variants:[{match:/-?\b0[xX]\.[a-fA-F0-9](_?[a-fA-F0-9])*[pP][+-]?\d(_?\d)*i?/,relevance:0},{match:/-?\b0[xX](_?[a-fA-F0-9])+((\.([a-fA-F0-9](_?[a-fA-F0-9])*)?)?[pP][+-]?\d(_?\d)*)?i?/,relevance:0},{match:/-?\b0[oO](_?[0-7])*i?/,relevance:0},{match:/-?\.\d(_?\d)*([eE][+-]?\d(_?\d)*)?i?/,relevance:0},{match:/-?\b\d(_?\d)*(\.(\d(_?\d)*)?)?([eE][+-]?\d(_?\d)*)?i?/,relevance:0}]},{begin:/:=/},{className:"function",beginKeywords:"func",end:"\\s*(\\{|$)",excludeEnd:!0,contains:[e.TITLE_MODE,{className:"params",begin:/\(/,end:/\)/,endsParent:!0,keywords:o,illegal:/["']/}]}]}}function fT(e){const n=e.regex,t=/[_A-Za-z][_0-9A-Za-z]*/;return{name:"GraphQL",aliases:["gql"],case_insensitive:!0,disableAutodetect:!1,keywords:{keyword:["query","mutation","subscription","type","input","schema","directive","interface","union","scalar","fragment","enum","on"],literal:["true","false","null"]},contains:[e.HASH_COMMENT_MODE,e.QUOTE_STRING_MODE,e.NUMBER_MODE,{scope:"punctuation",match:/[.]{3}/,relevance:0},{scope:"punctuation",begin:/[\!\(\)\:\=\[\]\{\|\}]{1}/,relevance:0},{scope:"variable",begin:/\$/,end:/\W/,excludeEnd:!0,relevance:0},{scope:"meta",match:/@\w+/,excludeEnd:!0},{scope:"symbol",begin:n.concat(t,n.lookahead(/\s*:/)),relevance:0}],illegal:[/[;<']/,/BEGIN/]}}function hT(e){const n=e.regex,t={className:"number",relevance:0,variants:[{begin:/([+-]+)?[\d]+_[\d_]+/},{begin:e.NUMBER_RE}]},r=e.COMMENT();r.variants=[{begin:/;/,end:/$/},{begin:/#/,end:/$/}];const i={className:"variable",variants:[{begin:/\$[\w\d"][\w\d_]*/},{begin:/\$\{(.*?)\}/}]},o={className:"literal",begin:/\bon|off|true|false|yes|no\b/},s={className:"string",contains:[e.BACKSLASH_ESCAPE],variants:[{begin:"'''",end:"'''",relevance:10},{begin:'"""',end:'"""',relevance:10},{begin:'"',end:'"'},{begin:"'",end:"'"}]},a={begin:/\[/,end:/\]/,contains:[r,o,i,s,t,"self"],relevance:0},l=/[A-Za-z0-9_-]+/,c=/"(\\"|[^"])*"/,u=/'[^']*'/,d=n.either(l,c,u),p=n.concat(d,"(\\s*\\.\\s*",d,")*",n.lookahead(/\s*=\s*[^#\s]/));return{name:"TOML, also INI",aliases:["toml"],case_insensitive:!0,illegal:/\S/,contains:[r,{className:"section",begin:/\[+/,end:/\]+/},{begin:p,className:"attr",starts:{end:/$/,contains:[r,a,o,i,s,t]}}]}}var sr="[0-9](_*[0-9])*",bo=`\\.(${sr})`,vo="[0-9a-fA-F](_*[0-9a-fA-F])*",kp={className:"number",variants:[{begin:`(\\b(${sr})((${bo})|\\.)?|(${bo}))[eE][+-]?(${sr})[fFdD]?\\b`},{begin:`\\b(${sr})((${bo})[fFdD]?\\b|\\.([fFdD]\\b)?)`},{begin:`(${bo})[fFdD]?\\b`},{begin:`\\b(${sr})[fFdD]\\b`},{begin:`\\b0[xX]((${vo})\\.?|(${vo})?\\.(${vo}))[pP][+-]?(${sr})[fFdD]?\\b`},{begin:"\\b(0|[1-9](_*[0-9])*)[lL]?\\b"},{begin:`\\b0[xX](${vo})[lL]?\\b`},{begin:"\\b0(_*[0-7])*[lL]?\\b"},{begin:"\\b0[bB][01](_*[01])*[lL]?\\b"}],relevance:0};function om(e,n,t){return t===-1?"":e.replace(n,r=>om(e,n,t-1))}function gT(e){const n=e.regex,t="[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*",r=t+om("(?:<"+t+"~~~(?:\\s*,\\s*"+t+"~~~)*>)?",/~~~/g,2),l={keyword:["synchronized","abstract","private","var","static","if","const ","for","while","strictfp","finally","protected","import","native","final","void","enum","else","break","transient","catch","instanceof","volatile","case","assert","package","default","public","try","switch","continue","throws","protected","public","private","module","requires","exports","do","sealed","yield","permits","goto","when"],literal:["false","true","null"],type:["char","boolean","long","float","int","byte","short","double"],built_in:["super","this"]},c={className:"meta",begin:"@"+t,contains:[{begin:/\(/,end:/\)/,contains:["self"]}]},u={className:"params",begin:/\(/,end:/\)/,keywords:l,relevance:0,contains:[e.C_BLOCK_COMMENT_MODE],endsParent:!0};return{name:"Java",aliases:["jsp"],keywords:l,illegal:/<\/|#/,contains:[e.COMMENT("/\\*\\*","\\*/",{relevance:0,contains:[{begin:/\w+@/,relevance:0},{className:"doctag",begin:"@[A-Za-z]+"}]}),{begin:/import java\.[a-z]+\./,keywords:"import",relevance:2},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{begin:/"""/,end:/"""/,className:"string",contains:[e.BACKSLASH_ESCAPE]},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,{match:[/\b(?:class|interface|enum|extends|implements|new)/,/\s+/,t],className:{1:"keyword",3:"title.class"}},{match:/non-sealed/,scope:"keyword"},{begin:[n.concat(/(?!else)/,t),/\s+/,t,/\s+/,/=(?!=)/],className:{1:"type",3:"variable",5:"operator"}},{begin:[/record/,/\s+/,t],className:{1:"keyword",3:"title.class"},contains:[u,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{beginKeywords:"new throw return else",relevance:0},{begin:["(?:"+r+"\\s+)",e.UNDERSCORE_IDENT_RE,/\s*(?=\()/],className:{2:"title.function"},keywords:l,contains:[{className:"params",begin:/\(/,end:/\)/,keywords:l,relevance:0,contains:[c,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,kp,e.C_BLOCK_COMMENT_MODE]},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},kp,c]}}const Ep="[A-Za-z$_][0-9A-Za-z$_]*",mT=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],yT=["true","false","null","undefined","NaN","Infinity"],sm=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],am=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],lm=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],bT=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","global"],vT=[].concat(lm,sm,am);function wT(e){const n=e.regex,t=(R,{after:M})=>{const b="</"+R[0].slice(1);return R.input.indexOf(b,M)!==-1},r=Ep,i={begin:"<>",end:"</>"},o=/<[A-Za-z0-9\\._:-]+\s*\/>/,s={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(R,M)=>{const b=R[0].length+R.index,$=R.input[b];if($==="<"||$===","){M.ignoreMatch();return}$===">"&&(t(R,{after:b})||M.ignoreMatch());let W;const E=R.input.substring(b);if(W=E.match(/^\s*=/)){M.ignoreMatch();return}if((W=E.match(/^\s+extends\s+/))&&W.index===0){M.ignoreMatch();return}}},a={$pattern:Ep,keyword:mT,literal:yT,built_in:vT,"variable.language":bT},l="[0-9](_?[0-9])*",c=`\\.(${l})`,u="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",d={className:"number",variants:[{begin:`(\\b(${u})((${c})|\\.)?|(${c}))[eE][+-]?(${l})\\b`},{begin:`\\b(${u})\\b((${c})\\b|\\.)?|(${c})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},p={className:"subst",begin:"\\$\\{",end:"\\}",keywords:a,contains:[]},h={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,p],subLanguage:"xml"}},v={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,p],subLanguage:"css"}},w={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,p],subLanguage:"graphql"}},S={className:"string",begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE,p]},m={className:"comment",variants:[e.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:r+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE]},y=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,h,v,w,S,{match:/\$\d+/},d];p.contains=y.concat({begin:/\{/,end:/\}/,keywords:a,contains:["self"].concat(y)});const _=[].concat(m,p.contains),N=_.concat([{begin:/(\s*)\(/,end:/\)/,keywords:a,contains:["self"].concat(_)}]),k={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:N},I={variants:[{match:[/class/,/\s+/,r,/\s+/,/extends/,/\s+/,n.concat(r,"(",n.concat(/\./,r),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,r],scope:{1:"keyword",3:"title.class"}}]},D={relevance:0,match:n.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...sm,...am]}},z={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},U={variants:[{match:[/function/,/\s+/,r,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[k],illegal:/%/},H={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function G(R){return n.concat("(?!",R.join("|"),")")}const J={match:n.concat(/\b/,G([...lm,"super","import","await"].map(R=>`${R}\\s*\\(`)),r,n.lookahead(/\s*\(/)),className:"title.function",relevance:0},Q={begin:n.concat(/\./,n.lookahead(n.concat(r,/(?![0-9A-Za-z$_(])/))),end:r,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},q={match:[/get|set/,/\s+/,r,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},k]},C="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+e.UNDERSCORE_IDENT_RE+")\\s*=>",O={match:[/const|var|let/,/\s+/,r,/\s*/,/=\s*/,/(async\s*)?/,n.lookahead(C)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[k]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:a,exports:{PARAMS_CONTAINS:N,CLASS_REFERENCE:D},illegal:/#(?![$_A-Za-z])/,contains:[e.SHEBANG({label:"shebang",binary:"node",relevance:5}),z,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,h,v,w,S,m,{match:/\$\d+/},d,D,{scope:"attr",match:r+n.lookahead(":"),relevance:0},O,{begin:"("+e.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[m,e.REGEXP_MODE,{className:"function",begin:C,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:e.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:N}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:i.begin,end:i.end},{match:o},{begin:s.begin,"on:begin":s.isTrulyOpeningTag,end:s.end}],subLanguage:"xml",contains:[{begin:s.begin,end:s.end,skip:!0,contains:["self"]}]}]},U,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+e.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[k,e.inherit(e.TITLE_MODE,{begin:r,className:"title.function"})]},{match:/\.\.\./,relevance:0},Q,{match:"\\$"+r,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[k]},J,H,I,q,{match:/\$[(.]/}]}}const xT="([-+]?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)|NaN|[-+]?Infinity",ST={scope:"number",match:xT,relevance:0};function kT(e){const n={className:"attr",begin:/(("(\\.|[^\\"\r\n])*")|('(\\.|[^\\'\r\n])*'))(?=\s*:)/,relevance:1.01},t={match:/[{}[\],:]/,className:"punctuation",relevance:0},r=["true","false","null"],i={scope:"literal",beginKeywords:r.join(" ")};return{name:"JSON",aliases:["jsonc","json5"],keywords:{literal:r},contains:[n,t,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,i,ST,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE],illegal:"\\S"}}var ar="[0-9](_*[0-9])*",wo=`\\.(${ar})`,xo="[0-9a-fA-F](_*[0-9a-fA-F])*",ET={className:"number",variants:[{begin:`(\\b(${ar})((${wo})|\\.)?|(${wo}))[eE][+-]?(${ar})[fFdD]?\\b`},{begin:`\\b(${ar})((${wo})[fFdD]?\\b|\\.([fFdD]\\b)?)`},{begin:`(${wo})[fFdD]?\\b`},{begin:`\\b(${ar})[fFdD]\\b`},{begin:`\\b0[xX]((${xo})\\.?|(${xo})?\\.(${xo}))[pP][+-]?(${ar})[fFdD]?\\b`},{begin:"\\b(0|[1-9](_*[0-9])*)[lL]?\\b"},{begin:`\\b0[xX](${xo})[lL]?\\b`},{begin:"\\b0(_*[0-7])*[lL]?\\b"},{begin:"\\b0[bB][01](_*[01])*[lL]?\\b"}],relevance:0};function _T(e){const n={keyword:"abstract as val var vararg get set class object open private protected public noinline crossinline dynamic final enum if else do while for when throw try catch finally import package is in fun override companion reified inline lateinit init interface annotation data sealed internal infix operator out by constructor super tailrec where const inner suspend typealias external expect actual",built_in:"Byte Short Char Int Long Boolean Float Double Void Unit Nothing",literal:"true false null"},t={className:"keyword",begin:/\b(break|continue|return|this)\b/,starts:{contains:[{className:"symbol",begin:/@\w+/}]}},r={className:"symbol",begin:e.UNDERSCORE_IDENT_RE+"@"},i={className:"subst",begin:/\$\{/,end:/\}/,contains:[e.C_NUMBER_MODE]},o={className:"variable",begin:"\\$"+e.UNDERSCORE_IDENT_RE},s={className:"string",variants:[{begin:'"""',end:'"""(?=[^"])',contains:[o,i]},{begin:"'",end:"'",illegal:/\n/,contains:[e.BACKSLASH_ESCAPE]},{begin:'"',end:'"',illegal:/\n/,contains:[e.BACKSLASH_ESCAPE,o,i]}]};i.contains.push(s);const a={className:"meta",begin:"@(?:file|property|field|get|set|receiver|param|setparam|delegate)\\s*:(?:\\s*"+e.UNDERSCORE_IDENT_RE+")?"},l={className:"meta",begin:"@"+e.UNDERSCORE_IDENT_RE,contains:[{begin:/\(/,end:/\)/,contains:[e.inherit(s,{className:"string"}),"self"]}]},c=ET,u=e.COMMENT("/\\*","\\*/",{contains:[e.C_BLOCK_COMMENT_MODE]}),d={variants:[{className:"type",begin:e.UNDERSCORE_IDENT_RE},{begin:/\(/,end:/\)/,contains:[]}]},p=d;return p.variants[1].contains=[d],d.variants[1].contains=[p],{name:"Kotlin",aliases:["kt","kts"],keywords:n,contains:[e.COMMENT("/\\*\\*","\\*/",{relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"}]}),e.C_LINE_COMMENT_MODE,u,t,r,a,l,{className:"function",beginKeywords:"fun",end:"[(]|$",returnBegin:!0,excludeEnd:!0,keywords:n,relevance:5,contains:[{begin:e.UNDERSCORE_IDENT_RE+"\\s*\\(",returnBegin:!0,relevance:0,contains:[e.UNDERSCORE_TITLE_MODE]},{className:"type",begin:/</,end:/>/,keywords:"reified",relevance:0},{className:"params",begin:/\(/,end:/\)/,endsParent:!0,keywords:n,relevance:0,contains:[{begin:/:/,end:/[=,\/]/,endsWithParent:!0,contains:[d,e.C_LINE_COMMENT_MODE,u],relevance:0},e.C_LINE_COMMENT_MODE,u,a,l,s,e.C_NUMBER_MODE]},u]},{begin:[/class|interface|trait/,/\s+/,e.UNDERSCORE_IDENT_RE],beginScope:{3:"title.class"},keywords:"class interface trait",end:/[:\{(]|$/,excludeEnd:!0,illegal:"extends implements",contains:[{beginKeywords:"public protected internal private constructor"},e.UNDERSCORE_TITLE_MODE,{className:"type",begin:/</,end:/>/,excludeBegin:!0,excludeEnd:!0,relevance:0},{className:"type",begin:/[,:]\s*/,end:/[<\(,){\s]|$/,excludeBegin:!0,returnEnd:!0},a,l]},s,{className:"meta",begin:"^#!/usr/bin/env",end:"$",illegal:`
`},c]}}const CT=e=>({IMPORTANT:{scope:"meta",begin:"!important"},BLOCK_COMMENT:e.C_BLOCK_COMMENT_MODE,HEXCOLOR:{scope:"number",begin:/#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/},UNICODE_RANGE:{scope:"number",begin:/\b[Uu]\+[0-9A-Fa-f][0-9A-Fa-f?]{0,4}(-[0-9A-Fa-f][0-9A-Fa-f]{0,4})?/},FUNCTION_DISPATCH:{className:"built_in",begin:/[\w-]+(?=\()/},ATTRIBUTE_SELECTOR_MODE:{scope:"selector-attr",begin:/\[/,end:/\]/,illegal:"$",contains:[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},CSS_NUMBER_MODE:{scope:"number",begin:e.NUMBER_RE+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",relevance:0},CSS_VARIABLE:{className:"attr",begin:/--[A-Za-z_][A-Za-z0-9_-]*/}}),TT=["a","abbr","address","article","aside","audio","b","blockquote","body","button","canvas","caption","cite","code","dd","del","details","dfn","div","dl","dt","em","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","html","i","iframe","img","input","ins","kbd","label","legend","li","main","mark","menu","nav","object","ol","optgroup","option","p","picture","q","quote","samp","section","select","source","span","strong","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","ul","var","video"],RT=["defs","g","marker","mask","pattern","svg","switch","symbol","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feFlood","feGaussianBlur","feImage","feMerge","feMorphology","feOffset","feSpecularLighting","feTile","feTurbulence","linearGradient","radialGradient","stop","circle","ellipse","image","line","path","polygon","polyline","rect","text","use","textPath","tspan","foreignObject","clipPath"],NT=[...TT,...RT],IT=["any-hover","any-pointer","aspect-ratio","color","color-gamut","color-index","device-aspect-ratio","device-height","device-width","display-mode","forced-colors","grid","height","hover","inverted-colors","monochrome","orientation","overflow-block","overflow-inline","pointer","prefers-color-scheme","prefers-contrast","prefers-reduced-motion","prefers-reduced-transparency","resolution","scan","scripting","update","width","min-width","max-width","min-height","max-height"].sort().reverse(),cm=["active","any-link","blank","checked","current","default","defined","dir","disabled","drop","empty","enabled","first","first-child","first-of-type","fullscreen","future","focus","focus-visible","focus-within","has","host","host-context","hover","indeterminate","in-range","invalid","is","lang","last-child","last-of-type","left","link","local-link","not","nth-child","nth-col","nth-last-child","nth-last-col","nth-last-of-type","nth-of-type","only-child","only-of-type","optional","out-of-range","past","placeholder-shown","read-only","read-write","required","right","root","scope","target","target-within","user-invalid","valid","visited","where"].sort().reverse(),um=["after","backdrop","before","cue","cue-region","first-letter","first-line","grammar-error","marker","part","placeholder","selection","slotted","spelling-error"].sort().reverse(),AT=["accent-color","align-content","align-items","align-self","alignment-baseline","all","anchor-name","animation","animation-composition","animation-delay","animation-direction","animation-duration","animation-fill-mode","animation-iteration-count","animation-name","animation-play-state","animation-range","animation-range-end","animation-range-start","animation-timeline","animation-timing-function","appearance","aspect-ratio","backdrop-filter","backface-visibility","background","background-attachment","background-blend-mode","background-clip","background-color","background-image","background-origin","background-position","background-position-x","background-position-y","background-repeat","background-size","baseline-shift","block-size","border","border-block","border-block-color","border-block-end","border-block-end-color","border-block-end-style","border-block-end-width","border-block-start","border-block-start-color","border-block-start-style","border-block-start-width","border-block-style","border-block-width","border-bottom","border-bottom-color","border-bottom-left-radius","border-bottom-right-radius","border-bottom-style","border-bottom-width","border-collapse","border-color","border-end-end-radius","border-end-start-radius","border-image","border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width","border-inline","border-inline-color","border-inline-end","border-inline-end-color","border-inline-end-style","border-inline-end-width","border-inline-start","border-inline-start-color","border-inline-start-style","border-inline-start-width","border-inline-style","border-inline-width","border-left","border-left-color","border-left-style","border-left-width","border-radius","border-right","border-right-color","border-right-style","border-right-width","border-spacing","border-start-end-radius","border-start-start-radius","border-style","border-top","border-top-color","border-top-left-radius","border-top-right-radius","border-top-style","border-top-width","border-width","bottom","box-align","box-decoration-break","box-direction","box-flex","box-flex-group","box-lines","box-ordinal-group","box-orient","box-pack","box-shadow","box-sizing","break-after","break-before","break-inside","caption-side","caret-color","clear","clip","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","color-scheme","column-count","column-fill","column-gap","column-rule","column-rule-color","column-rule-style","column-rule-width","column-span","column-width","columns","contain","contain-intrinsic-block-size","contain-intrinsic-height","contain-intrinsic-inline-size","contain-intrinsic-size","contain-intrinsic-width","container","container-name","container-type","content","content-visibility","counter-increment","counter-reset","counter-set","cue","cue-after","cue-before","cursor","cx","cy","direction","display","dominant-baseline","empty-cells","enable-background","field-sizing","fill","fill-opacity","fill-rule","filter","flex","flex-basis","flex-direction","flex-flow","flex-grow","flex-shrink","flex-wrap","float","flood-color","flood-opacity","flow","font","font-display","font-family","font-feature-settings","font-kerning","font-language-override","font-optical-sizing","font-palette","font-size","font-size-adjust","font-smooth","font-smoothing","font-stretch","font-style","font-synthesis","font-synthesis-position","font-synthesis-small-caps","font-synthesis-style","font-synthesis-weight","font-variant","font-variant-alternates","font-variant-caps","font-variant-east-asian","font-variant-emoji","font-variant-ligatures","font-variant-numeric","font-variant-position","font-variation-settings","font-weight","forced-color-adjust","gap","glyph-orientation-horizontal","glyph-orientation-vertical","grid","grid-area","grid-auto-columns","grid-auto-flow","grid-auto-rows","grid-column","grid-column-end","grid-column-start","grid-gap","grid-row","grid-row-end","grid-row-start","grid-template","grid-template-areas","grid-template-columns","grid-template-rows","hanging-punctuation","height","hyphenate-character","hyphenate-limit-chars","hyphens","icon","image-orientation","image-rendering","image-resolution","ime-mode","initial-letter","initial-letter-align","inline-size","inset","inset-area","inset-block","inset-block-end","inset-block-start","inset-inline","inset-inline-end","inset-inline-start","isolation","justify-content","justify-items","justify-self","kerning","left","letter-spacing","lighting-color","line-break","line-height","line-height-step","list-style","list-style-image","list-style-position","list-style-type","margin","margin-block","margin-block-end","margin-block-start","margin-bottom","margin-inline","margin-inline-end","margin-inline-start","margin-left","margin-right","margin-top","margin-trim","marker","marker-end","marker-mid","marker-start","marks","mask","mask-border","mask-border-mode","mask-border-outset","mask-border-repeat","mask-border-slice","mask-border-source","mask-border-width","mask-clip","mask-composite","mask-image","mask-mode","mask-origin","mask-position","mask-repeat","mask-size","mask-type","masonry-auto-flow","math-depth","math-shift","math-style","max-block-size","max-height","max-inline-size","max-width","min-block-size","min-height","min-inline-size","min-width","mix-blend-mode","nav-down","nav-index","nav-left","nav-right","nav-up","none","normal","object-fit","object-position","offset","offset-anchor","offset-distance","offset-path","offset-position","offset-rotate","opacity","order","orphans","outline","outline-color","outline-offset","outline-style","outline-width","overflow","overflow-anchor","overflow-block","overflow-clip-margin","overflow-inline","overflow-wrap","overflow-x","overflow-y","overlay","overscroll-behavior","overscroll-behavior-block","overscroll-behavior-inline","overscroll-behavior-x","overscroll-behavior-y","padding","padding-block","padding-block-end","padding-block-start","padding-bottom","padding-inline","padding-inline-end","padding-inline-start","padding-left","padding-right","padding-top","page","page-break-after","page-break-before","page-break-inside","paint-order","pause","pause-after","pause-before","perspective","perspective-origin","place-content","place-items","place-self","pointer-events","position","position-anchor","position-visibility","print-color-adjust","quotes","r","resize","rest","rest-after","rest-before","right","rotate","row-gap","ruby-align","ruby-position","scale","scroll-behavior","scroll-margin","scroll-margin-block","scroll-margin-block-end","scroll-margin-block-start","scroll-margin-bottom","scroll-margin-inline","scroll-margin-inline-end","scroll-margin-inline-start","scroll-margin-left","scroll-margin-right","scroll-margin-top","scroll-padding","scroll-padding-block","scroll-padding-block-end","scroll-padding-block-start","scroll-padding-bottom","scroll-padding-inline","scroll-padding-inline-end","scroll-padding-inline-start","scroll-padding-left","scroll-padding-right","scroll-padding-top","scroll-snap-align","scroll-snap-stop","scroll-snap-type","scroll-timeline","scroll-timeline-axis","scroll-timeline-name","scrollbar-color","scrollbar-gutter","scrollbar-width","shape-image-threshold","shape-margin","shape-outside","shape-rendering","speak","speak-as","src","stop-color","stop-opacity","stroke","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width","tab-size","table-layout","text-align","text-align-all","text-align-last","text-anchor","text-combine-upright","text-decoration","text-decoration-color","text-decoration-line","text-decoration-skip","text-decoration-skip-ink","text-decoration-style","text-decoration-thickness","text-emphasis","text-emphasis-color","text-emphasis-position","text-emphasis-style","text-indent","text-justify","text-orientation","text-overflow","text-rendering","text-shadow","text-size-adjust","text-transform","text-underline-offset","text-underline-position","text-wrap","text-wrap-mode","text-wrap-style","timeline-scope","top","touch-action","transform","transform-box","transform-origin","transform-style","transition","transition-behavior","transition-delay","transition-duration","transition-property","transition-timing-function","translate","unicode-bidi","unicode-range","user-modify","user-select","vector-effect","vertical-align","view-timeline","view-timeline-axis","view-timeline-inset","view-timeline-name","view-transition-name","visibility","voice-balance","voice-duration","voice-family","voice-pitch","voice-range","voice-rate","voice-stress","voice-volume","white-space","white-space-collapse","widows","width","will-change","word-break","word-spacing","word-wrap","writing-mode","x","y","z-index","zoom"].sort().reverse(),OT=cm.concat(um).sort().reverse();function MT(e){const n=CT(e),t=OT,r="and or not only",i="[\\w-]+",o="("+i+"|@\\{"+i+"\\})",s=[],a=[],l=function(y){return{className:"string",begin:"~?"+y+".*?"+y}},c=function(y,_,N){return{className:y,begin:_,relevance:N}},u={$pattern:/[a-z-]+/,keyword:r,attribute:IT.join(" ")},d={begin:"\\(",end:"\\)",contains:a,keywords:u,relevance:0};a.push(e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,l("'"),l('"'),n.CSS_NUMBER_MODE,{begin:"(url|data-uri)\\(",starts:{className:"string",end:"[\\)\\n]",excludeEnd:!0}},n.UNICODE_RANGE,n.HEXCOLOR,d,c("variable","@@?"+i,10),c("variable","@\\{"+i+"\\}"),c("built_in","~?`[^`]*?`"),{className:"attribute",begin:i+"\\s*:",end:":",returnBegin:!0,excludeEnd:!0},n.IMPORTANT,{beginKeywords:"and not"},n.FUNCTION_DISPATCH);const p=a.concat({begin:/\{/,end:/\}/,contains:s}),h={beginKeywords:"when",endsWithParent:!0,contains:[{beginKeywords:"and not"}].concat(a)},v={begin:o+"\\s*:",returnBegin:!0,end:/[;}]/,relevance:0,contains:[{begin:/-(webkit|moz|ms|o)-/},n.CSS_VARIABLE,{className:"attribute",begin:"\\b("+AT.join("|")+")\\b",end:/(?=:)/,starts:{endsWithParent:!0,illegal:"[<=$]",relevance:0,contains:a}}]},w={className:"keyword",begin:"@(import|media|charset|font-face|(-[a-z]+-)?keyframes|supports|document|namespace|page|viewport|host)\\b",starts:{end:"[;{}]",keywords:u,returnEnd:!0,contains:a,relevance:0}},S={className:"variable",variants:[{begin:"@"+i+"\\s*:",relevance:15},{begin:"@"+i}],starts:{end:"[;}]",returnEnd:!0,contains:p}},g={variants:[{begin:"[\\.#:&\\[>]",end:"[;{}]"},{begin:o,end:/\{/}],returnBegin:!0,returnEnd:!0,illegal:`[<='$"]`,relevance:0,contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,h,c("keyword","all\\b"),c("variable","@\\{"+i+"\\}"),{begin:"\\b("+NT.join("|")+")\\b",className:"selector-tag"},n.CSS_NUMBER_MODE,c("selector-tag",o,0),c("selector-id","#"+o),c("selector-class","\\."+o,0),c("selector-tag","&",0),n.ATTRIBUTE_SELECTOR_MODE,{className:"selector-pseudo",begin:":("+cm.join("|")+")"},{className:"selector-pseudo",begin:":(:)?("+um.join("|")+")"},{begin:/\(/,end:/\)/,relevance:0,contains:p},{begin:"!important"},n.FUNCTION_DISPATCH]},m={begin:i+`:(:)?(${t.join("|")})`,returnBegin:!0,contains:[g]};return s.push(e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,w,S,m,v,g,h,n.FUNCTION_DISPATCH),{name:"Less",case_insensitive:!0,illegal:`[=>'/<($"]`,contains:s}}function DT(e){const n="\\[=*\\[",t="\\]=*\\]",r={begin:n,end:t,contains:["self"]},i=[e.COMMENT("--(?!"+n+")","$"),e.COMMENT("--"+n,t,{contains:[r],relevance:10})];return{name:"Lua",aliases:["pluto"],keywords:{$pattern:e.UNDERSCORE_IDENT_RE,literal:"true false nil",keyword:"and break do else elseif end for goto if in local not or repeat return then until while",built_in:"_G _ENV _VERSION __index __newindex __mode __call __metatable __tostring __len __gc __add __sub __mul __div __mod __pow __concat __unm __eq __lt __le assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawset require select setfenv setmetatable tonumber tostring type unpack xpcall arg self coroutine resume yield status wrap create running debug getupvalue debug sethook getmetatable gethook setmetatable setlocal traceback setfenv getinfo setupvalue getlocal getregistry getfenv io lines write close flush open output type read stderr stdin input stdout popen tmpfile math log max acos huge ldexp pi cos tanh pow deg tan cosh sinh random randomseed frexp ceil floor rad abs sqrt modf asin min mod fmod log10 atan2 exp sin atan os exit setlocale date getenv difftime remove time clock tmpname rename execute package preload loadlib loaded loaders cpath config path seeall string sub upper len gfind rep find match char dump gmatch reverse byte format gsub lower table setn insert getn foreachi maxn foreach concat sort remove"},contains:i.concat([{className:"function",beginKeywords:"function",end:"\\)",contains:[e.inherit(e.TITLE_MODE,{begin:"([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*"}),{className:"params",begin:"\\(",endsWithParent:!0,contains:i}].concat(i)},e.C_NUMBER_MODE,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,{className:"string",begin:n,end:t,contains:[r],relevance:5}])}}function LT(e){const n={className:"variable",variants:[{begin:"\\$\\("+e.UNDERSCORE_IDENT_RE+"\\)",contains:[e.BACKSLASH_ESCAPE]},{begin:/\$[@%<?\^\+\*]/}]},t={className:"string",begin:/"/,end:/"/,contains:[e.BACKSLASH_ESCAPE,n]},r={className:"variable",begin:/\$\([\w-]+\s/,end:/\)/,keywords:{built_in:"subst patsubst strip findstring filter filter-out sort word wordlist firstword lastword dir notdir suffix basename addsuffix addprefix join wildcard realpath abspath error warning shell origin flavor foreach if or and call eval file value"},contains:[n,t]},i={begin:"^"+e.UNDERSCORE_IDENT_RE+"\\s*(?=[:+?]?=)"},o={className:"meta",begin:/^\.PHONY:/,end:/$/,keywords:{$pattern:/[\.\w]+/,keyword:".PHONY"}},s={className:"section",begin:/^[^\s]+:/,end:/$/,contains:[n]};return{name:"Makefile",aliases:["mk","mak","make"],keywords:{$pattern:/[\w-]+/,keyword:"define endef undefine ifdef ifndef ifeq ifneq else endif include -include sinclude override export unexport private vpath"},contains:[e.HASH_COMMENT_MODE,n,t,r,i,o,s]}}function PT(e){const n=e.regex,t={begin:/<\/?[A-Za-z_]/,end:">",subLanguage:"xml",relevance:0},r={begin:"^[-\\*]{3,}",end:"$"},i={className:"code",variants:[{begin:"(`{3,})[^`](.|\\n)*?\\1`*[ ]*"},{begin:"(~{3,})[^~](.|\\n)*?\\1~*[ ]*"},{begin:"```",end:"```+[ ]*$"},{begin:"~~~",end:"~~~+[ ]*$"},{begin:"`.+?`"},{begin:"(?=^( {4}|\\t))",contains:[{begin:"^( {4}|\\t)",end:"(\\n)$"}],relevance:0}]},o={className:"bullet",begin:"^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)",end:"\\s+",excludeEnd:!0},s={begin:/^\[[^\n]+\]:/,returnBegin:!0,contains:[{className:"symbol",begin:/\[/,end:/\]/,excludeBegin:!0,excludeEnd:!0},{className:"link",begin:/:\s*/,end:/$/,excludeBegin:!0}]},a=/[A-Za-z][A-Za-z0-9+.-]*/,l={variants:[{begin:/\[.+?\]\[.*?\]/,relevance:0},{begin:/\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,relevance:2},{begin:n.concat(/\[.+?\]\(/,a,/:\/\/.*?\)/),relevance:2},{begin:/\[.+?\]\([./?&#].*?\)/,relevance:1},{begin:/\[.*?\]\(.*?\)/,relevance:0}],returnBegin:!0,contains:[{match:/\[(?=\])/},{className:"string",relevance:0,begin:"\\[",end:"\\]",excludeBegin:!0,returnEnd:!0},{className:"link",relevance:0,begin:"\\]\\(",end:"\\)",excludeBegin:!0,excludeEnd:!0},{className:"symbol",relevance:0,begin:"\\]\\[",end:"\\]",excludeBegin:!0,excludeEnd:!0}]},c={className:"strong",contains:[],variants:[{begin:/_{2}(?!\s)/,end:/_{2}/},{begin:/\*{2}(?!\s)/,end:/\*{2}/}]},u={className:"emphasis",contains:[],variants:[{begin:/\*(?![*\s])/,end:/\*/},{begin:/_(?![_\s])/,end:/_/,relevance:0}]},d=e.inherit(c,{contains:[]}),p=e.inherit(u,{contains:[]});c.contains.push(p),u.contains.push(d);let h=[t,l];return[c,u,d,p].forEach(g=>{g.contains=g.contains.concat(h)}),h=h.concat(c,u),{name:"Markdown",aliases:["md","mkdown","mkd"],contains:[{className:"section",variants:[{begin:"^#{1,6}",end:"$",contains:h},{begin:"(?=^.+?\\n[=-]{2,}$)",contains:[{begin:"^[=-]*$"},{begin:"^",end:"\\n",contains:h}]}]},t,o,c,u,{className:"quote",begin:"^>\\s+",contains:h,end:"$"},i,r,l,s,{scope:"literal",match:/&([a-zA-Z0-9]+|#[0-9]{1,7}|#[Xx][0-9a-fA-F]{1,6});/}]}}function BT(e){const n={className:"built_in",begin:"\\b(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)\\w+"},t=/[a-zA-Z@][a-zA-Z0-9_]*/,a={"variable.language":["this","super"],$pattern:t,keyword:["while","export","sizeof","typedef","const","struct","for","union","volatile","static","mutable","if","do","return","goto","enum","else","break","extern","asm","case","default","register","explicit","typename","switch","continue","inline","readonly","assign","readwrite","self","@synchronized","id","typeof","nonatomic","IBOutlet","IBAction","strong","weak","copy","in","out","inout","bycopy","byref","oneway","__strong","__weak","__block","__autoreleasing","@private","@protected","@public","@try","@property","@end","@throw","@catch","@finally","@autoreleasepool","@synthesize","@dynamic","@selector","@optional","@required","@encode","@package","@import","@defs","@compatibility_alias","__bridge","__bridge_transfer","__bridge_retained","__bridge_retain","__covariant","__contravariant","__kindof","_Nonnull","_Nullable","_Null_unspecified","__FUNCTION__","__PRETTY_FUNCTION__","__attribute__","getter","setter","retain","unsafe_unretained","nonnull","nullable","null_unspecified","null_resettable","class","instancetype","NS_DESIGNATED_INITIALIZER","NS_UNAVAILABLE","NS_REQUIRES_SUPER","NS_RETURNS_INNER_POINTER","NS_INLINE","NS_AVAILABLE","NS_DEPRECATED","NS_ENUM","NS_OPTIONS","NS_SWIFT_UNAVAILABLE","NS_ASSUME_NONNULL_BEGIN","NS_ASSUME_NONNULL_END","NS_REFINED_FOR_SWIFT","NS_SWIFT_NAME","NS_SWIFT_NOTHROW","NS_DURING","NS_HANDLER","NS_ENDHANDLER","NS_VALUERETURN","NS_VOIDRETURN"],literal:["false","true","FALSE","TRUE","nil","YES","NO","NULL"],built_in:["dispatch_once_t","dispatch_queue_t","dispatch_sync","dispatch_async","dispatch_once"],type:["int","float","char","unsigned","signed","short","long","double","wchar_t","unichar","void","bool","BOOL","id|0","_Bool"]},l={$pattern:t,keyword:["@interface","@class","@protocol","@implementation"]};return{name:"Objective-C",aliases:["mm","objc","obj-c","obj-c++","objective-c++"],keywords:a,illegal:"</",contains:[n,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,e.C_NUMBER_MODE,e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,{className:"string",variants:[{begin:'@"',end:'"',illegal:"\\n",contains:[e.BACKSLASH_ESCAPE]}]},{className:"meta",begin:/#\s*[a-z]+\b/,end:/$/,keywords:{keyword:"if else elif endif define undef warning error line pragma ifdef ifndef include"},contains:[{begin:/\\\n/,relevance:0},e.inherit(e.QUOTE_STRING_MODE,{className:"string"}),{className:"string",begin:/<.*?>/,end:/$/,illegal:"\\n"},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{className:"class",begin:"("+l.keyword.join("|")+")\\b",end:/(\{|$)/,excludeEnd:!0,keywords:l,contains:[e.UNDERSCORE_TITLE_MODE]},{begin:"\\."+e.UNDERSCORE_IDENT_RE,relevance:0}]}}function jT(e){const n=e.regex,t=["abs","accept","alarm","and","atan2","bind","binmode","bless","break","caller","chdir","chmod","chomp","chop","chown","chr","chroot","class","close","closedir","connect","continue","cos","crypt","dbmclose","dbmopen","defined","delete","die","do","dump","each","else","elsif","endgrent","endhostent","endnetent","endprotoent","endpwent","endservent","eof","eval","exec","exists","exit","exp","fcntl","field","fileno","flock","for","foreach","fork","format","formline","getc","getgrent","getgrgid","getgrnam","gethostbyaddr","gethostbyname","gethostent","getlogin","getnetbyaddr","getnetbyname","getnetent","getpeername","getpgrp","getpriority","getprotobyname","getprotobynumber","getprotoent","getpwent","getpwnam","getpwuid","getservbyname","getservbyport","getservent","getsockname","getsockopt","given","glob","gmtime","goto","grep","gt","hex","if","index","int","ioctl","join","keys","kill","last","lc","lcfirst","length","link","listen","local","localtime","log","lstat","lt","ma","map","method","mkdir","msgctl","msgget","msgrcv","msgsnd","my","ne","next","no","not","oct","open","opendir","or","ord","our","pack","package","pipe","pop","pos","print","printf","prototype","push","q|0","qq","quotemeta","qw","qx","rand","read","readdir","readline","readlink","readpipe","recv","redo","ref","rename","require","reset","return","reverse","rewinddir","rindex","rmdir","say","scalar","seek","seekdir","select","semctl","semget","semop","send","setgrent","sethostent","setnetent","setpgrp","setpriority","setprotoent","setpwent","setservent","setsockopt","shift","shmctl","shmget","shmread","shmwrite","shutdown","sin","sleep","socket","socketpair","sort","splice","split","sprintf","sqrt","srand","stat","state","study","sub","substr","symlink","syscall","sysopen","sysread","sysseek","system","syswrite","tell","telldir","tie","tied","time","times","tr","truncate","uc","ucfirst","umask","undef","unless","unlink","unpack","unshift","untie","until","use","utime","values","vec","wait","waitpid","wantarray","warn","when","while","write","x|0","xor","y|0"],r=/[dualxmsipngr]{0,12}/,i={$pattern:/[\w.]+/,keyword:t.join(" ")},o={className:"subst",begin:"[$@]\\{",end:"\\}",keywords:i},s={begin:/->\{/,end:/\}/},a={scope:"attr",match:/\s+:\s*\w+(\s*\(.*?\))?/},l={scope:"variable",variants:[{begin:/\$\d/},{begin:n.concat(/[$%@](?!")(\^\w\b|#\w+(::\w+)*|\{\w+\}|\w+(::\w*)*)/,"(?![A-Za-z])(?![@$%])")},{begin:/[$%@](?!")[^\s\w{=]|\$=/,relevance:0}],contains:[a]},c={className:"number",variants:[{match:/0?\.[0-9][0-9_]+\b/},{match:/\bv?(0|[1-9][0-9_]*(\.[0-9_]+)?|[1-9][0-9_]*)\b/},{match:/\b0[0-7][0-7_]*\b/},{match:/\b0x[0-9a-fA-F][0-9a-fA-F_]*\b/},{match:/\b0b[0-1][0-1_]*\b/}],relevance:0},u=[e.BACKSLASH_ESCAPE,o,l],d=[/!/,/\//,/\|/,/\?/,/'/,/"/,/#/],p=(w,S,g="\\1")=>{const m=g==="\\1"?g:n.concat(g,S);return n.concat(n.concat("(?:",w,")"),S,/(?:\\.|[^\\\/])*?/,m,/(?:\\.|[^\\\/])*?/,g,r)},h=(w,S,g)=>n.concat(n.concat("(?:",w,")"),S,/(?:\\.|[^\\\/])*?/,g,r),v=[l,e.HASH_COMMENT_MODE,e.COMMENT(/^=\w/,/=cut/,{endsWithParent:!0}),s,{className:"string",contains:u,variants:[{begin:"q[qwxr]?\\s*\\(",end:"\\)",relevance:5},{begin:"q[qwxr]?\\s*\\[",end:"\\]",relevance:5},{begin:"q[qwxr]?\\s*\\{",end:"\\}",relevance:5},{begin:"q[qwxr]?\\s*\\|",end:"\\|",relevance:5},{begin:"q[qwxr]?\\s*<",end:">",relevance:5},{begin:"qw\\s+q",end:"q",relevance:5},{begin:"'",end:"'",contains:[e.BACKSLASH_ESCAPE]},{begin:'"',end:'"'},{begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE]},{begin:/\{\w+\}/,relevance:0},{begin:"-?\\w+\\s*=>",relevance:0}]},c,{begin:"(\\/\\/|"+e.RE_STARTERS_RE+"|\\b(split|return|print|reverse|grep)\\b)\\s*",keywords:"split return print reverse grep",relevance:0,contains:[e.HASH_COMMENT_MODE,{className:"regexp",variants:[{begin:p("s|tr|y",n.either(...d,{capture:!0}))},{begin:p("s|tr|y","\\(","\\)")},{begin:p("s|tr|y","\\[","\\]")},{begin:p("s|tr|y","\\{","\\}")}],relevance:2},{className:"regexp",variants:[{begin:/(m|qr)\/\//,relevance:0},{begin:h("(?:m|qr)?",/\//,/\//)},{begin:h("m|qr",n.either(...d,{capture:!0}),/\1/)},{begin:h("m|qr",/\(/,/\)/)},{begin:h("m|qr",/\[/,/\]/)},{begin:h("m|qr",/\{/,/\}/)}]}]},{className:"function",beginKeywords:"sub method",end:"(\\s*\\(.*?\\))?[;{]",excludeEnd:!0,relevance:5,contains:[e.TITLE_MODE,a]},{className:"class",beginKeywords:"class",end:"[;{]",excludeEnd:!0,relevance:5,contains:[e.TITLE_MODE,a,c]},{begin:"-\\w\\b",relevance:0},{begin:"^__DATA__$",end:"^__END__$",subLanguage:"mojolicious",contains:[{begin:"^@@.*",end:"$",className:"comment"}]}];return o.contains=v,s.contains=v,{name:"Perl",aliases:["pl","pm"],keywords:i,contains:v}}function FT(e){const n=e.regex,t=/(?![A-Za-z0-9])(?![$])/,r=n.concat(/[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/,t),i=n.concat(/(\\?[A-Z][a-z0-9_\x7f-\xff]+|\\?[A-Z]+(?=[A-Z][a-z0-9_\x7f-\xff])){1,}/,t),o=n.concat(/[A-Z]+/,t),s={scope:"variable",match:"\\$+"+r},a={scope:"meta",variants:[{begin:/<\?php/,relevance:10},{begin:/<\?=/},{begin:/<\?/,relevance:.1},{begin:/\?>/}]},l={scope:"subst",variants:[{begin:/\$\w+/},{begin:/\{\$/,end:/\}/}]},c=e.inherit(e.APOS_STRING_MODE,{illegal:null}),u=e.inherit(e.QUOTE_STRING_MODE,{illegal:null,contains:e.QUOTE_STRING_MODE.contains.concat(l)}),d={begin:/<<<[ \t]*(?:(\w+)|"(\w+)")\n/,end:/[ \t]*(\w+)\b/,contains:e.QUOTE_STRING_MODE.contains.concat(l),"on:begin":(Q,q)=>{q.data._beginMatch=Q[1]||Q[2]},"on:end":(Q,q)=>{q.data._beginMatch!==Q[1]&&q.ignoreMatch()}},p=e.END_SAME_AS_BEGIN({begin:/<<<[ \t]*'(\w+)'\n/,end:/[ \t]*(\w+)\b/}),h=`[ 	
]`,v={scope:"string",variants:[u,c,d,p]},w={scope:"number",variants:[{begin:"\\b0[bB][01]+(?:_[01]+)*\\b"},{begin:"\\b0[oO][0-7]+(?:_[0-7]+)*\\b"},{begin:"\\b0[xX][\\da-fA-F]+(?:_[\\da-fA-F]+)*\\b"},{begin:"(?:\\b\\d+(?:_\\d+)*(\\.(?:\\d+(?:_\\d+)*))?|\\B\\.\\d+)(?:[eE][+-]?\\d+)?"}],relevance:0},S=["false","null","true"],g=["__CLASS__","__DIR__","__FILE__","__FUNCTION__","__COMPILER_HALT_OFFSET__","__LINE__","__METHOD__","__NAMESPACE__","__TRAIT__","die","echo","exit","include","include_once","print","require","require_once","array","abstract","and","as","binary","bool","boolean","break","callable","case","catch","class","clone","const","continue","declare","default","do","double","else","elseif","empty","enddeclare","endfor","endforeach","endif","endswitch","endwhile","enum","eval","extends","final","finally","float","for","foreach","from","global","goto","if","implements","instanceof","insteadof","int","integer","interface","isset","iterable","list","match|0","mixed","new","never","object","or","private","protected","public","readonly","real","return","string","switch","throw","trait","try","unset","use","var","void","while","xor","yield"],m=["Error|0","AppendIterator","ArgumentCountError","ArithmeticError","ArrayIterator","ArrayObject","AssertionError","BadFunctionCallException","BadMethodCallException","CachingIterator","CallbackFilterIterator","CompileError","Countable","DirectoryIterator","DivisionByZeroError","DomainException","EmptyIterator","ErrorException","Exception","FilesystemIterator","FilterIterator","GlobIterator","InfiniteIterator","InvalidArgumentException","IteratorIterator","LengthException","LimitIterator","LogicException","MultipleIterator","NoRewindIterator","OutOfBoundsException","OutOfRangeException","OuterIterator","OverflowException","ParentIterator","ParseError","RangeException","RecursiveArrayIterator","RecursiveCachingIterator","RecursiveCallbackFilterIterator","RecursiveDirectoryIterator","RecursiveFilterIterator","RecursiveIterator","RecursiveIteratorIterator","RecursiveRegexIterator","RecursiveTreeIterator","RegexIterator","RuntimeException","SeekableIterator","SplDoublyLinkedList","SplFileInfo","SplFileObject","SplFixedArray","SplHeap","SplMaxHeap","SplMinHeap","SplObjectStorage","SplObserver","SplPriorityQueue","SplQueue","SplStack","SplSubject","SplTempFileObject","TypeError","UnderflowException","UnexpectedValueException","UnhandledMatchError","ArrayAccess","BackedEnum","Closure","Fiber","Generator","Iterator","IteratorAggregate","Serializable","Stringable","Throwable","Traversable","UnitEnum","WeakReference","WeakMap","Directory","__PHP_Incomplete_Class","parent","php_user_filter","self","static","stdClass"],_={keyword:g,literal:(Q=>{const q=[];return Q.forEach(C=>{q.push(C),C.toLowerCase()===C?q.push(C.toUpperCase()):q.push(C.toLowerCase())}),q})(S),built_in:m},N=Q=>Q.map(q=>q.replace(/\|\d+$/,"")),k={variants:[{match:[/new/,n.concat(h,"+"),n.concat("(?!",N(m).join("\\b|"),"\\b)"),i],scope:{1:"keyword",4:"title.class"}}]},I=n.concat(r,"\\b(?!\\()"),D={variants:[{match:[n.concat(/::/,n.lookahead(/(?!class\b)/)),I],scope:{2:"variable.constant"}},{match:[/::/,/class/],scope:{2:"variable.language"}},{match:[i,n.concat(/::/,n.lookahead(/(?!class\b)/)),I],scope:{1:"title.class",3:"variable.constant"}},{match:[i,n.concat("::",n.lookahead(/(?!class\b)/))],scope:{1:"title.class"}},{match:[i,/::/,/class/],scope:{1:"title.class",3:"variable.language"}}]},z={scope:"attr",match:n.concat(r,n.lookahead(":"),n.lookahead(/(?!::)/))},U={relevance:0,begin:/\(/,end:/\)/,keywords:_,contains:[z,s,D,e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE,e.HASH_COMMENT_MODE,v,w,k]},H={relevance:0,match:[/\b/,n.concat("(?!fn\\b|function\\b|",N(g).join("\\b|"),"|",N(m).join("\\b|"),"\\b)"),r,n.concat(h,"*"),n.lookahead(/(?=\()/)],scope:{3:"title.function.invoke"},contains:[U]};U.contains.push(H);const G=[z,D,e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE,e.HASH_COMMENT_MODE,v,w,k],J={begin:n.concat(/#\[\s*\\?/,n.either(i,o)),beginScope:"meta",end:/]/,endScope:"meta",keywords:{literal:S,keyword:["new","array"]},contains:[{begin:/\[/,end:/]/,keywords:{literal:S,keyword:["new","array"]},contains:["self",...G]},...G,{scope:"meta",variants:[{match:i},{match:o}]}]};return{case_insensitive:!1,keywords:_,contains:[J,e.HASH_COMMENT_MODE,e.COMMENT("//","$"),e.COMMENT("/\\*","\\*/",{contains:[{scope:"doctag",match:"@[A-Za-z]+"}]}),{match:/__halt_compiler\(\);/,keywords:"__halt_compiler",starts:{scope:"comment",end:e.MATCH_NOTHING_RE,contains:[{match:/\?>/,scope:"meta",endsParent:!0}]}},a,{scope:"variable.language",match:/\$this\b/},s,H,D,{match:[/const/,/\s/,r],scope:{1:"keyword",3:"variable.constant"}},k,{scope:"function",relevance:0,beginKeywords:"fn function",end:/[;{]/,excludeEnd:!0,illegal:"[$%\\[]",contains:[{beginKeywords:"use"},e.UNDERSCORE_TITLE_MODE,{begin:"=>",endsParent:!0},{scope:"params",begin:"\\(",end:"\\)",excludeBegin:!0,excludeEnd:!0,keywords:_,contains:["self",J,s,D,e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE,e.HASH_COMMENT_MODE,v,w]}]},{scope:"class",variants:[{beginKeywords:"enum",illegal:/[($"]/},{beginKeywords:"class interface trait",illegal:/[:($"]/}],relevance:0,end:/\{/,excludeEnd:!0,contains:[{beginKeywords:"extends implements"},e.UNDERSCORE_TITLE_MODE]},{beginKeywords:"namespace",relevance:0,end:";",illegal:/[.']/,contains:[e.inherit(e.UNDERSCORE_TITLE_MODE,{scope:"title.class"})]},{beginKeywords:"use",relevance:0,end:";",contains:[{match:/\b(as|const|function)\b/,scope:"keyword"},e.UNDERSCORE_TITLE_MODE]},v,w]}}function zT(e){return{name:"PHP template",subLanguage:"xml",contains:[{begin:/<\?(php|=)?/,end:/\?>/,subLanguage:"php",contains:[{begin:"/\\*",end:"\\*/",skip:!0},{begin:'b"',end:'"',skip:!0},{begin:"b'",end:"'",skip:!0},e.inherit(e.APOS_STRING_MODE,{illegal:null,className:null,contains:null,skip:!0}),e.inherit(e.QUOTE_STRING_MODE,{illegal:null,className:null,contains:null,skip:!0})]}]}}function UT(e){return{name:"Plain text",aliases:["text","txt"],disableAutodetect:!0}}function $T(e){const n=e.regex,t=new RegExp("[\\p{XID_Start}_]\\p{XID_Continue}*","u"),r=["and","as","assert","async","await","break","case","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","match","nonlocal|10","not","or","pass","raise","return","try","while","with","yield"],a={$pattern:/[A-Za-z]\w+|__\w+__/,keyword:r,built_in:["__import__","abs","all","any","ascii","bin","bool","breakpoint","bytearray","bytes","callable","chr","classmethod","compile","complex","delattr","dict","dir","divmod","enumerate","eval","exec","filter","float","format","frozenset","getattr","globals","hasattr","hash","help","hex","id","input","int","isinstance","issubclass","iter","len","list","locals","map","max","memoryview","min","next","object","oct","open","ord","pow","print","property","range","repr","reversed","round","set","setattr","slice","sorted","staticmethod","str","sum","super","tuple","type","vars","zip"],literal:["__debug__","Ellipsis","False","None","NotImplemented","True"],type:["Any","Callable","Coroutine","Dict","List","Literal","Generic","Optional","Sequence","Set","Tuple","Type","Union"]},l={className:"meta",begin:/^(>>>|\.\.\.) /},c={className:"subst",begin:/\{/,end:/\}/,keywords:a,illegal:/#/},u={begin:/\{\{/,relevance:0},d={className:"string",contains:[e.BACKSLASH_ESCAPE],variants:[{begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,end:/'''/,contains:[e.BACKSLASH_ESCAPE,l],relevance:10},{begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,end:/"""/,contains:[e.BACKSLASH_ESCAPE,l],relevance:10},{begin:/([fF][rR]|[rR][fF]|[fF])'''/,end:/'''/,contains:[e.BACKSLASH_ESCAPE,l,u,c]},{begin:/([fF][rR]|[rR][fF]|[fF])"""/,end:/"""/,contains:[e.BACKSLASH_ESCAPE,l,u,c]},{begin:/([uU]|[rR])'/,end:/'/,relevance:10},{begin:/([uU]|[rR])"/,end:/"/,relevance:10},{begin:/([bB]|[bB][rR]|[rR][bB])'/,end:/'/},{begin:/([bB]|[bB][rR]|[rR][bB])"/,end:/"/},{begin:/([fF][rR]|[rR][fF]|[fF])'/,end:/'/,contains:[e.BACKSLASH_ESCAPE,u,c]},{begin:/([fF][rR]|[rR][fF]|[fF])"/,end:/"/,contains:[e.BACKSLASH_ESCAPE,u,c]},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},p="[0-9](_?[0-9])*",h=`(\\b(${p}))?\\.(${p})|\\b(${p})\\.`,v=`\\b|${r.join("|")}`,w={className:"number",relevance:0,variants:[{begin:`(\\b(${p})|(${h}))[eE][+-]?(${p})[jJ]?(?=${v})`},{begin:`(${h})[jJ]?`},{begin:`\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${v})`},{begin:`\\b0[bB](_?[01])+[lL]?(?=${v})`},{begin:`\\b0[oO](_?[0-7])+[lL]?(?=${v})`},{begin:`\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${v})`},{begin:`\\b(${p})[jJ](?=${v})`}]},S={className:"comment",begin:n.lookahead(/# type:/),end:/$/,keywords:a,contains:[{begin:/# type:/},{begin:/#/,end:/\b\B/,endsWithParent:!0}]},g={className:"params",variants:[{className:"",begin:/\(\s*\)/,skip:!0},{begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:["self",l,w,d,e.HASH_COMMENT_MODE]}]};return c.contains=[d,w,l],{name:"Python",aliases:["py","gyp","ipython"],unicodeRegex:!0,keywords:a,illegal:/(<\/|\?)|=>/,contains:[l,w,{scope:"variable.language",match:/\bself\b/},{beginKeywords:"if",relevance:0},{match:/\bor\b/,scope:"keyword"},d,S,e.HASH_COMMENT_MODE,{match:[/\bdef/,/\s+/,t],scope:{1:"keyword",3:"title.function"},contains:[g]},{variants:[{match:[/\bclass/,/\s+/,t,/\s*/,/\(\s*/,t,/\s*\)/]},{match:[/\bclass/,/\s+/,t]}],scope:{1:"keyword",3:"title.class",6:"title.class.inherited"}},{className:"meta",begin:/^[\t ]*@/,end:/(?=#)|$/,contains:[w,g,d]}]}}function HT(e){return{aliases:["pycon"],contains:[{className:"meta.prompt",starts:{end:/ |$/,starts:{end:"$",subLanguage:"python"}},variants:[{begin:/^>>>(?=[ ]|$)/},{begin:/^\.\.\.(?=[ ]|$)/}]}]}}function GT(e){const n=e.regex,t=/(?:(?:[a-zA-Z]|\.[._a-zA-Z])[._a-zA-Z0-9]*)|\.(?!\d)/,r=n.either(/0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*[pP][+-]?\d+i?/,/0[xX][0-9a-fA-F]+(?:[pP][+-]?\d+)?[Li]?/,/(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?[Li]?/),i=/[=!<>:]=|\|\||&&|:::?|<-|<<-|->>|->|\|>|[-+*\/?!$&|:<=>@^~]|\*\*/,o=n.either(/[()]/,/[{}]/,/\[\[/,/[[\]]/,/\\/,/,/);return{name:"R",keywords:{$pattern:t,keyword:"function if in break next repeat else for while",literal:"NULL NA TRUE FALSE Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 NA_complex_|10",built_in:"LETTERS letters month.abb month.name pi T F abs acos acosh all any anyNA Arg as.call as.character as.complex as.double as.environment as.integer as.logical as.null.default as.numeric as.raw asin asinh atan atanh attr attributes baseenv browser c call ceiling class Conj cos cosh cospi cummax cummin cumprod cumsum digamma dim dimnames emptyenv exp expression floor forceAndCall gamma gc.time globalenv Im interactive invisible is.array is.atomic is.call is.character is.complex is.double is.environment is.expression is.finite is.function is.infinite is.integer is.language is.list is.logical is.matrix is.na is.name is.nan is.null is.numeric is.object is.pairlist is.raw is.recursive is.single is.symbol lazyLoadDBfetch length lgamma list log max min missing Mod names nargs nzchar oldClass on.exit pos.to.env proc.time prod quote range Re rep retracemem return round seq_along seq_len seq.int sign signif sin sinh sinpi sqrt standardGeneric substitute sum switch tan tanh tanpi tracemem trigamma trunc unclass untracemem UseMethod xtfrm"},contains:[e.COMMENT(/#'/,/$/,{contains:[{scope:"doctag",match:/@examples/,starts:{end:n.lookahead(n.either(/\n^#'\s*(?=@[a-zA-Z]+)/,/\n^(?!#')/)),endsParent:!0}},{scope:"doctag",begin:"@param",end:/$/,contains:[{scope:"variable",variants:[{match:t},{match:/`(?:\\.|[^`\\])+`/}],endsParent:!0}]},{scope:"doctag",match:/@[a-zA-Z]+/},{scope:"keyword",match:/\\[a-zA-Z]+/}]}),e.HASH_COMMENT_MODE,{scope:"string",contains:[e.BACKSLASH_ESCAPE],variants:[e.END_SAME_AS_BEGIN({begin:/[rR]"(-*)\(/,end:/\)(-*)"/}),e.END_SAME_AS_BEGIN({begin:/[rR]"(-*)\{/,end:/\}(-*)"/}),e.END_SAME_AS_BEGIN({begin:/[rR]"(-*)\[/,end:/\](-*)"/}),e.END_SAME_AS_BEGIN({begin:/[rR]'(-*)\(/,end:/\)(-*)'/}),e.END_SAME_AS_BEGIN({begin:/[rR]'(-*)\{/,end:/\}(-*)'/}),e.END_SAME_AS_BEGIN({begin:/[rR]'(-*)\[/,end:/\](-*)'/}),{begin:'"',end:'"',relevance:0},{begin:"'",end:"'",relevance:0}]},{relevance:0,variants:[{scope:{1:"operator",2:"number"},match:[i,r]},{scope:{1:"operator",2:"number"},match:[/%[^%]*%/,r]},{scope:{1:"punctuation",2:"number"},match:[o,r]},{scope:{2:"number"},match:[/[^a-zA-Z0-9._]|^/,r]}]},{scope:{3:"operator"},match:[t,/\s+/,/<-/,/\s+/]},{scope:"operator",relevance:0,variants:[{match:i},{match:/%[^%]*%/}]},{scope:"punctuation",relevance:0,match:o},{begin:"`",end:"`",contains:[{begin:/\\./}]}]}}function WT(e){const n=e.regex,t="([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)",r=n.either(/\b([A-Z]+[a-z0-9]+)+/,/\b([A-Z]+[a-z0-9]+)+[A-Z]+/),i=n.concat(r,/(::\w+)*/),s={"variable.constant":["__FILE__","__LINE__","__ENCODING__"],"variable.language":["self","super"],keyword:["alias","and","begin","BEGIN","break","case","class","defined","do","else","elsif","end","END","ensure","for","if","in","module","next","not","or","redo","require","rescue","retry","return","then","undef","unless","until","when","while","yield",...["include","extend","prepend","public","private","protected","raise","throw"]],built_in:["proc","lambda","attr_accessor","attr_reader","attr_writer","define_method","private_constant","module_function"],literal:["true","false","nil"]},a={className:"doctag",begin:"@[A-Za-z]+"},l={begin:"#<",end:">"},c=[e.COMMENT("#","$",{contains:[a]}),e.COMMENT("^=begin","^=end",{contains:[a],relevance:10}),e.COMMENT("^__END__",e.MATCH_NOTHING_RE)],u={className:"subst",begin:/#\{/,end:/\}/,keywords:s},d={className:"string",contains:[e.BACKSLASH_ESCAPE,u],variants:[{begin:/'/,end:/'/},{begin:/"/,end:/"/},{begin:/`/,end:/`/},{begin:/%[qQwWx]?\(/,end:/\)/},{begin:/%[qQwWx]?\[/,end:/\]/},{begin:/%[qQwWx]?\{/,end:/\}/},{begin:/%[qQwWx]?</,end:/>/},{begin:/%[qQwWx]?\//,end:/\//},{begin:/%[qQwWx]?%/,end:/%/},{begin:/%[qQwWx]?-/,end:/-/},{begin:/%[qQwWx]?\|/,end:/\|/},{begin:/\B\?(\\\d{1,3})/},{begin:/\B\?(\\x[A-Fa-f0-9]{1,2})/},{begin:/\B\?(\\u\{?[A-Fa-f0-9]{1,6}\}?)/},{begin:/\B\?(\\M-\\C-|\\M-\\c|\\c\\M-|\\M-|\\C-\\M-)[\x20-\x7e]/},{begin:/\B\?\\(c|C-)[\x20-\x7e]/},{begin:/\B\?\\?\S/},{begin:n.concat(/<<[-~]?'?/,n.lookahead(/(\w+)(?=\W)[^\n]*\n(?:[^\n]*\n)*?\s*\1\b/)),contains:[e.END_SAME_AS_BEGIN({begin:/(\w+)/,end:/(\w+)/,contains:[e.BACKSLASH_ESCAPE,u]})]}]},p="[1-9](_?[0-9])*|0",h="[0-9](_?[0-9])*",v={className:"number",relevance:0,variants:[{begin:`\\b(${p})(\\.(${h}))?([eE][+-]?(${h})|r)?i?\\b`},{begin:"\\b0[dD][0-9](_?[0-9])*r?i?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*r?i?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*r?i?\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*r?i?\\b"},{begin:"\\b0(_?[0-7])+r?i?\\b"}]},w={variants:[{match:/\(\)/},{className:"params",begin:/\(/,end:/(?=\))/,excludeBegin:!0,endsParent:!0,keywords:s}]},k=[d,{variants:[{match:[/class\s+/,i,/\s+<\s+/,i]},{match:[/\b(class|module)\s+/,i]}],scope:{2:"title.class",4:"title.class.inherited"},keywords:s},{match:[/(include|extend)\s+/,i],scope:{2:"title.class"},keywords:s},{relevance:0,match:[i,/\.new[. (]/],scope:{1:"title.class"}},{relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"},{relevance:0,match:r,scope:"title.class"},{match:[/def/,/\s+/,t],scope:{1:"keyword",3:"title.function"},contains:[w]},{begin:e.IDENT_RE+"::"},{className:"symbol",begin:e.UNDERSCORE_IDENT_RE+"(!|\\?)?:",relevance:0},{className:"symbol",begin:":(?!\\s)",contains:[d,{begin:t}],relevance:0},v,{className:"variable",begin:"(\\$\\W)|((\\$|@@?)(\\w+))(?=[^@$?])(?![A-Za-z])(?![@$?'])"},{className:"params",begin:/\|(?!=)/,end:/\|/,excludeBegin:!0,excludeEnd:!0,relevance:0,keywords:s},{begin:"("+e.RE_STARTERS_RE+"|unless)\\s*",keywords:"unless",contains:[{className:"regexp",contains:[e.BACKSLASH_ESCAPE,u],illegal:/\n/,variants:[{begin:"/",end:"/[a-z]*"},{begin:/%r\{/,end:/\}[a-z]*/},{begin:"%r\\(",end:"\\)[a-z]*"},{begin:"%r!",end:"![a-z]*"},{begin:"%r\\[",end:"\\][a-z]*"}]}].concat(l,c),relevance:0}].concat(l,c);u.contains=k,w.contains=k;const U=[{begin:/^\s*=>/,starts:{end:"$",contains:k}},{className:"meta.prompt",begin:"^("+"[>?]>"+"|"+"[\\w#]+\\(\\w+\\):\\d+:\\d+[>*]"+"|"+"(\\w+-)?\\d+\\.\\d+\\.\\d+(p\\d+)?[^\\d][^>]+>"+")(?=[ ])",starts:{end:"$",keywords:s,contains:k}}];return c.unshift(l),{name:"Ruby",aliases:["rb","gemspec","podspec","thor","irb"],keywords:s,illegal:/\/\*/,contains:[e.SHEBANG({binary:"ruby"})].concat(U).concat(c).concat(k)}}function KT(e){const n=e.regex,t=/(r#)?/,r=n.concat(t,e.UNDERSCORE_IDENT_RE),i=n.concat(t,e.IDENT_RE),o={className:"title.function.invoke",relevance:0,begin:n.concat(/\b/,/(?!let|for|while|if|else|match\b)/,i,n.lookahead(/\s*\(/))},s="([ui](8|16|32|64|128|size)|f(32|64))?",a=["abstract","as","async","await","become","box","break","const","continue","crate","do","dyn","else","enum","extern","false","final","fn","for","if","impl","in","let","loop","macro","match","mod","move","mut","override","priv","pub","ref","return","self","Self","static","struct","super","trait","true","try","type","typeof","union","unsafe","unsized","use","virtual","where","while","yield"],l=["true","false","Some","None","Ok","Err"],c=["drop ","Copy","Send","Sized","Sync","Drop","Fn","FnMut","FnOnce","ToOwned","Clone","Debug","PartialEq","PartialOrd","Eq","Ord","AsRef","AsMut","Into","From","Default","Iterator","Extend","IntoIterator","DoubleEndedIterator","ExactSizeIterator","SliceConcatExt","ToString","assert!","assert_eq!","bitflags!","bytes!","cfg!","col!","concat!","concat_idents!","debug_assert!","debug_assert_eq!","env!","eprintln!","panic!","file!","format!","format_args!","include_bytes!","include_str!","line!","local_data_key!","module_path!","option_env!","print!","println!","select!","stringify!","try!","unimplemented!","unreachable!","vec!","write!","writeln!","macro_rules!","assert_ne!","debug_assert_ne!"],u=["i8","i16","i32","i64","i128","isize","u8","u16","u32","u64","u128","usize","f32","f64","str","char","bool","Box","Option","Result","String","Vec"];return{name:"Rust",aliases:["rs"],keywords:{$pattern:e.IDENT_RE+"!?",type:u,keyword:a,literal:l,built_in:c},illegal:"</",contains:[e.C_LINE_COMMENT_MODE,e.COMMENT("/\\*","\\*/",{contains:["self"]}),e.inherit(e.QUOTE_STRING_MODE,{begin:/b?"/,illegal:null}),{className:"symbol",begin:/'[a-zA-Z_][a-zA-Z0-9_]*(?!')/},{scope:"string",variants:[{begin:/b?r(#*)"(.|\n)*?"\1(?!#)/},{begin:/b?'/,end:/'/,contains:[{scope:"char.escape",match:/\\('|\w|x\w{2}|u\w{4}|U\w{8})/}]}]},{className:"number",variants:[{begin:"\\b0b([01_]+)"+s},{begin:"\\b0o([0-7_]+)"+s},{begin:"\\b0x([A-Fa-f0-9_]+)"+s},{begin:"\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)"+s}],relevance:0},{begin:[/fn/,/\s+/,r],className:{1:"keyword",3:"title.function"}},{className:"meta",begin:"#!?\\[",end:"\\]",contains:[{className:"string",begin:/"/,end:/"/,contains:[e.BACKSLASH_ESCAPE]}]},{begin:[/let/,/\s+/,/(?:mut\s+)?/,r],className:{1:"keyword",3:"keyword",4:"variable"}},{begin:[/for/,/\s+/,r,/\s+/,/in/],className:{1:"keyword",3:"variable",5:"keyword"}},{begin:[/type/,/\s+/,r],className:{1:"keyword",3:"title.class"}},{begin:[/(?:trait|enum|struct|union|impl|for)/,/\s+/,r],className:{1:"keyword",3:"title.class"}},{begin:e.IDENT_RE+"::",keywords:{keyword:"Self",built_in:c,type:u}},{className:"punctuation",begin:"->"},o]}}const VT=e=>({IMPORTANT:{scope:"meta",begin:"!important"},BLOCK_COMMENT:e.C_BLOCK_COMMENT_MODE,HEXCOLOR:{scope:"number",begin:/#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/},UNICODE_RANGE:{scope:"number",begin:/\b[Uu]\+[0-9A-Fa-f][0-9A-Fa-f?]{0,4}(-[0-9A-Fa-f][0-9A-Fa-f]{0,4})?/},FUNCTION_DISPATCH:{className:"built_in",begin:/[\w-]+(?=\()/},ATTRIBUTE_SELECTOR_MODE:{scope:"selector-attr",begin:/\[/,end:/\]/,illegal:"$",contains:[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},CSS_NUMBER_MODE:{scope:"number",begin:e.NUMBER_RE+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",relevance:0},CSS_VARIABLE:{className:"attr",begin:/--[A-Za-z_][A-Za-z0-9_-]*/}}),qT=["a","abbr","address","article","aside","audio","b","blockquote","body","button","canvas","caption","cite","code","dd","del","details","dfn","div","dl","dt","em","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","html","i","iframe","img","input","ins","kbd","label","legend","li","main","mark","menu","nav","object","ol","optgroup","option","p","picture","q","quote","samp","section","select","source","span","strong","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","ul","var","video"],YT=["defs","g","marker","mask","pattern","svg","switch","symbol","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feFlood","feGaussianBlur","feImage","feMerge","feMorphology","feOffset","feSpecularLighting","feTile","feTurbulence","linearGradient","radialGradient","stop","circle","ellipse","image","line","path","polygon","polyline","rect","text","use","textPath","tspan","foreignObject","clipPath"],QT=[...qT,...YT],XT=["any-hover","any-pointer","aspect-ratio","color","color-gamut","color-index","device-aspect-ratio","device-height","device-width","display-mode","forced-colors","grid","height","hover","inverted-colors","monochrome","orientation","overflow-block","overflow-inline","pointer","prefers-color-scheme","prefers-contrast","prefers-reduced-motion","prefers-reduced-transparency","resolution","scan","scripting","update","width","min-width","max-width","min-height","max-height"].sort().reverse(),ZT=["active","any-link","blank","checked","current","default","defined","dir","disabled","drop","empty","enabled","first","first-child","first-of-type","fullscreen","future","focus","focus-visible","focus-within","has","host","host-context","hover","indeterminate","in-range","invalid","is","lang","last-child","last-of-type","left","link","local-link","not","nth-child","nth-col","nth-last-child","nth-last-col","nth-last-of-type","nth-of-type","only-child","only-of-type","optional","out-of-range","past","placeholder-shown","read-only","read-write","required","right","root","scope","target","target-within","user-invalid","valid","visited","where"].sort().reverse(),JT=["after","backdrop","before","cue","cue-region","first-letter","first-line","grammar-error","marker","part","placeholder","selection","slotted","spelling-error"].sort().reverse(),eR=["accent-color","align-content","align-items","align-self","alignment-baseline","all","anchor-name","animation","animation-composition","animation-delay","animation-direction","animation-duration","animation-fill-mode","animation-iteration-count","animation-name","animation-play-state","animation-range","animation-range-end","animation-range-start","animation-timeline","animation-timing-function","appearance","aspect-ratio","backdrop-filter","backface-visibility","background","background-attachment","background-blend-mode","background-clip","background-color","background-image","background-origin","background-position","background-position-x","background-position-y","background-repeat","background-size","baseline-shift","block-size","border","border-block","border-block-color","border-block-end","border-block-end-color","border-block-end-style","border-block-end-width","border-block-start","border-block-start-color","border-block-start-style","border-block-start-width","border-block-style","border-block-width","border-bottom","border-bottom-color","border-bottom-left-radius","border-bottom-right-radius","border-bottom-style","border-bottom-width","border-collapse","border-color","border-end-end-radius","border-end-start-radius","border-image","border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width","border-inline","border-inline-color","border-inline-end","border-inline-end-color","border-inline-end-style","border-inline-end-width","border-inline-start","border-inline-start-color","border-inline-start-style","border-inline-start-width","border-inline-style","border-inline-width","border-left","border-left-color","border-left-style","border-left-width","border-radius","border-right","border-right-color","border-right-style","border-right-width","border-spacing","border-start-end-radius","border-start-start-radius","border-style","border-top","border-top-color","border-top-left-radius","border-top-right-radius","border-top-style","border-top-width","border-width","bottom","box-align","box-decoration-break","box-direction","box-flex","box-flex-group","box-lines","box-ordinal-group","box-orient","box-pack","box-shadow","box-sizing","break-after","break-before","break-inside","caption-side","caret-color","clear","clip","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","color-scheme","column-count","column-fill","column-gap","column-rule","column-rule-color","column-rule-style","column-rule-width","column-span","column-width","columns","contain","contain-intrinsic-block-size","contain-intrinsic-height","contain-intrinsic-inline-size","contain-intrinsic-size","contain-intrinsic-width","container","container-name","container-type","content","content-visibility","counter-increment","counter-reset","counter-set","cue","cue-after","cue-before","cursor","cx","cy","direction","display","dominant-baseline","empty-cells","enable-background","field-sizing","fill","fill-opacity","fill-rule","filter","flex","flex-basis","flex-direction","flex-flow","flex-grow","flex-shrink","flex-wrap","float","flood-color","flood-opacity","flow","font","font-display","font-family","font-feature-settings","font-kerning","font-language-override","font-optical-sizing","font-palette","font-size","font-size-adjust","font-smooth","font-smoothing","font-stretch","font-style","font-synthesis","font-synthesis-position","font-synthesis-small-caps","font-synthesis-style","font-synthesis-weight","font-variant","font-variant-alternates","font-variant-caps","font-variant-east-asian","font-variant-emoji","font-variant-ligatures","font-variant-numeric","font-variant-position","font-variation-settings","font-weight","forced-color-adjust","gap","glyph-orientation-horizontal","glyph-orientation-vertical","grid","grid-area","grid-auto-columns","grid-auto-flow","grid-auto-rows","grid-column","grid-column-end","grid-column-start","grid-gap","grid-row","grid-row-end","grid-row-start","grid-template","grid-template-areas","grid-template-columns","grid-template-rows","hanging-punctuation","height","hyphenate-character","hyphenate-limit-chars","hyphens","icon","image-orientation","image-rendering","image-resolution","ime-mode","initial-letter","initial-letter-align","inline-size","inset","inset-area","inset-block","inset-block-end","inset-block-start","inset-inline","inset-inline-end","inset-inline-start","isolation","justify-content","justify-items","justify-self","kerning","left","letter-spacing","lighting-color","line-break","line-height","line-height-step","list-style","list-style-image","list-style-position","list-style-type","margin","margin-block","margin-block-end","margin-block-start","margin-bottom","margin-inline","margin-inline-end","margin-inline-start","margin-left","margin-right","margin-top","margin-trim","marker","marker-end","marker-mid","marker-start","marks","mask","mask-border","mask-border-mode","mask-border-outset","mask-border-repeat","mask-border-slice","mask-border-source","mask-border-width","mask-clip","mask-composite","mask-image","mask-mode","mask-origin","mask-position","mask-repeat","mask-size","mask-type","masonry-auto-flow","math-depth","math-shift","math-style","max-block-size","max-height","max-inline-size","max-width","min-block-size","min-height","min-inline-size","min-width","mix-blend-mode","nav-down","nav-index","nav-left","nav-right","nav-up","none","normal","object-fit","object-position","offset","offset-anchor","offset-distance","offset-path","offset-position","offset-rotate","opacity","order","orphans","outline","outline-color","outline-offset","outline-style","outline-width","overflow","overflow-anchor","overflow-block","overflow-clip-margin","overflow-inline","overflow-wrap","overflow-x","overflow-y","overlay","overscroll-behavior","overscroll-behavior-block","overscroll-behavior-inline","overscroll-behavior-x","overscroll-behavior-y","padding","padding-block","padding-block-end","padding-block-start","padding-bottom","padding-inline","padding-inline-end","padding-inline-start","padding-left","padding-right","padding-top","page","page-break-after","page-break-before","page-break-inside","paint-order","pause","pause-after","pause-before","perspective","perspective-origin","place-content","place-items","place-self","pointer-events","position","position-anchor","position-visibility","print-color-adjust","quotes","r","resize","rest","rest-after","rest-before","right","rotate","row-gap","ruby-align","ruby-position","scale","scroll-behavior","scroll-margin","scroll-margin-block","scroll-margin-block-end","scroll-margin-block-start","scroll-margin-bottom","scroll-margin-inline","scroll-margin-inline-end","scroll-margin-inline-start","scroll-margin-left","scroll-margin-right","scroll-margin-top","scroll-padding","scroll-padding-block","scroll-padding-block-end","scroll-padding-block-start","scroll-padding-bottom","scroll-padding-inline","scroll-padding-inline-end","scroll-padding-inline-start","scroll-padding-left","scroll-padding-right","scroll-padding-top","scroll-snap-align","scroll-snap-stop","scroll-snap-type","scroll-timeline","scroll-timeline-axis","scroll-timeline-name","scrollbar-color","scrollbar-gutter","scrollbar-width","shape-image-threshold","shape-margin","shape-outside","shape-rendering","speak","speak-as","src","stop-color","stop-opacity","stroke","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width","tab-size","table-layout","text-align","text-align-all","text-align-last","text-anchor","text-combine-upright","text-decoration","text-decoration-color","text-decoration-line","text-decoration-skip","text-decoration-skip-ink","text-decoration-style","text-decoration-thickness","text-emphasis","text-emphasis-color","text-emphasis-position","text-emphasis-style","text-indent","text-justify","text-orientation","text-overflow","text-rendering","text-shadow","text-size-adjust","text-transform","text-underline-offset","text-underline-position","text-wrap","text-wrap-mode","text-wrap-style","timeline-scope","top","touch-action","transform","transform-box","transform-origin","transform-style","transition","transition-behavior","transition-delay","transition-duration","transition-property","transition-timing-function","translate","unicode-bidi","unicode-range","user-modify","user-select","vector-effect","vertical-align","view-timeline","view-timeline-axis","view-timeline-inset","view-timeline-name","view-transition-name","visibility","voice-balance","voice-duration","voice-family","voice-pitch","voice-range","voice-rate","voice-stress","voice-volume","white-space","white-space-collapse","widows","width","will-change","word-break","word-spacing","word-wrap","writing-mode","x","y","z-index","zoom"].sort().reverse();function nR(e){const n=VT(e),t=JT,r=ZT,i="@[a-z-]+",o="and or not only",a={className:"variable",begin:"(\\$"+"[a-zA-Z-][a-zA-Z0-9_-]*"+")\\b",relevance:0};return{name:"SCSS",case_insensitive:!0,illegal:"[=/|']",contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,n.CSS_NUMBER_MODE,{className:"selector-id",begin:"#[A-Za-z0-9_-]+",relevance:0},{className:"selector-class",begin:"\\.[A-Za-z0-9_-]+",relevance:0},n.ATTRIBUTE_SELECTOR_MODE,{className:"selector-tag",begin:"\\b("+QT.join("|")+")\\b",relevance:0},{className:"selector-pseudo",begin:":("+r.join("|")+")"},{className:"selector-pseudo",begin:":(:)?("+t.join("|")+")"},a,{begin:/\(/,end:/\)/,contains:[n.CSS_NUMBER_MODE]},n.CSS_VARIABLE,{className:"attribute",begin:"\\b("+eR.join("|")+")\\b"},{begin:"\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b"},{begin:/:/,end:/[;}{]/,relevance:0,contains:[n.BLOCK_COMMENT,a,n.HEXCOLOR,n.CSS_NUMBER_MODE,n.UNICODE_RANGE,e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,n.IMPORTANT,n.FUNCTION_DISPATCH]},{begin:"@(page|font-face)",keywords:{$pattern:i,keyword:"@page @font-face"}},{begin:"@",end:"[{;]",returnBegin:!0,keywords:{$pattern:/[a-z-]+/,keyword:o,attribute:XT.join(" ")},contains:[{begin:i,className:"keyword"},{begin:/[a-z-]+(?=:)/,className:"attribute"},a,e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,n.HEXCOLOR,n.CSS_NUMBER_MODE]},n.FUNCTION_DISPATCH]}}function tR(e){return{name:"Shell Session",aliases:["console","shellsession"],contains:[{className:"meta.prompt",begin:/^\s{0,3}[/~\w\d[\]()@-]*[>%$#][ ]?/,starts:{end:/[^\\](?=\s*$)/,subLanguage:"bash"}}]}}function rR(e){const n=e.regex,t=e.COMMENT("--","$"),r={scope:"string",variants:[{begin:/'/,end:/'/,contains:[{match:/''/}]}]},i={begin:/"/,end:/"/,contains:[{match:/""/}]},o=["true","false","unknown"],s=["double precision","large object","with timezone","without timezone"],a=["bigint","binary","blob","boolean","char","character","clob","date","dec","decfloat","decimal","float","int","integer","interval","nchar","nclob","national","numeric","real","row","smallint","time","timestamp","varchar","varying","varbinary"],l=["add","asc","collation","desc","final","first","last","view"],c=["abs","acos","all","allocate","alter","and","any","are","array","array_agg","array_max_cardinality","as","asensitive","asin","asymmetric","at","atan","atomic","authorization","avg","begin","begin_frame","begin_partition","between","bigint","binary","blob","boolean","both","by","call","called","cardinality","cascaded","case","cast","ceil","ceiling","char","char_length","character","character_length","check","classifier","clob","close","coalesce","collate","collect","column","commit","condition","connect","constraint","contains","convert","copy","corr","corresponding","cos","cosh","count","covar_pop","covar_samp","create","cross","cube","cume_dist","current","current_catalog","current_date","current_default_transform_group","current_path","current_role","current_row","current_schema","current_time","current_timestamp","current_path","current_role","current_transform_group_for_type","current_user","cursor","cycle","date","day","deallocate","dec","decimal","decfloat","declare","default","define","delete","dense_rank","deref","describe","deterministic","disconnect","distinct","double","drop","dynamic","each","element","else","empty","end","end_frame","end_partition","end-exec","equals","escape","every","except","exec","execute","exists","exp","external","extract","false","fetch","filter","first_value","float","floor","for","foreign","frame_row","free","from","full","function","fusion","get","global","grant","group","grouping","groups","having","hold","hour","identity","in","indicator","initial","inner","inout","insensitive","insert","int","integer","intersect","intersection","interval","into","is","join","json_array","json_arrayagg","json_exists","json_object","json_objectagg","json_query","json_table","json_table_primitive","json_value","lag","language","large","last_value","lateral","lead","leading","left","like","like_regex","listagg","ln","local","localtime","localtimestamp","log","log10","lower","match","match_number","match_recognize","matches","max","member","merge","method","min","minute","mod","modifies","module","month","multiset","national","natural","nchar","nclob","new","no","none","normalize","not","nth_value","ntile","null","nullif","numeric","octet_length","occurrences_regex","of","offset","old","omit","on","one","only","open","or","order","out","outer","over","overlaps","overlay","parameter","partition","pattern","per","percent","percent_rank","percentile_cont","percentile_disc","period","portion","position","position_regex","power","precedes","precision","prepare","primary","procedure","ptf","range","rank","reads","real","recursive","ref","references","referencing","regr_avgx","regr_avgy","regr_count","regr_intercept","regr_r2","regr_slope","regr_sxx","regr_sxy","regr_syy","release","result","return","returns","revoke","right","rollback","rollup","row","row_number","rows","running","savepoint","scope","scroll","search","second","seek","select","sensitive","session_user","set","show","similar","sin","sinh","skip","smallint","some","specific","specifictype","sql","sqlexception","sqlstate","sqlwarning","sqrt","start","static","stddev_pop","stddev_samp","submultiset","subset","substring","substring_regex","succeeds","sum","symmetric","system","system_time","system_user","table","tablesample","tan","tanh","then","time","timestamp","timezone_hour","timezone_minute","to","trailing","translate","translate_regex","translation","treat","trigger","trim","trim_array","true","truncate","uescape","union","unique","unknown","unnest","update","upper","user","using","value","values","value_of","var_pop","var_samp","varbinary","varchar","varying","versioning","when","whenever","where","width_bucket","window","with","within","without","year"],u=["abs","acos","array_agg","asin","atan","avg","cast","ceil","ceiling","coalesce","corr","cos","cosh","count","covar_pop","covar_samp","cume_dist","dense_rank","deref","element","exp","extract","first_value","floor","json_array","json_arrayagg","json_exists","json_object","json_objectagg","json_query","json_table","json_table_primitive","json_value","lag","last_value","lead","listagg","ln","log","log10","lower","max","min","mod","nth_value","ntile","nullif","percent_rank","percentile_cont","percentile_disc","position","position_regex","power","rank","regr_avgx","regr_avgy","regr_count","regr_intercept","regr_r2","regr_slope","regr_sxx","regr_sxy","regr_syy","row_number","sin","sinh","sqrt","stddev_pop","stddev_samp","substring","substring_regex","sum","tan","tanh","translate","translate_regex","treat","trim","trim_array","unnest","upper","value_of","var_pop","var_samp","width_bucket"],d=["current_catalog","current_date","current_default_transform_group","current_path","current_role","current_schema","current_transform_group_for_type","current_user","session_user","system_time","system_user","current_time","localtime","current_timestamp","localtimestamp"],p=["create table","insert into","primary key","foreign key","not null","alter table","add constraint","grouping sets","on overflow","character set","respect nulls","ignore nulls","nulls first","nulls last","depth first","breadth first"],h=u,v=[...c,...l].filter(N=>!u.includes(N)),w={scope:"variable",match:/@[a-z0-9][a-z0-9_]*/},S={scope:"operator",match:/[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,relevance:0},g={match:n.concat(/\b/,n.either(...h),/\s*\(/),relevance:0,keywords:{built_in:h}};function m(N){return n.concat(/\b/,n.either(...N.map(k=>k.replace(/\s+/,"\\s+"))),/\b/)}const y={scope:"keyword",match:m(p),relevance:0};function _(N,{exceptions:k,when:I}={}){const D=I;return k=k||[],N.map(z=>z.match(/\|\d+$/)||k.includes(z)?z:D(z)?`${z}|0`:z)}return{name:"SQL",case_insensitive:!0,illegal:/[{}]|<\//,keywords:{$pattern:/\b[\w\.]+/,keyword:_(v,{when:N=>N.length<3}),literal:o,type:a,built_in:d},contains:[{scope:"type",match:m(s)},y,g,w,r,i,e.C_NUMBER_MODE,e.C_BLOCK_COMMENT_MODE,t,S]}}function dm(e){return e?typeof e=="string"?e:e.source:null}function ni(e){return ue("(?=",e,")")}function ue(...e){return e.map(t=>dm(t)).join("")}function iR(e){const n=e[e.length-1];return typeof n=="object"&&n.constructor===Object?(e.splice(e.length-1,1),n):{}}function Ue(...e){return"("+(iR(e).capture?"":"?:")+e.map(r=>dm(r)).join("|")+")"}const nu=e=>ue(/\b/,e,/\w$/.test(e)?/\b/:/\B/),oR=["Protocol","Type"].map(nu),_p=["init","self"].map(nu),sR=["Any","Self"],Oa=["actor","any","associatedtype","async","await",/as\?/,/as!/,"as","borrowing","break","case","catch","class","consume","consuming","continue","convenience","copy","default","defer","deinit","didSet","distributed","do","dynamic","each","else","enum","extension","fallthrough",/fileprivate\(set\)/,"fileprivate","final","for","func","get","guard","if","import","indirect","infix",/init\?/,/init!/,"inout",/internal\(set\)/,"internal","in","is","isolated","nonisolated","lazy","let","macro","mutating","nonmutating",/open\(set\)/,"open","operator","optional","override","package","postfix","precedencegroup","prefix",/private\(set\)/,"private","protocol",/public\(set\)/,"public","repeat","required","rethrows","return","set","some","static","struct","subscript","super","switch","throws","throw",/try\?/,/try!/,"try","typealias",/unowned\(safe\)/,/unowned\(unsafe\)/,"unowned","var","weak","where","while","willSet"],Cp=["false","nil","true"],aR=["assignment","associativity","higherThan","left","lowerThan","none","right"],lR=["#colorLiteral","#column","#dsohandle","#else","#elseif","#endif","#error","#file","#fileID","#fileLiteral","#filePath","#function","#if","#imageLiteral","#keyPath","#line","#selector","#sourceLocation","#warning"],Tp=["abs","all","any","assert","assertionFailure","debugPrint","dump","fatalError","getVaList","isKnownUniquelyReferenced","max","min","numericCast","pointwiseMax","pointwiseMin","precondition","preconditionFailure","print","readLine","repeatElement","sequence","stride","swap","swift_unboxFromSwiftValueWithType","transcode","type","unsafeBitCast","unsafeDowncast","withExtendedLifetime","withUnsafeMutablePointer","withUnsafePointer","withVaList","withoutActuallyEscaping","zip"],pm=Ue(/[/=\-+!*%<>&|^~?]/,/[\u00A1-\u00A7]/,/[\u00A9\u00AB]/,/[\u00AC\u00AE]/,/[\u00B0\u00B1]/,/[\u00B6\u00BB\u00BF\u00D7\u00F7]/,/[\u2016-\u2017]/,/[\u2020-\u2027]/,/[\u2030-\u203E]/,/[\u2041-\u2053]/,/[\u2055-\u205E]/,/[\u2190-\u23FF]/,/[\u2500-\u2775]/,/[\u2794-\u2BFF]/,/[\u2E00-\u2E7F]/,/[\u3001-\u3003]/,/[\u3008-\u3020]/,/[\u3030]/),fm=Ue(pm,/[\u0300-\u036F]/,/[\u1DC0-\u1DFF]/,/[\u20D0-\u20FF]/,/[\uFE00-\uFE0F]/,/[\uFE20-\uFE2F]/),Ma=ue(pm,fm,"*"),hm=Ue(/[a-zA-Z_]/,/[\u00A8\u00AA\u00AD\u00AF\u00B2-\u00B5\u00B7-\u00BA]/,/[\u00BC-\u00BE\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/,/[\u0100-\u02FF\u0370-\u167F\u1681-\u180D\u180F-\u1DBF]/,/[\u1E00-\u1FFF]/,/[\u200B-\u200D\u202A-\u202E\u203F-\u2040\u2054\u2060-\u206F]/,/[\u2070-\u20CF\u2100-\u218F\u2460-\u24FF\u2776-\u2793]/,/[\u2C00-\u2DFF\u2E80-\u2FFF]/,/[\u3004-\u3007\u3021-\u302F\u3031-\u303F\u3040-\uD7FF]/,/[\uF900-\uFD3D\uFD40-\uFDCF\uFDF0-\uFE1F\uFE30-\uFE44]/,/[\uFE47-\uFEFE\uFF00-\uFFFD]/),ms=Ue(hm,/\d/,/[\u0300-\u036F\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/),Ln=ue(hm,ms,"*"),So=ue(/[A-Z]/,ms,"*"),cR=["attached","autoclosure",ue(/convention\(/,Ue("swift","block","c"),/\)/),"discardableResult","dynamicCallable","dynamicMemberLookup","escaping","freestanding","frozen","GKInspectable","IBAction","IBDesignable","IBInspectable","IBOutlet","IBSegueAction","inlinable","main","nonobjc","NSApplicationMain","NSCopying","NSManaged",ue(/objc\(/,Ln,/\)/),"objc","objcMembers","propertyWrapper","requires_stored_property_inits","resultBuilder","Sendable","testable","UIApplicationMain","unchecked","unknown","usableFromInline","warn_unqualified_access"],uR=["iOS","iOSApplicationExtension","macOS","macOSApplicationExtension","macCatalyst","macCatalystApplicationExtension","watchOS","watchOSApplicationExtension","tvOS","tvOSApplicationExtension","swift"];function dR(e){const n={match:/\s+/,relevance:0},t=e.COMMENT("/\\*","\\*/",{contains:["self"]}),r=[e.C_LINE_COMMENT_MODE,t],i={match:[/\./,Ue(...oR,..._p)],className:{2:"keyword"}},o={match:ue(/\./,Ue(...Oa)),relevance:0},s=Oa.filter(oe=>typeof oe=="string").concat(["_|0"]),a=Oa.filter(oe=>typeof oe!="string").concat(sR).map(nu),l={variants:[{className:"keyword",match:Ue(...a,..._p)}]},c={$pattern:Ue(/\b\w+/,/#\w+/),keyword:s.concat(lR),literal:Cp},u=[i,o,l],d={match:ue(/\./,Ue(...Tp)),relevance:0},p={className:"built_in",match:ue(/\b/,Ue(...Tp),/(?=\()/)},h=[d,p],v={match:/->/,relevance:0},w={className:"operator",relevance:0,variants:[{match:Ma},{match:`\\.(\\.|${fm})+`}]},S=[v,w],g="([0-9]_*)+",m="([0-9a-fA-F]_*)+",y={className:"number",relevance:0,variants:[{match:`\\b(${g})(\\.(${g}))?([eE][+-]?(${g}))?\\b`},{match:`\\b0x(${m})(\\.(${m}))?([pP][+-]?(${g}))?\\b`},{match:/\b0o([0-7]_*)+\b/},{match:/\b0b([01]_*)+\b/}]},_=(oe="")=>({className:"subst",variants:[{match:ue(/\\/,oe,/[0\\tnr"']/)},{match:ue(/\\/,oe,/u\{[0-9a-fA-F]{1,8}\}/)}]}),N=(oe="")=>({className:"subst",match:ue(/\\/,oe,/[\t ]*(?:[\r\n]|\r\n)/)}),k=(oe="")=>({className:"subst",label:"interpol",begin:ue(/\\/,oe,/\(/),end:/\)/}),I=(oe="")=>({begin:ue(oe,/"""/),end:ue(/"""/,oe),contains:[_(oe),N(oe),k(oe)]}),D=(oe="")=>({begin:ue(oe,/"/),end:ue(/"/,oe),contains:[_(oe),k(oe)]}),z={className:"string",variants:[I(),I("#"),I("##"),I("###"),D(),D("#"),D("##"),D("###")]},U=[e.BACKSLASH_ESCAPE,{begin:/\[/,end:/\]/,relevance:0,contains:[e.BACKSLASH_ESCAPE]}],H={begin:/\/[^\s](?=[^/\n]*\/)/,end:/\//,contains:U},G=oe=>{const ze=ue(oe,/\//),P=ue(/\//,oe);return{begin:ze,end:P,contains:[...U,{scope:"comment",begin:`#(?!.*${P})`,end:/$/}]}},J={scope:"regexp",variants:[G("###"),G("##"),G("#"),H]},Q={match:ue(/`/,Ln,/`/)},q={className:"variable",match:/\$\d+/},C={className:"variable",match:`\\$${ms}+`},O=[Q,q,C],R={match:/(@|#(un)?)available/,scope:"keyword",starts:{contains:[{begin:/\(/,end:/\)/,keywords:uR,contains:[...S,y,z]}]}},M={scope:"keyword",match:ue(/@/,Ue(...cR),ni(Ue(/\(/,/\s+/)))},b={scope:"meta",match:ue(/@/,Ln)},$=[R,M,b],W={match:ni(/\b[A-Z]/),relevance:0,contains:[{className:"type",match:ue(/(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)/,ms,"+")},{className:"type",match:So,relevance:0},{match:/[?!]+/,relevance:0},{match:/\.\.\./,relevance:0},{match:ue(/\s+&\s+/,ni(So)),relevance:0}]},E={begin:/</,end:/>/,keywords:c,contains:[...r,...u,...$,v,W]};W.contains.push(E);const X={match:ue(Ln,/\s*:/),keywords:"_|0",relevance:0},te={begin:/\(/,end:/\)/,relevance:0,keywords:c,contains:["self",X,...r,J,...u,...h,...S,y,z,...O,...$,W]},ie={begin:/</,end:/>/,keywords:"repeat each",contains:[...r,W]},Te={begin:Ue(ni(ue(Ln,/\s*:/)),ni(ue(Ln,/\s+/,Ln,/\s*:/))),end:/:/,relevance:0,contains:[{className:"keyword",match:/\b_\b/},{className:"params",match:Ln}]},Ie={begin:/\(/,end:/\)/,keywords:c,contains:[Te,...r,...u,...S,y,z,...$,W,te],endsParent:!0,illegal:/["']/},pn={match:[/(func|macro)/,/\s+/,Ue(Q.match,Ln,Ma)],className:{1:"keyword",3:"title.function"},contains:[ie,Ie,n],illegal:[/\[/,/%/]},fn={match:[/\b(?:subscript|init[?!]?)/,/\s*(?=[<(])/],className:{1:"keyword"},contains:[ie,Ie,n],illegal:/\[|%/},On={match:[/operator/,/\s+/,Ma],className:{1:"keyword",3:"title"}},It={begin:[/precedencegroup/,/\s+/,So],className:{1:"keyword",3:"title"},contains:[W],keywords:[...aR,...Cp],end:/}/},en={match:[/class\b/,/\s+/,/func\b/,/\s+/,/\b[A-Za-z_][A-Za-z0-9_]*\b/],scope:{1:"keyword",3:"keyword",5:"title.function"}},Hn={match:[/class\b/,/\s+/,/var\b/],scope:{1:"keyword",3:"keyword"}},pe={begin:[/(struct|protocol|class|extension|enum|actor)/,/\s+/,Ln,/\s*/],beginScope:{1:"keyword",3:"title.class"},keywords:c,contains:[ie,...u,{begin:/:/,end:/\{/,keywords:c,contains:[{scope:"title.class.inherited",match:So},...u],relevance:0}]};for(const oe of z.variants){const ze=oe.contains.find(Mn=>Mn.label==="interpol");ze.keywords=c;const P=[...u,...h,...S,y,z,...O];ze.contains=[...P,{begin:/\(/,end:/\)/,contains:["self",...P]}]}return{name:"Swift",keywords:c,contains:[...r,pn,fn,en,Hn,pe,On,It,{beginKeywords:"import",end:/$/,contains:[...r],relevance:0},J,...u,...h,...S,y,z,...O,...$,W,te]}}const ys="[A-Za-z$_][0-9A-Za-z$_]*",gm=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],mm=["true","false","null","undefined","NaN","Infinity"],ym=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],bm=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],vm=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],wm=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","global"],xm=[].concat(vm,ym,bm);function pR(e){const n=e.regex,t=(R,{after:M})=>{const b="</"+R[0].slice(1);return R.input.indexOf(b,M)!==-1},r=ys,i={begin:"<>",end:"</>"},o=/<[A-Za-z0-9\\._:-]+\s*\/>/,s={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(R,M)=>{const b=R[0].length+R.index,$=R.input[b];if($==="<"||$===","){M.ignoreMatch();return}$===">"&&(t(R,{after:b})||M.ignoreMatch());let W;const E=R.input.substring(b);if(W=E.match(/^\s*=/)){M.ignoreMatch();return}if((W=E.match(/^\s+extends\s+/))&&W.index===0){M.ignoreMatch();return}}},a={$pattern:ys,keyword:gm,literal:mm,built_in:xm,"variable.language":wm},l="[0-9](_?[0-9])*",c=`\\.(${l})`,u="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",d={className:"number",variants:[{begin:`(\\b(${u})((${c})|\\.)?|(${c}))[eE][+-]?(${l})\\b`},{begin:`\\b(${u})\\b((${c})\\b|\\.)?|(${c})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},p={className:"subst",begin:"\\$\\{",end:"\\}",keywords:a,contains:[]},h={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,p],subLanguage:"xml"}},v={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,p],subLanguage:"css"}},w={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,p],subLanguage:"graphql"}},S={className:"string",begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE,p]},m={className:"comment",variants:[e.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:r+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE]},y=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,h,v,w,S,{match:/\$\d+/},d];p.contains=y.concat({begin:/\{/,end:/\}/,keywords:a,contains:["self"].concat(y)});const _=[].concat(m,p.contains),N=_.concat([{begin:/(\s*)\(/,end:/\)/,keywords:a,contains:["self"].concat(_)}]),k={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:N},I={variants:[{match:[/class/,/\s+/,r,/\s+/,/extends/,/\s+/,n.concat(r,"(",n.concat(/\./,r),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,r],scope:{1:"keyword",3:"title.class"}}]},D={relevance:0,match:n.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...ym,...bm]}},z={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},U={variants:[{match:[/function/,/\s+/,r,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[k],illegal:/%/},H={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function G(R){return n.concat("(?!",R.join("|"),")")}const J={match:n.concat(/\b/,G([...vm,"super","import","await"].map(R=>`${R}\\s*\\(`)),r,n.lookahead(/\s*\(/)),className:"title.function",relevance:0},Q={begin:n.concat(/\./,n.lookahead(n.concat(r,/(?![0-9A-Za-z$_(])/))),end:r,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},q={match:[/get|set/,/\s+/,r,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},k]},C="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+e.UNDERSCORE_IDENT_RE+")\\s*=>",O={match:[/const|var|let/,/\s+/,r,/\s*/,/=\s*/,/(async\s*)?/,n.lookahead(C)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[k]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:a,exports:{PARAMS_CONTAINS:N,CLASS_REFERENCE:D},illegal:/#(?![$_A-Za-z])/,contains:[e.SHEBANG({label:"shebang",binary:"node",relevance:5}),z,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,h,v,w,S,m,{match:/\$\d+/},d,D,{scope:"attr",match:r+n.lookahead(":"),relevance:0},O,{begin:"("+e.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[m,e.REGEXP_MODE,{className:"function",begin:C,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:e.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:N}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:i.begin,end:i.end},{match:o},{begin:s.begin,"on:begin":s.isTrulyOpeningTag,end:s.end}],subLanguage:"xml",contains:[{begin:s.begin,end:s.end,skip:!0,contains:["self"]}]}]},U,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+e.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[k,e.inherit(e.TITLE_MODE,{begin:r,className:"title.function"})]},{match:/\.\.\./,relevance:0},Q,{match:"\\$"+r,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[k]},J,H,I,q,{match:/\$[(.]/}]}}function fR(e){const n=e.regex,t=pR(e),r=ys,i=["any","void","number","boolean","string","object","never","symbol","bigint","unknown"],o={begin:[/namespace/,/\s+/,e.IDENT_RE],beginScope:{1:"keyword",3:"title.class"}},s={beginKeywords:"interface",end:/\{/,excludeEnd:!0,keywords:{keyword:"interface extends",built_in:i},contains:[t.exports.CLASS_REFERENCE]},a={className:"meta",relevance:10,begin:/^\s*['"]use strict['"]/},l=["type","interface","public","private","protected","implements","declare","abstract","readonly","enum","override","satisfies"],c={$pattern:ys,keyword:gm.concat(l),literal:mm,built_in:xm.concat(i),"variable.language":wm},u={className:"meta",begin:"@"+r},d=(w,S,g)=>{const m=w.contains.findIndex(y=>y.label===S);if(m===-1)throw new Error("can not find mode to replace");w.contains.splice(m,1,g)};Object.assign(t.keywords,c),t.exports.PARAMS_CONTAINS.push(u);const p=t.contains.find(w=>w.scope==="attr"),h=Object.assign({},p,{match:n.concat(r,n.lookahead(/\s*\?:/))});t.exports.PARAMS_CONTAINS.push([t.exports.CLASS_REFERENCE,p,h]),t.contains=t.contains.concat([u,o,s,h]),d(t,"shebang",e.SHEBANG()),d(t,"use_strict",a);const v=t.contains.find(w=>w.label==="func.def");return v.relevance=0,Object.assign(t,{name:"TypeScript",aliases:["ts","tsx","mts","cts"]}),t}function hR(e){const n=e.regex,t={className:"string",begin:/"(""|[^/n])"C\b/},r={className:"string",begin:/"/,end:/"/,illegal:/\n/,contains:[{begin:/""/}]},i=/\d{1,2}\/\d{1,2}\/\d{4}/,o=/\d{4}-\d{1,2}-\d{1,2}/,s=/(\d|1[012])(:\d+){0,2} *(AM|PM)/,a=/\d{1,2}(:\d{1,2}){1,2}/,l={className:"literal",variants:[{begin:n.concat(/# */,n.either(o,i),/ *#/)},{begin:n.concat(/# */,a,/ *#/)},{begin:n.concat(/# */,s,/ *#/)},{begin:n.concat(/# */,n.either(o,i),/ +/,n.either(s,a),/ *#/)}]},c={className:"number",relevance:0,variants:[{begin:/\b\d[\d_]*((\.[\d_]+(E[+-]?[\d_]+)?)|(E[+-]?[\d_]+))[RFD@!#]?/},{begin:/\b\d[\d_]*((U?[SIL])|[%&])?/},{begin:/&H[\dA-F_]+((U?[SIL])|[%&])?/},{begin:/&O[0-7_]+((U?[SIL])|[%&])?/},{begin:/&B[01_]+((U?[SIL])|[%&])?/}]},u={className:"label",begin:/^\w+:/},d=e.COMMENT(/'''/,/$/,{contains:[{className:"doctag",begin:/<\/?/,end:/>/}]}),p=e.COMMENT(null,/$/,{variants:[{begin:/'/},{begin:/([\t ]|^)REM(?=\s)/}]});return{name:"Visual Basic .NET",aliases:["vb"],case_insensitive:!0,classNameAliases:{label:"symbol"},keywords:{keyword:"addhandler alias aggregate ansi as async assembly auto binary by byref byval call case catch class compare const continue custom declare default delegate dim distinct do each equals else elseif end enum erase error event exit explicit finally for friend from function get global goto group handles if implements imports in inherits interface into iterator join key let lib loop me mid module mustinherit mustoverride mybase myclass namespace narrowing new next notinheritable notoverridable of off on operator option optional order overloads overridable overrides paramarray partial preserve private property protected public raiseevent readonly redim removehandler resume return select set shadows shared skip static step stop structure strict sub synclock take text then throw to try unicode until using when where while widening with withevents writeonly yield",built_in:"addressof and andalso await directcast gettype getxmlnamespace is isfalse isnot istrue like mod nameof new not or orelse trycast typeof xor cbool cbyte cchar cdate cdbl cdec cint clng cobj csbyte cshort csng cstr cuint culng cushort",type:"boolean byte char date decimal double integer long object sbyte short single string uinteger ulong ushort",literal:"true false nothing"},illegal:"//|\\{|\\}|endif|gosub|variant|wend|^\\$ ",contains:[t,r,l,c,u,d,p,{className:"meta",begin:/[\t ]*#(const|disable|else|elseif|enable|end|externalsource|if|region)\b/,end:/$/,keywords:{keyword:"const disable else elseif enable end externalsource if region then"},contains:[p]}]}}function gR(e){e.regex;const n=e.COMMENT(/\(;/,/;\)/);n.contains.push("self");const t=e.COMMENT(/;;/,/$/),r=["anyfunc","block","br","br_if","br_table","call","call_indirect","data","drop","elem","else","end","export","func","global.get","global.set","local.get","local.set","local.tee","get_global","get_local","global","if","import","local","loop","memory","memory.grow","memory.size","module","mut","nop","offset","param","result","return","select","set_global","set_local","start","table","tee_local","then","type","unreachable"],i={begin:[/(?:func|call|call_indirect)/,/\s+/,/\$[^\s)]+/],className:{1:"keyword",3:"title.function"}},o={className:"variable",begin:/\$[\w_]+/},s={match:/(\((?!;)|\))+/,className:"punctuation",relevance:0},a={className:"number",relevance:0,match:/[+-]?\b(?:\d(?:_?\d)*(?:\.\d(?:_?\d)*)?(?:[eE][+-]?\d(?:_?\d)*)?|0x[\da-fA-F](?:_?[\da-fA-F])*(?:\.[\da-fA-F](?:_?[\da-fA-D])*)?(?:[pP][+-]?\d(?:_?\d)*)?)\b|\binf\b|\bnan(?::0x[\da-fA-F](?:_?[\da-fA-D])*)?\b/},l={match:/(i32|i64|f32|f64)(?!\.)/,className:"type"},c={className:"keyword",match:/\b(f32|f64|i32|i64)(?:\.(?:abs|add|and|ceil|clz|const|convert_[su]\/i(?:32|64)|copysign|ctz|demote\/f64|div(?:_[su])?|eqz?|extend_[su]\/i32|floor|ge(?:_[su])?|gt(?:_[su])?|le(?:_[su])?|load(?:(?:8|16|32)_[su])?|lt(?:_[su])?|max|min|mul|nearest|neg?|or|popcnt|promote\/f32|reinterpret\/[fi](?:32|64)|rem_[su]|rot[lr]|shl|shr_[su]|store(?:8|16|32)?|sqrt|sub|trunc(?:_[su]\/f(?:32|64))?|wrap\/i64|xor))\b/};return{name:"WebAssembly",keywords:{$pattern:/[\w.]+/,keyword:r},contains:[t,n,{match:[/(?:offset|align)/,/\s*/,/=/],className:{1:"keyword",3:"operator"}},o,s,i,e.QUOTE_STRING_MODE,l,c,a]}}function mR(e){const n=e.regex,t=n.concat(/[\p{L}_]/u,n.optional(/[\p{L}0-9_.-]*:/u),/[\p{L}0-9_.-]*/u),r=/[\p{L}0-9._:-]+/u,i={className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},o={begin:/\s/,contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\n/}]},s=e.inherit(o,{begin:/\(/,end:/\)/}),a=e.inherit(e.APOS_STRING_MODE,{className:"string"}),l=e.inherit(e.QUOTE_STRING_MODE,{className:"string"}),c={endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",begin:r,relevance:0},{begin:/=\s*/,relevance:0,contains:[{className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[i]},{begin:/'/,end:/'/,contains:[i]},{begin:/[^\s"'=<>`]+/}]}]}]};return{name:"HTML, XML",aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,relevance:10,contains:[o,l,a,s,{begin:/\[/,end:/\]/,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,contains:[o,s,l,a]}]}]},e.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\[CDATA\[/,end:/\]\]>/,relevance:10},i,{className:"meta",end:/\?>/,variants:[{begin:/<\?xml/,relevance:10,contains:[l]},{begin:/<\?[a-z][a-z0-9]+/}]},{className:"tag",begin:/<style(?=\s|>)/,end:/>/,keywords:{name:"style"},contains:[c],starts:{end:/<\/style>/,returnEnd:!0,subLanguage:["css","xml"]}},{className:"tag",begin:/<script(?=\s|>)/,end:/>/,keywords:{name:"script"},contains:[c],starts:{end:/<\/script>/,returnEnd:!0,subLanguage:["javascript","handlebars","xml"]}},{className:"tag",begin:/<>|<\/>/},{className:"tag",begin:n.concat(/</,n.lookahead(n.concat(t,n.either(/\/>/,/>/,/\s/)))),end:/\/?>/,contains:[{className:"name",begin:t,relevance:0,starts:c}]},{className:"tag",begin:n.concat(/<\//,n.lookahead(n.concat(t,/>/))),contains:[{className:"name",begin:t,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}}function yR(e){const n="true false yes no null",t="[\\w#;/?:@&=+$,.~*'()[\\]]+",r={className:"attr",variants:[{begin:/[\w*@][\w*@ :()\./-]*:(?=[ \t]|$)/},{begin:/"[\w*@][\w*@ :()\./-]*":(?=[ \t]|$)/},{begin:/'[\w*@][\w*@ :()\./-]*':(?=[ \t]|$)/}]},i={className:"template-variable",variants:[{begin:/\{\{/,end:/\}\}/},{begin:/%\{/,end:/\}/}]},o={className:"string",relevance:0,begin:/'/,end:/'/,contains:[{match:/''/,scope:"char.escape",relevance:0}]},s={className:"string",relevance:0,variants:[{begin:/"/,end:/"/},{begin:/\S+/}],contains:[e.BACKSLASH_ESCAPE,i]},a=e.inherit(s,{variants:[{begin:/'/,end:/'/,contains:[{begin:/''/,relevance:0}]},{begin:/"/,end:/"/},{begin:/[^\s,{}[\]]+/}]}),p={className:"number",begin:"\\b"+"[0-9]{4}(-[0-9][0-9]){0,2}"+"([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?"+"(\\.[0-9]*)?"+"([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?"+"\\b"},h={end:",",endsWithParent:!0,excludeEnd:!0,keywords:n,relevance:0},v={begin:/\{/,end:/\}/,contains:[h],illegal:"\\n",relevance:0},w={begin:"\\[",end:"\\]",contains:[h],illegal:"\\n",relevance:0},S=[r,{className:"meta",begin:"^---\\s*$",relevance:10},{className:"string",begin:"[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"},{begin:"<%[%=-]?",end:"[%-]?%>",subLanguage:"ruby",excludeBegin:!0,excludeEnd:!0,relevance:0},{className:"type",begin:"!\\w+!"+t},{className:"type",begin:"!<"+t+">"},{className:"type",begin:"!"+t},{className:"type",begin:"!!"+t},{className:"meta",begin:"&"+e.UNDERSCORE_IDENT_RE+"$"},{className:"meta",begin:"\\*"+e.UNDERSCORE_IDENT_RE+"$"},{className:"bullet",begin:"-(?=[ ]|$)",relevance:0},e.HASH_COMMENT_MODE,{beginKeywords:n,keywords:{literal:n}},p,{className:"number",begin:e.C_NUMBER_RE+"\\b",relevance:0},v,w,o,s],g=[...S];return g.pop(),g.push(a),h.contains=g,{name:"YAML",case_insensitive:!0,aliases:["yml"],contains:S}}const bR={arduino:XC,bash:ZC,c:JC,cpp:eT,csharp:nT,css:uT,diff:dT,go:pT,graphql:fT,ini:hT,java:gT,javascript:wT,json:kT,kotlin:_T,less:MT,lua:DT,makefile:LT,markdown:PT,objectivec:BT,perl:jT,php:FT,"php-template":zT,plaintext:UT,python:$T,"python-repl":HT,r:GT,ruby:WT,rust:KT,scss:nR,shell:tR,sql:rR,swift:dR,typescript:fR,vbnet:hR,wasm:gR,xml:mR,yaml:yR};function Sm(e){return e instanceof Map?e.clear=e.delete=e.set=function(){throw new Error("map is read-only")}:e instanceof Set&&(e.add=e.clear=e.delete=function(){throw new Error("set is read-only")}),Object.freeze(e),Object.getOwnPropertyNames(e).forEach(n=>{const t=e[n],r=typeof t;(r==="object"||r==="function")&&!Object.isFrozen(t)&&Sm(t)}),e}let Rp=class{constructor(n){n.data===void 0&&(n.data={}),this.data=n.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}};function km(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function ht(e,...n){const t=Object.create(null);for(const r in e)t[r]=e[r];return n.forEach(function(r){for(const i in r)t[i]=r[i]}),t}const vR="</span>",Np=e=>!!e.scope,wR=(e,{prefix:n})=>{if(e.startsWith("language:"))return e.replace("language:","language-");if(e.includes(".")){const t=e.split(".");return[`${n}${t.shift()}`,...t.map((r,i)=>`${r}${"_".repeat(i+1)}`)].join(" ")}return`${n}${e}`};let xR=class{constructor(n,t){this.buffer="",this.classPrefix=t.classPrefix,n.walk(this)}addText(n){this.buffer+=km(n)}openNode(n){if(!Np(n))return;const t=wR(n.scope,{prefix:this.classPrefix});this.span(t)}closeNode(n){Np(n)&&(this.buffer+=vR)}value(){return this.buffer}span(n){this.buffer+=`<span class="${n}">`}};const Ip=(e={})=>{const n={children:[]};return Object.assign(n,e),n};let SR=class Em{constructor(){this.rootNode=Ip(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(n){this.top.children.push(n)}openNode(n){const t=Ip({scope:n});this.add(t),this.stack.push(t)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(n){return this.constructor._walk(n,this.rootNode)}static _walk(n,t){return typeof t=="string"?n.addText(t):t.children&&(n.openNode(t),t.children.forEach(r=>this._walk(n,r)),n.closeNode(t)),n}static _collapse(n){typeof n!="string"&&n.children&&(n.children.every(t=>typeof t=="string")?n.children=[n.children.join("")]:n.children.forEach(t=>{Em._collapse(t)}))}},kR=class extends SR{constructor(n){super(),this.options=n}addText(n){n!==""&&this.add(n)}startScope(n){this.openNode(n)}endScope(){this.closeNode()}__addSublanguage(n,t){const r=n.root;t&&(r.scope=`language:${t}`),this.add(r)}toHTML(){return new xR(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}};function ji(e){return e?typeof e=="string"?e:e.source:null}function _m(e){return Jt("(?=",e,")")}function ER(e){return Jt("(?:",e,")*")}function _R(e){return Jt("(?:",e,")?")}function Jt(...e){return e.map(t=>ji(t)).join("")}function CR(e){const n=e[e.length-1];return typeof n=="object"&&n.constructor===Object?(e.splice(e.length-1,1),n):{}}function tu(...e){return"("+(CR(e).capture?"":"?:")+e.map(r=>ji(r)).join("|")+")"}function Cm(e){return new RegExp(e.toString()+"|").exec("").length-1}function TR(e,n){const t=e&&e.exec(n);return t&&t.index===0}const RR=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function ru(e,{joinWith:n}){let t=0;return e.map(r=>{t+=1;const i=t;let o=ji(r),s="";for(;o.length>0;){const a=RR.exec(o);if(!a){s+=o;break}s+=o.substring(0,a.index),o=o.substring(a.index+a[0].length),a[0][0]==="\\"&&a[1]?s+="\\"+String(Number(a[1])+i):(s+=a[0],a[0]==="("&&t++)}return s}).map(r=>`(${r})`).join(n)}const NR=/\b\B/,Tm="[a-zA-Z]\\w*",iu="[a-zA-Z_]\\w*",Rm="\\b\\d+(\\.\\d+)?",Nm="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",Im="\\b(0b[01]+)",IR="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",AR=(e={})=>{const n=/^#![ ]*\//;return e.binary&&(e.begin=Jt(n,/.*\b/,e.binary,/\b.*/)),ht({scope:"meta",begin:n,end:/$/,relevance:0,"on:begin":(t,r)=>{t.index!==0&&r.ignoreMatch()}},e)},Fi={begin:"\\\\[\\s\\S]",relevance:0},OR={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[Fi]},MR={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[Fi]},DR={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},zs=function(e,n,t={}){const r=ht({scope:"comment",begin:e,end:n,contains:[]},t);r.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const i=tu("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return r.contains.push({begin:Jt(/[ ]+/,"(",i,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),r},LR=zs("//","$"),PR=zs("/\\*","\\*/"),BR=zs("#","$"),jR={scope:"number",begin:Rm,relevance:0},FR={scope:"number",begin:Nm,relevance:0},zR={scope:"number",begin:Im,relevance:0},UR={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[Fi,{begin:/\[/,end:/\]/,relevance:0,contains:[Fi]}]},$R={scope:"title",begin:Tm,relevance:0},HR={scope:"title",begin:iu,relevance:0},GR={begin:"\\.\\s*"+iu,relevance:0},WR=function(e){return Object.assign(e,{"on:begin":(n,t)=>{t.data._beginMatch=n[1]},"on:end":(n,t)=>{t.data._beginMatch!==n[1]&&t.ignoreMatch()}})};var ko=Object.freeze({__proto__:null,APOS_STRING_MODE:OR,BACKSLASH_ESCAPE:Fi,BINARY_NUMBER_MODE:zR,BINARY_NUMBER_RE:Im,COMMENT:zs,C_BLOCK_COMMENT_MODE:PR,C_LINE_COMMENT_MODE:LR,C_NUMBER_MODE:FR,C_NUMBER_RE:Nm,END_SAME_AS_BEGIN:WR,HASH_COMMENT_MODE:BR,IDENT_RE:Tm,MATCH_NOTHING_RE:NR,METHOD_GUARD:GR,NUMBER_MODE:jR,NUMBER_RE:Rm,PHRASAL_WORDS_MODE:DR,QUOTE_STRING_MODE:MR,REGEXP_MODE:UR,RE_STARTERS_RE:IR,SHEBANG:AR,TITLE_MODE:$R,UNDERSCORE_IDENT_RE:iu,UNDERSCORE_TITLE_MODE:HR});function KR(e,n){e.input[e.index-1]==="."&&n.ignoreMatch()}function VR(e,n){e.className!==void 0&&(e.scope=e.className,delete e.className)}function qR(e,n){n&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",e.__beforeBegin=KR,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,e.relevance===void 0&&(e.relevance=0))}function YR(e,n){Array.isArray(e.illegal)&&(e.illegal=tu(...e.illegal))}function QR(e,n){if(e.match){if(e.begin||e.end)throw new Error("begin & end are not supported with match");e.begin=e.match,delete e.match}}function XR(e,n){e.relevance===void 0&&(e.relevance=1)}const ZR=(e,n)=>{if(!e.beforeMatch)return;if(e.starts)throw new Error("beforeMatch cannot be used with starts");const t=Object.assign({},e);Object.keys(e).forEach(r=>{delete e[r]}),e.keywords=t.keywords,e.begin=Jt(t.beforeMatch,_m(t.begin)),e.starts={relevance:0,contains:[Object.assign(t,{endsParent:!0})]},e.relevance=0,delete t.beforeMatch},JR=["of","and","for","in","not","or","if","then","parent","list","value"],eN="keyword";function Am(e,n,t=eN){const r=Object.create(null);return typeof e=="string"?i(t,e.split(" ")):Array.isArray(e)?i(t,e):Object.keys(e).forEach(function(o){Object.assign(r,Am(e[o],n,o))}),r;function i(o,s){n&&(s=s.map(a=>a.toLowerCase())),s.forEach(function(a){const l=a.split("|");r[l[0]]=[o,nN(l[0],l[1])]})}}function nN(e,n){return n?Number(n):tN(e)?0:1}function tN(e){return JR.includes(e.toLowerCase())}const Ap={},$t=e=>{console.error(e)},Op=(e,...n)=>{console.log(`WARN: ${e}`,...n)},ir=(e,n)=>{Ap[`${e}/${n}`]||(console.log(`Deprecated as of ${e}. ${n}`),Ap[`${e}/${n}`]=!0)},bs=new Error;function Om(e,n,{key:t}){let r=0;const i=e[t],o={},s={};for(let a=1;a<=n.length;a++)s[a+r]=i[a],o[a+r]=!0,r+=Cm(n[a-1]);e[t]=s,e[t]._emit=o,e[t]._multi=!0}function rN(e){if(Array.isArray(e.begin)){if(e.skip||e.excludeBegin||e.returnBegin)throw $t("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),bs;if(typeof e.beginScope!="object"||e.beginScope===null)throw $t("beginScope must be object"),bs;Om(e,e.begin,{key:"beginScope"}),e.begin=ru(e.begin,{joinWith:""})}}function iN(e){if(Array.isArray(e.end)){if(e.skip||e.excludeEnd||e.returnEnd)throw $t("skip, excludeEnd, returnEnd not compatible with endScope: {}"),bs;if(typeof e.endScope!="object"||e.endScope===null)throw $t("endScope must be object"),bs;Om(e,e.end,{key:"endScope"}),e.end=ru(e.end,{joinWith:""})}}function oN(e){e.scope&&typeof e.scope=="object"&&e.scope!==null&&(e.beginScope=e.scope,delete e.scope)}function sN(e){oN(e),typeof e.beginScope=="string"&&(e.beginScope={_wrap:e.beginScope}),typeof e.endScope=="string"&&(e.endScope={_wrap:e.endScope}),rN(e),iN(e)}function aN(e){function n(s,a){return new RegExp(ji(s),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(a?"g":""))}class t{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(a,l){l.position=this.position++,this.matchIndexes[this.matchAt]=l,this.regexes.push([l,a]),this.matchAt+=Cm(a)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const a=this.regexes.map(l=>l[1]);this.matcherRe=n(ru(a,{joinWith:"|"}),!0),this.lastIndex=0}exec(a){this.matcherRe.lastIndex=this.lastIndex;const l=this.matcherRe.exec(a);if(!l)return null;const c=l.findIndex((d,p)=>p>0&&d!==void 0),u=this.matchIndexes[c];return l.splice(0,c),Object.assign(l,u)}}class r{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(a){if(this.multiRegexes[a])return this.multiRegexes[a];const l=new t;return this.rules.slice(a).forEach(([c,u])=>l.addRule(c,u)),l.compile(),this.multiRegexes[a]=l,l}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(a,l){this.rules.push([a,l]),l.type==="begin"&&this.count++}exec(a){const l=this.getMatcher(this.regexIndex);l.lastIndex=this.lastIndex;let c=l.exec(a);if(this.resumingScanAtSamePosition()&&!(c&&c.index===this.lastIndex)){const u=this.getMatcher(0);u.lastIndex=this.lastIndex+1,c=u.exec(a)}return c&&(this.regexIndex+=c.position+1,this.regexIndex===this.count&&this.considerAll()),c}}function i(s){const a=new r;return s.contains.forEach(l=>a.addRule(l.begin,{rule:l,type:"begin"})),s.terminatorEnd&&a.addRule(s.terminatorEnd,{type:"end"}),s.illegal&&a.addRule(s.illegal,{type:"illegal"}),a}function o(s,a){const l=s;if(s.isCompiled)return l;[VR,QR,sN,ZR].forEach(u=>u(s,a)),e.compilerExtensions.forEach(u=>u(s,a)),s.__beforeBegin=null,[qR,YR,XR].forEach(u=>u(s,a)),s.isCompiled=!0;let c=null;return typeof s.keywords=="object"&&s.keywords.$pattern&&(s.keywords=Object.assign({},s.keywords),c=s.keywords.$pattern,delete s.keywords.$pattern),c=c||/\w+/,s.keywords&&(s.keywords=Am(s.keywords,e.case_insensitive)),l.keywordPatternRe=n(c,!0),a&&(s.begin||(s.begin=/\B|\b/),l.beginRe=n(l.begin),!s.end&&!s.endsWithParent&&(s.end=/\B|\b/),s.end&&(l.endRe=n(l.end)),l.terminatorEnd=ji(l.end)||"",s.endsWithParent&&a.terminatorEnd&&(l.terminatorEnd+=(s.end?"|":"")+a.terminatorEnd)),s.illegal&&(l.illegalRe=n(s.illegal)),s.contains||(s.contains=[]),s.contains=[].concat(...s.contains.map(function(u){return lN(u==="self"?s:u)})),s.contains.forEach(function(u){o(u,l)}),s.starts&&o(s.starts,a),l.matcher=i(l),l}if(e.compilerExtensions||(e.compilerExtensions=[]),e.contains&&e.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return e.classNameAliases=ht(e.classNameAliases||{}),o(e)}function Mm(e){return e?e.endsWithParent||Mm(e.starts):!1}function lN(e){return e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map(function(n){return ht(e,{variants:null},n)})),e.cachedVariants?e.cachedVariants:Mm(e)?ht(e,{starts:e.starts?ht(e.starts):null}):Object.isFrozen(e)?ht(e):e}var cN="11.11.2";let uN=class extends Error{constructor(n,t){super(n),this.name="HTMLInjectionError",this.html=t}};const Da=km,Mp=ht,Dp=Symbol("nomatch"),dN=7,Dm=function(e){const n=Object.create(null),t=Object.create(null),r=[];let i=!0;const o="Could not find the language '{}', did you forget to load/include a language module?",s={disableAutodetect:!0,name:"Plain text",contains:[]};let a={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:kR};function l(C){return a.noHighlightRe.test(C)}function c(C){let O=C.className+" ";O+=C.parentNode?C.parentNode.className:"";const R=a.languageDetectRe.exec(O);if(R){const M=D(R[1]);return M||(Op(o.replace("{}",R[1])),Op("Falling back to no-highlight mode for this block.",C)),M?R[1]:"no-highlight"}return O.split(/\s+/).find(M=>l(M)||D(M))}function u(C,O,R){let M="",b="";typeof O=="object"?(M=C,R=O.ignoreIllegals,b=O.language):(ir("10.7.0","highlight(lang, code, ...args) has been deprecated."),ir("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),b=C,M=O),R===void 0&&(R=!0);const $={code:M,language:b};Q("before:highlight",$);const W=$.result?$.result:d($.language,$.code,R);return W.code=$.code,Q("after:highlight",W),W}function d(C,O,R,M){const b=Object.create(null);function $(x,T){return x.keywords[T]}function W(){if(!P.keywords){ne.addText(Y);return}let x=0;P.keywordPatternRe.lastIndex=0;let T=P.keywordPatternRe.exec(Y),L="";for(;T;){L+=Y.substring(x,T.index);const B=pe.case_insensitive?T[0].toLowerCase():T[0],V=$(P,B);if(V){const[ae,En]=V;if(ne.addText(L),L="",b[B]=(b[B]||0)+1,b[B]<=dN&&(kn+=En),ae.startsWith("_"))L+=T[0];else{const nn=pe.classNameAliases[ae]||ae;te(T[0],nn)}}else L+=T[0];x=P.keywordPatternRe.lastIndex,T=P.keywordPatternRe.exec(Y)}L+=Y.substring(x),ne.addText(L)}function E(){if(Y==="")return;let x=null;if(typeof P.subLanguage=="string"){if(!n[P.subLanguage]){ne.addText(Y);return}x=d(P.subLanguage,Y,!0,Mn[P.subLanguage]),Mn[P.subLanguage]=x._top}else x=h(Y,P.subLanguage.length?P.subLanguage:null);P.relevance>0&&(kn+=x.relevance),ne.__addSublanguage(x._emitter,x.language)}function X(){P.subLanguage!=null?E():W(),Y=""}function te(x,T){x!==""&&(ne.startScope(T),ne.addText(x),ne.endScope())}function ie(x,T){let L=1;const B=T.length-1;for(;L<=B;){if(!x._emit[L]){L++;continue}const V=pe.classNameAliases[x[L]]||x[L],ae=T[L];V?te(ae,V):(Y=ae,W(),Y=""),L++}}function Te(x,T){return x.scope&&typeof x.scope=="string"&&ne.openNode(pe.classNameAliases[x.scope]||x.scope),x.beginScope&&(x.beginScope._wrap?(te(Y,pe.classNameAliases[x.beginScope._wrap]||x.beginScope._wrap),Y=""):x.beginScope._multi&&(ie(x.beginScope,T),Y="")),P=Object.create(x,{parent:{value:P}}),P}function Ie(x,T,L){let B=TR(x.endRe,L);if(B){if(x["on:end"]){const V=new Rp(x);x["on:end"](T,V),V.isMatchIgnored&&(B=!1)}if(B){for(;x.endsParent&&x.parent;)x=x.parent;return x}}if(x.endsWithParent)return Ie(x.parent,T,L)}function pn(x){return P.matcher.regexIndex===0?(Y+=x[0],1):(Wn=!0,0)}function fn(x){const T=x[0],L=x.rule,B=new Rp(L),V=[L.__beforeBegin,L["on:begin"]];for(const ae of V)if(ae&&(ae(x,B),B.isMatchIgnored))return pn(T);return L.skip?Y+=T:(L.excludeBegin&&(Y+=T),X(),!L.returnBegin&&!L.excludeBegin&&(Y=T)),Te(L,x),L.returnBegin?0:T.length}function On(x){const T=x[0],L=O.substring(x.index),B=Ie(P,x,L);if(!B)return Dp;const V=P;P.endScope&&P.endScope._wrap?(X(),te(T,P.endScope._wrap)):P.endScope&&P.endScope._multi?(X(),ie(P.endScope,x)):V.skip?Y+=T:(V.returnEnd||V.excludeEnd||(Y+=T),X(),V.excludeEnd&&(Y=T));do P.scope&&ne.closeNode(),!P.skip&&!P.subLanguage&&(kn+=P.relevance),P=P.parent;while(P!==B.parent);return B.starts&&Te(B.starts,x),V.returnEnd?0:T.length}function It(){const x=[];for(let T=P;T!==pe;T=T.parent)T.scope&&x.unshift(T.scope);x.forEach(T=>ne.openNode(T))}let en={};function Hn(x,T){const L=T&&T[0];if(Y+=x,L==null)return X(),0;if(en.type==="begin"&&T.type==="end"&&en.index===T.index&&L===""){if(Y+=O.slice(T.index,T.index+1),!i){const B=new Error(`0 width match regex (${C})`);throw B.languageName=C,B.badRule=en.rule,B}return 1}if(en=T,T.type==="begin")return fn(T);if(T.type==="illegal"&&!R){const B=new Error('Illegal lexeme "'+L+'" for mode "'+(P.scope||"<unnamed>")+'"');throw B.mode=P,B}else if(T.type==="end"){const B=On(T);if(B!==Dp)return B}if(T.type==="illegal"&&L==="")return T.index===O.length||(Y+=`
`),1;if(Gn>1e5&&Gn>T.index*3)throw new Error("potential infinite loop, way more iterations than matches");return Y+=L,L.length}const pe=D(C);if(!pe)throw $t(o.replace("{}",C)),new Error('Unknown language: "'+C+'"');const oe=aN(pe);let ze="",P=M||oe;const Mn={},ne=new a.__emitter(a);It();let Y="",kn=0,Ae=0,Gn=0,Wn=!1;try{if(pe.__emitTokens)pe.__emitTokens(O,ne);else{for(P.matcher.considerAll();;){Gn++,Wn?Wn=!1:P.matcher.considerAll(),P.matcher.lastIndex=Ae;const x=P.matcher.exec(O);if(!x)break;const T=O.substring(Ae,x.index),L=Hn(T,x);Ae=x.index+L}Hn(O.substring(Ae))}return ne.finalize(),ze=ne.toHTML(),{language:C,value:ze,relevance:kn,illegal:!1,_emitter:ne,_top:P}}catch(x){if(x.message&&x.message.includes("Illegal"))return{language:C,value:Da(O),illegal:!0,relevance:0,_illegalBy:{message:x.message,index:Ae,context:O.slice(Ae-100,Ae+100),mode:x.mode,resultSoFar:ze},_emitter:ne};if(i)return{language:C,value:Da(O),illegal:!1,relevance:0,errorRaised:x,_emitter:ne,_top:P};throw x}}function p(C){const O={value:Da(C),illegal:!1,relevance:0,_top:s,_emitter:new a.__emitter(a)};return O._emitter.addText(C),O}function h(C,O){O=O||a.languages||Object.keys(n);const R=p(C),M=O.filter(D).filter(U).map(X=>d(X,C,!1));M.unshift(R);const b=M.sort((X,te)=>{if(X.relevance!==te.relevance)return te.relevance-X.relevance;if(X.language&&te.language){if(D(X.language).supersetOf===te.language)return 1;if(D(te.language).supersetOf===X.language)return-1}return 0}),[$,W]=b,E=$;return E.secondBest=W,E}function v(C,O,R){const M=O&&t[O]||R;C.classList.add("hljs"),C.classList.add(`language-${M}`)}function w(C){let O=null;const R=c(C);if(l(R))return;if(Q("before:highlightElement",{el:C,language:R}),C.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",C);return}if(C.children.length>0&&(a.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(C)),a.throwUnescapedHTML))throw new uN("One of your code blocks includes unescaped HTML.",C.innerHTML);O=C;const M=O.textContent,b=R?u(M,{language:R,ignoreIllegals:!0}):h(M);C.innerHTML=b.value,C.dataset.highlighted="yes",v(C,R,b.language),C.result={language:b.language,re:b.relevance,relevance:b.relevance},b.secondBest&&(C.secondBest={language:b.secondBest.language,relevance:b.secondBest.relevance}),Q("after:highlightElement",{el:C,result:b,text:M})}function S(C){a=Mp(a,C)}const g=()=>{_(),ir("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function m(){_(),ir("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let y=!1;function _(){function C(){_()}if(document.readyState==="loading"){y||window.addEventListener("DOMContentLoaded",C,!1),y=!0;return}document.querySelectorAll(a.cssSelector).forEach(w)}function N(C,O){let R=null;try{R=O(e)}catch(M){if($t("Language definition for '{}' could not be registered.".replace("{}",C)),i)$t(M);else throw M;R=s}R.name||(R.name=C),n[C]=R,R.rawDefinition=O.bind(null,e),R.aliases&&z(R.aliases,{languageName:C})}function k(C){delete n[C];for(const O of Object.keys(t))t[O]===C&&delete t[O]}function I(){return Object.keys(n)}function D(C){return C=(C||"").toLowerCase(),n[C]||n[t[C]]}function z(C,{languageName:O}){typeof C=="string"&&(C=[C]),C.forEach(R=>{t[R.toLowerCase()]=O})}function U(C){const O=D(C);return O&&!O.disableAutodetect}function H(C){C["before:highlightBlock"]&&!C["before:highlightElement"]&&(C["before:highlightElement"]=O=>{C["before:highlightBlock"](Object.assign({block:O.el},O))}),C["after:highlightBlock"]&&!C["after:highlightElement"]&&(C["after:highlightElement"]=O=>{C["after:highlightBlock"](Object.assign({block:O.el},O))})}function G(C){H(C),r.push(C)}function J(C){const O=r.indexOf(C);O!==-1&&r.splice(O,1)}function Q(C,O){const R=C;r.forEach(function(M){M[R]&&M[R](O)})}function q(C){return ir("10.7.0","highlightBlock will be removed entirely in v12.0"),ir("10.7.0","Please use highlightElement now."),w(C)}Object.assign(e,{highlight:u,highlightAuto:h,highlightAll:_,highlightElement:w,highlightBlock:q,configure:S,initHighlighting:g,initHighlightingOnLoad:m,registerLanguage:N,unregisterLanguage:k,listLanguages:I,getLanguage:D,registerAliases:z,autoDetection:U,inherit:Mp,addPlugin:G,removePlugin:J}),e.debugMode=function(){i=!1},e.safeMode=function(){i=!0},e.versionString=cN,e.regex={concat:Jt,lookahead:_m,either:tu,optional:_R,anyNumberOfTimes:ER};for(const C in ko)typeof ko[C]=="object"&&Sm(ko[C]);return Object.assign(e,ko),e},Lr=Dm({});Lr.newInstance=()=>Dm({});var pN=Lr;Lr.HighlightJS=Lr;Lr.default=Lr;const fN=Br(pN),Lp={},hN="hljs-";function gN(e){const n=fN.newInstance();return e&&o(e),{highlight:t,highlightAuto:r,listLanguages:i,register:o,registerAlias:s,registered:a};function t(l,c,u){const d=u||Lp,p=typeof d.prefix=="string"?d.prefix:hN;if(!n.getLanguage(l))throw new Error("Unknown language: `"+l+"` is not registered");n.configure({__emitter:mN,classPrefix:p});const h=n.highlight(c,{ignoreIllegals:!0,language:l});if(h.errorRaised)throw new Error("Could not highlight with `Highlight.js`",{cause:h.errorRaised});const v=h._emitter.root,w=v.data;return w.language=h.language,w.relevance=h.relevance,v}function r(l,c){const d=(c||Lp).subset||i();let p=-1,h=0,v;for(;++p<d.length;){const w=d[p];if(!n.getLanguage(w))continue;const S=t(w,l,c);S.data&&S.data.relevance!==void 0&&S.data.relevance>h&&(h=S.data.relevance,v=S)}return v||{type:"root",children:[],data:{language:void 0,relevance:h}}}function i(){return n.listLanguages()}function o(l,c){if(typeof l=="string")n.registerLanguage(l,c);else{let u;for(u in l)Object.hasOwn(l,u)&&n.registerLanguage(u,l[u])}}function s(l,c){if(typeof l=="string")n.registerAliases(typeof c=="string"?c:[...c],{languageName:l});else{let u;for(u in l)if(Object.hasOwn(l,u)){const d=l[u];n.registerAliases(typeof d=="string"?d:[...d],{languageName:u})}}}function a(l){return!!n.getLanguage(l)}}class mN{constructor(n){this.options=n,this.root={type:"root",children:[],data:{language:void 0,relevance:0}},this.stack=[this.root]}addText(n){if(n==="")return;const t=this.stack[this.stack.length-1],r=t.children[t.children.length-1];r&&r.type==="text"?r.value+=n:t.children.push({type:"text",value:n})}startScope(n){this.openNode(String(n))}endScope(){this.closeNode()}__addSublanguage(n,t){const r=this.stack[this.stack.length-1],i=n.root.children;t?r.children.push({type:"element",tagName:"span",properties:{className:[t]},children:i}):r.children.push(...i)}openNode(n){const t=this,r=n.split(".").map(function(s,a){return a?s+"_".repeat(a):t.options.classPrefix+s}),i=this.stack[this.stack.length-1],o={type:"element",tagName:"span",properties:{className:r},children:[]};i.children.push(o),this.stack.push(o)}closeNode(){this.stack.pop()}finalize(){}toHTML(){return""}}const yN={};function bN(e){const n=e||yN,t=n.aliases,r=n.detect||!1,i=n.languages||bR,o=n.plainText,s=n.prefix,a=n.subset;let l="hljs";const c=gN(i);if(t&&c.registerAlias(t),s){const u=s.indexOf("-");l=u===-1?s:s.slice(0,u)}return function(u,d){Zc(u,"element",function(p,h,v){if(p.tagName!=="code"||!v||v.type!=="element"||v.tagName!=="pre")return;const w=vN(p);if(w===!1||!w&&!r||w&&o&&o.includes(w))return;Array.isArray(p.properties.className)||(p.properties.className=[]),p.properties.className.includes(l)||p.properties.className.unshift(l);const S=HC(p,{whitespace:"pre"});let g;try{g=w?c.highlight(w,S,{prefix:s}):c.highlightAuto(S,{prefix:s,subset:a})}catch(m){const y=m;if(w&&/Unknown language/.test(y.message)){d.message("Cannot highlight as `"+w+"`, it’s not registered",{ancestors:[v,p],cause:y,place:p.position,ruleId:"missing-language",source:"rehype-highlight"});return}throw y}!w&&g.data&&g.data.language&&p.properties.className.push("language-"+g.data.language),g.children.length>0&&(p.children=g.children)})}}function vN(e){const n=e.properties.className;let t=-1;if(!Array.isArray(n))return;let r;for(;++t<n.length;){const i=String(n[t]);if(i==="no-highlight"||i==="nohighlight")return!1;!r&&i.slice(0,5)==="lang-"&&(r=i.slice(5)),!r&&i.slice(0,9)==="language-"&&(r=i.slice(9))}return r}const wN={h1:({children:e})=>f.jsx("h2",{children:e}),h2:({children:e})=>f.jsx("h3",{children:e}),h3:({children:e})=>f.jsx("h4",{children:e}),h4:({children:e})=>f.jsx("h5",{children:e}),h5:({children:e})=>f.jsx("h6",{children:e})};function xN({markdown:e}){return e?f.jsx("div",{className:"markdown-view",children:f.jsx(OC,{rehypePlugins:[bN],components:wN,children:e})}):null}class SN extends A.Component{constructor(n){super(n),this.state={error:null}}static getDerivedStateFromError(n){return{error:n}}render(){return this.state.error?f.jsxs("div",{className:"preview-error",children:[f.jsx("strong",{children:"This problem threw while rendering."}),f.jsx("pre",{children:String(this.state.error)})]}):this.props.children}}function kN({problemId:e,Component:n,css:t}){return f.jsxs("div",{className:"preview-pane","data-problem":e,children:[t?f.jsx("style",{children:t}):null,f.jsx(SN,{children:f.jsx(n,{})},e)]})}function Lm(e){return e instanceof Map?e.clear=e.delete=e.set=function(){throw new Error("map is read-only")}:e instanceof Set&&(e.add=e.clear=e.delete=function(){throw new Error("set is read-only")}),Object.freeze(e),Object.getOwnPropertyNames(e).forEach(n=>{const t=e[n],r=typeof t;(r==="object"||r==="function")&&!Object.isFrozen(t)&&Lm(t)}),e}class Pp{constructor(n){n.data===void 0&&(n.data={}),this.data=n.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function Pm(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function gt(e,...n){const t=Object.create(null);for(const r in e)t[r]=e[r];return n.forEach(function(r){for(const i in r)t[i]=r[i]}),t}const EN="</span>",Bp=e=>!!e.scope,_N=(e,{prefix:n})=>{if(e.startsWith("language:"))return e.replace("language:","language-");if(e.includes(".")){const t=e.split(".");return[`${n}${t.shift()}`,...t.map((r,i)=>`${r}${"_".repeat(i+1)}`)].join(" ")}return`${n}${e}`};class CN{constructor(n,t){this.buffer="",this.classPrefix=t.classPrefix,n.walk(this)}addText(n){this.buffer+=Pm(n)}openNode(n){if(!Bp(n))return;const t=_N(n.scope,{prefix:this.classPrefix});this.span(t)}closeNode(n){Bp(n)&&(this.buffer+=EN)}value(){return this.buffer}span(n){this.buffer+=`<span class="${n}">`}}const jp=(e={})=>{const n={children:[]};return Object.assign(n,e),n};class ou{constructor(){this.rootNode=jp(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(n){this.top.children.push(n)}openNode(n){const t=jp({scope:n});this.add(t),this.stack.push(t)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(n){return this.constructor._walk(n,this.rootNode)}static _walk(n,t){return typeof t=="string"?n.addText(t):t.children&&(n.openNode(t),t.children.forEach(r=>this._walk(n,r)),n.closeNode(t)),n}static _collapse(n){typeof n!="string"&&n.children&&(n.children.every(t=>typeof t=="string")?n.children=[n.children.join("")]:n.children.forEach(t=>{ou._collapse(t)}))}}class TN extends ou{constructor(n){super(),this.options=n}addText(n){n!==""&&this.add(n)}startScope(n){this.openNode(n)}endScope(){this.closeNode()}__addSublanguage(n,t){const r=n.root;t&&(r.scope=`language:${t}`),this.add(r)}toHTML(){return new CN(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function zi(e){return e?typeof e=="string"?e:e.source:null}function Bm(e){return er("(?=",e,")")}function RN(e){return er("(?:",e,")*")}function NN(e){return er("(?:",e,")?")}function er(...e){return e.map(t=>zi(t)).join("")}function IN(e){const n=e[e.length-1];return typeof n=="object"&&n.constructor===Object?(e.splice(e.length-1,1),n):{}}function Us(...e){return"("+(IN(e).capture?"":"?:")+e.map(r=>zi(r)).join("|")+")"}function jm(e){return new RegExp(e.toString()+"|").exec("").length-1}function AN(e,n){const t=e&&e.exec(n);return t&&t.index===0}const ON=new RegExp(Us(/\[(?:[^\\\]]|\\.)*\]/,/\(\?<(?![=!])[^>]+>/,/\(\?'[^']+'/,/\(\??/,/\\([1-9][0-9]*)/,/\\./));function su(e,{joinWith:n}){let t=0;return e.map(r=>{t+=1;const i=t;let o=zi(r),s="";for(;o.length>0;){const a=ON.exec(o);if(!a){s+=o;break}s+=o.substring(0,a.index),o=o.substring(a.index+a[0].length),a[0][0]==="\\"&&a[1]?s+="\\"+String(Number(a[1])+i):(s+=a[0],(a[0]==="("||/^\(\?[<']/.test(a[0]))&&t++)}return s}).map(r=>`(${r})`).join(n)}const MN=/\b\B/,Fm="[a-zA-Z]\\w*",au="[a-zA-Z_]\\w*",zm="\\b\\d+(\\.\\d+)?",Um="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",$m="\\b(0b[01]+)",DN="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",LN=(e={})=>{const n=/^#![ ]*\//;return e.binary&&(e.begin=er(n,/.*\b/,e.binary,/\b.*/)),gt({scope:"meta",begin:n,end:/$/,relevance:0,"on:begin":(t,r)=>{t.index!==0&&r.ignoreMatch()}},e)},Ui={begin:"\\\\[\\s\\S]",relevance:0},PN={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[Ui]},BN={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[Ui]},jN={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},$s=function(e,n,t={}){const r=gt({scope:"comment",begin:e,end:n,contains:[]},t);r.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const i=Us("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return r.contains.push({begin:er(/[ ]+/,"(",i,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),r},FN=$s("//","$"),zN=$s("/\\*","\\*/"),UN=$s("#","$"),$N={scope:"number",begin:zm,relevance:0},HN={scope:"number",begin:Um,relevance:0},GN={scope:"number",begin:$m,relevance:0},WN={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[Ui,{begin:/\[/,end:/\]/,relevance:0,contains:[Ui]}]},KN={scope:"title",begin:Fm,relevance:0},VN={scope:"title",begin:au,relevance:0},qN={begin:"\\.\\s*"+au,relevance:0},YN=function(e){return Object.assign(e,{"on:begin":(n,t)=>{t.data._beginMatch=n[1]},"on:end":(n,t)=>{t.data._beginMatch!==n[1]&&t.ignoreMatch()}})};var Eo=Object.freeze({__proto__:null,APOS_STRING_MODE:PN,BACKSLASH_ESCAPE:Ui,BINARY_NUMBER_MODE:GN,BINARY_NUMBER_RE:$m,COMMENT:$s,C_BLOCK_COMMENT_MODE:zN,C_LINE_COMMENT_MODE:FN,C_NUMBER_MODE:HN,C_NUMBER_RE:Um,END_SAME_AS_BEGIN:YN,HASH_COMMENT_MODE:UN,IDENT_RE:Fm,MATCH_NOTHING_RE:MN,METHOD_GUARD:qN,NUMBER_MODE:$N,NUMBER_RE:zm,PHRASAL_WORDS_MODE:jN,QUOTE_STRING_MODE:BN,REGEXP_MODE:WN,RE_STARTERS_RE:DN,SHEBANG:LN,TITLE_MODE:KN,UNDERSCORE_IDENT_RE:au,UNDERSCORE_TITLE_MODE:VN});function QN(e,n){e.input[e.index-1]==="."&&n.ignoreMatch()}function XN(e,n){e.className!==void 0&&(e.scope=e.className,delete e.className)}function ZN(e,n){n&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",e.__beforeBegin=QN,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,e.relevance===void 0&&(e.relevance=0))}function JN(e,n){Array.isArray(e.illegal)&&(e.illegal=Us(...e.illegal))}function eI(e,n){if(e.match){if(e.begin||e.end)throw new Error("begin & end are not supported with match");e.begin=e.match,delete e.match}}function nI(e,n){e.relevance===void 0&&(e.relevance=1)}const tI=(e,n)=>{if(!e.beforeMatch)return;if(e.starts)throw new Error("beforeMatch cannot be used with starts");const t=Object.assign({},e);Object.keys(e).forEach(r=>{delete e[r]}),e.keywords=t.keywords,e.begin=er(t.beforeMatch,Bm(t.begin)),e.starts={relevance:0,contains:[Object.assign(t,{endsParent:!0})]},e.relevance=0,delete t.beforeMatch},rI=["of","and","for","in","not","or","if","then","parent","list","value"],iI="keyword";function Hm(e,n,t=iI){const r=Object.create(null);return typeof e=="string"?i(t,e.split(" ")):Array.isArray(e)?i(t,e):Object.keys(e).forEach(function(o){Object.assign(r,Hm(e[o],n,o))}),r;function i(o,s){n&&(s=s.map(a=>a.toLowerCase())),s.forEach(function(a){const l=a.split("|");r[l[0]]=[o,oI(l[0],l[1])]})}}function oI(e,n){return n?Number(n):sI(e)?0:1}function sI(e){return rI.includes(e.toLowerCase())}const Fp={},Ht=e=>{console.error(e)},zp=(e,...n)=>{console.log(`WARN: ${e}`,...n)},or=(e,n)=>{Fp[`${e}/${n}`]||(console.log(`Deprecated as of ${e}. ${n}`),Fp[`${e}/${n}`]=!0)},vs=new Error;function Gm(e,n,{key:t}){let r=0;const i=e[t],o={},s={};for(let a=1;a<=n.length;a++)s[a+r]=i[a],o[a+r]=!0,r+=jm(n[a-1]);e[t]=s,e[t]._emit=o,e[t]._multi=!0}function aI(e){if(Array.isArray(e.begin)){if(e.skip||e.excludeBegin||e.returnBegin)throw Ht("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),vs;if(typeof e.beginScope!="object"||e.beginScope===null)throw Ht("beginScope must be object"),vs;Gm(e,e.begin,{key:"beginScope"}),e.begin=su(e.begin,{joinWith:""})}}function lI(e){if(Array.isArray(e.end)){if(e.skip||e.excludeEnd||e.returnEnd)throw Ht("skip, excludeEnd, returnEnd not compatible with endScope: {}"),vs;if(typeof e.endScope!="object"||e.endScope===null)throw Ht("endScope must be object"),vs;Gm(e,e.end,{key:"endScope"}),e.end=su(e.end,{joinWith:""})}}function cI(e){e.scope&&typeof e.scope=="object"&&e.scope!==null&&(e.beginScope=e.scope,delete e.scope)}function uI(e){cI(e),typeof e.beginScope=="string"&&(e.beginScope={_wrap:e.beginScope}),typeof e.endScope=="string"&&(e.endScope={_wrap:e.endScope}),aI(e),lI(e)}function dI(e){function n(s,a){return new RegExp(zi(s),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(a?"g":""))}class t{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(a,l){l.position=this.position++,this.matchIndexes[this.matchAt]=l,this.regexes.push([l,a]),this.matchAt+=jm(a)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const a=this.regexes.map(l=>l[1]);this.matcherRe=n(su(a,{joinWith:"|"}),!0),this.lastIndex=0}exec(a){this.matcherRe.lastIndex=this.lastIndex;const l=this.matcherRe.exec(a);if(!l)return null;const c=l.findIndex((d,p)=>p>0&&d!==void 0),u=this.matchIndexes[c];return l.splice(0,c),Object.assign(l,u)}}class r{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(a){if(this.multiRegexes[a])return this.multiRegexes[a];const l=new t;return this.rules.slice(a).forEach(([c,u])=>l.addRule(c,u)),l.compile(),this.multiRegexes[a]=l,l}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(a,l){this.rules.push([a,l]),l.type==="begin"&&this.count++}exec(a){const l=this.getMatcher(this.regexIndex);l.lastIndex=this.lastIndex;let c=l.exec(a);if(this.resumingScanAtSamePosition()&&!(c&&c.index===this.lastIndex)){const u=this.getMatcher(0);u.lastIndex=this.lastIndex+1,c=u.exec(a)}return c&&(this.regexIndex+=c.position+1,this.regexIndex===this.count&&this.considerAll()),c}}function i(s){const a=new r;return s.contains.forEach(l=>a.addRule(l.begin,{rule:l,type:"begin"})),s.terminatorEnd&&a.addRule(s.terminatorEnd,{type:"end"}),s.illegal&&a.addRule(s.illegal,{type:"illegal"}),a}function o(s,a){const l=s;if(s.isCompiled)return l;[XN,eI,uI,tI].forEach(u=>u(s,a)),e.compilerExtensions.forEach(u=>u(s,a)),s.__beforeBegin=null,[ZN,JN,nI].forEach(u=>u(s,a)),s.isCompiled=!0;let c=null;return typeof s.keywords=="object"&&s.keywords.$pattern&&(s.keywords=Object.assign({},s.keywords),c=s.keywords.$pattern,delete s.keywords.$pattern),c=c||/\w+/,s.keywords&&(s.keywords=Hm(s.keywords,e.case_insensitive)),l.keywordPatternRe=n(c,!0),a&&(s.begin||(s.begin=/\B|\b/),l.beginRe=n(l.begin),!s.end&&!s.endsWithParent&&(s.end=/\B|\b/),s.end&&(l.endRe=n(l.end)),l.terminatorEnd=zi(l.end)||"",s.endsWithParent&&a.terminatorEnd&&(l.terminatorEnd+=(s.end?"|":"")+a.terminatorEnd)),s.illegal&&(l.illegalRe=n(s.illegal)),s.contains||(s.contains=[]),s.contains=[].concat(...s.contains.map(function(u){return pI(u==="self"?s:u)})),s.contains.forEach(function(u){o(u,l)}),s.starts&&o(s.starts,a),l.matcher=i(l),l}if(e.compilerExtensions||(e.compilerExtensions=[]),e.contains&&e.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return e.classNameAliases=gt(e.classNameAliases||{}),o(e)}function Wm(e){return e?e.endsWithParent||Wm(e.starts):!1}function pI(e){return e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map(function(n){return gt(e,{variants:null},n)})),e.cachedVariants?e.cachedVariants:Wm(e)?gt(e,{starts:e.starts?gt(e.starts):null}):Object.isFrozen(e)?gt(e):e}var fI="11.12.0";class hI extends Error{constructor(n,t){super(n),this.name="HTMLInjectionError",this.html=t}}const La=Pm,Up=gt,$p=Symbol("nomatch"),gI=7,Km=function(e){const n=Object.create(null),t=Object.create(null),r=[];let i=!0;const o="Could not find the language '{}', did you forget to load/include a language module?",s={disableAutodetect:!0,name:"Plain text",contains:[]};let a={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:TN};function l(C){return a.noHighlightRe.test(C)}function c(C){let O=C.className+" ";O+=C.parentNode?C.parentNode.className:"";const R=a.languageDetectRe.exec(O);if(R){const M=D(R[1]);return M||(zp(o.replace("{}",R[1])),zp("Falling back to no-highlight mode for this block.",C)),M?R[1]:"no-highlight"}return O.split(/\s+/).find(M=>l(M)||D(M))}function u(C,O,R){let M="",b="";typeof O=="object"?(M=C,R=O.ignoreIllegals,b=O.language):(or("10.7.0","highlight(lang, code, ...args) has been deprecated."),or("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),b=C,M=O),R===void 0&&(R=!0);const $={code:M,language:b};Q("before:highlight",$);const W=$.result?$.result:d($.language,$.code,R);return W.code=$.code,Q("after:highlight",W),W}function d(C,O,R,M){const b=Object.create(null);function $(x,T){return x.keywords[T]}function W(){if(!P.keywords){ne.addText(Y);return}let x=0;P.keywordPatternRe.lastIndex=0;let T=P.keywordPatternRe.exec(Y),L="";for(;T;){L+=Y.substring(x,T.index);const B=pe.case_insensitive?T[0].toLowerCase():T[0],V=$(P,B);if(V){const[ae,En]=V;if(ne.addText(L),L="",b[B]=(b[B]||0)+1,b[B]<=gI&&(kn+=En),ae.startsWith("_"))L+=T[0];else{const nn=pe.classNameAliases[ae]||ae;te(T[0],nn)}}else L+=T[0];x=P.keywordPatternRe.lastIndex,T=P.keywordPatternRe.exec(Y)}L+=Y.substring(x),ne.addText(L)}function E(){if(Y==="")return;let x=null;if(typeof P.subLanguage=="string"){if(!n[P.subLanguage]){ne.addText(Y);return}x=d(P.subLanguage,Y,!0,Mn[P.subLanguage]),Mn[P.subLanguage]=x._top}else x=h(Y,P.subLanguage.length?P.subLanguage:null);P.relevance>0&&(kn+=x.relevance),ne.__addSublanguage(x._emitter,x.language)}function X(){P.subLanguage!=null?E():W(),Y=""}function te(x,T){x!==""&&(ne.startScope(T),ne.addText(x),ne.endScope())}function ie(x,T){let L=1;const B=T.length-1;for(;L<=B;){if(!x._emit[L]){L++;continue}const V=pe.classNameAliases[x[L]]||x[L],ae=T[L];V?te(ae,V):(Y=ae,W(),Y=""),L++}}function Te(x,T){return x.scope&&typeof x.scope=="string"&&ne.openNode(pe.classNameAliases[x.scope]||x.scope),x.beginScope&&(x.beginScope._wrap?(te(Y,pe.classNameAliases[x.beginScope._wrap]||x.beginScope._wrap),Y=""):x.beginScope._multi&&(ie(x.beginScope,T),Y="")),P=Object.create(x,{parent:{value:P}}),P}function Ie(x,T,L){let B=AN(x.endRe,L);if(B){if(x["on:end"]){const V=new Pp(x);x["on:end"](T,V),V.isMatchIgnored&&(B=!1)}if(B){for(;x.endsParent&&x.parent;)x=x.parent;return x}}if(x.endsWithParent)return Ie(x.parent,T,L)}function pn(x){return P.matcher.regexIndex===0?(Y+=x[0],1):(Wn=!0,0)}function fn(x){const T=x[0],L=x.rule,B=new Pp(L),V=[L.__beforeBegin,L["on:begin"]];for(const ae of V)if(ae&&(ae(x,B),B.isMatchIgnored))return pn(T);return L.skip?Y+=T:(L.excludeBegin&&(Y+=T),X(),!L.returnBegin&&!L.excludeBegin&&(Y=T)),Te(L,x),L.returnBegin?0:T.length}function On(x){const T=x[0],L=O.substring(x.index),B=Ie(P,x,L);if(!B)return $p;const V=P;P.endScope&&P.endScope._wrap?(X(),te(T,P.endScope._wrap)):P.endScope&&P.endScope._multi?(X(),ie(P.endScope,x)):V.skip?Y+=T:(V.returnEnd||V.excludeEnd||(Y+=T),X(),V.excludeEnd&&(Y=T));do P.scope&&ne.closeNode(),!P.skip&&!P.subLanguage&&(kn+=P.relevance),P=P.parent;while(P!==B.parent);return B.starts&&Te(B.starts,x),V.returnEnd?0:T.length}function It(){const x=[];for(let T=P;T!==pe;T=T.parent)T.scope&&x.unshift(T.scope);x.forEach(T=>ne.openNode(T))}let en={};function Hn(x,T){const L=T&&T[0];if(Y+=x,L==null)return X(),0;if(en.type==="begin"&&T.type==="end"&&en.index===T.index&&L===""){if(Y+=O.slice(T.index,T.index+1),!i){const B=new Error(`0 width match regex (${C})`);throw B.languageName=C,B.badRule=en.rule,B}return 1}if(en=T,T.type==="begin")return fn(T);if(T.type==="illegal"&&!R){const B=new Error('Illegal lexeme "'+L+'" for mode "'+(P.scope||"<unnamed>")+'"');throw B.mode=P,B}else if(T.type==="end"){const B=On(T);if(B!==$p)return B}if(T.type==="illegal"&&L==="")return T.index===O.length||(Y+=`
`),1;if(Gn>1e5&&Gn>T.index*3)throw new Error("potential infinite loop, way more iterations than matches");return Y+=L,L.length}const pe=D(C);if(!pe)throw Ht(o.replace("{}",C)),new Error('Unknown language: "'+C+'"');const oe=dI(pe);let ze="",P=M||oe;const Mn={},ne=new a.__emitter(a);It();let Y="",kn=0,Ae=0,Gn=0,Wn=!1;try{if(pe.__emitTokens)pe.__emitTokens(O,ne);else{for(P.matcher.considerAll();;){Gn++,Wn?Wn=!1:P.matcher.considerAll(),P.matcher.lastIndex=Ae;const x=P.matcher.exec(O);if(!x)break;const T=O.substring(Ae,x.index),L=Hn(T,x);Ae=x.index+L}Hn(O.substring(Ae))}return ne.finalize(),ze=ne.toHTML(),{language:C,value:ze,relevance:kn,illegal:!1,_emitter:ne,_top:P}}catch(x){if(x.message&&x.message.includes("Illegal"))return{language:C,value:La(O),illegal:!0,relevance:0,_illegalBy:{message:x.message,index:Ae,context:O.slice(Ae-100,Ae+100),mode:x.mode,resultSoFar:ze},_emitter:ne};if(i)return{language:C,value:La(O),illegal:!1,relevance:0,errorRaised:x,_emitter:ne,_top:P};throw x}}function p(C){const O={value:La(C),illegal:!1,relevance:0,_top:s,_emitter:new a.__emitter(a)};return O._emitter.addText(C),O}function h(C,O){O=O||a.languages||Object.keys(n);const R=p(C),M=O.filter(D).filter(U).map(X=>d(X,C,!1));M.unshift(R);const b=M.sort((X,te)=>{if(X.relevance!==te.relevance)return te.relevance-X.relevance;if(X.language&&te.language){if(D(X.language).supersetOf===te.language)return 1;if(D(te.language).supersetOf===X.language)return-1}return 0}),[$,W]=b,E=$;return E.secondBest=W,E}function v(C,O,R){const M=O&&t[O]||R;C.classList.add("hljs"),C.classList.add(`language-${M}`)}function w(C){let O=null;const R=c(C);if(l(R))return;if(Q("before:highlightElement",{el:C,language:R}),C.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",C);return}if(C.children.length>0&&(a.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(C)),a.throwUnescapedHTML))throw new hI("One of your code blocks includes unescaped HTML.",C.innerHTML);O=C;const M=O.textContent,b=R?u(M,{language:R,ignoreIllegals:!0}):h(M);C.innerHTML=b.value,C.dataset.highlighted="yes",v(C,R,b.language),C.result={language:b.language,re:b.relevance,relevance:b.relevance},b.secondBest&&(C.secondBest={language:b.secondBest.language,relevance:b.secondBest.relevance}),Q("after:highlightElement",{el:C,result:b,text:M})}function S(C){a=Up(a,C)}const g=()=>{_(),or("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function m(){_(),or("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let y=!1;function _(){function C(){_()}if(document.readyState==="loading"){y||window.addEventListener("DOMContentLoaded",C,!1),y=!0;return}document.querySelectorAll(a.cssSelector).forEach(w)}function N(C,O){let R=null;try{R=O(e)}catch(M){if(Ht("Language definition for '{}' could not be registered.".replace("{}",C)),i)Ht(M);else throw M;R=s}R.name||(R.name=C),n[C]=R,R.rawDefinition=O.bind(null,e),R.aliases&&z(R.aliases,{languageName:C})}function k(C){delete n[C];for(const O of Object.keys(t))t[O]===C&&delete t[O]}function I(){return Object.keys(n)}function D(C){return C=(C||"").toLowerCase(),n[C]||n[t[C]]}function z(C,{languageName:O}){typeof C=="string"&&(C=[C]),C.forEach(R=>{t[R.toLowerCase()]=O})}function U(C){const O=D(C);return O&&!O.disableAutodetect}function H(C){C["before:highlightBlock"]&&!C["before:highlightElement"]&&(C["before:highlightElement"]=O=>{C["before:highlightBlock"](Object.assign({block:O.el},O))}),C["after:highlightBlock"]&&!C["after:highlightElement"]&&(C["after:highlightElement"]=O=>{C["after:highlightBlock"](Object.assign({block:O.el},O))})}function G(C){H(C),r.push(C)}function J(C){const O=r.indexOf(C);O!==-1&&r.splice(O,1)}function Q(C,O){const R=C;r.forEach(function(M){M[R]&&M[R](O)})}function q(C){return or("10.7.0","highlightBlock will be removed entirely in v12.0"),or("10.7.0","Please use highlightElement now."),w(C)}Object.assign(e,{highlight:u,highlightAuto:h,highlightAll:_,highlightElement:w,highlightBlock:q,configure:S,initHighlighting:g,initHighlightingOnLoad:m,registerLanguage:N,unregisterLanguage:k,listLanguages:I,getLanguage:D,registerAliases:z,autoDetection:U,inherit:Up,addPlugin:G,removePlugin:J}),e.debugMode=function(){i=!1},e.safeMode=function(){i=!0},e.versionString=fI,e.regex={concat:er,lookahead:Bm,either:Us,optional:NN,anyNumberOfTimes:RN};for(const C in Eo)typeof Eo[C]=="object"&&Lm(Eo[C]);return Object.assign(e,Eo),e},Pr=Km({});Pr.newInstance=()=>Km({});var mI=Pr;Pr.HighlightJS=Pr;Pr.default=Pr;const Hs=Br(mI),Hp="[A-Za-z$_][0-9A-Za-z$_]*",yI=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],bI=["true","false","null","undefined","NaN","Infinity"],Vm=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],qm=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],Ym=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],vI=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","self","global"],wI=[].concat(Ym,Vm,qm);function xI(e){const n=e.regex,t=(R,{after:M})=>{const b="</"+R[0].slice(1);return R.input.indexOf(b,M)!==-1},r=Hp,i={begin:"<>",end:"</>"},o=/<[A-Za-z0-9\\._:-]+\s*\/>/,s={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(R,M)=>{const b=R[0].length+R.index,$=R.input[b];if($==="<"||$===","){M.ignoreMatch();return}$===">"&&(t(R,{after:b})||M.ignoreMatch());let W;const E=R.input.substring(b);if(W=E.match(/^\s*=/)){M.ignoreMatch();return}if((W=E.match(/^\s+extends\s+/))&&W.index===0){M.ignoreMatch();return}}},a={$pattern:Hp,keyword:yI,literal:bI,built_in:wI,"variable.language":vI},l="[0-9](_?[0-9])*",c=`\\.(${l})`,u="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",d={className:"number",variants:[{begin:`(\\b(${u})((${c})|\\.)?|(${c}))[eE][+-]?(${l})\\b`},{begin:`\\b(${u})\\b((${c})\\b|\\.)?|(${c})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},p={className:"subst",begin:"\\$\\{",end:"\\}",keywords:a,contains:[]},h={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,p],subLanguage:"xml"}},v={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,p],subLanguage:"css"}},w={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,p],subLanguage:"graphql"}},S={className:"string",begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE,p]},m={className:"comment",variants:[e.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:r+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE]},y=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,h,v,w,S,{match:/\$\d+/},d];p.contains=y.concat({begin:/\{/,end:/\}/,keywords:a,contains:["self"].concat(y)});const _=[].concat(m,p.contains),N=_.concat([{begin:/(\s*)\(/,end:/\)/,keywords:a,contains:["self"].concat(_)}]),k={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:N},I={variants:[{match:[/class/,/\s+/,r,/\s+/,/extends/,/\s+/,n.concat(r,"(",n.concat(/\./,r),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,r],scope:{1:"keyword",3:"title.class"}}]},D={relevance:0,match:n.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...Vm,...qm]}},z={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},U={variants:[{match:[/function/,/\s+/,r,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[k],illegal:/%/},H={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function G(R){return n.concat("(?!",R.join("|"),")")}const J={match:n.concat(/\b/,G([...Ym,"super","import","await"].map(R=>`${R}\\s*\\(`)),r,n.lookahead(/\s*\(/)),className:"title.function",relevance:0},Q={begin:n.concat(/\./,n.lookahead(n.concat(r,/(?![0-9A-Za-z$_(])/))),end:r,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},q={match:[/get|set/,/\s+/,r,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},k]},C="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+e.UNDERSCORE_IDENT_RE+")\\s*=>",O={match:[/const|var|let/,/\s+/,r,/\s*/,/=\s*/,/(async\s*)?/,n.lookahead(C)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[k]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:a,exports:{PARAMS_CONTAINS:N,CLASS_REFERENCE:D},illegal:/#(?![$_A-Za-z])/,contains:[e.SHEBANG({label:"shebang",binary:"node",relevance:5}),z,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,h,v,w,S,m,{match:/\$\d+/},d,D,{scope:"attr",match:r+n.lookahead(":"),relevance:0},O,{begin:"("+e.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[m,e.REGEXP_MODE,{className:"function",begin:C,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:e.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:N}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:i.begin,end:i.end},{match:o},{begin:s.begin,"on:begin":s.isTrulyOpeningTag,end:s.end}],subLanguage:"xml",contains:[{begin:s.begin,end:s.end,skip:!0,contains:["self"]}]}]},U,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+e.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[k,e.inherit(e.TITLE_MODE,{begin:r,className:"title.function"})]},{match:/\.\.\./,relevance:0},Q,{match:"\\$"+r,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[k]},J,H,I,q,{match:/\$[(.]/}]}}function SI(e){const n=e.regex,t=n.concat(/[\p{L}_]/u,n.optional(/[\p{L}0-9_.-]*:/u),/[\p{L}0-9_.-]*/u),r=/[\p{L}0-9._:-]+/u,i={className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},o={begin:/\s/,contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\n/}]},s=e.inherit(o,{begin:/\(/,end:/\)/}),a=e.inherit(e.APOS_STRING_MODE,{className:"string"}),l=e.inherit(e.QUOTE_STRING_MODE,{className:"string"}),c={endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",begin:r,relevance:0},{begin:/=\s*/,relevance:0,contains:[{className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[i]},{begin:/'/,end:/'/,contains:[i]},{begin:/[^\s"'=<>`]+/}]}]}]};return{name:"HTML, XML",aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,relevance:10,contains:[o,l,a,s,{begin:/\[/,end:/\]/,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,contains:[o,s,l,a]}]}]},e.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\[CDATA\[/,end:/\]\]>/,relevance:10},i,{className:"meta",end:/\?>/,variants:[{begin:/<\?xml/,relevance:10,contains:[l]},{begin:/<\?[a-z][a-z0-9]+/}]},{className:"tag",begin:/<style(?=\s|>)/,end:/>/,keywords:{name:"style"},contains:[c],starts:{end:/<\/style>/,returnEnd:!0,subLanguage:"css"}},{className:"tag",begin:/<script(?=\s|>)/,end:/>/,keywords:{name:"script"},contains:[c],starts:{end:/<\/script>/,returnEnd:!0,subLanguage:"javascript"}},{className:"tag",begin:/<>|<\/>/},{className:"tag",begin:n.concat(/</,n.lookahead(n.concat(t,n.either(/\/>/,/>/,/\s/)))),end:/\/?>/,contains:[{className:"name",begin:t,relevance:0,starts:c}]},{className:"tag",begin:n.concat(/<\//,n.lookahead(n.concat(t,/>/))),contains:[{className:"name",begin:t,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}}const kI=e=>({IMPORTANT:{scope:"meta",begin:"!important"},BLOCK_COMMENT:e.C_BLOCK_COMMENT_MODE,HEXCOLOR:{scope:"number",begin:/#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/},UNICODE_RANGE:{scope:"number",begin:/\b[Uu]\+[0-9A-Fa-f][0-9A-Fa-f?]{0,5}(-[0-9A-Fa-f][0-9A-Fa-f]{0,5})?/},FUNCTION_DISPATCH:{className:"built_in",begin:/[\w-]+(?=\()/},ATTRIBUTE_SELECTOR_MODE:{scope:"selector-attr",begin:/\[/,end:/\]/,illegal:"$",contains:[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},CSS_NUMBER_MODE:{scope:"number",begin:e.NUMBER_RE+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",relevance:0},CSS_VARIABLE:{className:"attr",begin:/--[A-Za-z_][A-Za-z0-9_-]*/}}),EI=["a","abbr","address","article","aside","audio","b","blockquote","body","button","canvas","caption","cite","code","dd","del","details","dfn","div","dl","dt","em","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","html","i","iframe","img","input","ins","kbd","label","legend","li","main","mark","menu","nav","object","ol","optgroup","option","p","picture","q","quote","samp","section","select","source","span","strong","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","ul","var","video"],_I=["defs","g","marker","mask","pattern","svg","switch","symbol","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feFlood","feGaussianBlur","feImage","feMerge","feMorphology","feOffset","feSpecularLighting","feTile","feTurbulence","linearGradient","radialGradient","stop","circle","ellipse","image","line","path","polygon","polyline","rect","text","use","textPath","tspan","foreignObject","clipPath"],CI=[...EI,..._I],TI=["any-hover","any-pointer","aspect-ratio","color","color-gamut","color-index","device-aspect-ratio","device-height","device-width","display-mode","forced-colors","grid","height","hover","inverted-colors","monochrome","orientation","overflow-block","overflow-inline","pointer","prefers-color-scheme","prefers-contrast","prefers-reduced-motion","prefers-reduced-transparency","resolution","scan","scripting","update","width","min-width","max-width","min-height","max-height"].sort().reverse(),RI=["active","any-link","blank","checked","current","default","defined","dir","disabled","drop","empty","enabled","first","first-child","first-of-type","fullscreen","future","focus","focus-visible","focus-within","has","host","host-context","hover","indeterminate","in-range","invalid","is","lang","last-child","last-of-type","left","link","local-link","not","nth-child","nth-col","nth-last-child","nth-last-col","nth-last-of-type","nth-of-type","only-child","only-of-type","optional","out-of-range","past","placeholder-shown","read-only","read-write","required","right","root","scope","target","target-within","user-invalid","valid","visited","where"].sort().reverse(),NI=["after","backdrop","before","cue","cue-region","first-letter","first-line","grammar-error","marker","part","placeholder","selection","slotted","spelling-error"].sort().reverse(),II=["accent-color","align-content","align-items","align-self","alignment-baseline","all","anchor-name","animation","animation-composition","animation-delay","animation-direction","animation-duration","animation-fill-mode","animation-iteration-count","animation-name","animation-play-state","animation-range","animation-range-end","animation-range-start","animation-timeline","animation-timing-function","appearance","aspect-ratio","backdrop-filter","backface-visibility","background","background-attachment","background-blend-mode","background-clip","background-color","background-image","background-origin","background-position","background-position-x","background-position-y","background-repeat","background-size","baseline-shift","block-size","border","border-block","border-block-color","border-block-end","border-block-end-color","border-block-end-style","border-block-end-width","border-block-start","border-block-start-color","border-block-start-style","border-block-start-width","border-block-style","border-block-width","border-bottom","border-bottom-color","border-bottom-left-radius","border-bottom-right-radius","border-bottom-style","border-bottom-width","border-collapse","border-color","border-end-end-radius","border-end-start-radius","border-image","border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width","border-inline","border-inline-color","border-inline-end","border-inline-end-color","border-inline-end-style","border-inline-end-width","border-inline-start","border-inline-start-color","border-inline-start-style","border-inline-start-width","border-inline-style","border-inline-width","border-left","border-left-color","border-left-style","border-left-width","border-radius","border-right","border-right-color","border-right-style","border-right-width","border-spacing","border-start-end-radius","border-start-start-radius","border-style","border-top","border-top-color","border-top-left-radius","border-top-right-radius","border-top-style","border-top-width","border-width","bottom","box-align","box-decoration-break","box-direction","box-flex","box-flex-group","box-lines","box-ordinal-group","box-orient","box-pack","box-shadow","box-sizing","break-after","break-before","break-inside","caption-side","caret-color","clear","clip","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","color-scheme","column-count","column-fill","column-gap","column-rule","column-rule-color","column-rule-style","column-rule-width","column-span","column-width","columns","contain","contain-intrinsic-block-size","contain-intrinsic-height","contain-intrinsic-inline-size","contain-intrinsic-size","contain-intrinsic-width","container","container-name","container-type","content","content-visibility","corner-bottom-left-shape","corner-bottom-right-shape","corner-shape","corner-top-left-shape","corner-top-right-shape","counter-increment","counter-reset","counter-set","cue","cue-after","cue-before","cursor","cx","cy","direction","display","dominant-baseline","empty-cells","enable-background","field-sizing","fill","fill-opacity","fill-rule","filter","flex","flex-basis","flex-direction","flex-flow","flex-grow","flex-shrink","flex-wrap","float","flood-color","flood-opacity","flow","font","font-display","font-family","font-feature-settings","font-kerning","font-language-override","font-optical-sizing","font-palette","font-size","font-size-adjust","font-smooth","font-smoothing","font-stretch","font-style","font-synthesis","font-synthesis-position","font-synthesis-small-caps","font-synthesis-style","font-synthesis-weight","font-variant","font-variant-alternates","font-variant-caps","font-variant-east-asian","font-variant-emoji","font-variant-ligatures","font-variant-numeric","font-variant-position","font-variation-settings","font-weight","forced-color-adjust","gap","glyph-orientation-horizontal","glyph-orientation-vertical","grid","grid-area","grid-auto-columns","grid-auto-flow","grid-auto-rows","grid-column","grid-column-end","grid-column-start","grid-gap","grid-row","grid-row-end","grid-row-start","grid-template","grid-template-areas","grid-template-columns","grid-template-rows","hanging-punctuation","height","hyphenate-character","hyphenate-limit-chars","hyphens","icon","image-orientation","image-rendering","image-resolution","ime-mode","initial-letter","initial-letter-align","inline-size","inset","inset-area","inset-block","inset-block-end","inset-block-start","inset-inline","inset-inline-end","inset-inline-start","isolation","justify-content","justify-items","justify-self","kerning","left","letter-spacing","lighting-color","line-break","line-height","line-height-step","list-style","list-style-image","list-style-position","list-style-type","margin","margin-block","margin-block-end","margin-block-start","margin-bottom","margin-inline","margin-inline-end","margin-inline-start","margin-left","margin-right","margin-top","margin-trim","marker","marker-end","marker-mid","marker-start","marks","mask","mask-border","mask-border-mode","mask-border-outset","mask-border-repeat","mask-border-slice","mask-border-source","mask-border-width","mask-clip","mask-composite","mask-image","mask-mode","mask-origin","mask-position","mask-repeat","mask-size","mask-type","masonry-auto-flow","math-depth","math-shift","math-style","max-block-size","max-height","max-inline-size","max-width","min-block-size","min-height","min-inline-size","min-width","mix-blend-mode","nav-down","nav-index","nav-left","nav-right","nav-up","none","normal","object-fit","object-position","offset","offset-anchor","offset-distance","offset-path","offset-position","offset-rotate","opacity","order","orphans","outline","outline-color","outline-offset","outline-style","outline-width","overflow","overflow-anchor","overflow-block","overflow-clip-margin","overflow-inline","overflow-wrap","overflow-x","overflow-y","overlay","overscroll-behavior","overscroll-behavior-block","overscroll-behavior-inline","overscroll-behavior-x","overscroll-behavior-y","padding","padding-block","padding-block-end","padding-block-start","padding-bottom","padding-inline","padding-inline-end","padding-inline-start","padding-left","padding-right","padding-top","page","page-break-after","page-break-before","page-break-inside","paint-order","pause","pause-after","pause-before","perspective","perspective-origin","place-content","place-items","place-self","pointer-events","position","position-anchor","position-visibility","print-color-adjust","quotes","r","resize","rest","rest-after","rest-before","right","rotate","row-gap","ruby-align","ruby-position","scale","scroll-behavior","scroll-margin","scroll-margin-block","scroll-margin-block-end","scroll-margin-block-start","scroll-margin-bottom","scroll-margin-inline","scroll-margin-inline-end","scroll-margin-inline-start","scroll-margin-left","scroll-margin-right","scroll-margin-top","scroll-padding","scroll-padding-block","scroll-padding-block-end","scroll-padding-block-start","scroll-padding-bottom","scroll-padding-inline","scroll-padding-inline-end","scroll-padding-inline-start","scroll-padding-left","scroll-padding-right","scroll-padding-top","scroll-snap-align","scroll-snap-stop","scroll-snap-type","scroll-timeline","scroll-timeline-axis","scroll-timeline-name","scrollbar-color","scrollbar-gutter","scrollbar-width","shape-image-threshold","shape-margin","shape-outside","shape-rendering","speak","speak-as","src","stop-color","stop-opacity","stroke","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width","tab-size","table-layout","text-align","text-align-all","text-align-last","text-anchor","text-combine-upright","text-decoration","text-decoration-color","text-decoration-line","text-decoration-skip","text-decoration-skip-ink","text-decoration-style","text-decoration-thickness","text-emphasis","text-emphasis-color","text-emphasis-position","text-emphasis-style","text-indent","text-justify","text-orientation","text-overflow","text-rendering","text-shadow","text-size-adjust","text-transform","text-underline-offset","text-underline-position","text-wrap","text-wrap-mode","text-wrap-style","timeline-scope","top","touch-action","transform","transform-box","transform-origin","transform-style","transition","transition-behavior","transition-delay","transition-duration","transition-property","transition-timing-function","translate","unicode-bidi","unicode-range","user-modify","user-select","vector-effect","vertical-align","view-timeline","view-timeline-axis","view-timeline-inset","view-timeline-name","view-transition-name","visibility","voice-balance","voice-duration","voice-family","voice-pitch","voice-range","voice-rate","voice-stress","voice-volume","white-space","white-space-collapse","widows","width","will-change","word-break","word-spacing","word-wrap","writing-mode","x","y","z-index","zoom"].sort().reverse();function AI(e){const n=e.regex,t=kI(e),r={begin:/-(webkit|moz|ms|o)-(?=[a-z])/},i="and or not only",o=/@-?\w[\w]*(-\w+)*/,s="[a-zA-Z-][a-zA-Z0-9_-]*",a=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE];return{name:"CSS",case_insensitive:!0,illegal:/[=|'\$]/,keywords:{keyframePosition:"from to"},classNameAliases:{keyframePosition:"selector-tag"},contains:[t.BLOCK_COMMENT,r,t.CSS_NUMBER_MODE,{className:"selector-id",begin:/#[A-Za-z0-9_-]+/,relevance:0},{className:"selector-class",begin:"\\."+s,relevance:0},t.ATTRIBUTE_SELECTOR_MODE,{className:"selector-pseudo",variants:[{begin:":("+RI.join("|")+")"},{begin:":(:)?("+NI.join("|")+")"}]},t.CSS_VARIABLE,{className:"attribute",begin:"\\b("+II.join("|")+")\\b"},{begin:/:/,end:/[;}{]/,contains:[t.BLOCK_COMMENT,t.HEXCOLOR,t.IMPORTANT,t.CSS_NUMBER_MODE,t.UNICODE_RANGE,...a,{begin:/(url|data-uri)\(/,end:/\)/,relevance:0,keywords:{built_in:"url data-uri"},contains:[...a,{className:"string",begin:/[^)]/,endsWithParent:!0,excludeEnd:!0}]},t.FUNCTION_DISPATCH]},{begin:n.lookahead(/@/),end:"[{;]",relevance:0,illegal:/:/,contains:[{className:"keyword",begin:o},{begin:/\s/,endsWithParent:!0,excludeEnd:!0,relevance:0,keywords:{$pattern:/[a-z-]+/,keyword:i,attribute:TI.join(" ")},contains:[{begin:/[a-z-]+(?=:)/,className:"attribute"},...a,t.CSS_NUMBER_MODE]}]},{className:"selector-tag",begin:"\\b("+CI.join("|")+")\\b"}]}}Hs.registerLanguage("javascript",xI);Hs.registerLanguage("xml",SI);Hs.registerLanguage("css",AI);function OI(e){return e.endsWith(".css")?"css":"javascript"}function MI({files:e}){const[n,t]=A.useState(e[0].name);A.useEffect(()=>{e.some(o=>o.name===n)||t(e[0].name)},[e,n]);const r=e.find(o=>o.name===n)??e[0],i=A.useMemo(()=>Hs.highlight(r.code,{language:OI(r.name)}).value,[r]);return f.jsxs("div",{className:"code-view",children:[e.length>1&&f.jsx("div",{className:"code-tabs",children:e.map(o=>f.jsx("button",{type:"button",className:o.name===r.name?"code-tab active":"code-tab",onClick:()=>t(o.name),children:o.name},o.name))}),f.jsx("pre",{className:"code-block",children:f.jsx("code",{className:"hljs",dangerouslySetInnerHTML:{__html:i}})})]})}const Gp=["Preview","Code"];function DI({problem:e}){const[n,t]=A.useState(Gp[0]);return f.jsxs("section",{className:"workspace",children:[f.jsxs("header",{className:"workspace-head",children:[f.jsxs("div",{children:[f.jsx("h1",{children:e.title}),f.jsxs("p",{className:"workspace-meta",children:[f.jsx("span",{children:e.category}),f.jsx("span",{className:`difficulty ${e.difficulty.toLowerCase()}`,children:e.difficulty})]})]}),f.jsx("div",{className:"tab-switch",children:Gp.map(r=>f.jsx("button",{type:"button",className:r===n?"tab active":"tab",onClick:()=>t(r),children:r},r))})]}),f.jsxs("div",{className:"workspace-body",children:[f.jsx("aside",{className:"workspace-description",children:f.jsx(xN,{markdown:e.markdown})}),f.jsx("div",{className:"workspace-stage",children:n==="Preview"?f.jsx(kN,{problemId:e.id,Component:e.Component,css:e.css}):f.jsx(MI,{files:e.files})})]})]})}function LI(){var i;const e=A.useMemo(()=>K0(),[]),[n,t]=A.useState(((i=e[0])==null?void 0:i.id)??null),r=A.useMemo(()=>n?V0(n):null,[n]);return f.jsxs("div",{className:"layout",children:[f.jsx(q0,{problems:e,selectedId:n,onSelect:t}),f.jsx("main",{className:"main",children:r?f.jsx(DI,{problem:r},r.id):f.jsx("p",{className:"empty-state",children:"No problems yet."})})]})}Pa.createRoot(document.getElementById("root")).render(f.jsx(dy.StrictMode,{children:f.jsx(LI,{})}));
