<template>
    <v-alert type="warning" border="left" color="#c55a11" id="eoeWarning" tile dismissible>
        <b>IMPORTANT:</b> <u>Submit and Certify</u> edits by the August 31 deadline.
    </v-alert>
</template>
<script>
export default {
    name: "eoeWarning",
    data() {
        return{

        }
    },

}
</script>
<style scoped>
    #eoeWarning{
        position: relative;
        width: 30vw;
        left: 39vw;
        bottom:.8rem;
    }
</style>