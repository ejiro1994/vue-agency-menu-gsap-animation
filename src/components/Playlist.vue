<template>
    <div class="playlist">
        <!-- <h1 class="playlist-title font-kormelink italic mt-4">Playlist</h1> -->

        <div class="player-container">
            <button class="play-button" @click="togglePlay" :aria-label="isPlaying ? 'Pause' : 'Play'">
                <svg v-if="!isPlaying" viewBox="0 0 24 24" class="play-icon">
                    <path d="M8 5v14l11-7z" />
                </svg>
                <svg v-else viewBox="0 0 24 24" class="pause-icon">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
            </button>

            <div class="progress-bar" @click="seek">
                <div class="progress-line"></div>
                <div class="progress-indicator" :style="{ left: `${progress}%` }"></div>
            </div>
        </div>

        <div class="playlist-items">
            <div v-for="(track, index) in playlist" :key="index" class="track-item"
                :class="{ active: currentTrackIndex === index }" @click="playTrack(index)">
                <h2 class="track-title font-kormelink">
                    <template v-if="track.title.startsWith('H')">
                        <span class="fancy-text size-6">H</span>{{ track.title.slice(1) }}
                    </template>
                    <template v-else>
                        {{ track.title }}
                    </template>
                </h2>
                <p class="track-artist">{{ track.artist }}</p>
                <p class="track-duration">{{ track.duration }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject, computed } from 'vue'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

interface Props {
    filter?: string
}

const props = defineProps<Props>()

// Modify the Track interface to use number for duration
interface Track {
    title: string
    artist: string
    duration: string
    url: string
}

// Update the trackToSlideMap to point "HIGHER" to slide 0
const trackToSlideMap: Record<string, number> = {
    'HIGHER (STRING ARRANGEMENT)': 0,
    'DUALITY (SHORT FILM)': 1,
    'GOODUMS (LIVE STRING ARRANGEMENT)': 2,
    'DEEP (LIVE STRING ARRANGEMENT)': 3
}

const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const allTracks = ref<Track[]>([
    {
        title: 'HIGHER (STRING ARRANGEMENT)',
        artist: 'HIGHLYY',
        duration: '0:38',
        url: '/playlist/higher.m4a'
    },
    {
        title: 'DUALITY (SHORT FILM)',
        artist: 'EJB',
        duration: '0:38',
        url: '/playlist/duality.mp3'
    },
    {
        title: 'GOODUMS (LIVE STRING ARRANGEMENT)',
        artist: 'UNKNOWN-T',
        duration: '0:38',
        url: '/playlist/goodums.m4a'
    },
    {
        title: 'DEEP (LIVE STRING ARRANGEMENT)',
        artist: 'V\'NESSA',
        duration: '0:38',
        url: '/playlist/deep.m4a'
    }
])

const playlist = computed(() => {
    if (!props.filter) return allTracks.value

    return allTracks.value.filter(track =>
        track.title.includes(props.filter || '')
    )
})

const audio = new Audio()
const isPlaying = ref(false)
const currentTrackIndex = ref(-1)
const progress = ref(0)

// Get the goToSlide function from the parent
const goToSlide = inject('goToSlide') as ((slide: number) => void) | undefined

// Add a function to load track duration
const loadTrackDuration = async (track: Track): Promise<void> => {
    return new Promise((resolve) => {
        const audio = new Audio(track.url)
        audio.addEventListener('loadedmetadata', () => {
            track.duration = formatTime(audio.duration)
            resolve()
        })
        audio.addEventListener('error', () => {
            track.duration = '0:00' // fallback if loading fails
            resolve()
        })
    })
}

const togglePlay = () => {
    if (currentTrackIndex.value === -1) {
        playTrack(0)
        return
    }

    if (isPlaying.value) {
        audio.pause()
    } else {
        audio.play()
    }
    isPlaying.value = !isPlaying.value
}

const playTrack = (index: number) => {
    if (currentTrackIndex.value === index) {
        togglePlay()
        return
    }

    currentTrackIndex.value = index
    audio.src = playlist.value[index].url
    audio.play()
    isPlaying.value = true

    gsap.to(window, {
        duration: 2,
        scrollTo: {
            y: 0,
            offsetY: 100

        },
        delay: 1,
        ease: 'power4.inOut'
        // ease: "cubic-bezier(0.45, 0.05, 0.55, 0.95)"
    })

    const trackTitle = playlist.value[index].title
    if (goToSlide && trackTitle in trackToSlideMap) {
        goToSlide(trackToSlideMap[trackTitle])
    }
}

const updateProgress = () => {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100
        // Update both the indicator and line position
        gsap.to(progress, {
            value: progressPercent,
            duration: 0.1,
            ease: "linear"
        })
        // Animate the progress line
        const progressLine = document.querySelector('.progress-line') as HTMLElement
        if (progressLine) {
            gsap.to(progressLine, {
                scaleX: progressPercent / 100,
                duration: 0.1,
                ease: "linear"
            })
        }
    }
}

const seek = (event: MouseEvent) => {
    const progressBar = event.currentTarget as HTMLElement
    const rect = progressBar.getBoundingClientRect()
    const percent = (event.clientX - rect.left) / rect.width
    audio.currentTime = percent * audio.duration
}

// Load all track durations when component mounts
onMounted(async () => {
    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('ended', () => {
        isPlaying.value = false
        progress.value = 0
    })

    // Load durations for all tracks
    for (const track of playlist.value) {
        await loadTrackDuration(track)
    }
})

onUnmounted(() => {
    audio.removeEventListener('timeupdate', updateProgress)
    audio.pause()
})
</script>

<style scoped>
.playlist {
    max-width: 100%;
    width: 100%;
    margin: 0 auto;
    padding: 14px;
    font-family: serif;
}

.playlist-title {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    font-weight: 300;
    /* font-style: italic; */
}

.player-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    width: 100%;
}

.play-button {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid #000;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.play-icon,
.pause-icon {
    width: 28px;
    height: 28px;
    fill: currentColor;
}

.progress-bar {
    flex-grow: 1;
    height: 1px;
    background: #878787;
    position: relative;
    cursor: pointer;
}

.progress-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: #000000;
    transform-origin: left;
    transform: scaleX(0);
    opacity: 1;
}

.progress-indicator {
    position: absolute;
    top: 50%;
    width: 1px;
    height: 50px;
    background: #000000;
    transform: translateY(-50%);
    pointer-events: none;
}

.track-item {
    padding: 1rem;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.track-item:hover {
    background: #f9f9f9;
}

.track-item.active {
    background: #f5f5f5;
}

.track-title {
    font-size: 1.2rem;
    margin: 0;
    font-family: 'WTKormelink', serif;
}

.track-artist {
    font-size: 0.9rem;
    margin: 0;
    font-family: 'WTKormelink', serif;
    /* opacity: 0.8; */
}

.track-duration {
    font-size: 0.8rem;
    color: #000000;
    margin: 0;
    font-family: 'WTKormelink', serif;
}

.swash-caps {
    font-feature-settings: "swsh" 1;
}

.fancy-text {
    font-style: italic;
    font-feature-settings: "swsh" 1, "cswh" 1, "salt" 1, "dlig" 1;
    -webkit-font-feature-settings: "swsh" 1, "cswh" 1, "salt" 1, "dlig" 1;
    -moz-font-feature-settings: "swsh" 1, "cswh" 1, "salt" 1, "dlig" 1;
}

.size-6 {
    font-size: 22px;
}
</style>