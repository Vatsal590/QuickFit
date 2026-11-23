# Regenerates product_facts.ts from product_facts.md (one fact per paragraph, max 1200 chars).
from pathlib import Path
d = Path(__file__).parent
md = (d / "product_facts.md").read_text()
for p in [x.strip() for x in md.split("\n\n") if x.strip()]:
    assert len(p) <= 1200, f"fact too long: {p[:60]}"
assert "`" not in md and "${" not in md
(d / "product_facts.ts").write_text("// GENERATED from product_facts.md (edge deploys do not bundle .md files).\n// After editing product_facts.md, run: python3 supabase/functions/mascot/sync_facts.py\nexport const PRODUCT_FACTS_MD = `" + md + "`;\n")
