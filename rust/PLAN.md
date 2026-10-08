# Rust pull-rss: learning plan

Porting `src/pull-rss.ts` to Rust in `rust/`, side by side with the TS version.
Both must co-exist; the npm library itself stays TypeScript.
The goal is learning Rust, so the port is done one small step at a time.

## How we work

- One step per round: Claude implements it, explains the Rust ideas in it, then waits.
- Gordey asks questions and tries small experiments, then confirms before the next step.
- Explanations compare with JS/TS, and show real compiler errors where useful.
- Each step is tested against the existing TS fixtures in `test/fixtures/`.
- Each finished step is committed on the `gordey/rust` branch.

## Steps

1. Done: toolchain and empty project (`Cargo.toml`, `main.rs`, `cargo run`).
2. Done: parse `<item>`s from RSS (`rss.rs`, `parse_rss_items`, `decode_xml_text`).
3. Next: sort items by `pubDate`, then get and filter titles (`sortRssItems`, `getTitles`, `filterTitles`).
   Bring in `serde_json` to compare with `apple-rss-items-sorted.json`, `titles.json`, `filtered-titles.json`.
4. Parse titles into a struct with `Option` fields (`parseTitles`, `parseRegex` with named groups), compare with `apple-rss-titles.json`.
5. Apply changes to the version-history JSON (`applyRssChanges`, `util.ts` helpers), compare with `*-before.json` / `*-after.json`.
6. Write the JSON in exactly the current hand-made format (`writeRssChanges`, `replacer`).
7. Fetch over HTTP and wire up `main`, replacing the temporary "read RSS from a file argument".
8. Run it in CI next to the TS version (`schedule-pull-rss.yml`, Rust toolchain and cache).

## Decisions so far

- `RssItem` is a struct with only `title` and `pub_date`, not a map of all fields like the TS version.
- Rust `regex` has no backreferences, so elements are found with `find` instead of `<(\w+)>…</\1>`.
- `regex` stays for `decode_xml_text`, even though it could be done by hand, because step 4 needs it anyway.
- Broken items panic with `.expect(…)`, as the TS version would throw on them too.
- Names follow Rust conventions, e.g. `caps` for regex captures.

## Covered so far

- `cargo run`, `cargo test`, `cargo fmt`, `cargo clippy`, `Cargo.toml` vs `package.json`, `Cargo.lock`.
- `let` vs `let mut`, macros (`println!`, `format!`), last expression as return value, blocks as expressions.
- `&str` vs `String`: ownership, moves, borrowing, `.clone()`, and the rule of thumb
  (params `&str`, struct fields and returned new text `String`).
- `Option`, `?`, `.expect()`, `match` arms and patterns like `Some(cdata)` that unpack values.
- Closures, lazy iterators and `.collect()`, `LazyLock` for a regex compiled once.
- `#[derive(Debug, PartialEq)]`, `#[cfg(test)]` tests next to the code, `include_str!`.
- Why there are several crates: `regex` is split into small crates, and Rust's `std` is deliberately small.

## Running cargo from Claude's sandbox

Claude can't write to `~/.cargo`, so it runs cargo with a temporary home:

```
export PATH=$HOME/.cargo/bin:$PATH CARGO_HOME=$TMPDIR/cargo-home RUSTUP_HOME=$HOME/.rustup CARGO_TARGET_DIR=$TMPDIR/target
```

Downloading crates needs `index.crates.io` and `static.crates.io`.
