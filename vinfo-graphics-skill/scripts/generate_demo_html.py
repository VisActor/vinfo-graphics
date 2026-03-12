#!/usr/bin/env python3
"""
VInfo Graphics HTML Generation Script
Based on template file, generate interactive infographic HTML

Usage:
    python generate_demo_html.py --title "Chart Title" --schema '{"chartType":"pie",...}' --output "output.html"

    # Explicit template path
    python generate_demo_html.py --template /path/to/demo.html --title "Title" --schema '...' --output out.html
"""

import argparse
import json
import re
import sys
import os
from pathlib import Path


def get_script_dir():
    """Get script directory"""
    return Path(__file__).parent.resolve()


def find_template_file():
    """
    Auto-find template file, supports following relative paths:
    1. ../assets/template/demo.html (standard path)

    Returns found template path, or None
    """
    script_dir = get_script_dir()

    # Candidate paths (by priority)
    candidates = [
        script_dir.parent / "assets" / "template" / "demo.html",
    ]

    for path in candidates:
        if path.exists():
            return path

    return None


def load_template(template_path=None):
    """
    Load HTML template

    Args:
        template_path: Explicitly specified template path (optional)

    Returns:
        Template content string
    """
    if template_path:
        # Use explicitly specified path
        path = Path(template_path)
        if not path.exists():
            print(f"Error: Template file not found: {template_path}", file=sys.stderr)
            sys.exit(1)
    else:
        # Auto-find template
        path = find_template_file()
        if not path:
            script_dir = get_script_dir()
            print("Error: Template file not found, tried the following paths:", file=sys.stderr)
            print(f"   - {script_dir.parent / 'assets' / 'template' / 'demo.html'}", file=sys.stderr)
            print("\nPlease use --template parameter to specify template path", file=sys.stderr)
            sys.exit(1)

    with open(path, 'r', encoding='utf-8') as f:
        return f.read()


def load_schema(schema_source):
    """
    Load schema, supports multiple sources:
    - JSON file path
    - JSON string
    - stdin input
    """
    if schema_source:
        # Try as file path
        if os.path.isfile(schema_source):
            try:
                with open(schema_source, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except json.JSONDecodeError as e:
                print(f"Error: JSON file format error: {e}", file=sys.stderr)
                sys.exit(1)
        # Try as JSON string
        try:
            return json.loads(schema_source)
        except json.JSONDecodeError:
            print(f"Error: Cannot parse schema (not a valid file or JSON)", file=sys.stderr)
            print(f"   Input first 100 chars: {schema_source[:100]}...", file=sys.stderr)
            sys.exit(1)

    # Read from stdin
    if not sys.stdin.isatty():
        stdin_data = sys.stdin.read().strip()
        if stdin_data:
            try:
                return json.loads(stdin_data)
            except json.JSONDecodeError as e:
                print(f"Error: stdin JSON format error: {e}", file=sys.stderr)
                sys.exit(1)

    print("Error: No schema provided, please use --schema parameter or stdin", file=sys.stderr)
    sys.exit(1)


def format_schema_js(schema):
    """Format schema as JavaScript code"""
    schema_json = json.dumps(schema, ensure_ascii=False, indent=2)
    return f"const schema = {schema_json};"


def generate_html(template_content, title, description, schema, chart_height=None):
    """Generate HTML content

    Args:
        template_content: Template content
        title: Chart title
        description: Chart description
        schema: Chart config
        chart_height: Chart container height (optional, like "600px" or 600)
    """
    schema_js = format_schema_js(schema)

    # Replace placeholders
    html = template_content.replace("{{title}}", title)
    html = html.replace("{{description}}", description)
    html = html.replace("{{schema}}", schema_js)

    # Replace chart height (if specified)
    if chart_height:
        # Support pure number or string with unit
        if isinstance(chart_height, (int, float)) or chart_height.isdigit():
            height_value = f"{int(chart_height)}px"
        else:
            height_value = chart_height

        # Replace .chart-container height
        html = re.sub(
            r'(\.chart-container\s*\{[^}]*height:\s*)(\d+px)',
            rf'\g<1>{height_value}',
            html
        )

    return html


def main():
    parser = argparse.ArgumentParser(
        description="VInfo Graphics HTML Generation Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Auto-find template
  python generate_demo_html.py --title "Sales Report" --schema '{"chartType":"pie",...}' --output report.html

  # Explicitly specify template path
  python generate_demo_html.py --template /path/to/demo.html --title "Report" --schema '...' -o out.html
  # Custom chart height
  python generate_demo_html.py --title "Report" --chart-height 600 --schema '...' -o out.html
        """
    )

    parser.add_argument("--template", "-T", help="Template file path (optional, auto-find if not specified)")
    parser.add_argument("--title", "-t", required=True, help="[Required] Chart title")
    parser.add_argument("--description", "-d", default="", help="Chart description")
    parser.add_argument("--schema", "-s", help="Schema JSON (file path or JSON string)")
    parser.add_argument("--chart-height", "-H", help="Chart container height (like 600 or '600px')")
    parser.add_argument("--output", "-o", help="Output file path (output to stdout if not specified)")

    args = parser.parse_args()

    # Load template
    template_content = load_template(args.template)

    # Load schema
    schema = load_schema(args.schema)

    # Generate HTML
    html = generate_html(
        template_content,
        args.title,
        args.description,
        schema,
        chart_height=getattr(args, 'chart_height', None)
    )

    # Output
    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Generated: {output_path}", file=sys.stderr)
    else:
        print(html)


if __name__ == "__main__":
    main()
