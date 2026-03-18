#!/usr/bin/env python3
"""
Iconify Icon Fetcher for VInfo Graphics

根据数据中的 categoryField 对应的值，从 Iconify API 搜索语义化图标。
所有图标保持同一图标集（风格、大小一致）。

支持两种搜索模式：
1. 共享关键词模式（默认）：所有类目使用相同关键词搜索
2. 逐类目关键词模式（--per-category-keywords）：每个类目使用独立关键词搜索，适用于
   国家/国旗、品牌 Logo、具体实体等需要每个类目拥有不同语义图标的场景

Usage:
    # 基本用法：传入类目列表和关键词（共享模式）
    python fetch_icons.py --categories '["微信","抖音","微博"]' --keywords '["social","chat"]'

    # 逐类目关键词模式：每个类目有独立搜索词（适合国旗、品牌等）
    python fetch_icons.py \
      --categories '["Norway","Estonia","Greece"]' \
      --per-category-keywords '{"Norway":"norway","Estonia":"estonia","Greece":"greece"}' \
      --prefer-collection circle-flags

    # 指定偏好图标集
    python fetch_icons.py --categories '["手机","电脑","平板"]' --keywords '["device","electronics"]' --prefer-collection mdi

    # 搜索并输出 JSON 映射（直接写入文件）
    python fetch_icons.py --categories '["产品A","产品B","产品C"]' --keywords '["product","box","package"]' --output icons.json

    # 指定 icon 尺寸（URL 参数）
    python fetch_icons.py --categories '["北京","上海","广州"]' --keywords '["city","location"]' --size 32
"""

import argparse
import json
import sys
import urllib.request
import urllib.parse
import urllib.error
from collections import Counter


# 推荐的通用图标集（按优先级）
PREFERRED_COLLECTIONS = ["mdi", "fluent", "ph", "tabler", "solar", "fa6-solid", "carbon", "lucide", "bi"]

# 国旗/地区专用图标集（按优先级）
FLAG_COLLECTIONS = ["circle-flags", "flagpack", "flag", "twemoji", "emojione"]

# 品牌/公司专用图标集（按优先级）
BRAND_COLLECTIONS = ["simple-icons", "fa7-brands", "logos", "cib", "bxl"]

# 编程语言/技术专用图标集（按优先级）
PROGRAMMING_COLLECTIONS = ["devicon", "devicon-plain", "skill-icons", "vscode-icons"]

# 主题专用图标集
THEMATIC_COLLECTIONS = {
    "game": ["game-icons"],
    "health": ["healthicons"],
    "weather": ["meteocons", "wi"],
    "geo": ["gis", "map"],
}

# 中文类目到英文关键词的常见映射
CATEGORY_KEYWORD_HINTS = {
    "社交": ["social", "chat", "message"],
    "微信": ["wechat", "chat"],
    "抖音": ["tiktok", "music", "video"],
    "微博": ["weibo", "blog"],
    "手机": ["phone", "mobile", "cellphone"],
    "电脑": ["computer", "laptop", "desktop"],
    "平板": ["tablet", "ipad"],
    "金融": ["finance", "bank", "money"],
    "股票": ["chart", "trending", "stock"],
    "基金": ["fund", "investment"],
    "服装": ["shirt", "clothing", "fashion"],
    "食品": ["food", "restaurant"],
    "数码": ["digital", "device", "gadget"],
    "北京": ["city", "building", "location"],
    "上海": ["city", "building", "location"],
    "广州": ["city", "building", "location"],
    "员工": ["account", "user", "person"],
    "客户": ["user", "people", "customer"],
    "时间": ["clock", "time", "calendar"],
    "排名": ["trophy", "medal", "award"],
    "增长": ["trending-up", "growth", "arrow-up"],
    "下降": ["trending-down", "arrow-down"],
}


def search_iconify(keyword, limit=999):
    """调用 Iconify 搜索 API"""
    url = f"https://api.iconify.design/search?query={urllib.parse.quote(keyword)}&limit={limit}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "VInfoGraphics/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("icons", [])
    except (urllib.error.URLError, json.JSONDecodeError) as e:
        print(f"Warning: Failed to search '{keyword}': {e}", file=sys.stderr)
        return []


def get_icon_url(icon_id, size=None):
    """生成 Iconify SVG URL"""
    collection, name = icon_id.split(":", 1) if ":" in icon_id else (icon_id.rsplit("/", 1) if "/" in icon_id else (icon_id, icon_id))
    url = f"https://api.iconify.design/{collection}/{name}.svg"
    if size:
        url += f"?width={size}&height={size}"
    return url


def find_best_collection(all_icons, prefer_collection=None):
    """
    从搜索结果中找到最佳统一图标集。
    策略：选择搜索结果中出现频率最高的图标集，保持风格一致。
    """
    collection_counts = Counter()
    for icon_id in all_icons:
        if ":" in icon_id:
            col = icon_id.split(":")[0]
            collection_counts[col] += 1

    if not collection_counts:
        return None

    # 如果指定了偏好图标集，且该集有结果，优先使用
    if prefer_collection and collection_counts.get(prefer_collection, 0) > 0:
        return prefer_collection

    # 按优先级和数量综合选择
    best = None
    best_score = -1
    for col, count in collection_counts.items():
        priority_bonus = 0
        if col in PREFERRED_COLLECTIONS:
            priority_bonus = (len(PREFERRED_COLLECTIONS) - PREFERRED_COLLECTIONS.index(col)) * 10
        score = count + priority_bonus
        if score > best_score:
            best_score = score
            best = col
    return best


