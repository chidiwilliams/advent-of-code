import string

if __name__ == '__main__':
    with open('2022/inputs/day-03.txt', 'r', encoding='utf-8') as f:
        text = f.read()
        lines = text.split('\n')

        total_score = 0
        for line in lines:
            left, right = line[:len(line)//2], line[len(line)//2:]
            item = set(left).intersection(right).pop()
            total_score += string.ascii_letters.index(item) + 1
        print(total_score)

        total_score_2 = 0
        for i in range(len(lines)//3):
            first, second, third = lines[i*3:(i*3)+3]
            item = set(first).intersection(second).intersection(third).pop()
            total_score_2 += string.ascii_letters.index(item) + 1
        print(total_score_2)
