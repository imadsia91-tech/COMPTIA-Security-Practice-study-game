// ═══════════════════════════════════════
// GLOBAL ERROR HANDLING — shows any JS error visibly on screen
// instead of leaving a silent blank page.
// ═══════════════════════════════════════
function showFatalError(msg) {
  let el = document.getElementById('fatal-error');
  if (!el) {
    el = document.createElement('div');
    el.id = 'fatal-error';
    document.body.prepend(el);
  }
  el.classList.add('show');
  el.textContent = '⚠ Script error: ' + msg + '  (open DevTools console for full details)';
}
window.addEventListener('error', function (e) {
  showFatalError(e.message || 'Unknown error');
});
window.addEventListener('unhandledrejection', function (e) {
  showFatalError((e.reason && e.reason.message) || String(e.reason));
});

// ═══════════════════════════════════════
// DATA
// ═══════════════════════════════════════
const DN = ['General Security','Threats & Vulnerabilities','Security Architecture','Security Operations','Governance & Risk'];
// Real SY0-701 exam weighting: General 12%, Threats 22%, Architecture 18%, Operations 28%, Governance 20%.
// Domain Exam (50 total) and Boss Quiz (30 total) question counts are scaled to match, instead of splitting evenly.
const DEX_COUNTS = [6, 11, 9, 14, 10];
const BOSS_COUNTS = [4, 7, 5, 8, 6];
// MODULES = "My Path COMPTIA Sec+" course modules (used for Flashcards, Study Notes, Match It).
// DN above stays as the 5 official SY0-701 exam domains (used for Boss Quiz, Domain Exam, First Preparation)
// since those modes simulate the real certification test, which is graded on those 5 domains regardless of
// how any given course chapters its material.
const MODULES = [
  'Introduction to CyberSecurity',
  'Networking',
  'Active Defense',
  'Attacks, Threats & Vulnerabilities',
  'Architecture & Design II',
  'Cryptography & Secure Solutions',
  'Secure Solution Implementation II',
  'Operations, Governance & Risk',
  'Governance, Compliance & Audits',
  'Revision — Mixed Review',
];

const CARDS = [
{d:0,m:0,t:'CIA Triad',df:'Confidentiality, Integrity, Availability — the three core security principles.',ex:'Encryption→Confidentiality · Hashing→Integrity · Redundancy→Availability'},
{d:0,m:0,t:'Confidentiality',df:'Only authorized individuals can access data.',ex:'Encryption, access controls, data classification.'},
{d:0,m:0,t:'Integrity',df:'Data has not been tampered with — detects unauthorized modification.',ex:'SHA-256 hashing, digital signatures, FIM.'},
{d:0,m:0,t:'Availability',df:'Systems and data are accessible when authorized users need them.',ex:'Load balancing, redundancy, DDoS protection, backups.'},
{d:0,m:0,t:'Non-repudiation',df:'Proof that an entity performed a specific action — denial is impossible.',ex:'Digital signatures bind messages to the sender\'s private key.'},
{d:0,m:0,t:'Zero Trust',df:'Continuous verification of every user, device, and connection — no implicit trust.',ex:'Never trust, always verify. MFA and least privilege enforced everywhere.'},
{d:0,m:0,t:'Least Privilege',df:'Users receive only the minimum access required for their job.',ex:'A payroll clerk can view but not delete salary records.'},
{d:0,m:0,t:'Separation of Duties',df:'Critical tasks split among multiple people — no single person can commit fraud alone.',ex:'Wire transfer initiator cannot also be the approver.'},
{d:0,m:0,t:'Preventive Control',df:'Stops a threat BEFORE it causes damage.',ex:'Firewalls, MFA, input validation, encryption, access controls.'},
{d:0,m:0,t:'Detective Control',df:'Identifies and records events after or while they occur.',ex:'IDS, SIEM, audit logs, cameras, File Integrity Monitoring.'},
{d:0,m:0,t:'Corrective Control',df:'Restores systems to normal AFTER an incident.',ex:'Restoring from backup after ransomware. Patching after exploitation.'},
{d:0,m:0,t:'Deterrent Control',df:'Discourages attacks through warnings — does not technically block.',ex:'Login banners, security guards, warning signs.'},
{d:0,m:0,t:'Compensating Control',df:'Alternative measure when the primary control cannot be implemented.',ex:'Isolating an unpatched legacy server on a restricted VLAN.'},
{d:0,m:0,t:'Defense in Depth',df:'Multiple overlapping security layers — failure of one does not expose everything.',ex:'Perimeter FW + IPS + Host FW + AV + Encryption + SIEM.'},
{d:0,m:0,t:'Honeypot',df:'Decoy system to attract attackers, detect intrusions, and gather intelligence.',ex:'Fake database server logging every unauthorized access attempt.'},
{d:0,m:0,t:'Honeynet',df:'A network of honeypots forming a realistic decoy environment.',ex:'Multiple fake systems to study attacker lateral movement.'},
{d:0,m:0,t:'AAA',df:'Authentication (verify identity) + Authorization (grant access) + Accounting (log activity).',ex:'Login then access only HR files then all actions logged.'},
{d:0,m:5,t:'PKI',df:'Public Key Infrastructure — framework managing digital certificates and key pairs.',ex:'HTTPS, email signing, VPN, and code signing all use PKI.'},
{d:0,m:5,t:'Certificate Authority',df:'Trusted third party that issues and signs digital certificates.',ex:'DigiCert, Let\'s Encrypt are public CAs. Internal CAs for enterprises.'},
{d:0,m:5,t:'CRL',df:'Certificate Revocation List — certificates revoked before their expiry date.',ex:'Compromised private key means certificate added to CRL immediately.'},
{d:0,m:5,t:'OCSP',df:'Online Certificate Status Protocol — real-time certificate validity check.',ex:'Browser queries OCSP to confirm a certificate has not been revoked.'},
{d:0,m:5,t:'Symmetric Encryption',df:'Single shared key for both encrypt and decrypt. Fast, requires secure key exchange.',ex:'AES-256 — standard for bulk data encryption.'},
{d:0,m:5,t:'Asymmetric Encryption',df:'Public/private key pair. Public key encrypts, only private key decrypts.',ex:'RSA, ECC — used in TLS, SSH, email signing.'},
{d:0,m:5,t:'Hashing',df:'One-way function producing a fixed-length digest. Verifies integrity, NOT encryption.',ex:'SHA-256. Change one bit and the hash changes completely. Irreversible.'},
{d:0,m:5,t:'Salting',df:'Unique random value added to each password before hashing.',ex:'Two users with same password get different hashes because of unique salts.'},
{d:0,m:5,t:'Digital Signature',df:'Sign with private key, verify with public key. Provides integrity and non-repudiation.',ex:'Signed email proves sender identity and content was not altered.'},
{d:0,m:5,t:'ECC',df:'Elliptic Curve Cryptography — same security as RSA with much shorter keys.',ex:'256-bit ECC is approximately equal to 3072-bit RSA. Used in WPA3, TLS 1.3.'},
{d:0,m:5,t:'Perfect Forward Secrecy',df:'Unique session keys per session — past sessions safe even if long-term keys are compromised.',ex:'TLS 1.3 enforces PFS by default.'},
{d:0,m:5,t:'Steganography',df:'Hiding data within other files such as images or audio without obvious detection.',ex:'Hiding a message in the least-significant bits of a JPEG image.'},
{d:0,m:5,t:'Tokenization',df:'Replacing sensitive data with a non-sensitive token. Original stored in a secure vault.',ex:'Credit card number replaced with a random token for processing.'},
{d:0,m:6,t:'TPM',df:'Trusted Platform Module — hardware chip storing cryptographic keys securely on the device.',ex:'Used in BitLocker full-disk encryption. Keys cannot be extracted externally.'},
{d:0,m:6,t:'HSM',df:'Hardware Security Module — dedicated hardware performing crypto operations without exposing keys.',ex:'Banks use HSMs to protect signing keys. Keys never leave the device.'},
{d:1,m:3,t:'Ransomware',df:'Encrypts victim files and demands payment for the decryption key.',ex:'WannaCry, LockBit. Best defense is offline backups. Response is isolate then restore.'},
{d:1,m:3,t:'Rootkit',df:'Malware hiding at kernel level — conceals processes, files, and connections from OS tools.',ex:'Requires memory forensics or full OS reinstall to detect and remove.'},
{d:1,m:3,t:'Trojan',df:'Malware disguised as legitimate software. Requires user action. Does not self-replicate.',ex:'Fake codec or cracked software that silently installs a backdoor.'},
{d:1,m:3,t:'Worm',df:'Self-replicating malware spreading across networks without user interaction.',ex:'WannaCry used EternalBlue SMB exploit and spread with zero user clicks.'},
{d:1,m:3,t:'Keylogger',df:'Records keystrokes and transmits them to attacker — captures passwords and credentials.',ex:'Installed via phishing. Every password typed is sent to the attacker.'},
{d:1,m:3,t:'Logic Bomb',df:'Malware dormant until a specific trigger activates its payload.',ex:'Insider plants code that deletes all files after their termination date.'},
{d:1,m:3,t:'Spyware',df:'Secretly monitors user activity and exfiltrates data without consent.',ex:'Tracks browsing, captures screenshots, logs keystrokes.'},
{d:1,m:3,t:'Phishing',df:'Mass deceptive emails to steal credentials or install malware.',ex:'"Your account is locked. Click here." Sent to thousands of random addresses.'},
{d:1,m:3,t:'Spear Phishing',df:'Targeted phishing customized for a specific individual using personal details.',ex:'Email to a named person mentioning their specific current project.'},
{d:1,m:3,t:'Whaling',df:'Spear phishing specifically targeting executives such as CEO and CFO.',ex:'Fake legal subpoena or urgent board request sent directly to C-suite.'},
{d:1,m:3,t:'Vishing',df:'Voice phishing — phone calls manipulating victims into disclosing sensitive information.',ex:'"IT support here — we need your VPN password for an urgent fix."'},
{d:1,m:3,t:'Smishing',df:'SMS phishing — malicious text messages with links or requests for data.',ex:'"Your bank account is suspended. Verify immediately at this link."'},
{d:1,m:3,t:'BEC',df:'Business Email Compromise — impersonating executives via spoofed email to authorize fraud.',ex:'Fake CEO email asks CFO to wire $200K to a new vendor account.'},
{d:1,m:3,t:'Pretexting',df:'Creating a fabricated scenario to manipulate someone into providing access or information.',ex:'Calling HR claiming to be a new employee who needs payroll details updated.'},
{d:1,m:3,t:'Watering Hole',df:'Compromising websites the target group visits to infect visitors passively.',ex:'Attacker compromises a trade association website visited by target employees.'},
{d:1,m:3,t:'Tailgating',df:'Physically following an authorized person through a secured door without credentials.',ex:'Walking through a badge-access door right behind a legitimate employee.'},
{d:1,m:3,t:'Shoulder Surfing',df:'Observing someone\'s screen or keyboard to steal credentials or information.',ex:'Looking over someone\'s shoulder at an ATM to see their PIN.'},
{d:1,m:3,t:'SQL Injection',df:'Injecting malicious SQL into input fields to manipulate database queries.',ex:'Entering OR 1=1 in a login form can bypass authentication entirely.'},
{d:1,m:3,t:'XSS',df:'Cross-Site Scripting — injecting malicious scripts that execute in other users\' browsers.',ex:'Stored XSS: attacker comment steals session cookies from all other visitors.'},
{d:1,m:3,t:'Buffer Overflow',df:'Writing more data to a buffer than it holds — overwrites memory to execute attacker code.',ex:'Unchecked input in C allows shellcode injection via stack overflow.'},
{d:1,m:3,t:'Directory Traversal',df:'Using ../ sequences to access files outside the intended web root directory.',ex:'GET /../../etc/passwd reads the system password file from a vulnerable server.'},
{d:1,m:3,t:'Zero-Day',df:'Vulnerability unknown to vendor or with no patch available at time of exploitation.',ex:'Defenders have zero days to prepare. Nation-states stockpile zero-days.'},
{d:1,m:3,t:'Supply Chain Attack',df:'Compromising a trusted vendor, update, or component to reach downstream targets.',ex:'SolarWinds: malware injected into software updates reached 18,000+ organizations.'},
{d:1,m:3,t:'DDoS',df:'Distributed Denial of Service — botnet overwhelms a target exhausting its resources.',ex:'Mirai IoT botnet took down Dyn DNS making Twitter and Netflix unreachable.'},
{d:1,m:3,t:'Password Spraying',df:'Trying one or a few common passwords against many accounts to avoid lockout.',ex:'Trying Summer2024! against 50,000 accounts instead of many passwords vs one.'},
{d:1,m:3,t:'Credential Stuffing',df:'Using leaked username/password pairs from other breaches to access different services.',ex:'Relies on password reuse — one breach can expose accounts on other sites.'},
{d:1,m:3,t:'ARP Spoofing',df:'Fake ARP replies poison caches — redirect traffic through the attacker enabling MITM.',ex:'Attacker maps their MAC to gateway IP — victim traffic flows through them.'},
{d:1,m:3,t:'DNS Poisoning',df:'Injecting false DNS records into a cache — redirects users to malicious sites.',ex:'User types correct bank URL but poisoned DNS sends them to a phishing clone.'},
{d:1,m:3,t:'Typosquatting',df:'Registering look-alike domains exploiting character substitutions or misspellings.',ex:'paypa1.com instead of paypal.com — victims who mistype land on phishing page.'},
{d:1,m:3,t:'Replay Attack',df:'Capturing a valid authentication message and retransmitting it later to gain access.',ex:'Attacker captures a session cookie and reuses it hours later.'},
{d:1,m:3,t:'CSRF',df:'Cross-Site Request Forgery — tricks a browser into making unauthorized requests to a trusted site.',ex:'Malicious page silently submits a money transfer using the victim\'s active session.'},
{d:2,m:1,t:'DMZ',df:'Network segment hosting public-facing services isolated from the internal network.',ex:'Web, mail, and DNS in DMZ. Internal databases protected behind it.'},
{d:2,m:1,t:'Network Segmentation',df:'Dividing a network into zones to limit lateral movement and contain breaches.',ex:'HR VLAN, Finance VLAN, Guest VLAN — firewall rules between each segment.'},
{d:2,m:1,t:'Micro-Segmentation',df:'Workload-level segmentation — each service only communicates with what it explicitly needs.',ex:'Payment service can only talk to auth service, not to the logging service.'},
{d:2,m:1,t:'VPN',df:'Virtual Private Network — encrypted tunnel over the public internet protecting data in transit.',ex:'Remote employees use VPN — traffic encrypted even on public Wi-Fi.'},
{d:2,m:1,t:'TLS',df:'Transport Layer Security — encrypted and authenticated communication protocol.',ex:'HTTPS equals HTTP plus TLS. The browser padlock confirms TLS is active.'},
{d:2,m:1,t:'IPSec',df:'Internet Protocol Security — encrypts and authenticates IP packets at the network layer.',ex:'Used in site-to-site VPNs. Works at Layer 3, unlike TLS at Layer 4 or 7.'},
{d:2,m:2,t:'Firewall',df:'Controls traffic based on rules — blocks unauthorized while permitting legitimate traffic.',ex:'Rule: deny all inbound except TCP 443 and 80 to DMZ web servers.'},
{d:2,m:2,t:'NGFW',df:'Next-Generation Firewall — Layer 7 deep packet inspection plus threat intelligence.',ex:'Blocks Tor on any port. Traditional firewalls can only filter by IP and port.'},
{d:2,m:2,t:'WAF',df:'Web Application Firewall — filters HTTP/HTTPS traffic blocking SQLi, XSS, and app attacks.',ex:'Deployed in front of web servers. Inspects request content not just ports.'},
{d:2,m:2,t:'IDS',df:'Intrusion Detection System — passively monitors and alerts. Does NOT block traffic.',ex:'Detects a port scan and alerts the SOC. The scan traffic still passes through.'},
{d:2,m:2,t:'IPS',df:'Intrusion Prevention System — inline device that detects AND actively blocks malicious traffic.',ex:'Drops SQL injection packets before they reach the database server.'},
{d:2,m:1,t:'Proxy Server',df:'Intermediary intercepting and filtering web traffic — caching, content filtering, logging.',ex:'Corporate proxy blocks social media, logs all browsing, caches downloads.'},
{d:2,m:1,t:'Load Balancer',df:'Distributes traffic across multiple servers to improve availability and performance.',ex:'Routes requests to 5 web servers. If one fails, traffic reroutes automatically.'},
{d:2,m:1,t:'NAC',df:'Network Access Control — evaluates device posture before granting network access.',ex:'Laptop missing patches placed in remediation VLAN until compliant.'},
{d:2,m:1,t:'VLAN',df:'Virtual LAN — logical network segment created by switch configuration.',ex:'Finance on VLAN 10, HR on VLAN 20 — inter-VLAN traffic goes through firewall.'},
{d:2,m:1,t:'WPA3',df:'Current Wi-Fi security standard. Uses SAE, adds OWE for open networks, enforces PFS.',ex:'Resistant to KRACK attacks. SAE replaces the vulnerable WPA2 PSK handshake.'},
{d:2,m:4,t:'High Availability',df:'Eliminates single points of failure through redundancy and automatic failover.',ex:'Active-passive cluster: standby takes over automatically with zero user interruption.'},
{d:2,m:4,t:'RTO',df:'Recovery Time Objective — maximum acceptable time to restore a system after failure.',ex:'RTO = 4 hours means system must be online within 4 hours of going down.'},
{d:2,m:4,t:'RPO',df:'Recovery Point Objective — maximum acceptable data loss measured in time.',ex:'RPO = 1 hour means backups must run every hour — lose no more than 1 hour of data.'},
{d:2,m:4,t:'Hot Site',df:'Fully operational duplicate facility with real-time replication — immediate failover.',ex:'Most expensive DR option. Minutes to switch over. For mission-critical systems.'},
{d:2,m:4,t:'Warm Site',df:'Backup facility with some pre-installed equipment — activated within hours.',ex:'Balance of cost and speed. Systems provisioned but data must be restored.'},
{d:2,m:4,t:'Cold Site',df:'Facility with power and connectivity but no equipment — requires days to activate.',ex:'Cheapest DR option. For non-critical systems tolerating extended downtime.'},
{d:2,m:1,t:'SD-WAN',df:'Software-Defined Wide Area Network — centralizes WAN management with intelligent routing.',ex:'Automatically routes branch traffic over best available link: MPLS, internet, or LTE.'},
{d:2,m:1,t:'SASE',df:'Secure Access Service Edge — cloud-delivered networking and security as one service.',ex:'Combines SD-WAN, SWG, CASB, ZTNA, and FWaaS. Security follows users anywhere.'},
{d:2,m:1,t:'Jump Server',df:'Hardened bastion host used as a single access point to reach systems in a secure zone.',ex:'Admins SSH to jump server first, then SSH from there to internal servers.'},
{d:2,m:1,t:'Air Gap',df:'Physical isolation — system has no network connection whatsoever.',ex:'Nuclear control systems and classified networks. Cannot be hacked remotely.'},
{d:3,m:2,t:'SIEM',df:'Aggregates and correlates logs across the environment for real-time threat detection.',ex:'Correlates failed login plus new admin account plus large download into one high-priority alert.'},
{d:3,m:2,t:'SOAR',df:'Automates incident response workflows reducing manual effort and response time.',ex:'Automatically isolates host, creates ticket, and pages SOC when ransomware is detected.'},
{d:3,m:6,t:'EDR',df:'Endpoint Detection and Response — monitors endpoints, detects threats, enables remote response.',ex:'Detects malware on a laptop, captures process tree, allows remote isolation.'},
{d:3,m:7,t:'DLP',df:'Data Loss Prevention — monitors and blocks unauthorized transfer of sensitive data.',ex:'Prevents emailing a file containing 10,000 SSNs to a personal Gmail account.'},
{d:3,m:7,t:'FIM',df:'File Integrity Monitoring — detects unauthorized changes to critical system files.',ex:'Alerts SOC when /etc/passwd is unexpectedly modified on a production server.'},
{d:3,m:7,t:'UEBA',df:'User and Entity Behavior Analytics — ML-based anomaly detection for insider threats.',ex:'Alerts when an employee downloads 50GB at 2AM which is ten times their normal baseline.'},
{d:3,m:7,t:'IR Phases',df:'Preparation, Detection, Analysis, Containment, Eradication, Recovery, Lessons Learned.',ex:'Contain FIRST, then eradicate the cause, then recover systems to production.'},
{d:3,m:7,t:'Chain of Custody',df:'Documentation of who handled evidence and when — ensures court admissibility.',ex:'Must be established immediately upon seizing a device for investigation.'},
{d:3,m:7,t:'Forensic Image',df:'Bit-for-bit exact copy of storage media for forensic analysis.',ex:'Create with FTK Imager or dd. Hash both original and copy with SHA-256 to prove integrity.'},
{d:3,m:7,t:'Volatility',df:'Open-source memory forensics framework for analyzing RAM dumps.',ex:'Finds fileless malware that exists only in memory and leaves no trace on disk.'},
{d:3,m:7,t:'RBAC',df:'Role-Based Access Control — permissions assigned by job role, not individual identity.',ex:'All Payroll role members access payroll systems. Role change equals automatic permission update.'},
{d:3,m:7,t:'MAC',df:'Mandatory Access Control — system-enforced via security labels and clearance levels.',ex:'Used in classified environments. SECRET clearance required for SECRET data.'},
{d:3,m:7,t:'DAC',df:'Discretionary Access Control — resource owners grant or revoke access as they see fit.',ex:'File owner grants colleague read permission. Most flexible, least secure.'},
{d:3,m:7,t:'ABAC',df:'Attribute-Based Access Control — access based on user, resource, and environment attributes.',ex:'Allow if user=Finance AND device=managed AND time=business hours AND location=HQ.'},
{d:3,m:4,t:'MFA',df:'Multi-Factor Authentication — two or more factors from different authentication categories.',ex:'Password (know) plus token (have) equals MFA. Two passwords is NOT MFA.'},
{d:3,m:4,t:'SSO',df:'Single Sign-On — authenticate once, access multiple applications without re-authenticating.',ex:'Login to portal once then access email, HR, and CRM without further prompts.'},
{d:3,m:4,t:'SAML',df:'Security Assertions Markup Language — XML standard for federated identity and SSO.',ex:'Corporate AD credentials used to log into Salesforce via SAML assertion.'},
{d:3,m:4,t:'OAuth 2.0',df:'Authorization framework — apps access resources on behalf of users without sharing credentials.',ex:'"Login with Google" — Google confirms identity without sharing your password.'},
{d:3,m:8,t:'Penetration Testing',df:'Authorized simulated attack actively exploiting vulnerabilities to show real impact.',ex:'Pen testers EXPLOIT weaknesses. Different from vulnerability scanning which only identifies.'},
{d:3,m:8,t:'Vulnerability Scan',df:'Automated identification of potential weaknesses. Does NOT exploit.',ex:'Nessus, OpenVAS. Finds unlocked doors but does not walk through them.'},
{d:3,m:7,t:'Tabletop Exercise',df:'Discussion-based IR drill — team talks through response to a simulated scenario.',ex:'Ransomware hit file servers at 3AM. Walk through every step of your response.'},
{d:3,m:6,t:'MDM',df:'Mobile Device Management — enforces security policies across managed mobile devices.',ex:'Enforces PIN, encryption, remote wipe, and app controls on all corporate mobiles.'},
{d:3,m:7,t:'PAM',df:'Privileged Access Management — controls, monitors, and audits privileged account usage.',ex:'Just-in-time root access for one hour when needed with all sessions recorded.'},
{d:4,m:7,t:'Risk Appetite',df:'The amount of risk an organization is willing to accept in pursuit of its objectives.',ex:'Startup: high risk appetite to move fast. Bank: very low risk appetite.'},
{d:4,m:7,t:'Risk Tolerance',df:'Acceptable deviation from risk appetite — threshold where risk becomes unacceptable.',ex:'Appetite: some downtime OK. Tolerance: never more than 4 hours per year.'},
{d:4,m:7,t:'Risk Transfer',df:'Shifting financial impact of a risk to a third party via insurance.',ex:'Cyber liability insurance transfers breach financial risk to the insurer.'},
{d:4,m:7,t:'Risk Avoidance',df:'Eliminating a risk entirely by not engaging in the activity that creates it.',ex:'Not storing payment card data eliminates PCI DSS scope entirely.'},
{d:4,m:7,t:'Risk Mitigation',df:'Implementing controls to reduce likelihood or impact of a risk.',ex:'Installing MFA reduces the risk of credential-based unauthorized access.'},
{d:4,m:7,t:'Risk Acceptance',df:'Knowingly choosing to accept a risk without additional mitigation.',ex:'Accepting the risk of a legacy printer that cannot be patched because replacement is too costly.'},
{d:4,m:7,t:'BIA',df:'Business Impact Analysis — identifies critical functions, disruption impact, sets RTO/RPO.',ex:'Payroll: critical function. RTO=4hr, RPO=1hr. If missed, staff cannot be paid.'},
{d:4,m:7,t:'ALE',df:'Annualized Loss Expectancy = SLE multiplied by ARO. Expected annual dollar loss from a risk.',ex:'$500K breach (SLE) times 0.2 occurrences per year (ARO) equals $100K ALE per year.'},
{d:4,m:7,t:'SLE',df:'Single Loss Expectancy — expected dollar loss from one occurrence of a risk.',ex:'Server worth $100K with 40% exposure factor equals SLE of $40K per incident.'},
{d:4,m:7,t:'ARO',df:'Annualized Rate of Occurrence — expected frequency of a risk event per year.',ex:'Breach once every 5 years equals ARO of 0.2 (1 divided by 5).'},
{d:4,m:8,t:'GDPR',df:'EU regulation protecting personal data of EU citizens. 72-hour breach notification. Global reach.',ex:'US company selling to EU customers must comply or face fines up to 4% of global revenue.'},
{d:4,m:8,t:'HIPAA',df:'US law protecting personal health information (PHI). Requires encryption and access controls.',ex:'Hospitals, insurers, and business associates must safeguard all PHI.'},
{d:4,m:8,t:'PCI DSS',df:'Payment Card Industry Data Security Standard — governs cardholder data protection.',ex:'Applies to any organization handling Visa, Mastercard, or Amex data regardless of size.'},
{d:4,m:8,t:'SOX',df:'Sarbanes-Oxley Act — accurate financial records and IT controls for public companies.',ex:'Access controls on financial systems, audit trails, and separation of duties are required.'},
{d:4,m:8,t:'NIST CSF',df:'NIST Cybersecurity Framework — Identify, Protect, Detect, Respond, Recover.',ex:'Most widely adopted US security framework. Voluntary but de facto standard.'},
{d:4,m:8,t:'ISO 27001',df:'International Information Security Management Systems standard. Organizations can be certified.',ex:'ISO 27001 certification proves security maturity to customers and auditors worldwide.'},
{d:4,m:8,t:'Bug Bounty',df:'Program compensating external researchers for finding and disclosing vulnerabilities responsibly.',ex:'Google, Microsoft, and Meta run programs on HackerOne and Bugcrowd.'},
{d:4,m:8,t:'Rules of Engagement',df:'Document defining scope, methods, timing, and communication for a penetration test.',ex:'Must be signed before any pen test begins. Legal protection for both parties.'},
{d:4,m:8,t:'SLA',df:'Service Level Agreement — contract defining service levels, uptime guarantees, and remedies.',ex:'Cloud SLA: 99.9% uptime guarantee. Breach means service credits are issued.'},
{d:4,m:8,t:'AUP',df:'Acceptable Use Policy — defines permitted and prohibited uses of organizational IT systems.',ex:'Systems may not be used for personal activities, torrenting, or adult content.'},
{d:4,m:0,t:'Change Management',df:'Formal process for requesting, reviewing, approving, and documenting IT system changes.',ex:'Emergency patches still require CAB approval, test plan, and rollback procedure.'},
{d:4,m:8,t:'Data Classification',df:'Labeling data by sensitivity to apply appropriate protection controls.',ex:'Public, Internal, Confidential (encryption required), Secret (encryption plus strict access).'},
{d:4,m:7,t:'Risk Register',df:'Document tracking risks, likelihood, impact, owner, and mitigation status.',ex:'Reviewed monthly by risk committee. Each risk has an owner and a target resolution date.'},
{d:4,m:7,t:'MTTR',df:'Mean Time To Repair — average time to restore a system after a failure.',ex:'MTTR = 2 hours means on average it takes 2 hours to fix each outage.'},
{d:4,m:7,t:'MTBF',df:'Mean Time Between Failures — average time between system failures.',ex:'MTBF = 10,000 hours means the device fails approximately once every 417 days.'},
// Cloud Security — module 7 of "My Path COMPTIA Sec+" (module 6 index) covers Cloud Security I & II,
// which had no dedicated flashcards until now.
{d:2,m:6,t:'Shared Responsibility Model',df:'Cloud provider secures the underlying infrastructure; the customer secures their data, access, and configuration.',ex:'AWS secures the data center — you still have to configure your S3 bucket permissions correctly.'},
{d:2,m:6,t:'IaaS',df:'Infrastructure as a Service — rents servers, storage, and networking. Customer manages the OS upward.',ex:'AWS EC2, Azure VMs — you install and patch the OS yourself.'},
{d:2,m:6,t:'PaaS',df:'Platform as a Service — provider manages the OS and runtime. Customer manages only app code and data.',ex:'Heroku, Azure App Service — you push code, the platform handles the server.'},
{d:2,m:6,t:'SaaS',df:'Software as a Service — fully managed application. Customer manages only their data and users.',ex:'Microsoft 365, Salesforce — nothing to patch or configure server-side.'},
{d:2,m:6,t:'CASB',df:'Cloud Access Security Broker — enforces security policy between users and cloud applications.',ex:'Blocks unsanctioned "shadow IT" cloud apps and enforces DLP on cloud file uploads.'},
{d:2,m:6,t:'Cloud Misconfiguration',df:'Incorrectly set cloud security settings — the single most common cause of cloud data breaches.',ex:'A publicly readable S3 bucket accidentally exposing customer records to the internet.'},
{d:2,m:6,t:'IaC',df:'Infrastructure as Code — define and manage infrastructure through versioned, auditable code templates.',ex:'Terraform or CloudFormation scripts that spin up the exact same environment every time.'},
{d:2,m:6,t:'Container',df:'Lightweight, portable app package that shares the host OS kernel instead of virtualizing full hardware.',ex:'A Docker container bundling an app plus its dependencies to run identically anywhere.'},
];

