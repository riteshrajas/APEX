#!/usr/bin/env python3
"""APEX PC Control CLI.

Provides a layered command interface for desktop automation:
- L1: Primitive actions (move, click, type, hotkey, scroll, wait)
- L2: Macros via JSON action files
- L3: Guardrails (dry-run default, explicit --live switch)
"""

from __future__ import annotations

import argparse
import importlib
import importlib.util
import json
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable


@dataclass
class Action:
    name: str
    args: dict[str, Any]


class Driver:
    def move(self, x: int, y: int, duration: float = 0.0) -> None:
        raise NotImplementedError

    def click(self, x: int | None, y: int | None, button: str = "left", clicks: int = 1) -> None:
        raise NotImplementedError

    def type_text(self, text: str, interval: float = 0.0) -> None:
        raise NotImplementedError

    def hotkey(self, keys: list[str]) -> None:
        raise NotImplementedError

    def scroll(self, amount: int) -> None:
        raise NotImplementedError


class DryRunDriver(Driver):
    def move(self, x: int, y: int, duration: float = 0.0) -> None:
        print(f"[dry-run] move x={x} y={y} duration={duration}")

    def click(self, x: int | None, y: int | None, button: str = "left", clicks: int = 1) -> None:
        print(f"[dry-run] click x={x} y={y} button={button} clicks={clicks}")

    def type_text(self, text: str, interval: float = 0.0) -> None:
        print(f"[dry-run] type text={text!r} interval={interval}")

    def hotkey(self, keys: list[str]) -> None:
        print(f"[dry-run] hotkey keys={'+'.join(keys)}")

    def scroll(self, amount: int) -> None:
        print(f"[dry-run] scroll amount={amount}")


class PyAutoGUIDriver(Driver):
    def __init__(self) -> None:
        pyautogui_spec = importlib.util.find_spec("pyautogui")
        if pyautogui_spec is None:
            raise RuntimeError(
                "Live mode requires pyautogui. Install it with: pip install pyautogui"
            )

        self.pg = importlib.import_module("pyautogui")
        self.pg.FAILSAFE = True

    def move(self, x: int, y: int, duration: float = 0.0) -> None:
        self.pg.moveTo(x, y, duration=duration)

    def click(self, x: int | None, y: int | None, button: str = "left", clicks: int = 1) -> None:
        self.pg.click(x=x, y=y, button=button, clicks=clicks)

    def type_text(self, text: str, interval: float = 0.0) -> None:
        self.pg.write(text, interval=interval)

    def hotkey(self, keys: list[str]) -> None:
        self.pg.hotkey(*keys)

    def scroll(self, amount: int) -> None:
        self.pg.scroll(amount)


def parse_action(raw: dict[str, Any]) -> Action:
    if "action" not in raw:
        raise ValueError("Each action item must include an 'action' field")

    name = str(raw["action"]).strip().lower()
    args = {k: v for k, v in raw.items() if k != "action"}
    return Action(name=name, args=args)


def load_actions(path: Path) -> list[Action]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, list):
        raise ValueError("Macro file must be a JSON array of action objects")
    return [parse_action(item) for item in payload]


def run_action(driver: Driver, action: Action) -> None:
    if action.name == "move":
        driver.move(
            x=int(action.args["x"]),
            y=int(action.args["y"]),
            duration=float(action.args.get("duration", 0.0)),
        )
    elif action.name == "click":
        driver.click(
            x=int(action.args["x"]) if "x" in action.args else None,
            y=int(action.args["y"]) if "y" in action.args else None,
            button=str(action.args.get("button", "left")),
            clicks=int(action.args.get("clicks", 1)),
        )
    elif action.name == "type":
        driver.type_text(
            text=str(action.args["text"]), interval=float(action.args.get("interval", 0.0))
        )
    elif action.name == "hotkey":
        keys = action.args.get("keys")
        if not isinstance(keys, Iterable) or isinstance(keys, (str, bytes)):
            raise ValueError("hotkey action requires 'keys' as an array of key names")
        driver.hotkey([str(key) for key in keys])
    elif action.name == "scroll":
        driver.scroll(amount=int(action.args["amount"]))
    elif action.name == "wait":
        delay = float(action.args.get("seconds", 1.0))
        print(f"[info] wait {delay}s")
        time.sleep(delay)
    else:
        raise ValueError(f"Unsupported action: {action.name}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="APEX desktop control CLI")
    parser.add_argument(
        "--live",
        action="store_true",
        help="Execute real desktop actions. Without this flag, commands run in dry-run mode.",
    )

    sub = parser.add_subparsers(dest="command", required=True)

    move = sub.add_parser("move", help="Move cursor")
    move.add_argument("--x", required=True, type=int)
    move.add_argument("--y", required=True, type=int)
    move.add_argument("--duration", type=float, default=0.0)

    click = sub.add_parser("click", help="Click mouse")
    click.add_argument("--x", type=int)
    click.add_argument("--y", type=int)
    click.add_argument("--button", choices=["left", "right", "middle"], default="left")
    click.add_argument("--clicks", type=int, default=1)

    type_cmd = sub.add_parser("type", help="Type text")
    type_cmd.add_argument("--text", required=True)
    type_cmd.add_argument("--interval", type=float, default=0.0)

    hotkey = sub.add_parser("hotkey", help="Press a key combo")
    hotkey.add_argument("keys", nargs="+", help="Example: ctrl shift esc")

    scroll = sub.add_parser("scroll", help="Scroll")
    scroll.add_argument("--amount", required=True, type=int)

    wait = sub.add_parser("wait", help="Sleep for a duration")
    wait.add_argument("--seconds", default=1.0, type=float)

    macro = sub.add_parser("macro", help="Run JSON macro file")
    macro.add_argument("--file", required=True, type=Path)

    return parser


def resolve_driver(is_live: bool) -> Driver:
    if is_live:
        return PyAutoGUIDriver()
    return DryRunDriver()


def dispatch(args: argparse.Namespace, driver: Driver) -> int:
    if args.command == "move":
        run_action(driver, Action("move", {"x": args.x, "y": args.y, "duration": args.duration}))
    elif args.command == "click":
        payload: dict[str, Any] = {"button": args.button, "clicks": args.clicks}
        if args.x is not None:
            payload["x"] = args.x
        if args.y is not None:
            payload["y"] = args.y
        run_action(driver, Action("click", payload))
    elif args.command == "type":
        run_action(driver, Action("type", {"text": args.text, "interval": args.interval}))
    elif args.command == "hotkey":
        run_action(driver, Action("hotkey", {"keys": args.keys}))
    elif args.command == "scroll":
        run_action(driver, Action("scroll", {"amount": args.amount}))
    elif args.command == "wait":
        run_action(driver, Action("wait", {"seconds": args.seconds}))
    elif args.command == "macro":
        actions = load_actions(args.file)
        for action in actions:
            run_action(driver, action)
    else:
        raise ValueError(f"Unknown command: {args.command}")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    driver = resolve_driver(args.live)
    return dispatch(args, driver)


if __name__ == "__main__":
    sys.exit(main())
