let post_viewer = document.querySelector("#post-viewer");
let upper_bar = document.querySelector("#upper-bar");
let right_viewer = document.querySelector("#right-viewer");
let doc_viewer = document.querySelector("#document-viewer");
let right_viewer_style = window.getComputedStyle(right_viewer);

$( window ).resize( function() {
    resizeDocViewer();
} );

upper_bar.addEventListener("mousedown", () => {
    // iframe에 event를 뺏기지 않도록 div로 막음
    doc_viewer.style.zIndex = "-1";
    document.querySelector("html").addEventListener("mousemove", movePostViewer);
});

function resizeDocViewer(){
    let doc_viewer_scaler = parseFloat(right_viewer_style.width) / 1600;
    
    doc_viewer.style.height = (1600 * parseFloat(right_viewer_style.height) / parseFloat(right_viewer_style.width)) + "px";

    doc_viewer.style.transform = `translate(${ -50 * (1-doc_viewer_scaler) }%, ${ -50 * (1-doc_viewer_scaler) }%) scale(${ doc_viewer_scaler })`;
}

// post-viewer 이동
function movePostViewer(e){
    // left값과 top값을 불러와 l, t에 저장
    let l = parseFloat(window.getComputedStyle(post_viewer).left), t = parseFloat(window.getComputedStyle(post_viewer).top);
    
    // left와 top의 값에 마우스의 움직인 거리를 더해 저장
    post_viewer.style.left = (l + e.movementX) + "px";
    post_viewer.style.top  = (t + e.movementY) + "px";
}