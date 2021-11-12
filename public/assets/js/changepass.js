$("#password2").focusout(function(){
    var password = $("#password1").val();
    var confirmPassword = $("#password2").val();
    if (password !== confirmPassword){
		$('#password2').val('');
	$(".password-message").html("Please enter valid Password");}
	else{
		$(".password-message").html('');
	}
}
);
$('#passwordForm').on('submit', function (e) {
    e.preventDefault();
	var password = $("#password1").val();
    var confirmPassword = $("#password2").val();
    if(confirmPassword.length!==0 && password.length!==0)
        {
            $('#passwordForm').off('submit').submit()
        }
		else{
			$(".password-message").html("Please enter valid Password");
		}

});
$("#password0").focusout(function(){
    var password = $("#password0").val();
    $.ajax({
        url  : `/account/checkpassword`,
        type : "POST",
        cache:false,
        data : {password},
        success:function(response){
          if (response === "fail") {
            $(".password-message0").html("Wrong Password");
            $('#password0').val('');
          }
          else {
            $(".password-message0").html("");
          }
         }
      });
   

}
);