// Derived, not hand-maintained: for each of the 5 official exam domains, which of the 9 course
// modules its content now lives in (since flashcards moved to modules but Boss/Domain Exam/First
// Prep stayed on the 5 domains). Used to show a "this domain covers your modules X, Y, Z" bridge.
const DOMAIN_MODULES = DN.map((_, d) => {
  const s = new Set();
  CARDS.forEach(c => { if (c.d === d) s.add(c.m); });
  return [...s].sort((a, b) => a - b);
});

const ACRONYMS = [
{a:'MFA',f:'Multi-Factor Authentication',c:'Identity',d:'Requires two or more different factor types to verify identity.'},{a:'PKI',f:'Public Key Infrastructure',c:'Crypto',d:'Framework of certificates and keys used to manage digital trust.'},
{a:'TLS',f:'Transport Layer Security',c:'Network',d:'Encrypts and authenticates data sent between two systems.'},{a:'SIEM',f:'Security Information and Event Management',c:'Ops',d:'Centralizes and correlates logs to spot security incidents.'},
{a:'SOAR',f:'Security Orchestration Automation and Response',c:'Ops',d:'Automates incident response using predefined playbooks.'},{a:'EDR',f:'Endpoint Detection and Response',c:'Ops',d:'Monitors endpoints for threats and enables remote response.'},
{a:'DLP',f:'Data Loss Prevention',c:'Ops',d:'Stops sensitive data from leaving the organization improperly.'},{a:'FIM',f:'File Integrity Monitoring',c:'Ops',d:'Alerts when critical files are changed without authorization.'},
{a:'IDS',f:'Intrusion Detection System',c:'Network',d:'Passively monitors traffic and alerts on suspicious activity.'},{a:'IPS',f:'Intrusion Prevention System',c:'Network',d:'Sits inline and actively blocks malicious traffic in real time.'},
{a:'WAF',f:'Web Application Firewall',c:'Network',d:'Filters and blocks malicious HTTP/HTTPS traffic to web apps.'},{a:'NAC',f:'Network Access Control',c:'Network',d:'Verifies a device meets policy before allowing network access.'},
{a:'DMZ',f:'Demilitarized Zone',c:'Arch',d:'Isolated network segment hosting public-facing services.'},{a:'VPN',f:'Virtual Private Network',c:'Arch',d:'Creates an encrypted tunnel over a public network.'},
{a:'VLAN',f:'Virtual Local Area Network',c:'Arch',d:'Logically separates a physical network into isolated segments.'},{a:'RBAC',f:'Role-Based Access Control',c:'Identity',d:'Grants access based on a user\'s assigned job role.'},
{a:'MAC',f:'Mandatory Access Control',c:'Identity',d:'Enforces access using fixed security labels and clearance levels.'},{a:'DAC',f:'Discretionary Access Control',c:'Identity',d:'Lets the resource owner decide who gets access.'},
{a:'ABAC',f:'Attribute-Based Access Control',c:'Identity',d:'Grants access dynamically based on multiple attributes.'},{a:'SSO',f:'Single Sign-On',c:'Identity',d:'Lets a user log in once to access multiple systems.'},
{a:'SAML',f:'Security Assertions Markup Language',c:'Identity',d:'XML-based standard used to exchange identity data for SSO.'},{a:'MDM',f:'Mobile Device Management',c:'Ops',d:'Manages security settings on employee mobile devices.'},
{a:'PAM',f:'Privileged Access Management',c:'Identity',d:'Controls and monitors access for privileged accounts.'},{a:'UEBA',f:'User and Entity Behavior Analytics',c:'Ops',d:'Uses analytics to flag abnormal user or device behavior.'},
{a:'CIA',f:'Confidentiality Integrity Availability',c:'Core',d:'The three core goals that security controls aim to protect.'},{a:'AAA',f:'Authentication Authorization and Accounting',c:'Core',d:'Framework covering identity verification, permissions, and logging.'},
{a:'AES',f:'Advanced Encryption Standard',c:'Crypto',d:'Fast symmetric algorithm used to encrypt bulk data.'},{a:'RSA',f:'Rivest Shamir Adleman',c:'Crypto',d:'Asymmetric algorithm used for key exchange and signatures.'},
{a:'ECC',f:'Elliptic Curve Cryptography',c:'Crypto',d:'Asymmetric algorithm offering strong security with smaller keys.'},{a:'SHA',f:'Secure Hashing Algorithm',c:'Crypto',d:'Family of hash functions used to verify data integrity.'},
{a:'PFS',f:'Perfect Forward Secrecy',c:'Crypto',d:'Ensures each session key is unique and independently secure.'},{a:'CRL',f:'Certificate Revocation List',c:'Crypto',d:'List of certificates revoked before their expiration date.'},
{a:'OCSP',f:'Online Certificate Status Protocol',c:'Crypto',d:'Checks a certificate\'s validity in real time.'},{a:'RTO',f:'Recovery Time Objective',c:'Risk',d:'Maximum acceptable downtime before systems must be restored.'},
{a:'RPO',f:'Recovery Point Objective',c:'Risk',d:'Maximum acceptable data loss, measured in time.'},{a:'BIA',f:'Business Impact Analysis',c:'Risk',d:'Identifies critical business functions and their recovery needs.'},
{a:'ALE',f:'Annualized Loss Expectancy',c:'Risk',d:'Expected yearly financial loss from a given risk.'},{a:'SLE',f:'Single Loss Expectancy',c:'Risk',d:'Expected financial loss from a single risk event.'},
{a:'ARO',f:'Annualized Rate of Occurrence',c:'Risk',d:'How often a risk event is expected to occur per year.'},{a:'GDPR',f:'General Data Protection Regulation',c:'Compliance',d:'EU law governing protection of personal data.'},
{a:'HIPAA',f:'Health Insurance Portability and Accountability Act',c:'Compliance',d:'US law protecting health information privacy and security.'},{a:'SOX',f:'Sarbanes-Oxley Act',c:'Compliance',d:'US law requiring financial controls and audit trails.'},
{a:'SLA',f:'Service Level Agreement',c:'Governance',d:'Contract defining expected service uptime and remedies.'},{a:'AUP',f:'Acceptable Use Policy',c:'Governance',d:'Policy defining acceptable use of company IT resources.'},
{a:'NGFW',f:'Next-Generation Firewall',c:'Network',d:'Firewall with deep packet inspection and threat intelligence.'},{a:'SASE',f:'Secure Access Service Edge',c:'Arch',d:'Cloud-delivered bundle of networking and security services.'},
{a:'BEC',f:'Business Email Compromise',c:'Threats',d:'Impersonating an executive to trick staff into a wire transfer.'},{a:'XSS',f:'Cross-Site Scripting',c:'Threats',d:'Injecting malicious scripts that run in another user\'s browser.'},
{a:'SQLi',f:'SQL Injection',c:'Threats',d:'Injecting malicious SQL to manipulate a database.'},{a:'CSRF',f:'Cross-Site Request Forgery',c:'Threats',d:'Tricks a browser into making an unwanted authenticated request.'},
];

const TF = [
{q:'Hashing is a form of encryption that can be reversed with the right key.',a:false,e:'FALSE — Hashing is one-way and irreversible. Encryption can be decrypted. Hashing verifies integrity, not confidentiality.'},
{q:'An IPS actively blocks malicious traffic inline, while an IDS only generates alerts.',a:true,e:'TRUE — IPS is inline and drops malicious packets in real time. IDS is passive — alerts only, never blocks traffic.'},
{q:'WPA3 uses the same PSK 4-way handshake mechanism as WPA2.',a:false,e:'FALSE — WPA3 replaces PSK with SAE (Simultaneous Authentication of Equals), which is resistant to offline dictionary attacks and KRACK.'},
{q:'RPO defines how quickly a system must be restored after a failure.',a:false,e:'FALSE — RPO (Recovery POINT Objective) defines maximum acceptable DATA LOSS in time. RTO defines how quickly a system must be restored.'},
{q:'Defense in depth relies on one very strong single security control.',a:false,e:'FALSE — Defense in depth uses multiple overlapping layers so that failure of any single layer does not expose the organization.'},
{q:'GDPR applies only to companies physically located inside the European Union.',a:false,e:'FALSE — GDPR applies to any organization handling EU citizens personal data globally. The location of the company is irrelevant.'},
{q:'A compensating control is used when the primary control cannot be implemented.',a:true,e:'TRUE — Compensating controls provide alternative equivalent protection when the primary control is not feasible.'},
{q:'Salting passwords before hashing defeats rainbow table attacks.',a:true,e:'TRUE — Salt ensures identical passwords produce different hashes, making precomputed rainbow table lookups impossible.'},
{q:'Spear phishing and whaling are identical attacks that both target random large groups.',a:false,e:'FALSE — Spear phishing targets specific individuals. Whaling is a subset specifically targeting high-value executives like CEO and CFO.'},
{q:'Non-repudiation ensures a sender cannot deny having sent a specific message.',a:true,e:'TRUE — Digital signatures provide irrefutable proof that a specific entity performed an action, making denial impossible.'},
{q:'A cold site is the fastest disaster recovery option available.',a:false,e:'FALSE — Hot site is fastest (immediate to minutes). Cold site has no equipment and takes days. Cold equals cheapest and slowest.'},
{q:'ECC achieves equivalent security to RSA with much shorter key lengths.',a:true,e:'TRUE — 256-bit ECC provides similar security to 3072-bit RSA. Shorter keys mean faster operations and lower resource consumption.'},
{q:'The first phase of the incident response process is Detection.',a:false,e:'FALSE — First phase is Preparation. You prepare plans, train the team, and deploy tools before incidents occur. Detection comes second.'},
{q:'Symmetric encryption uses a public-private key pair for encryption and decryption.',a:false,e:'FALSE — Asymmetric encryption uses key pairs. Symmetric encryption uses ONE shared key for both encrypt and decrypt. AES is symmetric.'},
{q:'A logic bomb executes its malicious payload when a specific trigger condition is met.',a:true,e:'TRUE — Logic bombs remain dormant until triggered by a date, event, or user action — commonly planted by malicious insiders.'},
{q:'PCI DSS only applies to banks and traditional financial institutions.',a:false,e:'FALSE — PCI DSS applies to any organization storing, processing, or transmitting cardholder data including retailers and e-commerce sites.'},
{q:'A WAF operates at Layer 7 to filter HTTP and HTTPS application traffic.',a:true,e:'TRUE — WAF inspects request content at Layer 7 blocking SQLi, XSS, and CSRF. Traditional firewalls cannot detect Layer 7 attacks.'},
{q:'RBAC assigns permissions based on dynamic attributes like location and device type.',a:false,e:'FALSE — RBAC is based on job roles. ABAC uses dynamic attributes like location, time, and device type. Know the difference on the exam.'},
{q:'DNS cache poisoning injects false records to redirect users to malicious sites.',a:true,e:'TRUE — Users type correct URL but poisoned DNS cache sends them to attacker\'s site. DNSSEC prevents this attack.'},
{q:'A tabletop exercise involves actively attacking production systems to test defenses.',a:false,e:'FALSE — Tabletop is discussion-based. The team talks through a scenario. No live systems are involved or affected.'},
{q:'Tokenization replaces sensitive data with a non-sensitive token value.',a:true,e:'TRUE — Token substitutes sensitive data such as a credit card number. Original stored securely in a vault. Token is useless to attackers.'},
{q:'An AUP is a technical control enforced by software systems.',a:false,e:'FALSE — AUP is an administrative (managerial/policy) control. Technical controls use technology. AUP is a written policy document.'},
{q:'ALE equals Single Loss Expectancy multiplied by Annualized Rate of Occurrence.',a:true,e:'TRUE — ALE = SLE x ARO. This is the core risk quantification formula used to justify security investment decisions.'},
{q:'Supply chain attacks directly target an organization\'s network perimeter.',a:false,e:'FALSE — Supply chain attacks compromise trusted vendors, software, or hardware to reach the target indirectly, bypassing perimeter defenses.'},
{q:'MFA must combine factors from at least two different authentication categories.',a:true,e:'TRUE — Must use different categories: know (password), have (token), are (biometric). Two passwords equals one factor type, not MFA.'},
];

const FIB = [
{q:'The _____ triad stands for Confidentiality, Integrity, and Availability.',b:'CIA',o:['OSI','CIA','AAA','PKI']},
{q:'_____ ensures a user cannot deny having performed a specific action.',b:'Non-repudiation',o:['Encryption','Availability','Non-repudiation','Least privilege']},
{q:'Malware that encrypts files and demands payment for recovery is called _____.',b:'Ransomware',o:['Spyware','Rootkit','Ransomware','Worm']},
{q:'A social engineering attack specifically targeting executives like CEOs is called _____.',b:'Whaling',o:['Spear phishing','Phishing','Vishing','Whaling']},
{q:'Using credentials stolen from other breaches to log into different services is called _____.',b:'Credential stuffing',o:['Password spraying','Brute force','Credential stuffing','Replay attack']},
{q:'A network zone hosting public-facing servers isolated from internal systems is a _____.',b:'DMZ',o:['VLAN','VPN','Honeypot','DMZ']},
{q:'_____ evaluates device security posture before allowing network access.',b:'NAC',o:['WAF','VLAN','NAC','IDS']},
{q:'The maximum acceptable time to restore a system after failure is the _____.',b:'RTO',o:['RPO','BIA','MTTR','RTO']},
{q:'An inline device that actively blocks malicious traffic in real time is an _____.',b:'IPS',o:['IDS','SIEM','Firewall log','IPS']},
{q:'_____ aggregates security logs and generates real-time threat detection alerts.',b:'SIEM',o:['EDR','DLP','SIEM','NAC']},
{q:'The _____ phase is the FIRST phase of the incident response process.',b:'Preparation',o:['Detection','Containment','Preparation','Analysis']},
{q:'Documentation tracking evidence handling to ensure court admissibility is called _____.',b:'Chain of custody',o:['Forensic image','Chain of custody','Audit log','Incident report']},
{q:'The access control model using security labels and clearance levels is called _____.',b:'MAC',o:['RBAC','DAC','ABAC','MAC']},
{q:'Annual expected financial loss from a risk equals SLE multiplied by _____.',b:'ARO',o:['BIA','RTO','ARO','MTD']},
{q:'The EU regulation requiring 72-hour breach notification is called _____.',b:'GDPR',o:['HIPAA','PCI DSS','SOX','GDPR']},
{q:'A _____ program compensates external researchers for finding and reporting vulnerabilities.',b:'Bug bounty',o:['Red team','Pen test','Bug bounty','Tabletop']},
{q:'ECC provides equivalent security to RSA but with _____ key lengths.',b:'shorter',o:['longer','identical','shorter','doubled']},
{q:'Adding a random value to a password before hashing to defeat precomputed attacks is called _____.',b:'Salting',o:['Encryption','Salting','Tokenization','Key stretching']},
{q:'Injecting malicious scripts into web pages that run in other users browsers is called _____.',b:'XSS',o:['SQLi','CSRF','XSS','Buffer overflow']},
{q:'A backup DR site that enables immediate failover with real-time data replication is a _____ site.',b:'Hot',o:['Cold','Warm','Hot','Failover']},
];

const SPEED = [
{q:'Files encrypted on a workstation with a ransom note demanding payment. Malware type?',o:['Spyware','Ransomware','Rootkit','Worm'],a:1},
{q:'Which CIA component does hashing primarily protect?',o:['Confidentiality','Integrity','Availability','Non-repudiation'],a:1},
{q:'Thousands of users receive fake account locked emails. This is:',o:['Vishing','Smishing','Phishing','Whaling'],a:2},
{q:'Which control type STOPS a threat before it causes damage?',o:['Detective','Corrective','Compensating','Preventive'],a:3},
{q:'False DNS responses redirect users to a malicious site. This is called:',o:['ARP spoofing','DNS poisoning','IP spoofing','Typosquatting'],a:1},
{q:'Users should have only the minimum permissions needed for their job. This is called:',o:['Separation of duties','Non-repudiation','Least privilege','Defense in depth'],a:2},
{q:'An inline device that ACTIVELY BLOCKS malicious traffic in real time is an:',o:['IDS','SIEM','Firewall log','IPS'],a:3},
{q:'The maximum acceptable downtime after a system failure is the:',o:['RPO','BIA','RTO','MTBF'],a:2},
{q:'Which regulation requires 72-hour breach notification for EU citizens data?',o:['HIPAA','PCI DSS','SOX','GDPR'],a:3},
{q:'The public-facing server zone isolated from the internal network is the:',o:['VLAN','VPN','DMZ','Honeynet'],a:2},
{q:'Whaling specifically targets:',o:['All employees equally','IT staff only','Senior executives such as CEO and CFO','Finance department'],a:2},
{q:'Injecting malicious scripts into a web page that run in other users browsers is called:',o:['SQL injection','XSS','CSRF','Directory traversal'],a:1},
{q:'AES-256 is an example of which type of encryption?',o:['Asymmetric','Hashing','Symmetric','Elliptic curve'],a:2},
{q:'The access control model using security labels and clearance levels is called:',o:['DAC','RBAC','ABAC','MAC'],a:3},
{q:'A discussion-based IR drill with no live systems involved is called a:',o:['Red team exercise','Penetration test','Tabletop exercise','Failover test'],a:2},
{q:'Malware that hides at the kernel level and conceals itself from OS tools is a:',o:['Ransomware','Trojan','Rootkit','Keylogger'],a:2},
{q:'The very first step when seizing a device for forensic investigation is:',o:['Run antivirus','Create forensic image','Analyze logs','Establish chain of custody'],a:3},
{q:'ECC achieves the same security level as RSA but with:',o:['Longer key lengths','Shorter key lengths','Same key lengths','No key management required'],a:1},
{q:'The NIST CSF uses which 5 functions in order?',o:['Plan-Do-Check-Act','Identify-Protect-Detect-Respond-Recover','Prepare-Detect-Contain-Eradicate-Recover','Assess-Design-Implement-Test-Monitor'],a:1},
{q:'A login banner warning that the system is monitored is which type of control?',o:['Preventive','Detective','Compensating','Deterrent'],a:3},
{q:'Trying the same common password against 50,000 accounts to avoid lockout is called:',o:['Brute force','Credential stuffing','Password spraying','Dictionary attack'],a:2},
{q:'Which tool uses ML to detect anomalous user behavior patterns?',o:['SIEM','IDS','UEBA','DLP'],a:2},
{q:'Which platform automates incident response workflows end to end?',o:['SIEM','SOAR','EDR','NAC'],a:1},
{q:'The maximum acceptable data loss measured in time is the:',o:['RTO','MTTR','BIA','RPO'],a:3},
{q:'An employee following a colleague through a badge door without scanning their own badge is called:',o:['Shoulder surfing','Tailgating','Pretexting','Impersonation'],a:1},
{q:'A DR site with immediate failover and real-time data replication is a:',o:['Cold site','Warm site','Hot site','Cloud site'],a:2},
{q:'ALE is calculated as SLE multiplied by:',o:['BIA','ARO','RTO','MTD'],a:1},
{q:'The FIRST phase of incident response is:',o:['Detection','Containment','Preparation','Analysis'],a:2},
{q:'Which framework specifically governs payment card data protection?',o:['HIPAA','GDPR','PCI DSS','SOX'],a:2},
{q:'Which protocol secures email with encryption and digital signatures?',o:['SMTP','IMAP','S/MIME','POP3'],a:2},
];

// MATCHES — one round per "My Path COMPTIA Sec+" module (index 0-8), plus a 10th
// mixed "Revision" round (index 9) that pulls terms across every module for true recall.
const MATCHES = [
// 0. Introduction to CyberSecurity
[{t:'CIA',d:'Confidentiality Integrity Availability'},{t:'Non-repudiation',d:'Cannot deny performing an action'},{t:'Zero Trust',d:'Never trust, always verify'},{t:'Least Privilege',d:'Minimum access for job function'},{t:'Defense in Depth',d:'Multiple overlapping security layers'},{t:'AAA',d:'Authentication Authorization and Accounting'}],
// 1. Networking
[{t:'DMZ',d:'Zone isolating public-facing servers'},{t:'VPN',d:'Encrypted tunnel over the internet'},{t:'VLAN',d:'Logical segment via switch config'},{t:'WPA3',d:'Current Wi-Fi security standard'},{t:'Jump Server',d:'Hardened single access point'},{t:'Air Gap',d:'Physical isolation, zero connectivity'}],
// 2. Active Defense
[{t:'Firewall',d:'Rules control which traffic is allowed'},{t:'IPS',d:'Inline device blocking threats'},{t:'WAF',d:'Filters HTTP application traffic'},{t:'NGFW',d:'Layer 7 deep packet inspection'},{t:'SIEM',d:'Correlates logs generates alerts'},{t:'SOAR',d:'Automates incident response workflows'}],
// 3. Attacks, Threats & Vulnerabilities
[{t:'Ransomware',d:'Encrypts files demands payment'},{t:'Whaling',d:'Phishing targeting executives'},{t:'Zero-Day',d:'Exploit with no vendor patch yet'},{t:'Supply Chain',d:'Attack via trusted vendor or update'},{t:'SQLi',d:'Malicious DB query manipulation'},{t:'Credential Stuffing',d:'Reusing breached username/password pairs'}],
// 4. Architecture & Design II
[{t:'RTO',d:'Max time to restore the system'},{t:'RPO',d:'Max acceptable data loss in time'},{t:'Hot Site',d:'Immediate failover real-time replication'},{t:'MFA',d:'Two or more authentication factor types'},{t:'SSO',d:'One login, many applications'},{t:'OAuth 2.0',d:'Delegated access without sharing password'}],
// 5. Cryptography & Secure Solutions
[{t:'PKI',d:'Framework managing digital certificates'},{t:'Salting',d:'Random value added before hashing'},{t:'PFS',d:'Unique session keys per connection'},{t:'Tokenization',d:'Replace sensitive data with placeholder'},{t:'Hashing',d:'One-way integrity fingerprint'},{t:'ECC',d:'Strong security, shorter key length'}],
// 6. Secure Solution Implementation II
[{t:'TPM',d:'Hardware chip storing device keys'},{t:'HSM',d:'Dedicated hardware protecting crypto keys'},{t:'EDR',d:'Endpoint monitoring and remote response'},{t:'MDM',d:'Enforces security policy on mobiles'},{t:'CASB',d:'Enforces policy between users and cloud apps'},{t:'Shared Responsibility',d:'Provider secures infra, you secure config'}],
// 7. Operations, Governance & Risk
[{t:'RBAC',d:'Access rights based on job role'},{t:'Chain of Custody',d:'Evidence handling documentation'},{t:'UEBA',d:'ML behavioral anomaly detection'},{t:'PAM',d:'Privileged account control and recording'},{t:'ALE',d:'SLE times ARO, expected annual loss'},{t:'BIA',d:'Identifies critical functions, sets RTO/RPO'}],
// 8. Governance, Compliance & Audits
[{t:'GDPR',d:'EU data law, 72hr breach notification'},{t:'PCI DSS',d:'Payment card data security standard'},{t:'AUP',d:'Defines permitted IT resource use'},{t:'Rules of Engagement',d:'Scope signed before a pen test'},{t:'Bug Bounty',d:'Pays researchers for reported flaws'},{t:'NIST CSF',d:'Identify Protect Detect Respond Recover'}],
// 9. Revision — Mixed Review (one term pulled from across several modules)
[{t:'Honeypot',d:'Decoy system that attracts attackers'},{t:'NAC',d:'Checks device health before network access'},{t:'IDS',d:'Passive alerts — does NOT block traffic'},{t:'Typosquatting',d:'Look-alike domain, misspelling trick'},{t:'Warm Site',d:'Hours to activate, some equipment ready'},{t:'Risk Register',d:'Tracks risks, likelihood, impact, owner'}],
];

const BOSSES = [
{n:'General Security Goblin',ic:'👺',dm:'General Security',qs:[
{q:'Which CIA component does encryption of data at rest primarily protect?',o:['Integrity','Availability','Confidentiality','Non-repudiation'],a:2},
{q:'A compensating control is best described as:',o:['An extra detection layer','An alternative when the primary control cannot be implemented','A control that corrects damage after incident','A deterrent control'],a:1},
{q:'Zero Trust architecture requires:',o:['Trusting all internal users','Continuous verification of every access request','Only external users need verification','Perimeter firewalls are sufficient'],a:1},
{q:'Which type of encryption uses a mathematically linked public-private key pair?',o:['Symmetric','Hashing','Asymmetric','Salting'],a:2},
{q:'Defense in depth means:',o:['One very powerful firewall','Multiple overlapping security layers','Full-disk encryption everywhere','Perimeter security only'],a:1},
{q:'Non-repudiation is provided by:',o:['Encryption alone','Firewall rules','Digital signatures and audit logs','Access control lists'],a:2},
]},
{n:'Threat Vector Vampire',ic:'🧛',dm:'Threats and Vulnerabilities',qs:[
{q:'A phone caller impersonating IT support to get your password is called:',o:['Phishing','Vishing','Smishing','Pretexting'],a:1},
{q:'Which malware self-replicates across networks WITHOUT any user interaction?',o:['Trojan','Ransomware','Worm','Keylogger'],a:2},
{q:'A phishing email customized for a specific named individual is called:',o:['Whaling','Spear phishing','Vishing','BEC'],a:1},
{q:'Trying the same common password against 50,000 accounts to avoid lockout is called:',o:['Brute force','Credential stuffing','Password spraying','Dictionary attack'],a:2},
{q:'Sending fake ARP replies to redirect traffic through the attacker is called:',o:['DNS poisoning','ARP spoofing','IP spoofing','MAC flooding'],a:1},
{q:'A supply chain attack compromises:',o:['Target network perimeter directly','A trusted vendor software or hardware provider','User credentials via phishing','The DNS infrastructure'],a:1},
{q:'An attacker registers "arnazon.com" hoping employees mistype the real domain and land on a phishing clone. This technique is called:',o:['Pretexting','Watering hole','Typosquatting','Whaling'],a:2},
]},
{n:'Architecture Alien',ic:'👽',dm:'Security Architecture',qs:[
{q:'The network zone hosting public web servers isolated from internal systems is the:',o:['VLAN','VPN','DMZ','NAC zone'],a:2},
{q:'Which device blocks threats INLINE rather than just generating alerts?',o:['IDS','Syslog server','SIEM','IPS'],a:3},
{q:'RTO stands for:',o:['Risk Transfer Option','Recovery Time Objective','Restore Time Override','Risk Tolerance Output'],a:1},
{q:'A fully operational duplicate facility with immediate failover capability is a:',o:['Cold site','Warm site','Hot site','Colocation facility'],a:2},
{q:'WPA3 replaces WPA2\'s vulnerable PSK handshake with:',o:['OWE','TKIP','SAE','EAP-TLS'],a:2},
{q:'The technology that evaluates device health before allowing network access is called:',o:['VLAN','Stateful Firewall','NAC','IDS'],a:2},
]},
{n:'Operations Ogre',ic:'👹',dm:'Security Operations',qs:[
{q:'The ML-based tool that detects anomalous user behavior patterns is called:',o:['SIEM','IDS','UEBA','DLP'],a:2},
{q:'The FIRST phase of the incident response process is:',o:['Detection','Containment','Preparation','Analysis'],a:2},
{q:'The platform that automates incident response workflows end to end is called:',o:['SIEM','SOAR','EDR','NAC'],a:1},
{q:'Mandatory Access Control bases its decisions on:',o:['User-defined file permissions','Job role assignments','Security labels and clearance levels','Dynamic attribute combinations'],a:2},
{q:'A bit-for-bit exact copy of a drive used for forensic analysis is called a:',o:['Full system backup','Forensic image','Volume snapshot','RAID mirror'],a:1},
{q:'PAM (Privileged Access Management) primarily provides:',o:['Shared permanent admin accounts','Just-in-time access with session recording','Automatic password reuse','Removing all admin privileges'],a:1},
{q:'A company requires privileged accounts to check out temporary, time-limited credentials that are automatically revoked after use. This is an example of:',o:['RBAC','SSO','Privileged Access Management','Federation'],a:2},
{q:'Which tool would best detect that a critical configuration file was modified outside of an approved change window?',o:['DLP','FIM','UEBA','EDR'],a:1},
]},
{n:'Compliance Dragon',ic:'🐉',dm:'Governance Risk and Compliance',qs:[
{q:'ALE is calculated as:',o:['SLE plus ARO','SLE multiplied by ARO','ARO divided by SLE','SLE minus ARO'],a:1},
{q:'Which regulation requires breach notification to authorities within 72 hours?',o:['HIPAA','PCI DSS','SOX','GDPR'],a:3},
{q:'Purchasing cyber insurance to cover breach costs represents risk:',o:['Avoidance','Mitigation','Transfer','Acceptance'],a:2},
{q:'The NIST CSF uses which 5 functions in order?',o:['Plan-Do-Check-Act','Identify-Protect-Detect-Respond-Recover','SOX compliance steps','ISO 27001 domains'],a:1},
{q:'Rules of engagement must be agreed and signed before starting a:',o:['Tabletop exercise','Vulnerability scan','Penetration test','Risk assessment'],a:2},
{q:'A BIA (Business Impact Analysis) primarily identifies:',o:['Network vulnerabilities and CVEs','Critical business functions and their RTO and RPO','Employee phishing susceptibility','Compliance audit gaps'],a:1},
]},
];

