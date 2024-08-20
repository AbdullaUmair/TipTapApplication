document.addEventListener('DOMContentLoaded', (event) => {
    const AdminRestaurantID = JSON.parse(localStorage.getItem('objUser')).RestaurantID;
 
    function fetchAndDisplayItems() {
        fetch('https://tiptabapi.azurewebsites.net/api/ItemListFunction')
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`Network Error: ${response.status} - ${text}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                const itemData = data.records || [];
                const filteredItems = itemData.filter(item => item.RestaurantID === AdminRestaurantID);
                return fetch('https://tiptabapi.azurewebsites.net/api/itemCategoryFunction')
                    .then(response => {
                        if (!response.ok) {
                            return response.text().then(text => {
                                throw new Error(`Network Error: ${response.status} - ${text}`);
                            });
                        }
                        return response.json();
                    })
                    .then(categoryData => {
                        const categoryMap = {};
                        categoryData.records.forEach(category => {
                            categoryMap[category.CategoryID] = category.Categorytitle;
                        });

                        let html = "";
                        filteredItems.forEach(item => {
                            const categoryName = categoryMap[item.CategoryID] || 'N/A';
                            const itemImage = item.itemImage || 'default-image.jpg';

                            html += `
                            <tr>
                                <td>
                                    <label class="checkboxs">
                                        <input type="checkbox" class="item-checkbox">
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

                        const itemListElement = document.getElementById('itemLists');
                        if (itemListElement) {
                            itemListElement.innerHTML = html;
                        } else {
                            console.error('Element with ID itemLists not found');
                        }
                    });
            })
            .catch(error => console.error("Error fetching data:", error.message));
    }

    fetchAndDisplayItems();


    function searchTable(inputId, tableId) {
        const input = document.getElementById(inputId);
        if (!input) {
            console.error(`Element with ID ${inputId} not found`);
            return;
        }

        const filter = input.value.trim().toUpperCase();
        const table = document.getElementById(tableId);
        const tr = table.getElementsByTagName("tr");

        for (let i = 0; i < tr.length; i++) {
            const td = tr[i].getElementsByTagName("td");
            let found = false;

            for (let j = 0; j < td.length; j++) {
                if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                    found = true;
                    break;
                }
            }
            tr[i].style.display = found ? "" : "none";
        }
    }


    const currentPage = document.body.getAttribute('data-page');
    if (currentPage === 'itemList') {
        const searchInput = document.getElementById('filter_search');
        if (searchInput) {
            searchInput.addEventListener("input", () => {
                searchTable('filter_search', 'itemLists');
            });
        }
    }
});


async function EditItem(PartitionKey, RowKey) {
    try {
        console.log('EditItem called with:', PartitionKey, RowKey);
        const response = await fetch('https://tiptabapi.azurewebsites.net/api/ItemListFunction', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Something went wrong. Please try again.');
        }

        const data = await response.json();
        console.log('Data fetched for edit:', data);
        const sign = data.records;

        for (let itemSig of sign) {
            if (itemSig.PartitionKey == PartitionKey && itemSig.RowKey == RowKey) {
                await localStorage.setItem('itemList', JSON.stringify(itemSig));
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
        console.log('deleteItem called with:', PartitionKey, RowKey);
        const response = await fetch('https://tiptabapi.azurewebsites.net/api/ItemListFunction', {
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
                    text: "Your file has been deleted.",
                    icon: "success"
                });

                window.location.reload();
            }
        });
    } catch (error) {
        console.error('Error in deleteItem:', error.message);
    }
}