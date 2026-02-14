function heapSort(arr) {
  const n = arr.length;

  // 1. Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // 2. Extract elements one by one
  for (let end = n - 1; end > 0; end--) {
    // Move max to the end
    [arr[0], arr[end]] = [arr[end], arr[0]];

    // Restore heap property on reduced heap
    heapify(arr, end, 0);
  }

  return arr;
}

// Heapify subtree rooted at index i
function heapify(arr, size, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < size && arr[left] > arr[largest]) {
    largest = left;
  }
  if (right < size && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, size, largest);
  }
}
