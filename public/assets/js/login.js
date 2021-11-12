$('#submit-login').on('submit', function (e) {
    e.preventDefault();
    const username= $('#exampleInputEmail1').val();
    const password= $('#exampleInputPassword1').val()
	$.ajax({
    url  : `/account/login`,
    type : "POST",
    cache:false,
    data : {username, password},
    success:function(response){
      if (response === "fail") {
        $(".attention").html("Wrong Username or password");
      }
      else{
           window.location.href=response;
      }    
    }
  });
})
