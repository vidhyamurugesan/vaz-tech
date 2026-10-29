# VAZ Tech website

## Shared header and footer

The header, footer, desktop side menu and mobile menu are stored in **one file: `layout.js`**.
Pages don't contain this markup. Each page has placeholders, and `layout.js` fills them in when the page loads.

| What you want to change | Edit this file |
|---|---|
| Header, footer, logo, side menu, mobile menu | `layout.js` |
| Main menu links (Home, About, Services, Contact) | `site.js` (the `MAIN` list near the top) |
| Colours, fonts, spacing | `styles.css` |

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
5. To show the page in the main menu, add it to the `MAIN` list in `site.js`.
