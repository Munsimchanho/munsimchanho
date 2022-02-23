let fileLi;
let folderLi;
let selectedDir;

//포스팅 창 닫기
function ClosePostViewer(){
    console.log("a");
    document.querySelector("#post-viewer").style.display = "none";
    document.querySelector("#veiling-div").style.display = "none";
}

// checkbox 값 변경 시 폴더 여닫는 기능
function selectLi(elem){
    // ul 객체를 받아옴 (li의 부모 div의 부모 ul)
    let uls = elem.parentNode.parentNode.querySelector("ul");
    // checked가 true면 닫힘
    uls.style.display = (elem.checked == true) ? "none": "list-item";
}

// 특정 노드에 대해 자식 폴더/파일을 li, ul로 생성
function drawUl(node){
    let ul = document.createElement("ul");
    
    let folderNodes = [], fileNodes = [];
    for (let i = 0; i < directoryJson.length; i++){
        // 자식 노드이면
        if (directoryJson[i]['parent'] == node['id']){
            if (directoryJson[i]['type'] == "folder"){
                folderNodes.push(directoryJson[i]);
            }
            else {
                fileNodes.push(directoryJson[i]);
            }
        }
    }
    
    // sort는 배열을 받아서 정렬하는 함수
    // 어떤 기준으로 정렬할지에 대한 함수가 sort 함수의 인자로 들어감
    // 지금 같은 경우는 원소 2개를 a, b로 받은 다음 비교
    // 이름을 기준으로 비교하기 때문에 a['name']을 사용
    // 문자열의 경우 a가 b보다 사전 순으로 앞이면 a < b
    
    // 비교 함수는 반환값이 -1이면 a가 b보다 앞, 0이면 같음, 1이면 a가 b보다 뒤에 옴을 알려줌    
    
    // 알파벳 순서대로 정렬
    folderNodes.sort(function(a, b)  {
        if(a['name'] < b['name']) return -1;
        if(a['name'] > b['name']) return 1;
        if(a['name'] === b['name']) return 0;
    });
    fileNodes.sort(function(a, b)  {
        if(a['name'] < b['name']) return -1;
        if(a['name'] > b['name']) return 1;
        if(a['name'] === b['name']) return 0;
    });    
    
    // folderNodes와 fileNodes를 childrenNode라는 변수에 합치기
    let childrenNode = folderNodes.concat(fileNodes);
    
    // 자식 li, ul 객체 생성
    for (let i = 0; i < childrenNode.length; i++){
        // 폴더인 경우
        if (childrenNode[i]['type'] == 'folder'){
            ul.appendChild(drawFolderLi(childrenNode[i]));
        }
        else{ // 파일인 경우
            ul.appendChild(drawFileLi(childrenNode[i]));
        }
    }
    
    return ul;
}


let directoryJson;
let hierarchy_viewer = document.getElementById("hierarchy-viewer");
let isFolderClosed = {}; // dictionary/ "id": true/false

// 서버에서 DirectoryInfo.json파일을 받아옴, ul 객체를 그림
$.ajax({ 
    // 캐시 사용을 피하기 위해 주소를 매번 다르게 지정
    url: `/User/${ userName }/DirectoryInfo.json?a=${ Math.random() }`,
    method: "GET", 
    dataType: "json" 
})
.done(function(data) {
	//DirectoryInfo.json의 정보가 이제 directoryJson 이라는 변수에 저장됨
    directoryJson = data;
    //console.log("a")
    console.log(directoryJson);
    
    // isFolderClosed에 directoryJson의 id값과 opened값을 부여함
    //! 파일의 생성, 삭제 시 isFolderClosed도 수정해야 함
    for (let i = 0; i < directoryJson.length; i++){
        if (directoryJson[i]['type'] != "folder") continue;
        //console.log(directoryJson[i]['id'])
        
        // isFolderClosed: dictionary
        // 키 값이 directoryJson[i]['id']인 것의 값을 true로 설정
        isFolderClosed[directoryJson[i]['id']] = true;
    }        
    
    // ul 객체를 그림 
	// ul이 존재하지 않을 경우 초기화에 에러가 발생할 수 있음 
	// 초기화 할 ul이 언제나 존재하도록 임시 ul을 넣어줌
    let tempUl = document.createElement("ul");
    tempUl.id = "tempUl";
    hierarchy_viewer.appendChild(tempUl);
})
.catch(function(e) {
   console.log(e) ;
});



