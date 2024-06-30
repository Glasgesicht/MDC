<template>
    <div class="childGridLayout">
        <div v-for="index in new Array(6)" class="mcd-s-1 mcd-c-1">
            <a class="border">this is the inside of a child component</a>
        </div>
    </div>
</template>

<style scoped>
a {
    white-space: break-spaces;
}

.childGridLayout {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr)
}
</style>