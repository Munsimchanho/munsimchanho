let palette = [];
let pageTab = [];
let stickers = [];
let stickerJson;
let body = document.querySelector("body");
let pageTabParent = document.querySelector("#page-tab-parent");
let veilingDiv = document.querySelector("#veiling-div");
let userName = getUrlParams()['user'];

function getUrlParams() {     
    let params = {};  
    
    // 저 외계어는 URL의 쿼리문을 json으로 바꿔줄 때 사용되는 정규표현식
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, 
    	function(str, key, value) { 
        	params[key] = value; 
        }
    );     
        
    return params; 
}

let pageCount = 1;
let pages = [];
let curPage = 1;
let pageColor = [];

// StickerInfo.json을 가져와서 stickerJson 변수에 저장함
$.ajax({ 
    url: `/User/${ userName }/StickerInfo.json`,
    method: "GET", 
    dataType: "json" 
   })
.done(function(data) {
    stickerJson = data;
    console.log(data);
    
    $.ajax({
        url: `/User/${ userName }/PageInfo.json`,
        method: "GET",
        dataType: "json"
    })
    .done(function(res) {
        pages = res;
        pageCount = res.length;
        
        document.querySelector("#create-page-button").style.display = "none";
        if (pageCount < 5 && loggedIn){
            document.querySelector("#create-page-button").style.display = "inline-block";
        }
        
        // palette를 생성함
        for (let i = 0; i < pageCount; i++){
            // <div id="palette" class="palette">
            let page = document.createElement("div");
            page.id = "palette_" + (i+1);
            page.className = "palette";
            page.style.background = pages[i]['color'];
            body.insertBefore(page, veilingDiv);
            
            // page.addEventListener("click", () => {
            //     if (isBarOpened){
            //         HidePaletteBar();

            //         isBarOpened = false;
            //     }
            // });
            
            let tab = document.createElement("div");
            tab.id = "tab_" + (i+1);
            tab.className = "page-tab";
            tab.style.background = pages[i]['color'];
            tab.addEventListener("click", () => {
                if (!isBarOpened) togglePage(i);
            });
            pageTabParent.insertBefore(tab, document.querySelector("#create-page-button"));

            pageTab.push(tab);
            palette.push(page);
        }
        
        
        

        // palette div에 스티커 div 생성
        for (let i = 0; i < stickerJson.length; i++){
            palette[stickerJson[i]['page'] - 1].appendChild(drawSticker(i, stickerJson[i]));
        }

        togglePage(0);
        resizePalette();
    });
});

function resizePalette(){
    for (let i = 0; i < pageCount; i++){
        // 가로가 더 긺 == 세로가 더 짧음 == 세로를 기준으로 resize함
        if (window.innerWidth / window.innerHeight > 20/13){
            let scaler = window.innerHeight / 1300;
            palette[i].style.height = `calc(1300px - 3.2 * var(--unit) /${ scaler })`;
            palette[i].style.width = `${ window.innerWidth / scaler }px`;
            palette[i].style.transform = `scale(${ scaler }) translate(calc(-50% / ${ scaler }), calc((-50% + 1.6 * var(--unit)) / ${ scaler }))`;
        }
        // 세로가 더 긺 == 가로가 더 짧음 == 가로를 기준으로 resize함
        else{
            let scaler = window.innerWidth / 2000;
            palette[i].style.width = "2000px";
            palette[i].style.height = `calc((${ window.innerHeight }px - 3.2 * var(--unit)) / ${ scaler })`;
            palette[i].style.transform = `scale(${ scaler }) translate(calc(-50% / ${ scaler }), calc((-50% + 1.6 * var(--unit)) / ${ scaler }))`;
        }
    }
}


function togglePage(index){
    curPage = index;
    
    for (let i = 0; i < pageCount; i++){
        if (i == index){
            palette[i].style.display = "block";
            pageTab[i].style.boxShadow = "none";
        }
        else{
            palette[i].style.display = "none";
            pageTab[i].style.boxShadow = "0 -.9rem 1.15rem -1.15rem #000 inset";
        }
    }
}



