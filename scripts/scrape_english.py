"""Scrape English terms from 錯思コレクション100 bias pages."""
import json
import re
import urllib.request
from html import unescape
from urllib.parse import urljoin

VIDEO = "https://www.jumonji-u.ac.jp/sscs/ikeda/cognitive_bias/video/"
HTML_FILE = "scripts/video_page.html"
OUT_FILE = "scripts/english_terms.json"


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as res:
        return res.read().decode("utf-8", errors="replace")


def main():
    with open(HTML_FILE, encoding="utf-8") as f:
        html = f.read()

    items = []
    for m in re.finditer(
        r'href="([^"]+)"[^>]*><span class="layIcon">([^<]+)</span>', html
    ):
        href, name = m.group(1), unescape(m.group(2).strip())
        items.append((name, urljoin(VIDEO, href.split("#")[0])))

    en = {}
    for name, url in items:
        h = fetch(url)
        m = re.search(r"<h1[^>]*>.*?<span>([^<]+)</span>", h, re.S)
        en[name] = unescape(m.group(1).strip()) if m else ""
        print(f"{name} -> {en[name]}")

    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(en, f, ensure_ascii=False, indent=2)

    missing = [k for k, v in en.items() if not v]
    print(f"Wrote {len(en)} terms, missing: {len(missing)}")


if __name__ == "__main__":
    main()
