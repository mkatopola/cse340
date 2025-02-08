// Showing Password
function showPassword() {
  let x = document.getElementById("input-pass");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}
