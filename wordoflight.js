var currentchapter='';

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

function showverse(gbook,gchapter) {
    var display = document.getElementById('showverse');
    var arr_verse = [];
    var api = '';
    var vod=false;
   var chp_c=0;
   
    if(gbook.length<1&&gchapter===0){
    
    var book = document.getElementById('book-list').value.toLowerCase().replaceAll(" ","");
    var chapter = document.getElementById('chapter-list').value;
    var verse = document.getElementById('verse-list').value;
    if (verse.length < 1) {
        api = `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/en-kjv/books/${book}/chapters/${chapter}.json`;
    } else {
        api = `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/en-kjv/books/${book}/chapters/${chapter}/verses/${verse}.json`;
    }
}
    else{
        vod=true;
        var book = gbook.toLowerCase().replaceAll(" ","");
        var chapter = gchapter;
        api = `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/en-kjv/books/${book}/chapters/${chapter}.json`;
    }
   
   

    display.innerHTML = "";

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", api, true);
    xhttp.send();
    xhttp.onload = function () {
        var got_items = JSON.parse(this.responseText);

        if (vod||verse.length < =1) {
             currentchapter=chapter;
            if (currentchapter<1){
    chp_c=1;
            }
            else{
                chp_c=currentchapter;
            }
            var arr='';
            arr+=`<p class='ref'>${book.charAt(0).toUpperCase() + book.slice(1).toLowerCase()}`+ " : " +`${chapter}</p>`
            arr+="<ol>";
            for (var i = 0; i < got_items.data.length; i++) {
                var currentVerse = got_items.data[i].verse;
            
                if (!arr_verse.includes(currentVerse)) {
                    arr_verse.push(currentVerse);
                    arr += `<li> ${got_items.data[i].text.replaceAll("¶", "").replaceAll(".", ". ")}</li>`;
                }
            }
            display.innerHTML+=arr+"</ol>"+`<button class="chp-prev" id="chp-prev" onclick="showverse('${book}',`+(chp_c-1)+`)">&#11207;</button>
    <button class="chp-nxt" id="chp-nxt" onclick="showverse('${book}',`+(chp_c+1)+`)">&#11208;</button>`
        }
               else {
                currentchapter=chapter;
            display.innerHTML+=`<p class='ref'>${book.charAt(0).toUpperCase() + book.slice(1).toLowerCase()}`+ " : " +`${chapter}`+ " : " +`${verse}</p>`;
            display.innerHTML += `<p><b>${got_items.verse}</b> : ${got_items.text.replaceAll("¶", "").replaceAll(".", ". ")}</p>
    <button class="chp-prev" id="chp-prev" onclick="showverse('${book}',`+(chp_c-1)+`)">&#11207;</button>
    <button class="chp-nxt" id="chp-nxt"onclick="showverse('${book}',`+(chp_c+1)+`)">&#11208;</button>`;
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
            var verse = got_items[0]; // Assuming we take the first verse
            var display = document.getElementById('showverse');
            display.innerHTML = `
            <p class='head'>VERSE OF THE DAY</p>
                <p class='ref'>${verse.bookname} : ${verse.chapter} : ${verse.verse}</p>
                <p><b>${verse.verse}</b> : ${verse.text.replaceAll("¶", "").replaceAll(".", ". ")}</p>
                <button class='rfchp' onclick="showverse('${verse.bookname}',${verse.chapter})">Read full chapter</button>
            `;
            document.getElementById('book-list').placeholder=verse.bookname;
            document.getElementById('chapter-list').placeholder=verse.chapter;
            document.getElementById('verse-list').placeholder=verse.verse;
            currentchapter=verse.chapter;

        } else {
            var display = document.getElementById('showverse');
            display.innerHTML = "No verse of the day available.";
        }
    }
}

