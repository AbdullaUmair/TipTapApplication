document.addEventListener('DOMContentLoaded', function () {
    var dataUser = JSON.parse(localStorage.getItem('localstore-User'));
    console.log("dataUser:", dataUser);
    if (dataUser) {
        document.getElementById("FirstName").value = dataUser.FirstName || '';
        document.getElementById("LastName").value = dataUser.LastName || '';
        document.getElementById("Email").value = dataUser.Email || '';
        document.getElementById("LastLoginDate").value = dataUser.LastLoginDate || '';
        document.getElementById('RegistrationDate').value = dataUser.RegistrationDate || '';
        document.getElementById("PasswordHash").value = dataUser.PasswordHash || '';      
        document.getElementById("UserType").value = dataUser.UserType || '';
        document.getElementById("Userimage").value = dataUser.Userimage || '';
        document.getElementById("Disable").checked = dataUser.Disable || false;
    }
});
 
async function UpdateItem() {
    let dataUser = JSON.parse(localStorage.getItem('localstore-User')); // Ensure dataUser is defined here
 
    let updateItem = {
        PartitionKey: dataUser.PartitionKey,
        RowKey: dataUser.RowKey,
        FirstName: document.getElementById("FirstName").value,
        LastLoginDate: document.getElementById("LastLoginDate").value,
        LastName: document.getElementById("LastName").value,
        PasswordHash: document.getElementById("PasswordHash").value,
        RegistrationDate: document.getElementById("RegistrationDate").value,
        UserID: dataUser.UserID,
        UserType: document.getElementById("UserType").value,
        Userimage: await convertImageToBase64(document.getElementById("Userimage").files[0]),

        Disable: document.getElementById("Disable").checked
    };
    console.log(updateItem);
    try {
        let response = await $.ajax({
            type: 'PUT',
            url: 'https://tiptabapi.azurewebsites.net/api/userFunction?',
            contentType: 'application/json',
            data: JSON.stringify(updateItem)
        });
        //localStorage.removeItem('localstore-User');
        alert('The user data has been successfully updated.');
        window.location.href='addUserList.html';
        console.log(response);
    } catch (error) {
        console.error('Error:', error);
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
 

