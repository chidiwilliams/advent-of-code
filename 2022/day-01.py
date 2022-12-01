if __name__ == '__main__':
  with open('2022/inputs/day-01-1.txt', 'r') as f:
    text = f.read()

    sums = [sum([int(line) for line in section.split('\n')]) for section in text.split('\n\n')]
    print(max(sums))
    print(sum(sorted(sums, reverse=True)[:3]))