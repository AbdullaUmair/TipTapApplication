
async function recentlyAdded(RestaurantID) {
    if (!RestaurantID) {
        console.error('RestaurantID is required');
        return;
    }

    const encodedRestaurantID = encodeURIComponent(RestaurantID);
    const apiEndpoint = `https://tiptabapi.azurewebsites.net/api/ItemListFunction?filter=RestaurantID eq '${encodedRestaurantID}'`;

    try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const dataS = data.records || [];
        dataS.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));
        const recentItems = dataS.slice(0, 5);
        let htmlData = '';
        recentItems.forEach((recentData, index) => {
            htmlData += `<tr>
                <td>${index + 1}</td>
                <td class="productimgname">
                    <a href="#" class="product-img">
                        <img src="${recentData.itemImage || 'default-image.png'}" alt="${recentData.ItemTitle || 'Image'}" />
                    </a>
                    <a href="#">${recentData.ItemTitle || 'No Title'}</a>
                </td>
            </tr>`;
        });
        const recentlyAddedElement = document.querySelector('#recentlyAdded');
        if (recentlyAddedElement) {
            recentlyAddedElement.innerHTML = htmlData;
        } else {
            console.error('Element with ID "#recentlyAdded" not found.');
        }
    } catch (error) {
        console.error('Error fetching items:', error.message);
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    const objUser = localStorage.getItem('objUser');

    if (objUser) {
        const userData = JSON.parse(objUser);
        console.log('Parsed userData:', userData);

        if (userData.RestaurantID) {
            console.log('RestaurantID:', userData.RestaurantID);
            await recentlyAdded(userData.RestaurantID);  // Fetch recently added items

            const userAdminName = document.querySelector('.user-name');
            const userType = document.querySelector('.user-role');
            const restaurantNameElement = document.querySelector('.restaurantName');

            if (userAdminName) {
                userAdminName.innerHTML = userData.Email || 'N/A';
            }
            if (userType) {
                userType.innerHTML = userData.UserType || 'N/A';
            }

            if (restaurantNameElement) {
                console.log('Restaurant name element found in the DOM');

                try {
                    const restaurantName = await fetchRestaurantName(userData.RestaurantID);
                    if (restaurantName) {
                        restaurantNameElement.innerHTML = restaurantName || 'Unknown Restaurant';
                        console.log('Updated restaurant name:', restaurantNameElement.innerHTML);
                        userData.RestaurantName = restaurantName;
                        localStorage.setItem('objUser', JSON.stringify(userData));

                        try {
                            let itemLists = await fetchItemList();
                            localStorage.setItem('itemLists', JSON.stringify(itemLists));
                            console.log('Item list stored:', itemLists);
                            populateTable(itemLists);
                        } catch (error) {
                            console.error('Error fetching item list:', error);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching restaurant name:', error);
                    restaurantNameElement.innerHTML = 'Error Fetching Restaurant Name';
                }
            } else {
                restaurantNameElement.innerHTML = 'No Restaurant ID';
            }
        } else {
            console.error('No Restaurant ID found in user data');
        }
    } else {
        console.error('No user data found in localStorage');
    }
});


async function fetchRestaurantName(restaurantID) {
    const restaurantUrl = `https://tiptabapi.azurewebsites.net/api/RestaurantsFunction?filter=RestaurantID eq '${restaurantID}'`;

    try {
        const response = await fetch(restaurantUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const restaurantName = data.records[0]?.RestaurantTitle;

        if (restaurantName) {
            return restaurantName;
        } else {
            throw new Error("Restaurant name not found in response.");
        }
    } catch (error) {
        console.error("Error fetching restaurant name:", error);
        throw error; 
    }
}


async function fetchItemList() {
    const apiEndpoint = 'https://tiptabapi.azurewebsites.net/api/ItemListFunction?&isSignature=true';
    try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.records) {
            return data.records;
        } else {
            throw new Error('Item list not found in response');
        }
    } catch (error) {
        console.error('Error fetching item list:', error);
        throw error;
    }
}


function populateTable(itemLists) {
    console.log('Populating table with item list:', itemLists);
   
}


function displayItems(){

window.location.href="RetsaurantItemsList.html";
}

function addItemsForm(){
    window.location.href="addRestaurantItems.html";
}



