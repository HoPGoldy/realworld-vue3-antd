import"./index.10a24596.js";import{b as a}from"./vendor.d5b88c84.js";const t=async function(t){return await a.get("/articles/feed/",{params:t})},e=async function(t){return await a.get("/articles",{params:t})},r=async function(){return(await a.get("/tags")).tags},n=async function(t){return(await a.post("/articles",{article:t})).article},i=async function(t){return(await a.get(`/articles/${t}`)).article},c=async function(t,e){return(await a.put(`/articles/${t}`,{article:e})).article},s=async function(t){return await a.delete(`/articles/${t}`)},u=async function(t){return(await a.post(`/articles/${t}/favorite`)).article},o=async function(t){return(await a.delete(`/articles/${t}/favorite`)).article};export{t as a,e as b,u as c,n as d,c as e,r as f,i as g,s as h,o as u};
