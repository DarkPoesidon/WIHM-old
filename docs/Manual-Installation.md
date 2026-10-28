# Manual Installation

**Prerequisites (tested on Ubuntu 22.04+):**

- An Ubuntu server with sudo access
- A domain name pointing to your server's public IP (recommended)

## 1. System setup

Update and install required packages:

```bash
sudo apt update
sudo apt install -y git curl build-essential nginx python3-certbot-nginx ffmpeg
```

Install Node.js and npm (pick one):

| Method | Best for | Note |
|---|---|---|
| NodeSource | Most installs (recommended) | System-wide install via apt. |
| nvm | Per-user Node version management | Requires `nvm install` / `nvm use` after cloning. |
| Volta | Pinned toolchain per project | Installs a specific Node/npm version. |

**NodeSource (Recommended)**:

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
```

**nvm**:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/latest/install.sh | bash
```

**Volta**:

```bash
curl https://get.volta.sh | bash
volta install node@24.22.1 npm@11.6.4
```

## 2. Clone repository

```bash
sudo mkdir -p /opt/WIHM
cd /opt/WIHM
git clone https://github.com/DarkPoesidon/WIHM.git .
```

:::info

If you installed Node.js using nvm:

```bash
nvm install
nvm use
```

:::

## 3. Install dependencies

```bash
cd /opt/WIHM/server
npm install

cd /opt/WIHM/client
npm install
npm run build
```

## 4. Create systemd service

Create `/etc/systemd/system/WIHM.service` with the following:

```ini
[Unit]
Description=WIHM server
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/WIHM/server
ExecStart=/usr/bin/env node /opt/WIHM/server/index.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

:::info

- If you installed Node.js using nvm, set this as Node path in `ExecStart`:

```ini
ExecStart=/root/.nvm/versions/node/v24.22.1/bin/node index.js
```

- If you installed Node.js using volta, set this as Node path in `ExecStart`:

```ini
ExecStart=/root/.volta/bin/node index.js
```

:::

**Recommended: Create a dedicated user:**

:::warning

Skip this step if you installed Node.js using nvm or volta.

:::

Due to security concerns, it is recommended to create a dedicated system user and change ownership of the project directory:

1. Add these lines to systemd service file:

```ini
User=WIHM
Group=WIHM
```

2. Create a dedicated system user:

```bash
sudo useradd --system --no-create-home --shell /usr/sbin/nologin WIHM
```

3. Change ownership of the project directory:

```bash
sudo chown -R WIHM:WIHM /opt/WIHM
git config --global --add safe.directory /opt/WIHM
```

4. Grant the service user permission to control its own unit and read system logs (required for service restart/stop and the Logs tab in the admin panel):

```bash
sudo tee /etc/sudoers.d/WIHM > /dev/null <<'EOF'
# WIHM — allow the service user to control its own unit
# and read privileged logs without a password.
WIHM ALL=(root) NOPASSWD: /usr/bin/systemctl restart WIHM.service
WIHM ALL=(root) NOPASSWD: /usr/bin/systemctl stop WIHM.service
WIHM ALL=(root) NOPASSWD: /usr/bin/journalctl -u WIHM *
WIHM ALL=(root) NOPASSWD: /usr/bin/journalctl -u WIHM-worker *
WIHM ALL=(root) NOPASSWD: /usr/bin/cat /var/log/nginx/error.log
WIHM ALL=(root) NOPASSWD: /usr/bin/cat /var/log/nginx/access.log
WIHM ALL=(root) NOPASSWD: /usr/bin/nginx -t
WIHM ALL=(root) NOPASSWD: /usr/bin/systemctl reload nginx
EOF
sudo chmod 0440 /etc/sudoers.d/WIHM
```

Without this step the **Restart service** and **Stop service** buttons in the admin panel will fail with a permissions error, and system logs (service journal, nginx) will not be visible in the Logs tab.

**Enable and start the service:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now WIHM.service
```
