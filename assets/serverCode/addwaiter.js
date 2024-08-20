document.addEventListener('DOMContentLoaded', function () {
    const restaurantDropdown = document.querySelector('#restaurantDropdown');
    const waiterStaffElement = document.querySelector('#waiterStaff');
    var AdminRestaurantID = JSON.parse(localStorage.getItem('objUser')).RestaurantID;
  
    function fetchRestaurants() {
        fetch(`https://tiptabapi.azurewebsites.net/api/RestaurantsFunction?filter=RestaurantID eq '${AdminRestaurantID}'`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network Error");
                }
                return response.json();
            })
            .then(data => {
                // Populate dropdown with restaurant options
                if (data && data.records) {
                    data.records.forEach(restaurant => {
                        const option = document.createElement('option');
                        option.value = restaurant.RestaurantID;
                        option.textContent = restaurant.RestaurantTitle;
                        restaurantDropdown.appendChild(option);
                    });
                }
            })
            .catch(error => {
                console.error("Error fetching restaurant data:", error);
                console.log("Dropdown element:", restaurantDropdown);
            });
    }

   
    function fetchData() {
        fetch(`https://tiptabapi.azurewebsites.net/api/waiterFunction?filter=RestaurantID eq '${AdminRestaurantID}'`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network Error");
                }
                return response.json();
            })
            .then(data => {
                let html = "";
                if (data && data.records) {
                    for (let waiterdata of data.records) {
                        html += `
                        <tr>
                            <td>
                                <label class="checkboxs">
                                    <input type="checkbox">
                                    <span class="checkmarks"></span>
                                </label>
                            </td>
                            <td>${waiterdata.FirstName || ''}</td>
                            <td>${waiterdata.LastName || ''}</td>
                            <td>${waiterdata.Gender || ''}</td>
                            <td>${waiterdata.BirthDate || ''}</td>
                            <td>${waiterdata.ContactNumber || ''}</td>
                            <td>${waiterdata.Email || ''}</td>
                            <td>${waiterdata.passwordHash || ''}</td>
                            <td>${waiterdata.IqamaID || ''}</td>
                            <td>${waiterdata.joiningDate || ''}</td>                           
                            <td>${waiterdata.Address || ''}</td>
                            <td>
                                <a class="me-3">
                                    <img src="assets/img/icons/edit.svg" onclick="EditWaiter('${waiterdata.PartitionKey}', '${waiterdata.RowKey}')" alt="Edit">
                                </a>
                                <a class="me-3 confirm-text" href="javascript:void(0);">
                                    <img src="assets/img/icons/delete.svg" onclick="deleteWaiter('${waiterdata.PartitionKey}', '${waiterdata.RowKey}')" alt="Delete">
                                </a>
                            </td>
                        </tr>
                        `;
                    }
                }
                document.querySelector('#addwaiterList').innerHTML = html
            })
            .catch(error => {
                console.error("Error fetching waiter data:", error);
            });
    }




    fetchRestaurants();
    fetchData(); 
});

async function EditWaiter(PartitionKey, RowKey) {
    try {
        console.log('EditWaiter called with:', PartitionKey, RowKey);

        const response = await fetch('https://tiptabapi.azurewebsites.net/api/waiterFunction', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data. Please try again.');
        }

        const data = await response.json();
        console.log('Data fetched for edit:', data);

        const waiterEdit = data.records.find(item => item.PartitionKey === PartitionKey && item.RowKey === RowKey);

        if (!waiterEdit) {
            throw new Error('Waiter not found.');
        }

        localStorage.setItem('waiter-Data', JSON.stringify(waiterEdit));

        // Swal.fire({
        //     title: "DONE",
        //     text: "Waiter data fetched successfully!",
        //     icon: "success"
        // });

        window.location.href = 'updateWaiter.html';

    } catch (error) {
        console.error('Error in EditWaiter:', error.message);

        Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error"
        });
    }
}


async function deleteWaiter(PartitionKey, RowKey) {
    try {
        console.log('deleteWaiter called with:', PartitionKey, RowKey);

        const response = await fetch(`https://tiptabapi.azurewebsites.net/api/waiterFunction`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ PartitionKey, RowKey })
        });

        if (!response.ok) {
            throw new Error('Failed to delete waiter. Please try again.');
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
        console.error('Error in deleteWaiter:', error.message);

        Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error"
        });
    }
}

