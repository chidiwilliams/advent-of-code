# A - Rock, B - Paper, C - Scissors
# A -> C, C -> B, B -> A

if __name__ == '__main__':
    with open('2022/inputs/day-02.txt', 'r', encoding='utf-8') as f:
        text = f.read()

        pairs = [line.split(' ') for line in text.split('\n')]

        total_score = 0
        for pair in pairs:
            [other, me] = pair
            shape_score = 1 if me == 'X' else 2 if me == 'Y' else 3
            result_score = 6 if (me == 'X' and other == 'C') \
                or (me == 'Z' and other == 'B') \
                or (me == 'Y' and other == 'A') \
                else 3 if (me == 'X' and other == 'A') \
                or (me == 'Y' and other == 'B') \
                or (me == 'Z' and other == 'C') \
                else 0
            total_score = total_score + (shape_score+result_score)
        print(total_score)

        total_score = 0
        for pair in pairs:
            [other, result] = pair
            me = 'X' if (other == 'A' and result == 'Y') \
                or (other == 'C' and result == 'Z') \
                or (other == 'B' and result == 'X') \
                else 'Y' if other == 'B' and result == 'Y' \
                or (other == 'A' and result == 'Z') \
                or (other == 'C' and result == 'X') \
                else 'Z'
            shape_score = 1 if me == 'X' else 2 if me == 'Y' else 3
            result_score = 6 if result == 'Z' \
                else 3 if result == 'Y' \
                else 0
            total_score = total_score + (shape_score+result_score)
        print(total_score)
