let curInputTab = 0;
let inputTabs = [];
let inputPages = [];
let isBarOpened = false;

inputPages.push(document.getElementById("palette_edit_img"));
inputPages.push(document.getElementById("palette_edit_text"));
inputTabs = [...document.querySelectorAll(".input-tab")];

toggleInput(0);

function toggleInput(index){
    for (let i = 0; i < inputPages.length; i++){
        if (i == index){
            inputPages[i].style.display = "inline-block";
            inputTabs[i].style.boxShadow = "none";
        }
        else{
            inputPages[i].style.display = "none";
            inputTabs[i].style.boxShadow = "0 -.9rem 1.15rem -1.15rem #000 inset";
        }
    }
}




let pageColorPalette = ["#fce7e6", "#eefce6", "#e6eefc", "#dbe2ff", "#fcc2ff", "#ffc2c2"];
function NewPage(){
    pages.push({"page": (pages.length + 1), "color": pageColorPalette[Math.floor(Math.random() * pageColorPalette.length)]});
    
    // 서버에 PageInfo.json을 올림
    let formData = new FormData();
    formData.append('code', "UpdatePageInfo");
    formData.append("user", userName);
    formData.append('json', JSON.stringify(pages));
    ajaxPost(formData, "/src/php/Server.php");
    
    location.reload();
}






























 

function ShowPaletteBar(){
    if (isBarOpened){
        HidePaletteBar();

        isBarOpened = false;
        return;
    }

    isBarOpened = true;
    document.querySelector("#palette_bar_open").style.transform = "translateY(-50%) rotate(-180deg)";
    document.getElementById("palette_bar").style.width = "calc(13 * var(--vunit))";
    Edit();
}

function HidePaletteBar(){
    document.querySelector("#palette_bar_open").style.transform = "translateY(-50%) rotate(0deg)";
    document.getElementById("palette_bar").style.width = "calc(6 * var(--vunit))";
}

