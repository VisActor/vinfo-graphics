#!/usr/bin/env python3
"""
Brandfetch Brand Logo Fetcher for VInfo Graphics

通过 Brandfetch Search API 搜索品牌并获取官方 Logo URL。
适用于数据类目是品牌/公司名的信息图场景，提供比 Iconify 图标更真实的品牌标识。

Brandfetch 优势：
- 4400 万品牌库，覆盖全球主流品牌（含中国品牌：比亚迪、蔚来、小鹏等）
- 支持模糊搜索（输入 "byd" 可匹配比亚迪）
- 搜索 API 直接返回可用的 icon URL（128x128 WebP）

工作原理：
- 搜索 API（免费）：GET https://api.brandfetch.io/v2/search/{name}
  返回品牌列表，每个结果包含 icon 字段（直接可用的图片 URL）
- 脚本直接使用搜索结果中的 icon URL，无需额外的 CDN 拼接

Usage:
    # 基本用法：传入品牌名列表（内置中文品牌映射，自动翻译搜索）
    python fetch_brand_logos.py --brands '["比亚迪","蔚来","小鹏","理想","领克"]'

    # 指定品牌名到搜索词的映射（推荐，提高搜索准确性）
    python fetch_brand_logos.py \
      --brands '["比亚迪","蔚来","小鹏","理想","领克"]' \
      --search-names '{"比亚迪":"BYD","蔚来":"NIO","小鹏":"XPeng","理想":"Li Auto","领克":"Lynk & Co"}'

    # 输出到文件
    python fetch_brand_logos.py --brands '["Apple","Google","Microsoft"]' --output brand_logos.json
"""

import argparse
import json
import sys
import urllib.request
import urllib.parse
import urllib.error


# Brandfetch API 配置
BRANDFETCH_SEARCH_URL = "https://api.brandfetch.io/v2/search/{name}"

# 常见中文品牌 → 英文搜索名映射
# 搜索 API 需要英文/拼音才能匹配，内置映射省去手动翻译
KNOWN_BRAND_ALIASES = {
    # 汽车品牌
    "比亚迪": {"search": "BYD", "domain": "byd.com"},
    "蔚来": {"search": "NIO", "domain": "nio.com"},
    "小鹏": {"search": "XPeng", "domain": "xpeng.com"},
    "理想": {"search": "Li Auto", "domain": "li.auto"},
    "领克": {"search": "Lynk Co", "domain": "lynkco.com"},
    "吉利": {"search": "Geely", "domain": "geely.com"},
    "长城": {"search": "Great Wall", "domain": "gwm.com.cn"},
    "奇瑞": {"search": "Chery", "domain": "cheryinternational.com"},
    "特斯拉": {"search": "Tesla", "domain": "tesla.com"},
    "宝马": {"search": "BMW", "domain": "bmw.com"},
    "奔驰": {"search": "Mercedes-Benz", "domain": "mercedes-benz.com"},
    "奥迪": {"search": "Audi", "domain": "audi.com"},
    "大众": {"search": "Volkswagen", "domain": "volkswagen.com"},
    "丰田": {"search": "Toyota", "domain": "toyota.com"},
    "本田": {"search": "Honda", "domain": "honda.com"},
    "日产": {"search": "Nissan", "domain": "nissan.com"},
    "现代": {"search": "Hyundai", "domain": "hyundai.com"},
    "起亚": {"search": "Kia", "domain": "kia.com"},
    "保时捷": {"search": "Porsche", "domain": "porsche.com"},
    "法拉利": {"search": "Ferrari", "domain": "ferrari.com"},
    "兰博基尼": {"search": "Lamborghini", "domain": "lamborghini.com"},
    "沃尔沃": {"search": "Volvo", "domain": "volvo.com"},
    "福特": {"search": "Ford", "domain": "ford.com"},
    "通用": {"search": "General Motors", "domain": "gm.com"},
    "零跑": {"search": "leapmotor.cn", "domain": "leapmotor.cn"},
    "哪吒": {"search": "Neta Auto", "domain": "netauto.com"},
    "长安": {"search": "Changan", "domain": "changan.com.cn"},
    "赛力斯": {"search": "seres.cn", "domain": "seres.cn"},
    "鸿蒙智行": {"search": "Huawei", "domain": "huawei.com"},
    "上汽通用五菱": {"search": "Wuling", "domain": "wuling.id"},
    "极氪": {"search": "Zeekr", "domain": "zeekr.com"},
    "智己": {"search": "IM Motors", "domain": "immotors.com"},
    "岚图": {"search": "Voyah", "domain": "voyah.com"},
    "广汽埃安": {"search": "Aion", "domain": "aion.com.cn"},
    "深蓝": {"search": "Deepal", "domain": "deepal.com.cn"},
    # 科技品牌
    "苹果": {"search": "Apple", "domain": "apple.com"},
    "华为": {"search": "Huawei", "domain": "huawei.com"},
    "小米": {"search": "Xiaomi", "domain": "xiaomi.com"},
    "OPPO": {"search": "OPPO", "domain": "oppo.com"},
    "vivo": {"search": "vivo", "domain": "vivo.com"},
    "荣耀": {"search": "Honor", "domain": "honor.com"},
    "联想": {"search": "Lenovo", "domain": "lenovo.com"},
    "三星": {"search": "Samsung", "domain": "samsung.com"},
    "谷歌": {"search": "Google", "domain": "google.com"},
    "微软": {"search": "Microsoft", "domain": "microsoft.com"},
    "亚马逊": {"search": "Amazon", "domain": "amazon.com"},
    "脸书": {"search": "Meta", "domain": "meta.com"},
    # 互联网/社交
    "微信": {"search": "WeChat", "domain": "wechat.com"},
    "抖音": {"search": "TikTok", "domain": "tiktok.com"},
    "微博": {"search": "Weibo", "domain": "weibo.com"},
    "小红书": {"search": "Xiaohongshu", "domain": "xiaohongshu.com"},
    "淘宝": {"search": "Taobao", "domain": "taobao.com"},
    "京东": {"search": "JD", "domain": "jd.com"},
    "拼多多": {"search": "Pinduoduo", "domain": "pinduoduo.com"},
    "美团": {"search": "Meituan", "domain": "meituan.com"},
    "滴滴": {"search": "DiDi", "domain": "didiglobal.com"},
    "百度": {"search": "Baidu", "domain": "baidu.com"},
    "网易": {"search": "NetEase", "domain": "netease.com"},
    "腾讯": {"search": "Tencent", "domain": "tencent.com"},
    "阿里巴巴": {"search": "Alibaba", "domain": "alibaba.com"},
    "字节跳动": {"search": "ByteDance", "domain": "bytedance.com"},
    "快手": {"search": "Kuaishou", "domain": "kuaishou.com"},
    "哔哩哔哩": {"search": "Bilibili", "domain": "bilibili.com"},
    "B站": {"search": "Bilibili", "domain": "bilibili.com"},
    # 消费品牌
    "耐克": {"search": "Nike", "domain": "nike.com"},
    "阿迪达斯": {"search": "Adidas", "domain": "adidas.com"},
    "可口可乐": {"search": "Coca-Cola", "domain": "coca-cola.com"},
    "百事": {"search": "Pepsi", "domain": "pepsi.com"},
    "星巴克": {"search": "Starbucks", "domain": "starbucks.com"},
    "麦当劳": {"search": "McDonald's", "domain": "mcdonalds.com"},
    "肯德基": {"search": "KFC", "domain": "kfc.com"},
    "优衣库": {"search": "Uniqlo", "domain": "uniqlo.com"},
    "茅台": {"search": "Moutai", "domain": "moutai.com.cn"},
}


