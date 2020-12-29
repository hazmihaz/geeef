<template>
    <div :class="['layout', { 'input-focus': focusSearch }]">
        <div class="search-box">
            <form @submit.prevent="submit">
                <input
                    ref="searchInput"
                    class="search-input"
                    v-model="q"
                    placeholder="search gif..."
                    @focus="onInputFocus"
                    @blur="onInputBlur"
                />
            </form>
        </div>

        <div class="result">
            <div class="result-items">
                <div
                    class="item"
                    v-for="(item, i) in items"
                    :key="i"
                    @click="selectItem(i)"
                >
                    <picture>
                        <source :srcset="item.webp" type="image/webp" />
                        <img :src="item.preview" alt />
                    </picture>
                </div>
            </div>

            <div style="height: 200px">
                <input
                    v-if="!loading && items.length != 0"
                    @click="loadMore"
                    type="button"
                    value="load more"
                    class="btn"
                />

                <div class="loader">
                    <Loader v-if="loading" />
                </div>
            </div>
        </div>

        <Preview
            v-if="showPreview"
            :mp4="activeItem.preview_large_mp4"
            :webp="activeItem.preview_large_webp"
            :url="activeItem.url"
            :share_url="activeItem.share_url"
            :title="activeItem.title"
            @close="deselectItem"
        />
    </div>
</template>

<script>
import Preview from './components/Preview'
import Loader from './components/Loader'

const API_URL =
    'https://api.giphy.com/v1/gifs/search?api_key=waBnwguMZHlPxQvGmWWR2PRtUzJ5DqUA&lang=en'

export default {
    name: 'App',
    components: {
        Preview,
        Loader,
    },

    data: () => ({
        items: [],
        activeItemIdx: -1,

        q: '',
        paging: {
            limit: 20,
            count: 0,
            offset: 0,
            total_count: 0,
        },

        loading: false,
        showPreview: false,
        focusSearch: false,
    }),

    computed: {
        activeItem() {
            return this.items[this.activeItemIdx] || {}
        },
    },

    methods: {
        async fetchGifs() {
            this.loading = true
            const path = `&q=${this.q}&limit=${this.paging.limit}&offset=${this.paging.offset}`
            const res = await fetch(API_URL + path).then(res => res.json())
            this.loading = false

            console.log('response', res)

            const items = res.data.map(el => ({
                preview: el.images.fixed_height_small.url,
                preview_large_mp4: el.images.original.mp4,
                preview_large_webp: el.images.original.webp,
                mp4: el.images.original.mp4,
                webp: el.images.fixed_height_small.webp,
                url: el.images.fixed_height_small.url,
                title: el.title,
                share_url: el.url,
            }))

            this.items = [...this.items, ...items]
            Object.assign(this.paging, res.pagination)
            this.paging.offset = this.paging.offset + this.paging.limit
        },

        submit() {
            this.items = []
            this.paging.offset = 0
            this.fetchGifs()
            this.blurInput()
        },

        loadMore() {
            this.fetchGifs()
        },

        focusInput() {
            this.$refs.searchInput.focus()
        },

        blurInput() {
            this.$refs.searchInput.blur()
        },

        onInputFocus() {
            this.focusSearch = true
        },

        onInputBlur() {
            this.focusSearch = false
        },

        selectItem(index) {
            this.activeItemIdx = index
            this.showPreview = true
        },

        deselectItem() {
            this.activeItemIdx = -1
            this.showPreview = false
        },
    },

    mounted() {
        this.focusInput()
    },
}
</script>

<style>
input:focus {
    outline: none;
    border: 1px solid #e94fb6;
    border-radius: 4px;
}

a {
    color: #ffffff;
    cursor: pointer;
}
a:hover {
    color: #e94fb6;
}

#app {
    height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    background: linear-gradient(to right bottom, #feac5e, #c779d0, #4bc0c8);
}
.layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-width: 720px;
    margin: 0 auto;
}

.input-focus .search-box {
    height: 200px;
}
.input-focus .result {
    height: calc(100% - 200px);
}

.search-box {
    height: 80px;
    width: 100%;
    padding: 0 12px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    transition: height 0.5s;
}
.search-box form {
    width: 100%;
    height: 100%;
    padding: 8px 0;
}
.search-input {
    display: block;
    width: 100%;
    height: 100%;
    background: 0;
    border: 0;
    color: #ffffff;
    font-size: 32px;
    text-align: center;
}
.search-input::placeholder {
    color: #ffffffb4;
}

.result {
    /* grid-row-start: 2; */
    height: calc(100% - 80px);
    overflow-y: auto;
    padding: 0 4px;
    transition: height 0.5s;
}
.result-items {
    display: flex;
    flex-flow: row wrap;
    padding-left: 8px;
    width: 100%;
}
.item {
    flex: auto;
    height: 150px;
    min-width: 50px;
    margin: 0 8px 8px 0; /* Some gutter */
    cursor: pointer;
}
.item picture {
    width: 100%;
    height: 100%;
}
.item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
}
.btn {
    margin: 32px 0;
    padding: 8px 12px;
    border: 2px solid #ffffff;
    border-radius: 6px;
    background: none;
    color: #ffffff;
}
.btn:hover {
    border-color: #e94fb6;
    color: #e94fb6;
    cursor: pointer;
}
.loader {
    text-align: center;
}
</style>
