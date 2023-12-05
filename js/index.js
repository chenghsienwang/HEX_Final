/*------------------變數區 start------------------*/
// 商品卡片區域
const productWrap = document.querySelector(".productWrap");
// 篩選器區域
const productSelect = document.querySelector(".productSelect");
// 購物車區域
const shoppingCartTable = document.querySelector(".shoppingCart-table");

let addCardBtn
window.onload = function(){
    addCardBtn = document.querySelector(".addCardBtn");
}

/*------------------變數區 end------------------*/
/*------------------網路上找來的功能專區 start------------------*/
// 引入數字自動逗點
internationalNumberFormat = new Intl.NumberFormat('en-US')
/*------------------網路上找來的功能專區 end------------------*/
/*------------------function區 start------------------*/
// 渲染商品卡片function
function productCardAll() {
    let productCardStr = ""
    let data = [];
    axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/shiro/products")
        .then(function (response) {
            data = response.data.products;
            for (let i = 0; i < data.length; i++) {
                productCardStr += `<li class="productCard">
        <h4 class="productType">新品</h4>
        <img src="${data[i].images}"
            alt="">
        <a href="#" class="addCardBtn">加入購物車</a>
        <h3>${data[i].title}</h3>
        <del class="originPrice">NT$${(internationalNumberFormat.format(data[i].origin_price))}</del>
        <p class="nowPrice">NT$${(internationalNumberFormat.format(data[i].price))}</p>
    </li>`
            }
            productWrap.innerHTML = productCardStr;
        })
}

// 渲染篩選過的商品卡片function
function productCardSelect(category) {
    let productCardStr = ""
    let data = [];
    axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/shiro/products")
        .then(function (response) {
            data = response.data.products;
            for (let i = 0; i < data.length; i++) {
                if (category == data[i].category) {
                    productCardStr += `<li class="productCard">
            <h4 class="productType">新品</h4>
            <img src="${data[i].images}"
                alt="">
            <a href="#" class="addCardBtn">加入購物車</a>
            <h3>${data[i].title}</h3>
            <del class="originPrice">NT$${(internationalNumberFormat.format(data[i].origin_price))}</del>
            <p class="nowPrice">NT$${(internationalNumberFormat.format(data[i].price))}</p>
        </li>`
                }
            }
            productWrap.innerHTML = productCardStr;
            addCardBtn = document.querySelectorAll(".addCardBtn");
        })
}

// 渲染購物車內容function
function shoppingListRender(){
    let shoppingCartTableStr = `<table class="shoppingCart-table">
    <tr>
        <th width="40%">品項</th>
        <th width="15%">單價</th>
        <th width="15%">數量</th>
        <th width="15%">金額</th>
        <th width="15%"></th>
    </tr>`
    axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/shiro/carts")
.then(function (response) {
    data = response.data.carts;
    for(let i=0; i<data.length;i++){
        shoppingCartTableStr += `<tr><td>
        <div class="cardItem-title">
            <img src="${data[i].product.images}" alt="">
            <p>${data[i].product.title}</p>
        </div>
    </td>
    <td>NT$${(internationalNumberFormat.format(data[i].product.price))}</td>
    <td>${data[i].quantity}</td>
    <td>NT$${(internationalNumberFormat.format((data[i].product.price)*(data[i].quantity)))}</td>
    <td class="discardBtn">
        <a href="#" class="material-icons">
            clear
        </a>
    </td></tr>`
    }
    shoppingCartTableStr += `<tr>
    <td>
        <a href="#" class="discardAllBtn">刪除所有品項</a>
    </td>
    <td></td>
    <td></td>
    <td>
        <p>總金額</p>
    </td>
    <td>NT$${(internationalNumberFormat.format(response.data.finalTotal))}</td>
</tr>
</table>`
    shoppingCartTable.innerHTML = shoppingCartTableStr;}
)
}
/*------------------function區 end------------------*/


// 載入後先渲染全商品卡片
productCardAll();
// 載入後先渲染整台購物車
shoppingListRender();

// 篩選器用的eventListener
productSelect.addEventListener("change", (event) => {
    switch (event.target.value) {
        case "全部":
            productCardAll()
            console.log("跑全部");
            break;
        case "窗簾":
            productCardSelect("窗簾");
            console.log("跑窗簾");
            break;
        case "床架":
            productCardSelect("床架");
            console.log("跑床架");
            break;
        case "收納":
            productCardSelect("收納");
            console.log("跑收納");
            break;
    }
})

// addCardBtn.addEventListener("click",(event)=>{
//     console.log(event);
// })