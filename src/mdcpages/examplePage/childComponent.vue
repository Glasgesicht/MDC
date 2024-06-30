<template>
    <div>
        <div v-for="index in new Array(6)">
            <a class="border">this is the inside of a child component</a>
        </div>
    </div>
</template>

<style>
a {
    white-space: break-spaces;
}
</style>