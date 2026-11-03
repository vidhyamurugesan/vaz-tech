# VAZ Tech website

Content from `vt2`, using the shared-layout template from the `VAZ Tech` project.

## Shared header and footer

The header, footer, desktop side menu and mobile menu are stored in **one file: `layout.js`**.
Pages don't contain this markup. Each page has placeholders, and `layout.js` fills them in when the page loads.

| What you want to change | Edit this file |
|---|---|
| Header, footer, logo, side menu, mobile menu | `layout.js` |
| Main menu links (Home, About, What we do, Contact) | `site.js` (the `MAIN` list near the top) |
| Colours, fonts, spacing | `styles.css` |
| "Page not found" page | `404.html` |

## Pages

| Page | File | Address |
|---|---|---|
| Home | `index.html` | `/` |
| About | `about.html` | `/about` |
| What we do | `work.html` | `/work` |
| Contact | `contact.html` | `/contact` |
| Privacy Policy | `privacy.html` | `/privacy` |
| Terms of Use | `terms.html` | `/terms` |
| Page not found | `404.html` | any unknown address |

Links are relative clean addresses (for example `about`, and `./` for home), so the site works at the domain root
(GitHub Pages) and inside a subfolder (XAMPP, e.g. `http://localhost/vaz_tech-ncxnew/vt2/`).
For XAMPP, `.htaccess` maps `about` to `about.html` and shows `404.html` for missing pages.
`404.html` finds the site folder by itself, so it shows correctly at any wrong address.

## Adding a new page

1. Copy an existing page (for example `about.html`) and rename it.
2. Keep these placeholders in the page:
   ```html
   <div data-include="header"></div>
   <div data-include="footer"></div>
   <div data-include="rail"></div>
   <div data-include="menu"></div>
   ```
3. Keep these two lines at the end of `<body>`, in this order. **`layout.js` must come before `site.js`.**
   ```html
   <script src="layout.js"></script>
   <script src="site.js"></script>
   ```
4. Update the `<article class="page" data-page="..." ...>` tag. Set `data-page` to the file name without `.html`, so the page is highlighted in the menus.
5. To show the page in the main menu, add it to the `MAIN` list in `site.js`. To list it on the 404 page, add it to `404.html` (both the `known` list and the Pages list).
6. Write internal links without a leading `/` (for example `href="about"`).
