document.addEventListener('DOMContentLoaded', async () => {
    const objUser = JSON.parse(localStorage.getItem('objUser'));
    if (!objUser || !objUser.RestaurantID) {
        console.error("AdminRestaurantID not found in localStorage");
        return;
    }
    const AdminRestaurantID = objUser.RestaurantID;

    async function fetchCategoryData(categoryTitle) {
        let categoryListData = JSON.parse(localStorage.getItem(`categoryListData_${categoryTitle}`));
        if (!categoryListData) {
            const categoryUrl = `https://tiptabapi.azurewebsites.net/api/itemCategoryFunction?filter=${encodeURIComponent(`Categorytitle eq '${categoryTitle}'`)}`;
            const categoryResponse = await fetch(categoryUrl);
            if (!categoryResponse.ok) {
                throw new Error(`Failed to fetch ${categoryTitle} category list`);
            }
            categoryListData = await categoryResponse.json();
            localStorage.setItem(`categoryListData_${categoryTitle}`, JSON.stringify(categoryListData));
        }
        return categoryListData.records || [];
    }

    async function fetchItemData() {
        const itemListUrl = `https://tiptabapi.azurewebsites.net/api/ItemListFunction?filter=${encodeURIComponent(`RestaurantID eq '${AdminRestaurantID}'`)}`;
        const itemListResponse = await fetch(itemListUrl);
        if (!itemListResponse.ok) {
            throw new Error("Failed to fetch item list");
        }
        const itemListData = await itemListResponse.json();
        return itemListData.records || [];
    }

    function displayItems(categoryTitle, items, categories) {
        let html = "";
        let itemCount = 0;

        for (let item of items) {
            let category = categories.find(cat => cat.CategoryID === item.CategoryID);
            const categoryName = category ? category.Categorytitle : 'Unknown';
            if (category && categoryName === categoryTitle) {
                itemCount++;
                const imageUrl = item.itemImage ? item.itemImage : 'placeholder_image_url';

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
                                <img src="${imageUrl}" alt="product">
                            </a>
                        </td>
                        <td>${item.ItemTitle}</td>
                        <td>${categoryName}</td>                 
                        <td>
                            <a class="me-3">
                                <img src="assets/img/icons/edit.svg" alt="img" onclick="EditItem('${item.PartitionKey}', '${item.RowKey}')">
                            </a>
                            <a class="me-3 confirm-text">
                                <img src="assets/img/icons/delete.svg" onclick="deleteitem('${item.PartitionKey}', '${item.RowKey}')" alt="img">
                            </a>
                        </td>
                    </tr>
                `;
            }
        }

        return { html, itemCount };
    }

    const categoryMappings = {
        "Soups": { listId: "#soupsLists" },
        "Appetizers": { listId: "#appetizerList" },
        "Salads": { listId: "#saladItemList" },
        "Main Courses": { listId: "#mCoursesItemList" },
        "Desserts": { listId: "#dessertItemList" },
        "Beverages": { listId: "#beverageItemList" },
        "Bread-Bakery": { listId: "#bakeryItemList" }
    };

    try {
        const allItems = await fetchItemData();

        for (const [category, { listId }] of Object.entries(categoryMappings)) {
            const categoryData = await fetchCategoryData(category);
            const { html, itemCount } = displayItems(category, allItems, categoryData);

            const listElement = document.querySelector(listId);
            if (listElement) {
                listElement.innerHTML = html;
            } else {
                console.error(`${listId} element not found`);
            }

           
            const countElement = document.querySelector(`.${category.replace(/\s+/g, '').toLowerCase()}CountValue`);
            if (countElement) {
                countElement.textContent = `(${itemCount})`;
            } else {
                console.error(`Count element for ${category} not found`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
