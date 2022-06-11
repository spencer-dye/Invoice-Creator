// Changes styling to spotlight active page in nav
const activePage = window.location.pathname;
const navLinks = document.querySelectorAll('nav a').forEach(link => {
  if(link.href.includes(`${activePage}`)){
    link.classList.add('link-active');
  }
})

//DOM elements
const invoiceForm = document.querySelector('[name="info"]')
const invoiceInputs = invoiceForm.querySelectorAll('.invoice-input')
const invoiceItemWrap = document.getElementById('invoice-item-wrap')
// const invoiceItem = invoiceItemWrap.querySelectorAll('.invoice-item')
const invoiceTitle = document.getElementById('invoice-title')
const invoiceRecipient = document.getElementById('invoice-recipient-name')
const invoiceRecipientEmail = document.getElementById('invoice-recipient-email')
const invoiceDueDate = document.getElementById('invoice-due-date')
const addInvoiceItem = document.getElementById('invoice-add-item')
const addInvoiceItemPrice = document.getElementById('invoice-add-item-price')
const displayInvoiceTitle = document.getElementById('invoice-title-el')
const displayInvoiceRecipient = document.getElementById('invoice-recipient-el')
const displayInvoiceEmail = document.getElementById('invoice-email-el')
const displayInvoiceItemCount = document.getElementById('invoice-item-count-el')
const displayInvoiceDueDate = document.getElementById('invoice-due-date-el')
const displayTotal = document.getElementById('total-el')
const displaySubtotal = document.getElementById('subtotal-el')
const displayTaxTotal = document.getElementById('tax-el')
const todaysDate = document.getElementById('current-invoice-date')
const greetingEl = document.getElementById('greeting')
const recentInvoices = document.getElementById('recent-invoice-wrap')

//Data initilization
let itemsArr = []
let currentInvoice = []
let sentInvoices = []
let subtotal = 0
let taxRate = .08
let taxTotal = 0
let total = 0

//Renders information based on input
function displayInfo() {
  displayInvoiceTitle.textContent = invoiceTitle.value
  displayInvoiceRecipient.textContent = invoiceRecipient.value
  displayInvoiceEmail.textContent = invoiceRecipientEmail.value
  displayInvoiceDueDate.textContent = convertDate(invoiceDueDate.value)
}

//Converts date from yyyy-mm-dd to mm-dd-yyyy
function convertDate(val) {
  if (val) {
    let removed = val.substr(0, 4)
    val = val.slice(5, 10)
    val = val.replace('-', '/')
    val = val + '/' + removed
    return val
  }
}

//Renders the totals
function renderInfo() {
  displayInvoiceItemCount.textContent = itemsArr.length
  displaySubtotal.textContent = `$${subtotal}`
  displayTaxTotal.textContent = `$${aRound(taxTotal)}`
  displayTotal.textContent = `$${aRound(total)}`
}

//Adds input values to array and renders out the data
function newFunc() {
  let itemName = addInvoiceItem.value
  let itemPrice = addInvoiceItemPrice.value
  let itemId = uniqueID()
  invoiceItemWrap.innerHTML = ''
  if (itemName && itemPrice) {
    if (itemsArr.length < 14) {
      itemsArr.push([itemName, itemPrice, itemId])
      for (let i = 0; i < itemsArr.length; i++) {
        invoiceItemWrap.innerHTML += `
        <div class="invoice-item" id="item">
        <div class="invoice-item-left-side">
        <img src="images/delete-icon.svg" class="delete-icon" onclick='deleteItem(${itemsArr[i][2]})'>
        <p class="invoice-item-no">Item ${itemsArr.indexOf(itemsArr[i]) + 1}</p>
        <p class="invoice-item-name" contenteditable="true" onblur="modifyName(${itemsArr[i][2] + 1})" id="${itemsArr[i][2] + 1}">${itemsArr[i][0]}</p>
        </div>
        <p class="invoice-item-amount" contenteditable="true" onblur="modifyData(${itemsArr[i][2]})" id='${itemsArr[i][2]}'>$${itemsArr[i][1]}</p>
        </div>`
      }
      calcTotals()
      renderInfo()
      clearInput()
    } else if (itemsArr.length >= 14) {
      window.alert('Maximum amount of items reached.')
      afterChange()
      clearInput()
    }
  } else {
    window.alert('Please enter a name and price.')
    afterChange()
  }
} 

//Renders data after change
function afterChange() {
  invoiceItemWrap.innerHTML = ''
  calcTotals()
  renderInfo()
  if (itemsArr.length >= 1) {
    for (let i = 0; i < itemsArr.length; i++) {
      invoiceItemWrap.innerHTML += `
      <div class="invoice-item" id="item">
        <div class="invoice-item-left-side">
          <img src="images/delete-icon.svg" class="delete-icon" onclick='deleteItem(${itemsArr[i][2]})'>
          <p class="invoice-item-no">Item ${itemsArr.indexOf(itemsArr[i]) + 1}</p>
          <p class="invoice-item-name" contenteditable="true" onblur="modifyName(${itemsArr[i][2] + 1})" id="${itemsArr[i][2] + 1}">${itemsArr[i][0]}</p>
        </div>
        <p class="invoice-item-amount" contenteditable="true" onblur="modifyData(${itemsArr[i][2]})" id="${itemsArr[i][2]}">$${itemsArr[i][1]}</p>
      </div>`
    }
  }
}

