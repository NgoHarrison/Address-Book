const { ipcRenderer } = require('electron')

let $ = require('jquery')
let fs = require('fs')
var contacts = [];
let modal;
let vCard = require('vcf');
let year="";
let month="";
//Sources used to help project: https://www.w3schools.com/
  $('#yy').change( function(){
     year = $('#yy').val();
    if($('#yy').val()!="defaultYear" && $('#mm').val()!="defaultMonth"){
      document.getElementById("dd").style.display="";
      populateDays();
     
    }

  });
  $('#mm').change(function(){
     month = $('#mm').val();
    if($('#yy').val()!="defaultYear" && $('#mm').val()!="defaultMonth"){
      document.getElementById("dd").style.display="";
      populateDays();
     
    }
});

$('#contactedit').change( function(){
  document.getElementById("editform").style.display="";
  person = $('#contactedit').val();
  var index = person.charAt(person.length-1);
  document.getElementById("contactname").value = contacts[index].name;
  document.getElementById("contactaddress").value = contacts[index].address;
  document.getElementById("contactcell").value = contacts[index].cell;
  document.getElementById("contactcompany").value = contacts[index].company;
  var birth = contacts[index].birth.split("-");
  document.getElementById("yy").value = birth[2];
  document.getElementById("mm").value = birth[0];
  populateDays();
  document.getElementById("contactemail").value = contacts[index].email;
  document.getElementById("contacturl").value = contacts[index].url;
})




$('#cancelbtn').on('click', () => {
  ipcRenderer.send('asynchronous-message', 'closeModal')
})

$('#updatebtn').on('click', () =>{
  let email2 = $('#contactemail').val()
  let regex = /^[a-zA-Z]+((\d)|((\-)(?!\-))|((\_)(?!\_))|((\.)(?!\.)))*@[a-zA-Z]+\.[a-zA-Z]+/
  let result = email2.match(regex)
  let numberCheck = $('#contactcell').val()
  let digitCount=0;
  for(var i =0;i<numberCheck.length;i++){
    if(numberCheck.charAt(i)>='0' && numberCheck<='9'){
      digitCount+=1;
    }
  }
   if(result==null){
     alert("Your email is incorrect. Please re-check!")
   }
   else if(digitCount!=10){
     alert("You need to enter a 10-digit number!")
   }
   else{
  let name = $('#contactname').val()
  let address=$('#contactaddress').val()
  let company = $('#contactcompany').val()
  let cell = $('#contactcell').val()
  let email = $('#contactemail').val()
  let url = $('#contacturl').val()
  let birth = ""
  let y = $('#yy').val()
  let m = $('#mm').val()
  let d = $('#dd').val()
  birth+=m+"-"+d+"-"+y
  let filename = "contacts.txt";

   //Check if file exists
   if(fs.existsSync(filename)) {
     let orgData="";
      let data = fs.readFileSync(filename, 'utf8').split('\n')
      //Harry,1,1,1,1,2-28-2019,test@test.com,test
      var editIndex = $('#contactedit').val().charAt($('#contactedit').val().length-1);
      data[editIndex]=name+","+address+","+company+","+cell+","+birth+","+email+","+url;
      for(var i=0;i<data.length;i++){
        orgData+=data[i]+'\n';
      }
      fs.writeFileSync(filename, orgData, (err) => {
        if (err) throw err;
        console.log('The file has been updated');
      });
      
  ipcRenderer.send('asynchronous-message', 'closeAndRefresh')
   }

   }

})

$('#addbtn').on('click', () => {
  let email2 = $('#contactemail').val()
  let regex = /^[a-zA-Z]+((\d)|((\-)(?!\-))|((\_)(?!\_))|((\.)(?!\.)))*@[a-zA-Z]+\.[a-zA-Z]+/
  let result = email2.match(regex)
  let numberCheck = $('#contactcell').val()
  let digitCount=0;
  for(var i =0;i<numberCheck.length;i++){
    if(numberCheck.charAt(i)>='0' && numberCheck.charAt(i)<='9'){
      digitCount+=1;
    }
  }
   if(result==null){
     alert("Your email is incorrect. Please re-check!")
   }
   else if(digitCount!=10){
    alert("You need to enter a 10-digit number!")
  }
   else{
  let name = $('#contactname').val()
  let address=$('#contactaddress').val()
  let company = $('#contactcompany').val()
  let cell = $('#contactcell').val()
  let email = $('#contactemail').val()
  let url = $('#contacturl').val()
  let birth = ""
  let y = $('#yy').val()
  let m = $('#mm').val()
  let d = $('#dd').val()
  birth+=m+"-"+d+"-"+y
  fs.appendFileSync('contacts.txt', name+","+address+","+company+","+cell+","+birth+","+email+","+url+'\n', (err) => {
    if (err) throw err;
    console.log("the data was appended!");
  });

  ipcRenderer.send('asynchronous-message', 'closeAndRefresh')
   }
   
})

function addEntry(name,address,company,cell,birth,email,url){
  var contact = {};
  contact['name'] = name;
  contact['address'] = address;
  contact['company'] = company;
  contact['cell'] = cell;
  contact['birth'] = birth;
  contact['email'] = email;
  contact['url']=url;
  contacts.push(contact);

  var index = contacts.length-1;


  let updateString = "<tr onclick='loadDetails(" + index + ")'><td>" + name + "</td><td>" + address + "</td><td>" + company + "</td><td>" + cell + "</td><td>" + birth + "</td><td>" + email+ "</td><td>" + url+"</td></tr>"

  $('#contactlist').append(updateString)
}

