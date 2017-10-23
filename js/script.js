

/* Slide Show */

var myIndex = 0;

function carousel() {
    var i;
    var x = document.getElementsByClassName("mySlides");
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";  
    }
    if (myIndex >= x.length) {myIndex = 0;}    
    x[myIndex].style.display = "block";
    myIndex++;
    setTimeout(carousel, 2000); // Change image every 2 seconds
}