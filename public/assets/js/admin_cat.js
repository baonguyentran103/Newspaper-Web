$("#add_name").focusout(function(){
  var name_cat = $("#add_name").val();
  $.ajax({
      url  : `/admin/check_cat`,
      type : "POST",
      cache:false,
      data : {name_cat},
      success:function(response){
        if (response === "fail") {
          $(".cat_message").html("Category Existed");
          $('#add_name').val('');
        }
        else {
          $(".cat_message").html("");
        }
        }
    });
  }
);


$("#edit_name").focusout(function(){
  var name_cat = $("#edit_name").val();
  $.ajax({
      url  : `/admin/check_cat`,
      type : "POST",
      cache:false,
      data : {name_cat},
      success:function(response){
        if (response === "fail") {
          $(".cat_message").html("Category Existed");
          $('#edit_name').val('');
        }
        else {
          $(".cat_message").html("");
        }
        }
    });
  }
);
    
$("#add_del_A").on("click", function(e){
  // e.preventDefault();
  var cateID = $("#add_del_sub").val();
  $.ajax({
      url  : `/admin/check_cateDad`,
      type : "POST",
      cache:false,
      data : {cateID},
      success:function(response){
        if (response === "fail") {
          Swal.fire("","It's parent Category have not actived.");
          $("#myModal_Add_Del").modal("hide"); 
        }
        else {
          $("#myModal_Add_Del").modal("hide"); 
          window.location.href=response, true;
        }
        return false;
      }
    });
  }
);
    
    