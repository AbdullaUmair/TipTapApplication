
fetch('https://tiptabapi.azurewebsites.net/api/itemCategoryFunction')
    .then(response => {
        if (!response.ok) {
            throw new Error("Network request failed");
        }
        return response.json();
    })
    .then(data => {
        if (!data) {
            throw new Error("Invalid data format received");
        }
        let html = "";
        for (let Categorydata of data.records) {
            html += `
            <option value="${Categorydata.CategoryID}">${Categorydata.Categorytitle}</option>
            `;
        } 
        document.querySelector('#CategoryID').innerHTML = html;        
    })
    .catch(error => {
        console.error("Error:", error.message);
    });

    function initializeFormData() {
        var ItemTitleInput = document.getElementById("ItemTitle");
        var ItemTitle = ItemTitleInput.value.trim();
        if (ItemTitle === "") {
            alert("Please enter ItemTitle");
            ItemTitleInput.focus();
            return false;
        }
    
        var CusineTitleInput = document.getElementById("CusineTitle");
        var CusineTitle = CusineTitleInput.value.trim();
        if (CusineTitle === "") {
            alert("Please enter CusineTitle");
            CusineTitleInput.focus();
            return false;
        }
    
        var DescriptionInput = document.getElementById("Description");
        var Description = DescriptionInput.value.trim();
        if (Description === "") {
            alert("Please enter Description");
            DescriptionInput.focus();
            return false;
        }

        var imageInput = document.getElementById('item-image');
        var imageFile = imageInput.files[0];
        if (!imageFile) {
            alert("Please select an image.");
            imageInput.focus();
            return false;
        }

        var allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(imageFile.type)) {
            alert("Only JPEG and PNG images are allowed.");
            imageInput.focus();
            return false;
        }

        var maxSize = 2 * 1024 * 1024;
        if (imageFile.size > maxSize) {
            alert("Image size should not exceed 2MB.");
            imageInput.focus();
            return false;
        }


        var imageInput = document.getElementById('itemImage');
        var imageFile = imageInput.files[0];
        return convertImageToBase64(imageFile).then((ImageData) => {
      let RestaurantID  ="05dc0e58-0ec9-4ef3-b2d4-a69a7da869c5";
            return {
                ItemID: ItemID,
                RestaurantID: RestaurantID,
                ItemTitle: document.getElementById("ItemTitle").value,
                CategoryID: document.getElementById("CategoryID").value, 
                CusineTitle: document.getElementById("CusineTitle").value,
                IsSignatureItem: document.getElementById("IsSignatureItem").checked,
                Description: document.getElementById("Description").value,
                itemImage:ImageData,
                Disable: document.getElementById("Disable").checked
            };
        });
    }
  function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

document.getElementById("Btnsubmit").addEventListener("click", function () {
    initializeFormData().then(formData => {
        console.log(formData);

        var method = resdata && resdata.records ? "PUT" : "POST";

        fetch(`https://tiptabapi.azurewebsites.net/api/ItemListFunction`, {
            method: method,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(formData),
        })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            alert("Successfully Updated");
            window.location.href="addStarterList.html";
        })
        .catch(function (error) {
            console.error("There was a problem with the fetch operation:", error.message);
        });
    }).catch(error => {
        console.error("There was a problem initializing form data:", error);
    });
});
 
var resdata = JSON.parse(localStorage.getItem('localstore-starter')) || {};
if (resdata && resdata.records) {
   
    var ItemID = resdata.records.ItemID;
    var RestaurantID= resdata.records.RestaurantID;
    document.getElementById('ItemTitle').value = resdata.records.ItemTitle;
    document.getElementById('CategoryID').value = resdata.records.CategoryID;
    document.getElementById('CusineTitle').value = resdata.records.CusineTitle;
    document.getElementById('IsSignatureItem').checked = resdata.records.IsSignatureItem;
    document.getElementById('Description').value = resdata.records.Description;
    document.getElementById('itemImage').value = resdata.records.itemImage;
    document.getElementById('Disable').checked = resdata.records.Disable;
}
 
async function EditItem(PartitionKey, RowKey) {
    try {
        const response = await fetch(`https://tiptabapi.azurewebsites.net/api/ItemListFunction/${PartitionKey}/${RowKey}?`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Something went wrong. Please try again.');
        }
        const data = await response.json();
        var restaurantdata = JSON.stringify(data);
        localStorage.setItem('localstore-starter', restaurantdata);
        window.location.href = 'addStarter.html';

    } catch (error) {
        console.error(error.message);
    }
}

async function deleteitem(partitionKey, rowKey) {
    try {
        const response = await fetch(`https://tiptabapi.azurewebsites.net/api/ItemListFunction/${partitionKey}/${rowKey}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Something went wrong. Please try again.');
        }
        const data = await response.json();
        console.log(data);
        window.location.reload();

    } catch (error) {
        console.error(error.message);
    }
}