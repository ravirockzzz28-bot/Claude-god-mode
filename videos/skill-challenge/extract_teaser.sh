#!/usr/bin/env bash
# Frames and audio of the Late Signals teaser used as proof footage (window from assets/teaser-meta.json).
set -euo pipefail
cd "$(dirname "$0")"
SRC=../late-signals/final/late-signals-teaser.mp4
T0=$(python3 -c "import json;print(json.load(open('assets/teaser-meta.json'))['teaser_t0'])")
D=$(python3 -c "import json;print(json.load(open('assets/teaser-meta.json'))['duration'])")
rm -rf assets/teaser && mkdir -p assets/teaser
ffmpeg -v error -ss "$T0" -i "$SRC" -t "$D" -vf "fps=30,scale=540:960" -q:v 3 assets/teaser/f%04d.jpg
ffmpeg -v error -y -ss "$T0" -i "$SRC" -t "$D" -vn -ar 48000 -ac 2 -af "afade=t=in:d=0.15,afade=t=out:st=5.3:d=0.5" -t 5.8 -c:a pcm_s16le assets/teaser-audio.wav
cp ../late-signals/piece.js assets/code.txt
echo "frames: $(ls assets/teaser | wc -l)"
