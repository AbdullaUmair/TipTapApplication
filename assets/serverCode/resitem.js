const AdminRestaurantID = "05dc0e58-0ec9-4ef3-b2d4-a69a7da869c5";
let ItemData = [];

async function fetchItems() {
    try {
        const response = await fetch('https://tiptabapi.azurewebsites.net/api/ItemListFunction');
        if (!response.ok) {
            throw new Error("Network error: " + response.statusText);
        }
        const data = await response.json();
        ItemData = data.records;
        displayItems();
    } catch (error) {
        console.error("Error fetching item list:", error);
    }
}

function displayItems() {
    if (!ItemData || !Array.isArray(ItemData)) {
        console.error("ItemData is not defined or not an array");
        return;
    }

    let html = "";
    for (let itemdata of ItemData) {
        if (AdminRestaurantID === itemdata.RestaurantID) {
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
                    <td>${itemdata.ItemTitle}, ${itemdata.CusineTitle}</td>
                    <td>
                        <a class="me-3">
                            <img src="assets/img/icons/edit.svg" alt="img" onclick="EditItem('${itemdata.PartitionKey}', '${itemdata.RowKey}')">
                        </a>
                        <a class="me-3 confirm-text">
                            <img src="assets/img/icons/delete.svg" alt="img" onclick="deleteItem('${itemdata.PartitionKey}', '${itemdata.RowKey}')">
                        </a>
                    </td>
                </tr>
            `;
        }
    }

    const itemListElement = document.querySelector('#itemList');
    if (itemListElement) {
        itemListElement.innerHTML = html;
    } else {
        console.error("#itemList element not found");
    }
}



async function EditItem(PartitionKey, RowKey) {
    try {
        const Item = ItemData.find(item => item.RowKey === RowKey);
        if (Item) {
            localStorage.setItem('Item-Data', JSON.stringify(Item));
            window.location.href = 'addRestaurantItems.html';
        } else {
            console.error("Item not found");
        }
    } catch (error) {
        console.error("Error editing item:", error);
    }
}

async function deleteitem(PartitionKey, RowKey) {
    try {
        const data = {
            PartitionKey: PartitionKey,
            RowKey: RowKey
        };

        const response = await fetch(`https://tiptabapi.azurewebsites.net/api/ItemListFunction`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to delete item');
        }

        console.log(await response.json());

        ItemData = ItemData.filter(item => item.RowKey !== RowKey);

        displayItems(); 
    } catch (error) {
        console.error('Error:', error);
    }
}


document.addEventListener('DOMContentLoaded', (event) => {
    fetchItems();
});
