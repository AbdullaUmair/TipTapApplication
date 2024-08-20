
function logOut() {
    window.localStorage.clear();
    window.location.reload(true);
    window.location.replace('signin.html');
}

