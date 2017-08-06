import requests
from pyquery import PyQuery as pq
import io
import sys
import urllib.request
import urllib.request, urllib.parse, urllib.error
from bs4 import BeautifulSoup
import ssl
import requests
import json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer,encoding='gb18030')
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
url = "http://bang.dangdang.com/books/bestsellers/01.00.00.00.00.00-24hours-0-0-1-1"
html = urllib.request.urlopen(url, context=ctx).read()
soup = BeautifulSoup(html,'html5lib')
tags = soup('div')

imgUrl = dict()
Total = list()
price = list()
spanpr = list()


imgs = soup("img")
for img in imgs:
    if 'title' in img.attrs:
        imgUrl[img.attrs["title"]] = img.attrs["src"]

ps = soup("p")
for p in ps:
    if 'class' not in p.attrs:
         spanpr.append(p.find_all('span',class_="price_n"))
for i in range(2,len(spanpr),1):
    price.append(spanpr[i][0].string[1:])


i = 0
for name in imgUrl:
    temp = dict()
    temp["name"] = name
    temp["imgUrl"] =  imgUrl[name]
    temp["price"] = price[i]
    i = i + 1
    Total.append(temp)
json = json.dumps(Total,ensure_ascii=False)

f=open('DangDangjson.json','w')
f.write(json)
f.close()







