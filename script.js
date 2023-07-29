var selectedRow = null;
const api_url =
  "https://crudcrud.com/api/cd32587db87b415f9113e01aea23a165/candyData";

function readFormData() {
  var formData = {};
  formData["candyName"] = document.getElementById("candyName").value;
  formData["description"] = document.getElementById("description").value;
  formData["price"] = document.getElementById("price").value;
  formData["quantity"] = document.getElementById("quantity").value;
  return formData;
}

function onFormSubmit() {
  var formData = readFormData();
  if (selectedRow === null) {
    // Create new record
    axios
      .post(api_url, formData)
      .then((response) => {
        insertNewRecord(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    // Update existing record
    const id = selectedRow.cells[4].querySelector("a[data-id]").dataset.id;
    updateRecord(id, formData);
  }
  resetForm();
}

function insertNewRecord(data) {
  var table = document
    .getElementById("candyList")
    .getElementsByTagName("tbody")[0];
  var newRow = table.insertRow(table.length);
  newRow.setAttribute("data-id", data._id); // Add unique identifier as a data attribute
  cell1 = newRow.insertCell(0);
  cell1.innerHTML = data.candyName;
  cell2 = newRow.insertCell(1);
  cell2.innerHTML = data.description;
  cell3 = newRow.insertCell(2);
  cell3.innerHTML = data.price;
  cell4 = newRow.insertCell(3);
  cell4.innerHTML = data.quantity;
  cell5 = newRow.insertCell(4);
  cell5.innerHTML = `<a data-id="${data._id}" onClick="onEdit(this)">Edit</a> 
                      <a data-id="${data._id}" onClick="onDelete(this)">Delete</a>`;
  cell6 = newRow.insertCell(5);
  cell6.innerHTML = `<a data-id="${data._id}" onClick="onBuy(this, 1)">Buy 1</a>`;
  cell7 = newRow.insertCell(6);
  cell7.innerHTML = `<a data-id="${data._id}" onClick="onBuy(this, 2)">Buy 2</a>`;
  cell8 = newRow.insertCell(7);
  cell8.innerHTML = `<a data-id="${data._id}" onClick="onBuy(this, 3)">Buy 3</a>`;
}

function resetForm() {
  document.getElementById("candyName").value = "";
  document.getElementById("description").value = "";
  document.getElementById("price").value = "";
  document.getElementById("quantity").value = "";
  selectedRow = null;
  document.getElementById("submitBtn").value = "Add Item";
  document
    .getElementById("submitBtn")
    .setAttribute("onClick", "onFormSubmit()");
}

axios
  .get(api_url)
  .then((response) => {
    for (var i = 0; i < response.data.length; i++) {
      insertNewRecord(response.data[i]);
    }
  })
  .catch((err) => {
    console.log(err);
  });

function onEdit(td) {
  selectedRow = td.parentElement.parentElement;
  const id = td.dataset.id;
  document.getElementById("candyName").value = selectedRow.cells[0].innerHTML;
  document.getElementById("description").value = selectedRow.cells[1].innerHTML;
  document.getElementById("price").value = selectedRow.cells[2].innerHTML;
  document.getElementById("quantity").value = selectedRow.cells[3].innerHTML;
  document.getElementById("submitBtn").value = "Update Item";
  document
    .getElementById("submitBtn")
    .setAttribute("onClick", `updateRecord("${id}")`);
}

function updateRecord(id, formData) {
  axios
    .put(`${api_url}/${id}`, formData)
    .then((response) => {
      selectedRow.cells[0].innerHTML = formData.candyName;
      selectedRow.cells[1].innerHTML = formData.description;
      selectedRow.cells[2].innerHTML = formData.price;
      selectedRow.cells[3].innerHTML = formData.quantity;
      document.getElementById("submitBtn").value = "Add Item";
      document
        .getElementById("submitBtn")
        .setAttribute("onClick", "onFormSubmit()");
      resetForm();
    })
    .catch((error) => {
      console.log(error);
    });
}

function onDelete(td) {
  var row = td.parentElement.parentElement;
  var id = td.getAttribute("data-id");

  axios
    .delete(`${api_url}/${id}`)
    .then((response) => {
      console.log(response);
      document.getElementById("candyList").deleteRow(row.rowIndex);
      resetForm();
    })
    .catch((error) => {
      console.log(error);
    });
}

function onBuy(td, quantityToBuy) {
  selectedRow = td.parentElement.parentElement;
  const id = td.dataset.id;
  const currentCandyName = selectedRow.cells[0].innerHTML;
  const currentDescription = selectedRow.cells[1].innerHTML;
  const currentPrice = selectedRow.cells[2].innerHTML;
  const currentQuantity = parseInt(selectedRow.cells[3].innerHTML);
  if (currentQuantity > quantityToBuy - 1) {
    const newQuantity = currentQuantity - quantityToBuy;
    const formData = readFormData();
    formData.candyName = currentCandyName;
    formData.description = currentDescription;
    formData.price = currentPrice;
    formData.quantity = newQuantity;
    updateRecord(id, formData);
  } else {
    alert("No more candies left to buy!");
  }
}