const PORTS = [
{p:'22',o:['FTP','SSH and SFTP','Telnet','SMTP'],a:1,e:'Port 22 = SSH and SFTP. Used for encrypted remote access and secure file transfers. Replaces insecure Telnet on port 23.'},
{p:'23',o:['SSH','FTP','Telnet','RDP'],a:2,e:'Port 23 = Telnet. INSECURE remote administration — transmits everything including passwords in plaintext. Always replace with SSH on port 22.'},
{p:'25',o:['SMTP','POP3','IMAP','HTTP'],a:0,e:'Port 25 = SMTP. Used for sending email between mail servers. Port 587 is used for secure email submission with STARTTLS.'},
{p:'53',o:['HTTPS','DNS','LDAP','Kerberos'],a:1,e:'Port 53 = DNS. Resolves domain names to IP addresses. Uses UDP for queries, TCP for zone transfers. DNS poisoning attacks target this port.'},
{p:'80',o:['HTTPS','FTP','HTTP','Telnet'],a:2,e:'Port 80 = HTTP. Unencrypted web traffic. Attackers can intercept all data on port 80. Always use HTTPS on port 443 for sensitive communications.'},
{p:'110',o:['SMTP','POP3','IMAP','SNMP'],a:1,e:'Port 110 = POP3. Downloads email from server to client and typically deletes from server. Encrypted version is POP3S on port 995.'},
{p:'143',o:['SMTP','POP3','IMAP','HTTP'],a:2,e:'Port 143 = IMAP. Keeps email on server for multi-device access. Encrypted version is IMAPS on port 993.'},
{p:'389',o:['LDAP','LDAPS','Kerberos','RADIUS'],a:0,e:'Port 389 = LDAP. Unencrypted directory queries to Active Directory. Port 636 is LDAPS (encrypted). Always prefer 636 over 389.'},
{p:'443',o:['HTTP','FTP','HTTPS','SSH'],a:2,e:'Port 443 = HTTPS. HTTP encrypted with TLS. Standard for all secure web traffic. The browser padlock confirms HTTPS is active.'},
{p:'445',o:['NetBIOS','SMB','LDAP','RDP'],a:1,e:'Port 445 = SMB (Server Message Block). Windows file and printer sharing. WannaCry ransomware exploited EternalBlue vulnerability in SMB.'},
{p:'514',o:['Syslog','SNMP','NTP','LDAP'],a:0,e:'Port 514 = Syslog. Centralized logging protocol. UDP 514 for standard syslog, TCP 6514 for TLS-encrypted syslog. Used by SIEM systems.'},
{p:'636',o:['LDAP','LDAPS','Kerberos','RADIUS'],a:1,e:'Port 636 = LDAPS (LDAP over SSL/TLS). Always use 636 instead of 389 to encrypt directory queries to Active Directory.'},
{p:'993',o:['SMTP','POP3S','IMAPS','HTTPS'],a:2,e:'Port 993 = IMAPS (IMAP over SSL/TLS). Encrypted version of IMAP on port 143. Always prefer 993 over 143 for secure email access.'},
{p:'995',o:['SMTP','POP3S','IMAPS','SMTPS'],a:1,e:'Port 995 = POP3S (POP3 over SSL/TLS). Encrypted version of POP3 on port 110. Use instead of port 110 for secure email retrieval.'},
{p:'1433',o:['Oracle','MySQL','MSSQL','PostgreSQL'],a:2,e:'Port 1433 = Microsoft SQL Server. Common attack target. Should NEVER be exposed directly to the internet. Always firewall this port.'},
{p:'3306',o:['MSSQL','Oracle','MySQL','PostgreSQL'],a:2,e:'Port 3306 = MySQL and MariaDB. Most popular open-source database. Should be firewalled from external access.'},
{p:'3389',o:['SSH','VNC','Telnet','RDP'],a:3,e:'Port 3389 = RDP (Remote Desktop Protocol). Windows remote access. Extremely frequent attack target — should always be behind a VPN or jump server.'},
{p:'161',o:['SNMP','Syslog','NTP','LDAP'],a:0,e:'Port 161 = SNMP. Monitors and manages network devices. UDP 161 for queries, 162 for traps. SNMPv3 provides encryption and authentication.'},
{p:'587',o:['SMTP','SMTP Submission STARTTLS','IMAPS','POP3S'],a:1,e:'Port 587 = SMTP Submission with STARTTLS. Modern email clients use port 587 to securely send email. Port 25 is for server-to-server relay.'},
{p:'8080',o:['HTTPS','HTTP alternate and proxy','FTP','SMTP'],a:1,e:'Port 8080 = HTTP alternate port. Used for web proxy servers, development servers, and internal applications. Not encrypted by default.'},
];

const NOTES = [
{tab:'🧭 Intro', title:'Module 1: Introduction to CyberSecurity', sects:[
{h:'CIA Triad',rows:[['Confidentiality','Only authorized users can access data. Controls: encryption, access controls, classification.'],['Integrity','Data is accurate and unaltered. Controls: hashing (SHA-256), digital signatures, FIM.'],['Availability','Systems accessible when needed. Controls: redundancy, load balancing, DDoS protection, backups.'],['Non-repudiation','Cannot deny performing an action. Achieved via: digital signatures plus comprehensive audit logs.']]},
{h:'Control Types',rows:[['Preventive','Stops threats BEFORE damage. Examples: firewall, MFA, encryption, input validation.'],['Detective','Identifies events AFTER or DURING. Examples: IDS, SIEM, audit logs, cameras, FIM.'],['Corrective','Restores systems AFTER incident. Examples: restoring backups, patching after breach.'],['Deterrent','Discourages threats without blocking. Examples: login banners, guards, warning signs.'],['Compensating','Alternative when primary cannot be used. Example: isolating unpatched legacy system on VLAN.']]},
{h:'Fundamentals & Change Management',rows:[['Zero Trust','Continuous verification of every user, device, and connection. No implicit trust anywhere.'],['Least Privilege','Users get only the minimum access their job requires.'],['Defense in Depth','Multiple overlapping layers — one failure does not expose everything.'],['AAA','Authentication (verify identity) + Authorization (grant access) + Accounting (log activity).'],['Change Management','Formal request/review/approve/document process. Even emergency patches need a rollback plan.']]}
]},
{tab:'🌐 Networking', title:'Module 2: Networking', sects:[
{h:'Network Zones & Segmentation',rows:[['DMZ','Buffer zone hosting public-facing servers. Isolated from internal network by firewalls.'],['Network Segmentation','Dividing a network into zones — limits lateral movement, contains breaches.'],['Micro-Segmentation','Workload-level segmentation — each service only talks to what it explicitly needs.'],['VLAN','Logical segmentation via switch configuration. Inter-VLAN traffic must go through firewall.'],['NAC','Checks device health (patches, AV) before granting network access.'],['Jump Server','Hardened bastion host. Single access point to secure internal systems.'],['Air Gap','Complete physical isolation. Zero network connectivity. Cannot be hacked remotely.']]},
{h:'Secure Network Design',rows:[['VPN','Encrypted tunnel over the public internet — protects data in transit.'],['TLS','Encrypted, authenticated communication. HTTPS = HTTP + TLS.'],['IPSec','Encrypts/authenticates IP packets at Layer 3. Used in site-to-site VPNs.'],['WPA3','Current Wi-Fi standard. SAE replaces WPA2 PSK handshake, resisting offline attacks.'],['Proxy Server','Intermediary that filters, caches, and logs web traffic.'],['Load Balancer','Distributes traffic across servers for availability and performance.'],['SD-WAN','Centralizes WAN management, intelligently routes branch traffic.'],['SASE','Cloud-delivered networking + security as one service (SD-WAN + SWG + CASB + ZTNA).']]},
{h:'Port Numbers — Must Know for Exam',rows:[['22','SSH and SFTP — secure remote access and file transfer'],['23','Telnet — INSECURE, always replace with SSH'],['25','SMTP — email sending between servers'],['53','DNS — domain name resolution'],['80','HTTP — unencrypted web traffic'],['110','POP3 — download email from server (plain)'],['143','IMAP — access email on server (plain)'],['389','LDAP — directory queries (plain, unencrypted)'],['443','HTTPS — encrypted web traffic (TLS)'],['445','SMB — Windows file sharing'],['587','SMTP Submission with STARTTLS'],['636','LDAPS — encrypted LDAP'],['993','IMAPS — encrypted IMAP'],['995','POP3S — encrypted POP3'],['1433','MSSQL — Microsoft SQL Server database'],['3306','MySQL — open-source database'],['3389','RDP — Windows remote desktop (frequent attack target)'],['161','SNMP — network device monitoring and management'],['8080','HTTP alternate or proxy port']]}
]},
{tab:'🛡️ Active Defense', title:'Module 3: Active Defense', sects:[
{h:'Firewall & Traffic Filtering',rows:[['Firewall','Controls traffic by rule — blocks unauthorized while permitting legitimate traffic.'],['NGFW','Next-Gen Firewall — Layer 7 deep packet inspection plus threat intelligence.'],['WAF','Layer 7 HTTP/S filtering. Blocks SQLi, XSS, CSRF. Placed in front of web servers.']]},
{h:'IDS vs IPS — Classic Exam Trap',rows:[['IDS','Passive. Monitors and ALERTS only. Does NOT block traffic.'],['IPS','Inline. Actively DROPS malicious packets in real time.']]},
{h:'Detection & Response Platforms',rows:[['SIEM','Aggregates and correlates logs. Real-time alerting. Central security visibility across all systems.'],['SOAR','Automates IR workflows. Reduces manual effort. Playbook-driven automated responses.']]}
]},
{tab:'⚠️ Threats', title:'Module 4: Attacks, Threats & Vulnerabilities', sects:[
{h:'Malware Types — Know These Cold',rows:[['Ransomware','Encrypts files, demands payment. BEST defense: offline air-gapped backups.'],['Rootkit','Kernel-level hiding. Nearly invisible to OS tools. Requires memory forensics to find.'],['Trojan','Disguised as legit software. Does NOT self-replicate. Requires user to run it.'],['Worm','Self-replicates across network. No user interaction needed. WannaCry is the key example.'],['Keylogger','Records all keystrokes. Sends passwords to attacker. Installed via phishing.'],['Logic Bomb','Dormant until trigger condition is met. Common insider threat tool.'],['Spyware','Monitors user secretly. Tracks browsing, captures screenshots.']]},
{h:'Social Engineering Attacks',rows:[['Phishing','Mass deceptive emails to random targets. Generic greetings, urgent language.'],['Spear Phishing','Targeted at a specific named individual. Uses personal details to appear legitimate.'],['Whaling','Spear phishing targeting executives (CEO, CFO). High-value targets specifically.'],['Vishing','Voice or phone calls. Impersonating IT support, banks, or government agencies.'],['Smishing','SMS text message phishing. Malicious links in text messages.'],['BEC','Business Email Compromise. Impersonating executives to authorize fraudulent wire transfers.'],['Pretexting','Creating a fake scenario to manipulate a target. Claiming to be a new employee.'],['Watering Hole','Compromise websites the target group visits. Infects victims passively when they browse.'],['Tailgating','Physically follow authorized person through badge door. No credentials needed.']]},
{h:'Application, Network & Credential Attacks',rows:[['SQL Injection','Inject SQL into inputs to manipulate DB. Prevent with parameterized queries.'],['XSS','Inject scripts running in other users browsers. Prevent with input validation plus CSP headers.'],['Buffer Overflow','Write beyond buffer to execute code. Prevent with input validation plus ASLR.'],['Directory Traversal','Use ../ to access files outside web root. Sanitize and validate all file path inputs.'],['CSRF','Tricks browser into unauthorized requests. Prevent with anti-CSRF tokens in all forms.'],['Zero-Day','Vulnerability with no vendor patch available yet. Defenders have zero days to prepare.'],['Supply Chain Attack','Compromises a trusted vendor, update, or component to reach downstream targets.'],['Password Spraying','Tries one common password against MANY accounts to avoid lockout.'],['Credential Stuffing','Reuses leaked username/password pairs from other breaches.'],['ARP/DNS Spoofing','Fakes ARP replies or DNS records to redirect traffic through the attacker.']]}
]},
{tab:'🏛️ Arch & Design II', title:'Module 5: Architecture & Design II', sects:[
{h:'Disaster Recovery — MEMORIZE RTO vs RPO',rows:[['Hot Site','Immediate failover, real-time replication. MOST expensive. Minutes to switch over.'],['Warm Site','Activated in hours. Some equipment pre-installed. Moderate cost.'],['Cold Site','Activated in days. No equipment at all. CHEAPEST option.'],['RTO','Recovery TIME Objective equals max acceptable DOWNTIME after failure.'],['RPO','Recovery POINT Objective equals max acceptable DATA LOSS measured in time.'],['MTTR','Mean Time To REPAIR equals average time to restore after a failure.'],['MTBF','Mean Time BETWEEN Failures equals average time between failures.']]},
{h:'Authentication Factors',rows:[['Something you KNOW','Password, PIN, security question.'],['Something you HAVE','Token, smart card, phone (TOTP app), hardware key (YubiKey).'],['Something you ARE','Fingerprint, retina scan, facial recognition, voice recognition.'],['Somewhere you ARE','Geolocation, GPS coordinates, IP address restrictions, geofencing.']]},
{h:'Authentication & Access Technologies',rows:[['MFA','Two or more factors from DIFFERENT categories. Two passwords is NOT MFA.'],['SSO','Authenticate once, access multiple apps without re-authenticating.'],['SAML','XML standard for federated identity and SSO (e.g. AD credentials into Salesforce).'],['OAuth 2.0','Authorization framework — apps act on your behalf without seeing your password.']]}
]},
{tab:'🔐 Cryptography', title:'Module 6: Cryptography & Secure Solutions', sects:[
{h:'Cryptography Key Facts',rows:[['Symmetric','One shared key. Fast. AES-256. Use for bulk data encryption.'],['Asymmetric','Public-private key pair. RSA, ECC. Use for key exchange and digital signatures.'],['Hashing','One-way only. SHA-256. Integrity verification. NOT encryption and NOT reversible.'],['Salting','Random value added to password before hashing. Defeats rainbow table lookups.'],['ECC vs RSA','256-bit ECC equals approximately 3072-bit RSA security. ECC is faster and more efficient.'],['PFS','Unique session keys per session. Past sessions safe even if current key is compromised.'],['Tokenization','Replace sensitive data with token. Original in secure vault. Token is useless to attackers.']]},
{h:'PKI & Certificates',rows:[['PKI','Framework managing digital certificates and key pairs — powers HTTPS, VPN, code signing.'],['Certificate Authority','Trusted third party that issues and signs digital certificates.'],['CRL','Certificate Revocation List — certificates revoked before expiry.'],['OCSP','Real-time certificate validity check — faster than downloading a full CRL.'],['Digital Signature','Sign with private key, verify with public key. Gives integrity plus non-repudiation.'],['Steganography','Hides data inside another file (image, audio) without obvious detection.']]}
]},
{tab:'📱 Secure Solutions II', title:'Module 7: Secure Solution Implementation II', sects:[
{h:'Endpoint, Mobile & Hardware Security',rows:[['TPM','Trusted Platform Module — hardware chip storing crypto keys on-device (e.g. BitLocker).'],['HSM','Hardware Security Module — dedicated hardware for crypto ops; keys never leave the device.'],['EDR','Endpoint Detection & Response — monitors endpoints, detects threats, enables remote isolation.'],['MDM','Mobile Device Management — enforces PIN, encryption, remote wipe on corporate mobiles.']]},
{h:'Cloud Security',rows:[['Shared Responsibility','Provider secures the infrastructure; YOU still secure data, access, and configuration.'],['IaaS / PaaS / SaaS','More provider control as you move IaaS → PaaS → SaaS; less for you to patch, but less control too.'],['CASB','Cloud Access Security Broker — enforces policy between your users and cloud apps.'],['Cloud Misconfiguration','The single most common cause of cloud breaches — e.g. a publicly exposed storage bucket.'],['IaC','Infrastructure as Code — versioned, auditable templates instead of manual server setup.']]}
]},
{tab:'⚙️ Ops & Risk', title:'Module 8: Operations, Governance & Risk', sects:[
{h:'Incident Response Phases — IN ORDER',rows:[['1. Preparation','Plans, tools, training BEFORE incidents occur. This is the FIRST phase.'],['2. Detection','Identify that an incident has actually occurred.'],['3. Analysis','Determine scope, impact, and root cause of the incident.'],['4. Containment','STOP THE SPREAD. Isolate affected systems FIRST before anything else.'],['5. Eradication','Remove the threat completely from all affected systems.'],['6. Recovery','Restore systems to normal production operation.'],['7. Lessons Learned','Document, update plans, implement improvements. The FINAL phase.']]},
{h:'Digital Forensics & Monitoring',rows:[['Chain of Custody','Documentation of who handled evidence and when — ensures court admissibility.'],['Forensic Image','Bit-for-bit exact copy of storage media, hashed to prove integrity.'],['Volatility','Memory forensics framework — finds fileless malware living only in RAM.'],['Tabletop Exercise','Discussion-based IR drill. No live systems touched.'],['DLP','Prevents unauthorized data transmission via email, USB drives, and cloud uploads.'],['UEBA','ML-based behavioral analytics. Detects insider threats and compromised user accounts.'],['FIM','Detects unauthorized file modifications. Critical for detecting attacker persistence.']]},
{h:'Access & Account Management',rows:[['RBAC','Role-Based: permissions tied to job roles. Most common in enterprise environments.'],['MAC','Mandatory: security labels plus clearance levels. Used in classified government systems.'],['DAC','Discretionary: resource owner controls access. Most flexible, least secure model.'],['ABAC','Attribute-Based: user, resource, and environment attributes. Most granular and dynamic.'],['PAM','Privileged account control. Just-in-time access. All sessions recorded for audit.']]},
{h:'Risk Formulas — Must Know',rows:[['ALE','Annualized Loss Expectancy = SLE multiplied by ARO'],['SLE','Single Loss Expectancy = Asset Value multiplied by Exposure Factor'],['ARO','Annualized Rate of Occurrence = 1 divided by years between events'],['Example','$500K breach (SLE) times 0.2 ARO equals $100K ALE per year']]},
{h:'Risk Management Strategies & Terms',rows:[['Avoidance','Stop doing the risky activity entirely. Eliminates the risk completely.'],['Mitigation','Implement controls to reduce likelihood or impact of risk.'],['Transfer','Buy insurance or outsource. Shifts the financial burden to a third party.'],['Acceptance','Knowingly accept the risk. Must document the decision formally.'],['Risk Appetite','How much risk the organization is WILLING to accept in pursuing its business goals.'],['Risk Tolerance','Acceptable DEVIATION from the risk appetite — threshold where risk becomes unacceptable.'],['BIA','Business Impact Analysis. Identifies critical functions plus establishes RTO and RPO for each.'],['Risk Register','Tracks all identified risks, likelihood, impact, owners, and current mitigation status.']]}
]},
{tab:'📋 Compliance', title:'Module 9: Governance, Compliance & Audits', sects:[
{h:'Compliance Frameworks',rows:[['GDPR','EU citizens data. 72-hour breach notification to authorities. GLOBAL reach regardless of company location.'],['HIPAA','US personal health information (PHI). Encryption is required. Applies to covered entities and business associates.'],['PCI DSS','Payment card data. ANY org handling Visa, Mastercard, or Amex data regardless of company size.'],['SOX','Financial records for public companies. IT controls and audit trails required.'],['NIST CSF','Identify, Protect, Detect, Respond, Recover. Voluntary US framework widely adopted.'],['ISO 27001','International ISMS standard. Organizations can achieve formal certification.']]},
{h:'Policies & Agreements',rows:[['AUP','Acceptable Use Policy. Administrative control defining permitted IT resource use by employees.'],['SLA','Service Level Agreement. Uptime guarantees and remedies with a vendor or service provider.'],['Data Classification','Labeling data by sensitivity (Public/Internal/Confidential/Secret) to apply the right controls.']]},
{h:'Audits & Penetration Testing',rows:[['Penetration Testing','Authorized simulated attack that EXPLOITS weaknesses to show real impact.'],['Vulnerability Scan','Automated identification of weaknesses. Does NOT exploit them.'],['Rules of Engagement','Scope and permitted methods agreed and signed before any penetration test begins.'],['Bug Bounty','Program paying external researchers for responsibly disclosed vulnerabilities.']]}
]},
{tab:'🔁 Revision', title:'Module 10: Revision — Mixed Review', sects:[
{h:'Top Exam Mix-Ups',rows:[['IDS vs IPS','IDS = passive alert only. IPS = inline, actively blocks.'],['RTO vs RPO','RTO = max DOWNTIME. RPO = max DATA LOSS (in time).'],['Symmetric vs Asymmetric','Symmetric = one shared key, fast. Asymmetric = key pair, used for exchange/signing.'],['MAC vs DAC vs RBAC vs ABAC','Labels+clearance vs owner discretion vs job role vs dynamic attributes.'],['Risk Mitigation vs Transfer vs Avoidance vs Acceptance','Reduce it vs insure it vs stop the activity vs knowingly keep it.'],['Vulnerability Scan vs Pen Test','Scan finds weaknesses. Pen test actually exploits them.']]},
{h:'Key Formulas at a Glance',rows:[['ALE','SLE × ARO — expected annual dollar loss from a risk.'],['SLE','Asset Value × Exposure Factor — expected loss from one occurrence.'],['MTTR vs MTBF','Time to repair after a failure vs average time between failures.']]}
]},
];

