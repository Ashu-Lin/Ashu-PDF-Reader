---
name: ashu-github-release
description: Release Ashu PDF Reader changes through version bump, validation, changelog, bilingual documentation, commit, tag, GitHub Release, and installer verification. Use for GitHub-bound commits or releases in this repository.
---

# Ashu GitHub Release

Use this skill for any repository change intended for GitHub, especially commits, tags, installers, release notes, README updates, repository metadata, or GitHub Releases.

Use `git-workflow-and-versioning` for general Git and SemVer practice. Use `git-commit` for commit-message construction. This skill adds the invariants specific to Ashu PDF Reader.

## Repository Invariants

- Product identity: Windows first, minimal by default, frameless, keyboard first.
- Stack: Tauri 2, Vue 3, TypeScript, Vite, PDF.js, Rust, pnpm.
- Remote: `https://github.com/Ashu-Lin/Ashu-PDF-Reader.git`.
- README must show exactly the three intended product screenshots. Do not add badges, scaffold graphics, or unrelated screenshots.
- Required application icons under `src-tauri/icons/` are product assets, not README images. Do not delete them.
- Keep English and Simplified Chinese documentation aligned.
- Never force push `main` or move a published release tag without explicit user approval.

## Release Order

1. Inspect `git status`, `git diff`, the current version, and the latest GitHub release.
2. Choose the SemVer bump from the actual change set. Record breaking changes explicitly.
3. Synchronize `package.json`, `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json`.
4. Update `CHANGELOG.md`. Update README download links only when the public version changes.
5. Validate according to the change type.
6. Create atomic Conventional Commits. Do not mix code, docs, and release metadata unless they are inseparable in one logical change.
7. Push `main`, then create and push `vX.Y.Z`.
8. Create the GitHub Release and upload the NSIS and MSI installers.
9. Verify README images, release assets, repository description, topics, remote branch, tag, and clean working tree.

Read `references/release-checklist.md` for commands and exact artifact paths.

## Validation Rules

- Code or UI change: run `pnpm build`; run `cargo check` when Rust or Tauri configuration changed.
- User-visible runtime change: launch `pnpm tauri dev` and verify the affected flow.
- Installer or release change: run `pnpm tauri build`.
- Documentation-only change: verify links and image references; no rebuild is required unless the user asks.
- Before publishing, ensure the release installers are release builds, never debug builds.

## GitHub Publication Rules

- Confirm the repository URL before adding or changing a remote.
- If GitHub authentication is missing, stop and complete authorization before publishing.
- Use the NSIS `.exe` as the recommended download and MSI as the alternate.
- Release notes must state that unsigned builds may trigger Windows SmartScreen.
- Use `gh release create` only after the tag exists and the release commit is final.
- After publication, verify with `gh release view` and `git ls-remote`.

## Completion

Report the version, commit hash, tag, release URL, installer paths, validation commands, and any remaining manual step. Do not claim publication succeeded until the remote branch, tag, and release assets are verified.
