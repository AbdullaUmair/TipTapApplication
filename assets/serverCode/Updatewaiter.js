$(document).ready(function () {
    // Retrieve data from localStorage on page load
    let dataWaiter = JSON.parse(localStorage.getItem('waiter-Data'));

    // Populate form fields with retrieved data
    if (dataWaiter) {
        document.getElementById("restaurantDropdown").value = dataWaiter.RestaurantID || '';
        document.getElementById("FirstName").value = dataWaiter.FirstName || '';
        document.getElementById("LastName").value = dataWaiter.LastName || '';
        document.getElementById("Gender").value = dataWaiter.Gender || '1';
        document.getElementById("BirthDate").value = dataWaiter.BirthDate || '';
        document.getElementById("ContactNumber").value = dataWaiter.ContactNumber || '';
        document.getElementById("Email").value = dataWaiter.Email || '';
        document.getElementById("IqamaID").value = dataWaiter.IqamaID || '';
        document.getElementById("passwordHash").value = dataWaiter.passwordHash || '';
        document.getElementById("joiningDate").value = dataWaiter.joiningDate || '';
        document.getElementById("Address").value = dataWaiter.Address || '';
        document.getElementById("Disable").checked = dataWaiter.Disable || false;
    }

    // Bind update button click event
    $('#updatebtn').click(UpdateItem);
});

async function UpdateItem() {
    try {
        // Retrieve data from localStorage
        let dataWaiter = JSON.parse(localStorage.getItem('waiter-Data'));

        // Create update object with form data
        let updateItem = {
            PartitionKey: dataWaiter.PartitionKey,
            RowKey: dataWaiter.RowKey,
            WaiterID: dataWaiter.WaiterID,
            RestaurantID: document.getElementById("restaurantDropdown").value,
            FirstName: document.getElementById("FirstName").value,
            LastName: document.getElementById("LastName").value,
            Gender: document.getElementById("Gender").value,
            BirthDate: document.getElementById("BirthDate").value,
            ContactNumber: document.getElementById("ContactNumber").value,
            Email: document.getElementById("Email").value,
            IqamaID: document.getElementById("IqamaID").value,
            passwordHash: document.getElementById("passwordHash").value,
            joiningDate: document.getElementById("joiningDate").value,
            Waiterimage: await convertImageToBase64(document.getElementById("waiterImg").files[0]),
            Address: document.getElementById("Address").value,
            Disable: document.getElementById("Disable").checked
        };

        console.log("Update Item Data:", updateItem);

        let response = await $.ajax({
            type: 'PUT',
            url: 'https://tiptabapi.azurewebsites.net/api/waiterFunction',
            contentType: 'application/json',
            data: JSON.stringify(updateItem)
        });

        localStorage.removeItem('waiter-Data');

        Swal.fire({
            title: "DONE",
            text: "Data successfully Updated!",
            icon: "success"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "addwaiterList.html";
            }
        });

        console.log("Update Response:", response);
    } catch (error) {
        // Handle errors during update process
        console.error('Error:', error);
        Swal.fire({
            title: "Error!",
            text: `Failed to update data: ${error.message}`,
            icon: "error"
        });
    }
}

// Function to convert image file to base64
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file || !(file instanceof Blob)) {
            reject(new Error('Invalid file or file type.'));
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result.split(',')[1]);
        };

        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}