const DEX = [
[{q:'An employee installs software that records keystrokes and sends them to an external server. Which malware category is this?',o:['Spyware','Keylogger','Rootkit','Trojan'],a:1,e:'The description — recording keystrokes and exfiltrating them — is the defining behavior of a keylogger; spyware is the broader category, but keylogger is the precise term here.'},{q:'Which access control principle ensures users cannot grant others more access than they themselves possess?',o:['Least privilege','Non-repudiation','Need to know','Separation of duties'],a:0,e:'Least privilege caps every user\'s access at exactly what their job requires, so no one can hold or hand off more permission than their own role allows.'},{q:'An organization stores encryption keys with a trusted third party for recovery purposes. This practice is called:',o:['Key escrow','PKI management','HSM storage','TPM binding'],a:0,e:'Key escrow stores a copy of encryption keys with a trusted third party specifically so they can be recovered later if the original is lost.'},{q:'Which control type best describes a fire suppression system that activates automatically when heat is detected?',o:['Preventive','Detective','Corrective','Compensating'],a:2,e:'A corrective control acts AFTER an incident to limit or repair damage — automatic fire suppression only activates once a fire is already detected.'},{q:'An employee performs both the accounts payable function AND payment authorization. Which principle is violated?',o:['Least privilege','Separation of duties','Non-repudiation','Defense in depth'],a:1,e:'Separation of duties requires that no single person control an entire high-risk process end-to-end; combining payables and authorization removes that check.'},{q:'A company adds unique random data to each password before hashing it. What is the primary security benefit?',o:['Prevents brute force entirely','Defeats rainbow table attacks','Encrypts the passwords before storage','Enables password recovery by admins'],a:1,e:'Salting adds unique random data before hashing, so precomputed rainbow tables (which map plain hashes to passwords) no longer match.'},{q:'Which of the following is an example of a DETERRENT control?',o:['Firewall that blocks malicious traffic','Security camera that records activity','Login banner warning of monitoring','IDS that generates an alert'],a:2,e:'A deterrent discourages an attacker without directly blocking or detecting them — a warning banner works purely on psychology, not enforcement.'},{q:'What is the primary purpose of a honeynet in an enterprise environment?',o:['Block all incoming malicious traffic','Provide failover redundancy','Lure attackers and gather intelligence','Encrypt sensitive data in transit'],a:2,e:'A honeynet is a network of decoy systems built specifically to attract attackers so defenders can observe their techniques safely.'},{q:'Which cryptographic concept ensures a past session stays private even if the current session key is later compromised?',o:['Key escrow','Perfect forward secrecy','Certificate pinning','Symmetric key rotation'],a:1,e:'PFS generates a unique key for every session, so compromising today\'s key cannot be used to decrypt sessions captured in the past.'},{q:'AES-256 encrypts a file before it is stored on a server. Which CIA component does this primarily protect?',o:['Availability','Integrity','Non-repudiation','Confidentiality'],a:3,e:'Encrypting data at rest prevents anyone without the key from reading it — a direct protection of confidentiality, not integrity or availability.'}],
[{q:'An attacker sends highly personalized emails to three specific named employees using details from LinkedIn. This is called:',o:['Whaling','Phishing','Spear phishing','BEC'],a:2,e:'Spear phishing is phishing personalized with real details about a specific, named target — unlike whaling (executives specifically) or generic mass phishing.'},{q:'Malware that waits for a specific calendar date before deleting all company files is classified as a:',o:['Ransomware','Logic bomb','Worm','Rootkit'],a:1,e:'A logic bomb stays dormant until a specific trigger condition — like a date — is met, then executes its malicious payload.'},{q:'An attacker compromises a software vendor and injects malware into a legitimate update reaching 10,000 customers. This is a:',o:['Zero-day exploit','Watering hole attack','Supply chain attack','DDoS attack'],a:2,e:'Compromising a trusted vendor\'s update to reach its downstream customers is the textbook definition of a supply chain attack.'},{q:'Which attack type tries the same small set of common passwords against many different accounts to avoid lockout policies?',o:['Brute force','Credential stuffing','Password spraying','Dictionary attack'],a:2,e:'Password spraying tries a small number of common passwords against MANY accounts, staying under per-account lockout thresholds — unlike brute force, which hammers one account.'},{q:'An attacker modifies the ARP cache on a victim system to intercept network traffic. This is called:',o:['DNS poisoning','ARP spoofing','IP spoofing','Replay attack'],a:1,e:'ARP spoofing sends forged ARP replies to poison a victim\'s ARP cache, redirecting traffic meant for another host to the attacker.'},{q:'A user receives an SMS claiming their bank account is locked with a link to verify credentials. This is called:',o:['Phishing','Vishing','Smishing','Pretexting'],a:2,e:'Smishing is phishing delivered via SMS text message — the same social-engineering goal as phishing, just over a different channel.'},{q:'Which vulnerability allows an attacker to use ../ sequences in a URL to read files outside the web root?',o:['SQL injection','XSS','Directory traversal','Buffer overflow'],a:2,e:'Directory traversal uses sequences like ../ to escape the web root and access files that should be off-limits.'},{q:'An attacker uses credentials from a LinkedIn breach to log into a victim\'s bank account. This technique relies on:',o:['Brute force','Credential stuffing','Password spraying','Social engineering'],a:1,e:'Credential stuffing reuses username and password pairs leaked in one breach to try logging into other, unrelated services.'},{q:'Which malware type operates at the OS kernel level to actively conceal its presence from standard security tools?',o:['Spyware','Ransomware','Keylogger','Rootkit'],a:3,e:'Rootkits operate at the kernel level specifically to hide their own presence and that of other malware from normal detection tools.'},{q:'An attacker calls an employee claiming to be Microsoft support requesting remote access. This is called:',o:['Phishing','Smishing','Vishing','Pretexting'],a:2,e:'Vishing is voice-based phishing — a phone call impersonating a trusted party, like IT support, to extract information or access.'},{q:'A security researcher discovers a vulnerability in production software with no patch available from the vendor, and attackers begin exploiting it before a fix is released. This is a:',o:['Zero-day exploit','Supply chain attack','Watering hole attack','Privilege escalation'],a:0,e:'A zero-day is a vulnerability being actively exploited before the vendor has released, or even developed, a patch, leaving defenders with zero days of advance warning.'}],
[{q:'A company needs a DR facility that can assume full operations within 15 minutes of a primary site failure. Which site type?',o:['Cold site','Warm site','Hot site','Colocation facility'],a:2,e:'A hot site is a fully mirrored, real-time-replicated facility that can take over operations almost immediately — minutes, not hours or days.'},{q:'Which technology evaluates a device\'s patch level and antivirus status before granting it network access?',o:['VLAN','IPS sensor','NAC','SIEM system'],a:2,e:'Network Access Control checks a device\'s security posture — patch level, antivirus status — against policy before granting it network access.'},{q:'An administrator deploys a device inline that automatically drops packets matching known attack signatures. This is an:',o:['IDS','IPS','NGFW','Proxy server'],a:1,e:'An IPS sits inline with traffic and actively drops packets matching known attack signatures; an IDS, by contrast, only alerts and never blocks.'},{q:'An organization segments its network so IoT devices cannot communicate directly with financial servers. This is:',o:['Micro-segmentation','DMZ design','VPN tunneling','VLAN trunking'],a:0,e:'Micro-segmentation applies fine-grained policies so individual devices or workloads can only reach exactly what they need to, isolating IoT from finance systems.'},{q:'The RPO for a critical database is set to 2 hours. What does this mean in practice?',o:['System must be restored within 2 hours','Backups must run at least every 2 hours','System can be offline for 2 hours','Two recovery sites are required'],a:1,e:'RPO defines the maximum acceptable data loss window — a 2-hour RPO means your most recent backup can be at most 2 hours old.'},{q:'Which wireless security protocol replaces PSK with SAE and is resistant to KRACK attacks?',o:['WEP','WPA','WPA2','WPA3'],a:3,e:'WPA3 replaces WPA2\'s PSK four-way handshake with SAE, which resists offline dictionary attacks like KRACK.'},{q:'A company hosts its public website and internal intranet on separate servers with a firewall between them. The public server is in the:',o:['Internal corporate network','VPN tunnel','DMZ','Management VLAN'],a:2,e:'A DMZ is a buffer network segment that hosts public-facing servers, isolated from the internal network by firewalls on both sides.'},{q:'Which protocol encrypts data at the network layer (Layer 3) and secures site-to-site VPN tunnels?',o:['TLS','SSL','IPSec','SSH'],a:2,e:'IPSec operates at Layer 3 to encrypt and authenticate IP packets, and is the standard protocol securing site-to-site VPN tunnels.'},{q:'A system fully operational at a remote location receiving real-time replication that can assume production immediately is a:',o:['RPO','MTBF','MTTR','Hot site'],a:3,e:'A hot site provides real-time replication and can assume production immediately — the other options here are metrics (RPO, MTBF, MTTR), not facility types.'},{q:'An organization places a server with deliberately weak security on its network to attract attackers. This is called a:',o:['Jump server','DMZ gateway','Honeypot','Bastion host'],a:2,e:'A honeypot is a deliberately vulnerable-looking system placed to attract and study attackers, distinct from a jump server or bastion host used for legitimate access.'}],
[{q:'A security analyst disconnects an infected web server from the corporate network to prevent malware spreading. This occurs during which IR phase?',o:['Preparation','Detection','Containment','Eradication'],a:2,e:'Containment is the IR phase focused on stopping the spread — disconnecting an infected host isolates the threat before eradication or recovery can begin.'},{q:'A tool alerts when a user accessed 200 sensitive files at 3AM which is ten times their normal activity baseline. This tool is called:',o:['SIEM','DLP','UEBA','EDR'],a:2,e:'User and Entity Behavior Analytics baselines normal activity with machine learning and flags statistically abnormal behavior, like this 3AM access spike.'},{q:'Which access control model allows a nurse to access patient records only during their shift hours and only from a hospital workstation?',o:['DAC','RBAC','MAC','ABAC'],a:3,e:'Attribute-Based Access Control can combine multiple conditions — role, time of day, location — making it the only model precise enough for shift-and-location rules.'},{q:'When seizing a hard drive for forensic investigation, what is the FIRST action to ensure evidence remains admissible in court?',o:['Run antivirus scan','Create a forensic image','Review the file contents','Establish and document chain of custody'],a:3,e:'Chain of custody documentation must begin immediately, tracking every person who handles the evidence, or it risks being ruled inadmissible in court.'},{q:'An organization wants employees to use a single login for email, HR system, and project tools without re-entering credentials. This is called:',o:['MFA','SSO','RBAC','PAM'],a:1,e:'Single Sign-On lets a user authenticate once and access multiple connected applications without re-entering credentials each time.'},{q:'A platform that automatically isolates a compromised host, opens a help desk ticket, and notifies the team without human intervention is:',o:['SIEM correlation','IPS blocking','SOAR automation','EDR containment'],a:2,e:'SOAR platforms execute automated playbooks — isolating hosts, opening tickets, notifying teams — without requiring a human to act on each step.'},{q:'A forensic analyst needs to find fileless malware that exists only in active memory and leaves no disk artifacts. The appropriate tool is:',o:['Wireshark','Nessus','Volatility','Autopsy'],a:2,e:'Volatility is a memory forensics framework built specifically to analyze RAM captures and find malware that never touches disk.'},{q:'An employee uses their fingerprint to unlock a mobile device for corporate email access. This is which authentication factor?',o:['Something you know','Something you have','Something you are','Somewhere you are'],a:2,e:'A fingerprint is a biological trait unique to the user — the \'something you are\' (inherence) authentication factor.'},{q:'An employee is emailing customer lists to a personal Gmail account every Friday after 5PM. Which tool should have detected and blocked this?',o:['SIEM platform','EDR solution','DLP system','FIM tool'],a:2,e:'Data Loss Prevention monitors and blocks unauthorized transmission of sensitive data, including large exports to a personal email account.'},{q:'The IR team has removed ransomware from all infected systems and is now rebuilding systems and restoring data from clean backups. Which IR phase is this?',o:['Recovery','Eradication','Lessons Learned','Containment'],a:0,e:'Recovery is the IR phase where systems are rebuilt and restored to normal production from clean backups, after the threat has already been eradicated.'},{q:'A security team conducts a discussion-based exercise where staff talk through their roles in a simulated ransomware attack without touching live systems. This is a:',o:['Tabletop exercise','Penetration test','Red team engagement','Vulnerability scan'],a:0,e:'A tabletop exercise is a low-risk, discussion-based walkthrough of an incident scenario, where team members talk through their responses without touching live systems, unlike a live simulation or red team engagement.'},{q:'A file integrity monitoring tool alerts that a critical system file was modified outside the scheduled patch window. This is most useful for detecting:',o:['Network congestion','Unauthorized changes or attacker persistence','Weak password policies','Cloud misconfigurations'],a:1,e:'FIM tracks cryptographic hashes of critical files and alerts on unexpected changes, a strong signal of unauthorized modification or an attacker maintaining persistence on the system.'},{q:'An organization grants a contractor temporary, time-limited elevated access to a production database, with the session fully recorded for audit. This is an example of:',o:['RBAC','Privileged Access Management (PAM)','MAC','Federation'],a:1,e:'PAM solutions grant just-in-time, time-limited privileged access and record sessions for audit, exactly the controlled, temporary elevated-access scenario described here.'},{q:'During an incident, the response team determines the malware entered through a phishing email opened three days before detection. Which IR phase does this timeline reconstruction belong to?',o:['Preparation','Analysis','Containment','Lessons Learned'],a:1,e:'Analysis is the IR phase where the team investigates scope, root cause, and timeline of an incident, determining how and when the attacker gained entry.'}],
[{q:'If ALE equals $100,000 and ARO equals 0.25, what is the Single Loss Expectancy (SLE)?',o:['$25,000','$400,000','$75,000','$100,250'],a:1,e:'ALE = SLE times ARO, so SLE = ALE divided by ARO = $100,000 / 0.25 = $400,000.'},{q:'A hospital\'s EHR system goes down and clinical staff cannot access patient medication records. Which regulation is MOST directly relevant?',o:['PCI DSS','SOX','GDPR','HIPAA'],a:3,e:'HIPAA specifically governs the privacy and security of protected health information in US healthcare systems, including electronic health records.'},{q:'A company stops accepting credit card numbers and redirects to a third-party payment processor. This represents which risk management strategy?',o:['Risk mitigation','Risk transfer','Risk avoidance','Risk acceptance'],a:2,e:'Avoidance means eliminating the risky activity entirely — by no longer accepting card numbers directly, the company removes that exposure rather than reducing or insuring it.'},{q:'Which specific document must be signed BEFORE a penetration test begins to define authorized scope and permitted attack methods?',o:['Service Level Agreement','Non-Disclosure Agreement','Rules of engagement','Business Partners Agreement'],a:2,e:'Rules of engagement define the authorized scope, timing, and permitted methods for a penetration test, and must be signed before testing begins.'},{q:'A company purchases cyber liability insurance covering breach notification, legal fees, and regulatory fines. This is classified as risk:',o:['Mitigation','Avoidance','Transfer','Acceptance'],a:2,e:'Buying insurance shifts the financial impact of a risk to a third party, the insurer — the textbook definition of risk transfer.'},{q:'A risk analyst is calculating how often a specific risk event is expected to occur per year. Which metric does this represent?',o:['SLE','ALE','ARO','Exposure factor'],a:2,e:'Annualized Rate of Occurrence measures how often a risk event is expected to happen per year, feeding into the ALE calculation.'},{q:'A company\'s BCP states the payroll system must be restored and operational within 4 hours of any failure. This 4-hour requirement is the:',o:['RPO (Recovery Point Objective)','MTD (Maximum Tolerable Downtime)','RTO (Recovery Time Objective)','MTBF (Mean Time Between Failures)'],a:2,e:'RTO defines the maximum acceptable downtime before a system must be restored — a 4-hour RTO means payroll must be back up within 4 hours.'},{q:'Which US regulation specifically protects the privacy and security of individually identifiable health information in electronic form?',o:['GDPR','PCI DSS','HIPAA','SOX'],a:2,e:'HIPAA is the US law that specifically protects individually identifiable health information held or transmitted in electronic form.'},{q:'A company announces external researchers may submit discovered vulnerabilities in exchange for monetary rewards. This is called a:',o:['Penetration testing engagement','Red team exercise','Bug bounty program','Vulnerability assessment'],a:2,e:'A bug bounty program pays external researchers for responsibly disclosing vulnerabilities they find, unlike a company-run pen test or red team.'},{q:'Which of the 5 NIST CSF functions focuses on developing organizational understanding of cybersecurity risk to systems, assets, and data?',o:['Protect','Detect','Respond','Identify'],a:3,e:'Identify is the first NIST CSF function, focused on understanding the organization\'s assets, risks, and cybersecurity posture before protecting or detecting anything.'}],
];

