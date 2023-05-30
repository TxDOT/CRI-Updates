<!-- Error if county info was not provided. Currrently disabled. If a county does type in the incorrect info, they will be directed to the login page. -->
<template>
  <div class="ErrorPage">
    <h1>Hello! You have not been granted access to this Application. Contact the CRI Admin for access.</h1>

    <p>If you were able to login into the application before, close tab or browser. <br><br>If closing tab or browser did not work, clear browser cache. 
    <br><br>If none of these steps solve the issue, contact CRI admin.</p>

    

  </div>
</template>


<script>
export default {
    name: 'errorPage'
}
</script>
