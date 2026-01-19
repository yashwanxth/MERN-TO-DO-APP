from fastapi import APIRouter, Query, HTTPException
from bson import ObjectId
from datetime import datetime, timedelta
from db import tasks_collection

router = APIRouter()

@router.get("/analytics/productivity/{user_id}")
def productivity(user_id: str, days: int = Query(7, ge=1, le=365)):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user id")

    start_date = datetime.utcnow() - timedelta(days=days)

    pipeline = [
        {
            "$match": {
                "userId": ObjectId(user_id),
                "status": "Completed",
                "updatedAt": {"$gte": start_date}
            }
        },
        {
            "$group": {
                "_id": {
                    "$dateToString": {
                        "format": "%Y-%m-%d",
                        "date": "$updatedAt"
                    }
                },
                "completedCount": {"$sum": 1}
            }
        },
        {"$sort": {"_id": 1}}
    ]

    result = list(tasks_collection.aggregate(pipeline))

    return {
        "userId": user_id,
        "rangeDays": days,
        "trend": [
            {"date": item["_id"], "completed": item["completedCount"]}
            for item in result
        ]
    }
