// 變數區
const productWrap = document.querySelector(".productWrap");

// 引入數字自動逗點
internationalNumberFormat = new Intl.NumberFormat('en-US')

// 渲染商品卡片function
function productCard(){
let productCardStr = ""
let data = [];
axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/shiro/products")
.then(function(response){
    data = response.data.products;
    for(let i=0;i<data.length;i++){
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


productCard();






