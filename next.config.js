/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        turbo: {
            rules: {
                '**/PROTECOT/**': 'ignore'
            }
        }
    },
    async redirects() {
        return [
            {
                source: '/apps/mail',
                destination: '/apps/mail/inbox',
                permanent: true
            },
            {
                source: '/medical',
                destination: '/apps/medical/pacientes',
                permanent: true
            },
            {
                source: '/medical/:path*',
                destination: '/apps/medical/:path*',
                permanent: true
            }
        ];
    }
};

module.exports = nextConfig;
