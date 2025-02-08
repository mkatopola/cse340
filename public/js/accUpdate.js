const form = document.querySelector("#updateAccount-form");
form.addEventListener("change", function () {
  const editBtn = document.querySelector(".login-btn");
  editBtn.removeAttribute("disabled");
});