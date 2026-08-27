# Game of Life (LeetCode #289)

Given an m x n grid `board` where each cell is either 1 (live) or 0 (dead),
compute the next state of the board using Conway's Game of Life rules,
applied SIMULTANEOUSLY to every cell:

1. A live cell with fewer than 2 live neighbors dies (underpopulation).
2. A live cell with 2 or 3 live neighbors lives on.
3. A live cell with more than 3 live neighbors dies (overpopulation).
4. A dead cell with exactly 3 live neighbors becomes a live cell.

Neighbors = the 8 horizontally, vertically, or diagonally adjacent cells.

Example 1:
Input:  board = [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]
Output: [[0,0,0],[1,0,1],[0,1,1],[0,1,0]]

Example 2:
Input:  board = [[1,1],[1,0]]
Output: [[1,1],[1,1]]

Constraints:
- m == board.length
- n == board[i].length
- 1 <= m, n <= 25
- board[i][j] is 0 or 1

Follow-up: solve it IN-PLACE, without allocating a second grid.
