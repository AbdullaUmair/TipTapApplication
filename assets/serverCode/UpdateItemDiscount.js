var RestaurantTempID = JSON.parse(localStorage.getItem('objUser')).RestaurantID;

let ItemData, DiscountData;

function FetchCategory() {
    fetch(`https://tiptabapi.azurewebsites.net/api/itemCategoryFunction`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network Error");
            }
            return response.json();
        })
        .then(apiData => {
            ItemData = apiData;
            let html = "";
            for (let record of apiData.records) {
                html += `
                <option value="${record.CategoryID}">${record.Categorytitle}</option>
                `;
            }
            document.querySelector("#ItemCategory").innerHTML = html;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

function SelectedCategory(CatID) {
    fetch(`https://tiptabapi.azurewebsites.net/api/ItemListFunction?filter=RestaurantID eq '${RestaurantTempID}' and CategoryID eq '${CatID}'`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network Error");
            }
            return response.json();
        })
        .then(apiData => {
            ItemData = apiData;
            let html = "";
            for (let record of apiData.records) {
                html += `
                <option value="${record.ItemID}">${record.ItemTitle}</option>
                `;
            }
            document.querySelector("#ItemList").innerHTML = html;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

function DiscountVal(ItemId) {
    fetch(`https://tiptabapi.azurewebsites.net/api/ItemOffresFunction?filter=ItemID eq '${ItemId}'`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network Error");
            }
            return response.json();
        })
        .then(apiData => {
            if (apiData.records.length > 0) {
                DiscountData = apiData.records[0];
                document.querySelector("#DiscountValue").value = DiscountData.Discount;
            } else {
                DiscountData = null;
                document.querySelector("#DiscountValue").value = "";
                console.warn("No discount data found for the selected item.");
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

async function UpdateDiscount() {
    let DiscountValue = parseInt(document.getElementById('DiscountValue').value);

    if (isNaN(DiscountValue)) {
        alert("Discount value must be a valid number");
        return;
    }

    if (!DiscountData) {
        alert("No discount data to update. Please select an item with a discount.");
        return;
    }

    let OfferItem = {
        PartitionKey: DiscountData.PartitionKey,
        RowKey: DiscountData.RowKey,
        ItemOfferID: DiscountData.ItemOfferID,
        ItemID: DiscountData.ItemID,
        RestaurantID: DiscountData.RestaurantID,
        OfferTitle: DiscountData.OfferTitle,
        Discount: DiscountValue,
        StartDate: DiscountData.StartDate,
        EndDate: DiscountData.EndDate,
        Description: DiscountData.Description,
        IsOffer: DiscountData.IsOffer,
        disabled: DiscountData.disabled
    };

    try {
        const putResponse = await fetch(`https://tiptabapi.azurewebsites.net/api/ItemOffresFunction?`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(OfferItem),
        });

        if (!putResponse.ok) {
            const errorMessage = await putResponse.text();
            throw new Error(`Failed to update item: ${errorMessage}`);
        }

        alert("Successfully Updated");
        window.location.reload();
    } catch (error) {
        console.error("Error updating discount:", error);
        alert(`Error updating discount: ${error.message}`);
    }
}

FetchCategory();
