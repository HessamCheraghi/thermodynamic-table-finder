export default function () {
  const checkbox = document.querySelector("#show-calculations");
  const calculationElement = document.querySelector(".tile.is-9.is-parent");
  checkbox.addEventListener("input", () => {
    if (checkbox.checked) {
      calculationElement.style.display = "block";
    } else {
      calculationElement.removeAttribute("style");
    }
  });
}
