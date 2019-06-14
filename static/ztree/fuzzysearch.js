/*
 * email: bigablecat@hotmail.com
 * Date: 2018-04-14
 */

/**
 * @param zTreeId the ztree id used to get the ztree object
 * @param searchField selector of your input for fuzzy search
 * @param checkAll  
 * @param searchList  
 * 
 * @returns
 */	
function fuzzySearch(zTreeId, searchField, checkAll, searchList){
	var zTreeObj = $.fn.zTree.getZTreeObj(zTreeId);//get the ztree object by ztree id
	if(!zTreeObj){
		alter("fail to get ztree object");
	}
	var nameKey = zTreeObj.setting.data.key.name; //get the key of the node name
	
	var metaChar = '[\\[\\]\\\\\^\\$\\.\\|\\?\\*\\+\\(\\)]'; //js meta characters
	var rexMeta = new RegExp(metaChar, 'gi');//regular expression to match meta characters
	
	// keywords filter function 
	function ztreeFilter(zTreeObj,_keywords,callBackFunc) {
		if(!_keywords){
			_keywords =''; //default blank for _keywords 
		}
		
		// function to find the matching node
		function filterFunc(node) {
			if(node && node.oldname && node.oldname.length>0){
				node[nameKey] = node.oldname; //recover oldname of the node if exist
			}
			zTreeObj.updateNode(node); //update node to for modifications take effect
			if (_keywords.length == 0) {
				$(searchList).hide();
				$('#'+zTreeId).show();
				//return true to show all nodes if the keyword is blank
				zTreeObj.showNode(node);
				zTreeObj.expandNode(node,false);
				return true;
			}
			//transform node name and keywords to lowercase
			if (node[nameKey] && node[nameKey].toLowerCase().indexOf(_keywords.toLowerCase())!=-1) {
				return true; //return true and show this node
			}
			
			zTreeObj.hideNode(node); // hide node that not matched
			return false; //return false for node not matched
		}
		
		var nodesShow = zTreeObj.getNodesByFilter(filterFunc); //get all nodes that would be shown
		processShowNodes(uniq(nodesShow), _keywords);//nodes should be reprocessed to show correctly
	}
	
	/**
	 * reprocess of nodes before showing
	 */
	function processShowNodes(nodesShow,_keywords){
		if(nodesShow && nodesShow.length>0){
			//process the ancient nodes if _keywords is not blank
			if(_keywords.length>0){ 	
				$(searchList).html('');			
				$.each(nodesShow, function(n,obj){
					var ico = 'ico_docu';
					var img = ''
					var id = obj.tId.split('_')[1]
					if(obj.children) ico = 'ico_close';
					if(obj.checked) img = 'img';
					var li = '<li>\
						<span title="" class="button switch noline_docu" treenode_switch="" disabled="disabled"></span>\
						<span class="button chk checkbox_false_full" treenode_check="" style="display: inline;"></span>\
						<a onclick="checkSearch('+id+')" class="" style="" title="'+obj.name+'">\
							<span title="" treenode_ico="" class="button '+ico+'" style=""></span>\
							<span class="node_name">'+obj.name+'</span><img class="'+img+'" src="./choose.png">\
						</a>\
					</li>'	
					$(searchList).append(li);
				});				
			}else{ //show all nodes when _keywords is blank and expand the root nodes
				$(searchList).hide();
				$('#'+zTreeId).show();
				var rootNodes = zTreeObj.getNodesByParam('level','0');//get all root nodes
				$.each(rootNodes,function(n,obj){
					zTreeObj.expandNode(obj,false); //expand all root nodes
				});
			}
		}
	}
	
	
	//listen to change in input element
	$(searchField).bind('input propertychange', function() {
		$(searchList).html('');		
		var _keywords = $(this).val();
		if(_keywords) {
			$(checkAll).hide();
		} else {
			$(checkAll).show();
		}
		searchNodeLazy(_keywords); //call lazy load
	});

	var timeoutId = null;
	// excute lazy load once after input change, the last pending task will be cancled  
	function searchNodeLazy(_keywords) {
		if (timeoutId) { 
			//clear pending task
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(function() {
			$(searchList).show();
			$('#'+zTreeId).hide();
			ztreeFilter(zTreeObj,_keywords); //lazy load ztreeFilter function 
			$(searchField).focus();//focus input field again after filtering
		}, 500);
	}
}
function checkSearch(id){	
    $("#searchList").hide();
	$('#treeDemo').show();
	var zTreeObj = $.fn.zTree.getZTreeObj("treeDemo");

	var node = zTreeObj.getNodeByTId("treeDemo_"+id);
	var shownodes = zTreeObj.getNodesByParam("id", node.id, null);
	$.each(shownodes, function(n,obj){
		var pathOfOne = obj.getPath();//get all the ancient nodes including current node
		if(pathOfOne && pathOfOne.length>0){ 
			//i < pathOfOne.length-1 process every node in path except self
			for(var i=0;i<pathOfOne.length-1;i++){
				zTreeObj.expandNode(pathOfOne[i],true); //expand node
			}
		}
	});

    $("#key").val('');
    var nodes = zTreeObj.getNodesByParam("isHidden", true);
    zTreeObj.showNodes(nodes);
    $("#checkAll").show();
	
	setTimeout(function() {		
		$("#treeDemo #treeDemo_"+id+"_a").click();
	},100);	
}

function uniq(array){
	var temp = [];
	var l = array.length;
	for(var i = 0; i < l; i++) {
		for(var j = i + 1; j < l; j++){
			if (array[i].id === array[j].id){
				i++;
				j = i;
			}
		}
		temp.push(array[i]);
	}
	return temp;
}