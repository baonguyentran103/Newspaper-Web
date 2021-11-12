$(document).ready(function() {
  $("#verifyOtp").on("click",function(e){
    e.preventDefault();
    const otp = $("#otp").val();
    $.ajax({
      url  : `/account/verify?otp=${otp}`,
      type : "POST",
      cache:false,
      data : {otp:otp},
      success:function(response){
        if (response == "yes") {
          window.location.href='/home';
        }
        if (response =="no") {
          $(".otp-message").html("Please enter valid OTP");
        }        
      }
    });
  });
  $("#verifyPass").on("click",function(e){
    e.preventDefault();
    const otp = $("#otp").val();
    const pass= $("#input_newpass").val();
    $.ajax({
      url  : `/account/verifyotpPass?otp=${otp}`,
      type : "POST",
      cache:false,
      data : {otp:otp, password:pass },
      success:function(response){
        if (response == "yes") {
          window.location.href='/home';
        }
        if (response =="no") {
          $(".otp-message").html("Please enter valid OTP");
        }        
      }
    });
});
});
