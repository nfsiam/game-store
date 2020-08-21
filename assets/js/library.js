$(document).ready( ()=>{
   // window.location.replace("http://stackoverflow.com");
    console.log("readyyyy");
    $('.patch-btn').click(function(){

       // window.location.href = "library/patch/"+this.id;
         console.log("patch button clicked !");
         console.log(this.id);
        window.location.href = "library/patch/"+this.id;
    });

    $('.offer-btn').click(function(){
        //window.location.href = "library/offer/"+this.id;
        console.log(this.id);
        window.location.href = "library/offer/"+this.id;
     });
     

} );