async function signin() {
    let UserName = document.getElementById('Oauth-Email').value.trim();
    let PassWord = document.getElementById('Oauth-Pass').value.trim();

    if (!UserName || !PassWord) {
        alert("Username and password must not be empty.");
        return;
    }

    const loginUrl = `https://tiptabapi.azurewebsites.net/api/RestaurantUserFunction?filter=Email eq '${UserName}'`;

    try {
        const response = await fetch(loginUrl);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const Datares = await response.json();
        const userData = Datares.records[0];

        if (userData && userData.FirstName && userData.LastName && userData.Email && userData.UserType) {
            if (userData.PasswordHash === PassWord) {
                // Store user data
                localStorage.setItem('objUser', JSON.stringify(userData));

                // Fetch restaurant details
                const restaurantUrl = `https://tiptabapi.azurewebsites.net/api/RestaurantsFunction?filter=RestaurantID eq '${userData.RestaurantID}'`;

                const restaurantResponse = await fetch(restaurantUrl);

                if (!restaurantResponse.ok) {
                    throw new Error('Network response was not ok while fetching restaurant details');
                }

                const restaurantData = await restaurantResponse.json();
                const restaurantName = restaurantData.records[0]?.RestaurantTitle;

                if (restaurantName) {
                    // Store restaurant name in local storage
                    localStorage.setItem('restaurantName', restaurantName);
                } else {
                    console.error("Error: Restaurant data is incomplete or incorrect.");
                    alert("Error: Restaurant data is incomplete or incorrect.");
                    return;
                }

                // Redirect to index.html
                window.location.href = "index.html";
            } else {
                console.error("Error: Incorrect password.");
                alert("Incorrect password.");
            }
        } else {
            console.error("Error: Datares does not contain the expected properties.");
            alert("Error: User data is incomplete or incorrect.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert(`Error: ${error.message}`);
    }
}
window.onload = function () {
    const restaurantName = localStorage.getItem('.restaurantName');
    if (restaurantName) {
        const restaurantNameElement = document.getElementsByClassName('.restaurantName');
        if (restaurantNameElement) {
            restaurantNameElement.textContent = restaurantName;
        }
    }
};


   