function drawSticker(index, data){
    let sticker = document.createElement("div");
    sticker.id = "Sticker_" + data['dir'];
    sticker.className = "sticker";
    sticker.draggable = false;
    
    let image = document.createElement("img");
    if (data['imgDir'] != "none") image.src = data['imgDir'];
    image.draggable = false;
    
    let stickerText = document.createElement("h1");
    stickerText.innerHTML = data['text'];
    stickerText.style.position = "absolute";
    stickerText.style.left = "50%";
    stickerText.style.top  = "50%";
    stickerText.style.transform = "translate(-50%, -50%)";
    stickerText.style.margin = "0px";
    stickerText.style.fontSize = "4em";
    stickerText.style.userSelect = "none";
    stickerText.style.width = data['size'][0] + "px";
    stickerText.style.textAlign = "center";
    stickerText.draggable = false;
    
    
    
    stickerText.addEventListener("mousedown", () => {
        showPostViewer(sticker, index)
    });
    
    
    
    
    sticker.style.width = data['size'][0] + "px";
    sticker.style.height = data['size'][1] + "px";
    sticker.style.left = data['pos'][0] + "px";
    sticker.style.top = data['pos'][1] + "px";
    sticker.style.transform = "rotate("  + data['rot'] + "deg)";
    sticker.style.position = "absolute";
    sticker.appendChild(image);
    
    // resize, rotate 할 때 사용하는 원 div
    let edgeDivTL = document.createElement("div");
    let edgeDivTR = document.createElement("div");
    let edgeDivBL = document.createElement("div");
    let edgeDivBR = document.createElement("div");
    let rotater = document.createElement("div");
    edgeDivTL.className = "resizer-tl";
    edgeDivTR.className = "resizer-tr";
    edgeDivBL.className = "resizer-bl";
    edgeDivBR.className = "resizer-br";
    rotater.className = "rotater";
    edgeDivTL.draggable = false;
    edgeDivTR.draggable = false;
    edgeDivBL.draggable = false;
    edgeDivBR.draggable = false;
    rotater.draggable   = false;
    
    sticker.appendChild(edgeDivTL);
    sticker.appendChild(edgeDivTR);
    sticker.appendChild(edgeDivBL);
    sticker.appendChild(edgeDivBR);
    sticker.appendChild(rotater);
    sticker.appendChild(stickerText);
    
    displayEdges(sticker, false);
    
    stickers.push(sticker);
    image.addEventListener("mousedown", () => {
        showPostViewer(sticker, index);
    });
    
    edgeDivTL.addEventListener("mousedown", () => {
        editingDiv = sticker;
        body.addEventListener("mousemove", resizeDivTL);
    });
    edgeDivTR.addEventListener("mousedown", () => {
        editingDiv = sticker;
        body.addEventListener("mousemove", resizeDivTR);
    });
    edgeDivBL.addEventListener("mousedown", () => {
        editingDiv = sticker;
        body.addEventListener("mousemove", resizeDivBL);
    });
    edgeDivBR.addEventListener("mousedown", () => {
        editingDiv = sticker;
        body.addEventListener("mousemove", resizeDivBR);
    });
    rotater.addEventListener("mousedown", () => {
        editingDiv = sticker;
        body.addEventListener("mousemove", rotateDiv);
    });

    return sticker;
}

function showPostViewer(sticker, index){
    console.log("a");
    
    editingDiv = sticker;
    if (Editing){
        stickerEditButton.style.opacity = 1;
        deleteStickerButton.style.opacity = 1;
        displayEdges_only(sticker, true);
    }
    else{                        
        // 변수에 현재 열고 있는 폴더 id를 저장
        selectedDir = stickerJson[index]['dir'];

        // ul 태그를 지운 후 새로 그림
        document.querySelector("#hierarchy-viewer ul").remove();
        drawUlWithId(selectedDir);
        
        
        // selectedDir을 id로 하는 노드
        let selectedNode;
        for (let i = 0; i < directoryJson.length; i++){
            if (directoryJson[i]['id'] == selectedDir){
                selectedNode = directoryJson[i];
            }
        }

        document.getElementById("post-title").innerHTML = selectedNode['name'];

        document.querySelector("#veiling-div").style.display = "block";
        
        initiate_image_viewer();
        
        post_viewer.style.display = "grid";

        // document-viewer의 크기를 다시 지정
        resizeDocViewer();
    }

    body.addEventListener("mousemove", moveDiv);
}

function displayEdges(element, on){
    // ? : 삼항연산자
    // (조건문) ? (참이면 쓸 값) : (거짓이면 쓸 값)
    // on이 true 면 "block"을, 아니면 "none"을 사용
    element.querySelector(".resizer-tl").style.display = on ? "block" : "none";
    element.querySelector(".resizer-tr").style.display = on ? "block" : "none";
    element.querySelector(".resizer-bl").style.display = on ? "block" : "none";
    element.querySelector(".resizer-br").style.display = on ? "block" : "none";
    element.querySelector(".rotater").style.display    = on ? "block" : "none";
    element.style.borderStyle = on ? "solid" : "none";
}

function displayEdges_only(element, on){
    if (!Editing) return;
    
    for (let i = 0; i < stickers.length; i++){
        displayEdges(stickers[i], !on);
    }
    displayEdges(element, on);
}

document.addEventListener("mouseup", () => {
    body.removeEventListener("mousemove", resizeDivTL);
    body.removeEventListener("mousemove", resizeDivTR);
    body.removeEventListener("mousemove", resizeDivBL);
    body.removeEventListener("mousemove", resizeDivBR);
    body.removeEventListener("mousemove", rotateDiv);
    body.removeEventListener("mousemove", moveDiv);
    document.querySelector("html").removeEventListener("mousemove", movePostViewer);
    
    body.removeEventListener("mousemove", resize_pv_l);
    body.removeEventListener("mousemove", resize_pv_r);
    body.removeEventListener("mousemove", resize_pv_t);
    body.removeEventListener("mousemove", resize_pv_b);
    
    body.removeEventListener("mousemove", resize_pv_tl);
    body.removeEventListener("mousemove", resize_pv_tr);
    body.removeEventListener("mousemove", resize_pv_bl);
    body.removeEventListener("mousemove", resize_pv_br);
    
    body.removeEventListener("mousemove", moveImage);
    body.removeEventListener("mousemove", resize_hier);
    
    if (doc_viewer != null) doc_viewer.style.zIndex = "0";
});