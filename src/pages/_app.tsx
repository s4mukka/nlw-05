import '@/styles/global.scss'
import styles from '@/styles/app.module.scss'

import { Header, Player } from '@/components'

import { PlayerProvider } from '@/contexts'

function MyApp({ Component, pageProps }) {
    return (
        <PlayerProvider>
            <div className={styles.wrapper}>
                <main>
                    <Header />
                    <Component {...pageProps} />
                </main>
                <Player />
            </div>
        </PlayerProvider>
    )
}

export default MyApp