// directoryJson 변수를 이용해 ul 객체를 그림
function drawUlWithId(folderId){
    console.log(isFolderClosed);
    
    // #hierarchy_viewer의 자식에 트리구조 생성
    for (let i = 0; i < directoryJson.length; i++){
        if (directoryJson[i]['id'] != folderId) continue; // 원하는 노드에 대해서만 실행함
        
        let parentUl = document.createElement("ul");
        parentUl.appendChild(drawFolderLi(directoryJson[i]));
        hierarchy_viewer.appendChild(parentUl);
        document.getElementById(folderId).draggable = false;
        document.getElementById(folderId).classList.remove("draggable");
        break;
    }
    
    // 모든 폴더의 열고 닫힘을 적용함
    document.querySelectorAll(`input[type="checkbox"]`).forEach(checkbox => {
        selectLi(checkbox);
    });
    
    // dnd(drag & drop) 기능 구현
    // 파일, 폴더 li에 draggable이라는 className가 부여됨
    // 폴더 li에 container라는 className가 부여됨
    const draggables = document.querySelectorAll(".draggable");
    const containers = document.querySelectorAll(".container");

    // drag 가능한 객체에 대해 eventListener 생성
    draggables.forEach(draggable => {
        draggable.addEventListener("dragstart", () => {
            draggable.classList.add("dragging");
        });
        
        draggable.addEventListener("dragend", () => {
            draggable.classList.remove("dragging");
            
            let folderDropContainer = document.querySelector(".dropContainer");
            
            if (folderDropContainer != null){                
                // drag 한 객체의 id(childId)와 drop 한 객체의 id(parentId)를 받음
                let childId = draggable.id;
                let parentId = folderDropContainer.id;
                
                if (childId == parentId) return;

                //console.log(childId + ", " + parentId);

                for (let i = 0; i < directoryJson.length; i++){
                    // directoryJson 변수에서 id가 childId인 노드를 찾음
                    if (directoryJson[i]['id'] == childId){
                        // 그 노드의 parent를 parentId로 바꿈
                        directoryJson[i]['parent'] = parentId;
                        //console.log(directoryJson);
                        break;
                    }
                }
                
                // 수정한 directoryJson을 서버에 올림
                let formData = new FormData();
                formData.append("code", "UpdateDirectoryInfo");
                formData.append("user", userName);
                formData.append("json", JSON.stringify(directoryJson));
                ajaxPost(formData, "/src/php/Server.php");

                // isFolderOpened를 수정함
                updateIsFolderClosed();
            }
            
            // ul 태그를 삭제함
            document.querySelector("#hierarchy-viewer ul").remove();
            
            // 수정된 directoryJson(변수)를 바탕으로 ul 태그를 다시 그림
            drawUlWithId(selectedDir);
        });
    });
    
    // drop 가능한 객체에 대해 eventListener 생성
    containers.forEach(container => {
        // dragover 되면 dropContainer 라는 className 부여
        container.addEventListener("dragover", e => {
            // 원래 파일을 drag & drop 하면 브라우저에서 그 파일을 띄움 (리다이렉트 됨)
            // 이를 방지하기 위해 preventDefault()를 사용함
            e.preventDefault();
            container.classList.add("dropContainer");
        });

        // dragleave 되면 dropContainer 라는 className 삭제
        container.addEventListener("dragleave", e => {
            container.classList.remove("dropContainer");
        });
        
        container.addEventListener("drop", ev => {
            ev.preventDefault();
            
            // 파일 받아옴 //👍😊
            // 파일 서버 올림, dir 설정 //👍
            // directoryJson(var) 수정 //👍
            // directoryInfo.json 올리기 //👍
            // ul 다시 그리기 //👍
                                    
            let file;
            
            if (ev.dataTransfer.items) {
                if (ev.dataTransfer.items.length == 1){
                    if (ev.dataTransfer.items[0].kind === 'file') {
                        file = ev.dataTransfer.items[0].getAsFile();
                    }
                }
            }
            else {
                if (ev.dataTransfer.files.length == 1){
                    file = ev.dataTransfer.files[0];
                }                
            }
                        
            if (file != null){
                let fileAlreadyExists = false;
                for (let i = 0; i < directoryJson.length; i++){
                    if (directoryJson[i]['name'] == file['name']){
                        fileAlreadyExists = true;
                        break;
                    }
                }
                                
                if (!fileAlreadyExists){
                    console.log("a");
                    
                    let curTime = Date.now();
                    // 파일의 확장자만 따옴
                    let ext = file.name.split(".");
                    ext = ext[ext.length - 1].toLocaleLowerCase();
                    
                    const imgs = ['gif', 'jpg', 'jpeg', 'png', 'bmp' ,'ico', 'apng'];  
                    const docs = ['pdf'];
                    let ftype = "file";
                    
                    if (imgs.includes(ext)){
                        console.log("It's an image!");
                        ftype = "image";
                    }
                    else if (docs.includes(ext)) {
                        console.log("It's an docs file!");
                        ftype = "docs";
                    }
                    else {
                        return;
                    }

                    // 파일의 이름을 img0.284134985.png와 같이 랜덤하게 지정함
                    let fname = `${ curTime }.${ ext }`;
                    // directoryJson 수정
                    directoryJson.push({"type": ftype, "name": file['name'], "id": curTime, "parent": container.id, "dir": `../../User/${ userName }/Files/${ fname }`});
                    
                    
                    // 파일 업로드
                    let formData = new FormData();
                    formData.append("code", "UploadFile");
                    formData.append("user", userName);
                    formData.append("name", fname);
                    formData.append("file", file);
                    ajaxPost(formData, "/src/php/Server.php");
                    
                    
                    // 수정한 directoryJson을 서버에 올림
                    formData = new FormData();
                    formData.append("code", "UpdateDirectoryInfo");
                    formData.append("user", userName);
                    formData.append("json", JSON.stringify(directoryJson));
                    ajaxPost(formData, "/src/php/Server.php");
                    
                    // isFolderOpened를 수정함
                    updateIsFolderClosed();
                    
                    // ul 태그를 삭제함
                    document.querySelector("#hierarchy-viewer ul").remove();
                    
                    // ul 다시 그리기
                    drawUlWithId(selectedDir);
                }
            }
        });
    });
}







