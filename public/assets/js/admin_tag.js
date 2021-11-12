$("#add_value").focusout(function(){
    var name_tag = $("#add_value").val();
    $.ajax({
        url  : `/admin/check_tag`,
        type : "POST",
        cache:false,
        data : {name_tag},
        success:function(response){
          if (response === "fail") {
            $(".tag_message").html("Tag Existed");
            $('#add_value').val('');
          }
          else {
            $(".tag_message").html("");
          }
         }
      });
   

}
);
$("#edit_value").focusout(function(){
  var name_tag = $("#edit_value").val();
  $.ajax({
      url  : `/admin/check_tag`,
      type : "POST",
      cache:false,
      data : {name_tag},
      success:function(response){
        if (response === "fail") {
          $(".tag_message").html("Tag Existed");
          $('#edit_value').val('');
        }
        else {
          $(".tag_message").html("");
        }
       }
    });
 

}
);