const currency = document.getElementById("currency");
const result = document.getElementById("finalMonedas");
const button = document.getElementById("mybutton");
let myChart = "";

async function getMoneyValue(currency, money) {
  try {
    const res = await fetch("https://mindicador.cl/api/" + currency);
    const currencyValue = await res.json();
    renderChart(currencyValue);
    console.log(currencyValue.serie[0].valor);
    console.log(currencyValue.serie[0].valor * Number(money));
    result.innerHTML = currencyValue.serie[0].valor * Number(money);
  } catch (e) {
    alert(e.message);
  }
}
button.addEventListener("click", () => {
  const money = document.getElementById("money").value;
  if (money != 0) {
    const selectedCurrency = currency.options[currency.selectedIndex].value;
    if (selectedCurrency != "Seleccione...") {
      getMoneyValue(selectedCurrency, money);
    } else {
      alert("Please select a valid currency");
    }
  } else {
    alert("Please insert a valid amount");
  }
});

async function getCurrencies() {
  try {
    let options = "";
    const res = await fetch("https://mindicador.cl/api/");
    const currencies = await res.json();
    delete currencies.autor;
    delete currencies.version;
    delete currencies.fecha;
    console.log(currencies);
    options += `<option>Seleccione...</option>`;
    for (let objectCurrency in currencies) {
      console.log(objectCurrency);
      options += `<option>${objectCurrency}</option>`;
    }
    currency.innerHTML = options;
  } catch (e) {
    alert(e.message);
  }
}
getCurrencies();

async function chartData(currency) {
  // let labels = currency.nombre
  console.log(currency.serie);
  let data = [];
  let date = [];
  let arreglo = currency.serie.slice(0, 10).reverse();
  arreglo.forEach((element) => {
    data.push(element.valor);
    date.push(element.fecha.substring(0, 10));
  });

  console.log(JSON.stringify(date));
  const datasets = [
    {
      label: currency.nombre,
      backgroundColor:"rgb(39, 0, 130)",
      borderColor: "rgb(255, 99, 132)",
      backdropColor :"rgb(122, 11, 192)",
      labels: date,
      data,
    },
  ];
  return { labels: date, datasets };
}

async function renderChart(arr) {
  console.log(arr);
  const data = await chartData(arr);
  console.log(data);
  const config = {
    type: "line",
    data,
  };
  console.log(config);
  myChart = document.getElementById("chart");
  let chart = Chart.getChart(myChart);
  if (chart != undefined) {
    chart.destroy();
  }
  myChart.style.backgroundColor = "white";
  new Chart(myChart, config);
}
