document.addEventListener('DOMContentLoaded', async () => {
    const objUser = JSON.parse(localStorage.getItem('objUser'));
    if (!objUser || !objUser.RestaurantID) {
        console.error("AdminRestaurantID not found in localStorage");
        return;
    }
    const AdminRestaurantID = objUser.RestaurantID;

    // Fetch category data from API or local storage
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

    // Fetch item data from API
    async function fetchItemData() {
        const itemListUrl = `https://tiptabapi.azurewebsites.net/api/ItemListFunction?filter=${encodeURIComponent(`RestaurantID eq '${AdminRestaurantID}'`)}`;
        const itemListResponse = await fetch(itemListUrl);
        if (!itemListResponse.ok) {
            throw new Error("Failed to fetch item list");
        }
        const itemListData = await itemListResponse.json();
        return itemListData.records || [];
    }

    // Display items and count for a specific category
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

    try {
        // Fetch and display soups
        const soupCategories = await fetchCategoryData("Soups");
        const allItems = await fetchItemData();
        const { html: soupHtml, itemCount: soupCount } = displayItems("Soups", allItems, soupCategories);

        const soupListElement = document.querySelector('#soupsLists');
        if (soupListElement) {
            soupListElement.innerHTML = soupHtml;
        } else {
            console.error("#soupsLists element not found");
        }

        const soupCountElement = document.querySelector('.soupCountDisplay');
        if (soupCountElement) {
            soupCountElement.textContent = `(${soupCount})`;
        } else {
            console.error("#soupCountDisplay element not found");
        }

        // Fetch and display appetizers
        const appetizerCategories = await fetchCategoryData("Appetizers");
        const { html: appetizerHtml, itemCount: appetizerCount } = displayItems("Appetizers", allItems, appetizerCategories);

        const appetizerListElement = document.querySelector('#appetizerLists');
        if (appetizerListElement) {
            appetizerListElement.innerHTML = appetizerHtml;
        } else {
            console.error("#appetizerLists element not found");
        }

        const appetizerCountElement = document.querySelector('.appetizerCountValue');
        if (appetizerCountElement) {
            appetizerCountElement.textContent = `(${appetizerCount})`;
          
        } else {
            console.error("#appetizerCountValue element not found");
        }

        // Fetch and display salads
        const saladCategories = await fetchCategoryData("Salads");
        const { html: saladHtml, itemCount: saladCount } = displayItems("Salads", allItems, saladCategories);

        const saladListElement = document.querySelector('#saladLists');
        if (saladListElement) {
            saladListElement.innerHTML = saladHtml;
        } else {
            console.error("#saladLists element not found");
        }

        const saladCountElement = document.querySelector('.saladCountValue');
        if (saladCountElement) {
            saladCountElement.textContent = `(${saladCount})`;
    
        } else {
            console.error("#saladCountValue element not found");
        }


        // Fetch and display salads
        const mainCourseCategories = await fetchCategoryData("Main Courses");
        const { html: mCourseHtml, itemCount: mCourseCount } = displayItems("Main Courses", allItems, mainCourseCategories);

        const mCourseListElement = document.querySelector('#mCoursesItemList');
        if (mCourseListElement) {
            mCourseListElement.innerHTML = mCourseHtml;
        } else {
            console.error("#mCoursesItemList element not found");
        }

        const mCourseCountElement = document.querySelector('.mCourseCountValue');
        if (mCourseCountElement) {
            mCourseCountElement.textContent = `(${mCourseCount})`;
           
        } else {
            console.error("#mCourseCountValue element not found");
        }


        // Fetch and display salads
        const dessertsCategories = await fetchCategoryData("Desserts");
        const { html: DessertsHtml, itemCount: DessertsCount } = displayItems("Desserts", allItems, dessertsCategories);

        const dessertListElement = document.querySelector('#dessertListElement');
        if (dessertListElement) {
            dessertListElement.innerHTML = DessertsHtml;
        } else {
            console.error("#DessertsList element not found");
        }

        const dessertCountElement = document.querySelector('.dessertCountValue');
        if (dessertCountElement) {
            dessertCountElement.textContent = `(${DessertsCount})`;
           
        } else {
            console.error("#dessertCountValue element not found");
        }


        // Fetch and display salads
        const beveragesCategories = await fetchCategoryData("Beverages");
        const { html: beveragesHtml, itemCount: beveragesCount } = displayItems("Beverages", allItems, beveragesCategories);

        const beveragesListElement = document.querySelector('#beverageItemList');
        if (beveragesListElement) {
            beveragesListElement.innerHTML = beveragesHtml;
        } else {
            console.error("#beverageItemList element not found");
        }

        const beverageCountElement = document.querySelector('.beverageCountValue');
        if (beverageCountElement) {
            beverageCountElement.textContent = `(${beveragesCount})`;

        } else {
            console.error("#beverageCountValue element not found");
        }


   
        const bakeryCategories = await fetchCategoryData("Bread-Bakery");
        const { html: bakeryHtml, itemCount: bakeryCount } = displayItems("Bread-Bakery", allItems, bakeryCategories);

        const bakeryListElement = document.querySelector('#bakeryItemList');
        if (bakeryListElement) {
            bakeryListElement.innerHTML = bakeryHtml;
        } else {
            console.error("#bakeryItemList element not found");
        }

        const bakeryCountElement = document.querySelector('.bakeryCountValue');
        if (bakeryCountElement) {
            bakeryCountElement.textContent = `(${bakeryCount})`;

        } else {
            console.error("#bakeryCountValue element not found");
        }

      


    } catch (error) {
        console.error('Error:', error);
    }
    







    
});


