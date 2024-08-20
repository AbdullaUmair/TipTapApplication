document.addEventListener("DOMContentLoaded", function () {
    fetch('https://tiptabapi.azurewebsites.net/api/itemCategoryFunction')
    .then(response => {
        if (!response.ok) {
            throw new Error("Network request failed");
        }
        return response.json();
    })
    .then(data => {
        if (!data || !Array.isArray(data.records)) {
            throw new Error("Invalid data format received");
        }
        let html = '<option value="">Select</option>';
        for (let Categorydata of data.records) {
            html += `<option value="${Categorydata.CategoryID}">${Categorydata.Categorytitle}</option>`;
        }
        const itemcategoryHtml = document.querySelector('#CategoryID');
        if (itemcategoryHtml) {
            itemcategoryHtml.innerHTML = html;
        } else {
            console.error("#CategoryID element not found");
        }
    })
    .catch(error => {
        console.error("Error:", error.message);
    });
    // Load existing data from local storage if available
    var resdata = JSON.parse(localStorage.getItem('localstore-item')) || {};
    if (resdata && resdata.records) {
        var ItemID = resdata.records.ItemID;
        document.getElementById('CategoryID').value = resdata.records.CategoryID;
        document.getElementById('RestaurantID').value = resdata.records.RestaurantID;
        document.getElementById('ItemTitle').value = resdata.records.ItemTitle;
        document.getElementById('CusineTitle').value = resdata.records.CusineTitle;
        document.getElementById('IsSignatureItem').checked = resdata.records.IsSignatureItem;
        document.getElementById('Description').value = resdata.records.Description;
        // Assuming there's a preview mechanism for the image
        // document.getElementById('itemImagePreview').src = resdata.records.itemImage;
        document.getElementById('Disable').checked = resdata.records.Disable;
    }

    document.getElementById("Btnsubmit").addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default form submission

        initializeFormData().then(formData => {
            console.log(formData);

            var method = resdata && resdata.records ? "PUT" : "POST";

            return fetch(`https://tiptabapi.azurewebsites.net/api/ItemListFunction`, {
                method: method,
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(formData),
            });
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                alert("Successfully Updated");
                window.location.href = "RestaurantItemsList.html";
            })
            .catch(error => {
                console.error("There was a problem with the fetch operation:", error.message);
            });
    });

    function initializeFormData() {
        return new Promise((resolve, reject) => {
            var dropdown = document.getElementById("CategoryID");
            var selectedValue = dropdown ? dropdown.value : null;
            if (selectedValue === "") {
                alert("Please select a category.");
                reject("Category not selected");
                return;
            }

            var ItemTitleInput = document.getElementById("ItemTitle");
            var ItemTitle = ItemTitleInput.value.trim();
            if (ItemTitle === "") {
                alert("Please enter ItemTitle");
                ItemTitleInput.focus();
                reject("ItemTitle not entered");
                return;
            }

            var CusineTitleInput = document.getElementById("CusineTitle");
            var CusineTitle = CusineTitleInput.value.trim();
            if (CusineTitle === "") {
                alert("Please enter CusineTitle");
                CusineTitleInput.focus();
                reject("CusineTitle not entered");
                return;
            }

            var DescriptionInput = document.getElementById("Description");
            var Description = DescriptionInput.value.trim();
            if (Description === "") {
                alert("Please enter Description");
                DescriptionInput.focus();
                reject("Description not entered");
                return;
            }

            var imageInput = document.getElementById('item-image');
            var imageFile = imageInput.files[0];
            if (!imageFile) {
                alert("Please select an image.");
                imageInput.focus();
                reject("Image not selected");
                return;
            }

            var allowedTypes = ['image/jpeg', 'image/png'];
            if (!allowedTypes.includes(imageFile.type)) {
                alert("Only JPEG and PNG images are allowed.");
                imageInput.focus();
                reject("Invalid image type");
                return;
            }

            var maxSize = 2 * 1024 * 1024;
            if (imageFile.size > maxSize) {
                alert("Image size should not exceed 2MB.");
                imageInput.focus();
                reject("Image too large");
                return;
            }

            convertImageToBase64(imageFile).then((ImageData) => {
                let RestaurantID = "05dc0e58-0ec9-4ef3-b2d4-a69a7da869c5";
                resolve({
                    ItemID: ItemID,
                    RestaurantID: RestaurantID,
                    ItemTitle: ItemTitle,
                    CategoryID: selectedValue,
                    CusineTitle: CusineTitle,
                    IsSignatureItem: document.getElementById("IsSignatureItem").checked,
                    Description: Description,
                    itemImage: ImageData,
                    Disable: document.getElementById("Disable").checked
                });
            }).catch(error => {
                reject("Image conversion failed");
            });
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
});
