import os
import subprocess
import sys
import unittest

BUILD_SCRIPT = os.path.join(os.path.dirname(__file__), "..", "build.py")


class TestCLI(unittest.TestCase):
    def test_main_requires_two_args(self):
        result = subprocess.run(
            [sys.executable, BUILD_SCRIPT],
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 1)
        self.assertIn("Usage: build.py <source-dir> <output-dir>", result.stderr)


if __name__ == "__main__":
    unittest.main()
