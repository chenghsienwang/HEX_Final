// 後續渲染會用到，後續會賦值從API上串下來的訂單資料
let orderData;

// 訂單明細區
const orderPageTable = document.querySelector(".orderPage-table");
// 清除訂單按鈕
const discardAllBtn = document.querySelector(".discardAllBtn");

// 渲染訂單頁面用function
function orderRender(){
    let orderStr = `<thead>
    <tr>
        <th>訂單編號</th>
        <th>聯絡人</th>
        <th>聯絡地址</th>
        <th>電子郵件</th>
        <th>訂單品項</th>
        <th>訂單日期</th>
        <th>訂單狀態</th>
        <th>操作</th>
    </tr>
</thead>`;
    axios({
        method: 'GET',
        url: 'https://livejs-api.hexschool.io/api/livejs/v1/admin/shiro/orders',
        responseType: 'json',
        headers: {
            // 原本應該要做成登入然後帶token，但時間因素先直接寫在headers
            'authorization': '4IyLStgtELTjNUpTyCh0eFCS5ot1',
        }
    })
        .then(function (response) {
            orderData = response.data.orders;
            // 這裡的tempArr是用來處理後續c3圓餅圖的data
            let tempArr = []
            for (let i = 0; i < orderData.length; i++) {
                for (let j = 0; j < orderData[i].products.length; j++) {
                    tempArr.push([orderData[i].products[j].title, orderData[i].products[j].quantity*orderData[i].products[j].price])
                }
            }

            /**************************以下這段來自GPT，用於整理c3圓餅圖需要的資料*******************************/
            // 使用物件來儲存每個元素的總數
            let countMap = {};
            // 遍歷 array，累加每個元素的數量
            tempArr.forEach(([key, value]) => {
                if (countMap[key] === undefined) {
                    countMap[key] = 0;
                }
                countMap[key] += value;
            });
            // 將結果轉換回 array 的形式
            let result = Object.entries(countMap);
            result.sort((a, b) => b[1] - a[1]);
            /**************************以上這段來自GPT，用於整理c3圓餅圖需要的資料********************************/

            let topThree = result.slice(0, 3);
            let other = 0;
            for (let i = 3; i < result.length; i++) {
                other += result[i][1]
            }
            topThree.push(["其他", other])

            // c3 chart
            let chart = c3.generate({
                bindto: '#chart', // HTML 元素綁定
                data: {
                    type: "pie",
                    columns: topThree,
                    colors: {
                        "Antony 床邊桌": "#66c2a5",
                        "Antony 雙人床架／雙人加大": "#fc8d62",
                        "Louvre 雙人床架／雙人加大": "#8da0cb",
                        "Charles 雙人床架": "#e78ac3",
                        "Jordan 雙人床架／雙人加大": "#a6d854",
                        "Antony 遮光窗簾": "#ffd92f",
                        "Louvre 單人床架": "#e5c494",
                        "Charles 系列儲物組合": "#b3b3b3",
                        "其他": "#99d594"
                    }
                },
            });

            // 原先API給的createdAt是一種時間戳記，要從秒轉成日期 From GOOGLE
            for (let i = 0; i < response.data.orders.length; i++) {
                let timestamp = response.data.orders[i].createdAt;
                // 使用 Date 物件將時間戳轉換為日期和時間
                const date = new Date(timestamp * 1000); // 乘以 1000 是因為 JavaScript 使用的是毫秒而不是秒

                // 可以使用 date 的方法獲取年、月、日、時、分、秒等
                const year = date.getFullYear();
                const month = date.getMonth() + 1; // 月份是從 0 開始的，所以要加 1
                const day = date.getDate();
                const formattedDate = `${year}\/${month}\/${day}`;

                // 判斷訂單狀態
                let orderStatus
                if (response.data.orders[i].paid == false) {
                    orderStatus = "未處理"
                }
                else {
                    orderStatus = "已處理"
                }

                // 將訂單內容統整成字串
                orderStr += `<tr>
        <td>${response.data.orders[i].id}</td>
        <td>
          <p>${response.data.orders[i].user.name}</p>
          <p>${response.data.orders[i].user.tel}</p>
        </td>
        <td>${response.data.orders[i].user.address}</td>
        <td>${response.data.orders[i].user.email}</td>
        <td class="orderDetail">
        
        </td>
        <td>${formattedDate}</td>
        <td class="orderStatus">
          <a href="#">${orderStatus}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn" value="刪除">
        </td>
    </tr>`
            }
            orderPageTable.innerHTML = orderStr;

            // 這個function是用來補足「訂單品項」這一欄的內容的
            function orderDetailRender() {
                const orderDetail = document.querySelectorAll(".orderDetail");
                for (let i = 0; i < orderDetail.length; i++) {
                    let orderDetailStr = "";
                    for (let j = 0; j < response.data.orders[i].products.length; j++) {
                        orderDetailStr += `<p>${response.data.orders[i].products[j].title} x ${response.data.orders[i].products[j].quantity} pcs</p>`
                        orderDetail[i].innerHTML = orderDetailStr;
                    }
                }
            }
                // bind...的這個函數原本寫在外面，但發現好像要寫進orderRender裡面才能正常運作
                // 需要再補一下作用域相關的知識點
                console.log(orderData)
                function bindDelSingleOrderBtnEventListeners() {
                    delSingleOrderBtn = document.querySelectorAll(".delSingleOrder-Btn");
                    for (let i = 0; i < delSingleOrderBtn.length; i++) {
                        delSingleOrderBtn[i].addEventListener("click", (event) => {
                            console.log(event.target);
                            axios({
                                method: 'DELETE',
                                url: `https://livejs-api.hexschool.io/api/livejs/v1/admin/shiro/orders/${orderData[i].id}`,
                                responseType: 'json',
                                headers: {
                                    'authorization': '4IyLStgtELTjNUpTyCh0eFCS5ot1',
                                }
                            }).then(function (response) {
                                console.log("已刪除");
                                alert("已刪除");
                                orderRender();
                            })
                        })
                    }
                }
            orderDetailRender();
            bindDelSingleOrderBtnEventListeners()
        })
        .catch(function (error) {
            console.log('錯誤', error);
        });
    }

// 清空訂單資料用function
function discardAllOrders() {
    axios({
        method: 'DELETE',
        url: 'https://livejs-api.hexschool.io/api/livejs/v1/admin/shiro/orders',
        responseType: 'json',
        headers: {
            'authorization': '4IyLStgtELTjNUpTyCh0eFCS5ot1',
        }
    }).then(function (response) {
        console.log("已刪除");
        alert("已刪除");
        orderRender();
    })
}



// 頁面載入後先執行一次渲染頁面整體
// 刪除訂單後也會執行一次刷新頁面
orderRender();

// 清空訂單資料BTN的eventListener  
discardAllBtn.addEventListener("click", (event) => {
    discardAllOrders();
})





// axios({
//     method: 'GET',
//     url: 'https://livejs-api.hexschool.io/api/livejs/v1/admin/shiro/orders',
//     responseType: 'json',
//       headers: {
//       'authorization': '4IyLStgtELTjNUpTyCh0eFCS5ot1',
//     }
//   })
//   .then(function (response) {
// console.log(response.data);
//   })
//   .catch(function (error) {
//     console.log('錯誤',error);
//   });