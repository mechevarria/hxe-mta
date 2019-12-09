
$(document).ready(() => {
    $('#check').click(() => {

        $.getJSON('api/index', data => {
            var json = JSON.stringify(data, null, 4);

            var previous = $('#output').val();

            if (previous.length > 0) {
                json = previous + '\n' + json;
            }

            $('#output').html(json);
        });

    });

    $('#clear').click(() => {
        $('#output').html('');
    });
});