import io
import json
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path

from cli.pc_control import Action, DryRunDriver, build_parser, dispatch, load_actions, run_action


class PcControlTests(unittest.TestCase):
    def test_click_dry_run(self):
        parser = build_parser()
        args = parser.parse_args(["click", "--x", "10", "--y", "20"])
        out = io.StringIO()
        with redirect_stdout(out):
            dispatch(args, DryRunDriver())
        self.assertIn("[dry-run] click", out.getvalue())

    def test_macro_load(self):
        actions = [{"action": "type", "text": "abc"}, {"action": "wait", "seconds": 0.01}]
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "macro.json"
            path.write_text(json.dumps(actions), encoding="utf-8")
            loaded = load_actions(path)
        self.assertEqual(loaded[0].name, "type")
        self.assertEqual(loaded[0].args["text"], "abc")

    def test_hotkey_requires_array(self):
        with self.assertRaises(ValueError):
            run_action(DryRunDriver(), Action("hotkey", {"keys": "ctrl+s"}))


if __name__ == "__main__":
    unittest.main()