const FIRST_PREP = [
{q:"A help desk technician receives a call from a user who reports that several files on their workstation are now encrypted and a message is displayed demanding payment to an email address in order to recover the data. Which of the following types of attacks has occurred?",o:["Spyware","Ransomware","Rootkit","Bloatware"],a:1,dm:"Threats & Malware",e:"Ransomware encrypts victim files and demands payment for decryption. The lock screen with a contact email is the classic ransomware indicator — distinct from spyware (data theft) or rootkits (persistence)."},
{q:"A security analyst receives an alert that an internal host is sending large amounts of data to an external IP address at 3:00 AM. No scheduled jobs or business processes run at that time. Which of the following is the most likely explanation?",o:["A misconfigured backup job","Data exfiltration via a compromised host","A DDoS attack targeting the organization","Normal background OS update traffic"],a:1,dm:"Threats & Malware",e:"Unusual outbound data transfers to unknown external addresses outside business hours are a classic indicator of data exfiltration from a compromised internal system communicating with a C2 server."},
{q:"During a security incident, a security operations team identifies sustained malicious traffic from IP address 10.1.4.9. An analyst creates an inbound firewall rule to block this IP from accessing the organization's network. Which of the following ACL entries correctly fulfills this request?",o:["access-list inbound permit ip source 10.1.4.9/32 destination 0.0.0.0/0","access-list inbound deny ip source 0.0.0.0/0 destination 10.1.4.9/32","access-list inbound deny ip source 10.1.4.9/32 destination 0.0.0.0/0","access-list inbound permit ip source 0.0.0.0/0 destination 10.1.4.9/32"],a:2,dm:"Network Security",e:"To block inbound traffic FROM a specific source, the rule must DENY where source = malicious IP (10.1.4.9/32) going to any destination (0.0.0.0/0). The other options either permit traffic or have the source and destination reversed."},
{q:"Which of the following threat actors is most likely to use publicly available hacking tools downloaded from the internet to attempt to compromise an organization's network?",o:["Nation-state","Organized crime","Unskilled attacker","Hacktivist"],a:2,dm:"Threat Actors",e:"Unskilled attackers (script kiddies) rely on publicly available exploit tools without deep technical knowledge. Nation-states and organized crime typically develop or purchase custom, sophisticated tooling."},
{q:"A systems administrator wants to implement a control that makes it impossible for a user to deny having performed a specific action on a critical system. Which of the following security concepts should the administrator implement?",o:["Least privilege","Adaptive identity","Non-repudiation","Defense in depth"],a:2,dm:"General Security",e:"Non-repudiation uses digital signatures and comprehensive audit logging to provide irrefutable proof that a specific entity performed a specific action, making denial impossible."},
{q:"A company's security team wants to reduce the likelihood of a successful cyberattack by implementing controls that stop threats before they can cause damage. Which of the following control types BEST meets this objective?",o:["Detective","Corrective","Compensating","Preventive"],a:3,dm:"General Security",e:"Preventive controls (firewalls, access controls, MFA, input validation) act before an attack to stop it from succeeding. Detective controls identify attacks after they happen; corrective controls fix damage after the fact."},
{q:"A company wants to allow external security researchers to find and report vulnerabilities in its customer-facing web application in exchange for monetary compensation. Which of the following programs best describes this arrangement?",o:["Red team exercise","Penetration test","Bug bounty program","Open-source intelligence gathering"],a:2,dm:"Governance & Risk",e:"A bug bounty program invites external researchers to find and responsibly disclose vulnerabilities for rewards, expanding testing coverage beyond internal teams without a defined scope of a formal pen test."},
{q:"Following a security incident, the response team has completed eradication and recovery steps. The team now needs to document what happened, update response procedures, and prevent recurrence. Which incident response phase does this describe?",o:["Detection","Containment","Preparation","Lessons learned"],a:3,dm:"Incident Response",e:"Lessons learned is the final incident response phase. It involves documenting the incident timeline, evaluating response effectiveness, updating procedures, and implementing improvements to prevent recurrence."},
{q:"Before beginning a third-party penetration test, the security team and the testing vendor agree on which systems are in scope, what testing methods are permitted, and how findings will be communicated. Which of the following documents captures these agreed-upon terms?",o:["Service-level agreement (SLA)","Right-to-audit clause","Rules of engagement","Supply chain analysis"],a:2,dm:"Governance & Risk",e:"Rules of engagement define scope, permitted activities, timing, communication procedures, and legal constraints for a penetration test — protecting both the tester and the organization from liability."},
{q:"An organization's VPN connects its headquarters to a branch office over the public internet. Which data state is the VPN primarily protecting?",o:["Data at rest","Data in use","Data in transit","Data sovereignty"],a:2,dm:"Cryptography",e:"A VPN encrypts data while it traverses the public internet between locations — this is data in transit. Data at rest refers to stored data; data in use refers to data actively being processed in memory."},
{q:"After a ransomware attack encrypted critical server data, the recovery team needs to restore operations without paying the ransom. Which of the following would have been MOST helpful to have in place before the attack?",o:["Load balancer","Geographic dispersion","Full-disk encryption","Offline backups"],a:3,dm:"Resilience & Recovery",e:"Offline (air-gapped) backups cannot be encrypted by ransomware since they are disconnected from the network. They are the most reliable restoration method after a ransomware attack."},
{q:"A user reports receiving an email appearing to come from the CEO, requesting an urgent wire transfer to a new vendor account. The CEO's actual email account has not been compromised. Which of the following attack types is MOST likely?",o:["Spear phishing","Business email compromise (BEC)","Whaling","Vishing"],a:1,dm:"Social Engineering",e:"BEC involves impersonating executives or vendors via spoofed emails to manipulate employees into transferring funds — without actually compromising the real account. Whaling targets executives directly; BEC targets those who receive requests FROM executives."},
{q:"A security analyst discovers that an attacker used a valid employee's credentials obtained from a previous data breach to log into the company's VPN. Which of the following controls would have been MOST effective in preventing this access?",o:["Increasing password complexity requirements","Implementing multi-factor authentication (MFA)","Enforcing 90-day password rotation","Deploying a web application firewall"],a:1,dm:"Identity & Access",e:"MFA requires a second verification factor beyond a password. Even with credentials stolen from a third-party breach, the attacker is blocked without possession of the second factor (token, biometric, etc.)."},
{q:"During a forensic investigation, the security team needs to ensure that evidence collected from a seized hard drive is admissible in court. Which of the following practices is MOST important to establish immediately?",o:["Running malware scans on the original drive","Creating a forensic bit-for-bit image","Establishing and maintaining chain of custody","Analyzing log files for indicators of compromise"],a:2,dm:"Incident Response",e:"Chain of custody documents who handled evidence, when, and what actions were taken — ensuring evidence integrity and admissibility in legal proceedings. Without it, evidence may be inadmissible regardless of its content."},
{q:"A company is implementing a new cloud application and the security team wants to ensure vulnerabilities are identified before code is deployed to production. Which of the following approaches should be used during development?",o:["Penetration testing the production environment","Static Application Security Testing (SAST)","Deploying a web application firewall","Running vulnerability scans on the live application"],a:1,dm:"Application Security",e:"SAST analyzes source code without executing it, identifying injection flaws, insecure functions, and other vulnerabilities early in the SDLC — before any deployment. It is the only option that works before the application is running."},
{q:"An attacker gains access to a network switch and begins sending crafted ARP replies to associate their MAC address with the default gateway's IP address. Which of the following attacks is being performed?",o:["DNS poisoning","ARP spoofing","MAC flooding","VLAN hopping"],a:1,dm:"Network Security",e:"ARP spoofing sends fake ARP replies to poison the ARP cache, redirecting network traffic through the attacker (enabling a man-in-the-middle position) by mapping the attacker's MAC to a legitimate gateway IP."},
{q:"A company stores customer credit card information and must comply with industry standards for protecting this data. Which of the following regulatory frameworks applies MOST directly?",o:["HIPAA","GDPR","PCI DSS","SOX"],a:2,dm:"Governance & Risk",e:"PCI DSS specifically governs the storage, processing, and transmission of payment card data for any organization handling cardholder information, regardless of industry or geography."},
{q:"An employee receives a text message claiming to be from their bank, stating their account is locked and they must click a link immediately to verify their identity. Which of the following attack types is this?",o:["Vishing","Phishing","Smishing","Pretexting"],a:2,dm:"Social Engineering",e:"Smishing (SMS phishing) uses text messages to deceive victims into clicking malicious links or divulging personal information. Vishing uses voice calls; phishing uses email."},
{q:"A security team is reviewing access logs and notices that a user account accessed sensitive HR files at 2:00 AM on a weekend from a foreign IP address, while the employee is known to be on domestic vacation. Which of the following indicators is MOST relevant?",o:["Resource consumption","Concurrent session usage","Impossible travel","Account lockout"],a:2,dm:"Security Operations",e:"Impossible travel is a key indicator of compromise — a user account appearing to access systems from geographically distant locations within a timeframe that makes physical travel impossible, strongly suggesting credential compromise."},
{q:"After migrating to a new cloud environment, a security team discovers that an S3 bucket containing customer data is publicly accessible. Which of the following is the MOST important immediate remediation step?",o:["Enable server-side encryption on all objects","Set up CloudTrail logging to monitor access","Remove public access permissions from the bucket","Deploy a WAF in front of the storage bucket"],a:2,dm:"Cloud Security",e:"The immediate priority is stopping unauthorized access by removing public permissions. Encryption and logging are important security controls but do not prevent the current exposure — anyone can already access the data."},
{q:"A developer is writing a web application that accepts user input for a search feature. To prevent injection attacks, which of the following coding practices is MOST effective?",o:["Encrypting all database connections with TLS","Using parameterized queries and input validation","Deploying a WAF in front of the application","Hashing all user-submitted data before processing"],a:1,dm:"Application Security",e:"Parameterized queries separate SQL logic from user input, making injection structurally impossible. Input validation adds defense in depth. A WAF is a compensating control, not a fix for the underlying vulnerability."},
{q:"A wireless network analyst performs a site survey and discovers an access point broadcasting the same SSID as the corporate network but not on the approved device list. Which of the following threats does this represent?",o:["Bluejacking","Rogue access point","Evil twin attack","Deauthentication attack"],a:1,dm:"Network Security",e:"A rogue access point is an unauthorized AP connected to or near the corporate network. If it is specifically impersonating the corporate SSID to intercept traffic, it becomes an evil twin — but discovery of any unauthorized AP is a rogue AP finding."},
{q:"An organization needs to ensure that when a critical server fails, a standby system automatically takes over with no interruption to users. Which of the following BEST describes this capability?",o:["Cold site","Geographic dispersion","High availability / failover clustering","Warm site"],a:2,dm:"Resilience & Recovery",e:"High availability with failover clustering provides automatic, seamless switchover to a standby system when the primary fails, minimizing or eliminating downtime. Cold and warm sites require manual intervention and hours to activate."},
{q:"A penetration tester is given no prior information about the target organization's infrastructure before beginning the engagement. Which of the following testing approaches does this describe?",o:["Known environment","Partially known environment","Unknown environment (black box)","Integrated testing"],a:2,dm:"Governance & Risk",e:"An unknown environment (black box) test simulates a real external attacker who has no prior knowledge. The tester must discover all information through reconnaissance — making it the most realistic external attack simulation."},
{q:"During a security audit, it is discovered that several user accounts have permissions far beyond what their job roles require. Which of the following principles has been violated?",o:["Separation of duties","Least privilege","Need to know","Non-repudiation"],a:1,dm:"Identity & Access",e:"Least privilege requires that users are granted only the minimum permissions necessary for their job function. Excessive permissions violate this principle and expand the attack surface for both malicious insiders and compromised accounts."},
{q:"A company wants to prevent sensitive documents from being emailed to personal email addresses outside the organization. Which of the following solutions would BEST address this requirement?",o:["Endpoint detection and response (EDR)","Data loss prevention (DLP)","Intrusion prevention system (IPS)","Security information and event management (SIEM)"],a:1,dm:"Security Operations",e:"DLP solutions monitor and control data transfers, inspecting content and blocking unauthorized transmission of sensitive data through email, USB uploads, or cloud storage. EDR focuses on endpoint threats, not data in transit."},
{q:"An attacker calls an employee, impersonating the IT help desk, and convinces the employee to provide their username and temporary password for a supposed system upgrade. Which of the following social engineering techniques is being used?",o:["Phishing","Vishing","Smishing","Watering hole"],a:1,dm:"Social Engineering",e:"Vishing (voice phishing) uses phone calls to manipulate victims into disclosing credentials or taking actions by impersonating trusted entities such as IT support, banks, or government agencies."},
{q:"A security engineer is configuring network monitoring and wants to detect when a host begins communicating with a known command-and-control (C2) server. Which of the following tools would be MOST effective?",o:["Vulnerability scanner","SIEM with threat intelligence feeds","File integrity monitoring (FIM)","Static application security tester"],a:1,dm:"Security Operations",e:"A SIEM integrated with threat intelligence feeds can correlate network connection logs against known malicious IP addresses and domains in near real-time, generating alerts when C2 communication is detected."},
{q:"An organization discovers that an attacker exploited a vulnerability in a widely used library that was publicly disclosed but not yet patched by the vendor. Which of the following BEST describes this type of vulnerability?",o:["Known vulnerability","Zero-day vulnerability","Misconfiguration","Supply chain vulnerability"],a:1,dm:"Threats & Malware",e:"A zero-day vulnerability is one for which no official patch exists from the vendor at the time of exploitation. Once disclosed but unpatched, defenders have zero days to protect themselves using standard patch management."},
{q:"A company requires employees to use one login to access email, the HR portal, and the project management system. Which of the following identity management concepts does this describe?",o:["Multi-factor authentication","Federated identity","Single sign-on (SSO)","Role-based access control"],a:2,dm:"Identity & Access",e:"Single sign-on (SSO) allows users to authenticate once and gain access to multiple applications without re-entering credentials for each system, improving usability while centralizing authentication."},
{q:"Which of the following BEST describes the purpose of a honeynet?",o:["A network of backup servers for redundancy","A decoy environment designed to lure and study attackers","A segmented zone hosting public-facing services","An encrypted tunnel for remote access"],a:1,dm:"Network Security",e:"A honeynet is a network of honeypot systems designed to attract attackers, observe their techniques in detail, and gather threat intelligence — while keeping them isolated from production systems."},
{q:"A company is planning for disasters and establishes that its most critical systems must be restored within 4 hours of a failure. Which of the following metrics does this represent?",o:["Recovery point objective (RPO)","Mean time between failures (MTBF)","Recovery time objective (RTO)","Mean time to repair (MTTR)"],a:2,dm:"Resilience & Recovery",e:"RTO defines the maximum acceptable downtime — how quickly a system must be restored after a disruption. RPO defines maximum acceptable data loss in time. They are different metrics often confused on the exam."},
{q:"A security analyst reviews logs and notices that a single user account authenticated successfully to 47 different systems within a 5-minute window. Which of the following is the MOST likely explanation?",o:["The user is performing routine administrative work","Automated software deployment is running","The account has been compromised and is being used for lateral movement","A vulnerability scan is running under that user's context"],a:2,dm:"Incident Response",e:"Rapid authentication across many systems in a short window is a strong indicator of lateral movement — an attacker using compromised credentials to spread through the environment and access additional resources."},
{q:"An organization wants to ensure that no single employee has enough access to commit fraud alone. Which of the following principles should be implemented?",o:["Least privilege","Separation of duties","Non-repudiation","Mandatory access control"],a:1,dm:"Identity & Access",e:"Separation of duties divides critical tasks among multiple individuals so that no single person can complete a fraudulent action alone. It requires collusion to bypass, significantly raising the risk for would-be insiders."},
{q:"Which of the following encryption approaches would BEST protect data if a laptop is stolen and the attacker attempts to access files by removing the drive and connecting it to another system?",o:["File-level encryption of sensitive folders","Full-disk encryption (FDE)","Encrypting the swap file","Application-level encryption"],a:1,dm:"Cryptography",e:"Full-disk encryption encrypts the entire drive contents at the hardware level. Even if the drive is removed and connected to another system, all data remains unreadable without the encryption key or proper boot authentication."},
{q:"A security team wants to test their incident response capabilities without affecting production systems. The team discusses a simulated scenario in a conference room, walking through their response actions. Which of the following exercises does this describe?",o:["Red team exercise","Penetration test","Tabletop exercise","Parallel failover test"],a:2,dm:"Incident Response",e:"A tabletop exercise is a discussion-based simulation where team members talk through their response to a hypothetical scenario, identifying gaps in plans and communication without impacting live systems."},
{q:"An attacker compromises a popular software update server and injects malicious code into a legitimate application update. Users who install the update unknowingly install malware. Which of the following attack types does this describe?",o:["Zero-day exploit","Supply chain attack","Watering hole attack","Drive-by download"],a:1,dm:"Threats & Malware",e:"A supply chain attack compromises a trusted third-party vendor, software provider, or update mechanism to distribute malware to downstream customers — bypassing security controls because the source appears legitimate."},
{q:"A financial institution must ensure that customer account transaction records cannot be modified or deleted and must be retained for seven years. Which of the following storage technologies BEST supports this requirement?",o:["RAID storage array","Cloud-based backup","Write-once read-many (WORM) storage","Encrypted network share"],a:2,dm:"Resilience & Recovery",e:"WORM storage physically prevents modification or deletion of data once written, making it ideal for compliance-driven retention where record integrity must be guaranteed and auditable."},
{q:"A company's web application allows users to submit comments. An attacker submits a comment containing a malicious script that executes in other users' browsers when they view the page. Which vulnerability is being exploited?",o:["SQL injection","Cross-site scripting (XSS)","Command injection","Directory traversal"],a:1,dm:"Application Security",e:"Stored XSS injects malicious scripts into a web application's database that are then served to other users, executing in their browser context. This can steal session cookies, redirect users, or perform actions on their behalf."},
{q:"A network administrator configures a switch port so that it only allows a maximum of two MAC addresses and shuts down if additional devices are detected. Which of the following security features is being configured?",o:["802.1X authentication","VLAN segmentation","Port security","Network access control (NAC)"],a:2,dm:"Network Security",e:"Port security limits the number of MAC addresses allowed on a switch port and can automatically disable the port (violation mode: shutdown) if more devices attempt to connect, preventing unauthorized device access."},
{q:"An organization with sensitive government contracts uses a system where a user's security clearance level must equal or exceed the classification label of the data they want to access. Which access control model does this describe?",o:["Discretionary access control (DAC)","Role-based access control (RBAC)","Mandatory access control (MAC)","Attribute-based access control (ABAC)"],a:2,dm:"Identity & Access",e:"MAC uses security labels and clearance levels enforced by the system/administrator — users cannot override access decisions. It is the model used in classified government environments and the Bell-LaPadula model."},
{q:"A security engineer is reviewing DNS logs and notices that an internal host is making hundreds of DNS requests to random subdomains of an external domain, with no corresponding web traffic observed. Which of the following is the MOST likely explanation?",o:["A misconfigured DNS forwarder","DNS tunneling for data exfiltration","A DDoS amplification attack","Normal CDN prefetching behavior"],a:1,dm:"Threats & Malware",e:"DNS tunneling encodes data within DNS query/response payloads to exfiltrate data or establish covert C2 channels. High volumes of queries to random subdomains with no web traffic is a key behavioral indicator."},
{q:"A company wants to assess how well its employees recognize phishing attempts. The security team sends simulated phishing emails to staff and tracks click rates. Which of the following programs does this describe?",o:["Red team exercise","Security awareness training with phishing simulation","Bug bounty program","Vulnerability assessment"],a:1,dm:"Governance & Risk",e:"Phishing simulation campaigns test employee awareness, identify vulnerable individuals who need additional training, and measure the organization's human-layer resilience against social engineering attacks."},
{q:"Which of the following BEST describes the role of a certificate authority (CA) in a public key infrastructure (PKI)?",o:["It generates private keys for end users","It stores encrypted data for secure retrieval","It issues and signs digital certificates, binding public keys to identities","It manages symmetric key distribution across the network"],a:2,dm:"Cryptography",e:"A CA is a trusted third party that issues digital certificates — cryptographically binding a public key to a verified identity. Relying parties trust certificates signed by a trusted CA to authenticate entities."},
{q:"A penetration tester discovers a server running an end-of-life operating system that no longer receives security patches. The client cannot upgrade immediately. Which of the following is the BEST compensating control?",o:["Require MFA for all accounts on the server","Encrypt all data stored on the server","Isolate the server in a restricted network segment with strict firewall rules","Run vulnerability scans on the server weekly"],a:2,dm:"Security Architecture",e:"Network isolation with strict firewall rules limits exposure of an unpatched system by restricting what can communicate with it. This is a compensating control — it reduces risk until proper remediation (patching or replacement) is possible."},
{q:"An employee badges into the building by following closely behind another employee without using their own badge. Which of the following physical security threats does this describe?",o:["Shoulder surfing","Tailgating (piggybacking)","Dumpster diving","Impersonation"],a:1,dm:"Physical Security",e:"Tailgating occurs when an unauthorized person physically follows an authorized person through a secured entry point without using their own credentials, bypassing badge reader controls and access logging."},
{q:"A company's security policy requires that all remote access sessions terminate after 15 minutes of inactivity. Which of the following security objectives does this control MOST directly support?",o:["Non-repudiation","Availability","Reducing the risk of unauthorized access from unattended sessions","Ensuring data integrity during transmission"],a:2,dm:"Identity & Access",e:"Session timeout controls reduce the risk of unauthorized access from sessions left open on unattended workstations or terminals — a common attack vector in both physical and remote work environments."},
{q:"Which of the following BEST describes the difference between vulnerability scanning and penetration testing?",o:["Vulnerability scanning is performed externally; penetration testing is always internal","Vulnerability scanning identifies potential weaknesses; penetration testing actively attempts to exploit them","Penetration testing is automated; vulnerability scanning requires manual effort","Vulnerability scanning requires a signed agreement; penetration testing does not"],a:1,dm:"Governance & Risk",e:"Vulnerability scanning discovers and reports potential weaknesses (passive). Penetration testing actively attempts to exploit those weaknesses to demonstrate real-world impact and business risk — going beyond just identification."},
{q:"A security architect is designing a cloud environment and wants to ensure that each microservice can only communicate with the specific services it needs to function. Which approach BEST achieves this?",o:["Deploying a unified threat management (UTM) appliance","Implementing micro-segmentation with application-level policies","Configuring a single perimeter firewall","Enabling full-disk encryption on all cloud instances"],a:1,dm:"Security Architecture",e:"Micro-segmentation enforces granular east-west traffic policies at the workload level, restricting each microservice to communicate only with explicitly authorized peers — limiting blast radius if one service is compromised."},
{q:"Which of the following BEST describes the primary difference between symmetric and asymmetric encryption?",o:["Symmetric encryption is used for authentication; asymmetric is for data confidentiality","Symmetric encryption uses one shared key; asymmetric uses a public-private key pair","Symmetric encryption is slower but more secure than asymmetric","Asymmetric encryption can only be used for digital signatures"],a:1,dm:"Cryptography",e:"Symmetric encryption uses the same key to encrypt and decrypt, requiring secure key exchange. Asymmetric encryption uses mathematically linked key pairs — the public key encrypts, only the private key decrypts — solving the key distribution problem."},
{q:"A user's workstation has been infected with malware that logs all keystrokes and sends them to an external server. Which of the following malware types is this?",o:["Rootkit","Ransomware","Keylogger","Logic bomb"],a:2,dm:"Threats & Malware",e:"A keylogger records every keystroke — capturing passwords, credit card numbers, and sensitive communications — and transmits them to the attacker, enabling credential theft and account takeover."},
{q:"An organization enables DNSSEC on its authoritative DNS servers. Which of the following threats does this MOST directly mitigate?",o:["DDoS amplification attacks targeting DNS","DNS cache poisoning and spoofing","Brute force attacks against DNS admin accounts","Unauthorized zone transfers"],a:1,dm:"Network Security",e:"DNSSEC adds cryptographic signatures to DNS records, allowing resolvers to verify the authenticity and integrity of responses. This directly prevents cache poisoning where attackers inject false DNS records to redirect users."},
{q:"A security team deploys a system that monitors user activity, establishes behavioral baselines, and alerts when accounts access unusually large volumes of data outside normal hours. Which of the following technologies does this describe?",o:["SIEM","Intrusion detection system (IDS)","User and entity behavior analytics (UEBA)","Data loss prevention (DLP)"],a:2,dm:"Security Operations",e:"UEBA uses machine learning to establish behavioral baselines for users and entities, then flags anomalies (unusual data access, off-hours activity, impossible travel) that may indicate insider threats or compromised accounts."},
{q:"A company implements a policy requiring all employees to complete security awareness training annually, including modules on recognizing phishing and safe handling of sensitive data. Which of the following control types does this represent?",o:["Technical","Detective","Administrative (managerial)","Corrective"],a:2,dm:"General Security",e:"Security awareness training is an administrative (managerial) control — a policy or procedure that guides human behavior. Technical controls use technology (firewalls, encryption); administrative controls use policies and training."},
{q:"An attacker exploits a flaw in a web application that allows them to traverse the directory structure and read sensitive files outside the web root, such as /etc/passwd. Which of the following vulnerability types is this?",o:["SQL injection","Cross-site scripting","Directory traversal","Command injection"],a:2,dm:"Application Security",e:"Directory traversal (path traversal) exploits insufficient input validation to access files outside the intended web root using sequences like '../../../', potentially exposing system files, credentials, and configuration data."},
{q:"A company stores sensitive encryption keys in a dedicated hardware device that performs cryptographic operations internally without exposing the raw key material to any software or OS. Which of the following technologies does this describe?",o:["Trusted Platform Module (TPM)","Hardware security module (HSM)","Secure enclave","Key management system (KMS)"],a:1,dm:"Cryptography",e:"An HSM is a dedicated hardware appliance that generates, stores, and performs cryptographic operations using keys that never leave the device in plaintext — providing the highest security for key material protection."},
{q:"Which of the following BEST describes the purpose of the Sender Policy Framework (SPF) email security control?",o:["Encrypts email content between mail servers","Specifies which mail servers are authorized to send email for a domain","Signs individual email messages to verify they have not been modified","Prevents phishing by blocking email from unknown senders"],a:1,dm:"Network Security",e:"SPF is a DNS TXT record that lists which mail servers are authorized to send email on behalf of a domain. Receiving servers check SPF to detect spoofed sender addresses, reducing email impersonation and BEC attacks."},
{q:"A security team receives IDS alerts, but after investigation most are found to be for legitimate traffic incorrectly flagged as malicious. Which of the following BEST describes these alerts?",o:["True positives","False negatives","False positives","True negatives"],a:2,dm:"Security Operations",e:"A false positive occurs when a security tool incorrectly identifies benign activity as malicious. High false positive rates cause alert fatigue, wasting analyst time and potentially causing real threats to be missed."},
{q:"An organization implements a policy requiring two employees from different departments to both authenticate before accessing encryption keys for the most sensitive data. Which of the following concepts does this enforce?",o:["Dual control / multi-party authorization","Separation of duties","Mandatory access control","Defense in depth"],a:0,dm:"Identity & Access",e:"Dual control requires two or more individuals to cooperate to perform a sensitive action, preventing any single person from acting alone on the most critical assets. It is a strong control against insider fraud."},
{q:"A security analyst is investigating a potential breach and needs to analyze the contents of RAM from a running server to look for malware that only exists in memory. Which of the following tools is MOST appropriate?",o:["Wireshark","Nessus","Volatility","Autopsy"],a:2,dm:"Incident Response",e:"Volatility is an open-source memory forensics framework specifically designed to analyze RAM dumps, extracting running processes, network connections, injected code, and other volatile artifacts from memory images."},
{q:"A web application uses a cookie to maintain user session state. To prevent the cookie from being accessed by JavaScript and transmitted over unencrypted connections, which of the following cookie attributes should be set?",o:["SameSite and Secure","HttpOnly and Secure","Domain and Path","Expires and HttpOnly"],a:1,dm:"Application Security",e:"HttpOnly prevents JavaScript from accessing the cookie (mitigating XSS-based session theft). Secure ensures the cookie is only transmitted over HTTPS connections, preventing interception on unencrypted channels."},
{q:"An organization is required by regulation to notify affected customers within 72 hours of discovering a data breach involving personal information. Which of the following regulations imposes this specific requirement?",o:["HIPAA","PCI DSS","GDPR","SOX"],a:2,dm:"Governance & Risk",e:"GDPR Article 33 requires notification to supervisory authorities within 72 hours of discovering a personal data breach. Article 34 may additionally require notification to affected individuals when the breach poses high risk."},
{q:"A security engineer is hardening a new server and wants to reduce its attack surface by removing unnecessary functionality. Which of the following actions BEST achieves this?",o:["Enabling all services and patching them","Disabling or removing unused services, protocols, and applications","Installing a host-based firewall","Enabling full-disk encryption"],a:1,dm:"Security Architecture",e:"Hardening reduces attack surface by removing or disabling unnecessary services, open ports, protocols, and applications — eliminating potential entry points that serve no business function and cannot therefore be patched if vulnerabilities emerge."},
{q:"An attacker floods a target web server with millions of HTTP GET requests from a botnet, exhausting its resources and making it unavailable to legitimate users. Which of the following attack types does this describe?",o:["SQL injection","Man-in-the-middle (MITM)","Distributed denial-of-service (DDoS)","Session hijacking"],a:2,dm:"Network Security",e:"A DDoS attack uses multiple distributed sources (a botnet) to overwhelm a target with traffic, exhausting CPU, memory, or bandwidth resources and denying service to legitimate users."},
{q:"A company's login banner displayed before authentication states that the system is for authorized users only and that activity is subject to monitoring and recording. Which of the following control types does this banner represent?",o:["Preventive","Deterrent","Detective","Corrective"],a:1,dm:"General Security",e:"A warning/login banner is a deterrent control — it discourages unauthorized use by informing users of monitoring and legal consequences. It does not technically block access (that would be preventive)."},
{q:"A company's disaster recovery plan specifies that no more than 4 hours of transaction data can be lost in the event of a system failure. Which of the following metrics does this 4-hour threshold represent?",o:["Recovery time objective (RTO)","Mean time to repair (MTTR)","Recovery point objective (RPO)","Maximum tolerable downtime (MTD)"],a:2,dm:"Resilience & Recovery",e:"RPO defines the maximum acceptable data loss measured in time — the point to which data must be restorable. A 4-hour RPO means backups must occur at least every 4 hours. RTO is about how quickly the system must be restored."},
{q:"During a forensic investigation, the team needs to ensure a seized laptop's hard drive data is preserved exactly as found and can be verified as unaltered. Which of the following techniques BEST achieves this?",o:["Encrypting the drive before analysis","Creating a forensic bit-for-bit image and hashing both original and copy","Running antivirus on the original drive","Booting the system and collecting running process information"],a:1,dm:"Incident Response",e:"Creating a bit-for-bit forensic image and hashing both the original and the copy with SHA-256 proves the copy is identical and unaltered — any tampering would produce a different hash value, invalidating the evidence."},
{q:"A company wants to allow employees to select a work device from a pre-approved list provided by the organization, where the company owns and manages the device. Which of the following deployment models applies?",o:["BYOD (Bring Your Own Device)","COPE (Corporate-Owned, Personally Enabled)","CYOD (Choose Your Own Device)","MDM (Mobile Device Management)"],a:2,dm:"Security Operations",e:"CYOD allows employees to select from a pre-approved list of corporate-owned devices. The company owns, manages, and controls the device — unlike BYOD where the employee owns the personal device used for work."},
{q:"Which of the following BEST describes the purpose of a security operations center (SOC)?",o:["To develop new security tools and technologies","To provide 24/7 monitoring, detection, and response to security events","To conduct penetration testing against production systems","To manage identity and access provisioning for all users"],a:1,dm:"Security Operations",e:"A SOC provides continuous monitoring of an organization's security posture, detecting threats, investigating alerts, coordinating incident response, and maintaining situational awareness across the environment."},
{q:"An attacker registers a domain name visually similar to a legitimate bank's website (e.g., 'paypa1.com' instead of 'paypal.com') and uses it to host a phishing page. Which of the following techniques does this describe?",o:["Pharming","Typosquatting","Watering hole attack","DNS hijacking"],a:1,dm:"Social Engineering",e:"Typosquatting registers domains exploiting common misspellings or look-alike characters (using '1' for 'l', '0' for 'o') of legitimate sites, targeting users who mistype URLs or are tricked by the visual similarity."},
{q:"A cloud administrator needs to ensure virtual machines within the same environment cannot communicate with each other unless explicitly permitted. Which of the following approaches BEST accomplishes this?",o:["Configuring a perimeter firewall only","Implementing security groups with a default deny stance","Enabling full-disk encryption on all VMs","Using VPN tunnels between all VM instances"],a:1,dm:"Cloud Security",e:"Cloud security groups with default-deny rules isolate VMs from each other, only permitting specifically configured traffic. Without security groups, VMs in the same environment may freely communicate east-west."},
{q:"An organization is evaluating a new third-party SaaS vendor that will process employee payroll data. Which of the following should the security team review FIRST to understand responsibilities for protecting this data?",o:["The vendor's bug bounty program details","The shared responsibility matrix and service-level agreement","The vendor's marketing materials and product demo","The vendor's employee count and financial stability"],a:1,dm:"Governance & Risk",e:"The shared responsibility matrix defines which security controls the cloud vendor manages versus what the customer is responsible for — critical to understand before entrusting sensitive data to any third party."},
{q:"A security team discovers malware on a workstation that modifies the operating system kernel and hides its processes, files, and network connections from standard system monitoring tools. Which of the following malware types does this BEST describe?",o:["Ransomware","Worm","Rootkit","Trojan"],a:2,dm:"Threats & Malware",e:"A rootkit operates at the kernel level to conceal its presence by intercepting and modifying system calls, hiding processes, files, and connections from security tools — making it extremely difficult to detect and remove."},
{q:"A company runs a public website and an internal HR system. The security team recommends separating these onto different systems with network controls between them. Which of the following security principles BEST describes this recommendation?",o:["Least privilege","Network segmentation","Non-repudiation","Availability"],a:1,dm:"Security Architecture",e:"Network segmentation divides the network into zones, isolating systems by function and sensitivity. Separating a public web server from an internal HR system limits the blast radius if the public-facing system is compromised."},
{q:"Which of the following BEST describes the role of an intrusion prevention system (IPS) compared to an intrusion detection system (IDS)?",o:["An IPS only monitors traffic; an IDS can block traffic","An IPS can actively block malicious traffic in real time; an IDS only alerts","An IDS is cloud-based; an IPS is always on-premises","An IPS requires endpoint agents; an IDS is network-based only"],a:1,dm:"Network Security",e:"An IDS is passive — it detects and alerts on suspicious activity but cannot block traffic. An IPS is inline and active — it can drop or block malicious packets in real time, providing both detection and prevention."},
{q:"A user reports that after visiting a website, malware was installed on their system without them clicking anything beyond loading the page. Which of the following attack types does this describe?",o:["Watering hole attack","Drive-by download","Typosquatting","Spear phishing"],a:1,dm:"Threats & Malware",e:"A drive-by download exploits unpatched browser or plugin vulnerabilities (Java, Flash, PDF viewers) to silently install malware when a victim visits a malicious or compromised website — requiring no user interaction."},
{q:"An organization wants to implement a control to verify that devices connecting to the corporate network meet security requirements (current patches, enabled AV, compliant configuration) before granting access. Which of the following technologies BEST provides this?",o:["VPN with split tunneling","Network access control (NAC)","Security information and event management (SIEM)","Web application firewall (WAF)"],a:1,dm:"Network Security",e:"NAC evaluates device health and security posture before granting network access. Non-compliant devices can be quarantined or given limited access to a remediation network until they meet policy requirements."},
{q:"A company is implementing digital certificates for employee email signing and encryption, issued and managed entirely internally. Which of the following describes the type of CA being used?",o:["Public CA","Root CA","Private/Internal CA","Wildcard CA"],a:2,dm:"Cryptography",e:"A private (internal) CA is operated by the organization to issue certificates for internal use. It is not inherently trusted by external systems but gives the organization full control over its certificate lifecycle and policy."},
{q:"Which of the following BEST describes a watering hole attack?",o:["Sending targeted phishing emails to specific executives","Compromising websites frequently visited by a target group to deliver malware","Intercepting communications between two parties on the network","Creating a fraudulent wireless access point near a corporate building"],a:1,dm:"Social Engineering",e:"A watering hole attack compromises websites the target group is known to frequent, infecting those sites with malware. Victims are attacked when they visit a website they already trust — making this highly effective against specific groups."},
{q:"A security analyst wants to verify that a software download has not been tampered with. The vendor provides an MD5 hash. The analyst should be aware of which of the following limitations of MD5?",o:["MD5 hashes are too long to be practical for file verification","MD5 has known collision vulnerabilities making it unsuitable for integrity verification","MD5 can only verify files smaller than 1 GB","MD5 hashes change each time they are computed from the same file"],a:1,dm:"Cryptography",e:"MD5 is cryptographically broken — two different files can be crafted to produce the same hash (collision). For reliable integrity verification, SHA-256 or SHA-3 should be used instead."},
{q:"An organization's payroll system requires a manager from outside the payroll team to approve transactions above $50,000. Which of the following security principles does this approval requirement represent?",o:["Least privilege","Separation of duties","Defense in depth","Role-based access control"],a:1,dm:"Identity & Access",e:"Requiring a second approver from outside the originating team for high-value transactions enforces separation of duties — no single person can both initiate and approve a fraudulent transaction, requiring collusion."},
{q:"A company requires that all mobile devices accessing corporate email have screen lock enabled, be encrypted, and can be remotely wiped if lost or stolen. Which of the following technologies enforces these requirements?",o:["EDR (Endpoint Detection and Response)","MDM (Mobile Device Management)","DLP (Data Loss Prevention)","NAC (Network Access Control)"],a:1,dm:"Security Operations",e:"MDM enforces device security policies across managed mobile devices — including screen lock requirements, encryption, remote wipe, app management, and compliance baselines — for both corporate and BYOD devices."},
{q:"Which of the following BEST describes the concept of defense in depth?",o:["Using the single strongest security control available for each threat","Applying multiple overlapping layers of security controls so if one fails others continue to protect","Focusing all security resources on perimeter defenses","Using encryption for all data at rest and in transit as the primary strategy"],a:1,dm:"General Security",e:"Defense in depth (layered security) uses multiple independent security controls — perimeter, network, host, application, data layers — so that the failure or bypass of any single control does not expose the organization to compromise."},
{q:"A company recently suffered a breach through an employee who retained access to systems after leaving the organization three months earlier. Which of the following processes would have MOST directly prevented this?",o:["More frequent vulnerability scanning","Implementing MFA on all systems","Timely user account offboarding and de-provisioning","Encrypting all sensitive data at rest"],a:2,dm:"Identity & Access",e:"Offboarding/de-provisioning processes ensure user accounts are promptly disabled and access is revoked when employees leave. Retained access is a common breach vector — MFA cannot protect against a valid account with no time limit."},
{q:"An attacker intercepts a legitimate authentication token transmitted over the network and reuses it to authenticate to the same service hours later. Which of the following attack types does this describe?",o:["Credential stuffing","Man-in-the-middle","Replay attack","Pass-the-hash"],a:2,dm:"Threats & Malware",e:"A replay attack captures a valid authentication token or session message and retransmits it later to gain unauthorized access. Timestamps, nonces, and short token lifetimes in session design prevent replay attacks."},
{q:"Which of the following BEST describes the purpose of an acceptable use policy (AUP)?",o:["Defines technical controls for endpoint security configuration","Specifies permitted and prohibited uses of organizational IT resources by employees","Outlines the steps to follow during a security incident response","Describes the encryption standards required for data protection"],a:1,dm:"Governance & Risk",e:"An AUP is an administrative policy clearly defining what constitutes authorized and unauthorized use of organizational IT systems, networks, and data — setting expectations and providing the basis for enforcement action."},
{q:"A penetration tester is given full documentation including network diagrams, IP ranges, and system credentials before beginning the engagement. Which of the following testing approaches does this describe?",o:["Unknown environment (black box)","Partially known environment (gray box)","Known environment (white box)","Passive reconnaissance only"],a:2,dm:"Governance & Risk",e:"A known environment (white box) test provides the tester with complete information about the target, maximizing test depth and coverage. It simulates an insider threat or a scenario where the attacker has obtained full network documentation."},
{q:"After completing eradication of malware from infected systems, the incident response team wants to verify no remnants remain and monitor systems before returning them to production. Which incident response phase does this describe?",o:["Detection","Containment","Recovery","Lessons learned"],a:2,dm:"Incident Response",e:"The recovery phase involves restoring systems to normal operation — validating threats are eliminated, restoring from clean backups if needed, applying patches, and monitoring closely before declaring systems production-ready."},
{q:"Which of the following is the MOST relevant security check to be performed before embedding third-party libraries in developed code?",o:["Check to see if the third party has resources to create dedicated development and staging environments.","Read multiple penetration-testing reports for environments running software that reused the library.","Assess existing vulnerabilities affecting the third-party code and the remediation efficiency of the libraries' developers.","Verify the number of companies that downloaded the third-party code and the number of contributions on the code repository."],a:2,dm:"Application Security",e:"The most relevant check is assessing known vulnerabilities in the library and how responsively its maintainers patch them — that directly measures the risk the dependency introduces, unlike download counts or unrelated pen-test reports."},
{q:"Nikki wants to implement remote access for employees at her organization to work from home during a pandemic. Which of the following should she ensure the remote access solution uses?",o:["Session key","Digital signatures","Pepper","Hashing"],a:0,dm:"Cryptography",e:"A unique session key per connection provides perfect forward secrecy for the remote access tunnel, so a compromise of one session doesn't expose past or future sessions."},
{q:"A company needs to validate its updated incident response plan using a real-world scenario that will test decision points and relevant incident response actions without interrupting daily operations. Which of the following would BEST meet the company's requirements?",o:["Capture-the-flag exercise","Red-team exercise","Tabletop exercise","Phishing exercise"],a:2,dm:"Security Operations",e:"A tabletop exercise is discussion-based — the team walks through the scenario verbally — so it validates the plan without touching live systems or interrupting operations."},
{q:"Theo needs to choose a symmetric encryption algorithm for a new application that he is developing. Which of the following might be an acceptable option?",o:["PGP","AES","SHA","RSA"],a:1,dm:"Cryptography",e:"AES is the standard symmetric encryption algorithm. PGP is an encryption program (not itself a symmetric algorithm), SHA is a hashing function, and RSA is asymmetric."},
{q:"Sanjay has just posted signage at the driveway to the company's offices that trespassing is prohibited and that unauthorized persons will be prosecuted to the fullest extent of the law. Which of the following types of controls has he put into place?",o:["Deterrent","Corrective","Technical","Detective"],a:0,dm:"General Security",e:"Warning signage discourages an action without physically blocking or detecting it — that's the definition of a deterrent control."},
{q:"Security analysts are conducting an investigation of an attack that occurred inside the organization's network. An attacker was able to collect network traffic between workstations throughout the network. The analysts review the Layer 2 address table and find hundreds of entries similar to normal ones. Which of the following attacks has MOST likely occurred?",o:["DNS spoofing","ARP poisoning","SQL Injection","MAC flooding"],a:3,dm:"Network Security",e:"Flooding a switch's CAM (Layer 2 address) table with huge numbers of bogus entries forces it to fail open and broadcast traffic to every port like a hub, letting the attacker sniff traffic between other hosts."},
{q:"Dylan wants to ensure that users in his organization can verify that an e-mail was sent by another user in the organization and that the contents of the e-mails have not been modified or compromised in transit. Which of the following might he choose to implement?",o:["Digital signature","Email Encryption","Collisions","Steganography"],a:0,dm:"Cryptography",e:"A digital signature (sign with the sender's private key, verify with their public key) provides both integrity — proof the content wasn't altered — and authentication/non-repudiation of the sender."},
{q:"Fictional Corp wants to install a lighting system in the hallways that will automatically turn off when nobody is present. Which of the following might be used in conjunction with the lighting system to provide this capability?",o:["Diameter","Motion detection","RADIUS","Asset tracking tags"],a:1,dm:"Physical Security",e:"Motion detection sensors are what trigger automatic lighting to turn off when no movement is detected in an area."},
{q:"Patty is performing an annual review on the company's disaster recovery and continuity of operations plans. She sees a requirement that if something were to happen to the company's main data center, another data center can take over the traffic and provide the necessary services within 48 hours. Which of the following describes the type of solution required by Patty's company?",o:["Cold site","Warm site","Hot site","Mobile site"],a:1,dm:"Resilience & Recovery",e:"A warm site has some pre-installed equipment and can typically be brought online within roughly a day to a couple of days — matching a 48-hour requirement. Hot sites fail over in minutes; cold sites take much longer."},
{q:"Several non-profit agencies have offered to help provide support and services to an area recently hit by a major hurricane. To coordinate resources between them for this and future efforts, they decide to set up a shared cloud solution. Which of the following BEST describes the type of cloud they are looking at implementing?",o:["Hybrid","Private","Community","Public"],a:2,dm:"Cloud Security",e:"A community cloud is shared by several organizations with common concerns or goals — here, multiple non-profits coordinating disaster response — distinguishing it from a single-tenant private cloud or a fully open public cloud."},
{q:"Which of the following technologies would prevent someone from plugging in a switch and connecting an ethernet cable to a standard wall outlet where the switch would then affect the spanning tree architecture of the network?",o:["Root guard","Flood guard","Honeypot","BPDU Guard"],a:3,dm:"Network Security",e:"BPDU Guard disables a port the instant it receives a Bridge Protocol Data Unit, preventing an unauthorized switch plugged into an access port from participating in — and disrupting — the spanning tree topology."},
{q:"Fictional Corp wants to migrate some of the servers in their data center to virtual machines residing on a cloud service provider. Which of the following services are they looking to use?",o:["SaaS","DRaaS","PaaS","IaaS"],a:3,dm:"Cloud Security",e:"Migrating existing servers to provider-hosted virtual machines — where the customer still manages the OS and above — is Infrastructure as a Service."},
{q:"A large multinational company wants to ensure that in the case of a disaster at their main data center, another data center can go live within an hour. Which of the following describes the type of solution that would best suit their needs?",o:["Cold site","Hot site","Mobile site","Warm site"],a:1,dm:"Resilience & Recovery",e:"A one-hour failover requirement calls for a hot site — a fully operational duplicate facility with real-time data replication that can take over almost immediately."},
{q:"Brian is planning the backup schedule for a new CRM. He schedules a complete backup every Sunday at 1am. Every day after that, anything changed since Sunday is backed up. Each hour throughout the day, anything changed since the last backup of any kind is backed up. Which of the following describes the backup that runs every hour except for the daily backups at 1am?",o:["Incremental backup","Differential backup","Partial backup","Full Backup"],a:0,dm:"Resilience & Recovery",e:"Backing up whatever changed since the last backup of ANY kind (full, differential, or incremental) is the definition of an incremental backup, as opposed to a differential backup which always references the last full backup."},
{q:"Larry has installed a new rack full of servers, each with two power supplies. He wants to ensure that none of the servers lose power if one of the breakers trips due to overloading. Which of the following might he ensure is in place for this rack?",o:["Redundant switch","Redundant hard drive","Backup generator","Redundant power circuits"],a:3,dm:"Resilience & Recovery",e:"Each power supply should be plugged into a separate circuit/breaker (redundant power circuits) — a generator only helps during a full utility outage, not a single tripped breaker."},
{q:"Trey has been put in charge of disaster recovery planning. He wants to plan for a worst-case scenario without a large budget, and decides to find an empty building he can lease with the proper utility hookups ready to go in case they need to resort to another data center. Which of the following describes the type of site he plans on using?",o:["Cold site","Warm site","Hot site","Mobile site"],a:0,dm:"Resilience & Recovery",e:"An empty leased space with utilities ready but no equipment installed — cheapest option, longest activation time — is the definition of a cold site."},
{q:"Ben has just made a minor change to the code for one of the company's applications. It tested fine on his machine and in the development environment, but when copied to production something wasn't working and there were errors all over the pages. He manually reverted the change and copied the file back to production. Which of the following, had it been in place, could have saved him a lot of extra effort?",o:["Version control","Deny list to prevent certain people from copying to production","Allow list for who is allowed to copy to production","Unknown Testing Environment"],a:0,dm:"Application Security",e:"Version control would let him roll back to the previous working revision instantly instead of manually reconstructing the prior state by hand."},
{q:"Christina is trying to decide how best to store hashes of user passwords for an application. She feels that just using the standard SHA1 algorithm may not be strong enough. Which of the following might she add to the password being hashed?",o:["Collision","MD5","Ephemeral key","Salt"],a:3,dm:"Cryptography",e:"Adding a salt — a unique random value per password — before hashing defeats precomputed rainbow table attacks and makes identical passwords produce different hashes."},
{q:"Which of the following hashing algorithms will provide a hash with the longest bit length?",o:["MD5","3DES","SHA","AES"],a:2,dm:"Cryptography",e:"MD5 produces a 128-bit digest, while SHA (particularly SHA-512) can produce up to 512 bits — the longest among these options. 3DES and AES are encryption ciphers, not hashing algorithms."},
{q:"Krista has just installed a new firewall at the perimeter of her company's network. Which of the following categories of controls does this fall under?",o:["Deterrent","Administrative","Technical","Compensating"],a:2,dm:"General Security",e:"A firewall is a technology-based control that enforces rules automatically — the definition of a technical control."},
{q:"Adele wants to deploy a certificate to cover her company's top-level domain name as well as any subdomains. Which of the following types of certificates might she choose to deploy?",o:["Wildcard","Pinned","Stapled","Extended Validation"],a:0,dm:"Cryptography",e:"A wildcard certificate (e.g. *.example.com) covers the base domain and all of its first-level subdomains under a single certificate."},
{q:"A cybersecurity researcher has just received a sample file from an infected system that his company's antimalware scanner did not detect. Which of the following is most likely the type of malware that he has received a copy of?",o:["End of life","False positive","Memory leak","Zero day"],a:3,dm:"Threats & Malware",e:"Malware that evades an up-to-date antimalware scanner is most likely exploiting a previously unknown (zero-day) technique the vendor hasn't yet built signatures or heuristics for."},
{q:"Which of the following is the MOST effective way to detect security flaws present in third-party libraries embedded in software before it is released into production?",o:["Employ different techniques for server- and client-side validations","Implement a vulnerability scan to assess dependencies earlier on the SDLC","Increase the number of penetration tests before software release","Use a different version control system for third-party libraries"],a:1,dm:"Application Security",e:"Running dependency vulnerability scans (software composition analysis) earlier in the SDLC catches known-vulnerable third-party libraries before they reach production — far more targeted than generic pen testing."},
{q:"Jerry is reviewing the results of a site survey he performed by walking the building and looking for wireless access points, their SSID, and power level. He filters to only show the SSID his company uses, but notices one device has a different OUI, even though his company has standardized their equipment. Which of the following appears to describe what Jerry has found?",o:["Man in the middle attack","Evil twin","ARP Poisoning","Rogue access points"],a:1,dm:"Network Security",e:"A device broadcasting the company's own SSID but with hardware from a different (non-standardized) manufacturer is impersonating the legitimate network — the definition of an evil twin access point."},
{q:"Which of the following is used to send annoying, unsolicited messages to mobile devices over Bluetooth?",o:["Blueboxing","Bluejacking","Bluetoning","Bluesnarfing"],a:1,dm:"Threats & Malware",e:"Bluejacking is sending unsolicited messages to Bluetooth-enabled devices. Bluesnarfing, by contrast, involves stealing data from the device rather than sending messages."},
{q:"Brett has a special tool that lets him see what access points are around while doing a site survey to determine if any areas need another WAP installed. Walking around the office, he notices a WAP underneath an employee's desk. Which of the following would this be considered?",o:["Evil twin","Spoofing","Man in the middle","Rogue access point"],a:3,dm:"Network Security",e:"An unauthorized access point physically connected to the network — without impersonating an existing SSID — is a rogue access point, commonly installed unknowingly by employees for convenience."},
{q:"Tobias has written a script that asks a user to enter a zip code and stores that information in a 2-byte field in a database. However, anytime a user enters the zip code 90210 for Beverly Hills, the system returns an error. Which of the following is the cause of that error?",o:["Buffer overflow","String overflow","Memory overflow","Integer Overflow"],a:3,dm:"Application Security",e:"A 2-byte field can't hold a numeric value as large as 90210, causing an integer overflow when the value exceeds the field's maximum representable size."},
{q:"Barrett has contacted the CFO's office in an attempt to elicit information about the company's banking relationships. Which of the following might BEST describe what Barrett was doing?",o:["Tailgating","Whaling","Phishing","Shoulder surfing"],a:1,dm:"Social Engineering",e:"Targeting a specific high-value individual (the CFO's office) to elicit sensitive financial information is whaling — spear phishing aimed specifically at executives."},
{q:"Teddy was able to get a copy of the /etc/shadow file of a Linux system that all of an organization's users log into. Which of the following would be the best way to help him discover users' passwords?",o:["Rainbow tables","Dictionary Attack","Birthday Attack","Brute force Attack"],a:1,dm:"Cryptography",e:"A dictionary attack — trying real words and common password variants against the extracted hashes — is typically the most efficient practical approach against real-world user passwords, especially if salting limits rainbow table effectiveness."},
{q:"The field engineers for a large organization carry laptops as they travel, connecting to the internet from client sites, home, coffee shops, hotels, or other public WiFi hotspots. Which of the following should the company ensure is installed on their laptops to protect them from an unauthorized party attempting to access data on the laptops from one of these networks?",o:["HIPS","WAF","DRP","Antivirus"],a:0,dm:"Network Security",e:"A Host-based Intrusion Prevention System protects the laptop itself from network-based attacks regardless of which untrusted network it's connected to — a WAF protects web applications, not endpoints."},
{q:"Which of the following types of attacks may be used if an attacker wants to sniff the packets involved in a WPA 4-way handshake for a user that has already connected to the network?",o:["Spoofing attack","Man in the middle attack","Phishing attack","Dissociation Attack"],a:3,dm:"Network Security",e:"Forcing an already-connected client to disconnect and reconnect (a deauthentication/dissociation attack) makes it perform the 4-way handshake again, which the attacker can then capture."},
{q:"Jane has designed a new application. Upon initial testing, she discovered that certain functions are failing because a prior function that was supposed to run first is taking longer than expected to complete. Which of the following is most likely causing this issue?",o:["Lack of vendor support","Race conditions","End of life system","Lack of security controls"],a:1,dm:"Application Security",e:"A race condition occurs when correct behavior depends on the timing/order of operations — here, a function running out of its expected sequence because a dependency took longer than assumed."},
{q:"Which of the following may be used by a router to block certain networks from transmitting information to other networks?",o:["TACACS+","ACLs","Certificates","LDAP"],a:1,dm:"Network Security",e:"Access Control Lists on a router define rules that permit or deny traffic between specific networks."},
{q:"Meredith has been tasked with implementing a method by which encryption keys can be shared over a public network for her organization. Which of the following options might she choose?",o:["ECDHE","3DES","RSA","CBC"],a:0,dm:"Cryptography",e:"ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) is a key exchange protocol specifically designed to let two parties establish a shared secret over a public, untrusted network while also providing perfect forward secrecy."},
{q:"Kayla has just received the designs for the new building her company is moving into. She requested that several technology storage areas have deadbolt locks installed to prevent unauthorized access, but still make it easy enough to hand off a key to someone who legitimately needs access. Which of the following describes the control type she chose for the storage areas?",o:["Managerial","Operational","Physical","Technical"],a:2,dm:"General Security",e:"A deadbolt lock is a tangible, physical barrier controlling access to a space — the definition of a physical control."},
{q:"Sidney is receiving reports that users are having trouble connecting to her company's FTP server. She opens a packet sniffer and sees packets going to the FTP server with the SYN flag set, and replies from the server with SYN and ACK set — but never a final ACK sent by the original source IP. Which of the following describes the situation Sidney has discovered?",o:["Spoofing","Man in the middle attack","Evil twin","DoS"],a:3,dm:"Threats & Malware",e:"Half-open connections that never complete the TCP handshake — SYN sent, SYN/ACK received, but no final ACK — is the signature of a SYN flood, a form of Denial of Service attack."},
{q:"Philip is making plans to upgrade an application server used by multiple teams worldwide. As part of the upgrade there will be a small amount of downtime he needs to advertise to certain teams. Which of the following does he need to incorporate into his communication plan?",o:["Backout plan","Diagrams of system interconnection","A maintenance window","Dependencies involved in the upgrade"],a:2,dm:"Governance & Risk",e:"Since the communication itself is about informing teams of expected downtime, the specific scheduled time period — the maintenance window — is what needs to be communicated to them."},
{q:"Peter just returned from a cybersecurity conference where he learned about an IPS that would automatically enact new firewall rules when suspicious traffic was discovered. Which of the following describes the type of control he learned about?",o:["Compensating","Detective","Physical","Corrective"],a:3,dm:"General Security",e:"A control that actively takes remedial action after detecting an issue — here, automatically rewriting firewall rules in response to suspicious traffic — is a corrective control."},
{q:"A large credit bureau has installed a public-facing application that allows certain employees to manage certain aspects of the data it manages. After a large data breach is discovered, it is found that the username and password for the administrator account are admin and admin. Which of the following is most likely the cause of the data breach?",o:["End-of-life system","Resource Exhaustion","Lack of vendor support","Default configuration"],a:3,dm:"Security Operations",e:"Leaving factory-default credentials (admin/admin) unchanged is a default configuration weakness — one of the most common and easily preventable causes of breaches."},
{q:"Kay has just created a lightly protected network situated between the Internet and her company's internal network for the e-mail and web servers that should be accessible by both internal and external users. Which of the following terms describes this new network?",o:["VLAN","Social network","Honeynet","DMZ"],a:3,dm:"Network Security",e:"A buffer network hosting public-facing services between the internet and the internal network is a DMZ (demilitarized zone)."},
{q:"Which of the following categories does ransomware fall into?",o:["Crypto-Malware","Malware","RAT","Backdoor"],a:0,dm:"Threats & Malware",e:"Ransomware is most specifically classified as crypto-malware — malware whose core mechanism is encrypting victim data to extort payment."},
{q:"Bree has received a notification from one of her company's monitoring systems that one of the Internet interfaces is receiving a sudden influx of ICMP echo replies from a large number of external IP addresses. Which of the following is her company most likely facing?",o:["DDOS","Ransomware","DNS Poisoning","Evil twin"],a:0,dm:"Threats & Malware",e:"A flood of unsolicited ICMP echo replies from many external sources is characteristic of a reflected/amplified Distributed Denial of Service attack."},
{q:"Which of the following is a security best practice that ensures the integrity of aggregated log files within a SIEM?",o:["Set up hashing on the source log file servers that complies with local regulatory requirements.","Back up the aggregated log files at least two times a day or as stated by local regulatory requirements.","Write protect the aggregated log files and move them to an isolated server with limited access.","Back up the source log files and archive them for at least six years or in accordance with local regulatory requirements."],a:2,dm:"Security Operations",e:"Write-protecting the aggregated logs and isolating them on a limited-access server directly prevents tampering — that's an integrity control, distinct from backup practices which protect availability."},
{q:"Jon wants to use certificates for a Java application he is developing, but wants to ensure they are not human readable. Which of the following certificate types should he choose?",o:["PEM","CRL","DER","P7B"],a:2,dm:"Cryptography",e:"DER is a binary certificate encoding, unlike PEM which is Base64-encoded ASCII text and is human-readable when opened."},
{q:"A security analyst has been tasked with ensuring all programs deployed into the enterprise have been assessed in a runtime environment. Any critical issues found in the program must be sent back to the developer for verification and remediation. Which of the following BEST describes the type of assessment taking place?",o:["Input validation","Fuzzing","Manual code review","Dynamic code analysis"],a:3,dm:"Application Security",e:"Assessing a program while it executes — in a runtime environment — is the defining characteristic of dynamic code analysis, as opposed to static/manual review of source code."},
{q:"Which of the following is a policy that provides greater depth and breadth of knowledge across an organization?",o:["Asset management policy","Acceptable use policy","Separation of duties policy","Job rotation policy"],a:3,dm:"Governance & Risk",e:"A job rotation policy moves employees through different roles over time, broadening institutional knowledge across the organization while also helping surface fraud that a single long-term role holder might conceal."},
{q:"A systems engineer wants to leverage a cloud-based architecture with low latency between network-connected devices that also reduces the bandwidth required by performing analytics directly on the endpoints. Which of the following would BEST meet the requirements? (Choose two.)",o:["IaaS","Hybrid cloud","Private cloud","SaaS"],a:1,dm:"Cloud Security",e:"Fog computing performs analytics near the edge devices themselves to cut latency and bandwidth, and this is typically implemented as part of a hybrid cloud model that blends local edge processing with centralized cloud resources. (Note: this question originally allowed two correct selections — Fog computing and Hybrid cloud — condensed here to a single-answer format.)"},
{q:"A user's account is constantly being locked out. Upon review, a security analyst found four login attempts one second apart, using passwords aBG23TMV, aBG33TMV, aBG43TMV, and aBG53TMV. Which of the following describes what is occurring?",o:["An attacker is utilizing a rainbow table attack against the account.","An attacker is utilizing a password-spraying attack against the account.","An attacker is utilizing a dictionary attack against the account.","An attacker is utilizing a brute-force attack against the account."],a:3,dm:"Threats & Malware",e:"Rapidly cycling through systematic variations of the same password against a single account — not spreading one password across many accounts — is a brute-force attack."},
{q:"Which of the following processes will eliminate data using a method that will allow the storage device to be reused after the process is complete?",o:["Degaussing","Shredding","Pulverizing","Overwriting"],a:3,dm:"Security Operations",e:"Overwriting the data leaves the physical media intact and reusable, unlike degaussing, shredding, or pulverizing, which all destroy the media itself."},
{q:"Yul, a cybersecurity analyst, has discovered a security breach at his company. It appears malicious actors gained access six months ago and have been able to continuously pivot to other systems to gain additional access. Which of the following BEST describes the type of intrusion he has discovered?",o:["Script Kiddie","Insider threat","APT","Hacktivist"],a:2,dm:"Threat Actors",e:"Months of sustained, stealthy access with ongoing lateral movement is the hallmark of an Advanced Persistent Threat — a well-resourced actor focused on long-term presence rather than a quick smash-and-grab."},
{q:"A CISO has defined resiliency requirements for a new data center architecture: critical fileshares must remain accessible during and after a natural disaster; five percent of hard disks can fail at any time without impacting data; and systems must shut down gracefully when battery levels are below 20%. Which of the following are required to BEST meet these objectives? (Choose three.)",o:["Load balancing","Geographic dispersal","Redundant power supplies","UPS"],a:1,dm:"Resilience & Recovery",e:"Surviving a natural disaster at one site requires geographic dispersal; tolerating disk failures without data loss requires RAID; and a graceful shutdown triggered by battery level requires a UPS with monitoring. (Note: this question originally allowed three correct selections — Geographic dispersal, RAID, and UPS — condensed here to a single-answer format.)"},
];

