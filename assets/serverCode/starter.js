const AdminRestaurant="05dc0e58-0ec9-4ef3-b2d4-a69a7da869c5";
fetch('https://tiptabapi.azurewebsites.net/api/ItemListFunction')
    .then(response => {
        if (!response.ok) {
            throw new Error("Network Error");
        }
        return response.json();
    })
    .then(data => {
        let html = "";
        for (let itemdata of data.records) {
            if(itemdata.CategoryID == "a39a239b-a56f-483c-aa8f-6e267b9bef17" && itemdata.RestaurantID ==AdminRestaurant){
                html += `
                <tr>
                <td>
                    <label class="checkboxs">
                        <input type="checkbox">
                        <span class="checkmarks"></span>
                    </label>
                </td>
                <td>
                    <a class="product-img">
                        <img src="${itemdata.itemImage}" alt="product">
                    </a>
                </td>
                <td>${itemdata.ItemTitle}</td>
                <td>${itemdata.ItemTitle},${itemdata.CusineTitle}</td>
                <td>
                    <a class="me-3">
                        <img src="assets/img/icons/edit.svg" alt="img" onclick="EditItem('${itemdata.PartitionKey}', '${itemdata.RowKey}')">
                    </a>
                    <a class="me-3 confirm-text">
                        <img src="assets/img/icons/delete.svg" onclick="deleteitem('${itemdata.PartitionKey}', '${itemdata.RowKey}')" alt="img">
                    </a>
                </td>
                </tr>
                `;

            }
           
        }

        document.querySelector('#staters').innerHTML =html;
    });








