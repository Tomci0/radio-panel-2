$.ajax({
    url: '/api/getAdminData',
    type: 'GET',
    success: (data) => {
        if (data.error) {
            
        } else {
            $('#page-content #newest-user .value').text(data['newestUser']);
            $('#page-content #registered-users .value').text(data['allUsers']);
            $('#page-content #in-queue .value').text(data['allQueue']); 
            $('#page-content #to-verification .value').text(data['allVerifications']);
        }
    },
    error: (err) => {
        console.error(err);
    }
})
