module.exports = {
  apps: [
    {
      name: 'numeraciones',
      script: 'dist/main.js',
      args: 'start',
      watch: true,
      env: {
        NODE_ENV: 'production',
        DB_URL: '172.18.32.147',
      },
    },
    {
      name: 'service-worker',
      script: './service-worker/',
      watch: ['./service-worker'],
    },
  ],

  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};
