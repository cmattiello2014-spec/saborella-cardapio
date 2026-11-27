const categories=[{name:'Todos',className:'all-circle'},{name:'Sorvetes',className:'ice'},{name:'Lanches',className:'burger'},{name:'Porções',className:'fries'},{name:'Bebidas',className:'drink'}];
const items=[{id:1,cat:'Sorvetes',name:'Taça de sorvete',desc:'Três sabores cremosos para adoçar o dia.',price:15,photo:'ice'},{id:2,cat:'Bebidas',name:'Milk-shake',desc:'Uma bebida gelada e irresistível.',price:18,photo:'drink'},{id:3,cat:'Lanches',name:'Hambúrguer artesanal',desc:'Pão macio, carne e acompanhamentos.',price:25,photo:'burger'},{id:4,cat:'Porções',name:'Batata frita',desc:'Douradinha e crocante para compartilhar.',price:22,photo:'fries'}];
let active='Todos',basket={};
try{basket=JSON.parse(localStorage.getItem('saborella-cart')||'{}')||{}}catch{}
const $=id=>document.getElementById(id);
const money=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
function draw(){
 $('categories').innerHTML=categories.map(c=>`<button class="category ${c.name===active?'active':''}" data-category="${c.name}"><span class="circle ${c.name==='Todos'?'all-circle':'food '+c.className}">${c.name==='Todos'?'S':''}</span>${c.name}</button>`).join('');
 const q=$('search').value.trim().toLowerCase();
 const list=items.filter(p=>(active==='Todos'||p.cat===active)&&(p.name+' '+p.desc).toLowerCase().includes(q));
 $('heading').textContent=active==='Todos'?'Sabores em destaque':active;
 $('count').textContent=list.length+' produtos';
 $('grid').innerHTML=list.map(p=>`<article class="product"><button data-detail="${p.id}" class="product-photo food ${p.photo}" aria-label="Ampliar foto de ${p.name}"></button><div class="product-body"><h3>${p.name}</h3><p>${p.desc}</p><strong class="price">${money(p.price)}</strong><button class="card-add" data-add="${p.id}">+ Adicionar</button></div></article>`).join('')||'<p>Nenhum produto encontrado.</p>';
 update();
}
function change(id,n){basket[id]=Math.max(0,(basket[id]||0)+n);if(!basket[id])delete basket[id];localStorage.setItem('saborella-cart',JSON.stringify(basket));update()}
function update(){let count=0,sum=0;for(const p of items){count+=basket[p.id]||0;sum+=p.price*(basket[p.id]||0)}$('badge').textContent=count;$('quantity').textContent='('+count+')';$('total').textContent=money(sum);$('sum').textContent='Total: '+money(sum);$('lines').innerHTML=items.filter(p=>basket[p.id]>0).map(p=>`<div class="line"><div><b>${p.name}</b><br>${money(p.price*basket[p.id])}</div><div class="qty"><button data-remove="${p.id}" aria-label="Remover uma unidade">−</button> ${basket[p.id]} <button data-add="${p.id}" aria-label="Adicionar uma unidade">+</button></div></div>`).join('')||'<p>Sua sacola está vazia.</p>'}
function showCart(){update();$('cart').showModal()}
function showDetail(id){const p=items.find(p=>p.id===id);if(!p)return;$('productDetail').innerHTML=`<div class="detail"><div class="large-photo food ${p.photo}" role="img" aria-label="${p.name}"></div><h3>${p.name}</h3><p>${p.desc}</p><strong class="price">${money(p.price)}</strong><button class="btn full" data-add="${p.id}" style="margin-top:15px">Adicionar à sacola</button></div>`;$('productDialog').showModal()}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.category){active=b.dataset.category;draw()}if(b.dataset.add){change(+b.dataset.add,1);if($('productDialog').open)$('productDialog').close()}if(b.dataset.remove)change(+b.dataset.remove,-1);if(b.dataset.detail)showDetail(+b.dataset.detail);if(b.dataset.close)$(b.dataset.close).close()});
$('openCart').onclick=showCart;$('dockCart').onclick=showCart;$('search').oninput=draw;$('mode').onchange=()=>{$('address').hidden=$('mode').value!=='Entrega'};
$('finish').onclick=()=>{if(!items.some(p=>basket[p.id]>0)){$('status').textContent='Adicione produtos à sacola.';return}if(!$('customer').value.trim()||($('mode').value==='Entrega'&&!$('address').value.trim())){$('status').textContent='Preencha os dados do pedido.';return}$('status').textContent='Prévia concluída. O envio será ativado após cadastrar o WhatsApp oficial da Saborella.'};
let deferred;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;$('install').hidden=false});$('install').onclick=async()=>{if(deferred){await deferred.prompt();deferred=null;$('install').hidden=true}};
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});draw();
