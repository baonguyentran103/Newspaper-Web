$("#forgot-form").on("submit",function(e){
    e.preventDefault();
    const mail = $("#email").val();
    $.getJSON(`/account/is-available?mail=${mail}`, function (data) {
        if (data === true) {
        //alert('Not available mail!');
        Swal.fire("", "Not available mail!");
    }
    else{
        $('#forgot-form').off('submit').submit()
    }
})
});