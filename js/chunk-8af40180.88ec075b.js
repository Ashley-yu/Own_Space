(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-8af40180"],{"057f":function(t,e,r){var s=r("fc6a"),a=r("241c").f,i={}.toString,c="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],n=function(t){try{return a(t)}catch(e){return c.slice()}};t.exports.f=function(t){return c&&"[object Window]"==i.call(t)?n(t):a(s(t))}},"21c0":function(t,e,r){"use strict";r.r(e);var s=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"checkOrder"},[r("HeaderPic",[r("OrderProgress",{attrs:{currentStep:t.step}})],1),r("div",{staticClass:"container"},[r("div",{staticClass:"listContent"},[r("h3",[t._v("購買清單")]),r("div",{staticClass:"row"},[r("div",{staticClass:"col-12",class:{"col-md-7":t.isConfirm}},[r("ul",{staticClass:"order"},[t._l(t.cart,(function(e,s){return r("li",{key:e.id,staticClass:"orderList"},[r("div",{staticClass:"row"},[r("div",{staticClass:"col-3 p-0",class:{"col-md-3":t.isConfirm,"col-md-2":!t.isConfirm}},[r("div",{staticClass:"productImg"},[r("img",{attrs:{src:e.imageUrl,alt:""}})])]),r("div",{staticClass:"col-md-7 p-0",class:{"col-7":t.isConfirm,"col-6":!t.isConfirm}},[r("div",{staticClass:"row m-0 w-100"},[r("div",{staticClass:"col-12 col-md-7 p-0"},[r("div",{staticClass:"productName",on:{click:function(r){return t.$router.push("/product_detail/"+e.id)}}},[t._v(t._s(e.title))])]),r("div",{staticClass:"col-12 col-md-5 p-0"},[t.isConfirm?r("div",{staticClass:"productQty"},[t._v("x "+t._s(e.qty))]):r("div",{staticClass:"productNum"},[r("div",{staticClass:"countNumber"},[r("button",{staticClass:"btn minus",on:{click:function(r){return t.changeQty(e,-1)}}},[r("i",{staticClass:"fas fa-minus"})]),r("input",{staticClass:"productNumber",attrs:{type:"number",max:"10",min:"1"},domProps:{value:t.cart[s].qty},on:{change:function(r){return t.changeNumber(e,r.target.value)}}}),r("button",{staticClass:"btn add",on:{click:function(r){return t.changeQty(e,1)}}},[r("i",{staticClass:"fas fa-plus"})])])])])])]),r("div",{staticClass:"col-2 p-0"},[r("div",{staticClass:"productTotal"},[t._v(t._s(t._f("currency")(e.price)))])]),t.isConfirm?t._e():r("div",{staticClass:"col-1 p-0"},[r("div",{staticClass:"productDel"},[r("span",{on:{click:function(r){return r.preventDefault(),t.removeCartItem(e.id)}}},[r("i",{staticClass:"fas fa-trash"})])])])])])})),r("li",{staticClass:"orderList productSummary"},[r("div",{staticClass:"row"},[r("div",{staticClass:"col-6 summary"},[t._v("共 "+t._s(t.cartLength)+" 項")]),r("div",{staticClass:"col-3 summary"},[t._v("總計")]),r("div",{staticClass:"summary",class:{"col-3":t.isConfirm,"col-2":!t.isConfirm}},[t._v(t._s(t._f("currency")(t.cartTotal)))]),t.isConfirm?t._e():r("div",{staticClass:"col-1 p-0"})])])],2),t.isConfirm?t._e():r("div",{staticClass:"check"},[0===t.cartLength?r("button",{staticClass:"btn",on:{click:function(e){return e.preventDefault(),t.$router.push("/product_list")}}},[r("i",{staticClass:"fas fa-store-alt mr-1"}),t._v("回到商店")]):r("button",{staticClass:"btn",on:{click:function(e){return e.preventDefault(),t.confirmCart(e)}}},[r("i",{staticClass:"fas fa-clipboard-check mr-1"}),t._v("確認送出")])])]),t.isConfirm?r("div",{staticClass:"col-md-5"},[r("div",{staticClass:"infoArea d-flex justify-content-center align-items-center flex-column"},[r("div",{staticClass:"input-group couponInfo"},[r("input",{directives:[{name:"model",rawName:"v-model",value:t.coupon_code,expression:"coupon_code"}],staticClass:"form-control",attrs:{type:"text",placeholder:"優惠券代碼"},domProps:{value:t.coupon_code},on:{input:function(e){e.target.composing||(t.coupon_code=e.target.value)}}}),r("div",{staticClass:"input-group-append"},[r("span",{staticClass:"input-group-text",on:{click:t.addCouponCode}},[t._v("確認")])])]),r("table",{staticClass:"table totalInfo"},[r("tbody",[r("tr",[r("td",[t._v("總計金額")]),r("td",{staticClass:"text-right"},[t._v("NT "+t._s(t._f("currency")(t.cartData.total)))])]),r("tr",[r("td",[t._v("優惠折抵")]),r("td",{staticClass:"text-right"},[t._v("- NT "+t._s(t._f("currency")(t.cartData.total-t.cartData.final_total)))])]),r("tr",[r("td",[t._v("應付金額")]),r("td",{staticClass:"text-right"},[t._v("NT "+t._s(t._f("currency")(t.cartData.final_total)))])])])]),r("div",{staticClass:"nextStep"},[r("button",{staticClass:"btn",on:{click:function(e){return e.preventDefault(),t.goNextPage(e)}}},[t._v("下一步"),r("i",{staticClass:"fas fa-angle-double-right ml-1"})])])])]):t._e()]),t._m(0)])]),t._m(1)],1)},a=[function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"row"},[r("div",{staticClass:"col-sm-12"},[r("div",{staticClass:"notice"},[r("div",{staticClass:"backText"},[t._v("NOTICE")]),r("h5",[r("i",{staticClass:"fas fa-exclamation-circle mr-3"}),t._v("注意事項")]),r("ul",[r("li",[t._v("請確認所填寫的資料是否正確，下單後未提供修改付款方式服務。")]),r("li",[t._v("因拍攝略有色差，圖片僅供參考，顏色請以實際收到商品為準。")]),r("li",[t._v("本店商品目前只供應台灣地區，只提供宅配到府。")]),r("li",[t._v("目前支援貨到付款、超商付款、ATM付款。")]),r("li",[t._v("本店商品為統一會於付款後7個工作日內出貨(不含假日)。")]),r("li",[t._v("辦理退換貨時，商品必須是全新狀態與完整包裝，退回之商品必須於7日鑑賞期內寄回。")])])])])])},function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"modal fade p-0",attrs:{id:"leaveModal",tabindex:"-1",role:"dialog","aria-hidden":"true","data-backdrop":"static"}},[r("div",{staticClass:"modal-dialog modal-dialog-centered",attrs:{role:"document"}},[r("div",{staticClass:"modal-content border-0"},[r("div",{staticClass:"modal-body"},[r("p",[t._v("尚未完成訂購流程，請確認是否離開此頁?")])]),r("div",{staticClass:"modal-footer"},[r("button",{staticClass:"btn cancel",attrs:{type:"button","data-dismiss":"modal"}},[t._v("取消")]),r("button",{staticClass:"btn confirm",attrs:{type:"button","data-dismiss":"modal"}},[t._v("確定")])])])])])}],i=(r("a4d3"),r("4de4"),r("4160"),r("e439"),r("dbb4"),r("b64b"),r("159b"),r("ade3")),c=r("2f62"),n=r("1157"),o=r.n(n),l=r("ae61"),u=r("d10b");function f(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);e&&(s=s.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,s)}return r}function d(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?f(Object(r),!0).forEach((function(e){Object(i["a"])(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):f(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}var p={name:"CheckOrder",components:{HeaderPic:l["a"],OrderProgress:u["a"]},data:function(){return{cartLength:"",coupon_code:"",step:1,isNext:!1}},methods:d({getCart:function(){this.$store.commit("cartModules/CART"),this.cartLength=this.cart.length,0===this.cartLength&&(this.isNext=!0,this.$router.push("/product_list")),this.$store.dispatch("cartModules/getCartInfo")},removeCartItem:function(t){var e=this,r=-1;e.cart.length>0&&e.cart.forEach((function(e,s){e.id===t&&(r=s)})),e.$store.commit("cartModules/REMOVECARTITEM",r),e.$store.commit("cartModules/UPDATECART"),e.$store.dispatch("alertMessageModules/updateMessage",{message:"商品已刪除",status:"success"}),e.getCart()},changeQty:function(t,e){var r=parseInt(t.qty,10)+parseInt(e,10);this.changeNumber(t,r)},changeNumber:function(t,e){this.$store.dispatch("cartModules/changeNumber",{product:t,qty:e}),this.getCart()}},Object(c["b"])("cartModules",["confirmCart","getCartData"]),{addCouponCode:function(){this.$store.dispatch("cartModules/addCouponCode",this.coupon_code)},goNextPage:function(){this.isNext=!0,this.$router.push("/buyer_info")}}),created:function(){this.getCart(),this.$store.dispatch("cartModules/getCartData")},computed:d({},Object(c["c"])("cartModules",["cart","cartData","isConfirm","cartTotal"])),beforeRouteLeave:function(t,e,r){var s=this,a=this;a.isNext?r():(o()("#leaveModal").modal("show"),o()(".confirm").on("click",(function(){s.$store.dispatch("cartModules/cancelCart"),r()})),o()(".cancel").on("click",(function(){r(!1)})))}},v=p,m=r("2877"),b=Object(m["a"])(v,s,a,!1,null,null,null);e["default"]=b.exports},"746f":function(t,e,r){var s=r("428f"),a=r("5135"),i=r("e538"),c=r("9bf2").f;t.exports=function(t){var e=s.Symbol||(s.Symbol={});a(e,t)||c(e,t,{value:i.f(t)})}},a4d3:function(t,e,r){"use strict";var s=r("23e7"),a=r("da84"),i=r("d066"),c=r("c430"),n=r("83ab"),o=r("4930"),l=r("fdbf"),u=r("d039"),f=r("5135"),d=r("e8b5"),p=r("861d"),v=r("825a"),m=r("7b0b"),b=r("fc6a"),C=r("c04e"),h=r("5c6c"),g=r("7c73"),y=r("df75"),_=r("241c"),O=r("057f"),w=r("7418"),j=r("06cf"),P=r("9bf2"),S=r("d1e7"),x=r("9112"),k=r("6eeb"),N=r("5692"),D=r("f772"),M=r("d012"),$=r("90e3"),E=r("b622"),T=r("e538"),I=r("746f"),L=r("d44e"),A=r("69f3"),Q=r("b727").forEach,R=D("hidden"),q="Symbol",J="prototype",H=E("toPrimitive"),F=A.set,U=A.getterFor(q),V=Object[J],W=a.Symbol,z=i("JSON","stringify"),B=j.f,G=P.f,K=O.f,X=S.f,Y=N("symbols"),Z=N("op-symbols"),tt=N("string-to-symbol-registry"),et=N("symbol-to-string-registry"),rt=N("wks"),st=a.QObject,at=!st||!st[J]||!st[J].findChild,it=n&&u((function(){return 7!=g(G({},"a",{get:function(){return G(this,"a",{value:7}).a}})).a}))?function(t,e,r){var s=B(V,e);s&&delete V[e],G(t,e,r),s&&t!==V&&G(V,e,s)}:G,ct=function(t,e){var r=Y[t]=g(W[J]);return F(r,{type:q,tag:t,description:e}),n||(r.description=e),r},nt=l?function(t){return"symbol"==typeof t}:function(t){return Object(t)instanceof W},ot=function(t,e,r){t===V&&ot(Z,e,r),v(t);var s=C(e,!0);return v(r),f(Y,s)?(r.enumerable?(f(t,R)&&t[R][s]&&(t[R][s]=!1),r=g(r,{enumerable:h(0,!1)})):(f(t,R)||G(t,R,h(1,{})),t[R][s]=!0),it(t,s,r)):G(t,s,r)},lt=function(t,e){v(t);var r=b(e),s=y(r).concat(vt(r));return Q(s,(function(e){n&&!ft.call(r,e)||ot(t,e,r[e])})),t},ut=function(t,e){return void 0===e?g(t):lt(g(t),e)},ft=function(t){var e=C(t,!0),r=X.call(this,e);return!(this===V&&f(Y,e)&&!f(Z,e))&&(!(r||!f(this,e)||!f(Y,e)||f(this,R)&&this[R][e])||r)},dt=function(t,e){var r=b(t),s=C(e,!0);if(r!==V||!f(Y,s)||f(Z,s)){var a=B(r,s);return!a||!f(Y,s)||f(r,R)&&r[R][s]||(a.enumerable=!0),a}},pt=function(t){var e=K(b(t)),r=[];return Q(e,(function(t){f(Y,t)||f(M,t)||r.push(t)})),r},vt=function(t){var e=t===V,r=K(e?Z:b(t)),s=[];return Q(r,(function(t){!f(Y,t)||e&&!f(V,t)||s.push(Y[t])})),s};if(o||(W=function(){if(this instanceof W)throw TypeError("Symbol is not a constructor");var t=arguments.length&&void 0!==arguments[0]?String(arguments[0]):void 0,e=$(t),r=function(t){this===V&&r.call(Z,t),f(this,R)&&f(this[R],e)&&(this[R][e]=!1),it(this,e,h(1,t))};return n&&at&&it(V,e,{configurable:!0,set:r}),ct(e,t)},k(W[J],"toString",(function(){return U(this).tag})),k(W,"withoutSetter",(function(t){return ct($(t),t)})),S.f=ft,P.f=ot,j.f=dt,_.f=O.f=pt,w.f=vt,T.f=function(t){return ct(E(t),t)},n&&(G(W[J],"description",{configurable:!0,get:function(){return U(this).description}}),c||k(V,"propertyIsEnumerable",ft,{unsafe:!0}))),s({global:!0,wrap:!0,forced:!o,sham:!o},{Symbol:W}),Q(y(rt),(function(t){I(t)})),s({target:q,stat:!0,forced:!o},{for:function(t){var e=String(t);if(f(tt,e))return tt[e];var r=W(e);return tt[e]=r,et[r]=e,r},keyFor:function(t){if(!nt(t))throw TypeError(t+" is not a symbol");if(f(et,t))return et[t]},useSetter:function(){at=!0},useSimple:function(){at=!1}}),s({target:"Object",stat:!0,forced:!o,sham:!n},{create:ut,defineProperty:ot,defineProperties:lt,getOwnPropertyDescriptor:dt}),s({target:"Object",stat:!0,forced:!o},{getOwnPropertyNames:pt,getOwnPropertySymbols:vt}),s({target:"Object",stat:!0,forced:u((function(){w.f(1)}))},{getOwnPropertySymbols:function(t){return w.f(m(t))}}),z){var mt=!o||u((function(){var t=W();return"[null]"!=z([t])||"{}"!=z({a:t})||"{}"!=z(Object(t))}));s({target:"JSON",stat:!0,forced:mt},{stringify:function(t,e,r){var s,a=[t],i=1;while(arguments.length>i)a.push(arguments[i++]);if(s=e,(p(e)||void 0!==t)&&!nt(t))return d(e)||(e=function(t,e){if("function"==typeof s&&(e=s.call(this,t,e)),!nt(e))return e}),a[1]=e,z.apply(null,a)}})}W[J][H]||x(W[J],H,W[J].valueOf),L(W,q),M[R]=!0},ade3:function(t,e,r){"use strict";function s(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}r.d(e,"a",(function(){return s}))},ae61:function(t,e,r){"use strict";var s=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"container-fluid headerPic"},[t._t("default")],2)},a=[],i={name:"HeaderPic"},c=i,n=r("2877"),o=Object(n["a"])(c,s,a,!1,null,null,null);e["a"]=o.exports},b64b:function(t,e,r){var s=r("23e7"),a=r("7b0b"),i=r("df75"),c=r("d039"),n=c((function(){i(1)}));s({target:"Object",stat:!0,forced:n},{keys:function(t){return i(a(t))}})},d10b:function(t,e,r){"use strict";var s=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"orderProgress"},[r("div",{staticClass:"row m-0"},[r("div",{staticClass:"col-sm-4"},[r("div",{staticClass:"step",class:{current:1===t.currentStep}},[t._v("Step1"),r("p",[t._v("確認購買")])])]),r("div",{staticClass:"col-sm-4"},[r("div",{staticClass:"step",class:{current:2===t.currentStep}},[t._v("Step2"),r("p",[t._v("填寫資料")])])]),r("div",{staticClass:"col-sm-4"},[r("div",{staticClass:"step",class:{current:3===t.currentStep}},[t._v("Step3"),r("p",[t._v("完成訂單")])])])])])},a=[],i={name:"OrderProgress",props:["currentStep"]},c=i,n=r("2877"),o=Object(n["a"])(c,s,a,!1,null,null,null);e["a"]=o.exports},dbb4:function(t,e,r){var s=r("23e7"),a=r("83ab"),i=r("56ef"),c=r("fc6a"),n=r("06cf"),o=r("8418");s({target:"Object",stat:!0,sham:!a},{getOwnPropertyDescriptors:function(t){var e,r,s=c(t),a=n.f,l=i(s),u={},f=0;while(l.length>f)r=a(s,e=l[f++]),void 0!==r&&o(u,e,r);return u}})},e439:function(t,e,r){var s=r("23e7"),a=r("d039"),i=r("fc6a"),c=r("06cf").f,n=r("83ab"),o=a((function(){c(1)})),l=!n||o;s({target:"Object",stat:!0,forced:l,sham:!n},{getOwnPropertyDescriptor:function(t,e){return c(i(t),e)}})},e538:function(t,e,r){var s=r("b622");e.f=s}}]);
//# sourceMappingURL=chunk-8af40180.88ec075b.js.map