# Dog-ear Books: a Wishlist demo

A small, made-up bookshop built with [Wishlist for Statamic](https://github.com/1994limited/wishlist-statamic), to try the addon and to copy from. Every screenshot in Wishlist's docs and Marketplace listing comes from here.

It shows:

- **Saving with a ribbon.** Each cover's bookmark ribbon is a `{{ wishlist:toggle }}` form. It works without JavaScript, and updates in place with it.
- **Notes.** A book page saves a "who's it for?" note with the item.
- **Several lists**, with a picker, rename, delete, "Make this my default list" and "Start another list". A book page saves to whichever list you choose.
- **Sharing**, with a link to copy, the phone's share sheet where there is one, and a shared page with "Save all to my list".
- **Guests and accounts.** Save as a guest, sign in, and what you saved moves to your account.
- **The Control Panel.** Content → Wishlists lists everyone's lists and the books saved most.

The book covers are drawn in CSS: there are no image files, and every title and author is invented.

## Running it

You need PHP 8.3+, Composer, and a local web server such as [Herd](https://herd.laravel.com) or `php artisan serve`.

```bash
git clone https://github.com/1994limited/wishlist-statamic-demo.git
cd wishlist-statamic-demo
composer install
cp .env.example .env
php artisan key:generate
php artisan demo:users
php artisan serve
```

Then open http://localhost:8000.

`demo:users` makes two accounts, both with the password `password`:

| Account | For |
| --- | --- |
| `jo@example.com` | Shopping: the sign-in page is filled in with it |
| `admin@example.com` | The Control Panel, at `/cp` |

It only runs with `APP_ENV=local`. Don't put this demo on a public server as it is: the sign-in page gives the password away.

Wishlist is a commercial addon. Running it locally like this needs no licence. The demo turns on Statamic Pro (`STATAMIC_PRO_ENABLED=true`) for front-end accounts, which runs in Statamic's trial mode locally.

## Trying the drivers

Lists are kept in flat files (`storage/wishlists`) by default. To try the others, change `WISHLIST_DRIVER` in `.env`:

- `database`: then run `php artisan migrate`.
- `browser`: lists live only in your browser's localStorage, and share links carry the items.

Nothing in the templates changes between drivers.

## Where to look

| File | What it shows |
| --- | --- |
| `resources/views/layout.antlers.html` | `{{ wishlist:scripts }}` in `<head>`, the header count, messages |
| `resources/views/partials/ribbon.antlers.html` | The save button: `{{ wishlist:toggle }}` with `data-wishlist-when` labels |
| `resources/views/products/show.antlers.html` | Saving with a note, to a chosen list: `{{ wishlist:add }}` with a `list` picker |
| `resources/views/wishlist.antlers.html` | The list picker, share box, and list forms |
| `resources/views/partials/saved.antlers.html` | The partial `{{ wishlist:render }}` draws each list with |
| `resources/views/wishlist/shared.antlers.html` | The shared page, with `{{ wishlist:import }}` |
| `config/wishlist.php` | Published config, pointing the shared page at the template above |
| `public/css/dogear.css` | The look, including the ribbon |

## Screenshots

`scripts/screenshots.mjs` signs in as Jo, saves some books, and captures every page at 2×, plus the Control Panel as the admin. Start from a fresh demo (no saved lists), with the demo users made:

```bash
cd scripts
npm install
DEMO_URL=http://localhost:8000 npm run screenshots
```

They're written to `scripts/screenshots/`. It drives Google Chrome on macOS by default; set `CHROME` to the path of another Chrome or Chromium.

## Licence

The demo's own code (templates, styles, content and scripts) is MIT licensed: copy whatever helps. Wishlist itself is commercial software: see [its licence](https://github.com/1994limited/wishlist-statamic/blob/main/LICENSE.md).
