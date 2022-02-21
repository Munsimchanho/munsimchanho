let TempImageFile = [];
let TempImageURLS = [];
let TempStickerText = [];

// 스티커 수정 버튼 클릭 시
function StickerEdit(){
    if (editingDiv == null) return;
    
    document.querySelector(`input[name="paletteText"]`).value = json[parseInt(editingDiv.id.split("_")[1])]['text'];
    document.getElementById("palette_edit").style.display = "flex";
}

// palette_edit의 저장 버튼 클릭 시
function StickerSaveEdit(){    
    document.querySelector("#palette_edit").style.display = "none";
    
    let index = parseInt(editingDiv.id.split("_")[1]);
    
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