import{m as r}from"./vendor.d5b88c84.js";function t(t){const a=r(!1);return{loading:a,run:async(...r)=>{try{a.value=!0;const n=await t(...r);return a.value=!1,n}catch(n){throw a.value=!1,n}}}}export{t as u};
