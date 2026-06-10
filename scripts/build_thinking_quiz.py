"""Build thinking-tools theme quiz data."""
import json
import os

from thinking_definitions import DEFINITIONS

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "themes", "thinking-tools", "data")
OUT_FILE = os.path.join(OUT_DIR, "quiz.json")


def main():
    questions = []
    for i, item in enumerate(DEFINITIONS, start=1):
        questions.append({
            "id": f"tt{i:03d}",
            "term": item["term"],
            "termEn": item["termEn"],
            "meaning": item["meaning"],
            "example": item["example"],
            "category": item["category"],
        })

    data = {
        "source": {
            "title": "ビジネス・心理学・自己啓発の思考法・フレームワーク",
            "note": "錯思コレクション（認知バイアス）とは別テーマの学習用データです。",
        },
        "questions": questions,
    }

    os.makedirs(OUT_DIR, exist_ok=True)
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(questions)} questions to {OUT_FILE}")


if __name__ == "__main__":
    main()
