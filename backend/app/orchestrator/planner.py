import random
from app.data.loader import get_curriculum_day, get_module_for_day

class InterviewPlanner:
    def plan_interview(self, candidate_profile: dict, curriculum: dict) -> list:
        missions = candidate_profile.get("missions", [])
        
        confident = []
        struggled = []
        skipped = []

        for mission in missions:
            passed = mission.get("passed", False)
            skipped_flag = mission.get("skipped", False)
            attempts = mission.get("attempts", 0)
            day = mission.get("day")

            if skipped_flag:
                skipped.append(day)
            elif passed and attempts <= 2:
                confident.append(day)
            elif (passed and attempts >= 3) or (not passed):
                struggled.append(day)

        # Shuffle to add some variance
        random.shuffle(confident)
        random.shuffle(struggled)
        random.shuffle(skipped)

        # Build queue: confident, struggled, skipped
        queue_days = []
        queue_days.extend(confident[:4])
        queue_days.extend(struggled[:4])
        queue_days.extend(skipped[:2])
        
        # Fill with other available missions from the candidate if we have fewer than 8
        all_candidate_days = [m.get("day") for m in missions if m.get("day")]
        for d in all_candidate_days:
            if len(queue_days) >= 9:
                break
            if d not in queue_days:
                queue_days.append(d)
                
        # Fill with curriculum days if still fewer than 8
        if len(queue_days) < 8:
            all_curr_days = [day_item.get("day") for day_item in curriculum.get("days", []) if day_item.get("day")]
            for d in all_curr_days:
                if len(queue_days) >= 8:
                    break
                if d not in queue_days:
                    queue_days.append(d)

        # Deduplicate while preserving order
        unique_days = []
        for d in queue_days:
            if d not in unique_days:
                unique_days.append(d)

        plan = []
        for d in unique_days:
            day_info = get_curriculum_day(d)
            if not day_info:
                continue
            
            module = get_module_for_day(d)
            
            if d in confident:
                bucket = "CONFIDENT"
            elif d in struggled:
                bucket = "STRUGGLED"
            else:
                bucket = "SKIPPED"

            plan.append({
                "day": d,
                "title": day_info.get("title", ""),
                "objectives": day_info.get("objectives", []),
                "tools": day_info.get("tools", []),
                "module": module,
                "bucket": bucket,
                "asked_count": 0,
                "followup_used": False
            })

        return plan

