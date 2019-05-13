function requestApi(){
    var valueToSearch = document.getElementById("searchBox").value.trim();
    var url;
    var apiRequested = document.getElementById("change").checked;
    if(apiRequested){
        url = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyCz3PQLjqxJPBUF-0rLdobTio3zJ_PPQaw&part=snippet&maxResults=20&q="+valueToSearch+"";
    }
    else{
        url ="https://rickandmortyapi.com/api/character/?name="+valueToSearch+"";
    }
    var xmlhttp = new XMLHttpRequest();
    var response = {};
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
        // Typical action to be performed when the document is ready:
            response = JSON.parse(xmlhttp.responseText);
            if(apiRequested)
                showResponsesFromYouTubeAPI(response,valueToSearch);
            else
                showResponsesFromRickAndMortyAPI(response,valueToSearch);
        }
        else if(this.status === 404 || this.status !== 0){
            var labelCont = document.getElementById("changePlaceholder");
            labelCont.textContent = "";
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function showResponsesFromRickAndMortyAPI(response,valueToSearch){
    response = orderElementsRickAndMortyAPI(response,valueToSearch);

    var labelCont = document.getElementById("changePlaceholder");
    if(valueToSearch){
        var deleteCharacters =  response.results[0].name.toLowerCase().split(valueToSearch.toLowerCase().trim());
        deleteCharacters[1] = deleteCharacters[1];
        labelCont.textContent = deleteCharacters.join(valueToSearch);
    }
    else{
        labelCont.textContent = valueToSearch;
    }
    

    var containerList = document.getElementById("container");
    var ulExist = document.getElementById("listResult");

    if(ulExist){
        ulExist.parentNode.removeChild(ulExist);
    }
    var ul = document.createElement('ul');
    ul.setAttribute('id','listResult');
    containerList.appendChild(ul);

    for(var index = 0; index < response.results.length; index++){
        var li = document.createElement('li');
        li.setAttribute('class','elements');
        li.innerHTML = response.results[index].name.replace(regex, valueToSearch.bold());
        ul.appendChild(li);
    }
}

function orderElementsRickAndMortyAPI(response,valueToSearch){
    var objLength = response.results.length;
    var index2, temporal;
    var elementTemporal;
        for ( var index1 = 1; index1 < objLength; index1++ ) {
            index2 = index1;
            temporal = response.results[index1];

            elementTemporal = temporal.name.toUpperCase().indexOf(valueToSearch.toUpperCase());
            elementTemporal = elementTemporal >= 0 ? elementTemporal : 1000;

            nextElement = response.results[ index2 - 1 ].name.toUpperCase().indexOf(valueToSearch.toUpperCase());
            nextElement = nextElement >= 0 ? nextElement : 1000; 
            
            while ( index2 > 0 &&  nextElement > elementTemporal ) {
                response.results[ index2 ] = response.results[ index2 - 1 ];
                index2--;
                if(index2 > 0){
                    nextElement = response.results[ index2 - 1 ].name.toUpperCase().indexOf(valueToSearch.toUpperCase());
                    nextElement = nextElement >= 0 ? nextElement : 1000; 
                }
            }
            response.results[ index2 ] = temporal;
        }
      
        return response;
}

document.getElementById("searchBox").addEventListener("keyup",requestApi);

function showResponsesFromYouTubeAPI(response,valueToSearch){
    response = orderElementsYouTubeAPI(response,valueToSearch);

    /*var inputCont = document.getElementById("inputContainer");
    inputCont.setAttribute("data-placeholder", response.results[0].name);*/

    var containerList = document.getElementById("container");
    var ulExist = document.getElementById("listResult");

    if(ulExist){
        ulExist.parentNode.removeChild(ulExist);
    }
    var ul = document.createElement('ul');
    ul.setAttribute('id','listResult');
    containerList.appendChild(ul);

    for(var index = 0; index < response.items.length; index++){
        if(response.items[index].snippet.title.toUpperCase().indexOf(valueToSearch.toUpperCase()) === -1){
            break;
        }
        else
        {
            var li = document.createElement('li');
            li.setAttribute('class','elements');
            var txt = unescape(response.items[index].snippet.title);
            li.textContent = txt;
            ul.appendChild(li);
        }
    }
}

function orderElementsYouTubeAPI(response,valueToSearch){
    var objLength = response.items.length;
    var index2, temporal;
    var elementTemporal,nextElement;
        for ( var index1 = 1; index1 < objLength; index1++ ) {
            index2 = index1;
            temporal = response.items[index1];

            elementTemporal = temporal.snippet.title.toUpperCase().indexOf(valueToSearch.toUpperCase());
            elementTemporal = elementTemporal >= 0 ? elementTemporal : 1000;

            nextElement = response.items[ index2 - 1 ].snippet.title.toUpperCase().indexOf(valueToSearch.toUpperCase());
            nextElement = nextElement >= 0 ? nextElement : 1000; 

            while ( index2 > 0 &&   nextElement > elementTemporal ) {
                response.items[ index2 ] = response.items[ index2 - 1 ];
                index2--;
                if(index2 > 0){
                    nextElement = response.items[ index2 - 1 ].snippet.title.toUpperCase().indexOf(valueToSearch.toUpperCase());
                    nextElement = nextElement >= 0 ? nextElement : 1000;
                }
            }
            response.items[ index2 ] = temporal;
        }
      
        return response;
}