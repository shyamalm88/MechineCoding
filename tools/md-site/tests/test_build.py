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

    def test_category_order_follows_config_not_alphabetical_file_order(self):
        # "a.md" sorts alphabetically before "z.md" (as discover_md_files
        # would order them), but the config declares "Group Z" first --
        # the sidebar must follow the config author's intended order, not
        # whatever order the filesystem happens to sort files in.
        config = {
            "categories": {
                "z.md": "Group Z",
                "a.md": "Group A",
            }
        }
        groups = build.build_sidebar_groups(["a.md", "z.md"], config)
        self.assertEqual(
            groups,
            [("Group Z", ["z.md"]), ("Group A", ["a.md"])],
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
        # Content stays HTML-entity-escaped (see test below for why) --
        # mermaid.js still gets the correct decoded string at runtime via
        # the DOM's .textContent, which auto-decodes entities.
        self.assertIn('D[&quot;dog&quot;] --&gt; A[&quot;animal&quot;]', result)

    def test_mermaid_label_containing_script_tag_stays_escaped(self):
        # Regression test: a diagram label illustrating a real script tag
        # (e.g. a sequence diagram showing a server response) must NOT
        # become a live <script> tag in the output. A previous version of
        # this function called html.unescape() on the diagram body, which
        # turned `&lt;script src="bundle.js"&gt;` back into a real,
        # unescaped <script src="bundle.js"> -- browsers then parse
        # everything after that as inert raw script text until the next
        # literal "</script>" string anywhere later in the page, silently
        # swallowing real content in between. Verified against the actual
        # bug in Theory/hydration.md before this fix.
        text = '```mermaid\nsequenceDiagram\n    S-->>B: HTML + <script src="bundle.js">\n```\n'
        result = build.convert_markdown(text)
        self.assertNotIn('<script src="bundle.js">', result)
        self.assertIn("&lt;script src=&quot;bundle.js&quot;&gt;", result)

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
        # notes/ and assets/ are fully regenerated on every run (though
        # other files placed directly in output_dir are left alone -- see
        # test_rebuild_preserves_hand_authored_files_in_output_dir below):
        # if a note is renamed/removed in source_dir, a rebuild must not
        # leave its old notes/<slug>.html behind.
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

    def test_rebuild_preserves_hand_authored_files_in_output_dir(self):
        # A file like theory-notes/README.md is hand-authored, lives in
        # the same output_dir as the generated notes/ and assets/, and
        # must survive a rebuild -- only the generated subdirectories get
        # wiped, not the whole output_dir.
        with tempfile.TemporaryDirectory() as source_dir, \
                tempfile.TemporaryDirectory() as output_dir, \
                tempfile.TemporaryDirectory() as assets_dir:

            with open(os.path.join(assets_dir, "style.css"), "w") as f:
                f.write("/* stub */")
            with open(os.path.join(source_dir, "alpha.md"), "w") as f:
                f.write("# Alpha\n")

            build.build(source_dir, output_dir, assets_dir=assets_dir)

            readme_path = os.path.join(output_dir, "README.md")
            with open(readme_path, "w") as f:
                f.write("hand-authored, not generated\n")

            build.build(source_dir, output_dir, assets_dir=assets_dir)

            self.assertTrue(os.path.exists(readme_path))
            with open(readme_path) as f:
                self.assertEqual(f.read(), "hand-authored, not generated\n")


class TestBundledAssetsExist(unittest.TestCase):
    def test_required_asset_files_are_present(self):
        expected = {"style.css", "highlight.min.js", "highlight-theme.css", "mermaid.min.js"}
        actual = set(os.listdir(build.ASSETS_DIR))
        self.assertTrue(expected.issubset(actual))

    def test_asset_files_are_non_trivial(self):
        # Presence alone doesn't catch a corrupted or truncated download
        # (e.g. curl silently saving an HTML error page instead of the
        # real JS/CSS) -- a zero-byte or tiny placeholder would pass the
        # presence check above but break the site silently in a browser.
        minimums = {
            "style.css": 1000,
            "highlight.min.js": 50_000,
            "highlight-theme.css": 200,
            "mermaid.min.js": 1_000_000,
        }
        for name, min_size in minimums.items():
            path = os.path.join(build.ASSETS_DIR, name)
            self.assertGreater(os.path.getsize(path), min_size, name)


class TestRealSystemDesignSmoke(unittest.TestCase):
    def test_builds_against_real_system_design_folder(self):
        # Theory/ (this suite's original real-data corpus) was
        # deliberately removed from the repo after theory-notes/ was
        # generated, committed, and pushed -- system-design/ is now the
        # live real-data corpus this tool is actually used against, so
        # this test targets that instead of a folder that no longer
        # exists.
        repo_root = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "..", "..")
        )
        source_dir = os.path.join(repo_root, "system-design")
        with tempfile.TemporaryDirectory() as output_dir:
            build.build(source_dir, output_dir)

            self.assertTrue(os.path.exists(os.path.join(output_dir, "index.html")))
            self.assertTrue(
                os.path.exists(
                    os.path.join(output_dir, "notes", "rate-limiter.html")
                )
            )
            note_count = len(
                [
                    f
                    for f in os.listdir(os.path.join(output_dir, "notes"))
                    if f.endswith(".html")
                ]
            )
            self.assertEqual(note_count, 25)

            # A typo'd near-duplicate category (e.g. a stray double space)
            # wouldn't raise an exception anywhere -- it would just
            # silently render as an extra sidebar group. Pin the real
            # config down to exactly the 8 intended categories so a typo
            # like that fails loudly here instead.
            with open(os.path.join(output_dir, "index.html"), encoding="utf-8") as f:
                index_html = f.read()
            self.assertEqual(index_html.count("<details"), 8)


if __name__ == "__main__":
    unittest.main()
