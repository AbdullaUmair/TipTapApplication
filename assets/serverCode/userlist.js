fetch('https://tiptabapi.azurewebsites.net/api/userFunction')
.then(response => {
if (!response.ok) {
    throw new Error("Network Error");
}
return response.json();
})
.then(data => {
let html = "";
    for (let itemdata of data.records) {
   
        html += `

        <tr>
        <td>
            <label class="checkboxs">
                <input type="checkbox">
                <span class="checkmarks"></span>
            </label>
        </td>
        <td>${itemdata.FirstName}</td>
        <td>${itemdata.LastName}</td>
        <td>${itemdata.Email}</td>
        <td>${itemdata.UserType} </td>
        <td>${itemdata.RegistrationDate}</td>

        <td>

            <a class="me-3">
                <img src="assets/img/icons/edit.svg" onclick="EditUser('${itemdata.PartitionKey}', '${itemdata.RowKey}')" alt="img">
            </a>
            <a class="me-3 confirm-text" href="javascript:void(0);">
                <img src="assets/img/icons/delete.svg" onclick="deleteuser('${itemdata.PartitionKey}', '${itemdata.RowKey}')" alt="img">
            </a>
        </td>
    </tr>
        `;

}

document.querySelector('#userList').innerHTML=html;

});


