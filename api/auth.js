const https = require('https');

/**
 * Decap CMS OAuth Provider for Vercel (No-dependency version)
 * Handles GitHub OAuth flow:
 * 1. Redirects to GitHub for authorization.
 * 2. Exchanges 'code' for 'access_token'.
 * 3. Communicates the result back to the Decap CMS admin window.
 */
module.exports = async (req, res) => {
    const { code } = req.query;

    // Verify environment variables
    if (!process.env.OAUTH_GITHUB_CLIENT_ID || !process.env.OAUTH_GITHUB_CLIENT_SECRET) {
        res.status(500).send('Missing OAUTH_GITHUB_CLIENT_ID or OAUTH_GITHUB_CLIENT_SECRET environment variables.');
        return;
    }

    if (!code) {
        // Step 1: Redirect to GitHub
        const url = `https://github.com/login/oauth/authorize?client_id=${process.env.OAUTH_GITHUB_CLIENT_ID}&scope=repo,user`;
        res.writeHead(302, { Location: url });
        res.end();
        return;
    }

    // Step 2: Exchange code for access token
    const postData = JSON.stringify({
        client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
        client_secret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
        code,
    });

    const options = {
        hostname: 'github.com',
        port: 443,
        path: '/login/oauth/access_token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Content-Length': postData.length,
        },
    };

    const exchange = new Promise((resolve, reject) => {
        const request = https.request(options, (response) => {
            let data = '';
            response.on('data', (chunk) => { data += chunk; });
            response.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error('Failed to parse GitHub response: ' + data));
                }
            });
        });
        request.on('error', reject);
        request.write(postData);
        request.end();
    });

    try {
        const result = await exchange;
        const { access_token, error, error_description } = result;

        if (error || !access_token) {
            res.status(400).send(`Auth failed: ${error_description || error || 'No token received'}`);
            return;
        }

        // Step 3: Success! Send token to the Decap CMS UI
        const content = `
      <!DOCTYPE html>
      <html>
      <head><title>Authorization Success</title></head>
      <body>
        <script>
          (function() {
            function receiveMessage(e) {
              console.log("Receive message:", e.data);
              if (e.data === "authorizing:github") {
                window.opener.postMessage(
                  'authorization:github:success:${JSON.stringify({ token: access_token, provider: "github" })}',
                  e.origin
                );
              }
            }
            window.addEventListener("message", receiveMessage, false);
            // Let the main window know we are ready
            window.opener.postMessage("authorizing:github", "*");
          })();
        </script>
      </body>
      </html>
    `;
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(content);
    } catch (err) {
        console.error('OAuth Error:', err);
        res.status(500).send(`Server Error: ${err.message}`);
    }
};
