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

    def test_raises_when_category_value_is_null(self):
        config = {"categories": {"a.md": None}}
        with self.assertRaises(ValueError):
            build.build_sidebar_groups(["a.md"], config)

    def test_raises_when_category_value_is_not_a_string(self):
        config = {"categories": {"a.md": 42}}
        with self.assertRaises(ValueError):
            build.build_sidebar_groups(["a.md"], config)

    def test_raises_when_categories_is_not_an_object(self):
        config = {"categories": ["a.md"]}
        with self.assertRaises(ValueError):
            build.build_sidebar_groups(["a.md"], config)

    def test_flat_fallback_when_no_config(self):
        groups = build.build_sidebar_groups(["b.md", "a.md"], None)
        self.assertEqual(groups, [(None, ["b.md", "a.md"])])


class TestConvertMarkdown(unittest.TestCase):
    def test_renders_basic_markdown(self):
        result = build.convert_markdown("**bold** text")
        self.assertIn("<strong>bold</strong>", result)

    def test_renders_tables(self):
        result = build.convert_markdown("| a | b |\n|---|---|\n| 1 | 2 |\n")
        self.assertIn("<table>", result)

    def test_rewrites_mermaid_fence_into_div(self):
        text = '```mermaid\ngraph TD\n    D["dog"] --> A["animal"]\n```\n'
        result = build.convert_markdown(text)
        self.assertNotIn("<pre>", result)
        self.assertIn('<div class="mermaid">', result)
        self.assertIn('D["dog"] --> A["animal"]', result)

    def test_rewrites_mixed_case_mermaid_fence_into_div(self):
        text = '```Mermaid\ngraph TD\n    A --> B\n```\n'
        result = build.convert_markdown(text)
        self.assertNotIn("<pre>", result)
        self.assertIn('<div class="mermaid">', result)

    def test_leaves_plain_code_fence_as_pre(self):
        text = "```\nplain text\n```\n"
        result = build.convert_markdown(text)
        self.assertIn("<pre><code>plain text", result)

    def test_leaves_language_tagged_fence_as_pre_for_highlightjs(self):
        text = "```js\nconst x = 1;\n```\n"
        result = build.convert_markdown(text)
        self.assertIn('<pre><code class="language-js">', result)


class TestRenderSidebar(unittest.TestCase):
    def test_renders_grouped_sidebar_with_active_link(self):
        groups = [("Group 1", ["a.md"]), ("Group 2", ["b.md"])]
        result = build.render_sidebar(
            groups, active_slug="a", title="Theory Notes", link_prefix=""
        )
        self.assertIn('<h2 class="brand">Theory Notes</h2>', result)
        self.assertIn("<summary>Group 1</summary>", result)
        self.assertIn('<a href="a.html" aria-current="page">A</a>', result)
        self.assertIn('<a href="b.html">B</a>', result)

    def test_renders_flat_sidebar_when_category_is_none(self):
        groups = [(None, ["a.md"])]
        result = build.render_sidebar(
            groups, active_slug=None, title="T", link_prefix="notes/"
        )
        self.assertNotIn("<summary>", result)
        self.assertIn('<a href="notes/a.html">A</a>', result)


