
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch the user data from localStorage
        const objUser = JSON.parse(localStorage.getItem('objUser'));
        if (!objUser || !objUser.RestaurantID) {
            throw new Error("RestaurantID not found in localStorage");
        }

        const AdminRestaurantID = objUser.RestaurantID;

        // Fetch all items
        const itemListUrl = `https://tiptabapi.azurewebsites.net/api/ItemListFunction?filter=RestaurantID eq '${encodeURIComponent(AdminRestaurantID)}'`;
        const itemListResponse = await fetch(itemListUrl);
        if (!itemListResponse.ok) {
            throw new Error("Failed to fetch item list");
        }

        const itemListData = await itemListResponse.json();
        const ItemData = itemListData.records || [];
        console.log('Item Data:', ItemData);

        const itemCount = ItemData.length;
        const itemCountDisplay = document.querySelector('.itemCountDisplay');
        if (itemCountDisplay) {
            itemCountDisplay.textContent = `${itemCount}`;
        }

        const itemCountSidebar = document.querySelector('.itemCountSidebar');
        if (itemCountSidebar) {
            itemCountSidebar.textContent = `(${itemCount})`;
        }

        // Fetch signature items
        const signatureItemUrl = `https://tiptabapi.azurewebsites.net/api/ItemListFunction?filter=IsSignatureItem eq true and RestaurantID eq '${encodeURIComponent(AdminRestaurantID)}'`;
        const signatureItemResponse = await fetch(signatureItemUrl);
        if (!signatureItemResponse.ok) {
            throw new Error("Failed to fetch signature items");
        }

        const signatureData = await signatureItemResponse.json();
        const signatureItemCount = signatureData.records ? signatureData.records.length : 0;
        console.log('Signature Item Count:', signatureItemCount);

        const signatureCountDisplay = document.querySelector('.signatureCount');
        if (signatureCountDisplay) {
            signatureCountDisplay.textContent = `${signatureItemCount}`;
        }

        const signatureCountSidebar = document.querySelector('.signatureCountDisplay');
        if (signatureCountSidebar) {
            signatureCountSidebar.textContent = `${signatureItemCount}`;
        }

    
        const waiterUrl = `https://tiptabapi.azurewebsites.net/api/waiterFunction?filter=RestaurantID eq '${encodeURIComponent(AdminRestaurantID)}'`;
        const waiterResponse = await fetch(waiterUrl);
        if (!waiterResponse.ok) {
            throw new Error("Failed to fetch waiter list");
        }

        const waiterData = await waiterResponse.json();
        const waiterCount = waiterData.records ? waiterData.records.length : 0;
        console.log('Waiter Count:', waiterCount);

        const waiterCountDisplay = document.querySelector('.waiterCount');
        if (waiterCountDisplay) {
            waiterCountDisplay.textContent = `${waiterCount}`;
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
});



    


