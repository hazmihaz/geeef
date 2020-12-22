<template>
    <div class="preview">
        <div class="preview-bg" @click="close" />

        <div class="loader">
            <Loader />
        </div>

        <div class="preview-box">
            <video autoplay loop>
                <source :src="webp" type="video/webm" />

                <source :src="mp4" type="video/mp4" />

                Sorry, your browser doesn't support embedded videos.
            </video>

            <div class="share">
                <input
                    class="btn"
                    type="button"
                    value="copy url"
                    @click="copy"
                />
                <input class="btn" type="button" value="share" @click="share" />
            </div>

            <div class="close">
                <a @click="close">close</a>
            </div>
        </div>
    </div>
</template>

<script>
import Loader from './Loader'
import { Plugins } from '@capacitor/core'
const { Clipboard, Share, Toast } = Plugins

export default {
    components: {
        Loader,
    },
    props: {
        url: { type: String, required: true },
        share_url: { type: String, required: true },
        mp4: { type: String, required: true },
        webp: { type: String, required: true },
        title: { type: String, required: true },
    },

    methods: {
        close() {
            this.$emit('close')
        },

        async copy() {
            Clipboard.write({
                string: this.url,
                url: this.url,
                label: this.title,
            })
            await Toast.show({
                text: 'url copied!',
            })
        },

        async share() {
            await Share.share({
                title: this.title,
                text: this.title,
                url: this.url,
                dialogTitle: 'Share gif',
            })
        },
    },
}
</script>

<style scoped>
.preview {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    padding: 32px;
}
.preview-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #362c61b2;
    z-index: -1;
    backdrop-filter: blur(10px);
}
.preview-box {
    max-width: 600px;
    align-self: center;
    justify-self: center;
}
.preview-box video {
    display: block;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
}
.share {
    margin: 24px -8px;
    display: flex;
}
.share input {
    display: block;
    width: 100%;
    margin: 0 8px;
}
.loader {
    position: absolute;
    width: 100%;
    top: calc(50% - 64px);
    z-index: -1;
}
</style>
