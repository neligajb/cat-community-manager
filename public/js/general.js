$(document).ready(function() {

  // adding a cat
  $('#submit-cat').submit(function(event) {
    event.preventDefault();  // prevent default because AJAX
    postCat();
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
  getAllCats();
});

// add a listener on the document for cat-row clicks
$(document).on('click', 'tr.cat-row', getCat);

$(document).on('click', 'tr.new-cat-row', function() {
  alert('Refresh to see updated cat information');
});


function postCat() {
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
    console.log(res);

    if (res == 'could not find address') {
      alert('Unable to geolocate. Please check the address.')
      return;
    }
    if (res == 'cat added') {
      alert('Cat added.')
    }

    // add data to table
    var fixed = (fixed == true) ? 'Yes' : 'No';  // convert bool to string representation;
    var html = '<tr class="new-cat-row" data-id="null">' +
        '<td> - </td>' +
        '<td>' + address + '</td>' +
        '<td>' + fixed + '</td>' +
        '<td>' + description + '</td>' +
        '</tr>';
    $('#cat-table table').append(html);
  })
}


function getCat() {
  var id = $(this).attr('data-id');

  // get from server
  $.get(
      'get-cat',  // get call
      {id: id}    // data
  ).done(function(res) {  // response callback
    var cat_object = res[0];

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


function getAllCats() {
  $.get(
      'get-cat',  // get call
      {all: 'true'}    // data
  ).done(function(res) {  // response callback
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
}
