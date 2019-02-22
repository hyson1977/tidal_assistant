var blackListPtns = [/Interface_ADAMImage/,/Interface_ADAMIndex/,];
var cycleStatus = "";
var cycleStartTime = "";
var cycleEndTime = "";
var dailyStartTime = "";
var dailyEndTime = "";
var criticalPathEndTime = "";
var sysUnlockTime = "";

function analize(){
	var whiteList = [""];

	var cloned = $('table').clone();
	var gridRows = $(cloned).find('.gridRow');
	var rowsData = [];
	var ignoredRows = [];
	var watchedRows = [];
	gridRows.each(function(index, elem){
		var name = $(elem).find('.gridContent.col-2').text();
		var status = $(elem).find('.gridContent.col-3').text();
		var actStart = $(elem).find('.gridContent.col-11').text();
		var actEnd = $(elem).find('.gridContent.col-12').text();
		var reRuns = $(elem).find('.gridContent.col-7').text();
		var reRunsNum = parseInt(reRuns);
		if(name.match(/^PNXModel-ProjA/) || name.match(/^PNXDev-ProjA$/)){
			cycleStatus = status;
			cycleStartTime = actStart;
			cycleEndTime = actEnd;
		} else if(name == "PNXModel_Daily (1)"|| name == "PNXDev_Daily (1)"){
			dailyStartTime = actStart;
			dailyEndTime = actEnd;
		} else if(name.match(/Daily_CriticalPath/)){
			criticalPathEndTime = actEnd;			
		} else if(name.match(/Environment_UnLock/)){
			sysUnlockTime = actEnd;
		}

		var rowData = {"name":name, "status":status,"reRuns":reRuns,"actStart":actStart,"actEnd":actEnd};
		if(ignore(rowData) && reRunsNum != 0 ){
			ignoredRows.push(rowData);
		}else if(reRunsNum != 0 || rowData.status.match(/Completed%sAbnormally/)||rowData.status.match(/Completed%sNormally\*/)){
			watchedRows.push(rowData);
		}else{
			rowsData.push(rowData);
		}

	});

	buildTable();
	renderTable();
}

function ignore(data){
	for(var i=0; i<blackListPtns.length; i++){
		if(data.name.match(blackListPtns[i])){
			return true;
		}
	}
	return false;
}

function buildTable(){
	var html = '<div id="modal" class="modalwindow"><h2>PNXDev Waiting On Children</h2><a href="#" class="close">X</a><div class="content"><table><tr><td>Cycle Started at</td><td id="cycleStartTime"></td></tr><tr><td>PNXDev_Daily Started at</td><td id="dailyStartTime"></td></tr><tr><td>PNXDev_Daily Finished at</td><td id="dailyEndTime"></td></tr><tr><td>Daily Critical Path Finished at</td><td id="criticalPathEndTime"></td></tr><tr><td>System Availability Unlocked and Available to All Users at</td><td id="sysUnlockTime"></td></tr><tr><td>PNXDev Completed at</td><td id="cycleEndTime"></td></tr></table></div></div>';
	
	if($("#modal").length == 0){
$(html).appendTo('body');
	}
		//if close button is clicked
	$('.modalwindow .close').click(function (e) {

	    //Cancel the link behavior
	    e.preventDefault();
	    $('.modalwindow').fadeOut(500);
	});

	$("#cycleStartTime").text(cycleStartTime);
	$("#cycleEndTime").text(cycleEndTime);
	$("#dailyStartTime").text(dailyStartTime);
	$("#dailyEndTime").text(dailyEndTime);
	$("#criticalPathEndTime").text(criticalPathEndTime);
	$("#sysUnlockTime").text(sysUnlockTime);
}

function renderTable(){
		var id = "#modal";
	    //Get the window height and width
	    var winH = $(window).height();
	    var winW = $(window).width();

	    //Set the popup window to center
	    $(id).css('top',0);
	    $(id).css('left', winW/2-$(id).width()/2);

	    //transition effect
	    $(id).fadeIn(500);
}