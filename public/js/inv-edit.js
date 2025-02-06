const form = document.querySelector("#edit-inventory");
form.addEventListener("change", function () {
  const editBtn = document.querySelector(".submit-btn");
  editBtn.removeAttribute("disabled");
});

