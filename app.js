const products = [
 {id:"ai-premium",name:"AI Box Android — Série Premium",category:"Car Accessories",label:"AI BOX ANDROID",description:"Boîtier multimédia Android pour voiture. Choisissez la configuration mémoire adaptée à votre usage.",image:"assets/ai-box-premium-02.jpg",gallery:["assets/ai-box-premium-01.jpg","assets/ai-box-premium-02.jpg"],variants:[{label:"2 Go RAM / 16 Go",price:650},{label:"2 Go RAM / 32 Go",price:750},{label:"4 Go RAM / 64 Go",price:990}],compat:"Compatibilité annoncée pour les véhicules à partir de 2018. La présence d'un système CarPlay filaire d'origine et la compatibilité exacte du modèle doivent être vérifiées avant achat."},
 {id:"ai-standard",name:"AI Box Android — Série Standard",category:"Car Accessories",label:"AI BOX ANDROID",description:"Boîtier Android pour enrichir le système multimédia compatible de votre véhicule.",image:"assets/ai-box-standard-03.jpg",gallery:["assets/ai-box-standard-01.jpg","assets/ai-box-standard-02.jpg","assets/ai-box-standard-03.jpg"],variants:[{label:"2 Go RAM / 16 Go",price:550},{label:"2 Go RAM / 32 Go",price:690}],compat:"Compatibilité annoncée pour les véhicules à partir de 2018. La présence d'un système CarPlay filaire d'origine et la compatibilité exacte du modèle doivent être vérifiées avant achat."},
 {id:"charger-5in1",name:"Station de charge sans fil 5-en-1",category:"Charging & Power",label:"CHARGE & POWER",description:"Une station multi-appareils avec affichage horaire et zones de recharge sans fil. Vérifiez les appareils compatibles et les conditions de charge.",image:"assets/chargeur-5-en-1-02.jpg",gallery:["assets/chargeur-5-en-1-01.jpg","assets/chargeur-5-en-1-02.jpg","assets/chargeur-5-en-1-03.jpg"],variants:[{label:"Station 5-en-1",price:385}],compat:"Compatibilité de charge à confirmer selon le modèle de téléphone, de montre et les accessoires utilisés."},
 {id:"carplay-2in1",name:"Adaptateur sans fil CarPlay & Android Auto 2-en-1",category:"Car Accessories",label:"CARPLAY • ANDROID AUTO",description:"Transforme une connexion filaire compatible en connexion sans fil pour Apple CarPlay ou Android Auto.",image:"assets/adaptateur-carplay-01.jpg",gallery:["assets/adaptateur-carplay-01.jpg","assets/adaptateur-carplay-02.jpg"],variants:[{label:"Adaptateur 2-en-1",price:219}],compat:"Nécessite un véhicule disposant déjà de CarPlay filaire ou Android Auto filaire d'origine. Ne remplace pas un système absent."}
];
const money = n => `${n.toLocaleString("fr-FR")} DH`;
const $ = s => document.querySelector(s);
const grid=$("#productGrid");
let cart = [];
try {
 const savedCart = JSON.parse(localStorage.getItem("mirotech-cart") || "[]");
 cart = Array.isArray(savedCart) ? savedCart.filter(item =>
   item && products.some(p => p.id === item.id) &&
   Number.isInteger(item.variantIndex) &&
   products.find(p => p.id === item.id).variants[item.variantIndex] &&
   Number.isFinite(item.qty) && item.qty > 0
 ) : [];
} catch (error) {
 cart = [];
}
let selectedProduct=null;
let selectedVariant=0;
function saveCart(){localStorage.setItem("mirotech-cart",JSON.stringify(cart));renderCart()}
function renderProducts(filter="all"){
 const list=products.filter(p=>filter==="all"||p.category===filter||(filter==="Phone Accessories"&&p.id==="charger-5in1")||(filter==="Gadgets"&&p.id==="charger-5in1"));
 grid.innerHTML=list.length?list.map(p=>`<article class="product-card">
  <div class="product-image" data-details="${p.id}"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-tag">${p.label}</span></div>
  <div class="product-info"><span class="product-category">${p.category==="Car Accessories"?"Technologie automobile":"Recharge & accessoires"}</span><h3>${p.name}</h3><p>${p.description}</p>
  <div class="product-bottom"><span class="product-price">${p.variants.length>1?"Dès ":""}${money(Math.min(...p.variants.map(v=>v.price)))}</span><button type="button" class="add-button" data-details="${p.id}" aria-label="Voir les options de ${p.name}">＋</button></div></div>
  <button type="button" class="details-link" data-details="${p.id}">Voir les détails <span>↗</span></button></article>`).join(""):'<p class="no-products">Aucun produit dans cette catégorie pour le moment.</p>';
 // Bind each product action directly (more reliable on touch screens than delegated taps).
 grid.querySelectorAll("[data-details]").forEach(control => {
   control.type = "button";
   control.addEventListener("click", event => {
     event.preventDefault();
     event.stopPropagation();
     openProduct(control.dataset.details);
   }, { passive: false });
 });
}
function openProduct(id){selectedProduct=products.find(p=>p.id===id);selectedVariant=0;$("#modalImage").src=selectedProduct.image;$("#modalImage").alt=selectedProduct.name;$("#modalCategory").textContent=selectedProduct.label;$("#modalTitle").textContent=selectedProduct.name;$("#modalDescription").textContent=selectedProduct.description;$("#compatNote").textContent=selectedProduct.compat;$("#modalVariant").innerHTML=selectedProduct.variants.map((v,i)=>`<option value="${i}">${v.label}</option>`).join("");updateModalPrice();$("#productModal").classList.add("show");$("#productModal").setAttribute("aria-hidden","false");document.body.classList.add("locked")}
function updateModalPrice(){const v=selectedProduct.variants[selectedVariant];$("#modalPrice").textContent=money(v.price)}
function addToCart(id,variantIndex=0){const p=products.find(x=>x.id===id),v=p.variants[variantIndex];const key=`${id}-${variantIndex}`;const item=cart.find(x=>x.key===key);if(item)item.qty++;else cart.push({key,id,variantIndex,qty:1});saveCart();closeProduct();openCart()}
function renderCart(){
 const count=cart.reduce((n,x)=>n+x.qty,0);$("#cartCount").textContent=count;$("#drawerCount").textContent=`(${count})`;
 $("#cartItems").innerHTML=cart.map(item=>{const p=products.find(x=>x.id===item.id),v=p.variants[item.variantIndex];return `<div class="cart-row"><img src="${p.image}" alt=""><div><h4>${p.name}</h4><p>${v.label}</p><div class="qty-control"><button data-qty="${item.key}" data-delta="-1" aria-label="Diminuer">−</button><span>${item.qty}</span><button data-qty="${item.key}" data-delta="1" aria-label="Augmenter">+</button></div></div><div class="cart-row-right"><strong>${money(v.price*item.qty)}</strong><button class="remove-item" data-remove="${item.key}">Retirer</button></div></div>`}).join("");
 const empty=count===0;$("#cartEmpty").style.display=empty?"block":"none";$("#cartSummary").style.display=empty?"none":"block";
 $("#subtotal").textContent=money(cart.reduce((n,x)=>n+products.find(p=>p.id===x.id).variants[x.variantIndex].price*x.qty,0));
}
function openCart(){$("#cartDrawer").classList.add("open");$("#cartDrawer").setAttribute("aria-hidden","false");$("#overlay").classList.add("show");document.body.classList.add("locked")}
function closeCart(){$("#cartDrawer").classList.remove("open");$("#cartDrawer").setAttribute("aria-hidden","true");$("#overlay").classList.remove("show");document.body.classList.remove("locked")}
function closeProduct(){$("#productModal").classList.remove("show");$("#productModal").setAttribute("aria-hidden","true");document.body.classList.remove("locked")}
function closeCheckout(){$("#checkoutModal").classList.remove("show");$("#checkoutModal").setAttribute("aria-hidden","true");document.body.classList.remove("locked")}

