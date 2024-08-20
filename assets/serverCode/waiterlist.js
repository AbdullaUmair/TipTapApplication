document.addEventListener("DOMContentLoaded", function () {
    // Define variables
    let TempWaiter;
    let PartitionKey;
    let RowKey;

    var RestaurantId = JSON.parse(localStorage.getItem('objUser')).RestaurantID;

    async function initializeFormData() {
        const FirstNameInput = document.getElementById("FirstName");
        const LastNameInput = document.getElementById("LastName");
        const GenderInput = document.getElementById("Gender");
        const BirthDateInput = document.getElementById("BirthDate");
        const ContactNumberInput = document.getElementById("ContactNumber");
        const EmailInput = document.getElementById("Email");
        const IqamaIDInput = document.getElementById("IqamaID");
        const PasswordHashInput = document.getElementById("passwordHash");
        const JoiningDateInput = document.getElementById("joiningDate");
        const RestaurantInput = document.getElementById("restaurantDropdown");
        const AddressInput = document.getElementById("Address");
        const imageInput = document.getElementById('waiterImg');

        const inputs = [
            { input: EmailInput, message: "Please enter Email" },
            { input: FirstNameInput, message: "Please enter First Name" },
            { input: LastNameInput, message: "Please enter Last Name" },
            { input: BirthDateInput, message: "Please enter Birth Date" },
            { input: ContactNumberInput, message: "Please enter Contact Number" },
            { input: IqamaIDInput, message: "Please enter Iqama ID" },
            { input: PasswordHashInput, message: "Please enter Password Hash" },
            { input: JoiningDateInput, message: "Please enter Joining Date" },
            { input: AddressInput, message: "Please enter Address" },
            { input: imageInput, message: "Please select an image" }
        ];

        for (let { input, message } of inputs) {
            if (!input || !input.value.trim()) {
                alert(message);
                if (input) input.focus();
                return null;
            }
        }

        // Validate dropdown for Gender
        if (!GenderInput || GenderInput.value === "1") {
            alert("Please select Gender");
            if (GenderInput) GenderInput.focus();
            return null;
        }
        // Validate dropdown for Restaurant
        if (!RestaurantInput || RestaurantInput.value === "1") {
            alert("Please select Restaurant");
            if (RestaurantInput) RestaurantInput.focus();
            return null;
        }


        // Validate image input
        const imageFile = imageInput.files[0];
        if (!imageFile) {
            alert("Please select an image.");
            imageInput.focus();
            return null;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(imageFile.type)) {
            alert("Only JPEG and PNG images are allowed.");
            imageInput.focus();
            return null;
        }

        const maxSize = 2 * 1024 * 1024;
        if (imageFile.size > maxSize) {
            alert("Image size should not exceed 2MB.");
            imageInput.focus();
            return null;
        }

        // Convert image to base64 and return form data
        try {
            const ImageData = await convertImageToBase64(imageFile);
            if (!ImageData) {
                throw new Error("Failed to convert image to Base64.");
            }
            return {
                WaiterID: TempWaiter || "",
                PartitionKey: PartitionKey,
                RowKey: RowKey,
                RestaurantID: RestaurantId,
                FirstName: FirstNameInput.value.trim(),
                LastName: LastNameInput.value.trim(),
                Gender: GenderInput.value,
                BirthDate: BirthDateInput.value.trim(),
                ContactNumber: parseInt(ContactNumberInput.value.trim()),
                Email: EmailInput.value.trim(),
                IqamaID: IqamaIDInput.value.trim(),
                JoiningDate: JoiningDateInput.value.trim(),
                Waiterimage: ImageData,
                PasswordHash: PasswordHashInput.value.trim(),
                Address: AddressInput.value.trim(),
                Disable: document.getElementById("Disable").checked
            };
        } catch (error) {
            console.error("Error processing image:", error);
            alert("Failed to process the image. Please try again.");
            return null;
        }
    }

    // Function to convert image file to base64
    function convertImageToBase64(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                resolve(null);
                return;
            }
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Form submission
    document.getElementById("Btnsubmit").addEventListener("click", async function (event) {
        event.preventDefault();

        try {
            const formData = await initializeFormData();

            if (!formData) return;

            console.log("Form data initialized:", formData);

            const method = formData.WaiterID ? "PUT" : "POST";

            const response = await fetch(`https://tiptabapi.azurewebsites.net/api/waiterFunction?filter=RestaurantID eq '${RestaurantId}'`, {
                method: method,
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(formData),
            });

            console.log("Fetch response status:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error: ${response.status}, ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            console.log("Response data:", data);

            localStorage.setItem('localstore-waiter', JSON.stringify(data));


            Swal.fire({
                title: "DONE",
                text: "Data successfully Added!",
                icon: "success"
            }).then((result) => {

                if (result.isConfirmed || result.isDismissed) {
                    window.location.href = "addwaiterList.html";
                }
            });
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error.message);

            Swal.fire({
                title: "Error",
                text: `Failed to add data: ${error.message}`,
                icon: "error"
            });
        }
    });

    // Populate form with data from localStorage
    const dataWaiter = JSON.parse(localStorage.getItem('localstore-waiter'));
    console.log("dataWaiter:", dataWaiter);
    if (dataWaiter) {
        TempWaiter = dataWaiter.WaiterID;
        RowKey = dataWaiter.RowKey;
        PartitionKey = dataWaiter.PartitionKey;
        RestaurantID = dataWaiter.RestaurantID;
        document.getElementById("FirstName").value = dataWaiter.FirstName;
        document.getElementById("LastName").value = dataWaiter.LastName;
        document.getElementById("Gender").value = dataWaiter.Gender;
        document.getElementById("BirthDate").value = dataWaiter.BirthDate;
        document.getElementById("ContactNumber").value = dataWaiter.ContactNumber;
        document.getElementById("IqamaID").value = dataWaiter.IqamaID;
        document.getElementById("Email").value = dataWaiter.Email;
        document.getElementById("joiningDate").value = dataWaiter.JoiningDate;

        document.getElementById("restaurantDropdown").value = dataWaiter.Restaurant;
        document.getElementById("passwordHash").value = dataWaiter.PasswordHash;
        document.getElementById("Address").value = dataWaiter.Address;
        document.getElementById("Disable").checked = dataWaiter.Disable;
    }

    const dataWaiters = JSON.parse(localStorage.removeItem('waiter-Data'));
});
