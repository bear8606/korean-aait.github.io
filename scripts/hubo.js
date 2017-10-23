var canvas = document.getElementById("map");
var myCanvas = document.getElementById("myCanvas");
var beeper_canvas = document.getElementById("beeper_canvas");
var ctx = canvas.getContext("2d");
var rtx = myCanvas.getContext("2d");
var btx = beeper_canvas.getContext("2d");
var robot = document.getElementById("robot");
var beeper = new Image;
beeper.src = "./hubo_img/beeper.png";

var trace = true;
var coding = true;
var time_interval = 300;
var run = false;
var map_name = "empty";
var map = clone(empty_map);
var wall = empty_map_wall;
var init_x = 25;
var init_y = 475;
var init_dir = "south";

var hubo = {
	robot_x: 25,
	robot_y: 475,
	direction: "south",

	animate: function(){
		rtx.clearRect(0, 0, 500, 500)
		rtx.drawImage(robot, this.robot_x-15, this.robot_y-15);
	},

	move: function(){
		if(!(this.front_is_clear())){
			alert("There is a wall in front of me!");
			return;
		}
		ctx.beginPath();
		ctx.strokeStyle="#0000ff";
		ctx.moveTo(this.robot_x, this.robot_y);
		if(this.direction == "south")
			this.robot_y += 50;
		else if(this.direction == "north")
			this.robot_y -= 50;
		else if(this.direction == "east")
			this.robot_x += 50;
		else if(this.direction == "west")
			this.robot_x -= 50;
		else{
			console.log("error");
			return;
		}
		ctx.lineTo(this.robot_x, this.robot_y);
		if(trace)
			ctx.stroke();
		this.animate();
	},

	turn_left: function(){
		if(this.direction == "south")
			this.direction = "east";
		else if(this.direction == "north")
			this.direction = "west";
		else if(this.direction == "east")
			this.direction = "north";
		else if(this.direction == "west")
			this.direction = "south";
		else{
			console.log("error");
			return;
		}
		this.turn();
	},

	turn_right: function(){
		if(this.direction == "south")
			this.direction = "west";
		else if(this.direction == "north")
			this.direction = "east";
		else if(this.direction == "east")
			this.direction = "south";
		else if(this.direction == "west")
			this.direction = "north";
		else{
			console.log("error");
			return;
		}
		this.turn();
	},

	pick_beeper: function(){
		if(map[get_cor(this.robot_x)][get_cor(this.robot_y)] == 0)
			alert("There is no beeper!");
		else{
			btx.clearRect(this.robot_x-15, this.robot_y-15, 30, 30);
			map[get_cor(this.robot_x)][get_cor(this.robot_y)]--;
			if(map[get_cor(this.robot_x)][get_cor(this.robot_y)] > 0){
				btx.drawImage(beeper, this.robot_x-15, this.robot_y-15);
				btx.fillText(map[get_cor(this.robot_x)][get_cor(this.robot_y)], this.robot_x-5, this.robot_y+4);
			}
		}
	},

	drop_beeper: function(){
		btx.clearRect(this.robot_x-15, this.robot_y-15, 30, 30);
		map[get_cor(this.robot_x)][get_cor(this.robot_y)]++;
		btx.drawImage(beeper, this.robot_x-15, this.robot_y-15);
		btx.fillText(map[get_cor(this.robot_x)][get_cor(this.robot_y)], this.robot_x-5, this.robot_y+4);
	},

	front_is_clear: function(){
		if((this.robot_x >= 475 && this.direction == "east") ||
			(this.robot_x <= 25 && this.direction == "west") ||
			(this.robot_y <= 25 && this.direction == "north") ||
			(this.robot_y >= 475 && this.direction == "south") ||
			this.check_wall())
			return false;
		return true;
	},

	left_is_clear: function(){
		this.turn_left();
		var ret = this.front_is_clear();
		this.turn_right();
		return ret; 
	},

	right_is_clear: function(){
		this.turn_right();
		var ret = this.front_is_clear();
		this.turn_left();
		return ret; 
	},

	facing_north: function(){
		if(this.direction == "north")
			return true;
		return false;
	},

	on_beeper: function(){
		if(map[get_cor(this.robot_x)][get_cor(this.robot_y)] > 0)
			return true;
		return false;
	},

	turn: function(){
		if(this.direction == "south")
			robot.src="./hubo_img/south.png";
		else if(this.direction == "north")
			robot.src="./hubo_img/north.png";
		else if(this.direction == "east")
			robot.src="./hubo_img/east.png";
		else if(this.direction == "west")
			robot.src="./hubo_img/west.png";
		else{
			console.log("error");
			return;
		}
	},

	check_state: function(){
		console.log(this.direction+", "+(get_cor(this.robot_x)+1)+", "+(get_cor(this.robot_y)+1));
	},

	check_wall: function(){
		var cnt = 0;
		var pos_1 = [get_cor(this.robot_x),get_cor(this.robot_y)];
		var pos_2 = [];
		
		if(this.direction == "north")
			pos_2 = [get_cor(this.robot_x),get_cor(this.robot_y)-1];
		else if(this.direction == "south")
			pos_2 = [get_cor(this.robot_x),get_cor(this.robot_y)+1];
		else if(this.direction == "west")
			pos_2 = [get_cor(this.robot_x)-1,get_cor(this.robot_y)];
		else
			pos_2 = [get_cor(this.robot_x)+1,get_cor(this.robot_y)];

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
	},
};

robot.onload = hubo.animate();

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

function init(){
	hubo.robot_x = init_x;
	hubo.robot_y = init_y;
	hubo.direction = init_dir;
	rtx.clearRect(0,0,500,500);
	ctx.clearRect(0,0,500,500);
	btx.clearRect(0,0,500,500);
	if(map_name == "empty")
		map = clone(empty_map);
	else if(map_name == "harvest1")
		map = clone(harvest_map);
	else if(map_name == "harvest2")
		map = clone(harvest2_map);
	else if(map_name == "maze")
		map = clone(maze_map);

	for(var i = 25; i < 500; i += 50){
		draw(i, 0, i, 500, "#ededed");
		draw(0, i, 500, i, "#ededed");
	};
	rtx.drawImage(robot, hubo.robot_x-15, hubo.robot_y-15);
	hubo.turn();
	show_map();
	show_beeper();
};

function run_code(){
	init();
	var code = $("#created_code").val();
	localStorage.setItem("hubo_code", code);
	$("#running_area").html("<script>"+code+"</script>");
};

$(document).ready(function(){
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
		else if(selected_world == "harvest1.wld"){
			map_name = "harvest1";
			wall = harvest_map_wall;
			init();
		}
		else if(selected_world == "harvest2.wld"){
			map_name = "harvest2";
			wall = harvest2_map_wall;
			init();
		}
		else if(selected_world == "maze.wld"){
			map_name = "maze";
			wall = maze_map_wall;
			init();
		}
		else
			alert("Unknown Map");
	});

	$("#clear").click(function(){
		localStorage.setItem("hubo_code", "");
		$("#created_code").val();
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
});

$(document).delegate('#created_code','keydown', function(e){
	var keyCode = e.keyCode || e.which;

	if(keyCode == 9){
		e.preventDefault();
		var start = $(this).get(0).selectionStart;
		var end = $(this).get(0).selectionEnd;

		$(this).val($(this).val().substring(0, start)+"\t"+$(this).val().substring(end));
		$(this).get(0).selectionEnd = start + 1;
	}
});

init();
$("#created_code").val(localStorage.getItem("hubo_code"));
