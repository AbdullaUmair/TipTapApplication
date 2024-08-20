document.addEventListener('DOMContentLoaded', function() {
    fetch('https://tiptabapi.azurewebsites.net/api/itemCategoryFunction')
        .then(response => {
            if (!response.ok) {
                throw new Error("Network Error");
            }
            return response.json();
        })
        .then(dataCat => {
          
            if (dataCat.records && dataCat.records.length > 0) {
          
                const firstCategoryData = dataCat.records[1];
             
                if (firstCategoryData.CategoryID) {
                    console.log(firstCategoryData.CategoryID);
                
                    itemcat(firstCategoryData.CategoryID);
                } else {
                    console.error("First category does not have a CategoryID");
                }
            } else {
                console.error("No categories found in the response");
            }
        })
        .catch(error => {
            console.error("Error fetching category data:", error);
        });
});
 
function itemcat(categoryID) {
    fetch('https://tiptabapi.azurewebsites.net/api/ItemListFunction')
        .then(response => {
            if (!response.ok) {
                throw new Error("Network Error");
            }
            return response.json();
        })
        .then(data => {
            let html = "";
            for (let Quickdata of data.records) {
                if (Quickdata.CategoryID == categoryID) {
                    html += `<option value="${Quickdata.RestaurantID}">${Quickdata.ItemTitle}</option>`;
                }
            }
            document.querySelector('#soupName').innerHTML = html;
        })
        .catch(error => {
            console.error("Error fetching item list data:", error);
        });
}
 

async function fetchOffer(RestaurantID) {
    try {
        const response = await fetch('https://tiptabapi.azurewebsites.net/api/ItemOffresFunction?');
 
        if (!response.ok) {
            throw new Error(`Network issue: ${response.status}`);
        }
 
        const soupdata = await response.json();
        console.log(soupdata)
        for (let offerData of soupdata.records) {
            if (offerData.RestaurantID==RestaurantID) {
                document.getElementById('soupInputDiscount').value = offerData.Discount || 0;
                localStorage.setItem('Soup-discount', JSON.stringify(offerData));
                localStorage.setItem('Soup-discountval', RestaurantID);        
                break;
            }
        }
 
    } catch (error) {
        console.error("Error fetching offer:", error);
    }
}
 

async function AddFinalDiscount() {
    try {
        const finaldiscountval = parseInt(document.getElementById('soupInputDiscount').value);
        const localdis = JSON.parse(localStorage.getItem('Soup-discount'));
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