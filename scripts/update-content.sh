#!/bin/bash
set -e

cd /home/ric_16113/solopilot-site
export PATH="/tmp/node-v22.14.0-linux-x64/bin:$PATH"
export https_proxy="socks5://172.20.144.1:10808"
export http_proxy="socks5://172.20.144.1:10808"

SCRIPT_DIR="scripts"
STATE_FILE="$SCRIPT_DIR/update_state.json"
LOG_FILE="$SCRIPT_DIR/update.log"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

mkdir -p scripts

if [ ! -f "$STATE_FILE" ]; then
  echo '{"last_run":null,"consecutive_failures":0,"total_pushed":0,"missed_batches":0}' > "$STATE_FILE"
fi

LAT=$(python3 -c "import json; d=json.load(open('$STATE_FILE')); v=d.get('last_run'); print(v if v else 'NONE')" 2>/dev/null)
MISSED=0
if [ -n "$LAT" ] && [ "$LAT" != "null" ] && [ "$LAT" != "None" ] && [ "$LAT" != "NONE" ]; then
  LE=$(date -d "$LAT" +%s 2>/dev/null || echo 0)
  NW=$(date +%s)
  HG=$(( (NW - LE) / 3600 ))
  if [ "$HG" -gt 7 ]; then MISSED=$(( (HG - 1) / 6 )); log "补量: ${MISSED}批"; fi
fi

ARTICLES=$(( 20 + MISSED * 20 ))
[ "$ARTICLES" -gt 100 ] && ARTICLES=100
log "生成 ${ARTICLES} 篇..."

CNT=0
while [ $CNT -lt $ARTICLES ]; do
  S=$(find src/lib/content/ -name "gen_article*.mjs" -o -name "gen_article*_en.js" -o -name "gen_article*_zh.js" 2>/dev/null | shuf -n1)
  [ -z "$S" ] && log "无生成脚本" && break
  node "$S" >> "$LOG_FILE" 2>&1
  CNT=$((CNT + 1))
done

log "生成了 $CNT 篇"
git add src/lib/content/ 2>/dev/null
git commit -m "auto: update $(date '+%Y-%m-%d') [$CNT]" 2>/dev/null || log "无新内容"
git push origin main 2>&1 | tail -2 || log "push失败"

python3 -c "
import json, datetime
d=json.load(open('$STATE_FILE'))
d['last_run']=datetime.datetime.now().isoformat()
d['total_pushed']=d.get('total_pushed',0)+$CNT
d['missed_batches']=$MISSED
d['consecutive_failures']=0
json.dump(d,open('$STATE_FILE','w'),indent=2)
"

log "完成"
