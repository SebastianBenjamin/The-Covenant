
    const HIGHLIGHT_COLORS = [
        'yellow', 'lightgreen', 'pink', 'lightblue', 'orange', 'lavender'
    ];

    // Retrieve or set default highlight color
    let currentHighlightColor = localStorage.getItem('highlightColor') || 'yellow';
    var currentchapter = "";
    var ver;
    var chp_en = document.getElementById("chapter-list");
    var vse_en = document.getElementById("verse-list");
    var bk_en = document.getElementById("book-list");
    chp_en.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            autoFill(document.getElementById("chapter-list"), "data-chapter-list");

            showverse("", 0, true);
        }
    });
    vse_en.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            showverse("", 0, true);
        }
    });
    bk_en.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            autoFill(document.getElementById("book-list"), "data-book-list");

            showverse("", 0, true);
        }
    });

    function onloadfun() {
        var display = document.getElementById("data-version-list");

        display.innerHTML = "";
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", "./books.json");
        xhttp.send();
        xhttp.onload = function () {
            // alert("hai");
            var got_items = JSON.parse(this.responseText);
            for (let i = 0; i < got_items.Versions.length; i++) {
                if (got_items.Versions[i].id === "en-kjv") {
                    display.innerHTML += `
                    <option  value="${got_items.Versions[i].id}" selected >${got_items.Versions[i].name}</option>`;
                } else {
                    display.innerHTML += `
                <option value="${got_items.Versions[i].id}">${got_items.Versions[i].name}</option>`;
                }
                getversionname(document.getElementById("data-version-list").value);
            }
        };
        setTimeout(() => {
            
            loadSavedVerse();
        }, 1000);
    }

    function getbooks() {
        var display = document.getElementById("data-book-list");
        display.innerHTML = "";
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", "./books.json");
        xhttp.send();
        xhttp.onload = function () {
            // alert("hai");
            var got_items = JSON.parse(this.responseText);
            for (let i = 0; i < got_items.Books.length; i++) {
                display.innerHTML += `
                <option value="${got_items.Books[i].name}">`;
            }
        };
    }

    function getchapters() {
        var display = document.getElementById("data-chapter-list");
        var bookname = document.getElementById("book-list").value.toLowerCase();
        var chapters;
        display.innerHTML = "";
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", "./books.json");
        xhttp.send();
        xhttp.onload = function () {
            var got_items = JSON.parse(this.responseText);

            for (let i = 0; i < got_items.Books.length; i++) {
                if (got_items.Books[i].name.toLowerCase() === bookname) {
                    chapters = got_items.Books[i].chapters;

                    break;
                }
            }
            //console.log(chapters);
            for (let i = 1; i <= chapters; i++) {
                display.innerHTML += `
                <option value="${i}">`;
            }
        };
    }

    function getverses() {
        var display = document.getElementById("data-verse-list");
        var bookname = document.getElementById("book-list").value.toLowerCase();
        var chapternum = document.getElementById("chapter-list").value;

        //console.log(bookname + chapternum);
        display.innerHTML = "";
        const xhttp = new XMLHttpRequest();
        xhttp.open(
            "GET",
            `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/en-kjv/books/${bookname}/chapters/${chapternum}.json`,
            true
        );
        xhttp.send();
        xhttp.onload = function () {
            var got_items = JSON.parse(this.responseText);
            //console.log(got_items.data);
            for (let i = 1; i < got_items.data.length; i++) {
                display.innerHTML += `
                <option value="${got_items.data[i].verse}">`;
            }
        };
    }
    function saveCurrentVerse(book, chapter) {
      
        const currentVerseData = { book, chapter};
        localStorage.setItem('savedVerse', JSON.stringify(currentVerseData));
    }
    
    function loadSavedVerse() {
        
        const savedVerse = localStorage.getItem('savedVerse');
        if (savedVerse) {
            const { book, chapter } = JSON.parse(savedVerse);
    
           showverse(book,chapter,false);
        } else {
            randomverse(); 
        }
    }
    
    function showverse(gbook, gchapter, sts) {
        var display = document.getElementById("showverse");
        display.innerHTML = "";
        getversionname(version);
        var version = document.getElementById("data-version-list").value;
        
   
        
        var bookListValue = document.getElementById("book-list").value.trim();
        var chapterListValue = document.getElementById("chapter-list").value.trim();
    
        if (sts) {
            if (
                bookListValue === "" 
            ) {
                alert("Invalid inputs!");
                document.getElementById("chapter-list").value = "";
                window.location.reload();
                return 0;
            }
            else if(chapterListValue===""||chapterListValue<1){
                chapterListValue=1;
                document.getElementById("chapter-list").value = chapterListValue.charAt(0).toUpperCase() + chapterListValue.substring(1);
            }
        }
    
        var arr_verse = [];
        var api = "";
        var vod = false;
    
        if (gbook.length < 1 && gchapter === 0) {
            var book = document
                .getElementById("book-list")
                .value.toLowerCase()
                .replaceAll(" ", "");
            var chapter = document.getElementById("chapter-list").value;
            var verse = document.getElementById("verse-list").value;
    
            if (verse.length < 1 || verse == 0) {
                verse = "";
                api = `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/${version}/books/${book}/chapters/${chapter}.json`;
            } else {
                console.log('verseeeee');
                console.log(verse);
                
                api = `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/${version}/books/${book}/chapters/${chapter}/verses/${verse}.json`;
                console.log(api);
            }
        } else {
            document.getElementById("chapter-list").value = "";
            var chapter = gchapter;
    
            if (chapter === 0) {
                chapter = 1;
            }
    
            autoFill(document.getElementById("chapter-list"), "data-chapter-list");
            document.getElementById("verse-list").value = "";
            vod = true;
            var book = gbook.toLowerCase().replaceAll(" ", "");
    
            document.getElementById("chapter-list").value = chapter;
            document.getElementById("book-list").value = book.charAt(0).toUpperCase() + book.substring(1);
            
            api = `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/${version}/books/${book}/chapters/${chapter}.json`;
        }
    
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", api, true);
        xhttp.send();
        xhttp.onload = function () {
            if (this.status === 403) {
                display.style.color = "red";
                display.innerHTML = `<p class='ref'>Invalid Reference!</p><p>Please enter a valid reference</p>`;
                setTimeout(function () {
                    location.reload();
                    display.style.color = "auto";
                }, 2000);
                return;
            }
    
            var got_items = JSON.parse(this.responseText);
            
            if (vod || verse.length < 1) {
                var got_items = JSON.parse(this.responseText);

                if (vod || verse.length < 1) {
                    display.innerHTML = "";
                    currentchapter = chapter;
        
                    if (currentchapter < 1) {
                        currentchapter = 1;
                    }
        
                    var arr = "";
                    arr += `<p class='ref'>${book.charAt(0).toUpperCase() + book.slice(1).toLowerCase()} : ${chapter}</p>`;
                    arr += "<ol>";
        
                    for (var i = 0; i < got_items.data.length; i++) {
                        var currentVerse = got_items.data[i].verse;
                        var cleanedText = got_items.data[i].text
                            .replaceAll("¶", "")
                            .replaceAll(".", ". ");
        
                        var verseReference = `${book.charAt(0).toUpperCase() + book.slice(1).toLowerCase()} : ${chapter}:${i + 1}`;
                        
                        // Check if verse is highlighted in localStorage
                        const storedData = localStorage.getItem(verseReference);
                        let highlightStyle = '';
                        if (storedData) {
                            const parsedData = JSON.parse(storedData);
                            if (parsedData.color) {
                                highlightStyle = `style="background-color: ${parsedData.color};"`;
                            }
                        }
        
                        if (!arr_verse.includes(currentVerse)) {
                            arr_verse.push(currentVerse);
                            arr += `<li ${highlightStyle} onclick="saveCurrentVerse('${book}', ${chapter}, ${i + 1}, '${cleanedText}');HighLightVerse('${verseReference}=${cleanedText}',this)">
                                ${cleanedText}
                            </li>`;
                        }
                    }
        
                    display.innerHTML += arr + "</ol>" + 
                        `<button title='Previous Chapter' class="chp-prev" id="chp-prev" onclick="navigateChapter('${book}', ${Math.max(1, Number(currentchapter) - 1)})"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0,0,256,256">
<g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(0.5,0.5)"><path d="M7.9,256c0,-137 111.1,-248.1 248.1,-248.1c137,0 248.1,111.1 248.1,248.1c0,137 -111.1,248.1 -248.1,248.1c-137,0 -248.1,-111.1 -248.1,-248.1z" fill="#00008b"></path><path d="M231.4,258.7c30.7,-30.7 61.4,-61.4 92.1,-92.1c26.8,-26.8 -14.9,-68.2 -41.8,-41.3c-37.6,37.6 -75.2,75.2 -112.8,112.8c-11.4,11.4 -11,30.3 0.2,41.5c37.6,37.6 75.2,75.2 112.8,112.8c26.8,26.8 68.2,-14.9 41.3,-41.8c-30.6,-30.7 -61.2,-61.3 -91.8,-91.9z" fill="#ffffff"></path></g></g>
</svg></button>
                        <button class="chp-nxt" title='Next Chapter' id="chp-nxt" onclick="navigateChapter('${book}', ${Number(currentchapter) + 1})"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0,0,256,256">
<g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(0.5,0.5)"><path d="M7.9,256c0,-137 111.1,-248.1 248.1,-248.1c137,0 248.1,111.1 248.1,248.1c0,137 -111.1,248.1 -248.1,248.1c-137,0 -248.1,-111.1 -248.1,-248.1z" fill="#00008b"></path><path d="M357.4,237.8c-37.6,-37.6 -75.2,-75.2 -112.8,-112.8c-26.8,-26.8 -68.2,14.9 -41.3,41.8c30.6,30.6 61.3,61.2 91.9,91.9c-30.7,30.7 -61.4,61.4 -92.1,92.1c-26.8,26.8 14.9,68.2 41.8,41.3c37.6,-37.6 75.2,-75.2 112.8,-112.8c11.2,-11.3 10.9,-30.3 -0.3,-41.5z" fill="#ffffff"></path></g></g>
</svg></button>`;
                } else {
                    display.innerHTML = "";
                    currentchapter = chapter;
        
                    var cleanedText = got_items.text
                        .replaceAll("¶", "")
                        .replaceAll(".", ". ");
        
                    var verseReference = `${book.charAt(0).toUpperCase() + book.slice(1).toLowerCase()} : ${chapter} : ${verse}`;
                    
                    // Check if single verse is highlighted
                    const storedData = localStorage.getItem(verseReference);
                    let highlightStyle = '';
                    if (storedData) {
                        const parsedData = JSON.parse(storedData);
                        if (parsedData.color) {
                            highlightStyle = `style="background-color: ${parsedData.color};"`;
                        }
                    }
        
                    display.innerHTML += `<p class='ref'>${verseReference}</p>`;
                    display.innerHTML += `<p ${highlightStyle} onclick="saveCurrentVerse('${book}', ${chapter}, ${verse}, '${cleanedText}');HighLightVerse('${verseReference}=${cleanedText}',this)">
                                           <b>${verse}</b> : ${cleanedText}
                                           </p>`;
                }
            }else {
                display.innerHTML = "";
                currentchapter = chapter;
            
                var cleanedText = got_items.text
                    .replaceAll("¶", "")
                    .replaceAll(".", ". ");
            
                var verseReference = `${book.charAt(0).toUpperCase() + book.slice(1).toLowerCase()} : ${chapter} : ${verse}`;
                
                // Check if single verse is highlighted
                const storedData = localStorage.getItem(verseReference);
                let highlightStyle = '';
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    if (parsedData.color) {
                        highlightStyle = `style="background-color: ${parsedData.color};"`;
                    }
                }
            
                display.innerHTML += `<p class='ref'>${verseReference}</p>`;
                display.innerHTML += `<p ${highlightStyle} onclick="saveCurrentVerse('${book}', ${chapter}, ${verse}, '${cleanedText}');HighLightVerse('${verseReference}=${cleanedText}',this)">
                                       <b>${verse}</b> : ${cleanedText}
                                       </p>
                                       <button class='rfchp' onclick="readfull('${book}',${chapter})">Read full chapter</button>`;
            }
            saveCurrentVerse(book, chapter);
        }}
        
    

    
    

    function navigateChapter(book, chapter) {
        const display = document.getElementById("showverse");
        if (chapter < 1) chapter = 1;

        const api = `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/${document.getElementById("data-version-list").value
            }/books/${book}/chapters/${chapter}.json`;
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", api, true);
        xhttp.send();
        xhttp.onload = function () {
            if (this.status === 200) {
                showverse(book, chapter, false);
            } else {
                if (this.status === 404) {
                    showverse(book, chapter - 1, false);
                }
            }
        };
    }

    function autoFill(input, datalistId) {
        var datalist = document.getElementById(datalistId);
        var options = datalist.getElementsByTagName("option");
        var inputValue = input.value.toLowerCase();
        var closestMatch = "";

        for (var i = 0; i < options.length; i++) {
            var optionValue = options[i].value.toLowerCase();
            if (optionValue === inputValue) {
                closestMatch = optionValue;
                break;
            }

            if (closestMatch === "" || optionValue.indexOf(inputValue) === 0) {
                closestMatch = optionValue;
            }
        }

        input.value = closestMatch.charAt(0).toUpperCase() + closestMatch.substring(1);

    }
    function randomverse() {
        // console.log('helllo');
        
        const api = "https://labs.bible.org/api/?passage=votd&type=json";
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", api, true);
        xhttp.send();
        xhttp.onload = function () {
            var display = document.getElementById("showverse");
            display.innerHTML='';
            var array = [];
            document.getElementById("book-list").value = "";
            document.getElementById("chapter-list").value = "";
            document.getElementById("verse-list").value = "";
            var got_items = JSON.parse(this.responseText);
    
            for (var i = 0; i < got_items.length; i++) {
                array += ` ${got_items[i].verse}` + "  ";
            }
            display.innerHTML += `
                <p class='head'>VERSE OF THE DAY</p>
                <p class='ref'>${got_items[0].bookname} : ${got_items[0].chapter} :${array} </p>`;
    
            for (var i = 0; i < got_items.length; i++) {
                var verse = got_items[i];
                var cleanedText = verse.text.replaceAll("¶", "").replaceAll(".", ". ");
                var verseReference = `${verse.bookname}: ${verse.chapter} : ${verse.verse}`;
                
                
                var storedVerseData = localStorage.getItem(verseReference);
                var highlightStyle = storedVerseData 
                    ? `background-color: ${JSON.parse(storedVerseData).color};` 
                    : '';
    
                display.innerHTML += `
                <p  
                   id='verse' 
                   data-reference="${verseReference}"
                   style="${highlightStyle}">
                   <b>${verse.verse}</b> : ${cleanedText}
                </p>`;
                
                currentchapter = verse.chapter;
            }
            saveCurrentVerse(verse.bookname, verse.chapter);
            display.innerHTML += `<button class='rfchp' onclick="readfull('${verse.bookname}',${verse.chapter})">Read full chapter </button> `;
        };
    }

    function readfull(bn, c) {
        showverse(bn, c, false);
        document.getElementById("book-list").value = bn;
        document.getElementById("chapter-list").value = c;
    }
    function getversionname(id) {
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", "./books.json");
        xhttp.send();
        xhttp.onload = function () {
            var bibleVersions = JSON.parse(this.responseText);
            for (let i = 0; i < bibleVersions.Versions.length; i++) {
                if (bibleVersions.Versions[i].id.includes(id)) {
                    ver = bibleVersions.Versions[i].abr;
                    
                    break;
                }
            }
        };
    }

    function clrvc() {
        document.getElementById("verse-list").value = "";
        document.getElementById("chapter-list").value = "";
    }

    function HighLightVerse(verse, element) {
        if (verse !== '') {
            // Split the verse into reference and text
            var parts = verse.split('=');
            var reference = parts[0].trim();
            var text = parts[1].trim();
    
            // Toggle highlight
            const storedData = JSON.parse(localStorage.getItem(reference) || '{}');
            const currentColor = element.style.backgroundColor;
    
            if (currentColor === storedData.color) {
                // If already highlighted, remove from localStorage and reset background
                element.style.backgroundColor = '';
                localStorage.removeItem(reference);
            } else {
                // Apply highlight and store in localStorage with color and text
                element.style.backgroundColor = currentHighlightColor;
                localStorage.setItem(reference, JSON.stringify({
                    text: text,
                    color: currentHighlightColor
                }));
            }
        } else {
            // Fallback for cases without a proper verse reference
            element.style.backgroundColor = currentHighlightColor;
        }
    }
    
    // Add this to your window.onload or DOMContentLoaded event
    window.addEventListener('DOMContentLoaded', () => {
        // Restore highlight color preference
        const savedHighlightColor = localStorage.getItem('highlightColor');
        if (savedHighlightColor && HIGHLIGHT_COLORS.includes(savedHighlightColor)) {
            currentHighlightColor = savedHighlightColor;
            const highlightImg = document.getElementById('hightlight-img');
            if (highlightImg) {
                highlightImg.style.border = `3px solid ${currentHighlightColor}`;
            }
        }
    });
    // Color selection functionality remains the same as previous implementation
    document.getElementById('hightlight-img').addEventListener('click', () => {
        const currentIndex = HIGHLIGHT_COLORS.indexOf(currentHighlightColor);
        const nextIndex = (currentIndex + 1) % HIGHLIGHT_COLORS.length;
        currentHighlightColor = HIGHLIGHT_COLORS[nextIndex];
        
        // Save current highlight color to localStorage
        localStorage.setItem('highlightColor', currentHighlightColor);
        
        // Update highlight image to show current color
        document.getElementById('hightlight-img').style.border = `3px solid ${currentHighlightColor}`;
    });
    function toggleHighlightsPanel() {
        const panel = document.getElementById('highlightsPanel');
        panel.classList.toggle('open');
        if (panel.classList.contains('open')) {
          loadHighlightedVerses();
        }
      }

      // Function to load highlighted verses
      function loadHighlightedVerses() {
        const highlightsList = document.getElementById('highlightsList');
        highlightsList.innerHTML = '';
        
        // Get all items from localStorage
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          try {
            const data = JSON.parse(localStorage.getItem(key));
            
            // Check if this is a highlighted verse (has color property)
            if (data && data.color) {
              const verseDiv = document.createElement('div');
              verseDiv.className = 'highlighted-verse-item';
              verseDiv.style.backgroundColor = data.color + '40'; // Add transparency to background
              
              // Extract book and chapter from the reference
              const parts = key.split(':');
              const book = parts[0].trim();
              const chapter = parts[1].trim();
              
              verseDiv.innerHTML = `
                <div class="verse-reference">${key}</div>
                <div class="verse-text">${data.text}</div>
              `;
              
              // Add click handler to show full chapter
              verseDiv.onclick = () => {
                showverse(book, chapter, false);
                toggleHighlightsPanel();
              };
              
              highlightsList.appendChild(verseDiv);
            }
          } catch (e) {
            console.log('Skipping non-JSON localStorage item');
          }
        }
        
        if (highlightsList.children.length === 0) {
          highlightsList.innerHTML = '<div class="highlighted-verse-item">No highlighted verses yet</div>';
        }
      }
    //   document.addEventListener('keydown', (e) => {
    //     if (e.key.toLowerCase() === 'h') {
    //       toggleHighlightsPanel();
    //     }
    //   });