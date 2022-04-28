export default function () {
  const select = document.querySelector("select");
  select.addEventListener("change", () => {
    const temperatureLabel = document.querySelector('[for="temperature"]');
    if (select.value === "6" || select.value === "7") {
      temperatureLabel.textContent = "T (K)";
    } else {
      temperatureLabel.textContent = "T (°C)";
    }
  });
}
