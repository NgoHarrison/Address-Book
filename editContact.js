const { ipcRenderer } = require('electron')

let $ = require('jquery')
let fs = require('fs')
var contacts = [];
let modal;
let vCard = require('vcf');
let year="";
let month="";

$('#cancelbtn').on('click', () => {
    ipcRenderer.send('asynchronous-message', 'closeModal')
  })


function edit(){
let filename = "contacts.txt";
  if(fs.existsSync(filename)) {
    let data = fs.readFileSync(filename, 'utf8').split('\n')
    data.forEach((contact, index) => {

      let [ name, number, address, company, cell, birth,email,url] = contact.split(',')
      if (name && number && address&& company&& cell && birth && email && url){
          
      }
   })

  }
}

function showEditContactModal(){
    ipcRenderer.send('asynchronous-message', 'editModal')
}

function loadPlaceHolders(){
    
    var contact = contacts[0];
    $('#contactname').text(contact.name);
    $('#contactnumber').text(contact.number);
    $('#contactaddress').text(contact.address);
    $('#contactcompany').text(contact.company);
    $('#contactcell').text(contact.cell);
    $('#contactbirth').text(contact.birth);
    $('#contactemail').text(contact.email);
    $('#contacturl').text(contact.url);
}