
  const deleteRestaurant = function(id){
    let deleteUrl = 'http://localhost:3000/api/v1/restaurants/'+id;
    console.log(deleteUrl);
    $.ajax({
      url: deleteUrl,
      contentType: "application/json",
      dataType: 'json',
      type: "DELETE",
      success: function(result){
        console.log(result);
        window.location.href = '/restaurant';
      }
    })
  };


  const updateRestaurant = function(restaurant){
      console.log('hittind script file'); 
    let updateUrl = 'http://localhost:3000/updateRestaurant/'+restaurant._id;
    $.ajax({
      url: updateUrl,
      contentType: "application/json",
    //   body:bodyString,
      dataType: 'json',
      type: "GET",
      success: function(result){
          console.log(result);
          
        //window.location.href = result.request.url;
      }
    })
  }



