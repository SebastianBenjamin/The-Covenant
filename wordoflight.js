var currentchapter='';
var ver;

var chp_en = document.getElementById("chapter-list");
var vse_en=document.getElementById("verse-list");
var bk_en=document.getElementById("book-list");
chp_en.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    showverse('',0,true);
  }
});
vse_en.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    showverse('',0,true);
  }
});
bk_en.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    showverse('',0,true);
  }
});

 function onloadfun(){

    var display=document.getElementById('data-version-list');
    
    display.innerHTML="";
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "./books.json");
    xhttp.send();
    xhttp.onload = function () { 
        // alert("hai");
        var got_items =  JSON.parse(this.responseText) ;
        for(let i=0;i<got_items.Versions.length;i++){
            if(got_items.Versions[i].id==='en-kjv'){
                display.innerHTML+=`
                <option  value="${got_items.Versions[i].id}" selected >${got_items.Versions[i].name}</option>`;   
            }
            else{
            display.innerHTML+=`
             <option value="${got_items.Versions[i].id}">${got_items.Versions[i].name}</option>`;}
             getversionname(document.getElementById('data-version-list').value);    
            }
 }

}

function getbooks(){
    var display=document.getElementById('data-book-list');
    display.innerHTML="";
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "./books.json");
    xhttp.send();
    xhttp.onload = function () { 
        // alert("hai");
        var got_items =  JSON.parse(this.responseText) ;
        for(let i=0;i<got_items.Books.length;i++){
            display.innerHTML+=`
             <option value="${got_items.Books[i].name}">`;
}
}
}

function getchapters(){
    var display=document.getElementById('data-chapter-list');
    var bookname=document.getElementById('book-list').value.toLowerCase();
    var chapters;
    display.innerHTML="";
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "./books.json");
    xhttp.send();
    xhttp.onload = function () { 
        var got_items =  JSON.parse(this.responseText) ;
        
        for (let i = 0; i < got_items.Books.length; i++) {
            if (got_items.Books[i].name.toLowerCase() === bookname) {
                chapters = got_items.Books[i].chapters;
      
                break;
            }
        }
        console.log(chapters);
        for(let i=1;i<=chapters;i++){
            display.innerHTML+=`
             <option value="${i}">`;
}
}
}