def get_client_id(client_id_arg=None):
    """获取 Brandfetch Client ID（可选，搜索 API 不强制要求）"""
    import os
    if client_id_arg:
        return client_id_arg
    return os.environ.get("BRANDFETCH_CLIENT_ID")


def search_brand(brand_name, client_id=None):
    """
    通过 Brandfetch 搜索 API 查找品牌，返回匹配结果列表。
    每个结果包含 icon 字段（直接可用的图片 URL）。

    Args:
        brand_name: 品牌名称（支持模糊搜索）
        client_id: Brandfetch client ID（可选）

    Returns:
        list: 匹配的品牌列表 [{"name": "...", "domain": "...", "icon": "...", "brandId": "..."}, ...]
    """
    encoded_name = urllib.parse.quote(brand_name)
    url = BRANDFETCH_SEARCH_URL.format(name=encoded_name)
    if client_id:
        url += f"?c={urllib.parse.quote(client_id)}"

    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "VInfoGraphics/1.0",
            "Accept": "application/json",
        })
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if isinstance(data, list):
                return data
            return []
    except (urllib.error.URLError, json.JSONDecodeError, urllib.error.HTTPError) as e:
        print(f"Warning: Brandfetch search failed for '{brand_name}': {e}", file=sys.stderr)
        return []


def get_search_term(brand_name, search_names=None):
    """
    确定品牌的搜索关键词。优先级：
    1. 用户通过 --search-names 指定的映射
    2. 内置 KNOWN_BRAND_ALIASES 映射
    3. 品牌名本身（适用于英文品牌名）

    Args:
        brand_name: 品牌名称
        search_names: 用户指定的搜索名映射

    Returns:
        str: 搜索关键词
    """
    if search_names and brand_name in search_names:
        return search_names[brand_name]
    if brand_name in KNOWN_BRAND_ALIASES:
        return KNOWN_BRAND_ALIASES[brand_name]["search"]
    return brand_name


