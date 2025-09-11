fetch('http://127.0.0.1:5000/api/disasters')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        // Handle your data here
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });