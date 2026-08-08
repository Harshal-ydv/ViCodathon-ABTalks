import json
from pathlib import Path
import shutil

DATA_DIR = Path(__file__).parent
ROOT_DIR = DATA_DIR.parent.parent.parent

# Ensure files exist, copy if missing
for filename in ["curriculum.json", "candidates.json"]:
    dest = DATA_DIR / filename
    src = ROOT_DIR / filename
    if not dest.exists() and src.exists():
        shutil.copy(src, dest)

def get_curriculum():
    path = DATA_DIR / "curriculum.json"
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def get_candidates():
    path = DATA_DIR / "candidates.json"
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
        return data.get("candidates", [])

def get_curriculum_day(day_number: int):
    curriculum = get_curriculum()
    for day in curriculum.get("days", []):
        if day.get("day") == day_number:
            return day
    return None

def get_module_for_day(day_number: int):
    curriculum = get_curriculum()
    for module in curriculum.get("modules", []):
        days_range = module.get("days", [])
        if len(days_range) == 2:
            if days_range[0] <= day_number <= days_range[1]:
                return module.get("title")
    return None

def get_candidate_by_id(candidate_id: str):
    candidates = get_candidates()
    for cand in candidates:
        if cand.get("member", {}).get("id") == candidate_id:
            return cand
    return None
