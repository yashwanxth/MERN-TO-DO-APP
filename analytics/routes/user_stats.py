from fastapi import APIRouter, HTTPException
from bson import ObjectId
from db import tasks_collection

router = APIRouter()

@router.get("/analytics/user-stats/{user_id}")
def user_stats(user_id: str):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user id")

    tasks = list(tasks_collection.find({"userId": ObjectId(user_id)}))

    total = len(tasks)
    completed = sum(1 for t in tasks if t.get("status") == "Completed")
    pending = total - completed

    priority_dist = {"Low": 0, "Medium": 0, "High": 0}
    for t in tasks:
        p = t.get("priority")
        if p in priority_dist:
            priority_dist[p] += 1

    completion_rate = (completed / total * 100) if total > 0 else 0

    return {
        "userId": user_id,
        "totalTasks": total,
        "completedTasks": completed,
        "pendingTasks": pending,
        "completionRate": round(completion_rate, 2),
        "priorityDistribution": priority_dist
    }
