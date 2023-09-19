<template>
    <v-alert :type="getType" :color="getColor" id="eoeWarning" tile dense dismissible border="left">
        <div v-html="this.getText"></div>
    </v-alert>
</template>
<script>

import {returnAlertInfo} from '../Map/map'

export default {
    name: "eoeWarning",
    data() {
        return{
            getColor: null,
            getText: "",
            getType: ""
        }
    },

   async mounted(){
        const dateEpoch = new Date().getTime();
        const alertInfo = await returnAlertInfo()

        const returnItem = alertInfo.features.find(y => dateEpoch >= y.attributes.ALERT_DATE_BEGIN && dateEpoch <= y.attributes.ALERT_DATE_END)

        this.getText = returnItem.attributes.ALERT
        this.getColor = returnItem.attributes.COLOR
        this.getType = returnItem.attributes.ICON
    }

}
</script>
<style scoped>
    #eoeWarning{
        position: relative;
        width: 36rem;
        left: 36vw;
        bottom:.8rem;
        text-align: left;
        color: white;
    }
</style>