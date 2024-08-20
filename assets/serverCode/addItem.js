document.addEventListener('DOMContentLoaded', () => {
    const RestaurantID = JSON.parse(localStorage.getItem('objUser')).RestaurantID;
 
  
    fetch('https://tiptabapi.azurewebsites.net/api/itemCategoryFunction')
        .then(response => {
            if (!response.ok) {
                throw new Error("Network request failed");
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.records) {
                throw new Error("Invalid data format received");
            }
            let html = '<option value="">Select</option>';
            data.records.forEach(Categorydata => {
                html += `<option value="${Categorydata.CategoryID}">${Categorydata.Categorytitle}</option>`;
            });
            document.getElementById('CategoryID').innerHTML = html;
        })
        .catch(error => {
            console.error("Error fetching categories:", error.message);
        });
 
   
    function initializeFormData() {
        return new Promise((resolve, reject) => {
            const dropdown = document.getElementById("CategoryID");
            const selectedValue = dropdown ? dropdown.value : null;
 
            if (!selectedValue) {
                alert("Please select a category.");
                reject("Category not selected");
                return;
            }
 
            const ItemTitleInput = document.getElementById("ItemTitle");
            const ItemTitle = ItemTitleInput.value.trim();
 
            if (!ItemTitle) {
                alert("Please enter ItemTitle");
                ItemTitleInput.focus();
                reject("ItemTitle not entered");
                return;
            }
 
            const CusineTitleInput = document.getElementById("CusineTitle");
            const CusineTitle = CusineTitleInput.value.trim();
 
            if (!CusineTitle) {
                alert("Please enter CusineTitle");
                CusineTitleInput.focus();
                reject("CusineTitle not entered");
                return;
            }
 
            const DescriptionInput = document.getElementById("Description");
            const Description = DescriptionInput.value.trim();
 
            if (!Description) {
                alert("Please enter Description");
                DescriptionInput.focus();
                reject("Description not entered");
                return;
            }
 
            const imageInput = document.getElementById('item-image');
            const imageFile = imageInput.files[0];
 
            if (!imageFile) {
                alert("Please select an image.");
                imageInput.focus();
                reject("Image not selected");
                return;
            }
 
            const allowedTypes = ['image/jpeg', 'image/png'];
            if (!allowedTypes.includes(imageFile.type)) {
                alert("Only JPEG and PNG images are allowed.");
                imageInput.focus();
                reject("Invalid image type");
                return;
            }
 
            const maxSize = 2 * 1024 * 1024;
            if (imageFile.size > maxSize) {
                alert("Image size should not exceed 2MB.");
                imageInput.focus();
                reject("Image too large");
                return;
            }
 
            convertImageToBase64(imageFile).then((ImageData) => {
                const formData = {
                    RestaurantID: RestaurantID,
                    ItemTitle: ItemTitle,
                    CategoryID: selectedValue,
                    CusineTitle: CusineTitle,
                    Description: Description,
                    itemImage: ImageData,
                    Disable: document.getElementById("Disable").checked
                };
                resolve(formData);
 
            }).catch(error => {
                reject("Image conversion failed: " + error.message);
            });
        });
    }
 
    function convertImageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
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
            reader.onerror = (error) => reject("FileReader error: " + error.message);
            reader.readAsDataURL(file);
        });
    }
 
 
    document.getElementById("BtnSubmit").addEventListener("click", function (event) {
        event.preventDefault();
 
        initializeFormData().then(formData => {
            return fetch('https://tiptabapi.azurewebsites.net/api/ItemListFunction', {
                method: 'POST',
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
               
                window.location.href = "RestaurantItemsList.html";
            })
            .catch(error => {
                console.error("There was a problem with the fetch operation:", error.message);
                alert("Error submitting form. Please try again.");
            });
    });
});