// ═══════════════════════════════════════
// STATE
// ═══════════════════════════════════════
let ST = { xp:0, lv:1, lvxp:0, bs:0, c:0, s:0, m:0, bw:0, sb:0, dom:[], mod:[], ach:[], modAcc:{}, domAcc:{} };
let streak = 0, spTimer = null;
let fcCards = [], fcI = 0, fcKn = new Set(), fcRv = new Set();
let spPool = [], spI = 0, spC = 0, spAns = [];
let tfPool = [], tfI = 0, tfC = 0, tfAns = [];
let aPool = [], aI = 0, aC = 0, aAns = [], aOpts = [];
let fibPool = [], fibI = 0, fibC = 0, fibAns = [], fibOpts = [];
let mTiles = [], mSel = null, mMat = 0, mDom = 0, mStart = 0, mPairs = [];
let bI = 0, bQ = 0, bHP = 0, pHP = 0, bAns = [], bQs = [];
let dDom = 0, dI = 0, dC = 0, dQ = [], dAns = [];
let svLives = 3, svC = 0, svI = 0, svHist = [], svAns = [], svDrawPool = [], svDrawIdx = 0;
let ptPool = [], ptI = 0, ptC = 0, ptAns = [];
let notesI = 0;
let fpPool = [], fpI = 0, fpC = 0, fpAns = [];
let drillPool = [], drillI = 0, drillC = 0, drillAns = [], drillOpts = [], drillMod = 0;
const FIRST_PREP_EXAM_LENGTH = 90;

// ─── PERSIST ───
// Storage is fully optional and never allowed to crash the app.
// Some browsers/environments (file:// origins, sandboxed iframes,
// strict privacy settings) throw the moment localStorage is even
// *touched*, not just on read/write — so every access is guarded,
// and there's an in-memory fallback so the game still works for
// the current tab even when persistent storage is unavailable.
let _memStore = {};
function storageAvailable() {
  try {
    if (typeof localStorage === 'undefined' || localStorage === null) return false;
    const k = '__sec701_test__';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch (e) {
    return false;
  }
}
const HAS_STORAGE = storageAvailable();

function save() {
  const payload = JSON.stringify({...ST, dom: [...new Set(ST.dom)], mod: [...new Set(ST.mod)], ach: [...new Set(ST.ach)]});
  if (HAS_STORAGE) {
    try { localStorage.setItem('sec701g', payload); return; } catch (e) { /* fall through */ }
  }
  _memStore['sec701g'] = payload;
}
function load() {
  let raw = null;
  if (HAS_STORAGE) {
    try { raw = localStorage.getItem('sec701g'); } catch (e) { raw = null; }
  }
  if (raw == null) raw = _memStore['sec701g'] || null;
  if (!raw) return;
  try {
    const d = JSON.parse(raw);
    if (typeof d.xp !== 'number') return;
    ST = { ...ST, ...d };
    ST.dom = d.dom || [];
    ST.mod = d.mod || [];
    ST.ach = d.ach || [];
    ST.modAcc = d.modAcc || {};
    ST.domAcc = d.domAcc || {};
  } catch (e) { /* ignore corrupt data */ }
}

// ─── XP ───
function addXP(n) {
  ST.xp += n; ST.lvxp += n;
  const need = ST.lv * 120;
  if (ST.lvxp >= need) { ST.lvxp -= need; ST.lv++; showToast('⬆️ Level ' + ST.lv + '!', 'blue'); }
  save(); refreshHeader(); refreshHomeStats();
}
function bumpModAcc(m, ok) {
  if (m === undefined || m === null) return;
  if (!ST.modAcc[m]) ST.modAcc[m] = { c: 0, t: 0 };
  ST.modAcc[m].t++; if (ok) ST.modAcc[m].c++;
}
function bumpDomAcc(d, ok) {
  if (d === undefined || d === null) return;
  if (!ST.domAcc[d]) ST.domAcc[d] = { c: 0, t: 0 };
  ST.domAcc[d].t++; if (ok) ST.domAcc[d].c++;
}
function refreshHeader() {
  const need = ST.lv * 120;
  const fill = document.getElementById('xp-fill');
  const lvn = document.getElementById('lv-num');
  if (fill) fill.style.width = Math.min(100, (ST.lvxp / need) * 100) + '%';
  if (lvn) lvn.textContent = ST.lv;
}
function refreshHomeStats() {
  setT('s-xp', ST.xp); setT('s-str', ST.bs); setT('s-cor', ST.c);
  setT('s-ses', ST.s); setT('s-mas', ST.m); setT('s-bos', ST.bw);
  for (let i = 0; i < 10; i++) {
    const el = document.getElementById('dp-fill-' + i);
    if (el) el.style.width = (ST.mod.includes(i) ? 72 : 0) + '%';
  }
}
function setT(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }

function bumpStreak(ok) {
  if (ok) { streak++; ST.c++; if (streak > ST.bs) ST.bs = streak; }
  else streak = 0;
  const sp = document.getElementById('streak-pill');
  if (sp) sp.textContent = '🔥 ' + streak;
  checkAch(); save(); refreshHomeStats();
}

function showToast(msg, type) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = 'toast show ' + (type || '');
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.className = 'toast'; }, 2700);
}

// ─── ACHIEVEMENTS ───
const ACHS = [
['a10','🎯 First 10 Correct'],['a100','🏆 100 Correct Answers'],
['as5','🔥 5 Streak'],['as10','💥 10 Streak'],['as20','⚡ 20 Streak'],
['aboss','👹 Boss Slayer'],['aacr','🔤 Acronym Master'],
['atf','✅ T/F Champion'],['aall9','🌟 All Modules'],
['asurv','❤️ Survived 10+ in Survival'],['aport','🔌 Port Master'],
['afprep','🎓 First Preparation Passed'],
];
function checkAch() {
  const earn = (id, lbl) => {
    if (!ST.ach.includes(id)) {
      ST.ach.push(id);
      showToast('🏆 ' + lbl, 'blue');
      renderAch();
      save();
    }
  };
  if (ST.c >= 10)   earn('a10',   'First 10 Correct!');
  if (ST.c >= 100)  earn('a100',  '100 Correct Answers!');
  if (ST.bs >= 5)   earn('as5',   '5 Answer Streak!');
  if (ST.bs >= 10)  earn('as10',  '10 Answer Streak!');
  if (ST.bs >= 20)  earn('as20',  '20 Answer Streak!');
  if (ST.bw >= 5)   earn('aboss', 'Boss Slayer!');
  if (ST.mod.filter(x => x < 9).length >= 9) earn('aall9', 'All 9 Modules!');
}
function renderAch() {
  const el = document.getElementById('ach-row');
  if (!el) return;
  el.innerHTML = ACHS.map(([id, lbl]) =>
    '<div class="ach' + (ST.ach.includes(id) ? ' earned' : '') + '">' + lbl + '</div>'
  ).join('');
}

// ─── NAVIGATION ───
function showHome() {
  clearInterval(spTimer);
  const hs = document.getElementById('home-screen');
  const gs = document.getElementById('game-screen');
  if (hs) hs.style.display = 'block';
  if (gs) gs.style.display = 'none';
  refreshHomeStats();
}
function showGame(title) {
  const hs = document.getElementById('home-screen');
  const gs = document.getElementById('game-screen');
  const gt = document.getElementById('game-title');
  if (hs) hs.style.display = 'none';
  if (gs) gs.style.display = 'block';
  if (gt) gt.textContent = title;
  streak = 0;
  const sp = document.getElementById('streak-pill');
  if (sp) sp.textContent = '🔥 0';
  ST.s++; save();
}
function setProg(cur, tot) {
  const pf = document.getElementById('prog-fill');
  const pl = document.getElementById('prog-lbl');
  if (pf) pf.style.width = (tot > 0 ? (cur / tot) * 100 : 0) + '%';
  if (pl) pl.textContent = cur + ' / ' + tot;
}
function setBody(html) {
  const el = document.getElementById('game-body');
  if (el) el.innerHTML = html;
}
function shuf(arr) { return [...arr].sort(() => Math.random() - 0.5); }
// Shared Back/Next navigation row for question-based modes.
function navRowHtml(canBack, showNext, isLast) {
  return '<div style="display:flex;gap:.5rem;justify-content:center;margin-top:.8rem">' +
    (canBack ? '<button class="btn-res secondary" id="qa-back">← Back</button>' : '') +
    (showNext ? '<button class="btn-res primary" id="qa-next">' + (isLast ? 'Finish' : 'Next →') + '</button>' : '') +
    '</div>';
}
function wireNav(onBack, onNext) {
  const qb = document.getElementById('qa-back');
  if (qb) qb.addEventListener('click', onBack);
  const qn = document.getElementById('qa-next');
  if (qn) qn.addEventListener('click', onNext);
}
// Renders one answer option. If chosenIdx is null the button is live/clickable.
// If chosenIdx is set (question already answered) it renders highlighted + disabled.
function optBtnHtml(i, text, correctIdx, chosenIdx, btnClass) {
  let cls = btnClass;
  if (chosenIdx !== null && chosenIdx !== undefined) {
    if (i === correctIdx) cls += ' correct';
    else if (i === chosenIdx) cls += ' wrong';
  }
  return '<button class="' + cls + '" data-i="' + i + '"' + (chosenIdx !== null && chosenIdx !== undefined ? ' disabled' : '') + '>' + text + '</button>';
}
// Small caption connecting an exam domain to the course modules whose content maps into it.
function moduleBridgeHtml(domainIdx) {
  const mods = DOMAIN_MODULES[domainIdx];
  if (!mods || !mods.length) return '';
  const names = mods.map(m => MODULES[m].replace(' — Mixed Review', '')).join(', ');
  return '<div style="font-size:10px;color:#8b91b0;margin-top:2px">Covers your modules: ' + names + '</div>';
}

// ─── BUILD HOME ───
function buildHome() {
  const modes = [
    { id:'flash', ic:'🃏', t:'Flashcards',       d:'145 cards with definitions and real examples.', b:'145 cards', cls:'badge-info'  },
    { id:'speed', ic:'⚡', t:'Speed Round',       d:'15 seconds per question. Build streaks for bonus XP.', b:'Timed', cls:'badge-info' },
    { id:'tf',    ic:'✅', t:'True / False',      d:'25 tricky statements testing common misconceptions.', b:'Quick', cls:'badge-info' },
    { id:'acr',   ic:'🔤', t:'Acronym Blitz',     d:'Every acronym on the SY0-701 exam, with a short definition after each answer.', b:'50 acr.', cls:'badge-info' },
    { id:'fib',   ic:'📝', t:'Fill the Blank',    d:'Complete the definition or scenario from context.', b:'Scenario', cls:'badge-info' },
    { id:'match', ic:'🔗', t:'Match It',          d:'Match terms to definitions. All 9 course modules.', b:'Memory', cls:'badge-info' },
    { id:'drill', ic:'🎯', t:'Focused Drill',     d:'Deep-dive one module — term-matching straight from its flashcards.', b:'NEW', cls:'badge-new' },
    { id:'weak',  ic:'📊', t:'Weak Areas',        d:'See your accuracy by module and by exam domain.', b:'Insights', cls:'badge-new' },
    { id:'boss',  ic:'👾', t:'Boss Quiz',         d:'5 domain bosses, HP scaled to real exam weighting.', b:'5 Bosses', cls:'badge-info' },
    { id:'dex',   ic:'📋', t:'Domain Exam',       d:'Scenario questions per domain, scaled to real exam weighting. Scored like the real test.', b:'NEW', cls:'badge-new' },
    { id:'surv',  ic:'❤️', t:'Survival Mode',     d:'3 lives. Answer until you run out. Beat your score.', b:'NEW', cls:'badge-new' },
    { id:'ports', ic:'🔌', t:'Ports & Protocols', d:'Which service runs on that port? Heavily tested on SY0-701.', b:'NEW', cls:'badge-new' },
    { id:'notes', ic:'📚', t:'Study Notes',       d:'Full reference sheet for all 9 course modules. Read before testing.', b:'Ref', cls:'badge-info' },
    { id:'firstprep', ic:'🎓', t:'First Preparation', d:'90-question full mock exam pulled from a 139-question bank, scenario-style.', b:'90 Q', cls:'badge-new' },
  ];
  const mg = document.getElementById('mode-grid');
  if (!mg) throw new Error('mode-grid element not found in DOM — check index.html structure');
  mg.innerHTML = modes.map(m =>
    '<div class="mode-card" data-mode="' + m.id + '">' +
    '<span class="mode-icon">' + m.ic + '</span>' +
    '<div class="mode-title">' + m.t + '</div>' +
    '<div class="mode-desc">' + m.d + '</div>' +
    '<div class="mode-badge ' + m.cls + '">' + m.b + '</div>' +
    '</div>'
  ).join('');
  mg.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => startMode(card.getAttribute('data-mode')));
  });

  const dg = document.getElementById('domain-grid');
  if (dg) {
    dg.innerHTML = MODULES.map((mn, i) =>
      '<div class="domain-pill" data-d="' + i + '">' +
      '<div class="dn">' + (i < 9 ? 'Module ' + (i+1) : 'Module 10') + '</div>' +
      '<div class="dt">' + mn + '</div>' +
      '<div class="ds">' + (i < 9 ? 'Click to study flashcards' : 'Mixed review — pulls from every module') + '</div>' +
      '<div class="dp"><div class="dpf" id="dp-fill-' + i + '" style="width:0%"></div></div>' +
      '</div>'
    ).join('');
    dg.querySelectorAll('.domain-pill').forEach(pill => {
      pill.addEventListener('click', () => startDomainFlash(parseInt(pill.getAttribute('data-d'))));
    });
  }

  renderAch();
}