class TestBuildIntegration(unittest.TestCase):
    def test_generates_index_and_note_pages(self):
        with tempfile.TemporaryDirectory() as source_dir, \
                tempfile.TemporaryDirectory() as output_dir, \
                tempfile.TemporaryDirectory() as assets_dir:

            with open(os.path.join(source_dir, "alpha.md"), "w") as f:
                f.write("# Alpha Note\n\nHello **world**.\n")
            with open(os.path.join(source_dir, "beta.md"), "w") as f:
                f.write("# Beta Note\n\nSecond note.\n")
            with open(os.path.join(source_dir, "site.config.json"), "w") as f:
                json.dump(
                    {
                        "title": "Test Site",
                        "categories": {"alpha.md": "Group 1", "beta.md": "Group 1"},
                    },
                    f,
                )
            with open(os.path.join(assets_dir, "style.css"), "w") as f:
                f.write("/* stub */")

            build.build(source_dir, output_dir, assets_dir=assets_dir)

            index_path = os.path.join(output_dir, "index.html")
            alpha_path = os.path.join(output_dir, "notes", "alpha.html")
            beta_path = os.path.join(output_dir, "notes", "beta.html")

            self.assertTrue(os.path.exists(index_path))
            self.assertTrue(os.path.exists(alpha_path))
            self.assertTrue(os.path.exists(beta_path))
            self.assertTrue(
                os.path.exists(os.path.join(output_dir, "assets", "style.css"))
            )

            with open(alpha_path) as f:
                alpha_html = f.read()
            self.assertIn("<title>Alpha Note — Test Site</title>", alpha_html)
            self.assertIn("<strong>world</strong>", alpha_html)
            self.assertIn('href="../assets/style.css"', alpha_html)

            with open(index_path) as f:
                index_html = f.read()
            self.assertIn('href="notes/alpha.html"', index_html)
            self.assertIn("<summary>Group 1</summary>", index_html)

    def test_raises_on_duplicate_slug_collision(self):
        # "a_b.md" and "a-b.md" both slugify to "a-b" (slugify treats
        # underscores and hyphens as equivalent separators, per Task 2).
        # Unlike a case-only collision (e.g. "a.md" vs "A.md"), these are
        # genuinely distinct files on any filesystem, case-sensitive or
        # not, so this test is portable. build() must fail loudly rather
        # than silently let one file's output overwrite the other's.
        with tempfile.TemporaryDirectory() as source_dir, \
                tempfile.TemporaryDirectory() as output_dir, \
                tempfile.TemporaryDirectory() as assets_dir:

            with open(os.path.join(source_dir, "a_b.md"), "w") as f:
                f.write("# First\n")
            with open(os.path.join(source_dir, "a-b.md"), "w") as f:
                f.write("# Second\n")
            with open(os.path.join(assets_dir, "style.css"), "w") as f:
                f.write("/* stub */")

            with self.assertRaises(ValueError):
                build.build(source_dir, output_dir, assets_dir=assets_dir)

    def test_html_escapes_title_in_title_tag(self):
        # extract_title() returns raw markdown text (Task 3), not
        # HTML-escaped. The <title> tag must escape it, or a heading like
        # "# A & B <script>" would break the page's <head>.
        with tempfile.TemporaryDirectory() as source_dir, \
                tempfile.TemporaryDirectory() as output_dir, \
                tempfile.TemporaryDirectory() as assets_dir:

            with open(os.path.join(source_dir, "weird.md"), "w") as f:
                f.write("# A & B <script>\n\nBody.\n")
            with open(os.path.join(assets_dir, "style.css"), "w") as f:
                f.write("/* stub */")

            build.build(source_dir, output_dir, assets_dir=assets_dir)

            with open(os.path.join(output_dir, "notes", "weird.html")) as f:
                html_out = f.read()

            self.assertIn("<title>A &amp; B &lt;script&gt;", html_out)
            self.assertNotIn("<title>A & B <script>", html_out)

    def test_rebuild_removes_stale_output_for_deleted_source_file(self):
        # "output_dir is fully overwritten on every run" is a documented
        # guarantee: if a note is renamed/removed in source_dir, a
        # rebuild must not leave its old notes/<slug>.html behind.
        with tempfile.TemporaryDirectory() as source_dir, \
                tempfile.TemporaryDirectory() as output_dir, \
                tempfile.TemporaryDirectory() as assets_dir:

            with open(os.path.join(assets_dir, "style.css"), "w") as f:
                f.write("/* stub */")

            alpha_path = os.path.join(source_dir, "alpha.md")
            with open(alpha_path, "w") as f:
                f.write("# Alpha\n")
            build.build(source_dir, output_dir, assets_dir=assets_dir)
            self.assertTrue(
                os.path.exists(os.path.join(output_dir, "notes", "alpha.html"))
            )

            os.remove(alpha_path)
            with open(os.path.join(source_dir, "beta.md"), "w") as f:
                f.write("# Beta\n")
            build.build(source_dir, output_dir, assets_dir=assets_dir)

            self.assertFalse(
                os.path.exists(os.path.join(output_dir, "notes", "alpha.html"))
            )
            self.assertTrue(
                os.path.exists(os.path.join(output_dir, "notes", "beta.html"))
            )


if __name__ == "__main__":
    unittest.main()
