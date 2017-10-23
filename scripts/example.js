$(document).ready(function(){
	$("#add_button").click(function(){
		var num1 = parseInt($("#num1").prop("value"));
		var num2 = parseInt($("#num2").prop("value"));
		$("#add_result").html(num1+num2);
	});
	
	$("#img_change").click(function(){
		if($("#img").attr("state") == "chrome"){
			$("#img").attr("src", "./firefox.gif");
			$("#img").attr("state", "firefox")
		}
		else{
			$("#img").attr("src", "./chrome.gif");
			$("#img").attr("state", "chrome");
		}
	});
	
	var global_counter = 0;
	$("#counter").click(function(){
		global_counter++;
		$("#count").html(global_counter);
	});

	$("#generate").click(function(){
		$("#random").html(Math.random());
	})



	$("#Amharic").click(function(){
		$("#internalization").html("ሄል ኢትዮጵያ!");
	});
	$("#English").click(function(){
		$("#internalization").html("Hello Ethiopia!");
	});

	$("#alert").click(function(){
		alert("Alert!");
	});

	var auto_complete_list = ["Ethiopia", "Korea"];
	$("#auto_complete").autocomplete({
		source: auto_complete_list,
		minLength: 2
	});
})

function mouseover(ele){
	ele.innerHTML = "mouse out";
};

function mouseout(ele){
	ele.innerHTML = "mouse in";
};

var cnt = 0;
function count(ele){
	cnt++;
	ele.innerHTML = cnt;
};

function change_color(ele){
	if(ele.getAttribute("state") == "false"){
		ele.setAttribute("state", "true");
		ele.setAttribute("style","width: 100px; height: 100px; background-color: green");
	}
	else{
		ele.setAttribute("state", "false");
		ele.setAttribute("style","width: 100px; height: 100px; background-color: blue; color: white");
	}
};

function orange(){
	document.getElementById("orange_box").innerHTML = "ORANGE Box";
};

var timer = false;
function start_timer(){
	var time = 0;
	timer = true;
	var counter = setInterval(function(){
		if(!timer)
			clearInterval(counter);
		time++;
		document.getElementById("time").innerHTML = time/100;
	}, 10);
	$("#start_timer").attr("disabled", true);
	$("#end_timer").attr("disabled", false);
};
function end_timer(){
	timer = false;
	$("#start_timer").attr("disabled", false);
	$("#end_timer").attr("disabled", true);
};

function disappear(){
	document.getElementById("disappearing").innerHTML = "";
};