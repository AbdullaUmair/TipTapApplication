// document.addEventListener('DOMContentLoaded', async () => {
//     try {
//         const objUser = JSON.parse(localStorage.getItem('objUser'));
//         if (!objUser || !objUser.RestaurantID) {
//             throw new Error("AdminRestaurantID not found in localStorage");
//         }
//         const AdminRestaurantID = objUser.RestaurantID;

//         const categoryTitle = "Soups";
//         const soupItemListUrl = `https://tiptabapi.azurewebsites.net/api/ItemListFunction?filter=${encodeURIComponent(`RestaurantID eq '${AdminRestaurantID}'`)}`;
//         let soupCategoryListData = JSON.parse(localStorage.getItem('soupCategoryListData'));

//         if (!soupCategoryListData) {
//             const soupCategoryUrl = `https://tiptabapi.azurewebsites.net/api/itemCategoryFunction?filter=${encodeURIComponent(`Categorytitle eq '${categoryTitle}'`)}`;
//             const soupCategoryResponse = await fetch(soupCategoryUrl);
//             if (!soupCategoryResponse.ok) {
//                 throw new Error("Failed to fetch soupCategory list");
//             }
//             soupCategoryListData = await soupCategoryResponse.json();
//             localStorage.setItem('soupCategoryListData', JSON.stringify(soupCategoryListData));
//         }

//         const soupitemListResponse = await fetch(soupItemListUrl);
//         if (!soupitemListResponse.ok) {
//             throw new Error("Failed to fetch item list");
//         }
//         const soupitemListData = await soupitemListResponse.json();
//         const soupItemData = soupitemListData.records || [];
//         const soupCategoryData = soupCategoryListData.records || [];

//         console.log("soupItemData", soupItemData);
//         console.log("soupCategoryData", soupCategoryData);

//         let html = "";
//         let supItemCount = 0;
//         for (let soupitemData of soupItemData) {
//             let soupCategory = soupCategoryData.find(soupCategory => soupCategory.CategoryID === soupitemData.CategoryID);
//             console.log(soupCategory);
//             if (soupCategory) {
//                 supItemCount++;
//                 // Check if soupItemData.itemImage exists before using it
//                 const imageUrl = soupitemData.itemImage ? soupitemData.itemImage : 'placeholder_image_url';

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
//                         <td>${soupitemData.ItemTitle}</td>
//                         <td>${soupitemData.CusineTitle}</td>                 
//                         <td>
//                             <a class="me-3">
//                                 <img src="assets/img/icons/edit.svg" alt="img" onclick="EditItem('${soupitemData.PartitionKey}', '${soupitemData.RowKey}')">
//                             </a>
//                             <a class="me-3 confirm-text">
//                                 <img src="assets/img/icons/delete.svg" onclick="deleteitem('${soupitemData.PartitionKey}', '${soupitemData.RowKey}')" alt="img">
//                             </a>
//                         </td>
//                     </tr>
//                 `;
//             } else {
//                 console.log("soupCategory not found for item:", soupitemData);
//             }
//             /*document.querySelector('#appetizerCounter').innerHTML = `(${itemCount})`;*/

//         }

//         const ItemListElements = document.querySelector('#soupsLists');
//         if (ItemListElements) {
//             ItemListElements.innerHTML = html;
//         } else {
//             throw new Error("#soupsLists element not found");
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }




// });








