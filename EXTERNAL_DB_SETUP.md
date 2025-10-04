# 🌐 External PostgreSQL Access Setup

## CapRover Configuration

To make your CapRover PostgreSQL instance accessible externally, follow these steps:

### 1. Configure Port Mapping in CapRover

1. **Access CapRover Dashboard**
   - Go to your CapRover dashboard
   - Navigate to the `rms-postgres` app

2. **Enable External Access**
   - Go to **HTTP Settings** tab
   - **Uncheck** the "Do not expose as web-app externally" checkbox
   - This allows external access to the app

3. **Add Port Mapping**
   - Go to **App Configurations** tab
   - Scroll down to **Port Mapping** section
   - Click **Add Port Mapping**
   - Configure the mapping:
     - **Host Port**: `5433` (external port)
     - **Container Port**: `5432` (PostgreSQL default port)
   - Click **Add** to save the mapping

4. **Save and Restart**
   - Click **Save & Restart** button at the bottom
   - Wait for the app to restart (this may take 1-2 minutes)

5. **Verify Port Mapping**
   - After restart, check that the port mapping appears in the list
   - The mapping should show: `5433 → 5432`

### 2. Configure Firewall

**SSH into your CapRover server** and run these commands:

```bash
# Allow the mapped port 5433 through firewall
sudo ufw allow 5433

# Check firewall status to verify the rule was added
sudo ufw status

# Verify the port is listening (should show PostgreSQL)
sudo netstat -tlnp | grep 5433

# Check if PostgreSQL is running
docker ps | grep postgres
```

**Expected output:**
- `ufw status` should show `5433 ALLOW Anywhere`
- `netstat` should show port 5433 listening
- `docker ps` should show the PostgreSQL container running

### 3. Test External Connection

Test the connection from your local machine:

```bash
# Test connection using psql
psql -h llp.trizenventures.com -p 5433 -U postgres -d postgres

# Or test with the full connection string
psql "postgresql://postgres:6224942386efa76b@llp.trizenventures.com:5433/postgres"
```

### 4. Update Environment Configuration

The environment configuration has been updated to use external access:

```env
# Database Configuration (External CapRover PostgreSQL)
DB_HOST=llp.trizenventures.com
DB_PORT=5433
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=6224942386efa76b
DB_URL=postgresql://postgres:6224942386efa76b@llp.trizenventures.com:5433/postgres
```

## Security Considerations

### 1. Database Security
- **Strong Passwords**: Ensure your PostgreSQL password is strong
- **SSL/TLS**: The connection uses SSL for security
- **Firewall Rules**: Only allow necessary IPs if possible

### 2. Network Security
- **VPN Access**: Consider using VPN for additional security
- **IP Whitelisting**: Restrict access to specific IP addresses
- **Regular Updates**: Keep PostgreSQL and CapRover updated

### 3. Connection Security
- **SSL Required**: The connection requires SSL
- **Encrypted Traffic**: All data is encrypted in transit
- **Authentication**: Strong authentication mechanisms

## Troubleshooting

### Connection Refused
```bash
# Check if the port is open
telnet llp.trizenventures.com 5433

# Check firewall status
sudo ufw status

# Check if PostgreSQL is running
docker ps | grep postgres
```

### SSL Issues
```bash
# Test SSL connection
psql "postgresql://postgres:6224942386efa76b@llp.trizenventures.com:5433/postgres?sslmode=require"
```

### Port Mapping Issues
1. Verify port mapping in CapRover dashboard
2. Restart the PostgreSQL app
3. Check if the port is already in use

## Benefits of External Access

✅ **Direct Database Access** - Connect directly from local development  
✅ **No Docker Required** - No need for local PostgreSQL setup  
✅ **Real Production Data** - Use actual production data for development  
✅ **Simplified Workflow** - No migration scripts needed  
✅ **Consistent Environment** - Same data across all environments  

## Alternative: Keep Internal Access

If you prefer to keep the database internal, you can:

1. **Use Production API**: Connect to the production API instead
2. **Database Dumps**: Export/import data as needed
3. **VPN Access**: Use VPN to access internal services

## Next Steps

1. **Configure CapRover**: Set up port mapping as described above
2. **Test Connection**: Verify external access works
3. **Update Environment**: Use the new configuration
4. **Start Development**: Run `npm run dev` to test

## Support

If you encounter issues:
1. Check CapRover logs for the PostgreSQL app
2. Verify firewall configuration
3. Test network connectivity
4. Check PostgreSQL logs for authentication issues
