var RestaurantID = JSON.parse(localStorage.getItem('objUser')).RestaurantID;
async function itemfilter() {
    try {
        const response = await fetch(`https://tiptabapi.azurewebsites.net/api/ItemListFunction?filter=RestaurantID eq '${RestaurantID}' and IsSignatureItem eq ${true}`);
        if (!response.ok) {
            throw new Error("Network Error");
        }
        const dataS= await response.json();

        let itemhtml = "";
        for (let itemdata of dataS.records) {
                itemhtml += `<option value="${itemdata.ItemID}">${itemdata.ItemTitle}</option>`;
        }
        document.querySelector('#item-discount-list').innerHTML = itemhtml;
    } catch (error) {
        console.error("Error fetching item data:", error);
    }
}

// Item Discount Function
let TempOfferItemdata;
async function discountcal(itemid) {
    try {
        const response = await fetch(`https://tiptabapi.azurewebsites.net/api/ItemOffresFunction?filter=ItemID eq '${itemid}'`);

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);
        let discount = 0;
        for (let item of data.records) {
            if (item.ItemID == itemid) {
                TempOfferItemdata = item;
                discount = item.Discount;
                break; 
            }
        }
        document.getElementById('final-discount-val').value = discount;

    } catch (error) {
        console.error("Error fetching item data:", error);
        // Handle errors gracefully, e.g., display an error message
    }
}

async function signatureDiscountCal(){
    try {
        let discountVal = parseInt(document.getElementById('final-discount-val').value);

        let postdata = {
            PartitionKey: TempOfferItemdata.PartitionKey,
            RowKey: TempOfferItemdata.RowKey,
            ItemOfferID: TempOfferItemdata.ItemOfferID,
            ItemID: TempOfferItemdata.ItemID,
            OfferTitle: TempOfferItemdata.OfferTitle,
            RestaurantID: TempOfferItemdata.RestaurantID,
            Discount: parseInt(discountVal), 
            StartDate: TempOfferItemdata.StartDate,
            EndDate: TempOfferItemdata.EndDate,
            Description: TempOfferItemdata.Description,
            IsOffer: TempOfferItemdata.IsOffer,
            disabled: TempOfferItemdata.disabled
        };

        const putResponse = await fetch(`https://tiptabapi.azurewebsites.net/api/ItemOffresFunction?`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(postdata),
        });

        if (!putResponse.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await putResponse.json();
        console.log(data);
        alert("Successfully Updated");
        window.location.reload();
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error.message);
    }
}

itemfilter();

