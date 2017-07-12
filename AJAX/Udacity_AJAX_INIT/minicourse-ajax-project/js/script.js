
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var street = $("input#street").val();
    var city = $("input#city").val();
    var address = street + "," + city;
    var streetUrl = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '&key=AIzaSyD92MyXVE9_BeVE_QP-u9s7_rDr1BHnuFw';
    var articleUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q = address&sort=newest&api-key=6d85a5b212ef4b448d705efd15412d68';
    var wikiUrl = 'https://e.wikipedia.org/w/api.php?action=opensearch&search="'+city+'"&format=json&callback=wikiCallback';
    

    $body.append('<img class = "bgimg"  style = "width:100%; height:100%" src = "' + streetUrl + '">');
    $greeting.text("So you want to live in " + address +" !");
    $.getJSON(articleUrl,function(data){
     
        $nytHeaderElem.text("These news are about: " + address);
        articles = data.response.docs;
        for(var i = 0; i < articles.length; i++)
        {
            var article = articles[i];
            $nytElem.append('<li class = "article">' + '<a href = "'+ article.web_url+'">'+article.headline.main+'</a>'+ '<p>' + article.snippet + '</p>'+'</li>');
        }
    }).error(function(){
        $nytHeaderElem.text("Can't find the news");
    });
    var wikiTimeout = setTimeout(function(){
        $wikiElem.text("Failed to get wikipedia resources");
    }, 8000);


    $.ajax({
        url:wikiUrl,
        dataType:'jsonp',
        success:function(data){
            
            console.log(data);
            var articlestr = data[1];
            var artiListUrl = data[3];
            for(var i = 0; i < articlestr.length; i++){
                var url = artiListUrl[i];
                $wikiElem.append('<li><a href="'+url+'">'+ articlestr[i] + '</a></li>');
            };
            clearTimeout(wikiTimeout);

        }
    });

    
    return false;
};

$('#form-container').submit(loadData);
