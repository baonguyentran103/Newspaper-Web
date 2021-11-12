// $("#changeprofile").on("click", function()
// {
//     $("#user-information").hide();
//     $("#change-profile-form").show();
// })
// $("#cancel-form").on("click", function()
// {
//     $("#change-profile-form").hide();
//     $("#user-information").show();
    
// })

$("#submit-form").on("click", function(e)
{
    e.preventDefault();
    var DOB = $('#profileDOB').val();
    const name = $('#profilename').val();
    const email = $('#profilemail').val();
    const pseudonym=$('#profilepseudonym').val();
    if(DOB.length!==0 && name.length!==0&& email.length!==0)
    {
        $.ajax({
            url  : `/account/profile-update`,
            type : "POST",
            cache:false,
            data : {DOB, name, email, pseudonym},
            success:function(response){
              if(response)
              { $("#card-profile").hide();
                $("#otp-confirm").show();
              }
              else
              {
                window.location.href='/account/profile_a';
              }
                
            }
          });
    }
})
$("#verifyOtp").on("click",function(e){
    e.preventDefault();
    const otp = $("#otp").val();
    var DOB = $('#profileDOB').val();
    const name = $('#profilename').val();
    const email = $('#profilemail').val();
    const pseudonym=$('#profilepseudonym').val();
    $.ajax({
      url  : `/account/verifychangeprofile`,
      type : "POST",
      cache:false,
      data : {otp,DOB, name, email,pseudonym },
      success:function(response){
        if (response == "yes") {
          window.location.href='/account/profile_a';
        }
        if (response =="no") {
          $(".otp-message").html("Please enter valid OTP");
        }        
      }
    });
});
$("#profilemail").on("blur",function(e){
  e.preventDefault();
  const mail = $("#profilemail").val();
  $.getJSON(`/account/is-available?mail=${mail}`, function (data) {
    if (data === false) {
      $('#profilemail').val('');
      $(".email-message").html("Please enter valid email");}
    else{
      $(".email-message").html('');
    }
  })
});
$("#assignPre").on("click", function(e){
  $.ajax({
    url  : `/account/assignPremium`,
    type : "POST",
    cache:false,
    success:function(response){
      if (response == "success") {
        Swal.fire("","Request sucess");
      }
      else{
        Swal.fire("","You've sent a request already.");
      }        
    }
  });
})

