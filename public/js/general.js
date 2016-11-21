
$(document).ready(function() {

  // adding a cat
  $('#submit-cat').submit(function(event) {
    event.preventDefault();  // prevent page reload form submit -- we're doing it with AJAX instead

    // collect form data
    var address = $('#address').val();
    var fixed = $('#fixed').is(':checked');
    var image = $('#image').val();
    var description = $('#description').val();

    // create cat object
    var cat_object = {
      cat: {
        address: address,
        fixed: fixed,
        image: image,
        description: description
      }
    };

    // post to server
    $.post(
        'add-cat',  // post destination
        cat_object  // data
    ).done(function(res) {  // response callback
      console.log('Add cat response: ' + res);
    })
  });


  // getting a cat
  $('tr.cat-row').click(function() {
    var id = $(this).attr('data-id');

    // get from server
    $.get(
        'get-cat',  // get call
        {id: id}    // data
    ).done(function(res) {  // response callback
      console.log(JSON.stringify(res)); // logging data as string to console to allow you to see what it looks like.
      var cat_object = res;
      console.log('Get cat response: ' + cat_object.id);

      // append single cat data to existing html
      var fixed = cat_object.fixed ? 'Yes' : 'No';  // convert bool to string representation
      $('#details-id').append('<span>' + cat_object.id + '</span>');
      $('#details-location').append('<span>' + cat_object.location + '</span>');
      $('#details-fixed').append('<span>' + fixed + '</span>');
      $('#details-description > p').append('<span>' + cat_object.description + '</span>');
      $('#details-image').append('<span>' + cat_object.image + '</span>');

      // fade out the cats table div
      $('#cat-table').fadeOut(function() {
        // fade in the single cat div
        $('#single-cat').fadeIn();
      });
    });
  });


  // switch the view from Single Cat to Cat Table
  $('#single-cat').find('button').click(function() {
    // fade out the single cat div
    $('#single-cat').fadeOut(function() {
      // remove all the single cat data
      $(this).find('span').remove();
      // fade in the cats table
      $('#cat-table').fadeIn();
    })
  });

});
