

// Global variable to store AdminRestaurantID
let AdminRestaurantID;

// Function to fetch data from a given URL
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
}

// Function to fetch all data and call Reviews function
async function fetchAllData() {
  try {
    const [restaurantData, userData, itemData] = await Promise.all([
      fetchData(`https://tiptabapi.azurewebsites.net/api/restaurantRating?filter=RestaurantID eq '${AdminRestaurantID}'`),
      fetchData('https://tiptabapi.azurewebsites.net/api/userFunction'),
      fetchData(`https://tiptabapi.azurewebsites.net/api/ItemRatingFunction?filter=RestaurantID eq '${AdminRestaurantID}'`),
    ]);
    Reviews(userData.records, restaurantData.records, itemData.records);
  } catch (error) {
    console.error('Error fetching all data:', error);
  }
}

// Function to generate star ratings
function generateStars(rating) {
  return Array.from({ length: 5 }, (_, i) =>
    i < rating ? '<i class="fa-solid fa-star text-warning"></i>' : '<i class="fa-regular fa-star text-warning"></i>'
  ).join('');
}

// Function to create a review card HTML
function createReviewCard(user, review, rating, reviewData) {
  const defaultImageUrl = 'https://restauranttabledata.blob.core.windows.net/userimages/DefaultUserImage.png';
  const userImage = user.Userimage || defaultImageUrl;

  return `
    <div class="col-lg-12 col-sm-6 col-12">
      <div class="card">
        <div class="d-flex align-items-center justify-content-center">
          <img src="${userImage}" alt="${user.FirstName}'s image" class="img-fluid rounded-circle" style="width:150px;height:150px;background-size:cover">
          <div class="user-name mt-4 flex-grow-1 ms-4">
            <h6>${user.FirstName}</h6>
            <p>${user.Email}</p>
            <span class="mt-3" style="font-size:13px;">
              ${review}
            </span>
          </div>
          <div class="reviews col-lg-4 col-sm-4 col-12">
            <span>
              ${generateStars(rating)}
            </span>
            <br>
            <span class="rating-number" style="font-size:14px;">
              ${rating} / 5
            </span>
          </div>
          <a class="me-3 delete-btn" style="cursor: pointer;" data-partitionkey="${reviewData.PartitionKey}" data-rowkey="${reviewData.RowKey}" data-type="${reviewData.type}">
            <img src="assets/img/icons/delete.svg" alt="Delete"/>
          </a>
        </div>
      </div>
    </div>`;
}


// Function to delete a review
async function deleteReview(partitionKey, rowKey,reviewType) {
  console.log(`Attempting to delete review with PartitionKey: ${partitionKey} and RowKey: ${rowKey}`);
  const apiEndpoint = reviewType === 'restaurant' 
    ? 'https://tiptabapi.azurewebsites.net/api/restaurantRating' 
    : 'https://tiptabapi.azurewebsites.net/api/ItemRatingFunction';
  try {
    const data = {
      PartitionKey: partitionKey,
      RowKey: rowKey
  };
  const response = await fetch(apiEndpoint, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${response.statusText}. Server message: ${errorText}`);
    }

    console.log(`Review with PartitionKey ${partitionKey} and RowKey ${rowKey} deleted successfully.`);
    
    // Refresh the data after deletion
    try {
      await fetchAllData();
    } catch (fetchError) {
      console.error('Error fetching data after deletion:', fetchError);
    }

  } catch (error) {
    console.error('Error deleting review:', error);
  }
}

// Function to render reviews
function Reviews(userData, restaurantData, itemData) {
  let html = "";
  const reviewCounts = {};

  userData.forEach(user => {
    reviewCounts[user.UserID] = 0;

    const userRestaurantReviews = restaurantData.filter(resData => resData.UserID === user.UserID);
    reviewCounts[user.UserID] += userRestaurantReviews.length;
    userRestaurantReviews.forEach(resData => {
      html += createReviewCard(user, resData.Review, resData.Rating, {
        PartitionKey: resData.PartitionKey,
        RowKey: resData.RowKey,
        type: 'restaurant'
      });
    });

    const userItemReviews = itemData.filter(item => item.UserID === user.UserID);
    reviewCounts[user.UserID] += userItemReviews.length;
    userItemReviews.forEach(itemReview => {
      html += createReviewCard(user, itemReview.Review, itemReview.Rating, {
        PartitionKey: itemReview.PartitionKey,
        RowKey: itemReview.RowKey,
        type: 'item'
      });
    });
  });

  const reviewsContainer = document.querySelector('#Reviews_Customer');
  if (reviewsContainer) {
    reviewsContainer.innerHTML = html;
  } else {
    console.error('Element with ID "Reviews_Customer" not found.');
  }

  const totalReviews = Object.values(reviewCounts).reduce((acc, count) => acc + count, 0);
  const totalReviewsElement = document.querySelector('#totalReviews');
  if (totalReviewsElement) {
    totalReviewsElement.textContent = ` (${totalReviews})`;
  } else {
    console.error('Element with ID "#totalReviews" not found.');
  }

  console.log(`Total Reviews: ${totalReviews}`);
}


// Event listener for delete buttons
document.addEventListener('click', async function(event) {
  if (event.target && event.target.matches('img[alt="Delete"]')) {
    const button = event.target.closest('.delete-btn');
    if (button) {
      const partitionKey = button.getAttribute('data-partitionkey');
      const rowKey = button.getAttribute('data-rowkey');
      const reviewType = button.getAttribute('data-type');

      // Ensure valid reviewType and call deleteReview with appropriate API logic
      if (reviewType === 'restaurant' || reviewType === 'item') {
        console.log(`Deleting ${reviewType} review with PartitionKey: ${partitionKey} and RowKey: ${rowKey}`);
        await deleteReview(partitionKey, rowKey,reviewType);
      } else {
        console.log('Invalid review type. Cannot delete review.');
      }
    }
  }
});



// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  AdminRestaurantID = JSON.parse(localStorage.getItem("objUser")).RestaurantID;
  console.log(AdminRestaurantID);
  await fetchAllData();
});
