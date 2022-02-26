let post_viewer = document.querySelector("#post-viewer");
let upper_bar = document.querySelector("#upper-bar");
let right_viewer = document.querySelector("#right-viewer");
let doc_viewer = document.querySelector("#document-viewer");
let right_viewer_style = window.getComputedStyle(right_viewer);
let pv_resizer_l = document.querySelector("#post-viewer-resizer-l");
let pv_resizer_r = document.querySelector("#post-viewer-resizer-r");
let pv_resizer_t = document.querySelector("#post-viewer-resizer-t");
let pv_resizer_b = document.querySelector("#post-viewer-resizer-b");
let pv_resizer_tl = document.querySelector("#post-viewer-resizer-tl");
let pv_resizer_tr = document.querySelector("#post-viewer-resizer-tr");
let pv_resizer_bl = document.querySelector("#post-viewer-resizer-bl");
let pv_resizer_br = document.querySelector("#post-viewer-resizer-br");

let pvw = "1000px", pvh = "750px", pl = "50%", pt = "50%";
let isFullScreen = false;

$( window ).resize( function() {
    resizeDocViewer();
} );

upper_bar.addEventListener("mousedown", () => {
    // iframe에 event를 뺏기지 않도록 div로 막음
    doc_viewer.style.zIndex = "-1";
    
    document.querySelector("html").addEventListener("mousemove", movePostViewer);
});

upper_bar.addEventListener("dblclick", () => {
    // iframe에 event를 뺏기지 않도록 div로 막음
    doc_viewer.style.zIndex = "-1";
    
    if (!isFullScreen) fullscreen_pv();
    else defullscreen_pv();
    
    isFullScreen = !isFullScreen;
});


pv_resizer_l.addEventListener("mousedown", () => {
   body.addEventListener("mousemove", resize_pv_l);
});
pv_resizer_r.addEventListener("mousedown", () => {
   body.addEventListener("mousemove", resize_pv_r);
});
pv_resizer_t.addEventListener("mousedown", () => {
   body.addEventListener("mousemove", resize_pv_t);
});
pv_resizer_b.addEventListener("mousedown", () => {
   body.addEventListener("mousemove", resize_pv_b);
});

pv_resizer_tl.addEventListener("mousedown", () => {
   body.addEventListener("mousemove", resize_pv_tl);
});
pv_resizer_tr.addEventListener("mousedown", () => {
   body.addEventListener("mousemove", resize_pv_tr);
});
pv_resizer_bl.addEventListener("mousedown", () => {
   body.addEventListener("mousemove", resize_pv_bl);
});
pv_resizer_br.addEventListener("mousedown", () => {
   body.addEventListener("mousemove", resize_pv_br);
});

function resize_pv_tl(e){
    resize_pv_t(e);
    resize_pv_l(e);
}
function resize_pv_tr(e){
    resize_pv_t(e);
    resize_pv_r(e);
}
function resize_pv_bl(e){
    resize_pv_b(e);
    resize_pv_l(e);
}
function resize_pv_br(e){
    resize_pv_b(e);
    resize_pv_r(e);
}

function resize_pv_l(e){
    resize_pv(0, 1, e.clientX, e.clientY);
}
function resize_pv_r(e){
    resize_pv(0, -1, e.clientX, e.clientY);
}
function resize_pv_t(e){
    resize_pv(1, 0, e.clientX, e.clientY);
}
function resize_pv_b(e){
    resize_pv(-1, 0, e.clientX, e.clientY);
}

function resize_pv(vir, hor, x, y){
    if (isFullScreen) return;
    
    let style = window.getComputedStyle(post_viewer);
    
    let ax = parseFloat(style.left) + hor * .5 * parseFloat(style.width), ay = parseFloat(style.top) + vir * .5 * parseFloat(style.height);
    let dx = Math.abs(ax - x), dy = Math.abs(ay - y);
    if (hor != 0 && dx > 700){
        post_viewer.style.width  = dx + "px";
        pvw = dx + "px";
        post_viewer.style.left   = (ax - hor * .5 * dx) + "px";
        pl = (ax - hor * .5 * dx) + "px";
    }
    if (vir != 0 && dy > 400){
        post_viewer.style.height = dy + "px";
        pvh = dy + "px";
        post_viewer.style.top    = (ay - vir * .5 * dy) + "px";
        pt = (ay - vir * .5 * dy) + "px";
    }
    
    
    
    resizeDocViewer();
}

function fullscreen_pv(){
    let style = window.getComputedStyle(post_viewer);
    post_viewer.style.width  = "calc(100vw - 8px)";
    post_viewer.style.left   = "50vw";
    post_viewer.style.height = "calc(100vh - 8px)";
    post_viewer.style.top    = "50vh";
    post_viewer.style.borderRadius = "0px";
	post_viewer.style.gridTtemplateColumns = "1fr 3fr";
	
    
    resizeDocViewer();
}

function defullscreen_pv(){
    let style = window.getComputedStyle(post_viewer);
    post_viewer.style.width  = pvw;
    post_viewer.style.left   = pl;
    post_viewer.style.height = pvh;
    post_viewer.style.top    = pt;
    post_viewer.style.borderRadius = "15px";
	post_viewer.style.gridTtemplateColumns = "250px 1fr";
	
    
    resizeDocViewer();
}












function resizeDocViewer(){
    if (doc_viewer.tagName.toLocaleLowerCase() == "iframe" && !doc_viewer.classList.contains("docs")){
        let doc_viewer_scaler = parseFloat(right_viewer_style.width) / 1600;
    
        doc_viewer.style.height = ((1600 * parseFloat(right_viewer_style.height) / parseFloat(right_viewer_style.width)) - 2) + "px";

        doc_viewer.style.transform = `translate(${ -50 * (1-doc_viewer_scaler) }%, ${ -50 * (1-doc_viewer_scaler) }%) scale(${ doc_viewer_scaler })`;
    }
    else {
        doc_viewer.style.width  = right_viewer_style.width ;
        doc_viewer.style.height = `calc(${ right_viewer_style.height } - 2px)`;
    }
}

// post-viewer 이동
function movePostViewer(e){
    if (isFullScreen){
        defullscreen_pv();
        isFullScreen = false;
        
        console.log(e.clientX / window.innerWidth);
        
        post_viewer.style.left = (e.clientX - ((e.clientX / window.innerWidth) * parseFloat(post_viewer.style.width) - .5 * (parseFloat(post_viewer.style.width)))) + "px";
        post_viewer.style.top = (.25 * parseFloat(window.getComputedStyle(upper_bar).height) + .5 * parseFloat(post_viewer.style.height)) + "px";
    }
    
    // left값과 top값을 불러와 l, t에 저장
    let l = parseFloat(window.getComputedStyle(post_viewer).left), t = parseFloat(window.getComputedStyle(post_viewer).top);
    
	
    //~심채린이 위의 작업을 기다리며 머문 공간입니다. 들러서 쉬었다 가세요~
	// 이동 중 🚗🚓🚕
	// 도착하였습니다~
    // |문🚪|(화장실🚽🚽🧻🚿🛁🧼) ((침대🛏)   (책상 ✍💻🖱 )|문🚪|
	// 생각이 잘 안 될 때는.... 생각하는 의자를 찾으세요.
	//  생각하는 의자-----> 🪑 
	
	
    // left와 top의 값에 마우스의 움직인 거리를 더해 저장 
    post_viewer.style.left = (l + e.movementX) + "px";
    post_viewer.style.top  = (t + e.movementY) + "px";
}