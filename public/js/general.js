
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


  // load the list of cats on document ready
  $.get(
      'get-cat',  // get call
      {all: 'true'}    // data
  ).done(function(res) {  // response callback
    //console.log(JSON.stringify(res)); // logging data as string to console to allow you to see what it looks like.
    var cat_objects = res;

    // append cat data to table
    var $cat_table = $('#cat-table').find('table');

    for (var i = 0, len = cat_objects.length; i < len; i++ ) {
      var fixed = (cat_objects[i].fixed == 'true') ? 'Yes' : 'No';  // convert bool to string representation
      var address = cat_objects[i].streetNumber + ' ' + cat_objects[i].streetName + ' ' + cat_objects[i].city;
      var html = '<tr class="cat-row" data-id="' + cat_objects[i].id + '">' +
          '<td>' + cat_objects[i].id + '</td>' +
          '<td>' + address + '</td>' +
          '<td>' + fixed + '</td>' +
          '<td>' + cat_objects[i].description + '</td>' +
          '</tr>';
      $cat_table.append(html);
    }
  });
});


$(document).on('click', 'tr.cat-row', getCat);


function getCat() {
  var id = $(this).attr('data-id');
  console.log(id);

  // get from server
  $.get(
      'get-cat',  // get call
      {id: id}    // data
  ).done(function(res) {  // response callback
    //console.log(JSON.stringify(res)); // logging data as string to console to allow you to see what it looks like.
    var cat_object = res[0];
    //console.log(cat_object);

    // append single cat data to existing html
    var fixed = (cat_object.fixed == 'true') ? 'Yes' : 'No';  // convert bool to string representation
    var address = cat_object.streetNumber + ' ' + cat_object.streetName + ' ' + cat_object.city;
    $('#details-id').append('<span>' + cat_object.id + '</span>');
    $('#details-location').append('<span>' + address + '</span>');
    $('#details-fixed').append('<span>' + fixed + '</span>');
    $('#details-description > p').append('<span>' + cat_object.description + '</span>');
    $('#details-image').append('<span>' + cat_object.photoName + '</span>');

    // fade out the cats table div
    $('#cat-table').fadeOut(function() {
      // fade in the single cat div
      $('#single-cat').fadeIn();
    });
  });
}