def resolve_brand_logo(brand_name, client_id=None, search_names=None, expected_domain=None):
    """
    通过搜索 API 获取品牌 Logo URL。

    直接使用搜索 API 返回的 icon URL（128x128 WebP），
    这是最可靠的方式，不依赖 CDN 域名拼接。

    Args:
        brand_name: 品牌名称
        client_id: Brandfetch client ID（可选）
        search_names: 用户指定的搜索名映射
        expected_domain: 期望匹配的域名（用于验证搜索结果）

    Returns:
        dict: {"icon_url": "...", "domain": "...", "name": "..."} or None
    """
    search_term = get_search_term(brand_name, search_names)

    results = search_brand(search_term, client_id)
    if not results:
        return None

    # 如果有期望域名，优先匹配
    if expected_domain:
        for r in results:
            if r.get("domain") == expected_domain and r.get("icon"):
                return {
                    "icon_url": r["icon"],
                    "domain": r["domain"],
                    "name": r.get("name", brand_name),
                }

    # 如果内置映射有域名信息，尝试匹配
    alias = KNOWN_BRAND_ALIASES.get(brand_name)
    if alias and alias.get("domain"):
        for r in results:
            if r.get("domain") == alias["domain"] and r.get("icon"):
                return {
                    "icon_url": r["icon"],
                    "domain": r["domain"],
                    "name": r.get("name", brand_name),
                }

    # 取第一个有 icon 的结果
    for r in results:
        if r.get("icon"):
            return {
                "icon_url": r["icon"],
                "domain": r.get("domain", ""),
                "name": r.get("name", brand_name),
            }

    return None


def fetch_brand_logos(brands, client_id=None, search_names=None, domains=None):
    """
    主函数：为所有品牌获取 Logo URL。

    通过搜索 API 获取每个品牌的 icon URL，这些 URL 是直接可用的图片链接。

    Args:
        brands: 品牌名列表
        client_id: Brandfetch client ID（可选）
        search_names: 品牌名 → 搜索词映射
        domains: 品牌名 → 期望域名映射（用于验证搜索结果）

    Returns:
        dict: {
            "iconField": "iconKey",
            "map": { brand: url, ... },
            "source": "brandfetch",
            "details": [{ "brand": ..., "domain": ..., "url": ... }, ...],
            "failed": ["brand1", ...]
        }
    """
    icon_map = {}
    details = []
    failed = []

    for brand in brands:
        expected_domain = domains.get(brand) if domains else None
        result = resolve_brand_logo(
            brand, client_id,
            search_names=search_names,
            expected_domain=expected_domain,
        )

        if result and result.get("icon_url"):
            icon_url = result["icon_url"]
            icon_map[brand] = icon_url
            details.append({
                "brand": brand,
                "domain": result.get("domain", ""),
                "url": icon_url,
                "displayName": result.get("name", brand),
            })
        else:
            failed.append(brand)
            print(f"Warning: Could not find logo for '{brand}'", file=sys.stderr)

    return {
        "iconField": "iconKey",
        "map": icon_map,
        "source": "brandfetch",
        "details": details,
        "failed": failed,
    }


def main():
    parser = argparse.ArgumentParser(
        description="Fetch brand logos from Brandfetch for infographic categories"
    )
    parser.add_argument(
        "--brands", required=True,
        help='JSON array of brand names, e.g. \'["Apple","Google","比亚迪"]\''
    )
    parser.add_argument(
        "--search-names", default=None,
        help='JSON object mapping brand names to Brandfetch search terms. '
             'Use for non-English brands not in built-in mapping. '
             'Example: \'{"极氪":"Zeekr","智己":"IM Motors"}\''
    )
    parser.add_argument(
        "--domains", default=None,
        help='JSON object mapping brand names to expected domains (for result validation). '
             'Example: \'{"比亚迪":"byd.com","蔚来":"nio.com"}\''
    )
    parser.add_argument(
        "--client-id", default=None,
        help="Brandfetch client ID (optional, or set BRANDFETCH_CLIENT_ID env var)"
    )
    parser.add_argument(
        "--output", default=None,
        help="Output JSON file path (default: stdout)"
    )

    args = parser.parse_args()

    # 解析参数
    try:
        brands = json.loads(args.brands)
        if not isinstance(brands, list):
            raise ValueError("brands must be a JSON array")
    except (json.JSONDecodeError, ValueError) as e:
        print(f"Error: --brands must be a valid JSON array: {e}", file=sys.stderr)
        sys.exit(1)

    search_names = None
    if args.search_names:
        try:
            search_names = json.loads(args.search_names)
            if not isinstance(search_names, dict):
                raise ValueError("search-names must be a JSON object")
        except (json.JSONDecodeError, ValueError) as e:
            print(f"Error: --search-names must be a valid JSON object: {e}", file=sys.stderr)
            sys.exit(1)

    domains = None
    if args.domains:
        try:
            domains = json.loads(args.domains)
            if not isinstance(domains, dict):
                raise ValueError("domains must be a JSON object")
        except (json.JSONDecodeError, ValueError) as e:
            print(f"Error: --domains must be a valid JSON object: {e}", file=sys.stderr)
            sys.exit(1)

    client_id = get_client_id(args.client_id)

    # 获取品牌 Logo
    result = fetch_brand_logos(
        brands, client_id,
        search_names=search_names,
        domains=domains,
    )

    # 输出
    output_json = json.dumps(result, ensure_ascii=False, indent=2)
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(output_json)
        print(f"Brand logos saved to {args.output}", file=sys.stderr)
    else:
        print(output_json)


if __name__ == "__main__":
    main()
