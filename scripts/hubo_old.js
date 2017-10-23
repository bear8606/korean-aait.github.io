var canvas = document.getElementById("map");
var myCanvas = document.getElementById("myCanvas");
var beeper_canvas = document.getElementById("beeper_canvas");
var ctx = canvas.getContext("2d");
var rtx = myCanvas.getContext("2d");
var btx = beeper_canvas.getContext("2d");
var robot = document.getElementById("robot");
var beeper = new Image;
beeper.src = "./hubo_img/beeper.png";

var robot_x = 25;
var robot_y = 475;
var init_x = 25;
var init_y = 475;
var direction = "south";
var init_dir = "south";
var trace = true;
var coding = true;
var time_interval = 300;
var run = false;

var map_name = "empty";
var map = clone(empty_map);
var wall = empty_map_wall;

robot.onload = animate;
function animate(){
	rtx.clearRect(0, 0, 500, 500)
	rtx.drawImage(robot, robot_x-15, robot_y-15);
};

function draw(x1, y1, x2, y2, color){
	ctx.beginPath();
	ctx.strokeStyle=color;
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
};

function get_cor(val){
	return (val+25)/50-1;
};

function get_index(val){
	return val*50+25;
};

function show_map(){
	var pos_1=[];
	var pos_2=[];
	for(var i=0; i < wall.length; i++){
		pos_1 = wall[i][0];
		pos_2 = wall[i][1];
		if(pos_1[0] == pos_2[0]){
			var mean = (get_index(pos_1[1])+get_index(pos_2[1]))/2;
			draw(get_index(pos_1[0])-25, mean, get_index(pos_1[0])+25, mean, "red");
		}
		else{
			var mean = (get_index(pos_1[0])+get_index(pos_2[0]))/2;
			draw(mean, get_index(pos_1[1])-25, mean, get_index(pos_1[1])+25, "red");
		}
	}
};

function show_beeper(){
	for(var i = 0; i < 10; i++){
		var row = map[i];
		for(var j = 0; j < 10; j++){
			if(map[i][j] != 0){
				btx.drawImage(beeper, get_index(i)-15, get_index(j)-15);
				btx.fillText(map[i][j], get_index(i)-5, get_index(j)+4);
			}
		}
	}
};

function show_cor(){
	for(var i = 0; i < 10; i++){
		var row = map[i];
		for(var j = 0; j < 10; j++){
			btx.fillText(i+","+j, get_index(i)-5, get_index(j)+4);
		}
	}
};

function clone(input_map){
	var map = [];
	for(var i = 0; i < 10; i++){
		var row = [];
		for(var j = 0; j < 10; j++){
			row.push(input_map[i][j]);
		}
		map.push(row);
	}
	return map;
};

function move(){
	if(!(front_is_clear())){
		alert("There is a wall in front of me!");
		return;
	}
	ctx.beginPath();
	ctx.strokeStyle="#0000ff";
	ctx.moveTo(robot_x, robot_y);
	if(direction == "south")
		robot_y += 50;
	else if(direction == "north")
		robot_y -= 50;
	else if(direction == "east")
		robot_x += 50;
	else if(direction == "west")
		robot_x -= 50;
	else{
		console.log("error");
		return;
	}
	ctx.lineTo(robot_x, robot_y);
	if(trace)
		ctx.stroke();
	animate();
	check_pos();
};

function turn_left(){
	if(direction == "south")
		direction = "east";
	else if(direction == "north")
		direction = "west";
	else if(direction == "east")
		direction = "north";
	else if(direction == "west")
		direction = "south";
	else{
		console.log("error");
		return;
	}
	turn();
};

function turn_right(){
	if(direction == "south")
		direction = "west";
	else if(direction == "north")
		direction = "east";
	else if(direction == "east")
		direction = "south";
	else if(direction == "west")
		direction = "north";
	else{
		console.log("error");
		return;
	}
	turn();
};

function pick_beeper(){
	if(map[get_cor(robot_x)][get_cor(robot_y)] == 0)
		console.log("There is no beeper!");
	else{
		btx.clearRect(robot_x-15, robot_y-15, 30, 30);
		map[get_cor(robot_x)][get_cor(robot_y)]--;
		if(map[get_cor(robot_x)][get_cor(robot_y)] > 0){
			btx.drawImage(beeper, robot_x-15, robot_y-15);
			btx.fillText(map[get_cor(robot_x)][get_cor(robot_y)], robot_x-5, robot_y+4);
		}
	}
	check_pos();
};

function drop_beeper(){
	btx.clearRect(robot_x-15, robot_y-15, 30, 30);
	map[get_cor(robot_x)][get_cor(robot_y)]++;
	btx.drawImage(beeper, robot_x-15, robot_y-15);
	btx.fillText(map[get_cor(robot_x)][get_cor(robot_y)], robot_x-5, robot_y+4);
	check_pos();
};

