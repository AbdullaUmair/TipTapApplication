
fetch('https://tiptabapi.azurewebsites.net/api/ItemListFunction')
    .then(response => {
        if (!response.ok) {
            throw new Error("Network Error");
        }
        return response.json();
    })
    .then(data => {
        let html = "";
        for (let signoffdata of data.records) { 
            if(signoffdata.IsSignatureItem ==true ){         
                html += `<option value="${signoffdata.RestaurantID}">${signoffdata.ItemTitle}</option>`;      }   
        document.querySelector('#Signatureitem').innerHTML = html;
        }
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });


async function fetchOffer(RestaurantID) {
    try {
        const response = await fetch('https://tiptabapi.azurewebsites.net/api/ItemOffresFunction?');
 
        if (!response.ok) {
            throw new Error(`Network issue: ${response.status}`);
        }

        const itemdata = await response.json();
        console.log(itemdata)
        for (let offerData of itemdata.records) {
            if (offerData.RestaurantID==RestaurantID) {
                document.getElementById('itemSigDiscount').value = offerData.Discount || 0;
                localStorage.setItem('item-discount', JSON.stringify(offerData));
                localStorage.setItem('item-discountval', RestaurantID);        
                break;
            }
        }

    } catch (error) {
        console.error("Error fetching offer:", error);
    }
}

//update 
async function updatediscount() {
    try {
        const finaldiscountval = parseInt(document.getElementById('itemSigDiscount').value);
        const localdis = JSON.parse(localStorage.getItem('item-discount'));
           console.log(localdis);
        if (!localdis) {
            throw new Error("No discount data found in localStorage");
        }

        let objectdata = {
            PartitionKey: localdis.PartitionKey,
            RowKey: localdis.RowKey,
            ItemOfferID: localdis.ItemOfferID,
            ItemID: localdis.ItemID,
            RestaurantID: localdis.RestaurantID,
            OfferTitle: localdis.OfferTitle,
            Discount: finaldiscountval,
            StartDate: localdis.StartDate,
            EndDate: localdis.EndDate,
            Description: localdis.Description,
            IsOffer: localdis.IsOffer,
            disabled: localdis.disabled
        };
        console.log("objectdata:",objectdata)

        const putResponse = await fetch('https://tiptabapi.azurewebsites.net/api/ItemOffresFunction?', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(objectdata),
        });

        if (!putResponse.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await putResponse.json();
        console.log(data);
        alert("Successfully Updated");
        localStorage.clear();
        window.location.reload();
        
    } catch (error) {
        console.error("Error updating discount:", error);
        alert(error.message);
    }
}
