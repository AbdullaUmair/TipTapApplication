// document.addEventListener('DOMContentLoaded', async () => {
//     try {

//         const objUser = JSON.parse(localStorage.getItem('objUser'));
//         if (!objUser || !objUser.RestaurantID) {
//             throw new Error("AdminRestaurantID not found in localStorage");
//         }
//         const AdminRestaurantID = objUser.RestaurantID;


//         const itemListResponse = await fetch(`https://tiptabapi.azurewebsites.net/api/ItemListFunction?filter=${encodeURIComponent(`RestaurantID eq '${AdminRestaurantID}'`)}`);
//         if (!itemListResponse.ok) {
//             throw new Error("Failed to fetch item list");
//         }
//         const itemListData = await itemListResponse.json();
//         const ItemData = itemListData.records || [];

//         const categoryTitle = "Beverages";
//         const categoryResponse = await fetch(`https://tiptabapi.azurewebsites.net/api/itemCategoryFunction?filter=${encodeURIComponent(`Categorytitle eq '${categoryTitle}'`)}`);
//         if (!categoryResponse.ok) {
//             throw new Error("Failed to fetch category list");
//         }
//         const categoryListData = await categoryResponse.json();
//         const CategoryData = categoryListData.records || [];

//         let html = "";
//         let beverageCounter = 0;
//         for (let itemdata of ItemData) {
//             const category = CategoryData.find(cat => cat.CategoryID === itemdata.CategoryID);
//             if (category) {
//                 beverageCounter++;
//                 const imageUrl = itemdata.itemImage ? itemdata.itemImage : 'placeholder_image_url';
//                 html += `
//                     <tr>
//                         <td>
//                             <label class="checkboxs">
//                                 <input type="checkbox">
//                                 <span class="checkmarks"></span>
//                             </label>
//                         </td>
//                         <td>
//                             <a class="product-img">
//                                 <img src="${imageUrl}" alt="product">
//                             </a>
//                         </td>
//                         <td>${itemdata.ItemTitle}</td>
                   
//                         <td>${categoryTitle}</td>
//                         <td>
//                             <a class="me-3">
//                                 <img src="assets/img/icons/edit.svg" alt="img" onclick="EditItem('${itemdata.PartitionKey}', '${itemdata.RowKey}')">
//                             </a>
//                             <a class="me-3 confirm-text">
//                                 <img src="assets/img/icons/delete.svg" onclick="deleteitem('${itemdata.PartitionKey}', '${itemdata.RowKey}')" alt="img">
//                             </a>
//                         </td>
//                     </tr>
//                 `;
//             }
//         }
//       /*  document.querySelector('#beverageCount').innerHTML = `(${beverageCounter})`;*/

//         const itemListElement = document.querySelector('#beverageItemList');
//         if (itemListElement) {
//             itemListElement.innerHTML = html;
//         } else {
//             throw new Error("#beverageItemList element not found");
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// });
