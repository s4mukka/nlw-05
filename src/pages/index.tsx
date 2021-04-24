import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { api } from '@/servers'
import { IEpisode } from '@/protocols'
import { usePlayer } from '@/contexts'
import { convertDurationToTimeString } from '@/utils'

import styles from '@/styles/pages/home.module.scss'

type HomeProps  = {
    latestEpisodes: IEpisode[]
    allEpisodes: IEpisode[]
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
    const { playList } = usePlayer()

    const episodeList = [...latestEpisodes, ...allEpisodes]

    return (
        <div className={styles.homeContainer}>
            <Head>
                <title>Home | Podcaster</title>
            </Head>

            <section className={styles.latestEpisodes}>
                <h2>Últimos lançamentos</h2>

                <ul>
                    {
                        latestEpisodes.map((episode, index) => (
                            <li key={episode.id} >
                                <Image
                                    className={styles.thumb}
                                    width={192}
                                    height={192}
                                    objectFit="cover"
                                    src={episode.thumbnail}
                                    alt={episode.title}
                                />

                                <div className={styles.episodeDetails}>
                                    <Link href={`/episodes/${episode.id}`}><a>{episode.title}</a></Link>
                                    <p>{episode.members}</p>
                                    <span>{episode.publishedAt}</span>
                                    <span>{episode.durationAsString}</span>
                                </div>

                                <button type="button" onClick={() => playList(episodeList, index)}>
                                    <img src="/play-green.svg" alt="Tocar episódio"/>
                                </button>
                            </li>
                        ))
                    }
                </ul>
            </section>

            <section className={styles.allEpisodes}>
                    <h2>Todos episódios</h2>

                    <table cellSpacing={0}>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Podcast</th>
                                <th>Integrantes</th>
                                <th>Data</th>
                                <th>Duração</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allEpisodes.map((episode, index) => (
                                    <tr key={episode.id}>
                                        <td style={{minWidth: '4.5rem'}}>
                                            <Image
                                                width={120}
                                                height={120}
                                                objectFit="cover"
                                                src={episode.thumbnail}
                                                alt={episode.title}
                                            />
                                        </td>
                                        <td>
                                            <Link href={`/episodes/${episode.id}`}>{episode.title}</Link>
                                        </td>
                                        <td>{episode.members}</td>
                                        <td style={{ width: 100 }}>{episode.publishedAt}</td>
                                        <td>{episode.durationAsString}</td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => playList(episodeList, index + latestEpisodes.length)}
                                            >
                                                <img src="/play-green.svg" alt="Tocar episódio"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
            </section>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const { data } = await api.get('/episodes', {
        params: {
            _limit: 12,
            _sort: 'published_at',
            _order: 'desc'
        }
    })

    const episodes = data.map(episode => {
        return {
            id: episode.id,
            title: episode.title,
            thumbnail: episode.thumbnail,
            members: episode.members,
            publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR}),
            duration: Number(episode.file.duration),
            durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
            url: episode.file.url
        }
    })

    const latestEpisodes = episodes.slice(0, 2)
    const allEpisodes = episodes.slice(2, episodes.length)

    return {
        props: {
            latestEpisodes,
            allEpisodes
        },
        revalidate: 60 * 60 * 8
    }
}