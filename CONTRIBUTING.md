# Working on slow garden

This is a one-person project with an assistant. The point of writing the workflow
down is that the work should be visible on GitHub rather than held in a chat
history — so it can be picked up on a different day, on a different machine, or
by a person who wasn't there when it was decided.

---

## Where work lives

**Issues** are the backlog. Anything worth doing but not being done right now is an
issue, not a note in a conversation. An issue should say what's wrong or wanted and
how you'd know it was done — enough that it still makes sense in a month.

**Pull requests** are how changes land. One branch per issue, opened as a PR early
rather than when it's finished — a draft PR is a good place to see the diff and
change your mind before it's the main branch's problem.

**The changelog** is what shipped. Only reader-facing things go in it.

Labels worth having:

| label | for |
| --- | --- |
| `bug` | something is broken |
| `enhancement` | something new |
| `mobile` | only reproduces on a phone |
| `needs-device` | can't be verified in an emulator |
| `content` | writing — card meanings, copy, recipes |
| `chore` | maintenance, dependencies, tooling |

`needs-device` earns its place here. Most of this project's worst bugs were invisible
until they were opened on a real phone.

---

## Branches

```
fix/keyboard-shoves-the-step
feat/export-your-garden
chore/rename-the-repo
```

Never commit to `main` directly.

---

## Commits

Commit messages are sentences about what changed, in the present tense, lowercase,
prefixed by type:

```
fix: the treatments were doing nothing on iOS, and the rail was too small
feat: supporters unlock the app for good, without an account
```

They should read as an account of the work, not a label on it. Co-author them:

```
Co-Authored-By: Shantini <shazzer.sub@gmail.com>
```

---

## One change per deploy

Mobile layout work in particular: ship one change, open it on the actual phone,
then ship the next. Six fixes went out together once and every one of them had to
be reverted, because there was no way to tell which had broken what.

---

## Releasing

1. Move everything under **Unreleased** in `CHANGELOG.md` into a new version heading with today's date.
2. Commit as `chore: release 1.4.0`.
3. Tag it: `git tag -a v1.4.0 -m "..."` and push tags.
4. Cut a GitHub release, pasting that changelog section as the body.

Versions: patch for fixes, minor for anything a reader would notice, major for a
change that would surprise someone who'd used the app before.

---

## Pushing

Claude's sandboxed shell can't reach the macOS keychain, so `git push` fails there.
Claude commits; you push. That's expected, not a bug to work around, and no token
should ever be pasted anywhere to get around it.

---

## The card wiki

The deck's data lives in `lib/data/`, split across files by what reads it. To read
the deck as a deck, run:

```bash
npm run wiki
```

which regenerates one page per card into the private vault at
`icefeline/slow-garden-vault`. Those pages are **generated** — edit the data files
here and re-run. Loose thinking belongs in the vault's own notes, which the
generated pages link out to.

---

## Secrets

- `SLOW_GARDEN_UNLOCK_SECRET` must never change. Rotating it invalidates every
  supporter code ever issued, and there's no database to reissue them from.
- `BMC_WEBHOOK_SECRET` must match the value from Buy Me a Coffee.
- Nothing goes in `.env.local` that isn't also described in `.env.example`.
