document.addEventListener('DOMContentLoaded', function() {
    const applyFilterButton = document.getElementById('search_group').querySelector('button');
    const form = document.getElementById('changelist-form');
    const urlParams = new URLSearchParams(window.location.search);

    applyFilterButton.addEventListener('click', function() {
        const fromDate = document.getElementById('id_from').value;
        const toDate = document.getElementById('id_to').value;

        // If both dates are selected, append them as query parameters
        if (fromDate && toDate) {
            urlParams.set('from_date', fromDate);
            urlParams.set('to_date', toDate);
        }

        window.location.search = urlParams.toString();
    });
});
