const heroFields = document.getElementById('heroFields');

function toggleFields() {
  heroFields.style.display = (heroFields.style.display === "block" ? "none" : "block");
}

$(document).ready(function() {
    $('select').material_select();
});

function checkInput() {
  // let user = {};
  // // validate basic account information
  // user.email = document.getElementById('email').value;
  // if (document.getElementById('email').value.length === 0) {
  //   alert('An email address is required');
  // }
  // user.password = document.getElementById('password').value;
  // if (document.getElementById('password').value.length === 0) {
  //   alert('A password is required');
  // }
  // if (document.getElementById('password').value !=
  //     document.getElementById('passwordConf').value) {
  //   alert('Password confirmation must match password');
  // }
  //
  // // formate and validate account type information
  // user.questgiver = (document.getElementById('questgiver').value === 'on');
  // user.hero = (document.getElementById('hero').value === 'on');
  // if (!user.questgiver && !user.hero) {
  //   alert('Must choose at least one account type');
  // }
  // if (user.hero) {
  //   user.talent = document.getElementById('talent').value;
  //   if (user.talent.length === 0) {
  //     alert('A talent is required for heros');
  //   }
  //   user.age = parseInt(document.getElementById('age').value);
  //   if (typeof user.age != 'number') {
  //     alert('Age is required for heros');
  //   }
  //   user.price = parseInt(document.getElementById('price').value);
  //   if (typeof user.price != 'number') {
  //     alert('A price is required for heros');
  //   }
  //   user.rating = parseFloat(document.getElementById('rating').value);
  //   if (typeof user.rating != 'number') {
  //     alert('A rating is required for heros');
  //   }
  //   user.level = parseFloat(document.getElementById('level').value);
  //   if (typeof user.rating != 'number') {
  //     alert('A level is required for heros');
  //   }
  // }

  document.getElementById('signupForm').submit();
}
