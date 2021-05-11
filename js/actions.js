

$("select.withOther").change(function(){
    var other = $(this).attr("id") + "_other";
    var val = $(this).val();
    if(val && val.toUpperCase().includes("OTHER")){
        $( "#"+other ).prop( "hidden", false );
        $( "#"+other ).focus();
    }else{
        $( "#"+other ).prop( "hidden", true );
        $( "#"+other ).val("");
    }
});

$("input._numeric_only").keypress(function(event) {
    return /^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/.test(String.fromCharCode(event.keyCode));
  });

$("#reset").click(function(event){
    $("form")[0].reset();
});

$("#submit").click(function(event){
    $("form")[0].submit();
});

/*
$(document).on('scroll', function() {
    if( $(this).scrollTop() >= $('.category-tab').offset().top ){
        $.getScript("./shoppers.js", function() {
            var grids = getProducts(6)
            $("div.features_items").append(grids);
        });
    }
});
*/
/*
$(window).scroll(function() {
    var hT = $('.category-tab').offset().top,
        hH = $('.category-tab').outerHeight(),
        wH = $(window).height(),
        wS = $(this).scrollTop();
    if (wS > (hT+hH-wH-600)){
        console.log('Hi on the view!');
        
        var grids = module.getProducts(6);
        $("div.features_items").append(grids);
    }
 });
 */
