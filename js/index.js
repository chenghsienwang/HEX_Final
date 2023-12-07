/*------------------變數區 start------------------*/
// 商品卡片區域
const productWrap = document.querySelector(".productWrap");
// 篩選器區域
const productSelect = document.querySelector(".productSelect");
// 購物車區域
const shoppingCartTable = document.querySelector(".shoppingCart-table");
// 加入購物車按鈕，在function中再賦值
let addCardBtn
// 清空購物車按鈕，在function中再賦值
let discardAllBtn
// 刪除單向商品按鈕，在function中再賦值
let discardBtn
// 送出訂單按鈕
const orderInfoBtn = document.querySelector(".orderInfo-btn");
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
        <a href="#" class="addCardBtn" id=${data[i].id}>加入購物車</a>
        <h3>${data[i].title}</h3>
        <del class="originPrice">NT$${(internationalNumberFormat.format(data[i].origin_price))}</del>
        <p class="nowPrice">NT$${(internationalNumberFormat.format(data[i].price))}</p>
    </li>`
            }
            productWrap.innerHTML = productCardStr;
            bindAddCardEventListeners();
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
            <a href="#" class="addCardBtn" id=${data[i].id}>加入購物車</a>
            <h3>${data[i].title}</h3>
            <del class="originPrice">NT$${(internationalNumberFormat.format(data[i].origin_price))}</del>
            <p class="nowPrice">NT$${(internationalNumberFormat.format(data[i].price))}</p>
        </li>`
                }
            }
            productWrap.innerHTML = productCardStr;
            addCardBtn = document.querySelectorAll(".addCardBtn");
            bindAddCardEventListeners()
        })
}

// 渲染購物車內容function
function shoppingListRender() {
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
            for (let i = 0; i < data.length; i++) {
                shoppingCartTableStr += `<tr><td>
        <div class="cardItem-title">
            <img src="${data[i].product.images}" alt="">
            <p>${data[i].product.title}</p>
        </div>
    </td>
    <td>NT$${(internationalNumberFormat.format(data[i].product.price))}</td>
    <td>${data[i].quantity}</td>
    <td>NT$${(internationalNumberFormat.format((data[i].product.price) * (data[i].quantity)))}</td>
    <td class="discardBtn">
        <a href="#" class="material-icons" id="${data[i].id}">
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
            shoppingCartTable.innerHTML = shoppingCartTableStr;
            binddiscardAllBtnEventListeners();
            binddiscardBtnEventListeners();
        }
        )

}

// 幫加入購物車按鈕加上eventListener並且會送出post請求的function
function bindAddCardEventListeners() {
    addCardBtn = document.querySelectorAll(".addCardBtn");
    for (let i = 0; i < addCardBtn.length; i++) {
        addCardBtn[i].addEventListener("click", (event) => {
            let userInput = prompt("請輸入購買數量");
            axios.post('https://livejs-api.hexschool.io/api/livejs/v1/customer/shiro/carts',
                {
                    "data": {
                        "productId": `${event.target.id}`,
                        "quantity": parseInt(userInput)
                    }
                }).then(function (response) {
                    console.log(response);
                    alert("成功加入購物車");
                    console.log(parseInt(userInput))
                    shoppingListRender();

                }).catch(function (error) {
                    console.log(error);
                })
        })
    }
}

// 幫刪除購物車全部商品的按鈕加上eventListener並且點下去能清空的function
function binddiscardAllBtnEventListeners() {
    discardAllBtn = document.querySelector(".discardAllBtn");
    discardAllBtn.addEventListener("click", (event) => {
        axios.delete("https://livejs-api.hexschool.io/api/livejs/v1/customer/shiro/carts").
            then(function (response) {
                console.log("已刪除");
                alert("已清空購物車");
                shoppingListRender();
            })
    })
}

// 幫刪除單項商品的按鈕加上eventListener並且點下去能刪除的function
function binddiscardBtnEventListeners() {
    discardBtn = document.querySelectorAll(".discardBtn");
    for (let i = 0; i < discardBtn.length; i++) {
        discardBtn[i].addEventListener("click", (event) => {
            console.log(event.target);
            axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/shiro/carts/${event.target.id}`)
                .then(function (response) {
                    console.log("已刪除");
                    alert("已刪除");
                    shoppingListRender();
                })
        })
    }
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

// 送出訂單用的eventListener
orderInfoBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const url = 'https://livejs-api.hexschool.io/api/livejs/v1/customer/shiro/orders';
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    const userName = document.querySelector("#customerName").value;
    const tel = document.querySelector("#customerPhone").value;
    const email = document.querySelector("#customerEmail").value;
    const address = document.querySelector("#customerAddress").value;
    const tradeWay = document.querySelector("#tradeWay").value;

    const data = {
        "data": {
            "user": {
                "name": userName,
                "tel": tel,
                "email": email,
                "address": address,
                "payment": tradeWay
            }
        }
    };
    if(userName =="" || tel =="" || email =="" || address =="" || tradeWay ==""){
        alert("請填寫完整顧客資料");
    }
    else{
    axios.post(url, data, { headers })
        .then(response => {
            // 處理成功的回應
            console.log(response.data);
            alert("已送出訂單");
            shoppingListRender()
        })
        .catch(error => {
            // 處理錯誤
            console.error(error.response.data);
            alert("訂單傳送失敗，請洽管理員");
        });}
})








// get訂單
// axios({
//       method: 'GET',
//       url: 'https://livejs-api.hexschool.io/api/livejs/v1/admin/shiro/orders',
//       responseType: 'json',
//         headers: {
//         'authorization': '4IyLStgtELTjNUpTyCh0eFCS5ot1',
//       }
//     })
//     .then(function (response) {
//   console.log(response.data);
//     })
//     .catch(function (error) {
//       console.log('錯誤',error);
//     });



// post訂單
// const url = 'https://livejs-api.hexschool.io/api/livejs/v1/customer/shiro/orders';

// const headers = {
//   'Accept': 'application/json',
//   'Content-Type': 'application/json'
// };

// const data = {
//   "data": {
//     "user": {
//       "name": "六角學院TEST",
//       "tel": "07-5313506",
//       "email": "hexschool@hexschool.com",
//       "address": "高雄市六角學院路",
//       "payment": "Apple Pay"
//     }
//   }
// };

// axios.post(url, data, { headers })
//   .then(response => {
//     // 處理成功的回應
//     console.log(response.data);
//   })
//   .catch(error => {
//     // 處理錯誤
//     console.error(error.response.data);
//   });