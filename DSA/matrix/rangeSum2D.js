export class NumMatrix {
  constructor(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;

    this.prefix = Array.from({ length: rows + 1 }, () =>
      Array(cols + 1).fill(0),
    );

    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        this.prefix[r][c] =
          matrix[r - 1][c - 1] +
          this.prefix[r - 1][c] +
          this.prefix[r][c - 1] -
          this.prefix[r - 1][c - 1];
      }
    }
  }

  sumRegion(r1, c1, r2, c2) {
    return (
      this.prefix[r2 + 1][c2 + 1] -
      this.prefix[r1][c2 + 1] -
      this.prefix[r2 + 1][c1] +
      this.prefix[r1][c1]
    );
  }
}
