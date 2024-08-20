// document.addEventListener('DOMContentLoaded', async () => {
//     try {
        
//         const objUser = JSON.parse(localStorage.getItem('objUser'));
//         if (!objUser || !objUser.RestaurantID) {
//             throw new Error("AdminRestaurantID not found in localStorage");
//         }
//         const AdminRestaurantID = objUser.RestaurantID;
//         const categoryTitle = "Appetizers";

   
//         let categoryListData = JSON.parse(localStorage.getItem('categoryListData'));
//         if (!categoryListData) {
//             const categoryUrl = `https://tiptabapi.azurewebsites.net/api/itemCategoryFunction?filter=${encodeURIComponent(`Categorytitle eq '${categoryTitle}'`)}`;
//             const categoryResponse = await fetch(categoryUrl);
//             if (!categoryResponse.ok) {
//                 throw new Error("Failed to fetch category list");
//             }
//             categoryListData = await categoryResponse.json();
//             localStorage.setItem('categoryListData', JSON.stringify(categoryListData));
//         }

     
//         const itemListUrl = `https://tiptabapi.azurewebsites.net/api/ItemListFunction?filter=${encodeURIComponent(`RestaurantID eq '${AdminRestaurantID}'`)}`;
//         const itemListResponse = await fetch(itemListUrl);
//         if (!itemListResponse.ok) {
//             throw new Error("Failed to fetch item list");
//         }
//         const itemListData = await itemListResponse.json();
//         const ItemData = itemListData.records || [];
//         const CategoryData = categoryListData.records || [];


//         let html = "";
//         let itemCount = 0;

//         for (let itemdata of ItemData) {
//             let category = CategoryData.find(category => category.CategoryID === itemdata.CategoryID);
//             const categoryName = category ? category.Categorytitle : 'Unknown';
//             if (category && categoryName === categoryTitle) {
//                 itemCount++;  
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
//                         <td>${categoryName}</td>
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

  
//         const itemListElements = document.querySelector('#appetizerList');
//         if (itemListElements) {
//             itemListElements.innerHTML = html;
//         } else {
//             throw new Error("#appetizerList element not found");
//         }

//         // function generatePDF(data, categoryData) {
//         //     const { jsPDF } = window.jspdf;
//         //     const doc = new jsPDF();

//         //     const filteredData = data.filter(item => {
//         //         console.log(data);
//         //         const category = categoryData.find(cat => cat.CategoryID === item.CategoryID);
//         //         return category && category.Categorytitle === categoryTitle;
//         //     });

//         //     const columns = [
//         //         { header: 'Item Title', dataKey: 'ItemTitle' },
//         //         { header: 'Category Name', dataKey: 'CategoryName' }
//         //     ];

//         //     const rows = filteredData.map(item => ({
//         //         ItemTitle: item.ItemTitle,
//         //         CategoryName: categoryData.find(category => category.CategoryID === item.CategoryID)?.Categorytitle || 'Unknown'
//         //     }));

//         //     doc.autoTable({
//         //         head: [columns.map(col => col.header)],
//         //         body: rows.map(row => [row.ItemTitle, row.CategoryName]),
//         //         theme: 'striped'
//         //     });

//         //     doc.save('appetizers-list.pdf');
//         // }

     
//         // document.getElementById('exportToPDF').addEventListener('click', () => {
//         //     generatePDF(ItemData, CategoryData); 
//         // });

//         // function generateExcel(data, categoryData) {
          
//         //     const filteredData = data.filter(item => {
//         //         const category = categoryData.find(cat => cat.CategoryID === item.CategoryID);
//         //         return category && category.Categorytitle === categoryTitle;
//         //     });
        
          
//         //     const rows = filteredData.map(item => ({
//         //         'Item Title': item.ItemTitle,
//         //         'Category Name': categoryData.find(category => category.CategoryID === item.CategoryID)?.Categorytitle || 'Unknown'
//         //     }));
        
         
//         //     const wb = XLSX.utils.book_new();
//         //     const ws = XLSX.utils.json_to_sheet(rows);
//         //     XLSX.utils.book_append_sheet(wb, ws, 'Appetizers');
        
        
//         //     XLSX.writeFile(wb, 'appetizers-list.xlsx');
//         // }
        

//         // function printData(data, categoryData) {
//         //     const filteredData = data.filter(item => {
//         //         const category = categoryData.find(cat => cat.CategoryID === item.CategoryID);
//         //         return category && category.Categorytitle === categoryTitle;
//         //     });

//         //     let html = `
//         //         <html>
//         //         <head>
//         //             <title>Print Appetizers List</title>
//         //             <style>
//         //                 body { font-family: Arial, sans-serif; }
//         //                 table { width: 100%; border-collapse: collapse; }
//         //                 th, td { border: 1px solid #ddd; padding: 5px; }
//         //                 th { background-color: #f4f4f4; }
//         //                thead{text-align:left;}
//         //             </style>
//         //         </head>
//         //         <body>
//         //             <h1>Appetizers List</h1>
//         //             <table>
//         //                 <thead>
//         //                     <tr>
//         //                         <th>Item Title</th>
//         //                         <th>Category Name</th>
//         //                     </tr>
//         //                 </thead>
//         //                 <tbody>`;

//         //     filteredData.forEach(item => {
//         //         const categoryName = categoryData.find(category => category.CategoryID === item.CategoryID)?.Categorytitle || 'Unknown';
//         //         html += `
//         //             <tr>
//         //                 <td>${item.ItemTitle}</td>
//         //                 <td>${categoryName}</td>
//         //             </tr>`;
//         //     });

//         //     html += `
//         //                 </tbody>
//         //             </table>
//         //         </body>
//         //         </html>`;

//         //     const printWindow = window.open('', '', 'height=600,width=800');
//         //     printWindow.document.open();
//         //     printWindow.document.write(html);
//         //     printWindow.document.close();

//         //     printWindow.onload = () => {
//         //         printWindow.print();
//         //     };
//         // }


  
//         // document.getElementById('exportToExcel').addEventListener('click', () => {
//         //     generateExcel(ItemData, CategoryData); 
//         // });
//         // document.getElementById('printButton').addEventListener('click', () => {
//         //     printData(ItemData, CategoryData);
//         // });
     
//         // document.getElementById('exportToPDF').addEventListener('click', () => {
//         //     generatePDF(ItemData, CategoryData); 
//         // });







//     } catch (error) {
//         console.error('Error:', error.message);
//     }
// });
