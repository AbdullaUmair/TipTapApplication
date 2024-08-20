document.addEventListener('DOMContentLoaded', async () => {
    try {
        const objUser = JSON.parse(localStorage.getItem('objUser'));
        if (!objUser || !objUser.RestaurantID) {
            throw new Error("AdminRestaurantID not found in localStorage");
        }
        const AdminRestaurantID = objUser.RestaurantID;

        const itemListResponse = await fetch(`https://tiptabapi.azurewebsites.net/api/ItemListFunction?filter=${encodeURIComponent(`RestaurantID eq '${AdminRestaurantID}'`)}`);
        if (!itemListResponse.ok) {
            throw new Error("Failed to fetch item list");
        }
        const itemListData = await itemListResponse.json();
        const ItemData = itemListData.records || [];

        const categories = ["Appetizers", "Soups", "Salads", "Main Courses", "Desserts", "Beverages", "Bread-Bakery"];
        const categoryResponses = await Promise.all(categories.map(category =>
            fetch(`https://tiptabapi.azurewebsites.net/api/itemCategoryFunction?filter=${encodeURIComponent(`Categorytitle eq '${category}'`)}`)
        ));

        const categoryLists = await Promise.all(categoryResponses.map(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch category list for ${response.url}`);
            }
            return response.json();
        }));

        const categoryData = categories.reduce((acc, category, index) => {
            acc[category] = categoryLists[index].records || [];
            return acc;
        }, {});

        function getCurrentCategory() {
            const path = window.location.pathname;
            const fileName = path.split('/').pop().replace('.html', '');


            console.log('File name:', fileName);

            const validCategories = [
                "Appetizers",
                "Soups",
                "Salads",
                "Main Courses",
                "Desserts",
                "Beverages",
                "Bread-Bakery"
            ];

          
            const normalizeName = (name) => {
                return name
                    .replace(/([a-z])([A-Z])/g, '$1 $2') 
                    .replace(/\s+/g, ' ')
                    .trim()
                    .toLowerCase(); 
            };

            const normalizedFileName = normalizeName(fileName);
            console.log('Normalized file name:', normalizedFileName);

            const categoryMapping = validCategories.reduce((map, category) => {
                map[normalizeName(category)] = category;
                return map;
            }, {});

            console.log('Category mapping:', categoryMapping);

            const category = categoryMapping[normalizedFileName];
            console.log('Resolved category:', category);

            return category || 'DefaultCategory'; 
        }
        
        function handleExportAndPrint(action) {
            const currentCategory = getCurrentCategory();

            if (!categories.includes(currentCategory)) {
                console.error('Invalid category:', currentCategory);
                return;
            }

            const filteredData = ItemData.filter(item => {
                const category = categoryData[currentCategory].find(cat => cat.CategoryID === item.CategoryID);
                return category && category.Categorytitle === currentCategory;
            });

            switch(action) {
                case 'pdf':
                    const { jsPDF } = window.jspdf;
                    const pdfDoc = new jsPDF();

                    const columns = [
                        { header: 'Item Title', dataKey: 'ItemTitle' },
                        { header: 'Category Name', dataKey: 'CategoryName' }
                    ];

                    const rows = filteredData.map(item => ({
                        ItemTitle: item.ItemTitle,
                        CategoryName: categoryData[currentCategory].find(category => category.CategoryID === item.CategoryID)?.Categorytitle || 'Unknown'
                    }));

                    pdfDoc.autoTable({
                        head: [columns.map(col => col.header)],
                        body: rows.map(row => [row.ItemTitle, row.CategoryName]),
                        theme: 'striped'
                    });

                    pdfDoc.save(`${currentCategory}.pdf`);
                    break;

                case 'excel':
                    const excelRows = filteredData.map(item => ({
                        'Item Title': item.ItemTitle,
                        'Category Name': categoryData[currentCategory].find(category => category.CategoryID === item.CategoryID)?.Categorytitle || 'Unknown'
                    }));

                    const wb = XLSX.utils.book_new();
                    const ws = XLSX.utils.json_to_sheet(excelRows);
                    XLSX.utils.book_append_sheet(wb, ws, currentCategory);
                    XLSX.writeFile(wb, `${currentCategory}.xlsx`);
                    break;

                case 'print':
                    let printHtml = `
                        <html>
                        <head>
                            <title>Print ${currentCategory} List</title>
                            <style>
                                body { font-family: Arial, sans-serif; }
                                table { width: 100%; border-collapse: collapse; }
                                th, td { border: 1px solid #ddd; padding: 5px; }
                                th { background-color: #f4f4f4; }
                               thead{text-align:left;}
                            </style>
                        </head>
                        <body>
                            <h1>${currentCategory} List</h1>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Item Title</th>
                                        <th>Category Name</th>
                                    </tr>
                                </thead>
                                <tbody>`;

                    filteredData.forEach(item => {
                        const categoryName = categoryData[currentCategory].find(category => category.CategoryID === item.CategoryID)?.Categorytitle || 'Unknown';
                        printHtml += `
                            <tr>
                                <td>${item.ItemTitle}</td>
                                <td>${categoryName}</td>
                            </tr>`;
                    });

                    printHtml += `
                                </tbody>
                            </table>
                        </body>
                        </html>`;

                    const printWindow = window.open('', '', 'height=600,width=800');
                    printWindow.document.open();
                    printWindow.document.write(printHtml);
                    printWindow.document.close();

                    printWindow.onload = () => {
                        printWindow.print();
                    };
                    break;

                default:
                    console.error('Unknown action:', action);
                    break;
            }
        }

        document.querySelector('.exportToPDF').addEventListener('click', () => {
            handleExportAndPrint('pdf');
        });

        document.querySelector('.exportToExcel').addEventListener('click', () => {
            handleExportAndPrint('excel');
        });

        document.querySelector('.printButton').addEventListener('click', () => {
            handleExportAndPrint('print');
        });

    } catch (error) {
        console.error('Error:', error);
    }
});