//Deletes item from Array and DOM
function deleteItem(id) {
  for (let i = 0; i < itemsArr.length; i++) {
    if (id === itemsArr[i][2]) {
      itemsArr.splice(i, 1)
    }
  }
  afterChange()
}

//Clears the inputs after submit
function clearInput() {
  addInvoiceItem.value = ''
  addInvoiceItemPrice.value = ''
  addInvoiceItem.focus()
}

//Wipes the work area
function wipeAreas() {
  invoiceTitle.value = ''
  invoiceRecipient.value = ''
  invoiceRecipientEmail.value = ''
  invoiceDueDate.value = ''
  itemsArr = []
  afterChange()
  displayInfo()
}

//Calculates the totals
function calcTotals() {
  subtotal = 0
  for (let i = 0; i < itemsArr.length; i++) {
    subtotal += parseFloat (itemsArr[i][1])
  }
  taxTotal = taxRate * subtotal
  total = taxTotal + subtotal
}

//Rounds to hundreths place
function aRound(num) {
  return Math.ceil(num * 100) / 100
}

//Updates data when user changes existing data in DOM
function modifyData(id) {
  const itemPrice = document.getElementById(id)
  for (let i = 0; i < itemsArr.length; i++) {
    if (id === itemsArr[i][2]) {
      let tempName = itemsArr[i][0]
      let tempPrice = itemPrice.textContent
      tempPrice = tempPrice.replaceAll('$','')
      let tempArr = [tempName, tempPrice, id]
      itemsArr.splice(i,1,tempArr)
    }
  }
  afterChange()
}

//Limits the length of the price and name the user can modify
invoiceItemWrap.addEventListener('keyup', function(e) {
  console.log(e.target.textContent)
  if (e.target.classList.contains('invoice-item-name')) {
    console.log('name element')
    if (e.target.textContent.length > 39) {
      window.alert('Maximum amount of characters reached (40)')
      e.target.textContent = e.target.textContent.slice(0, 39)
    }
  } else if (e.target.textContent.length > 8) {
    window.alert('Maximum amount of characters reached (8)')
    e.target.textContent = e.target.textContent.slice(0, 7)
  }
})

//Updates data when user changes existing data in the DOM
function modifyName(id) {
  const itemName = document.getElementById(id)
  for (let i = 0; i < itemsArr.length; i++) {
    if (id === itemsArr[i][2] + 1) {
      let tempName = itemName.textContent
      let tempPrice = itemsArr[i][1]
      let tempArr = [tempName, tempPrice, id]
      itemsArr.splice(i,1,tempArr)
    }
  }
    afterChange()
  }
  
  //Limits the length of the price input
  function checkLength() {
    if (addInvoiceItemPrice.value.length > 8) {
      window.alert('Maximum amount of characters reached (8)')
      addInvoiceItemPrice.value = addInvoiceItemPrice.value.slice(0, -1)
    }
  }
  
  //Checks that required field are filled before sending invoice
function checkComplete() {
  if (itemsArr.length >= 1 && invoiceTitle.value.length >= 1 && invoiceDueDate.value.length >= 1 && invoiceRecipient.value.length >= 1 && invoiceRecipientEmail.value.length >= 1) {
    return true
  } else {
    window.alert('Please fill out all the field and add at least 1 item before sending invoice.')
    return false
  }
}

//Adds curent invoice to recent invoices and clears user inputs
function sendInvoice() {
  window.alert('Are you sure you want to send this invoice? All inputs and work will be cleared.')
  if (sentInvoices.length === 3) {
    sentInvoices.pop()
  }
  if (checkComplete()) {
    currentInvoice = [invoiceTitle.value, convertDate(invoiceDueDate.value), invoiceRecipient.value, aRound(total)]
    sentInvoices.unshift(currentInvoice)
    recentInvoices.innerHTML = ''
    for (let i = 0; i < sentInvoices.length; i++) {
      recentInvoices.innerHTML += `
      <div class="recent-invoice-item">
        <div class="recent-item__half">
          <p class="recent-invoice-title">${sentInvoices[i][0]}</p>
          <p class="invoice-item-no">${sentInvoices[i][1]}</p>
        </div>
        <img src="images/expand details arrow.svg" class="view-more-absolute">
        <div class="recent-item__half is--center-align is--no-margin">
          <p class="recent-invoice-title prpl-txt">$${sentInvoices[i][3]}</p>
          <p class="invoice-item-no">${sentInvoices[i][2]}</p>
        </div>
      </div>`
    }
    currentInvoice = []
    wipeAreas()
  }
}
  
  //Generates a unique ID
  function uniqueID() {
    return Math.floor(Math.random() * Date.now())
  }
  
  //Determines what greeting message to display depending on time of day
  function greeting() {
    let today = new Date()
    let timeOfDay = today.getHours()
    if (timeOfDay < 12) {
      return 'Good morning,'
    } else if (timeOfDay < 18) {
      return 'Good afternoon,'
    } else return 'Good evening,'
  }

//Event listeners
invoiceForm.addEventListener('input', displayInfo)
document.getElementById('invoice-btn').addEventListener('click', function() {
  sendInvoice()
})

//Allows user to press "enter" to add item
addInvoiceItemPrice.addEventListener("keypress", function() {
  if (event.key === "Enter") {
    newFunc()
    //add a function that returns focus to add item input
  }
})

//Renders info on page load
function oneTimeRender() {
  todaysDate.textContent = new Date().toLocaleDateString()
  displayInvoiceItemCount.textContent = 0
  greetingEl.textContent = greeting()
}

oneTimeRender()