function startMode(m) {
  if      (m === 'flash')  startFlash([...CARDS]);
  else if (m === 'speed')  startSpeed();
  else if (m === 'tf')     startTF();
  else if (m === 'acr')    startAcr();
  else if (m === 'fib')    startFIB();
  else if (m === 'match')  startMatch(0);
  else if (m === 'drill')  showDrillSelect();
  else if (m === 'weak')   showWeakAreas();
  else if (m === 'boss')   showBossSelect();
  else if (m === 'dex')    showDexSelect();
  else if (m === 'surv')   startSurv();
  else if (m === 'ports')  startPorts();
  else if (m === 'notes')  startNotes();
  else if (m === 'firstprep') startFirstPrep();
}
function startDomainFlash(d) {
  if (!ST.mod.includes(d)) { ST.mod.push(d); save(); }
  startFlash(d < 9 ? CARDS.filter(c => c.m === d) : [...CARDS]);
}

// ─── FOCUSED MODULE DRILL ───
// Term-matching quiz auto-generated from a single module's flashcards — deep-dive practice
// without needing separately-authored content per module.
function showDrillSelect() {
  showGame('🎯 Focused Drill');
  setProg(0, 9);
  setBody(
    '<p style="font-size:12px;color:#6b7299;margin-bottom:.9rem">Pick a module to deep-dive — term-matching questions drawn straight from its flashcards.</p>' +
    '<div style="display:flex;flex-direction:column;gap:.5rem">' +
    MODULES.map((mn, i) =>
      '<div class="mode-card" id="drill-sel-' + i + '" style="cursor:pointer">' +
      '<div class="mode-title">' + (i < 9 ? 'Module ' + (i+1) : 'Module 10') + ': ' + mn + '</div>' +
      '<div class="mode-desc">' + (i < 9 ? CARDS.filter(c => c.m === i).length + ' terms in this module' : 'Mixed drill across every module') + '</div>' +
      '</div>'
    ).join('') + '</div>'
  );
  MODULES.forEach((_, i) => {
    const el = document.getElementById('drill-sel-' + i);
    if (el) el.addEventListener('click', () => startDrill(i));
  });
}
function startDrill(m, customPool) {
  drillMod = m;
  drillPool = customPool || shuf(m < 9 ? CARDS.filter(c => c.m === m) : [...CARDS]);
  drillI = 0; drillC = 0; drillAns = []; drillOpts = [];
  showGame('🎯 Drill: ' + MODULES[m]);
  renderDrill();
}
function renderDrill() {
  if (drillI >= drillPool.length) { endDrill(); return; }
  setProg(drillI, drillPool.length);
  const q = drillPool[drillI];
  const ans = drillAns[drillI];
  if (!drillOpts[drillI]) {
    const wrongs = shuf(CARDS.filter(c => c.t !== q.t)).slice(0, 3);
    drillOpts[drillI] = shuf([q, ...wrongs]);
  }
  const opts = drillOpts[drillI];
  const correctIdx = opts.findIndex(o => o.t === q.t);
  setBody(
    '<div class="card">' +
      '<div style="font-size:10px;color:#6b7299;margin-bottom:.4rem">Q' + (drillI+1) + ' of ' + drillPool.length + ' · ' + MODULES[drillMod] + '</div>' +
      '<div class="q-text">Which term matches:<br><i>"' + q.df + '"</i></div>' +
      '<div class="opts-grid" id="drill-opts">' +
        opts.map((o, i) => optBtnHtml(i, o.t, correctIdx, ans ? ans.ch : null, 'opt-btn')).join('') +
      '</div>' +
      '<div class="exp-box' + (ans ? ' show' + (ans.ok ? '' : ' wrong') : '') + '" id="drill-exp">' + (ans ? (ans.ok ? '✓ ' : '✗ ') + q.t + (q.ex ? '<br><span style="font-weight:400">' + q.ex + '</span>' : '') : '') + '</div>' +
    '</div>' +
    navRowHtml(drillI > 0, !!ans, drillI === drillPool.length - 1)
  );
  if (!ans) {
    document.getElementById('drill-opts').querySelectorAll('.opt-btn').forEach(btn => {
      btn.addEventListener('click', () => pickDrill(parseInt(btn.getAttribute('data-i')), correctIdx));
    });
  }
  wireNav(() => { drillI--; renderDrill(); }, () => { drillI++; renderDrill(); });
}
function pickDrill(ch, correctIdx) {
  const q = drillPool[drillI]; const ok = ch === correctIdx;
  if (ok) { drillC++; addXP(10); }
  bumpStreak(ok);
  bumpModAcc(q.m, ok);
  drillAns[drillI] = { ch, ok };
  renderDrill();
}
function endDrill() {
  const pct = Math.round((drillC / drillPool.length) * 100);
  const missed = drillPool.filter((q, i) => drillAns[i] && !drillAns[i].ok);
  setBody(makeResPanel(drillC * 10, pct, drillC + ' / ' + drillPool.length + ' correct',
    MODULES[drillMod] + ' — ' + (pct >= 80 ? 'Strong mastery!' : pct >= 50 ? 'Getting there.' : 'Keep drilling this module.'),
    '<button class="btn-res primary" id="btn-rep">Drill Again</button>' +
    (missed.length > 0 ? '<button class="btn-res secondary" id="btn-miss">Redo Missed (' + missed.length + ')</button>' : '') +
    '<button class="btn-res secondary" id="btn-wk">Weak Areas</button>' +
    '<button class="btn-res secondary" id="btn-hm">Home</button>'
  ));
  document.getElementById('btn-rep').addEventListener('click', () => startDrill(drillMod));
  document.getElementById('btn-wk').addEventListener('click', showWeakAreas);
  document.getElementById('btn-hm').addEventListener('click', showHome);
  if (missed.length > 0) document.getElementById('btn-miss').addEventListener('click', () => startDrill(drillMod, missed));
}

// ─── WEAK AREAS DASHBOARD ───
function showWeakAreas() {
  showGame('📊 Weak Areas');
  setProg(1, 1);
  function barColor(pct) {
    if (pct === null) return '#6b7299';
    if (pct >= 80) return '#22c55e';
    if (pct >= 50) return '#f59e0b';
    return '#ef4444';
  }
  function rowsFor(names, accMap, count) {
    const rows = [];
    for (let i = 0; i < count; i++) {
      const a = accMap[i];
      const pct = a && a.t > 0 ? Math.round(a.c / a.t * 100) : null;
      rows.push({ i, name: names[i], pct, t: a ? a.t : 0 });
    }
    rows.sort((x, y) => (x.pct === null ? -1 : x.pct) - (y.pct === null ? -1 : y.pct));
    return rows;
  }
  const modRows = rowsFor(MODULES, ST.modAcc, 9);
  const domRows = rowsFor(DN, ST.domAcc, 5);
  setBody(
    '<p style="font-size:12px;color:#6b7299;margin-bottom:.9rem">Weakest first. Tap a module to jump straight into a focused drill.</p>' +
    '<div style="font-size:13px;font-weight:700;margin-bottom:.5rem">📚 Module Mastery <span style="font-weight:400;color:#6b7299">(from Flashcards)</span></div>' +
    '<div style="display:flex;flex-direction:column;gap:.4rem;margin-bottom:1.2rem">' +
    modRows.map(r =>
      '<div class="mode-card" id="wk-mod-' + r.i + '" style="cursor:pointer;padding:.65rem .85rem">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:.5rem">' +
      '<div style="font-size:12.5px;font-weight:600">' + r.name + '</div>' +
      '<div style="font-size:12px;color:' + barColor(r.pct) + ';font-weight:700;white-space:nowrap">' + (r.pct === null ? 'Not studied' : r.pct + '%') + '</div>' +
      '</div>' +
      (r.pct !== null ? '<div style="height:5px;background:rgba(255,255,255,.08);border-radius:3px;margin-top:6px;overflow:hidden"><div style="height:100%;width:' + r.pct + '%;background:' + barColor(r.pct) + '"></div></div>' : '') +
      '</div>'
    ).join('') +
    '</div>' +
    '<div style="font-size:13px;font-weight:700;margin-bottom:.5rem">🎯 Domain Readiness <span style="font-weight:400;color:#6b7299">(from Boss Quiz + Domain Exam)</span></div>' +
    '<div style="display:flex;flex-direction:column;gap:.4rem;margin-bottom:1.1rem">' +
    domRows.map(r =>
      '<div class="mode-card" style="padding:.65rem .85rem">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:.5rem">' +
      '<div style="font-size:12.5px;font-weight:600">Domain ' + (r.i+1) + '.0: ' + r.name + '</div>' +
      '<div style="font-size:12px;color:' + barColor(r.pct) + ';font-weight:700;white-space:nowrap">' + (r.pct === null ? 'Not attempted' : r.pct + '%') + '</div>' +
      '</div>' +
      (r.pct !== null ? '<div style="height:5px;background:rgba(255,255,255,.08);border-radius:3px;margin-top:6px;overflow:hidden"><div style="height:100%;width:' + r.pct + '%;background:' + barColor(r.pct) + '"></div></div>' : '') +
      moduleBridgeHtml(r.i) +
      '</div>'
    ).join('') +
    '</div>' +
    '<div style="text-align:center"><button class="btn-res secondary" id="btn-hm">Home</button></div>'
  );
  modRows.forEach(r => {
    const el = document.getElementById('wk-mod-' + r.i);
    if (el) el.addEventListener('click', () => startDrill(r.i));
  });
  document.getElementById('btn-hm').addEventListener('click', showHome);
}

function makeResPanel(xpEarned, pct, title, sub, btns) {
  const cls = pct >= 80 ? 'great' : pct >= 50 ? 'mid' : 'bad';
  return '<div class="res-panel">' +
    '<div class="xp-earned">+' + xpEarned + ' XP earned</div>' +
    '<div class="res-ring ' + cls + '">' + pct + '%</div>' +
    '<h3>' + title + '</h3><p>' + sub + '</p>' +
    '<div class="res-btns">' + btns + '</div></div>';
}

// ─── FLASHCARDS ───
function startFlash(cards) {
  fcCards = shuf(cards); fcI = 0; fcKn = new Set(); fcRv = new Set();
  showGame('🃏 Flashcards'); renderFC();
}
function renderFC() {
  if (fcI >= fcCards.length) { endFlash(); return; }
  setProg(fcI, fcCards.length);
  const c = fcCards[fcI];
  setBody(
    '<div class="fc-wrap"><div class="fc-inner" id="fc-inner">' +
    '<div class="fc-face">' +
      '<div class="fc-label">Tap card to reveal definition</div>' +
      '<div class="fc-domain">' + MODULES[c.m] + '</div>' +
      '<div class="fc-term">' + c.t + '</div>' +
      '<div class="fc-tip">👆 click to flip</div>' +
    '</div>' +
    '<div class="fc-face fc-back">' +
      '<div class="fc-label">Definition</div>' +
      '<div class="fc-domain">' + MODULES[c.m] + '</div>' +
      '<div class="fc-def">' + c.df + '</div>' +
      (c.ex ? '<div class="fc-ex">💡 Example: ' + c.ex + '</div>' : '') +
    '</div>' +
    '</div></div>' +
    '<div class="fc-nav">' +
      (fcI > 0 ? '<button class="btn-fc" id="btn-bk">← Back</button>' : '') +
      '<button class="btn-fc red" id="btn-rv">🔄 Review Again</button>' +
      '<button class="btn-fc" id="btn-sk">Skip</button>' +
      '<button class="btn-fc green" id="btn-kn">✓ Got It!</button>' +
    '</div>' +
    '<div class="fc-counter">Card ' + (fcI+1) + ' of ' + fcCards.length + ' · ✅ ' + fcKn.size + ' known · 🔄 ' + fcRv.size + ' to review</div>'
  );
  const inner = document.getElementById('fc-inner');
  if (inner) inner.addEventListener('click', () => inner.classList.toggle('flipped'));
  const btnBk = document.getElementById('btn-bk');
  if (btnBk) btnBk.addEventListener('click', () => { fcI--; renderFC(); });
  const btnKn = document.getElementById('btn-kn');
  if (btnKn) btnKn.addEventListener('click', () => {
    fcKn.add(fcI); ST.m++; addXP(5); bumpStreak(true); bumpModAcc(c.m, true); fcI++; renderFC();
  });
  const btnRv = document.getElementById('btn-rv');
  if (btnRv) btnRv.addEventListener('click', () => {
    fcRv.add(fcI); bumpStreak(false); bumpModAcc(c.m, false); fcI++; renderFC();
  });
  const btnSk = document.getElementById('btn-sk');
  if (btnSk) btnSk.addEventListener('click', () => { fcI++; renderFC(); });
}
function endFlash() {
  setProg(fcCards.length, fcCards.length);
  const pct = Math.round((fcKn.size / fcCards.length) * 100);
  const sub = fcRv.size > 0 ? fcRv.size + ' cards need more review.' : 'All cards mastered!';
  const revBtn = fcRv.size > 0 ? '<button class="btn-res secondary" id="btn-weak">Weak Cards (' + fcRv.size + ')</button>' : '';
  setBody(makeResPanel(fcKn.size * 5, pct, fcKn.size + ' / ' + fcCards.length + ' mastered', sub,
    '<button class="btn-res primary" id="btn-rep">Shuffle & Repeat</button>' + revBtn + '<button class="btn-res secondary" id="btn-hm">Home</button>'
  ));
  document.getElementById('btn-rep').addEventListener('click', () => startFlash([...fcCards]));
  document.getElementById('btn-hm').addEventListener('click', showHome);
  if (fcRv.size > 0) document.getElementById('btn-weak').addEventListener('click', () =>
    startFlash(fcCards.filter((_, i) => fcRv.has(i)))
  );
}

// ─── SPEED ROUND ───
function startSpeed(customPool) {
  spPool = customPool || shuf([...SPEED]).slice(0, 20); spI = 0; spC = 0; spAns = [];
  showGame('⚡ Speed Round'); renderSpeed();
}
function renderSpeed() {
  clearInterval(spTimer);
  if (spI >= spPool.length) { endSpeed(); return; }
  setProg(spI, spPool.length);
  const q = spPool[spI];
  const ans = spAns[spI];
  const live = !ans;
  let t = 15;
  setBody(
    (ans ? '<div class="feedback-bar show ' + (ans.ok ? 'ok' : 'bad') + '">' + (ans.ok ? '✓ Correct! +' + ans.pts + ' XP' : (ans.ch === -1 ? '⏰ Time out!' : '✗ Wrong!')) + '</div>' : '<div class="feedback-bar" id="fdb"></div>') +
    '<div class="card">' +
      '<div class="timer-row"><div class="t-bar"><div class="t-fill" id="t-fill"></div></div><div class="t-num" id="t-num">' + (live ? 15 : '—') + '</div></div>' +
      '<div class="q-text">' + q.q + '</div>' +
      '<div class="opts-grid" id="opts-grid">' +
        q.o.map((o, i) => optBtnHtml(i, o, q.a, live ? null : ans.ch, 'opt-btn')).join('') +
      '</div>' +
      '<div class="exp-box' + (ans ? ' show' + (ans.ok ? '' : ' wrong') : '') + '" id="exp">' + (ans && !ans.ok ? '🔥 Correct answer: ' + q.o[q.a] : (ans ? '🔥 Streak: ' + ans.streakAtTime : '')) + '</div>' +
    '</div>' +
    '<div style="text-align:center;font-size:11px;color:#6b7299">Q' + (spI+1) + ' of ' + spPool.length + ' · Score: ' + spC + '</div>' +
    navRowHtml(spI > 0, !live, spI === spPool.length - 1)
  );
  if (live) {
    document.getElementById('opts-grid').querySelectorAll('.opt-btn').forEach(btn => {
      btn.addEventListener('click', () => pickSpeed(parseInt(btn.getAttribute('data-i'))));
    });
    spTimer = setInterval(() => {
      t--;
      const tf = document.getElementById('t-fill'), tn = document.getElementById('t-num');
      if (tf) { tf.style.width = (t / 15 * 100) + '%'; if (t <= 5) tf.className = 't-fill warn'; }
      if (tn) { tn.textContent = t; if (t <= 5) tn.classList.add('warn'); }
      if (t <= 0) { clearInterval(spTimer); pickSpeed(-1); }
    }, 1000);
  }
  wireNav(() => { spI--; renderSpeed(); }, () => { spI++; renderSpeed(); });
}
function pickSpeed(ch) {
  clearInterval(spTimer);
  const q = spPool[spI]; const ok = ch === q.a;
  const bon = streak >= 5 ? 15 : streak >= 3 ? 8 : 0;
  const pts = ok ? 10 + bon : 0;
  if (ok) spC++;
  bumpStreak(ok);
  if (pts > 0) addXP(pts);
  spAns[spI] = { ch, ok, pts, streakAtTime: streak };
  renderSpeed();
}
function endSpeed() {
  const pct = Math.round((spC / spPool.length) * 100);
  const missed = spPool.filter((q, i) => spAns[i] && !spAns[i].ok);
  setBody(makeResPanel(spC * 10, pct, spC + ' / ' + spPool.length + ' correct', 'Best streak: ' + ST.bs + ' 🔥',
    '<button class="btn-res primary" id="btn-rep">Play Again</button>' +
    (missed.length > 0 ? '<button class="btn-res secondary" id="btn-miss">Redo Missed (' + missed.length + ')</button>' : '') +
    '<button class="btn-res secondary" id="btn-hm">Home</button>'
  ));
  document.getElementById('btn-rep').addEventListener('click', () => startSpeed());
  document.getElementById('btn-hm').addEventListener('click', showHome);
  if (missed.length > 0) document.getElementById('btn-miss').addEventListener('click', () => startSpeed(missed));
}

// ─── TRUE / FALSE ───
function startTF(customPool) { tfPool = customPool || shuf([...TF]); tfI = 0; tfC = 0; tfAns = []; showGame('✅ True or False'); renderTF(); }
function renderTF() {
  if (tfI >= tfPool.length) { endTF(); return; }
  setProg(tfI, tfPool.length);
  const q = tfPool[tfI];
  const ans = tfAns[tfI];
  setBody(
    '<div class="card">' +
      '<div style="font-size:10px;color:#6b7299;margin-bottom:.4rem">Q' + (tfI+1) + ' of ' + tfPool.length + '</div>' +
      '<div class="tf-q">' + q.q + '</div>' +
      '<div class="tf-btns">' +
        '<button class="tf-btn t' + (ans ? (q.a===true?' correct':(ans.ch===true?' wrong':'')) : '') + '" id="btn-t"' + (ans?' disabled':'') + '>✓ TRUE</button>' +
        '<button class="tf-btn f' + (ans ? (q.a===false?' correct':(ans.ch===false?' wrong':'')) : '') + '" id="btn-f"' + (ans?' disabled':'') + '>✗ FALSE</button>' +
      '</div>' +
      '<div class="tf-exp' + (ans ? ' show' : '') + '" id="tf-exp">' + (ans ? '<strong>' + (ans.ok ? '✓ Correct!' : '✗ Incorrect.') + '</strong> ' + q.e : '') + '</div>' +
    '</div>' +
    navRowHtml(tfI > 0, !!ans, tfI === tfPool.length - 1)
  );
  if (!ans) {
    document.getElementById('btn-t').addEventListener('click', () => pickTF(true));
    document.getElementById('btn-f').addEventListener('click', () => pickTF(false));
  }
  wireNav(() => { tfI--; renderTF(); }, () => { tfI++; renderTF(); });
}
function pickTF(ch) {
  const q = tfPool[tfI]; const ok = ch === q.a;
  if (ok) { tfC++; addXP(8); }
  bumpStreak(ok);
  tfAns[tfI] = { ch, ok };
  renderTF();
}
function endTF() {
  const pct = Math.round((tfC / tfPool.length) * 100);
  const missed = tfPool.filter((q, i) => tfAns[i] && !tfAns[i].ok);
  if (pct >= 90 && !ST.ach.includes('atf')) { ST.ach.push('atf'); showToast('🏆 T/F Champion!', 'blue'); renderAch(); save(); }
  setBody(makeResPanel(tfC * 8, pct, tfC + ' / ' + tfPool.length + ' correct',
    pct >= 80 ? 'Excellent conceptual understanding!' : pct >= 50 ? 'Review the incorrect ones.' : 'Study flashcards then retry.',
    '<button class="btn-res primary" id="btn-rep">Play Again</button>' +
    (missed.length > 0 ? '<button class="btn-res secondary" id="btn-miss">Redo Missed (' + missed.length + ')</button>' : '') +
    '<button class="btn-res secondary" id="btn-hm">Home</button>'
  ));
  document.getElementById('btn-rep').addEventListener('click', () => startTF());
  document.getElementById('btn-hm').addEventListener('click', showHome);
  if (missed.length > 0) document.getElementById('btn-miss').addEventListener('click', () => startTF(missed));
}

// ─── ACRONYM BLITZ ───
function startAcr(customPool) { aPool = customPool || shuf([...ACRONYMS]).slice(0, 20); aI = 0; aC = 0; aAns = []; aOpts = []; showGame('🔤 Acronym Blitz'); renderAcr(); }
function renderAcr() {
  if (aI >= aPool.length) { endAcr(); return; }
  setProg(aI, aPool.length);
  const q = aPool[aI];
  const ans = aAns[aI];
  if (!aOpts[aI]) {
    const wrongs = shuf(ACRONYMS.filter(x => x.f !== q.f)).slice(0, 3);
    aOpts[aI] = shuf([q, ...wrongs]);
  }
  const opts = aOpts[aI];
  const correctIdx = opts.findIndex(o => o.f === q.f);
  setBody(
    '<div class="card" style="text-align:center">' +
      '<div class="big-text">' + q.a + '</div>' +
      '<div class="cat-text">Category: ' + q.c + '</div>' +
      '<div style="font-size:12px;color:#6b7299;margin-bottom:.7rem">What does <b>' + q.a + '</b> stand for?</div>' +
      '<div class="azopts" id="az-opts">' +
        opts.map((o, i) => optBtnHtml(i, o.f, correctIdx, ans ? ans.ch : null, 'opt-btn')).join('') +
      '</div>' +
      '<div class="exp-box' + (ans ? ' show' + (ans.ok ? '' : ' wrong') : '') + '" id="az-exp">' + (ans ? (ans.ok ? '✓ ' : '✗ ') + q.f + (q.d ? '<br><span style="font-weight:400">' + q.d + '</span>' : '') : '') + '</div>' +
    '</div>' +
    '<div style="text-align:center;font-size:11px;color:#6b7299;margin-top:.4rem">Q' + (aI+1) + ' of ' + aPool.length + ' · Score: ' + aC + '</div>' +
    navRowHtml(aI > 0, !!ans, aI === aPool.length - 1)
  );
  if (!ans) {
    document.getElementById('az-opts').querySelectorAll('.opt-btn').forEach(btn => {
      btn.addEventListener('click', () => pickAcr(parseInt(btn.getAttribute('data-i')), correctIdx));
    });
  }
  wireNav(() => { aI--; renderAcr(); }, () => { aI++; renderAcr(); });
}
function pickAcr(ch, correctIdx) {
  const ok = ch === correctIdx;
  if (ok) { aC++; addXP(10); }
  bumpStreak(ok);
  aAns[aI] = { ch, ok };
  renderAcr();
}
function endAcr() {
  const pct = Math.round((aC / aPool.length) * 100);
  const missed = aPool.filter((q, i) => aAns[i] && !aAns[i].ok);
  if (pct === 100 && !ST.ach.includes('aacr')) { ST.ach.push('aacr'); showToast('🏆 Acronym Master!', 'blue'); renderAch(); save(); }
  setBody(makeResPanel(aC * 10, pct, aC + ' / ' + aPool.length + ' acronyms',
    pct === 100 ? '🏆 Acronym Master unlocked!' : pct >= 80 ? 'Almost perfect!' : 'Acronyms are heavily tested. Keep drilling!',
    '<button class="btn-res primary" id="btn-rep">Play Again</button>' +
    (missed.length > 0 ? '<button class="btn-res secondary" id="btn-miss">Redo Missed (' + missed.length + ')</button>' : '') +
    '<button class="btn-res secondary" id="btn-hm">Home</button>'
  ));
  document.getElementById('btn-rep').addEventListener('click', () => startAcr());
  document.getElementById('btn-hm').addEventListener('click', showHome);
  if (missed.length > 0) document.getElementById('btn-miss').addEventListener('click', () => startAcr(missed));
}

// ─── FILL IN THE BLANK ───
function startFIB(customPool) { fibPool = customPool || shuf([...FIB]); fibI = 0; fibC = 0; fibAns = []; fibOpts = []; showGame('📝 Fill the Blank'); renderFIB(); }
function renderFIB() {
  if (fibI >= fibPool.length) { endFIB(); return; }
  setProg(fibI, fibPool.length);
  const q = fibPool[fibI];
  const ans = fibAns[fibI];
  const disp = q.q.replace(q.b, '<span class="blank">' + '_'.repeat(Math.min(q.b.length, 14)) + '</span>');
  if (!fibOpts[fibI]) fibOpts[fibI] = shuf([...q.o]);
  const opts = fibOpts[fibI];
  const correctIdx = opts.indexOf(q.b);
  setBody(
    '<div class="card">' +
      '<div style="font-size:10px;color:#6b7299;margin-bottom:.35rem">Q' + (fibI+1) + ' of ' + fibPool.length + '</div>' +
      '<div class="fib-q">' + disp + '</div>' +
      '<div class="fib-opts" id="fib-opts">' +
        opts.map((o, i) => optBtnHtml(i, o, correctIdx, ans ? ans.ch : null, 'fib-btn')).join('') +
      '</div>' +
      '<div class="exp-box' + (ans ? ' show' + (ans.ok ? '' : ' wrong') : '') + '" id="fib-exp">' + (ans ? (ans.ok ? '✓ Correct! ' : '✗ Answer: ') + '"' + q.b + '"' : '') + '</div>' +
    '</div>' +
    navRowHtml(fibI > 0, !!ans, fibI === fibPool.length - 1)
  );
  if (!ans) {
    document.getElementById('fib-opts').querySelectorAll('.fib-btn').forEach(btn => {
      btn.addEventListener('click', () => pickFIB(parseInt(btn.getAttribute('data-i')), correctIdx));
    });
  }
  wireNav(() => { fibI--; renderFIB(); }, () => { fibI++; renderFIB(); });
}
function pickFIB(ch, correctIdx) {
  const ok = ch === correctIdx;
  if (ok) { fibC++; addXP(10); }
  bumpStreak(ok);
  fibAns[fibI] = { ch, ok };
  renderFIB();
}
function endFIB() {
  const pct = Math.round((fibC / fibPool.length) * 100);
  const missed = fibPool.filter((q, i) => fibAns[i] && !fibAns[i].ok);
  setBody(makeResPanel(fibC * 10, pct, fibC + ' / ' + fibPool.length + ' correct',
    pct >= 80 ? 'Strong contextual recall!' : pct >= 50 ? 'Review missed terms in flashcards.' : 'Study flashcards first then retry.',
    '<button class="btn-res primary" id="btn-rep">Play Again</button>' +
    (missed.length > 0 ? '<button class="btn-res secondary" id="btn-miss">Redo Missed (' + missed.length + ')</button>' : '') +
    '<button class="btn-res secondary" id="btn-hm">Home</button>'
  ));
  document.getElementById('btn-rep').addEventListener('click', () => startFIB());
  document.getElementById('btn-hm').addEventListener('click', showHome);
  if (missed.length > 0) document.getElementById('btn-miss').addEventListener('click', () => startFIB(missed));
}

