#!/bin/bash
# HSK Mastery 2026 — Daily database backup
# Runs via cron: 0 2 * * * /home/admin1/hskde/backup.sh >> /var/log/hsk_backup.log 2>&1

set -e

BACKUP_DIR="/home/admin1/hskde/backups"
KEEP_DAYS=14
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILE="$BACKUP_DIR/hsk_db_$TIMESTAMP.sql.gz"

mkdir -p "$BACKUP_DIR"

docker exec hsk_postgres pg_dump -U hsk_user hsk_database | gzip > "$FILE"

SIZE=$(du -sh "$FILE" | cut -f1)
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup OK → $FILE ($SIZE)"

# Remove backups older than KEEP_DAYS days
find "$BACKUP_DIR" -name "hsk_db_*.sql.gz" -mtime +$KEEP_DAYS -delete
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Old backups (>$KEEP_DAYS days) cleaned up"
