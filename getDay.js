let year="";
let month="";
let $ =require('jquery')
$(document).ready( function(){
  $('#yy').change( function(){
     year = $('#yy').val();
    if($('#yy').val()!="defaultYear" && $('#mm').val()!="defaultMonth"){
      populateDays();
     
    }

  });
  $('#mm').change(function(){
     month = $('#mm').val();
    if($('#yy').val()!="defaultYear" && $('#mm').val()!="defaultMonth"){
      populateDays();
     
    }
});
});


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

  for(var i=1;i<=days;i++){
    var option = document.createElement("option");
    option.value=i;
    option.innerHTML=i;
    selectTag.appendChild(option);
  }

}

function test(){

}

function dummy(){}