def search_icon_for_category(category, extra_keywords, all_results_cache, per_category_kw=None):
    """为单个类目搜索图标，返回所有匹配结果

    Args:
        category: 类目名称
        extra_keywords: 共享的额外搜索关键词
        all_results_cache: 搜索结果缓存
        per_category_kw: 该类目专属的搜索关键词（字符串或列表），如有则优先使用
    """
    keywords_to_try = []

    # 如果有逐类目专属关键词，优先使用
    if per_category_kw:
        if isinstance(per_category_kw, list):
            keywords_to_try.extend(per_category_kw)
        else:
            keywords_to_try.append(per_category_kw)
    else:
        # 尝试中文关键词提示
        for hint_key, hint_words in CATEGORY_KEYWORD_HINTS.items():
            if hint_key in category:
                keywords_to_try.extend(hint_words)

    # 追加用户提供的额外关键词
    keywords_to_try.extend(extra_keywords)

    # 如果没有关键词，直接用类目名搜索
    if not keywords_to_try:
        keywords_to_try = [category]

    results = []
    for kw in keywords_to_try:
        if kw not in all_results_cache:
            all_results_cache[kw] = search_iconify(kw)
        results.extend(all_results_cache[kw])

    return results


def pick_icon_from_collection(icons, collection, category, used_icons):
    """从指定集合中为类目选一个图标，避免重复"""
    candidates = [ic for ic in icons if ic.startswith(f"{collection}:") and ic not in used_icons]
    if not candidates:
        # 退而用任意集合
        candidates = [ic for ic in icons if ic not in used_icons]
    if not candidates:
        return None
    # 优先选择名称中包含类目相关关键词的
    category_lower = category.lower()
    for c in candidates:
        name_part = c.split(":")[-1] if ":" in c else c
        if category_lower in name_part.lower():
            return c
    return candidates[0]


def fetch_icons(categories, keywords, prefer_collection=None, size=None, per_category_keywords=None):
    """
    主函数：为所有类目统一获取图标。
    保证所有图标来自同一图标集（风格、大小一致）。

    Args:
        categories: 类目列表
        keywords: 共享搜索关键词
        prefer_collection: 偏好图标集
        size: 图标尺寸
        per_category_keywords: dict，每个类目的专属搜索关键词，如 {"Norway": "norway", "Estonia": "estonia"}

    Returns:
        dict: { "iconField": "iconKey", "map": { category: url, ... }, "collection": "mdi", "icons": [...] }
    """
    all_results_cache = {}
    category_results = {}

    # 搜索所有类目的图标
    all_icons = []
    for cat in categories:
        cat_kw = per_category_keywords.get(cat) if per_category_keywords else None
        results = search_icon_for_category(cat, keywords, all_results_cache, per_category_kw=cat_kw)
        category_results[cat] = results
        all_icons.extend(results)

    # 找到最佳统一图标集
    best_collection = find_best_collection(all_icons, prefer_collection)

    if not best_collection:
        print("Warning: No icons found for any category", file=sys.stderr)
        return {"iconField": "iconKey", "map": {}, "collection": None, "icons": []}

    # 为每个类目从统一集合中选择图标
    icon_map = {}
    icon_details = []
    used_icons = set()

    for cat in categories:
        icon_id = pick_icon_from_collection(category_results.get(cat, []), best_collection, cat, used_icons)
        if icon_id:
            used_icons.add(icon_id)
            url = get_icon_url(icon_id, size)
            icon_map[cat] = url
            icon_details.append({"category": cat, "iconId": icon_id, "url": url})
        else:
            print(f"Warning: No icon found for '{cat}'", file=sys.stderr)

    return {
        "iconField": "iconKey",
        "map": icon_map,
        "collection": best_collection,
        "icons": icon_details,
    }


def main():
    parser = argparse.ArgumentParser(description="Fetch consistent icons from Iconify for infographic categories")
    parser.add_argument("--categories", required=True, help='JSON array of category names, e.g. \'["微信","抖音"]\'')
    parser.add_argument("--keywords", default="[]", help='JSON array of extra search keywords, e.g. \'["social"]\'')
    parser.add_argument("--per-category-keywords", default=None,
                        help='JSON object mapping each category to its own search keyword(s). '
                             'Use when each category needs a distinct semantic icon (e.g. country flags). '
                             'Example: \'{"Norway":"norway","Estonia":"estonia"}\'')
    parser.add_argument("--prefer-collection", default=None, help="Preferred icon collection (e.g. mdi, circle-flags, flagpack)")
    parser.add_argument("--size", type=int, default=None, help="Icon size in pixels (applied to SVG URL)")
    parser.add_argument("--output", default=None, help="Output JSON file path (default: stdout)")

    args = parser.parse_args()

    try:
        categories = json.loads(args.categories)
    except json.JSONDecodeError:
        print("Error: --categories must be a valid JSON array", file=sys.stderr)
        sys.exit(1)

    try:
        keywords = json.loads(args.keywords)
    except json.JSONDecodeError:
        print("Error: --keywords must be a valid JSON array", file=sys.stderr)
        sys.exit(1)

    per_category_keywords = None
    if args.per_category_keywords:
        try:
            per_category_keywords = json.loads(args.per_category_keywords)
            if not isinstance(per_category_keywords, dict):
                print("Error: --per-category-keywords must be a JSON object", file=sys.stderr)
                sys.exit(1)
        except json.JSONDecodeError:
            print("Error: --per-category-keywords must be a valid JSON object", file=sys.stderr)
            sys.exit(1)

    result = fetch_icons(categories, keywords, args.prefer_collection, args.size, per_category_keywords)

    output_json = json.dumps(result, ensure_ascii=False, indent=2)
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(output_json)
        print(f"Icons saved to {args.output}", file=sys.stderr)
    else:
        print(output_json)


if __name__ == "__main__":
    main()
