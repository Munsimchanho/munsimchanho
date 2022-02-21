let Editing = false;
let editButton = document.getElementById("edit_button");
let saveButton = document.getElementById("save_edit_button");
let stickerEditButton = document.getElementById("sticker_edit_button");
saveButton.style.display = "none";
stickerEditButton.style.display = "none";

let editingDiv;

// 연필(수정) 버튼 클릭 시
function Edit(){
    let formData = new FormData();
    formData.append("code", "check");
    
    $.ajax({
        url         : "/src/php/Login.php",
        type        : "POST",
        dataType    : 'html',
        enctype     : "multipart/form-data",
        processData : false,
        contentType : false,
        data        : formData,
        async       : false,
        success     : function(res){
            console.log(res);
            if (res == userName){
                Editing = true;
                editButton.style.display = "none";
                saveButton.style.display = "block";
                stickerEditButton.style.display = "block";
            }
        }
    });
}

// 변경 사항 저장 버튼 클릭 시
function SaveEdit(){
    Editing = false;
    editButton.style.display = "block";
    saveButton.style.display = "none";
    stickerEditButton.style.opacity = .5;
    stickerEditButton.style.display = "none";
    
    // stickerInfo(json) 수정
    for (let i = 0; i < stickers.length; i++){
        json[i]['pos'] = [parseFloat(stickers[i].style.left), parseFloat(stickers[i].style.top)];
        json[i]['rot'] = parseFloat(stickers[i].style.transform.split('(')[1].replace('deg)', ''));
        json[i]['size'] = [parseFloat(stickers[i].style.width), parseFloat(stickers[i].style.height)];
        if (TempStickerText[i] != null) {
            json[i]['text'] = TempStickerText[i];
            for (let j = 0; j < directoryJson.length; j++){
                if (directoryJson[j]['id'] == json[i]['dir']){
                    directoryJson[j]['name'] = json[i]['text'];
                }
            }
        }
    }
    
    // resize, rotate용 ui 끄기
    for (let i = 0; i < stickers.length; i++){
        displayEdges(stickers[i], false);
    }
    editingDiv = null;
    
    // 이미지를 변경하면 TempImageFile에 파일이, TempImageURLS에 임시 url이 담김
    // 변경 사항 저장 시 이 이미지 파일을 서버에 올림
    for (let i = 0; i < TempImageFile.length; i++){
        if (TempImageFile[i] == null) continue;
        
        // 파일의 확장자만 따옴
        let ext = TempImageFile[i].type.split("/")[1];
        console.log(ext);
        
        // 파일의 이름을 img0.284134985.png와 같이 랜덤하게 지정함
        let fname = `img${ Math.random() }.${ ext }`;
        
        let formData = new FormData();
        formData.append("code", "UpdateImage");
        formData.append("user", userName);
        formData.append("delete", json[i]['imgDir']);
        formData.append("name", fname);
        formData.append("file", TempImageFile[i]);
        
        $.ajax({
            url         : "/src/php/Server.php",
            type        : "POST",
            dataType    : 'html',
            enctype     : "multipart/form-data",
            processData : false,
            contentType : false,
            data        : formData,
            async       : false,
            success     : function(res){ }
        });
        
        // json 변수의 imgDir을 변경
        json[i]['imgDir'] = `../../User/${ userName }/${ fname }`;
    }
    
    // StickerInfo.json을 서버에 올림
    formData = new FormData();
    formData.append("code", "UpdateJson");
    formData.append("user", userName);
    formData.append("json", JSON.stringify(json));

    $.ajax({
        url         : "/src/php/Server.php",
        type        : "POST",
        dataType    : 'html',
        enctype     : "multipart/form-data",
        processData : false,
        contentType : false,
        data        : formData,
        async       : false,
        success     : function(res){ }
    });
    
    console.log(directoryJson);
    // DirectoryInfo.json을 서버에 올림
    formData = new FormData();
    formData.append("code", "UpdateDirectoryInfo");
    formData.append("user", userName);
    formData.append("json", JSON.stringify(directoryJson));

    $.ajax({
        url         : "/src/php/Server.php",
        type        : "POST",
        dataType    : 'html',
        enctype     : "multipart/form-data",
        processData : false,
        contentType : false,
        data        : formData,
        async       : false,
        success     : function(res){ }
    });
}

//interfolio
//hifolio
//postfolio
//portfolism
//benefolio
//"profolio"
//extrafolio
//portpolyo(io)
//codefolio
//doctype portfolio
//metafolio  이미 있음
//monofolio  이미 있음
//polyfolio  이미 있음
//perifolio  이미 있음 (스페인어)
//transfolio 이미 있음
//tetrafolio 이미 있음