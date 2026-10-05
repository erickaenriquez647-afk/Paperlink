var S={role:'customer',shopId:'S1',used:0,slot:0,
shops:[{id:'S1',name:'Andres Copy Hub',rate:.3,bw:2,col:5,open:true,on:true,mode:'commission',jnt:85},
{id:'S2',name:'Campus Print Corner',rate:.2,bw:1.5,col:4,open:true,on:true,mode:'commission',jnt:0},
{id:'S3',name:'Sampaloc QuickCopy',rate:.5,bw:2,col:6,open:false,on:true,mode:'commission',jnt:0}],
MAT:{Paper:{u:'pages'},'ID Picture':{u:'sets',p:60,c:10},Lamination:{u:'pcs',p:20,c:10},Tarpaulin:{u:'sq ft',p:18,c:12},'T-shirt':{u:'pcs',p:250,c:15},Binding:{u:'copies',p:150,c:10}},
affs:[{code:'MARIA10',name:'Maria S.'}],jobs:[],pre:{mat:'Paper',qty:10,col:'bw',shop:'S1',mode:'pickup',pri:false,nick:'Maria',ref:'',addr:'',phone:'',file:'thesis-ch1.pdf'}};
const $=id=>document.getElementById(id),shop=id=>S.shops.find(s=>s.id===id),fmt=n=>'₱'+n.toFixed(2);
const ROLES=['customer','shop','rider','admin'],LBL={customer:'Customers',shop:'Print shops',rider:'Riders',admin:'Admin'};
function calc(j){const sh=shop(j.shop),m=S.MAT[j.mat],paper=j.mat==='Paper';
const price=paper?j.qty*(j.col==='color'?sh.col:sh.bw):j.qty*m.p;
const app=paper?j.qty*1:0,pri=j.pri?10:0,del=j.mode==='delivery'?30:(j.mode==='jnt'?(+sh.jnt||0):0);
const comm=paper?j.qty*sh.rate:price*m.c/100;
return{price,app,pri,del,total:price+app+pri+del,comm,platform:comm+app*.7+pri,shopGets:price-comm+app*.3}}
function qr(code){let h=0;for(const c of code)h=(h*31+c.charCodeAt(0))>>>0;let o='';
const fin=(x,y)=>x<3&&y<3||x>7&&y<3||x<3&&y>7;
for(let y=0;y<11;y++)for(let x=0;x<11;x++){h=(h*1103515245+12345)>>>0;
if(fin(x,y)?(x%10!==1&&y%10!==1||(x%10===1&&y%10===1)):(h>>16)&1)o+=`<rect x="${x}" y="${y}" width="1" height="1" fill="currentColor"/>`}
return`<svg viewBox="0 0 11 11" role="img" aria-label="QR ${code}">${o}</svg>`}
function opts(a,v){return a.map(([k,t])=>`<option value="${k}"${k==v?' selected':''}>${t}</option>`).join('')}
function sortQ(js){return js.slice().sort((a,b)=>b.pri-a.pri||a.id-b.id)}
const STAT={queued:'Queued',printing:'Printing',ready:'Ready',out:'Out for delivery',done:'Completed'};


const AFF=.05;
const PAGES=[['customer','Customers'],['shop','Print shops'],['rider','Riders'],['admin','Admin'],['affiliate','Affiliates']];
function nav(){if(S.me){$('nav').innerHTML=`<span class="s" style="align-self:center">${S.me.name} · ${S.me.role}</span><button onclick="logout()">Log out</button>`;return}const cur=location.pathname.split('/').pop().replace('.html','');$('nav').innerHTML=PAGES.map(([f,t])=>`<a href="${f}.html" class="${cur===f?'on':''}">${t}</a>`).join('')}
try{Object.assign(S,JSON.parse(localStorage.getItem('plfb')||'{}'))}catch(e){}
const rq=new URLSearchParams(location.search).get('ref')||localStorage.getItem('plref');if(rq)S.pre.ref=rq.toUpperCase();
function save(){try{localStorage.setItem('plfb',JSON.stringify({pre:S.pre,used:S.used,aff:S.aff,shopId:S.shopId}))}catch(e){}if(window.cloudSave)cloudSave()}
function setS(id,s){S.jobs.find(j=>j.id===id).status=s;draw()}

function draw(){save();nav();$('app').innerHTML=page()}
