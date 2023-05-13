import { Html, Head, Main, NextScript } from 'next/document';
export const metadata = {
    title: 'Inscrybe w/ Friends',
    description: 'A web fangame for playing Inscryption with friends, or by yourself against AI.',
};

export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}


