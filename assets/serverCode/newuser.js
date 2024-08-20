function initializeFormData() {
    var imageInput = document.getElementById('Userimage');
    var imageFile = imageInput.files[0];
    return convertImageToBase64(imageFile).then((ImageData) => {
        return {
            UserID: UserID,
            FirstName: document.getElementById("FirstName").value,
            LastName: document.getElementById("LastName").value,
            UserType: document.getElementById("UserType").value,
            Email: document.getElementById("Email").value,
            LastLoginDate: document.getElementById("LastLoginDate").value,
            RegistrationDate: document.getElementById("RegistrationDate").value,
            Userimage: ImageData,
            PasswordHash: document.getElementById("PasswordHash").value,
            Disable:document.getElementById("Disable").checked
           
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

        var method = dataUser && dataUser.recordss ? "PUT" : "POST";

        fetch(`https://tiptabapi.azurewebsites.net/api/userFunction`, {
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
            window.location.href = "addStaffList.html";
        })
        .catch(function (error) {
            console.error("There was a problem with the fetch operation:", error.message);
        });
    }).catch(error => {
        console.error("There was a problem initializing form data:", error);
    });
});

var dataUser = JSON.parse(localStorage.getItem('localstore-User'));
if (dataUser && dataUser.records) {
    var UserID = UserID;
    document.getElementById("FirstName").value = dataUser.records.FirstName;
    document.getElementById("LastName").value = dataUser.records.LastName;
    document.getElementById("Email").value = dataUser.records.Email;
    document.getElementById("LastLoginDate").value = dataUser.records.LastLoginDate;
    document.getElementById('RegistrationDate').value = dataUser.records.RegistrationDate;
    document.getElementById("PasswordHash").value = dataUser.records.PasswordHash;
    document.getElementById("Address").value = dataUser.records.Address;
    document.getElementById("UserType").value = dataUser.records.UserType;
    document.getElementById("Userimage").value = dataUser.records.Userimage;
    document.getElementById("Disable").checked=dataUser.records.Disable;
}

async function EditUser(PartitionKey, RowKey) {
    try {
        const response = await fetch(`https://tiptabapi.azurewebsites.net/api/userFunction/${PartitionKey}/${RowKey}?`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
 
        if (!response.ok) {
            throw new Error('Something went wrong. Please try again.');
        }
        const data = await response.json();
        var dataUser = JSON.stringify(data);
        localStorage.setItem('localstore-User', dataUser);
        window.location.href = 'addStaff.html';
 
    } catch (error) {
        console.error(error.message);
    }
}
 
async function deleteuser(partitionKey, rowKey) {
    try {
        const response = await fetch(`https://tiptabapi.azurewebsites.net/api/userFunction/${partitionKey}/${rowKey}`, {
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
