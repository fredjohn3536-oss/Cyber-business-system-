# Database Setup

## Linux (Ubuntu/Debian)

### Install MySQL Server

```bash
sudo apt-get update
sudo apt-get install -y mysql-server
```

### Start MySQL

```bash
sudo systemctl start mysql
sudo systemctl enable mysql   # auto-start on boot
```

### Create Database and User

```bash
sudo mysql -u root
```

Inside the MySQL shell:

```sql
CREATE DATABASE cyber_business_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON cyber_business_system.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## Windows 10 & 11

### Install MySQL Server

**Option A — MySQL Installer (Recommended)**

1. Download the MySQL Installer from: https://dev.mysql.com/downloads/installer/
2. Run the installer and choose **"Server only"** or **"Full"** setup type.
3. Follow the prompts:
   - **Type and Networking:** Keep defaults (Port 3306).
   - **Authentication Method:** Use **Strong Password Encryption** (recommended).
   - **Accounts and Roles:** Set a root password (e.g. `password` — adjust if different).
   - **Windows Service:** Check **"Configure as Windows Service"** and set it to start automatically.
4. Click **Execute** to apply and finish.

**Option B — Chocolatey (via PowerShell as Admin)**

```powershell
choco install mysql --params="--port 3306 --serviceName MySQL --serviceStartupType auto"
```

### Start MySQL

- The service starts automatically if configured during install.
- To manually start/stop:
  ```powershell
  net start MySQL
  net stop MySQL
  ```
- Or via **Services** panel: `Win + R` → `services.msc` → find `MySQL` → right-click **Start**.

### Create Database and User

Open **MySQL 8.0 Command Line Client** from the Start Menu, or use PowerShell:

```powershell
mysql -u root -p
```

Enter your root password when prompted, then run:

```sql
CREATE DATABASE cyber_business_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON cyber_business_system.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Add MySQL to PATH (optional but convenient)

1. `Win + R` → `sysdm.cpl` → **Advanced** → **Environment Variables**
2. Under **System variables**, find `Path`, click **Edit**
3. Add: `C:\Program Files\MySQL\MySQL Server 8.0\bin`
4. Click OK and restart your terminal.

---

## Configuration Notes

> **If you changed the root password**, update it in `backend/database.py` or set the `DATABASE_URL` environment variable:

**Linux / macOS:**
```bash
export DATABASE_URL=mysql+pymysql://root:yourpassword@localhost/cyber_business_system
```

**Windows (Command Prompt):**
```cmd
set DATABASE_URL=mysql+pymysql://root:yourpassword@localhost/cyber_business_system
```

**Windows (PowerShell):**
```powershell
$env:DATABASE_URL="mysql+pymysql://root:yourpassword@localhost/cyber_business_system"
```

---

## Import Schema and Seed Data (Optional)

**Linux:**
```bash
mysql -u root -p cyber_business_system < db_schema.sql
```

**Windows (Command Prompt):**
```cmd
mysql -u root -p cyber_business_system < db_schema.sql
```

**Windows (PowerShell):**
```powershell
Get-Content db_schema.sql | mysql -u root -p cyber_business_system
```

---

## Verify Connection

```bash
mysql -u root -p -e "USE cyber_business_system; SHOW TABLES;"
```

On Windows (PowerShell):
```powershell
mysql -u root -p -e "USE cyber_business_system; SHOW TABLES;"
```

---

## Start the Backend

```bash
cd backend
source venv/bin/activate      # Linux
# or
venv\Scripts\activate          # Windows
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will auto-create all tables on startup via SQLAlchemy. If you imported `db_schema.sql`, the tables already exist and will be reused.
