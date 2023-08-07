template = r'''<html>
<head></head>
<body>
%s
</body>
</html>'''

bars = None
swatch = None
with open('bars', 'r') as f:
	bars = f.read().strip()
	bars = bars.replace('width="640"', 'width="1400"')
	bars = bars.replace('div class="plot-d6a7b5-swatches', 'div style="margin-left: 70px;" class="plot-d6a7b5-swatches')
	bars = bars.replace('font-size: 10px;', 'font-size: 5px;')
	bars = bars.replace('→', '&rarr;')
	bars = bars.replace('←', '&larr;')

print(template % (bars))
