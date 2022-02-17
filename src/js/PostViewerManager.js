let post_viewer = document.querySelector("#post-viewer");
let right_viewer = document.querySelector("#right-viewer");
let doc_viewer = document.querySelector("#document-viewer");
let right_viewer_style = window.getComputedStyle(right_viewer);

$( window ).resize( function() {
    resizeDocViewer();
} );


function resizeDocViewer(){
    let doc_viewer_scaler = parseFloat(right_viewer_style.width) / 1600;
    
    doc_viewer.style.height = (1600 * parseFloat(right_viewer_style.height) / parseFloat(right_viewer_style.width)) + "px";

    doc_viewer.style.transform = `translate(${ -50 * (1-doc_viewer_scaler) }%, ${ -50 * (1-doc_viewer_scaler) }%) scale(${ doc_viewer_scaler })`;
}