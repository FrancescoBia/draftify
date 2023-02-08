# Draftify

- [Download for Mac (Apple Silicon)](https://draftify.vercel.app/download/latest/mac-silicon.dmg)
- [Download for Mac (Intel)](https://draftify.vercel.app/download/latest/mac-intel.dmg)

---

Draftify is a minimal note and journal app (Mac only). It's a place to quickly write ideas and to think.

![Screenshot of Draftify](./assets/cover-draftify.png)

Rather than for creating perfect notes, Draftify aims to be a place for your unfinished thoughts and drafts. Every day you're given a blank canvas for your ideas and to-do lists (it supports Markdown formatting, which includes checklists). On the other page, you can see the older notes from past days, and edit/review them.

---

## Development

#### Repo structure

| Dir         | Description                                    |
| ----------- | ---------------------------------------------- |
| `/client`   | App client (CRA) and Electron rendered process |
| `/electron` | Electron main process                          |
| `/shared`   | Shared types and utilities                     |
| `/website`  | Marketing website (TBD)                        |
