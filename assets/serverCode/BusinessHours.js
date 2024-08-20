document.addEventListener('DOMContentLoaded', function () {
    let objUser = JSON.parse(localStorage.getItem('objUser'));
    let AdminRestaurantID = objUser?.RestaurantID;

    if (!objUser || !objUser.RestaurantID) {
        console.error('User data not found or invalid.');
        return;
    }

    let FinalDate;

    $(function() {
        $('input[name="daterange"]').daterangepicker({
            opens: 'left',
            timePicker: true,
            timePicker24Hour: false, 
            timePickerIncrement: 1,
            locale: {
                format: 'hh:mm A' 
            }
        }, function(start, end, label) {
            FinalDate = start.format('hh:mm A') + '-' + end.format('hh:mm A');
            console.log("FinalDate", FinalDate);
        }).on('show.daterangepicker', function (ev, picker) {
            picker.container.find(".calendar-table").hide();
        });
    });

    async function fetchBusinessData() {
        try {
            const response = await fetch(`https://tiptabapi.azurewebsites.net/api/RestaurantsFunction?filter=RestaurantID eq '${AdminRestaurantID}'`);
            if (!response.ok) {
                throw new Error("Network Error");
            }
            const data = await response.json();
            return data.records[0]; 
        } catch (error) {
            console.error('Error fetching business data:', error);
        }
    }

    async function updateBusinessHours(FinalDate, restData) {
        if (!FinalDate || !restData) {
            console.error('FinalDate or restData is missing');
            return;
        }

        console.log("FinalDate:", FinalDate);
        console.log("Data:", restData);

        const payload = {
            PartitionKey: restData.PartitionKey,
            RowKey: restData.RowKey,
            RestaurantID: restData.RestaurantID,
            RestaurantTitle: restData.RestaurantTitle,
            RestaurantAddress: restData.RestaurantAddress,
            City: restData.City,
            State: restData.State,
            ZipCode: restData.ZipCode,
            RestaurantPhone: restData.RestaurantPhone,
            RestaurantCategory: restData.RestaurantCategory,
            OpeningHours: FinalDate,
            IsPromoted: restData.IsPromoted,
            RestaurantImage: restData.RestaurantImage,
            Longitude: restData.Longitude,
            Latitude: restData.Latitude,
            LandMark: restData.LandMark,
            Description: restData.Description,
            Disable: restData.Disable
        };

        console.log("Payload:", payload);

        try {
            const response = await fetch(`https://tiptabapi.azurewebsites.net/api/RestaurantsFunction?filter=RestaurantID eq '${AdminRestaurantID}'`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to update data');
            }

            const result = await response.json();
            swal.fire({
                title: "Done",
                text: "Successfully updated Business Hours",
                icon: "success"
            });
        } catch (error) {
            console.error('Error updating data:', error);
        }
    }

   
    const updateButton = document.getElementById('updatebtn');
    if (updateButton) {
        updateButton.addEventListener('click', function() {
            fetchBusinessData().then(restData => {
                updateBusinessHours(FinalDate, restData);
            }).catch(error => {
                console.error('Error fetching business data:', error);
            });
        });
    } else {
        console.error('Update button not found in the DOM');
    }
});
