$(document).ready(function(){
  $('.del-article').click(function(e){
    e.preventDefault();

    const id = $(this).data('id');
    
    $.ajax({
      type: 'delete',
      url: '/articles/'+id,
      success: function(resp) {
        alert('Delete article!');
        window.location.href = '/';
      },
      error: function(err) {
        console.log(err);
      }
    })
  })
});
