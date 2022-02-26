let TempImageFile = [];
let TempImageURLS = [];
let TempStickerText = [];

function findIndexWithDir(dir, list){
    for (let i = 0; i < list.length; i++){
        if (list[i] == null) continue;
        
        if (list[i]['dir'] == dir){
            return i;
        }
    }
}

// 스티커 수정 버튼 클릭 시
function StickerEdit(){
    if (editingDiv == null) return;
    
    document.querySelector(`input[name="paletteText"]`).value = stickerJson[findIndexWithDir(editingDiv.id.split("_")[1], stickerJson)]['text'];
    document.getElementById("palette_edit").style.display = "flex";
}

// palette_edit의 저장 버튼 클릭 시
function StickerSaveEdit(){    
    document.querySelector("#palette_edit").style.display = "none";
    
    let index = findIndexWithDir(editingDiv.id.split("_")[1], stickerJson);
    
    // 만약 이미지 파일을 업로드 하지 않으면 return
    if (document.querySelector("#stickerImgInput").files.length != 0){
        // 파일을 TempImageFile에 담음
        TempImageFile[index] = document.querySelector("#stickerImgInput").files[0];
        // 파일의 임시 url을 생성하고 이를 TempImageURLS에 담음
        TempImageURLS[index] = window.URL.createObjectURL(TempImageFile[index]);
        
        // img 태그의 src 값을 위에서 만든 임시 url로 바꿈
        editingDiv.querySelector("img").src = TempImageURLS[index];
    }    
    
    // 텍스트를 TempStickerText에 담음
    TempStickerText[index] = document.querySelector(`input[name="paletteText"]`).value;
    document.querySelector(`#${ editingDiv.id } h1`).innerHTML = TempStickerText[index];
    
    //console.log(TempStickerText);
    //console.log(TempImageFile[index]);
    //console.log(TempImageURLS[index]);
}

// 스티커 추가 버튼 클릭 시
function AddSticker(){
    $.ajax({
        url: "/Img/editing.png",
        xhrFields: {
            responseType: 'blob'
        },
        success (data) {
            let id = Date.now();
            let index = stickerJson.length;
            directoryJson.push({"type":"folder","name":"폴더","id":id,"parent":"root"});
            stickerJson.push({"imgDir":"none","text":"폴더","dir":id,"pos":[Math.random() * 1000,Math.random() * 700],"rot":0,"size":[200, 200]});
            TempImageFile[index] = data;
            TempImageURLS[index] = window.URL.createObjectURL(TempImageFile[index]);
            
            console.log(stickerJson.length + ", " + index);
            editingDiv = drawSticker(index, stickerJson[index]);
            palette.appendChild(editingDiv);
            
            
            
            editingDiv.querySelector("img").src = TempImageURLS[index];
        }
    });
}

function DeleteSticker(){
    if (editingDiv == null) return;
    
    let index = findIndexWithDir(editingDiv.id.split("_")[1], stickerJson);
    if (confirm("정말 이 스티커를 삭제하시겠습니까?")){
        let deleteIndex = deleteNode(stickerJson[index]['dir']);
        deleteIndex.push(findIndexWithId(stickerJson[index]['dir'], directoryJson));
        
        for (let i = 0; i < deleteIndex.length; i++){
            directoryJson[deleteIndex[i]] = null;
            //directoryJson.splice(deleteIndex[i], 1);
        }
        //stickerJson.splice(index, 1);
        stickerJson[index] = null;
        // sticker div 제거
        editingDiv.remove();
        editingDiv = null;
        
        stickerEditButton.style.opacity = .5;
        deleteStickerButton.style.opacity = .5;
    }
}

// type: array
function deleteNode(parent){
    let deleteIndex = [];
    for (let i = 0; i < directoryJson.length; i++){
        if (directoryJson[i] == null) continue;
        if (directoryJson[i]['parent'] == parent){
            if (directoryJson[i]['type'] == "folder"){
                //Array.prototype.push.apply(deleteIndex, deleteNode(directoryJson[i]['id']));
                deleteIndex = deleteIndex.concat(deleteNode(directoryJson[i]['id']));
            }
            else{
                deleteIndex.push(i);
            }
        }
    }
    
    console.log(deleteIndex);
    return deleteIndex;
}