const fs = require("fs");
const packagesURL = "https://app.tea.xyz/v1/packages";

async function main() {
  const response = await fetch(packagesURL);
  const packagesRaw = await response.json();
  const packages = packagesRaw.map((pkg) => ({
    slug: pkg.slug,
    homepage: pkg.homepage || pkg.github_url,
    name: pkg.name,
    full_name: pkg.full_name,
    maintainer: pkg.maintainer,
    created: pkg.created_at,
    desc: pkg.description.replace(/\\/g, "\\\\"),
    short_description: (pkg.short_description || pkg.description).replace(/\\/g, "\\\\"),
    thumb_image_url: pkg.image_added_at ? `https://gui.tea.xyz/prod/${pkg.full_name}/512x512.webp` : "",
    keywords: pkg.keywords,
    dl_count: pkg.installs || 0,
    installs: pkg.installs ||  0,
    version: pkg.version,
  }));
  await fs.writeFileSync("./src/data/packages.json", JSON.stringify(packages, null, 2));
}

main();