function drawFolderLi(node){
    // 자식 객체를 포함하는 폴더 li 생성
    let li = document.createElement("li");

    // 폴더 노드 하나에 대한 li 생성
    let innerLi = document.createElement("div");
    innerLi.id = node['id'];

    // 체크박스 생성
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = node['id'] + "-checkbox";

    // checkbox의 값(checked)이 바뀌면 onchange라는 event가 발생 (기본 제공 event)
    // eventListener로 받아서 사용할 수도 있지만
    // input 태그에 onchange="함수()"라는 속성을 부여할 수도 있음
    // -> 값이 바뀌면 selectLi()를 실행하는데 그 인자로 해당 checkbox 객체 (=this)를 넘김
    checkbox.setAttribute("onchange", "selectLi(this)");

    // isFolderClosed의 값을 받아와 checkbox.checked에 적용함
    checkbox.checked = isFolderClosed[node['id']];

    // 폴더의 아이콘을 표시할 label
    let iconLabel = document.createElement("label");
    // for: label 태그의 속성
    // input 태그는 css로 꾸미기 쉽지 않음
    // label에 for="input.id"라는 속성을 줌 (input 태그에 관련된 event를 label 태그가 대신 받아줌)
    iconLabel.setAttribute("for", node['id'] + "-checkbox");
    iconLabel.className = "label-folder";

    // 폴더의 이름을 표시할 label (폴더의 아이콘을 클릭했을 때만 여닫을 수 있도록 하기 위해 분리)
    let nameLabel = document.createElement("label");
    nameLabel.innerHTML = node['name'];

    // 이들을 폴더 노드 하나에 대한 li의 자식으로 추가
    innerLi.appendChild(checkbox);
    innerLi.appendChild(iconLabel);
    innerLi.appendChild(nameLabel);
    innerLi.className = "folderLi draggable container";
    innerLi.draggable = "true";

    // 클릭하면 selected라는 className 부여
    innerLi.addEventListener("mousedown", () => {
        // 이미 selected 된 객체가 있을 수 있음
        // 그걸 selected라는 className을 제거
        let selectedLi = document.querySelector(".selected");
        if (selectedLi != null) selectedLi.classList.remove("selected");
        // 선택한 객체에 selected라는 className 부여
        innerLi.classList.add("selected");
    });

    // 폴더 전체 li에 innerLi를 추가
    li.appendChild(innerLi);

    // 폴더 전체 li에 자식 객체(파일/폴더) 추가
    li.appendChild(drawUl(node));
    
    return li;
}

