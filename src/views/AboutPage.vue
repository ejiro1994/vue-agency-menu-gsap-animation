<template>
    <div class="page-container">
        
        <!-- <h1 class="page-title font-kormelink  mt-4">Behind the Music</h1> -->
        <div class="content">
            <p class="mb-4 uppercase pt-2">
                I'm a string arranger and producer from West London, dedicated to creating emotive, bespoke arrangements
                that bring stories to life through music. With a deep passion for blending classical traditions with
                contemporary sounds, I collaborate with artists, filmmakers and producers to deliver timeless and
                innovative compositions that resonate deeply and elevate every project.
            </p>
            <div class="image-container mb-8">
                <img src="/images/about.jpg" alt="Social Media" class="w-[200px] h-[200px] object-cover fade-in" @load="fadeInImage" />
            </div>
            <div class="contact-section mt-12 mb-8">
                <h2 class="text-xl font-kormelink italic mb-6">Get in Touch</h2>
                <div class="contact-links space-y-4">
                    <a href="mailto:hello@ejirolennox.com" class="contact-link font-kormelink text-lg hover:opacity-70 transition-opacity uppercase block">
                        hello@ejirolennox.com
                    </a>
                    <div class="social-links flex gap-6 pt-4">
                        <a href="https://instagram.com/ejirolennox" target="_blank" rel="noopener noreferrer" class="contact-link font-kormelink text-lg hover:opacity-70 transition-opacity uppercase">
                            Instagram
                        </a>
                        <a href="https://twitter.com/ejirolennox" target="_blank" rel="noopener noreferrer" class="contact-link font-kormelink text-lg hover:opacity-70 transition-opacity uppercase">
                            Twitter
                        </a>
                        <a href="https://youtube.com/@ejirolennox" target="_blank" rel="noopener noreferrer" class="contact-link font-kormelink text-lg hover:opacity-70 transition-opacity uppercase">
                            Youtube
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const fadeInImage = (event: Event) => {
    const img = event.target as HTMLImageElement;
    // Ensure the class is added after the image is fully loaded
    setTimeout(() => {
        img.classList.add('visible');
    }, 1000); // 2-second delay before adding the class
};
</script>

<style scoped>
.page-container {
    padding: 0px 0 40px;
    max-width: 800px;
    margin: 0 auto;
}

.image-container {
    width: 100vw;
    margin-left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 14px;
}

.page-title {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    font-weight: 300;
    padding: 0 14px;
}

.content {
    font-family: 'WTKormelink', serif;
    line-height: 1.6;
    padding: 0 14px;
}

.contact-section {
    border-top: 1px solid #eee;
    padding-top: 2rem;
}

.contact-link {
    display: inline-block;
    text-decoration: none;
    color: #000;
    border-bottom: 1px solid currentColor;
    padding-bottom: 2px;
}

@media (max-width: 640px) {
    .social-links {
        flex-direction: column;
        gap: 1rem;
    }
}

.fade-in {
    opacity: 0;
    transition: opacity 1s ease-in-out;
}

.visible {
    opacity: 1;
}

.fancy-text {
    font-style: italic;
    font-feature-settings: "swsh" 1, "cswh" 1, "salt" 1, "dlig" 1;
    -webkit-font-feature-settings: "swsh" 1, "cswh" 1, "salt" 1, "dlig" 1;
    -moz-font-feature-settings: "swsh" 1, "cswh" 1, "salt" 1, "dlig" 1;
}
</style>