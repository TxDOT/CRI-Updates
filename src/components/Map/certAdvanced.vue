<template><!-- update -->
    <v-card style="position:absolute; left:50%; top: 50%;" width="360" tile>
        <v-card-title>Not Available</v-card-title>
        <v-card-text>You have not been certified to access the advanced page.
        </v-card-text>
        <a :href=emailTag>Request a tutorial</a>
    </v-card>
</template>

<script>

export default {
    name: 'isCertAdvanced',
    data(){
        return{
            emailBody: 'Hey CRI,%0D%0AI want to send an email to setup a schedule to get this out of the way.',
            emailTag: `mailto:TPP_CRI@txdot.gov?subject=Send an email to Jason&body=Hey CRI,%0D%0A%0D%0AI want to send an email to setup a schedule to get this out of the way.`,
        }
    },

}
</script>

<style scoped>
</style>