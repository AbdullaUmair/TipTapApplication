document.addEventListener('DOMContentLoaded', () => {
    const RestaurantID = JSON.parse(localStorage.getItem('objUser')).RestaurantID;
    console.log(RestaurantID);
    // Fetch the list of offers
    fetch(`https://tiptabapi.azurewebsites.net/api/restaurantOffer?filter=RestaurantID eq '${RestaurantID}'`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const OfferData = data.records || [];
            let offerHtml = "";

            for (let offer of OfferData) {
                let offerTitle=offer.OfferTitle
                let offerImage = offer.offerImage || 'default-offer-image.jpg';
                let startDate = offer.startDate || 'No Start Date';
                let endDate = offer.EndDate || 'No End Date';
                let description = offer.Description || 'No Description';

                offerHtml += `
                <tr>
                    <td>
                        <a class="offer-img">
                            <img src="${offerImage}" alt="offer image" class="image-fluid" style="width:100px;height:100px;">
                        </a>
                    </td>
                    <td>${offer.OfferTitle || 'No Name'}</td>
                  
                    <td>${startDate}</td>
                    <td>${endDate}</td>
                    <td>${description}</td>
                    <td>
                      
                        <a class="me-3 confirm-text" onclick="deleteOffer('${offer.PartitionKey}', '${offer.RowKey}')">
                            <img src="assets/img/icons/delete.svg" alt="delete icon">
                        </a>
                    </td>
                </tr>
            `;
            }

            // Update the HTML for the offer list
            document.querySelector('#offersList').innerHTML = offerHtml;
        })
        .catch(error => console.error("Error fetching data:", error));
});

async function EditOffer(PartitionKey, RowKey) {
    try {
        console.log('EditOffer called with:', PartitionKey, RowKey);
        const response = await fetch(`https://tiptabapi.azurewebsites.net/api/restaurantOffer?PartitionKey=${PartitionKey}&RowKey=${RowKey}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const offer = await response.json();
        console.log('Data fetched for edit:', offer);

        await localStorage.setItem('Offer-Data', JSON.stringify(offer));
        window.location.href = 'updateOffer.html';
    } catch (error) {
        console.error('Error in EditOffer:', error.message);
    }
}

async function deleteOffer(PartitionKey, RowKey) {
    try {
        console.log('deleteOffer called with:', PartitionKey, RowKey);
        const response = await fetch(`https://tiptabapi.azurewebsites.net/api/restaurantOffer`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ PartitionKey, RowKey })
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        console.log('Offer deleted successfully');
        window.location.reload();
    } catch (error) {
        console.error('Error in deleteOffer:', error.message);
    }
}


//  <a class="me-3" onclick="EditOffer('${offer.PartitionKey}', '${offer.RowKey}')">
//                             <img src="assets/img/icons/edit.svg" alt="edit icon">
//                         </a>