var SearchBox = debounce(function(){
    var valueToSearch;
    var apiRequested;
    var response;
    var regex;

    var requestApi = function(){
        valueToSearch = document.getElementById("searchBox").value.trim();
        var url;
        apiRequested = document.getElementById("change").checked;
        regex = new RegExp(valueToSearch, 'i');
        if(apiRequested){
            url = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyCz3PQLjqxJPBUF-0rLdobTio3zJ_PPQaw&part=snippet&maxResults=20&q="+valueToSearch+"";
        }
        else{
            url ="https://rickandmortyapi.com/api/character/?name="+valueToSearch+"";
        }
        xmlHttpRequest(url);
    }

    var xmlHttpRequest = function(url){
        var xmlhttp = new XMLHttpRequest();
        response = {};
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200){
                response = JSON.parse(xmlhttp.responseText);
                if(apiRequested)
                    modifiedObjectYoutubeProperties();
                showResponses();
            }
            else if(this.status === 404 || this.status !== 0){
                var labelCont = document.getElementById("changePlaceholder");
                labelCont.textContent = "";
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }

    var modifiedObjectYoutubeProperties = function(){
        var results = [];
        results = results.map.call( response.items, function(v){
            var contentObj = {name};
			contentObj.name = v.snippet.title;
            return contentObj;
        } );
        var newObj = {results};
        response = newObj;
    }
    
    var showResponses = function(){

        orderElements();
        sugggestionWriter();
        createSuggestionInDOM();
    }
    
    var orderElements = function(){
        var objLength = response.results.length;
        var index2, temporal;
        var elementTemporal;

        for ( var index1 = 1; index1 < objLength; index1++ ) {
            index2 = index1;
            temporal = response.results[index1];
            elementTemporal = temporal.name.search(regex);
            elementTemporal = elementTemporal >= 0 ? elementTemporal : 1000;
            nextElement = response.results[ index2 - 1 ].name.search(regex);
            nextElement = nextElement >= 0 ? nextElement : 1000; 
                
            while ( index2 > 0 &&  nextElement > elementTemporal ) {
                response.results[ index2 ] = response.results[ index2 - 1 ];
                index2--;
                if(index2 > 0){
                    nextElement = response.results[ index2 - 1 ].name.search(regex);
                    nextElement = nextElement >= 0 ? nextElement : 1000; 
                }
            }
            response.results[ index2 ] = temporal;
        }
    }
    
    var sugggestionWriter = function(){
        var labelCont = document.getElementById("changePlaceholder");

        if(valueToSearch){
            if(response.results[0].name.search(regex) != 0){
                var deleteCharacters = response.results[0].name.split(regex);
                delete deleteCharacters[0];
                var replaceCharacters = deleteCharacters.join(valueToSearch);
            }
            else{
                var replaceCharacters =  response.results[0].name.replace(regex, valueToSearch);
            }
            labelCont.textContent = replaceCharacters;
        }
        else{
            labelCont.textContent = "";
        }
    }

    var createSuggestionInDOM = function(){
        var containerList = document.getElementById("container");
        deleteListOfSuggestion();
    
        var ul = document.createElement('ul');
        ul.setAttribute('id','listResult');
        containerList.appendChild(ul);
    
        for(var index = 0; index < response.results.length; index++){
            if(response.results[index].name.search(regex) === -1){
                break;
            }
            else{
                var li = document.createElement('li');
                li.setAttribute('class','elements');
                li.innerHTML = response.results[index].name.replace(regex, valueToSearch.bold());
                ul.appendChild(li);
            }
        }
    }
    
    var deleteListOfSuggestion = function(){
        var ulExist = document.getElementById("listResult");
    
        if(ulExist){
            ulExist.parentNode.removeChild(ulExist);
        }
    }
    requestApi();
},250);

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

document.getElementById("searchBox").addEventListener("keyup",SearchBox);