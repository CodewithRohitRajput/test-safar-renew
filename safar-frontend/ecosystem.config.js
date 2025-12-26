module.exports = {
  apps: [{
    name: 'safar-frontend',
    script: '.next/standalone/server.js',
    cwd: '/root/safar-frontend',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/root/safar-frontend/logs/err.log',
    out_file: '/root/safar-frontend/logs/out.log',
    log_file: '/root/safar-frontend/logs/combined.log',
    time: true
  }]
}
