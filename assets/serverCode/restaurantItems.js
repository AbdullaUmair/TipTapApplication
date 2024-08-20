document.addEventListener('DOMContentLoaded', () => {
  
    const AdminRestaurantID = JSON.parse(localStorage.getItem('objUser')).RestaurantID;

   
    Promise.all([
        fetch('https://tiptabapi.azurewebsites.net/api/ItemListFunction')
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`Network Error: ${response.status} - ${text}`);
                    });
                }
                return response.json();
            }),
        fetch('https://tiptabapi.azurewebsites.net/api/itemCategoryFunction')
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`Network Error: ${response.status} - ${text}`);
                    });
                }
                return response.json();
            })
    ])
    .then(([itemData, categoryData]) => {
        const ItemData = itemData.records || [];
        const CategoryData = categoryData.records || [];
        const categoryMap = {};

        CategoryData.forEach(category => {
            categoryMap[category.CategoryID] = category.Categorytitle;
        });

  
        const filteredItems = ItemData.filter(item => item.RestaurantID === AdminRestaurantID);

        let html = '';
        filteredItems.forEach(item => {
            const categoryName = categoryMap[item.CategoryID] || 'N/A';
            const itemImage = item.itemImage || 'default-image.jpg';

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
                            <img src="${itemImage}" alt="product image">
                        </a>
                    </td>
                    <td>${item.ItemTitle || 'No Title'}</td>
                    <td>${categoryName}</td>
                    <td>
                        <a class="me-3" onclick="EditItem('${item.PartitionKey}', '${item.RowKey}')">
                            <img src="assets/img/icons/edit.svg" alt="edit icon">
                        </a>
                        <a class="me-3 confirm-text" onclick="deleteitem('${item.PartitionKey}', '${item.RowKey}')">
                            <img src="assets/img/icons/delete.svg" alt="delete icon">
                        </a>
                    </td>
                </tr>
            `;
        });


        const itemListElement = document.querySelector('#itemLists');
        if (itemListElement) {
            itemListElement.innerHTML = html;
        } else {
            console.error('Element with ID itemLists not found');
        }
    })
    .catch(error => console.error("Error fetching data:", error.message));
});


async function EditItem(PartitionKey, RowKey) {
    try {
        const response = await fetch(`https://tiptabapi.azurewebsites.net/api/ItemListFunction`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Something went wrong. Please try again.');
        }

        const data = await response.json();
        const sign = data.records;

        for (let itemSig of sign) {
            if (itemSig.PartitionKey === PartitionKey && itemSig.RowKey === RowKey) {
                await localStorage.setItem('itemLists', JSON.stringify(itemSig));
                window.location.href = 'updateData.html';
                break;
            }
        }
    } catch (error) {
        console.error('Error in EditItem:', error.message);
    }
}


async function deleteitem(PartitionKey, RowKey) {
    try {
        const response = await fetch(`https://tiptabapi.azurewebsites.net/api/ItemListFunction`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ PartitionKey, RowKey })
        });

        if (!response.ok) {
            throw new Error('Something went wrong. Please try again.');
        }

        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await Swal.fire({
                    title: "Deleted!",
                    text: "Your item has been deleted.",
                    icon: "success"
                });
                
                window.location.reload();
            }
        });
    } catch (error) {
        console.error('Error in deleteItem:', error.message);
    }
}