$("#modalVariant").addEventListener("change",e=>{selectedVariant=Number(e.target.value);updateModalPrice()});
$("#modalAdd").addEventListener("click",()=>addToCart(selectedProduct.id,selectedVariant));
$("#modalClose").addEventListener("click",closeProduct);
$("#productModal").addEventListener("click",e=>{if(e.target===$("#productModal"))closeProduct()});
$("#openCart").addEventListener("click",openCart);$("#closeCart").addEventListener("click",closeCart);$("#overlay").addEventListener("click",closeCart);$("#continueShopping").addEventListener("click",closeCart);
$("#cartItems").addEventListener("click",e=>{const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");if(q){const item=cart.find(x=>x.key===q.dataset.qty);item.qty+=Number(q.dataset.delta);if(item.qty<1)cart=cart.filter(x=>x.key!==item.key);saveCart()}if(r){cart=cart.filter(x=>x.key!==r.dataset.remove);saveCart()}});
$("#checkoutOpen").addEventListener("click",()=>{$("#checkoutModal").classList.add("show");$("#checkoutModal").setAttribute("aria-hidden","false");closeCart();document.body.classList.add("locked")});
$("#checkoutClose").addEventListener("click",closeCheckout);$("#checkoutModal").addEventListener("click",e=>{if(e.target===$("#checkoutModal"))closeCheckout()});
 const successModal=$("#orderSuccessModal");
 const closeSuccess=()=>{successModal.classList.remove("show");successModal.setAttribute("aria-hidden","true");document.body.classList.remove("locked")};
 $("#orderSuccessContinue").addEventListener("click",closeSuccess);
 successModal.addEventListener("click",e=>{if(e.target===successModal)closeSuccess()});
const GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxHUn1OF6MjPvoPCur6aVJucKgbrvfv9C5_jPobNjCp20mJSxpqsez5AA85tc_Eg5w1XQ/exec";
$("#checkoutForm").addEventListener("submit",async e=>{
 e.preventDefault();
 if(!cart.length){$("#formStatus").textContent="Votre panier est vide.";return;}
 const submitButton=e.currentTarget.querySelector('button[type="submit"]');
 const data=new FormData(e.currentTarget);
 const lines=cart.map(item=>{const p=products.find(x=>x.id===item.id),v=p.variants[item.variantIndex];return `• ${p.name} — ${v.label} × ${item.qty} : ${money(v.price*item.qty)}`;});
 const total=cart.reduce((n,x)=>n+products.find(p=>p.id===x.id).variants[x.variantIndex].price*x.qty,0);
 const order={name:String(data.get("name")||""),phone:String(data.get("phone")||""),address:String(data.get("address")||""),products:lines.join("\n"),quantity:cart.reduce((n,x)=>n+x.qty,0),total:total};
 const msg=`Bonjour MIROTECH, je souhaite commander :\n\n${lines.join("\n")}\n\nSous-total : ${money(total)}\nPaiement : à la livraison (COD)\n\nNom : ${order.name}\nTéléphone : ${order.phone}\nAdresse : ${order.address}\n\nMerci de confirmer la disponibilité et les frais de livraison.`;
 const whatsappUrl=`https://wa.me/212750463018?text=${encodeURIComponent(msg)}`;
 const whatsappWindow=window.open("about:blank","_blank");
 submitButton.disabled=true;
 $("#formStatus").textContent="Enregistrement de votre commande…";
 try{
   await fetch(GOOGLE_SHEETS_WEB_APP_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(order)});
   $("#formStatus").textContent="Demande d'enregistrement envoyée. Vérifiez le récapitulatif WhatsApp puis appuyez sur Envoyer.";
   if(whatsappWindow)whatsappWindow.location.href=whatsappUrl;else window.location.href=whatsappUrl;
 }catch(error){
   if(whatsappWindow)whatsappWindow.close();
   $("#formStatus").textContent="Impossible de contacter Google Sheets. Réessayez ou contactez-nous sur WhatsApp.";
 }finally{submitButton.disabled=false;}
});
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderProducts(b.dataset.filter)}));
document.querySelectorAll(".category-card").forEach(b=>b.addEventListener("click",()=>{const f=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter===f));renderProducts(f);$("#catalogue").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})}));
$("#menuToggle").addEventListener("click",()=>{const n=$(".main-nav"),opened=n.classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",String(opened))});
document.querySelectorAll(".main-nav a").forEach(a=>a.addEventListener("click",()=>{$(".main-nav").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false")}));
$("#year").textContent=new Date().getFullYear();renderProducts();renderCart();