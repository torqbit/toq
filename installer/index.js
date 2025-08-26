#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import which from "which";
import semver from "semver";
import prompts from "prompts";
import chalk from "chalk";
import YAML from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    // Node version check
    const requiredNode = ">=16.0.0";
    if (!semver.satisfies(process.version, requiredNode)) {
      console.error(chalk.red(`Node ${requiredNode} is required, current: ${process.version}`));
      process.exit(1);
    }

    console.log(chalk.cyan.bold("Torqbit Docker Installer"));

    // Check docker binary
    let dockerBin;
    try {
      dockerBin = which.sync("docker");
    } catch (e) {
      console.error(chalk.red("Docker is not installed or not in PATH."));
      console.log("Install Docker Desktop: https://www.docker.com/products/docker-desktop/");
      process.exit(1);
    }

    // Detect compose command flavor
    const composeCmd = await detectCompose();
    if (!composeCmd) {
      console.error(chalk.red("Docker Compose not found."));
      console.log("Install Docker Desktop (includes Compose): https://www.docker.com/products/docker-desktop/");
      process.exit(1);
    }

    // Read bundled compose template
    const templatePath = path.join(__dirname, "docker-compose.yml");
    if (!fs.existsSync(templatePath)) {
      console.error(chalk.red("Bundled docker-compose.yml not found in installer package."));
      process.exit(1);
    }
    const composeTemplate = fs.readFileSync(templatePath, "utf8");

    // Target path in current working dir
    const targetPath = path.join(process.cwd(), "docker-compose.yml");

    // Prompt overwrite if exists
    if (fs.existsSync(targetPath)) {
      const { overwrite } = await prompts({
        type: "confirm",
        name: "overwrite",
        message: `docker-compose.yml already exists in ${process.cwd()}. Overwrite?`,
        initial: false,
      });
      if (!overwrite) {
        console.log(chalk.yellow("Aborted by user."));
        process.exit(0);
      }
    }

    // Ask for environment values to inject into web service
    const parsed = YAML.parse(composeTemplate);
    const webEnv = (((parsed || {}).services || {}).web || {}).environment || {};

    const questions = [
      {
        type: "text",
        name: "NEXT_SMTP_HOST",
        message: `${"Email Configuration: SMTP host"} ${chalk.dim(`(default: ${webEnv.NEXT_SMTP_HOST || "smtp.resend.com"})`)}`,
        initial: "",
      },
      {
        type: "text",
        name: "NEXT_SMTP_USER",
        message: `${"Email Configuration: SMTP user"} ${chalk.dim(`(default: ${webEnv.NEXT_SMTP_USER || "resend"})`)}`,
        initial: "",
      },
      {
        type: "text",
        name: "NEXT_SMTP_EMAIL",
        message: `${"Email Configuration: SMTP from email"} ${chalk.dim(`(default: ${webEnv.NEXT_SMTP_EMAIL || "no-reply@resend.com"})`)}`,
        initial: "",
      },
      {
        type: "password",
        name: "NEXT_SMTP_PASSWORD",
        message: `${"Email Configuration: SMTP password"} ${chalk.dim("(input hidden)")}`,
        initial: "",
      },
      {
        type: "text",
        name: "ADMIN_EMAIL",
        message: `${"Admin email"} ${chalk.dim(`(default: ${webEnv.ADMIN_EMAIL || "admin@example.com"})`)}`,
        initial: "",
      },
      {
        type: "password",
        name: "OPENAI_API_KEY",
        message: `${"OpenAI API key (optional)"} ${chalk.dim("(input hidden, leave blank to skip)")}`,
        initial: "",
      },
    ];

    const answers = await prompts(questions, {
      onCancel: () => {
        console.log(chalk.yellow("Setup cancelled. Torqbit wasn't installed."));
        process.exit(0);
      },
    });

    // Ensure structure exists
    parsed.services = parsed.services || {};
    parsed.services.web = parsed.services.web || {};
    parsed.services.web.environment = parsed.services.web.environment || {};

    const env = parsed.services.web.environment;
    const setIfProvided = (k) => {
      if (answers[k] !== undefined && answers[k] !== null && answers[k] !== "") {
        env[k] = answers[k];
      }
    };

    setIfProvided("NEXT_SMTP_HOST");
    setIfProvided("NEXT_SMTP_USER");
    setIfProvided("NEXT_SMTP_EMAIL");
    setIfProvided("NEXT_SMTP_PASSWORD");
    setIfProvided("ADMIN_EMAIL");
    setIfProvided("NEXTAUTH_SECRET");
    setIfProvided("OPENAI_API_KEY");

    const updatedYaml = YAML.stringify(parsed);

    // Write compose file with injected env
    fs.writeFileSync(targetPath, updatedYaml, "utf8");
    console.log(chalk.green("docker-compose.yml written with your configuration."));

    // Run compose up
    console.log(chalk.cyan("Starting services..."));
    await runCommand(composeCmd.bin, [...composeCmd.args, "up", "-d", "--build"]);

    // Wait for web service to be healthy
    console.log(chalk.cyan("Waiting for Toq (web) to become healthy..."));
    try {
      await waitForServiceHealthy(composeCmd, "web", 180_000, 3_000);
      console.log(chalk.green.bold("Toq web service is healthy."));
    } catch (e) {
      console.log(chalk.yellow(`Continuing, but health check did not report healthy: ${e?.message || e}`));
    }

    console.log(chalk.green.bold("Toq services have started."));
    console.log("- Toq Web: http://localhost:8080");
    console.log("- MySQL: localhost:3360");
    console.log("- Qdrant: http://localhost:6333");
  } catch (err) {
    console.error(chalk.red("Installer failed:"));
    console.error(err?.message || err);
    process.exit(1);
  }
}

