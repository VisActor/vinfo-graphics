#!/usr/bin/env python3
"""
Unsplash Image Selector for VInfo Graphics

根据数据主题/关键词，从预设 Unsplash 图片库中匹配合适的背景图和装饰图。
图片来自预设库 (references/unsplash/images.json)，确保可用性。

Usage:
    # 按关键词搜索背景图
    python fetch_unsplash.py --keywords '["科技","数据"]'

    # 按分类直接获取
    python fetch_unsplash.py --category technology

    # 指定尺寸
    python fetch_unsplash.py --keywords '["商务","办公"]' --width 1920 --height 1080

    # 获取多张图片（用于装饰）
    python fetch_unsplash.py --keywords '["自然","绿色"]' --count 3

    # 列出所有可用分类
    python fetch_unsplash.py --list-categories

    # 输出写入文件
    python fetch_unsplash.py --category finance --output bg.json
"""

import argparse
import json
import sys
import os
from pathlib import Path


def get_images_json_path():
    """获取 images.json 文件路径"""
    script_dir = Path(__file__).parent.resolve()
    return script_dir.parent / "references" / "unsplash" / "images.json"


def load_images_db(db_path=None):
    """加载图片数据库"""
    path = Path(db_path) if db_path else get_images_json_path()
    if not path.exists():
        print(f"Error: Images database not found: {path}", file=sys.stderr)
        sys.exit(1)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def build_image_url(image_id, url_template, width=1920, height=1080):
    """根据模板构建完整图片 URL"""
    url = url_template.replace("{id}", image_id)
    url = url.replace("w=1920", f"w={width}").replace("h=1080", f"h={height}")
    return url


def search_by_category(db, category):
    """按分类获取图片列表"""
    categories = db.get("categories", {})
    if category not in categories:
        return []
    return categories[category].get("images", [])


def search_by_keywords(db, keywords):
    """
    按关键词在所有分类中搜索。
    匹配策略：关键词匹配分类描述、图片描述或图片标签。
    返回按相关度排序的结果。
    """
    categories = db.get("categories", {})
    scored_images = []

    for cat_name, cat_data in categories.items():
        cat_desc = cat_data.get("description", "")
        for img in cat_data.get("images", []):
            score = 0
            img_desc = img.get("description", "")
            img_tags = img.get("tags", [])

            for kw in keywords:
                kw_lower = kw.lower()
                # 分类名匹配
                if kw_lower in cat_name.lower():
                    score += 3
                # 分类描述匹配
                if kw_lower in cat_desc:
                    score += 2
                # 图片描述匹配
                if kw_lower in img_desc:
                    score += 3
                # 标签匹配
                for tag in img_tags:
                    if kw_lower in tag.lower():
                        score += 2

            if score > 0:
                scored_images.append({
                    "image": img,
                    "category": cat_name,
                    "score": score,
                })

    # 按分数降序，去重（同一 id 取最高分）
    seen_ids = set()
    unique_results = []
    for item in sorted(scored_images, key=lambda x: x["score"], reverse=True):
        img_id = item["image"]["id"]
        if img_id not in seen_ids:
            seen_ids.add(img_id)
            unique_results.append(item)

    return unique_results


def main():
    parser = argparse.ArgumentParser(description="Select Unsplash images for infographic backgrounds/decorations")
    parser.add_argument("--keywords", default=None, help='JSON array of search keywords, e.g. \'["科技","数据"]\'')
    parser.add_argument("--category", default=None, help="Direct category name (e.g. technology, business, nature)")
    parser.add_argument("--width", type=int, default=1920, help="Image width (default: 1920)")
    parser.add_argument("--height", type=int, default=1080, help="Image height (default: 1080)")
    parser.add_argument("--count", type=int, default=1, help="Number of images to return (default: 1)")
    parser.add_argument("--list-categories", action="store_true", help="List all available categories")
    parser.add_argument("--db", default=None, help="Path to images.json (default: auto-detect)")
    parser.add_argument("--output", default=None, help="Output JSON file path (default: stdout)")

    args = parser.parse_args()

    db = load_images_db(args.db)
    url_template = db.get("urlTemplate", "https://images.unsplash.com/photo-{id}?w=1920&h=1080&fit=crop")

    # 列出所有分类
    if args.list_categories:
        categories = db.get("categories", {})
        result = []
        for name, data in categories.items():
            result.append({
                "name": name,
                "description": data.get("description", ""),
                "imageCount": len(data.get("images", [])),
            })
        output = json.dumps(result, ensure_ascii=False, indent=2)
        if args.output:
            with open(args.output, "w", encoding="utf-8") as f:
                f.write(output)
        else:
            print(output)
        return

    # 按分类搜索
    if args.category:
        images = search_by_category(db, args.category)
        selected = images[: args.count]
        results = []
        for img in selected:
            results.append({
                "id": img["id"],
                "description": img.get("description", ""),
                "url": build_image_url(img["id"], url_template, args.width, args.height),
                "category": args.category,
                "tags": img.get("tags", []),
            })
    # 按关键词搜索
    elif args.keywords:
        try:
            keywords = json.loads(args.keywords)
        except json.JSONDecodeError:
            print("Error: --keywords must be a valid JSON array", file=sys.stderr)
            sys.exit(1)

        matched = search_by_keywords(db, keywords)
        selected = matched[: args.count]
        results = []
        for item in selected:
            img = item["image"]
            results.append({
                "id": img["id"],
                "description": img.get("description", ""),
                "url": build_image_url(img["id"], url_template, args.width, args.height),
                "category": item["category"],
                "tags": img.get("tags", []),
                "relevanceScore": item["score"],
            })
    else:
        print("Error: Provide --keywords, --category, or --list-categories", file=sys.stderr)
        sys.exit(1)

    if not results:
        print("Warning: No matching images found", file=sys.stderr)

    output = json.dumps(results, ensure_ascii=False, indent=2)
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(output)
        print(f"Results saved to {args.output}", file=sys.stderr)
    else:
        print(output)


if __name__ == "__main__":
    main()
