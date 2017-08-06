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
url = "http://book.jd.com/booktop/0-0-0.html?category=1713-0-0-0-10001-1#comfort"
html = urllib.request.urlopen(url, context=ctx).read()
soup = BeautifulSoup(html,'html5lib')
tags = soup('a')
nameUrl = dict()
imgUrl = dict()
Total = list()
for tag in tags:
    attr = tag.attrs
    if 'class' in attr:
        cla = attr['class']
        if 'p-name' in cla:
            href = tag.get('href',None)
            nameUrl[tag.string] = href
for name in nameUrl:
    burl = "http://"+ nameUrl[name][2:]
    bookhtml = urllib.request.urlopen(burl, context=ctx).read()
    booksoup = BeautifulSoup(bookhtml,'html5lib')
    booktags = booksoup('img')
    for btag in booktags:
        battr = btag.attrs
        if 'data-img' in battr:
            bimg = battr['data-img']
            if '1' in bimg:
                src = btag.get("src",None)
                imgUrl[name] = src
for name in nameUrl:
    temp = dict()
    temp["name"] = name
    temp["price"] = 0
    temp["imgUrl"] = imgUrl[name]
    Total.append(temp)
json = json.dumps(Total,ensure_ascii=False)

f=open('JDjson.json','w')
f.write(json)
f.close()
#json = json.dumps(json1[0],sort_keys=True,indent=4,separators=(',',':'))







