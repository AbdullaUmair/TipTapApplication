async function initializeFormData() {
  
    var formData = {
        ItemTitle: document.getElementById('ItemTitle').value,
        CategoryID: document.getElementById('CategoryID').value,
         CusineTitle: document.getElementById('CusineTitle').value,
         Description: document.getElementById('Description').value,
         IsSignatureItem:document.getElementById("IsSignatureItem").checked, 
        Disable: document.getElementById('Disable').checked,
        itemImage: document.getElementById('imagePreview').src
    };


    return Promise.resolve(formData);
}


document.getElementById("BtnSubmit").addEventListener("click", function () {
    initializeFormData()
        .then(formData => {
            console.log("Form Data:", formData);

            var method = resdata && resdata.records ? "PUT" : "POST"; 
            var url = `https://tiptabapi.azurewebsites.net/api/ItemListFunction`;
            if (resdata && resdata.records) {
                url += `?filter=IsSignatureItem eq true`;
            }

            fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(formData),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Response:", data);
                    alert("Successfully Updated");
                    window.location.href = "signatureList.html";
                })
                .catch(error => {
                    console.error("There was a problem with the fetch operation:", error.message);
                    alert("Failed to update item. Please try again later.");
                });
        })
        .catch(error => {
            console.error("There was a problem initializing form data:", error);
            alert("Failed to initialize form data. Please check your inputs.");
        });
});


let resdata = 0;

if (resdata && resdata.records) {
    document.getElementById('ItemTitle').value = resdata.records.ItemTitle || '';
    document.getElementById('CategoryID').value = resdata.records.CategoryID || '';
    document.getElementById('CusineTitle').value = resdata.records.CusineTitle || '';
    document.getElementById('Description').value = resdata.records.Description || '';
    document.getElementById("IsSignatureItem").checked=resdata.records.IsSignatureItem || false;
    document.getElementById('Disable').checked = resdata.records.Disable || false;

    if (resdata.records.itemImage) {
        var imagePreview = document.getElementById('imagePreview');
        imagePreview.src = resdata.records.itemImage;

        var fileName = document.querySelector('.image-uploads h4');
        fileName.innerHTML = resdata.records.itemImage;
    }
}
 