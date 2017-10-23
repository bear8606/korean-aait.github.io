var auto_pairing = false;

$(document).ready(function(){
	$("#run").click(function(){
		var code = $("#code").prop("value");
		localStorage.setItem("html_code", code);
		$("#result").html(code);
	});

	$("#auto_pairing").click(function(){
		if($(this).attr("status") == "on"){
			$(this).attr("status", "off");
			auto_pairing = false;
			$(this).html("Auto Pairing OFF");
			$(this).removeClass("btn-success");
			$(this).addClass("btn-default");
		}
		else{
			$(this).attr("status", "on");
			auto_pairing = true;
			$(this).html("Auto Pairing ON");
			$(this).removeClass("btn-default");
			$(this).addClass("btn-success");
		}
	});
});

$(document).delegate('#code','keydown', function(e){
	var keyCode = e.keyCode || e.which;

	if(keyCode == 9){
		e.preventDefault();
		var start = $(this).get(0).selectionStart;
		var end = $(this).get(0).selectionEnd;

		$(this).val($(this).val().substring(0, start)+"\t"+$(this).val().substring(end));
		$(this).get(0).selectionEnd = start + 1;
	}
});

$(document).delegate('#code', 'keydown', function(e) {
	var keyCode = e.keyCode || e.which;

    if (keyCode == 190 && e.shiftKey && auto_pairing){
    	var start = $(this).get(0).selectionStart;
		var end = $(this).get(0).selectionEnd;

		var search =  $(this).val().substring(0, start);
		var search_char = search.split("<");
		var closing_pair = search_char[search_char.length-1];

		if(!closing_pair.includes("/") && closing_pair != "br" && !closing_pair.includes("img")){
			$(this).val($(this).val().substring(0, start)+"</"+closing_pair+">"+$(this).val().substring(end));
			$(this).get(0).selectionEnd = start;
		}
    }
});

$("#code").val(localStorage.getItem("html_code"));