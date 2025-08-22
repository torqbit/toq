import appConstant from "@/services/appConstant";
import { create } from "domain";

export type EmbedStep = {
  title: string;
  description: string; // Markdown-formatted
};

export function generateScriptTag(agentId: string, position: string, embedPath: string) {
  return `<script
  defer
  src="${embedPath}"
  data-agentId="${agentId}"
  data-position="${position}"
></script>`;
}

export function getNextraInstructions(agentId: string, position: string, embedPath: string) {
  const scriptTag = generateScriptTag(agentId, position, embedPath);

  return [
    {
      title: "Open your `_document.tsx` file",
      description:
        "Navigate to your Next.js project's `pages/_document.tsx`. This is where custom scripts are added to your HTML.",
    },
    {
      title: "Insert the chat embed script",
      description: `Paste the following code inside the \`<Head>\` element:\n\n\`\`\`tsx\n${scriptTag}\n\`\`\``,
    },
    {
      title: "Save and run",
      description: "Start your dev server (`npm run dev`) and confirm the chat appears at the correct screen position.",
    },
  ];
}

export function getDocusaurusInstructions(agentId: string, position: string, embedPath: string) {
  return [
    {
      title: "Open `docusaurus.config.js`",
      description: "Locate the `scripts` array at the root of the config file.",
    },
    {
      title: "Add the chat script to the `scripts` section",
      description: `Insert the script like this:\n\n\`\`\`js
scripts: [
  {
    src: '${embedPath}',
    defer: true,
    'data-agentId': '${agentId}',
    'data-position': '${position}'
  },
],
\`\`\``,
    },
    {
      title: "Restart Docusaurus",
      description: "Rebuild and serve your site to see the chat widget live.",
    },
  ];
}

export function getReadTheDocsInstructions(agentId: string, position: string, embedPath: string) {
  const embedCode = `{% extends "!layout.html" %}

{% block extrahead %}
  {{ super() }}
  <script>
    (function () {
      const script = document.createElement("script");
      script.src = "${embedPath}?v=" + Date.now();
      script.defer = true;

      // Preserve exact attribute casing
      script.setAttribute("data-agentId", "${agentId}");
      script.setAttribute("data-position", "${position}");

      document.head.appendChild(script);
    })();
  </script>
{% endblock %}
`;

  return [
    {
      title: "Setup docs folder",
      description:
        "In your project root, create a `docs` folder if it doesn’t already exist. This will contain your Sphinx documentation files.",
    },
    {
      title: "Add the chat widget embed code",
      description: `Inside \`docs\`, create a folder named \`_templates\`. Inside \`_templates\`, create a file called \`layout.html\`. 
        Paste the following Jinja/HTML code into \`layout.html\`:\n\n\`\`\`html+jinja\n${embedCode}\n\`\`\``,
    },
    {
      title: "Update the configuration",
      description:
        "In `docs/conf.py`, add:\n\n```python\nhtml_theme = 'sphinx_rtd_theme'\nhtml_static_path = ['_static']\ntemplates_path = ['_templates']\n```\nThis ensures Sphinx loads your custom `layout.html` and uses the Read the Docs theme.",
    },
    {
      title: "Deploy the changes",
      description: "Push your changes to your repository so Read the Docs can build with the updated template.",
    },
    {
      title: "Disable the theme switcher (optional)",
      description:
        "Go to your Read the Docs project dashboard → **Addons** → **Flyout** and disable it if you don’t want the version/theme selector to appear in the right bottom corner.\n\n![Disable readthedocs flyout](https://torqbit-dev.b-cdn.net/static/docs/integrations/disable-readthdocs-flyout.png)\n\n",
    },
  ];
}

export function getMintlifyInstructions(agentId: string, position: string, embedPath: string) {
  const embedCode = `(function () {
  const script = document.createElement("script");
  script.src = "${embedPath}?v=" + Date.now();
  script.defer = true;

  // Preserve exact attribute casing
  script.setAttribute("data-agentId", "${agentId}");
  script.setAttribute("data-position", "${position}");

  document.head.appendChild(script);
})();`;

  return [
    {
      title: "Create a JavaScript file for the embed",
      description:
        "Add a new `.js` file in your Mintlify project. If you can’t add files via the Mintlify editor, add it directly in the repository.",
    },
    {
      title: "Add the embeddable script",
      description: `Paste the following code inside your new JavaScript file:\n\n\`\`\`js\n${embedCode}\n\`\`\``,
    },
    {
      title: "Reference the script in `.mintlify/config.ts`",
      description: "Add a custom `scripts` array in your Mintlify config file pointing to your new JavaScript file.",
    },
    {
      title: "Deploy or run locally",
      description: "After adding the script, deploy the docs or run `mintlify dev` to test it.",
    },
  ];
}

export function getWebflowInstructions(agentId: string, position: string, embedPath: string) {
  const scriptTag = generateScriptTag(agentId, position, embedPath);

  return [
    {
      title: "Open your Webflow project settings",
      description: "Go to the `Custom Code` section under `Page Settings`.",
    },
    {
      title: "Paste embed script in Footer code",
      description: `Paste the following into the Footer code section:\n\n\`\`\`html\n${scriptTag}\n\`\`\``,
    },
    {
      title: "Publish the site",
      description: "Publish your Webflow site and verify the chat appears in the selected position.",
    },
  ];
}

export function getWordpressInstructions(agentId: string, position: string, embedPath: string) {
  const scriptTag = generateScriptTag(agentId, position, embedPath);

  return [
    {
      title: "1. Go to your WordPress Admin Panel",
      description: "Navigate to Appearance > Theme File Editor.",
    },
    {
      title: "2. Edit `footer.php`",
      description: `Paste this just before the \`</body>\` tag:\n\n\`\`\`html\n${scriptTag}\n\`\`\``,
    },
    {
      title: "3. Save and refresh",
      description: "Save changes and visit your site to see the chat widget.",
    },
  ];
}
