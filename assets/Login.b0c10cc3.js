import{a as e,r as a,s as l}from"./index.10a24596.js";import{h as r,a8 as s,U as u,m as t,X as n,r as o,o as i,j as d,i as m,w as f,f as p,k as c,u as g,d as v,a9 as y,aa as _,$ as w,ab as b,a2 as h,a3 as j,W as k}from"./vendor.d5b88c84.js";import{u as x,_ as S}from"./useForm.fca88376.js";import"./reactivity.esm-bundler.9bcfc38b.js";import"./useLoding.b25ee3b2.js";const U=p(" Need an account? "),q=p(" Have an account? ");var L=r({setup(r){const L=s(h(),"path"),C=u((()=>"/login"===L.value)),F=j(),I=k(l,(()=>{throw new Error("Login 中找不到 setLoginInfo")})),$=t({username:"",password:"",email:""});n(C,(()=>{z(),H.value=E()}));const E=()=>{const e={password:[{required:!0,trigger:"change"}],email:[{required:!0,trigger:"change"}]};return C.value||(e.username=[{required:!0,trigger:"change"}]),e},H=t(E()),{onSubmit:M,validateInfos:N,errorMsg:W,submiting:X,resetFields:z}=x($,H,(async l=>{const r=C.value?e:a,s=await r(l);I(s),F.replace(`/user/${s.username}`)}));return(e,a)=>{const l=o("a-typography-title"),r=o("a-col"),s=o("a-row"),u=o("router-link"),t=o("a-input"),n=o("a-form-item"),h=o("a-input-password"),j=o("a-form"),k=o("a-button");return i(),d("div",null,[m(s,{type:"flex",justify:"center"},{default:f((()=>[m(r,null,{default:f((()=>[m(l,null,{default:f((()=>[p(c(g(C)?"Sign in":"Sign up"),1)])),_:1})])),_:1})])),_:1}),m(s,{type:"flex",justify:"center"},{default:f((()=>[m(r,null,{default:f((()=>[g(C)?(i(),v(u,{key:0,to:"/register"},{default:f((()=>[U])),_:1})):(i(),v(u,{key:1,to:"/login"},{default:f((()=>[q])),_:1}))])),_:1})])),_:1}),m(s,{type:"flex",justify:"center"},{default:f((()=>[m(r,{lg:6,md:12,xs:24,style:{"margin-top":"1em"}},{default:f((()=>[m(S,{"error-msg":g(W)},null,8,["error-msg"]),m(j,null,{default:f((()=>[g(C)?w("",!0):(i(),v(n,y(_({key:0},g(N).username)),{default:f((()=>[m(t,{value:$.value.username,"onUpdate:value":a[0]||(a[0]=e=>$.value.username=e),placeholder:"username"},null,8,["value"])])),_:1},16)),m(n,y(b(g(N).email)),{default:f((()=>[m(t,{value:$.value.email,"onUpdate:value":a[1]||(a[1]=e=>$.value.email=e),placeholder:"email"},null,8,["value"])])),_:1},16),m(n,y(b(g(N).password)),{default:f((()=>[m(h,{value:$.value.password,"onUpdate:value":a[2]||(a[2]=e=>$.value.password=e),placeholder:"password"},null,8,["value"])])),_:1},16)])),_:1})])),_:1})])),_:1}),m(s,{type:"flex",justify:"center"},{default:f((()=>[m(r,{lg:6,md:12,xs:24},{default:f((()=>[m(k,{loading:g(X),type:"primary",block:"",onClick:g(M)},{default:f((()=>[p(c(g(C)?"Sign in":"Sign up"),1)])),_:1},8,["loading","onClick"])])),_:1})])),_:1})])}}});export{L as default};
