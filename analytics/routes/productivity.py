from fastapi import APIRouter, Query
from bson import ObjectId
from datetime import datetime, timedelta
from db import tasks_collection

router = APIRouter()

@router.get("/analytics/productivity/{user_id}")
def productivity(user_id: str, days: int = Query(7)):
    start = datetime.utcnow() - timedelta(days=days)

    pipeline = [
        {
            "$match": {
                "userId": ObjectId(user_id),
                "status": "Completed",
                "updatedAt": {"$gte": start}
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
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"_id": 1}}
    ]

    data = list(tasks_collection.aggregate(pipeline))

    return {
        "range": f"{days} days",
        "data": [{"date": d["_id"], "completed": d["count"]} for d in data]
    }
