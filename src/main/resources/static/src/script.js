document.addEventListener('DOMContentLoaded', () => {

    function addPageChanger(buttonID, pagehref){
        document.getElementById(buttonID).addEventListener("click", () => {
        document.body.classList.add("fade-out");
        setTimeout(() => {
            window.location.href = pagehref;
        }, 500); // match transition time
    });
    }
    addPageChanger("dictionaryBtn", "dictionary_page.html")
    addPageChanger("dictionaryBtn", "dictionary_page.html")

    
});