function loadDetails(index){
    var contact = contacts[index];
    $('#selectedname').text(contact.name);
    $('#selectedaddress').text(contact.address);
    $('#selectedcompany').text(contact.company);
    $('#selectedcell').text(contact.cell);
    $('#selectedbirth').text(contact.birth);
    $('#selectedemail').text(contact.email);
    $('#selectedurl').text(contact.url);
    $('#deletebtn').on('click', () => {
      deleteEntry(index);
    })
}

function deleteEntry(index){

  let name = $('#contactname').val()
  let address=$('#contactaddress').val()
  let company = $('#contactcompany').val()
  let cell = $('#contactcell').val()
  let email = $('#contactemail').val()
  let url = $('#contacturl').val()
  let birth = ""
  let y = $('#yy').val()
  let m = $('#mm').val()
  let d = $('#dd').val()
  birth+=m+"-"+d+"-"+y
  let filename = "contacts.txt";
   //Check if file exists
   if(fs.existsSync(filename)) {
     let orgData="";
      let data = fs.readFileSync(filename, 'utf8').split('\n')
      //Harry,1,1,1,1,2-28-2019,test@test.com,test
      alert(index)
      for(var i=0;i<data.length;i++){
        if(i!=index){
        orgData+=data[i]+'\n';
        }
      }
      fs.writeFileSync(filename, orgData, (err) => {
        if (err) throw err;
        console.log('The file has been updated');
      });
    contacts=[]
    loadAndDisplayContacts();
}
}

function loadAndDisplayContacts() {
   let filename = "contacts.txt";
   //Check if file exists
   if(fs.existsSync(filename)) {
      let data = fs.readFileSync(filename, 'utf8').split('\n')
      $('#contactlist').html("<tr><th>Name</th><th>Address</th><th>Company</th><th>Cellphone Number</th><th>Birthday</th><th>Email</th><th>URL</th></tr>");
      data.forEach((contact, index) => {
         let [ name, address, company, cell, birth,email,url] = contact.split(',')
         if (name && address&& company&& cell && birth && email && url){
           addEntry(name,address,company,cell,birth,email,url)
         }
      })
      if (contacts.length > 0){
        loadDetails(0);
      }
   }
}

function showAddContactModal(){
  ipcRenderer.send('asynchronous-message', 'showModal')
}
function showEditContactModal(){
  ipcRenderer.send('asynchronous-message', 'editModal')
}

function importFile(filename){
    let data = fs.readFileSync(filename, 'utf8');
    var cards = vCard.parse(data);
    cards.forEach((card, index) => {
      fs.appendFileSync('contacts.txt', card.get("n")+","+card.get("tel")+'\n', (err) => {
        if (err) throw err;
        console.log("the data was appended!");
      });

    });
    contacts = [];
    loadAndDisplayContacts();
}

function exportFile(){
    contacts.forEach((contact, index) => {
    console.log('exporting contact '+contact.name);
    card = new vCard();
    card.set("n", contact.name);
    card.set("tel", contact.number);
    fs.appendFileSync("vcard.txt", card.toString(),(err) => {
      if (err) throw err;
      console.log("the data was exported!");
    });

  })
}


function populateYear(){
  var selectTag = document.getElementById("yy");
  var option = document.createElement("option");
  var j = "Please select a year";
  option.value="defaultYear";
  option.innerHTML=j;
  selectTag.appendChild(option);
  for(var i=1970;i<2020;i++){
    var option = document.createElement("option");
    option.value=i;
    option.innerHTML=i;
    selectTag.appendChild(option);
  }

}

function populateDays(){
  
  let year = $('#yy').val();
  let month = $('#mm').val();
  var date = new Date(year,month,0);
  let days = date.getDate();
  var selectTag = document.getElementById("dd");
  for(var j = selectTag.length;j>=0;j--){
    selectTag.remove(j);
  }
  for(var i=1;i<=days;i++){
    var option = document.createElement("option");
    if(i<10){
      i="0"+i;
    }
    else{
      i+="";
    }
    option.value=i;
    option.innerHTML=i;
    selectTag.appendChild(option);
  }

}

function showURL(){
  
}
  
  function showEditContactModal(){
      ipcRenderer.send('asynchronous-message', 'editModal')
  }
  
  function loadPlaceHolders(){
    

      let filename = "contacts.txt";

      //Check if file exists
      if(fs.existsSync(filename)) {
         let data = fs.readFileSync(filename, 'utf8').split('\n')
         //alert(data);
         $('#contactlist').html("<tr><th>Name</th><th>Phone</th><th>Address</th><th>Company</th><th>Cellphone Number</th><th>Birthday</th><th>Email</th><th>URL</th></tr>");
         data.forEach((contact, index) => {
            let [ name, address, company, cell, birth,email,url] = contact.split(',')
            if (name  && address&& company&& cell && birth && email && url){
              addEntry(name,address,company,cell,birth,email,url)
            }
         })
         var selectTag = document.getElementById("contactedit");
         var option = document.createElement("option");
         var j = "Please select the user you want to update";
         option.value="defaultUser";
         option.innerHTML=j;
         selectTag.appendChild(option);
         for(var i=0;i<contacts.length;i++){
           var option = document.createElement("option");
           option.value=contacts[i].name+i;
           option.innerHTML=contacts[i].name;
           selectTag.appendChild(option);
         }

         
      }
    }
    function pleaseWork(){
      var input = document.getElementById("avatar");
      var reader = new FileReader();
      reader.readAsDataURL(input.files[0]);
      document.getElementById("name").value = "TEST"
      reader.onloadend = function(e){
        var selectTag = document.createElement("img");
        selectTag.src = e.target.result;
        document.getElementById("lmao").appendChild(selectTag);
      };
      }
      
function test(){
}

function dummy(){}

