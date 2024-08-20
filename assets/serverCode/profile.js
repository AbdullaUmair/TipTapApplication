// Retrieve the user profile from localStorage
const profileNameString = localStorage.getItem('objUser');
const profileName = profileNameString ? JSON.parse(profileNameString) : null;
const RestaurantID = profileName ? profileName.RestaurantID : null;
console.log(RestaurantID);
 
// Function to populate profile fields
const populateProfileFields = (profile) => {
    document.getElementById('userFullName').innerText = `${profile.FirstName} ${profile.LastName}`;
    document.getElementById('usertype').innerText = `${profile.UserType}...`;
    document.getElementById('profileImage').src = profile.Userimage;
    document.getElementById('profileFName').value = profile.FirstName;
    document.getElementById('profileLName').value = profile.LastName;
    document.getElementById('profileEmail').value = profile.Email;
    document.getElementById('profileUserName').value = profile.Email;
    document.getElementById('profilePassword').value = profile.PasswordHash;
};
 
if (profileName) {
    populateProfileFields(profileName);
} else {
    console.log('Profile not found in localStorage');
}
 
// Function to gather updated profile data and send a PUT request
const updateProfile = async () => {
    const updatedProfile = {
        ...profileName,
        FirstName: document.getElementById('profileFName').value,
        LastName: document.getElementById('profileLName').value,
        Email: document.getElementById('profileEmail').value,
        PasswordHash: document.getElementById('profilePassword').value,
        Userimage: await getItemImageBase64(),
    };
    console.log("updateProfile", updatedProfile);
 
    try {
        const response = await fetch(`https://tiptabapi.azurewebsites.net/api/RestaurantUserFunction?filter=RestaurantID eq '${RestaurantID}'`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProfile)
        });
 
        if (response.ok) {
            const result = await response.json();
            console.log("result", result);
            // Update localStorage with the new profile data
            localStorage.setItem('objUser', JSON.stringify(result));
            alert('Profile updated successfully!');
            // Re-populate profile fields with the updated data
            populateProfileFields(result);
        } else {
            console.error('Failed to update profile', response.statusText);
            alert('Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile', error);
        alert('Error updating profile');
    }
};
 
 
document.getElementById('updateButton').addEventListener('click', () => {
    updateProfile();
});
 
 