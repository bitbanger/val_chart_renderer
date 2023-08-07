#!/usr/bin/env bash

trap 'kill $(jobs -p); exit' EXIT
trap 'kill $(jobs -p); exit' SIGINT
trap 'kill $(jobs -p); exit' SIGTERM

python3 val_likert.py ${1} > likvaljs/files/$(ls likvaljs/files)


# cd likvaljs
#  python3 -m http.server 9000 &
# cd ..
#
# sleep 2

echo '' > likvaltmp
FS=$(wc -c likvaltmp | awk '{print $1}')
while [ $FS -le 1300 ]
	do kill $(jobs -p); cd likvaljs; python3 -m http.server 9000 & cd ..; sleep 2; /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --virtual-time-budget=5000 --headless=new --disable-gpu --dump-dom http://localhost:9000 > likvaltmp & sleep 6; FS=$(wc -c likvaltmp | awk '{print $1}')
done

sleep 2

python3 barparser.py > bars

python3 val_bar_page.py > vbp.html

kill $(jobs -p)
rm /Users/l/Library/Application\ Support/Google/Chrome/SingletonLock 2>/dev/null

python3 -m http.server 9000 >/dev/null 2>/dev/null &

sleep 2

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --virtual-time-budget=5000 --headless=new --disable-gpu --print-to-pdf http://localhost:9000/vbp.html --print-to-pdf-no-header >/dev/null 2>/dev/null &

sleep 6

pdfcrop output.pdf

mv output-crop.pdf val_q4.pdf

rm output.pdf
rm likvaltmp
rm bars
rm vbp.html