async function detectCompose() {
  // Prefer 'docker compose'
  if (await canRun("docker", ["compose", "version"])) {
    return { bin: "docker", args: ["compose"] };
  }
  // Fallback 'docker-compose'
  if (await canRun("docker-compose", ["version"])) {
    return { bin: "docker-compose", args: [] };
  }
  return null;
}

async function canRun(bin, args) {
  try {
    which.sync(bin);
  } catch {
    return false;
  }
  return new Promise((resolve) => {
    const p = spawn(bin, args, { stdio: "ignore" });
    p.on("error", () => resolve(false));
    p.on("exit", (code) => resolve(code === 0));
  });
}

async function runCommand(bin, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(bin, args, { stdio: "inherit" });
    p.on("error", reject);
    p.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${bin} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

async function runCommandCapture(bin, args) {
  return new Promise((resolve, reject) => {
    let stdout = "";
    let stderr = "";
    const p = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
    p.stdout.on("data", (d) => (stdout += d.toString()));
    p.stderr.on("data", (d) => (stderr += d.toString()));
    p.on("error", reject);
    p.on("exit", (code) => {
      if (code === 0) resolve(stdout.trim());
      else reject(new Error(`${bin} ${args.join(" ")} exited with code ${code}: ${stderr.trim()}`));
    });
  });
}

async function waitForServiceHealthy(composeCmd, serviceName, timeoutMs = 180000, intervalMs = 3000) {
  // Get container ID for the service
  let containerId = await runCommandCapture(composeCmd.bin, [...composeCmd.args, "ps", "-q", serviceName]);
  if (!containerId) {
    // Compose may still be creating the container; poll until available or timeout
    const start = Date.now();
    while (!containerId && Date.now() - start < timeoutMs) {
      await new Promise((r) => setTimeout(r, intervalMs));
      try {
        containerId = await runCommandCapture(composeCmd.bin, [...composeCmd.args, "ps", "-q", serviceName]);
      } catch (_) {}
    }
  }
  if (!containerId) throw new Error(`Could not find container for service '${serviceName}'.`);

  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const status = await runCommandCapture("docker", [
        "inspect",
        "-f",
        "{{if .State.Health}}{{.State.Health.Status}}{{else}}unknown{{end}}",
        containerId,
      ]);
      if (status === "healthy") return true;
      if (status === "unhealthy") throw new Error("Service reported unhealthy");
    } catch (_) {
      // ignore and retry
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error("Timed out waiting for health");
}

main();
