document.getElementById('newInvUploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let formData = new FormData(this);

    fetch('/uploaddb/newinv', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('message1').textContent = data;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('newSaleUploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let formData = new FormData(this);

    fetch('/newsale', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('message2').textContent = data;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
document.getElementById('newInvUploadForm').addEventListener('click', function(event) {
    document.getElementById('newInvInput').click();
});
document.getElementById('newSaleUploadForm').addEventListener('click', function(event) {
    document.getElementById('newSaleInput').click();
});

document.getElementById('newInvInput').addEventListener('change', function(event) {
    document.getElementById('newInvSubmit').click();
});
document.getElementById('newSaleInput').addEventListener('change', function(event) {
    document.getElementById('newSaleSubmit').click();
});

