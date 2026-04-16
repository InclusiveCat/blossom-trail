# Names.co.uk DNS Setup for GitHub Pages

These instructions are saved here for when you have admin access to the `www.oubaitoricollective.co.uk` domain via **names.co.uk**.

---

## Step 1: Add DNS Records in Names.co.uk

1. Log in to your **names.co.uk** Control Panel.
2. Under the **Domain Names** menu, select `oubaitoricollective.co.uk`.
3. Click on **DNS Settings**, and then select **Advanced DNS**.
4. You may see a warning about altering advanced settings; accept it to proceed.

### A. Set up the 'www' record (CNAME)
*Warning: If there is an existing `www` record (like an A record pointing to a parked page), you will need to delete or edit it.*
- **Type:** `CNAME`
- **Hostname:** `www`
- **Result / Destination:** `<your-github-username>.github.io.` *(Note: Some providers require a trailing dot, if it errors without it, add the dot!)*

### B. Set up the Root/Apex domain (A Records)
*This ensures that `oubaitoricollective.co.uk` (without the 'www') automatically redirects to your app.*
*Warning: Delete any existing 'A' records that have a blank/empty hostname before adding these.*
Add four separate **A records**:
- **Type:** `A` | **Hostname:** *(leave blank)* | **Result:** `185.199.108.153`
- **Type:** `A` | **Hostname:** *(leave blank)* | **Result:** `185.199.109.153`
- **Type:** `A` | **Hostname:** *(leave blank)* | **Result:** `185.199.110.153`
- **Type:** `A` | **Hostname:** *(leave blank)* | **Result:** `185.199.111.153`

5. Click **Save** in the names.co.uk dashboard.

---

## Step 2: Configure GitHub Pages

Since your codebase already has the `CNAME` file included (containing `www.oubaitoricollective.co.uk`), you just need to tell GitHub to verify the DNS.

1. Go to your repository on GitHub.com.
2. Click on the **Settings** tab (the gear icon at the top).
3. On the left sidebar, click on **Pages**.
4. Scroll down to the **Custom domain** section.
5. In the blank text field, type `www.oubaitoricollective.co.uk` and click **Save**.
6. Wait roughly 10–15 minutes. GitHub will automatically begin verifying your DNS and provisioning an SSL certificate.
7. Once the "DNS check successful" message appears, check the **Enforce HTTPS** box (this is mandatory for the Blossom Trail PWA to work offline and track GPS).

---

> **Note:** DNS propagation can take anywhere from 15 minutes to 48 hours. If the site doesn't load immediately, or shows a browser security warning initially, give it time for the SSL certificate to generate.
