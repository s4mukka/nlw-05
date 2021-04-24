import { createContext, ReactNode, useContext, useState } from 'react'

type Episode = {
    title: string
    members: string
    thumbnail: string
    duration: number
    url: string
}

type PlayerContextData = {
    episodeList: Episode[]
    currentEpisodeIndex: number
    isPlaying: boolean
    isLooping: boolean
    isShuffling: boolean
    hasPrevious: boolean
    hasNext: boolean

    play: (episode: Episode) => void
    playList: (list: Episode[], index: number) => void
    togglePlay: () => void
    toggleLoop: () => void
    toggleShuffle: () => void
    setPlayingState: (state: boolean) => void
    playNext: () => void
    playPrevious: () => void
    clearPlayerState: () => void
}

type PlayerProviderProps = {
    children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerProvider({ children }: PlayerProviderProps) {
    const [ episodeList, setEpisodeList ] = useState([])
    const [ currentEpisodeIndex, setCurrentEpisodeIndex ] = useState(0)
    const [ isPlaying, setIsPlaying ] = useState(false)
    const [ isLooping, setIsLooping ] = useState(false)
    const [ isShuffling, setIsShuffling ] = useState(false)

    function play(episode: Episode): void {
        setEpisodeList([episode])
        setCurrentEpisodeIndex(0)
        setIsPlaying(true)
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list)
        setCurrentEpisodeIndex(index)
        setIsPlaying(true)
    }

    function togglePlay(): void {
        setIsPlaying(!isPlaying)
    }

    function toggleLoop(): void {
        setIsLooping(!isLooping)
    }

    function toggleShuffle(): void {
        setIsShuffling(!isShuffling)
    }

    function setPlayingState(state: boolean): void {
        setIsPlaying(state)
    }

    function clearPlayerState(): void {
        setEpisodeList([])
        setCurrentEpisodeIndex(0)
    }

    const hasPrevious = currentEpisodeIndex > 0
    const hasNext = isShuffling || currentEpisodeIndex < episodeList.length - 1

    function playNext(): void {
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)

            setCurrentEpisodeIndex(nextRandomEpisodeIndex)
        } else if (hasNext) {
            setCurrentEpisodeIndex(latest => latest + 1)
        }

    }

    function playPrevious(): void {
        if (hasPrevious) {
            setCurrentEpisodeIndex(latest => latest - 1)
        }
    }

    return (
        <PlayerContext.Provider
            value={{
                episodeList,
                currentEpisodeIndex,
                play,
                playList,
                isPlaying,
                togglePlay,
                setPlayingState,
                playNext,
                playPrevious,
                hasPrevious,
                hasNext,
                isLooping,
                toggleLoop,
                isShuffling,
                toggleShuffle,
                clearPlayerState,
            }}
        >
            { children }
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext)
}
