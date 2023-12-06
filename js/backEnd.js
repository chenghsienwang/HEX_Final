// C3.js
let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
        type: "pie",
        columns: [
            ['Louvre 雙人床架', 1],
            ['Antony 雙人床架', 2],
            ['Anty 雙人床架', 3],
            ['其他', 4],
        ],
        colors: {
            "Louvre 雙人床架": "#DACBFF",
            "Antony 雙人床架": "#9D7FEA",
            "Anty 雙人床架": "#5434A7",
            "其他": "#301E5F",
        }
    },
});

const orderPageTable = document.querySelector(".orderPage-table");

function orderRender() {
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
            'authorization': '4IyLStgtELTjNUpTyCh0eFCS5ot1',
        }
    })
        .then(function (response) {
            for (let i = 0; i < response.data.orders.length; i++) {
                let timestamp = response.data.orders[i].createdAt;
                // 使用 Date 物件將時間戳轉換為日期和時間
                const date = new Date(timestamp * 1000); // 乘以 1000 是因為 JavaScript 使用的是毫秒而不是秒

                // 可以使用 date 的方法獲取年、月、日、時、分、秒等
                const year = date.getFullYear();
                const month = date.getMonth() + 1; // 月份是從 0 開始的，所以要加 1
                const day = date.getDate();
                const formattedDate = `${year}\/${month}\/${day}`;
                let orderStatus
                if(response.data.orders[i].paid == false){
                    orderStatus = "未處理"
                }
                else{
                    orderStatus = "已處理"
                }
                orderStr += `<tr>
        <td>${response.data.orders[i].id}</td>
        <td>
          <p>${response.data.orders[i].user.name}</p>
          <p>${response.data.orders[i].user.tel}</p>
        </td>
        <td>${response.data.orders[i].user.address}</td>
        <td>${response.data.orders[i].user.email}</td>
        <td>
          <p>${response.data.orders[i].products[0].title}</p>
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
            console.log(response.data.orders);
        })
        .catch(function (error) {
            console.log('錯誤', error);
        });
}

orderRender();


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