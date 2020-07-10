let busCarrierSelector = document.querySelector("#bus-carrier");

async function getLimitsViews() {
  const selectBusCarriers = document.querySelector("#bus-carrier");
  const requestURLLimitsViews = "https://restapi-limits.herokuapp.com/v1/limits/getLimitsViews";

  let data = await fetch(requestURLLimitsViews)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    });

  data.forEach((element) => {
    let optionBusCarrier = document.createElement("option");
    optionBusCarrier.setAttribute("id", element.id);
    optionBusCarrier.append(element.name);
    selectBusCarriers.appendChild(optionBusCarrier);
  });
}

getLimitsViews();

function getLimits() {
  if (busCarrierSelector.options[0]) {
    let selectedBusCarrier = busCarrierSelector.options[busCarrierSelector.selectedIndex].value;
    getLimitsForLimitView(selectedBusCarrier);
  }
}

async function getLimitsForLimitView(limitView) {
  const requestURLGetLimits = "https://restapi-limits.herokuapp.com/v1/limits/getLimits";
  let data = await fetch(requestURLGetLimits)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Something went wrong. Can not get Limits.");
      console.error(error);
    });
    
  const limitsTable = document.querySelector("#limits");
  const thead = limitsTable.createTHead();
  let row = thead.insertRow(-1);
  createLimitsTableHead(row);

  const body = document.createElement("tbody");
  data.forEach((element, i) => {
    let row = body.insertRow(-1);
    createLimitsTableCells(row, element);
  });

  limitsTable.appendChild(body);
}

function createLimitsTableHead(row) {
  let cell = row.insertCell(-1);
  cell.setAttribute("class", "limits__table--head");
  cell.appendChild(document.createTextNode("Id"));

  cell = row.insertCell(-1);
  cell.setAttribute("class", "limits__table--head");
  cell.appendChild(document.createTextNode("Nazwa limitu"));

  cell = row.insertCell(-1);
  cell.setAttribute("class", "limits__table--head");
  cell.appendChild(document.createTextNode("Wartość"));

  cell = row.insertCell(-1);
  cell.setAttribute("class", "limits__table--head");
  cell.appendChild(document.createTextNode("Pojemność"));

  cell = row.insertCell(-1);
  cell.setAttribute("class", "limits__table--head");
  cell.appendChild(document.createTextNode("Odwołany"));
}

function createLimitsTableCells(row, element) {
  let cell = row.insertCell(-1);
  let capacity = element.capacity;
  let canceled = element.canceled;
  let cellClass = "limits__table";
  if (canceled) {
    cellClass = "limits__table--canceled";
  }

  cell.setAttribute("class", cellClass);
  cell.appendChild(document.createTextNode(element.id));

  cell = row.insertCell(-1);
  cell.setAttribute("class", cellClass);
  cell.appendChild(document.createTextNode(element.name));

  cell = row.insertCell(-1);
  cell.setAttribute("class", cellClass);
  cell.appendChild(document.createTextNode(element.value));

  cell = row.insertCell(-1);
  cell.setAttribute("class", cellClass);
  cell.setAttribute("id", `capacity__${element.id}`);
  cell.setAttribute("contenteditable", "true");
  if (capacity == 32767) {
    capacity = "*";
  }
  cell.appendChild(document.createTextNode(capacity));

  cell = row.insertCell(-1);
  cell.setAttribute("class", cellClass);
  cell.appendChild(document.createTextNode(canceled));
}

function saveLimits() {
  let tableDataToValidate = [];
  document.querySelectorAll("td").forEach((cell) => {
    if (cell.id.includes("capacity")) {
      tableDataToValidate.push(cell.innerText);
    }
  });

  if (validateLimits(tableDataToValidate)) {
    let limitsJSON = prepareJSON();
    sendModifiedLimits();
  } else {
    console.error("Validation error");
  }
}

function validateLimits(tableDataToValidate) {
  let validationOK = true;
  tableDataToValidate.forEach((capacity) => {
    if (capacity != "*" && !Number.isInteger(parseInt(capacity))) {
      console.log(capacity);
      validationOK = false;
    } 
  });
  return validationOK;
}

function prepareJSON() {
  // document.querySelectorAll("tr").forEach((row) => {
    

  //   console.log(row.getElementsByTagName('td'));

  //   // if (row.getElementsByTagName('td')) {
  //   //   console.log(`DUPA ::: ${row[0]}`);
  //   // }
  // });
}

function sendModifiedLimits() {}
