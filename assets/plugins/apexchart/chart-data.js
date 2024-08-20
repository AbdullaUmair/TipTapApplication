$(function () {
    if ($('#sales_charts').length > 0) {
        var options = {
            series: [
                {
                    name: "Average Ratings",
                    type: "column",
                    data: [] 
                }
            ],
            colors: ['#FF9F43','#bf7a37'],
            chart: {
                type: 'bar',
                height: 300,
                stacked: true,
                zoom: {
                    enabled: true
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '10%',
                    endingShape: 'rounded'
                }
            },
            xaxis: {
                categories: [] 
            },
            legend: {
                position: 'right',
                offsetY: 20
            },
            fill: {
                opacity: 1
            },
            title: {
                text: 'Average Ratings by Month ',
                align: 'center'
            },
            xaxis: {
                title: {
                    text: ''
                }
            },
            yaxis: {
                title: {
                    text: 'Average Rating'
                }
            }
        };

        var chart = new ApexCharts(document.querySelector("#sales_charts"), options);
        chart.render();

        function fetchDataAndUpdateChart(year) {
            const AdminRestaurantID = JSON.parse(localStorage.getItem("objUser")).RestaurantID;

            Promise.all([
                fetch(`https://tiptabapi.azurewebsites.net/api/restaurantRating?filter=RestaurantID eq '${AdminRestaurantID}' and RatingDate ge '${year}-01-01T00:00:00Z' and RatingDate lt '${(parseInt(year) + 1)}-01-01T00:00:00Z'`)
                    .then(response => response.json())
                    .then(datas => datas.records),
                fetch(`https://tiptabapi.azurewebsites.net/api/ItemRatingFunction?filter=RestaurantID eq '${AdminRestaurantID}' and RatingDate ge '${year}-01-01T00:00:00Z' and RatingDate lt '${(parseInt(year) + 1)}-01-01T00:00:00Z'`)
                    .then(response => response.json())
                    .then(datas => datas.records)
            ])
            .then(([restaurantRatings, itemRatings]) => {
                let allRatings = [...restaurantRatings, ...itemRatings];

                if (!Array.isArray(allRatings)) {
                    console.error('Unexpected data format:', allRatings);
                    return;
                }

                console.log("API response data:", allRatings);

              
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                let ratingsMap = {};
                let totalReviews = 0;
                let totalRatings = 0;

                allRatings.forEach(item => {
                    let date = new Date(item.RatingDate);
                    if (isNaN(date.getTime())) {
                        console.error('Invalid date:', item.RatingDate);
                        return;
                    }

                    let month = date.getMonth(); 
                    let year = date.getFullYear();
                    let monthYear = `${monthNames[month]}-${year}`;

                    if (!ratingsMap[monthYear]) {
                        ratingsMap[monthYear] = { totalRating: 0, count: 0 };
                    }

                    let rating = parseFloat(item.Rating);
                    if (!isNaN(rating)) {
                        ratingsMap[monthYear].totalRating += rating;
                        ratingsMap[monthYear].count += 1;
                        totalRatings += rating;
                        totalReviews += 1;
                    } else {
                        console.error('Invalid rating:', item.Rating);
                    }
                });

                let newCategories = [];
                let newRatings = [];

                for (let [key, value] of Object.entries(ratingsMap)) {
                    newCategories.push(key);
                    let averageRating = (value.totalRating / value.count).toFixed(2);
                    newRatings.push(averageRating);
                }

                console.log("Categories:", newCategories);
                console.log("Average Ratings:", newRatings);

                chart.updateOptions({
                    xaxis: {
                        categories: newCategories 
                    }
                });

                chart.updateSeries([
                    {
                        name: 'Average Ratings',
                        data: newRatings
                    }
                ]);

                console.log("Chart updated with average ratings.");

            
                let averageRatingOutOf5 = (totalRatings / totalReviews).toFixed(2);

                document.getElementById('total-reviews').textContent = `Reviews: ${totalReviews}`;
                document.getElementById('total-ratings').textContent = `Average Rating: ${averageRatingOutOf5} out of 5`;
            })
            .catch(error => {
                console.error('Error fetching data from API:', error);
            });
        }

   
        let selectedYear = '2024';
        fetchDataAndUpdateChart(selectedYear);

     
        document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(item => {
            item.addEventListener('click', function(event) {
                event.preventDefault();
                selectedYear = this.textContent.trim(); 
                document.getElementById('dropdownMenuButton').innerHTML = `${selectedYear} <img src="assets/img/icons/dropdown.svg" alt="img" class="ms-2" />`;
                fetchDataAndUpdateChart(selectedYear);
            });
        });

        setInterval(() => fetchDataAndUpdateChart(selectedYear), 60000); 
    }
});
