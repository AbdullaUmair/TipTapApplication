const RestaurantID = JSON.parse(localStorage.getItem('objUser'))?.RestaurantID;
console.log("RestaurantID", RestaurantID);

let ResOfferData, TempResID;

async function restTitle() {
    try {
        const response = await fetch(`https://tiptabapi.azurewebsites.net/api/RestaurantsFunction?filter=RestaurantID eq '${RestaurantID}'`);
        const data = await response.json();
        const titleData = data.records;

        if (Array.isArray(titleData) && titleData.length > 0) {
            const title = titleData[0]?.RestaurantTitle;

            if (title) {
                document.getElementById('RestoTitle').value = title;
            } else {
                console.error('RestaurantTitle is not found in the first element of titleData');
            }
        } else {
            console.error('titleData is not an array or is empty');
        }
    } catch (error) {
        console.error("Error fetching restaurant title:", error.message);
    }
}

restTitle();

// Function to handle image upload preview
function handleImageUpload() {
    const fileInput = document.getElementById('item-image');
    const imagePreview = document.getElementById('imagePreview');
    const file = fileInput?.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block'; // Show image preview
        };

        reader.readAsDataURL(file);
    } else {
        imagePreview.src = 'assets/img/icons/upload.svg'; // Default image
        imagePreview.style.display = 'none'; // Hide image preview if no file selected
    }
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            const extractedBase64 = extractBase64Data(base64String);
            resolve(extractedBase64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function extractBase64Data(base64String) {
    const base64Data = base64String.split(',')[1];
    return base64Data || base64String;
}

async function handleFormSubmit() {
    const restaurantName = document.getElementById('RestoTitle')?.value || '';
    const restoOffer = document.getElementById('RestoOffer')?.value || '';
    const startDate = document.getElementById('startDate')?.value || '';
    const endDate = document.getElementById('endDate')?.value || '';
    const description = document.getElementById('Description')?.value || '';
    const discount = document.getElementById('discountFunction')?.value || '';

    const imageInput = document.getElementById('item-image');

    try {
        let imageBase64 = '';
        if (imageInput?.files.length > 0) {
            imageBase64 = await getBase64(imageInput.files[0]);
        }

        const data = {
            RestaurantTitle: restaurantName,
            RestaurantID: RestaurantID,
            OfferTitle: restoOffer,
            startDate: startDate,
            EndDate: endDate,
            Description: description,
            Discount: discount,
            offerImage: imageBase64
        };

        console.log('Sending data:', data);

        const response = await fetch('https://tiptabapi.azurewebsites.net/api/restaurantOffer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Response body:', result);

        if (response.ok) {
            Swal.fire({
                title: "DONE",
                text: "Offer added successfully!",
                icon: "success"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'index.html';
                }
            });
        } 
        else {
            alert('Failed to add offer: ' + (result.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while submitting the form.');
    }
}

document.getElementById('BtnSubmit')?.addEventListener('click', handleFormSubmit);
document.getElementById('item-image')?.addEventListener('change', handleImageUpload);
