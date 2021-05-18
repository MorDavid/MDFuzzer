chrome.storage.local.get("inputs", html_chars => {
    var html_chars = html_chars.inputs.split(",");
    let html_get_search_args = 1;
    let html_get_inputs_args = 1;
    let html_post_inputs_args = 1;
    var my_results="";
    var xhttp = new XMLHttpRequest();
    // Global
    var url = location.protocol+"//"+location.host+location.port+location.pathname.substr(1);
    var counter = 0;
    console.log("%cMD-Fuzzer Start", "background:red; color: white; font-size: x-large");
    console.log("%cSettings:\nSearch Args: "+html_get_search_args+"\nInput Objects: "+html_get_inputs_args, "background:green; color: white; font-size: large");
    if(html_get_search_args==1){
		var params = [];
		if(window.location.search!=="") {
			var params = new Map(location.search.slice(1).split('&').map(kv => kv.split('=')));
			var params = Array.from(params.entries());
		}
		html_chars.forEach(function(html_char){
			for(var i=0;i<params.length;i++){		
				html_url = location.protocol+"//"+location.host+location.port+location.pathname+window.location.search.replace(params[i][0]+"="+params[i][1],params[i][0]+"="+params[i][1]+html_char+html_char);
				html_url = decodeURIComponent(html_url);
				xhttp.onreadystatechange = function(){
					if (this.readyState == 4) {
						if(xhttp.responseText.search(params[i][1]+html_char+html_char)>0){	
							msg = "[Apara] Found XSS! - " + params[i][0] + " - " + xhttp.getResponseHeader('content-type');
							console.log("%c"+msg, "background:#064680;color: white;");
							console.log(html_url);
							my_results+=html_url+"\n";
							counter++;
						}
					}
				};
				xhttp.open("GET", html_url, false);
				xhttp.send();
			}
		});
	}
    // Main - html_get_inputs_args
    if(html_get_inputs_args==1){
		var inputs, index;
		var input_params = [];
		inputs = document.getElementsByTagName('input');
		for (index = 0; index < inputs.length; ++index) {
			if(inputs[index].name!==""){
			  input_params.push([inputs[index].name,"BBBBBB"]);
			}
			if(inputs[index].id!==""){
			  input_params.push([inputs[index].id,"AAAAA"]);
			}
		}
		input_params = input_params.filter(Boolean);
		html_chars.forEach(function(html_char){
			for(var i=0;i<input_params.length;i++){
				for(var y=1;y<input_params[i].length;y++){
					let html_url = location.protocol+"//"+location.host+location.port+location.pathname+"?"+input_params[i][0]+"="+input_params[i][1]+html_char+html_char;
					xhttp.open("GET", html_url, false);
					xhttp.onreadystatechange = function(){
						if (this.readyState==4) {
							if(xhttp.responseText.search(decodeURIComponent(input_params[i][y]+html_char+html_char))>-1){
								my_results+=html_url+"\n";
								counter++;
							};
						};
					};
					xhttp.send();
				};
			};
		});
	};
    console.log("%cMD-Fuzzer Done "+counter, "color: yellow; font-size: x-medium");
    chrome.storage.local.set({"results":my_results});
    chrome.storage.local.set({"status":"Found Possible Cases: "+counter});
});