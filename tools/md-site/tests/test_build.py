import json
import os
import subprocess
import sys
import tempfile
import unittest

import build

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


class TestSlugify(unittest.TestCase):
    def test_slugify_simple_kebab_filename(self):
        self.assertEqual(build.slugify("javascript-core.md"), "javascript-core")

    def test_slugify_strips_spaces_and_mixed_case(self):
        self.assertEqual(
            build.slugify("MicroFrontEnd Design system.md"),
            "microfrontend-design-system",
        )

    def test_slugify_treats_underscores_as_separators_like_title_from_filename(self):
        self.assertEqual(build.slugify("browser_internals.md"), "browser-internals")


class TestTitleFromFilename(unittest.TestCase):
    def test_known_acronyms_are_cased_correctly(self):
        self.assertEqual(build.title_from_filename("javascript-sdk.md"), "JavaScript SDK")
        self.assertEqual(build.title_from_filename("cors-security.md"), "CORS Security")
        self.assertEqual(build.title_from_filename("graphql.md"), "GraphQL")
        self.assertEqual(build.title_from_filename("v8-internals.md"), "V8 Internals")

    def test_generic_kebab_filename(self):
        self.assertEqual(
            build.title_from_filename("browser-internals.md"), "Browser Internals"
        )


class TestDiscoverMdFiles(unittest.TestCase):
    def test_lists_only_md_files_sorted(self):
        import tempfile
        import os as os_module

        with tempfile.TemporaryDirectory() as tmp:
            for name in ["b.md", "a.md", "notes.txt", "site.config.json"]:
                open(os_module.path.join(tmp, name), "w").close()
            self.assertEqual(build.discover_md_files(tmp), ["a.md", "b.md"])

    def test_skips_directories_even_if_named_like_md_files(self):
        import tempfile

        with tempfile.TemporaryDirectory() as tmp:
            os.mkdir(os.path.join(tmp, "weird-dir.md"))
            open(os.path.join(tmp, "real.md"), "w").close()
            self.assertEqual(build.discover_md_files(tmp), ["real.md"])


class TestExtractTitle(unittest.TestCase):
    def test_extracts_first_h1(self):
        text = "# JavaScript Core — Interview Reference\n\nSome intro.\n"
        self.assertEqual(
            build.extract_title(text, fallback="Fallback"),
            "JavaScript Core — Interview Reference",
        )

    def test_falls_back_when_no_h1(self):
        text = "No heading here.\n"
        self.assertEqual(build.extract_title(text, fallback="Fallback"), "Fallback")

    def test_falls_back_when_heading_is_whitespace_only(self):
        text = "#   \n\nSome intro.\n"
        self.assertEqual(build.extract_title(text, fallback="Fallback"), "Fallback")


class TestLoadConfig(unittest.TestCase):
    def test_returns_none_when_no_config_file(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.assertIsNone(build.load_config(tmp))

    def test_reads_existing_config(self):
        with tempfile.TemporaryDirectory() as tmp:
            config = {"title": "Theory Notes", "categories": {"a.md": "Cat A"}}
            with open(os.path.join(tmp, "site.config.json"), "w") as f:
                json.dump(config, f)
            self.assertEqual(build.load_config(tmp), config)


class TestBuildSidebarGroups(unittest.TestCase):
    def test_groups_by_category_in_first_appearance_order(self):
        config = {
            "categories": {
                "a.md": "Group 1",
                "b.md": "Group 2",
                "c.md": "Group 1",
            }
        }
        groups = build.build_sidebar_groups(["a.md", "b.md", "c.md"], config)
        self.assertEqual(
            groups,
            [("Group 1", ["a.md", "c.md"]), ("Group 2", ["b.md"])],
        )

    def test_raises_when_file_missing_from_categories(self):
        config = {"categories": {"a.md": "Group 1"}}
        with self.assertRaises(ValueError):
            build.build_sidebar_groups(["a.md", "b.md"], config)

    def test_flat_fallback_when_no_config(self):
        groups = build.build_sidebar_groups(["b.md", "a.md"], None)
        self.assertEqual(groups, [(None, ["b.md", "a.md"])])


if __name__ == "__main__":
    unittest.main()
