

$(document).ready(function() {
    $('#BtnUpdate').click(UpdateItem);
    $('#item-image').change(handleImageUpload); // Bind change event for image upload
});

let data = localStorage.getItem('itemList');
data = data ? JSON.parse(data) : {};
var RestaurantItem, Categorydata;


$.ajax({
    url: 'https://tiptabapi.azurewebsites.net/api/ItemListFunction',
    type: 'GET',
    dataType: 'json',
    success: function (responseData) {
        RestaurantItem = responseData.records;
        console.log(RestaurantItem, "Restaurantdata");
        checkRenderSelects();
    },
    error: function (xhr, status, error) {
        console.error("Error fetching restaurant data:", error);
    }
});

$.ajax({
    url: 'https://tiptabapi.azurewebsites.net/api/itemCategoryFunction',
    type: 'GET',
    dataType: 'json',
    success: function (data) {
        Categorydata = data.records;
        console.log(Categorydata, "Categorydata");
        checkRenderSelects();
    },
    error: function (xhr, status, error) {
        console.error("Error fetching category data:", error);
    }
});

function checkRenderSelects() {
    if (RestaurantItem && Categorydata) {
        renderSelects();
    }
}

function renderSelects() {
    let categorySelect = '<option value="">Select Category</option>';
    for (let i = 0; i < Categorydata.length; i++) {
        let isSelected = data.CategoryID == Categorydata[i].CategoryID ? 'selected' : '';
        categorySelect += '<option value="' + Categorydata[i].CategoryID + '" ' + isSelected + '>' + Categorydata[i].Categorytitle + '</option>';
    }
    $('#CategoryID').html(categorySelect);
    $('#ItemTitle').val(data.ItemTitle || '');
    $('#CusineTitle').val(data.CusineTitle || '');
    $('#Description').val(data.Description || '');
    $('#IsSignatureItem').prop('checked', data.IsSignatureItem || false);
    $('#Disable').prop('checked', data.Disable || false);

   
    const itemImage = data.itemImage; 
    if (itemImage) {
        $('#imagePreview').attr('src', itemImage); 
    } else {
        $('#imagePreview').attr('src', 'assets/img/icons/upload.svg'); 
    }
}



function handleImageUpload() {
    var input = document.getElementById('item-image');
    var preview = document.getElementById('imagePreview');
    var fileName = document.querySelector('.image-uploads h4');

    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result; // Update preview
            fileName.innerHTML = input.files[0].name; // Display file name
        };
        reader.readAsDataURL(input.files[0]); // Read file as Data URL
    } else {
        preview.src = 'assets/img/icons/upload.svg'; // Default placeholder image
        fileName.innerHTML = 'Drag and drop a file to upload'; // Default file name
    }
}

async function getItemImageBase64() {
    const fileInput = $('#item-image')[0];
    if (fileInput.files && fileInput.files[0]) {
        try {
            return await convertImageToBase64(fileInput.files[0]);
        } catch (error) {
            console.error('Error converting image to Base64:', error);
            return null; // Return null if conversion fails
        }
    } else {
        console.log('No new image selected, using existing image.');
        return data.itemImage; // Use existing image data if no new image is selected
    }
}

function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result.split(',')[1]); 
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}



async function UpdateItem() {
    try {
        // Ensure `data` object has all the necessary properties.
        if (!data.PartitionKey || !data.RowKey || !data.ItemID || !data.RestaurantID) {
            throw new Error('Data object is missing required fields.');
        }

        // Get the Base64 string for the image
        let imageBase64 = await getItemImageBase64();

        // Create the update object
        let updateItem = {
            PartitionKey: data.PartitionKey,
            RowKey: data.RowKey,
            ItemID: data.ItemID,
            RestaurantID: data.RestaurantID,
            ItemTitle: $('#ItemTitle').val(),
            CategoryID: $('#CategoryID').val(),
            CusineTitle: $('#CusineTitle').val(),
            IsSignatureItem: $('#IsSignatureItem').prop('checked'),
            Description: $('#Description').val() || '', // Ensure Description is taken from the form
            itemImage: imageBase64, 
            Disable: $('#Disable').prop('checked')
        };

        console.log('Update item object:', updateItem);

        // Send the update request
        let response = await $.ajax({
            type: 'PUT',
            url: 'https://tiptabapi.azurewebsites.net/api/ItemListFunction',
            contentType: 'application/json',
            data: JSON.stringify(updateItem)
        });

        console.log('API response:', response);
      

        // Clear local storage and redirect
        localStorage.removeItem('itemList');
        
        Swal.fire({
            title: "DONE",
            text: "Data successfully Updated!",
            icon: "success"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "RestaurantItemsList.html";
            }
        });
   
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the item. Please try again.');
    }
}
 

