// $('#frmRegister').on('submit', function (e) {
//     e.preventDefault();

//     const username = $('#inputUser').val();
//     if (username.length === 0) {
//       alert('Invalid data.');
//       return;
//     }

//     $.getJSON(`/account/is-available?user=${username}`, function (data) {
//       if (data === false) {
//         alert('Not available!');
//       } else {
//         const password =$('inputPassword1').val();
//         const password_confirm =$('inputPassword2').val();
//         if(password_confirm!==password) {

//         }
//       }
//     });

//   })
//   $('#frmRegister').off('submit').submit();
$('#inputUser').focusout(function(){
        const username = $('#inputUser').val();
        if (username.length === 0) {
        // alert('Invalid data user');
        Swal.fire("","Invalid data user"); 
    }
    else
    { 
        $.getJSON(`/account/is-available?user=${username}`, function (data) {
        if (data === false)
        {
            $(".user-alert").html('Not available user!');
            $('#inputUser').val('');
        }
        else{
            $(".user-alert").html('');
        }})
    }})
        
        

$("#inputPassword2").focusout(function(){
    var password = $("#inputPassword1").val();
    var confirmPassword = $("#inputPassword2").val();
    if (password !== confirmPassword){
            $(".password-alert").html('Passwords do not match');
            $('#inputPassword2').val('');
        }
        else{
            $(".password-alert").html('');
        }
});
$('#inputMail').focusout(function(){
    const mail = $('#inputMail').val();
    if (mail.length === 0) {
    //alert('Invalid data mail');
    Swal.fire("","Invalid data mail"); 
    
}else{ 
    $.getJSON(`/account/is-available?mail=${mail}`, function (data) {
    if (data === false) {
            $(".email-alert").html('Not available email!');
            $('#inputMail').val('');
        }
        else{
            $(".email-alert").html('');
        }})
}})
$('#frmRegister').on('submit', function (e) {
    e.preventDefault();
    const username = $('#inputUser').val();
    var password = $("#inputPassword1").val();
    var confirmPassword = $("#inputPassword2").val();
    const name = $('#inputName').val();
    const email = $('#inputMail').val();
    if(username.length!==0 && password.length!==0&& confirmPassword.length!==0
        && name.length!==0 && email.length!==0)
        {
            $('#frmRegister').off('submit').submit()
        }

})
