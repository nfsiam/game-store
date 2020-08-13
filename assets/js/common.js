var val=0;
$(document).ready(function(){

    $("#notification-btn").click(function(){
      $(".notification-menu").toggle();
    });

    $("#removeall-btn").click(function()
    {
      var btnname = $(this).attr('name');
      
        $.ajax({
          url:"cart/removeitems/",
          method: 'GET',
          success:function(data)
          {
            $('#removeall-btn').html("<script>alert('all items removed!');</script>");
            window.location.href = "/store";
          }
        });
    });
    $("#checkout-btn").click(function()
    {
      var btnname = $(this).attr('name');
      console.log(btnname);
        $.ajax({
          url:"cart/checkout/",
          method: 'GET',
          success:function(data)
          {
             if(data)
             {
                $('#checkout-btn').html(data);
             }
          }

        });
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
        method: 'GET',
        success:function(data)
        {
          $('.cart-menu').html(data);
        }
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
