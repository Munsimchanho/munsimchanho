let Editing = false;
let editButton = document.getElementById("edit_button");
let saveButton = document.getElementById("save_edit_button");
let stickerEditButton = document.getElementById("sticker_edit_button");
let addStickerButton = document.getElementById("add_sticker_button");
let deleteStickerButton = document.getElementById("delete_sticker_button");

saveButton.style.display = "none";
stickerEditButton.style.display = "none";
addStickerButton.style.display = "none";
deleteStickerButton.style.display = "none";

let editingDiv;

// 연필(수정) 버튼 클릭 시
function Edit(){
    if (loggedIn){
        Editing = true;
        // editButton.style.display = "none";
        saveButton.style.display = "block";
        stickerEditButton.style.display = "block";
        addStickerButton.style.display = "block";
        deleteStickerButton.style.display = "block";
    }
}

// 변경 사항 저장 버튼 클릭 시
function SaveEdit(){    
    Editing = false;
    // editButton.style.display = "block";
    saveButton.style.display = "none";
    
    stickerEditButton.style.opacity = .5;
    
    stickerEditButton.style.display = "none";
    addStickerButton.style.display = "none";
    
    deleteStickerButton.style.opacity = .5;
    deleteStickerButton.style.display = "none";
    
    HidePaletteBar();
    isBarOpened = false;
    
    stickers = [...document.querySelectorAll(".sticker")];
    
    let tempSticker;
    // stickerInfo(json) 수정
    for (let i = 0; i < stickerJson.length; i++){
        if (stickerJson[i] == null) continue;
        
        for (let j = 0; j < stickers.length; j++){
            if (stickers[j].id.split("_")[1] == stickerJson[i]['dir']){
                tempSticker = stickers[j];
                break;
            }
        }
        
        stickerJson[i]['pos'] = [parseFloat(tempSticker.style.left), parseFloat(tempSticker.style.top)];
        stickerJson[i]['rot'] = parseFloat(tempSticker.style.transform.split('(')[1].replace('deg)', ''));
        stickerJson[i]['size'] = [parseFloat(tempSticker.style.width), parseFloat(tempSticker.style.height)];
        if (TempStickerText[i] != null) {
            stickerJson[i]['text'] = TempStickerText[i];
            for (let j = 0; j < directoryJson.length; j++){
                if (directoryJson[j]['id'] == stickerJson[i]['dir']){
                    directoryJson[j]['name'] = stickerJson[i]['text'];
                }
            }
        }
    }
    
    // resize, rotate용 ui 끄기
    for (let i = 0; i < stickers.length; i++){
        displayEdges(stickers[i], false);
    }
    editingDiv = null;
    
    console.log(TempImageFile);
    console.log(stickerJson);
    
    // 이미지를 변경하면 TempImageFile에 파일이, TempImageURLS에 임시 url이 담김
    // 변경 사항 저장 시 이 이미지 파일을 서버에 올림
    for (let i = 0; i < TempImageFile.length; i++){
        if (TempImageFile[i] == null || stickerJson[i] == null) continue;
        
        // 파일의 확장자만 따옴
        let ext = TempImageFile[i].type.split("/")[1];
        console.log(ext);
        
        // 파일의 이름을 img0.284134985.png와 같이 랜덤하게 지정함
        let fname = `img${ Math.random() }.${ ext }`;
        
        let formData = new FormData();
        formData.append("code", "UpdateImage");
        formData.append("user", userName);
        formData.append("delete", stickerJson[i]['imgDir']);
        formData.append("name", fname);
        formData.append("file", TempImageFile[i]);
        ajaxPost(formData, "/src/php/Server.php");
        
        // stickerJson 변수의 imgDir을 변경
        stickerJson[i]['imgDir'] = `../../User/${ userName }/${ fname }`;
    }
    
    
    for (let i = 0; i < deleteImgs.length; i++){
        let formData = new FormData();
        formData.append("code", "DeleteFile");
        formData.append("dir", deleteImgs[i]);
        ajaxPost(formData, "/src/php/Server.php");
    }
    
    for (let i = 0; i < stickerJson.length; i++){
        if (stickerJson[i] == null){
            stickerJson.splice(i, 1);
            --i;
        }
    }
    
    for (let i = 0; i < directoryJson.length; i++){
        if (directoryJson[i] == null){
            directoryJson.splice(i, 1);
            --i;
        }
    }
    
    // StickerInfo.json을 서버에 올림
    let formData = new FormData();
    formData.append("code", "UpdateJson");
    formData.append("user", userName);
    formData.append("json", JSON.stringify(stickerJson));
    ajaxPost(formData, "/src/php/Server.php");
    
    console.log(directoryJson);
    // DirectoryInfo.json을 서버에 올림
    formData = new FormData();
    formData.append("code", "UpdateDirectoryInfo");
    formData.append("user", userName);
    formData.append("json", JSON.stringify(directoryJson));
    ajaxPost(formData, "/src/php/Server.php");
}

//"profolio"