function front_is_clear(){
	if((robot_x >= 475 && direction == "east") ||
		(robot_x <= 25 && direction == "west") ||
		(robot_y <= 25 && direction == "north") ||
		(robot_y >= 475 && direction == "south") ||
		check_wall())
		return false;
	return true;
};

function left_is_clear(){
	turn_left();
	var ret = front_is_clear();
	turn_right();
	return ret; 
};

function right_is_clear(){
	turn_right();
	var ret = front_is_clear();
	turn_left();
	return ret; 
};

function facing_north(){
	if(direction == "north")
		return true;
	return false;
};

function on_beeper(){
	if(map[get_cor(robot_x)][get_cor(robot_y)] > 0)
		return true;
	return false;
};

function turn(){
	if(direction == "south")
		$("#robot").attr("src", "./hubo_img/south.png");
	else if(direction == "north")
		$("#robot").attr("src", "./hubo_img/north.png");
	else if(direction == "east")
		$("#robot").attr("src", "./hubo_img/east.png");
	else if(direction == "west")
		$("#robot").attr("src", "./hubo_img/west.png");
	else{
		console.log("error");
		return;
	}
	check_pos();
};

function check_pos(){
	if(run || (robot_x >= 475 && direction == "east") ||
		(robot_x <= 25 && direction == "west") ||
		(robot_y <= 25 && direction == "north") ||
		(robot_y >= 475 && direction == "south") ||
		check_wall())
		$("#move").prop("disabled", true);
	else
		$("#move").prop("disabled", false);
	if(run || map[get_cor(robot_x)][get_cor(robot_y)] <= 0)
		$("#pick_beeper").prop("disabled", true);
	else
		$("#pick_beeper").prop("disabled", false);
};

function check_state(){
	console.log(direction+", "+(get_cor(robot_x)+1)+", "+(get_cor(robot_y)+1));
};

function check_wall(){
	var cnt = 0;
	var pos_1 = [get_cor(robot_x),get_cor(robot_y)];
	var pos_2 = [];
	
	if(direction == "north")
		pos_2 = [get_cor(robot_x),get_cor(robot_y)-1];
	else if(direction == "south")
		pos_2 = [get_cor(robot_x),get_cor(robot_y)+1];
	else if(direction == "west")
		pos_2 = [get_cor(robot_x)-1,get_cor(robot_y)];
	else
		pos_2 = [get_cor(robot_x)+1,get_cor(robot_y)];

	if(pos_1[0] > pos_2[0]){
		var temp = pos_2;
		pos_2 = pos_1;
		pos_1 = temp;
	}
	else if(pos_1[0] == pos_2[0] && pos_1[1] > pos_2[1]){
		var temp = pos_2;
		pos_2 = pos_1;
		pos_1 = temp;
	}

	while(cnt < wall.length){
		if(wall[cnt][0].toString() == pos_1.toString() && wall[cnt][1].toString() == pos_2.toString())
			return true;
		cnt++;
	}
	return false;
};

function init(){
	robot_x = init_x;
	robot_y = init_y;
	direction = init_dir;
	rtx.clearRect(0,0,500,500);
	ctx.clearRect(0,0,500,500);
	btx.clearRect(0,0,500,500);
	if(map_name == "empty")
		map = clone(empty_map);
	else if(map_name == "harvest")
		map = clone(harvest_map);
	else if(map_name == "maze")
		map = clone(maze_map);

	for(var i = 25; i < 500; i += 50){
		draw(i, 0, i, 500, "#ededed");
		draw(0, i, 500, i, "#ededed");
	};
	rtx.drawImage(robot, robot_x-15, robot_y-15);
	turn();
	show_map();
	show_beeper();
};

function run_code(){
	var code = $("#created_code").html();
	var instructions = code.split("<br>");
	init();
	console.log("instructions to run: "+instructions);
	disable_all(true);

	var i = 0;
	run = true;
	var countdown = setInterval(function(){
		if(i == instructions.length-1){
			clearInterval(countdown);
			disable_all(false);
			run = false;
		}
		else{
			if(instructions[i] == "hubo.move()") move();
			else if(instructions[i] == "hubo.turn_left()") turn_left();
			else if(instructions[i] == "turn_right()") turn_right();
			else if(instructions[i] == "hubo.drop_beeper()") drop_beeper();
			else if(instructions[i] == "hubo.pick_beeper()") pick_beeper();
			else{
				console.log("unknown instruction at " + i +": "+ instructions[i]);
				//alert("unknown instruction at " + i +": "+ instructions[i]);
			}
		}
		i++;
	}, time_interval);
	console.log("done");
	check_pos();
};

