document.addEventListener('DOMContentLoaded', () => {
    const AdminRestaurantID = JSON.parse(localStorage.getItem('objUser')).RestaurantID;

    Promise.all([
        fetch(`https://tiptabapi.azurewebsites.net/api/ItemListFunction?filter=IsSignatureItem eq true and RestaurantID eq '${AdminRestaurantID}'`)
            .then(response => {
                if (!response.ok) throw new Error("Network Error");
                return response.json();
            }),
        fetch('https://tiptabapi.azurewebsites.net/api/itemCategoryFunction')
            .then(response => {
                if (!response.ok) throw new Error("Network Error");
                return response.json();
            })
    ])
        .then(([itemData, categoryData]) => {
            let ItemData = itemData.records || [];
            let CategoryData = categoryData.records || [];
            let categoryMap = {};
    
            // Map category IDs to category names
            for (let category of CategoryData) {
                categoryMap[category.CategoryID] = category.Categorytitle;
            }
    
            let html = "";
            for (let itemdata of ItemData) {
                let categoryName = categoryMap[itemdata.CategoryID] || 'N/A';
                let itemImage = itemdata.itemImage || 'default-image.jpg';
    
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
                    <td>${itemdata.ItemTitle || 'No Title'}</td>
                    <td>${categoryName}</td>
                    <td>
                        <a class="me-3" onclick="EditItem('${itemdata.PartitionKey}', '${itemdata.RowKey}')">
                            <img src="assets/img/icons/edit.svg" alt="edit icon">
                        </a>
                        <a class="me-3 confirm-text" onclick="deleteitem('${itemdata.PartitionKey}', '${itemdata.RowKey}')">
                            <img src="assets/img/icons/delete.svg" alt="delete icon">
                        </a>
                    </td>
                </tr>
            `;
            }
    
            // Update the HTML for the item list
            document.querySelector('#SignatureitemList').innerHTML = html;
    
           
        })
        .catch(error => console.error("Error fetching data:", error));
    
});




async function EditItem(PartitionKey, RowKey) {
    try {
        console.log('EditItem called with:', PartitionKey, RowKey);
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


//async function EditItem(PartitionKey, RowKey) {
//    try {
//        console.log('EditItem called with:', PartitionKey, RowKey);
//        const response = await fetch(`https://tiptabapi.azurewebsites.net/api/ItemListFunction?PartitionKey=${PartitionKey}&RowKey=${RowKey}`, {
//            method: 'GET',
//            headers: {
//                'Content-Type': 'application/json',
//            },
//        });

//        if (!response.ok) {
//            throw new Error('Something went wrong. Please try again.');
//        }

//        const itemSig = await response.json();
//        console.log('Data fetched for edit:', itemSig);

//        await localStorage.setItem('Item-Data', JSON.stringify(itemSig));
//        window.location.href = 'updateData.html';
//    } catch (error) {
//        console.error('Error in EditItem:', error.message);
//    }
//}


//async function deleteitem(PartitionKey, RowKey) {
//    try {
//        console.log('deleteitem called with:', PartitionKey, RowKey);
//        const response = await fetch(`https://tiptabapi.azurewebsites.net/api/ItemListFunction`, {
//            method: 'DELETE',
//            headers: {
//                'Content-Type': 'application/json',
//            },
//            body: JSON.stringify({ PartitionKey, RowKey })
//        });

//        if (!response.ok) {
//            throw new Error('Something went wrong. Please try again.');
//        }

//        console.log('Item deleted successfully');
//        window.location.reload();
//    } catch (error) {
//        console.error('Error in deleteItem:', error.message);
//    }
//}


