from flask_apscheduler import APScheduler

from .blueprint import clean_cache

scheduler = APScheduler()

# add a scheduled job to clean the cache every 5 minutes
#
scheduler.add_job(id='clean_cache', func=clean_cache, trigger='interval', seconds=300)