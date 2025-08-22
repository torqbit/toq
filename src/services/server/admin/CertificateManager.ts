import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import dns from "dns";

const execAsync = promisify(exec);
const dnsResolve = promisify(dns.resolve);
const dnsResolveA = promisify(dns.resolve4);

export class CertificateManager {
  private readonly certbotCommand = "certbot";
  private readonly certsDir: string;
  private readonly nginxConfigDir: string;

  constructor(
    certsDirectory: string = "/etc/letsencrypt/live",
    nginxConfigDirectory: string = "/etc/nginx/sites-available"
  ) {
    this.certsDir = certsDirectory;
    this.nginxConfigDir = nginxConfigDirectory;
  }

  /**
   * Create Nginx configuration for the domain
   */
  private async createNginxConfig(customDomain: string, targetDomain: string): Promise<void> {
    const configContent = `
server {
    listen 80;
    server_name ${customDomain};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name ${customDomain};

    ssl_certificate /etc/letsencrypt/live/${customDomain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${customDomain}/privkey.pem;
    ssl_ciphers EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host ${targetDomain};
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
        proxy_cache_bypass $http_upgrade;
    }
}
`;

    const configPath = path.join(this.nginxConfigDir, `${customDomain}.conf`);
    await fs.promises.writeFile(configPath, configContent);
  }

  /**
   * Setup webroot directory for Let's Encrypt challenges
   */
  private async setupWebroot(): Promise<void> {
    const webrootPath = "/var/www/certbot/.well-known/acme-challenge";
    await execAsync(`mkdir -p ${webrootPath}`);
    await execAsync(`chmod -R 755 /var/www/certbot`);
  }

  /**
   * Determine if domain is apex (root) domain
   */
  private isApexDomain(domain: string): boolean {
    return domain.split(".").length === 2;
  }

  /**
   * Verify DNS records point to the correct target
   */
  private async verifyDNS(customDomain: string, targetDomain: string): Promise<boolean> {
    try {
      if (this.isApexDomain(customDomain)) {
        // For apex domains, verify A records
        const targetIPs = await dnsResolveA(targetDomain);
        const customDomainIPs = await dnsResolveA(customDomain);

        return targetIPs.some((targetIP) => customDomainIPs.some((customIP) => customIP === targetIP));
      } else {
        // For subdomains, verify CNAME
        const cnameRecords = await dnsResolve(customDomain, "CNAME");
        return cnameRecords.some((record) => record === targetDomain);
      }
    } catch (error) {
      console.error("DNS verification failed:", error);
      return false;
    }
  }

  async generateCustomDomainCertificate(customDomain: string, targetDomain: string, email: string): Promise<boolean> {
    try {
      // Validate domains
      if (!this.isValidDomain(customDomain) || !this.isValidDomain(targetDomain)) {
        throw new Error("Invalid domain format");
      }

      // Verify DNS records
      const dnsValid = await this.verifyDNS(customDomain, targetDomain);
      if (!dnsValid) {
        const recordType = this.isApexDomain(customDomain) ? "A" : "CNAME";
        throw new Error(`${recordType} record for ${customDomain} does not point to ${targetDomain}`);
      }

      // Setup webroot directory
      console.log("Setting up webroot directory...");
      await this.setupWebroot();

      // Create initial Nginx config for HTTP challenge
      console.log("Creating initial Nginx configuration...");
      await this.createInitialNginxConfig(customDomain);
      await execAsync("nginx -t && nginx -s reload");

      // Generate certificate using webroot method
      const command = [
        this.certbotCommand,
        "certonly",
        "--webroot",
        "-w /var/www/certbot",
        "--non-interactive",
        "--agree-tos",
        `--email ${email}`,
        `--domain ${customDomain}`,
        "--preferred-challenges http",
      ]
        .filter(Boolean)
        .join(" ");

      const { stdout } = await execAsync(command);
      console.log("Certificate generation output:", stdout);

      // Create final Nginx configuration with SSL
      await this.createNginxConfig(customDomain, targetDomain);
      await execAsync("nginx -t && nginx -s reload");

      // Verify certificate files
      const certExists = await this.verifyCertificateFiles(path.join(this.certsDir, customDomain));

      return certExists;
    } catch (error) {
      console.error("Certificate generation failed:", error);
      throw error;
    }
  }

  /**
   * Create initial Nginx configuration for HTTP challenge
   */
  private async createInitialNginxConfig(domain: string): Promise<void> {
    const configContent = `
server {
    listen 80;
    server_name ${domain};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        try_files $uri =404;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}
`;

    const configPath = path.join(this.nginxConfigDir, `${domain}.conf`);
    await fs.promises.writeFile(configPath, configContent);
  }

  /**
   * Verify certificate files exist
   */
  private async verifyCertificateFiles(certPath: string): Promise<boolean> {
    const requiredFiles = ["cert.pem", "chain.pem", "fullchain.pem", "privkey.pem"];
    try {
      await Promise.all(requiredFiles.map((file) => fs.promises.access(path.join(certPath, file), fs.constants.F_OK)));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate domain name format
   */
  private isValidDomain(domain: string): boolean {
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  }
}
