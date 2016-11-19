
$(document).ready(function() {
  // adding a cat
  $('#submit-cat').submit(function(event) {
    event.preventDefault();
    var address = $('#address').val();
    var fixed = $('#fixed').is(":checked");
    console.log(fixed);
    var image = $('#image').val();
    var description = $('#description').val();
    var cat_object = {
      cat: {
        address: address,
        fixed: fixed,
        image: image,
        description: description
      }
    };
    $.post(
        'add-cat',
        cat_object
    ).done(function(res) {
      console.log('Add cat response: ' + res);
    })
  });

  // getting a cat
  $('tr.cat-row').click(function() {
    var id = $(this).attr('data-id');
    $.post(
        'get-cat',
        {id: id}
    ).done(function(res) {
      var cat_object = res;
      console.log('Get cat response: ' + cat_object.id);

      var fixed = cat_object.fixed ? 'Yes' : 'No';
      $('#details-id').append('<span>' + cat_object.id + '</span>');
      $('#details-location').append('<span>' + cat_object.location + '</span>');
      $('#details-fixed').append('<span>' + fixed + '</span>');
      $('#details-description > p').append('<span>' + cat_object.description + '</span>');
      $('#details-image').append('<span>' + cat_object.image + '</span>');

      $('#cat-table').fadeOut(function() {
        $('#single-cat').fadeIn();
      });
    });
  });

  $('#single-cat').find('button').click(function() {
    $('#single-cat').fadeOut(function() {
      $(this).find('span').remove();
      $('#cat-table').fadeIn();
    })
  });
});
