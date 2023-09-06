const categoryList = document.querySelector(".categories");
const productList = document.querySelector(".products");
const modal = document.querySelector(".modal-wrapper");
const openBtn = document.querySelector("#open-btn");
const closeBtn = document.querySelector("#close-btn");
const modalList = document.querySelector(".modal-list");
const modalInfo = document.querySelector("#modal-info");


// HTML içeriği yüklendikten sonra fonksiyonlar çalışır
document.addEventListener('DOMContentLoaded', ()=>{
    fetchCategories();
    fetchProduct();
});


function fetchCategories(){
    // veri çekme isteği atma
    fetch('https://api.escuelajs.co/api/v1/categories')
    //Gelen veriyi işleme
    .then((res)=> res.json())
    // işlenen 7 veriyi 4 e kadar keserek foreach ile her obje ekrana basıldı
    .then((data)=> data.slice(0, 4).forEach((category)=>{
        // HTML de bulunan category divi oluşturma
        const categoryDiv = document.createElement('div');
        // div'e class ekleme
        categoryDiv.classList.add('category');
        // divin içeriğini alma ve değiştirme
        categoryDiv.innerHTML =
        `
        <img src="${category.image}" />
        <span>${category.name}</span>
        `;
        // oluşan divi htmldeki listeye atma
        categoryList.appendChild(categoryDiv);
    }));
}




// Ürünleri çekme
function fetchProduct(){
    // Veri çekme isteği
    fetch("https://api.escuelajs.co/api/v1/products")
    // Gelen veriyi işleme
    .then((res)=> res.json())
    // işlenen çok sayıdaki veriyi 25 e kadar sınırlama ve foreach ile ekrana basma
    .then((data)=> data.slice(0, 24).forEach((item)=>{
        // div oluşturma
        const productDiv = document.createElement('div');
        // dive class ekle
        productDiv.classList.add('product');
        //divin içeriğini alma ve değiştirme
        productDiv.innerHTML =
        `
        <img src="${item.images[0]}">
                    <p>${item.title}</p>
                    <p>${item.category.name}</p>
                    <div class="product-action">
                        <p>${item.price} $</p>
                        <button onclick="addToBasket({id:${item.id} ,title:'${item.title}', price:'${item.price}',image:'${item.images[0]}',amount:1})">Add to Basket</button>
                    </div>
        `
        // oluşan divi htmldeki listeye atma
        productList.appendChild(productDiv);
    })
   );
}


// Sepet
let basket = [];
let total = 0;

// sepete ekleme işlemi
function addToBasket(product){
    // sepette parametre olarak gelen elemanı arar
    const foundItem = basket.find((basketItem)=> basketItem.id === product.id);
    // eğer elemandan varsa miktarı arttırma
    if (foundItem){
        foundItem.amount ++;
    } else { // eğer elemandan yoksa elemanı ekleme
        basket.push(product);
    }
    console.log(basket);
}


// Açma


openBtn.addEventListener("click", ()=>{
    modal.classList.add('active');
    // sepetin içine ürünleri listeleme
    addList()
    // total bilgisini güncelleme
    modalInfo.innerText = total;
})

// Kapatma

closeBtn.addEventListener("click",()=>{
    modal.classList.remove('active');

    // sepeti kapatınca içini temizleme
    modalList.innerHTML = "";
    // total değerinmi sıfırlama
    total = 0;
})


// sepete listeleme
function addList(){
    basket.forEach((product)=>{
        console.log(product);
        // div oluşturma
        const listItem = document.createElement("div");
        // class ekleme
        listItem.classList.add("list-item");
        // içeriğini değiştirme
        listItem.innerHTML = 
        `
        <img src="${product.image}" alt="">
        <h2>${product.title}</h2>
        <h2 class="price">${product.price} $</h2>
        <p class="amount">Amount: ${product.amount}</p>
        <button id="del" onclick="deleteItem({id:'${product.id}', price:${product.price} ,amount:${product.amount}})">Del</button>
        `
        // oluşan divi listeye gönderme
        modalList.appendChild(listItem);

        // total değişkenini güncelleme
        total += product.price * product.amount;
    });
}


// sepetten silme fonksiyonu
function deleteItem(deletingItem) {
    // filtreleme
    basket = basket.filter((i) => i.id !== deletingItem.id);
    //silinen elemanın fiyatını totalden çıkarma
    total -= deletingItem.price * deletingItem.amount;
    modalInfo.innerText = total;
}

// silinen elemanı htmlden kaldırma
modalList.addEventListener("click", (e) => {
    if( e.target.id === "del"){
        e.target.parentElement.remove();
    }
})


// Dışarıda herhangi bir yere tıklandığında kapanması

modal.addEventListener("click",(e)=>{
    if(e.target.classList.contains("modal-wrapper")){
        modal.classList.remove('active');
    }
})

