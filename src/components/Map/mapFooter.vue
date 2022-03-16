<template>
    <v-footer class="footer"
    color="primary lighten-1"
  >
    <v-row
      justify="center"
      no-gutters
    >
      <v-btn
        v-for="link in links"
        :key="link"
        color="white"
        text
        rounded
        class="my-2"
      >
        {{ link }}
      </v-btn>
    </v-row>
  </v-footer>
</template>

<script>

export default{
    name: 'mapFooter',
    data: () => ({
      links: [
        'Home',
        'About Us',
        'Team',
        'Services',
        'Blog',
        'Contact Us',
      ],
    }),
}
</script>

<style>
    .footer{
        position: absolute;
        top: 100%;
        height: 5%;
        width: 100%;
        right: 100px
    }
</style>
