# How to upload the skill to GitHub

## Option A - Web UI (easiest)
1. Open your repo on github.com (e.g. `ravirockzzz28-bot/claude-god-mode`).
2. Click **Add file -> Upload files**.
3. Drag in the whole `skills/netflix-resume/` folder (SKILL.md, template.html, assets/).
4. Write a commit message, choose **Commit directly to main** (or a new branch + PR), click **Commit changes**.

## Option B - Git CLI
```bash
git clone https://github.com/ravirockzzz28-bot/claude-god-mode.git
cd claude-god-mode
# copy skills/netflix-resume/ into the repo, then:
git add skills/netflix-resume
git commit -m "Add netflix-resume skill"
git push -u origin main
```

## Use the skill in Claude Code
- **Personal (all projects):** copy the folder to `~/.claude/skills/netflix-resume/`.
- **Per project:** put it at `<project>/.claude/skills/netflix-resume/` and commit it.
- Then ask Claude: "make me a Netflix-style resume" - it loads the skill automatically.

## Claude.ai (web) upload
Zip the `netflix-resume` folder (SKILL.md at the zip's folder root), then Settings -> Capabilities -> Skills -> Upload skill.

## Live website (optional)
Repo -> Settings -> Pages -> Source: your branch, folder `/netflix-resume` or `/ (root)` -> Save. Your resume goes live at `https://<user>.github.io/<repo>/`.
