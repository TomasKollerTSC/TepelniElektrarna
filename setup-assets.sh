#!/bin/bash
# Run from TepelniElektrarna/ directory (on Raspberry Pi / Linux)
ROOT="$(cd "$(dirname "$0")" && pwd)"

front_screens=(screen_oled2 screen_oled4 screen_6 screen_9)
back_screens=(screen_2R screen_4R screen_7R screen_8R screen_10)

make_link() {
    local screen=$1 link=$2 target=$3
    local public="$ROOT/$screen/public"
    mkdir -p "$public"
    if [ ! -L "$public/$link" ]; then
        ln -s "$ROOT/$target" "$public/$link"
        echo "Created symlink: $screen/public/$link -> $target"
    else
        echo "Already exists: $screen/public/$link"
    fi
}

for s in "${front_screens[@]}"; do
    make_link "$s" "g" "grafika"
    make_link "$s" "v" "videa"
done

for s in "${back_screens[@]}"; do
    make_link "$s" "g" "grafika"
    make_link "$s" "f" "fotografie pro obrazovky"
done

echo -e "\nDone! Run this script once before starting dev servers."