function disable_all(state){
	$("#pick_beeper").prop("disabled", state);
	$("#drop_beeper").prop("disabled", state);
	$("#move").prop("disabled", state);
	$("#select_world").prop("disabled", state);
	$("#turn_left").prop("disabled", state);
	$("#turn_right").prop("disabled", state);
	$("#run_code").prop("disabled", state);
	$("#clear").prop("disabled", state);
	$("#set_trace").prop("disabled", state);
	$("#set_coding").prop("disabled", state);
}

$(document).ready(function(){
	$("#turn_left").click(function(){
		turn_left();
		check_state();
		if(coding)
			$("#created_code").append("hubo.turn_left()<br>");
	});
	$("#turn_right").click(function(){
		turn_right();
		check_state();
		if(coding)
			$("#created_code").append("turn_right()<br>");
	});
	$("#move").click(function(){
		move();
		check_state();
		if(coding)
			$("#created_code").append("hubo.move()<br>");
	});

	$("#run_code").click(function(){
		run_code();
	});

	$("#select_world").change(function(){
		var selected_world = $(this).val();
		if(selected_world == "empty.wld"){
			map_name = "empty";
			wall = empty_map_wall;
			init();
		}
		else if(selected_world == "stairs.wld"){
			map_name = "empty";
			wall = stair_map_wall;
			init();
		}
		else if(selected_world == "hurdles.wld"){
			map_name = "empty";
			wall = hurdle_map_wall;
			init();
		}
		else if(selected_world == "harvest.wld"){
			map_name = "harvest";
			wall = harvest_map_wall;
			init();
		}
		else if(selected_world == "maze.wld"){
			map_name = "maze";
			wall = maze_map_wall;
			init();
		}
		else
			alert("Unknown Map");
		$("#created_code").html("Robot("+"orientation=\""+direction[0]+"\", avenue="+(get_cor(init_x)+1)+", streets="+(get_cor(init_y)+1)+")<br>");
	});

	$("#clear").click(function(){
		init_x = robot_x;
		init_y = robot_y;
		init_dir = direction;
		$("#created_code").html("Robot("+"orientation=\""+direction[0]+"\", avenue="+(get_cor(init_x)+1)+", streets="+(get_cor(init_y)+1)+")<br>");
	});

	$("#drop_beeper").click(function(){
		drop_beeper();
		if(coding)
			$("#created_code").append("hubo.drop_beeper()<br>");
	});

	$("#pick_beeper").click(function(){
		pick_beeper();
		if(coding)
			$("#created_code").append("hubo.pick_beeper()<br>");
	});

	$("#set_trace").click(function(){
		if($("#set_trace").attr("status") == "on"){
			$("#set_trace").attr("status", "off");
			trace = false;
			$("#set_trace").html("Set Trace OFF");
			$("#set_trace").removeClass("btn-success");
			$("#set_trace").addClass("btn-default");
		}
		else{
			$("#set_trace").attr("status", "on");
			trace = true;
			$("#set_trace").html("Set Trace ON");
			$("#set_trace").removeClass("btn-default");
			$("#set_trace").addClass("btn-success");
		}
	});

	$("#set_coding").click(function(){
		if($("#set_coding").attr("status") == "on"){
			$("#set_coding").attr("status", "off");
			coding = false;
			$("#set_coding").html("Set Coding OFF");
			$("#set_coding").removeClass("btn-success");
			$("#set_coding").addClass("btn-danger");
		}
		else{
			$("#set_coding").attr("status", "on");
			coding = true;
			init_x = robot_x;
			init_y = robot_y;
			init_dir = direction;
			$("#created_code").html("Robot("+"orientation=\""+direction[0]+"\", avenue="+(get_cor(init_x)+1)+", streets="+(get_cor(init_y)+1)+")<br>");
			$("#set_coding").html("Set Coding ON");
			$("#set_coding").removeClass("btn-danger");
			$("#set_coding").addClass("btn-success");
		}
	});

	$("#manual_coding").click(function(){
		document.location.href="playground_js.html";
	});
});

function maze_solve(){
	while(!on_beeper()){
		if(left_is_clear()){
			turn_left();
			move();
		}
		else if(front_is_clear())
			move();
		else
			turn_right();
	}
	console.log("done");
};

function stairs_solve(){
	while(!left_is_clear()){
		turn_left();
		turn_left();
		move();
		turn_right();
		move();
		turn_right();
	}
	turn_left();
	while(front_is_clear())
		move();
	drop_beeper();
};

init();
$("#created_code").html("Robot("+"orientation=\""+direction[0]+"\", avenue="+(get_cor(init_x)+1)+", streets="+(get_cor(init_y)+1)+")<br>");

