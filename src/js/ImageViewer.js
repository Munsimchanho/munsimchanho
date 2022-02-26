let img_viewer;
let img_scale = 1;

// e.deltaY: 위로 드래그 (-100), 아래로 드래그 (100)
function resizeImage(e){
    e.preventDefault();
    
    img_scale += e.deltaY * -0.002;

    // Restrict scale
    img_scale = Math.min(Math.max(.8, img_scale), 4);

    // Apply scale transform
    let mtrx = window.getComputedStyle(img_viewer).transform;
    
    mtrx = mtrx.replace("matrix(", "").replace(")", "").split(", ");

    
    img_viewer.style.transform = `matrix(${ img_scale }, 0, 0, ${ img_scale }, ${ parseInt(mtrx[4]) }, ${ parseInt(mtrx[5]) })`;

    moveImage(e);
}

function clamp(val, min, max){
    return Math.min(Math.max(val, min), max);
}

function moveImage(e){ 
    let parstyle = window.getComputedStyle(right_viewer);
    let style = window.getComputedStyle(img_viewer);
    let mtrx = style.transform;

    mtrx = mtrx.replace("matrix(", "").replace(")", "").split(", ");
    
    // 움직일 수 있는 거리
    let dx = Math.max(0, parseFloat(style.width ) * img_scale - parseFloat(parstyle.width )) / 2;
    let dy = Math.max(0, parseFloat(style.height) * img_scale - parseFloat(parstyle.height)) / 2;
    if (dx == 0 || dy == 0){
        dx = 0; dy = 0;
    }

    let x = clamp(parseInt(mtrx[4]) + e.movementX, -dx, dx);
    let y = clamp(parseInt(mtrx[5]) + e.movementY, -dy, dy);

    img_viewer.style.transform = `matrix(${ img_scale }, 0, 0, ${ img_scale }, ${ x }, ${ y })`;
}