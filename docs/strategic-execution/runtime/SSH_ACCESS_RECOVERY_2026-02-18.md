# SSH Access Recovery (2026-02-18)

Context:
- `PermitRootLogin no` and `PasswordAuthentication no` were enforced on VPS.
- Server is now key-only for SSH.
- This operator workstation currently does not have a valid key mapped to VPS users.

Recovery path (Mobinhost console):

```bash
# 1) Login via provider console as root (out-of-band)
id deploy || adduser --disabled-password --gecos "" deploy
usermod -aG sudo deploy
mkdir -p /home/deploy/.ssh
chmod 700 /home/deploy/.ssh

# 2) Add operator public key
cat >> /home/deploy/.ssh/authorized_keys <<'KEY'
<PASTE_OPERATOR_PUBLIC_KEY_HERE>
KEY
chmod 600 /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh

# 3) Validate sshd and restart if needed
sshd -t && systemctl restart ssh
```

Validation from operator workstation:

```bash
ssh deploy@185.3.124.93
sudo -n true
sudo ufw status verbose
sudo fail2ban-client status
sudo fail2ban-client status sshd
```

Expected result:
- `deploy` login succeeds with key.
- `sudo` access works for governance verification commands.
