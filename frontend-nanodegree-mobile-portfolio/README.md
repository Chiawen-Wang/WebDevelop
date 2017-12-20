#Optimize index.html
###How to run the application?
Open the file 'index.html' in chrome or other browser (better be chrome though ^ _ ^)
###For CSS files
1. For *print.css*, I inlined it to the *index.html*
2. For *style.css*, I inlined some important part in *index.html*, then I include this css file in the bottom of the html body

###For JS files
1. I moved all script tag in *index.html*   to the bottom of the body tag and add asyn attribute to each of them
2. I used Js minifier to compress the *perfmatters.js* file 

###For HTML files
1. I used online tools to compress index.html file
2. I used tools to compress images so it won't take too long to download them. 

###Problems
1. When I use PageSpeed to test index.html, it suggest to use gzip to transfer files, I think those a more back-end side? I indeed managed to use gulp to compress those files to gzip file, but don't know how exactly gzip can be used?
2. PageSpeed also suggest to use cache to improve the time, but I still confused how to set cache from front-end side?

#Optimize pizza.html
###How to run the application?   
Open the file 'pizza.html' in chrome  
###what I have done
1. In *main.js* file, I altered function *updatePositions()*,   it is not wise to using document.documentElement.scrollTop, because it will effect the DOM, so I take it out from the for loop and asigned it to a variable.
2. around line 415, I changed the API to document.getElementById() for efficiency purpose
3. Around line 462, I saved the array length in a local variable, also for efficiency purpose.
4. Around line 480, I moved the pizzasDiv out of the for loop, so the DOM call will be only called once.
4. Around line 539, I caculated how many pizza needed with the height of the screen.
2. For function *changePizzaSizes(size)*, for some reason, reading the *offsetWidth* of each pizza seems takes long time, so I removed this operation, and changed the function into directly change teh width of the pizza
