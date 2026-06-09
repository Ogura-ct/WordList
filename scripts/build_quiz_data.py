"""Build quiz data with verified definitions."""
import json
import os
import re
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape
from urllib.parse import urljoin

from definitions import DEFINITIONS

BASE = "https://www.jumonji-u.ac.jp/sscs/ikeda/cognitive_bias/"
VIDEO = BASE + "video/"
HTML_FILE = os.path.join(os.path.dirname(__file__), "video_page.html")
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "themes", "cognitive-bias", "data")
OUT_FILE = os.path.join(OUT_DIR, "quiz.json")

HEADERS = {"User-Agent": "Mozilla/5.0 (WordList study tool)"}


def fetch(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as res:
        return res.read().decode("utf-8", errors="replace")


def parse_video_list(html):
    items = []
    current_category = ""
    for m in re.finditer(
        r'<h2>([^<]+)</h2>|'
        r'<ul class="videoListLink">(.*?)</ul>',
        html,
        re.S,
    ):
        if m.group(1):
            current_category = m.group(1).replace("に関する認知バイアス", "")
            continue
        block = m.group(2)
        for link in re.finditer(
            r'href="([^"]+)"[^>]*><span class="layIcon">([^<]+)</span>',
            block,
        ):
            href, name = link.group(1), unescape(link.group(2).strip())
            url = urljoin(VIDEO, href.split("#")[0])
            items.append({"term": name, "category": current_category, "sourceUrl": url})
    return items


def build_item(item, index):
    term = item["term"]
    entry = DEFINITIONS.get(term)
    if not entry:
        raise KeyError(f"Missing definition for: {term}")
    return {
        "id": f"cb{index:03d}",
        "term": term,
        "meaning": entry["meaning"],
        "example": entry["example"],
        "category": item["category"],
        "sourceUrl": item["sourceUrl"],
    }


def main():
    with open(HTML_FILE, encoding="utf-8") as f:
        html = f.read()

    items = parse_video_list(html)
    print(f"Parsed {len(items)} biases")

    missing = [i["term"] for i in items if i["term"] not in DEFINITIONS]
    extra = set(DEFINITIONS) - {i["term"] for i in items}
    if missing:
        raise SystemExit(f"Missing definitions: {missing}")
    if extra:
        print(f"Warning: unused definitions: {extra}")

    results = [build_item(item, i + 1) for i, item in enumerate(items)]

    data = {
        "source": {
            "title": "錯思コレクション100 — 動画で学ぶ One-Minute BiasSkit",
            "url": VIDEO,
            "organization": "十文字学園女子大学 池田正史研究室",
            "copyright": "Copyright © 2018 Masami IKEDA Laboratory",
            "note": "問題文は錯思コレクション100の解説をもとに、学習用に要約・校正したものです。",
        },
        "questions": results,
    }

    os.makedirs(OUT_DIR, exist_ok=True)
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Wrote {OUT_FILE} ({len(results)} questions)")


if __name__ == "__main__":
    main()
