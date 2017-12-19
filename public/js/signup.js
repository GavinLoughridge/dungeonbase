$(document).ready(function() {
    $('select').material_select();
});

$('#hero').click(function() {
  $('#heroFields').toggleClass('notApplicable')
})

$('#submit').click(function() {
  checkFilled(email);
  checkFilled(password);


})
