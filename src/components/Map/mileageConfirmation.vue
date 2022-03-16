<template>
    <v-app>
    <v-card>
        <v-row justify="center"> 
        <v-card-text>
            Hello, this will send an email to you
        </v-card-text>
        <v-form
        ref="form"
        >
        <v-text-field
            disabled
            v-model="name"
            :counter="10"
            :rules="nameRules"
            label="Name"
            required
            outlined
        ></v-text-field>

        <v-text-field
            disabled
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
            outlined
        ></v-text-field>
        <v-text-field
            :disabled="!enabled"
            :counter="10"
            :rules="nameRules"
            label="Name"
            required
            outlined
        ></v-text-field>

        <v-text-field
            :disabled="!enabled"
            :rules="emailRules"
            label="E-mail"
            required
            outlined
        ></v-text-field>

        <v-checkbox
            v-model="enabled"
            label="Not a County Judge? Click to add name and email"
        ></v-checkbox>
        <v-btn block outlined >Submit</v-btn>
        </v-form>
    </v-row>
    </v-card>
    </v-app>
  </template>


<script>

export default {
    name:"MileSignConfirmation",
    data: () => ({
        enabled: false,
      name: 'David Prosack',
      email: "dprosack@test.gov",
      valid: true,
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      select: null,
      checkbox: false,
    }),

    methods: {
      validate () {
        this.$refs.form.validate()
      },
      reset () {
        this.$refs.form.reset()
        }
    },
}
</script>