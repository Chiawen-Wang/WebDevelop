app.factory('suggestions', [function(){
    var demosu = {posts:[{title:'Free pizza at club meetings',upvotes:15,comments:[{body:"I don't like this idea!", upvotes:2}]},{title:'End all club emails with Laffy Taffy jokes',upvotes:9,comments:[{body:"I think it's good", upvotes:2}]},{title:'Retrofit water fountain with Gatorade',upvotes:7,comments:[{body:'No opinion', upvotes:2}]},{title:'Sing Bon Jovi\'s "Living on a Prayer" halfway through meetings',upvotes:3,comments:[{body:'wow, this is good', upvotes:2}]}]};
    return demosu;

}]);