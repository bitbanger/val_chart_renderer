import csv
import sys

ratings = ['Strongly Disagree', 'Disagree', 'Kinda Disagree', 'Neutral', 'Kinda Agree', 'Agree', 'Strongly Agree']

# print('question,rating,count')

print('[', end='')
with open(sys.argv[1].strip(), 'r') as f:
	lines = f.read().strip().split('\n')
	for i in range(len(lines)):
		if ',Question,' in lines[i]:
			lines = lines[i:]
			break

	reader = csv.reader(lines)
	first_row = next(reader)
	uid = 0
	for row in reader:
		try:
			qid = row[1]
			counts = [row[i] for i in range(4, len(row)) if first_row[i] == '']
			# print(qid, counts)
			# for i in range(len(counts)):
				# print('%s,%s,%s' % (qid, ratings[i], counts[i]))
			for i in range(len(counts)):
				# print('Q%s got %d counts of rating %d (%s)' % (qid, int(counts[i]), i, ratings[i]))
				for j in range(int(counts[i])):
					if uid > 0:
						print(',', end='')
					print('{"Question":"%s","ID":%d,"Response":"%s"}' % (qid, uid, ratings[i]), end='')
					uid += 1
		except:
			pass
print(']', end='')
