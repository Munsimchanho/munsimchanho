let palette = document.getElementById("palette");
let stickers = [];
let json;
let body = document.querySelector("body");
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

// StickerInfo.json을 가져와서 json이라는 변수에 저장함
$.ajax({ 
    url: `/User/${ userName }/StickerInfo.json`,
    method: "GET", 
    dataType: "json" 
   })
.done(function(data) {
    json = data;
    console.log(data);
    
    // palette div에 스티커 div 생성
    for (let i = 0; i < json.length; i++){
        palette.appendChild(drawSticker(i, json[i]));
    }
})

function drawSticker(index, data){
    let sticker = document.createElement("div");
    sticker.id = "Sticker_" + index;
    sticker.className = "sticker";
    sticker.draggable = false;
    
    let image = document.createElement("img");
    image.src = data['imgDir'];
    image.draggable = false;
    
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
    
    displayEdges(sticker, false);
    
    stickers.push(sticker);
    image.addEventListener("mousedown", () => {
        editingDiv = sticker;
        if (Editing){
            stickerEditButton.style.opacity = 1;
            displayEdges_only(sticker, true);
        }
        else{                        
            // 변수에 현재 열고 있는 폴더 id를 저장
            selectedDir = json[index]['dir'];
            
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
            
            post_viewer.style.display = "grid";
            
            // document-viewer의 크기를 다시 지정
            resizeDocViewer();
        }
        body.addEventListener("mousemove", moveDiv);
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
});