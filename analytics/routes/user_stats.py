from fastapi import APIRouter
from bson import ObjectId
from db import tasks_collection

router = APIRouter()

@router.get("/analytics/user-stats/{user_id}")
def get_user_stats(user_id: str):
    tasks = list(tasks_collection.find({"userId": ObjectId(user_id)}))

    total = len(tasks)
    completed = sum(1 for t in tasks if t["status"] == "Completed")
    pending = total - completed

    priority = {"Low": 0, "Medium": 0, "High": 0}
    for t in tasks:
        if t["priority"] in priority:
            priority[t["priority"]] += 1

    return {
        "totalTasks": total,
        "completedTasks": completed,
        "pendingTasks": pending,
        "completionRate": (completed / total * 100) if total else 0,
        "priorityDistribution": priority
    }