function getverses(){


    var display=document.getElementById('data-verse-list');
    var bookname=document.getElementById('book-list').value.toLowerCase();
    var chapternum=document.getElementById('chapter-list').value;
    
    console.log(bookname+chapternum);
    display.innerHTML="";
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/en-kjv/books/${bookname}/chapters/${chapternum}.json`,true);
    xhttp.send();
    xhttp.onload = function () { 
        var got_items =  JSON.parse(this.responseText) ;
        console.log(got_items.data);
        for(let i=1;i<got_items.data.length;i++){
            display.innerHTML+=`
             <option value="${got_items.data[i].verse}">`;
}
}
}

function showverse(gbook,gchapter,sts) {
    var display = document.getElementById('showverse');
    display.innerHTML = "";
    var version=document.getElementById('data-version-list').value;  
    getversionname(version);    
    var bookListValue = document.getElementById('book-list').value.trim();
    var chapterListValue = document.getElementById('chapter-list').value.trim();

    if (sts) {
        if (bookListValue === "" || chapterListValue === '' || Number(chapterListValue) < 1) {
            alert("Invalid inputs!");
            
            document.getElementById('chapter-list').value = '';
            return 0;
        }
    }
    
  
    var arr_verse = [];
    var api = '';
    var vod=false;
   var chp_c=0;
 
    if(gbook.length<1&&gchapter===0){//with input that is ('',0,true)
    
    var book = document.getElementById('book-list').value.toLowerCase().replaceAll(" ","");
    var chapter = document.getElementById('chapter-list').value;
    var verse = document.getElementById('verse-list').value;
    console.log(verse);
    if (verse.length < 1 ||verse==0) {
        verse='';
        console.log("bc");
        document.getElementById('verse-list').value='';
              api = `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/${version}/books/${book}/chapters/${chapter}.json`;
    } else {
        console.log("bcv");

        api = `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/${version}/books/${book}/chapters/${chapter}/verses/${verse}.json`;
    }
}
    else{

        // document.getElementById('book-list').value='';
        document.getElementById('chapter-list').value='';
        var chapter = gchapter;
        if(chapter===0){
            chapter=1;
           }
           autoFill(document.getElementById('chapter-list'), 'data-chapter-list');
        showverse('',0);
        document.getElementById('verse-list').value='';
        vod=true;
        var book = gbook.toLowerCase().replaceAll(" ","");
        
        document.getElementById('chapter-list').value=chapter;
        document.getElementById('book-list').value=book;
        api = `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/${version}/books/${book}/chapters/${chapter}.json`;
    }
   
   



    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", api, true);
    xhttp.send();
    xhttp.onload = function () {
        console.log(this.status);
        if(this.status===403){
            display.innerHTML=
        `<p class='ref'>Invalid Reference !</p><p>Please enter a valid reference</p>`;
      
        setTimeout(function() {
            location.reload();
        }, 1000);
        }
        var got_items = JSON.parse(this.responseText);

        if (vod||verse.length < 1) {
            display.innerHTML = "";
             currentchapter=chapter;
            if (currentchapter<1){
    chp_c=1;
            }
            else{
                chp_c=currentchapter;
                document.getElementById('chapter-list').value=currentchapter;
            }
            var arr='';
            arr+=`<p class='ref'>${book.charAt(0).toUpperCase() + book.slice(1).toLowerCase()}`+ " : " +`${chapter}`+"  "+`${ver}</p>`
            arr+="<ol>";
            
            for (var i = 0; i < got_items.data.length; i++) {
                var currentVerse = got_items.data[i].verse;
            
                if (!arr_verse.includes(currentVerse)) {
                    arr_verse.push(currentVerse);
                    arr += `<li> ${got_items.data[i].text.replaceAll("¶", "").replaceAll(".", ". ")}</li>`;
                }
            }
            display.innerHTML+=arr+"</ol>"+`<button class="chp-prev" id="chp-prev" onclick="showverse('${book}',`+(Number(chp_c)-1)+`)">&#11207;</button>
    <button class="chp-nxt" id="chp-nxt" onclick="showverse('${book}',`+(Number(chp_c)+1)+`)">&#11208;</button>`
        }
               else {
                display.innerHTML = "";
                currentchapter=chapter;
            display.innerHTML+=`<p class='ref'>${book.charAt(0).toUpperCase() + book.slice(1).toLowerCase()}`+ " : " +`${chapter}`+ " : " +`${verse}`+"  "+`${ver}</p>`;
            display.innerHTML += `<p><b>${got_items.verse}</b> : ${got_items.text.replaceAll("¶", "").replaceAll(".", ". ")}</p>`;
            
    // <button class="chp-prev" id="chp-prev" onclick="showverse('${book}',`+(Number(chp_c)-1)+`)">&#11207;</button>
    // <button class="chp-nxt" id="chp-nxt"onclick="showverse('${book}',`+(Number(chp_c)+1)+`)">&#11208;</button>
        }
      
    }
}
function autoFill(input, datalistId) {
    
    var datalist = document.getElementById(datalistId);
    var options = datalist.getElementsByTagName('option');
    var inputValue = input.value.toLowerCase();
    var closestMatch = '';


    for (var i = 0; i < options.length; i++) {
        var optionValue = options[i].value.toLowerCase();
        if (optionValue === inputValue) {
            closestMatch = optionValue;
            break;
        }
        
        if (closestMatch === '' || optionValue.indexOf(inputValue) === 0) {
            closestMatch = optionValue;
        }
    }


    input.value = closestMatch;
}
function randomverse() {
    const api = 'https://labs.bible.org/api/?passage=votd&type=json';
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", api, true);
    xhttp.send();
    xhttp.onload = function () {
        var got_items = JSON.parse(this.responseText);
        if (got_items.length > 0) {
            var verse = got_items[0]; 
            var display = document.getElementById('showverse');
            display.innerHTML = `
            <p class='head'>VERSE OF THE DAY</p>
                <p class='ref'>${verse.bookname} : ${verse.chapter} : ${verse.verse}</p>
                <p><b>${verse.verse}</b> : ${verse.text.replaceAll("¶", "").replaceAll(".", ". ")}</p>
                <button class='rfchp' onclick="readfull('${verse.bookname}',${verse.chapter})">Read full chapter &#11208;</button>
            `;
             currentchapter=verse.chapter;
            
        } else {
            var display = document.getElementById('showverse');
            display.innerHTML = "No verse of the day available.";
        }
    }
}

function readfull(bn,c){
    showverse(bn,c,false);
    document.getElementById('book-list').value=bn.toLowerCase;
    document.getElementById('chapter-list').value=c;
}
function getversionname(id) {

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "./books.json");
    xhttp.send();
    xhttp.onload = function () { 
        var bibleVersions=JSON.parse(this.responseText);
    for (let i = 0; i < bibleVersions.Versions.length; i++) {
        
      if (bibleVersions.Versions[i].id.includes(id)) {
       ver=  bibleVersions.Versions[i].abr;
       console.log(typeof ver);
       console.log(ver);
       break;
      }
    }
  }

}

function clrvc(){
    document.getElementById('verse-list').value='';
    document.getElementById('chapter-list').value='';
}