#!/usr/bin/env python3
"""Single-call wiki ingest: reads one raw file, writes wiki pages via Anthropic API."""
import sys, json
from pathlib import Path
from datetime import date
import anthropic

def main():
    if len(sys.argv) < 2:
        print("Usage: ingest.py <filename>")
        sys.exit(1)

    filename = sys.argv[1]
    source_path = Path(f"raw/{filename}")

    if not source_path.exists():
        print(f"File not found: {source_path}")
        sys.exit(1)

    claude_md = Path("CLAUDE.md").read_text(encoding="utf-8")
    source = source_path.read_text(encoding="utf-8")
    today = date.today().isoformat()

    prompt = f"""You are ingesting a source document into a wiki knowledge base. Follow the schema in CLAUDE.md exactly.

<CLAUDE_MD>
{claude_md}
</CLAUDE_MD>

Today's date: {today}

Ingest this file (raw/{filename}):
<SOURCE>
{source}
</SOURCE>

Return ONLY a JSON object — no markdown fences, no extra text — with this structure:
{{
  "pages": [
    {{
      "path": "wiki/howto/picking/example.md",
      "content": "---\\ntitle: Example\\ntype: howto\\ntags: [picking]\\ncreated: {today}\\nupdated: {today}\\nsources: [{filename}]\\n---\\n\\n# Example\\n\\nContent here."
    }}
  ],
  "index_rows": [
    "| [wiki/howto/picking/example.md](wiki/howto/picking/example.md) | Short description | picking |"
  ],
  "log_entry": "## [{today}] ingest | {filename}\\n\\n**Pages created (N):**\\n1. wiki/howto/example/page.md\\n"
}}"""

    client = anthropic.Anthropic()
    print(f"Calling API for {filename}...")
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=8192,
        messages=[{"role": "user", "content": prompt}]
    )

    text = message.content[0].text.strip()
    if text.startswith("```"):
        text = "\n".join(text.split("\n")[1:])
        text = text[:text.rfind("```")].rstrip()

    result = json.loads(text)

    for page in result["pages"]:
        path = Path(page["path"])
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(page["content"], encoding="utf-8")
        print(f"Written: {page['path']}")

    with open("index.md", "a", encoding="utf-8") as f:
        for row in result.get("index_rows", []):
            f.write(f"\n{row}")

    with open("log.md", "a", encoding="utf-8") as f:
        f.write(f"\n{result['log_entry']}\n")

    print(f"Done: {filename}")

if __name__ == "__main__":
    main()