// ─── MATCH IT ───
function startMatch(d) {
  mDom = d; mSel = null; mMat = 0; mStart = Date.now(); mPairs = MATCHES[d];
  const tiles = [];
  mPairs.forEach((p, i) => {
    tiles.push({ id: 't' + i, txt: p.t, pair: i, isTerm: true, matched: false });
    tiles.push({ id: 'd' + i, txt: p.d, pair: i, isTerm: false, matched: false });
  });
  mTiles = shuf(tiles);
  showGame('🔗 Match — ' + MODULES[d]);
  setProg(0, mPairs.length);
  renderMatch();
}
function renderMatch() {
  const rows = mTiles.map(tile => {
    let cls = 'match-tile' + (tile.isTerm ? ' term' : '') + (tile.matched ? ' matched' : '');
    return '<div class="' + cls + '" id="mt-' + tile.id + '">' + tile.txt + '</div>';
  }).join('');
  setBody(
    '<p style="font-size:11px;color:#6b7299;margin-bottom:.6rem">Click a term then its matching definition.</p>' +
    '<div class="match-grid" id="match-grid">' + rows + '</div>' +
    '<div style="text-align:center;font-size:11px;color:#6b7299" id="match-ctr">' + mMat + ' / ' + mPairs.length + ' matched</div>' +
    (mDom < 9 ? '<div style="text-align:center;margin-top:.6rem"><button class="btn-fc" id="match-next">Next Module →</button></div>' : '')
  );
  mTiles.forEach(tile => {
    if (!tile.matched) {
      const el = document.getElementById('mt-' + tile.id);
      if (el) el.addEventListener('click', () => clickMatch(tile.id));
    }
  });
  if (mDom < 9) {
    const nb = document.getElementById('match-next');
    if (nb) nb.addEventListener('click', () => startMatch(mDom + 1));
  }
}
function clickMatch(id) {
  const tile = mTiles.find(t => t.id === id);
  const el = document.getElementById('mt-' + id);
  if (!el || tile.matched) return;
  if (mSel === null) {
    mSel = tile; el.classList.add('selected'); return;
  }
  if (mSel.id === id) { mSel = null; el.classList.remove('selected'); return; }
  const prev = document.getElementById('mt-' + mSel.id);
  if (mSel.pair === tile.pair && mSel.isTerm !== tile.isTerm) {
    tile.matched = true;
    mTiles.find(t => t.id === mSel.id).matched = true;
    el.classList.remove('selected'); el.classList.add('matched');
    prev.classList.remove('selected'); prev.classList.add('matched');
    mMat++; addXP(15); bumpStreak(true); showToast('✓ Matched!', 'green');
    setProg(mMat, mPairs.length);
    const ctr = document.getElementById('match-ctr');
    if (ctr) ctr.textContent = mMat + ' / ' + mPairs.length + ' matched';
    mSel = null;
    if (mMat === mPairs.length) setTimeout(() => endMatch(Math.round((Date.now() - mStart) / 1000)), 400);
  } else {
    el.classList.add('shake'); prev.classList.add('shake');
    bumpStreak(false); showToast('✗ Not a match', 'red');
    setTimeout(() => { el.classList.remove('shake', 'selected'); prev.classList.remove('shake', 'selected'); mSel = null; }, 550);
  }
}
function endMatch(sec) {
  setBody(
    '<div class="res-panel">' +
    '<div class="xp-earned">+' + (mPairs.length * 15) + ' XP</div>' +
    '<div class="res-ring great">⭐</div>' +
    '<h3>All pairs matched!</h3>' +
    '<p>Completed in ' + sec + 's · ' + MODULES[mDom] + '</p>' +
    '<div class="res-btns">' +
      '<button class="btn-res primary" id="btn-rep">Replay</button>' +
      (mDom < 9 ? '<button class="btn-res secondary" id="btn-nxt">Next Module →</button>' : '') +
      '<button class="btn-res secondary" id="btn-hm">Home</button>' +
    '</div></div>'
  );
  document.getElementById('btn-rep').addEventListener('click', () => startMatch(mDom));
  document.getElementById('btn-hm').addEventListener('click', showHome);
  if (mDom < 9) document.getElementById('btn-nxt').addEventListener('click', () => startMatch(mDom + 1));
}

// ─── BOSS QUIZ ───
function showBossSelect() {
  showGame('👾 Boss Quiz');
  setProg(0, 5);
  setBody(
    '<p style="font-size:12px;color:#6b7299;margin-bottom:.9rem">5 domain bosses, HP scaled to real exam weighting · Wrong answers cost 2 HP · Defeat all 5!</p>' +
    '<div style="display:flex;flex-direction:column;gap:.55rem">' +
    BOSSES.map((b, i) =>
      '<div class="mode-card" id="boss-sel-' + i + '" style="cursor:pointer">' +
      '<div style="display:flex;align-items:center;gap:9px">' +
      '<span style="font-size:24px">' + b.ic + '</span>' +
      '<div><div class="mode-title">' + b.n + '</div><div class="mode-desc">' + b.dm + ' · ' + BOSS_COUNTS[i] + ' HP' + moduleBridgeHtml(i) + '</div></div>' +
      '<span style="margin-left:auto">' + '⭐'.repeat(i + 1) + '</span>' +
      '</div></div>'
    ).join('') +
    '</div>'
  );
  BOSSES.forEach((_, i) => {
    const el = document.getElementById('boss-sel-' + i);
    if (el) el.addEventListener('click', () => startBoss(i));
  });
}
function startBoss(i, customQs) {
  bI = i; bQ = 0; pHP = 10; bAns = [];
  bQs = customQs || shuf([...BOSSES[i].qs]).slice(0, BOSS_COUNTS[i]);
  bHP = bQs.length;
  showGame(BOSSES[i].ic + ' vs ' + BOSSES[i].n);
  setProg(i, 5);
  renderBoss();
}
function renderBoss() {
  const b = BOSSES[bI];
  if (bQ >= bQs.length || pHP <= 0) { endBoss(); return; }
  const q = bQs[bQ];
  const ans = bAns[bQ];
  const fightOver = bHP <= 0 || pHP <= 0 || bQ >= bQs.length - 1;
  setBody(
    '<div class="boss-area">' +
      '<div class="boss-hdr">' +
        '<span class="boss-icon">' + b.ic + '</span>' +
        '<div style="flex:1">' +
          '<div class="boss-name">' + b.n + '</div>' +
          '<div style="font-size:10px;color:#6b7299;margin-bottom:3px">Boss HP: ' + Math.max(bHP, 0) + ' / ' + bQs.length + '</div>' +
          '<div class="hp-bar"><div class="hp-fill" style="width:' + (Math.max(bHP, 0) / bQs.length * 100) + '%"></div></div>' +
        '</div>' +
      '</div>' +
      '<div class="boss-q">⚔️ ' + q.q + '</div>' +
      '<div class="boss-opts" id="boss-opts">' +
        q.o.map((o, i) => optBtnHtml(i, o, q.a, ans ? ans.ch : null, 'boss-opt')).join('') +
      '</div>' +
    '</div>' +
    '<div class="player-hp-box">' +
      '<div style="font-size:11px;color:#6b7299">Your HP: ' + Math.max(pHP, 0) + ' / 10</div>' +
      '<div class="php-bar"><div class="php-fill" style="width:' + (Math.max(pHP, 0) * 10) + '%"></div></div>' +
    '</div>' +
    navRowHtml(bQ > 0, !!ans, fightOver)
  );
  if (!ans) {
    document.getElementById('boss-opts').querySelectorAll('.boss-opt').forEach(btn => {
      btn.addEventListener('click', () => pickBoss(parseInt(btn.getAttribute('data-i'))));
    });
  }
  wireNav(() => { bQ--; renderBoss(); }, () => {
    if (bHP <= 0 || pHP <= 0 || bQ >= bQs.length - 1) endBoss();
    else { bQ++; renderBoss(); }
  });
}
function pickBoss(ch) {
  const q = bQs[bQ]; const ok = ch === q.a;
  if (ok) { bHP--; addXP(20); bumpStreak(true); showToast('⚔️ Hit! +20 XP', 'green'); }
  else    { pHP -= 2; bumpStreak(false); showToast('💢 Ouch! −2 HP', 'red'); }
  bumpDomAcc(bI, ok);
  bAns[bQ] = { ch, ok };
  renderBoss();
}
function endBoss() {
  const b = BOSSES[bI]; const won = bHP <= 0 || (bQ >= bQs.length - 1 && pHP > 0 && bAns[bQ]);
  if (won) { ST.bw++; checkAch(); save(); }
  const missed = bQs.filter((q, i) => bAns[i] && !bAns[i].ok);
  setBody(
    '<div class="res-panel">' +
    '<div class="res-ring ' + (won ? 'great' : 'bad') + '">' + (won ? '🏆' : '💀') + '</div>' +
    '<h3>' + (won ? b.ic + ' Defeated!' : 'You were defeated!') + '</h3>' +
    '<p>' + b.n + ' · ' + b.dm + '<br>' + (won ? 'Domain mastered! Try the next boss.' : 'Study flashcards for this domain and retry!') + '</p>' +
    '<div class="res-btns">' +
      '<button class="btn-res primary" id="btn-rr">Retry</button>' +
      (missed.length > 0 ? '<button class="btn-res secondary" id="btn-miss">Redo Missed (' + missed.length + ')</button>' : '') +
      (bI < 4 ? '<button class="btn-res secondary" id="btn-rn">Next Boss →</button>' : '') +
      '<button class="btn-res secondary" id="btn-bs">All Bosses</button>' +
      '<button class="btn-res secondary" id="btn-hm">Home</button>' +
    '</div></div>'
  );
  document.getElementById('btn-rr').addEventListener('click', () => startBoss(bI));
  document.getElementById('btn-bs').addEventListener('click', showBossSelect);
  document.getElementById('btn-hm').addEventListener('click', showHome);
  if (bI < 4) document.getElementById('btn-rn').addEventListener('click', () => startBoss(bI + 1));
  if (missed.length > 0) document.getElementById('btn-miss').addEventListener('click', () => startBoss(bI, missed));
}

// ─── DOMAIN EXAM ───
function showDexSelect() {
  showGame('📋 Domain Exam');
  setProg(0, 5);
  setBody(
    '<div style="background:rgba(91,127,255,.08);border:1px solid rgba(91,127,255,.2);border-radius:12px;padding:1rem;margin-bottom:1rem;text-align:center">' +
    '<div style="font-size:14px;font-weight:700;margin-bottom:.25rem">📋 Domain Exam</div>' +
    '<div style="font-size:12px;color:#6b7299">Question count per domain is scaled to real exam weighting · Scored like the real test</div></div>' +
    '<div style="display:flex;flex-direction:column;gap:.55rem">' +
    DN.map((d, i) =>
      '<div class="mode-card" id="dex-sel-' + i + '">' +
      '<div style="position:relative;z-index:1">' +
      '<div class="mode-title">Domain ' + (i+1) + '.0: ' + d + '</div>' +
      '<div class="mode-desc">' + DEX_COUNTS[i] + ' scenario-based questions' + moduleBridgeHtml(i) + '</div>' +
      '</div></div>'
    ).join('') + '</div>'
  );
  DN.forEach((_, i) => {
    const el = document.getElementById('dex-sel-' + i);
    if (el) el.addEventListener('click', () => startDex(i));
  });
}
function startDex(d, customPool) {
  dDom = d; dQ = customPool || shuf([...DEX[d]]).slice(0, DEX_COUNTS[d]); dI = 0; dC = 0; dAns = [];
  if (!ST.dom.includes(d)) { ST.dom.push(d); save(); }
  showGame('📋 Domain ' + (d+1) + ': ' + DN[d]);
  setProg(0, dQ.length);
  renderDex();
}
function renderDex() {
  if (dI >= dQ.length) { endDex(); return; }
  setProg(dI, dQ.length);
  const q = dQ[dI];
  const ans = dAns[dI];
  setBody(
    '<div style="font-size:10px;color:#6b7299;margin-bottom:.45rem">Q' + (dI+1) + ' of ' + dQ.length + ' · ' + DN[dDom] + '</div>' +
    '<div class="card">' +
      '<div class="q-text">' + q.q + '</div>' +
      '<div class="opts-grid" id="dex-opts">' +
        q.o.map((o, i) => optBtnHtml(i, o, q.a, ans ? ans.ch : null, 'opt-btn')).join('') +
      '</div>' +
      '<div class="exp-box' + (ans ? ' show' + (ans.ok ? '' : ' wrong') : '') + '" id="dex-exp">' + (ans ? (ans.ok ? '✓ Correct! ' : '✗ Correct answer: ' + q.o[q.a] + '. ') + (q.e || '') : '') + '</div>' +
    '</div>' +
    navRowHtml(dI > 0, !!ans, dI === dQ.length - 1)
  );
  if (!ans) {
    document.getElementById('dex-opts').querySelectorAll('.opt-btn').forEach(btn => {
      btn.addEventListener('click', () => pickDex(parseInt(btn.getAttribute('data-i'))));
    });
  }
  wireNav(() => { dI--; renderDex(); }, () => { dI++; renderDex(); });
}
function pickDex(ch) {
  const q = dQ[dI]; const ok = ch === q.a;
  if (ok) { dC++; addXP(12); }
  bumpStreak(ok);
  bumpDomAcc(dDom, ok);
  dAns[dI] = { ch, ok };
  renderDex();
}
function endDex() {
  const pct = Math.round((dC / dQ.length) * 100);
  const missed = dQ.filter((q, i) => dAns[i] && !dAns[i].ok);
  setBody(makeResPanel(dC * 12, pct, dC + ' / ' + dQ.length + ' correct',
    'Domain ' + (dDom+1) + '.0 — ' + DN[dDom] + '. ' +
    (pct >= 80 ? 'Excellent domain knowledge!' : pct >= 70 ? 'Passing level — keep reviewing!' : 'Study flashcards for this domain then retry.'),
    '<button class="btn-res primary" id="btn-rr">Retry Domain</button>' +
    (missed.length > 0 ? '<button class="btn-res secondary" id="btn-miss">Redo Missed (' + missed.length + ')</button>' : '') +
    '<button class="btn-res secondary" id="btn-ds">Other Domains</button><button class="btn-res secondary" id="btn-hm">Home</button>'
  ));
  document.getElementById('btn-rr').addEventListener('click', () => startDex(dDom));
  document.getElementById('btn-ds').addEventListener('click', showDexSelect);
  document.getElementById('btn-hm').addEventListener('click', showHome);
  if (missed.length > 0) document.getElementById('btn-miss').addEventListener('click', () => startDex(dDom, missed));
}

// ─── FIRST PREPARATION (90-question full mock exam) ───
function startFirstPrep(customPool) {
  fpPool = customPool || shuf([...FIRST_PREP]).slice(0, Math.min(FIRST_PREP_EXAM_LENGTH, FIRST_PREP.length));
  fpI = 0; fpC = 0; fpAns = [];
  showGame('🎓 First Preparation');
  setProg(0, fpPool.length);
  renderFirstPrep();
}
function renderFirstPrep() {
  if (fpI >= fpPool.length) { endFirstPrep(); return; }
  setProg(fpI, fpPool.length);
  const q = fpPool[fpI];
  const ans = fpAns[fpI];
  setBody(
    '<div style="font-size:10px;color:#6b7299;margin-bottom:.45rem">Question ' + (fpI+1) + ' of ' + fpPool.length + (q.dm ? ' · ' + q.dm : '') + '</div>' +
    '<div class="card">' +
      '<div class="q-text">' + q.q + '</div>' +
      '<div class="opts-grid" id="fp-opts">' +
        q.o.map((o, i) => optBtnHtml(i, o, q.a, ans ? ans.ch : null, 'opt-btn')).join('') +
      '</div>' +
      '<div class="exp-box' + (ans ? ' show' + (ans.ok ? '' : ' wrong') : '') + '" id="fp-exp">' + (ans ? (ans.ok ? '✓ Correct. ' : '✗ Incorrect. ') + (q.e || '') : '') + '</div>' +
    '</div>' +
    navRowHtml(fpI > 0, !!ans, fpI === fpPool.length - 1)
  );
  if (!ans) {
    document.getElementById('fp-opts').querySelectorAll('.opt-btn').forEach(btn => {
      btn.addEventListener('click', () => pickFirstPrep(parseInt(btn.getAttribute('data-i'))));
    });
  }
  wireNav(() => { fpI--; renderFirstPrep(); }, () => { fpI++; renderFirstPrep(); });
}
function pickFirstPrep(ch) {
  const q = fpPool[fpI]; const ok = ch === q.a;
  if (ok) { fpC++; addXP(15); }
  bumpStreak(ok);
  fpAns[fpI] = { ch, ok };
  renderFirstPrep();
}
function endFirstPrep() {
  const pct = Math.round((fpC / fpPool.length) * 100);
  const passed = pct >= 83;
  const missed = fpPool.filter((q, i) => fpAns[i] && !fpAns[i].ok);
  if (passed && !ST.ach.includes('afprep')) { ST.ach.push('afprep'); showToast('🏆 First Preparation Passed!', 'blue'); renderAch(); save(); }
  setBody(makeResPanel(fpC * 15, pct, fpC + ' / ' + fpPool.length + ' correct',
    'CompTIA Security+ passes at roughly 750/900 (~83%). ' +
    (passed ? '🎉 That would be a PASS on the real exam — excellent work!' : pct >= 70 ? 'Close — a bit more review and you\'ll clear the passing bar.' : 'Below passing level. Hit the flashcards and domain exams, then try again.'),
    '<button class="btn-res primary" id="btn-rep">New 90-Question Run</button>' +
    (missed.length > 0 ? '<button class="btn-res secondary" id="btn-miss">Redo Missed (' + missed.length + ')</button>' : '') +
    '<button class="btn-res secondary" id="btn-hm">Home</button>'
  ));
  document.getElementById('btn-rep').addEventListener('click', () => startFirstPrep());
  document.getElementById('btn-hm').addEventListener('click', showHome);
  if (missed.length > 0) document.getElementById('btn-miss').addEventListener('click', () => startFirstPrep(missed));
}

// ─── SURVIVAL MODE ───
function startSurv() {
  svLives = 3; svC = 0; svI = 0; svHist = []; svAns = [];
  svDrawPool = shuf([...SPEED, ...DEX.flat()]); svDrawIdx = 0;
  showGame('❤️ Survival Mode');
  renderSurv();
}
function renderSurv() {
  if (svLives <= 0) { endSurv(); return; }
  if (svI >= svHist.length) {
    if (svDrawIdx >= svDrawPool.length) { svDrawPool = shuf([...SPEED, ...DEX.flat()]); svDrawIdx = 0; }
    svHist[svI] = svDrawPool[svDrawIdx]; svDrawIdx++;
  }
  const q = svHist[svI];
  const opts = q.o || q.opts || [];
  const correctIdx = (q.a !== undefined) ? q.a : q.ans;
  const ans = svAns[svI];
  setProg(svC, Math.max(svC, 1));
  setBody(
    '<div class="surv-stats">' +
      '<div class="surv-chip"><div class="sv" style="color:#22c55e">' + svC + '</div><div class="sl">Score</div></div>' +
      '<div class="surv-chip"><div class="sv" style="color:#ef4444">' + svLives + '</div><div class="sl">Lives</div></div>' +
      '<div class="surv-chip"><div class="sv">' + ST.sb + '</div><div class="sl">Best</div></div>' +
    '</div>' +
    '<div style="font-size:11px;color:#6b7299;margin-bottom:.7rem">' + '❤️'.repeat(svLives) + '🖤'.repeat(3 - svLives) + ' — wrong answer = lose a life</div>' +
    '<div class="card">' +
      '<div class="q-text">' + q.q + '</div>' +
      '<div class="opts-grid" id="sv-opts">' +
        opts.map((o, i) => optBtnHtml(i, o, correctIdx, ans ? ans.ch : null, 'opt-btn')).join('') +
      '</div>' +
      '<div class="exp-box' + (ans ? ' show' + (ans.ok ? '' : ' wrong') : '') + '" id="sv-exp">' + (ans ? (ans.ok ? '✓ Keep going!' : '✗ ' + opts[correctIdx]) : '') + '</div>' +
    '</div>' +
    navRowHtml(svI > 0, !!ans, !!ans && svLives <= 0)
  );
  if (!ans) {
    document.getElementById('sv-opts').querySelectorAll('.opt-btn').forEach(btn => {
      btn.addEventListener('click', () => pickSurv(parseInt(btn.getAttribute('data-i')), correctIdx, opts));
    });
  }
  wireNav(() => { svI--; renderSurv(); }, () => { svI++; renderSurv(); });
}
function pickSurv(ch, correctIdx, opts) {
  const ok = ch === correctIdx;
  if (ok) { svC++; addXP(8); bumpStreak(true); showToast('✓ +1 · Score: ' + svC, 'green'); }
  else    { svLives--; bumpStreak(false); showToast('💔 −1 Life · ' + svLives + ' remaining', 'red'); }
  if (svC > ST.sb) { ST.sb = svC; save(); }
  if (streak >= 10 && !ST.ach.includes('asurv')) { ST.ach.push('asurv'); showToast('🏆 Survivor!', 'blue'); renderAch(); save(); }
  svAns[svI] = { ch, ok };
  renderSurv();
}
function endSurv() {
  const cls = svC >= 15 ? 'great' : svC >= 8 ? 'mid' : 'bad';
  setBody(
    '<div class="res-panel">' +
    '<div class="xp-earned">+' + (svC * 8) + ' XP</div>' +
    '<div class="res-ring ' + cls + '">' + svC + '</div>' +
    '<h3>Score: ' + svC + '</h3>' +
    '<p>Best ever: ' + ST.sb + ' · ' + (svC >= 15 ? 'Incredible run!' : svC >= 8 ? 'Good — beat your best!' : 'Keep training — aim for 10+') + '</p>' +
    '<div class="res-btns"><button class="btn-res primary" id="btn-rep">Try Again</button><button class="btn-res secondary" id="btn-hm">Home</button></div>' +
    '</div>'
  );
  document.getElementById('btn-rep').addEventListener('click', startSurv);
  document.getElementById('btn-hm').addEventListener('click', showHome);
}

// ─── PORTS & PROTOCOLS ───
function startPorts(customPool) { ptPool = customPool || shuf([...PORTS]); ptI = 0; ptC = 0; ptAns = []; showGame('🔌 Ports & Protocols'); renderPort(); }
function renderPort() {
  if (ptI >= ptPool.length) { endPorts(); return; }
  setProg(ptI, ptPool.length);
  const q = ptPool[ptI];
  const ans = ptAns[ptI];
  setBody(
    '<div class="card" style="text-align:center">' +
      '<div class="big-text">' + q.p + '</div>' +
      '<div class="cat-text">Which service runs on port ' + q.p + '?</div>' +
      '<div class="azopts" id="pt-opts">' +
        q.o.map((o, i) => optBtnHtml(i, o, q.a, ans ? ans.ch : null, 'opt-btn')).join('') +
      '</div>' +
      '<div class="exp-box' + (ans ? ' show' + (ans.ok ? '' : ' wrong') : '') + '" id="pt-exp">' + (ans ? q.e : '') + '</div>' +
    '</div>' +
    '<div style="text-align:center;font-size:11px;color:#6b7299;margin-top:.4rem">Port ' + (ptI+1) + ' of ' + ptPool.length + ' · Score: ' + ptC + '</div>' +
    navRowHtml(ptI > 0, !!ans, ptI === ptPool.length - 1)
  );
  if (!ans) {
    document.getElementById('pt-opts').querySelectorAll('.opt-btn').forEach(btn => {
      btn.addEventListener('click', () => pickPort(parseInt(btn.getAttribute('data-i'))));
    });
  }
  wireNav(() => { ptI--; renderPort(); }, () => { ptI++; renderPort(); });
}
function pickPort(ch) {
  const q = ptPool[ptI]; const ok = ch === q.a;
  if (ok) { ptC++; addXP(10); }
  bumpStreak(ok);
  ptAns[ptI] = { ch, ok };
  renderPort();
}
function endPorts() {
  const pct = Math.round((ptC / ptPool.length) * 100);
  const missed = ptPool.filter((q, i) => ptAns[i] && !ptAns[i].ok);
  if (pct >= 90 && !ST.ach.includes('aport')) { ST.ach.push('aport'); showToast('🏆 Port Master!', 'blue'); renderAch(); save(); }
  setBody(makeResPanel(ptC * 10, pct, ptC + ' / ' + ptPool.length + ' correct',
    pct >= 80 ? 'Port Master! Great memory.' : pct >= 50 ? 'Getting there — drill the missed ones.' : 'Ports are heavily tested! Study the reference sheet.',
    '<button class="btn-res primary" id="btn-rep">Play Again</button>' +
    (missed.length > 0 ? '<button class="btn-res secondary" id="btn-miss">Redo Missed (' + missed.length + ')</button>' : '') +
    '<button class="btn-res secondary" id="btn-nts">Study Notes</button><button class="btn-res secondary" id="btn-hm">Home</button>'
  ));
  document.getElementById('btn-rep').addEventListener('click', () => startPorts());
  document.getElementById('btn-nts').addEventListener('click', startNotes);
  document.getElementById('btn-hm').addEventListener('click', showHome);
  if (missed.length > 0) document.getElementById('btn-miss').addEventListener('click', () => startPorts(missed));
}

// ─── STUDY NOTES ───
function startNotes() { notesI = 0; showGame('📚 Study Notes'); setProg(0, 0); renderNotes(); }
function renderNotes() {
  const note = NOTES[notesI];
  const tabs = NOTES.map((n, i) =>
    '<button class="notes-tab' + (i === notesI ? ' active' : '') + '" data-i="' + i + '">' + n.tab + '</button>'
  ).join('');
  const body = note.sects.map(s =>
    '<div class="notes-section"><h4>' + s.h + '</h4>' +
    s.rows.map(r => '<div class="notes-row"><div class="notes-key">' + r[0] + '</div><div class="notes-val">' + r[1] + '</div></div>').join('') +
    '</div>'
  ).join('');
  setBody(
    '<div class="notes-tabs" id="notes-tabs">' + tabs + '</div>' +
    '<div class="notes-body">' +
      '<div style="font-size:13px;font-weight:700;margin-bottom:.9rem;color:#5b7fff">' + note.title + '</div>' +
      body +
    '</div>' +
    '<div style="display:flex;gap:.5rem;justify-content:center;margin-top:.8rem">' +
      (notesI > 0 ? '<button class="btn-res secondary" id="btn-prev">← Prev</button>' : '') +
      (notesI < NOTES.length - 1 ? '<button class="btn-res primary" id="btn-nxt">Next →</button>' : '') +
      '<button class="btn-res secondary" id="btn-hm">Home</button>' +
    '</div>'
  );
  document.getElementById('notes-tabs').querySelectorAll('.notes-tab').forEach(tab => {
    tab.addEventListener('click', () => { notesI = parseInt(tab.getAttribute('data-i')); renderNotes(); window.scrollTo({top:0,behavior:'smooth'}); });
  });
  document.getElementById('btn-hm').addEventListener('click', showHome);
  if (notesI > 0) document.getElementById('btn-prev').addEventListener('click', () => { notesI--; renderNotes(); window.scrollTo({top:0,behavior:'smooth'}); });
  if (notesI < NOTES.length - 1) document.getElementById('btn-nxt').addEventListener('click', () => { notesI++; renderNotes(); window.scrollTo({top:0,behavior:'smooth'}); });
}

// ─── INIT ───
function initApp() {
  const backBtn = document.getElementById('back-btn');
  if (backBtn) backBtn.addEventListener('click', showHome);

  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', () => {
    if (!confirm('Reset all progress? XP, streaks, and achievements will be cleared.')) return;
    if (HAS_STORAGE) { try { localStorage.removeItem('sec701g'); } catch (e) {} }
    delete _memStore['sec701g'];
    ST = { xp:0, lv:1, lvxp:0, bs:0, c:0, s:0, m:0, bw:0, sb:0, dom:[], mod:[], ach:[], modAcc:{}, domAcc:{} };
    streak = 0;
    refreshHeader(); refreshHomeStats(); renderAch();
    showToast('Progress reset.', 'blue');
  });

  const scrollBtn = document.getElementById('scroll-top');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('show', window.scrollY > 350);
    });
  }

  if (!HAS_STORAGE) {
    showToast('Progress will not be saved between visits in this browser mode.', 'blue');
  }

  load();
  buildHome();

  // Keyboard shortcuts: Enter / → = Next, ← = Back, 1-9 = pick that answer option.
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === 'ArrowRight' || e.key === 'Enter') {
      const nb = document.getElementById('qa-next');
      if (nb) { e.preventDefault(); nb.click(); }
      return;
    }
    if (e.key === 'ArrowLeft') {
      const bb = document.getElementById('qa-back');
      if (bb) { e.preventDefault(); bb.click(); }
      return;
    }
    if (e.key >= '1' && e.key <= '9') {
      const idx = parseInt(e.key, 10) - 1;
      const btnT = document.getElementById('btn-t'), btnF = document.getElementById('btn-f');
      if (btnT && !btnT.disabled && (idx === 0 || idx === 1)) { (idx === 0 ? btnT : btnF).click(); return; }
      const live = document.querySelectorAll('.opt-btn:not(:disabled), .fib-btn:not(:disabled), .boss-opt:not(:disabled)');
      const match = Array.from(live).find(b => parseInt(b.getAttribute('data-i'), 10) === idx);
      if (match) match.click();
    }
  });
  refreshHeader();
  refreshHomeStats();
}

// Run once the DOM is ready. If the script is loaded at the end of
// <body> (as it is here) the DOM is already parsed, but this guard
// makes the file safe to load from <head> too.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
