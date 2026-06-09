import urllib.request
url = 'https://www.jumonji-u.ac.jp/sscs/ikeda/cognitive_bias/video/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req, timeout=30).read().decode('utf-8')
open('scripts/video_page.html', 'w', encoding='utf-8').write(html)
print(len(html), 'bytes')
