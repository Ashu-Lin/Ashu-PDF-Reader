# Ashu PDF Reader Release Checklist

## 1. Preflight

```powershell
git status --short --branch
git diff --stat
git log --oneline --decorate -5
git remote -v
& 'C:\Program Files\GitHub CLI\gh.exe' release list --limit 5
```

Determine the next SemVer version and whether the change is `feat`, `fix`, `docs`, `refactor`, `chore`, or a breaking change.

## 2. Version Sync

Update these files together:

- `package.json`
- `src-tauri/Cargo.toml`
- `src-tauri/tauri.conf.json`
- `CHANGELOG.md`

Run `cargo check` to refresh `src-tauri/Cargo.lock` when the Rust package version changes.

## 3. Validation

```powershell
pnpm build
cargo check
```

For installer releases:

```powershell
pnpm tauri build
```

For runtime-affecting changes, verify the relevant flow in `pnpm tauri dev`.

Expected release artifacts:

```text
src-tauri/target/release/bundle/nsis/Ashu PDF Reader_X.Y.Z_x64-setup.exe
src-tauri/target/release/bundle/msi/Ashu PDF Reader_X.Y.Z_x64_en-US.msi
```

## 4. Documentation

- Keep English `README.md` and `README.zh-CN.md` aligned.
- Keep exactly the three approved product screenshots in README.
- Update download links when the public version changes.
- Keep the minimal, frameless, and keyboard-first identity prominent.
- Update `CHANGELOG.md` with user-visible changes and fixes.

## 5. Commit and Tag

Use Conventional Commits. Prefer separate commits for code, documentation, and release metadata when each is independently reviewable.

```powershell
git add <files>
git commit -m "type(scope): description"
git push origin main
git tag -a vX.Y.Z -m "Ashu PDF Reader vX.Y.Z"
git push origin vX.Y.Z
```

Do not move a published tag.

## 6. GitHub Release

Prepare release notes that include highlights, downloads, and the unsigned-build SmartScreen warning. Then run:

```powershell
& 'C:\Program Files\GitHub CLI\gh.exe' release create 'vX.Y.Z' `
  'src-tauri\target\release\bundle\nsis\Ashu PDF Reader_X.Y.Z_x64-setup.exe' `
  'src-tauri\target\release\bundle\msi\Ashu PDF Reader_X.Y.Z_x64_en-US.msi' `
  --title 'Ashu PDF Reader vX.Y.Z' `
  --notes-file release-notes.md
```

Use the NSIS installer as the recommended download and the MSI as the alternate.

## 7. Remote Verification

```powershell
git status --short --branch
git ls-remote --heads --tags origin
& 'C:\Program Files\GitHub CLI\gh.exe' release view vX.Y.Z --json name,tagName,url,assets
& 'C:\Program Files\GitHub CLI\gh.exe' repo view Ashu-Lin/Ashu-PDF-Reader --json description,repositoryTopics,url,visibility
```

Confirm that:

- main and the tag exist remotely.
- Both installers are uploaded.
- README downloads resolve.
- Repository description includes minimal and frameless.
- Working tree is clean.
