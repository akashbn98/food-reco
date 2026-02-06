const http = require('http');

function check(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, data }));
        }).on('error', reject);
    });
}

(async () => {
    try {
        console.log('Verifying /api/search?q=Dosa ...');
        const apiRes = await check('http://localhost:3000/api/search?q=Dosa');
        console.log('API Status:', apiRes.statusCode);
        const results = JSON.parse(apiRes.data);
        console.log('API returned results:', results.length);
        if (results.length >= 3) {
            console.log('PASS: Search returned 3+ results.');
        } else {
            console.log('FAIL: Search returned less than 3 results.');
        }

        console.log('Verifying / (Homepage) ...');
        const homeRes = await check('http://localhost:3000/');
        console.log('Home Status:', homeRes.statusCode);
        if (homeRes.data.includes('doctype html') || homeRes.data.includes('<html')) {
            console.log('PASS: Homepage serves HTML.');
        } else {
            console.log('FAIL: Homepage content check.');
        }

    } catch (err) {
        console.error('Verification failed:', err);
    }
})();
