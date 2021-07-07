export default class StyleFix{
    constructor(){
        var h = window.screen.height;
        document.getElementsByClassName("App")[0].style.height = h+"px";
    }
}
