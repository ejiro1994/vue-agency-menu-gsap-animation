<template>
    <div class="page-container">
        <div class="image-container mb-8">
            <img src="/images/social-media-image.jpg" alt="Social Media" class="max-w-full w-auto h-auto" />
        </div>
        <h1 class="page-title font-kormelink italic mt-4">About</h1>
        <div class="content">
            <p class="mb-4 uppercase">
                I'm a string arranger and producer from West London, dedicated to creating emotive, bespoke arrangements
                that bring stories to life through music. With a deep passion for blending classical traditions with
                contemporary sounds, I collaborate with artists, filmmakers, and producers to deliver timeless and
                innovative compositions that resonate deeply and elevate every project.
            </p>
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
</script>

<style scoped>
.page-container {
    padding: 120px 0 40px;
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
</style>