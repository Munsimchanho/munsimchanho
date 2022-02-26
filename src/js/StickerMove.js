// 스티커를 이동할 때 실행되는 함수
// eventListener에서 실행하므로 e를 매개변수로 받음 (mousemove)
function moveDiv(e){    
    if (!Editing) return;
    
    console.log("move2");
    let divStyle = window.getComputedStyle(editingDiv);
    // left값과 top값을 불러와 l, t에 저장
    let l = parseFloat(divStyle.left), t = parseFloat(divStyle.top);
    
    // left와 top의 값에 마우스의 움직인 거리를 더해 저장
    editingDiv.style.left = (l + e.movementX) + "px";
    editingDiv.style.top  = (t + e.movementY) + "px";
}

function resizeDivTL(e){
    resizeDiv(e.clientX, e.clientY, false, false);
}
function resizeDivTR(e){
    resizeDiv(e.clientX, e.clientY, false, true);
}
function resizeDivBL(e){
    resizeDiv(e.clientX, e.clientY, true, false);
}
function resizeDivBR(e){
    resizeDiv(e.clientX, e.clientY, true, true);
}

// clientX,Y: event의 마우스 pos
// isTop,LeftAnc: 고정되는 지점이 어디인지 표시
function resizeDiv(clientX, clientY, isTopAnc, isLeftAnc){
    if (!Editing) return;
    
    // 회전값을 받아옴
    let rotate = editingDiv.style.transform;
    rotate = parseFloat(rotate.split('(')[1].replace('deg)', '')); 
    
    // w,h: 가로 세로 크기
    let w  = parseFloat(editingDiv.style.width) ;
    let h  = parseFloat(editingDiv.style.height);
    
    // cx, cy: div의 중심의 위치
    let cx = parseFloat(editingDiv.style.left) + .5 * w;
    let cy = parseFloat(editingDiv.style.top)  + .5 * h;
    
    // div의 angle에 대한 cos값과 sin값을 미리 계산
    let cos = Math.cos(rotate * Math.PI / 180);
    let sin = Math.sin(rotate * Math.PI / 180);
    
    // 고정되는 지점에 따라 1과 -1의 값을 가짐
    let xf = isLeftAnc ? -1 : 1;
    let yf = isTopAnc  ? -1 : 1;
    
    // 고정되는 지점의 좌표
    let ax = cx + .5 * xf * (w * cos - xf * yf * h * sin);
    let ay = cy + .5 * yf * (h * cos + xf * yf * w * sin);
    
    // 마우스와 고정되는 지점 사이의 거리
    let dx = ax - clientX;
    let dy = ay - clientY;
    
    // width와 height를 계산함
    // width와 height가 20보다 작지 않도록 보정
    w = Math.max(xf * (cos * dx + sin * dy), 20);
    h = Math.max(yf * (cos * dy - sin * dx), 20);
    
    // div의 중심 위치를 다시 계산
    cx = .5 * (2 * ax - (w * cos * xf - h * sin * yf));
    cy = .5 * (2 * ay - (w * sin * xf + h * cos * yf));
    
    editingDiv.style.width  = w + "px";
    editingDiv.style.height = h + "px";    
    editingDiv.style.left   = (cx - .5 * w) + "px";
    editingDiv.style.top    = (cy - .5 * h) + "px";
}

// 스티커를 회전할 때 실행하는 함수
function rotateDiv({clientX, clientY}){
    if (!Editing) return;
    
    // div의 중심 좌표를 받아옴
    let w  = parseFloat(editingDiv.style.width) ;
    let h  = parseFloat(editingDiv.style.height);
    let cx = parseFloat(editingDiv.style.left) + .5 * w;
    let cy = parseFloat(editingDiv.style.top)  + .5 * h;
    
    // atan2로 각도 계산 (-PI/2~PI/2)
    let angle = Math.atan2(clientX - cx, cy - clientY);
    
    editingDiv.style.transform = `rotate(${angle * 180 / Math.PI}deg)`;
}