function drawFileLi(node){
    // 파일 li 생성
    let li = document.createElement("li");
    li.id = node['id'];
    li.className = "fileLi draggable";
    li.draggable = "true";

    // label을 담을 div 생성
    let divElem = document.createElement("div");                

    // 파일 이름 용 label
    let nameLabel = document.createElement("label");
    nameLabel.innerHTML = node['name'];
    nameLabel.className = "label-file";

    // 클릭하면 selected라는 className 부여
    divElem.addEventListener("mousedown", () => {
        // 이미 selected 된 객체가 있을 수 있음
        // 그걸 selected라는 className을 제거
        let selectedLi = document.querySelector(".selected");
        if (selectedLi != null) selectedLi.classList.remove("selected");
        // 선택한 객체에 selected라는 className 부여
        divElem.classList.add("selected");
    });

    // 더블 클릭
    divElem.addEventListener('dblclick', () => {
        for (let j = 0; j < directoryJson.length; j++){
            if (directoryJson[j]['id'] == divElem.parentNode.id){
                let dir = directoryJson[j]['dir'];

                switch (directoryJson[j]['type']){
                    case 'image':
                        document.querySelector("#document-viewer").remove();
                        doc_viewer = document.createElement("img");
                        doc_viewer.src = dir;
                        doc_viewer.style.zIndex = "-1";
                        break;
                        
                    case 'docs':
                        document.querySelector("#document-viewer").remove();
                        doc_viewer = document.createElement("iframe");
                        doc_viewer.classList.add("docs");
                        doc_viewer.src = dir + "#toolbar=0&navpanes=0&scrollbar=0";
                        doc_viewer.style.zIndex = "0";
                        break;

                    case 'website-url':
                        document.querySelector("#document-viewer").remove();
                        doc_viewer = document.createElement("iframe");
                        doc_viewer.src = dir;
                        break;
                }
                doc_viewer.id = "document-viewer";
                doc_viewer.draggable = false;
                right_viewer.appendChild(doc_viewer);
                resizeDocViewer();
                break;
            }
        }
    });

    // 파일 divElem에 label 추가
    divElem.appendChild(nameLabel);


    // 파일 li에 divElem 추가
    li.appendChild(divElem);
    
    return li;
}

function updateIsFolderClosed(){
    for (let i = 0; i < directoryJson.length; i++){
        if (directoryJson[i]['type'] != "folder") continue;
        let cb = document.getElementById(`${ directoryJson[i]['id'] }-checkbox`);
        if (cb == null) continue;
        isFolderClosed[directoryJson[i]['id']] = cb.checked;
    }
}

function ajaxPost(formData, url){
    $.ajax({
        url         : url,
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