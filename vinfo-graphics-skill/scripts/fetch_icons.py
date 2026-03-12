#!/usr/bin/env python3
"""
Iconify Icon Fetcher for VInfo Graphics

根据数据中的 categoryField 对应的值，从 Iconify API 搜索语义化图标。
所有图标保持同一图标集（风格、大小一致）。

Usage:
    # 基本用法：传入类目列表和关键词
    python fetch_icons.py --categories '["微信","抖音","微博"]' --keywords '["social","chat"]'

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


# 推荐的图标集（按优先级）
PREFERRED_COLLECTIONS = ["mdi", "fa6-solid", "bi", "carbon", "tabler", "lucide", "ph"]

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


def search_icon_for_category(category, extra_keywords, all_results_cache):
    """为单个类目搜索图标，返回所有匹配结果"""
    keywords_to_try = []

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


def fetch_icons(categories, keywords, prefer_collection=None, size=None):
    """
    主函数：为所有类目统一获取图标。
    保证所有图标来自同一图标集（风格、大小一致）。

    Returns:
        dict: { "iconField": "iconKey", "map": { category: url, ... }, "collection": "mdi", "icons": [...] }
    """
    all_results_cache = {}
    category_results = {}

    # 搜索所有类目的图标
    all_icons = []
    for cat in categories:
        results = search_icon_for_category(cat, keywords, all_results_cache)
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
    parser.add_argument("--prefer-collection", default=None, help="Preferred icon collection (e.g. mdi, bi, tabler)")
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

    result = fetch_icons(categories, keywords, args.prefer_collection, args.size)

    output_json = json.dumps(result, ensure_ascii=False, indent=2)
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(output_json)
        print(f"Icons saved to {args.output}", file=sys.stderr)
    else:
        print(output_json)


if __name__ == "__main__":
    main()
