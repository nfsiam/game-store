
$(document).ready(function(){

    $("#notification-btn").click(function(){
      $(".notification-menu").toggle();
    });

    $("#cart-btn").click(function(){
     
      $.ajax({
        url:"cart/getitems/",
        method: 'GET',
        success: function(data) {
        
          for(var i=0;i<data.length;i++)
          {
            $(".cart-menu").append("Game name "+data[i].gametitle+"<br>");
           
          }
          
          //console.log(data.aaa);
      },
      });

      $(".cart-menu-wrapper").toggle();
      
    });

    $('#back').click(function(){

      window.location.href = "/publisher/library";
    });


    $(".cart-btn").click(function(){
      console.log(this.id);

      $.ajax({
        url:"store/cart/"+this.id ,
        method: 'GET'

      });
     /*  $.ajax({url: "demo_test.txt", success: function(result){
        $("#div1").html(result);
      }}); */
    });

    $(".buynow-btn").click(function(){
      console.log(this.id);
    });
    $(".wishlist-btn").click(function(){
      console.log(this.id);
    });


    /* $("button").click(function(){
     
    }); */
   





  });
