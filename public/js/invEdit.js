const form = document.querySelector("#edit-inventory");
form.addEventListener("change", function () {
  const editBtn = document.querySelector(".login-btn");
  editBtn.removeAttribute("disabled");
});
