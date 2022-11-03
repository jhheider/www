![tea](https://tea.xyz/banner.png)

Deploys to [tea.xyz].


# Legal

You may not publish this website in an attempt to masquerade as tea.inc.
The tea logo and wordmark are registered trademarks of tea.inc.


# Contributing

* The site is built with [Hugo] and [Bootstrap].
* `.html` files in [`./src/layouts/page/`] have a corresponding `.md` file in [`./src/content/`].
* Repeated components are in [`./src/layouts/partials/`].

## Getting Started
The detail pages of each package are not committed to the repository for the simple reason of that would be too much to much repeating data.
Execute the following command just once per version of `/src/data/packages.json`. This will create the package detail pages in `/src/content/packages/[package_slug].md`.
```sh
.github/build-package-pages.sh src/data/packages.json src/content/packages
```


hugo can render your edits while you work:

```sh
hugo serve --watch --buildDrafts --source src
```

## Dependencies

| Project    | Version |
|------------|---------|
| gohugo.io  |  >=0.99 |

Install them yourself or use tea:

```
$ sh <(curl tea.xyz)
$ tea +git-scm.org git clone https://github.com/teaxyz/www tea-www
$ cd tea-www
$ tea .
```

# Build

Builds a static, deployable version of the website.

```sh
hugo --source src --destination ../public --minify
```


[tea.xyz]: https://tea.xyz
[Bootstrap]: https://getbootstrap.com/docs/5.2/getting-started/introduction/
[Hugo]: https://gohugo.io/documentation/
[`./src/layouts/page/`]: src/layouts/page
[`./src/content/`]: src/content
[`./src/layouts/partials/`]: src/layouts/partials
