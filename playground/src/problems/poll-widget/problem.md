# Poll Widget

A live bar-chart poll where each bar grows in proportion to its share of votes.

## Requirements

- Clicking an option increments its vote count.
- Bars are sized relative to the total votes cast.
- Bars re-scale as votes come in.

## How it works

Each bar's height is its share of the total:

```
height = (votes / totalVotes) * MAX_HEIGHT
```

Because the denominator is the running total, adding a vote to one option
visibly shrinks the others — the bars always represent proportions, not raw
counts.

Votes are updated immutably: `map` produces a new array, replacing only the
clicked option's object.

## Interview traps

- **Division by zero.** Before any vote, `totalVotes` is 0 and every height
  becomes `NaN`, which silently produces broken styles. Guard the zero case.
- Mutating `option.vote++` in place instead of returning a new object, so React
  does not re-render.
- Rounding every bar independently means the percentages may not sum to 100.
