const restaurantId = localStorage.getItem('objUser');
const isSignatureItem = true;

async function fetchSignatureItemCount() {
    const url = `https://tiptabapi.azurewebsites.net/api/ItemListFunction?IsSignatureItem=true`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const SignatureData = await response.json();
        console.log('API Response:', SignatureData);

        const signatureItemCount = SignatureData.records ? SignatureData.records.length : 0;
        console.log('Signature Item Count:', signatureItemCount);

        const countElement = document.querySelector('#signatureCount');
        if (countElement) {
            countElement.innerHTML = signatureItemCount;
        } else {
            console.error('Element with ID "#signatureCount" not found.');
        }

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

fetchSignatureItemCount();
